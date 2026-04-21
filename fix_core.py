with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# =========================================================
# 1. buildShinsalSummary 완전 교체
# =========================================================
i1 = html.find('function buildShinsalSummary(data) {')
i2 = html.find('\nfunction buildStrengthSummary(data) {', i1)
if i1 < 0 or i2 < 0:
    print(f'buildShinsalSummary 위치 오류: {i1}~{i2}')
else:
    new_shin = 'function buildShinsalSummary(data) {\n'
    new_shin += '    const shinsal = data.allShinsal || [];\n'
    new_shin += '    const goodCats = [\'길성\'];\n'
    new_shin += '    if(!shinsal || shinsal.length === 0) {\n'
    new_shin += '        return \'<div class="inline-interp"><div class="ii-label">\\u2756 신살\\u00b7길성 분석</div><div class="ii-title">특별한 신살이 없는 순수한 원국</div><div class="ii-text"><p style="font-size:13.5px;color:#bbb;line-height:1.85;">당신의 원국에는 특별한 신살이 검출되지 않았습니다. 신살이 없다는 것은 흉한 것이 아닙니다. 오히려 복잡한 에너지의 간섭 없이 일간의 본래 기질이 가장 맑고 순수하게 발현됩니다. 당신의 삶은 특별한 충격이나 사건보다 꾸준함과 본인의 의지로 설계됩니다.</p></div></div>\';\n'
    new_shin += '    }\n'
    new_shin += '    const goodList = shinsal.filter(s => (window.SHINSAL_DESC?.[s]?.cat||\'\')=== \'길성\');\n'
    new_shin += '    const badList  = shinsal.filter(s => (window.SHINSAL_DESC?.[s]?.cat||\'\')=== \'신살\' || !(window.SHINSAL_DESC?.[s]?.cat) || window.SHINSAL_DESC?.[s]?.cat !== \'길성\');\n'
    new_shin += '    const personalTips = {\n'
    tips = {
        '천을귀인': '당신의 사주에 천을귀인이 있습니다. 이는 평생 위기의 순간마다 귀인이 나타나 도움을 주는 구조입니다. 가장 막막한 순간에 의외의 사람이 결정적 도움을 줍니다. 귀인을 알아보는 눈을 키우십시오. 귀인은 대개 화려하지 않고 소박하게 나타납니다. 사람을 가볍게 여기지 말고 인연을 소중히 하는 삶이 이 길성을 최대한 활성화시킵니다.',
        '문곡귀인': '당신의 사주에 문곡귀인이 있습니다. 학문과 지식에서 남다른 재능이 있으며, 글쓰기·강의·컨설팅으로 사회적 인정과 재물을 얻을 수 있습니다. 자격증, 전문 지식, 저술 활동을 적극적으로 추진하십시오. 배움을 멈추지 않는 삶이 이 귀인을 평생 활성화시킵니다.',
        '역마살': '당신의 사주에 역마살이 있습니다. 한 곳에 오래 머물면 답답함을 느끼는 체질입니다. 이동, 출장, 해외, 여행이 삶에 끊임없이 따라옵니다. 억지로 한 곳에 묶어두면 오히려 더 큰 불운이 찾아옵니다. 이동과 변화를 직업으로 만드는 것이 최선의 전략입니다. 유통, 무역, 운송, 외교, 해외영업 분야가 특히 유리합니다.',
        '도화살': '당신의 사주에 도화살이 있습니다. 사람을 끌어당기는 자연스러운 매력이 있습니다. 이 에너지를 대인관계, 영업, 마케팅, 예술 분야에서 활용하면 천부적 재능이 됩니다. 매력을 비즈니스로 승화시키는 것이 현명한 전략입니다.',
        '화개살': '당신의 사주에 화개살이 있습니다. 예술, 종교, 철학, 영성에 깊은 관심이 있으며 창의적 분야에서 독보적 능력을 발휘합니다. 혼자 있는 시간을 사랑하며 고독 속에서 깊은 통찰이 나옵니다. 이 기운을 창작이나 정신적 성장에 쏟는 사람들이 가장 큰 성취를 이룹니다.',
        '천살': '당신의 사주에 천살이 있습니다. 예측 불가한 사건이 삶에 반복적으로 찾아옵니다. 그러나 준비된 자에게 천살은 오히려 더 큰 도약의 계기가 됩니다. 보험, 비상자금, 위기 대응 계획을 평소에 철저히 갖춰두십시오.',
        '백호대살': '당신의 사주에 백호대살이 있습니다. 강렬하고 급격한 사건 에너지입니다. 군인, 경찰, 외과의사, 소방관, 스포츠 선수 등 강인함이 요구되는 분야에서 탁월한 능력을 발휘하는 경우가 많습니다. 이 에너지를 사회적으로 인정받는 방향으로 분출하는 것이 핵심입니다.',
        '홍염살': '당신의 사주에 홍염살이 있습니다. 이성에게 매력적으로 보이는 강렬한 기운입니다. 연애 인연이 활발하지만 감정의 파도가 크게 휘몰아칩니다. 감정과 이성의 균형이 이 기운을 다스리는 열쇠입니다.',
        '천의성': '당신의 사주에 천의성이 있습니다. 의료, 치료, 상담, 구호 분야에서 천부적 재능을 발휘합니다. 이 방향으로 커리어를 설계하면 사회적 인정과 재물이 자연스럽게 따라옵니다.',
        '학당귀인': '당신의 사주에 학당귀인이 있습니다. 배움과 자기계발로 성취를 이루는 구조입니다. 평생 학습하는 자세가 당신의 가장 큰 경쟁력입니다. 자격증, 학위, 전문 교육이 직접적으로 삶의 수준을 높여줍니다.',
        '망신살': '당신의 사주에 망신살이 있습니다. 예기치 않은 망신, 실수, 구설이 반복될 수 있는 에너지입니다. 말과 행동을 신중히 하고 중요한 일에서는 한 번 더 확인하는 습관이 이 기운을 다스립니다.',
        '겁살': '당신의 사주에 겁살이 있습니다. 갑작스러운 손재수, 도난, 사기, 외부 충격이 반복될 수 있습니다. 재물 관리에 특히 신중하고, 보증이나 투자에서 충동적 결정을 피하십시오.'
    }
    for k, v in tips.items():
        v2 = v.replace("'", "\\'")
        new_shin += f"        '{k}':'{v2}',\n"
    new_shin += '    };\n'
    new_shin += '    const rows = shinsal.map(s => {\n'
    new_shin += '        const info = window.SHINSAL_DESC?.[s] || {cat:\'신살\', color:\'#aaa\', short:s, detail:\'\'};\n'
    new_shin += '        const catColor = goodCats.includes(info.cat) ? \'#c7a76a\' : info.color || \'#e74c3c\';\n'
    new_shin += '        const isGood = goodCats.includes(info.cat);\n'
    new_shin += '        const personalTip = personalTips[s] || \'\';\n'
    new_shin += '        const baseDetail = info.detail || \'\';\n'
    new_shin += '        return `<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:16px 18px;margin-bottom:14px;border-left:3px solid ${catColor};">\n'
    new_shin += '            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;">\n'
    new_shin += '                <span style="font-size:17px;font-weight:800;color:${catColor};">${s}</span>\n'
    new_shin += '                <span style="font-size:11px;background:rgba(255,255,255,0.07);color:${catColor};padding:2px 10px;border-radius:10px;">${isGood ? \'\\u2756 길성\' : \'\\u26a0 신살\'}</span>\n'
    new_shin += '                <span style="font-size:12px;color:#777;">${info.short||\'\'}</span>\n'
    new_shin += '            </div>\n'
    new_shin += '            ${baseDetail ? `<p style="font-size:13.5px;color:#ccc;line-height:1.85;margin:0 0 10px;">${baseDetail}</p>` : \'\'}\n'
    new_shin += '            ${personalTip ? `<div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:12px 14px;border-left:2px solid ${catColor};"><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">${personalTip}</p></div>` : \'\'}\n'
    new_shin += '        </div>`;\n'
    new_shin += '    }).join(\'\');\n'
    new_shin += '    return `<div class="inline-interp">\n'
    new_shin += '        <div class="ii-label">\\u2756 신살 \\u00b7 길성 상세 분석</div>\n'
    new_shin += '        <div class="ii-title">당신의 사주에 새겨진 특별한 에너지 코드 \\u2014 총 ${shinsal.length}개</div>\n'
    new_shin += '        <div class="ii-text">\n'
    new_shin += '            <p style="font-size:13.5px;color:#bbb;line-height:1.85;margin-bottom:16px;">신살은 단순한 운의 좋고 나쁨이 아닙니다. 길성은 선천적으로 타고난 무기이고, 신살은 당신을 단련시키는 도전의 코드입니다. 흉살도 올바르게 이해하고 활용하면 가장 강력한 무기가 됩니다.</p>\n'
    new_shin += '            ${goodList.length > 0 ? `<div style="margin-bottom:10px;padding:12px 16px;background:rgba(199,167,106,0.07);border-radius:10px;border-left:3px solid var(--gold);"><div style="font-size:12px;color:var(--gold);margin-bottom:6px;">\\u2756 길성 ${goodList.length}개 \\u2014 선천적으로 타고난 무기</div><div style="font-size:14px;color:#ddd;font-weight:700;">${goodList.join(\' \\u00b7 \')}</div></div>` : \'\'}\n'
    new_shin += '            ${badList.length > 0 ? `<div style="margin-bottom:16px;padding:12px 16px;background:rgba(231,76,60,0.06);border-radius:10px;border-left:3px solid #e74c3c;"><div style="font-size:12px;color:#e74c3c;margin-bottom:6px;">\\u26a0 신살 ${badList.length}개 \\u2014 삶을 단련시키는 도전의 코드</div><div style="font-size:14px;color:#ddd;font-weight:700;">${badList.join(\' \\u00b7 \')}</div></div>` : \'\'}\n'
    new_shin += '            ${rows}\n'
    new_shin += '        </div>\n'
    new_shin += '    </div>`;\n'
    new_shin += '}\n'
    html = html[:i1] + new_shin + html[i2:]
    print('buildShinsalSummary 교체 OK')

