import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const MIME = { '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json' };
function serve(port){return new Promise(r=>{const s=createServer((req,res)=>{let p=decodeURIComponent((req.url||'/').split('?')[0]);if(p==='/')p='/index.html';const fp=join(ROOT,p.replace(/^\//,''));if(!existsSync(fp)||!statSync(fp).isFile()){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':MIME[extname(fp)]||'application/octet-stream'});res.end(readFileSync(fp));});s.listen(port,'127.0.0.1',()=>r(s));});}

const QS='?n=홍길동&g=male&c=solar&y=1990&mo=3&d=15&h=10&mi=30';

async function run(label, mobile) {
  const s = await serve(8805 + (mobile ? 1 : 0));
  const b = await chromium.launch({ headless: true });
  const ctxOpts = mobile
    ? { viewport:{ width:390, height:844 }, userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', isMobile:true, hasTouch:true, deviceScaleFactor:3 }
    : { viewport:{ width:1280, height:900 } };
  const ctx = await b.newContext(ctxOpts);
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${8805 + (mobile ? 1 : 0)}/report/saju.html${QS}`, { waitUntil:'networkidle', timeout:120000 });
  await p.waitForFunction(()=>typeof window.sajuxCaptureReportAsImage==='function' && document.getElementById('report-container'),{timeout:60000});
  await p.waitForTimeout(1500);

  const pre = await p.evaluate(()=>{
    const root = sajuxGetCaptureRoot();
    const pack = sajuxCollectCaptureSlices(root);
    const scales = pack.slices.slice(0,5).map((sl,i)=>{
      const host = pack.host; host.innerHTML=''; host.appendChild(sl.el);
      const t = host.firstChild;
      return { i, jul: sl.jul, h: Math.max(t.offsetHeight,t.scrollHeight), scale: sajuxCalcSliceCaptureScale(t), px: Math.max(t.offsetWidth,t.scrollWidth)*sajuxCalcSliceCaptureScale(t)*Math.max(t.offsetHeight,t.scrollHeight)*sajuxCalcSliceCaptureScale(t) };
    });
    return { slices: pack.slices.length, mobile: sajuxIsMobileCapture(), scales };
  });

  const start = Date.now();
  await p.evaluate(()=>sajuxCaptureReportAsImage());
  let done = false;
  while (Date.now()-start < 300000) {
    const st = await p.evaluate(()=>({
      busy: !!window._sajuxCaptureBusy,
      label: document.getElementById('sajux-cap-progress-label')?.textContent || '',
      ov: document.querySelector('#sajux-capture-overlay .sajux-capture-overlay-inner')?.textContent?.slice(0,80) || ''
    }));
    if (st.ov.includes('ZIP 준비 완료')) { done = true; break; }
    await p.waitForTimeout(500);
  }
  const ms = Date.now()-start;
  await b.close(); s.close();
  return { label, ms, sec: (ms/1000).toFixed(1), pre, done };
}

const desktop = await run('DESKTOP', false);
const mobile = await run('MOBILE-iPhone', true);
console.log(JSON.stringify({ desktop, mobile }, null, 2));
