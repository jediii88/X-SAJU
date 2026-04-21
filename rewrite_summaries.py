with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ===================================================================
# buildShinsalSummary — 신살 개인화
# ===================================================================
old_shin = html[html.find('function buildShinsalSummary'):html.find('function buildStrengthSummary')]
if 'function buildShinsalSummary' not in html:
    print('buildShinsalSummary 못찾음'); exit()

new_shin = '''function buildShinsalSummary(data) {
    const shinsal = data.allShinsal || [];
    const dayStem = data.dayStem || '';
    const isStrong = (data.strengthText||'').includes('신강');
    const goodCats = ['길성'];

    if(!shinsal || shinsal.length === 0) {
        return `<div class="inline-interp"><div class="ii-label">\\u2756 신살·길성 분석</div><div class="ii-title">특별한 신살이 없는 순수한 원국</div><div class="ii-text"><p style="font-size:13.5px;color:#bbb;line-height:1.85;">당신의 원국에는 특별한 신살이 검출되지 않았습니다. 신살이 없다는 것은 흉한 것이 아니라, 오히려 자신의 본래 에너지를 가장 순수하게 발휘할 수 있는 구조입니다. 복잡한 에너지의 간섭 없이 일간의 본래 기질이 직접적으로 발현됩니다.</p></div></div>`;
    }

    const goodList = shinsal.filter(s => (window.SHINSAL_DESC?.[s]?.cat||'') === '길성');
    const badList  = shinsal.filter(s => (window.SHINSAL_DESC?.[s]?.cat||'') !== '길성');

    // 신살별 개인화 풀이
    const personalTips = {
        '천을귀인':'당신 사주에 천을귀인이 있습니다. 이는 평생 위기의 순간마다 귀인이 나타나 도움을 주는 구조입니다. 중요한 결정을 앞두고 있을 때, 혹은 가장 막막한 순간에 의외의 사람이 나타나 결정적 도움을 줍니다. 당신은 이 귀인을 알아보는 눈을 키워야 합니다. 귀인은 대개 화려하지 않고, 소박하고 조용한 방식으로 나타납니다.',
        '문곡귀인':'문곡귀인이 있습니다. 학문과 지식에서 남다른 재능이 있으며, 글쓰기·강의·컨설팅·가르치는 것으로 사회적 인정과 재물을 얻을 수 있습니다. 지식이 곧 돈이 되는 직업군에서 이 길성이 가장 빛납니다. 자격증, 전문 지식, 저술 활동을 적극적으로 추진하십시오.',
        '역마살':'역마살이 있습니다. 한 곳에 오래 머물면 답답함을 느끼는 체질입니다. 이동, 출장, 해외, 여행이 삶에 끊임없이 따라옵니다. 이것을 저주로 볼 것인가, 세계를 무대로 활동하는 자유로운 삶의 설계도로 볼 것인가는 당신의 선택입니다. 역마살을 가진 사람이 억지로 한 곳에 묶어두면 오히려 더 큰 불운이 찾아옵니다. 이동과 변화를 직업으로 만드는 것이 최선입니다.',
        '도화살':'도화살이 있습니다. 사람을 끌어당기는 자연스러운 매력이 있습니다. 이 에너지를 잘 활용하면 대인관계, 영업, 마케팅, 예술 분야에서 천부적 재능이 됩니다. 다만 경계 없는 이성 관계는 나중에 복잡한 상황을 만들 수 있으니, 매력을 비즈니스로 승화시키는 것이 현명한 전략입니다.',
        '화개살':'화개살이 있습니다. 예술, 종교, 철학, 영성에 깊은 관심이 있으며 창의적 분야에서 독보적 능력을 발휘합니다. 혼자 있는 시간을 사랑하며, 고독 속에서 오히려 깊은 통찰이 나옵니다. 이 기운을 창작이나 정신적 성장에 쏟는 사람들이 가장 큰 성취를 이룹니다.',
        '천살':'천살이 있습니다. 예측 불가한 사건이 삶에 반복적으로 찾아옵니다. 그러나 이것은 불운이 아닌 당신을 단련시키는 시련의 코드입니다. 천살이 강한 대운이나 세운에 특히 주의하고, 미리 준비된 자에게 천살은 오히려 더 큰 도약의 계기가 됩니다.',
        '백호대살':'백호대살이 있습니다. 강렬하고 급격한 사건 에너지입니다. 다만 이 에너지를 가진 사람들 중 군인, 경찰, 외과의사, 소방관, 운동선수 등 강인함이 요구되는 분야에서 탁월한 능력을 발휘하는 경우가 매우 많습니다. 백호대살은 흉살이 아니라 강인함의 코드입니다.',
        '홍염살':'홍염살이 있습니다. 이성에게 매력적으로 보이는 강렬한 기운입니다. 연애 인연이 활발하지만 감정의 파도가 크게 휘몰아칩니다. 감정과 이성의 균형, 상대방의 마음을 배려하는 성숙함이 이 기운을 다스리는 열쇠입니다.',
        '천의성':'천의성이 있습니다. 의료, 치료, 상담, 구호 분야에서 천부적 재능을 발휘합니다. 사람의 아픔을 공감하고 치유하는 능력이 있으며, 이 방향으로 커리어를 설계하면 사회적 인정과 재물이 자연스럽게 따라옵니다.',
        '학당귀인':'학당귀인이 있습니다. 공부하는 기운이 강하게 작동하여 배움과 자기계발로 성취를 이루는 구조입니다. 평생 학습하는 자세가 당신의 가장 큰 경쟁력입니다. 자격증, 학위, 전문 교육이 직접적으로 삶의 수준을 높여줍니다.',
        '지살':'지살이 있습니다. 변화와 이동이 삶에 자주 찾아옵니다. 안주하려는 순간 환경이 바뀌는 패턴이 반복됩니다. 이 기운을 거스르지 말고 유연하게 변화를 받아들이는 사람이 최종적으로 가장 넓은 세계를 가지게 됩니다.',
        '년살':'년살이 있습니다. 이성 인연과 사교성이 강합니다. 적극적인 대외 활동과 사람들과의 관계 확장이 재물과 직업에서도 도움이 됩니다.'
    };

    const rows = shinsal.map(s => {
        const info = window.SHINSAL_DESC?.[s] || {cat:'신살', color:'#aaa', short:s+'의 기운', detail:''};
        const catColor = goodCats.includes(info.cat) ? '#c7a76a' : info.color || '#e74c3c';
        const isGood = goodCats.includes(info.cat);
        const personalTip = personalTips[s] || '';
        const baseDetail = info.detail || '';
        return `<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:16px 18px;margin-bottom:12px;border-left:3px solid ${catColor};">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:16px;font-weight:800;color:${catColor};">${s}</span>
                    <span style="font-size:11px;color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.07);padding:2px 10px;border-radius:10px;">${isGood ? '✦ 길성' : '⚠ 신살'}</span>
                </div>
                <span style="font-size:12px;color:#999;">${info.short||''}</span>
            </div>
            ${baseDetail ? `<p style="font-size:13.5px;color:#ccc;line-height:1.85;margin:0 0 10px;">${baseDetail}</p>` : ''}
            ${personalTip ? `<div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:12px 14px;border-left:2px solid ${catColor};"><p style="font-size:13px;color:#bbb;line-height:1.85;margin:0;">${personalTip}</p></div>` : ''}
        </div>`;
    }).join('');

    return `<div class="inline-interp">
        <div class="ii-label">\\u2756 신살 · 길성 상세 분석</div>
        <div class="ii-title">당신의 사주에 새겨진 특별한 에너지 코드 — 총 ${shinsal.length}개</div>
        <div class="ii-text">
            <p style="font-size:13.5px;color:#bbb;line-height:1.85;margin-bottom:16px;">신살은 단순한 운의 좋고 나쁨이 아닙니다. 이것들은 당신이라는 사람을 특별하게 만드는 코드입니다. 길성은 선천적으로 타고난 무기이고, 신살은 당신을 단련시키는 도전의 코드입니다. 흉살도 올바르게 활용하면 가장 강력한 무기가 됩니다.</p>
            ${goodList.length > 0 ? `<div style="margin-bottom:8px;padding:12px 16px;background:rgba(199,167,106,0.07);border-radius:10px;border-left:3px solid var(--gold);"><div style="font-size:12px;color:var(--gold);margin-bottom:6px;">✦ 길성 ${goodList.length}개 — 선천적으로 타고난 무기</div><div style="font-size:13px;color:#ddd;font-weight:600;">${goodList.join(' · ')}</div></div>` : ''}
            ${badList.length > 0 ? `<div style="margin-bottom:16px;padding:12px 16px;background:rgba(231,76,60,0.06);border-radius:10px;border-left:3px solid #e74c3c;"><div style="font-size:12px;color:#e74c3c;margin-bottom:6px;">⚠ 신살 ${badList.length}개 — 삶을 단련시키는 도전의 코드</div><div style="font-size:13px;color:#ddd;font-weight:600;">${badList.join(' · ')}</div><p style="font-size:12px;color:#999;margin:8px 0 0;">신살은 흉이 아닙니다. 이 에너지를 이해하고 제대로 활용한 사람이 오히려 평범한 사람보다 더 강해집니다.</p></div>` : ''}
            ${rows}
        </div>
    </div>`;
}
'''

