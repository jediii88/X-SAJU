with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    html = f.read()

old_cats = """            document.getElementById('cat-health').innerHTML = `<p>일간 <b>${dayStem}</b> 기준 주의 신체: <b>${hmap[stemEl]}</b></p><p>${counts[stemEl]>=30?'해당 오행 과다 — 규칙적 생활과 무리한 일정 자제가 핵심입니다.':'오행 균형 양호 — '+hmap[gi]+' 관련 계절에 컨디션 관리에 신경 쓰세요.'}</p>`;
            document.getElementById('cat-wealth').innerHTML = `<p>재성 비중: <b>${pct(jaeC)}%</b></p><p>${jaeC>sipTotalWeight*0.25?'재성 강 — 돈을 끌어당기는 감각, 사업·투자 기회 포착 능력이 뛰어납니다.':jaeC===0?'재성 없음 — 돈이 흘러가는 경향. 지출 관리와 저축 습관이 핵심입니다.':'재성 적정 — 안정보다 가치 창출로 재물을 만드는 스타일입니다.'}</p>`;
            document.getElementById('cat-career').innerHTML = `<p>관성 비중: <b>${pct(gwanC)}%</b></p><p>${gwanC>sipTotalWeight*0.25?'관성 강 — 조직과 명예, 공직·기업·전문직에서 두각을 드러냅니다.':sikC>sipTotalWeight*0.25?'식상 강 — 재능과 표현력으로 승부. 프리랜서·창작직·서비스업에 적합합니다.':'전문성을 쌓아 자신만의 영역을 구축하는 스타일입니다.'}</p>`;
            document.getElementById('cat-love').innerHTML = `<p>${gwanC>0?'관성 있음 — 이성 인연이 자연스럽게 찾아오는 구조. 다만 통제욕 주의.':inC>sipTotalWeight*0.3?'인성 강 — 관계에서 헌신적이나 자기희생 과다 주의. 자신을 먼저 사랑하는 연습 필요.':'인연은 본인이 주도적으로 만들어가는 스타일. 용신 운이 들어오는 대운에서 인연이 활성화됩니다.'}</p>`;"""

