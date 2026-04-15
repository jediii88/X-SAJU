
// --- X-SAJU DEEP REPORT GENERATOR ENGINE (V4 - REAL DB INTEGRATION) ---

function getDBText(category, key, fallback) {
    if(window.SAJU_DB && window.SAJU_DB[category] && window.SAJU_DB[category][key]) {
        let val = window.SAJU_DB[category][key];
        if(typeof val === 'object') {
            return val.core + " " + val.weapon;
        }
        return val;
    }
    return fallback || "이 시기에는 잠재력을 발휘해야 합니다.";
}

function generateDeepReport(dataInput) {
    let dataArray = Array.isArray(dataInput) ? dataInput : [dataInput];
    let html = '';
    
    dataArray.forEach((data, idx) => {
        html += `<div style="border: 2px solid var(--gold); padding: 20px; margin-bottom: 40px; border-radius: 10px; background: rgba(199, 167, 106, 0.05);">
            <h1 style="text-align: center; color: var(--gold); margin-bottom: 20px;">[ ${data.name} 님의 X-FILE ]</h1>
        </div>`;
        
        html += buildSectionHeader("PART 1. 운명의 해부도 (원국 분석)");
        html += buildChapter1_Basic(data);
        html += buildChapter2_Wuxing(data);
        html += buildChapter3_Sipseong(data);
        
        html += buildSectionHeader("PART 2. 인생의 무대와 성취");
        html += buildChapter4_Wealth(data);
        html += buildChapter5_Career(data);
        html += buildChapter6_Love(data);
        
        html += buildSectionHeader("PART 3. 숨겨진 무기와 취약점");
        html += buildChapter7_Hidden(data);
        html += buildChapter8_Health(data);
        html += buildChapter9_Remedy(data);
        
        if (idx < dataArray.length - 1) {
             html += '<div style="page-break-after: always; height: 100px;"></div>';
        }
    });
    
    if (dataArray.length > 1) {
        html += buildSectionHeader("PART 4. 운명적 시너지 (N:N 기밀 궁합)");
        html += buildSynergySection(dataArray);
    }
    
    html += `<div id="pdf-btn-wrap" style="text-align: center; margin-top: 50px; padding-bottom: 50px; border-top: 1px solid #333; padding-top: 30px;">
        <button class="btn" style="background: var(--gold); color: #000; width: 100%; max-width: 400px; font-size: 18px; font-weight: 800; box-shadow: 0 4px 15px rgba(199, 167, 106, 0.4);" onclick="window.print()">📄 X-FILE 기밀문서 PDF 저장</button>
    </div>`;
    
    document.getElementById('report-container').innerHTML = html;
}

function buildSectionHeader(title) {
    return `<div style="margin: 60px 0 30px 0; padding-bottom: 15px; border-bottom: 2px solid var(--gold);">
            <h2 style="color: var(--gold); font-size: 24px; font-family: 'Noto Serif KR', serif; letter-spacing: 2px;">${title}</h2>
        </div>`;
}

function buildChapter1_Basic(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 1. 당신이라는 소우주의 설계도</h3>
        <p class="ch-text"><b>${dbEntry.title || iljuKey + '의 기운'}</b></p>
        <p class="ch-text">${dbEntry.core || '당신의 본질을 해독하는 중입니다.'}</p>
        <div class="axe-advice"><b>Axe의 통찰:</b> 당신의 일주는 ${iljuKey}입니다. 이는 당신의 삶을 관통하는 가장 핵심적인 코드입니다.</div>
    </div>`;
}

function buildChapter2_Wuxing(data) {
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 2. 오행의 흐름과 에너지 균형</h3>
        <p class="ch-text">당신의 운명을 구성하는 다섯 가지 원소의 분포입니다. 치우침은 곧 욕망이며, 부족함은 곧 삶의 과제가 됩니다.</p>
        <div style="background:#222; padding:15px; border-radius:5px;">
            ${Object.keys(data.wuxing).map(k => `<div>${RELATION_LABELS[k]}: ${data.wuxing[k]}</div>`).join('')}
        </div>
    </div>`;
}

