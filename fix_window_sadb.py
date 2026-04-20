with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# SAJU_DB 선언을 const에서 window 할당으로 변경
# 이렇게 하면 window.SAJU_DB로 어디서든 접근 가능

old = 'const SAJU_DB = {'
new = 'window.SAJU_DB = {'

if old in html:
    html = html.replace(old, new, 1)
    print("SAJU_DB 선언 const → window 변경 성공")
else:
    print("패턴 불일치")

# UNSUNG_MAP도 같은 문제인지 확인
if 'const UNSUNG_MAP' in html:
    html = html.replace('const UNSUNG_MAP', 'window.UNSUNG_MAP', 1)
    print("UNSUNG_MAP도 window 변경")
elif 'window.UNSUNG_MAP' in html:
    print("UNSUNG_MAP은 이미 window")
else:
    print("UNSUNG_MAP: NOT FOUND")

# window.SAJU_DB 참조 검증
count = html.count('window.SAJU_DB')
print(f"window.SAJU_DB 참조 총 {count}개")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
