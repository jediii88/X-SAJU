
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
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 11. 향후 10년 세운(歲運) 정밀 타격</h3>
    <p class="ch-text" style="margin-bottom:30px;">대운이 10년의 기후라면, 세운(歲運)은 그해의 날씨입니다. 올해부터 향후 10년간 당신에게 어떤 비바람이 몰아치고 어떤 해가 뜰지 예측합니다. 매년 당신의 사주 원국 8글자가 그해의 기운과 충돌하며 만들어내는 구체적인 서사입니다.</p>`;

    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    
    const sip_list = ["비견(나의 세력 확장)", "겁재(치열한 경쟁과 쟁탈)", "식신(재능 발현과 생산)", "상관(틀을 깨는 혁신)", "편재(큰 돈의 흐름)", "정재(안정적 수익)", "편관(강한 압박과 명예)", "정관(안정된 직장과 승진)", "편인(특수한 자격과 직관)", "정인(문서와 귀인의 도움)"];
    const event_list = ["새로운 귀인과의 합(合)이 들어와 막혔던 일이 풀립니다.", "기존의 환경을 박살내는 충(沖)이 발생하여 이직이나 이사가 필연적입니다.", "스스로 깎고 다듬어야 하는 형(刑)살이 발동하여 법적 문서나 건강을 챙겨야 합니다.", "알 수 없는 오해와 갈등이 생기는 원진(怨嗔)이 작용하니 인간관계에 거리를 두어야 합니다."];

    for(let i=0; i<10; i++) {
        let y = currentYear + i;
        let sb = stems[(2+i)%10] + branches[(6+i)%12];
        
        let sip = sip_list[i % 10];
        let evt = event_list[(i*3) % 4];
        
        html += `
            <div style="margin-bottom: 35px; border-bottom: 1px solid #333; padding-bottom: 25px;">
                <div style="font-weight: 800; color: var(--gold); font-size: 20px; margin-bottom: 12px;">${y}년 (${sb}년) : ${sip}의 해</div>
                
                <p style="color: #eee; font-size: 15px; line-height: 1.8; margin-bottom: 12px;">
                    <b>[사회적 무대와 재물]</b> 올해 천간으로 들어오는 '${stems[(2+i)%10]}'의 기운은 당신에게 <b>${sip}</b>의 작용을 일으킵니다. 이는 사회적으로 당신의 역할이 크게 변동함을 암시합니다. 당신이 그동안 준비해왔던 것들이 세상의 평가를 받게 되며, 재물의 흐름 역시 이 십성의 특성에 따라 요동치게 됩니다.
                </p>
                <p style="color: #ddd; font-size: 15px; line-height: 1.8; margin-bottom: 15px;">
                    <b>[인간관계와 환경 변화]</b> 특히 올해의 지지 '${branches[(6+i)%12]}'는 당신의 원국과 맞물려 강력한 화학작용을 일으킵니다. <b>${evt}</b> 이 시기에는 내 뜻대로 상황을 통제하려 하기보다는, 외부에서 불어오는 변화의 바람에 유연하게 올라타는 것이 유리합니다.
                </p>
                <div style="background: #1a1a1a; padding: 15px; border-radius: 6px; border-left: 3px solid #d32f2f;">
                    <span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🚨 Axe의 행동 지침:</span>
                    <span style="color: #bbb; font-size: 14px; line-height: 1.6;"> ${i%2===0 ? "올해는 투자를 확장하거나 새로운 일을 벌이기보다는, 내실을 다지고 현금을 확보하는 방어적 태세가 당신을 살립니다." : "올해는 당신의 판입니다. 70%의 확신만 섰다면 뒤돌아보지 말고 즉시 실행하십시오. 머뭇거리면 기운을 뺏깁니다."}</span>
                </div>
            </div>
        `;
    }
    html += `</div>`;
    return html;
}

function buildWolunLoop(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 12. ${new Date().getFullYear()}년 12개월 작전 지도</h3>
    <p class="ch-text" style="margin-bottom:25px;">올해 당신이 마주할 12개월의 상세한 기운 파동입니다. 언제 액셀을 밟고 언제 브레이크를 밟아야 할지 정확히 짚어드립니다.</p>
    <div style="display: flex; flex-direction: column; gap: 15px;">`;
    
    const monthThemes = [
        "새로운 프로젝트를 기획하고 씨앗을 뿌리기에 최적의 달입니다. 귀인의 도움이 있습니다.",
        "감정 기복이 심해지고 예상치 못한 지출이 발생합니다. 충동구매와 투자를 절대 피하십시오.",
        "직장이나 소속된 단체에서 능력을 인정받습니다. 다만 과로로 인한 위장장애를 조심해야 합니다.",
        "대인관계에서 꼬임이 발생합니다. 오해가 생기기 쉬우니 중요한 계약이나 서류 서명은 다음 달로 미루십시오.",
        "나의 매력과 재능이 폭발하는 시기입니다. 이성운이 상승하며, 영업이나 발표에서 큰 성과를 냅니다."
    ];

    for(let m=1; m<=12; m++) {
        let theme = monthThemes[m % 5];
        html += `
            <div style="background: #111; padding: 20px; border-radius: 8px; border-left: 4px solid ${m%3===0 ? '#d32f2f' : 'var(--gold)'}; display:flex; flex-direction:column;">
                <div style="color:#fff; font-weight:800; font-size: 18px; margin-bottom: 8px;">${m}월의 기운</div>
                <div style="color:#ddd; font-size:15px; line-height: 1.6; margin-bottom: 8px;">${theme}</div>
                <div style="color:#888; font-size:13px;"><b>Focus:</b> ${m%3===0 ? '리스크 관리 및 건강 체크' : '적극적인 인맥 확장 및 성과 창출'}</div>
            </div>
        `;
    }
    html += `</div></div>`;
    return html;
}
