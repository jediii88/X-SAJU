
// --- X-SAJU DEEP REPORT GENERATOR ENGINE ---
// 방대한 1인칭 사주 풀이 텍스트 제너레이터

function generateDeepReport(data) {
    if(!data.dayStem) return;
    
    let html = '';
    html += buildChapter1(data);
    html += buildChapter2(data);
    html += buildChapter3(data);
    html += buildChapter4(data);
    html += buildChapter5(data);
    
    document.getElementById('report-container').innerHTML = html;
}

function buildChapter1(data) {
    const ds = data.dayStem;
    const str = data.strengthText;
    
    let stemStory = "";
    if("갑을".includes(ds)) stemStory = "당신은 본질적으로 하늘을 향해 곧게 뻗어나가려는 거대한 나무(木)의 기질을 타고났습니다. 남의 밑에 들어가기보다는 스스로 판을 짜고 주도권을 쥐어야 직성이 풀리는 개척자입니다.";
    else if("병정".includes(ds)) stemStory = "당신은 세상을 밝히고 만물을 길러내는 뜨거운 불꽃(火)입니다. 열정과 표현력이 남달라 어디를 가든 사람들의 시선을 끌어모으지만, 그만큼 내면의 에너지가 빠르게 소모되는 불꽃의 숙명을 안고 있습니다.";
    else if("무기".includes(ds)) stemStory = "당신은 모든 것을 품어내는 넓고 묵묵한 대지(土)의 성향을 지녔습니다. 요란하게 자신을 드러내지 않지만, 주변 사람들이 가장 먼저 기대고 의지하는 강력한 중심점(Anchor) 역할을 합니다.";
    else if("경신".includes(ds)) stemStory = "당신은 예리하게 벼려진 칼날 혹은 단단한 바위(金)와 같습니다. 불필요한 인간관계를 단호하게 끊어내고, 자신이 옳다고 믿는 길을 향해 흔들림 없이 돌진하는 무서운 결단력의 소유자입니다.";
    else if("임계".includes(ds)) stemStory = "당신은 어떤 그릇에든 자신의 모습을 맞출 수 있는 물(水)의 융통성과 깊은 지혜를 가졌습니다. 겉으로는 부드러워 보이나, 한 번 둑이 터지면 모든 것을 쓸어버릴 수 있는 폭발적인 잠재력을 숨기고 있습니다.";

    let strStory = "";
    if(str === '신강') strStory = "특히 당신의 에너지는 일반적인 수준을 아득히 뛰어넘는 <b>'신강(身强)'</b>한 상태입니다. 이는 낡은 규칙이나 타인의 조언에 얽매일 필요가 없음을 뜻합니다. 당신의 직관이 곧 정답이며, 타인과 타협하려 할수록 오히려 당신의 진짜 가치가 훼손됩니다. 남들에게 기대지 말고, 당신만의 왕국을 건설하십시오.";
    else if(str === '신약') strStory = "당신의 에너지는 거센 비바람에도 부러지지 않는 갈대와 같은 <b>'신약(身弱)'</b>의 유연함을 띠고 있습니다. 무모하게 혼자 벽에 돌진하기보다는, 주변의 환경과 사람을 나의 무기로 활용하는 고도의 정치력과 융통성이 당신의 진짜 무기입니다. 홀로 싸우지 마십시오. 당신은 판을 읽고 조율하는 지휘관입니다.";
    else strStory = "당신의 에너지는 어느 한쪽으로 치우치지 않고 절묘한 밸런스를 유지하는 <b>'중화(中和)'</b>의 상태입니다. 극단적인 상황에서도 이성을 잃지 않는 이 평정심은 혼돈 속에서 빛을 발합니다.";

    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 1. 운명의 초상 (나의 본질과 무기)</h3>
            <p class="ch-text">${stemStory}</p>
            <p class="ch-text">${strStory}</p>
        </div>
    `;
}

function buildChapter2(data) {
    const jaeTotal = (data.sipseong['정재'] || 0) + (data.sipseong['편재'] || 0);
    const sikTotal = (data.sipseong['식신'] || 0) + (data.sipseong['상관'] || 0);
    
    let wealthStory = "";
    if (jaeTotal === 0) {
        wealthStory = "당신의 사주 원국에는 표면적으로 드러난 '재물(財)'의 글자가 없습니다. 흔히 이를 <b>'무재(無財) 사주'</b>라 부르며 돈과 인연이 없다고 오해하지만, 이는 완전히 틀린 해석입니다. 당신은 눈앞의 작은 푼돈을 쫓을 때 오히려 돈이 도망가는 구조입니다. 명예, 전문성, 혹은 당신만의 확고한 브랜드를 구축하면 돈은 마치 그림자처럼 자연스럽게, 그리고 폭발적으로 따라오게 되어 있습니다.";
    } else if (jaeTotal > 3) {
        wealthStory = "당신의 주변에는 늘 돈이 흐르고 기회가 널려 있는 <b>'재다(財多)'</b>의 형국입니다. 돈 냄새를 맡는 감각은 천부적입니다. 하지만 '재물이 많으면 오히려 내 몸이 약해진다'는 명리학의 철칙처럼, 통제할 수 없는 너무 많은 기회는 오히려 당신의 에너지를 갉아먹습니다. 선택과 집중이 당신의 자산을 지키는 유일한 열쇠입니다.";
    } else if (sikTotal > 0 && jaeTotal > 0) {
        wealthStory = "당신은 내 아이디어와 능력(식상)을 돈(재성)으로 직접 환전해 내는 <b>'식상생재(食傷生財)'</b>의 이상적인 흐름을 가지고 있습니다. 가만히 앉아서 월급을 받기보다는, 끊임없이 무언가를 기획하고 만들어내며 부를 창출해 내는 실전형 사업가 혹은 탁월한 기획자의 기질이 다분합니다.";
    } else {
        wealthStory = "당신의 재물운은 매우 안정적이고 보수적인 흐름을 보입니다. 한 방을 노리는 투기성 자본보다는, 눈덩이처럼 차곡차곡 불어나는 스노우볼 형태의 자산 증식이 당신의 운명에 가장 잘 맞습니다.";
    }

    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 2. 재물의 지도 (나의 금고와 자산 증식)</h3>
            <p class="ch-text">${wealthStory}</p>
            <div class="axe-advice">
                <b>👉 Axe의 조언:</b> 돈을 벌고 싶다면 돈을 쫓지 마십시오. 당신의 결핍을 '가치'로 치환해 사람들에게 제공할 때, 재물은 폭포수처럼 쏟아질 것입니다.
            </div>
        </div>
    `;
}

