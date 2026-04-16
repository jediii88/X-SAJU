
function generateDeepReport(dataInput) {
    let data = Array.isArray(dataInput) ? dataInput[0] : dataInput;
    if(!data || !data.dayStem) return;

    let html = '';
    
    // 럭셔리 인트로
    html += `
    <div class="report-intro-luxury" style="padding: 60px 20px; text-align: center; border-bottom: 2px solid var(--gold); margin-bottom: 60px;">
        <div style="font-size: 11px; letter-spacing: 4px; color: var(--gold); margin-bottom: 20px; font-weight: 700;">PROJECT X-SAJU: TOP SECRET</div>
        <h1 style="font-family: 'Noto Serif KR', serif; font-size: 32px; font-weight: 700; color: var(--gold); margin: 0; letter-spacing: -1px;">${data.name} 님의 운명 설계도</h1>
        <p style="color: #888; margin-top: 15px; font-size: 14px; line-height: 1.6;">본 리포트는 귀하의 탄생 순간에 각인된 우주의 주파수를 해독한 기밀 문서입니다.<br>기존의 단순한 운세 풀이를 넘어, 마스터의 시각으로 귀하의 근본 자아와 시간의 흐름을 해부합니다.</p>
    </div>`;

    // SECTION 1. 자아의 원형 (페르소나, 에너지 밀도)
    html += buildSectionHeader("SECTION 1. 자아의 원형과 설계값");
    html += buildChapter_Persona(data);
    if(typeof buildChapter_EnergyDensity === 'function') html += buildChapter_EnergyDensity(data);

    // SECTION 2. 사회적 무기 (십성, 지장간)
    html += buildSectionHeader("SECTION 2. 사회적 정글에서 사용하는 무기");
    html += buildChapter_Weapons(data);
    if(typeof buildChapter7_Full === 'function') html += buildChapter7_Full(data);

    // SECTION 3. 성취의 메커니즘 (재물, 직업)
    html += buildSectionHeader("SECTION 3. 부와 성취의 메커니즘");
    if(typeof buildChapter_Wealth === 'function') html += buildChapter_Wealth(data);
    if(typeof buildChapter5_Full === 'function') html += buildChapter5_Full(data);

    // SECTION 4. 리스크 관리 (건강, 개운법)
    html += buildSectionHeader("SECTION 4. 생존 전략과 리스크 관리");
    if(typeof buildChapter_HealthMaster === 'function') html += buildChapter_HealthMaster(data);

    // SECTION 5. 시간의 흐름 (대운, 세운)
    html += buildSectionHeader("SECTION 5. 시간의 흐름과 기회의 시기");
    if(typeof buildChapter10_Full === 'function') html += buildChapter10_Full(data);

    // 아웃트로
    html += `
    <div style="text-align: center; margin-top: 100px; padding: 60px 40px; border: 1px solid #222; background: #0a0a0a; border-radius: 15px;">
        <p style="color: var(--gold); font-weight: 700; font-size: 18px; margin-bottom: 20px;">"운명은 결정된 것이 아니라, 설계도를 이해한 자에 의해 재구성되는 것입니다."</p>
        <div style="font-size: 13px; color: #555; margin-bottom: 30px;">Copyright 2026. X-SAJU MASTER All rights reserved.</div>
        <button class="btn" style="width: 100%; max-width: 320px; background: var(--gold); color: #000; font-weight: 800; padding: 15px;" onclick="window.print()">보고서 PDF로 소장하기</button>
    </div>`;

    const container = document.getElementById('report-container');
    if(container) {
        container.innerHTML = html;
        // 스크롤을 리포트 시작 지점으로 이동
        container.scrollIntoView({ behavior: 'smooth' });
    }
}



// 1. 페르소나 챕터 (몰입 유도: "당신은 ~한 사람입니다")
function buildChapter_Persona(data) {
    const animal = data.animal.split('(')[1].replace(')','');
    return `
    <div class="report-chapter">
        <h3 class="ch-title">01. 당신의 고유 페르소나: [${animal}]</h3>
        <p class="ch-text">당신은 단순한 인간이 아닙니다. 우주의 관점에서 당신은 <b>${animal}</b>의 기질을 품고 태어난 특별한 에너지체입니다. ${data.dayStem}(${HAN_KOR[data.dayStem]})의 태양 같은 열정과 ${data.dayBranch}(${HAN_KOR[data.dayBranch]})의 지혜가 결합되어 당신만의 독특한 아우라를 형성합니다.</p>
        <div class="axe-advice">
            남들이 당신을 차갑게 보더라도, 당신의 내면에는 꺼지지 않는 화로(火)가 있습니다. 그 화로를 언제, 누구를 위해 태울지가 당신 인생의 전반전을 결정합니다.
        </div>
    </div>`;
}

