
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
    html += buildChapter1_Basic(data);
    html += buildChapter2_Wuxing(data);
    html += buildChapter3_Sipseong(data);
    
    html += buildSectionHeader("PART 2. 인생의 무대와 성취");
    html += buildChapter4_Wealth(data);
    html += buildChapter5_Career(data);
    html += buildChapter6_Love(data);
    
    html += buildSectionHeader("PART 3. 숨겨진 무기와 취약점");
    html += buildChapter7_Hidden(data); // 지장간
    html += buildChapter8_Health(data);
    html += buildChapter9_Remedy(data);
    
    html += buildSectionHeader("PART 4. 시간의 지배자 (대운과 세운)");
    html += buildDaewunLoop(data);
    html += buildSewunLoop(data);
    html += buildWolunLoop(data);
    
    
    html += `<div id="pdf-btn-wrap" style="text-align: center; margin-top: 50px; padding-bottom: 50px; border-top: 1px solid #333; padding-top: 30px;">
        <button class="btn" style="background: var(--gold); color: #000; width: 100%; max-width: 400px; font-size: 18px; font-weight: 800; box-shadow: 0 4px 15px rgba(199, 167, 106, 0.4);" onclick="window.print()">📄 고객 전송용 PDF 추출 (Master Only)</button>
        <p style="color: #aaa; font-size: 13px; margin-top: 15px;">※ <b>관리자 전용:</b> 인쇄 대화창에서 대상을 <b>'PDF로 저장'</b>으로 맞추고, <b>'배경 그래픽'</b>을 켠 상태로 저장하여 고객에게 발송하십시오.</p>
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
    let title = dbEntry.title || "거대한 대지의 기운";
    let core = dbEntry.core || "당신은 끊임없이 환경과 충돌하며 자신만의 영역을 개척하는 기질을 타고났습니다.";
    let weapon = dbEntry.weapon || "위기 상황에서 발휘되는 직관과 돌파력이 당신의 가장 큰 무기입니다.";
    
    let extra1 = "겉으로 보여지는 사회적 가면 뒤에, 평생을 관통하며 나를 은밀하게 움직이는 고유한 기질이 있습니다. 이것은 단순한 성격이 아니라, 인생의 결정적인 위기 상황이나 선택의 기로에서 무의식적으로 꺼내어 드는 '영혼의 바코드'이자 생존 무기입니다.";
    let extra2 = "나의 에너지는 현재 <b>" + data.strengthText + "</b> 상태에 가깝습니다. 스스로도 온전히 설명하기 힘들었던 내면의 기복이나 굽히지 않는 고집들은, 바로 이 타고난 기질이 세상의 속도와 부딪히며 만들어내는 자연스러운 마찰열이었습니다.";
    let extra3 = "남들의 템포에 억지로 나를 맞추려 할 때마다 원인 모를 답답함을 느꼈을 것입니다. 이제는 억지로 깎아내려 하지 마십시오. 그 마찰열이 결국 나의 그릇을 한 단계 더 크게 빚어내는 용광로가 됩니다.";

    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 1. 나의 본질, 그리고 영혼의 바코드</h3>
            <div style="font-size: 18px; font-weight: bold; color: var(--gold); margin-bottom: 15px;">[${title}]</div>
            <p class="ch-text">${extra1}</p>
            <p class="ch-text">${core} ${weapon}</p>
            <p class="ch-text">${extra2}</p>
            <p class="ch-text">${extra3}</p>
        </div>
    `;
}