function buildChapter3_Sipseong(data) {
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 3. 사회적 가면과 내면의 욕망 (십성)</h3>
        <p class="ch-text">당신이 세상과 상호작용하는 방식입니다.</p>
    </div>`;
}

function buildChapter4_Wealth(data) {
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 4. 재물운: 부의 그릇과 유통 경로</h3>
        <p class="ch-text">재물은 단순히 돈이 아니라, 당신이 세상에 증명한 가치의 크기입니다.</p>
    </div>`;
}

function buildChapter5_Career(data) { return '<div class="report-chapter"><h3 class="ch-title">Chapter 5. 직업과 사회적 성취</h3></div>'; }
function buildChapter6_Love(data) { 
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 6. 인연: 영혼의 파트너십</h3>
        <p class="ch-text">${dbEntry.love || '당신의 인연법을 해독 중입니다.'}</p>
    </div>`; 
}
function buildChapter7_Hidden(data) { return '<div class="report-chapter"><h3 class="ch-title">Chapter 7. 숨겨진 잠재력 (지장간)</h3></div>'; }
function buildChapter8_Health(data) { return '<div class="report-chapter"><h3 class="ch-title">Chapter 8. 건강과 생체 에너지 균형</h3></div>'; }

function buildChapter9_Remedy(data) {
    let color = "차분한 네이비와 블랙";
    let dir = "북쪽";
    let num = "1, 6";
    let minWuxing = 'wood';
    if(data.wuxing && Object.keys(data.wuxing).length > 0) {
        let sorted = Object.keys(data.wuxing).sort((a,b) => data.wuxing[a] - data.wuxing[b]);
        minWuxing = sorted[0];
    }
    
    if (minWuxing === 'wood') { color = "딥 그린"; dir = "동쪽"; num = "3, 8"; }
    else if (minWuxing === 'fire') { color = "레드"; dir = "남쪽"; num = "2, 7"; }
    else if (minWuxing === 'earth') { color = "옐로우/브라운"; dir = "중앙"; num = "5, 10"; }
    else if (minWuxing === 'metal') { color = "화이트/실버"; dir = "서쪽"; num = "4, 9"; }

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 9. 운명을 비트는 레버리지 (개운법)</h3>
        <ul style="color: #ccc; line-height: 2;">
            <li><b>행운의 컬러:</b> ${color}</li>
            <li><b>운이 뚫리는 방향:</b> ${dir}</li>
            <li><b>재물을 부르는 숫자:</b> ${num}</li>
        </ul>
        <div class="axe-advice">🤝 <b>바이럴 미션:</b> 내 곁의 소중한 사람들의 기밀문서도 함께 확인해보세요.</div>
    </div>`;
}

function buildSynergySection(users) {
    let html = '<div class="report-chapter">';
    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            html += `<div style="margin-bottom: 30px; border-bottom: 1px dashed #444; padding-bottom: 20px;">
                <h4 style="color: var(--gold); margin-bottom: 10px;">🛡️ ${users[i].name} ↔ ${users[j].name} 의 시너지 분석</h4>`;
            
            let u1Min = Object.keys(users[i].wuxing).sort((a,b)=>users[i].wuxing[a]-users[i].wuxing[b])[0];
            let u2Max = Object.keys(users[j].wuxing).sort((a,b)=>users[j].wuxing[b]-users[j].wuxing[a])[0];
            
            if (u1Min === u2Max) {
                html += `<p class="ch-text"><b>최상의 오행 보완:</b> 서로의 부족함을 완벽하게 채워주는 궁합입니다.</p>`;
            } else {
                html += `<p class="ch-text"><b>사회적 협력 구조:</b> 목표 지향적인 만남이 어울리는 구조입니다.</p>`;
            }
            html += `</div>`;
        }
    }
    html += '</div>';
    return html;
}

window.generateDeepReport = generateDeepReport;
