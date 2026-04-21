with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 찾아야 할 패턴: 함수 닫힘 `}` 바로 뒤에 `const pillars = data.pillars` 가 나오는 곳
old = '''    </div>\`;
}
    const pillars = data.pillars || [];
    const pillarNames = ['\uc2dc\uc8fc','\uc77c\uc8fc','\uc6d4\uc8fc','\uc5f0\uc8fc'];'''

new = '''    </div>\`;
}
function buildChapter1_Basic(data) {
    const pillars = data.pillars || [];
    const pillarNames = ['\uc2dc\uc8fc','\uc77c\uc8fc','\uc6d4\uc8fc','\uc5f0\uc8fc'];'''

if old in html:
    html = html.replace(old, new, 1)
    print('buildChapter1_Basic 함수 선언 복구 완료')
else:
    print('패턴 못 찾음, 대체 탐색')
    idx = html.find('const pillarNames = [\'\uc2dc\uc8fc\'')
    print(f'pillarNames 위치: {idx}')
    print(repr(html[idx-120:idx+50]))

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('저장 완료')
