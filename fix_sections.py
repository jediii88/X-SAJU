with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# =========================================================
# 1. buildShinsalSummary 완전 교체
# =========================================================
old_shin_start = 'function buildShinsalSummary(data) {'
old_shin_end = '\nfunction buildStrengthSummary(data) {'
i1 = html.find(old_shin_start)
i2 = html.find(old_shin_end, i1)
if i1 < 0 or i2 < 0:
    print(f'buildShinsalSummary 위치 오류: {i1}~{i2}')
else:
    new_shin = r'''function buildShinsalSummary(data) {
    const shinsal = data.allShinsal || [];
    const isStrong = (data.strengthText||'').includes('신강');
    const goodCats = ['길성'];
    if(!shinsal || shinsal.length === 0) {
        return `<div class="inline-interp">
            <div class="ii-label">✦ 신살·길성 분석</div>
            <div class="ii-title">특별한 신살이 없는 순수한 원국</div>
            <div class="ii-text"><p style="font-size:13.5px;color:#bbb;line-height:1.85;">당신의 원국에는 특별한 신살이 검출되지 않았습니다. 신살이 없다는 것은 흉한 것이 아닙니다. 오히려 복잡한 에너지의 간섭 없이 일간의 본래 기질이 가장 맑고 순수하게 발현됩니다. 당신의 삶은 특별한 충격이나 사건보다 꾸준함과 본인의 의지로 설계됩니다.</p></div>
        </div>`;
    }
    const goodList = shinsal.filter(s => (window.SHINSAL_DESC?.[s]?.cat||'') === '길성');
    const badList  = shinsal.filter(s => (window.SHINSAL_DESC?.[s]?.cat||'') !== '길성');
    const personalTips = {
        '천을귀인':'당신의 사주에 천을귀인이 있습니다. 이는 평생 위기의 순간마다 귀인이 나타나 도움을 주는 구조입니다. 가장 막막한 순간에 의외의 사람이 결정적 도움을 줍니다. 이 귀인을 알아보는 눈을 키우십시오. 귀인은 대개 화려하지 않고 소박하고 조용한 방식으로 나타납니다. 사람을 가볍게 여기지 말고, 인연을 소중히 하는 삶이 이 천을귀인을 최대한 활성화시킵니다.',
        '문곡귀인':'당신의 사주에 문곡귀인이 있습니다. 학문과 지식에서 남다른 재능이 있으며, 글쓰기·강의·컨설팅으로 사회적 인정과 재물을 얻을 수 있습니다. 지식이 돈이 되는 직업군에서 이 길성이 가장 빛납니다. 자격증, 전문 지식, 저술 활동을 적극적으로 추진하십시오. 배움을 멈추지 않는 삶이 이 귀인을 평생 활성화시킵니다.',
        '역마살':'당신의 사주에 역마살이 있습니다. 한 곳에 오래 머물면 답답함을 느끼는 체질입니다. 이동, 출장, 해외, 여행이 삶에 끊임없이 따라옵니다. 이것을 저주로 볼 것인가, 세계를 무대로 활동하는 자유로운 삶의 설계도로 볼 것인가는 당신의 선택입니다. 역마살을 가진 사람이 억지로 한 곳에 묶어두면 오히려 더 큰 불운이 찾아옵니다. 이동과 변화를 직업으로 만드는 것이 최선의 전략입니다.',
        '도화살':'당신의 사주에 도화살이 있습니다. 사람을 끌어당기는 자연스러운 매력이 있습니다. 이 에너지를 잘 활용하면 대인관계, 영업, 마케팅, 예술 분야에서 천부적 재능이 됩니다. 다만 경계 없는 이성 관계는 나중에 복잡한 상황을 만들 수 있으니, 매력을 비즈니스로 승화시키는 것이 현명한 전략입니다.',
        '화개살':'당신의 사주에 화개살이 있습니다. 예술, 종교, 철학, 영성에 깊은 관심이 있으며 창의적 분야에서 독보적 능력을 발휘합니다. 혼자 있는 시간을 사랑하며, 고독 속에서 오히려 깊은 통찰이 나옵니다. 이 기운을 창작이나 정신적 성장에 쏟는 사람들이 가장 큰 성취를 이룹니다.',
        '천살':'당신의 사주에 천살이 있습니다. 예측 불가한 사건이 삶에 반복적으로 찾아옵니다. 그러나 이것은 불운이 아닌 당신을 단련시키는 시련의 코드입니다. 천살이 강한 대운이나 세운에서 특히 주의하고, 미리 준비된 자에게 천살은 오히려 더 큰 도약의 계기가 됩니다. 보험, 비상자금, 위기 대응 계획을 평소에 철저히 갖춰두십시오.',
        '백호대살':'당신의 사주에 백호대살이 있습니다. 강렬하고 급격한 사건 에너지입니다. 다만 이 에너지를 가진 사람들 중 군인, 경찰, 외과의사, 소방관, 스포츠 선수 등 강인함이 요구되는 분야에서 탁월한 능력을 발휘하는 경우가 매우 많습니다. 백호대살은 흉살이 아니라 강인함의 코드입니다. 이 에너지를 사회적으로 인정받는 방향으로 분출하는 것이 핵심입니다.',
        '홍염살':'당신의 사주에 홍염살이 있습니다. 이성에게 매력적으로 보이는 강렬한 기운입니다. 연애 인연이 활발하지만 감정의 파도가 크게 휘몰아칩니다. 감정과 이성의 균형, 상대방의 마음을 배려하는 성숙함이 이 기운을 다스리는 열쇠입니다.',
        '천의성':'당신의 사주에 천의성이 있습니다. 의료, 치료, 상담, 구호 분야에서 천부적 재능을 발휘합니다. 사람의 아픔을 공감하고 치유하는 능력이 있으며, 이 방향으로 커리어를 설계하면 사회적 인정과 재물이 자연스럽게 따라옵니다.',
        '학당귀인':'당신의 사주에 학당귀인이 있습니다. 공부하는 기운이 강하게 작동하여 배움과 자기계발로 성취를 이루는 구조입니다. 평생 학습하는 자세가 당신의 가장 큰 경쟁력입니다. 자격증, 학위, 전문 교육이 직접적으로 삶의 수준을 높여줍니다.',
        '지살':'당신의 사주에 지살이 있습니다. 변화와 이동이 삶에 자주 찾아옵니다. 안주하려는 순간 환경이 바뀌는 패턴이 반복됩니다. 이 기운을 거스르지 말고 유연하게 변화를 받아들이는 사람이 최종적으로 가장 넓은 세계를 가지게 됩니다.',
        '년살':'당신의 사주에 년살이 있습니다. 이성 인연과 사교성이 강합니다. 적극적인 대외 활동과 사람들과의 관계 확장이 재물과 직업에서도 도움이 됩니다.',
        '망신살':'당신의 사주에 망신살이 있습니다. 예기치 않은 망신, 실수, 구설이 반복될 수 있는 에너지입니다. 말과 행동을 신중히 하고, 중요한 일에서는 한 번 더 확인하는 습관이 이 기운을 다스립니다. 단, 망신살이 있는 사람들 중에는 오히려 그 시련을 통해 더 강해지는 경우가 많습니다.',
        '겁살':'당신의 사주에 겁살이 있습니다. 삶에서 갑작스러운 손재수, 도난, 사기, 외부 충격이 반복될 수 있습니다. 재물 관리에 특히 신중하고, 보증이나 투자에서 충동적 결정을 피하십시오. 이 기운이 강한 대운·세운에는 방어적 전략이 최선입니다.'
    };
    const rows = shinsal.map(s => {
        const info = window.SHINSAL_DESC?.[s] || {cat:'신살', color:'#aaa', short:s, detail:''};
        const catColor = goodCats.includes(info.cat) ? '#c7a76a' : info.color || '#e74c3c';
        const isGood = goodCats.includes(info.cat);
        const personalTip = personalTips[s] || '';
        const baseDetail = info.detail || '';
        return `<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:16px 18px;margin-bottom:14px;border-left:3px solid ${catColor};">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
                <span style="font-size:17px;font-weight:800;color:${catColor};">${s}</span>
                <span style="font-size:11px;background:rgba(255,255,255,0.07);color:${catColor};padding:2px 10px;border-radius:10px;">${isGood ? '✦ 길성' : '⚠ 신살'}</span>
                <span style="font-size:12px;color:#777;">${info.short||''}</span>
            </div>
            ${baseDetail ? `<p style="font-size:13.5px;color:#ccc;line-height:1.85;margin:0 0 10px;">${baseDetail}</p>` : ''}
            ${personalTip ? `<div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:12px 14px;border-left:2px solid ${catColor};"><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">${personalTip}</p></div>` : ''}
        </div>`;
    }).join('');
    return `<div class="inline-interp">
        <div class="ii-label">✦ 신살 · 길성 상세 분석</div>
        <div class="ii-title">당신의 사주에 새겨진 특별한 에너지 코드 — 총 ${shinsal.length}개</div>
        <div class="ii-text">
            <p style="font-size:13.5px;color:#bbb;line-height:1.85;margin-bottom:16px;">신살은 단순한 운의 좋고 나쁨이 아닙니다. 길성은 선천적으로 타고난 무기이고, 신살은 당신을 단련시키는 도전의 코드입니다. 흉살도 올바르게 이해하고 활용하면 가장 강력한 무기가 됩니다. 아래는 당신의 사주에서 확인된 특수 기운들입니다.</p>
            ${goodList.length > 0 ? `<div style="margin-bottom:10px;padding:12px 16px;background:rgba(199,167,106,0.07);border-radius:10px;border-left:3px solid var(--gold);">
                <div style="font-size:12px;color:var(--gold);margin-bottom:6px;">✦ 길성 ${goodList.length}개 — 선천적으로 타고난 무기</div>
                <div style="font-size:14px;color:#ddd;font-weight:700;">${goodList.join(' · ')}</div>
            </div>` : ''}
            ${badList.length > 0 ? `<div style="margin-bottom:16px;padding:12px 16px;background:rgba(231,76,60,0.06);border-radius:10px;border-left:3px solid #e74c3c;">
                <div style="font-size:12px;color:#e74c3c;margin-bottom:6px;">⚠ 신살 ${badList.length}개 — 삶을 단련시키는 도전의 코드</div>
                <div style="font-size:14px;color:#ddd;font-weight:700;">${badList.join(' · ')}</div>
                <p style="font-size:12px;color:#999;margin:8px 0 0;line-height:1.7;">신살은 흉이 아닙니다. 이 에너지를 이해하고 제대로 활용한 사람이 오히려 더 강해집니다.</p>
            </div>` : ''}
            ${rows}
        </div>
    </div>`;
}
'''
    html = html[:i1] + new_shin + '\n' + html[i2+1:]
    print(f'buildShinsalSummary 교체 OK')

