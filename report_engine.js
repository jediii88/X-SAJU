
// --- X-SAJU DEEP REPORT GENERATOR ENGINE (MEGA V3) ---
// 그링그링 대가의 183P PDF를 모사하는 초거대 텍스트 제너레이터

const MEGA_DB = {
    // 임시 더미 텍스트를 길게 뽑아내는 함수 (실제로는 사주 변수 결합)
    genPara: function(theme, val, length) {
        let base = "";
        if(theme === 'wealth') base = "재물에 관한 당신의 본질적인 태도는 매우 복합적입니다. 흔히 사주에서 재물을 논할 때 단순히 돈의 많고 적음만을 보지만, 명리학적 관점에서 재성은 '내가 통제할 수 있는 영역'을 의미합니다. 당신이 세상이라는 무대 위에서 어떻게 자산을 획득하고, 그것을 유지하며, 최종적으로 어떤 형태의 부를 축적할 것인지에 대한 설계도입니다. ";
        else if(theme === 'career') base = "직업과 사회적 무대는 당신의 에너지가 가장 강하게 발현되는 곳입니다. 월지의 기운을 바탕으로 볼 때, 당신은 짜여진 틀 안에서 단순 반복하는 업무에는 극도의 피로감을 느낍니다. 당신의 내면에는 스스로 판을 짜고 규칙을 만들어가려는 독립적인 기질이 강하게 자리 잡고 있습니다. ";
        else if(theme === 'love') base = "인간관계와 이성운에 있어서 당신은 특유의 매력과 방어기제를 동시에 지니고 있습니다. 누군가에게 마음을 열기까지 상당한 검증의 시간이 필요하지만, 한 번 내 바운더리 안에 들어온 사람에게는 무한한 책임감을 보여줍니다. 배우자 자리인 일지의 기운을 볼 때, 당신에게 필요한 사람은 당신의 속도를 통제하려 드는 사람이 아니라 묵묵히 지지해 주는 나무 같은 사람입니다. ";
        else if(theme === 'shinsal') base = "당신의 사주 원국에 내재된 신살과 공망은 당신의 삶을 역동적으로 만드는 숨은 엔진입니다. 남들은 평범하게 넘어갈 일도 당신에게는 특별한 사건으로 증폭되어 다가오는 이유가 여기에 있습니다. 결핍을 채우려는 무의식적인 갈망이 당신을 남들보다 더 높이 도약하게 만들었습니다. ";
        
        let result = base;
        for(let i=0; i<length; i++) {
            result += "당신의 원국에 나타난 " + val + "의 기운은 인생의 중요한 변곡점마다 작용하여, 때로는 위기를 기회로 바꾸고 때로는 순조로운 길에 예기치 않은 브레이크를 걸기도 합니다. 이는 단순히 길흉의 문제가 아니라, 당신의 그릇을 키우기 위한 우주의 담금질과 같습니다. ";
        }
        return result;
    }
};

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
    html += buildChapter_Shinsal(data);
    html += buildChapter_Health(data);
    html += buildChapter_Remedy(data); // 개운법
    
    html += buildSectionHeader("PART 4. 시간의 지배자 (대운과 세운)");
    html += buildDaewunLoop(data);
    html += buildSewunLoop(data);
    html += buildWolunLoop(data);
    
    document.getElementById('report-container').innerHTML = html;
}

function buildSectionHeader(title) {
    return `
        <div style="margin: 60px 0 30px 0; padding-bottom: 15px; border-bottom: 2px solid var(--gold);">
            <h2 style="color: var(--gold); font-size: 24px; font-family: 'Noto Serif KR', serif; letter-spacing: 2px;">${title}</h2>
        </div>
    `;
}

function buildChapter_Basic(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 1. 나의 본질과 영혼의 그릇</h3>
            <p class="ch-text">${MEGA_DB.genPara('wealth', data.dayStem + data.dayBranch, 3)}</p>
            <p class="ch-text">${MEGA_DB.genPara('career', '신강/신약', 2)} 당신의 에너지는 <b>${data.strengthText}</b>입니다.</p>
        </div>
    `;
}

function buildChapter_Wuxing(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 2. 오행의 세력과 나의 무기</h3>
            <p class="ch-text">${MEGA_DB.genPara('shinsal', '오행의 불균형', 4)}</p>
        </div>
    `;
}

function buildChapter_Sipseong(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 3. 사회적 가면과 내면의 욕망 (십성)</h3>
            <p class="ch-text">${MEGA_DB.genPara('career', '십성 밸런스', 4)}</p>
        </div>
    `;
}

function buildChapter_Wealth(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 4. 평생 재물운과 축적의 기술</h3>
            <p class="ch-text">${MEGA_DB.genPara('wealth', '재성(財星)', 5)}</p>
            <div class="axe-advice"><b>👉 재물 증식 전략:</b> 투기성 자본보다는 당신의 전문성을 담보로 한 시스템 수익을 노려야 합니다.</div>
        </div>
    `;
}

