with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ── 근본 해결 ──
# 1. sec-report-full을 step-2 밖으로 꺼내거나
# 2. 아니면 generateDeepReport를 go(2) 이전에 미리 실행
# 
# 가장 확실한 방법: go(2) 전에 먼저 report-container에 내용을 채우고,
# go(2)로 페이지를 전환한다.

old_flow = '''        go(2);
        // DOM이 완전히 렌더된 뒤 리포트 생성 (requestAnimationFrame 2회)
        // DOM 렌더 완료 후 리포트 생성
        setTimeout(function() {
            try {
                generateDeepReport(globalSajuData);
                const toc = document.getElementById('floating-toc');
                if(toc) toc.style.display = 'block';
                const reportSec = document.getElementById('sec-report');
                if(reportSec) reportSec.style.display = 'none';
            } catch(err) {
                console.error('리포트 생성 오류:', err);
            }
        }, 200);'''

new_flow = '''        // 1단계: 리포트 내용 먼저 생성 (DOM이 이미 있으므로 즉시 가능)
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

if old_flow in html:
    html = html.replace(old_flow, new_flow)
    print("실행 순서 수정 성공")
else:
    print("패턴 불일치 — 직접 찾기")
    # 위치 직접 찾기
    go2_idx = html.rfind('go(2);')
    print(f"go(2) last pos: line {html[:go2_idx].count(chr(10))+1}")
    print(html[go2_idx-200:go2_idx+300])

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
