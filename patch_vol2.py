import re

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ── Axe 행동 지침 제거 (세운) ──
old_axe = (
    '                <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(5px);'
    ' -webkit-backdrop-filter: blur(5px); padding: 15px; border-radius: 6px; border-left: 3px solid #d32f2f;">\n'
    '                    <span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🚨 Axe의 행동 지침:</span>\n'
    '                    <span style="color: #bbb; font-size: 14px; line-height: 1.6;">'
    ' ${i%2===0 ? "올해는 투자를 확장하거나 새로운 일을 벌이기보다는, 내실을 다지고 현금을 확보하는 방어적 태세가 당신을 살립니다."'
    ' : "올해는 당신의 판입니다. 70%의 확신만 섰다면 뒤돌아보지 말고 즉시 실행하십시오. 머뭇거리면 기운을 뺏깁니다."}</span>\n'
    '                </div>'
)
new_axe = (
    '                <div style="background:rgba(255,255,255,0.04);border-left:3px solid'
    ' ${i%2===0?\'#e74c3c\':\'#00C853\'};padding:14px 16px;border-radius:0 8px 8px 0;margin-top:4px;">\n'
    '                    <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">올해의 핵심 전략</div>\n'
    '                    <p style="color:#ddd;font-size:13.5px;line-height:1.85;margin:0;">'
    '${i%2===0 ? "올해는 속도보다 방향이 중요합니다. 새로운 것을 벌이기보다 현재의 것을 견고히 하고 현금 흐름을 안정시키는 데 집중하십시오. 내실을 다진 자가 다음 기회를 온전히 수확합니다."'
    ' : "올해는 당신의 판입니다. 70% 확신이 섰다면 즉시 실행하십시오. 머뭇거리면 기운은 다른 곳으로 흘러갑니다. 이 한 해의 담대한 결단이 앞으로 수년의 궤도를 바꿉니다."}</p>\n'
    '                </div>'
)
if old_axe in html:
    html = html.replace(old_axe, new_axe)
    print("세운 Axe 제거 성공")
else:
    # 대안 패턴
    html = re.sub(
        r'<span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🚨 Axe의 행동 지침:</span>',
        '<span style="font-size:11px;color:var(--text-dim);letter-spacing:1px;">올해의 핵심 전략</span>',
        html
    )
    print("세운 Axe 제거 (대안 패턴 적용)")