function buildChapter_Career(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 5. 최적의 직업과 사회적 성취</h3>
            <p class="ch-text">${MEGA_DB.genPara('career', '관성(官星)과 식상(食傷)', 4)}</p>
        </div>
    `;
}

function buildChapter_Love(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 6. 이성운과 나에게 맞는 배우자상</h3>
            <p class="ch-text">${MEGA_DB.genPara('love', '일지(배우자궁)', 4)}</p>
        </div>
    `;
}

function buildChapter_Shinsal(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 7. 나의 콤플렉스와 폭발력 (공망과 신살)</h3>
            <p class="ch-text">${MEGA_DB.genPara('shinsal', '공망의 결핍', 3)}</p>
        </div>
    `;
}

function buildChapter_Health(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 8. 신체 취약점과 건강 관리</h3>
            <p class="ch-text">${MEGA_DB.genPara('shinsal', '오행 태과', 2)}</p>
        </div>
    `;
}

function buildChapter_Remedy(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 9. 운명을 바꾸는 행동 지침 (개운법)</h3>
            <p class="ch-text">사주는 정해진 운명이 아니라, 나에게 주어진 패를 어떻게 효율적으로 쓸 것인가의 문제입니다. 행운의 컬러, 방향, 그리고 대인관계 처세술을 통해 불리한 기운을 상쇄할 수 있습니다.</p>
            <ul style="color: #ccc; line-height: 2; font-size: 15px;">
                <li><b>행운의 색상:</b> 블랙, 네이비, 그리고 다크 그린. 중요한 계약 시 이 색상을 활용하십시오.</li>
                <li><b>행운의 방향:</b> 북쪽과 동쪽. 책상이나 침대 머리맡을 이 방향으로 두면 에너지가 순환됩니다.</li>
                <li><b>행운의 숫자:</b> 1, 3, 6, 8.</li>
                <li><b>마인드 셋:</b> 타인의 인정에 목마를 때마다 스스로의 성취를 먼저 인정하십시오.</li>
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
        daewuns.push({ 
            age: startAge + (i * 10), 
            name: stems[(i+3)%10] + branches[(i+5)%12] 
        });
    }

    let html = `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 10. 대운(大運) 80년 심층 해부</h3>
            <p class="ch-text">당신 인생의 10년 단위 거대한 배경화면입니다.</p>
            <div class="timeline">
    `;

    daewuns.forEach(dw => {
        html += `
            <div class="timeline-item" style="margin-bottom: 25px; padding: 20px; background: #151515; border-left: 4px solid var(--gold); border-radius: 4px;">
                <h4 style="color: var(--gold); margin-bottom: 12px; font-size: 18px;">${dw.age}세 ~ ${dw.age+9}세 : [${dw.name} 대운]</h4>
                <p style="color: #ccc; font-size: 15px; line-height: 1.7; margin-bottom: 10px;">
                    ${MEGA_DB.genPara('wealth', dw.name, 2)}
                </p>
                <p style="color: #aaa; font-size: 14px; line-height: 1.6; background: #0a0a0a; padding: 10px; border-radius: 4px;">
                    <b>💡 핵심 요약:</b> 이 10년은 기존의 틀을 부수고 새로운 영토를 확장하는 시기입니다. 무리한 확장보다는 내실을 다지는 것이 유리합니다.
                </p>
            </div>
        `;
    });
    html += `</div></div>`;
    return html;
}

function buildSewunLoop(data) {
    let currentYear = new Date().getFullYear();
    let html = `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 11. 향후 10년 세운(歲運) 정밀 타격</h3>
            <p class="ch-text">당장 올해부터 10년 동안 일어날 구체적인 사건과 흐름입니다.</p>
    `;

    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    
    for(let i=0; i<10; i++) {
        let y = currentYear + i;
        let sb = stems[(2+i)%10] + branches[(6+i)%12]; // 2026 병오년 기준
        html += `
            <div style="margin-bottom: 20px; border-bottom: 1px dashed #333; padding-bottom: 20px;">
                <div style="font-weight: bold; color: #fff; font-size: 17px; margin-bottom: 8px;">${y}년 (${sb}년)</div>
                <p style="color: #ccc; font-size: 15px; line-height: 1.7;">
                    ${MEGA_DB.genPara('career', sb, 1)} 올해는 주변 사람들과의 협력이 무엇보다 중요하며, 성급한 결정은 구설수를 낳을 수 있습니다.
                </p>
            </div>
        `;
    }
    html += `</div>`;
    return html;
}

function buildWolunLoop(data) {
    let html = `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 12. ${new Date().getFullYear()}년 12개월 작전 지도</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
    `;
    for(let m=1; m<=12; m++) {
        html += `
            <div style="background: #111; padding: 15px; border-radius: 4px; border-left: 2px solid var(--gold);">
                <div style="color:#fff; font-weight:bold; margin-bottom: 5px;">${m}월의 기운</div>
                <div style="color:#aaa; font-size:14px; line-height: 1.5;">${MEGA_DB.genPara('shinsal', m+'월', 0)} 이번 달은 불필요한 지출을 막고 건강 관리에 신경 써야 하는 달입니다. 타인과의 언쟁을 피하십시오.</div>
            </div>
        `;
    }
    html += `</div></div>`;
    return html;
}
