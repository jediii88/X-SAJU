#!/usr/bin/env python3
# 구버전 buildChapter1_Basic (line 2208~2350) 제거
# 새버전은 line 2492부터 존재 → 구버전만 삭제

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 구버전 범위 탐색: 2208번째줄(1-indexed) ~ 다음 function 시작 전까지 (빈줄+닫는 중괄호 포함)
# Python은 0-indexed이므로 2208 -> 2207

start_line = None
end_line = None

for i, line in enumerate(lines):
    if 'function buildChapter1_Basic(data) {' in line and start_line is None:
        start_line = i  # 첫 번째 발견 (구버전)
        continue
    if start_line is not None and end_line is None:
        # 다음 function 선언 직전의 빈줄까지가 구버전 끝
        if line.startswith('function ') and 'buildChapter1_Basic' not in line:
            end_line = i
            break

print(f"구버전 범위: {start_line+1}~{end_line} (1-indexed)")

# 구버전 제거
new_lines = lines[:start_line] + lines[end_line:]

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"구버전 제거 완료: {end_line - start_line}줄 삭제")
