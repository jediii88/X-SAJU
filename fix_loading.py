with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# showLoading 함수 재설계 — 로딩 표시 즉시, 콜백은 setTimeout으로 분리
old_loading_fn = '''function showLoading(msg, callback) {
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

new_loading_fn = '''function showLoading(msg, callback) {
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

if old_loading_fn in html:
    html = html.replace(old_loading_fn, new_loading_fn)
    print("showLoading 재설계 성공")
else:
    print("showLoading 패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
