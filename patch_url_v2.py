#!/usr/bin/env python3
import re

with open('/home/node/.openclaw/workspace/sajux_deploy/report/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 기존 URL 파라미터 코드 전부 제거 (이전 subagent + 이전 패치 모두)
content = re.sub(
    r'<script>\s*//\s*─+\s*URL 파라미터 자동 로드.*?</script>\s*',
    '',
    content,
    flags=re.DOTALL
)

# 삽입할 코드 - step-1 즉시 숨김 + 로딩화면 + runAnalysis 자동 실행
AUTO_LOAD = r"""<script>
// ─── SAJUX: URL 파라미터 자동 로드 v3 ───
(function(){
  const p = new URLSearchParams(location.search);
  if (!p.get('n') && !p.get('y')) return; // 파라미터 없으면 일반 입력 화면 유지

  // 만료일 체크
  const exp = p.get('exp');
  if (exp && new Date() > new Date(parseInt(exp))) {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.innerHTML =
        '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#080810;color:#888;font-family:Apple SD Gothic Neo,Malgun Gothic,sans-serif;text-align:center;padding:40px;">' +
        '<div style="font-size:60px;margin-bottom:24px;">⏰</div>' +
        '<div style="font-size:22px;color:#c7a76a;font-weight:700;margin-bottom:12px;">리포트 유효기간이 만료되었습니다</div>' +
        '<div style="font-size:14px;color:#666;line-height:1.8;">PDF를 저장하지 않으셨다면<br>SAJUX에 문의해주세요.</div>' +
        '</div>';
    });
    return;
  }

  // 값 파싱
  const name    = p.get('n') || '';
  const gender  = p.get('g') || 'male';
  const cal     = p.get('c') || 'solar';
  const year    = p.get('y') || '';
  const month   = (p.get('mo') || '').padStart(2, '0');
  const day     = (p.get('d')  || '').padStart(2, '0');
  const hour    = (p.get('h')  || '0').padStart(2, '0');
  const min     = (p.get('mi') || '0').padStart(2, '0');
  const yundal  = p.get('yun') === '1';
  const unknown = p.get('unk') === '1';
  const birthDate = year + month + day;
  const birthTime = unknown ? '1200' : (hour + min);

  document.addEventListener('DOMContentLoaded', function() {
    // ── step-1 즉시 숨기고 로딩 화면 표시 ──
    const step1 = document.getElementById('step-1');
    if (step1) step1.style.display = 'none';

    // 로딩 오버레이 삽입
    const overlay = document.createElement('div');
    overlay.id = 'sajux-loading';
    overlay.innerHTML =
      '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#080810;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;">' +
      '<div style="font-size:32px;margin-bottom:20px;">✦</div>' +
      '<div style="font-size:18px;color:#c7a76a;font-weight:700;margin-bottom:8px;">' + (name||'') + '님의 사주를 분석 중입니다</div>' +
      '<div style="font-size:13px;color:#666;">잠시만 기다려주세요...</div>' +
      '</div>';
    document.body.appendChild(overlay);

    // ── 필드에 값 주입 ──
    const nameEl = document.getElementById('user-name');
    if (nameEl) nameEl.value = name;

    const gVal = (gender === 'female' || gender === 'F') ? 'F' : 'M';
    const gInput = document.getElementById('gender');
    if (gInput) gInput.value = gVal;
    document.querySelectorAll('#gender-group .btn-toggle').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-val') === gVal);
    });

    const cVal = (cal === 'lunar' || cal === 'L') ? 'L' : 'S';
    const cInput = document.getElementById('cal-type');
    if (cInput) cInput.value = cVal;
    document.querySelectorAll('#cal-group .btn-toggle').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-val') === cVal);
    });
    if (cVal === 'L') {
      var leapWrap = document.getElementById('leap-wrap');
      var baseWrap = document.getElementById('cal-base-wrap');
      if (leapWrap) leapWrap.style.display = 'block';
      if (baseWrap) baseWrap.style.display = 'block';
    }
    if (yundal) {
      var leapInput = document.getElementById('is-leap');
      if (leapInput) leapInput.value = 'true';
      document.querySelectorAll('#leap-group .btn-toggle').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-val') === 'true');
      });
    }

    var dateEl = document.getElementById('birth-date');
    if (dateEl) dateEl.value = birthDate;

    var timeEl = document.getElementById('birth-time');
    if (timeEl) timeEl.value = birthTime;

    if (unknown) {
      var cb = document.getElementById('no-time');
      if (cb) { cb.checked = true; if (typeof toggleSwitch === 'function') toggleSwitch('no-time','tlabel-no-time'); }
    }

    // ── 1.2초 후 runAnalysis 실행 ──
    setTimeout(function() {
      if (typeof runAnalysis === 'function') {
        runAnalysis();
        // runAnalysis 내부 go(2) 호출로 step-2 전환됨
        // 로딩 오버레이 제거는 go(2) 이후에 처리
        setTimeout(function() {
          var ov = document.getElementById('sajux-loading');
          if (ov) ov.remove();
        }, 2500);
      }
    }, 1200);
  });
})();
</script>
"""

# </body> 바로 앞에 삽입
if '</body>' in content:
    content = content.replace('</body>', AUTO_LOAD + '\n</body>', 1)
    print("✅ URL 자동 로드 v3 삽입 완료")

with open('/home/node/.openclaw/workspace/sajux_deploy/report/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
