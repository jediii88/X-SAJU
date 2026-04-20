with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ── Chapter 1 교체 ──
ch1_start = html.find('function buildChapter1_Basic(data) {')
depth=0; i=ch1_start; ch1_end=-1
while i<len(html):
    if html[i]=='{': depth+=1
    elif html[i]=='}':
        depth-=1
        if depth==0: ch1_end=i+1; break
    i+=1

new_ch1 = r'''function buildChapter1_Basic(data) {
    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    const title = dbEntry.title || (iljuKey + ' 일주의 기운');
    const core = dbEntry.core || '당신은 끊임없이 환경과 충돌하며 자신만의 영역을 개척하는 기질을 타고났습니다.';
    const weapon = dbEntry.weapon || '위기 상황에서 발휘되는 직관과 돌파력이 당신의 가장 큰 무기입니다.';
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';
    const ohKr = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'}[stemEl];
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));

    const stemMeaning = {
        wood: '甲(갑)·乙(을)목 — 봄을 여는 나무의 기운. 끝없는 성장 본능과 개척 정신이 DNA에 새겨져 있습니다.',
        fire: '丙(병)·丁(정)화 — 세상을 밝히는 불꽃의 기운. 열정, 카리스마, 표현력이 당신의 핵심 자산입니다.',
        earth: '戊(무)·己(기)토 — 모든 것을 품는 대지의 기운. 중후한 포용력과 신뢰감이 당신을 살아있게 합니다.',
        metal: '庚(경)·辛(신)금 — 차갑게 단련된 금속의 기운. 결단력, 원칙, 완성도가 당신의 삶을 이끕니다.',
        water: '壬(임)·癸(계)수 — 깊은 바다의 지혜 기운. 통찰력, 유연성, 무한한 잠재력이 당신 안에 잠들어 있습니다.'
    }[stemEl] || '';

    const branchMeaning = {
        '子':'자(子)는 겨울의 한복판, 극도의 집중과 내면의 힘을 품은 지지입니다.',
        '丑':'축(丑)은 혹독한 겨울을 버텨내는 인내와 저력의 지지입니다.',
        '寅':'인(寅)은 봄을 여는 호랑이의 기운, 개척과 도전의 지지입니다.',
        '卯':'묘(卯)는 봄의 절정, 생명력과 관계 에너지가 폭발하는 지지입니다.',
        '辰':'진(辰)은 용이 잠든 봄의 대지, 거대한 잠재력이 응축된 지지입니다.',
        '巳':'사(巳)는 뱀의 예리함과 여름의 폭발력을 품은 변신의 지지입니다.',
        '午':'오(午)는 한여름 정오의 태양, 사회적 성취 에너지가 극에 달한 지지입니다.',
        '未':'미(未)는 여름의 관록, 경험이 지혜로 숙성되는 지지입니다.',
        '申':'신(申)은 가을의 결단, 불필요한 것을 쳐내는 날카로운 지지입니다.',
        '酉':'유(酉)는 가을의 정밀한 수확, 완성도와 보상의 지지입니다.',
        '戌':'술(戌)은 가을 황혼의 중후함, 깊은 통찰과 신뢰의 지지입니다.',
        '亥':'해(亥)는 겨울 바다의 심연, 무한한 가능성을 저장한 지지입니다.'
    }[data.dayBranch] || '';

    const relationDesc = {
        'same': '일간과 일지가 比和(비화) — 같은 오행이 겹쳐 에너지가 응집됩니다. 강점이 더욱 극대화되지만, 단점도 증폭될 수 있습니다.',
        'gen': '일간이 일지를 生(생) — 내가 환경에 에너지를 쏟아붓는 구조. 헌신적이지만 소진에 주의해야 합니다.',
        'rev': '일지가 일간을 生(생) — 환경이 나를 키워주는 구조. 귀인과 지원을 잘 활용하는 것이 핵심입니다.',
        '克': '일간이 일지를 克(극) — 내가 환경을 통제하는 구조. 강한 주도력이 있지만 주변과 마찰이 생기기도 합니다.',
        'rev克': '일지가 일간을 克(극) — 환경이 나를 압박하는 구조. 역경 속에서 더욱 강해지는 불굴의 힘을 발휘합니다.'
    };

    const strengthDesc = isStrong
        ? '현재 당신의 일간 에너지는 <b>신강(身强)</b> 상태입니다. 기운이 충만한 만큼 남에게 끌려다니기보다 내가 판을 짜야 제 능력이 발현됩니다. 조직 안에 갇혀 있으면 에너지가 억눌려 오히려 역효과가 납니다. 창업, 프리랜서, 전문직처럼 자율권이 보장된 환경이 당신에게 맞습니다.'
        : '현재 당신의 일간 에너지는 <b>신약(身弱)</b> 상태입니다. 혼자 모든 것을 짊어지기보다 훌륭한 파트너와 팀을 구성할 때 1+1이 10이 되는 폭발적 시너지를 경험합니다. 좋은 귀인을 곁에 두는 것이 인생 전략의 핵심입니다.';

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 1. 나의 본질과 영혼의 그릇 — 日柱(일주) 해부</h3>
        <p class="ch-text">명리학에서 日柱(일주)는 단순히 성격을 의미하는 것이 아닙니다. 당신이 평생 짊어지고 가야 할 영혼의 바코드이자 생존의 무기입니다. 年柱(연주)가 가문과 조상의 기운을, 月柱(월주)가 사회적 환경과 부모의 기운을 담고 있다면, 日柱(일주)는 오직 당신 자신만의 본질을 담고 있습니다.</p>
        <p class="ch-text">많은 사람들이 사주를 볼 때 겉으로 드러난 화려함, 즉 사회적 성취와 재물에 주목합니다. 하지만 그 성취들을 만들어내는 근본 에너지, 당신을 진정으로 움직이는 내밀한 기질은 이 일주에 새겨져 있습니다. 이것을 모르면 아무리 열심히 살아도 남의 인생을 사는 것과 다름없습니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-radius:12px;padding:20px;margin:20px 0;">
            <div style="font-size:22px;font-weight:800;color:var(--gold);font-family:'Noto Serif KR',serif;margin-bottom:12px;">[${title}]</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;">
                <div style="padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">天干(천간) — 하늘의 기운</div>
                    <div style="font-size:13px;color:#ddd;line-height:1.75;">${stemMeaning}</div>
                </div>
                <div style="padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">地支(지지) — 땅의 기운</div>
                    <div style="font-size:13px;color:#ddd;line-height:1.75;">${branchMeaning}</div>
                </div>
            </div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0;">${core}</p>
        </div>
        <p class="ch-text"><b style="color:var(--gold);">[핵심 무기]</b> ${weapon}</p>
        <p class="ch-text">${strengthDesc}</p>
        <p class="ch-text">때로는 이 기질 때문에 불필요한 마찰을 겪기도 합니다. 하지만 결국 그 마찰열이 당신의 그릇을 한 단계 더 크게 빚어내는 용광로 역할을 합니다. 환경을 탓하지 마십시오. 당신은 그 환경을 이해하고, 재편하고, 지배할 수 있는 기질을 가지고 태어났습니다.</p>
    </div>`;
}'''

