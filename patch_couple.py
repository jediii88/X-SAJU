#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/sajux_deploy/couple/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ─── 1. 탭 CSS → 제거, 모든 패널 항상 표시 ───
OLD_TAB_CSS = """.rel-tabs { display: flex; overflow-x: auto; gap: 0; margin: 24px 0 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
.rel-tabs::-webkit-scrollbar { display: none; }
.rel-tab {"""

NEW_TAB_CSS = """.rel-tabs { display: none; }
.rel-tab {"""

c1 = content.count(OLD_TAB_CSS)
print(f"탭 CSS: {c1}")
if c1: content = content.replace(OLD_TAB_CSS, NEW_TAB_CSS)

# rel-panel active/inactive → 항상 표시
OLD_PANEL_CSS = """.rel-panel { display: none; }
.rel-panel.active { display: block; }"""
NEW_PANEL_CSS = """.rel-panel { display: block; margin-bottom: 8px; }"""
c2 = content.count(OLD_PANEL_CSS)
print(f"패널 CSS: {c2}")
if c2: content = content.replace(OLD_PANEL_CSS, NEW_PANEL_CSS)

# ─── 2. 탭 버튼 HTML → 섹션 타이틀로 교체 ───
OLD_TAB_HTML = """    <div class="rel-tabs">
      <button class="rel-tab active" onclick="switchTab('lover',this)">💕 연인</button>
      <button class="rel-tab" onclick="switchTab('married',this)">💍 부부</button>
      <button class="rel-tab" onclick="switchTab('friend',this)">🤝 친구</button>
      <button class="rel-tab" onclick="switchTab('business',this)">💼 비즈니스</button>
    </div>

    <div id="panel-lover"    class="rel-panel active"></div>
    <div id="panel-married"  class="rel-panel"></div>
    <div id="panel-friend"   class="rel-panel"></div>
    <div id="panel-business" class="rel-panel"></div>"""

NEW_TAB_HTML = """    <div id="section-lover">
      <div style="font-size:14px;font-weight:700;color:var(--gold);margin:24px 0 12px;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.2);">💕 연인으로서의 궁합</div>
      <div id="panel-lover" class="rel-panel"></div>
    </div>
    <div id="section-married">
      <div style="font-size:14px;font-weight:700;color:var(--gold);margin:24px 0 12px;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.2);">💍 부부로서의 궁합</div>
      <div id="panel-married" class="rel-panel"></div>
    </div>
    <div id="section-friend">
      <div style="font-size:14px;font-weight:700;color:var(--gold);margin:24px 0 12px;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.2);">🤝 친구로서의 궁합</div>
      <div id="panel-friend" class="rel-panel"></div>
    </div>
    <div id="section-business">
      <div style="font-size:14px;font-weight:700;color:var(--gold);margin:24px 0 12px;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.2);">💼 비즈니스 파트너로서의 궁합</div>
      <div id="panel-business" class="rel-panel"></div>
    </div>
    <div id="section-spouse">
      <div style="font-size:14px;font-weight:700;color:var(--gold);margin:24px 0 12px;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.2);">💎 배우자궁 분석 — 두 사람이 끌어당기는 이성</div>
      <div id="panel-spouse" class="rel-panel"></div>
    </div>"""

c3 = content.count(OLD_TAB_HTML)
print(f"탭 HTML: {c3}")
if c3: content = content.replace(OLD_TAB_HTML, NEW_TAB_HTML)

