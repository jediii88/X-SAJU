import re

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    lines = f.readlines()

print("=== 미치환 변수 의심 라인 스캔 ===")
found = []
for i, line in enumerate(lines, 1):
    # 따옴표(싱글/더블) 안에 ${...} 있는 let/const 선언
    m = re.search(r"""(?:let|const|var)\s+\w+\s*=\s*["'].*\$\{""", line)
    if m:
        found.append((i, line.strip()[:120]))

if found:
    for lineno, text in found:
        print(f"Line {lineno}: {text}")
else:
    print("없음 — 모두 정상")

print()
print("=== 추가: html += 문자열 안의 ${...} 패턴 (따옴표) ===")
found2 = []
for i, line in enumerate(lines, 1):
    m = re.search(r'''html\s*\+=\s*["'].*\$\{''', line)
    if m:
        found2.append((i, line.strip()[:120]))

if found2:
    for lineno, text in found2:
        print(f"Line {lineno}: {text}")
else:
    print("없음")
