const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const updatedRender = `
function renderDashboard(data) {
    document.getElementById('av-name').innerText = data.name + "님";
    const elType = HAN_COLOR[data.dayStem];
    document.getElementById('av-circle').className = 'avatar-circle ' + elType;
    document.getElementById('av-desc').innerText = \`\${data.dayStem}(\${HAN_KOR[data.dayStem]})\${data.dayBranch}(\${HAN_KOR[data.dayBranch]}) \${COLOR_KR_MAP[elType]} 생명체\`;

    // Shinsal Badges
    let badgeHtml = '';
    const allS = data.allShinsal || {};
    const flatShinsal = [...new Set(Object.values(allS).flat())].filter(Boolean);
    flatShinsal.forEach(s => { badgeHtml += \`<div class="badge">\${s}</div>\`; });
    document.getElementById('av-badges').innerHTML = badgeHtml;
    
    // User Switcher (N인)
    let switcher = '';
    if (window.globalSajuDataArray.length > 1) {
        switcher = \`<div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px; flex-wrap:wrap;">\`;
        window.globalSajuDataArray.forEach((u, i) => {
            const isActive = u.name === data.name;
            switcher += \`<button class="btn subtle" style="padding:8px 15px; font-size:12px; border-radius:15px; \${isActive ? 'background:var(--gold); color:#000; border-color:var(--gold); font-weight:700;' : 'border:1px solid #333;'}" onclick="renderDashboard(window.globalSajuDataArray[\${i}])">\${u.name}</button>\`;
        });
        switcher += \`</div>\`;
    }
    const avHeader = document.querySelector('.avatar-header');
    const existingSw = document.getElementById('user-switcher');
    if (existingSw) existingSw.remove();
    if (switcher) {
        const swDiv = document.createElement('div');
        swDiv.id = 'user-switcher';
        swDiv.innerHTML = switcher;
        avHeader.insertBefore(swDiv, document.getElementById('av-circle'));
    }
    
    // 1. Manse Table (확장: 지장간 추가)
    const labels = ['십성','천간','지지','지장간','십성','12운성'];
    const rows = [
        data.pillars.map(p => p.n === '일주' ? '일원' : getSipseong(data.dayStem, p.h[0])),
        data.pillars.map(p => p.h[0]),
        data.pillars.map(p => p.h[1]),
        data.pillars.map(p => (BRANCH_HIDDEN[p.h[1]] || []).join(',')),
        data.pillars.map(p => getSipseong(data.dayStem, p.h[1])),
        data.pillars.map(p => UNSUNG_MAP[data.dayStem]?.[p.h[1]] || '-')
    ];
    let mHtml = '<div class="manse-row"><div class="manse-label"></div><div class="manse-head">시</div><div class="manse-head">일</div><div class="manse-head">월</div><div class="manse-head">년</div></div>';
    labels.forEach((l, i) => {
        mHtml += \`<div class="manse-row"><div class="manse-cell manse-label">\${l}</div>\`;
        rows[i].forEach(val => {
            const cls = HAN_COLOR[val] || HAN_COLOR[val[0]] || '';
            let displayVal = val;
            if (i === 1 || i === 2) displayVal = \`\${val}<br><span style="font-size:12px; opacity:0.8;">(\${HAN_KOR[val]})</span>\`;
            if (i === 3) displayVal = val.split(',').map(v => \`<span class="\${HAN_COLOR[v]}">\${v}</span>\`).join(' ');
            mHtml += \`<div class="manse-cell \${cls}" style="font-size:\${(i===1||i===2)?'24px':(i===3?'11px':'12px')}">\${displayVal}</div>\`;
        });
        mHtml += \`</div>\`;
    });
    document.getElementById('manse-table').innerHTML = mHtml;

    // 2. Relation Grid 복구
    const relGrid = document.getElementById('relation-grid');
    const relLines = buildRelationLines(data.pillars);
    relGrid.innerHTML = relLines.map(item => {
        if(item.type === '없음') return '<div style="grid-column:1/-1; color:#555; font-size:12px; text-align:center; padding:20px;">특이 관계 없음</div>';
        let nodesHtml = item.chars.map(c => \`<div class="rel-char \${HAN_COLOR[c]}">\${c}<span style="font-size:9px; position:absolute; bottom:-12px; color:#aaa;">(\${HAN_KOR[c]})</span></div>\`).join('<div class="rel-link"></div>');
        return \`<div class="rel-card"><div class="rel-nodes" style="margin-bottom:15px;">\${nodesHtml}</div><div class="rel-badge">\${item.label}</div></div>\`;
    }).join('');

    // 3. Wuxing & Sipseong Bars 복구
    let wHtml = '';
    const totalW = Object.values(data.wuxing).reduce((a,b)=>a+b,0);
    WUXING_ORDER.forEach(k => {
        const per = Math.round((data.wuxing[k]/totalW)*100);
        wHtml += \`<div class="bar-row"><div class="bar-label">\${RELATION_LABELS[k]}</div><div class="bar-bg"><div class="bar-fill bg-\${k}" style="width:\${per}%"></div></div><div class="bar-val">\${per}%</div></div>\`;
    });
    document.getElementById('wuxing-bars').innerHTML = wHtml;

    let sHtml = '<div style="font-size:13px; color:#888; margin-bottom:10px;">십성 에너지 분포</div>';
    const sipKeys = ['비겁','식상','재성','관성','인성'];
    const sipTotal = Object.values(data.sipseong).reduce((a,b)=>a+b,0) || 1;
    sipKeys.forEach(k => {
        let val = 0;
        if(k==='비겁') val = (data.sipseong['비견']||0) + (data.sipseong['겁재']||0);
        if(k==='식상') val = (data.sipseong['식신']||0) + (data.sipseong['상관']||0);
        if(k==='재성') val = (data.sipseong['편재']||0) + (data.sipseong['정재']||0);
        if(k==='관성') val = (data.sipseong['편관']||0) + (data.sipseong['정관']||0);
        if(k==='인성') val = (data.sipseong['편인']||0) + (data.sipseong['정인']||0);
        const per = Math.round((val/sipTotal)*100);
        sHtml += \`<div class="bar-row"><div class="bar-label">\${k}</div><div class="bar-bg"><div class="bar-fill" style="width:\${per}%; background:#555;"></div></div><div class="bar-val">\${per}%</div></div>\`;
    });
    document.getElementById('sipseong-bars').innerHTML = sHtml;

    // 4. Strength Gauge 복구
    const ratio = data.strengthRatio;
    document.getElementById('gauge-path').style.strokeDashoffset = 251 - (ratio * 2.51);
    document.getElementById('gauge-needle').style.transform = \`rotate(\${(ratio * 1.8) - 90}deg)\`;
    document.getElementById('strength-text').innerText = \`\${data.strengthText} (\${Math.round(ratio)})\`;

    // 5. Daewun Table 복구 (실제 데이터 연동)
    let dHtml = '<div class="fortune-scroll">';
    if (data.daewunList) {
        data.daewunList.forEach(dy => {
            dHtml += \`<div class="f-card">
                <div class="f-head">\${dy.age}세</div>
                <div class="f-hz">\${dy.gan}\${dy.zi}</div>
                <div class="f-sip">\${dy.sip}</div>
            </div>\`;
        });
    }
    dHtml += '</div>';
    document.getElementById('daeun-table').innerHTML = dHtml;
}
`;

const startR = 'function renderDashboard(data) {';
const endR = 'function startReport() {';
const idxS = html.indexOf(startR);
const idxE = html.indexOf(endR);
html = html.slice(0, idxS) + updatedRender + '\n' + html.slice(idxE);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log('Dashboard content successfully restored to full density.');
`

fs.writeFileSync('restore_dashboard_v5.js', updatedRender); // Save for reference if needed
// Actually, I'll just run it via node -e or similar.
