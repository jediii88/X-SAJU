with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ──────────────────────────────────────
# 1. 오행 분포 풀이 — 고객 데이터 기반으로 교체
# ──────────────────────────────────────
old_w2 = """function buildChapter2_Wuxing(data) {
    const wuxing = data.wuxing || {};
    const dayStem = data.dayStem || '';
    const total = Object.values(wuxing).reduce((a,b)=>a+b,0) || 1;
    const sorted = Object.entries(wuxing).sort((a,b)=>b[1]-a[1]);
    const maxEl = sorted[0]?.[0] || 'earth';
    const maxPct = Math.round((wuxing[maxEl]||0)/total*100);
    const minEl = sorted[sorted.length-1]?.[0] || 'metal';
    const minPct = Math.round((wuxing[minEl]||0)/total*100);"""
new_w2 = """function buildChapter2_Wuxing(data) {
    const wuxing = data.wuxing || {};
    const dayStem = data.dayStem || '';
    const yong = data.yong || '';
    const gi = data.gi || '';
    const total = Object.values(wuxing).reduce((a,b)=>a+b,0) || 1;
    const sorted = Object.entries(wuxing).sort((a,b)=>b[1]-a[1]);
    const maxEl = sorted[0]?.[0] || 'earth';
    const maxPct = Math.round((wuxing[maxEl]||0)/total*100);
    const minEl = sorted[sorted.length-1]?.[0] || 'metal';
    const minPct = Math.round((wuxing[minEl]||0)/total*100);
    const OHK2 = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};
    const excessDesc2 = {
        wood: `목 기운이 ${maxPct}%로 압도적입니다. 봄의 에너지가 당신 사주를 지배합니다. 끊임없이 성장하고 도전하려는 욕구, 창의력과 열정이 넘칩니다. 새로운 것을 시작하는 데 두려움이 없고 한번 꽂히면 끝까지 밀어붙이는 추진력이 있습니다. 다만 목 과다는 간·담낭·신경계의 과부하로 이어질 수 있습니다. 스트레스가 쌓이면 신경이 예민해지거나 두통이 찾아옵니다. 금 기운(결단과 마무리)이 부족할 수 있어 시작은 많지만 완성이 적을 수 있습니다. 의식적으로 마무리하는 습관을 키우십시오.`,
        fire: `화 기운이 ${maxPct}%로 강합니다. 태양처럼 뜨거운 에너지가 당신을 지배합니다. 표현력, 열정, 사회성이 탁월하며 어디서든 존재감을 드러냅니다. 사람들의 마음을 끌어당기는 카리스마가 있습니다. 다만 화 과다는 심장·혈관·혈압에 주의가 필요합니다. 흥분하거나 열정이 과해지면 건강 신호가 옵니다. 수 기운(침착함)으로 균형을 잡는 것이 중요합니다.`,
        earth: `토 기운이 ${maxPct}%로 강합니다. 안정과 신뢰의 에너지가 당신을 지배합니다. 믿음직하고 포용력이 있으며 사람들이 자연스럽게 의지하게 됩니다. 현실적이고 실용적인 판단력이 강점입니다. 다만 토 과다는 위장·비장·소화기계 이상에 주의하십시오. 지나치게 안정을 추구하다가 변화의 기회를 놓칠 수 있습니다.`,
        metal: `금 기운이 ${maxPct}%로 강합니다. 칼처럼 날카로운 결단력과 원칙의 에너지가 당신을 지배합니다. 한번 결정하면 끝까지 밀어붙이는 추진력이 있습니다. 다만 금 과다는 폐·대장·호흡기 건강에 주의가 필요합니다. 지나친 완벽주의가 인간관계를 어렵게 만들 수 있습니다.`,
        water: `수 기운이 ${maxPct}%로 강합니다. 깊은 바다처럼 지혜롭고 유연한 에너지입니다. 상황 파악이 빠르고 전략적 사고가 뛰어납니다. 다만 수 과다는 신장·방광·호르몬 계통에 주의가 필요합니다. 지나친 유연함이 우유부단함으로 나타날 수 있습니다.`
    };
    const lackDesc2 = {
        wood:`목 기운이 ${minPct}%로 부족합니다. 성장·도전의 에너지가 약해 새로운 시작을 두려워하거나 결정을 오래 미루는 경향이 있습니다. 의식적으로 새로운 것에 도전하는 훈련이 필요합니다.`,
        fire:`화 기운이 ${minPct}%로 부족합니다. 사회성과 표현력이 약할 수 있습니다. 자신을 드러내고 알리는 활동에 의식적으로 참여하십시오.`,
        earth:`토 기운이 ${minPct}%로 부족합니다. 안정성이 약해 여러 방향으로 분산되기 쉽습니다. 규칙적인 생활과 장기 목표 설정이 이를 보완합니다.`,
        metal:`금 기운이 ${minPct}%로 부족합니다. 결단력과 마무리 능력이 약할 수 있습니다. 시작은 많지만 완성이 적을 수 있으니, 마감 기한을 정하고 완수하는 훈련을 하십시오.`,
        water:`수 기운이 ${minPct}%로 부족합니다. 지혜와 유연성이 약할 수 있습니다. 다양한 독서와 경험으로 시야를 넓히는 것이 균형을 잡는 방법입니다.`
    };"""

