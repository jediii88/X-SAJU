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
    kr = len([c for c in new_code if '\uAC00' <= c <= '\uD7A3'])
    print(f"{fn_name}: 교체 ({len(new_code)//1024}KB / 한글{kr}자)")
    return html

# ── Ch5: 직업운 대폭 확장 ──
ch5 = r'''function buildChapter5_Career(data) {
    const sipseong = data.sipseong || {};
    const gwanC = (sipseong['정관']||0) + (sipseong['편관']||0);
    const sikC = (sipseong['식신']||0) + (sipseong['상관']||0);
    const inC = (sipseong['정인']||0) + (sipseong['편인']||0);
    const jaeC = (sipseong['정재']||0) + (sipseong['편재']||0);
    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0), 1);
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem]||'earth';
    const isStrong = data.strengthText && data.strengthText.includes('신강');

    // 직업 유형 판정
    let typeKey = 'creator';
    if(gwanC/total > 0.22) typeKey = 'officer';
    else if(inC/total > 0.22) typeKey = 'expert';
    else if(jaeC/total > 0.22) typeKey = 'biz';
    else typeKey = 'creator';

    const types = {
        officer: {
            label: '관리형 — 조직과 명예',
            core: '관성(官星)이 강한 당신은 조직의 생리를 본능적으로 이해합니다. 규칙과 위계가 명확한 환경에서 두각을 드러내며, 책임감 있게 시스템을 운영하는 능력이 탁월합니다. 공무원, 대기업, 금융, 법조, 군·경찰 등 체계화된 조직에서 빛을 발합니다.',
            deep: '관성이 강한 사주는 사회적 책임감이 유독 강합니다. 맡은 일에 최선을 다하는 것을 삶의 원칙으로 삼으며, 상사와 부하 모두에게 신뢰를 얻는 능력이 있습니다. 단, 조직 내 정치적 갈등이나 권력 다툼에 에너지를 소진하지 않도록 주의가 필요합니다. 명예를 지키는 것이 재물보다 중요한 가치관이므로, 단기 이익을 위해 원칙을 타협하는 유혹에 강하게 저항하십시오.',
            jobs: '공무원, 판검사, 군인, 경찰, 대기업 임원, 금융권, 의사, 교수, 외교관'
        },
        expert: {
            label: '전문가형 — 지식과 자격',
            core: '인성(印星)이 강한 당신의 경쟁력은 지식과 전문성입니다. 남들이 쉽게 따라올 수 없는 깊이 있는 전문성이 평생 자산이 됩니다. 배우고 익히는 것 자체에서 기쁨을 찾으며, 이 학습 욕구가 당신을 분야 최고 권위자로 만들어줍니다.',
            deep: '인성이 강한 사주는 직관력과 통찰력이 뛰어납니다. 수많은 정보 속에서 핵심을 꿰뚫어보는 능력이 있으며, 이것이 컨설팅·연구·창작 분야에서 독보적인 경쟁력이 됩니다. 다만 배움에 안주하며 실행을 미루는 경향이 있으니, 이론을 실전에 옮기는 결단력을 기르는 것이 성공의 관건입니다. 자격증과 학위가 당신의 재물을 여는 열쇠입니다.',
            jobs: '의사, 변호사, 교수, 연구원, 컨설턴트, 작가, 전문직 강사, 큐레이터, 한의사'
        },
        biz: {
            label: '사업가형 — 재물과 기회',
            core: '재성(財星)이 강한 당신은 돈 냄새를 맡는 감각이 천부적입니다. 기회가 왔을 때 포착하는 속도, 협상하는 능력, 실익을 계산하는 직관이 뛰어납니다. 월급보다 사업소득과 투자소득이 더 잘 맞는 구조입니다.',
            deep: '재성이 강한 사주는 물질적 풍요를 만드는 능력이 타고났습니다. 그러나 너무 많은 기회를 동시에 추구하면 에너지가 분산되어 모두 놓치는 결과가 생깁니다. 선택과 집중이 재물을 극대화하는 열쇠입니다. 사람을 통해 돈이 들어오는 구조(영업, 유통, 플랫폼)에 특히 강한 적성을 보입니다. 파트너와의 신뢰 관계가 사업의 생명선임을 명심하십시오.',
            jobs: '사업가, 유통업, 영업, 부동산, 투자, 무역, 식음료업, 프랜차이즈, 플랫폼 사업'
        },
        creator: {
            label: '창작가형 — 재능과 표현',
            core: '식상(食傷)이 강한 당신의 재능은 창의적 표현입니다. 기존의 틀을 깨고 새로운 것을 만들어내는 능력이 탁월합니다. 남들이 가지 않은 길을 개척하며, 이 독창성이 당신의 가장 큰 경쟁력입니다.',
            deep: '식상이 강한 사주는 상상력과 기획력이 뛰어납니다. 아이디어를 현실로 만들어내는 과정에서 깊은 만족감을 얻으며, 이 열정이 지속적인 성과로 이어집니다. 단, 조직 내 권위에 도전하려는 본능이 직장 생활에서 마찰을 일으킬 수 있습니다. 이 에너지를 창업이나 독립 프리랜서로 승화시키는 것이 가장 이상적입니다. 당신의 재능이 돈이 되는 구조를 만드는 것이 핵심 과제입니다.',
            jobs: '콘텐츠 크리에이터, 디자이너, 작가, 음악가, 강사, 컨설턴트, 스타트업 창업가, 마케터'
        }
    };

    const t = types[typeKey];
    const workStyle = isStrong
        ? '신강(身强) 사주인 당신은 독립적인 환경에서 진가를 발휘합니다. 누군가의 지시 아래 일하면 실력의 절반도 못 씁니다. 스스로 방향을 설정하고 책임지는 구조 — 창업, 전문직, 1인 기업 — 가 당신의 에너지를 100% 활용하는 환경입니다.'
        : '신약(身弱) 사주인 당신은 혼자보다 팀을 이룰 때 폭발적인 시너지를 냅니다. 보완적인 능력을 가진 파트너와의 협업이 당신의 역량을 극대화합니다. 좋은 조직과 훌륭한 상사를 만나는 것이 직업 성공의 핵심 조건입니다.';

    return `<div class="report-chapter">
        <h3 class="ch-title">직업운 — 나만의 무대를 찾아라</h3>
        <p class="ch-text">사주에서 직업운은 단순히 "어떤 직업이 맞느냐"의 문제가 아닙니다. 어떤 환경에서, 어떤 방식으로 일할 때 당신의 에너지가 100% 발현되느냐의 문제입니다. 맞는 무대에 선 사람과 맞지 않는 무대에 선 사람의 차이는 시간이 지날수록 극명하게 벌어집니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:16px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">당신의 직업 유형</div>
            <div style="font-size:16px;font-weight:700;color:var(--gold);margin-bottom:10px;">${t.label}</div>
            <p style="font-size:14px;color:#ddd;line-height:1.85;margin:0;">${t.core}</p>
        </div>
        <p class="ch-text">${t.deep}</p>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;margin:14px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">최적 직업군</div>
            <p style="font-size:13px;color:#bbb;line-height:1.7;margin:0;">${t.jobs}</p>
        </div>
        <p class="ch-text">${workStyle}</p>
        <div style="background:rgba(199,167,106,0.05);border-radius:10px;padding:16px;margin-top:14px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">직업 성공의 핵심 공식</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.8;margin:0;">용신(用神) 기운의 대운이 들어오는 시기에 직업적 전환이나 도전을 시도하면 성공 확률이 극적으로 높아집니다. 기신 기운의 시기에는 현재 위치를 지키고 실력을 쌓는 수비 전략을 택하십시오. 무엇보다 당신이 가장 잘할 수 있는 것 하나에 집중하는 것 — 그것이 직업 성공의 가장 확실한 공식입니다.</p>
        </div>
    </div>`;
}'''