# 실제 함수 텍스트 찾아서 교체
start_idx = html.find('function buildShinsalSummary(data)')
end_idx = html.find('\nfunction buildStrengthSummary')
if start_idx < 0 or end_idx < 0:
    print(f'위치 못찾음: start={start_idx}, end={end_idx}')
else:
    html = html[:start_idx] + new_shin + '\n' + html[end_idx+1:]
    print(f'buildShinsalSummary 재작성 OK ({end_idx-start_idx}→{len(new_shin)} chars)')

# ===================================================================
# buildStrengthSummary — 신강신약 개인화
# ===================================================================
start_s = html.find('function buildStrengthSummary(data)')
end_s = html.find('\nfunction injectInlineSummaries')
if end_s < 0:
    end_s = html.find('\nfunction buildSectionHeader')
print(f'buildStrengthSummary 위치: {start_s}~{end_s}')

new_strength = '''function buildStrengthSummary(data) {
    const isStrong = (data.strengthText||'').includes('신강') || (data.strengthText||'').includes('강');
    const pct = data.strengthPct || 50;
    const ds = data.dayStem || '';
    const db = data.dayBranch || '';
    const yong = data.yong || 'metal';
    const gi = data.gi || 'wood';
    const OH = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};

    const title = isStrong ? '신강 — 넘치는 에너지, 주도적 인생 설계자' : '신약 — 협력과 귀인으로 폭발하는 시너지형';

    const coreText = isStrong
        ? `기운이 충만한 신강 사주입니다. 당신의 일간 에너지가 강하게 독립적으로 작동합니다. 이것은 "나만의 판을 직접 짜는 사람"의 에너지입니다. 남의 지시 아래서는 능력의 절반도 발휘하지 못하고 답답함을 느끼다가 결국 독립하게 됩니다. 창업, 프리랜서, 전문직, 1인 미디어 등 자율성이 최대한 보장된 환경에서 진짜 능력이 폭발합니다.\\n\\n반면 신강 사주의 함정은 독단적 결정과 인간관계 마찰입니다. 강한 기운이 넘쳐서 주변 사람들을 눌러버리거나, 의견 충돌에서 절대 물러서지 않는 고집이 인간관계를 어렵게 만들 수 있습니다. 이 에너지를 사회적으로 인정받는 방향으로 분출하는 법을 배우는 것이 인생의 핵심 과제입니다.`
        : `에너지가 분산된 신약 사주입니다. 이것은 약함이 아니라 "협력과 연결로 증폭되는 사람"의 에너지입니다. 혼자서 모든 것을 짊어지려 하면 무너집니다. 하지만 훌륭한 파트너·팀·귀인과 함께하면 1+1이 10이 되는 폭발적 시너지가 발생합니다.\\n\\n신약 사주의 가장 큰 전략은 "좋은 사람을 알아보는 눈"을 키우는 것입니다. 용신 오행(${OH[yong]||yong})을 일간으로 가진 사람이 당신의 에너지를 가장 잘 보완해주는 귀인입니다. 일, 사랑, 사업 파트너 선택에서 이 원칙을 적용하면 인생의 흐름이 바뀝니다.`;

    const stratText = isStrong
        ? `✦ 신강 사주 핵심 전략: 기신 에너지(${OH[gi]||gi})가 오는 대운·세운에서 과잉 에너지를 다스리는 것이 최우선입니다. 에너지가 넘칠수록 인간관계와 건강을 챙기십시오. 용신 대운에서는 공격적으로 확장하되, 혼자 독주하지 말고 신뢰할 수 있는 팀을 구성하십시오.`
        : `✦ 신약 사주 핵심 전략: 용신 에너지(${OH[yong]||yong})를 가진 귀인·파트너를 곁에 두십시오. 직업은 자신의 전문성을 살리되 조직이나 파트너와 함께하는 구조가 유리합니다. 혼자 밀어붙이기보다 좋은 사람과 함께하는 방식이 더 크고 안정적인 결과를 만들어냅니다.`;

    return `<div class="inline-interp">
        <div class="ii-label">\\u2756 신강·신약 해석</div>
        <div class="ii-title">${title}</div>
        <div class="ii-text">
            <p style="font-size:13.5px;color:#bbb;line-height:1.85;white-space:pre-line;">${coreText}</p>
            <div style="background:rgba(199,167,106,0.07);border-radius:10px;padding:14px 16px;margin-top:14px;border-left:3px solid var(--gold);">
                <p style="font-size:13px;color:#ddd;line-height:1.85;margin:0;">${stratText}</p>
            </div>
        </div>
    </div>`;
}
'''

