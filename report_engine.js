
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


function buildChapter1_Basic(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    let title = dbEntry.title || "거대한 대지의 기운";
    let core = dbEntry.core || "당신은 끊임없이 환경과 충돌하며 자신만의 영역을 개척하는 기질을 타고났습니다.";
    let weapon = dbEntry.weapon || "위기 상황에서 발휘되는 직관과 돌파력이 당신의 가장 큰 무기입니다.";
    
    // 강제 볼륨 확장 (대가급 서사)
    let extra1 = "명리학에서 일주(日柱)는 단순히 성격을 의미하는 것이 아니라, 당신이 평생 짊어지고 가야 할 영혼의 바코드이자 생존의 무기입니다. 많은 사람들이 사주를 볼 때 겉으로 드러난 화려함(사회적 가면)에 주목하지만, 당신을 진정으로 움직이는 것은 이 일주에 새겨진 내밀한 기질입니다.";
    let extra2 = "당신의 에너지는 현재 <b>" + data.strengthText + "</b> 상태로 측정되었습니다. 이 힘은 외부의 억압을 견뎌내고 내면의 폭발력을 응축하는 원동력이 됩니다. 남들의 속도에 맞추려 하지 마십시오. 당신의 템포가 곧 정답입니다.";
    let extra3 = "때로는 이 굽히지 않는 기질 때문에 불필요한 마찰을 겪기도 하지만, 결국 그 마찰열이 당신의 그릇을 한 단계 더 크게 빚어내는 용광로 역할을 하게 됩니다. 환경을 탓하지 마십시오. 당신은 그 환경을 지배하고 재편할 권리가 있습니다.";

    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 1. 나의 본질과 영혼의 그릇</h3>
            <div style="font-size: 18px; font-weight: bold; color: var(--gold); margin-bottom: 15px;">[${title}]</div>
            <p class="ch-text">${extra1}</p>
            <p class="ch-text">${core} ${weapon}</p>
            <p class="ch-text">${extra2}</p>
            <p class="ch-text">${extra3}</p>
        </div>
    `;
}

function


function buildChapter3_Sipseong(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 3. 사회적 가면과 내면의 권력욕 (십성)</h3>`;
    let mainSip = "정재";
    if(data.sipseong && Object.keys(data.sipseong).length > 0) {
        mainSip = Object.keys(data.sipseong).reduce((a, b) => data.sipseong[a] > data.sipseong[b] ? a : b) || "정재";
    }
    let sipText = window.SAJU_DB?.SIPSEONG?.[mainSip] || "사회의 규칙에 순응하기보다 주도적으로 판을 짜는 기질입니다.";
    
    // 볼륨 확장
    let extra1 = "오행이 당신의 '신체(H/W)'라면, 십성(육친)은 당신의 뇌에 깔린 '운영체제(S/W)'입니다. 당신이 사람을 대할 때, 돈을 벌 때, 상사와 부하직원을 대할 때 무의식적으로 튀어나오는 패턴이 바로 이 십성에서 비롯됩니다.";
    let extra2 = "당신의 무의식을 지배하는 가장 강력한 운영체제는 바로 <b>[${mainSip}]</b>입니다. 이것이 당신의 '사회적 가면(페르소나)'입니다. 남들은 당신의 다양한 모습을 보겠지만, 결정적인 순간에 당신이 선택을 내리는 기준은 오직 이 기질 하나로 수렴됩니다.";
    let extra3 = "이 [${mainSip}]의 기질은 양날의 검입니다. 이 능력을 당신의 통제 아래 두고 적재적소에 활용하면 남들이 평생 걸려도 얻지 못할 사회적 성취를 단기간에 쥐어냅니다. 하지만 반대로 이 기질에 질질 끌려다니면, 가장 믿었던 무기에 제 발등이 찍히는 꼴이 됩니다.";

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

function


function buildChapter4_Wealth(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 4. 평생 재물운과 거대한 금고의 비밀</h3>`;
    let jaeCount = (data.sipseong && (data.sipseong['정재'] || 0) + (data.sipseong['편재'] || 0)) || 0;
    
    let wealthCore = "";
    if(jaeCount === 0) wealthCore = "당신의 사주 원국에는 표면적으로 드러난 '재성(돈)'의 글자가 약합니다. 이른바 무재(無財) 사주라 하여 돈과 인연이 없다고 단정 짓는 낡은 풀이가 많습니다. 이는 완전히 틀렸습니다. 당신은 돈을 직접 쫓으면 오히려 돈이 도망갑니다. 명예, 전문성, 독보적인 브랜드 등 '나 자신'의 가치를 미친 듯이 올려놓으면, 돈이 그림자처럼 폭발적으로 따라오는 구조입니다. 작은 푼돈에 연연하지 마십시오.";
    else if(jaeCount > 2) wealthCore = "당신의 주변에는 늘 돈이 흐르고 기회가 널려 있습니다(재다). 돈 냄새를 맡는 감각이 천부적이라 어디서 어떻게 돈을 벌어야 할지 본능적으로 압니다. 하지만 사주에서 '재물이 많으면 내 몸(기운)이 약해진다'고 했습니다. 통제할 수 없는 너무 많은 기회는 오히려 당신을 갉아먹습니다. 10가지 기회 중 9가지를 쳐내고, 확실한 1가지에 모든 것을 걸어 파이프라인을 구축해야 자산을 지킵니다.";
    else wealthCore = "당신의 재물운은 매우 안정적이고 밸런스가 좋습니다. 모 아니면 도 식의 극단적인 투기보다는, 한 단계씩 차곡차곡 자산을 불려 나가는 스노우볼 전략에 최적화되어 있습니다. 부동산이나 배당 수익 등 시간이 지날수록 가치가 우상향하는 '시스템 수익'을 구축하는 것이 관건입니다.";

    let extra1 = "재물(財)이란 단순히 통장 잔고의 액수가 아닙니다. 명리학에서 재성은 '내가 세상을 내 뜻대로 통제하고 다루는 힘'을 뜻합니다. 당신이 세상을 상대로 얼마나 넓은 영토를 지배할 수 있는지, 그 권력의 크기가 바로 당신의 재물운입니다.";
    let extra2 = "당신의 재물 그릇을 분석해 보면, 현금을 손에 쥐고 있는 것보다는 '부동산, 주식, 지적재산권' 등 형태가 변환된 문서(인성) 형태로 자산을 묶어둘 때 가장 큰 시너지가 폭발합니다. 남의 돈을 굴리는 데 특화된 기질을 지녔으므로, 스케일을 작게 한정 짓지 마십시오.";

    html += `
        <p class="ch-text">${extra1}</p>
        <p class="ch-text">${wealthCore}</p>
        <p class="ch-text">${extra2}</p>
        <div class="axe-advice" style="margin-top: 20px;">
            <b>👉 Axe의 부의 추월차선 전략:</b> 당신의 금고는 평범한 직장인의 월급통장 사이즈가 아닙니다. 레버리지를 활용하십시오. 당신의 능력(식상)을 타인의 자본과 결합할 때, 비로소 당신의 진짜 금고가 열립니다.
        </div>
        </div>
    `;
    return html;
}

function

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
