const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
const newDashboardLogic = `function renderDashboard(data) {
    // 1. 헤더 및 기본 정보
    document.getElementById('av-name').innerText = data.name;
    
    let iljuKey = data.dayStem + data.dayBranch;
    let iljuCoreText = window.SAJU_DB && window.SAJU_DB.ILJU && window.SAJU_DB.ILJU[iljuKey] && window.SAJU_DB.ILJU[iljuKey].core ? window.SAJU_DB.ILJU[iljuKey].core : '고유한 에너지를 지닌 존재입니다.';
    let iljuWeaponText = window.SAJU_DB && window.SAJU_DB.ILJU && window.SAJU_DB.ILJU[iljuKey] && window.SAJU_DB.ILJU[iljuKey].weapon ? window.SAJU_DB.ILJU[iljuKey].weapon : '';
    
    let dbgText = \`\${data.name} 님의 사주는 우주의 기운이 8글자로 각인된 정밀한 설계도입니다. 
가장 중심이 되는 당신의 영혼(일간)은 \${data.dayStem}(\${window.HAN_KOR ? window.HAN_KOR[data.dayStem] : ''})이며, \${data.dayBranch}(\${window.HAN_KOR ? window.HAN_KOR[data.dayBranch] : ''})를 깔고 앉아 있습니다.\`;
    
    document.getElementById('av-desc').innerHTML = \`
        <div style="color:var(--gold); font-weight:900; font-size:24px; margin-bottom:10px;">[\${data.dayStem}\${data.dayBranch} \${data.animal}]</div>
        <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:10px; border:1px solid #333; margin:15px auto; max-width:90%; text-align:left;">
            <p style="color:#ddd; font-size:14px; line-height:1.7; margin-top:0;">\${dbgText}</p>
            <p style="color:var(--gold); font-size:14px; line-height:1.7; font-weight:700;">\${iljuCoreText}</p>
            <p style="color:#aaa; font-size:13px; line-height:1.6; margin-bottom:0;">\${iljuWeaponText}</p>
        </div>\`;
    
    // 뱃지 리스트 복구 (건강, 공망, 주요 신살)`;

html = html.replace(/function renderDashboard\(data\) \{[\s\S]*?\/\/ 뱃지 리스트 복구 \(건강, 공망, 주요 신살\)/, newDashboardLogic);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Dashboard updated with core description text.");