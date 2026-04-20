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

# ── 월운 대폭 확장 ──
wolun = '''function buildWolunLoop(data) {
    const yr = new Date().getFullYear();
    const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const JI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const JI_KR = {'子':'자(子)','丑':'축(丑)','寅':'인(寅)','卯':'묘(卯)','辰':'진(辰)','巳':'사(巳)','午':'오(午)','未':'미(未)','申':'신(申)','酉':'유(酉)','戌':'술(戌)','亥':'해(亥)'};
    const MONTH_NAME = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
    // 월건 지지: 인월(1월)부터
    const MONTH_JI_BASE = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];
    // 월건 천간: 연간에 따라 결정
    const YR_GAN_IDX = ((yr - 4) % 10 + 10) % 10;
    // 월천간 기준: 甲·己년 = 丙寅月부터, 乙·庚 = 戊寅月, 丙·辛 = 庚寅月, 丁·壬 = 壬寅月, 戊·癸 = 甲寅月
    const MONTH_GAN_START = [2,4,6,8,0][YR_GAN_IDX % 5]; // 인월 천간 인덱스

    const MONTH_THEME = [
        {key:'인(寅)월 — 봄의 시작', advice:'새로운 프로젝트를 기획하고 씨앗을 뿌리기에 최적의 달. 귀인의 도움과 새 출발의 기운이 강합니다. 이 달에 시작한 일은 가속도가 붙습니다.', action:'새 계획 수립, 인맥 확장, 첫 행동'},
        {key:'묘(卯)월 — 봄의 성장', advice:'관계와 협력이 꽃피는 달. 주변 사람들과 시너지를 만들고, 숨어있던 기회가 수면 위로 올라옵니다. 의사소통을 적극적으로 하십시오.', action:'협업 제안, 미팅, 네트워킹'},
        {key:'진(辰)월 — 봄의 결실', advice:'예상치 못한 기회와 변수가 공존하는 달. 신중하게 대응하되, 숨겨진 잠재력이 발동할 수 있습니다. 큰 결정은 신중하게.', action:'점검, 조율, 변수 대응'},
        {key:'사(巳)월 — 여름의 문', advice:'결단력이 필요한 달. 오래 미뤄온 결정을 내려야 할 시점입니다. 큰 변화의 전조가 있으며, 에너지가 폭발적으로 활성화됩니다.', action:'중요 결정, 계약, 변화 실행'},
        {key:'오(午)월 — 여름의 절정', advice:'사회적 성과가 드러나는 화려한 달. 그동안의 노력이 인정받고 주목받는 시기입니다. 자신을 적극적으로 알리십시오.', action:'발표, 홍보, 성과 공유'},
        {key:'미(未)월 — 여름의 마무리', advice:'감성과 창의력이 풍부해지는 달. 창작 활동과 문화적 활동에서 결실을 맺습니다. 너무 무리하지 말고 컨디션 관리에 유의.', action:'창작, 휴식, 내실 다지기'},
        {key:'신(申)월 — 가을의 시작', advice:'판단력과 결단력이 요구되는 달. 빠른 결정이 성패를 가릅니다. 민첩하게 대응하되 충동적 결정은 피하십시오.', action:'신속한 의사결정, 기회 포착'},
        {key:'유(酉)월 — 가을의 성숙', advice:'그동안의 노력에 대한 보상이 돌아오는 달. 완성도를 높이고 마무리 작업에 집중하십시오. 수확의 기운이 강합니다.', action:'마무리, 정리, 보상 수취'},
        {key:'술(戌)월 — 가을의 황혼', advice:'깊은 성찰과 정리가 필요한 달. 불필요한 것을 버리고 핵심에 집중하는 시기. 내면의 목소리에 귀를 기울이십시오.', action:'정리, 성찰, 인간관계 재정비'},
        {key:'해(亥)월 — 겨울의 시작', advice:'표면적으로 침체처럼 보이지만 내면의 힘이 충전되는 달. 무리한 행동보다 에너지 축적에 집중. 내공을 쌓는 시기.', action:'학습, 연구, 준비'},
        {key:'자(子)월 — 겨울의 절정', advice:'지혜와 집중력이 극대화되는 달. 아이디어가 폭발적으로 나오는 시기. 문서, 계약, 기획에 유리합니다.', action:'기획, 문서 작업, 전략 수립'},
        {key:'축(丑)월 — 겨울의 마무리', advice:'인내와 저력의 달. 눈에 띄지 않는 성실함이 미래의 토대를 쌓습니다. 조급해하지 말고 꾸준히 나아가십시오.', action:'꾸준한 실행, 기반 다지기'}
    ];

    // 용신/기신 기반 월 평가
    const BRANCH_OH = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    const STEM_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const yong=data.yong||''; const hee=data.hee||''; const gi=data.gi||''; const goo=data.goo||'';
    function mScore(mGan, mJi) {
        let s=0;
        const gOh=STEM_OH[mGan]; const jOh=BRANCH_OH[mJi];
        if(gOh===yong||gOh===hee)s+=2; if(gOh===gi||gOh===goo)s-=2;
        if(jOh===yong||jOh===hee)s+=2; if(jOh===gi||jOh===goo)s-=2;
        return s;
    }
    function mLabel(s){return s>=3?'대길':'길(吉)'; }
    function mColor(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
    function mBadge(s){return s>=3?'🌟':s>=1?'✦':s===0?'—':s>=-2?'⚠':'❌';}

    const curMonth = new Date().getMonth(); // 0-based
    // 이번 연도 인월부터 12개월
    const rows = Array.from({length:12}).map((_,i)=>{
        const mJi = MONTH_JI_BASE[i];
        const mGanIdx = (MONTH_GAN_START + i) % 10;
        const mGan = GAN[mGanIdx];
        const hanja = mGan + mJi;
        const score = mScore(mGan, mJi);
        const col = mColor(score); const badge = mBadge(score);
        const isNow = i === curMonth;
        const theme = MONTH_THEME[i];
        return `<div style="background:rgba(255,255,255,${isNow?'0.07':'0.03'});border-radius:10px;padding:14px 16px;border-left:3px solid ${col};break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:20px;font-weight:800;color:var(--gold);font-family:'Noto Serif KR',serif;">${hanja}</span>
                    <span style="font-size:12px;color:#aaa;">${MONTH_NAME[i]} · ${theme.key}</span>
                    ${isNow?'<span style="font-size:10px;background:var(--gold);color:#000;padding:1px 7px;border-radius:8px;font-weight:700;">이번달</span>':''}
                </div>
                <span style="font-size:16px;">${badge}</span>
            </div>
            <p style="font-size:13px;color:#ccc;line-height:1.75;margin:0 0 6px;">${theme.advice}</p>
            <div style="font-size:11px;color:${col};">추천 행동: ${theme.action}</div>
        </div>`;
    }).join('');

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 12. ${yr}년 12개월 작전 지도 — 월운(月運)</h3>
        <p class="ch-text">세운(歲運)이 한 해의 날씨라면, 월운(月運)은 그날의 시간별 일기예보입니다. 언제 액셀을 밟고 언제 브레이크를 밟아야 하는지 — 12개월 전략 지도를 활용하십시오. 용신(用神) 기운의 달에는 중요한 결정과 행동을, 기신(忌神) 기운의 달에는 수비와 내공 축적에 집중하십시오.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            ${rows}
        </div>
    </div>`;
}'''

