#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 세운 핵심 전략 텍스트 뒤에 추가 내용 삽입
TARGET = "                <p style=\"font-size:12.5px;color:#ccc;line-height:1.88;margin:0;\">길한 세운에는 인생의 주요 결정(창업·이직·투자·결혼)을 실행하십시오. 흉한 세운에는 현상 유지와 내공 축적에 집중하되, 몸과 마음의 건강 관리를 최우선으로 두십시오. 가장 강력한 전략은 길한 세운에 씨를 뿌리고, 흉한 세운에 뿌리를 내리며, 다음 길운에 폭발적으로 수확하는 것입니다. 단기적 결과에 집착하지 말고, 10년의 사이클을 보고 전략을 수립하십시오.</p>"

NEW = "                <p style=\"font-size:12.5px;color:#ccc;line-height:1.88;margin:0 0 10px;\">길한 세운에는 인생의 주요 결정(창업·이직·투자·결혼)을 실행하십시오. 흉한 세운에는 현상 유지와 내공 축적에 집중하되, 몸과 마음의 건강 관리를 최우선으로 두십시오. 가장 강력한 전략은 길한 세운에 씨를 뿌리고, 흉한 세운에 뿌리를 내리며, 다음 길운에 폭발적으로 수확하는 것입니다. 단기적 결과에 집착하지 말고, 10년의 사이클을 보고 전략을 수립하십시오.</p>\n                <p style=\"font-size:12.5px;color:#ccc;line-height:1.88;margin:0;\">세운은 매년 새해 시작(양력 2월 절기 입춘 기준)에 바뀝니다. 생일이 아닌 절기를 기준으로 세운의 시작을 인식하십시오. 세운 초반(봄~여름)에는 천간의 에너지가 강하게 작동하고, 후반(가을~겨울)에는 지지의 에너지가 더 강하게 발현됩니다. 따라서 같은 세운이라도 상반기와 하반기에 다른 전략이 필요합니다. 길한 세운의 상반기에는 확장과 공세, 하반기에는 안정과 수확에 집중하십시오. 흉한 세운의 상반기에는 신중한 관찰, 하반기에는 내실 다지기와 다음 해 준비에 집중하는 것이 현명합니다. 세운과 월운이 겹쳐 강화되는 달을 찾아 그 달에 중요한 행동을 집중하면 효과가 배가됩니다.</p>"

if TARGET in content:
    content = content.replace(TARGET, NEW, 1)
    print("OK: SewunLoop 마지막 확장 완료")
else:
    print("FAIL: 대상 없음")
    idx = content.find('길한 세운에는 인생의 주요 결정')
    print(f"  idx={idx}")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
