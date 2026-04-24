#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/sajux_deploy/couple/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ─── buildRelPanels 전체 교체 ───
OLD = """// ══════════════════════════════════════
// 관계 유형별 패널
// ══════════════════════════════════════
function buildRelPanels(params, a, b, result) {
  const aName = params.a.name, bName = params.b.name;
  const isHap = result.isHap, isChung = result.isChung;
  const shengAB = result.shengAB, shengBA = result.shengBA;
  const aDB = a.dayBranch, bDB = b.dayBranch;
  const aOh = result.aOh, bOh = result.bOh;

  const aDohwa = DOHWA[a.yearBranch] === a.dayBranch || DOHWA[a.dayBranch] === a.dayBranch;
  const bDohwa = DOHWA[b.yearBranch] === b.dayBranch || DOHWA[b.dayBranch] === b.dayBranch;"""

NEW = """// ══════════════════════════════════════
// 타고난 성격 DB
// ══════════════════════════════════════
const STEM_CHAR = {
  '甲':'선구자 타입입니다. 처음 보는 길도 두려워하지 않고 나아가는 개척자 기질이 있습니다. 한번 목표를 잡으면 흔들리지 않는 의지력이 있으나, 융통성이 부족해 고집스럽다는 인상을 줄 수 있습니다. 첫 인상보다 사귀어볼수록 따뜻한 사람입니다.',
  '乙':'분위기 읽는 능력이 탁월합니다. 상황에 따라 유연하게 적응하며, 주변을 편안하게 만드는 재주가 있습니다. 직접 부딪히기보다 관계 속에서 목표를 이루는 타입입니다. 겉은 부드럽지만 속에 뚜렷한 기준이 있습니다.',
  '丙':'에너지가 넘치고 어디서든 존재감이 있습니다. 솔직하고 표현이 직접적이라 오해를 사기도 하지만, 뒤끝이 없고 밝습니다. 사람을 끌어모으는 열정과 따뜻함이 강점입니다. 가끔 너무 앞서나가서 주변이 따라오지 못할 때가 있습니다.',
  '丁':'예민하고 세심합니다. 표면에 드러나지 않는 것들을 잘 포착하며, 한번 마음을 주면 깊이 헌신합니다. 감정 기복이 있을 수 있으나 그만큼 공감 능력이 뛰어납니다. 내면에 강한 신념과 원칙이 있습니다.',
  '戊':'믿음직하고 중심이 있습니다. 쉽게 흔들리지 않고 주변 사람들에게 안정감을 줍니다. 결정이 느릴 수 있으나 한번 결정하면 끝까지 밀어붙입니다. 조용히 기다릴 줄 알고, 관계에서 묵묵한 충실함이 강점입니다.',
  '己':'실용적이고 현실적입니다. 겉으로 드러나기보다는 내실을 다지는 타입으로, 눈에 보이는 성과를 중시합니다. 꼼꼼하고 계획적이며, 신뢰를 쌓는 데 시간이 걸리지만 한번 쌓인 관계는 오래갑니다.',
  '庚':'직선적이고 결단력이 있습니다. 불필요한 것을 쳐내는 능력이 있어, 복잡한 상황을 빠르게 정리합니다. 솔직해서 상처를 줄 수 있지만 뒤로 다른 말을 하지 않습니다. 강인함 뒤에 섬세한 면이 있습니다.',
  '辛':'완벽주의 성향이 있습니다. 높은 기준을 가지고 있으며, 자신과 타인 모두에게 철저합니다. 날카로운 통찰력이 있고, 언어 표현이 정교합니다. 관계에서 깊은 이해를 원하며 피상적인 관계를 싫어합니다.',
  '壬':'자유롭고 창의적입니다. 틀에 박힌 것을 답답해하고 새로운 시도를 즐깁니다. 직관이 뛰어나고 아이디어가 풍부합니다. 변화에 빠르게 적응하지만 한 곳에 오래 머무르는 것을 힘들어할 수 있습니다.',
  '癸':'깊이 있고 감성적입니다. 보이지 않는 것들을 감지하는 직관력이 있으며, 상상력과 공감 능력이 뛰어납니다. 내면 세계가 풍부하고 예술적 감수성이 있습니다. 관계에서 정서적 깊이를 중요하게 여깁니다.'
};

const BRANCH_CHAR = {
  '子':'분석적이고 관찰력이 뛰어납니다. 표면 아래의 진짜 이야기를 읽어내는 능력이 있습니다.',
  '丑':'인내력이 강합니다. 천천히 쌓아가는 것의 힘을 알며, 흔들리지 않는 묵묵함이 있습니다.',
  '寅':'도전과 행동을 좋아합니다. 새로운 것에 뛰어들고 주도적으로 움직이는 타입입니다.',
  '卯':'따뜻하고 사교적입니다. 사람과의 연결을 중시하고 관계 속에서 에너지를 얻습니다.',
  '辰':'변화무쌍하고 다재다능합니다. 예측하기 어렵지만 그만큼 다양한 가능성을 품고 있습니다.',
  '巳':'깊이 생각하고 전략적입니다. 말보다 행동이 앞서고, 집중력이 뛰어납니다.',
  '午':'표현력이 풍부하고 열정적입니다. 감정을 솔직하게 드러내며 주변에 활기를 불어넣습니다.',
  '未':'예술적 감수성이 있습니다. 아름다움을 추구하며 관계에 섬세한 배려를 더합니다.',
  '申':'두뇌 회전이 빠르고 판단이 정확합니다. 효율을 중시하며 문제를 빠르게 해결합니다.',
  '酉':'완성도를 추구합니다. 한 번 시작한 일을 끝까지 마무리하는 집중력이 있습니다.',
  '戌':'신의가 있습니다. 한번 믿기로 한 사람에게는 끝까지 곁을 지키는 의리파입니다.',
  '亥':'자유로운 영혼입니다. 넓은 시야와 철학적 사고방식으로 삶의 본질을 탐구합니다.'
};

// 나이 기준 대운 인덱스 찾기
function getDaewunAtAge(allDaYun, age) {
  for (let i = 0; i < allDaYun.length; i++) {
    const start = allDaYun[i].getStartAge ? allDaYun[i].getStartAge() : (i * 10 + 5);
    const next  = i + 1 < allDaYun.length ? (allDaYun[i+1].getStartAge ? allDaYun[i+1].getStartAge() : start+10) : 999;
    if (age >= start && age < next) return { dy: allDaYun[i], start, end: next };
  }
  return null;
}

// 이름 + 성별 표기 헬퍼
function nameTag(name, gender) {
  return name ? `<strong>${name}</strong>` : (gender==='male' ? '<strong>남성</strong>' : '<strong>여성</strong>');
}

// ══════════════════════════════════════
// 관계 유형별 패널
// ══════════════════════════════════════
function buildRelPanels(params, a, b, result) {
  const aName = params.a.name || (params.a.gender==='male'?'남성':'여성');
  const bName = params.b.name || (params.b.gender==='male'?'남성':'여성');
  const isHap = result.isHap, isChung = result.isChung;
  const shengAB = result.shengAB, shengBA = result.shengBA;
  const aDB = a.dayBranch, bDB = b.dayBranch;
  const aOh = result.aOh, bOh = result.bOh;
  const aYear = params.a.year, bYear = params.b.year;

  const aDohwa = DOHWA[a.yearBranch] === a.dayBranch || DOHWA[a.dayBranch] === a.dayBranch;
  const bDohwa = DOHWA[b.yearBranch] === b.dayBranch || DOHWA[b.dayBranch] === b.dayBranch;

  // ── 타고난 성격 패널 먼저 렌더 ──
  const aChar = (STEM_CHAR[a.dayStem]||'') + ' ' + (BRANCH_CHAR[aDB]||'');
  const bChar = (STEM_CHAR[b.dayStem]||'') + ' ' + (BRANCH_CHAR[bDB]||'');

  const charHtml = [
    `<div class="insight-card" style="border-left:3px solid var(--gold);">
      <div class="tag">💛 ${aName}님 — 타고난 성격과 기질</div><br>
      <span style="font-size:12px;color:#888;">일주: ${a.dayStem}${aDB} · ${a.strength}</span><br><br>
      ${aChar}
      <br><br>
      <span style="font-size:12px;color:#aaa;">
      ▸ <strong>강점:</strong> ${a.strength==='신강' ? '추진력과 주도성. 한번 결심하면 흔들리지 않습니다.' : '적응력과 수용력. 상황을 읽고 유연하게 움직입니다.'}<br>
      ▸ <strong>조심할 것:</strong> ${a.strength==='신강' ? '고집이 세져 타인의 의견을 무시하거나, 에너지를 분산시키는 과욕.' : '우유부단하거나 타인의 말에 너무 영향을 받을 수 있습니다.'}
      </span>
    </div>`,
    `<div class="insight-card" style="border-left:3px solid var(--purple);">
      <div class="tag" style="background:rgba(124,141,255,0.15);color:var(--purple);">💜 ${bName}님 — 타고난 성격과 기질</div><br>
      <span style="font-size:12px;color:#888;">일주: ${b.dayStem}${bDB} · ${b.strength}</span><br><br>
      ${bChar}
      <br><br>
      <span style="font-size:12px;color:#aaa;">
      ▸ <strong>강점:</strong> ${b.strength==='신강' ? '추진력과 주도성. 한번 결심하면 흔들리지 않습니다.' : '적응력과 수용력. 상황을 읽고 유연하게 움직입니다.'}<br>
      ▸ <strong>조심할 것:</strong> ${b.strength==='신강' ? '고집이 세져 타인의 의견을 무시하거나, 에너지를 분산시키는 과욕.' : '우유부단하거나 타인의 말에 너무 영향을 받을 수 있습니다.'}
      </span>
    </div>`,
    `<div class="insight-card">
      <div class="tag">🔀 두 사람의 성격 조합</div><br>
      ${a.strength===b.strength && a.strength==='신강' ?
        `두 사람 모두 주도적이고 강한 기운을 가지고 있습니다. 함께 있으면 에너지가 넘치지만, 서로 자기 방식을 고집하면 충돌이 생깁니다. 한 사람이 "오늘은 내가 따를게"라는 유연함을 발휘하는 것이 이 관계의 핵심 기술입니다.` :
      a.strength===b.strength && a.strength==='신약' ?
        `두 사람 모두 섬세하고 공감력이 뛰어납니다. 서로를 잘 이해하지만 결정적인 순간에 둘 다 망설이는 상황이 생길 수 있습니다. 함께 "우리가 원하는 것은 무엇인가"를 명확히 정하는 것이 중요합니다.` :
        `${a.strength==='신강'?aName:bName}님의 주도력과 ${a.strength==='신약'?aName:bName}님의 유연함이 이상적으로 맞물립니다. 한 사람이 앞에서 이끌고 한 사람이 세밀하게 조율하는 구조로, 이 궁합의 가장 큰 강점입니다.`
      }
    </div>`
  ];
  document.getElementById('panel-personality').innerHTML = charHtml.join('');"""

