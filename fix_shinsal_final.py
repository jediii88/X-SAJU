import re

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('const SHINSAL_LOGIC = {')
# 블록 끝 찾기
end_search = html.find('\nwindow.UNSUNG_MAP', start)
if end_search < 0:
    # 마지막 }; 찾기
    pos = start
    depth = 0
    for i, ch in enumerate(html[start:], start):
        if ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                end_search = i + 1
                break

print(f'SHINSAL_LOGIC: {start} ~ {end_search}')
block = html[start:end_search]
original = block

# 지지 한글 → 한자 (map 딕셔너리 값으로 쓰인 경우만)
# 패턴: ":"한글" 또는 ":"한글쌍"
BRANCH_MAP = {
    '자':'子', '축':'丑', '인':'寅', '묘':'卯', '진':'辰', '사':'巳',
    '오':'午', '미':'未', '신':'申', '유':'酉', '술':'戌', '해':'亥',
}
PAIR_MAP = {
    '축미':'丑未', '자신':'子申', '해유':'亥酉', '묘사':'卯巳', '인오':'寅午',
    '사오미':'巳午未', '인묘진':'寅卯辰', '신유술':'申酉戌', '해자축':'亥子丑',
    '자묘':'子卯', '인신':'寅申', '사해':'巳亥', '축술미':'丑戌未', '진술축미':'辰戌丑未',
}

# 쌍 먼저 (긴 것 우선)
for kor, hanja in sorted(PAIR_MAP.items(), key=lambda x: -len(x[0])):
    block = block.replace('"' + kor + '"', '"' + hanja + '"')
    block = block.replace("'" + kor + "'", "'" + hanja + "'")

# 단일 지지 (값 위치에서만)
for kor, hanja in BRANCH_MAP.items():
    # ":"값" 패턴 — 딕셔너리 값
    block = re.sub(r'(:\s*")' + kor + r'(")', r'\g<1>' + hanja + r'\2', block)
    block = re.sub(r"(:\s*')" + kor + r"(')", r"\g<1>" + hanja + r"\2", block)
    # 배열 내 값: ['값', ...] 패턴
    block = re.sub(r"'\s*" + kor + r"\s*'(\s*[,\]])", "'" + hanja + r"'\1", block)
    block = re.sub(r'"\s*' + kor + r'\s*"(\s*[,\]])', '"' + hanja + r'"\1', block)

# 간지 2글자 한글 → 한자 (배열 안에 들어있는 경우)
GANJU_MAP = {
    '갑자':'甲子','갑인':'甲寅','갑진':'甲辰','갑오':'甲午','갑신':'甲申','갑술':'甲戌',
    '을축':'乙丑','을묘':'乙卯','을사':'乙巳','을미':'乙未','을유':'乙酉','을해':'乙亥',
    '병자':'丙子','병인':'丙寅','병진':'丙辰','병오':'丙午','병신':'丙申','병술':'丙戌',
    '정축':'丁丑','정묘':'丁卯','정사':'丁巳','정미':'丁未','정유':'丁酉','정해':'丁亥',
    '무자':'戊子','무인':'戊寅','무진':'戊辰','무오':'戊午','무신':'戊申','무술':'戊戌',
    '기축':'己丑','기묘':'己卯','기사':'己巳','기미':'己未','기유':'己酉','기해':'己亥',
    '경자':'庚子','경인':'庚寅','경진':'庚辰','경오':'庚午','경신':'庚申','경술':'庚戌',
    '신축':'辛丑','신묘':'辛卯','신사':'辛巳','신미':'辛未','신유':'辛酉','신해':'辛亥',
    '임자':'壬子','임인':'壬寅','임진':'壬辰','임오':'壬午','임신':'壬申','임술':'壬戌',
    '계축':'癸丑','계묘':'癸卯','계사':'癸巳','계미':'癸未','계유':'癸酉','계해':'癸亥',
}
for kor, hanja in GANJU_MAP.items():
    block = block.replace("'" + kor + "'", "'" + hanja + "'")
    block = block.replace('"' + kor + '"', '"' + hanja + '"')

changed = sum(1 for a,b in zip(original.split('\n'), block.split('\n')) if a != b)
print(f'변경된 줄: {changed}')

# 변경 내용 샘플
for a, b in zip(original.split('\n'), block.split('\n')):
    if a != b:
        print(f'  -{a.strip()[:70]}')
        print(f'  +{b.strip()[:70]}')

html = html[:start] + block + html[end_search:]

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('저장 완료')
