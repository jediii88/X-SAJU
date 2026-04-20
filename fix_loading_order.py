with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# showLoading 함수를 단순화 — 로딩 표시 후 즉시 콜백 실행 (비동기 없앰)
old_sl = '''function showLoading(msg, callback) {
    const loadEl = document.getElementById('loading');
    const msgEl = document.getElementById('loading-msg');
    loadEl.style.display = 'flex';
    
    const steps = [
        '사주 원국(四柱 原局)을 계산하는 중...',
        '오행(五行) 에너지를 분석하는 중...',
        '십성(十星) · 신살(神殺)을 검출하는 중...',
        '용신(用神) · 대운(大運)을 산출하는 중...',
        '심층 리포트를 생성하는 중...',
        '완료! 잠시 후 결과를 표시합니다...'
    ];
    let stepIdx = 0;
    msgEl.innerText = steps[0];
    const stepInterval = setInterval(() => {
        stepIdx++;
        if(stepIdx < steps.length) msgEl.innerText = steps[stepIdx];
    }, 500);
    
    // 계산 실행 (로딩 표시 직후)
    setTimeout(() => {
        try { callback(); } catch (e) { console.error(e); }
    }, 50);
    
    // 최소 2.5초 로딩 표시 후 숨김
    setTimeout(() => {
        clearInterval(stepInterval);
        loadEl.style.display = 'none';
    }, 2500);
}'''

new_sl = '''function showLoading(msg, callback) {
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

if old_sl in html:
    html = html.replace(old_sl, new_sl)
    print("showLoading 단순화 성공")
else:
    print("showLoading 패턴 불일치")

# 실행 순서: go(2) → DOM 활성화 → 그 다음 generateDeepReport
old_flow = '''        // 1단계: 리포트 내용 먼저 생성 (DOM이 이미 있으므로 즉시 가능)
        try {
            generateDeepReport(globalSajuData);
        } catch(err) {
            console.error('리포트 생성 오류:', err);
        }
        // 2단계: step-2로 페이지 전환
        go(2);
        // 3단계: 보조 UI 표시
        const toc = document.getElementById('floating-toc');
        if(toc) toc.style.display = 'block';
        const reportSec = document.getElementById('sec-report');
        if(reportSec) reportSec.style.display = 'none';
        // 4단계: 상단으로 스크롤
        window.scrollTo(0,0);'''

new_flow = '''        // 1) 먼저 step-2 페이지 활성화 (DOM이 display:block이 되어야 getElementById가 확실히 작동)
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

if old_flow in html:
    html = html.replace(old_flow, new_flow)
    print("실행 순서 수정 성공")
else:
    print("실행 순서 패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 | {len(html):,} bytes")
