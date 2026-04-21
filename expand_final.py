#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ===== buildChapter4 마지막 p 확장 (54자 추가) =====
TARGET4 = '재물의 크기를 결정하는 것은 타고난 사주가 아니라, 그 사주의 기운을 얼마나 정확하게 활용하느냐입니다. 당신의 진짜 금고는 아직 열리지 않았습니다.</p>'
NEW4 = '재물의 크기를 결정하는 것은 타고난 사주가 아니라, 그 사주의 기운을 얼마나 정확하게 활용하느냐입니다. 당신의 진짜 금고는 아직 열리지 않았습니다. 용신이 들어오는 시기를 알고, 그 때에 집중적으로 행동하는 사람이 결국 운명을 바꿉니다. 지금 이 리포트를 읽는 것이 그 첫 번째 행동입니다.</p>'

if TARGET4 in content:
    content = content.replace(TARGET4, NEW4, 1)
    print("OK: buildChapter4 마지막 문단 확장")
else:
    print("FAIL: buildChapter4 마지막 문단 없음")

# ===== buildChapter7_Hidden 추가 확장 =====
# 지장간 심층 의미 섹션 앞에 더 많은 내용 추가
TARGET7 = '        <p class="ch-text" style="margin-top:16px;">이 숨겨진 기운은 평소에는 작동하지 않습니다.'

EXTRA7 = '''        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 지장간이 인생에서 발동하는 구체적 상황들</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 14px;">지장간은 평소에는 조용히 잠들어 있지만, 다음의 상황에서 강렬하게 발동합니다. 첫째, 해당 지장간 오행과 같은 대운이나 세운이 들어올 때 잠재된 에너지가 표면으로 폭발합니다. 이것이 평소와 전혀 다른 면모가 갑자기 나타나는 이유입니다. 둘째, 인생의 극한 위기 상황에서 지장간의 에너지가 발동하여 예상치 못한 능력을 발현합니다. 위기에 강한 사람들은 대부분 강력한 지장간 에너지를 가진 경우가 많습니다. 셋째, 특정 인물과의 만남이 지장간을 자극하는 경우가 있습니다. 상대방의 오행이 내 지장간의 오행과 맞을 때, 평소에 드러내지 않는 모습이 그 사람 앞에서만 나타납니다. 이것이 특정 사람 앞에서 달라지는 자신을 경험하는 이유입니다.</p>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:14px;border-left:3px solid var(--gold);">
                    <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px;">지장간의 삼 단계 발현 — 여기, 중기, 정기</div>
                    <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">각 지지의 지장간은 세 단계로 에너지가 발현됩니다. 여기(餘氣)는 이전 계절의 기운이 남아있는 초반 3~7일 정도로, 아직 완전히 드러나지 않은 잠재적 에너지입니다. 이 시기에는 이전 에너지가 마무리되며 새 에너지가 준비됩니다. 중기(中氣)는 그 지지의 보조 기운으로 중반에 발현됩니다. 본격적인 변화가 시작되는 시점이며, 새로운 기회와 도전이 나타납니다. 정기(正氣)는 해당 지지의 본기운으로 가장 강력하게 발현됩니다. 이 시기에 지장간의 진짜 에너지가 폭발하며 운명적인 사건과 만남이 이루어집니다. 대운의 흐름을 여기·중기·정기로 세분화하면 10년의 대운 안에서도 언제 에너지가 절정에 달하는지 예측할 수 있습니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px;">지장간과 배우자·파트너의 관계</div>
                    <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">일지는 배우자궁입니다. 일지의 지장간은 당신이 파트너에게서 무의식적으로 원하는 것을 나타냅니다. 일지 지장간이 정재라면 경제적 안정감과 믿음직한 파트너를 원합니다. 식신이라면 즐거움과 감성적 풍요로움을 주는 사람에게 이끌립니다. 정관이라면 사회적으로 인정받고 원칙이 있는 파트너를 원합니다. 편관이라면 강렬하고 도전적인 에너지를 가진 사람에게 끌립니다. 이 무의식적 욕구를 알면 왜 특정 유형의 사람에게 반복적으로 끌리는지 이해하게 됩니다. 그리고 그 패턴이 당신에게 맞는지 아닌지도 객관적으로 볼 수 있게 됩니다.</p>
                </div>
            </div>
        </div>
        <p class="ch-text" style="margin-top:16px;">이 숨겨진 기운은 평소에는 작동하지 않습니다.'''

