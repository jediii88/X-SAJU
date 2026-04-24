#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/sajux_deploy/report/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 기존에 잘못 삽입된 URL 파라미터 코드가 있으면 제거
import re
# 이전 subagent가 삽입한 코드 제거 (있으면)
content = re.sub(
    r'<script>\s*//\s*─+\s*URL 파라미터 자동 로드.*?</script>\s*(?=</body>)',
    '',
    content,
    flags=re.DOTALL
)

# 삽입할 코드
AUTO_LOAD = """<script>
// ─── URL 파라미터 자동 로드 (SAJUX Admin → Customer) ───
(function(){
  const p = new URLSearchParams(location.search);
  if (!p.get('n') && !p.get('y')) return; // 파라미터 없으면 일반 입력 화면

  // 만료일 체크
  const exp = p.get('exp');
  if (exp && new Date() > new Date(parseInt(exp))) {
    document.body.innerHTML = [
      '<div style="min-height:100vh;display:flex;flex-direction:column;',
      'align-items:center;justify-content:center;background:#080810;',
      'color:#888;font-family:Apple SD Gothic Neo,Malgun Gothic,sans-serif;',
      'text-align:center;padding:40px;">',
      '<div style="font-size:60px;margin-bottom:24px;">⏰</div>',
      '<div style="font-size:22px;color:#c7a76a;font-weight:700;margin-bottom:12px;">',
      '리포트 유효기간이 만료되었습니다</div>',
      '<div style="font-size:14px;color:#666;line-height:1.8;">',
      'PDF를 저장하지 않으셨다면<br>SAJUX에 문의해주세요.</div>',
      '</div>'
    ].join('');
    return;
  }

  // 값 파싱
  const name    = p.get('n') || '';
  const gender  = p.get('g') || 'male';   // male / female
  const cal     = p.get('c') || 'solar';  // solar / lunar
  const year    = p.get('y') || '';
  const month   = (p.get('mo')||'').padStart(2,'0');
  const day     = (p.get('d') ||'').padStart(2,'0');
  const hour    = (p.get('h') ||'0').padStart(2,'0');
  const min     = (p.get('mi')||'0').padStart(2,'0');
  const yundal  = p.get('yun') === '1';
  const unknown = p.get('unk') === '1';
  const birthDate = year + month + day;   // YYYYMMDD
  const birthTime = unknown ? '' : hour + min; // HHMM

  window.addEventListener('DOMContentLoaded', function() {
    // 이름
    const nameEl = document.getElementById('user-name');
    if (nameEl) nameEl.value = name;

    // 성별 토글 (F=여성, M=남성)
    const gVal = (gender === 'female' || gender === 'F') ? 'F' : 'M';
    const gInput = document.getElementById('gender');
    if (gInput) gInput.value = gVal;
    document.querySelectorAll('#gender-group .btn-toggle').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === gVal);
    });

    // 달력 토글 (S=양력, L=음력)
    const cVal = (cal === 'lunar' || cal === 'L') ? 'L' : 'S';
    const cInput = document.getElementById('cal-type');
    if (cInput) cInput.value = cVal;
    document.querySelectorAll('#cal-group .btn-toggle').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-val') === cVal);
    });
    if (cVal === 'L') {
      const leapWrap = document.getElementById('leap-wrap');
      const baseWrap = document.getElementById('cal-base-wrap');
      if (leapWrap) leapWrap.style.display = 'block';
      if (baseWrap) baseWrap.style.display = 'block';
    }

    // 윤달
    if (yundal) {
      const leapInput = document.getElementById('is-leap');
      if (leapInput) leapInput.value = 'true';
      document.querySelectorAll('#leap-group .btn-toggle').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-val') === 'true');
      });
    }

    // 생년월일
    const dateEl = document.getElementById('birth-date');
    if (dateEl) dateEl.value = birthDate;

    // 생시
    const timeEl = document.getElementById('birth-time');
    if (timeEl) timeEl.value = birthTime;

    // 시간 모름
    if (unknown) {
      const cb = document.getElementById('no-time');
      if (cb) cb.checked = true;
      const lbl = document.getElementById('tlabel-no-time');
      if (lbl) lbl.classList.add('on');
    }

    // 자동 실행 (1초 후)
    setTimeout(function() {
      if (typeof runAnalysis === 'function') runAnalysis();
    }, 1000);
  });
})();
</script>
"""

# </body> 바로 앞에 삽입
if '</body>' in content:
    content = content.replace('</body>', AUTO_LOAD + '\n</body>', 1)
    print("✅ URL 자동 로드 코드 삽입 완료")
else:
    # 파일 끝에 추가
    content += '\n' + AUTO_LOAD
    print("✅ 파일 끝에 삽입 완료")

with open('/home/node/.openclaw/workspace/sajux_deploy/report/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
