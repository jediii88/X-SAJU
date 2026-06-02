import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json',
};

function startStaticServer(rootDir, port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let p = decodeURIComponent((req.url || '/').split('?')[0]);
      if (p === '/') p = '/index.html';
      const fp = join(rootDir, p.replace(/^\//, ''));
      if (!existsSync(fp) || !statSync(fp).isFile()) { res.writeHead(404); res.end('404'); return; }
      res.writeHead(200, { 'Content-Type': MIME[extname(fp)] || 'application/octet-stream' });
      res.end(readFileSync(fp));
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

const SAJU_QS = '?n=홍길동&g=male&c=solar&y=1990&mo=3&d=15&h=10&mi=30';
const PORT = 8799;
const server = await startStaticServer(ROOT, PORT);

async function run(label, urlPath, qs, mobile) {
  const browser = await chromium.launch({ headless: true });
  const ctxOpts = mobile
    ? { viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', isMobile: true, hasTouch: true, deviceScaleFactor: 3, acceptDownloads: true }
    : { viewport: { width: 1280, height: 900 }, acceptDownloads: true };
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { const t = m.text(); if (/sajux|capture|slice|error|fail|zip|html2/i.test(t)) logs.push(`[${m.type()}] ${t}`); });
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
  const dialogs = [];
  page.on('dialog', async (d) => { dialogs.push(d.message()); await d.accept(); });

  let downloaded = null;
  page.on('download', (d) => { downloaded = d.suggestedFilename(); });

  await page.goto(`http://127.0.0.1:${PORT}${urlPath}${qs}`, { waitUntil: 'networkidle', timeout: 120000 });
  // wait for report to render
  await page.waitForFunction(() => {
    return typeof window.sajuxCaptureReportAsImage === 'function'
      && (document.getElementById('report-container') || document.getElementById('main-content'));
  }, { timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(2500);

  const pre = await page.evaluate(() => {
    const root = (typeof sajuxGetCaptureRoot === 'function') ? sajuxGetCaptureRoot() : null;
    let sliceCount = -1;
    try { sliceCount = sajuxCollectCaptureSlices(root).slices.length; } catch (e) { sliceCount = 'ERR:' + e.message; }
    return {
      hasFn: typeof window.sajuxCaptureReportAsImage,
      rootId: root?.id || null,
      rootH: root?.offsetHeight || 0,
      sliceCount,
      h2c: typeof html2canvas,
      jszip: typeof JSZip,
    };
  });

  // run full capture
  await page.evaluate(() => { window.__diagDone = false; });
  await page.evaluate(() => sajuxCaptureReportAsImage());
  // poll until busy clears or timeout
  const t0 = Date.now();
  let busy = true;
  while (Date.now() - t0 < 90000) {
    busy = await page.evaluate(() => !!window._sajuxCaptureBusy);
    const overlay = await page.evaluate(() => {
      const el = document.getElementById('sajux-capture-overlay');
      return { visible: el ? (el.style.display !== 'none') : false, gauge: !!document.getElementById('sajux-cap-gauge-fill'), label: document.getElementById('sajux-cap-progress-label')?.textContent || '' };
    });
    if (!busy && !overlay.visible) break;
    await page.waitForTimeout(1000);
  }
  const post = await page.evaluate(() => ({
    busy: !!window._sajuxCaptureBusy,
    overlayText: document.querySelector('#sajux-capture-overlay .sajux-capture-overlay-inner')?.textContent?.slice(0, 120) || '',
    overlayVisible: document.getElementById('sajux-capture-overlay')?.style.display !== 'none',
  }));

  // verify height no longer truncated
  const heightCheck = await page.evaluate(async () => {
    const root = sajuxGetCaptureRoot();
    const pack = sajuxCollectCaptureSlices(root);
    const host = pack.host; host.innerHTML = '';
    // pick a tall slice
    let tall = pack.slices[0], best = 0;
    for (const s of pack.slices) {
      host.innerHTML = ''; host.appendChild(s.el.cloneNode(true));
      const h = host.firstChild.scrollHeight;
      if (h > best) { best = h; tall = s; }
    }
    host.innerHTML = ''; host.appendChild(tall.el.cloneNode(true));
    const t = host.firstChild;
    const fullH = Math.max(t.offsetHeight, t.scrollHeight, 1);
    const fullW = Math.max(t.offsetWidth, t.scrollWidth, 320);
    const c = await html2canvas(t, { backgroundColor:'#050508', scale:1, useCORS:true, allowTaint:true, logging:false, width:fullW, height:fullH, windowWidth:fullW, windowHeight:fullH, scrollX:0, scrollY:0, x:0, y:0, ignoreElements: sajuxHtml2canvasIgnoreEl, onclone: sajuxOnCaptureClone });
    return { targetH: fullH, canvasH: c.height, ratio: (c.height / fullH).toFixed(2) };
  });

  post.heightCheck = heightCheck;

  await browser.close();
  return { label, pre, post, dialogs, downloaded, logs: logs.slice(-12) };
}

const desktop = await run('SAJU-DESKTOP', '/report/saju.html', SAJU_QS, false);
console.log('\n===== ' + desktop.label + ' =====');
console.log(JSON.stringify(desktop, null, 2));

const mobile = await run('SAJU-MOBILE', '/report/saju.html', SAJU_QS, true);
console.log('\n===== ' + mobile.label + ' =====');
console.log(JSON.stringify(mobile, null, 2));

server.close();
