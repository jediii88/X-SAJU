with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# window.XXX로 참조되는 것들 목록
window_refs = set(re.findall(r'window\.([A-Z_]{4,})', html))
print("window.XXX 참조 목록:", sorted(window_refs))

# 각각 const로 선언되어 있으면 window 할당으로 변경
changed = []
for name in sorted(window_refs):
    old = f'const {name} = {{'
    new = f'window.{name} = {{'
    if old in html:
        html = html.replace(old, new, 1)
        changed.append(name + ' (객체)')
        continue
    old2 = f'const {name} = ['
    new2 = f'window.{name} = ['
    if old2 in html:
        html = html.replace(old2, new2, 1)
        changed.append(name + ' (배열)')

print("변경된 것:", changed)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