if old_w2 in html:
    html = html.replace(old_w2, new_w2, 1)
    print('buildChapter2_Wuxing 데이터 변수 확장: OK')
else:
    print('buildChapter2_Wuxing 시작 패턴 못찾음')

# 오행 챕터 반환문 확장
old_w_return = """    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 2. 당신의 에너지 지도 — 오행 분포 완전 해부</h3>
        <p class="ch-text">오행은 당신의 뇌 구조, 판단 방식, 인간관계 패턴, 건강 취약점의 80%를 결정합니다. 한쪽으로 쏠린 기운일수록 그 에너지가 인생을 더 강렬하게 조각합니다. 중화된 사주가 편안한 삶을 산다면, 편중된 사주는 한 분야에서 독보적인 존재가 됩니다. 당신의 오행 편중이 어떤 무기가 되는지 — 그리고 어떤 취약점이 되는지 확인하십시오.</p>"""
new_w_return = """    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 2. 당신의 에너지 지도 — 오행 분포 완전 해부</h3>
        <p class="ch-text">오행은 당신의 뇌 구조, 판단 방식, 인간관계 패턴, 건강 취약점의 80%를 결정합니다. 한쪽으로 쏠린 기운일수록 그 에너지가 인생을 더 강렬하게 조각합니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:18px 20px;border-radius:0 10px 10px 0;margin:20px 0;">
            <div style="font-size:11px;color:var(--gold);margin-bottom:10px;letter-spacing:1px;">가장 강한 기운 — ${OHK2[maxEl]||maxEl} (${maxPct}%)</div>
            <p style="font-size:14px;color:#ddd;line-height:1.9;margin:0 0 12px;">${excessDesc2[maxEl]||''}</p>
            ${minPct < 5 ? `<div style="background:rgba(231,76,60,0.08);border-radius:8px;padding:12px 14px;"><div style="font-size:11px;color:#e74c3c;margin-bottom:6px;">⚠ 가장 부족한 기운 — ${OHK2[minEl]||minEl} (${minPct}%)</div><p style="font-size:13px;color:#ccc;line-height:1.8;margin:0;">${lackDesc2[minEl]||''}</p></div>` : ''}
        </div>"""

if old_w_return in html:
    html = html.replace(old_w_return, new_w_return, 1)
    print('buildChapter2 반환문 확장: OK')
else:
    print('buildChapter2 반환문 못찾음')

