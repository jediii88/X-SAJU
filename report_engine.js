
// --- X-SAJU DEEP REPORT GENERATOR ENGINE (MASSIVE V2) ---
// 대운(10년), 세운(1년), 합충형파해 무한 루프 제너레이터


const DAEWUN_STORY = {
    '비견': '독립과 자립의 10년입니다. 타인에게 의존하던 삶을 끝내고 온전히 내 힘으로 서야 합니다.',
    '겁재': '치열한 경쟁과 쟁탈의 10년입니다. 내 것을 빼앗기거나 남의 것을 뺏는 승부사적 기질이 필요합니다.',
    '식신': '내가 가진 재능이 세상에 자연스럽게 풀려나가는 10년입니다. 꾸준한 생산 활동이 부를 축적합니다.',
    '상관': '기존의 틀을 깨고 새로운 판을 벌리는 반항과 혁신의 10년입니다. 언행으로 인한 구설수를 조심하십시오.',
    '편재': '예상치 못한 큰돈이 굴러들어오거나 빠져나가는 롤러코스터 같은 10년입니다. 투기와 모험의 시간입니다.',
    '정재': '매달 꼬박꼬박 꽂히는 월급처럼 안정적이고 보수적인 재물 축적의 10년입니다. 가정이 안정됩니다.',
    '편관': '나를 극한까지 몰아붙이는 압박과 스트레스의 10년입니다. 하지만 이 고통을 견디면 압도적인 명예를 쥡니다.',
    '정관': '사회적인 시스템 안에서 내 자리를 확고히 잡는 10년입니다. 승진, 합격, 그리고 안정적인 직장이 주어집니다.',
    '편인': '눈에 보이지 않는 것(철학, 기술, 예술, 종교)에 심취하는 고독의 10년입니다. 특수한 자격증이 무기입니다.',
    '정인': '귀인의 도움을 받아 안정적으로 문서를 쥐는 10년입니다. 학업과 승진에 극도로 유리합니다.'
};

const SEWUN_STORY = {
    '합': '나의 환경이나 인간관계에 새로운 결합이 일어나는 해입니다. 미뤄왔던 계약이나 결혼에 유리합니다.',
    '충': '강력한 충돌로 인해 판이 뒤집히는 해입니다. 이직, 부서 이동, 이사 등 물리적인 이동이 필연적입니다.',
    '형': '스스로 깎고 다듬어야 하는 해입니다. 법적인 문제나 수술수 등 강제적인 조율이 일어날 수 있습니다.',
    '원진': '인간관계에서 알 수 없는 꼬임과 미움이 발생하는 해입니다. 대인관계의 거리를 두는 것이 상책입니다.'
};

const ILJU_STORY = {
    '갑자': '겨울 차가운 물에 뿌리를 내린 큰 나무입니다. 인내심이 강하고 지혜롭지만 겉으로는 차가워 보일 수 있습니다.',
    '을축': '얼어붙은 땅에 피어난 인동초입니다. 어떤 극한 환경에서도 끝내 살아남는 무서운 생명력과 끈기를 가졌습니다.',
    '병인': '태양이 떠오르는 동쪽 숲의 형상입니다. 에너지가 넘치고 시작을 주도하며 주변에 밝은 빛을 선사하는 리더격입니다.',
    '무진': '거대한 산맥 혹은 넓은 평야입니다. 속을 알 수 없을 정도로 깊고 넓으며, 만물을 품어내는 포용력과 고집이 공존합니다.',
    // ... 실제 60갑자 DB는 추후 외부 JSON으로 분리, 여기서는 동적 생성을 위한 베이스 로직에 집중
};

function generateDeepReport(data) {
    if(!data.dayStem) return;
    
    let html = '';
    html += buildIntro(data);       // 기본 원국 분석
    html += buildDaewunLoop(data);  // 대운 10년 주기 분석 (방대한 루프)
    html += buildSewunLoop(data);   // 향후 10년 세운 분석 (방대한 루프)
    html += buildWolunLoop(data);   // 올해 12개월 월운 분석
    html += buildHealth(data);      // 오행 기반 건강
    html += buildConclusion();      // 도끼의 최종 조언
    
    document.getElementById('report-container').innerHTML = html;
}