html = html[:ch1_start] + new_ch1 + html[ch1_end:]
print("Chapter 1 교체 성공")

# ── Chapter 2 교체 ──
ch2_start = html.find('function buildChapter2_Wuxing(data) {')
depth=0; i=ch2_start; ch2_end=-1
while i<len(html):
    if html[i]=='{': depth+=1
    elif html[i]=='}':
        depth-=1
        if depth==0: ch2_end=i+1; break
    i+=1

new_ch2 = r'''function buildChapter2_Wuxing(data) {
    const wuxing = data.wuxing || {};
    const OHKR2 = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};
    const OHCHAR = {wood:'🌿',fire:'🔥',earth:'🪨',metal:'⚙️',water:'💧'};
    let maxW = 'earth', minW = 'water';
    if(Object.keys(wuxing).length > 0) {
        maxW = Object.keys(wuxing).reduce((a,b) => wuxing[a] > wuxing[b] ? a : b);
        minW = Object.keys(wuxing).reduce((a,b) => wuxing[a] < wuxing[b] ? a : b);
    }
    const excessText = window.SAJU_DB?.WUXING_EXCESS?.[maxW] || '기운이 한쪽으로 강하게 쏠려 있습니다.';
    const maxKr = OHKR2[maxW] || maxW;
    const minKr = OHKR2[minW] || minW;

    const excessPersonality = {
        wood:'목(木) 기운이 지배적인 당신은 끝없이 성장하고 확장하려는 본능이 강합니다. 멈춰 있으면 죽어가는 것처럼 느껴집니다. 새로운 프로젝트, 새로운 관계, 새로운 목표 — 끊임없이 새로운 것을 향해 나아가는 것이 당신의 생존 방식입니다. 이 에너지는 창업가, 개척자, 선도자에게 가장 어울리는 기질입니다.',
        fire:'화(火) 기운이 지배적인 당신은 어디서든 주목받고 영향력을 발휘하는 천부적 재능이 있습니다. 열정이 넘치고 표현력이 폭발적이며, 주변 사람들의 에너지를 끌어올리는 능력이 있습니다. 단, 이 뜨거운 에너지는 제어하지 않으면 번아웃을 유발하거나 주변과의 충돌로 이어집니다.',
        earth:'토(土) 기운이 지배적인 당신은 묵직한 안정감과 신뢰감이 가장 큰 자산입니다. 사람들이 자연스럽게 당신에게 기대고 의지합니다. 이 중후함이 리더십의 기반이 되며, 어떤 환경에서도 흔들리지 않는 중심축이 됩니다. 다만 변화에 대한 저항이 강해 새로운 기회를 놓치는 경우가 있습니다.',
        metal:'금(金) 기운이 지배적인 당신은 불필요한 것을 과감히 쳐내는 결단력이 탁월합니다. 원칙과 기준이 명확하여 어떤 압박에도 흔들리지 않습니다. 이 냉철함이 전문성과 결합할 때 당신은 분야 최고의 권위자가 됩니다. 단, 감정 표현이 부족하여 가까운 사람들과의 관계에서 오해를 받을 수 있습니다.',
        water:'수(水) 기운이 지배적인 당신은 누구도 따라올 수 없는 깊은 통찰력과 유연성을 가지고 있습니다. 복잡한 상황을 꿰뚫어보고 남들이 보지 못하는 본질을 파악합니다. 이 지혜는 전략가, 분석가, 기획자로서의 천재적 능력으로 발현됩니다. 단, 결정을 미루고 지나치게 분석하는 경향이 기회를 놓치게 만들기도 합니다.'
    }[maxW] || '';

    const lackDesc = {
        wood:'목(木) 기운이 부족한 당신은 새로운 출발과 성장에 대한 두려움이 잠재되어 있습니다. 의도적으로 새로운 것에 도전하고 경험을 확장하는 노력이 필요합니다.',
        fire:'화(火) 기운이 부족한 당신은 열정과 표현력이 상대적으로 내면으로 향합니다. 자신의 생각과 감정을 세상에 드러내는 연습이 잠재된 능력을 깨우는 열쇠입니다.',
        earth:'토(土) 기운이 부족한 당신은 안정감보다 변화를 선호하는 경향이 있습니다. 뿌리를 깊이 내리는 것 — 한 곳에서 꾸준히 성장하는 것 — 이 당신의 가장 큰 도전이자 기회입니다.',
        metal:'금(金) 기운이 부족한 당신은 결단을 내리는 것이 어렵고 마무리가 약한 편입니다. 시작한 일을 끝맺는 것, 불필요한 것을 과감히 버리는 용기가 삶을 한 단계 도약시킵니다.',
        water:'수(水) 기운이 부족한 당신은 직관보다 행동이 앞서는 경향이 있습니다. 결정 전 충분히 생각하고 전략을 세우는 습관이 실수를 줄이고 성과를 극대화합니다.'
    }[minW] || '';

    const balanceRows = Object.entries(wuxing).map(([k,v]) => {
        const pct = Math.round(v);
        const col = k===maxW ? 'var(--gold)' : k===minW ? '#888' : '#aaa';
        return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="width:40px;text-align:right;font-size:13px;color:${col};">${OHCHAR[k]} ${OHKR2[k]}</div>
            <div style="flex:1;background:rgba(255,255,255,0.07);border-radius:4px;height:8px;overflow:hidden;">
                <div style="width:${Math.min(pct,100)}%;height:100%;background:${col};border-radius:4px;transition:width 0.5s;"></div>
            </div>
            <div style="width:36px;font-size:13px;color:${col};">${pct}%</div>
        </div>`;
    }).join('');

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 2. 오행(五行)의 세력 — 절대적 무기와 아킬레스건</h3>
        <p class="ch-text">사람들은 오행(목화토금수)이 골고루 섞인 '中和(중화)'된 사주를 좋은 사주라고 말합니다. 평범하게 큰 굴곡 없이 살기엔 중화가 최고일 수 있습니다. 하지만 한 시대를 풍미하고 자신만의 제국을 건설하는 사람들은 거의 예외 없이 오행이 극단적으로 쏠려 있습니다. 편중이 크면 클수록 그 에너지가 당신의 삶을 더 강렬하게 조각합니다.</p>

        <div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:18px;margin:20px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:14px;letter-spacing:1px;">오행 에너지 분포</div>
            ${balanceRows}
        </div>

        <p class="ch-text">당신의 사주 원국을 해부한 결과, 당신의 절대적 무기이자 동시에 아킬레스건은 바로 <b style="color:var(--gold);">${maxKr}</b>의 기운입니다. 이 기운이 당신의 뇌 구조, 판단 방식, 인간관계 패턴의 80% 이상을 지배합니다.</p>

        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:16px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">${maxKr} 기운 집중 분석</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0 0 12px;">${excessText}</p>
            <p style="font-size:14px;color:#ccc;line-height:1.85;margin:0;">${excessPersonality}</p>
        </div>

        <p class="ch-text">반대로 가장 부족한 <b>${minKr}</b> 기운은 당신이 무의식적으로 갈망하는 결핍의 영역입니다. ${lackDesc}</p>

        <p class="ch-text">이 편중된 에너지를 억누르거나 부끄러워하지 마십시오. 당신의 과제는 이 에너지를 '흉기'에서 '명검'으로 전환하는 것입니다. 用神(용신) 기운을 적극 활용하고, 忌神(기신) 기운을 경계하는 것이 인생 전략의 핵심입니다.</p>
    </div>`;
}'''