# =========================================================
# 2. buildStrengthSummary 완전 교체
# =========================================================
j1 = html.find('function buildStrengthSummary(data) {')
j2 = html.find('\nfunction injectInlineSummaries', j1)
if j2 < 0:
    j2 = html.find('\nfunction buildSectionHeader', j1)
print(f'buildStrengthSummary: {j1}~{j2}')
if j1 > 0 and j2 > j1:
    new_str = 'function buildStrengthSummary(data) {\n'
    new_str += '    const isStrong = (data.strengthText||\'\').includes(\'신강\') || (data.strengthText||\'\').includes(\'강\');\n'
    new_str += '    const yong = data.yong || \'metal\';\n'
    new_str += '    const gi = data.gi || \'wood\';\n'
    new_str += '    const OH = {wood:\'목\',fire:\'화\',earth:\'토\',metal:\'금\',water:\'수\'};\n'
    new_str += '    const title = isStrong ? \'신강 \\u2014 넘치는 에너지, 주도적 인생 설계자\' : \'신약 \\u2014 협력과 귀인으로 폭발하는 시너지형\';\n'
    
    core_strong = '기운이 충만한 신강 사주입니다. 당신의 일간 에너지가 강하게 독립적으로 작동합니다. 이것은 내 판을 직접 짜는 사람의 에너지입니다. 남의 지시 아래서는 능력의 절반도 발휘하지 못하고 답답함을 느끼다가 결국 독립하게 됩니다. 창업, 프리랜서, 전문직, 1인 미디어 등 자율성이 최대한 보장된 환경에서 진짜 능력이 폭발합니다. 신강 사주의 함정은 독단적 결정과 인간관계 마찰입니다. 강한 기운이 넘쳐서 주변 사람들을 눌러버리거나, 의견 충돌에서 물러서지 않는 고집이 인간관계를 어렵게 만들 수 있습니다. 이 에너지를 사회적으로 인정받는 방향으로 분출하는 법을 배우는 것이 인생의 핵심 과제입니다.'
    core_weak = '에너지가 분산된 신약 사주입니다. 이것은 약함이 아니라 협력과 연결로 증폭되는 사람의 에너지입니다. 혼자서 모든 것을 짊어지려 하면 무너집니다. 하지만 훌륭한 파트너, 팀, 귀인과 함께하면 1+1이 10이 되는 폭발적 시너지가 발생합니다. 신약 사주의 가장 큰 전략은 좋은 사람을 알아보는 눈을 키우는 것입니다. 용신 오행을 일간으로 가진 사람이 당신의 에너지를 가장 잘 보완해주는 귀인입니다. 일, 사랑, 사업 파트너 선택에서 이 원칙을 적용하면 인생의 흐름이 바뀝니다.'

    new_str += f'    const coreText = isStrong ? \'{core_strong}\' : \'{core_weak}\';\n'
    new_str += '    const stratText = isStrong\n'
    new_str += '        ? `\\u2756 신강 핵심 전략: 기신 에너지(${OH[gi]||gi})가 오는 대운·세운에서 과잉 에너지를 다스리는 것이 최우선입니다. 에너지가 넘칠수록 인간관계와 건강을 먼저 챙기십시오. 용신(${OH[yong]||yong}) 대운에서는 공격적으로 확장하되, 신뢰할 수 있는 팀을 구성하여 독주를 피하십시오.`\n'
    new_str += '        : `\\u2756 신약 핵심 전략: 용신 에너지(${OH[yong]||yong})를 가진 귀인·파트너를 곁에 두십시오. 직업은 자신의 전문성을 살리되 조직이나 파트너와 함께하는 구조가 유리합니다. 혼자 밀어붙이기보다 좋은 사람과 함께하는 방식이 더 크고 안정적인 결과를 만들어냅니다.`;\n'
    new_str += '    return `<div class="inline-interp">\n'
    new_str += '        <div class="ii-label">\\u2756 신강·신약 해석</div>\n'
    new_str += '        <div class="ii-title">${title}</div>\n'
    new_str += '        <div class="ii-text">\n'
    new_str += '            <p style="font-size:13.5px;color:#bbb;line-height:1.9;margin-bottom:14px;">${coreText}</p>\n'
    new_str += '            <div style="background:rgba(199,167,106,0.07);border-radius:10px;padding:14px 16px;border-left:3px solid var(--gold);">\n'
    new_str += '                <p style="font-size:13px;color:#ddd;line-height:1.85;margin:0;">${stratText}</p>\n'
    new_str += '            </div>\n'
    new_str += '        </div>\n'
    new_str += '    </div>`;\n'
    new_str += '}\n'
    html = html[:j1] + new_str + html[j2:]
    print('buildStrengthSummary 교체 OK')