function buildChapter3_Sipseong(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 3. 무의식을 지배하는 운영체제 (십성 페르소나)</h3>`;
    let mainSip = "정재";
    if(data.sipseong && Object.keys(data.sipseong).length > 0) {
        mainSip = Object.keys(data.sipseong).reduce((a, b) => data.sipseong[a] > data.sipseong[b] ? a : b) || "정재";
    }
    let sipText = window.SAJU_DB?.SIPSEONG?.[mainSip] || "사회의 규칙에 순응하기보다 주도적으로 판을 짜는 기질입니다.";
    
    let extra1 = "결정적인 순간에 나는 어떤 선택을 내리는가? 나를 움직이는 가장 강력한 내면의 동인(動因)은 바로 <b>[${mainSip}]</b>의 욕망입니다.";
    let extra2 = "어떤 상황에서 무의식적으로 튀어나오는 행동 패턴, 사람을 대하고 돈을 쥐는 방식. 이 모든 것을 통제하는 내면의 '운영체제'가 바로 이것입니다. 세상이 나를 바라보는 매력 포인트이기도 하지만, 동시에 나만이 알고 있는 가장 지독한 권력욕의 실체이기도 합니다.";
    let extra3 = "이 능력은 완벽히 내 통제 아래 두고 적재적소에 꺼내 쓸 때 가장 파괴적인 성취를 만들어냅니다. 반대로, 감정에 휩쓸려 이 기질에 질질 끌려다니면 가장 믿었던 무기에 내 발등이 찍히는 경험을 하게 됩니다.";

    html += `
        <p class="ch-text">${extra1}</p>
        <p class="ch-text">${extra2}</p>
        <div style="background: #111; padding: 20px; border-left: 3px solid var(--gold); margin: 20px 0;">
            <div style="color: #fff; font-weight: bold; margin-bottom: 10px;">[ ${mainSip} 집중 분석 ]</div>
            <div style="color: #ccc; font-size: 15px; line-height: 1.7;">${sipText}</div>
        </div>
        <p class="ch-text">${extra3}</p>
        </div>
    `;
    return html;
}

function buildChapter4_Wealth(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 4. 재물(財)의 그릇과 자본 레버리지</h3>`;
    let jaeCount = (data.sipseong && (data.sipseong['정재'] || 0) + (data.sipseong['편재'] || 0)) || 0;
    
    let wealthCore = "";
    if(jaeCount === 0) wealthCore = "나는 돈을 직접 쫓아가면 오히려 운이 도망가는 구조를 가졌습니다. 작은 푼돈에 연연하거나 타인의 수익을 곁눈질할 때 가장 큰 슬럼프가 옵니다. 명예, 전문성, 독보적인 브랜드 등 '나 자신'의 가치를 미친 듯이 올려놓으면, 그제야 돈이 그림자처럼 폭발적으로 따라붙습니다. 내 그릇은 단순한 통장 잔고가 아니라, 내 이름값이 곧 자본이 되는 무형의 가치에 있습니다.";
    else if(jaeCount > 2) wealthCore = "어디서 돈 냄새가 나는지, 돈이 어떻게 흘러가는지 본능적으로 캐치하는 감각이 있습니다. 주변에 늘 기회가 널려 있는 듯 보입니다. 하지만 그 수많은 기회들이 오히려 내 에너지를 갉아먹고 집중력을 분산시킵니다. 10가지 유혹 중 9가지를 단호하게 쳐내고, 확실한 1가지에 모든 것을 걸어 파이프라인을 구축할 때 비로소 거대한 자산이 내 손에 남습니다.";
    else wealthCore = "내 재물운은 매우 안정적이고 감각적인 밸런스를 유지하고 있습니다. 모 아니면 도 식의 극단적인 투기보다는, 한 단계씩 차곡차곡 영토를 넓혀가는 스노우볼 전략에 최적화되어 있습니다. 자산이 불어나는 구조를 눈으로 확인할 때 심리적 안정감이 극대화되며, 그것이 다시 새로운 부를 창출하는 선순환을 만듭니다.";

    let extra1 = "부(富)란 단순히 현금의 액수가 아닙니다. 내 뜻대로 세상을 통제하고 다룰 수 있는 권력의 크기입니다.";
    let extra2 = "나의 자산은 눈에 보이는 현금으로 쥐고 있을 때보다, 가치가 변환된 형태(부동산, 주식, 지적재산권, 시스템)로 묶어둘 때 가장 견고하게 증식됩니다. 내 능력과 타인의 자본(레버리지)이 결합되는 지점을 찾아내는 것. 그것이 내 금고를 여는 유일한 마스터키입니다.";

    html += `
        <p class="ch-text">${extra1}</p>
        <p class="ch-text">${wealthCore}</p>
        <p class="ch-text">${extra2}</p>
        <div class="axe-advice" style="margin-top: 20px;">
            <b>👉 나를 위한 자산 증식 솔루션:</b> 내 금고의 크기를 월급이라는 시스템 안에 가둬두지 마십시오. 당신의 뇌 구조는 이미 더 큰 레버리지를 다루도록 세팅되어 있습니다.
        </div>
        </div>
    `;
    return html;
}


    const branchChung = {"자":"오", "축":"미", "인":"신", "묘":"유", "진":"술", "사":"해", "오":"자", "미":"축", "신":"인", "유":"묘", "술":"진", "해":"사"};
    const branchHap = {"자":"축", "축":"자", "인":"해", "묘":"술", "진":"유", "사":"신", "오":"미", "미":"오", "신":"사", "유":"진", "술":"묘", "해":"인"};
    const branchWonjin = {"자":"미", "축":"오", "인":"유", "묘":"신", "진":"해", "사":"술", "오":"축", "미":"자", "신":"묘", "유":"인", "술":"사", "해":"진"};

    function getEventForBranch(targetBranch, myBranch) {
        if(branchChung[myBranch] === targetBranch) return "기존의 안락했던 환경이 산산조각 나는 강한 충(沖)의 에너지가 발생합니다. 이직, 이사, 이별 등 강제적인 이동수가 생기며 껍질을 깨고 나와야만 합니다.";
        if(branchHap[myBranch] === targetBranch) return "나의 기운과 강력하게 결합하는 합(合)이 들어옵니다. 막혔던 문서나 인간관계가 풀리며 조력자의 개입으로 정체되었던 일들이 급진전됩니다.";
        if(branchWonjin[myBranch] === targetBranch) return "설명할 수 없는 감정 소모와 오해가 발생하는 원진(怨嗔)의 기운이 있습니다. 가까운 인간관계에 거리를 두고 혼자만의 멘탈 디톡스가 필수적입니다.";
        return "나의 고유한 기운이 세상의 흐름과 만나 서서히 템포를 조율해 나가는 시기입니다.";
    }

