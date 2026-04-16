const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // X-SAJU_MASTER.html 경로 로드
  await page.goto('file://' + __dirname + '/X-SAJU_MASTER.html');
  
  // 화면 캡쳐를 위해 기다림
  await new Promise(r => setTimeout(r, 1000));
  
  // body 크기 확인
  const bodySize = await page.evaluate(() => {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    };
  });
  
  console.log("Body Size: ", bodySize);
  
  const isDisplayNone = await page.evaluate(() => {
    return {
      step1: window.getComputedStyle(document.getElementById('step-1')).display,
      step2: window.getComputedStyle(document.getElementById('step-2')).display,
      step3: window.getComputedStyle(document.getElementById('step-3')).display,
    };
  });
  console.log("Display state: ", isDisplayNone);
  
  await browser.close();
})();