if start_s > 0 and end_s > start_s:
    html = html[:start_s] + new_strength + '\n' + html[end_s+1:]
    print('buildStrengthSummary 재작성 OK')
else:
    print(f'buildStrengthSummary 위치 오류: {start_s}~{end_s}')

# ===================================================================
# 오행 섹션 풀이 buildChapter2_Wuxing — 고객 데이터 기반으로
# ===================================================================
start_w = html.find('function buildChapter2_Wuxing(data)')
end_w = html.find('\nfunction buildChapter3_Sipseong')
if start_w > 0 and end_w > start_w:
    old_w = html[start_w:end_w]
    new_w = '''function buildChapter2_Wuxing(data) {
    const wuxing = data.wuxing || {};
    const dayStem = data.dayStem || '';
    const yong = data.yong || '';
    const gi = data.gi || '';
    const OH = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    const OHK = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};
    const total = Object.values(wuxing).reduce((a,b)=>a+b,0)||1;
    const sorted = Object.entries(wuxing).sort((a,b)=>b[1]-a[1]);
    const maxEl = sorted[0]?.[0]||'wood';
    const minEl = sorted[sorted.length-1]?.[0]||'metal';
    const maxPct = Math.round((wuxing[maxEl]||0)/total*100);
    const minPct = Math.round((wuxing[minEl]||0)/total*100);

    // 오행별 과다/부족 심층 해설
    const excessDesc = {
        wood: `목(木) 기운이 ${maxPct}%로 압도적입니다. 봄의 에너지가 당신 사주를 지배하고 있습니다. 끊임없이 성장하고 도전하려는 욕구, 창의력과 열정이 넘칩니다. 새로운 것을 시작하는 데 두려움이 없고, 한번 꽂히면 끝까지 밀어붙이는 추진력이 있습니다. 다만 목 과다는 간·담낭·신경계의 과부하로 이어질 수 있습니다. 스트레스가 쌓이면 신경이 예민해지거나 두통이 찾아옵니다. 금 기운(결단과 마무리)이 부족하여 시작은 많지만 완성이 적을 수 있습니다. 의식적으로 마무리하는 습관과 결단력을 키우십시오.`,
        fire: `화(火) 기운이 ${maxPct}%로 강합니다. 태양처럼 뜨거운 에너지가 당신을 지배합니다. 표현력, 열정, 사회성이 탁월하며 어디서든 존재감을 드러냅니다. 사람들의 마음을 끌어당기는 카리스마가 있습니다. 다만 화 과다는 심장·혈관·혈압에 주의가 필요합니다. 흥분하거나 열정이 과해지면 건강 신호가 옵니다. 수 기운(침착함과 지혜)으로 균형을 잡는 것이 중요합니다.`,
        earth: `토(土) 기운이 ${maxPct}%로 강합니다. 안정과 신뢰의 에너지가 당신을 지배합니다. 믿음직하고 포용력이 있으며, 사람들이 자연스럽게 의지하게 됩니다. 현실적이고 실용적인 판단력이 강점입니다. 다만 토 과다는 위장·비장·소화기계 이상에 주의하십시오. 지나치게 안정을 추구하다가 변화의 기회를 놓칠 수 있습니다.`,
        metal: `금(金) 기운이 ${maxPct}%로 강합니다. 칼처럼 날카로운 결단력과 원칙의 에너지가 당신을 지배합니다. 한번 결정하면 끝까지 밀어붙이는 추진력, 원칙에 어긋나는 것을 참지 못하는 기질이 있습니다. 다만 금 과다는 폐·대장·호흡기 건강에 주의가 필요합니다. 지나친 완벽주의와 냉정함이 인간관계를 어렵게 만들 수 있습니다.`,
        water: `수(水) 기운이 ${maxPct}%로 강합니다. 깊은 바다처럼 지혜롭고 유연한 에너지입니다. 상황 파악이 빠르고 전략적 사고가 뛰어납니다. 어떤 환경에도 적응하는 유연함이 강점입니다. 다만 수 과다는 신장·방광·호르몬 계통에 주의가 필요합니다. 지나친 유연함이 때로 우유부단함으로 나타날 수 있습니다.`
    };
    const lackDesc = {
        wood:`목(木) 기운이 ${minPct}%로 부족합니다. 성장과 도전의 에너지가 약해 새로운 시작을 두려워하거나 결정을 오래 미루는 경향이 있습니다. 용신·희신에 목 기운이 포함되어 있다면 이 부분을 의식적으로 채워야 합니다. 나무와 관련된 환경(숲속 산책, 녹색 채소 섭취)이 도움이 됩니다.`,
        fire:`화(火) 기운이 ${minPct}%로 부족합니다. 사회성과 표현력이 약할 수 있습니다. 내 능력을 드러내고 세상에 알리는 것이 어색하게 느껴질 수 있습니다. 의식적으로 자신을 표현하는 활동(발표, 강의, SNS)에 도전하는 것이 균형을 맞추는 방법입니다.`,
        earth:`토(土) 기운이 ${minPct}%로 부족합니다. 안정성과 중심이 약할 수 있습니다. 여러 방향으로 분산되어 한 가지를 꾸준히 이어가기 어려울 수 있습니다. 규칙적인 생활과 장기적 목표 설정이 이 부족함을 보완합니다.`,
        metal:`금(金) 기운이 ${minPct}%로 부족합니다. 결단력과 마무리 능력이 약할 수 있습니다. 시작은 많지만 완성이 적거나, 단호한 결정을 내리지 못하는 경향이 있습니다. 의식적으로 마감 기한을 설정하고 완수하는 훈련이 필요합니다.`,
        water:`수(水) 기운이 ${minPct}%로 부족합니다. 지혜와 유연성이 약할 수 있습니다. 고집스럽게 한 방향만 보다가 큰 흐름을 놓치는 경우가 생길 수 있습니다. 다양한 독서와 경험으로 시야를 넓히는 것이 균형을 맞추는 방법입니다.`
    };

    return `<div class="report-chapter">
        <h3 class="ch-title">오행 분포 — 당신의 에너지 지도</h3>
        <p class="ch-text">오행의 분포는 당신의 뇌 구조, 판단 방식, 건강 취약점, 인간관계 패턴의 80%를 결정합니다. 한쪽으로 쏠린 기운일수록 그 에너지가 인생을 더 강렬하게 조각합니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:18px 20px;border-radius:0 10px 10px 0;margin:20px 0;">
            <div style="font-size:11px;color:var(--gold);margin-bottom:10px;letter-spacing:1px;">가장 강한 기운 — ${OHK[maxEl]||maxEl} (${maxPct}%)</div>
            <p style="font-size:14px;color:#ddd;line-height:1.9;margin:0;">${excessDesc[maxEl]||maxEl+'이 강합니다.'}</p>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:16px 18px;margin:14px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom