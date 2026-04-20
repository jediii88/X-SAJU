with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ── 1. pillars 순서 수정 — 표시 이름 역순으로 ──
# pillars = [시주(0), 일주(1), 월주(2), 년주(3)]
# pillarNames/Desc를 이 순서에 맞게 수정
old_names = "    const pillarNames = ['연주(年柱)','월주(月柱)','일주(日柱)','시주(時柱)'];\n    const pillarDesc = ['조상·가문·초년 환경','부모·청년기·직업 환경','나 자신·배우자 자리','자녀·말년·내면의 소망'];"
new_names = "    const pillarNames = ['시주(時柱)','일주(日柱)','월주(月柱)','연주(年柱)'];\n    const pillarDesc = ['자녀·말년·내면의 소망','나 자신·배우자 자리','부모·청년기·직업 환경','조상·가문·초년 환경'];"

if old_names in html:
    html = html.replace(old_names, new_names)
    print("pillarNames 순서 수정 성공")
else:
    print("pillarNames 패턴 불일치")

# ── 2. 로딩 화면 업그레이드 + 타이밍 수정 ──
old_loading = '''function showLoading(msg, callback) {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('loading-msg').innerText = msg;
    setTimeout(() => {
        try { callback(); } catch (e) { console.error(e); }
        document.getElementById('loading').style.display = 'none';
    }, 300);
}'''

new_loading = '''function showLoading(msg, callback) {
    const loadEl = document.getElementById('loading');
    const msgEl = document.getElementById('loading-msg');
    loadEl.style.display = 'flex';
    
    // 로딩 단계 메시지 순차 표시
    const steps = [
        '사주 원국(四柱 原局)을 계산하는 중...',
        '오행(五行) 에너지를 분석하는 중...',
        '십성(十星) · 신살(神殺)을 검출하는 중...',
        '용신(用神) · 대운(大運)을 산출하는 중...',
        '심층 리포트를 생성하는 중...'
    ];
    let stepIdx = 0;
    msgEl.innerText = steps[0];
    const stepInterval = setInterval(() => {
        stepIdx = (stepIdx + 1) % steps.length;
        msgEl.innerText = steps[stepIdx];
    }, 600);
    
    setTimeout(() => {
        clearInterval(stepInterval);
        try { callback(); } catch (e) { console.error(e); }
        loadEl.style.display = 'none';
    }, 2800);
}'''

if old_loading in html:
    html = html.replace(old_loading, new_loading)
    print("showLoading 업그레이드 성공")
else:
    print("showLoading 패턴 불일치")

# ── 3. go(2) 이후 setTimeout 타이밍 조정 ──
old_timing = '''        go(2);
        // 계산 완료 즉시 전체 리포트 자동 생성
        setTimeout(() => {
            generateDeepReport(globalSajuData);
            const reportFull = document.getElementById('sec-report-full');
            if(reportFull) reportFull.style.display = 'block';
            const reportSec = document.getElementById('sec-report');
            if(reportSec) reportSec.style.display = 'none';
            // 플로팅 목차 표시
            const toc = document.getElementById('floating-toc');
            if(toc) toc.style.display = 'block';
        }, 100);'''

new_timing = '''        go(2);
        // DOM이 완전히 렌더된 뒤 리포트 생성 (requestAnimationFrame 2회)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                generateDeepReport(globalSajuData);
                const reportFull = document.getElementById('sec-report-full');
                if(reportFull) reportFull.style.display = 'block';
                const reportSec = document.getElementById('sec-report');
                if(reportSec) reportSec.style.display = 'none';
                // 플로팅 목차 표시
                const toc = document.getElementById('floating-toc');
                if(toc) toc.style.display = 'block';
                // 인라인 섹션 해석 주입 (DOM 렌더 후)
                injectSectionInterpretations(globalSajuData);
            });
        });'''

if old_timing in html:
    html = html.replace(old_timing, new_timing)
    print("타이밍 수정 성공")
else:
    print("타이밍 패턴 불일치")

# ── 4. 로딩 화면 CSS + HTML 업그레이드 ──
old_loading_html = '''<div id="loading">
    <div class="spinner"></div>
    <div class="loading-text" id="loading-msg">만세력을 정밀 계산하는 중입니다</div>
</div>'''

new_loading_html = '''<div id="loading">
    <div style="text-align:center;">
        <div class="spinner"></div>
        <div style="font-size:11px;letter-spacing:3px;color:rgba(199,167,106,0.6);margin-bottom:16px;font-family:'Noto Serif KR',serif;">X · S A J U</div>
        <div class="loading-text" id="loading-msg">사주 원국을 계산하는 중...</div>
        <div style="margin-top:20px;display:flex;justify-content:center;gap:6px;" id="loading-dots">
            <span style="width:6px;height:6px;background:var(--gold);border-radius:50%;animation:dotPulse 1.4s ease-in-out 0s infinite;display:inline-block;"></span>
            <span style="width:6px;height:6px;background:var(--gold);border-radius:50%;animation:dotPulse 1.4s ease-in-out 0.2s infinite;display:inline-block;"></span>
            <span style="width:6px;height:6px;background:var(--gold);border-radius:50%;animation:dotPulse 1.4s ease-in-out 0.4s infinite;display:inline-block;"></span>
        </div>
    </div>
</div>'''

if old_loading_html in html:
    html = html.replace(old_loading_html, new_loading_html)
    print("로딩 HTML 업그레이드 성공")
else:
    print("로딩 HTML 패턴 불일치")

# ── 5. dotPulse 애니메이션 CSS 추가 ──
dot_css = '''
@keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1.0); opacity: 1; }
}
'''
if '@keyframes dotPulse' not in html:
    # spinner CSS 근처에 추가
    spinner_css_idx = html.find('@keyframes spin')
    if spinner_css_idx != -1:
        html = html[:spinner_css_idx] + dot_css + html[spinner_css_idx:]
        print("dotPulse CSS 추가 성공")
    else:
        print("spinner CSS 위치 못 찾음")
else:
    print("dotPulse 이미 존재")

# ── 6. generateDeepReport 안에서 중복 injectSectionInterpretations 제거 ──
# (go(2) 이후 rAF에서 직접 호출하도록 바꿨으므로, generateDeepReport 안에서는 제거)
old_inject = '''    // ── 각 만세력 섹션 아래에 직접 주입 ──
    injectSectionInterpretations(data);
    
    // ── 하단 심층 리포트'''
new_inject = '''    // ── 하단 심층 리포트'''

if old_inject in html:
    html = html.replace(old_inject, new_inject)
    print("generateDeepReport 내 중복 inject 제거 성공")
else:
    print("중복 inject 패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"\n저장 완료 | {len(html):,} bytes")
