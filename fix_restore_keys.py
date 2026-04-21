import re

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ─── BRANCH_HIDDEN 복원: 한글 키/값 → 한자 키/값
old_branch = """const BRANCH_HIDDEN = {
    자:['계'], 축:['기','계','신'], 인:['갑','병','무'], 묘:['을'], 진:['무','을','계'], 사:['병','무','경'],
    오:['정','기'], 미:['기','정','을'], 신:['경','임','무'], 유:['신'], 술:['무','신','정'], 해:['임','갑']
};"""

new_branch = """const BRANCH_HIDDEN = {
    '子':['癸'], '丑':['己','癸','辛'], '寅':['甲','丙','戊'], '卯':['乙'], '辰':['戊','乙','癸'], '巳':['丙','戊','庚'],
    '午':['丁','己'], '未':['己','丁','乙'], '申':['庚','壬','戊'], '酉':['辛'], '戌':['戊','辛','丁'], '亥':['壬','甲']
};"""

if old_branch in html:
    html = html.replace(old_branch, new_branch)
    print('BRANCH_HIDDEN 복원 완료')
else:
    print('BRANCH_HIDDEN 패턴 못 찾음, 수동 확인 필요')

# ─── SHINSAL_LOGIC 내 map 문자열 복원
# "갑":"축미" → "甲":"축미" 등 일간(天干) 키 복원
TEN_STEMS = [('갑','甲'),('을','乙'),('병','丙'),('정','丁'),('무','戊'),
             ('기','己'),('경','庚'),('신','辛'),('임','壬'),('계','癸')]
TWELVE_BRANCHES = [('자','子'),('축','丑'),('인','寅'),('묘','卯'),('진','辰'),('사','巳'),
                   ('오','午'),('미','未'),('신대','申'),('유','酉'),('술','戌'),('해','亥')]
# 신은 지지/천간 둘 다라 특별 처리

# map 딕셔너리 안의 "한글":"값" 패턴에서 천간 키 복원
for kor, hanja in TEN_STEMS:
    # "갑": 패턴 (map 안에서만)
    html = re.sub(r'"' + kor + r'"(\s*:)', '"' + hanja + r'"\1', html)

# SHINSAL_LOGIC 내부 타겟 문자열도 복원이 필요한지 확인
# targets.includes(gz[1]) 같은 로직에서 gz[1]은 한자 지지이므로
# map 값("축미" 등 한글 지지)이 한자로 바뀌어야 할 수도 있음
# "축미" 같은 지지 쌍을 체크하는 문자열도 복원

# 지지 문자열 쌍 복원 (SHINSAL map 값으로 들어있는 지지들)
BRANCH_STR_MAP = {
    '축미': '丑未', '자신': '子申', '해유': '亥酉', '묘사': '卯巳', '인오': '寅午',
    '사오미': '巳午未', '인묘진': '寅卯辰', '신유술': '申酉戌', '해자축': '亥子丑',
    '사': '巳', '오': '午', '신': '申', '유': '酉', '해': '亥', '자': '子',
    '인': '寅', '묘': '卯', '축': '丑', '미': '未', '술': '戌', '진': '辰',
}

# SHINSAL_LOGIC 블록을 찾아서 내부 문자열 복원
shinsal_start = html.find('const SHINSAL_LOGIC = {')
shinsal_end = html.find('\nconst UNSUNG_MAP', shinsal_start)
if shinsal_start > 0 and shinsal_end > 0:
    shinsal_block = html[shinsal_start:shinsal_end]
    original_block = shinsal_block
    
    # map 딕셔너리 값의 한글 지지 쌍 복원
    for kor, hanja in BRANCH_STR_MAP.items():
        if len(kor) >= 2:  # 2글자 이상만 (단일 글자는 위험)
            shinsal_block = shinsal_block.replace('"' + kor + '"', '"' + hanja + '"')
            shinsal_block = shinsal_block.replace("'" + kor + "'", "'" + hanja + "'")
    
    # 단일 지지 글자 복원 (map 값으로 들어있는 경우만)
    SINGLE_BRANCH = [('자','子'),('축','丑'),('인','寅'),('묘','卯'),('진','辰'),
                     ('사','巳'),('오','午'),('미','未'),('유','酉'),('술','戌'),('해','亥')]
    for kor, hanja in SINGLE_BRANCH:
        shinsal_block = re.sub(r'"' + kor + r'"(\s*:)', '"' + hanja + r'"\1', shinsal_block)
        shinsal_block = re.sub(r'"' + kor + r'"(\s*[,}])', '"' + hanja + r'"\1', shinsal_block)
        shinsal_block = re.sub(r"'" + kor + r"'(\s*:)", "'" + hanja + r"'\1", shinsal_block)
        shinsal_block = re.sub(r"'" + kor + r"'(\s*[,}])", "'" + hanja + r"'\1", shinsal_block)
    
    # 신(辛/申) 특별 처리 - 천간 辛은 이미 위에서 복원됨, 지지 申도 복원
    # "신": 패턴 복원 (天干辛은 "辛", 地支申은 "申" 구분 어려우므로 컨텍스트로)
    # UNSUNG_MAP 안의 "辛"은 실제로는 지지 申 자리에 잘못 들어간 것들이 있음
    # 일단 SHINSAL_LOGIC에서 신 관련은 유지
    
    if original_block != shinsal_block:
        html = html[:shinsal_start] + shinsal_block + html[shinsal_end:]
        print('SHINSAL_LOGIC 내부 복원 완료')
    else:
        print('SHINSAL_LOGIC 변경 없음')
else:
    print('SHINSAL_LOGIC 블록 못 찾음')

# ─── HAN_KOR, HAN_COLOR 등 핵심 매핑 확인 및 복원
# 이 맵들은 '甲':'갑' 형태여야 함 — fix_hanja2가 뒤집었을 수 있음
han_kor_start = html.find("const HAN_KOR = {")
if han_kor_start > 0:
    snippet = html[han_kor_start:han_kor_start+300]
    print('HAN_KOR 현재:', snippet[:200])

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('저장 완료')
