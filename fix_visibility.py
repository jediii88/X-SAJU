with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. sec-report-full을 display:none 대신 항상 보이게 (리포트 전용 페이지 아닌 인라인 구조)
# 근본 해결책: sec-report-full을 없애고 report-container를 step-2 안에 항상 표시
old_sec_report_full_start = 'id="sec-report-full" style="display:none; padding-bottom:60px;">'
new_sec_report_full_start = 'id="sec-report-full" style="display:block; padding-bottom:60px;">'

if old_sec_report_full_start in html:
    html = html.replace(old_sec_report_full_start, new_sec_report_full_start)
    print("sec-report-full 항상 표시로 변경 성공")
else:
    print("sec-report-full 패턴 불일치")

# 2. sec-report (이전 버튼 방식) 도 없애기
old_sec_report = 'id="sec-report"'
count = html.count(old_sec_report)
print(f"sec-report 참조 수: {count}")

# 3. inline-summary들의 display:none → display:block은 JS에서 처리되므로 유지
# 대신 generateDeepReport 실행을 더 확실하게 보장

# 4. runAnalysis에서 go(2) 이후 즉시 실행 보장
old_raf = '''        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                generateDeepReport(globalSajuData);
                const reportFull = document.getElementById('sec-report-full');
                if(reportFull) reportFull.style.display = 'block';
                const reportSec = document.getElementById('sec-report');
                if(reportSec) reportSec.style.display = 'none';
                const toc = document.getElementById('floating-toc');
                if(toc) toc.style.display = 'block';
            });
        });'''

new_raf = '''        // DOM 렌더 완료 후 리포트 생성
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

if old_raf in html:
    html = html.replace(old_raf, new_raf)
    print("rAF → setTimeout 200ms 교체 성공")
else:
    print("rAF 패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
