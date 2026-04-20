"""Chapter 1~9 텍스트 전면 확장 — 대가 PDF 수준"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ── Chapter 6: 애정운 ──
old_ch6 = '''function buildChapter6_Love(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    let loveText = dbEntry.love || "당신의 템포를 묵묵히 맞춰주고 지지해 줄 수 있는 안정적인 인연이 닿습니다.";
    
    let extra1 = "사주에서 日支(일지)는 당신의 안방이자, 배우자의 자리입니다. 사회적 가면을 벗어던지고 가장 취약한 민낯을 드러냈을 때, 그것을 품어낼 수 있는 인연의 형태가 이 자리에 각인되어 있습니다.";
    let extra2 = "당신은 매력적이지만 곁을 내어주기까지 상당히 까다로운 기준을 가지고 있습니다. 불타오르는 감정보다는 나와 결이 맞는 사람인지 수없이 테스트하는 과정을 거칩니다.";

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 6. 닫힌 문을 여는 열쇠 (이성운과 인연)</h3>
        <p class="ch-text">${extra1}</p>
        <p class="ch-text">${extra2}</p>
        <p class="ch-text" style="font-weight: 600; color: #fff;">[배우자궁 분석]</p>
        <p class="ch-text">${loveText}</p>
    </div>`;
}'''

new_ch6 = '''function buildChapter6_Love(data) {
    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    const loveText = dbEntry.love || "당신의 템포를 묵묵히 맞춰주고 지지해줄 수 있는 안정적인 인연이 닿습니다.";
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';
    const sipseong = data.sipseong || {};
    const gwanC = (sipseong['정관']||0) + (sipseong['편관']||0);
    const inC = (sipseong['정인']||0) + (sipseong['편인']||0);
    const sipTotal = Object.values(sipseong).reduce((a,b)=>a+b,0) || 1;
    
    const loveStyle = gwanC / sipTotal > 0.2
        ? '官星(관성)이 강한 당신의 연애 스타일은 주도적이고 책임감이 강합니다. 상대방을 이끌고 보호하는 역할을 자연스럽게 맡게 되며, 이 리더십이 상대에게는 든든한 안정감으로 느껴집니다. 단, 이 강한 주도성이 때로는 상대의 자율성을 침해하는 방식으로 표현되기도 합니다. "내가 옳다"는 확신이 관계를 경직시키지 않도록 유의하십시오.'
        : inC / sipTotal > 0.2
        ? '印星(인성)이 강한 당신은 연애에서 헌신적이고 감성적입니다. 상대방에게 모든 것을 주고 싶은 충동을 느끼며 관계에 깊이 몰입합니다. 그러나 이 헌신이 상대에게 부담이 되거나, 내가 원하는 방식의 사랑을 강요하는 형태로 변질될 수 있습니다. 자기 자신을 먼저 사랑하는 연습이 역설적으로 가장 건강한 사랑을 만들어냅니다.'
        : '당신의 연애는 비견(比肩)과 식상(食傷)의 기운이 지배합니다. 자유롭고 독립적인 관계를 선호하며, 상대에게 지나치게 의존하거나 의존당하는 것을 불편해합니다. 서로의 공간과 자율성을 존중하는 파트너십 형태의 관계에서 가장 편안함을 느낍니다.';
    
    const meetTiming = '용신(用神) 기운이 강한 해와 월에 인연의 문이 열립니다. 특히 대운의 천간과 지지가 당신의 일주와 합(合)을 이루는 시기에 결정적인 인연이 찾아오는 경우가 많습니다. 기다리는 것보다 그 시기에 사회적 활동 반경을 의도적으로 넓히는 것이 실질적인 전략입니다.';
    
    const warnText = '단, 이성 인연에서 가장 주의해야 할 것은 "나의 기준에 맞지 않는다"는 이유로 좋은 인연을 놓치는 일입니다. 당신에게 맞는 사람은 완벽한 사람이 아니라, 당신의 에너지를 가장 잘 보완해주는 사람입니다. 오행과 십성의 관점에서 가장 이상적인 파트너는 당신이 부족한 기운을 일간으로 가진 사람입니다.';

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 6. 닫힌 문을 여는 열쇠 — 이성운과 인연</h3>
        <p class="ch-text">사주에서 日支(일지)는 당신의 안방이자 배우자의 자리입니다. 사회적 가면을 벗어던지고 가장 취약한 민낯을 드러냈을 때, 그것을 품어낼 수 있는 인연의 형태가 이 자리에 각인되어 있습니다. 겉으로 드러나는 사교적 면모와 달리, 실제 당신이 원하는 사랑의 방식은 이 일지에 새겨진 기운과 훨씬 가깝습니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:20px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">日支(일지) 배우자궁 분석</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0;">${loveText}</p>
        </div>
        <p class="ch-text">${loveStyle}</p>
        <p class="ch-text">${meetTiming}</p>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin-top:16px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">주의사항</div>
            <p style="font-size:13.5px;color:#bbb;line-height:1.9;margin:0;">${warnText}</p>
        </div>
    </div>`;
}'''

if old_ch6 in html:
    html = html.replace(old_ch6, new_ch6)
    print("Chapter 6 확장 성공")
else:
    print("Chapter 6 패턴 불일치")

# ── Chapter 7: 지장간 ──
old_ch7 = '''function buildChapter7_Hidden(data) {
    let branch = data.dayBranch;
    let hiddenText = "겉으로 드러난 환경 아래에는 거대한 잠재력이 숨겨져 있습니다.";
    if (window.SAJU_DB?.HIDDEN?.[branch]) {
        hiddenText = window.SAJU_DB.HIDDEN[branch];
    }
    
    let extra1 = "사람들은 원국에 드러난 8글자만으로 운명을 논합니다. 그러나 빙산의 일각처럼, 물 밑에 숨겨져 당신을 무의식적으로 조종하는 진짜 본능은 '地藏干(지장간)'에 숨어 있습니다. 지장간은 당신의 비상금이면서 동시에 내면에 억눌린 가장 솔직한 욕망입니다.";

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 7. 빙산 아래의 욕망 (지장간 해부)</h3>
        <p class="ch-text">${extra1}</p>
        <div style="background: rgba(255,255,255,0.04); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); padding: 20px; border-left: 3px solid var(--gold); margin: 20px 0;">
            <div style="color: #fff; font-weight: bold; margin-bottom: 10px;">[ 태어난 날(${branch})에 숨겨진 지장간 ]</div>
            <div style="color: #ccc; font-size: 15px; line-height: 1.7;">${hiddenText}</div>
        </div>
        <p class="ch-text">이 숨겨진 무기는 평소에는 작동하지 않다가 인생의 극적인 위기 상황이나 극한의 결핍 상황에 몰렸을 때 비로소 폭발하며 당신을 구원합니다.</p>
    </div>`;
}'''

new_ch7 = '''function buildChapter7_Hidden(data) {
    const branch = data.dayBranch || '';
    const allPillars = data.pillars || [];
    let hiddenText = "겉으로 드러난 환경 아래에는 거대한 잠재력이 숨겨져 있습니다.";
    if (window.SAJU_DB?.HIDDEN?.[branch]) {
        hiddenText = window.SAJU_DB.HIDDEN[branch];
    }
    
    // 4지지 모두의 지장간 표시
    const hiddenAll = allPillars.map(p => {
        const b = p.h ? p.h[1] : '';
        const hd = window.SAJU_DB?.HIDDEN?.[b] || '';
        return b ? `<div style="margin-bottom:12px;"><b style="color:var(--gold);">${b}(${p.k||''})</b> — <span style="font-size:13px;color:#ccc;">${hd||'해당 지지의 지장간 정보'}</span></div>` : '';
    }).join('');

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 7. 빙산 아래의 욕망 — 地藏干(지장간) 해부</h3>
        <p class="ch-text">사람들은 원국에 드러난 8글자만으로 운명을 논합니다. 그러나 빙산의 일각처럼, 수면 아래에 숨겨져 당신을 무의식적으로 조종하는 진짜 본능은 地藏干(지장간)에 있습니다. 지장간은 각 지지(地支) 안에 감춰진 하늘의 기운으로, 평소에는 드러나지 않다가 특정 대운이나 세운의 기운과 만날 때 비로소 발동합니다.</p>
        <p class="ch-text">특히 일지(日支) — 배우자궁이자 내면의 자아가 자리한 곳 — 의 지장간은 당신이 평생 무의식적으로 추구하는 욕망의 원형(原型)입니다. 표면적인 성격과 완전히 다른 이 내면의 본능을 아는 것이 자기 이해의 출발점입니다.</p>
        <div style="background:rgba(255,255,255,0.04);border-left:3px solid var(--gold);padding:18px 20px;border-radius:0 10px 10px 0;margin:20px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;letter-spacing:1px;">日支(일지) ${branch} — 숨겨진 지장간 심층 분석</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0;">${hiddenText}</p>
        </div>
        ${hiddenAll ? `<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:18px;margin-top:16px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;letter-spacing:1px;">원국 4지지 전체 지장간 일람</div>${hiddenAll}</div>` : ''}
        <p class="ch-text">이 숨겨진 기운은 평소에는 작동하지 않습니다. 인생의 극적인 위기나 결핍에 몰렸을 때, 혹은 해당 기운을 가진 대운과 세운이 들어올 때 비로소 폭발하며 당신을 전혀 다른 수준으로 끌어올립니다. 지장간의 발동을 알면, 인생의 전환점이 언제 오는지 미리 예측할 수 있습니다.</p>
    </div>`;
}'''

if old_ch7 in html:
    html = html.replace(old_ch7, new_ch7)
    print("Chapter 7 확장 성공")
else:
    print("Chapter 7 패턴 불일치")

# ── Chapter 8: 건강 ──
old_ch8 = '''function buildChapter8_Health(data) {
    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 8. 신체 취약점과 마지노선 (건강)</h3>`;
    let maxWuxing = 'earth';
    if(data.wuxing && Object.keys(data.wuxing).length > 0) {
        maxWuxing = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] > data.wuxing[b] ? a : b);
    }
    
    let organ = {
        'wood': '간, 담낭, 신경계',
        'fire': '심장, 심혈관, 안구',
        'earth': '위장, 비장, 소화기 계통',
        'metal': '폐, 대장, 호흡기',
        'water': '신장, 방광, 호르몬'
    }[maxWuxing] || '위장';

    html += `<p class="ch-text">사주 명리학은 결국 에너지(오행)의 분배와 편중을 다루는 학문이며, 이는 한의학의 오장육부와 직결됩니다. 당신의 사주에서 특정 에너지가 극도로 과부하 걸릴 때, 마음의 스트레스는 즉각적으로 해당 장기의 병변으로 나타납니다.</p>`;
    html += `<p class="ch-text">당신의 원국에서 <b>${maxWuxing}</b>의 기운이 가장 강하게 편중되어 있으므로, 당신 인생의 건강 마지노선은 바로 <b>[${organ}]</b>입니다. 화가 나고 억눌릴 때 이곳부터 타격을 받습니다.</p>`;
    html += `<div class="axe-advice" style="border-left-color: #d32f2f; margin-top: 15px;">
        성과를 내기 위해 몸을 연료로 태우지 마십시오. 당신은 멈춰야 할 때 멈추는 데 대단한 용기가 필요한 타입입니다.
    </div></div>`;
    return html;
}'''

new_ch8 = '''function buildChapter8_Health(data) {
    let maxWuxing = 'earth';
    if(data.wuxing && Object.keys(data.wuxing).length > 0) {
        maxWuxing = Object.keys(data.wuxing).reduce((a, b) => data.wuxing[a] > data.wuxing[b] ? a : b);
    }
    const ohKr = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'}[maxWuxing];
    const organ = {wood:'간(肝)·담낭·신경계',fire:'심장(心)·심혈관·소장',earth:'비장(脾)·위장·소화기',metal:'폐(肺)·대장·호흡기',water:'신장(腎)·방광·호르몬'}[maxWuxing] || '위장·소화기';
    const emotion = {wood:'분노와 억울함',fire:'과도한 흥분과 불안',earth:'지나친 걱정과 생각',metal:'슬픔과 우울감',water:'두려움과 공포'}[maxWuxing] || '스트레스';
    const season = {wood:'봄(3~5월), 인(寅)·묘(卯)월',fire:'여름(6~8월), 사(巳)·오(午)월',earth:'환절기, 진(辰)·술(戌)·축(丑)·미(未)월',metal:'가을(9~11월), 신(申)·유(酉)월',water:'겨울(12~2월), 해(亥)·자(子)월'}[maxWuxing] || '환절기';
    const foodAdvice = {wood:'신맛(레몬, 식초, 매실)을 섭취하고 녹황색 채소를 늘리십시오. 알코올을 멀리하는 것이 간 기능 보호의 핵심입니다.',fire:'쓴맛(녹차, 블랙커피)을 적당히 즐기고 심장을 진정시키는 산사, 연자육 등을 권장합니다. 카페인과 에너지드링크를 자제하십시오.',earth:'단맛(천연 당분)과 노란색 음식을 적당히 섭취하십시오. 규칙적인 식사 시간이 위장 보호의 핵심입니다. 폭식과 야식을 피하십시오.',metal:'매운맛(생강, 고추)을 적당히 활용하고 흰 음식(배, 무, 도라지)이 폐를 보강합니다. 유산소 운동으로 폐활량을 키우십시오.',water:'짠맛(소금, 된장)을 적절히 섭취하고 검은 음식(흑임자, 검은콩)이 신장을 보강합니다. 충분한 수분 섭취와 규칙적인 수면이 최우선입니다.'}[maxWuxing] || '균형 잡힌 식단을 유지하십시오.';
    const exerciseAdvice = {wood:'걷기·조깅·수영 등 규칙적인 유산소 운동. 경쟁적 스포츠보다 명상과 스트레칭으로 신경계를 안정시키십시오.',fire:'심박수를 안정시키는 요가·태극권·수영을 권장합니다. 과격한 운동은 심혈관에 부담을 줍니다.',earth:'규칙적인 걷기 운동이 소화기를 활성화합니다. 식후 30분 가벼운 산책이 위장 건강의 핵심입니다.',metal:'폐활량을 키우는 수영과 유산소 운동을 권장합니다. 바깥 공기가 좋은 날 걷기 운동이 폐 건강에 좋습니다.',water:'가벼운 스트레칭과 수영으로 신장 기능을 활성화하십시오. 무리한 운동보다 충분한 휴식이 더 중요합니다.'}[maxWuxing] || '규칙적인 운동을 유지하십시오.';

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 8. 신체 취약점과 마지노선 — 건강운</h3>
        <p class="ch-text">사주 명리학은 에너지(오행)의 분배와 편중을 다루는 학문이며, 이는 한의학의 오장육부와 직결됩니다. 당신의 사주에서 특정 에너지가 극도로 과부하 걸릴 때, 마음의 스트레스는 즉각적으로 해당 장기의 병변으로 나타납니다. 이것을 미리 알고 관리하는 것이 당신 인생의 가장 강력한 건강 보험입니다.</p>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;">
            <div style="background:rgba(231,76,60,0.07);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:rgba(255,120,120,0.8);margin-bottom:8px;letter-spacing:1px;">⚠ 평생 취약 장기</div>
                <div style="font-size:18px;font-weight:700;color:#ff8a80;margin-bottom:6px;">${organ}</div>
                <div style="font-size:13px;color:#bbb;line-height:1.7;">${ohKr} 과부하 시 가장 먼저 타격받습니다.</div>
            </div>
            <div style="background:rgba(255,165,0,0.07);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:rgba(255,200,100,0.8);margin-bottom:8px;letter-spacing:1px;">감정-신체 연결</div>
                <div style="font-size:15px;font-weight:700;color:#ffcc80;margin-bottom:6px;">${emotion}</div>
                <div style="font-size:13px;color:#bbb;line-height:1.7;">이 감정이 폭발할 때 해당 장기가 먼저 반응합니다.</div>
            </div>
        </div>

        <p class="ch-text">당신의 원국에서 <b>${ohKr}</b>의 기운이 가장 강하게 편중되어 있습니다. 이 기운이 담당하는 장기를 평생 특별히 관리해야 합니다. 특히 <b>${season}</b>에 해당 장기의 이상 신호가 집중적으로 나타나므로 이 시기를 전후해 정기 검진을 받는 것을 권장합니다.</p>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin:16px 0;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:10px;letter-spacing:1px;">🥗 식이 처방</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">${foodAdvice}</p>
        </div>
        
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:10px;letter-spacing:1px;">🏃 운동 처방</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">${exerciseAdvice}</p>
        </div>
        
        <p class="ch-text" style="margin-top:16px;">성과를 내기 위해 몸을 연료로 태우지 마십시오. 인생이라는 마라톤에서 가장 강력한 무기는 컨디션 관리입니다. 당신은 멈춰야 할 때 멈추는 데 용기가 필요한 타입입니다. 그 용기를 내는 것이 장기 레이스의 승자가 되는 첫 번째 조건입니다.</p>
    </div>`;
}'''

if old_ch8 in html:
    html = html.replace(old_ch8, new_ch8)
    print("Chapter 8 확장 성공")
else:
    print("Chapter 8 패턴 불일치")

# ── Chapter 9: 개운법 ──
old_ch9_start = '''function buildChapter9_Remedy(data) {
    let ds = data.dayStem;
    let color = "블랙과 네이비";
    let dir = "북쪽";
    let num = "1, 6";
    if (['갑', '을', '병', '정'].includes(ds)) {
        color = "화이트와 실버 메탈릭"; dir = "서쪽"; num = "4, 9";
    } else if (['무', '기'].includes(ds)) {'''

if old_ch9_start in html:
    # 기존 ch9 함수 전체 찾아서 교체
    ch9_start = html.find('function buildChapter9_Remedy(data) {')
    # 함수 끝 찾기
    depth = 0
    i = ch9_start
    ch9_end = -1
    while i < len(html):
        if html[i] == '{': depth += 1
        elif html[i] == '}':
            depth -= 1
            if depth == 0:
                ch9_end = i + 1
                break
        i += 1

    new_ch9 = '''function buildChapter9_Remedy(data) {
    const ds = data.dayStem || '';
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[ds] || 'earth';
    const yong = data.yong || stemEl;
    const ohKr = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};

    const remedyDB = {
        wood: {
            color: '초록, 청색 계열 (나뭇잎 초록, 파랑, 청록)',
            anti: '흰색, 금색 계열 (금속 기운 차단)',
            dir: '동쪽 · 동남쪽',
            num: '3, 8',
            gem: '에메랄드, 옥(翠玉), 공작석',
            food: '신맛 음식 — 레