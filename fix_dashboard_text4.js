const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const fortuneBlock = `<div id="sec-fortune" class="section">
            <div class="section-title"><div class="title-left"><span>신강 · 신약 및 대운</span><span class="help-icon" onclick="openHelp('strength')">?</span></div></div>
            <div style="background:#0a0a0a; padding:20px; border-left:4px solid #5d8ab9; margin:0 15px 20px 15px; border-radius:4px; text-align:left;">
                <p style="color:#ddd; font-size:13px; line-height:1.7; margin:0;">
                    <b>[대운의 작용 원리]</b><br>
                    대운(大運)은 내 사주팔자(원국)라는 집에 10년마다 불어오는 <b>거대한 계절의 변화(바람)</b>입니다.
                    새로운 10년 대운이 들어올 때 내 원국의 글자들과 어떻게 충돌하고 합쳐지는지에 따라 인생의 큰 줄기가 바뀝니다.
                </p>
            </div>
            <div class="gauge-wrap" id="strength-gauge" style="display:flex; flex-direction:column; align-items:center; padding:20px 0;">`;

html = html.replace(/<div id="sec-fortune" class="section">\s*<div class="section-title"><div class="title-left"><span>신강 · 신약 및 대운<\/span><span class="help-icon" onclick="openHelp\('strength'\)">\?<\/span><\/div><\/div>\s*<div class="gauge-wrap" id="strength-gauge" style="display:flex; flex-direction:column; align-items:center; padding:20px 0;">/g, fortuneBlock);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Added detailed explanatory text for Fortune in Dashboard.");