# ─── 3. panel-business 렌더 직후 배우자궁 분석 삽입 ───
OLD_BIZ_END = "  document.getElementById('panel-business').innerHTML = bizInsights.join('');"
NEW_BIZ_END = """  document.getElementById('panel-business').innerHTML = bizInsights.join('');

  // ── 배우자궁 분석 ──
  const ILJI_SPOUSE = {
    '子':'차분하고 지적인 인상. 눈빛이 깊고 생각이 많아 보입니다. 감성적이고 섬세하며 혼자만의 시간을 소중히 여기는 사람입니다. 겉으로는 조용해 보이지만 속마음이 풍부하고 관찰력이 뛰어납니다.',
    '丑':'믿음직하고 성실한 인상. 화려하지 않지만 존재감이 있습니다. 묵묵히 옆을 지켜주는 타입으로, 신뢰감이 강하고 현실적입니다. 인내심이 강하고 책임감 있는 파트너를 끌어당깁니다.',
    '寅':'활기차고 당당한 인상. 눈이 크고 에너지가 넘쳐 보입니다. 도전적이고 모험을 즐기며 리더십이 있는 사람입니다. 당신을 이끌어주거나 함께 새로운 것을 만들어가는 파트너에게 끌립니다.',
    '卯':'부드럽고 친근한 인상. 미소가 아름답고 사람을 편안하게 합니다. 예술적 감각이 있고 배려심이 깊습니다. 관계를 소중히 여기며 따뜻한 가정을 만드는 것을 중요하게 여기는 사람입니다.',
    '辰':'카리스마 있고 강인한 인상. 첫 눈에 특별해 보이는 존재감이 있습니다. 능력 있고 야망이 크며 변화를 두려워하지 않는 사람에게 끌립니다. 예측 불가능한 매력이 있습니다.',
    '巳':'세련되고 신비로운 인상. 말이 없어도 존재감이 강합니다. 집중력과 전문성이 뛰어나며, 한번 마음을 정하면 흔들리지 않는 파트너를 원합니다. 깊이 있는 내면을 가진 사람에게 끌립니다.',
    '午':'화려하고 활발한 인상. 한 공간에 있으면 눈에 띄는 사람입니다. 열정적이고 표현력이 풍부하며 사람을 즐겁게 하는 능력이 있습니다. 당신의 삶에 활기를 불어넣어 주는 파트너를 끌어당깁니다.',
    '未':'따뜻하고 예술적인 인상. 외모가 단정하고 감성이 풍부합니다. 창의적이고 사람에 대한 이해가 깊습니다. 삶을 풍요롭게 만드는 것을 중요하게 여기는 파트너에게 끌립니다.',
    '申':'날카롭고 세련된 인상. 빠르고 명석해 보입니다. 실용적이고 결단력이 있으며 문제 해결 능력이 뛰어난 사람에게 끌립니다. 함께 있으면 일이 잘 풀리는 기운의 파트너를 원합니다.',
    '酉':'단정하고 우아한 인상. 세심하고 완벽을 추구합니다. 전문성과 고집이 있으며 자신만의 스타일이 확고한 사람에게 끌립니다. 겉으로는 조용하지만 내면에 강한 의지를 품고 있는 파트너를 원합니다.',
    '戌':'진지하고 믿음직한 인상. 의리가 있고 솔직합니다. 의지가 강하고 신념이 뚜렷하며 한번 마음을 준 사람에게 충실한 파트너를 원합니다. 함께 있으면 든든한 버팀목이 되어주는 사람에게 끌립니다.',
    '亥':'자유롭고 깊이 있는 인상. 틀에 박히지 않은 매력이 있습니다. 상상력이 풍부하고 직관이 뛰어나며 자신만의 세계가 있는 사람에게 끌립니다. 영적이거나 철학적인 깊이를 가진 파트너를 원합니다.'
  };

  const aSpouse = ILJI_SPOUSE[aDB] || '배우자궁 정보를 분석 중입니다.';
  const bSpouse = ILJI_SPOUSE[bDB] || '배우자궁 정보를 분석 중입니다.';

  const spouseHtml = [
    `<div class="insight-card" style="border-left:3px solid var(--gold);">
      <div class="tag">💛 ${aName}님이 끌어당기는 이성</div><br>
      <strong>일지(배우자궁): ${aDB}(${HAN_KOR[aDB]||aDB})</strong><br><br>
      ${aSpouse}
      <br><br><span style="font-size:11px;color:#777;">※ 배우자궁은 내가 무의식적으로 끌리는 이성의 특징을 나타냅니다.</span>
    </div>`,
    `<div class="insight-card" style="border-left:3px solid var(--purple);">
      <div class="tag" style="background:rgba(124,141,255,0.15);color:var(--purple);">💜 ${bName}님이 끌어당기는 이성</div><br>
      <strong>일지(배우자궁): ${bDB}(${HAN_KOR[bDB]||bDB})</strong><br><br>
      ${bSpouse}
      <br><br><span style="font-size:11px;color:#777;">※ 배우자궁은 내가 무의식적으로 끌리는 이성의 특징을 나타냅니다.</span>
    </div>`,
    `<div class="insight-card">
      <div class="tag">🔄 두 사람이 서로에게 끌리는 이유</div><br>
      ${isHap ? `<strong>${aName}(${aDB})·${bName}(${bDB})</strong> — 배우자궁이 합(合)을 이룹니다. 두 사람은 서로가 원하는 이상형에 가까운 특징을 갖고 있습니다. 처음 만날 때부터 '이 사람이다'는 느낌이 강하게 올 수 있습니다.` :
      isChung ? `<strong>${aName}(${aDB})·${bName}(${bDB})</strong> — 배우자궁이 충(冲)을 이룹니다. 서로 다른 에너지가 강하게 충돌하여 강렬한 끌림이 생깁니다. '다르기 때문에 끌리는' 관계입니다.` :
      `두 사람의 배우자궁이 직접적 합충은 없지만, 오행 보완을 통해 서로에게 필요한 에너지를 채워주는 관계입니다.`}
    </div>`
  ];
  document.getElementById('panel-spouse').innerHTML = spouseHtml.join('');"""

c4 = content.count(OLD_BIZ_END)
print(f"배우자궁 삽입: {c4}")
if c4: content = content.replace(OLD_BIZ_END, NEW_BIZ_END)

# ─── 4. switchTab 함수 제거 (더 이상 필요없음) ───
OLD_SWITCH = """function switchTab(rel, btn) {
  document.querySelectorAll('.rel-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.rel-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-'+rel).classList.add('active');
}"""
NEW_SWITCH = "// switchTab removed — all panels shown"
c5 = content.count(OLD_SWITCH)
print(f"switchTab 제거: {c5}")
if c5: content = content.replace(OLD_SWITCH, NEW_SWITCH)

with open('/home/node/.openclaw/workspace/sajux_deploy/couple/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ 모든 패치 완료")