html = replace_func(html, 'buildWolunLoop', wolun)

# ── 신강신약 요약 대폭 확장 ──
strength = '''function buildStrengthSummary(data) {
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));
    const strengthTitle = isStrong ? '身强(신강) — 에너지가 넘치는 능동형 기질' : '身弱(신약) — 협력과 귀인을 통해 빛나는 기질';
    const text = isStrong
        ? '기운이 충만한 당신은 주도적으로 세상을 이끌어가는 자리에 있어야 진정한 능력이 발현됩니다. 남의 지시를 받기보다 내 판을 직접 짜는 창업·프리랜서·전문직에서 빛을 발합니다. 강한 기운을 억누르려 하면 오히려 내부에서 폭발합니다. 이 에너지를 쏟아부을 적합한 무대를 찾는 것이 인생의 핵심 과제입니다.'
        : '기운이 분산된 사주는 혼자 모든 것을 짊어지면 무너집니다. 훌륭한 파트너·팀·귀인과 함께할 때 1+1이 10이 되는 폭발적 시너지를 경험합니다. 좋은 사람을 알아보고 협력하는 능력이 인생 전략의 핵심입니다.';
    const advice = isStrong
        ? '⚠ 주의사항: 독단적인 결정과 과잉 에너지로 인한 인간관계 마찰을 조심하십시오. 강한 기운을 사회적으로 인정받는 방향으로 분출해야 합니다.'
        : '✦ 전략: 용신(用神) 기운이 강해지는 대운과 세운에서 가장 크게 도약합니다. 용신 기운을 가진 귀인과의 만남을 적극적으로 만들어가십시오.';
    return `<div class="inline-interp">
        <div class="ii-label">✦ 신강·신약(身强·身弱) 해석</div>
        <div class="ii-title">${strengthTitle}</div>
        <div class="ii-text">
            <p style="margin-bottom:12px;">${text}</p>
            <div style="background:rgba(199,167,106,0.07);border-radius:8px;padding:12px 14px;font-size:13px;color:#bbb;line-height:1.75;">${advice}</div>
        </div>
    </div>`;
}'''

