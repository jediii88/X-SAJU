"""
핵심 전략: display:none/block 토글 완전 제거
step-2가 활성화되면 풀이가 바로 보이도록 각 섹션에 실제 풀이를 하드코딩
JS는 사주 계산 후 내용을 교체 (교체 실패해도 기본 텍스트가 보임)
"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# placeholder → 실제 설명 텍스트로 교체
replacements = [
    (
        '<div id="manse-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">사주 원국 풀이를 불러오는 중...</div></div></div>',
        '''<div id="manse-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 사주 원국 해설</div>
  <div class="ii-title">당신의 8글자 — 태어난 순간 새겨진 운명의 설계도</div>
  <div class="ii-text">
    <p>사주의 8글자는 단순한 기호가 아닙니다. 태어난 순간 우주의 기운이 당신에게 새긴 고유한 코드입니다. 연주(年柱)는 뿌리, 월주(月柱)는 줄기, 일주(日柱)는 꽃, 시주(時柱)는 열매입니다. 이 4개의 기둥이 만들어내는 조화와 충돌이 당신 인생의 큰 흐름을 결정합니다.</p>
    <p>일주(日柱)는 나 자신입니다. 일간(日干)이 당신의 본질적 기질이고, 일지(日支)가 내면 깊숙이 숨어있는 진짜 욕망입니다. 나머지 7글자는 일간을 중심으로 어떤 관계를 맺느냐에 따라 십성(十星)이 결정되고, 이것이 당신의 사회적 역할과 인간관계 패턴을 만듭니다.</p>
    <p style="color:var(--gold);font-size:13px;margin-top:12px;">▶ 분석 버튼을 누르면 당신의 사주에 맞는 개인화된 풀이가 아래에 표시됩니다.</p>
  </div>
</div>
</div>'''
    ),
    (
        '<div id="relation-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">합·충·형·파·해 풀이를 불러오는 중...</div></div></div>',
        '''<div id="relation-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 합·충·형·파·해 해석</div>
  <div class="ii-title">원국의 충돌과 결합 — 반복되는 인생 패턴의 원형</div>
  <div class="ii-text">
    <p>합(合)·충(沖)·형(刑)·파(破)·해(害)는 사주 8글자 안에서 글자끼리 일으키는 화학작용입니다. 이 관계들이 당신이 살면서 반복적으로 경험하는 패턴의 원형입니다.</p>
    <p>합(合)이 있는 기운과는 인연이 쉽게 맺어지고, 충(沖)이 있는 기운과는 긴장 관계가 형성됩니다. 이것을 알면 인간관계와 중요 결정에서 한발 앞서 대응할 수 있습니다. 분석 후 당신의 원국에 실제 작용하는 관계가 표시됩니다.</p>
  </div>
</div>
</div>'''
    ),
    (
        '<div id="shinsal-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">신살 풀이를 불러오는 중...</div></div></div>',
        '''<div id="shinsal-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 신살 해석</div>
  <div class="ii-title">당신의 사주에 새겨진 특별한 별의 기운</div>
  <div class="ii-text">
    <p>신살(神殺)은 사주 8글자의 조합에서 발동하는 특수한 에너지입니다. 천을귀인·문창귀인 같은 길성(吉星)은 타고난 복력이고, 역마살·도화살 같은 동살(動殺)은 당신의 삶에 독특한 색깔을 입힙니다.</p>
    <p>중요한 것은 길성이든 흉살이든 — 그것이 당신이라는 사람을 설명하는 코드입니다. 흉살도 올바르게 활용하면 강력한 무기가 됩니다. 분석 후 당신의 신살이 표시됩니다.</p>
  </div>
</div>
</div>'''
    ),
    (
        '<div id="wuxing-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">오행 풀이를 불러오는 중...</div></div></div>',
        '''<div id="wuxing-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 오행 분석</div>
  <div class="ii-title">당신의 에너지 지도 — 절대적 무기와 아킬레스건</div>
  <div class="ii-text">
    <p>목(木)·화(火)·토(土)·금(金)·수(水) 다섯 기운의 분포가 당신의 뇌 구조, 판단 방식, 인간관계 패턴의 80%를 결정합니다. 한쪽으로 쏠린 기운이 클수록 그 에너지가 인생을 더 강렬하게 조각합니다.</p>
    <p>중화(中和)된 사주가 편안한 삶을 산다면, 편중된 사주는 한 분야에서 독보적인 존재가 됩니다. 당신의 오행 편중이 어떤 무기가 되는지 — 분석 후 상세 풀이가 나타납니다.</p>
  </div>
</div>
</div>'''
    ),
    (
        '<div id="sipseong-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">십성 풀이를 불러오는 중...</div></div></div>',
        '''<div id="sipseong-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 십성 분석</div>
  <div class="ii-title">사회적 페르소나 — 당신이 세상을 대하는 방식</div>
  <div class="ii-text">
    <p>십성(十星)은 일간을 중심으로 나머지 7글자가 맺는 관계입니다. 비견·겁재는 경쟁심과 독립심, 식신·상관은 재능과 표현욕, 정재·편재는 재물관, 정관·편관은 권력욕, 정인·편인은 학습욕과 직관력입니다.</p>
    <p>어떤 십성이 강하냐에 따라 당신이 돈을 버는 방식, 사람을 이끄는 방식, 사랑에 빠지는 방식이 결정됩니다. 분석 후 당신의 십성 페르소나가 분석됩니다.</p>
  </div>
</div>
</div>'''
    ),
    (
        '<div id="strength-inline-summary" style="margin:0 0 8px 0;"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">신강신약 풀이를 불러오는 중...</div></div></div>',
        '''<div id="strength-inline-summary" style="margin:0 0 8px 0;">
<div class="inline-interp">
  <div class="ii-label">✦ 신강·신약 해석</div>
  <div class="ii-title">내 기운의 강약 — 인생 전략의 출발점</div>
  <div class="ii-text">
    <p>신강(身强)은 일간의 기운이 강한 사주입니다. 에너지가 넘쳐 독립적으로 판을 짜는 창업가·전문가에 어울립니다. 신약(身弱)은 일간의 기운이 분산된 사주입니다. 혼자보다 좋은 파트너·귀인과 협력할 때 폭발적 시너지를 냅니다.</p>
    <p>강약이 다를 뿐 우열이 아닙니다. 내 기운의 구조를 알고 그에 맞는 전략을 쓰는 것이 핵심입니다. 분석 후 상세 해석이 나타납니다.</p>
  </div>
</div>
</div>'''
    ),
    (
        '<div id="yong-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">용신·기신 풀이를 불러오는 중...</div></div></div>',
        '''<div id="yong-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 용신·희신·기신 해석</div>
  <div class="ii-title">나를 돕는 기운 vs 방해하는 기운</div>
  <div class="ii-text">
    <p>용신(用神)은 당신의 사주를 균형 잡아주는 가장 중요한 기운입니다. 용신의 오행이 강해지는 대운과 세운에서 인생이 크게 도약합니다. 반대로 기신(忌神)의 기운이 들어오는 시기에는 수비적 전략이 필요합니다.</p>
    <p>용신을 가진 귀인과의 만남, 용신 색상과 방위의 활용 — 이것이 개운(開運)의 핵심 원리입니다. 분석 후 당신의 용신이 확정됩니다.</p>
  </div>
</div>
</div>'''
    ),
    (
        '<div id="lifecycle-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">재물·직업·애정·건강 풀이를 불러오는 중...</div></div></div>',
        '''<div id="lifecycle-inline-summary" class="section-interp">
<div class="inline-interp">
  <div class="ii-label">✦ 평생 운세 종합 분석</div>
  <div class="ii-title">재물·직업·애정·건강 — 4대 영역 완전 해부</div>
  <div class="ii-text">
    <p><b style="color:var(--gold);">재물운</b> — 재성(財星)의 구조가 당신의 돈 버는 방식을 결정합니다. 무재(無財) 사주라도 걱정 없습니다. 역사적으로 무재 사주에서 큰 부자가 많이 나왔습니다. 돈을 직접 쫓지 말고 당신만의 가치를 높이십시오.</p>
    <p><b style="color:var(--gold);">직업운</b> — 식상(食傷)·관성(官星)·인성(印星)의 조합이 최적의 직업 유형을 알려줍니다. 당신이 빛나는 무대가 어디인지 분석합니다.</p>
    <p><b style="color:var(--gold);">애정운</b> — 일지(日支)와 재성·관성의 배치가 연애 스타일과 배우자 인연의 패턴을 만듭니다.</p>
    <p><b style="color:var(--gold);">건강운</b> — 오행의 태과(太過)와 고립이 5장 6부의 취약점으로 연결됩니다. 분석 후 상세 개인화 풀이가 나타납니다.</p>
  </div>
</div>
</div>'''
    ),
]

changed = 0
for old, new in replacements:
    if old in html:
        html = html.replace(old, new, 1)
        changed += 1
        print(f"✅ 교체 성공 ({changed})")
    else:
        # 부분 매칭으로 찾기
        key = old[:60]
        if key in html:
            print(f"⚠️ 부분 매칭: {key[:40]}")
        else:
            print(f"❌ 불일치: {old[:60]}")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"\n저장 | {len(html):,} bytes | {changed}개 교체")
