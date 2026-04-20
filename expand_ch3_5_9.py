with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_func(html, fn_name, new_code):
    start = html.find(f'function {fn_name}(data) {{')
    if start == -1: print(f"{fn_name}: NOT FOUND"); return html
    depth=0; i=start; end=-1
    while i<len(html):
        if html[i]=='{': depth+=1
        elif html[i]=='}':
            depth-=1
            if depth==0: end=i+1; break
        i+=1
    if end==-1: print(f"{fn_name}: END NOT FOUND"); return html
    html = html[:start] + new_code + html[end:]
    print(f"{fn_name}: 교체 성공 ({len(new_code):,}자)")
    return html

# ── Chapter 3: 십성 ──
ch3 = (
"function buildChapter3_Sipseong(data) {\n"
"    const sipseong = data.sipseong || {};\n"
"    const sorted = Object.entries(sipseong).sort((a,b)=>b[1]-a[1]);\n"
"    const mainSip = sorted.length>0 ? sorted[0][0] : '정재';\n"
"    const secondSip = sorted.length>1 ? sorted[1][0] : '';\n"
"    const sipText = window.SAJU_DB?.SIPSEONG?.[mainSip] || '사회의 규칙에 순응하기보다 주도적으로 판을 짜는 기질입니다.';\n"
"    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0),1);\n"
"    const sipPersonality = {\n"
"        '비견':'比肩(비견)이 강한 당신은 독립심과 경쟁심이 강합니다. 남에게 지는 것을 극도로 싫어하며 자기 방식으로 일하는 것을 선호합니다. 동업이나 파트너십에서 주도권 다툼이 생길 수 있으니 역할 분담을 명확히 해야 합니다. 이 강한 자아는 독립 사업, 스포츠, 경쟁이 치열한 분야에서 가장 큰 힘을 발휘합니다.',\n"
"        '겁재':'劫財(겁재)가 강한 당신은 경쟁과 도전이 삶의 동력입니다. 극한 상황에서 진가를 발휘하며 승부욕이 탁월합니다. 재물 관리에 있어 충동적 결정을 조심하고, 이 강렬한 에너지를 스포츠·협상·투자의 무기로 활용하십시오.',\n"
"        '식신':'食神(식신)이 강한 당신은 천부적인 창의력과 표현력을 가지고 있습니다. 먹고 즐기고 창조하는 것에서 진정한 행복을 느끼며, 이 재능이 돈이 되는 구조를 만들면 최상의 인생이 펼쳐집니다. 요리·예술·교육·엔터테인먼트·창업 등에서 빛을 발합니다.',\n"
"        '상관':'傷官(상관)이 강한 당신은 기존 틀을 깨는 혁신가입니다. 규칙과 권위에 도전하며 새로운 방식으로 세상을 바라봅니다. 이 창의성은 예술, 기획, 컨설팅, 기술 혁신 분야에서 폭발적 성과를 냅니다. 조직보다는 자율적 환경이 맞습니다.',\n"
"        '편재':'偏財(편재)가 강한 당신은 돈 냄새를 맡는 감각이 탁월합니다. 다양한 수입원을 동시에 운영하는 능력이 있으며 사업 기회 포착 능력이 뛰어납니다. 고정 수입보다 유동적이고 큰 돈의 흐름에서 에너지를 얻습니다.',\n"
"        '정재':'正財(정재)가 강한 당신은 안정적이고 꾸준하게 자산을 쌓아가는 능력이 있습니다. 성실함과 신뢰가 재물의 기반이 됩니다. 부동산·저축·안정적 투자에서 최상의 결과를 냅니다. 화려한 한 방보다 꾸준한 복리가 당신의 재물 공식입니다.',\n"
"        '편관':'偏官(편관)이 강한 당신은 강렬한 승부욕과 강인한 결단력을 가지고 있습니다. 압박이 클수록 더욱 강해지는 기질로 군인·경찰·운동선수·위기관리 전문가에 적합합니다. 이 에너지를 사회적으로 인정받는 방향으로 표출하는 것이 핵심입니다.',\n"
"        '정관':'正官(정관)이 강한 당신은 조직과 규칙을 중시하며 사회적 명예와 신뢰를 삶의 핵심 가치로 여깁니다. 공직·대기업·전문직에서 꾸준히 올라가는 안정적 성공 구조입니다. 명예와 체면을 지키는 것이 재물과 직결됩니다.',\n"
"        '편인':'偏印(편인)이 강한 당신은 특수한 분야의 전문 지식과 직관이 뛰어납니다. 일반적 학습보다 자기만의 방식으로 체득한 지식이 강점이며 독특한 전문성이 경쟁력이 됩니다. 남들이 가지 않는 길에서 독보적 위치를 만들 수 있습니다.',\n"
"        '정인':'正印(정인)이 강한 당신은 학문·교육·문서·귀인의 도움이 삶을 이끌어갑니다. 배움을 멈추지 않으면 나이가 들수록 더욱 빛나는 인생이 펼쳐집니다. 전문 자격증과 공인된 지식이 사회적 신뢰와 재물을 동시에 가져옵니다.'\n"
"    }[mainSip] || sipText;\n"
"    const sipRows = sorted.slice(0,6).map(([k,v]) => {\n"
"        const pct = Math.round(v/total*100); const isMain = k===mainSip;\n"
"        const col = isMain ? 'var(--gold)' : '#888';\n"
"        return `<div style=\"display:flex;align-items:center;gap:10px;margin-bottom:8px;\"><div style=\"width:52px;text-align:right;font-size:12px;color:${col};\">${k}</div><div style=\"flex:1;background:rgba(255,255,255,0.07);border-radius:4px;height:7px;overflow:hidden;\"><div style=\"width:${pct}%;height:100%;background:${col};border-radius:4px;\"></div></div><div style=\"width:36px;font-size:12px;color:${col};\">${pct}%</div></div>`;\n"
"    }).join('');\n"
"    return `<div class=\"report-chapter\">\n"
"        <h3 class=\"ch-title\">Chapter 3. 十星(십성) — 사회적 페르소나와 내면의 욕망</h3>\n"
"        <p class=\"ch-text\">五行(오행)이 당신의 하드웨어라면, 十星(십성)은 당신의 뇌에 깔린 운영체제입니다. 사람을 대할 때, 돈을 벌 때, 상사와 부하를 대할 때 무의식적으로 튀어나오는 패턴이 바로 이 십성에서 비롯됩니다. 당신은 10가지 유형 중 어떤 운영체제로 세상과 상호작용하고 있습니까?</p>\n"
"        <div style=\"background:rgba(255,255,255,0.04);border-radius:12px;padding:18px;margin:20px 0;\">\n"
"            <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:14px;letter-spacing:1px;\">十星(십성) 분포</div>\n"
"            ${sipRows}\n"
"        </div>\n"
"        <p class=\"ch-text\">당신의 무의식을 지배하는 가장 강력한 운영체제는 <b style=\"color:var(--gold);\">[${mainSip}]</b>입니다. 결정적인 순간에 당신이 선택을 내리는 기준은 오직 이 기질 하나로 수렴됩니다.</p>\n"
"        <div style=\"background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:16px 0;\">\n"
"            <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;\">${mainSip} 심층 분석</div>\n"
"            <p style=\"font-size:14.5px;color:#ddd;line-height:1.9;margin:0 0 10px;\">${sipText}</p>\n"
"            <p style=\"font-size:14px;color:#ccc;line-height:1.85;margin:0;\">${sipPersonality}</p>\n"
"        </div>\n"
"        ${secondSip ? `<p class=\"ch-text\">두 번째로 강한 기운은 <b>[${secondSip}]</b>입니다. 이 기운은 주력 운영체제가 작동하지 않을 때 보조 시스템으로 발동하며, 당신의 다면적인 모습을 만들어냅니다.</p>` : ''}\n"
"        <p class=\"ch-text\">이 기질을 당신의 통제 아래 두고 적재적소에 활용하면 남들이 평생 걸려도 얻지 못할 사회적 성취를 단기간에 쥐어냅니다. 그러나 이 기질에 끌려다니면 가장 믿었던 무기에 제 발등이 찍히는 꼴이 됩니다.</p>\n"
"    </div>`;\n"
"}"
)
html = replace_func(html, 'buildChapter3_Sipseong', ch3)