# ── 성격 챕터 함수 추가 ──
personality_func = '''
function buildChapterPersonality(data) {
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';
    const iljuKey = (data.dayStem || '') + (data.dayBranch || '');
    const dbEntry = window.SAJU_DB && window.SAJU_DB.ILJU && window.SAJU_DB.ILJU[iljuKey] ? window.SAJU_DB.ILJU[iljuKey] : {};

    const PROS = {
        wood: ['목표를 향해 흔들림 없이 나아가는 불굴의 추진력','새로운 시작을 두려워하지 않는 개척자 정신','타인에 대한 따뜻한 공감과 진심 어린 배려','한 번 믿으면 끝까지 믿는 강한 의리와 신뢰'],
        fire: ['어떤 공간에 있어도 분위기를 이끄는 자연스러운 카리스마','뜨거운 열정으로 주변 사람들을 감화시키는 능력','직관이 탁월하여 기회를 빠르게 포착하는 감각','솔직하고 명쾌하여 신뢰받는 대인 관계'],
        earth: ['어떤 상황에도 흔들리지 않는 묵직한 안정감','모든 사람을 품어내는 포용력과 깊은 신뢰감','실용적 판단력과 꼼꼼한 실행력','오래도록 변하지 않는 중후한 책임감'],
        metal: ['불필요한 것을 과감히 쳐내는 냉철한 판단력','한 번 결정하면 끝까지 밀어붙이는 강한 의지','원칙과 기준이 명확하여 흔들리지 않는 신뢰감','탁월한 집중력으로 전문성을 극대화하는 능력'],
        water: ['상황의 본질을 꿰뚫어보는 날카로운 통찰력','유연하게 변화에 적응하면서도 방향을 잃지 않는 지혜','깊은 감수성으로 타인의 감정을 읽는 공감 능력','광대한 지식 욕구와 끊임없는 자기계발 의지']
    };
    const CONS = {
        wood: ['자존심이 강해 타인의 조언을 받아들이기 어려울 때가 있음','고집으로 인해 불필요한 마찰을 빚기도 함','완벽주의 성향으로 스스로에게 지나치게 엄격함','남에게 속마음을 잘 드러내지 않아 오해를 받을 수 있음'],
        fire: ['충동적으로 행동하여 수습이 필요한 상황을 만들기도 함','감정 기복이 커서 주변 사람들이 눈치를 보게 될 수 있음','지속력보다 폭발력이 강해 마무리가 약한 편','자신의 방식을 강요하는 경향으로 갈등이 생기기도 함'],
        earth: ['변화에 대한 저항이 강해 새로운 기회를 놓치기도 함','지나친 신중함이 결단 타이밍을 늦출 수 있음','타인에게 지나치게 의존하거나 집착하는 경향','자신의 감정을 억누르다가 폭발하는 패턴이 있음'],
        metal: ['감정을 잘 표현하지 않아 냉정하게 보이기도 함','완벽주의적 기준으로 주변 사람들을 지치게 할 수 있음','자기 방식을 고집하여 협업이 어려울 때가 있음','비판에 민감하여 상처를 오래 간직하는 경향'],
        water: ['결정을 내리지 못하고 끝없이 분석하는 경향','지나친 감수성으로 상처를 받기도 쉬운 편','생각이 너무 많아 실행이 늦어지는 경우가 있음','비밀이 많아 가까운 사람들도 속을 알기 어려움']
    };
    const GOOD_MATCH = {
        wood: '화(火) 기운을 가진 사람 — 당신의 에너지를 받아 빛나는 동반자. 수(水) 기운을 가진 사람 — 당신을 키워주는 든든한 후원자.',
        fire: '토(土) 기운을 가진 사람 — 당신의 열정을 현실로 만들어주는 파트너. 목(木) 기운을 가진 사람 — 당신에게 끊임없는 영감을 주는 동료.',
        earth: '금(金) 기운을 가진 사람 — 당신의 포용력 위에서 빛나는 보석. 화(火) 기운을 가진 사람 — 당신의 안정 위에 열정을 더하는 활력소.',
        metal: '수(水) 기운을 가진 사람 — 당신의 날카로움을 부드럽게 다듬어주는 존재. 토(土) 기운을 가진 사람 — 당신이 믿고 의지할 수 있는 안정된 파트너.',
        water: '목(木) 기운을 가진 사람 — 당신의 지혜를 흡수하여 함께 성장하는 동반자. 금(金) 기운을 가진 사람 — 당신의 흐름에 명확한 방향성을 부여하는 나침반.'
    };
    const BAD_MATCH = {
        wood: '금(金) 기운이 강한 사람 — 당신의 의지를 꺾으려는 충돌이 잦습니다. 서로의 강점을 인정하는 훈련이 필요합니다.',
        fire: '수(水) 기운이 강한 사람 — 당신의 열정을 식히려는 에너지와 잦은 충돌이 생깁니다. 감정적 대결을 피하십시오.',
        earth: '목(木) 기운이 강한 사람 — 당신의 안정을 흔들고 변화를 강요하는 패턴이 생깁니다. 변화 속에서 중심을 잡는 연습이 필요합니다.',
        metal: '화(火) 기운이 강한 사람 — 당신의 원칙을 무너뜨리려는 충돌이 잦습니다. 감정적 압박에 흔들리지 마십시오.',
        water: '토(土) 기운이 강한 사람 — 당신의 자유로운 흐름을 막으려는 에너지가 스트레스를 유발합니다. 경계 설정이 중요합니다.'
    };

    const pros = PROS[stemEl] || PROS['earth'];
    const cons = CONS[stemEl] || CONS['earth'];
    const goodMatch = GOOD_MATCH[stemEl] || '';
    const badMatch = BAD_MATCH[stemEl] || '';
    const iljuTitle = dbEntry.title || '당신의 일주';

    return `<div class="report-chapter" id="sec-personality">
        <h3 class="ch-title">Chapter 9-1. 성격 분석 — 당신이라는 사람</h3>
        <p class="ch-text" style="margin-bottom:20px;">[${iljuTitle}]을 타고난 당신. 사주에서 성격은 선천적으로 새겨진 코드입니다. 이 코드를 정확히 아는 사람과 모르는 사람 사이에는, 같은 상황에서도 전혀 다른 결과가 나옵니다.</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
            <div style="background:rgba(0,200,83,0.06);border-radius:12px;padding:18px;">
                <div style="font-size:13px;font-weight:700;color:#00C853;margin-bottom:12px;letter-spacing:1px;">✦ 강점 (당신만의 무기)</div>
                ${pros.map((p,i) => '<div style="display:flex;gap:8px;margin-bottom:10px;"><span style="color:#00C853;font-weight:700;flex-shrink:0;">' + (i+1) + '.</span><span style="font-size:13.5px;color:#ddd;line-height:1.7;">' + p + '</span></div>').join('')}
            </div>
            <div style="background:rgba(231,76,60,0.06);border-radius:12px;padding:18px;">
                <div style="font-size:13px;font-weight:700;color:#e74c3c;margin-bottom:12px;letter-spacing:1px;">⚠ 약점 (알고 다뤄야 할 것들)</div>
                ${cons.map((c,i) => '<div style="display:flex;gap:8px;margin-bottom:10px;"><span style="color:#e74c3c;font-weight:700;flex-shrink:0;">' + (i+1) + '.</span><span style="font-size:13.5px;color:#ddd;line-height:1.7;">' + c + '</span></div>').join('')}
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div style="background:rgba(199,167,106,0.07);border-radius:12px;padding:18px;">
                <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:10px;">💑 잘 맞는 유형</div>
                <div style="font-size:13.5px;color:#ddd;line-height:1.8;">${goodMatch}</div>
            </div>
            <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:18px;">
                <div style="font-size:13px;font-weight:700;color:#aaa;margin-bottom:10px;">⚡ 주의가 필요한 유형</div>
                <div style="font-size:13.5px;color:#ddd;line-height:1.8;">${badMatch}</div>
            </div>
        </div>

        <div style="background:rgba(199,167,106,0.06);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 10px 10px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">성격 총평</div>
            <p style="font-size:14px;color:#ddd;line-height:1.9;margin:0;">당신의 약점은 단점이 아닙니다. 그것은 아직 다듬어지지 않은 강점의 이면입니다. 강점을 극대화하면서 약점이 발목을 잡지 않도록 관리하는 것 — 그것이 당신 인생 운영의 핵심 기술입니다.</p>
        </div>
    </div>`;
}
'''

