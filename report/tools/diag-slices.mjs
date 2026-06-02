import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const MIME = { '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json' };
function serve(port){return new Promise(r=>{const s=createServer((req,res)=>{let p=decodeURIComponent((req.url||'/').split('?')[0]);if(p==='/')p='/index.html';const fp=join(ROOT,p.replace(/^\//,''));if(!existsSync(fp)||!statSync(fp).isFile()){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':MIME[extname(fp)]||'application/octet-stream'});res.end(readFileSync(fp));});s.listen(port,'127.0.0.1',()=>r(s));});}

const QS='?n=홍길동&g=male&c=solar&y=1990&mo=3&d=15&h=10&mi=30';
const s = await serve(8801);
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport:{ width:1280, height:900 } });
const p = await ctx.newPage();
await p.goto(`http://127.0.0.1:8801/report/saju.html${QS}`, { waitUntil:'networkidle', timeout:120000 });
await p.waitForFunction(()=>typeof window.sajuxCollectCaptureSlices==='function' && document.getElementById('report-container'),{timeout:60000});
await p.waitForTimeout(2500);

const data = await p.evaluate(()=>{
  const root = sajuxGetCaptureRoot();
  const pack = sajuxCollectCaptureSlices(root);
  const out = pack.slices.map((s,i)=>({i, jul: s.jul, title: s.title, hasImg: !!s.el.querySelector('img'), imgs: Array.from(s.el.querySelectorAll('img')).map(im=>im.src.split('/').pop()) }));
  return out;
});
console.log(JSON.stringify(data,null,2));

// also test cover capture and save image
const png = await p.evaluate(async ()=>{
  await new Promise(r=>sajuxEnsureCaptureLibs(r));
  const root = sajuxGetCaptureRoot();
  const pack = sajuxCollectCaptureSlices(root);
  const host = pack.host; host.innerHTML=''; host.appendChild(pack.slices[0].el);
  await new Promise(r=>setTimeout(r,1500)); // wait for img load
  const t = host.firstChild;
  const c = await html2canvas(t, { backgroundColor:'#050508', scale:1, useCORS:true, allowTaint:true, logging:false, width:t.offsetWidth, height:t.scrollHeight, windowWidth:t.offsetWidth, windowHeight:t.scrollHeight, ignoreElements: sajuxHtml2canvasIgnoreEl, onclone: sajuxOnCaptureClone });
  return c.toDataURL('image/png');
});
const base64 = png.replace(/^data:image\/png;base64,/, '');
writeFileSync('/tmp/cover-slice.png', Buffer.from(base64, 'base64'));
console.log('saved /tmp/cover-slice.png');
await b.close(); s.close();
