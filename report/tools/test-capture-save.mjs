/**
 * 사주 저장(이미지/ZIP) 흐름 시뮬레이션 — PC·모바일 뷰포트
 * node report/tools/test-capture-save.mjs
 */
import { chromium, devices } from 'playwright';
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

function startStaticServer(rootDir, port = 8765) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let p = decodeURIComponent((req.url || '/').split('?')[0]);
      if (p === '/') p = '/couple/index.html';
      const fp = join(rootDir, p.replace(/^\//, ''));
      if (!existsSync(fp) || !statSync(fp).isFile()) {
        res.writeHead(404);
        res.end('404');
        return;
      }
      const ext = extname(fp);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(readFileSync(fp));
    });
    server.listen(port, '127.0.0.1', () => resolve({ server, port }));
  });
}

const COUPLE_QS =
  '?a_n=장경현&a_g=m&a_c=solar&a_y=1990&a_mo=3&a_d=15&a_h=10' +
  '&b_n=심나영&b_g=w&b_c=solar&b_y=1992&b_mo=7&b_d=22&b_h=14&rel=lover';

async function runScenario(label, contextOpts) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true,
    ...contextOpts,
  });
  const page = await context.newPage();
  const logs = [];
  page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

  const url = `http://127.0.0.1:8765/couple/index.html${COUPLE_QS}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });

  await page.waitForFunction(
    () => document.getElementById('main-content')?.style.display !== 'none',
    { timeout: 90000 }
  );
  await page.waitForFunction(
    () => typeof window.sajuxCaptureReportAsImage === 'function',
    { timeout: 30000 }
  );

  const pre = await page.evaluate(() => {
    const root = document.getElementById('main-content');
    const pack = window.__testPack || null;
    return {
      rootH: root?.offsetHeight || 0,
      hasFn: typeof sajuxCaptureReportAsImage === 'function',
      isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth <= 900,
      innerW: window.innerWidth,
    };
  });

  // slice 수 미리 확인
  const sliceInfo = await page.evaluate(() => {
    const root = document.getElementById('main-content');
    if (typeof sajuxCollectCaptureSlices !== 'function') return { error: 'no collector' };
    const pack = sajuxCollectCaptureSlices(root);
    return {
      sliceCount: pack.slices?.length || 0,
      titles: (pack.slices || []).slice(0, 5).map((s) => s.title),
    };
  });

  let download = null;
  const downloadPromise = page.waitForEvent('download', { timeout: 180000 }).catch(() => null);

  await page.evaluate(() => sajuxCaptureReportAsImage());

  // overlay / share UI 대기
  await page.waitForTimeout(3000);

  // 모바일 share UI면 ZIP 버튼 클릭
  const zipBtn = page.locator('button:has-text("ZIP")').first();
  if (await zipBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    const dl2 = page.waitForEvent('download', { timeout: 180000 }).catch(() => null);
    await zipBtn.click();
    download = await dl2;
  } else {
    download = await downloadPromise;
  }

  // overlay 완료 대기 (최대 3분)
  const t0 = Date.now();
  while (Date.now() - t0 < 180000) {
    const busy = await page.evaluate(() => !!window._sajuxCaptureBusy);
    const overlay = await page.locator('#sajux-capture-overlay').isVisible().catch(() => false);
    if (!busy && !overlay) break;
    await page.waitForTimeout(2000);
  }

  const post = await page.evaluate(() => ({
    busy: !!window._sajuxCaptureBusy,
    overlayText: document.querySelector('#sajux-capture-overlay .sajux-capture-overlay-inner')?.textContent?.slice(0, 200) || '',
  }));

  let dlInfo = null;
  if (download) {
    dlInfo = {
      suggested: download.suggestedFilename(),
      path: await download.path(),
    };
  }

  await browser.close();

  return { label, pre, sliceInfo, post, dlInfo, logs: logs.filter((l) => /sajux|capture|error/i.test(l)).slice(-8) };
}

const { server, port } = await startStaticServer(ROOT, 8765);
console.log('Static server on', port);

try {
  const desktop = await runScenario('desktop-chrome', {
    viewport: { width: 1280, height: 900 },
    userAgent: devices['Desktop Chrome'].userAgent,
  });
  const mobile = await runScenario('mobile-iphone', {
    ...devices['iPhone 13'],
  });

  console.log('\n=== DESKTOP ===');
  console.log(JSON.stringify(desktop, null, 2));
  console.log('\n=== MOBILE ===');
  console.log(JSON.stringify(mobile, null, 2));
} finally {
  server.close();
}
