#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ===== Chapter7 마지막 p 확장 =====
OLD7 = "        + `<p class=\"ch-text\" style=\"margin-top:20px;\">지장간은 대운이나 세운의 특정 기운이 들어올 때 활성화됩니다. 평소에 잠들어 있던 지장간의 에너지가 외부 기운과 만나 반응하면서 예상치 못한 사건과 기회가 생깁니다. 특히 지장간의 여기(餘氣), 중기(中氣), 정기(正氣) 순서로 에너지가 발현되는 시점을 이해하면 10년 단위 대운의 흐름 속에서 언제 어떤 일이 일어날지 더 정확하게 예측할 수 있습니다.</p>`"

NEW7 = "        + `<div style=\"background:rgba(255,255,255,0.03);border-radius:10px;padding:18px;margin:16px 0;\"><div style=\"font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;\">&#9670; 지장간이 만드는 이중적 자아 — 왜 상황에 따라 다른 사람이 되는가</div><p style=\"font-size:13px;color:#ccc;line-height:1.88;margin:0 0 10px;\">많은 사람들이 \"나는 왜 상황에 따라 전혀 다른 사람이 되는 것 같은가?\"라는 질문을 합니다. 회사에서는 조직적이고 논리적이지만 집에서는 감성적이고 즉흥적인 자신을 발견합니다. 이것이 지장간의 작동 원리입니다. 원국 천간에 드러난 기운이 사회적 페르소나라면, 지장간의 기운은 내면의 진짜 자아입니다. 두 자아 사이의 간격이 클수록 삶에서 더 큰 내적 갈등을 경험합니다. 이 갈등을 해소하는 방법은 지장간의 욕구를 억압하는 것이 아니라, 안전한 방식으로 표현하는 통로를 만드는 것입니다.</p><p style=\"font-size:13px;color:#ccc;line-height:1.88;margin:0;\">지장간을 이해하면 자신의 이중적 모습을 결함이 아닌 다층적 능력으로 바라볼 수 있게 됩니다. 표면의 자아와 내면의 자아가 조화를 이룰 때, 당신은 가장 강력한 버전의 자신이 됩니다.</p></div>`"  + "\n        + `<p class=\"ch-text\" style=\"margin-top:20px;\">지장간은 대운이나 세운의 특정 기운이 들어올 때 활성화됩니다. 평소에 잠들어 있던 지장간의 에너지가 외부 기운과 만나 반응하면서 예상치 못한 사건과 기회가 생깁니다. 특히 지장간의 여기(餘氣), 중기(中氣), 정기(正氣) 순서로 에너지가 발현되는 시점을 이해하면 10년 단위 대운의 흐름 속에서 언제 어떤 일이 일어날지 더 정확하게 예측할 수 있습니다.</p>`"

if OLD7 in content:
    content = content.replace(OLD7, NEW7, 1)
    print("OK: Chapter7 마지막 확장")
else:
    print("FAIL: Chapter7 마지막")
    idx = content.find('지장간은 대운이나 세운의')
    print(f"  idx={idx}")

# ===== SewunLoop 추가 텍스트 확장 =====
# 세운 설명 헤더에 더 많은 텍스트 추가
OLD_SEW = "        <p class=\"ch-text\">대운이 10년의 기후라면, 세운은 그해의 날씨입니다. 올해부터 향후 10년간 당신에게 어떤 바람이 불고 어떤 해가 뜰지 예측합니다. 매년 당신의 원국 기운이 그해의 기운과 충돌하며 만들어내는 서사입니다. 용신 기운이 들어오는 해는 집중 공략하고, 기신 기운의 해는 수비에 집중하십시오.</p>"

NEW_SEW = "        <p class=\"ch-text\">대운이 10년의 기후라면, 세운은 그해의 날씨입니다. 올해부터 향후 10년간 당신에게 어떤 바람이 불고 어떤 해가 뜰지 예측합니다. 매년 당신의 원국 기운이 그해의 기운과 충돌하며 만들어내는 서사입니다. 용신 기운이 들어오는 해는 집중 공략하고, 기신 기운의 해는 수비에 집중하십시오.</p>\n        <p class=\"ch-text\">세운을 읽는 핵심 원칙이 있습니다. 천간이 그해의 의도와 방향이라면 지지는 그 해의 실질적 에너지와 사건입니다. 천간만 길해도 지지가 기신이면 시작은 좋지만 결과가 아쉽습니다. 반대로 천간이 흉해도 지지가 용신이면 힘들게 시작하지만 결국 좋은 결과를 얻습니다. 가장 강력한 세운은 천간과 지지 모두 용신 기운일 때이며, 그 해가 당신 인생의 폭발적 전환점이 됩니다. 또한 세운은 반드시 현재 대운과의 관계 속에서 읽어야 합니다. 같은 길한 세운도 흉한 대운 안에서 일어나면 효과가 반감됩니다. 대운과 세운의 기운이 모두 용신일 때 최대의 에너지가 발현됩니다.</p>"

if OLD_SEW in content:
    content = content.replace(OLD_SEW, NEW_SEW, 1)
    print("OK: SewunLoop 텍스트 확장")
else:
    print("FAIL: SewunLoop 텍스트")
    idx = content.find('대운이 10년의 기후라면')
    print(f"  idx={idx}")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