# ── Ch6: 애정운 대폭 확장 ──
ch6 = r'''function buildChapter6_Love(data) {
    const sipseong = data.sipseong || {};
    const gwanC = (sipseong['정관']||0) + (sipseong['편관']||0);
    const inC = (sipseong['정인']||0) + (sipseong['편인']||0);
    const sikC = (sipseong['식신']||0) + (sipseong['상관']||0);
    const jaeC = (sipseong['정재']||0) + (sipseong['편재']||0);
    const dayBranch = data.dayBranch || '';
    const isStrong = data.strengthText && data.strengthText.includes('신강');

    const JI_LOVE = {
        '子':'자(子)의 일지를 가진 당신은 지적이고 감성적인 매력이 있습니다. 상대방의 마음을 깊이 이해하는 공감 능력이 뛰어나며, 한번 마음을 열면 깊은 유대감을 형성합니다. 이성에게 쉽게 다가가지는 않지만, 한번 연결되면 오래가는 관계를 만듭니다.',
        '丑':'축(丑)의 일지는 성실하고 믿음직한 연애 스타일입니다. 화려하지 않지만 꾸준하고 진심 어린 사랑을 합니다. 상대방에게 안정감을 주는 것이 가장 큰 매력이며, 이 신뢰가 장기적인 관계를 만들어냅니다. 단 변화를 두려워하는 경향이 관계에 정체를 가져올 수 있습니다.',
        '寅':'인(寅)의 일지는 열정적이고 주도적인 연애 스타일입니다. 좋아하면 적극적으로 다가가며, 상대방을 이끌고 보호하는 역할을 자연스럽게 맡습니다. 이 에너지가 상대에게는 든든한 안정감으로 느껴집니다. 단 독점욕이 강해 상대에게 숨막힘을 줄 수 있으니 조절이 필요합니다.',
        '卯':'묘(卯)의 일지는 부드럽고 감성적인 연애 스타일입니다. 상대방의 감정에 예민하게 반응하며, 배려와 섬세함으로 관계를 가꿉니다. 이성에게 인기가 많으며 자연스럽게 사람을 끌어당기는 매력이 있습니다.',
        '辰':'진(辰)의 일지는 신비롭고 깊이 있는 매력이 있습니다. 처음엔 알기 어렵지만 알수록 매력이 드러나는 타입입니다. 관계에서 깊이 있는 교감을 원하며, 가벼운 만남보다 의미 있는 인연을 추구합니다.',
        '巳':'사(巳)의 일지는 강한 흡인력과 카리스마를 가집니다. 이성을 사로잡는 매력이 있으며, 연애에서 주도권을 쥐는 경향이 있습니다. 열정적이고 집중적인 사랑을 하지만, 그만큼 이별 후 감정 정리가 오래 걸립니다.',
        '午':'오(午)의 일지는 밝고 활기찬 연애 스타일입니다. 주변을 환하게 만드는 에너지가 있어 이성에게 자연스럽게 인기를 얻습니다. 감정 표현이 솔직하고 직접적이며, 상대방에게 행복한 에너지를 전달합니다.',
        '未':'미(未)의 일지는 따뜻하고 포용적인 연애 스타일입니다. 상대방을 편안하게 만드는 능력이 탁월하며, 관계에서 감정적 안정감을 제공합니다. 예술적 감성과 낭만을 중요하게 여기며, 이것이 관계에 깊이를 더합니다.',
        '申':'신(申)의 일지는 쿨하고 이성적인 연애 스타일입니다. 감정에 휩쓸리지 않고 현실적으로 관계를 바라보는 능력이 있습니다. 이 냉철함이 때로 상대방에게 차갑게 느껴질 수 있으니, 의도적으로 감정을 표현하는 연습이 필요합니다.',
        '酉':'유(酉)의 일지는 세련되고 완성도 높은 매력이 있습니다. 미적 감각이 뛰어나며 자신을 잘 가꿉니다. 관계에서 완벽함을 추구하는 경향이 있어 때로 상대에게 부담을 줄 수 있으니, 불완전함도 관계의 일부임을 받아들이는 것이 중요합니다.',
        '戌':'술(戌)의 일지는 깊고 진지한 연애를 합니다. 한번 마음을 주면 끝까지 지키는 의리 있는 사랑을 하며, 상대방에게 든든한 울타리가 됩니다. 감정을 쉽게 드러내지 않지만, 행동으로 사랑을 표현하는 스타일입니다.',
        '亥':'해(亥)의 일지는 감성적이고 낭만적인 연애를 합니다. 깊은 교감을 원하며, 정신적인 연결을 육체적 연결보다 중요하게 여깁니다. 상대방의 내면을 이해하고 싶어하며, 이 깊이가 오래 지속되는 관계를 만들어냅니다.'
    };

    const loveStyle = gwanC > 0
        ? '관성(官星)이 있는 당신에게 이성 인연은 사회 활동이 활발해지는 시기에 집중됩니다. 직장, 학교, 모임 등 공식적인 공간에서 의미 있는 인연을 만날 가능성이 높습니다. 당신의 책임감과 신뢰감이 상대방에게 강한 안정감을 주는 매력입니다.'
        : jaeC > 0
        ? '재성(財星)이 있는 당신은 연애에서도 현실적이고 주도적입니다. 상대방을 잘 챙기고 풍요로운 환경을 만들어주는 것에 보람을 느낍니다. 이성에게 인기가 많고 기회도 많지만, 선택의 기준을 명확히 하는 것이 중요합니다.'
        : sikC > 0
        ? '식상(食傷)이 강한 당신의 연애 매력은 창의적인 표현력과 자유로운 에너지입니다. 틀에 박힌 연애보다 새롭고 설레는 경험을 추구하며, 상대방을 즐겁게 만드는 능력이 탁월합니다. 단 변화를 좋아하는 성향이 안정적인 관계 유지에 도전이 될 수 있습니다.'
        : '인성(印星)이 강한 당신은 연애에서 헌신적이고 깊이 있는 사랑을 합니다. 상대방의 성장을 돕고 싶어하며, 정신적인 교감을 가장 중요하게 여깁니다. 이 진심 어린 헌신이 오래가는 인연의 토대가 됩니다.';

    const timing = isStrong
        ? '신강 사주의 인연 타이밍은 활동이 많고 사회적으로 활발한 시기에 집중됩니다. 용신 기운의 대운·세운에서 의미 있는 만남이 이루어집니다.'
        : '신약 사주의 인연은 귀인을 통해 연결되는 경우가 많습니다. 인성·비겁 기운의 시기에 든든한 파트너를 만날 가능성이 높습니다.';

    const jiLove = JI_LOVE[dayBranch] || '일지의 기운이 당신의 연애 스타일을 만들어냅니다. 배우자와의 관계는 일지와 월지의 관계에서 많은 것이 드러납니다.';

    return `<div class="report-chapter">
        <h3 class="ch-title">애정운 — 닫힌 문을 여는 열쇠</h3>
        <p class="ch-text">사주에서 애정운은 일지(日支)에 그 핵심이 담겨 있습니다. 일지는 배우자 자리이자, 내가 이성을 대하는 방식, 내면 깊숙이 원하는 사랑의 형태를 보여줍니다. 겉으로 드러난 연애 스타일과 내면에서 원하는 사랑 사이의 간극을 아는 것이 관계 성공의 첫 단계입니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:16px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">일지(日支) ${dayBranch} 분석</div>
            <p style="font-size:14px;color:#ddd;line-height:1.85;margin:0;">${jiLove}</p>
        </div>
        <p class="ch-text">${loveStyle}</p>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;margin:14px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">인연의 타이밍</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.8;margin:0;">${timing}</p>
        </div>
        <p class="ch-text">결혼과 장기 파트너십은 단순한 감정이 아니라 두 사람의 사주 에너지가 서로를 보완하는 구조일 때 가장 안정적으로 유지됩니다. 나의 부족한 오행을 채워주는 사람, 나의 용신 기운을 가진 사람과의 인연이 가장 이상적인 파트너입니다. 겉으로 보이는 조건보다 그 사람의 기운이 나와 어떻게 공명하는지를 느끼는 것이 진정한 인연의 감각입니다.</p>
    </div>`;
}'''

