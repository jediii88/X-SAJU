#!/usr/bin/env python3
import re

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

def extract_func(name, content):
    """함수 본문 추출"""
    start = content.find(f'function {name}(')
    if start < 0:
        return ''
    # 다음 function 키워드까지
    next_func = content.find('\nfunction ', start+1)
    if next_func < 0:
        return content[start:]
    return content[start:next_func]

def count_korean(text):
    """한글 자모 + 완성형 글자 수"""
    # HTML 태그 제거
    text_no_html = re.sub(r'<[^>]+>', ' ', text)
    # JavaScript 키워드/변수명 제거 (영문/숫자)
    korean_chars = re.findall(r'[가-힣]', text_no_html)
    return len(korean_chars)

funcs = [
    'buildChapter2_Wuxing',
    'buildChapter3_Sipseong', 
    'buildChapter4_Wealth',
    'buildChapter7_Hidden',
    'buildChapter9_Remedy',
    'buildSewunLoop',
]

print("=== 각 함수 한글 텍스트 분량 ===")
for fname in funcs:
    body = extract_func(fname, content)
    cnt = count_korean(body)
    status = "✅ PASS" if cnt >= 3000 else "⚠ 부족"
    print(f"{status} {fname}: {cnt:,}자")
