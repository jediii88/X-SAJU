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

# buildChapter1_Basic → 원국 아래 4주 전체 상세 풀이 박스로 확장
new_ch1 = '''function buildChapter1_Basic(data) {
    const pillars = data.pillars || [];
    const pillarNames = ['연주(年柱)','월주(月柱)','일주(日柱)','시주(時柱)'];
    const pillarDesc = ['조상·가문·초년 환경','부모·청년기·직업 환경','나 자신·배우자 자리','자녀·말년·내면의 소망'];

    // 천간 설명
    const stemDesc = {
        '甲':'갑(甲) — 봄을 여는 큰 나무. 강한 생명력과 개척 정신.',
        '乙':'을(乙) — 바람에 휘어지는 풀. 유연하고 섬세한 적응력.',
        '丙':'병(丙) — 태양. 밝고 열정적이며 표현력이 강함.',
        '丁':'정(丁) — 촛불. 따뜻하고 세밀하며 헌신적임.',
        '戊':'무(戊) — 광활한 대지. 중후하고 포용력이 강함.',
        '己':'기(己) — 기름진 밭. 실용적이고 꼼꼼하며 성실함.',
        '庚':'경(庚) — 단련된 금속. 결단력·원칙·강인함.',
        '辛':'신(辛) — 귀한 보석. 예민하고 완벽주의적.',
        '壬':'임(壬) — 큰 강·바다. 깊은 지혜와 포용력.',
        '癸':'계(癸) — 이슬·빗물. 섬세하고 총명하며 직관력 강함.'
    };
    // 지지 설명
    const branchDesc = {
        '子':'자(子) — 겨울 한복판. 지혜·집중·내면의 힘.',
        '丑':'축(丑) — 얼어붙은 땅. 인내·저력·꾸준함.',
        '寅':'인(寅) — 이른 봄 호랑이. 개척·용기·도전.',
        '卯':'묘(卯) — 봄의 절정. 생명력·관계·표현력.',
        '辰':'진(辰) — 봄 대지의 용. 잠재력·변화·신비.',
        '巳':'사(巳) — 뱀. 예리한 지혜·변신·집중력.',
        '午':'오(午) — 한여름 태양. 열정·성취·카리스마.',
        '未':'미(未) — 여름 황혼. 풍요·감성·예술.',
        '申':'신(申) — 가을 원숭이. 기지·결단·민첩함.',
        '酉':'유(酉) — 가을 수확. 완성도·심미안·보상.',
        '戌':'술(戌) — 가을 황혼 개. 충성·신뢰·통찰.',
        '亥':'해(亥) — 깊은 겨울 바다. 지혜·무한함·잠재력.'
    };
    // 공망
    const gongmangBranches = data.gongmang || [];
    // 지장간 간략 설명
    const hiddenDesc = {
        '子':'계(癸) — 수(水) 단독. 지혜와 통찰의 순수 에너지.',
        '丑':'계(癸)·신(辛)·기(己) — 수(水)·금(金)·토(土). 인내 속에 숨은 복합 재능.',
        '寅':'무(戊)·병(丙)·갑(甲) — 토(土)·화(火)·목(木). 폭발적 성장 잠재력.',
        '卯':'갑(甲)·을(乙) — 목(木) 집중. 강한 추진력과 예술성.',
        '辰':'을(乙)·계(癸)·무(戊) — 목(木)·수(水)·토(土). 숨겨진 능력의 창고.',
        '巳':'무(戊)·경(庚)·병(丙) — 토(土)·금(金)·화(火). 예리한 결단력.',
        '午':'병(丙)·기(己)·정(丁) — 화(火)·토(土). 강렬한 열정과 표현력.',
        '未':'정(丁)·을(乙)·기(己) — 화(火)·목(木)·토(土). 감성과 창의력.',
        '申':'무(戊)·임(壬)·경(庚) — 토(土)·수(水)·금(金). 날카로운 지략.',
        '酉':'경(庚)·신(辛) — 금(金) 집중. 정밀함과 완성도.',
        '戌':'신(辛)·정(丁)·무(戊) — 금(金)·화(火)·토(土). 깊은 통찰과 신뢰.',
        '亥':'무(戊)·갑(甲)·임(壬) — 토(土)·목(木)·수(水). 무한한 잠재력.'
    };

    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));

    // 4주 박스 생성
    const pillarBoxes = pillars.map((p, idx) => {
        const hanja = p.h ? p.h.join('') : '';
        const stem = p.h ? p.h[0] : '';
        const branch = p.h ? p.h[1] : '';
        const sipseongVal = (data.pillars_sipseong || [])[idx] || '';
        const unseong = (data.pillars && window.UNSUNG_MAP?.[data.dayStem]?.[branch]) || '';
        const isGongmang = gongmangBranches.includes(branch);
        const boxColor = idx===2 ? 'rgba(199,167,106,0.1)' : 'rgba(255,255,255,0.03)';
        const borderColor = idx===2 ? 'var(--gold)' : 'rgba(255,255,255,0.1)';

        return `<div style="background:${boxColor};border:1px solid ${borderColor};border-radius:12px;padding:18px;break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div>
                    <span style="font-size:11px;color:var(--text-dim);letter-spacing:1px;">${pillarNames[idx]}</span>
                    <div style="font-size:22px;font-weight:800;color:${idx===2?'var(--gold)':'#ddd'};font-family:'Noto Serif KR',serif;margin-top:2px;">${hanja}</div>
                </div>
                <div style="text-align:right;font-size:12px;color:#888;">${pillarDesc[idx]}${isGongmang?'<br><span style="color:#e74c3c;font-weight:700;">공망(空亡)</span>':''}</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;letter-spacing:1px;">천간(天干)</div>
                    <div style="font-size:12px;color:#ddd;line-height:1.6;">${stemDesc[stem] || stem}</div>
                </div>
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;letter-spacing:1px;">지지(地支)</div>
                    <div style="font-size:12px;color:#ddd;line-height:1.6;">${branchDesc[branch] || branch}</div>
                </div>
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;letter-spacing:1px;">지장간(地藏干)</div>
                    <div style="font-size:12px;color:#bbb;line-height:1.6;">${hiddenDesc[branch] || '-'}</div>
                </div>
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;letter-spacing:1px;">12운성(運星)</div>
                    <div style="font-size:14px;font-weight:700;color:var(--gold);">${unseong || '-'}</div>
                </div>
            </div>
            ${sipseongVal ? `<div style="font-size:11px;color:rgba(199,167,106,0.7);padding:6px 10px;background:rgba(199,167,106,0.05);border-radius:6px;">십성(十星): <b>${sipseongVal}</b></div>` : ''}
        </div>`;
    }).join('');

    const strengthDesc = isStrong
        ? '身强(신강) — 기운이 충만. 자율권이 보장된 환경에서 폭발적 능력 발휘.'
        : '身弱(신약) — 기운이 분산. 좋은 파트너와 협력할 때 1+1이 10이 됨.';

    return `<div class="report-chapter">
        <h3 class="ch-title">사주 원국(四柱 原局) 전체 해설</h3>
        <p class="ch-text">사주 8자(여덟 글자)는 단순한 기호가 아닙니다. 각 글자마다 고유한 에너지와 의미를 담고 있으며, 이 글자들의 조합이 당신 인생의 고유한 설계도를 만들어냅니다.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0;">
            ${pillarBoxes}
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px;margin-top:4px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">일간 강약 판정</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.8;margin:0;">${strengthDesc}</p>
        </div>
        ${dbEntry.core ? `<div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:14px 16px;border-radius:0 8px 8px 0;margin-top:14px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">일주(日柱) 핵심 분석</div><p style="font-size:14px;color:#ddd;line-height:1.9;margin:0;">${dbEntry.core}</p></div>` : ''}
    </div>`;
}'''

html = replace_func(html, 'buildChapter1_Basic', new_ch1)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
