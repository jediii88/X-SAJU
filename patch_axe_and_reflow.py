"""
1. "Axe의 ~" 레이블 제거 → 서사 문단으로 흡수
2. generateDeepReport()를 섹션별 직접 주입 방식으로 전환
"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    html = f.read()

# ── 1. Axe 레이블 전수 교체 ──
import re

# "👉 Axe의 부의 추월차선 전략:" → 자연스러운 서사로
axe_replacements = [
    # cat-health advice
    ('<b>💡 Axe 건강 처방:</b> 몸이 보내는 신호를 무시하지 마십시오. 당신은 버티는 능력이 탁월하지만, 그 능력이 때로는 병을 키웁니다. 년 1회 정기검진을 빠짐없이 이행하는 것이 가장 강력한 건강 보험입니다.',
     '몸이 보내는 신호를 무시하지 마십시오. 버티는 능력이 탁월한 만큼, 그 능력이 때로는 병을 키웁니다. 연 1회 정기검진을 빠짐없이 이행하는 것이 가장 강력한 건강 보험입니다.'),

    ('<b>💡 Axe 부의 추월차선:</b> 당신의 금고는 월급통장 사이즈가 아닙니다. 用神(용신) 기운을 가진 사람과의 협업, 그것이 당신 재물운의 숨겨진 가속 페달입니다.',
     '당신의 금고는 월급통장 사이즈가 아닙니다. 用神(용신) 기운을 가진 사람과의 협업 — 그것이 재물운의 숨겨진 가속 페달입니다.'),

    ('<b>💡 Axe 커리어 설계:</b> "내 권한이 100% 보장되는가?" — 이것이 직업 선택의 단 하나의 기준입니다. 이 질문에 Yes가 나오는 자리에서만 당신의 진짜 능력이 폭발합니다.',
     '"내 권한이 100% 보장되는가?" — 이것이 직업 선택의 단 하나의 기준입니다. 이 질문에 Yes가 나오는 자리에서만 진짜 능력이 폭발합니다.'),

    ('<b>💡 Axe 연애 전략:</b> 당신에게 맞는 인연은 당신의 용신 오행을 일간으로 가진 사람입니다. 궁합은 천간(天干)보다 일지(日支)의 합충 관계가 평생 에너지를 좌우합니다.',
     '당신에게 맞는 인연은 용신 오행을 일간으로 가진 사람입니다. 궁합은 天干(천간)보다 日支(일지)의 합충 관계가 평생 에너지를 좌우합니다.'),

    # report chapters
    ("            <b>👉 Axe의 부의 추월차선 전략:</b> 당신의 금고는 평범한 직장인의 월급통장 사이즈가 아닙니다. 레버리지를 활용하십시오. 당신의 능력(식상)을 타인의 자본과 결합할 때, 비로소 당신의 진짜 금고가 열립니다.",
     "            당신의 진짜 금고는 월급통장 사이즈가 아닙니다. 食傷(식상)의 능력을 타인의 자본과 결합하는 레버리지 — 그것이 당신의 금고를 여는 열쇠입니다."),
]

for old, new in axe_replacements:
    html = html.replace(old, new)

# 나머지 "Axe의" 패턴 일괄 제거
html = re.sub(r'<b>[👉🚨💡]?\s*Axe의?\s*[^:：<]*[:：]</b>\s*', '', html)
html = re.sub(r'Axe의\s*[가-힣]+[:：]', '', html)

# ── 2. generateDeepReport: 각 섹션에 직접 주입하도록 재구성 ──
old_generate_func = '''function generateDeepReport(data) {
    if(!data.dayStem) return;
    
    let html = \'\';
    html += buildSectionHeader("PART 1. 운명의 해부도 (원국 분석)");
    html += buildChapter1_Basic(data);
    html += buildChapter2_Wuxing(data);
    html += buildChapter3_Sipseong(data);
    
    html += buildSectionHeader("PART 2. 인생의 무대와 성취");
    html += buildChapter4_Wealth(data);
    html += buildChapter5_Career(data);
    html += buildChapter6_Love(data);
    
    html += buildSectionHeader("PART 3. 숨겨진 무기와 취약점");
    html += buildChapter7_Hidden(data); // 지장간
    html += buildChapter8_Health(data);
    html += buildChapter9_Remedy(data);
    
    html += buildSectionHeader("PART 4. 시간의 지배자 (대운과 세운)");
    html += buildDaewunLoop(data);
    html += buildSewunLoop(data);
    html += buildWolunLoop(data);
    
    // 메인 리포트 컨테이너에 전체 내용 주입
    document.getElementById(\'report-container\').innerHTML = html;
    
    // 각 만세력 섹션 아래 인라인 풀이 주입
    injectInlineSummaries(data);
}'''

new_generate_func = '''function generateDeepReport(data) {
    if(!data.dayStem) return;
    
    // ── 각 만세력 섹션 아래에 직접 주입 ──
    injectSectionInterpretations(data);
    
    // ── 하단 심층 리포트 (대운/세운/월운 + 개운법) ──
    let bottomHtml = '';
    bottomHtml += buildSectionHeader("대운(大運) · 세운(歲運) · 월운 심층 해부");
    bottomHtml += buildDaewunLoop(data);
    bottomHtml += buildSewunLoop(data);
    bottomHtml += buildWolunLoop(data);
    bottomHtml += buildChapter9_Remedy(data);
    
    document.getElementById('report-container').innerHTML = bottomHtml;
}

function injectSectionInterpretations(data) {
    // 1. 사주원국 아래 → Chapter 1 (일주 본질)
    const ch1 = buildChapter1_Basic(data);
    injectBelow('manse-inline-summary', ch1);
    
    // 2. 합충형파해 아래 → 관계 해석
    const relEl = document.getElementById('relation-inline-summary');
    if(relEl) {
        relEl.innerHTML = buildRelationSummary(data);
        relEl.style.display = 'block';
    }
    
    // 3. 신살 아래 → 신살 해석
    const shinsalEl = document.getElementById('shinsal-inline-summary');
    if(shinsalEl) {
        shinsalEl.innerHTML = buildShinsalSummary(data);
        shinsalEl.style.display = 'block';
    }
    
    // 4. 오행 아래 → Chapter 2 (오행)
    const ch2 = buildChapter2_Wuxing(data);
    injectBelow('wuxing-inline-summary', ch2);
    
    // 5. 십성 아래 → Chapter 3 (십성)
    const sipEl = document.getElementById('sipseong-inline-summary');
    if(sipEl) {
        sipEl.innerHTML = buildChapter3_Sipseong(data);
        sipEl.style.display = 'block';
    }
    
    // 6. 신강신약 아래 → 강약 해석
    const ch_str = buildStrengthSummary(data);
    injectBelow('strength-inline-summary', ch_str);
    
    // 7. 용신 아래 → Chapter 7 (지장간) + 개운 힌트
    const yongEl = document.getElementById('yong-inline-summary');
    if(yongEl) {
        yongEl.innerHTML = buildChapter7_Hidden(data);
        yongEl.style.display = 'block';
    }
    
    // 8. 인생시기 아래 → Chapter 4~6 (재물/직업/애정 요약)
    const lifeEl = document.getElementById('lifecycle-inline-summary');
    if(lifeEl) {
        lifeEl.innerHTML = buildChapter4_Wealth(data) + buildChapter5_Career(data) + buildChapter6_Love(data);
        lifeEl.style.display = 'block';
    }
}

function injectBelow(id, html_content) {
    const el = document.getElementById(id);
    if(el) { el.innerHTML = html_content; el.style.display = 'block'; }
}

function buildRelationSummary(data) {
    const interactions = data.interactions || [];
    if(!interactions || interactions.length === 0) {
        return \'<div class="inline-interp"><div class="ii-label">✦ 합·충·형·파·해 해석</div><div class="ii-text">원국 내 특별한 합충 관계가 감지되지 않았습니다. 안정적인 원국 구조입니다.</div></div>\';
    }
    let rows = interactions.map(rel => {
        const desc = window.SAJU_DB?.INTERACTION?.[rel.type] || rel.type + \' 관계가 작용합니다.\';
        return `<div style="margin-bottom:10px;"><b style="color:var(--gold);">${rel.chars} — ${rel.type}</b><br><span style="font-size:13px;color:#ccc;">${desc}</span></div>`;
    }).join(\'\');
    return `<div class="inline-interp"><div class="ii-label">✦ 합·충·형·파·해 해석</div><div class="ii-title">원국의 충돌과 결합이 만드는 당신의 운명 코드</div><div class="ii-text">${rows}<p style="margin-top:12px;color:#bbb;font-size:13px;">이 관계들은 당신이 살면서 반복적으로 경험하는 패턴의 원형(原形)입니다. 좋고 나쁨이 아닌, 당신이 어떻게 이 에너지를 다루느냐가 결과를 결정합니다.</p></div></div>`;
}

function buildShinsalSummary(data) {
    const shinsal = data.allShinsal || [];
    if(!shinsal || shinsal.length === 0) {
        return \'<div class="inline-interp"><div class="ii-label">✦ 신살·길성 해석</div><div class="ii-text">특별한 신살이 감지되지 않았습니다. 안정적인 원국 구조입니다.</div></div>\';
    }
    const goodSals = [\'천을귀인\',\'문창귀인\',\'학당귀인\',\'월덕귀인\',\'복성귀인\'];
    const good = shinsal.filter(s => goodSals.some(g => s.includes(g)));
    const risk = shinsal.filter(s => !goodSals.some(g => s.includes(g)));
    let content = \'\';
    if(good.length > 0) content += `<p style="margin-bottom:10px;"><b style="color:#00C853;">✦ 길성(吉星):</b> ${good.join(\', \')} — 하늘이 내린 재능과 귀인의 기운이 당신을 보호합니다.</p>`;
    if(risk.length > 0) content += `<p><b style="color:#e74c3c;">⚠ 신살(神殺):</b> ${risk.join(\', \')}<br><span style="font-size:13px;color:#bbb;">이 기운들은 흉이 아니라 당신을 단련시키는 도전의 코드입니다. 제대로 다루면 가장 강력한 무기가 됩니다.</span></p>`;
    return `<div class="inline-interp"><div class="ii-label">✦ 신살·길성 해석</div><div class="ii-title">하늘이 새긴 특수 기운</div><div class="ii-text">${content}</div></div>`;
}

function buildStrengthSummary(data) {
    const isStrong = data.strengthText && (data.strengthText.includes(\'신강\') || data.strengthText.includes(\'강\'));
    const text = isStrong
        ? \'기운이 충만한 당신은 주도적으로 세상을 이끌어가는 자리에 있어야 진정한 능력을 발휘합니다. 남의 지시를 받기보다 내 판을 직접 짜는 창업, 프리랜서, 전문직에서 빛을 발합니다. 강한 기운을 억누르려 하면 오히려 역효과가 납니다. 이 에너지를 쏟아부을 적합한 무대를 찾는 것이 인생의 핵심 과제입니다.\'
        : \'기운이 다소 약한 사주는 혼자 모든 것을 짊어지기보다 훌륭한 파트너와 팀을 구성할 때 폭발적인 시너지를 경험합니다. 좋은 귀인을 곁에 두는 것이 인생 전략의 핵심입니다. 用神(용신) 기운이 들어오는 대운에서 가장 크게 도약합니다.\';
    return `<div class="inline-interp"><div class="ii-label">✦ 신강·신약 해석</div><div class="ii-title">${data.strengthText || \'\'}</div><div class="ii-text">${text}</div></div>`;
}'''

if old_generate_func in html:
    html = html.replace(old_generate_func, new_generate_func)
    print("generateDeepReport 재구성 성공")
else:
    print("generateDeepReport 패턴 불일치 — 수동 확인 필요")

# ── 3. 만세력 섹션들에 인라인 summary div 추가 ──
# relation-inline-summary: sec-relation 끝 부분 (sec-shinsal 앞)
html = html.replace(
    '<div class="section" id="sec-shinsal">',
    '<div id="relation-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-shinsal">'
)

# shinsal-inline-summary: sec-shinsal 끝 (sec-wuxing 앞)
# sec-wuxing 앞 이미 wuxing-inline-summary 있으니 그 바로 위에
html = html.replace(
    '<div id="wuxing-inline-summary"',
    '<div id="shinsal-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div id="wuxing-inline-summary"'
)

# sipseong-inline-summary: 십성 섹션 끝 (sec-yonghee 앞)
html = html.replace(
    '<div class="section" id="sec-yonghee">',
    '<div id="sipseong-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-yonghee">'
)

# yong-inline-summary: 용신 섹션 끝 (sec-fortune 앞)
html = html.replace(
    '<div class="section" id="sec-fortune">',
    '<div id="yong-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-fortune">'
)

# lifecycle-inline-summary: 인생시기 섹션 끝 (sec-category 앞)
html = html.replace(
    '<div class="section" id="sec-category">',
    '<div id="lifecycle-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-category">'
)

# ── 4. report-container 위에 안내 텍스트 변경 ──
html = html.replace(
    '<div style="text-align:center; color:var(--text-soft); font-size:13px; margin-bottom:30px; letter-spacing:1px;">본격적인 운명의 서사가 펼쳐집니다.</div>',
    '<div style="text-align:center; color:var(--text-soft); font-size:13px; margin-bottom:30px; letter-spacing:1px;">대운 · 세운 · 월운 · 개운법 심층 분석</div>'
)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w') as f:
    f.write(html)

print(f"완료 | {len(html):,} bytes")
