/**
 * SAJUX 리포트 서버 렌더 — Vercel Serverless Function (헤드리스 Chrome)
 * URL: https://sajux.com/api/render-report  (또는 https://x-saju.vercel.app/api/render-report)
 *
 * 동작: 클라이언트가 자기 리포트 URL(location.href)을 보내면,
 *   서버에서 실제 Chrome으로 그 페이지를 렌더 → 8개 절 그룹 좌표를 page.evaluate로 받아
 *   영역별 스크린샷 → ZIP으로 즉시 반환한다.
 *   서버 Chrome은 iOS 캔버스 한도가 없으므로 8장 그대로, 디자인이 100% 동일하다.
 *
 * 요청:  POST { url, scale?, quality? }  또는  GET ?url=...&scale=2&quality=82 (테스트용)
 * 응답:  200 application/zip  (실패 시 500 JSON)
 */

const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const JSZip = require('jszip');

const ALLOW = /^https?:\/\/([\w.-]*\.)?(sajux\.com|x-saju[\w.-]*\.vercel\.app|jediii88\.github\.io)(\/|$|\?)/i;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function safeJson(s) { try { return JSON.parse(s); } catch (e) { return {}; } }

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  let url, scale, quality;
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
    url = body.url; scale = body.scale; quality = body.quality;
  } else if (req.method === 'GET') {
    url = (req.query && req.query.url) || '';
    scale = req.query && req.query.scale;
    quality = req.query && req.query.quality;
  } else {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!url || !ALLOW.test(url)) {
    return res.status(400).json({ error: 'bad_url', hint: 'sajux.com / x-saju.vercel.app 리포트 URL만 허용됩니다.' });
  }

  const dsf = Math.min(Math.max(parseFloat(scale) || 2, 1), 3);
  const jpegQ = Math.min(Math.max(parseInt(quality, 10) || 82, 40), 95);

  let browser = null;
  const t0 = Date.now();
  try {
    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
      defaultViewport: { width: 430, height: 1400, deviceScaleFactor: dsf },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 50000 });

    // 리포트 JS가 렌더를 끝내고 좌표 계산이 가능해질 때까지 대기
    await page.waitForFunction(function () {
      try {
        var f = window.__sajuxComputeServerSlices;
        if (typeof f !== 'function') return false;
        var r = f();
        return !!(r && r.ok && r.slices && r.slices.length >= 2 && r.totalHeight > 1500);
      } catch (e) { return false; }
    }, { timeout: 40000, polling: 500 });

    // 웹폰트 로드 + 레이아웃 안정 대기
    try {
      await page.evaluate(function () { return (document.fonts && document.fonts.ready) ? document.fonts.ready : null; });
    } catch (e) { /* noop */ }
    await new Promise(function (r) { setTimeout(r, 1200); });

    const data = await page.evaluate(function () { return window.__sajuxComputeServerSlices(); });
    if (!data || !data.ok || !data.slices || !data.slices.length) {
      throw new Error('slice_calc_failed:' + ((data && data.error) || 'unknown'));
    }

    const zip = new JSZip();
    let n = 0;
    for (const s of data.slices) {
      n++;
      const buf = await page.screenshot({
        type: 'jpeg',
        quality: jpegQ,
        clip: { x: Math.max(0, s.x), y: Math.max(0, s.y), width: Math.max(1, s.w), height: Math.max(1, s.h) },
        captureBeyondViewport: true,
      });
      const pad = (n < 10 ? '0' : '') + n;
      const label = String(s.label || ('page' + n)).replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '');
      zip.file(pad + '-' + label + '.jpg', buf);
    }

    const out = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 4 } });
    await browser.close();
    browser = null;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="sajux-report.zip"');
    res.setHeader('X-Sajux-Slices', String(data.slices.length));
    res.setHeader('X-Sajux-Ms', String(Date.now() - t0));
    return res.status(200).send(out);
  } catch (e) {
    if (browser) { try { await browser.close(); } catch (_) { /* noop */ } }
    return res.status(500).json({ error: 'render_failed', detail: String((e && e.message) || e), ms: Date.now() - t0 });
  }
};