function buildIntro(data) {
    const ds = data.dayStem;
    const db = data.dayBranch;
    const ilju = ds + db;
    let story = ILJU_STORY[ilju] || `당신은 거대한 대지에 태어난 <b>${ds}${db}</b>의 기운을 품고 있습니다.`;

    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 1. 운명의 초상 (나의 본질과 무기)</h3>
            <p class="ch-text">${story} 당신의 현재 에너지 총량은 <b>${data.strengthText}</b> 상태입니다.</p>
            <p class="ch-text">이는 당신이 단순히 머무르는 존재가 아니라, 끊임없이 환경과 충돌하며 자신만의 영역을 개척해야 함을 의미합니다.</p>
        </div>
    `;
}

// 방대한 10년 주기 대운(Daewun) 생성 루프
function buildDaewunLoop(data) {
    // 실제로는 data.daewuns 배열에서 가져와야 함 (여기서는 시뮬레이션 데이터 생성)
    let daewuns = [];
    let startAge = 4; // 예시 대운수
    let currentYear = new Date().getFullYear();
    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    
    for(let i=0; i<8; i++) {
        let age = startAge + (i * 10);
        let dStem = stems[(stems.indexOf(data.dayStem) + i + 1) % 10]; // 임시 생성
        let dBranch = branches[(branches.indexOf(data.dayBranch) + i + 1) % 12]; // 임시 생성
        daewuns.push({ age: age, name: dStem+dBranch });
    }

    let html = `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 2. 내 인생의 10년 주기 테마 (대운 해부)</h3>
            <p class="ch-text">사람의 인생은 10년마다 바뀌는 거대한 환경의 지배를 받습니다. 이를 대운(大運)이라 합니다. 당신이 겪어온, 그리고 앞으로 겪을 10년 단위의 테마를 해부합니다.</p>
            <div class="timeline">
    `;

    daewuns.forEach(dw => {
        html += `
            <div class="timeline-item" style="margin-bottom: 20px; padding: 15px; background: #1a1a1a; border-left: 4px solid var(--gold); border-radius: 4px;">
                <h4 style="color: #fff; margin-bottom: 8px;">${dw.age}세 ~ ${dw.age+9}세: [${dw.name} 대운]</h4>
                <p style="color: #ccc; font-size: 14px; line-height: 1.6;">
                    이 10년은 당신에게 <b>'${dw.name}'</b>의 거대한 환경이 주어지는 시기입니다. 
                    기존의 낡은 껍질을 깨고 새로운 무대로 진입하는 강력한 변동의 에너지가 작용합니다. 
                    내부의 갈등(충/형)이 일어날 수 있으나, 이는 더 큰 도약을 위한 필수적인 성장통입니다.
                    직업적 이동이나 인간관계의 물갈이가 필연적으로 발생하며, 여기서 쥐게 되는 새로운 인연(귀인)이 다음 10년을 먹여 살립니다.
                </p>
            </div>
        `;
    });

    html += `</div></div>`;
    return html;
}

// 방대한 1년 주기 세운(Sewun) 생성 루프
function buildSewunLoop(data) {
    let currentYear = new Date().getFullYear();
    let html = `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 3. 향후 10년 운세 정밀 타격 (세운 해부)</h3>
            <p class="ch-text">대운이 10년의 기후라면, 세운(歲運)은 그해의 날씨입니다. 올해부터 향후 10년간 당신에게 어떤 비바람이 몰아치고 어떤 해가 뜰지 예측합니다.</p>
    `;

    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    
    // 2026년은 병오년
    let startStemIdx = 2; // 병
    let startBranchIdx = 6; // 오

    for(let i=0; i<10; i++) {
        let y = currentYear + i;
        let s = stems[(startStemIdx + i) % 10];
        let b = branches[(startBranchIdx + i) % 12];
        let sb = s+b;
        
        let insight = "";
        if(i===0) insight = "올해는 그동안 뿌려둔 씨앗이 폭발적으로 자라나는 시기입니다. 속도를 늦추지 마십시오.";
        else if(i===1) insight = "성장의 한계점에 도달해 숨을 고르는 해입니다. 무리한 투자는 피하고 내실을 다지십시오.";
        else if(i===4) insight = "인생의 큰 변곡점이 옵니다. 이직, 이사, 혹은 새로운 프로젝트의 시작이 기다리고 있습니다.";
        else insight = "평이한 흐름 속에서 당신의 기술과 전문성을 날카롭게 벼려야 하는 시기입니다.";

        html += `
            <div style="margin-bottom: 15px; border-bottom: 1px dashed #333; padding-bottom: 15px;">
                <div style="font-weight: bold; color: var(--gold); font-size: 16px;">${y}년 (${sb}년)</div>
                <p style="color: #ddd; font-size: 14px; margin-top: 5px;">${insight}</p>
            </div>
        `;
    }
    html += `</div>`;
    return html;
}

// 올해 12개월 월운 생성
function buildWolunLoop(data) {
    let html = `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 4. 올해 12개월 작전 지도 (월운)</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
    `;
    for(let m=1; m<=12; m++) {
        let msg = m % 3 === 0 ? "현상 유지 및 리스크 관리" : "적극적인 행동 및 기회 창출";
        let color = m % 3 === 0 ? "#888" : "var(--gold)";
        html += `
            <div style="background: #111; padding: 10px; border-radius: 4px; border-left: 2px solid ${color};">
                <span style="color:#fff; font-weight:bold;">${m}월:</span> <span style="color:#aaa; font-size:12px;">${msg}</span>
            </div>
        `;
    }
    html += `</div></div>`;
    return html;
}

function buildHealth(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 5. 운명의 지뢰밭 (건강과 리스크)</h3>
            <p class="ch-text">당신의 오행 밸런스를 볼 때, 마음이 지치면 특정 장기가 가장 먼저 타격을 받습니다. 멈춰야 할 때 멈추는 것도 능력입니다.</p>
        </div>
    `;
}

function buildConclusion() {
    return `
        <div class="report-chapter">
            <div class="axe-advice" style="border-left-color: var(--fire); background: #1a0f0f;">
                <h4 style="color: #fff; margin-bottom: 10px;">🔥 Axe의 최종 처방전</h4>
                <p style="color: #ddd;">
                    당신의 사주는 결코 평범하거나 순탄하게 흘러가는 구조가 아닙니다. 
                    사주에 있는 결핍(공망)과 충돌(형살)은 당신을 찌르는 가시가 아니라, 남들보다 더 치열하게 살아가게 만든 엔진이었습니다.
                    환경을 탓하지 마십시오. 당신은 환경을 지배할 권리가 있습니다.
                </p>
            </div>
        </div>
    `;
}