# ──────────────────────────────────────
# 2. 십성 분포 풀이 — 고객 데이터 기반 확장
# ──────────────────────────────────────
old_s3_return = """    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 3. 사회적 페르소나 — 십성 분포 심층 해부</h3>
        <p class="ch-text">십성은 일간을 중심으로 나머지 7글자가 맺는 관계입니다. 비견·겁재는 경쟁심과 독립심, 식신·상관은 재능과 표현욕, 정재·편재는 재물관, 정관·편관은 권력욕, 정인·편인은 학습욕과 직관력입니다.</p>
        <p class="ch-text">어떤 십성이 강하냐에 따라 당신이 돈을 버는 방식, 사람을 이끄는 방식, 사랑에 빠지는 방식이 결정됩니다. 가장 강한 십성이 당신의 사회적 무기이자 맹점입니다.</p>"""
new_s3_return = """    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 3. 사회적 페르소나 — 십성 분포 심층 해부</h3>
        <p class="ch-text">십성은 일간을 중심으로 나머지 7글자가 맺는 관계입니다. 비견·겁재는 경쟁심과 독립심, 식신·상관은 재능과 표현욕, 정재·편재는 재물관, 정관·편관은 권력욕, 정인·편인은 학습욕과 직관력입니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 10px 10px 0;margin:16px 0 20px;">
            <div style="font-size:11px;color:var(--gold);margin-bottom:8px;letter-spacing:1px;">지배적 십성 조합 분석</div>
            <p style="font-size:14px;color:#ddd;line-height:1.9;margin:0;">${dominantText}</p>
        </div>"""

if old_s3_return in html:
    html = html.replace(old_s3_return, new_s3_return, 1)
    print('buildChapter3 반환문 확장: OK')
else:
    print('buildChapter3 반환문 못찾음')

# dominantText 변수 추가 (함수 초반부에)
old_s3_start = """function buildChapter3_Sipseong(data) {
    const sipseong = data.sipseong || {};
    const dayStem = data.dayStem || '';"""
new_s3_start = """function buildChapter3_Sipseong(data) {
    const sipseong = data.sipseong || {};
    const dayStem = data.dayStem || '';
    const totalSip = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0),1);
    const inC = (sipseong['정인']||0)+(sipseong['편인']||0);
    const sikC = (sipseong['식신']||0)+(sipseong['상관']||0);
    const gwanC = (sipseong['정관']||0)+(sipseong['편관']||0);
    const jaeC = (sipseong['정재']||0)+(sipseong['편재']||0);
    const biC = (sipseong['비견']||0)+(sipseong['겁재']||0);
    const dominant = Object.entries(sipseong).filter(([k,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);
    const dominantPct = dominant.map(k=>Math.round((sipseong[k]||0)/totalSip*100));
    const dominantText = dominant.length === 0 ? '십성 분포를 분석 중입니다.' :
        inC/totalSip > 0.4 ? `편인·정인이 ${Math.round(inC/totalSip*100)}%로 압도적으로 강합니다. 이것은 학자, 연구자, 예술가, 직관가의 에너지입니다. 책과 지식에서 삶의 답을 찾고, 논리와 영감이 동시에 작동하는 복합적인 내면을 가지고 있습니다. 재물은 직접 돈을 쫓는 것보다 전문성을 높이는 방식으로 따라옵니다. 지나친 완벽주의나 이상주의가 현실 적응을 어렵게 만들 때가 있습니다. 당신의 지식과 직관을 실제 결과물로 만드는 것이 인생 최대의 과제입니다.` :
        sikC/totalSip > 0.3 ? `식신·상관이 ${Math.round(sikC/totalSip*100)}%로 강합니다. 이것은 크리에이터, 표현가, 교육자의 에너지입니다. 내 생각과 감정을 표현하는 것이 가장 강력한 재능이며, 이 표현 능력이 곧 돈과 명성이 됩니다. 조직의 틀 안에 갇히면 답답함을 느끼고, 자신의 아이디어를 자유롭게 펼칠 수 있는 환경에서 폭발적으로 성장합니다.` :
        gwanC/totalSip > 0.2 ? `정관·편관이 ${Math.round(gwanC/totalSip*100)}%로 강합니다. 이것은 리더, 조직인, 공직자의 에너지입니다. 책임감이 강하고 사회적 규칙과 질서를 중시하며, 조직 안에서 신뢰를 쌓아 높은 자리에 오르는 것이 자연스러운 경로입니다. 너무 강한 관성은 과도한 압박감이나 권위주의적 성향으로 나타날 수 있습니다.` :
        biC/totalSip > 0.3 ? `비견·겁재가 ${Math.round(biC/totalSip*100)}%로 강합니다. 이것은 개척자, 독립사업가, 스포츠맨의 에너지입니다. 남 밑에 있으면 능력이 반만 나옵니다. 내 영역을 스스로 개척하고 치열한 경쟁 속에서 오히려 더 강해지는 기질입니다.` :
        `${dominant[0]||''}(${dominantPct[0]||0}%)이 가장 강한 십성입니다. 이 기운이 당신의 사회적 에너지를 주도합니다.`;"""