# =========================================================
# 3. 정적 placeholder → 빈 div (JS가 채움)
# =========================================================
placeholders = [
    ('relation-inline-summary', '합·충·형·파·해 해석'),
    ('shinsal-inline-summary', '신살 해석'),
    ('wuxing-inline-summary', '오행 분석'),
    ('sipseong-inline-summary', '십성 분석'),
    ('yong-inline-summary', '용신·희신·기신 해석'),
]
for pid, plabel in placeholders:
    # 해당 div 찾아서 내용 비우기
    import re
    # <div id="pid" class="section-interp">...</div> 패턴 교체
    pat = f'<div id="{pid}" class="section-interp">'
    idx = html.find(pat)
    if idx < 0:
        print(f'{pid} 못찾음')
        continue
    # 내용 시작점
    content_start = idx + len(pat)
    # 중첩 div 카운트하여 끝 찾기
    depth = 1
    pos = content_start
    while pos < len(html) and depth > 0:
        next_open = html.find('<div', pos)
        next_close = html.find('</div>', pos)
        if next_open < 0: next_open = len(html)
        if next_close < 0: next_close = len(html)
        if next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                end_pos = next_close + 6
                break
            pos = next_close + 6
    # 내용이 있는 경우만 교체
    inner = html[content_start:next_close]
    if len(inner.strip()) > 10:
        html = html[:content_start] + html[next_close:]
        print(f'{pid} placeholder 제거 ({len(inner.strip())}자): OK')
    else:
        print(f'{pid} 이미 비어있음')

# 신강신약 strength-inline-summary도 정리
str_ph_start = '<div id="strength-inline-summary" style="margin:0 0 8px 0;">'
str_ph_pat = html.find(str_ph_start)
if str_ph_pat > 0:
    c_start = str_ph_pat + len(str_ph_start)
    depth = 1
    pos = c_start
    while pos < len(html) and depth > 0:
        no = html.find('<div', pos)
        nc = html.find('</div>', pos)
        if no < 0: no = len(html)
        if nc < 0: nc = len(html)
        if no < nc:
            depth += 1
            pos = no + 4
        else:
            depth -= 1
            if depth == 0:
                inner2 = html[c_start:nc]
                if len(inner2.strip()) > 10:
                    html = html[:c_start] + html[nc:]
                    print(f'strength-inline-summary placeholder 제거: OK')
                break
            pos = nc + 6

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('저장 완료')
