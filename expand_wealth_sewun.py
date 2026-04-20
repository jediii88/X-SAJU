with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_func(html, fn_name, new_code):
    sig = f'function {fn_name}('
    start = html.find(sig)
    if start == -1: print(f"{fn_name}: NOT FOUND"); return html
    depth=0; i=start; end=-1
    while i<len(html):
        if html[i]=='{': depth+=1
        elif html[i]=='}':
            depth-=1
            if depth==0: end=i+1; break
        i+=1
    html = html[:start] + new_code + html[end:]
    print(f"{fn_name}: 교체 성공")
    return html

# ── Chapter 4: 재물운 대폭 확장 ──
ch4 = '''function buildChapter4_Wealth(data) {
    const sipseong = data.sipseong || {};
    const jaeC = (sipseong['정재']||0) + (sipseong['편재']||0);
    const sikC = (sipseong['식신']||0) + (sipseong['상관']||0);
    const gwanC = (sipseong['정관']||0) + (sipseong['편관']||0);
    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0), 1);
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));

    // 재물 유형 판정
    const wealthType = jaeC/total > 0.25 ? 'rich' : jaeC === 0 ? 'none' : 'balance';
    const wealthCore = {
        rich: '편재(偏財)·정재(正財)가 강한 당신의 사주는 돈 냄새를 맡는 감각이 천부적입니다. 어디서 어떻게 돈을 벌어야 할지 본능적으로 압니다. 그러나 재성(財星)이 너무 강하면 일간의 기운을 고갈시켜 "돈은 있는데 건강과 인간관계가 무너지는" 구조가 됩니다. 10가지 기회 중 9가지를 냉정하게 쳐내고, 확실한 1가지에 올인하는 집중력이 당신의 재물 전략입니다. 분산 투자보다 검증된 한 우물을 깊이 파십시오.',
        none: '당신의 원국에 재성(財星)이 약하거나 없습니다. 이른바 무재(無財) 사주라 돈과 인연이 없다고 단정하는 풀이는 완전히 틀렸습니다. 역사적으로 무재 사주에서 큰 부자가 많이 나왔습니다. 이 구조의 비밀은 간단합니다 — 돈을 직접 쫓으면 도망가고, 명예·전문성·브랜드 가치를 올릴 때 돈이 그림자처럼 따라옵니다. 당신은 "나 자신이 상품"이 되는 전략으로 재물을 모아야 합니다.',
        balance: '재성(財星)이 적정 수준으로 균형 잡혀 있습니다. 극단적인 투기보다 꾸준한 복리와 시스템 수익이 당신의 재물 공식입니다. 한 단계씩 차곡차곡 자산을 불려 나가는 스노우볼 전략 — 부동산, 배당수익, 안정적 투자 등 시간이 지날수록 가치가 우상향하는 자산에 집중하십시오.'
    }[wealthType];

    // 재물 획득 루트
    const wealthRoute = sikC/total > 0.2
        ? '당신의 재물 획득 루트는 食傷(식상)입니다. 재능·창의력·표현력이 돈이 됩니다. 콘텐츠 창작, 교육, 컨설팅, 기획, 예술 등 "내 능력을 파는" 방식으로 수익을 만들어야 합니다. 이 루트로 들어온 돈이 가장 크고 오래 갑니다.'
        : gwanC/total > 0.2
        ? '당신의 재물 획득 루트는 官星(관성)입니다. 조직과 직위, 사회적 신뢰가 돈으로 연결됩니다. 승진·직함·인증·자격증이 수입을 올리는 가장 확실한 루트입니다. 명예가 재물을 끌어옵니다.'
        : '당신의 재물 획득 루트는 비견(比肩)과 독립 사업입니다. 남 밑에 있으면 실력의 절반도 발휘하지 못합니다. 직접 판을 짜고 내 사업 영역을 만들 때 재물이 폭발적으로 증가합니다.';

    // 신강신약 × 재물
    const strengthWealth = isStrong
        ? '身强(신강) 사주의 재물은 공격적입니다. 에너지가 넘쳐서 여러 일을 동시에 추진하려는 본능이 있지만, 집중 없는 분산은 재물을 흩뜨립니다. 한 가지에 몰입하는 선택과 집중이 핵심 전략입니다.'
        : '身弱(신약) 사주의 재물은 수비가 중요합니다. 혼자 욕심내다 무너지는 것보다, 든든한 파트너·귀인과 함께 리스크를 분산하며 안정적으로 쌓는 방식이 재물을 지키는 열쇠입니다.';

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 4. 평생 재물운 — 나만의 금고를 여는 열쇠</h3>
        <p class="ch-text">명리학에서 재성(財星)은 단순히 통장 잔고의 액수가 아닙니다. "내가 세상을 내 뜻대로 통제하고 다루는 힘"입니다. 당신이 세상을 상대로 얼마나 넓은 영토를 지배할 수 있는지, 그 권력의 크기가 바로 당신의 재물운입니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:20px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">재물 구조 분석</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0;">${wealthCore}</p>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:16px;margin:14px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">재물 획득 최적 루트</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">${wealthRoute}</p>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:16px;margin:14px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">신강·신약(身强·身弱)과 재물 전략</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">${strengthWealth}</p>
        </div>
        <p class="ch-text">재물의 그릇은 고정된 것이 아닙니다. 用神(용신) 기운이 강해지는 대운에서 그릇이 커지고, 忌神(기신) 기운의 대운에서는 방어가 중요합니다. 재물의 크기를 결정하는 것은 타고난 사주가 아니라, 그 사주의 기운을 얼마나 정확하게 활용하느냐입니다. 당신의 진짜 금고는 아직 열리지 않았습니다.</p>
    </div>`;
}'''