if old_s3_start in html:
    html = html.replace(old_s3_start, new_s3_start, 1)
    print('buildChapter3 dominantText 추가: OK')
else:
    print('buildChapter3 시작 못찾음')

# ──────────────────────────────────────
# 3. 용신/희신/기신 풀이 — 고객 데이터 기반 확장
# ──────────────────────────────────────
old_yong_inline = """    // 6. 신강신약 아래
    setEl('strength-inline-summary', buildStrengthSummary(data));
    // 7. 용신/희신 아래
    setEl('yong-inline-summary', buildChapter7_Hidden(data));"""
new_yong_inline = """    // 6. 신강신약 아래
    setEl('strength-inline-summary', buildStrengthSummary(data));
    // 7. 용신/희신 아래 — 동적 풀이
    const OH_YG = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    const yongKr = OH_YG[data.yong]||data.yong||'';
    const heeKr = OH_YG[data.hee]||data.hee||'';
    const giKr = OH_YG[data.gi]||data.gi||'';
    const gooKr = OH_YG[data.goo]||data.goo||'';
    const isStrongYG = (data.strengthText||'').includes('신강');
    const yongDetail = {
        wood: '목 기운이 용신입니다. 성장과 도전의 에너지가 당신을 살립니다. 목 기운이 강해지는 봄(2~4월), 갑/을년·갑/을 대운이 인생의 전성기입니다. 동쪽 방위, 초록색, 나무·식물 관련 업종이 길합니다. 간·담낭·신경계를 챙기십시오.',
        fire: '화 기운이 용신입니다. 열정과 표현의 에너지가 당신을 살립니다. 여름(5~7월), 병/정년·병/정 대운이 전성기입니다. 남쪽 방위, 붉은색, 열정·에너지가 넘치는 분야가 길합니다. 심장·혈관 건강을 챙기십시오.',
        earth: '토 기운이 용신입니다. 안정과 신뢰의 에너지가 당신을 살립니다. 환절기(3·6·9·12월), 무/기년이 길한 시기입니다. 중앙, 황금색, 부동산·농업·음식 관련이 길합니다.',
        metal: '금 기운이 용신입니다. 결단과 완성의 에너지가 당신을 살립니다. 가을(8~10월), 경/신년·경/신 대운이 전성기입니다. 서쪽 방위, 흰색·금색, 금속·IT·의료·법 관련 분야가 길합니다.',
        water: '수 기운이 용신입니다. 지혜와 유연성의 에너지가 당신을 살립니다. 겨울(11~1월), 임/계년·임/계 대운이 전성기입니다. 북쪽 방위, 검은색·남색, 물·여행·무역·지식 산업이 길합니다.'
    };
    setEl('yong-inline-summary', `<div class="inline-interp">
        <div class="ii-label">\\u2756 용신·희신·기신 해석</div>
        <div class="ii-title">나를 돕는 기운 vs 방해하는 기운 — 인생 전략의 핵심</div>
        <div class="ii-text">
            <p style="font-size:13.5px;color:#bbb;line-height:1.85;margin-bottom:16px;">용신은 당신의 사주를 균형 잡아주는 가장 중요한 기운입니다. 용신 기운이 강해지는 대운·세운에서 인생이 크게 도약하고, 기신 기운이 들어오는 시기에는 수비적 전략이 필요합니다.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
                <div style="background:rgba(199,167,106,0.08);border-radius:10px;padding:14px;border:1px solid var(--gold);">
                    <div style="font-size:11px;color:var(--gold);margin-bottom:6px;">✦ 용신 — 나의 수호신</div>
                    <div style="font-size:18px;font-weight:800;color:var(--gold);">${yongKr}</div>
                    <p style="font-size:12px;color:#bbb;margin:8px 0 0;line-height:1.7;">${yongDetail[data.yong]||yongKr+' 기운이 당신의 수호신입니다.'}</p>
                </div>
                <div style="background:rgba(74,158,106,0.08);border-radius:10px;padding:14px;border:1px solid rgba(74,158,106,0.4);">
                    <div style="font-size:11px;color:#4a9e6a;margin-bottom:6px;">✦ 희신 — 나를 돕는 기운</div>
                    <div style="font-size:18px;font-weight:800;color:#4a9e6a;">${heeKr}</div>
                    <p style="font-size:12px;color:#bbb;margin:8px 0 0;line-height:1.7;">${heeKr} 기운이 강해지는 시기는 용신을 보조하여 더 큰 성과를 만들어냅니다.</p>
                </div>
                <div style="background:rgba(231,76,60,0.06);border-radius:10px;padding:14px;border:1px solid rgba(231,76,60,0.3);">
                    <div style="font-size:11px;color:#e74c3c;margin-bottom:6px;">⚠ 기신 — 나를 방해하는 기운</div>
                    <div style="font-size:18px;font-weight:800;color:#e74c3c;">${giKr}</div>
                    <p style="font-size:12px;color:#bbb;margin:8px 0 0;line-height:1.7;">${giKr} 기운이 강한 시기에는 수비적 전략이 최선입니다. 큰 결정과 투자를 자제하십시오.</p>
                </div>
                <div style="background:rgba(255,152,0,0.05);border-radius:10px;padding:14px;border:1px solid rgba(255,152,0,0.3);">
                    <div style="font-size:11px;color:#ff9800;margin-bottom:6px;">⚠ 구신 — 기신을 돕는 기운</div>
                    <div style="font-size:18px;font-weight:800;color:#ff9800;">${gooKr}</div>
                    <p style="font-size:12px;color:#bbb;margin:8px 0 0;line-height:1.7;">${gooKr} 기운도 주의하십시오. 기신과 함께 들어오면 더 강한 역풍이 됩니다.</p>
                </div>
            </div>
            <div style="background:rgba(199,167,106,0.05);border-radius:10px;padding:14px 16px;border-left:3px solid var(--gold);">
                <div style="font-size:11px;color:var(--gold);margin-bottom:8px;">✦ 개운(운을 여는) 실천법</div>
                <p style="font-size:13px;color:#ddd;line-height:1.85;margin:0;">용신 색상과 방위를 생활에 적용하고, 용신 오행을 일간으로 가진 사람을 파트너·귀인으로 선택하십시오. 용신 기운이 강해지는 대운·세운에 인생에서 가장 중요한 결정을 실행하십시오. 이것이 개운의 핵심 원리입니다.</p>
            </div>
        </div>
    </div>`);"""

if old_yong_inline in html:
    html = html.replace(old_yong_inline, new_yong_inline, 1)
    print('용신 풀이 개인화: OK')
else:
    print('용신 풀이 위치 못찾음')

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('저장 완료')