new_cats = r"""
            // ── 건강운 상세 ──
            const healthOverall = counts[stemEl]>=30
                ? `당신의 사주 원국에서 <b>${{wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'}[stemEl]}</b> 기운이 과도하게 집중되어 있습니다. 에너지가 한쪽으로 치우친 사주는 그 기운이 담당하는 장기에 반복적으로 부담이 쌓입니다. 특히 스트레스가 극에 달했을 때 가장 먼저 타격을 받는 것이 바로 <b>${hmap[stemEl]}</b>입니다. 이를 아는 것만으로도 당신은 평균보다 훨씬 오래, 건강하게 살 수 있습니다.`
                : `당신의 오행은 비교적 균형을 이루고 있습니다. 선천적인 건강 자본이 양호한 편입니다. 다만 忌神(기신) 오행인 <b>${{wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'}[gi]||'해당 오행'}</b>의 기운이 강해지는 계절이나 대운에서 면역력이 급격히 떨어질 수 있습니다.`;
            const healthDetail = {
                wood: `<b>🌿 목(木) — 간·담낭·신경계 집중 관리</b><br>
                간은 '분노의 장기'라 불립니다. 억눌린 감정, 과도한 경쟁심, 스트레스가 쌓이면 간 수치가 올라가고 눈이 충혈되며 편두통이 옵니다. 알코올을 멀리하고, 녹황색 채소와 신맛(레몬, 식초)이 간 기운을 보완합니다. 봄철(3~5월)과 인(寅)·묘(卯)월에 특히 주의하세요.`,
                fire: `<b>🔥 화(火) — 심장·혈관·안구 집중 관리</b><br>
                심장과 소장이 취약 지점입니다. 과도한 흥분, 불규칙한 수면, 카페인 과다 섭취는 심박수를 불안정하게 만듭니다. 혈압 관리가 평생 과제이며, 여름철(6~8월)과 사(巳)·오(午)월에 혈관 관련 이상 신호에 즉각 반응하는 습관이 생존을 결정합니다.`,
                earth: `<b>🌍 토(土) — 위장·비장·소화기 집중 관리</b><br>
                걱정과 과도한 생각이 소화기를 망가뜨립니다. 당신은 머릿속이 복잡할수록 위장이 먼저 반응합니다. 식사 시간을 규칙적으로 유지하고, 과식을 피하며, 따뜻한 음식 위주로 식단을 구성하세요. 환절기와 토(土)의 기운이 강한 진(辰)·술(戌)·축(丑)·미(未)월에 소화 장애가 집중됩니다.`,
                metal: `<b>⚙️ 금(金) — 폐·대장·호흡기 집중 관리</b><br>
                슬픔과 우울감이 폐 기운을 손상시킵니다. 미세먼지에 유독 취약하며 호흡기 감염이 오래갑니다. 유산소 운동으로 폐활량을 키우고, 하얀 음식(배, 무, 도라지)이 폐를 보강합니다. 가을철(9~11월)과 신(申)·유(酉)월에 호흡기 질환 예방에 집중하세요.`,
                water: `<b>💧 수(水) — 신장·방광·호르몬 집중 관리</b><br>
                두려움과 불안이 신장 기운을 갉아먹습니다. 만성 피로, 허리 통증, 호르몬 불균형이 반복된다면 신장 에너지 고갈의 신호입니다. 충분한 수면과 수분 섭취가 최우선입니다. 겨울철(12~2월)과 해(亥)·자(子)월에 몸을 혹사시키지 마세요.`
            }[stemEl] || '오행 균형에 따라 계절별 건강 관리가 중요합니다.';

            document.getElementById('cat-health').innerHTML = `
                <div class="cat-header"><span class="cat-icon">🫀</span><span class="cat-title">건강운 심층 분석</span></div>
                <div class="cat-body">
                    <p class="cat-text">${healthOverall}</p>
                    <div class="cat-highlight">${healthDetail}</div>
                    <div class="cat-advice">
                        <b>💡 Axe 건강 처방:</b> 몸이 보내는 신호를 무시하지 마십시오. 당신은 버티는 능력이 탁월하지만, 그 능력이 때로는 병을 키웁니다. 년 1회 정기검진을 빠짐없이 이행하는 것이 가장 강력한 건강 보험입니다.
                    </div>
                </div>`;

            // ── 재물운 상세 ──
            const wealthType = jaeC > sipTotalWeight*0.25 ? 'rich' : jaeC === 0 ? 'none' : 'balanced';
            const wealthMain = {
                rich: `당신의 사주에는 財星(재성)이 풍부합니다. 돈 냄새를 맡는 본능이 탁월하고 기회가 왔을 때 놓치지 않는 감각이 있습니다. 그러나 '재다신약(財多身弱)'의 함정을 조심해야 합니다. 너무 많은 기회가 오히려 당신을 소진시킵니다. 선택과 집중이 부의 핵심 전략입니다.`,
                none: `당신의 사주는 無財(무재) 구조입니다. 이것을 '돈과 인연이 없다'고 해석하는 것은 구시대적 오류입니다. 무재 사주의 진짜 의미는 돈을 직접 쫓으면 오히려 도망간다는 것입니다. 당신은 명예, 전문성, 브랜드 가치를 극대화할 때 돈이 그림자처럼 따라오는 구조입니다. 돈보다 가치를 먼저 만드십시오.`,
                balanced: `당신의 재성은 적정 수준으로 균형 잡혀 있습니다. 투기나 대박보다는 꾸준히 우상향하는 '스노우볼 전략'이 가장 효과적입니다. 한 가지 전문성을 깊이 파고들어 안정적인 현금흐름을 만드는 것이 당신의 부의 공식입니다.`
            }[wealthType];

            const wealthStrategy = sikC > sipTotalWeight * 0.2
                ? `<b>💰 재물 창출 전략 — 식상(食傷)형:</b> 당신의 재물은 재능과 아이디어에서 나옵니다. 머릿속에 있는 것을 세상 밖으로 꺼낼수록 돈이 됩니다. 유튜브, 강의, 컨설팅, 창작물 등 '내가 만든 것'이 복리로 돈을 버는 구조를 빠르게 구축하십시오.`
                : gwanC > sipTotalWeight * 0.2
                ? `<b>💰 재물 창출 전략 — 관성(官星)형:</b> 조직 안에서 인정받고 승진할수록 재물이 커지는 구조입니다. 안정적인 급여 기반 위에 투자 소득을 레이어링하는 '월급쟁이 부자' 전략이 가장 적합합니다.`
                : `<b>💰 재물 창출 전략:</b> 用神(용신) 운이 들어오는 대운과 세운에서 재물 확장 기회가 집중됩니다. 해당 시기를 미리 파악하고 준비하는 것이 수십 년의 재산 차이를 만듭니다.`;

            document.getElementById('cat-wealth').innerHTML = `
                <div class="cat-header"><span class="cat-icon">💰</span><span class="cat-title">재물운 심층 분석</span></div>
                <div class="cat-body">
                    <div class="cat-stat-row">
                        <div class="cat-stat"><span class="cat-stat-label">財星(재성) 비중</span><span class="cat-stat-val">${pct(jaeC)}%</span></div>
                        <div class="cat-stat"><span class="cat-stat-label">食傷(식상) 비중</span><span class="cat-stat-val">${pct(sikC)}%</span></div>
                    </div>
                    <p class="cat-text">${wealthMain}</p>
                    <div class="cat-highlight">${wealthStrategy}</div>
                    <div class="cat-advice">
                        <b>💡 Axe 부의 추월차선:</b> 당신의 금고는 월급통장 사이즈가 아닙니다. 用神(용신) 기운을 가진 사람과의 협업, 그것이 당신 재물운의 숨겨진 가속 페달입니다.
                    </div>
                </div>`;

            // ── 직업운 상세 ──
            const careerType = gwanC > sipTotalWeight*0.25 ? 'officer'
                : sikC > sipTotalWeight*0.25 ? 'creator'
                : inC > sipTotalWeight*0.25 ? 'expert' : 'independent';
            const careerMain = {
                officer: `官星(관성)이 강한 당신은 조직 생활의 생리를 본능적으로 이해합니다. 규칙과 위계, 책임과 권한이 명확한 환경에서 두각을 드러내며, 승진과 사회적 지위를 꾸준히 쌓아올리는 것이 최적 경로입니다. 공직, 대기업, 금융, 법조계에서 탁월한 성과를 냅니다.`,
                creator: `食傷(식상)이 강한 당신의 무대는 창작과 표현입니다. 남이 설계한 시스템 안에서는 부품처럼 쓰이다 소진됩니다. 당신의 아이디어와 목소리가 곧 돈이 되는 구조 — 프리랜서, 기획자, 크리에이터, 교육자, 강사, 예술가 — 여기서 당신은 폭발적 성취를 이룹니다.`,
                expert: `印星(인성)이 강한 당신의 경쟁력은 '지식과 자격증'입니다. 남들이 쉽게 따라올 수 없는 전문성이 당신의 평생 자산입니다. 의사, 변호사, 회계사, 컨설턴트, 연구자, 교수 등 전문직에서 독보적인 권위를 쌓을 수 있습니다.`,
                independent: `당신은 남 밑에 있으면 에너지가 억눌립니다. 비견(比肩)과 겁재(劫財)가 강할수록 내 영역을 스스로 개척하는 독립 사업, 영업, 스포츠, 군인/경찰 등 치열한 경쟁 구도에서 진가를 발휘합니다.`
            }[careerType];

            document.getElementById('cat-career').innerHTML = `
                <div class="cat-header"><span class="cat-icon">🏆</span><span class="cat-title">직업운 심층 분석</span></div>
                <div class="cat-body">
                    <div class="cat-stat-row">
                        <div class="cat-stat"><span class="cat-stat-label">官星(관성) 비중</span><span class="cat-stat-val">${pct(gwanC)}%</span></div>
                        <div class="cat-stat"><span class="cat-stat-label">食傷(식상) 비중</span><span class="cat-stat-val">${pct(sikC)}%</span></div>
                        <div class="cat-stat"><span class="cat-stat-label">印星(인성) 비중</span><span class="cat-stat-val">${pct(inC)}%</span></div>
                    </div>
                    <p class="cat-text">${careerMain}</p>
                    <div class="cat-highlight">
                        <b>🎯 최적 직업 환경:</b> ${{officer:'조직 내 리더십 포지션 (부서장, 팀장, 임원 트랙)', creator:'자기 브랜드 기반의 1인 또는 소수 정예 팀', expert:'전문 자격 기반의 독립 컨설팅 또는 파트너십', independent:'완전한 자율과 성과로 평가받는 독립 영역'}[careerType]}
                    </div>
                    <div class="cat-advice">
                        <b>💡 Axe 커리어 설계:</b> "내 권한이 100% 보장되는가?" — 이것이 직업 선택의 단 하나의 기준입니다. 이 질문에 Yes가 나오는 자리에서만 당신의 진짜 능력이 폭발합니다.
                    </div>
                </div>`;

            // ── 애정운 상세 ──
            const iljuKey2 = dayStem + (pillars&&pillars[1]?pillars[1].h[1]:'인');
            const dbEntry2 = window.SAJU_DB?.ILJU?.[iljuKey2] || {};
            const loveText2 = dbEntry2.love || '日支(일지)에 각인된 인연의 코드에 따라 맞는 사람이 다릅니다.';
            const loveType = gwanC > 0 ? 'active' : inC > sipTotalWeight*0.3 ? 'passive' : 'self';
            const loveMain = {
                active: `官星(관성)이 있는 당신에게 이성 인연은 자연스럽게 찾아오는 편입니다. 사회적 활동이 활발한 시기에 인연이 집중됩니다. 다만 관성이 강할수록 상대를 통제하려는 욕구가 관계를 경직시킵니다. '내 방식으로 사랑하는 것'과 '상대가 원하는 방식으로 사랑받는 것'의 차이를 이해하는 것이 관계의 핵심 과제입니다.`,
                passive: `印星(인성)이 강한 당신은 사랑에서 헌신적입니다. 상대를 위해 자신을 희생하는 것을 마다하지 않습니다. 그러나 이 헌신이 때로 집착이나 의존으로 변할 수 있습니다. 자기 자신을 먼저 사랑하는 연습 — 그것이 역설적으로 가장 건강한 관계를 만드는 길입니다.`,
                self: `당신의 인연은 스스로 만들어가는 스타일입니다. 수동적으로 기다리기보다 적극적으로 만남을 만들어야 합니다. 用神(용신) 운이 들어오는 대운과 세운에 인연이 활성화됩니다. 해당 시기에 사회적 활동 반경을 의도적으로 넓히는 것이 전략입니다.`
            }[loveType];

            document.getElementById('cat-love').innerHTML = `
                <div class="cat-header"><span class="cat-icon">❤️</span><span class="cat-title">애정운 심층 분석</span></div>
                <div class="cat-body">
                    <p class="cat-text">${loveMain}</p>
                    <div class="cat-highlight">
                        <b>💑 배우자궁(日支) 분석:</b><br>${loveText2}
                    </div>
                    <div class="cat-advice">
                        <b>💡 Axe 연애 전략:</b> 당신에게 맞는 인연은 당신의 용신 오행을 일간으로 가진 사람입니다. 궁합은 천간(天干)보다 일지(日支)의 합충 관계가 평생 에너지를 좌우합니다.
                    </div>
                </div>`;
"""