# =========================================================
# 2. buildStrengthSummary 완전 교체
# =========================================================
old_str_start = 'function buildStrengthSummary(data) {'
old_str_end = '\nfunction injectInlineSummaries(data) {'
j1 = html.find(old_str_start)
j2 = html.find(old_str_end, j1)
# injectInlineSummaries 없을 경우
if j2 < 0:
    old_str_end = '\nfunction buildSectionHeader'
    j2 = html.find(old_str_end, j1)
print(f'buildStrengthSummary: {j1}~{j2}')
if j1 > 0 and j2 > j1:
    new_str = r'''function buildStrengthSummary(data) {
    const isStrong = (data.strengthText||'').includes('신강') || (data.strengthText||'').includes('강');
    const pct = data.strengthPct !== undefined ? data.strengthPct : (isStrong ? 65 : 35);
    const yong = data.yong || 'metal';
    const gi = data.gi || 'wood';
    const hee = data.hee || 'fire';
    const OH = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    const strengthLabel = isStrong ? '신강' : '신약';
    const title = isStrong ? '신강 — 넘치는 에너지, 주도적 인생 설계자' : '신약 — 협력과 귀인으로 폭발하는 시너지형';
    const coreText = isStrong
        ? `기운이 충만한 신강 사주입니다. 당신의 일간 에너지가 강하게 독립적으로 작동합니다. 이것은 "나만의 판을 직접 짜는 사람"의 에너지입니다. 남의 지시 아래서는 능력의 절반도 발휘하지 못하고 답답함을 느끼다가 결국 독립하게 됩니다. 창업, 프리랜서, 전문직, 1인 미디어 등 자율성이 최대한 보장된 환경에서 진짜 능력이 폭발합니다.\n\n신강 사주의 함정은 독단적 결정과 인간관계 마찰입니다. 강한 기운이 넘쳐서 주변 사람들을 눌러버리거나, 의견 충돌에서 절대 물러서지 않는 고집이 인간관계를 어렵게 만들 수 있습니다. 이 에너지를 사회적으로 인정받는 방향으로 분출하는 법을 배우는 것이 인생의 핵심 과제입니다.`
        : `에너지가 분산된 신약 사주입니다. 이것은 약함이 아니라 "협력과 연결로 증폭되는 사람"의 에너지입니다. 혼자서 모든 것을 짊어지려 하면 무너집니다. 하지만 훌륭한 파트너·팀·귀인과 함께하면 1+1이 10이 되는 폭발적 시너지가 발생합니다.\n\n신약 사주의 가장 큰 전략은 "좋은 사람을 알아보는 눈"을 키우는 것입니다. 용신 오행(${OH[yong]||yong})을 일간으로 가진 사람이 당신의 에너지를 가장 잘 보완해주는 귀인입니다. 일, 사랑, 사업 파트너 선택에서 이 원칙을 적용하면 인생의 흐름이 바뀝니다.`;
    const stratText = isStrong
        ? `✦ 신강 핵심 전략: 기신 에너지(${OH[gi]||gi})가 오는 대운·세운에서 과잉 에너지를 다스리는 것이 최우선입니다. 에너지가 넘칠수록 인간관계와 건강을 먼저 챙기십시오. 용신(${OH[yong]||yong}) 대운에서는 공격적으로 확장하되, 신뢰할 수 있는 팀을 구성하여 독주를 피하십시오.`
        : `✦ 신약 핵심 전략: 용신 에너지(${OH[yong]||yong})를 가진 귀인·파트너를 곁에 두십시오. 직업은 자신의 전문성을 살리되 조직이나 파트너와 함께하는 구조가 유리합니다. 혼자 밀어붙이기보다 좋은 사람과 함께하는 방식이 더 크고 안정적인 결과를 만들어냅니다.`;
    return `<div class="inline-interp">
        <div class="ii-label">✦ 신강·신약 해석</div>
        <div class="ii-title">${title}</div>
        <div class="ii-text">
            <p style="font-size:13.5px;color:#bbb;line-height:1.9;white-space:pre-line;margin-bottom:14px;">${coreText}</p>
            <div style="background:rgba(199,167,106,0.07);border-radius:10px;padding:14px 16px;border-left:3px solid var(--gold);">
                <p style="font-size:13px;color:#ddd;line-height:1.85;margin:0;">${stratText}</p>
            </div>
        </div>
    </div>`;
}
'''
    html = html[:j1] + new_str + '\n' + html[j2+1:]
    print('buildStrengthSummary 교체 OK')

