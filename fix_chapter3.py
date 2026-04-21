#!/usr/bin/env python3
import sys

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

OLD = '`}[maxW] || `<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;"><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">${maxKr} 기운 과다의 특성을 파악하고 이를 의식적으로 통제하는 것이 인생 전략의 핵심입니다.</p></div>`}\n\nfunction buildChapter4_Wealth(data) {'

if OLD not in content:
    print("ERROR: 대상 텍스트를 찾을 수 없음")
    idx = content.find('기운 과다의 특성을 파악하고')
    if idx >= 0:
        print(repr(content[idx-20:idx+300]))
    sys.exit(1)

ch3 = open('/home/node/.openclaw/workspace/chapter3_insert.txt', 'r', encoding='utf-8').read()
NEW = '`}[maxW] || `<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;"><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">${maxKr} 기운 과다의 특성을 파악하고 이를 의식적으로 통제하는 것이 인생 전략의 핵심입니다.</p></div>`}\n            </div>\n        </div>\n    </div>`;\n}\n\n' + ch3 + '\n\nfunction buildChapter4_Wealth(data) {'

content = content.replace(OLD, NEW, 1)
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