function buildChapter3(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 3. 사회적 무대 (내가 빛나는 환경)</h3>
            <p class="ch-text">
                명리학에서 가장 강력한 환경을 뜻하는 월지(태어난 달), 당신은 <b>${data.monthBranch}</b>월의 기운을 받고 태어났습니다.
                이는 당신이 평범한 사무실 책상 앞보다는, 당신만의 권한이 확실하게 보장된 독자적인 무대나, 전문성이 극대화되는 특수한 환경에서 일할 때 10배 이상의 퍼포먼스를 냄을 의미합니다. 
                누군가의 부품으로 소모되지 마십시오. 당신은 당신의 무대를 직접 세팅할 권리와 능력이 있습니다.
            </p>
        </div>
    `;
}

function buildChapter4(data) {
    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 4. 나의 그림자 (공망과 본원적 결핍)</h3>
            <p class="ch-text">
                인간은 누구나 태어날 때 채워지지 않는 구멍, 즉 <b>'공망(空亡)'</b>을 하나씩 부여받습니다. 
                당신이 평생을 걸쳐 갈구하지만 이상하게 손에 잡히지 않는 그 무언가, 그것은 당신의 잘못이 아니라 명리학적 결핍의 작용입니다.
                하지만 기억하십시오. 이 공망의 갈증이 바로 당신을 남들보다 더 치열하게 살게 만들고, 더 높은 곳으로 이끌어간 가장 강력한 원동력이었습니다. 
                결핍을 부끄러워하지 마십시오. 그것이 당신의 엔진입니다.
            </p>
        </div>
    `;
}

function buildChapter5(data) {
    let healthRisk = "";
    const w = data.wuxing;
    const maxVal = Math.max(w.wood, w.fire, w.earth, w.metal, w.water);
    if (w.wood === maxVal) healthRisk = "과도한 목(木)의 기운으로 인해 신경계 스트레스와 간/담낭의 피로가 누적되기 쉽습니다.";
    else if (w.fire === maxVal) healthRisk = "불타는 화(火)의 기운이 심장과 심혈관계, 혹은 안구(눈) 쪽의 건조함과 압을 높일 수 있습니다.";
    else if (w.earth === maxVal) healthRisk = "토(土)의 기운이 과도하게 집중되어, 위장 장애나 소화기 계통의 답답함이 만성적으로 나타날 수 있습니다.";
    else if (w.metal === maxVal) healthRisk = "서늘한 금(金)의 기운 탓에 호흡기(폐)와 대장, 그리고 피부 관련 트러블에 취약한 면이 있습니다.";
    else healthRisk = "수(水)의 기운이 지배적이므로 신장, 방광, 혹은 호르몬 및 생식기 계통의 에너지 저하를 늘 체크해야 합니다.";

    return `
        <div class="report-chapter">
            <h3 class="ch-title">Chapter 5. 운명의 지뢰밭 (건강과 신살 리스크)</h3>
            <p class="ch-text">
                사주의 오행 밸런스를 분석한 결과, 당신은 <b>${healthRisk}</b>
                마음이 지칠 때 가장 먼저 타격을 받는 장기가 바로 그곳입니다. 몸이 보내는 작은 신호를 무시하지 마십시오.
            </p>
            <div class="axe-advice" style="border-left-color: #d32f2f;">
                <b>🚨 Axe의 처방전:</b> 당신은 당신의 건강을 연료로 태워 성과를 내는 습관이 있습니다. 멈춰야 할 때 멈추는 것도 능력입니다. 
            </div>
        </div>
    `;
}