# =========================================================
# 3. 정적 placeholder 텍스트 → 로딩 스피너로 교체
#    (JS가 실행되면 교체되므로 최초 표시는 "분석 중...")
# =========================================================
# 합충형파해 placeholder
old_rel_ph = '''<div id="relation-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 합·충·형·파·해 해석</div>
  <div class="ii-title">원국의 충돌과 결합 — 반복되는 인생 패턴의 원형</div>
  <div class="ii-text">
    <p>합·충·형·파·해는 사주 8글자 안에서 글자끼리 일으키는 화학작용입니다. 이 관계들이 당신이 살면서 반복적으로 경험하는 패턴의 원형입니다.</p>
    <p>합이 있는 기운과는 인연이 쉽게 맺어지고, 충이 있는 기운과는 긴장 관계가 형성됩니다. 이것을 알면 인간관계와 중요 결정에서 한발 앞서 대응할 수 있습니다. </p>
  </div>
</div>
</div>'''
new_rel_ph = '<div id="relation-inline-summary" class="section-interp"></div>'
if old_rel_ph in html:
    html = html.replace(old_rel_ph, new_rel_ph, 1)
    print('합충형파해 placeholder 제거: OK')
else:
    print('합충형파해 placeholder 못찾음')

# 신살 placeholder
old_shin_ph = '''<div id="shinsal-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 신살 해석</div>
  <div class="ii-title">당신의 사주에 새겨진 특별한 별의 기운</div>
  <div class="ii-text">
    <p>신살은 사주 8글자의 조합에서 발동하는 특수한 에너지입니다. 천을귀인·문창귀인 같은 길성은 타고난 복력이고, 역마살·도화살 같은 동살은 당신의 삶에 독특한 색깔을 입힙니다.</p>
    <p>중요한 것은 길성이든 흉살이든 — 그것이 당신이라는 사람을 설명하는 코드입니다. 흉살도 올바르게 활용하면 강력한 무기가 됩니다. </p>
  </div>
</div>
</div>'''
new_shin_ph = '<div id="shinsal-inline-summary" class="section-interp"></div>'
if old_shin_ph in html:
    html = html.replace(old_shin_ph, new_shin_ph, 1)
    print('신살 placeholder 제거: OK')