# ── Ch7: 지장간 대폭 확장 ──
ch7 = r'''function buildChapter7_Hidden(data) {
    const pillars = data.pillars || [];
    const BRANCH_HIDDEN_KR = {
        '子':'임(壬)·계(癸)',  '丑':'기(己)·신(辛)·계(癸)',
        '寅':'무(戊)·병(丙)·갑(甲)',  '卯':'갑(甲)·을(乙)',
        '辰':'을(乙)·계(癸)·무(戊)',  '巳':'무(戊)·경(庚)·병(丙)',
        '午':'기(己)·정(丁)',  '未':'정(丁)·을(乙)·기(己)',
        '申':'무(戊)·임(壬)·경(庚)',  '酉':'경(庚)·신(辛)',
        '戌':'신(辛)·정(丁)·무(戊)',  '亥':'무(戊)·갑(甲)·임(壬)'
    };
    const HIDDEN_MEANING = {
        '子':'깊은 지혜와 내면의 두뇌. 겉으로 드러나지 않는 전략적 사고력.',
        '丑':'인내와 축적의 에너지. 보이지 않게 쌓이는 저력.',
        '寅':'성장과 도전 에너지. 내면의 리더십과 개척 정신.',
        '卯':'창의력과 감수성. 내면 깊은 곳의 예술적 감각.',
        '辰':'변화와 잠재력. 예측 불가능한 가능성의 보고.',
        '巳':'집중과 통찰. 내면의 결단력과 변화 에너지.',
        '午':'열정과 표현욕. 속에 숨겨진 뜨거운 감성.',
        '未':'포용과 공감. 내면의 따뜻한 인정.',
        '申':'실행력과 판단력. 내면의 강인한 결정력.',
        '酉':'완성과 정밀함. 내면의 완벽주의 성향.',
        '戌':'통찰과 지킴. 내면의 강한 의리와 보수성.',
        '亥':'상상력과 감수성. 내면 깊은 낭만과 직관력.'
    };

    const branches = pillars.map(p => p.slice(1));
    const rows = branches.map((b, i) => {
        const names = ['시지','일지','월지','연지'];
        const hidden = BRANCH_HIDDEN_KR[b] || '정(丁)·무(戊)';
        const meaning = HIDDEN_MEANING[b] || '';
        return `<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;break-inside:avoid;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:20px;font-weight:800;color:var(--gold);font-family:'Noto Serif KR',serif;">${b}</span>
                <span style="font-size:12px;color:#888;">${names[i]} 지장간</span>
            </div>
            <div style="font-size:13px;color:#aaa;margin-bottom:6px;">${hidden}</div>
            <p style="font-size:13px;color:#ccc;line-height:1.7;margin:0;">${meaning}</p>
        </div>`;
    }).join('');

    return `<div class="report-chapter">
        <h3 class="ch-title">지장간 — 빙산 아래의 욕망</h3>
        <p class="ch-text">사주의 8글자는 빙산의 일