if TARGET7 in content:
    content = content.replace(TARGET7, EXTRA7, 1)
    print("OK: buildChapter7_Hidden 추가 확장 완료")
else:
    print("FAIL: buildChapter7 추가 대상 없음")
    idx = content.find('이 숨겨진 기운은 평소에는')
    print(f"  idx={idx}")

# ===== buildSewunLoop 추가 확장 — 섹션 헤더 텍스트 확장 =====
TARGET_SEW = '        <h3 class="ch-title">Chapter 11. 향후 10년 세운 정밀 타격</h3>\n        <p class="ch-text">대운이 10년의 기후라면, 세운은 그해의 날씨입니다. 올해부터 향후 10년간 당신에게 어떤 바람이 불고 어떤 해가 뜰지 예측합니다. 매년 당신의 원국 기운이 그해의 기운과 충돌하며 만들어내는 서사입니다. 용신 기운이 들어오는 해는 집중 공략하고, 기신 기운의 해는 수비에 집중하십시오.</p>'

NEW_SEW = '''        <h3 class="ch-title">Chapter 11. 향후 10년 세운 정밀 타격</h3>
        <p class="ch-text">대운이 10년의 기후라면, 세운은 그해의 날씨입니다. 올해부터 향후 10년간 당신에게 어떤 바람이 불고 어떤 해가 뜰지 예측합니다. 매년 당신의 원국 기운이 그해의 기운과 충돌하며 만들어내는 서사입니다. 용신 기운이 들어오는 해는 집중 공략하고, 기신 기운의 해는 수비에 집중하십시오.</p>
        <div style="background:rgba(199,167,106,0.06);border-radius:10px;padding:18px;margin:20px 0;border:1px solid rgba(199,167,106,0.15);">
            <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">세운 분석 핵심 원칙</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 10px;">세운의 천간은 그 해의 표면적 흐름을 나타내고, 지지는 그 해의 실질적 에너지를 담고 있습니다. 천간이 길해도 지지가 흉하면 시작은 좋지만 결과가 나쁩니다. 반대로 천간이 흉해도 지지가 길하면 어렵게 시작하지만 결국 좋은 결과를 얻습니다. 가장 강력한 세운은 천간과 지지 모두 용신 기운일 때입니다. 이런 해가 당신 인생의 폭발적 전환점이 될 가능성이 높습니다. 세운을 읽을 때는 반드시 현재 대운과의 관계를 함께 고려해야 합니다. 같은 길한 세운도 흉한 대운 안에서 일어나면 효과가 반감됩니다. 아래 각 연도의 종합 점수와 4분야 조언을 참고하여 해당 연도의 전략을 수립하십시오.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                <div style="background:rgba(199,167,106,0.08);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">🌟</div>
                    <div style="font-size:11px;color:#c7a76a;font-weight:700;">대길 (4점+)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">전면 공세. 모든 분야에서 대담한 결정을 실행하십시오.</p>
                </div>
                <div style="background:rgba(0,200,83,0.06);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">✦</div>
                    <div style="font-size:11px;color:#00C853;font-weight:700;">길 (1~3점)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">순풍. 계획을 실행하되 과욕은 피하십시오.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">—</div>
                    <div style="font-size:11px;color:#888;font-weight:700;">평 (0점)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">현상 유지. 안정적 관리에 집중하십시오.</p>
                </div>
                <div style="background:rgba(255,150,0,0.06);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">⚠</div>
                    <div style="font-size:11px;color:#ff9800;font-weight:700;">주의 (-1~-2점)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">역풍. 신중하게 움직이고 리스크를 최소화하십시오.</p>
                </div>
                <div style="background:rgba(231,76,60,0.06);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">❌</div>
                    <div style="font-size:11px;color:#e74c3c;font-weight:700;">흉 (-3점-)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">강한 역풍. 방어 전략으로 손실을 최소화하십시오.</p>
                </div>
            </div>
        </div>'''

if TARGET_SEW in content:
    content = content.replace(TARGET_SEW, NEW_SEW, 1)
    print("OK: buildSewunLoop 헤더 확장 완료")
else:
    print("FAIL: buildSewunLoop 헤더 없음")
    idx = content.find('Chapter 11. 향후 10년')
    print(f"  idx={idx}")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
