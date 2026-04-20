import re

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 신살 이름에서 한자 제거: '천을귀인(天乙貴人)' → '천을귀인'
# SHINSAL_DESC 키와 SHINSAL_LOGIC 키 모두

# 패턴: 한글+한자괄호 형태의 신살명
def strip_hanja_from_shinsal(text):
    # 신살명 패턴: 한글로 끝나는 살/인/성/관 뒤에 오는 (漢字) 제거
    return re.sub(r'([\uAC00-\uD7A3]+(?:살|귀인|성|관|겁|신|마|화|양|원|홍|고|과|백|괴))\([\u4E00-\u9FFF]+\)', r'\1', text)

# SHINSAL_DESC 블록에서만 적용
idx = html.find("window.SHINSAL_DESC = {")
end_idx = idx
depth = 0
for i in range(idx, len(html)):
    if html[i] == '{': depth += 1
    elif html[i] == '}':
        depth -= 1
        if depth == 0:
            end_idx = i + 1
            break

old_block = html[idx:end_idx]
new_block = strip_hanja_from_shinsal(old_block)
changed_count = sum(1 for a,b in zip(old_block.split('\n'), new_block.split('\n')) if a!=b)
html = html[:idx] + new_block + html[end_idx:]
print(f"SHINSAL_DESC 한자 제거: {changed_count}줄 변경")

# SHINSAL_LOGIC 블록에서도 신살명 한자 제거
idx2 = html.find("window.SHINSAL_LOGIC = {") if "window.SHINSAL_LOGIC" in html else html.find("const SHINSAL_LOGIC = {")
if idx2 == -1:
    idx2 = html.find("SHINSAL_LOGIC = {")
if idx2 > -1:
    depth = 0
    end_idx2 = idx2
    for i in range(idx2, min(idx2+100000, len(html))):
        if html[i] == '{': depth += 1
        elif html[i] == '}':
            depth -= 1
            if depth == 0:
                end_idx2 = i + 1
                break
    old_block2 = html[idx2:end_idx2]
    new_block2 = strip_hanja_from_shinsal(old_block2)
    changed2 = sum(1 for a,b in zip(old_block2.split('\n'), new_block2.split('\n')) if a!=b)
    html = html[:idx2] + new_block2 + html[end_idx2:]
    print(f"SHINSAL_LOGIC 한자 제거: {changed2}줄 변경")

# buildShinsalSummary 함수에서 신살 표시 한자 제거
def strip_hanja_parens(text):
    # (漢字) 형태 제거
    return re.sub(r'\([\u4E00-\u9FFF]{2,6}\)', '', text)

# SHINSAL 렌더 UI 텍스트에서도 제거 (카드 표시 부분)
idx3 = html.find("function buildShinsalSummary(")
if idx3 > -1:
    depth = 0
    end_idx3 = idx3
    for i in range(idx3, min(idx3+20000, len(html))):
        if html[i] == '{': depth += 1
        elif html[i] == '}':
            depth -= 1
            if depth == 0:
                end_idx3 = i + 1
                break
    old_fn = html[idx3:end_idx3]
    new_fn = strip_hanja_from_shinsal(old_fn)
    html = html[:idx3] + new_fn + html[end_idx3:]
    print("buildShinsalSummary 한자 제거 완료")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 | {len(html):,} bytes")