// 2. 무기 챕터 (정보 전달: "당신은 이런 무기를 가졌습니다")
function buildChapter_Weapons(data) {
    const mainSip = Object.keys(data.sipseong).reduce((a, b) => data.sipseong[a] > data.sipseong[b] ? a : b);
    return `
    <div class="report-chapter">
        <h3 class="ch-title">02. 사회적 무기: [${mainSip}]의 힘</h3>
        <p class="ch-text">사회라는 전쟁터에서 당신이 가장 잘 휘두르는 칼날은 바로 <b>${mainSip}(${data.sipseong[mainSip]}개 보유)</b>입니다. 이는 당신이 타인과 소통하고 성과를 내는 근본적인 방식입니다.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; border-top: 3px solid #52b36a;">
                <div style="font-size: 11px; color: #666;">공격 무기 (천간)</div>
                <div style="font-size: 16px; font-weight: 800; color: #ddd;">${data.pillars[1].h[0]}의 카리스마</div>
            </div>
            <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; border-top: 3px solid #e74c3c;">
                <div style="font-size: 11px; color: #666;">방어 무기 (지장간)</div>
                <div style="font-size: 16px; font-weight: 800; color: #ddd;">숨겨진 ${BRANCH_HIDDEN[data.dayBranch][0]}의 지혜</div>
            </div>
        </div>
    </div>`;
}


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
            <h1 style="color: var(--gold); margin: 0; font-family: 'Noto Serif KR', serif; font-size: 28px; font-weight: 500; letter-spacing: 5px;">[ ${data.name} 님의 X-FILE ]</h1>
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
        <button class="btn" style="background: var(--gold); color: #000; width: 100%; max-width: 450px; font-size: 20px; font-weight: 500; box-shadow: 0 4px 25px rgba(199, 167, 106, 0.5); border-radius: 0; padding: 25px;" onclick="window.print()">📄 X-FILE 기밀문서 PDF로 평생 소장하기</button>
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


// --- HIGH DENSITY NARRATIVE CHAPTERS (MASTERPIECE LEVEL) ---