html = replace_func(html, 'buildChapter4_Wealth', ch4)

# ── 세운 대폭 확장 ──
sewun = '''function buildSewunLoop(data) {
    const currentYear = new Date().getFullYear();
    const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const JI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const GAN_KR = {'甲':'갑(甲)','乙':'을(乙)','丙':'병(丙)','丁':'정(丁)','戊':'무(戊)','己':'기(己)','庚':'경(庚)','辛':'신(辛)','壬':'임(壬)','癸':'계(癸)'};
    const JI_KR = {'子':'자(子)','丑':'축(丑)','寅':'인(寅)','卯':'묘(卯)','辰':'진(辰)','巳':'사(巳)','午':'오(午)','未':'미(未)','申':'신(申)','酉':'유(酉)','戌':'술(戌)','亥':'해(亥)'};
    const GAN_DESC = {
        '甲':'새로운 시작과 성장. 사업 확장, 새 프로젝트 출발, 계획 수립에 유리.',
        '乙':'유연한 적응. 관계 구축, 협상, 네트워킹에 강한 기운.',
        '丙':'강렬한 열정과 표현. 자신을 알리고 드러내는 시기. 홍보·마케팅 유리.',
        '丁':'세밀한 집중. 내실을 다지고 깊이 파고드는 시기. 전문성 강화.',
        '戊':'묵직한 중심. 안정·신뢰 구축. 장기 투자와 부동산 관련 기운.',
        '己':'실용적 마무리. 기존 프로젝트 정리, 실속 챙기기. 꼼꼼한 관리.',
        '庚':'결단과 쇄신. 불필요한 것을 쳐내고 새 기준을 세우는 시기.',
        '辛':'정밀한 완성. 디테일에 집중하고 품질을 높이는 시기.',
        '壬':'흐름과 확산. 인맥 확장, 유동적 투자, 여행·이동 기운.',
        '癸':'내면 충전. 분석·연구·학습. 조용히 내공을 쌓는 시기.'
    };
    const JI_DESC = {
        '子':'지혜와 집중. 아이디어가 넘치는 시기. 문서·계약에 유리.',
        '丑':'인내와 저력. 눈에 띄지 않는 성실함이 미래 토대를 쌓음.',
        '寅':'활동과 도전. 새로운 출발, 이동, 변화의 기운이 강함.',
        '卯':'관계와 성장. 인맥이 확장되고 협력 기회가 생김.',
        '辰':'잠재력 발동. 예상치 못한 기회와 변수가 공존. 신중히 대응.',
        '巳':'집중과 변신. 결단력이 필요한 시기. 큰 변화의 전조.',
        '午':'성취와 인정. 사회적 성과가 드러나는 화려한 시기.',
        '未':'감성과 풍요. 창작·문화·예술 분야에서 결실을 맺음.',
        '申':'판단과 결단. 빠른 결정이 필요. 민첩한 대응이 성패 가름.',
        '酉':'완성과 보상. 그동안의 노력이 결실로 돌아오는 시기.',
        '戌':'통찰과 마무리. 깊은 성찰과 정리가 필요한 마무리 국면.',
        '亥':'잠복과 준비. 표면적 침체지만 내면의 힘이 충전되는 시기.'
    };

    // 용신/기신 기반 연도 평가
    const STEM_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const BRANCH_OH = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    const yong = data.yong || ''; const hee = data.hee || ''; const gi = data.gi || ''; const goo = data.goo || '';
    
    function scoreYear(stem, branch) {
        const sOh = STEM_OH[stem]; const bOh = BRANCH_OH[branch];
        let score = 0;
        if(sOh===yong||sOh===hee) score+=2; if(sOh===gi||sOh===goo) score-=2;
        if(bOh===yong||bOh===hee) score+=2; if(bOh===gi||bOh===goo) score-=2;
        return score;
    }
    function scoreLabel(s) { return s>=3?'대길(大吉)':s>=1?'길(吉)':s===0?'평(平)':s>=-2?'주의(注意)':'흉(凶)'; }
    function scoreColor(s) { return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c'; }

    let rows = '';
    for(let i=0; i<10; i++) {
        const yr = currentYear + i;
        const ganIdx = ((yr - 4) % 10 + 10) % 10;
        const jiIdx = ((yr - 4) % 12 + 12) % 12;
        const stem = GAN[ganIdx]; const branch = JI[jiIdx];
        const hanja = stem + branch;
        const score = scoreYear(stem, branch);
        const label = scoreLabel(score); const col = scoreColor(score);
        const isNow = i===0;

        rows += `<div style="background:rgba(255,255,255,${isNow?'0.07':'0.03'});border-radius:10px;padding:16px;border:1px solid ${isNow?'var(--gold)':'rgba(255,255,255,0.07)'};break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:22px;font-weight:800;color:var(--gold);font-family:'Noto Serif KR',serif;">${hanja}</span>
                    <span style="font-size:13px;color:#aaa;">${yr}년 ${GAN_KR[stem]} ${JI_KR[branch]}년</span>
                    ${isNow?'<span style="font-size:11px;background:var(--gold);color:#000;padding:2px 8px;border-radius:10px;font-weight:700;">올해</span>':''}
                </div>
                <span style="font-size:13px;font-weight:700;color:${col};padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">${label}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">천간(天干) ${stem}</div>
                    <div style="font-size:12px;color:#ddd;line-height:1.65;">${GAN_DESC[stem]||''}</div>
                </div>
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">지지(地支) ${branch}</div>
                    <div style="font-size:12px;color:#ddd;line-height:1.65;">${JI_DESC[branch]||''}</div>
                </div>
            </div>
        </div>`;
    }

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 11. 향후 10년 세운(歲運) 정밀 타격</h3>
        <p class="ch-text">대운(大運)이 10년의 기후라면, 세운(歲運)은 그해의 날씨입니다. 올해부터 향후 10년간 당신에게 어떤 바람이 불고 어떤 해가 뜰지 예측합니다. 매년 당신의 원국 기운이 그해의 기운과 충돌하며 만들어내는 서사입니다. 용신(用神) 기운이 들어오는 해는 집중 공략하고, 기신(忌神) 기운의 해는 수비에 집중하십시오.</p>
        <div style="display:flex;flex-direction:column;gap:12px;">${rows}</div>
    </div>`;
}'''

html = replace_func(html, 'buildSewunLoop', sewun)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"1차 저장 | {len(html):,} bytes")
