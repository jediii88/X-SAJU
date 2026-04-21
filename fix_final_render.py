with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. "분석 버튼을 누르면..." 안내 문구 전부 제거
import re
html = re.sub(r'<p[^>]*>▶ 분석 버튼을 누르면[^<]*</p>', '', html)
html = re.sub(r'분석 후 [^<]{0,60}(표시됩니다|나타납니다|확정됩니다|분석됩니다)\.*', '', html)
print("안내 문구 제거 완료")

# 2. generateDeepReport 가 실행될 때 console.log 강제 추가해서 추적
# 더 중요한 건 — showLoading 안에서 callback() 실행할 때 에러를 alert로 표시
old_show = '''function showLoading(msg, callback) {
    // 1) 로딩 오버레이 표시
    const loadEl = document.getElementById('loading');
    const msgEl = document.getElementById('loading-msg');
    if(loadEl) loadEl.style.display = 'flex';
    if(msgEl) msgEl.innerText = '사주를 분석하는 중입니다...';

    // 2) 브라우저가 로딩 화면을 그린 직후 콜백 실행
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            try { callback(); } catch(e) { console.error('분석 오류:', e); }
            // 3) 완료 후 로딩 숨김
            if(loadEl) loadEl.style.display = 'none';
        });
    });
}'''

new_show = '''function showLoading(msg, callback) {
    const loadEl = document.getElementById('loading');
    const msgEl = document.getElementById('loading-msg');
    if(loadEl) loadEl.style.display = 'flex';
    if(msgEl) msgEl.innerText = '사주를 분석하는 중입니다...';
    setTimeout(() => {
        try { callback(); } catch(e) { console.error('분석 오류:', e); }
        if(loadEl) loadEl.style.display = 'none';
    }, 100);
}'''

if old_show in html:
    html = html.replace(old_show, new_show)
    print("showLoading 수정 완료")
else:
    print("showLoading 패턴 불일치")

# 3. runAnalysis 마지막 부분: go(2) 후 rAF 제거하고 동기 실행
old_flow = '''        // 1) 먼저 step-2 페이지 활성화 (DOM이 display:block이 되어야 getElementById가 확실히 작동)
        go(2);
        window.scrollTo(0,0);

        // 2) DOM이 완전히 그려진 후 리포트 생성
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                try {
                    generateDeepReport(globalSajuData);
                } catch(err) {
                    console.error('리포트 생성 오류:', err);
                }
                const toc = document.getElementById('floating-toc');
                if(toc) toc.style.display = 'block';
                const reportSec = document.getElementById('sec-report');
                if(reportSec) reportSec.style.display = 'none';
            });
        });'''

new_flow = '''        go(2);
        window.scrollTo(0,0);
        try { generateDeepReport(globalSajuData); } catch(e) { console.error(e); }
        const toc = document.getElementById('floating-toc');
        if(toc) toc.style.display = 'block';'''

if old_flow in html:
    html = html.replace(old_flow, new_flow)
    print("실행 순서 동기화 완료")
else:
    print("실행 순서 패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 | {len(html):,} bytes")
