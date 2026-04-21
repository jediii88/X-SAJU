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
    print(f"{fn_name}: 교체 성공 ({len(new_code):,}b)")
    return html

# ── buildDaewunLoop 대폭 확장 ──
daewun = r'''function buildDaewunLoop(data) {
    const rows = data.daeunRows || [];
    if(!rows.length) return `<div class="report-chapter"><h3 class="ch-title">대운 80년 심층 해부</h3><p class="ch-text">대운 데이터를 계산할 수 없습니다. 생년월일시를 정확히 입력해주세요.</p></div>`;

    const OH = {'甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수'};
    const JI_OH = {'子':'수','丑':'토','寅':'목','卯':'목','辰':'토','巳':'화','午':'화','未':'토','申':'금','酉':'금','戌':'토','亥':'수'};
    const GAN_DESC = {
        '甲':'갑목(甲木)의 해는 새로운 시작과 도전의 기운입니다. 이 시기는 마치 봄에 새싹이 힘차게 돋아나듯, 새로운 프로젝트와 관계가 시작되는 시기입니다. 두려움 없이 앞으로 나아가야 하며, 첫발을 내딛는 용기가 이 시기의 핵심 덕목입니다.',
        '乙':'을목(乙木)의 기운은 유연한 적응력입니다. 강한 바람에도 꺾이지 않는 덩굴처럼, 상황에 따라 방향을 바꾸면서도 목표를 향해 나아가는 전략이 필요합니다. 인간관계와 네트워크가 이 시기의 핵심 자산입니다.',
        '丙':'병화(丙火)의 대운은 태양처럼 모든 것을 밝히는 시기입니다. 사회적 인정과 명성이 따르며, 오랫동안 준비해온 것이 세상에 드러납니다. 자신을 적극적으로 알리고 표현하는 것이 이 시기를 극대화하는 방법입니다.',
        '丁':'정화(丁火)의 기운은 촛불처럼 집중적이고 세밀합니다. 화려한 외면보다 깊이 있는 내실을 다지는 시기입니다. 한 분야에 집중하여 전문성을 높이면 이 시기의 에너지가 폭발적으로 활성화됩니다.',
        '戊':'무토(戊土)의 대운은 묵직한 산처럼 안정적인 기반을 만드는 시기입니다. 장기적인 투자와 부동산, 사업 기반 확장에 유리합니다. 성급함을 버리고 10년 후를 내다보는 안목으로 뿌리를 내려야 합니다.',
        '己':'기토(己土)의 기운은 비옥한 농토처럼 실용적입니다. 이전에 뿌린 씨앗들이 실질적인 결과물로 돌아오는 시기입니다. 꼼꼼한 관리와 내실 있는 운영이 이 시기를 빛나게 합니다.',
        '庚':'경금(庚金)의 대운은 도끼처럼 불필요한 것을 쳐내고 핵심에 집중하는 시기입니다. 과감한 결단과 구조 개혁이 필요합니다. 오래된 관습과 비효율을 제거하고 새로운 기준을 세울 때 이 에너지가 빛을 발합니다.',
        '辛':'신금(辛金)의 기운은 보석을 세공하듯 정밀하게 완성도를 높이는 시기입니다. 디테일에 집중하고 품질을 극대화할 때 최고의 결과물이 나옵니다. 이 시기에 완성된 작업이 오래도록 가치를 인정받습니다.',
        '壬':'임수(壬水)의 대운은 큰 강처럼 에너지가 넓게 확산되는 시기입니다. 인맥이 폭발적으로 확장되고 새로운 기회가 사방에서 찾아옵니다. 다만 너무 많은 방향으로 분산되지 않도록 핵심 목표를 명확히 유지해야 합니다.',
        '癸':'계수(癸水)의 기운은 깊은 지하수처럼 내면을 충전하는 시기입니다. 외부 활동보다 내공을 쌓고, 분석하고 연구하는 것이 이 시기의 핵심입니다. 조용히 준비한 것들이 다음 대운에서 폭발적으로 발현됩니다.'
    };
    const JI_DESC = {
        '子':'자(子)의 지지는 지혜와 집중력의 절정입니다. 분석력이 극대화되고 아이디어가 샘솟는 시기입니다. 문서 작업, 계획 수립, 자격증 취득에 유리한 에너지입니다. 단 감정 기복이 생길 수 있으니 내면의 평정심을 유지하는 것이 중요합니다.',
        '丑':'축(丑)의 지지는 인내와 저력의 시기입니다. 눈에 보이는 성과보다 보이지 않는 내공이 쌓이는 기간입니다. 이 시기를 묵묵히 견디며 쌓은 실력이 이후 대운에서 폭발적인 결과로 이어집니다.',
        '寅':'인(寅)의 지지는 강렬한 활동과 변화의 에너지입니다. 이동, 변화, 새로운 출발의 기운이 강합니다. 이 시기에 시작한 일이 오래도록 지속되는 뿌리 깊은 나무가 됩니다. 적극적인 행동과 도전이 이 에너지를 극대화합니다.',
        '卯':'묘(卯)의 지지는 성장과 관계의 확장입니다. 인맥이 넓어지고 협력 기회가 풍부해집니다. 창의적인 아이디어가 실현되고 재능이 빛을 발하는 시기입니다. 혼자보다 함께할 때 성과가 배가됩니다.',
        '辰':'진(辰)의 지지는 잠재력이 폭발하는 시기입니다. 예상치 못한 변수가 많이 생기는 만큼, 변화에 유연하게 대응하는 것이 중요합니다. 이 시기에 만나는 사람과 기회가 인생의 전환점이 될 수 있습니다.',
        '巳':'사(巳)의 지지는 내면의 결단력이 요구되는 시기입니다. 오래 고민해온 문제에 대한 답이 이 시기에 명확해집니다. 과감한 선택과 변신이 필요하며, 변화를 두려워하지 않는 용기가 이 시기의 열쇠입니다.',
        '午':'오(午)의 지지는 성취와 인정의 시기입니다. 그동안의 노력이 사회적으로 드러나고 인정받습니다. 에너지가 넘치고 자신감이 극대화되는 시기이므로, 이 기세를 타고 더 큰 목표를 향해 나아가야 합니다.',
        '未':'미(未)의 지지는 풍요로운 감성의 시기입니다. 인간적인 관계가 깊어지고 창작 활동에서 특히 빛을 발합니다. 물질적 축적보다 관계와 경험에 투자하는 것이 이 시기를 가장 풍요롭게 만드는 방법입니다.',
        '申':'신(申)의 지지는 판단력과 실행력의 시기입니다. 기회가 빠르게 스쳐 지나가므로 민첩하게 포착하고 실행해야 합니다. 느린 결정이 이 시기에는 가장 큰 손실이 됩니다.',
        '酉':'유(酉)의 지지는 완성과 보상의 시기입니다. 그동안 쌓아온 전문성이 인정받고, 노력에 대한 정당한 대가가 돌아옵니다. 이 시기에 만들어진 결과물이 당신의 브랜드가 됩니다.',
        '戌':'술(戌)의 지지는 통찰과 마무리의 시기입니다. 깊은 성찰을 통해 불필요한 것을 정리하고 핵심 가치에 집중하게 됩니다. 이 시기의 내면적 성장이 다음 대운의 도약을 위한 토대가 됩니다.',
        '亥':'해(亥)의 지지는 잠복과 준비의 시기입니다. 표면적으로는 정체처럼 보이지만, 내면에서는 엄청난 에너지가 축적되고 있습니다. 이 시기를 조용히 준비에 투자한 사람과 허비한 사람의 차이는 다음 대운에서 극명하게 드러납니다.'
    };

    const yong = data.yong || ''; const hee = data.hee || '';
    const gi = data.gi || ''; const goo = data.goo || '';
    const OH_MAP = {'甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수'};
    const JI_OH_MAP = {'子':'수','丑':'토','寅':'목','卯':'목','辰':'토','巳':'화','午':'화','未':'토','申':'금','酉':'금','戌':'토','亥':'수'};

    function scoreRow(gan, ji) {
        let s = 0;
        const gOh = OH_MAP[gan]; const jOh = JI_OH_MAP[ji];
        if(gOh===yong||gOh===hee) s+=2; if(gOh===gi||gOh===goo) s-=2;
        if(jOh===yong||jOh===hee) s+=2; if(jOh===gi||jOh===goo) s-=2;
        return s;
    }
    function badge(s) { return s>=3?'🌟 대길':s>=1?'✦ 길(吉)':s===0?'— 평(平)':s>=-2?'⚠ 주의':'❌ 흉(凶)'; }
    function col(s) { return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c'; }

    let out = `<div class="report-chapter"><h3 class="ch-title">대운 80년 — 인생 계절의 완전 해부</h3>
    <p class="ch-text">대운(大運)은 10년마다 바뀌는 인생의 기후입니다. 지금 어떤 계절을 살고 있는지 알면, 그에 맞는 전략으로 인생을 설계할 수 있습니다. 용신(用神) 기운의 대운에서 집중 공략하고, 기신(忌神) 기운의 대운에서 내공을 쌓으십시오. 아래에 당신의 평생 대운 흐름을 모두 해부합니다.</p>
    <div style="display:flex;flex-direction:column;gap:16px;">`;

    rows.forEach((r, idx) => {
        const gan = r.gan || '甲'; const ji = r.ji || '子';
        const age = r.age || (idx*10+5);
        const sc = scoreRow(gan, ji);
        const b = badge(sc); const c = col(sc);
        const isCurrent = idx === (data.activeDaeunIdx || 0);
        const ganD = GAN_DESC[gan] || '';
        const jiD = JI_DESC[ji] || '';
        const strategy = sc >= 2
            ? `<div style="background:rgba(0,200,83,0.08);border-radius:8px;padding:12px;margin-top:12px;"><b style="color:#00C853;">✦ 이 대운의 전략</b><p style="font-size:13px;color:#ccc;line-height:1.8;margin:6px 0 0;">용신·희신 기운이 강한 길한 대운입니다. 이 시기는 적극적으로 확장하고 투자하십시오. 준비해온 것을 세상에 내놓고, 인맥을 확장하며 기회를 잡는 것이 핵심입니다. 이런 대운은 평생에 몇 번 오지 않으므로 최대한 활용해야 합니다.</p></div>`
            : sc >= 0
            ? `<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;margin-top:12px;"><b style="color:#aaa;">— 이 대운의 전략</b><p style="font-size:13px;color:#ccc;line-height:1.8;margin:6px 0 0;">중화적인 대운으로 큰 기복 없이 안정적으로 흐르는 시기입니다. 꾸준히 자기 자신을 개발하고 인간관계를 다지는 것이 이 시기를 가장 알차게 활용하는 방법입니다.</p></div>`
            : `<div style="background:rgba(255,150,0,0.07);border-radius:8px;padding:12px;margin-top:12px;"><b style="color:#ff9800;">⚠ 이 대운의 전략</b><p style="font-size:13px;color:#ccc;line-height:1.8;margin:6px 0 0;">기신·구신 기운이 강한 대운입니다. 무리한 확장이나 모험은 피하고, 기존에 쌓아온 것을 지키는 수비 전략이 필요합니다. 이 시기에 충실히 내공을 다지면 다음 대운에서 폭발적으로 도약할 수 있습니다.</p></div>`;

        out += `<div style="background:rgba(255,255,255,${isCurrent?'0.07':'0.03'});border:1px solid ${isCurrent?'var(--gold)':'rgba(255,255,255,0.07)'};border-radius:12px;padding:18px;break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:26px;font-weight:800;color:var(--gold);font-family:'Noto Serif KR',serif;">${gan}${ji}</span>
                    <div>
                        <div style="font-size:13px;color:#bbb;">${age}세 ~ ${age+9}세</div>
                        ${isCurrent?'<span style="font-size:10px;background:var(--gold);color:#000;padding:2px 8px;border-radius:8px;font-weight:700;">현재 대운</span>':''}
                    </div>
                </div>
                <span style="font-size:13px;font-weight:700;color:${c};padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">${b}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
                <div style="background:rgba(0,0,0,0.25);border-radius:8px;padding:12px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">천간(天干) ${gan}</div>
                    <p style="font-size:12.5px;color:#ddd;line-height:1.75;margin:0;">${ganD}</p>
                </div>
                <div style="background:rgba(0,0,0,0.25);border-radius:8px;padding:12px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">지지(地支) ${ji}</div>
                    <p style="font-size:12.5px;color:#ddd;line-height:1.75;margin:0;">${jiD}</p>
                </div>
            </div>
            ${strategy}
        </div>`;
    });

    out += `</div></div>`;
    return out;
}'''

html = replace_func(html, 'buildDaewunLoop', daewun)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 | {len(html):,} bytes")
