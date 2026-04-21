import re

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# SHINSAL_LOGIC 블록 추출
start = html.find('const SHINSAL_LOGIC = {')
# 블록 끝 찾기 (다음 const/window 선언 전)
end = html.find('\nwindow.UNSUNG_MAP', start)
if end < 0:
    end = html.find('\nconst UNSUNG_MAP', start)
if start < 0 or end < 0:
    print('블록 못 찾음', start, end)
    exit()

block = html[start:end]
original = block

# 지지 한글→한자 교체 (map 값으로 사용되는 경우)
BRANCH_KOR_TO_HAN = {
    '자':'子', '축':'丑', '인':'寅', '묘':'卯', '진':'辰', '사':'巳',
    '오':'午', '미':'未', '신':'申', '유':'酉', '술':'戌', '해':'亥',
}

# map 딕셔너리 값으로 들어있는 지지 한글 → 한자
# 패턴: "키":"값" 형태에서 값이 한글 지지인 경우
for kor, hanja in BRANCH_KOR_TO_HAN.items():
    # 딕셔너리 값 위치 (콜론 뒤)
    block = re.sub(r'(:\s*")' + kor + r'(["，,}])', r'\g<1>' + hanja + r'\2', block)
    block = re.sub(r"(:\s*')" + kor + r"(['，,}])", r"\g<1>" + hanja + r"\2", block)

# 특수 문자열 배열 복원 (백호대살, 괴강살 등 간지 배열)
# ['갑진','을미','병술','정축','무진','임술','계축'] → ['甲辰','乙未','丙戌','丁丑','戊辰','壬戌','癸丑']
GANJU_KOR_TO_HAN = {
    '갑자':'甲子', '갑인':'甲寅', '갑진':'甲辰', '갑오':'甲午', '갑신':'甲申', '갑술':'甲戌',
    '을축':'乙丑', '을묘':'乙卯', '을사':'乙巳', '을미':'乙未', '을유':'乙酉', '을해':'乙亥',
    '병자':'丙子', '병인':'丙寅', '병진':'丙辰', '병오':'丙午', '병신':'丙申', '병술':'丙戌',
    '정축':'丁丑', '정묘':'丁卯', '정사':'丁巳', '정미':'丁未', '정유':'丁酉', '정해':'丁亥',
    '무자':'戊子', '무인':'戊寅', '무진':'戊辰', '무오':'戊午', '무신':'戊申', '무술':'戊戌',
    '기축':'己丑', '기묘':'己卯', '기사':'己巳', '기미':'己未', '기유':'己酉', '기해':'己亥',
    '경자':'庚子', '경인':'庚寅', '경진':'庚辰', '경오':'庚午', '경신':'庚申', '경술':'庚戌',
    '신축':'辛丑', '신묘':'辛卯', '신사':'辛巳', '신미':'辛未', '신유':'辛酉', '신해':'辛亥',
    '임자':'壬子', '임인':'壬寅', '임진':'壬辰', '임오':'壬午', '임신':'壬申', '임술':'壬戌',
    '계축':'癸丑', '계묘':'癸卯', '계사':'癸巳', '계미':'癸未', '계유':'癸酉', '계해':'癸亥',
}
for kor, hanja in GANJU_KOR_TO_HAN.items():
    block = block.replace("'" + kor + "'", "'" + hanja + "'")
    block = block.replace('"' + kor + '"', '"' + hanja + '"')

# 연속 지지 문자열 복원 (축미, 자신, 해유, 묘사, 인오 등)
PAIRS = {
    '축미':'丑未', '자신':'子申', '해유':'亥酉', '묘사':'卯巳', '인오':'寅午',
    '사오미':'巳午未', '인묘진':'寅卯辰', '신유술':'申酉戌', '해자축':'亥子丑',
}
for kor, hanja in PAIRS.items():
    block = block.replace('"' + kor + '"', '"' + hanja + '"')
    block = block.replace("'" + kor + "'", "'" + hanja + "'")

if block != original:
    html = html[:start] + block + html[end:]
    print('SHINSAL_LOGIC 복원 완료')
    # 변경 샘플 출력
    for i, (a,b) in enumerate(zip(original.split('\n'), block.split('\n'))):
        if a != b:
            print(f'  변경: {a.strip()[:60]} → {b.strip()[:60]}')
        if i > 100: break
else:
    print('변경 없음 — 이미 정상이거나 패턴 불일치')

# 추가: 관계 분석 함수들 내부의 지지 문자열 확인
# buildRelationLines, getHapChung 등
relation_funcs = ['buildRelationLines', 'getHapChung', 'getSamhap', 'getYukhap']
for func in relation_funcs:
    idx = html.find(f'function {func}')
    if idx > 0:
        snippet = html[idx:idx+200]
        print(f'{func}: {snippet[:100]}')

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('저장 완료')
