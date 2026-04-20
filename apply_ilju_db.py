"""
일주 DB를 HTML의 SAJU_DB.ILJU에 주입
"""
import json, re

# 생성된 JS에서 데이터 파싱
with open('/home/node/.openclaw/workspace/ilju_generated.js', 'r') as f:
    js_content = f.read()

# JS 오브젝트를 Python dict로 변환
js_obj = js_content.replace('// AUTO-GENERATED 60 일주 DB\n', '')
js_obj = js_obj.replace('const ILJU_DATA_GENERATED = ', '')
js_obj = js_obj.rstrip(';\n')

# 간단히 JSON으로 변환 시도
try:
    data = json.loads(js_obj)
    print(f"파싱 성공: {len(data)}개 일주")
except Exception as e:
    print(f"파싱 오류: {e}")
    exit(1)

# HTML 읽기
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    html = f.read()

# 새 ILJU JS 오브젝트 생성
lines = ['    ILJU: {']
items = list(data.items())
for i, (k, v) in enumerate(items):
    comma = ',' if i < len(items)-1 else ''
    title = v['title'].replace('"', '\\"')
    core = v['core'].replace('"', '\\"')
    weapon = v['weapon'].replace('"', '\\"')
    love = v['love'].replace('"', '\\"')
    lines.append(f'    "{k}": {{')
    lines.append(f'        "title": "{title}",')
    lines.append(f'        "core": "{core}",')
    lines.append(f'        "weapon": "{weapon}",')
    lines.append(f'        "love": "{love}"')
    lines.append(f'    }}{comma}')
new_ilju = '\n'.join(lines) + '\n    }'

# HTML에서 기존 ILJU 블록 찾아 교체
# ILJU: { ... } 블록 찾기
start_marker = '    ILJU: {'
# 정확한 블록 끝 찾기 (중괄호 카운팅)
start_idx = html.find(start_marker)
if start_idx == -1:
    print("ILJU 블록을 찾을 수 없습니다")
    exit(1)

# 중괄호 카운팅으로 끝 찾기
depth = 0
i = start_idx
in_string = False
escape_next = False
end_idx = -1
while i < len(html):
    c = html[i]
    if escape_next:
        escape_next = False
    elif c == '\\' and in_string:
        escape_next = True
    elif c == '"' and not escape_next:
        in_string = not in_string
    elif not in_string:
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                end_idx = i + 1
                break
    i += 1

if end_idx == -1:
    print("ILJU 블록 끝을 찾을 수 없습니다")
    exit(1)

old_ilju = html[start_idx:end_idx]
print(f"기존 ILJU 블록 크기: {len(old_ilju)} 문자")
print(f"새 ILJU 블록 크기: {len(new_ilju)} 문자")

html = html[:start_idx] + new_ilju + html[end_idx:]

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w') as f:
    f.write(html)

print("주입 완료!")