# ── Chapter 5: 직업 ──
ch5 = (
"function buildChapter5_Career(data) {\n"
"    const sipseong = data.sipseong || {};\n"
"    const gwanC = (sipseong['정관']||0)+(sipseong['편관']||0);\n"
"    const sikC = (sipseong['식신']||0)+(sipseong['상관']||0);\n"
"    const inC = (sipseong['정인']||0)+(sipseong['편인']||0);\n"
"    const jaeC = (sipseong['정재']||0)+(sipseong['편재']||0);\n"
"    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0),1);\n"
"    const careerType = gwanC/total>0.2?'officer':sikC/total>0.2?'creator':inC/total>0.2?'expert':'independent';\n"
"    const careerMain = {\n"
"        officer:'官星(관성)이 강한 당신은 조직 생활의 생리를 본능적으로 이해합니다. 규칙과 위계, 책임과 권한이 명확한 환경에서 두각을 드러내며 승진과 사회적 지위를 꾸준히 쌓아올리는 것이 최적 경로입니다. 공직·대기업·금융·법조계·공기업에서 탁월한 성과를 냅니다. 이 기질을 가진 사람이 인정받는 조직에 들어가면 지속적으로 올라갑니다.',\n"
"        creator:'食傷(식상)이 강한 당신의 무대는 창작과 표현입니다. 남이 설계한 시스템 안에서는 부품처럼 쓰이다 소진됩니다. 당신의 아이디어와 목소리가 곧 돈이 되는 구조 — 프리랜서·기획자·크리에이터·교육자·강사·예술가·개발자 — 여기서 당신은 폭발적 성취를 이룹니다.',\n"
"        expert:'印星(인성)이 강한 당신의 경쟁력은 지식과 자격증입니다. 남들이 쉽게 따라올 수 없는 전문성이 평생 자산입니다. 의사·변호사·회계사·컨설턴트·연구자·교수·전문직에서 독보적인 권위를 쌓을 수 있습니다. 배움을 멈추지 않는 한 나이가 들수록 더욱 강해집니다.',\n"
"        independent:'독립적 기운이 강한 당신은 남 밑에 있으면 에너지가 억눌립니다. 내 영역을 스스로 개척하는 독립 사업·영업·스포츠·군인·경찰 등 치열한 경쟁 구도에서 진가를 발휘합니다. 자율권이 100% 보장된 환경에서만 진짜 능력이 폭발합니다.'\n"
"    }[careerType];\n"
"    const bestJob = {\n"
"        officer:'공무원·대기업 임원·금융·법조·의료·경찰·군인',\n"
"        creator:'크리에이터·강사·작가·디자이너·마케터·기획자·개발자',\n"
"        expert:'의사·변호사·회계사·컨설턴트·연구원·교수·약사',\n"
"        independent:'사업가·영업·스포츠·부동산·트레이더·자영업'\n"
"    }[careerType];\n"
"    const wealthLink = jaeC/total>0.25\n"
"        ? '재성(財星)이 강해 돈을 끌어당기는 본능이 탁월합니다. 월급보다 사업소득·투자소득이 더 잘 맞는 구조입니다.'\n"
"        : jaeC===0\n"
"        ? '재성이 없는 구조입니다. 돈을 직접 쫓기보다 명예·전문성·브랜드 가치를 올릴 때 돈이 그림자처럼 따라옵니다.'\n"
"        : '재성이 적정 수준입니다. 안정적 수입 기반 위에 전문성을 쌓는 것이 재물 성장의 핵심입니다.';\n"
"    return `<div class=\"report-chapter\">\n"
"        <h3 class=\"ch-title\">Chapter 5. 직업운 — 나만의 무대를 찾아라</h3>\n"
"        <p class=\"ch-text\">사주에서 직업운은 단순히 '어떤 직종이 잘 맞나'를 말하는 것이 아닙니다. '어떤 환경에서 내 능력이 최대치로 발현되는가'를 파악하는 것입니다. 같은 능력을 가졌어도 맞지 않는 환경에 있으면 절반도 발휘하지 못합니다.</p>\n"
"        <div style=\"background:rgba(199,167,106,0.07);border-radius:12px;padding:20px;margin:20px 0;\">\n"
"            <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:1px;\">직업 성향 분석 결과</div>\n"
"            <div style=\"font-size:16px;font-weight:700;color:var(--gold);margin-bottom:12px;\">${{officer:'관리형 — 조직과 명예',creator:'창조형 — 재능과 표현',expert:'전문가형 — 지식과 자격',independent:'독립형 — 자율과 경쟁'}[careerType]}</div>\n"
"            <p style=\"font-size:14.5px;color:#ddd;line-height:1.9;margin:0;\">${careerMain}</p>\n"
"        </div>\n"
"        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;\">\n"
"            <div style=\"background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;\">\n"
"                <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;\">최적 직업군</div>\n"
"                <div style=\"font-size:13px;color:#ddd;line-height:1.8;\">${bestJob}</div>\n"
"            </div>\n"
"            <div style=\"background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;\">\n"
"                <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;\">재물과의 연결</div>\n"
"                <div style=\"font-size:13px;color:#ddd;line-height:1.8;\">${wealthLink}</div>\n"
"            </div>\n"
"        </div>\n"
"        <p class=\"ch-text\">직업 선택의 핵심 기준은 하나입니다. '내 권한이 100% 보장되는가?' 이 질문에 Yes가 나오는 자리에서만 당신의 진짜 능력이 폭발합니다. 환경이 당신을 만드는 것이 아니라 당신이 환경을 선택하는 것입니다.</p>\n"
"    </div>`;\n"
"}"
)
html = replace_func(html, 'buildChapter5_Career', ch5)

