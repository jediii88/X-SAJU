
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

function generateDeepReport(data) {
    if(!data.dayStem) return;
    
    let html = '';
    html += buildSectionHeader("PART 1. 운명의 해부도 (원국 분석)");
    html += buildChapter_Basic(data);
    html += buildChapter_Wuxing(data);
    html += buildChapter_Sipseong(data);
    
    html += buildSectionHeader("PART 2. 인생의 무대와 성취");
    html += buildChapter_Wealth(data);
    html += buildChapter_Career(data);
    html += buildChapter_Love(data);
    
    html += buildSectionHeader("PART 3. 숨겨진 무기와 취약점");
    html += buildChapter_Hidden(data); // 지장간
    html += buildChapter_Health(data);
    html += buildChapter_Remedy(data);
    
    html += buildSectionHeader("PART 4. 시간의 지배자 (대운과 세운)");
    html += buildDaewunLoop(data);
    html += buildSewunLoop(data);
    html += buildWolunLoop(data);
    
    document.getElementById('report-container').innerHTML = html;
}

function buildSectionHeader(title) {
    return `<div style="margin: 60px 0 30px 0; padding-bottom: 15px; border-bottom: 2px solid var(--gold);">
            <h2 style="color: var(--gold); font-size: 24px; font-family: 'Noto Serif KR', serif; letter-spacing: 2px;">${title}</h2>
        </div>`;
}

function buildChapter_Basic(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let iljuText = getDBText('ILJU', iljuKey, "당신은 거대한 대지의 기운을 품고 있습니다.");
    
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 1. 나의 본질과 영혼의 그릇</h3>
            <p class="ch-text">${iljuText}</p>
            <p class="ch-text">당신의 에너지는 <b>${data.strengthText}</b> 상태입니다. 이는 당신이 단순히 머무르는 존재가 아니라, 끊임없이 환경과 충돌하며 자신만의 영역을 개척해야 함을 의미합니다.</p>
        </div>
    `;
}

function buildChapter_Wuxing(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 2. 오행의 세력과 나의 무기</h3>`;
    if(data.wuxing) {
        let maxWuxing = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] > data.wuxing[b] ? a : b);
        let excessText = getDBText('WUXING_EXCESS', maxWuxing, "오행의 기운이 한쪽으로 몰려 있습니다.");
        html += `<p class="ch-text">가장 강한 기운(${maxWuxing}): ${excessText}</p>`;
    }
    html += `</div>`;
    return html;
}

function buildChapter_Sipseong(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 3. 사회적 가면과 내면의 욕망 (십성)</h3>`;
    let mainSip = "정재";
    if(data.sipseong && Object.keys(data.sipseong).length > 0) {
        mainSip = Object.keys(data.sipseong).reduce((a, b) => data.sipseong[a] > data.sipseong[b] ? a : b) || "정재";
    }
    let sipText = getDBText('SIPSEONG', mainSip, "사회의 규칙에 순응하기보다 주도적으로 판을 짜는 기질입니다.");
    html += `<p class="ch-text">가장 발달한 십성(${mainSip}): ${sipText}</p></div>`;
    return html;
}

function buildChapter_Wealth(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 4. 평생 재물운과 축적의 기술</h3>
            <p class="ch-text">당신의 재물운은 매우 역동적입니다. 눈앞의 현금보다는 시스템과 사람을 통해 부를 증식하는 구조입니다.</p>
            <div class="axe-advice"><b>👉 재물 증식 전략:</b> 투기성 자본보다는 당신의 전문성을 담보로 한 시스템 수익을 노려야 합니다.</div>
        </div>
    `;
}

function buildChapter_Career(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 5. 최적의 직업과 사회적 성취</h3>
            <p class="ch-text">누군가의 밑에서 부품처럼 쓰이는 것을 견디지 못합니다. 당신만의 권한이 완벽히 주어지는 독립적인 무대에서 10배의 퍼포먼스를 냅니다.</p>
        </div>
    `;
}

function buildChapter_Love(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let loveText = window.SAJU_DB?.ILJU?.[iljuKey]?.love || "당신의 템포를 이해하고 묵묵히 지지해주는 사람이 필요합니다.";
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 6. 이성운과 나에게 맞는 배우자상</h3>
            <p class="ch-text">${loveText}</p>
        </div>
    `;
}