function buildChapter1_Full(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    
    // 년, 월, 일, 시의 한자/한글 데이터
    const yH = data.pillars[3].h; 
    const mH = data.pillars[2].h; 
    const dH = data.pillars[1].h; 
    const tH = data.pillars[0].h; 
    
    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 1. 당신의 소우주: 8글자의 논리적 해부</h3>
        <p class="ch-text">사주(四柱)란 당신이 태어난 연, 월, 일, 시의 4개의 기둥을 의미하며, 각 기둥은 위(천간)와 아래(지지) 두 글자로 이루어져 총 8글자(팔자)가 됩니다. 이 8글자는 단순한 점괘가 아니라, 당신의 기질과 환경을 설계한 <b>정밀한 우주적 설계도</b>입니다.</p>
        
        <div style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 10px; border: 1px solid #333; margin: 30px 0;">
            <p style="color: var(--gold); font-size: 16px; font-weight: 800; margin-top: 0;">[ ${data.name} 님의 사주 원국 8글자 ]</p>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; margin-top: 20px;">
                <div style="border: 1px solid #444; padding: 15px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 10px;">시주(말년/무기)</div>
                    <div style="font-size: 24px; font-weight: 500; color: ${HAN_COLOR[tH[0]]}">${tH[0]}<span style="font-size:12px; color:#aaa;">(${HAN_KOR[tH[0]]})</span></div>
                    <div style="font-size: 24px; font-weight: 500; color: ${HAN_COLOR[tH[1]]}; margin-top: 5px;">${tH[1]}<span style="font-size:12px; color:#aaa;">(${HAN_KOR[tH[1]]})</span></div>
                </div>
                <div style="border: 1px solid #444; padding: 15px; border-radius: 5px; background: rgba(199,167,106,0.1); border-color: var(--gold);">
                    <div style="font-size: 12px; color: var(--gold); margin-bottom: 10px;">일주(본질/안방)</div>
                    <div style="font-size: 24px; font-weight: 500; color: ${HAN_COLOR[dH[0]]}">${dH[0]}<span style="font-size:12px; color:#aaa;">(${HAN_KOR[dH[0]]})</span></div>
                    <div style="font-size: 24px; font-weight: 500; color: ${HAN_COLOR[dH[1]]}; margin-top: 5px;">${dH[1]}<span style="font-size:12px; color:#aaa;">(${HAN_KOR[dH[1]]})</span></div>
                </div>
                <div style="border: 1px solid #444; padding: 15px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 10px;">월주(환경/직업)</div>
                    <div style="font-size: 24px; font-weight: 500; color: ${HAN_COLOR[mH[0]]}">${mH[0]}<span style="font-size:12px; color:#aaa;">(${HAN_KOR[mH[0]]})</span></div>
                    <div style="font-size: 24px; font-weight: 500; color: ${HAN_COLOR[mH[1]]}; margin-top: 5px;">${mH[1]}<span style="font-size:12px; color:#aaa;">(${HAN_KOR[mH[1]]})</span></div>
                </div>
                <div style="border: 1px solid #444; padding: 15px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 10px;">년주(조상/초년)</div>
                    <div style="font-size: 24px; font-weight: 500; color: ${HAN_COLOR[yH[0]]}">${yH[0]}<span style="font-size:12px; color:#aaa;">(${HAN_KOR[yH[0]]})</span></div>
                    <div style="font-size: 24px; font-weight: 500; color: ${HAN_COLOR[yH[1]]}; margin-top: 5px;">${yH[1]}<span style="font-size:12px; color:#aaa;">(${HAN_KOR[yH[1]]})</span></div>
                </div>
            </div>
        </div>

        <p class="ch-text">가장 중심이 되는 글자는 일주의 윗글자, 즉 <b>일간(日干) ${data.dayStem}(${HAN_KOR[data.dayStem]})</b>입니다. 이 글자가 곧 당신의 '영혼의 본체'입니다. 당신은 우주적으로 ${RELATION_LABELS[HAN_COLOR[data.dayStem]]}의 기운을 띠고 태어났으며, 일지(아랫글자)인 ${data.dayBranch}(${HAN_KOR[data.dayBranch]})를 깔고 앉아 있습니다.</p>
        <p class="ch-text">월주 ${mH[0]}${mH[1]}(${HAN_KOR[mH[0]]}${HAN_KOR[mH[1]]})는 당신이 태어난 계절적 환경을 의미하며, 직업과 사회성을 지배합니다. 당신의 ${data.dayStem}(${HAN_KOR[data.dayStem]}) 본체는 이 월주의 환경 속에서 주변 글자들과 밀고 당기며(생극제화) 당신만의 고유한 성향을 만들어냅니다.</p>

        <div style="background: rgba(199,167,106,0.05); padding: 25px; border-left: 3px solid var(--gold); margin-top: 30px;">
            <p style="color: var(--gold); font-size: 15px; font-weight: 700; margin-top: 0;">[일주 ${iljuKey}(${HAN_KOR[data.dayStem]}${HAN_KOR[data.dayBranch]})의 본질]</p>
            <p style="margin: 0; color: #ccc; line-height: 1.8;">${dbEntry.core || '본질 해독 중입니다.'}</p>
        </div>
    </div>`;
}
function buildChapter2_Full(data) {
    let maxW = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] > data.wuxing[b] ? a : b);
    let minW = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] < data.wuxing[b] ? a : b);
    let excessText = window.SAJU_DB?.WUXING_EXCESS?.[maxW] || "에너지가 한곳으로 집중되어 있습니다.";
    
    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 2. 오행의 권력 구조와 결핍의 심리학</h3>
        <p class="ch-text">세상을 뒤흔든 거물들은 예외 없이 오행이 극단적으로 쏠려 있습니다. 완벽한 균형은 평범함을 의미하지만, 극단적인 불균형은 <b>천재성</b>을 뜻합니다.</p>
        
        <h4 style="color: var(--gold); margin-top: 40px; font-size: 18px;">[ 절대 무기: ${RELATION_LABELS[maxW]}의 지배력 ]</h4>
        <p class="ch-text">${excessText}</p>
        
        <h4 style="color: #e74c3c; margin-top: 40px; font-size: 18px;">[ 영혼의 기갈: ${RELATION_LABELS[minW]}의 공백 ]</h4>
        <p class="ch-text">당신은 이 부족한 기운에 평생토록 본능적으로 집착합니다. 이것이 바로 명리학에서 말하는 <b>결핍이 만들어내는 강력한 동기부여</b>입니다. 없는 것을 채우려는 그 처절한 몸부림이 당신을 남들보다 몇 배는 더 높이 도약하게 만드는 원동력입니다.</p>
        <p class="ch-text">결핍을 두려워하지 마십시오. 비어있는 공간이 있어야 새로운 것을 담을 수 있습니다.</p>
    </div>`;
}

