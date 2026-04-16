const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const infoBlock = `<div id="sec-manse" class="section">
            <div class="section-title"><div class="title-left"><span>사주 원국 (팔자)</span><span class="help-icon" onclick="openHelp('manse')">?</span></div></div>
            
            <div style="background:#0a0a0a; padding:20px; border-left:4px solid var(--gold); margin:0 15px 20px 15px; border-radius:4px; text-align:left;">
                <p style="color:#ddd; font-size:13px; line-height:1.7; margin:0;">
                    <b>[원국 8글자의 논리적 해부]</b><br>
                    • <b>년주(조상/초년)</b>: 당신이 태어난 해의 기운으로 사회적 배경과 유전적 뿌리를 의미합니다.<br>
                    • <b>월주(환경/직업)</b>: 당신이 태어난 달의 계절적 에너지로, 당신의 직업과 사회적 무기를 결정하는 가장 핵심적인 기둥입니다.<br>
                    • <b>일주(본질/안방)</b>: 나침반의 중심축입니다. 일간(위)은 <b>영혼의 본체</b>이며, 일지(아래)는 <b>가장 내밀한 성향이자 배우자</b>의 자리입니다.<br>
                    • <b>시주(말년/무기)</b>: 태어난 시간으로, 노후의 모습이자 은밀하게 감춰둔 당신만의 비밀 무기입니다.<br><br>
                    <span style="color:var(--gold);">가장 중심축인 일간(日干)을 기준으로 나머지 7개의 글자가 오행의 생극제화(生剋制化) 원리에 따라 밀고 당기면서 당신의 십성(운영체제)이 만들어집니다.</span>
                </p>
            </div>
            <div class="manse-table" id="manse-table"></div>
        </div>`;

html = html.replace(/<div id="sec-manse" class="section">\s*<div class="section-title"><div class="title-left"><span>사주 원국 \(팔자\)<\/span><span class="help-icon" onclick="openHelp\('manse'\)">\?<\/span><\/div><\/div>\s*<div class="manse-table" id="manse-table"><\/div>\s*<\/div>/g, infoBlock);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Added detailed explanatory text directly to Step 2 Dashboard manse grid area.");