# ── Chapter 9: 개운법 ──
ch9_start = html.find('function buildChapter9_Remedy(data) {')
depth=0; i=ch9_start; ch9_end=-1
while i<len(html):
    if html[i]=='{': depth+=1
    elif html[i]=='}':
        depth-=1
        if depth==0: ch9_end=i+1; break
    i+=1

ch9 = (
"function buildChapter9_Remedy(data) {\n"
"    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';\n"
"    const yong = data.yong || stemEl;\n"
"    const ohKr = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};\n"
"    const yongKr = ohKr[yong] || ohKr[stemEl];\n"
"    const colorDB = {wood:{good:'초록·청색·청록',bad:'흰색·금색',dir:'동쪽·동남쪽',num:'3, 8',gem:'에메랄드·옥(翠玉)·공작석',food:'신맛 — 레몬·식초·매실·키위',time:'봄(3~5월), 아침 시간대'},\n"
"        fire:{good:'빨강·주황·분홍·보라',bad:'검정·파랑',dir:'남쪽',num:'2, 7',gem:'루비·가넷·레드코랄',food:'쓴맛 — 녹차·여주·쑥·커피',time:'여름(6~8월), 오전~정오 시간대'},\n"
"        earth:{good:'노랑·황토·베이지',bad:'파랑·초록',dir:'중앙·북동·남서',num:'5, 10',gem:'황수정·호박(琥珀)·타이거아이',food:'단맛 — 꿀·고구마·호박·옥수수',time:'환절기, 오후 시간대'},\n"
"        metal:{good:'흰색·금색·은색·회색',bad:'빨강·주황',dir:'서쪽·북서쪽',num:'4, 9',gem:'백수정·문스톤·다이아몬드',food:'매운맛 — 생강·마늘·고추·도라지',time:'가을(9~11월), 저녁 시간대'},\n"
"        water:{good:'검정·파랑·감색·보라',bad:'노랑·황토',dir:'북쪽',num:'1, 6',gem:'흑요석·사파이어·아쿠아마린',food:'짠맛 — 된장·미역·검은콩·블루베리',time:'겨울(12~2월), 밤~새벽 시간대'}}[yong] || {good:'흰색',bad:'검정',dir:'서쪽',num:'4',gem:'백수정',food:'매운맛',time:'가을'};\n"
"    const lifeRemedy = {wood:'나무가 자라려면 물이 필요하듯, 수(水) 기운을 가진 사람들(임·계 일간)과의 인연이 당신에게 가장 큰 귀인이 됩니다. 북쪽 방향의 공간에 에너지를 두고, 물과 관련된 직업·공간과 친해지십시오.',\n"
"        fire:'불이 타오르려면 나무가 필요하듯, 목(木) 기운을 가진 사람들(갑·을 일간)과의 인연이 당신에게 힘이 됩니다. 동쪽 방향에 에너지를 두고, 숲·나무·식물이 있는 공간에서 에너지를 충전하십시오.',\n"
"        earth:'땅이 비옥해지려면 화(火) 기운의 온기가 필요하듯, 화(火) 기운을 가진 사람들(병·정 일간)이 당신의 활력을 불어넣습니다. 밝고 따뜻한 남향 공간에서 생활하십시오.',\n"
"        metal:'금속이 완성되려면 토(土)의 기운이 필요하듯, 토(土) 기운을 가진 사람들(무·기 일간)이 당신의 든든한 지원군이 됩니다. 중앙의 안정된 공간에서 에너지를 쌓으십시오.',\n"
"        water:'물이 깊어지려면 금(金) 기운의 원천이 필요하듯, 금(金) 기운을 가진 사람들(경·신 일간)이 당신에게 지혜와 방향을 줍니다. 서쪽 방향에 에너지를 두고, 금속·석재가 있는 공간과 친해지십시오.'}[yong] || '';\n"
"    return `<div class=\"report-chapter\">\n"
"        <h3 class=\"ch-title\">Chapter 9. 開運法(개운법) — 운명을 바꾸는 실전 처방</h3>\n"
"        <p class=\"ch-text\">사주는 운명의 지도입니다. 지도가 있다면 그 지형에 맞게 전략을 바꿀 수 있습니다. 用神(용신)인 <b style=\"color:var(--gold);\">${yongKr}</b> 기운을 생활 속에 쌓아가는 것이 당신 인생의 가장 강력한 개운법입니다.</p>\n"
"        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;\">\n"
"            <div style=\"background:rgba(0,200,83,0.06);border-radius:10px;padding:16px;\">\n"
"                <div style=\"font-size:11px;color:#00C853;margin-bottom:10px;letter-spacing:1px;\">✦ 좋은 색상</div>\n"
"                <div style=\"font-size:14px;color:#ddd;\">${colorDB.good}</div>\n"
"            </div>\n"
"            <div style=\"background:rgba(231,76,60,0.06);border-radius:10px;padding:16px;\">\n"
"                <div style=\"font-size:11px;color:#e74c3c;margin-bottom:10px;letter-spacing:1px;\">✗ 피할 색상</div>\n"
"                <div style=\"font-size:14px;color:#ddd;\">${colorDB.bad}</div>\n"
"            </div>\n"
"            <div style=\"background:rgba(255,255,255,0.04);border-radius:10px;padding:16px;\">\n"
"                <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:1px;\">방위·숫자</div>\n"
"                <div style=\"font-size:13px;color:#ddd;\">${colorDB.dir} / ${colorDB.num}</div>\n"
"            </div>\n"
"            <div style=\"background:rgba(255,255,255,0.04);border-radius:10px;padding:16px;\">\n"
"                <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:1px;\">보석·광물</div>\n"
"                <div style=\"font-size:13px;color:#ddd;\">${colorDB.gem}</div>\n"
"            </div>\n"
"        </div>\n"
"        <div style=\"background:rgba(199,167,106,0.06);border-radius:10px;padding:16px;margin-bottom:14px;\">\n"
"            <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;\">식이 개운</div>\n"
"            <div style=\"font-size:13.5px;color:#ddd;line-height:1.8;\">${colorDB.food} — 이 맛과 음식이 당신의 用神(용신) 에너지를 보충합니다. 일상의 식단에 의식적으로 포함시키십시오.</div>\n"
"        </div>\n"
"        <div style=\"background:rgba(199,167,106,0.06);border-radius:10px;padding:16px;margin-bottom:16px;\">\n"
"            <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;\">최적 활동 시간대</div>\n"
"            <div style=\"font-size:13.5px;color:#ddd;line-height:1.8;\">${colorDB.time} — 이 시간대에 중요한 결정과 창의적 작업을 배치하면