function buildChapter3_Full(data) {
    let mainSip = Object.keys(data.sipseong).reduce((a, b) => data.sipseong[a] > data.sipseong[b] ? a : b) || "비견";
    let sipText = window.SAJU_DB?.SIPSEONG?.[mainSip] || "당신만의 독특한 사회적 페르소나를 가지고 있습니다.";
    
    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 3. 십성(十星)의 원리와 사회적 무기</h3>
        <p class="ch-text">사주에서 <b>십성(十星)</b>이란, 내 본체인 일간(${data.dayStem})을 기준으로 나머지 7개의 글자가 나와 어떤 관계를 맺고 있는지를 10가지 역할로 분류한 시스템입니다. 이것이 바로 당신이 세상을 바라보고 대응하는 '뇌의 운영체제(S/W)'가 됩니다.</p>
        
        <ul style="color: #bbb; line-height: 2.0; font-size: 15px; margin-bottom: 30px; background: rgba(255,255,255,0.02); padding: 20px 40px; border-radius: 8px;">
            <li><b>식상(식신/상관):</b> 내가 에너지를 빼내어 낳는 기운 (표현력, 기술, 아이디어)</li>
            <li><b>재성(정재/편재):</b> 내가 극(통제)하여 쟁취하는 기운 (결과물, 목표, 재물)</li>
            <li><b>관성(정관/편관):</b> 나를 극(통제)하여 억누르는 기운 (규율, 명예, 직장)</li>
            <li><b>인성(정인/편인):</b> 나를 돕고 생(生)해주는 기운 (학문, 인정, 문서)</li>
            <li><b>비겁(비견/겁재):</b> 나와 같은 기운 (경쟁자, 자아, 독립심)</li>
        </ul>

        <p class="ch-text">당신의 원국 8글자를 이 원리로 분석했을 때, 가장 압도적인 비율을 차지하는 주력 운영체제는 <b>[${mainSip}]</b>입니다.</p>
        
        <div style="padding: 25px; border-left: 4px solid var(--gold); background: #111; margin-top: 25px;">
            <p style="margin-top: 0; color: var(--gold); font-size: 16px; font-weight: 800;">주력 페르소나 (Primary OS): [${mainSip}]</p>
            <p style="margin: 0; color: #ddd; line-height: 1.8;">${sipText}</p>
        </div>
    </div>`;
}
function buildChapter4_Full(data) {
    let jaeCount = (data.sipseong['정재'] || 0) + (data.sipseong['편재'] || 0);
    let sikCount = (data.sipseong['식신'] || 0) + (data.sipseong['상관'] || 0);
    let wealthNarrative = "";
    
    if(jaeCount === 0 && sikCount > 0) {
        wealthNarrative = "<b>[식상생재의 역설]</b> 당신은 돈을 담는 그릇(재성)보다 돈을 만들어내는 공장(식상)이 압도적으로 강합니다. 돈을 직접 쫓으면 도망가지만, 당신의 '전문성'과 '브랜드'의 퀄리티를 극한으로 끌어올리면 돈이 그림자처럼 따라오는 전형적인 전문가 사주입니다.";
    } else if(jaeCount === 0) {
        wealthNarrative = "<b>[무재(無財)의 미학]</b> 명예나 학문(인성, 관성)을 쥐었을 때 부가 폭발하는 구조입니다. 내가 일해서 버는 돈이 아니라, '내 이름값'과 '권리(문서)'가 돈을 벌어오게 만드는 시스템 수입이 절대적으로 필요합니다.";
    } else if(jaeCount >= 2 && sikCount === 0) {
        wealthNarrative = "<b>[재다신약의 늪 탈출기]</b> 돈 냄새를 맡는 감각은 천부적이지만, 그것을 내 금고로 끌고 올 파이프라인(식상)이 부족합니다. 혼자서 1부터 10까지 다 하려 하지 마십시오. 기술을 가진 동업자나 자동화 시스템을 통해 레버리지를 일으켜야 금고가 닫힙니다.";
    } else {
        wealthNarrative = "<b>[재물의 선순환]</b> 돈을 만들어내는 엔진(식상)과 담는 그릇(재성)의 밸런스가 좋습니다. 리스크가 큰 한탕주의보다는 스노우볼 전략에 최적화되어 있습니다. 자본이 자본을 낳는 구조를 설계하는 데 탁월한 능력을 발휘할 것입니다.";
    }

    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 4. 부(富)의 스케일과 재물 유통망</h3>
        <p class="ch-text">재물운이란 단순히 통장에 찍히는 액수가 아닙니다. <b>내가 세상을 통제하고 지배하는 힘의 크기</b>입니다.</p>
        <p class="ch-text" style="color: #fff; background: rgba(199, 167, 106, 0.05); border: 1px solid rgba(199, 167, 106, 0.3); padding: 25px; border-radius: 8px;">${wealthNarrative}</p>
        <p class="ch-text">부를 축적하는 데 있어 당신에게 가장 치명적인 함정은 '남의 성공 방정식을 따라 하는 것'입니다. 당신의 사주 구조에 맞는 수익 모델(근로 소득, 투자 소득, 혹은 지적 재산)을 정확히 타겟팅해야 합니다.</p>
    </div>`;
}