c1 = content.count(OLD)
print(f"buildRelPanels 앞부분: {c1}")
if c1:
    content = content.replace(OLD, NEW)

# ─── 자녀운 "용신 오행이 강한 대운" → 구체적 나이 명시 ───
OLD_CHILD = """    두 사람의 오행 균형으로 볼 때 자녀는 ${result.score>=65 ? '비교적 순탄한' : '노력이 필요한'} 인연입니다.
    용신 오행이 강한 대운 시기가 자녀 인연의 최적 구간입니다."""

NEW_CHILD = """    두 사람의 오행 균형으로 볼 때 자녀는 ${result.score>=65 ? '비교적 순탄한' : '노력이 필요한'} 인연입니다.
    ${(()=>{
      // A 기준 목화 기운이 강한 대운 나이 찾기
      const childAges = [];
      for(let i=0;i<a.allDaYun.length;i++){
        const dy=a.allDaYun[i];
        const sa=dy.getStartAge?dy.getStartAge():(i*10+5);
        const gz=dy.getGanZhi?dy.getGanZhi():['甲','子'];
        const oh=STEM_OH[gz[0]]||'earth';
        if(oh==='wood'||oh==='fire') childAges.push(sa+'세~'+(sa+9)+'세');
        if(childAges.length>=2) break;
      }
      return childAges.length>0 ? '특히 <strong>'+aName+'님의 '+childAges.join(', ')+'</strong> 구간이 자녀 인연이 열리기 좋은 시기입니다.' : '두 사람의 목화 에너지 대운이 겹치는 구간을 자녀 계획의 최적 시기로 보십시오.';
    })()}"""

c2 = content.count(OLD_CHILD)
print(f"자녀운 수정: {c2}")
if c2:
    content = content.replace(OLD_CHILD, NEW_CHILD)

# ─── HTML에 panel-personality 삽입 (section-lover 앞에) ───
OLD_HTML_SEC = """    <div id="section-lover">
      <div style="font-size:14px;font-weight:700;color:var(--gold);margin:24px 0 12px;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.2);">💕 연인으로서의 궁합</div>"""

NEW_HTML_SEC = """    <div id="section-personality">
      <div style="font-size:14px;font-weight:700;color:var(--gold);margin:24px 0 12px;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.2);">🌟 두 사람의 타고난 성격과 기질</div>
      <div id="panel-personality" class="rel-panel"></div>
    </div>
    <div id="section-lover">
      <div style="font-size:14px;font-weight:700;color:var(--gold);margin:24px 0 12px;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.2);">💕 연인으로서의 궁합</div>"""

c3 = content.count(OLD_HTML_SEC)
print(f"성격 패널 HTML 삽입: {c3}")
if c3:
    content = content.replace(OLD_HTML_SEC, NEW_HTML_SEC)

with open('/home/node/.openclaw/workspace/sajux_deploy/couple/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ 패치2 완료")
