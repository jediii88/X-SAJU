with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. report-container에 기본 풀이 텍스트 삽입
old_rc = '''id="report-container" style="padding:0; border-radius:0; background:transparent; border:none; box-shadow:none;">
                <!-- 리포트 내용 동적 렌더링 -->
            </div>'''

new_rc = '''id="report-container" style="padding:0; border-radius:0; background:transparent; border:none; box-shadow:none;">
<div class="report-chapter">
  <h3 class="ch-title">성격 분석 — 당신이라는 사람</h3>
  <p class="ch-text">사주에서 성격은 선천적으로 새겨진 코드입니다. 일간(日干)의 오행이 당신의 기본 기질을 만들고, 신강·신약의 구조가 에너지를 어떻게 쓰느냐를 결정합니다. 이 코드를 정확히 아는 사람과 모르는 사람 사이에는, 같은 상황에서도 전혀 다른 결과가 나옵니다.</p>
  <p class="ch-text">당신의 강점은 태어날 때부터 새겨진 무기입니다. 이를 제대로 활용하는 것이 성공의 첫 번째 열쇠이며, 약점을 알고 보완하는 것이 두 번째 열쇠입니다. 분석 완료 후 당신의 일주에 맞는 개인화 성격 분석이 여기에 표시됩니다.</p>
</div>
<div class="report-chapter">
  <h3 class="ch-title">오행 분석 — 절대적 무기와 아킬레스건</h3>
  <p class="ch-text">당신의 사주 8글자에서 목(木)·화(火)·토(土)·금(金)·수(水) 다섯 기운이 어떻게 분포되어 있느냐가 인생의 큰 흐름을 결정합니다. 한쪽으로 강하게 쏠린 기운이 당신의 절대적 무기이자 아킬레스건입니다.</p>
  <p class="ch-text">한 시대를 풍미한 인물들의 사주를 보면 오행이 중화(中和)된 경우보다 극단적으로 편중된 경우가 훨씬 많습니다. 편중된 에너지를 억누르는 것이 아니라, 그것을 가장 잘 활용할 수 있는 분야와 방식을 찾는 것이 핵심입니다. 분석 후 당신의 오행 분포와 상세 전략이 표시됩니다.</p>
</div>
<div class="report-chapter">
  <h3 class="ch-title">재물운 — 당신만의 금고를 여는 열쇠</h3>
  <p class="ch-text">명리학에서 재성(財星)은 단순히 통장 잔고가 아닙니다. 내가 세상을 통제하고 다루는 힘, 내 영향력이 미치는 영토의 크기입니다. 사주에서 재물을 바라보는 방식은 사람마다 완전히 다릅니다. 어떤 사람은 돈을 직접 쫓아야 하고, 어떤 사람은 가치를 높이면 돈이 저절로 따라옵니다.</p>
  <p class="ch-text">재성이 없는 무재(無財) 사주라도 걱정할 필요가 없습니다. 역사적으로 가장 큰 부를 이룬 사람들 중 무재 사주가 많습니다. 재성이 없으면 돈이 나를 따르는 구조가 아닌, 내 가치와 명성이 부를 끌어당기는 구조이기 때문입니다. 분석 후 당신만의 재물 전략이 표시됩니다.</p>
</div>
<div class="report-chapter">
  <h3 class="ch-title">대운 80년 — 인생의 계절 변화</h3>
  <p class="ch-text">대운(大運)은 10년마다 바뀌는 인생의 기후입니다. 봄이 오면 씨를 뿌리고, 여름이 오면 성장에 투자하고, 가을이 오면 수확하고, 겨울이 오면 내공을 다져야 합니다. 지금 어떤 계절인지 모른 채 살면, 겨울에 씨를 뿌리는 어리석음을 반복하게 됩니다.</p>
  <p class="ch-text">용신(用神) 기운의 대운에서는 공격적으로 확장하고, 기신(忌神) 기운의 대운에서는 수비하며 내공을 쌓아야 합니다. 당신의 현재 대운이 어느 계절인지, 다음 대운은 무엇을 준비해야 하는지 — 분석 후 80년 전체 흐름이 표시됩니다.</p>
</div>
<div class="report-chapter">
  <h3 class="ch-title">세운 10년 — 해마다 바뀌는 날씨</h3>
  <p class="ch-text">세운(歲運)은 그해의 날씨입니다. 같은 사람이라도 어떤 해에는 모든 것이 잘 풀리고, 어떤 해에는 버티는 것만으로도 벅찹니다. 이것은 운이 좋고 나쁜 것이 아니라, 그해의 기운과 당신의 원국이 어떻게 만나느냐의 문제입니다.</p>
  <p class="ch-text">용신 기운이 강한 해에는 중요한 결정과 행동을 집중하고, 기신 기운의 해에는 무리하게 확장하기보다 수비와 내공 축적에 집중해야 합니다. 올해부터 향후 10년간 어떤 해에 무엇을 해야 하는지 — 분석 후 연도별 전략이 표시됩니다.</p>
</div>
<div class="report-chapter">
  <h3 class="ch-title">월운 12개월 — 이달의 기운 파동</h3>
  <p class="ch-text">세운이 한 해의 날씨라면 월운(月運)은 그 안의 시간별 기상입니다. 같은 해 안에서도 어떤 달에는 기회가 쏟아지고, 어떤 달에는 예상치 못한 방해가 생깁니다. 중요한 계약, 첫 만남, 사업 시작의 타이밍을 잡을 때 월운을 아는 것이 결정적 우위가 됩니다.</p>
  <p class="ch-text">분석 후 올해 12개월의 기운 파동과 월별 전략이 표시됩니다. 언제 액셀을 밟고 언제 브레이크를 밟아야 하는지 — 달력처럼 활용하실 수 있습니다.</p>
</div>
            </div>'''

if old_rc in html:
    html = html.replace(old_rc, new_rc)
    print("report-container 기본 텍스트 삽입 성공")
else:
    print("패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 | {len(html):,} bytes")