function buildChapter5_Full(data) {
    let gwanCount = (data.sipseong['정관'] || 0) + (data.sipseong['편관'] || 0);
    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 5. 당신의 전장 (직업과 사회적 성취)</h3>
        <p class="ch-text">물고기 사주를 타고났다면 바다로 가야 합니다. 아무리 뛰어난 재능도 맞지 않는 척박한 땅(전장)에서는 고사하고 맙니다.</p>
        <p class="ch-text">${gwanCount > 0 ? "당신은 명예와 타이틀(관성)이 절대적인 동기부여가 됩니다. 피라미드의 꼭대기를 향해 올라가는 치열한 조직 사회, 혹은 나만의 확고한 시스템과 규율이 있는 곳에서 빛을 발합니다." : "당신은 조직의 톱니바퀴로 쓰이기엔 너무 큰 야생성을 가졌습니다. 상명하복의 위계질서보다는, 성과로 즉각 증명하고 내 권한이 100% 보장되는 독립적인 프리랜서나 창업 생태계가 당신의 진짜 무대입니다."}</p>
    </div>`;
}

function buildChapter6_Full(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 6. 인연법: 영혼을 깨우는 파트너십</h3>
        <p class="ch-text">일지(日支)는 당신의 안방입니다. 세상의 모든 갑옷을 벗고, 가장 취약한 민낯을 드러낼 때 당신을 받아줄 인연의 코드가 이곳에 암호화되어 있습니다.</p>
        <p class="ch-text" style="border-left: 3px solid var(--gold); padding-left: 20px; color: #ddd; font-style: italic;">${dbEntry.love || '서로의 부족한 오행을 스펀지처럼 채워주며, 함께 있을 때 사회적 성취의 시너지가 극대화되는 인연을 만나게 됩니다.'}</p>
    </div>`;
}

function buildChapter7_Full(data) {
    let hiddenStems = BRANCH_HIDDEN[data.dayBranch] || [];
    let hiddenSip = hiddenStems.map(h => getSipseong(data.dayStem, h)).join(', ');
    
    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 7. 엑스칼리버 (지장간에 숨겨진 무기)</h3>
        <p class="ch-text">빙산의 일각처럼 겉으로 드러난 사주 8글자 밑에는 <b>'지장간(地藏干)'</b>이라는 거대한 무기고가 숨겨져 있습니다. 평소에는 봉인되어 있다가, 인생의 결정적인 위기 순간에만 튀어나와 판을 뒤집는 당신의 진짜 본능입니다.</p>
        <div style="background: #111; padding: 25px; margin-top: 20px; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; color: #888; font-size: 13px;">당신의 일지(${data.dayBranch}) 지장간 분석</p>
            <p style="margin: 0; color: var(--gold); font-size: 20px; font-weight: 800;">잠재된 본능: [ ${hiddenSip} ]</p>
            <p style="margin: 15px 0 0 0; color: #ccc; line-height: 1.7;">이 숨겨진 ${hiddenSip}의 기운은 당신이 막다른 골목에 몰렸을 때 비상식적인 돌파력을 제공합니다. 남들이 포기할 때, 당신의 영혼 밑바닥에서 이 서늘한 결단력이 깨어날 것입니다.</p>
        </div>
    </div>`;
}

function buildChapterHealth_Full(data) {
    const score = data.healthScore || 50;
    let weakEl = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] < data.wuxing[b] ? a : b);
    let strongEl = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] > data.wuxing[b] ? a : b);
    
    const EL_HEALTH = {
        "wood": "간과 신경계",
        "fire": "심장과 혈관",
        "earth": "위장과 비장",
        "metal": "폐와 호흡기",
        "water": "신장과 호르몬"
    };

    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 8. 육체의 마지노선 (건강과 생명력)</h3>
        <p class="ch-text">사주는 단순한 점술이 아니라 고대 동양의 정밀한 예방의학입니다. 에너지가 쏠리면 장기가 타격을 받습니다.</p>
        <p class="ch-text">당신은 몸을 연료로 태워 성과를 사들이는 타입입니다. 특히 과부하가 걸렸을 때 가장 먼저 무너지는 마지노선은 <b>[${EL_HEALTH[weakEl]}]</b>입니다. 반대로 <b>[${EL_HEALTH[strongEl]}]</b> 쪽은 열이 너무 쌓여 문제를 일으킬 수 있습니다.</p>
        <p class="ch-text" style="color: #e74c3c; font-weight: 700;">멈춰야 할 때 멈추는 것이 당신 인생에서 가장 큰 용기입니다.</p>
    </div>`;
}

