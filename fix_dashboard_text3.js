const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const relBlock = `<div id="sec-relation" class="section">
            <div class="section-title"><div class="title-left"><span>합 · 충 · 형 · 파 · 해</span><span class="help-icon" onclick="openHelp('relation')">?</span></div></div>
            <div style="background:#0a0a0a; padding:20px; border-left:4px solid #e74c3c; margin:0 15px 20px 15px; border-radius:4px; text-align:left;">
                <p style="color:#ddd; font-size:13px; line-height:1.7; margin:0;">
                    <b>[글자 간의 충돌과 융합 원리]</b><br>
                    사주 8글자는 멈춰있는 글자가 아니라, 서로 자석처럼 끌어당기거나(합) 부딪쳐 깨지는(충) <b>역동적인 파동</b>입니다.<br><br>
                    • <b>합(合)</b>: 기운이 뭉치고 융합하여 새로운 결과물(문서, 사람, 재물)을 만들어냅니다.<br>
                    • <b>충(沖) / 형(刑)</b>: 강력하게 부딪히고 깨지는 기운으로, 이동이나 수술, 변동성을 의미합니다.<br>
                    <span style="color:#aaa;">아래의 관계표는 당신의 원국 내에 내재된 잠재적 파동의 흔적입니다.</span>
                </p>
            </div>
            <div class="rel-grid" id="relation-grid"></div>
        </div>`;

html = html.replace(/<div id="sec-relation" class="section">\s*<div class="section-title"><div class="title-left"><span>합 · 충 · 형 · 파 · 해<\/span><span class="help-icon" onclick="openHelp\('relation'\)">\?<\/span><\/div><\/div>\s*<div class="rel-grid" id="relation-grid"><\/div>\s*<\/div>/g, relBlock);

const gongmangBlock = `<div id="sec-wuxing" class="section">
            <div class="section-title"><div class="title-left"><span>오행 및 십성 에너지</span><span class="help-icon" onclick="openHelp('wuxing')">?</span></div></div>
            <div style="background:#0a0a0a; padding:20px; border-left:4px solid #9b59b6; margin:0 15px 20px 15px; border-radius:4px; text-align:left;">
                <p style="color:#ddd; font-size:13px; line-height:1.7; margin:0;">
                    <b>[오행과 십성의 기전]</b><br>
                    • <b>오행</b>: 목화토금수의 물리적 비중입니다. 너무 많은 기운은 질병과 아집을 낳고, 없는 기운은 평생 갈구하게 되는 결핍(공망)을 낳습니다.<br>
                    • <b>십성</b>: 내 영혼(일간)을 기준으로 나머지 7글자가 어떻게 상호작용하는지를 10가지 역할로 나눈 필터입니다. 
                    <span style="color:#aaa;">(예: 내가 에너지를 쏟아내는 곳이 식상, 내가 통제하는 것이 재성)</span>
                </p>
            </div>
            <div class="bar-group" id="wuxing-bars"></div>
            <div class="bar-group" id="sipseong-bars" style="margin-top:20px;"></div>
        </div>`;

html = html.replace(/<div id="sec-wuxing" class="section">\s*<div class="section-title"><div class="title-left"><span>오행 및 십성 에너지<\/span><span class="help-icon" onclick="openHelp\('wuxing'\)">\?<\/span><\/div><\/div>\s*<div class="bar-group" id="wuxing-bars"><\/div>\s*<div class="bar-group" id="sipseong-bars" style="margin-top:20px;"><\/div>\s*<\/div>/g, gongmangBlock);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Added detailed explanatory text for Relations and Wuxing/Sipseong in Dashboard.");