else:
    print('신살 placeholder 못찾음')

# 오행 placeholder
old_wx_ph = '''<div id="wuxing-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 오행 분석</div>
  <div class="ii-title">당신의 에너지 지도 — 절대적 무기와 아킬레스건</div>
  <div class="ii-text">
    <p>목·화·토·금·수 다섯 기운의 분포가 당신의 뇌 구조, 판단 방식, 인간관계 패턴의 80%를 결정합니다. 한쪽으로 쏠린 기운이 클수록 그 에너지가 인생을 더 강렬하게 조각합니다.</p>
    <p>중화된 사주가 편안한 삶을 산다면, 편중된 사주는 한 분야에서 독보적인 존재가 됩니다. 당신의 오행 편중이 어떤 무기가 되는지 — </p>
  </div>
</div>
</div>'''
new_wx_ph = '<div id="wuxing-inline-summary" class="section-interp"></div>'
if old_wx_ph in html:
    html = html.replace(old_wx_ph, new_wx_ph, 1)
    print('오행 placeholder 제거: OK')
else:
    print('오행 placeholder 못찾음')

# 십성 placeholder
old_sip_ph = '''<div id="sipseong-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 십성 분석</div>
  <div class="ii-title">사회적 페르소나 — 당신이 세상을 대하는 방식</div>
  <div class="ii-text">
    <p>십성은 일간을 중심으로 나머지 7글자가 맺는 관계입니다. 비견·겁재는 경쟁심과 독립심, 식신·상관은 재능과 표현욕, 정재·편재는 재물관, 정관·편관은 권력욕, 정인·편인은 학습욕과 직관력입니다.</p>
    <p>어떤 십성이 강하냐에 따라 당신이 돈을 버는 방식, 사람을 이끄는 방식, 사랑에 빠지는 방식이 결정됩니다. </p>
  </div>
</div>
</div>'''
new_sip_ph = '<div id="sipseong-inline-summary" class="section-interp"></div>'
if old_sip_ph in html:
    html = html.replace(old_sip_ph, new_sip_ph, 1)
    print('십성 placeholder 제거: OK')
else:
    print('십성 placeholder 못찾음')

# 용신 placeholder
old_yong_ph = '''<div id="yong-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 용신·희신·기신 해석</div>
  <div class="ii-title">나를 돕는 기운 vs 방해하는 기운</div>
  <div class="ii-text">
    <p>용신은 당신의 사주를 균형 잡아주는 가장 중요한 기운입니다. 용신의 오행이 강해지는 대운과 세운에서 인생이 크게 도약합니다. 반대로 기신의 기운이 들어오는 시기에는 수비적 전략이 필요합니다.</p>
    <p>