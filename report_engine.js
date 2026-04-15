
function buildReportIntro(data) {
    return `
    <div class="report-chapter" style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 40px; margin-bottom: 50px;">
        <h2 style="color: var(--gold); font-size: 22px; font-family: 'Noto Serif KR', serif;">사주 X-FILE: 분석 대상 [${data.name}]</h2>
        <p class="ch-text" style="text-align: center; color: #888;">본 문서는 ${data.name} 님의 고유한 생성 에너지를 명리학적 알고리즘으로 해독한 1급 기밀 리포트입니다. <br>타인에게 유출 시 운명의 흐름이 왜곡될 수 있으니 주의하십시오.</p>
    </div>`;
}

// --- X-SAJU DEEP REPORT GENERATOR ENGINE (V4.5 - FULL STORYTELLING RESTORED) ---

function getDBText(category, key, fallback) {
    if(window.SAJU_DB && window.SAJU_DB[category] && window.SAJU_DB[category][key]) {
        let val = window.SAJU_DB[category][key];
        if(typeof val === 'object') {
            return (val.core || "") + " " + (val.weapon || "");
        }
        return val;
    }
    return fallback || "이 시기에는 잠재력을 발휘해야 합니다.";
}

function generateDeepReport(dataInput) {
    let dataArray = Array.isArray(dataInput) ? dataInput : [dataInput];
    let html = '';
    
    dataArray.forEach((data, idx) => {
        // [인트로: X-FILE 기밀 보고서 헤더]
        html += `<div style="border: 2px solid var(--gold); padding: 40px 20px; margin-bottom: 60px; border-radius: 0px; background: rgba(199, 167, 106, 0.05); text-align: center; position: relative;">
            <div style="position: absolute; top: 10px; left: 10px; color: var(--gold); font-size: 10px; letter-spacing: 2px;">CLASSIFIED: LEVEL 1</div>
            <h1 style="color: var(--gold); margin: 0; font-family: 'Noto Serif KR', serif; font-size: 28px; font-weight: 900; letter-spacing: 5px;">[ ${data.name} 님의 X-FILE ]</h1>
            <div style="margin-top: 15px; color: #888; font-size: 13px;">발급번호: #${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
        </div>`;
        
        // --- PART 1. 운명의 해부도 (원국 분석) ---
        html += buildSectionHeader("PART 1. 운명의 해부도 (원국 분석)");
        html += buildReportIntro(data);
        html += buildChapter1_Full(data);
        html += buildChapter2_Full(data);
        html += buildChapter3_Full(data);
        
        // --- PART 2. 인생의 무대와 성취 ---
        html += buildSectionHeader("PART 2. 인생의 무대와 성취");
        html += buildChapter4_Full(data);
        html += buildChapter5_Full(data);
        html += buildChapter6_Full(data);
        
        // --- PART 3. 숨겨진 무기와 취약점 ---
        html += buildSectionHeader("PART 3. 숨겨진 무기와 취약점");
        html += buildChapter7_Full(data);
        html += buildChapterHealth_Full(data);
        html += buildChapter9_Full(data);

        // --- PART 4. 대운/세운 (시간의 지배자) ---
        html += buildSectionHeader("PART 4. 시간의 흐름 (대운과 세운)");
        html += buildChapter10_Full(data);
        
        if (idx < dataArray.length - 1) {
             html += '<div style="page-break-after: always; height: 100px; border-bottom: 1px dashed #333; margin-bottom: 100px;"></div>';
        }
    });
    
    // --- N:N 시너지 (궁합) ---
    if (dataArray.length > 1) {
        html += buildSectionHeader("SPECIAL PART. 운명적 시너지 (N:N 기밀 궁합)");
        html += buildSynergySection(dataArray);
    }
    
    html += `<div id="pdf-btn-wrap" style="text-align: center; margin-top: 80px; padding-bottom: 100px; border-top: 1px solid #333; padding-top: 50px;">
        <button class="btn" style="background: var(--gold); color: #000; width: 100%; max-width: 450px; font-size: 20px; font-weight: 900; box-shadow: 0 4px 25px rgba(199, 167, 106, 0.5); border-radius: 0; padding: 25px;" onclick="window.print()">📄 X-FILE 기밀문서 PDF로 평생 소장하기</button>
    </div>`;
    
    document.getElementById('report-container').innerHTML = html;
}

function buildSectionHeader(title) {
    return `<div style="margin: 80px 0 40px 0; padding-bottom: 20px; border-bottom: 3px solid var(--gold); position: relative;">
            <h2 style="color: var(--gold); font-size: 28px; font-family: 'Noto Serif KR', serif; letter-spacing: 4px; margin: 0;">${title}</h2>
            <div style="position: absolute; right: 0; bottom: -10px; background: var(--bg); padding-left: 10px; color: var(--gold); font-size: 12px;">X-FILE PROJECT v4.0</div>
        </div>`;
}

// --- CHAPTERS WITH FULL STORYTELLING ---

function buildChapter1_Full(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 1. 당신이라는 소우주의 설계도</h3>
        <p class="ch-text" style="font-size: 18px; font-weight: 800; color: var(--gold);">[${dbEntry.title || iljuKey + '(' + (HAN_KOR[data.dayStem]||'') + (HAN_KOR[data.dayBranch]||'') + ')의 기운'}]</p>
        <p class="ch-text">명리학에서 일주(日柱)는 단순히 성격을 의미하는 것이 아니라, 당신이 평생 짊어지고 가야 할 <b>영혼의 바코드이자 생존의 무기</b>입니다. 당신을 진정으로 움직이는 것은 사회적 가면이 아닌, 바로 이 일주에 새겨진 내밀한 기질입니다.</p>
        <p class="ch-text">${dbEntry.core || '당신의 본질을 해독하는 중입니다.'}</p>
        <p class="ch-text">당신의 에너지는 현재 <b>${data.strengthText}</b> 상태입니다. 이는 외부의 압력을 견뎌내고 내면의 폭발력을 응축하는 원동력이 됩니다. 남들의 속도에 맞추려 하지 마십시오. 당신의 템포가 곧 정답입니다.</p>
        <div class="axe-advice"><b>Axe의 기밀 통찰:</b> ${dbEntry.weapon || '당신만의 독보적인 무기를 발견하십시오.'}</div>
    </div>`;
}

function buildChapter2_Full(data) {
    let maxW = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] > data.wuxing[b] ? a : b);
    let excessText = window.SAJU_DB?.WUXING_EXCESS?.[maxW] || "에너지가 한곳으로 집중되어 있습니다.";
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 2. 오행의 흐름과 에너지 권력</h3>
        <p class="ch-text">거물들은 예외 없이 오행이 극단적으로 쏠려 있습니다. 당신의 사주 원국을 해부해 본 결과, 당신의 절대적인 무기이자 아킬레스건은 바로 <b>${RELATION_LABELS[maxW]}</b>의 기운입니다.</p>
        <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #222;">
            <p class="ch-text" style="color: var(--gold); font-weight: 700;">[ ${RELATION_LABELS[maxW]} 기운의 지배력 집중 분석 ]</p>
            <p class="ch-text" style="margin: 0; color: #ccc;">${excessText}</p>
        </div>
        <p class="ch-text">이 편중된 에너지를 어떻게 다루느냐가 당신 인생의 스케일을 결정합니다. 남들처럼 평범하게 억누르려 하지 말고, 이 기운이 필요한 극한의 환경에서 당신의 가치를 증명하십시오.</p>
    </div>`;
}

function buildChapter3_Full(data) {
    let mainSip = Object.keys(data.sipseong).reduce((a, b) => data.sipseong[a] > data.sipseong[b] ? a : b) || "비견";
    let sipText = window.SAJU_DB?.SIPSEONG?.[mainSip] || "당신만의 독특한 사회적 페르소나를 가지고 있습니다.";
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 3. 사회적 가면과 내면의 욕망 (십성)</h3>
        <p class="ch-text">오행이 당신의 신체라면, 십성은 당신의 뇌에 깔린 <b>운영체제(S/W)</b>입니다. 결정적인 순간에 당신이 내리는 모든 선택은 바로 이 십성이라는 필터를 통해 걸러집니다.</p>
        <div class="axe-advice" style="border-left-color: #52b36a;">
            <p style="margin: 0; color: #fff; font-weight: 700; margin-bottom: 8px;">[ 당신의 주력 페르소나: ${mainSip} ]</p>
            <p style="margin: 0;">${sipText}</p>
        </div>
        <p class="ch-text" style="margin-top: 20px;">이 기질은 양날의 검입니다. 당신의 통제 아래 두면 최고의 무기가 되지만, 끌려다니면 발목을 잡는 족쇄가 됩니다.</p>
    </div>`;
}

function buildChapter4_Full(data) {
    let jaeCount = (data.sipseong['정재'] || 0) + (data.sipseong['편재'] || 0);
    let wealthNarrative = "";
    if(jaeCount === 0) wealthNarrative = "당신은 돈을 직접 쫓으면 도망가는 구조입니다. 대신 '전문성'과 '나라는 브랜드'의 가치를 올리십시오. 돈은 그림자처럼 따라올 것입니다.";
    else if(jaeCount > 2) wealthNarrative = "돈 냄새를 맡는 감각이 천부적입니다. 하지만 너무 많은 기회는 당신을 갉아먹습니다. 9가지를 쳐내고 확실한 1가지를 시스템화하십시오.";
    else wealthNarrative = "안정적인 자산 밸런스를 가졌습니다. 스노우볼 전략에 최적화되어 있으니, 시간이 흐를수록 우상향하는 시스템 자산에 집중하십시오.";

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 4. 재물운: 부의 그릇과 유통 경로</h3>
        <p class="ch-text">재물(財)은 단순히 액수가 아니라 <b>'내가 세상을 통제하는 힘의 크기'</b>입니다. 당신의 금고는 평범한 이들의 월급 통장 사이즈가 아닙니다.</p>
        <p class="ch-text" style="color: #fff; border-left: 2px solid var(--gold); padding-left: 15px;">${wealthNarrative}</p>
        <p class="ch-text">당신은 현금 자체보다 부동산, 지적재산권 등 <b>'문서화된 권리'</b>로 자산을 묶을 때 폭발적인 시너지가 납니다.</p>
    </div>`;
}

function buildChapter5_Full(data) {
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 5. 직업과 사회적 성취의 전쟁터</h3>
        <p class="ch-text">직업은 내 에너지를 가장 파괴적으로 발산할 수 있는 <b>'전쟁터의 종류'</b>를 의미합니다. 물고기 사주라면 바다로 가야 합니다.</p>
        <p class="ch-text">당신은 조직의 부품으로 쓰이기보다, 당신의 권한이 100% 보장되는 독립적인 영역에서 최고의 퍼포먼스를 냅니다. "내 권한이 보장되는가?" 이것이 이직이나 창업의 유일한 기준입니다.</p>
    </div>`;
}

function buildChapter6_Full(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 6. 인연: 영혼의 파트너십</h3>
        <p class="ch-text">사주에서 일지(日支)는 당신의 안방이자 배우자의 자리입니다. 사회적 가면을 벗어던지고 가장 취약한 민낯을 드러낼 때의 당신을 품어줄 인연이 각인되어 있습니다.</p>
        <p class="ch-text" style="background: rgba(199, 167, 106, 0.1); padding: 20px; color: #fff;">${dbEntry.love || '당신의 인연법은 서로의 성장을 자극하는 구조입니다.'}</p>
    </div>`;
}

function buildChapter7_Full(data) {
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 7. 숨겨진 잠재력 (지장간 해부)</h3>
        <p class="ch-text">빙산의 일각처럼, 물 밑에 숨겨진 진짜 본능이 '지장간'입니다. 이것은 당신의 비상금이면서 동시에 위기 상황에서만 튀어나오는 당신의 <b>진짜 무기</b>입니다.</p>
        <p class="ch-text">평소에는 온화해 보이지만, 결정적인 순간에 보여주는 당신의 서늘한 결단력은 바로 이곳에서 나옵니다.</p>
    </div>`;
}

function buildChapter8_Full(data) {
    let maxW = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] > data.wuxing[b] ? a : b);
    let organ = {'wood': '간/신경계', 'fire': '심장/혈관', 'earth': '위장/비장', 'metal': '폐/호흡기', 'water': '신장/방광'}[maxW];
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 8. 신체 취약점과 건강 마지노선</h3>
        <p class="ch-text">마음의 과부하는 즉각적으로 장기의 병변으로 나타납니다. 당신의 에너지 편중으로 볼 때 가장 주의해야 할 마지노선은 <b>[${organ}]</b> 계통입니다.</p>
        <div class="axe-advice" style="border-left-color: #d32f2f;">
            당신은 멈춰야 할 때 멈추는 데 큰 용기가 필요한 타입입니다. 몸을 연료로 태워 성취를 사지 마십시오.
        </div>
    </div>`;
}

function buildChapter9_Full(data) {
    let minW = Object.keys(data.wuxing).sort((a,b) => data.wuxing[a] - data.wuxing[b])[0];
    let remedy = {
        'wood': { c: '그린', d: '동쪽', n: '3, 8' },
        'fire': { c: '레드', d: '남쪽', n: '2, 7' },
        'earth': { c: '황토색/브라운', d: '중앙', n: '5, 10' },
        'metal': { c: '화이트/실버', d: '서쪽', n: '4, 9' },
        'water': { c: '네이비/블랙', d: '북쪽', n: '1, 6' }
    }[minW];
    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 9. 운명을 비트는 레버리지 (개운법)</h3>
        <p class="ch-text">비가 올 것을 알았으면 우산을 쓰면 됩니다. 당신에게 부족한 <b>${RELATION_LABELS[minW]}</b>의 기운을 채우는 처방입니다.</p>
        <ul style="color: #ccc; line-height: 2.5; font-size: 15px;">
            <li><b>행운의 컬러:</b> ${remedy.c} (계약이나 미팅 시 소품으로 활용)</li>
            <li><b>운이 뚫리는 방향:</b> ${remedy.d} (책상이나 침대 머리 방향)</li>
            <li><b>재물을 부르는 숫자:</b> ${remedy.n} (비밀번호나 계좌에 의식적 배치)</li>
        </ul>
        <div class="axe-advice">🤝 <b>바이럴 미션:</b> 이 문서를 보고 떠오른 사람이 있다면, 그 사람의 X-FILE도 확인해주시는 것이 당신의 운을 순환시키는 최고의 액션입니다.</div>
    </div>`;
}

function buildChapter10_Full(data) {
    let html = `<div class="report-chapter">
        <h3 class="ch-title">Chapter 10. 시간의 파동 (대운 분석)</h3>
        <p class="ch-text">대운은 10년마다 바뀌는 당신 인생의 기상도입니다. 현재 당신은 인생의 거대한 변곡점을 지나고 있습니다.</p>`;
    
    // Simple loop for previewing 3 Daewuns with DB text
    for(let i=1; i<=3; i++) {
        let eventText = window.SAJU_DB?.DAEWUN_EVENTS?.[i-1] || "환경의 변화를 주도적으로 이끌어내야 하는 시기입니다.";
        html += `<div style="margin-bottom: 25px; padding: 25px; background: #111; border-left: 4px solid var(--gold); border-radius: 5px;">
            <p style="color: var(--gold); font-weight: 800; margin-bottom: 10px;">${data.daewunNum + ((i-1)*10)}세 ~ : [대운 시퀀스 #${i}]</p>
            <p style="margin: 0; color: #ddd; line-height: 1.7;">${eventText}</p>
        </div>`;
    }
    html += `</div>`;
    return html;
}

function buildSynergySection(users) {
    let html = '<div class="report-chapter">';
    const branchHap = {"子":"丑","丑":"子","寅":"亥","亥":"寅","卯":"戌","戌":"卯","辰":"酉","酉":"辰","巳":"申","申":"巳","午":"未","未":"午"};
    const branchChung = {"子":"午","午":"子","丑":"未","未":"丑","寅":"申","申":"寅","卯":"酉","酉":"卯","辰":"戌","戌":"辰","巳":"亥","亥":"巳"};
    const branchWonjin = {"子":"未","未":"子","丑":"午","午":"丑","寅":"酉","酉":"寅","卯":"申","申":"卯","辰":"亥","亥":"辰","巳":"戌","戌":"巳"};

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            html += `<div style="margin-bottom: 40px; border-bottom: 1px dashed #444; padding-bottom: 30px;">
                <h4 style="color: var(--gold); margin-bottom: 15px; font-size: 20px;">🛡️ ${users[i].name}(${users[i].dayStem}${users[i].dayBranch}) ↔ ${users[j].name}(${users[j].dayStem}${users[j].dayBranch}) 의 시너지 분석</h4>`;
            
            let u1 = users[i], u2 = users[j];
            let b1 = u1.dayBranch, b2 = u2.dayBranch;

            if (branchHap[b1] === b2) {
                html += `<p class="ch-text"><b>[운명적 인력]</b> 두 분은 지지 육합(六合)의 관계입니다. 첫눈에 강하게 끌리거나, 설명할 수 없는 깊은 유대감을 느끼는 소울메이트 구조입니다.</p>`;
            } else if (branchChung[b1] === b2) {
                html += `<p class="ch-text"><b>[역동적 마찰]</b> 지지 충(沖)의 관계입니다. 서로의 가치관이 정반대에 있어 사사건건 충돌할 수 있으나, 이를 건설적으로 풀면 서로를 크게 성장시키는 관계가 됩니다.</p>`;
            } else if (branchWonjin[b1] === b2) {
                html += `<p class="ch-text"><b>[감정적 애증]</b> 원진(怨嗔)의 기운이 흐릅니다. 서로를 그리워하면서도 만나면 사소한 일로 원망하게 되는 복잡한 감정선이 존재하니 정서적 배려가 필수입니다.</p>`;
            } else {
                html += `<p class="ch-text"><b>[담백한 존중]</b> 특별한 형충파해 없이 서로의 영역을 존중하며 담백하게 이어지는 관계입니다.</p>`;
            }

            let u1Min = Object.keys(u1.wuxing).sort((a,b)=>u1.wuxing[a]-u1.wuxing[b])[0];
            let u2Max = Object.keys(u2.wuxing).sort((a,b)=>u2.u2Max-u2.wuxing[a])[0];
            
            if (u1Min === u2Max) {
                html += `<p class="ch-text"><b>[오행 보완]</b> ${u1.name}님에게 부족한 ${RELATION_LABELS[u1Min]||u1Min} 기운을 ${u2.name}님이 압도적으로 채워주고 있습니다. 함께 있을 때 정서적 안정이 극대화됩니다.</p>`;
            }
            html += `</div>`;
        }
    }
    html += '</div>';
    return html;
}

window.generateDeepReport = generateDeepReport;


function buildChapterHealth_Full(data) {
    const score = data.healthScore;
    const wuxing = data.wuxing;
    const total = Object.values(wuxing).reduce((a,b)=>a+b, 0);
    
    let weakEl = Object.keys(wuxing).reduce((a, b) => wuxing[a] < wuxing[b] ? a : b);
    let strongEl = Object.keys(wuxing).reduce((a, b) => wuxing[a] > wuxing[b] ? a : b);
    
    const EL_HEALTH = {
        "wood": "간, 담도계, 신경계, 시력",
        "fire": "심장, 소장, 혈관, 시력",
        "earth": "위장, 비장, 소화기계, 피부",
        "metal": "폐, 대장, 호흡기계, 뼈",
        "water": "신장, 방광, 생식기계, 호르몬"
    };

    let status = score > 80 ? "매우 양호" : (score > 60 ? "주의 요망" : "집중 관리 필요");
    let remedy = "";
    if(score < 70) {
        remedy = `현재 당신의 오행 중 <b>${RELATION_LABELS[weakEl]}</b> 기운이 가장 취약하며, 이는 신체적으로 <b>${EL_HEALTH[weakEl]}</b> 부위의 약화로 이어질 수 있습니다. 반면 <b>${RELATION_LABELS[strongEl]}</b> 기운은 과다하여 해당 장기에 열이 쌓이기 쉬운 구조입니다.`;
    } else {
        remedy = "전반적인 오행의 균형이 잘 잡혀 있으나, 과로와 스트레스가 겹칠 때 가장 약한 고리부터 무너질 수 있으니 평소 꾸준한 관리가 필요합니다.";
    }

    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 8. 생명의 리듬 (건강과 오행의 밸런스)</h3>
        <p class="ch-text">사주 명리학은 단순한 점술이 아니라, 우주의 기운이 내 몸의 장기와 어떻게 공명하는지를 보여주는 <b>고대 동양의 예방의학</b>이기도 합니다.</p>
        <div style="background: #1a1a1a; padding: 25px; border-radius: 15px; border: 1px solid #333; margin: 20px 0;">
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 14px; color: #888;">종합 건강 지수</span><br>
                <span style="font-size: 42px; color: ${score < 50 ? '#e74c3c' : 'var(--gold)'}; font-weight: 900;">${score}점</span><br>
                <span style="color: #aaa; font-size: 13px;">상태: ${status}</span>
            </div>
            <p class="ch-text" style="font-size: 14.5px; line-height: 1.8; color: #ddd;">${remedy}</p>
        </div>
        <p class="ch-text">"몸은 마음의 그릇입니다." 오행의 불균형을 다스리는 식이요법과 생활 습관이 당신의 운명을 바꾸는 가장 빠른 지름길임을 잊지 마십시오.</p>
    </div>`;
}
