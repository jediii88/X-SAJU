import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const MIME = { '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json' };
function serve(port){return new Promise(r=>{const s=createServer((req,res)=>{let p=decodeURIComponent((req.url||'/').split('?')[0]);if(p==='/')p='/index.html';const fp=join(ROOT,p.replace(/^\//,''));if(!existsSync(fp)||!statSync(fp).isFile()){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':MIME[extname(fp)]||'application/octet-stream'});res.end(readFileSync(fp));});s.listen(port,'127.0.0.1',()=>r(s));});}
const QS='?n=홍길동&g=male&c=solar&y=1990&mo=3&d=15&h=10&mi=30';
const s = await serve(8803);
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport:{ width:1280, height:900 } });
const p = await ctx.newPage();
await p.goto(`http://127.0.0.1:8803/report/saju.html${QS}`, { waitUntil:'networkidle', timeout:120000 });
await p.waitForFunction(()=>document.getElementById('report-container') && typeof window.sajuxCollectCaptureSlices==='function',{timeout:60000});
await p.waitForTimeout(2500);

const data = await p.evaluate(()=>{
  const root = sajuxGetCaptureRoot();
  const pack = sajuxCollectCaptureSlices(root);
  return pack.slices.map((s,i)=>({i, jul: s.jul, title: s.title, hasBanner: !!s.el.querySelector('.sajux-capture-part-banner'), bannerHead: s.el.querySelector('.sajux-part-head')?.textContent || null }));
});
console.log('SLICES:', JSON.stringify(data,null,2));

// Capture cover + 1-1 + 2-1 + 3-1
async function snap(sliceIdx, file) {
  return await p.evaluate(async (idx)=>{
    await new Promise(r=>sajuxEnsureCaptureLibs(r));
    const root = sajuxGetCaptureRoot();
    const pack = sajuxCollectCaptureSlices(root);
    const host = pack.host; host.innerHTML=''; host.appendChild(pack.slices[idx].el);
    await sajuxWaitImagesInRoot(host, 3000);
    await new Promise(r=>setTimeout(r,400));
    const t = host.firstChild;
    const w = Math.max(t.offsetWidth, t.scrollWidth, 320);
    const h = Math.max(t.offsetHeight, t.scrollHeight, 1);
    const c = await html2canvas(t, { backgroundColor:'#050508', scale:1, useCORS:true, allowTaint:true, logging:false, width:w, height:h, windowWidth:w, windowHeight:h, scrollX:0, scrollY:0, x:0, y:0, ignoreElements: sajuxHtml2canvasIgnoreEl, onclone: sajuxOnCaptureClone });
    return c.toDataURL('image/png');
  }, sliceIdx);
}

const targets = [
  [0, '/tmp/cover-NEW.png'],
  [data.findIndex(d=>d.jul==='1-1'), '/tmp/part1-NEW.png'],
  [data.findIndex(d=>d.jul==='2-1'), '/tmp/part2-NEW.png'],
];
for (const [idx, file] of targets) {
  if (idx<0) continue;
  const dataUrl = await snap(idx);
  writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('saved', file, 'slice', idx);
}

await b.close(); s.close();
