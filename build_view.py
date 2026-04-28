#!/usr/bin/env python3
"""
build_view.py
- report/index.html 복사 → report/view.html
- step-1 블록 제거, step-2 active 처리
- URL 파라미터 자동 로드 스크립트 삽입
- hidden input 보조 요소 삽입
"""

import shutil, re

SRC  = '/home/node/.openclaw/workspace/sajux_deploy/report/index.html'
DST  = '/home/node/.openclaw/workspace/sajux_deploy/report/view.html'

# 1. 복사
shutil.copy(SRC, DST)
with open(DST, 'r', encoding='utf-8') as f:
    html = f.read()

print(f'원본 길이: {len(html.splitlines())}줄')

# 2. step-1 블록 제거 (step-2 시작 직전까지)
# <div id="step-1" class="page active"> ... </div>\n    <div id="step-2"
# Python으로 줄 단위 처리
lines = html.split('\n')

# 줄 번호 찾기 (0-indexed)
step1_start = None
step2_start = None
for i, line in enumerate(lines):
    if 'id="step-1"' in line and step1_start is None:
        step1_start = i
    if 'id="step-2"' in line and step2_start is None:
        step2_start = i

print(f'step-1 시작: {step1_start+1}줄, step-2 시작: {step2_start+1}줄')

# step-1 블록 제거
new_lines = lines[:step1_start] + lines[step2_start:]
print(f'제거 후 길이: {len(new_lines)}줄')

# 3. step-2 를 active 로 변경
for i, line in enumerate(new_lines):
    if 'id="step-2"' in line:
        new_lines[i] = line.replace('class="page"', 'class="page active"')
        print(f'  step-2 active 변경: {new_lines[i].strip()}')
        break

html = '\n'.join(new_lines)

# 4. 모듈 레벨 ni/di/ti oninput 핸들러 제거 (요소가 없어서 crash 방지)
# ni.oninput, di.oninput, ti.oninput 블록 제거
# 라인 단위로 찾아서 제거
lines2 = html.split('\n')
filtered = []
skip_until_semicolon = False
i = 0
while i < len(lines2):
    line = lines2[i]
    # n-pre, d-pre, t-pre 관련 oninput 핸들러 skip
    if ('ni.oninput' in line or 'di.oninput' in line or 'ti.oninput' in line):
        # 한 줄짜리인지 여러 줄짜리인지
        if line.rstrip().endswith(';') or line.rstrip().endswith("'"):
            # 한 줄 — 그냥 skip
            i += 1
            continue
        else:
            # 여러 줄 — closing '};' 까지 skip
            while i < len(lines2):
                if lines2[i].strip() == '};':
                    i += 1
                    break
                i += 1
            continue
    filtered.append(line)
    i += 1

html = '\n'.join(filtered)

# 5. hidden inputs 삽입 (</body> 직전)
HIDDEN_INPUTS = '''
<!-- view.html: runAnalysis가 읽는 hidden input들 -->
<input type="hidden" id="user-name" value="">
<input type="hidden" id="birth-date" value="">
<input type="hidden" id="birth-time" value="">
<input type="hidden" id="gender" value="M">
<input type="hidden" id="cal-type" value="S">
<input type="hidden" id="is-leap" value="false">
<input type="hidden" id="cal-base" value="KST">
<input type="checkbox" id="no-time" style="display:none">
<input type="checkbox" id="adj-l" style="display:none" checked>
'''

# 6. URL 파라미터 자동 로드 스크립트
AUTO_SCRIPT = r'''<script>
// ─── SAJUX view.html: URL 파라미터 자동 로드 ───
(function(){
  var p = new URLSearchParams(location.search);

  // 만료 체크
  var exp = p.get('exp');
  if (exp && Date.now() > parseInt(exp)) {
    document.body.innerHTML =
      '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#080810;color:#888;font-family:Malgun Gothic,sans-serif;text-align:center;padding:40px;">' +
      '<div style="font-size:54px;margin-bottom:20px;">⏰</div>' +
      '<div style="font-size:20px;color:#c7a76a;font-weight:700;margin-bottom:10px;">리포트 유효기간이 만료되었습니다</div>' +
      '<div style="font-size:13px;color:#555;line-height:1.9;">PDF를 저장하지 않으셨다면 SAJUX에 문의해주세요.</div>' +
      '</div>';
    return;
  }

  var name   = p.get('n') || '고객';
  var gender = (p.get('g')||'male').toLowerCase();
  var cal    = (p.get('c')||'solar').toLowerCase();
  var year   = p.get('y') || '1988';
  var month  = (p.get('mo')||'1').padStart(2,'0');
  var day    = (p.get('d') ||'1').padStart(2,'0');
  var hour   = (p.get('h') ||'12').padStart(2,'0');
  var min2   = (p.get('mi')||'0').padStart(2,'0');
  var yundal = p.get('yun') === '1';
  var unk    = p.get('unk') === '1';

  // DOM 로드 후 값 주입 + 자동 실행
  document.addEventListener('DOMContentLoaded', function() {
    function setEl(id, val) {
      var el = document.getElementById(id);
      if (el) el.value = val;
    }

    setEl('user-name',  name);
    setEl('birth-date', year + month + day);
    setEl('birth-time', unk ? '1200' : (hour + min2));

    var gVal = (gender==='female'||gender==='f') ? 'F' : 'M';
    setEl('gender',   gVal);
    var cVal = (cal==='lunar'||cal==='l') ? 'L' : 'S';
    setEl('cal-type', cVal);
    setEl('is-leap',  yundal ? 'true' : 'false');
    setEl('cal-base', 'KST');

    // no-time 체크박스 상태
    var cb = document.getElementById('no-time');
    if (cb) cb.checked = unk;

    // adj-l 체크박스는 항상 체크
    var adjEl = document.getElementById('adj-l');
    if (adjEl) adjEl.checked = true;

    // ni/di/ti 전역변수가 hidden input을 가리키도록
    if (typeof ni !== 'undefined') {
      // ni/di/ti 는 이미 getElementById로 초기화됨
      // 값만 직접 세팅
    }

    // 즉시 runAnalysis 실행
    setTimeout(function() {
      if (typeof runAnalysis === 'function') {
        runAnalysis();
      }
    }, 300);
  });
})();
</script>
'''

# hidden inputs + script 삽입
if '</body>' in html:
    html = html.replace('</body>', HIDDEN_INPUTS + AUTO_SCRIPT + '</body>', 1)
    print('  </body> 직전에 hidden inputs + script 삽입 완료')
else:
    print('  ⚠ </body> 태그 없음! 파일 끝에 추가')
    html = html + HIDDEN_INPUTS + AUTO_SCRIPT

# 7. 저장
with open(DST, 'w', encoding='utf-8') as f:
    f.write(html)

total = len(html.splitlines())
print(f'저장 완료: {DST} ({total}줄)')

# 검증
with open(DST, 'r', encoding='utf-8') as f:
    content = f.read()

step1_count = content.count('id="step-1"')
step2_active = 'id="step-2" class="page active"' in content or 'class="page active"' in content
auto_script = 'SAJUX view.html' in content
hidden_inputs = 'id="no-time"' in content

print(f'\n=== 검증 ===')
print(f'step-1 잔존: {step1_count} (0이어야 성공)')
print(f'step-2 active: {step2_active}')
print(f'자동 로드 스크립트: {auto_script}')
print(f'hidden no-time: {hidden_inputs}')
