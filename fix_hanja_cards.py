with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

fixes = 0

# 1. 대운 카드 헤더: 한자만 → 한자 + 한글
old1 = "'<div style=\"display:flex;align-items:center;gap:8px;\"><span style=\"font-size:22px;font-weight:900;color:var(--gold);font-family:Noto Serif KR,serif;\">'+g+j+'</span>'"
new1 = """'<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:22px;font-weight:900;color:var(--gold);font-family:Noto Serif KR,serif;">'+g+j+'</span><span style="font-size:15px;font-weight:600;color:#ccc;">('+((HAN_KOR&&HAN_KOR[g])||g)+((HAN_KOR&&HAN_KOR[j])||j)+')</span>'"""
if old1 in html:
    html = html.replace(old1, new1, 1)
    fixes += 1
    print('대운 카드 헤더 OK')
else:
    print('대운 카드 헤더 패턴 못찾음')

# 2. 대운 천간 레이블
old2 = "'>천간 '+g+'</div>"
new2 = "'>천간 '+g+'('+((HAN_KOR&&HAN_KOR[g])||g)+')</div>"
if old2 in html:
    html = html.replace(old2, new2, 1)
    fixes += 1
    print('대운 천간 레이블 OK')

# 3. 대운 지지 레이블
old3 = "'>지지 '+j+'</div>"
new3 = "'>지지 '+j+'('+((HAN_KOR&&HAN_KOR[j])||j)+')</div>"
if old3 in html:
    html = html.replace(old3, new3, 1)
    fixes += 1
    print('대운 지지 레이블 OK')

# 4. 세운 카드 헤더
old4 = "'<div style=\"display:flex;align-items:center;gap:7px;\"><span style=\"font-size:18px;font-weight:900;color:var(--gold);font-family:Noto Serif KR,serif;\">'+g+j+'</span>'"
new4 = """'<div style="display:flex;align-items:center;gap:7px;"><span style="font-size:18px;font-weight:900;color:var(--gold);font-family:Noto Serif KR,serif;">'+g+j+'</span><span style="font-size:13px;font-weight:600;color:#ccc;">('+((HAN_KOR&&HAN_KOR[g])||g)+((HAN_KOR&&HAN_KOR[j])||j)+')</span>'"""
if old4 in html:
    html = html.replace(old4, new4, 1)
    fixes += 1
    print('세운 카드 헤더 OK')
else:
    print('세운 카드 헤더 패턴 못찾음')

# 5. 세운 본문 한글
old5 = "'<p style=\"font-size:12px;color:#ddd;line-height:1.7;margin:0 0 7px;\">천간 '+g+'는 '+KN[gOh]+' 기운, 지지 '+j+'는'"
new5 = "'<p style=\"font-size:12px;color:#ddd;line-height:1.7;margin:0 0 7px;\">천간 '+g+'('+((HAN_KOR&&HAN_KOR[g])||g)+')는 '+KN[gOh]+' 기운, 지지 '+j+'('+((HAN_KOR&&HAN_KOR[j])||j)+')는'"
if old5 in html:
    html = html.replace(old5, new5, 1)
    fixes += 1
    print('세운 본문 OK')
else:
    print('세운 본문 패턴 못찾음')

print(f'총 {fixes}개 수정')
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('저장 완료')