function buildChapter9_Full(data) {
    let gongmang = data.gongmang || '-';
    let gmSip = gongmang.split('').map(c => typeof getSipseong === 'function' ? getSipseong(data.dayStem, c) : '').join(', ');
    
    return `
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 9. 공망(空亡): 결핍의 원리와 역발상</h3>
        <p class="ch-text">명리학에서 <b>공망(空亡)</b>은 하늘이 비어있다는 뜻입니다. 천간(하늘의 기운)은 10개인데 지지(땅의 기운)는 12개입니다. 이들을 순서대로 짝짓다 보면 필연적으로 2개의 지지가 짝을 찾지 못하고 남게 되는데, 이를 공망이라 부릅니다.</p>
        <p class="ch-text">당신의 일주(${data.dayStem}${data.dayBranch})를 기준으로 짝을 맞추어 보면, <b>[${gongmang}]</b> 두 글자가 짝이 없는 공망의 상태가 됩니다. 이 두 글자에 해당하는 십성이 바로 <b>[${gmSip}]</b>입니다.</p>
        <p class="ch-text">과거에는 이를 흉살로 보았으나, 현대 명리학에서는 이를 <b>'평생을 관통하는 갈증과 동기부여'</b>로 해석합니다. 채워지지 않기에 끝없이 갈구하고, 그 갈구하는 힘이 당신을 남들보다 높은 곳으로 밀어 올리는 로켓의 분사구가 됩니다.</p>
        <div class="axe-advice" style="border-left-color: #9b59b6;">
            이 결핍(${gmSip})을 완벽하게 채우려 집착하지 마십시오. 비어있기 때문에 새로운 것을 담을 수 있는 당신만의 무한한 공간입니다.
        </div>
    </div>`;
}
function buildChapter10_Full(data) {
    let html = `<div class="report-chapter" style="margin-bottom: 80px;">
        <h3 class="ch-title">Chapter 10. 시간의 파동 (대운, 세운, 그리고 원국의 충돌)</h3>
        <p class="ch-text">사주 팔자(8글자)가 당신이 태어날 때 지어진 '집'이라면, <b>운(運)</b>은 밖에서 불어오는 '날씨와 바람'입니다. 대운(10년), 세운(1년), 월운(1개월)이라는 우주의 시간이 흘러오면서 당신의 원국 8글자와 부딪치고(충), 섞이고(합), 깨지면서(파) 인생의 다양한 사건 사고가 발생합니다.</p>
        
        <ul style="color: #bbb; line-height: 2.0; font-size: 15px; margin-bottom: 30px; background: rgba(255,255,255,0.02); padding: 20px 40px; border-radius: 8px;">
            <li><b>대운(大運):</b> 10년마다 바뀌는 거대한 기후 변화. 내 인생의 무대 전체가 봄에서 여름으로 바뀌는 것과 같은 환경적 셋업.</li>
            <li><b>세운(歲運):</b> 매년 들어오는 1년짜리 기상청 예보. 올해 당장 내게 떨어지는 구체적이고 현실적인 체감 사건.</li>
            <li><b>작용 원리:</b> 운에서 들어오는 글자가 내 원국의 글자와 만나 <b>합(合)</b>을 하면 사람/돈/문서가 묶이거나 들어오고, <b>충(沖)</b>을 하면 기존의 것이 깨지거나 강력한 이동/변화가 일어납니다.</li>
        </ul>

        <h4 style="color: var(--gold); margin: 50px 0 20px; font-size: 24px; border-bottom: 1px solid #333; padding-bottom: 10px;">[거시적 기후 변화: 10년 대운(大運)]</h4>
        <p class="ch-text" style="color:#aaa;">대운은 내 인생을 둘러싼 거대한 10년짜리 기상도입니다.</p>`;
    
    // 대운 전체 출력 (183페이지 분량의 체감을 주는 무한 루프)
    const daewunList = data.daewunList || [];
    daewunList.slice(0, 8).forEach((dy, idx) => {
        let isCurrent = (new Date().getFullYear() - 1988 + 1 >= dy.age) && (new Date().getFullYear() - 1988 + 1 < dy.age + 10);
        let currentTag = isCurrent ? '<span style="background:var(--gold); color:#000; padding:2px 8px; font-size:10px; border-radius:10px; margin-left:10px;">현재 진행 중인 대운</span>' : '';
        
        html += `
        <div style="margin-bottom: 25px; padding: 25px; background: ${isCurrent ? 'rgba(199, 167, 106, 0.05)' : '#0a0a0a'}; border-left: 4px solid ${isCurrent ? 'var(--gold)' : '#333'}; border-radius: 5px; border-top: 1px solid #1a1a1a;">
            <p style="color: ${isCurrent ? 'var(--gold)' : '#fff'}; font-weight: 500; margin-bottom: 10px; font-size: 18px;">
                ${dy.age}세 ~ ${dy.age+9}세 : [${dy.gan}${dy.zi} 대운] ${currentTag}
            </p>
            <p style="margin: 0; color: #888; font-size: 13px; margin-bottom: 15px;">유입 에너지: ${dy.sip.replace(' / ', ', ')} | 우주적 상태: 12운성 ${dy.unsung}</p>
            <p style="margin: 0; color: #ddd; line-height: 1.8;">이 10년은 밖에서 불어오는 <b>${dy.sip.split(' / ')[0]}</b>(천간)과 <b>${dy.sip.split(' / ')[1]}</b>(지지)의 에너지가 당신의 원국(${data.dayStem}${data.dayBranch})과 격렬하게 반응하는 시기입니다. 당신의 영혼(일간 ${data.dayStem})은 12운성 <b>${dy.unsung}</b>의 단계에 놓이게 되며, 외부 환경의 압력을 어떻게 내 무기로 흡수하느냐가 이 10년의 성패를 가릅니다.</p>
        </div>`;
    });

    html += `<h4 style="color: var(--gold); margin: 60px 0 20px; font-size: 24px; border-bottom: 1px solid #333; padding-bottom: 10px;">[미시적 전술 지도: 향후 10년 세운(歲運)과 합충 분석]</h4>
        <p class="ch-text" style="color:#aaa;">세운은 올해 당장 내 눈앞에 떨어지는 현실적인 사건 사고를 의미합니다.</p>`;
        
    // 세운 출력
    const sewunList = data.sewunList || [];
    sewunList.forEach((sy, idx) => {
        let isThisYear = sy.year === new Date().getFullYear();
        let yt = isThisYear ? 'background: rgba(199,167,106,0.1); border: 1px solid var(--gold);' : 'background: #0a0a0a; border: 1px solid #222;';
        
        // 간단한 충(沖) 원리 표시 
        let hasChung = false;
        let branchChung = {"子":"午","午":"子","丑":"未","未":"丑","寅":"申","申":"寅","卯":"酉","酉":"卯","辰":"戌","戌":"辰","巳":"亥","亥":"巳"};
        if(branchChung[data.dayBranch] === sy.zi) hasChung = true;

        let actionText = hasChung 
            ? `올해 들어오는 <b>${sy.zi}(${HAN_KOR[sy.zi]||''})</b>의 기운이 당신의 일지 <b>${data.dayBranch}(${HAN_KOR[data.dayBranch]})</b>와 정면으로 충돌(沖)합니다. 안방이나 직장에 강한 변동성(이동, 이직, 이별 등)이 발생할 수 있는 역동적인 해입니다.`
            : `올해는 <b>${sy.sip.split(' / ')[1]}</b>의 기운이 지배적입니다. 이 에너지가 당신의 원국에 안착하면서 해당 십성(결과물, 명예, 활동력 등)에 관련된 현실적 사건이 터집니다.`;

        html += `
        <div style="margin-bottom: 15px; padding: 20px; border-radius: 8px; ${yt}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: ${isThisYear ? 'var(--gold)' : '#fff'}; font-size: 18px; font-weight: 800;">${sy.year}년 (${sy.gan}${sy.zi}년)</span>
                <span style="color: #666; font-size: 12px; font-weight: 700;">${sy.sip.replace(' / ', ' · ')} | ${sy.unsung}</span>
            </div>
            <p style="margin: 0; color: #ccc; font-size: 14px; line-height: 1.7;">${actionText}</p>
        </div>`;
    });
    
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
                <span style="font-size: 42px; color: ${score < 50 ? '#e74c3c' : 'var(--gold)'}; font-weight: 500;">${score}점</span><br>
                <span style="color: #aaa; font-size: 13px;">상태: ${status}</span>
            </div>
            <p class="ch-text" style="font-size: 14.5px; line-height: 1.8; color: #ddd;">${remedy}</p>
        </div>
        <p class="ch-text">"몸은 마음의 그릇입니다." 오행의 불균형을 다스리는 식이요법과 생활 습관이 당신의 운명을 바꾸는 가장 빠른 지름길임을 잊지 마십시오.</p>
    </div>`;
}

function buildChapter_EnergyDensity(data) {
    const mainEl = RELATION_LABELS[HAN_COLOR[data.dayStem]];
    const ratio = Math.round(data.strengthRatio);
    const strength = data.strengthText;
    
    let advice = "";
    if(strength === "신강") advice = "당신은 거대한 댐과 같은 에너지를 가졌습니다. 스스로를 가두지 말고 흘려보낼 곳(식상, 재성)을 찾아야 성공합니다.";
    else if(strength === "신약") advice = "당신은 섬세한 안테나와 같습니다. 주변의 자극을 차단하고 나를 지탱해줄 뿌리(인성, 비겁)를 단단히 내려야 합니다.";
    else advice = "균형 잡힌 저울과 같은 상태입니다. 어떤 상황에서도 중도를 지키며 최선의 선택을 내릴 수 있는 강점이 있습니다.";

    return `
    <div class="report-chapter">
        <h3 class="ch-title">02. 에너지 밀도: [${mainEl}]의 [${strength}]</h3>
        <p class="ch-text">당신의 근본 자아는 <b>${mainEl}</b> 기운이며, 현재 <b>${ratio}%</b>의 밀도로 [${strength}] 상태를 유지하고 있습니다.</p>
        <div class="axe-advice" style="border-left-color: #4e87d9; background: rgba(78, 135, 217, 0.05);">
            ${advice}
        </div>
    </div>`;
}

function buildChapter_Wealth(data) {
    const sip = data.sipseong;
    const wealthPower = (sip['편재']||0) + (sip['정재']||0);
    const outputPower = (sip['식신']||0) + (sip['상관']||0);
    
    let wealthNarrative = "";
    if(wealthPower > 0 && outputPower > 0) wealthNarrative = "당신은 돈을 만드는 기술(식상)과 담는 그릇(재성)을 모두 가졌습니다. 성실함보다 '시스템'을 구축하는 데 집중하십시오.";
    else if(wealthPower > 0) wealthNarrative = "결과물에 대한 집착과 실속은 뛰어나나, 그 과정에서의 추진력이 부족할 수 있습니다. 동업자나 기술력을 보충하십시오.";
    else if(outputPower > 0) wealthNarrative = "재능은 넘치나 마무리가 약해 돈이 새어나갈 수 있습니다. 문서운(인성)을 활용해 자산을 묶어두는 전략이 필요합니다.";
    else wealthNarrative = "재물에 대한 욕심보다 명예나 전문성을 쫓을 때 오히려 큰 부가 따라오는 '무재(無財)'의 역설을 활용해야 합니다.";

    return `
    <div class="report-chapter">
        <h3 class="ch-title">03. 부의 설계: 재물 창출의 메커니즘</h3>
        <p class="ch-text">재물운은 단순히 돈이 들어오는 운이 아니라, 내가 세상을 향해 뻗는 **'소유의 촉수'**가 얼마나 강한지를 보는 것입니다.</p>
        <div class="axe-advice" style="border-left-color: #c7a76a; background: rgba(199, 167, 106, 0.05);">
            ${wealthNarrative}
        </div>
    </div>`;
}

function buildChapter_HealthMaster(data) {
    return buildChapterHealth_Full(data) + `
    <div class="report-chapter" style="margin-top:20px;">
        <h3 class="ch-title">04. 운명을 바꾸는 처방 (개운법)</h3>
        <p class="ch-text">사주는 숙명이 아닙니다. 나의 부족한 기운을 환경과 습관으로 채울 때 운명의 항로가 바뀝니다.</p>
        <div style="background:#111; padding:20px; border-radius:10px; border-left:4px solid var(--gold);">
            <p class="ch-text" style="margin:0;"><b>추천 솔루션:</b> 당신의 부족한 기운을 보완하기 위해 <b>${data.strengthText === '신약' ? '학문과 휴식(인성)' : '사회적 활동과 봉사(식상)'}</b>를 삶의 우선순위에 두십시오.</p>
        </div>
    </div>`;
}

function buildChapter_TimeFlow(data) {
    return buildChapter10_Full(data);
}