if old_cats in html:
    html = html.replace(old_cats, new_cats)
    print("카테고리 교체 성공")
else:
    print("패턴 불일치")

# 카테고리 섹션 CSS 추가
cat_css = """
        /* 분야별 운세 카드 */
        .cat-header { display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); }
        .cat-icon { font-size:22px; }
        .cat-title { font-size:17px; font-weight:700; color:var(--gold); font-family:'Noto Serif KR',serif; }
        .cat-body { display:flex; flex-direction:column; gap:14px; }
        .cat-text { font-size:14px; line-height:1.85; color:#ddd; word-break:keep-all; margin:0; }
        .cat-highlight { background:rgba(199,167,106,0.06); border-left:3px solid var(--gold); border-radius:0 8px 8px 0; padding:14px 16px; font-size:13.5px; line-height:1.8; color:#ccc; }
        .cat-advice { background:rgba(255,255,255,0.04); border-radius:8px; padding:12px 14px; font-size:13px; line-height:1.7; color:#bbb; }
        .cat-stat-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:4px; }
        .cat-stat { background:rgba(255,255,255,0.05); border-radius:8px; padding:8px 12px; flex:1; min-width:80px; text-align:center; }
        .cat-stat-label { display:block; font-size:10px; color:var(--text-dim); margin-bottom:4px; }
        .cat-stat-val { display:block; font-size:18px; font-weight:800; color:var(--gold); }
        .cat-section { margin-bottom:24px; background:rgba(255,255,255,0.025); border-radius:14px; padding:20px; box-shadow:0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06); }"""

html = html.replace(
    "        /* 분야별 운세 카드 */\n        .cat-header",
    cat_css  # 이미 있으면 중복 방지
) if "/* 분야별 운세 카드 */" in html else html.replace(
    "        .report-chapter {",
    cat_css + "\n        .report-chapter {"
)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w') as f:
    f.write(html)

print("완료")
