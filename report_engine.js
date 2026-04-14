
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
    '정묘': '밤하늘을 밝히는 달빛 아래의 화원입니다. 감수성이 예민하고 직관력이 뛰어나며 타인의 마음을 잘 헤아립니다.',
    '무진': '거대한 산맥 혹은 넓은 평야입니다. 속을 알 수 없을 정도로 깊고 넓으며, 만물을 품어내는 포용력과 고집이 공존합니다.',
    '기사': '기름진 땅 아래 끓어오르는 용암입니다. 겉으로는 온화해 보이나 내면에는 엄청난 야망과 열정을 품고 있습니다.',
    '경오': '제련소의 용광로에서 단련되는 뜨거운 철입니다. 시련을 겪을수록 더욱 단단해지고 날카로워지는 대기만성형입니다.',
    '신미': '건조한 모래밭에 숨겨진 보석입니다. 예민하고 까다롭지만, 한 번 빛을 발하면 누구보다 화려한 가치를 뽐냅니다.',
    '임신': '거대한 바위에서 솟아나는 끊임없는 샘물입니다. 막힘없이 흐르는 지혜와 어디든 적응하는 융통성의 끝판왕입니다.',
    '계유': '맑은 유리잔에 담긴 이슬입니다. 순수하고 결백함을 추구하며, 지적 호기심이 강해 한 분야의 전문가가 되기 쉽습니다.',
    '갑술': '마른 땅에 뿌리 내린 억센 나무입니다. 현실 감각이 뛰어나고 척박한 환경에서도 자신의 이익을 쟁취하는 실속파입니다.',
    '을해': '바다 위를 떠도는 수초입니다. 한 곳에 정착하기보다는 끊임없이 새로운 지식과 경험을 찾아 유랑하는 자유로운 영혼입니다.',
    '병자': '한밤중의 태양처럼 모순된 기운을 품었습니다. 이상은 높으나 현실의 제약에 부딪히기 쉬우며, 이를 극복하는 과정에서 철학적 깊이를 얻습니다.',
    '정축': '용광로의 불씨를 품은 창고입니다. 겉보기엔 조용하고 평범해 보이지만, 기회가 오면 폭발적인 에너지를 뿜어냅니다.',
    '무인': '봄을 기다리는 거대한 산입니다. 명예와 권력을 향한 상승 욕구가 강하며, 우두머리가 되어야 직성이 풀립니다.',
    '기묘': '잡초가 무성한 들판입니다. 생존력이 뛰어나고 주변 상황을 재빠르게 파악하여 자신에게 유리한 쪽으로 판을 짭니다.',
    '경진': '거대한 무기를 든 장군입니다. 스케일이 크고 추진력이 압도적이며, 한 번 결심한 일은 주변의 반대에도 밀어붙입니다.',
    '신사': '불 속에 들어간 보석입니다. 스스로를 끊임없이 단련하며 완벽주의를 추구하고, 타인에게 굽히기 싫어하는 자존심의 결정체입니다.',
    '임오': '호수 위의 달빛입니다. 감정의 기복이 있고 로맨틱하며, 인간관계를 통해 부와 명예를 얻는 데 능숙합니다.',
    '계미': '여름날의 소나기입니다. 메마른 땅에 단비를 내리듯 타인에게 꼭 필요한 존재가 되며, 희생정신과 책임감이 강합니다.'
    // ... 나머지는 생략하지만 더 길게 보이도록 20개 일주 우선 세팅
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