function buildChapter_Hidden(data) {
    let branch = data.dayBranch;
    let hiddenText = getDBText('HIDDEN', branch, "보이지 않는 무의식적 잠재력이 매우 강합니다.");
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 7. 지장간에 숨겨진 은밀한 무기</h3>
            <p class="ch-text">${hiddenText}</p>
        </div>
    `;
}

function buildChapter_Health(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 8. 신체 취약점과 건강 관리</h3>
            <p class="ch-text">심리적 압박감이 곧바로 신체의 병으로 이어지는 구조입니다. 과부하가 걸리기 전에 전원을 끄는 연습이 필요합니다.</p>
        </div>
    `;
}

function buildChapter_Remedy(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 9. 운명을 바꾸는 행동 지침 (개운법)</h3>
            <ul style="color: #ccc; line-height: 2; font-size: 15px;">
                <li><b>행운의 마인드:</b> 타인의 평가에 휘둘리지 말고 오직 자신의 성취에 집중하십시오.</li>
                <li><b>액션 플랜:</b> 결정을 미루는 습관이 가장 큰 리스크입니다. 70%의 확신이 서면 즉시 실행하십시오.</li>
            </ul>
        </div>
    `;
}

function buildDaewunLoop(data) {
    let daewuns = [];
    let startAge = 4;
    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    
    for(let i=0; i<8; i++) {
        let dwName = stems[(i+3)%10] + branches[(i+5)%12];
        daewuns.push({ age: startAge + (i * 10), name: dwName });
    }

    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 10. 대운(大運) 80년 심층 해부</h3><div class="timeline">`;

    daewuns.forEach((dw, idx) => {
        let eventText = window.SAJU_DB?.DAEWUN_EVENTS ? window.SAJU_DB.DAEWUN_EVENTS[idx % 60] : "거대한 환경의 변화가 찾아오는 시기입니다.";
        html += `
            <div class="timeline-item" style="margin-bottom: 25px; padding: 20px; background: #151515; border-left: 4px solid var(--gold); border-radius: 4px;">
                <h4 style="color: var(--gold); margin-bottom: 12px; font-size: 18px;">${dw.age}세 ~ ${dw.age+9}세 : [${dw.name} 대운]</h4>
                <p style="color: #ccc; font-size: 15px; line-height: 1.7;">${eventText}</p>
            </div>
        `;
    });
    html += `</div></div>`;
    return html;
}

function buildSewunLoop(data) {
    let currentYear = new Date().getFullYear();
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 11. 향후 10년 세운(歲運) 정밀 타격</h3>`;

    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    
    for(let i=0; i<10; i++) {
        let y = currentYear + i;
        let sb = stems[(2+i)%10] + branches[(6+i)%12]; // 2026 병오년 기준
        
        let interactionText = "";
        // Simple mock interaction for the sake of dynamic generation
        if (i % 3 === 0) interactionText = window.SAJU_DB?.INTERACTION?.['합'] || "결합과 성장의 기운이 강합니다.";
        else if (i % 4 === 0) interactionText = window.SAJU_DB?.INTERACTION?.['충'] || "충돌과 변화가 발생합니다.";
        else interactionText = "안정적으로 내실을 다져야 하는 한 해입니다.";

        html += `
            <div style="margin-bottom: 20px; border-bottom: 1px dashed #333; padding-bottom: 20px;">
                <div style="font-weight: bold; color: #fff; font-size: 17px; margin-bottom: 8px;">${y}년 (${sb}년)</div>
                <p style="color: #ccc; font-size: 15px; line-height: 1.7;">${interactionText}</p>
            </div>
        `;
    }
    html += `</div>`;
    return html;
}

function buildWolunLoop(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 12. ${new Date().getFullYear()}년 12개월 작전 지도</h3><div style="display: flex; flex-direction: column; gap: 10px;">`;
    for(let m=1; m<=12; m++) {
        let text = m % 2 === 0 ? "현상 유지 및 리스크 관리" : "적극적인 행동 및 기회 창출";
        html += `
            <div style="background: #111; padding: 15px; border-radius: 4px; border-left: 2px solid var(--gold);">
                <div style="color:#fff; font-weight:bold; margin-bottom: 5px;">${m}월의 기운</div>
                <div style="color:#aaa; font-size:14px;">${text}</div>
            </div>
        `;
    }
    html += `</div></div>`;
    return html;
}
