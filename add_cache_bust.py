import time

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 파일 상단에 버전 메타태그 추가 (캐시 무효화)
v = int(time.time())

old_head = '<meta charset="UTF-8">'
new_head = f'<meta charset="UTF-8">\n    <meta name="version" content="{v}">'

if old_head in html:
    html = html.replace(old_head, new_head, 1)
    print(f"버전 추가: v{v}")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 | {len(html):,} bytes")