# buildChapter9_Remedy 함수 뒤에 성격 챕터 삽입
insert_after = 'function buildChapter9_Remedy(data) {'
if insert_after in html:
    # buildChapter9 함수 끝 찾기 (닫는 } 이후)
    start_idx = html.find(insert_after)
    # 함수 끝 찾기
    brace_count = 0
    i = start_idx
    func_end = -1
    in_str = False
    esc = False
    tpl = False
    while i < len(html):
        c = html[i]
        if esc:
            esc = False
        elif c == '\\' and in_str:
            esc = True
        elif c == '`':
            tpl = not tpl
        elif c == '"' and not tpl and not esc:
            in_str = not in_str
        elif not in_str and not tpl:
            if c == '{':
                brace_count += 1
            elif c == '}':
                brace_count -= 1
                if brace_count == 0:
                    func_end = i + 1
                    break
        i += 1
    if func_end != -1:
        html = html[:func_end] + '\n' + personality_func + html[func_end:]
        print("성격 챕터 함수 삽입 성공")
    else:
        print("buildChapter9 끝 못 찾음")
else:
    print("buildChapter9 시작 못 찾음")

# ── generateDeepReport에 성격 챕터 호출 추가 ──
html = html.replace(
    "    // ── 하단 심층 리포트 (대운/세운/월운 + 개운법) ──\n    let bottomHtml = '';",
    "    // ── 하단 심층 리포트 (대운/세운/월운 + 개운법) ──\n    let bottomHtml = '';\n    bottomHtml += buildChapterPersonality(data);"
)

# ── 플로팅 목차에 성격 항목 추가 ──
html = html.replace(
    '<a onclick="tocGo(\'sec-report-full\')" class="toc-link">심층 풀이</a>',
    '<a onclick="tocGo(\'sec-personality\')" class="toc-link">성격 분석</a>\n        <a onclick="tocGo(\'sec-daeun-detail\')" class="toc-link">대운 상세</a>'
)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"완료 | {len(html):,} bytes")