html = replace_func(html, 'buildStrengthSummary', strength)

# ── 합충형파해 관계 요약 대폭 확장 ──
relation = '''function buildRelationSummary(data) {
    const interactions = data.interactions || [];
    
    const typeDesc = {
        '합':'합(合) — 두 기운이 결합하여 새로운 에너지를 만들어냅니다. 인연, 계약, 협력이 이루어지는 긍정적 신호입니다.',
        '충':'충(沖) — 두 기운이 정면 충돌합니다. 변화, 이동, 갈등의 에너지입니다. 위기이자 기회 — 어떻게 대응하느냐가 결과를 결정합니다.',
        '형':'형(刑) — 서로를 손상시키는 기운입니다. 법적 문제, 인간관계 마찰, 건강 이상에 주의가 필요합니다.',
        '파':'파(破) — 기운이 깨지고 분열됩니다. 관계나 계획의 균열. 세심한 점검이 필요합니다.',
        '해':'해(害) — 서로를 방해하고 해치는 기운입니다. 배신, 방해, 엇갈림이 발생할 수 있습니다.'
    };
    
    if(!interactions || interactions.length === 0) {
        return `<div class="inline-interp">
            <div class="ii-label">✦ 합·충·형·파·해 해석</div>
            <div class="ii-title">안정적인 원국 구조</div>
            <div class="ii-text">
                <p>원국 내 충돌하는 특별한 합충형파해가 감지되지 않았습니다. 이는 비교적 안정적이고 예측 가능한 에너지 흐름을 가진 원국입니다.</p>
                <p style="margin-top:10px;color:#999;">합충형파해는 좋고 나쁨의 문제가 아닙니다. 충(沖)이 없으면 변화도 없고, 합(合)이 없으면 인연도 없습니다. 이 에너지들이 어떻게 작동하느냐가 인생의 서사를 만듭니다.</p>
            </div>
        </div>`;
    }
    
    const rows = interactions.map(rel => {
        const typeKey = Object.keys(typeDesc).find(k => rel.type && rel.type.includes(k)) || '';
        const desc = window.SAJU_DB?.INTERACTION?.[rel.type] || typeDesc[typeKey] || (rel.type + ' 관계가 작용합니다.');
        return `<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px 14px;margin-bottom:10px;">
            <div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:6px;">${rel.chars||''} · ${rel.type||''}</div>
            <p style="font-size:13px;color:#ccc;line-height:1.75;margin:0;">${desc}</p>
        </div>`;
    }).join('');
    
    return `<div class="inline-interp">
        <div class="ii-label">✦ 합·충·형·파·해 해석</div>
        <div class="ii-title">원국의 충돌과 결합 — 운명의 코드</div>
        <div class="ii-text">
            ${rows}
            <p style="margin-top:12px;color:#999;font-size:13px;line-height:1.75;">이 관계들은 당신이 살면서 반복적으로 경험하는 패턴의 원형입니다. 합(合)이 있는 기운과의 인연은 쉽게 맺어지고, 충(沖)이 있는 기운과는 긴장 관계가 형성됩니다. 이것을 알면 인간관계와 중요 결정에서 한발 앞서 대응할 수 있습니다.</p>
        </div>
    </div>`;
}'''

html = replace_func(html, 'buildRelationSummary', relation)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