html = html[:ch2_start] + new_ch2 + html[ch2_end:]
print("Chapter 2 교체 성공")

# ── Chapter 3 교체 ──
ch3_start = html.find('function buildChapter3_Sipseong(data) {')
depth=0; i=ch3_start; ch3_end=-1
while i<len(html):
    if html[i]=='{': depth+=1
    elif html[i]=='}':
        depth-=1
        if depth==0: ch3_end=i+1; break
    i+=1

new_ch3 = r'''function buildChapter3_Sipseong(data) {
    const sipseong = data.sipseong || {};
    let mainSip = '정재', secondSip = '비견';
    const sorted = Object.entries(sipseong).sort((a,b)=>b[1]-a[1]);
    if(sorted.length > 0) mainSip = sorted[0][0];
    if(sorted.length > 1) secondSip = sorted[1][0];
    const sipText = window.SAJU_DB?.SIPSEONG?.[mainSip] || '사회의 규칙에 순응하기보다 주도적으로 판을 짜는 기질입니다.';
    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0), 1);

    const sipPersonality = {
        '비견': '比肩(비견)이 강한 당신은 독립심과 경쟁심이 강합니다. 남에게 지는 것을 극도로 싫어하며, 자기 방식으로 일을 처리하는 것을 선호합니다. 동업이나 파트너십에서 주도권 다툼이 생길 수 있으니 역할 분담을 명확히 해야 합니다.',
        '겁재': '劫財(겁재)가 강한 당신은 경쟁과 도전이 삶의 동력입니다. 극한 상황에서 진가를 발휘하며, 승부욕이 탁월합니다. 단, 재물 관리에 있어 충동적인 결정을 조심하십시오.',
        '식신': '食神(식신)이 강한 당신은 천부적인 창의력과 표현력을 가지고 있습니다. 먹고 즐기고 창조하는 것에서 진정한 행복을 느끼며, 이 재능이 돈이 되는 구조를 만들면 최상의 인생이 펼쳐집니다.',
        '상관': '傷官(상관)이 강한 당신은 기존 틀을 깨는 혁신가입니다. 규칙과 권위에 도전하며 새로운 방식으로 세상을 바라봅니다. 이 창의성은 예술, 기획, 컨설팅, 기술 혁신 분야에서 폭발적 성과를 냅니다.',
        '편재': '偏財(편재)가 강한 당신은 돈 냄새를 맡는 감각이 탁월합니다. 다양한 수입원을 동시에 운영하는 능력이 있으며, 사업 기회 포착 능력이 뛰어납니다.',
        '정재': '正財(정재)가 강한 당신은 안정적이고 꾸준하게 자산을 쌓아가는 능력이 있습니다. 성실함과 신뢰가 재물의 기반이 되며, 부동산·저축·안정적 투자에서 최상의 결과를 냅니다.',
        '편관': '偏官(편관)이 강한 당신은 강렬한 승부욕과 강인한 결단력을 가지고 있습니다. 압박이 클수록 더욱 강해지는 기질로, 군인·경찰·운동선수·위기관리 전문가에 적합합니다.',
        '정관': '正官(정관)이 강한 당신은 조직과 규칙을 중시하며 사회적 명예와 신뢰를 삶의 핵심 가치로 여깁니다. 공직, 대기업, 전문직에서 꾸준히 올라가는 안정적 성공 구조입니다.',
        '편인': '偏印(편인)이 강한 당신은 특수한 분야의 전문 지식과 직관이 뛰어납니다. 일반적인 학습보다 자기만의 방식으로 체득한 지식이 강점이며, 독특한 전문성이 경쟁력이 됩니다.',
        '정인': '正印(정인)이 강한 당신은 학문과 교육, 문서와 귀인의 도움이 삶을 이끌어갑니다. 배움을 멈추지 않으면 나이가 들수록 더욱 빛나는 인생이 펼쳐집니다.'
    }[mainSip] || sipText;

    const sipRows = sorted.slice(0,5).map(([k,v]) => {
        const pct = Math.round(v/total*100);
        const isMain = k === mainSip;
        return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="width:52px;text-align:right;font-size:12px;color:${isMain?'var(--gold)':'#aaa'};">${k}</div>
            <div style="flex:1;background:rgba(255,255,255,0.07);border-radius:4px;height:8px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:${isMain?'var(--gold)':'rgba(255,255,255,0.3)'};border-radius:4px;"></div>
            </div>
            <div style="width:36px;font-size:12px;color:${isMain?'var(--gold)':'#aaa'};">${pct}%</div>
        </div>`;
    }).join('');

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 3. 十星(십성) — 사회적 페르소나와 내면의 욕망</h3>
        <p class="ch-text">오행(五行)이 당신의 하드웨어