function buildDaewunLoop(data) {
    let daewuns = [];
    let startAge = data.daewunNum || 4; 
    
    const yangStems = ['갑','병','무','경','임'];
    let isYangYear = yangStems.includes(data.yearStem);
    let isMale = data.gender === 'M' || data.gender === 'male' || data.gender === '남성';
    
    let isForward = (isYangYear && isMale) || (!isYangYear && !isMale);
    
    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    
    let wolStemIdx = stems.indexOf(data.monthStem);
    let wolBranchIdx = branches.indexOf(data.monthBranch);

    for(let i=1; i<=8; i++) {
        let step = isForward ? i : -i;
        let sIdx = (wolStemIdx + step) % 10;
        if(sIdx < 0) sIdx += 10;
        let bIdx = (wolBranchIdx + step) % 12;
        if(bIdx < 0) bIdx += 12;
        
        let dwName = stems[sIdx] + branches[bIdx];
        daewuns.push({ age: startAge + ((i-1) * 10), name: dwName });
    }

    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 10. 거대한 기후의 변화 : 80년 대운(大運) 시퀀스</h3><div class="timeline">`;

    daewuns.forEach((dw, idx) => {
        let myBranchKor = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'}[data.dayBranch] || '자';
        let eventText = getEventForBranch(dw.name.charAt(1), myBranchKor);
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
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 11. 정밀 타격 : 향후 10년의 전술 시나리오</h3>
    <p class="ch-text" style="margin-bottom:30px;">대운이 10년의 기후라면, 세운(歲運)은 그해의 날씨입니다. 올해부터 향후 10년간 당신에게 어떤 비바람이 몰아치고 어떤 해가 뜰지 예측합니다. 매년 당신의 사주 원국 8글자가 그해의 기운과 충돌하며 만들어내는 구체적인 서사입니다.</p>`;

    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    
    const sip_list = ["비견(나의 세력 확장)", "겁재(치열한 경쟁과 쟁탈)", "식신(재능 발현과 생산)", "상관(틀을 깨는 혁신)", "편재(큰 돈의 흐름)", "정재(안정적 수익)", "편관(강한 압박과 명예)", "정관(안정된 직장과 승진)", "편인(특수한 자격과 직관)", "정인(문서와 귀인의 도움)"];
    
    for(let i=0; i<10; i++) {
        let y = currentYear + i;
        let sb = stems[(2+i)%10] + branches[(6+i)%12];
        
        let sip = sip_list[i % 10]; 
        let myBranchKor = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'}[data.dayBranch] || '자';
        let evt = getEventForBranch(branches[(6+i)%12], myBranchKor);
        
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
                    <span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🚨 나를 위한 행동 지침:</span>
                    <span style="color: #bbb; font-size: 14px; line-height: 1.6;"> ${i%2===0 ? "올해는 투자를 확장하거나 새로운 일을 벌이기보다는, 내실을 다지고 현금을 확보하는 방어적 태세가 당신을 살립니다." : "올해는 당신의 판입니다. 70%의 확신만 섰다면 뒤돌아보지 말고 즉시 실행하십시오. 머뭇거리면 기운을 뺏깁니다."}</span>
                </div>
            </div>
        `;
    }
    html += `</div>`;
    return html;
}

function buildWolunLoop(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 12. 마이크로 전술 : ${new Date().getFullYear()}년 12개월 작전 지도</h3>
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


function buildChapter5_Career(data) {
    let mainSip = "정관";
    if(data.sipseong && Object.keys(data.sipseong).length > 0) {
        mainSip = Object.keys(data.sipseong).reduce((a, b) => data.sipseong[a] > data.sipseong[b] ? a : b);
    }
    
    let careerCore = "";
    if(['식신', '상관'].includes(mainSip)) {
        careerCore = "내 사회적 무대는 '창작과 표현'입니다. 남들이 짜놓은 딱딱한 시스템이나 관료주의 속에서는 숨이 막힙니다. 누군가의 지시를 앵무새처럼 따르기보다는, 내 아이디어와 목소리가 곧 결과물이 되는 프리랜서, 기획, 크리에이티브 영역에서 내 안의 야성이 가장 폭발적으로 깨어납니다.";
    } else if(['편관', '정관'].includes(mainSip)) {
        careerCore = "조직의 생리를 꿰뚫어 보는 눈을 가졌습니다. 무에서 유를 창조하는 맨땅의 헤딩보다는, 이미 갖춰진 거대한 시스템 안에서 내 입지를 다지고 '완장(권력)'을 차는 데 천부적인 감각이 있습니다. 명분과 체면이 섰을 때 가장 큰 에너지가 나옵니다.";
    } else if(['편인', '정인'].includes(mainSip)) {
        careerCore = "내 무기는 '대체 불가능한 전문성'입니다. 몸을 바쁘게 움직이는 것보다, 남들이 범접할 수 없는 지식, 자격, 특수 기술을 바탕으로 뒤에서 판을 읽는 컨설턴트나 기획자 역할을 할 때 그 가치가 빛을 발합니다.";
    } else {
        careerCore = "타인의 통제를 극도로 꺼리며 내 구역을 온전히 지켜내려는 독고다이 기질이 강합니다. 치열한 승부욕이 필요한 영업, 독립적인 프로젝트의 리더, 스포츠 등 내 성과가 내 몫으로 100% 직결되는 환경에서 최고의 퍼포먼스를 냅니다.";
    }

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 5. 사회적 권력과 최적화된 무대 세팅</h3>
        <p class="ch-text">직업은 단순히 생계를 유지하는 수단이 아닙니다. 내 에너지를 가장 안정적이면서도 파괴적으로 발산할 수 있는 '전쟁터'를 선택하는 일입니다. 맞지 않는 옷을 억지로 입었을 때 찾아오던 그 지독한 무기력함은, 내 기운과 환경이 엇박자를 냈기 때문입니다.</p>
        <p class="ch-text">${careerCore}</p>
        <div class="axe-advice" style="margin-top: 15px; border-left-color: #3f51b5;">
            <b>👉 나를 위한 무대 세팅:</b> "내 권한이 온전히 보장되는가?" 이 질문 하나가 내 무대를 결정짓는 가장 중요한 기준표가 되어야 합니다.
        </div>
    </div>`;
}

function buildChapter9_Remedy(data) {
    let ds = data.dayStem;
    let color = "블랙과 네이비";
    let dir = "북쪽";
    let num = "1, 6";
    let maxWuxing = 'earth';
    let minWuxing = 'wood';
    if(data.wuxing && Object.keys(data.wuxing).length > 0) {
        let sorted = Object.keys(data.wuxing).sort((a,b) => data.wuxing[b] - data.wuxing[a]);
        maxWuxing = sorted[0];
        minWuxing = sorted[sorted.length-1];
    }
    
    let yongshinTarget = minWuxing; 
    
    if (yongshinTarget === 'wood') {
        color = "딥 그린과 포레스트 계열"; dir = "동쪽"; num = "3, 8";
    } else if (yongshinTarget === 'fire') {
        color = "버건디와 강렬한 레드"; dir = "남쪽"; num = "2, 7";
    } else if (yongshinTarget === 'earth') {
        color = "카멜 브라운과 샌드 베이지"; dir = "중앙"; num = "5, 10";
    } else if (yongshinTarget === 'metal') {
        color = "화이트와 실버 메탈릭"; dir = "서쪽"; num = "4, 9";
    } else {
        color = "차분한 네이비와 블랙"; dir = "북쪽"; num = "1, 6";
    }

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 9. 운명을 비트는 레버리지 (나를 위한 기밀 개운법)</h3>
        <p class="ch-text">명리학은 정해진 불행을 넋 놓고 기다리라고 있는 학문이 아닙니다. 비가 올 것을 알았으면 우산을 쓰고 나가면 됩니다. 부족한 기운을 채우고 과도한 기운을 빼내는 생활 속의 '액션 플랜'을 처방합니다.</p>
        <ul style="color: #ccc; line-height: 2; font-size: 15px;">
            <li><b>행운의 컬러:</b> ${color}. 중요한 계약을 하거나 사람을 만날 때 이 색상의 넥타이, 지갑, 속옷을 활용하십시오. 무의식적인 기운을 보완합니다.</li>
            <li><b>운이 뚫리는 방향:</b> ${dir}. 책상이나 침대 머리맡을 이 방향으로 두십시오. 일이 안 풀릴 때 이 방향으로 여행을 다녀오는 것도 기운을 씻어내는 방법입니다.</li>
            <li><b>재물을 부르는 숫자:</b> ${num}. 비밀번호나 계좌번호 등에 의식적으로 배치하십시오.</li>
            <li><b>행운의 마인드셋:</b> 완벽주의를 70%만 발휘하십시오. 30%의 빈틈이 있어야 돈과 사람이 들어옵니다.</li>
        </ul>
    </div>`;
}


window.generateDeepReport = generateDeepReport;
