#!/usr/bin/env python3
# Appends the remaining JS to couple/index.html

rest = r"""
  // 4. 삼합 +15
  let samhapScore = 0;
  SAMHAP.forEach(group => {
    if (group.includes(aDB) && group.includes(bDB)) {
      samhapScore = 15;
    }
  });
  score += samhapScore;
  if (samhapScore > 0) {
    breakdown.push({ label:'삼합(三合)', value:'+15', cls:'plus',
      desc:`${aDB}·${bDB} — 같은 삼합 그룹. 목표와 방향이 일치합니다.` });
  } else {
    breakdown.push({ label:'삼합 관계', value:'+0', cls:'neutral',
      desc:'삼합 관계 없음. 각자의 방향을 조율하는 과정이 필요합니다.' });
  }

  // 5. 신강/신약 상보 +15
  const aStrong = a.strength === '신강';
  const bStrong = b.strength === '신강';
  let ssScore = 0;
  if (aStrong !== bStrong) {
    ssScore = 15;
    breakdown.push({ label:'신강/신약 상보', value:'+15', cls:'plus',
      desc:`${a.strength}·${b.strength} — 한쪽이 이끌고 한쪽이 조율하는 최적 조합.` });
  } else if (aStrong && bStrong) {
    ssScore = -5;
    breakdown.push({ label:'신강 충돌', value:'−5', cls:'minus',
      desc:'두 사람 모두 강한 기운. 주도권 갈등 주의.' });
  } else {
    ssScore = 5;
    breakdown.push({ label:'신약 동반', value:'+5', cls:'neutral',
      desc:'두 사람 모두 유연한 에너지. 서로의 귀인을 공유하면 시너지.' });
  }
  score += ssScore;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let grade, sub;
  if      (score >= 90) { grade='천생연분 ✨'; sub='강력한 사주 에너지 공명. 만남 자체가 운명입니다.'; }
  else if (score >= 75) { grade='깊은 인연 💫'; sub='서로를 성장시키는 강한 유대. 함께할수록 빛납니다.'; }
  else if (score >= 60) { grade='좋은 궁합 ⭐'; sub='균형 잡힌 에너지. 노력과 이해로 더욱 깊어집니다.'; }
  else if (score >= 45) { grade='보통 궁합 🌙'; sub='특별한 합충 없이 무난합니다. 공통 목표가 중요합니다.'; }
  else if (score >= 30) { grade='도전 궁합 ⚡'; sub='마찰이 있으나 극복하면 단단해집니다.'; }
  else                  { grade='어려운 인연 🔥'; sub='강한 에너지 충돌. 상호 이해와 배려가 핵심입니다.'; }

  const ringColor = score >= 75 ? '#c7a76a' : score >= 55 ? '#7c8dff' : score >= 40 ? '#c9a24c' : '#d45a52';
  return { score, grade, sub, breakdown, ringColor, isHap, isChung, samhapScore, ssScore, aOh, bOh, shengAB, shengBA };
}

// ══════════════════════════════════════
// UI 렌더링
// ══════════════════════════════════════
function renderPersonCard(prefix, info, saju) {
  const nameEl    = document.getElementById(prefix + '-name');
  const iljuEl    = document.getElementById(prefix + '-ilju');
  const metaEl    = document.getElementById(prefix + '-meta');
  const pillarsEl = document.getElementById(prefix + '-pillars');
  const ohaengEl  = document.getElementById(prefix + '-ohaeng');

  nameEl.textContent = info.name;
  const ds = saju.dayStem, db = saju.dayBranch;
  iljuEl.innerHTML = `<span class="${HAN_COLOR[ds]}">${ds}</span><span class="${HAN_COLOR[db]}">${db}</span> <span style="font-size:13px;color:var(--text-dim);">${HAN_KOR[ds]}${HAN_KOR[db]}</span>`;
  metaEl.innerHTML  = `${saju.solarYear}년생 · ${info.gender==='male'?'남':'여'} · ${saju.strength}`;

  const order  = [3,2,1,0];
  const labels = ['년','월','일','시'];
  pillarsEl.innerHTML = order.map((i,li) => {
    const p = saju.pillars[i];
    return `<div class="pillar-chip">
      <div class="pn">${labels[li]}</div>
      <div class="pg ${HAN_COLOR[p.h[0]]}">${p.h[0]}</div>
      <div class="pj ${HAN_COLOR[p.h[1]]}">${p.h[1]}</div>
    </div>`;
  }).join('');

  const ohKeys = [{k:'wood',l:'목'},{k:'fire',l:'화'},{k:'earth',l:'토'},{k:'metal',l:'금'},{k:'water',l:'수'}];
  ohaengEl.innerHTML = ohKeys.map(o => {
    const v = saju.counts[o.k] || 0;
    const pct = Math.round(v / saju.totalW * 100) || 0;
    return `<div class="ohaeng-row">
      <span class="ol ${o.k}">${o.l}</span>
      <div class="ot"><div class="of bg-${o.k}" style="width:${pct}%;"></div></div>
      <span class="ov">${v}</span>
    </div>`;
  }).join('');
}

function renderScore(result) {
  document.getElementById('score-num').textContent   = result.score;
  document.getElementById('score-grade').textContent = result.grade;
  document.getElementById('score-sub').textContent   = result.sub;

  const ring = document.getElementById('score-ring');
  ring.style.stroke = result.ringColor;
  setTimeout(() => {
    ring.style.strokeDashoffset = 408 - (408 * result.score / 100);
  }, 100);

  document.getElementById('breakdown-grid').innerHTML = result.breakdown.map(b =>
    `<div class="bk-item">
      <div class="bk-label">${b.label}</div>
      <div class="bk-value ${b.cls}">${b.value}</div>
      <div class="bk-desc">${b.desc}</div>
    </div>`
  ).join('');
}

// ══════════════════════════════════════
// 관계 유형별 패널
// ══════════════════════════════════════
function buildRelPanels(params, a, b, result) {
  const aName = params.a.name, bName = params.b.name;
  const isHap = result.isHap, isChung = result.isChung;
  const shengAB = result.shengAB, shengBA = result.shengBA;
  const aDB = a.dayBranch, bDB = b.dayBranch;
  const aOh = result.aOh, bOh = result.bOh;

  const aDohwa = DOHWA[a.yearBranch] === a.dayBranch || DOHWA[a.dayBranch] === a.dayBranch;
  const bDohwa = DOHWA[b.yearBranch] === b.dayBranch || DOHWA[b.dayBranch] === b.dayBranch;

  // ── 연인 ──
  const loverBadges = [];
  if (aDohwa) loverBadges.push(`<span class="sp-badge g">🌸 ${aName} 도화살</span>`);
  if (bDohwa) loverBadges.push(`<span class="sp-badge g">🌸 ${bName} 도화살</span>`);
  if (!aDohwa && !bDohwa) loverBadges.push(`<span class="sp-badge n">도화살 없음</span>`);
  if (isHap)   loverBadges.push(`<span class="sp-badge g">💞 일지 합 — 강한 끌림</span>`);
  if (isChung) loverBadges.push(`<span class="sp-badge r">⚡ 일지 충 — 마찰 주의</span>`);

  const loverInsights = [];
  loverInsights.push(`<div class="insight-card">
    <div class="tag">💕 애정 싱크</div><br>
    <strong>${aName}(${a.dayStem})과 ${bName}(${b.dayStem})</strong>의 일간 에너지 관계: ${
      shengAB ? aName+'이 '+bName+'을 자연스럽게 감싸 이끄는 구조입니다. 애정 표현에서 주도권이 뚜렷합니다.' :
      shengBA ? bName+'이 '+aName+'을 포용하고 에너지를 공급합니다. 정서적 안정과 유대감이 강합니다.' :
      aOh===bOh ? '같은 오행의 비화 관계. 이해는 쉽지만 새로운 자극이 필요합니다.' :
      '상보적 오행 관계. 서로 다른 매력으로 끌리는 구조입니다.'
    }
  </div>`);
  loverInsights.push(`<div class="insight-card">
    <div class="tag">💍 결혼 타이밍</div><br>
    ${a.strength==='신강'&&b.strength==='신약' ? '<strong>최적 조합</strong>: '+aName+'의 강한 추진력과 '+bName+'의 유연한 적응력이 결혼 후 안정적 가정을 만듭니다.' :
      a.strength==='신약'&&b.strength==='신강' ? '<strong>최적 조합</strong>: '+bName+'의 강한 추진력과 '+aName+'의 유연한 지지가 균형을 이룹니다.' :
      '두 사람의 에너지 구조가 비슷합니다. 서로의 강점을 인정하고 용신 대운이 겹치는 시기가 최적입니다.'
    } 두 사람 대운이 함께 상승하는 구간이 최적의 결혼·전환점 시기입니다.
  </div>`);
  if (isHap) loverInsights.push(`<div class="insight-card">
    <div class="tag green">✨ 일지 합 특이점</div><br>
    <strong>${aDB}·${bDB} 합</strong> — 배우자궁이 합을 이루는 것은 사주 궁합에서 가장 강력한 인연 신호입니다.
    처음 만남에서부터 편안함을 느끼며, 결혼 후에도 서로를 자연스럽게 받아들입니다.
  </div>`);
  else if (isChung) loverInsights.push(`<div class="insight-card">
    <div class="tag red">⚡ 일지 충 주의</div><br>
    <strong>${aDB}·${bDB} 충</strong> — 배우자궁의 충돌은 생활 방식과 가치관의 마찰로 나타납니다.
    그러나 강한 마찰은 강한 끌림의 이면이기도 합니다. 서로의 다름을 인정하고 존중하는 의식적 노력이 관계를 지속시킵니다.
  </div>`);
  document.getElementById('panel-lover').innerHTML =
    `<div class="special-badges">${loverBadges.join('')}</div>` + loverInsights.join('');

  // ── 부부 ──
  const marriedInsights = [];
  marriedInsights.push(`<div class="insight-card">
    <div class="tag">💍 재성/관성 균형</div><br>
    ${(a.counts.metal>1||a.counts.earth>1) ? '<strong>'+aName+'</strong>은 재성·관성 기운이 있어 경제적 안정을 중시합니다.' : '<strong>'+aName+'</strong>은 재물보다 관계와 성장을 우선합니다.'}
    ${(b.counts.metal>1||b.counts.earth>1) ? ' <strong>'+bName+'</strong>도 재성 기운이 강해 함께 자산을 쌓아가는 구조입니다.' : ' <strong>'+bName+'</strong>은 정서적 유대를 우선시합니다.'}
    두 사람의 재물 철학을 초기에 맞추는 것이 장기 안정의 열쇠입니다.
  </div>`);
  marriedInsights.push(`<div class="insight-card">
    <div class="tag red">⚠ 위기 구간 분석</div><br>
    일반적으로 결혼 ${result.score<55 ? '3~5년' : '7~10년'} 차에 에너지 마찰이 표면화되는 경향이 있습니다.
    ${isChung ? '두 사람의 일지 충('+aDB+'·'+bDB+')은 이 시기에 주요 갈등 원인이 될 수 있습니다. 일상의 역할 분담을 명확히 하세요.' :
    '이 시기에 서로의 대운 흐름을 점검하고, 공통 목표를 재설정하는 것이 위기를 기회로 전환합니다.'}
  </div>`);
  marriedInsights.push(`<div class="insight-card">
    <div class="tag">👶 자녀운</div><br>
    ${(a.counts.wood+a.counts.fire>3)||(b.counts.wood+b.counts.fire>3) ? '목화(木火) 기운이 풍부하여 자녀와의 인연이 밝고 따뜻합니다. ' : ''}
    ${(a.counts.water+a.counts.metal>3)||(b.counts.water+b.counts.metal>3) ? '금수(金水) 기운이 강한 사주는 늦게 자녀 인연이 이루어지는 경우도 있습니다. ' : ''}
    두 사람의 오행 균형으로 볼 때 자녀는 ${result.score>=65 ? '비교적 순탄한' : '노력이 필요한'} 인연입니다.
    용신 오행이 강한 대운 시기가 자녀 인연의 최적 구간입니다.
  </div>`);
  document.getElementById('panel-married').innerHTML = marriedInsights.join('');

  // ── 친구 ──
  const friendInsights = [];
  friendInsights.push(`<div class="insight-card">
    <div class="tag">🤝 에너지 충돌 진단</div><br>
    ${isChung ? '<strong>강한 에너지 충돌</strong>('+aDB+'·'+bDB+' 충): 의견 충돌이 잦을 수 있지만, 이 두 사람의 조합은 서로에게 강한 자극을 주는 관계입니다. 갈등이 성장의 동력이 됩니다.' :
    isHap ? '<strong>안정적 에너지</strong>('+aDB+'·'+bDB+' 합): 대화가 자연스럽고 오해가 적습니다. 오래될수록 더 편안해지는 우정입니다.' :
    '에너지 충돌이 크지 않습니다. 서로 다른 관심사와 강점이 보완적 우정을 만듭니다.'}
  </div>`);
  friendInsights.push(`<div class="insight-card">
    <div class="tag">📅 장기 지속성</div><br>
    ${result.samhapScore>0 ? '<strong>삼합 관계</strong>('+aDB+'·'+bDB+'): 같은 방향을 향하는 에너지. 공통 목표나 취미가 생기면 평생 우정으로 발전합니다.' :
    result.score>=60 ? '오행 보완이 잘 이루어져 '+aName+'와 '+bName+'은 서로에게 영감을 주는 장기적 인연입니다.' :
    '에너지 차이가 있어 의도적 연락과 노력이 필요합니다. 공통 관심사를 찾는 것이 우정 유지의 핵심입니다.'}
  </div>`);
  document.getElementById('panel-friend').innerHTML = friendInsights.join('');

  // ── 비즈니스 ──
  const bizInsights = [];
  bizInsights.push(`<div class="insight-card">
    <div class="tag">💰 재물 상승기 분석</div><br>
    ${a.solarYear<b.solarYear ? aName+'이 선배로서 경험을 제공하고 '+bName+'이 새로운 시각을 더하는 구조가 유리합니다.' : bName+'의 경험과 '+aName+'의 에너지가 시너지를 냅니다.'}
    ${shengAB ? ' 특히 '+aName+'('+aOh+')이 '+bName+'('+bOh+')을 생하는 관계로, '+aName+'이 방향을 설정하고 '+bName+'이 실행하는 역할 분담이 효과적입니다.' :
    shengBA ? ' '+bName+'('+bOh+')이 '+aName+'('+aOh+')을 생하는 관계로, '+bName+'이 전략을 수립하고 '+aName+'이 실행하는 구조가 최적입니다.' :
    ' 동등한 파트너십 구조. 명확한 역할 분담과 계약이 중요합니다.'}
  </div>`);
  const getStyleDesc = s =>
    s==='신강' ? '주도적이고 빠른 결정을 선호합니다. 큰 그림을 보는 추진력.' :
    s==='신약' ? '신중하고 협의를 중시합니다. 리스크 관리에 강합니다.' :
    '균형 잡힌 결정 방식. 상황에 따라 유연하게 대응합니다.';
  bizInsights.push(`<div class="insight-card">
    <div class="tag">🧠 의사결정 스타일</div><br>
    <strong>${aName}</strong>(${a.strength}): ${getStyleDesc(a.strength)}<br>
    <strong>${bName}</strong>(${b.strength}): ${getStyleDesc(b.strength)}<br><br>
    ${a.strength!==b.strength ? '서로 다른 결정 스타일이 상호 보완적으로 작용합니다. 중요 결정 전 반드시 상의하세요.' : '비슷한 스타일로 빠른 합의가 가능하지만 외부 검토자가 필요합니다.'}
  </div>`);
  document.getElementById('panel-business').innerHTML = bizInsights.join('');
}

// ══════════════════════════════════════
// 대운 싱크 타임라인
// ══════════════════════════════════════
function buildTimeline(a, b, aInfo, bInfo) {
  const aDaYun = a.allDaYun;
  const bDaYun = b.allDaYun;
  const currYear = new Date().getFullYear();
  const slots = [];

  for (let ageA = 10; ageA <= 90; ageA += 10) {
    const calYear = aInfo.year + ageA;
    const ageB = calYear - bInfo.year;
    if (ageB < 0 || ageB > 100) continue;

    let aDY = null;
    for (let i=0;i<aDaYun.length;i++) {
      const s=aDaYun[i].getStartAge(), n=i+1<aDaYun.length?aDaYun[i+1].getStartAge():999;
      if (ageA>=s&&ageA<n){aDY=aDaYun[i];break;}
    }
    let bDY = null;
    for (let i=0;i<bDaYun.length;i++) {
      const s=bDaYun[i].getStartAge(), n=i+1<bDaYun.length?bDaYun[i+1].getStartAge():999;
      if (ageB>=s&&ageB<n){bDY=bDaYun[i];break;}
    }
    if (!aDY||!bDY) continue;

    const aGZ = aDY.getGanZhi ? aDY.getGanZhi() : ['甲','子'];
    const bGZ = bDY.getGanZhi ? bDY.getGanZhi() : ['甲','子'];
    const aOhDY = STEM_OH[aGZ[0]]||'earth';
    const bOhDY = STEM_OH[bGZ[0]]||'earth';

    const sheng = SHENG[aOhDY]===bOhDY || SHENG[bOhDY]===aOhDY;
    const ke = KE[aOhDY]===bOhDY || KE[bOhDY]===aOhDY;
    const cls   = sheng?'good':ke?'hard':'half';
    const icon  = sheng?'✨':ke?'⚡':'🌙';
    const label = sheng?'함께 좋음':ke?'조율 필요':'무난';
    const isCurrent = calYear>=currYear-5 && calYear<=currYear+5;
    slots.push({ageA,ageB,aGZ,bGZ,cls,icon,label,isCurrent});
  }

  document.getElementById('timeline-scroll').innerHTML = slots.map(s =>
    `<div class="t-card ${s.cls}" ${s.isCurrent?'style="box-shadow:0 0 0 2px var(--gold);"':''}>
      <div class="t-age">A:${s.ageA}세/B:${s.ageB}세</div>
      <div class="t-icon">${s.icon}</div>
      <div class="t-gz"><span class="${HAN_COLOR[s.aGZ[0]]}">${s.aGZ[0]}${s.aGZ[1]}</span></div>
      <div class="t-gz"><span class="${HAN_COLOR[s.bGZ[0]]}">${s.bGZ[0]}${s.bGZ[1]}</span></div>
      <div class="t-label">${s.label}</div>
    </div>`
  ).join('');
}

// ══════════════════════════════════════
// 탭 전환
// ══════════════════════════════════════
function switchTab(rel, btn) {
  document.querySelectorAll('.rel-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.rel-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-'+rel).classList.add('active');
}

// ══════════════════════════════════════
// 초기화
// ══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));

function init() {
  try {
    const params = parseParams();
    const sajuA = calcSaju(params.a);
    const sajuB = calcSaju(params.b);
    const result = analyzeCoupling(sajuA, sajuB);

    const relLabels = {lover:'💕 연인 궁합',married:'💍 부부 궁합',friend:'🤝 친구 궁합',business:'💼 비즈니스 궁합'};
    document.getElementById('rel-badge').textContent = relLabels[params.rel] || '궁합 리포트';

    renderPersonCard('a', params.a, sajuA);
    renderPersonCard('b', params.b, sajuB);
    renderScore(result);
    buildRelPanels(params, sajuA, sajuB, result);
    buildTimeline(sajuA, sajuB, params.a, params.b);

    // CSS 오행 배경색 클래스
    const st = document.createElement('style');
    st.textContent = '.bg-wood{background:var(--wood)}.bg-fire{background:var(--fire)}.bg-earth{background:var(--earth)}.bg-metal{background:var(--metal)}.bg-water{background:var(--water)}';
    document.head.appendChild(st);

    // 기본 탭 활성화 (rel 파라미터 기준)
    const rel = params.rel;
    if (['lover','married','friend','business'].includes(rel)) {
      document.querySelectorAll('.rel-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.rel-panel').forEach(p=>p.classList.remove('active'));
      document.querySelectorAll('.rel-tab').forEach(t=>{ if(t.getAttribute('onclick').includes("'"+rel+"'")) t.classList.add('active'); });
      const panel = document.getElementById('panel-'+rel);
      if (panel) panel.classList.add('active');
    }

    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-content').style.display  = 'block';
  } catch(e) {
    console.error(e);
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('error-screen').style.display   = 'block';
  }
}
</script>
</body>
</html>
"""

with open('/home/node/.openclaw/workspace/sajux_deploy/couple/index.html', 'a', encoding='utf-8') as f:
    f.write(rest)

print("Done appending")
