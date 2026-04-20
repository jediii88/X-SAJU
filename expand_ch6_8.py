with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Chapter 6 교체
old6 = '''function buildChapter6_Love(data) {
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

new6 = r'''function buildChapter6_Love(data) {
    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    const loveText = dbEntry.love || "당신의 템포를 묵묵히 맞춰주고 지지해줄 수 있는 안정적인 인연이 닿습니다.";
    const sipseong = data.sipseong || {};
    const gwanC = (sipseong['정관']||0) + (sipseong['편관']||0);
    const inC = (sipseong['정인']||0) + (sipseong['편인']||0);
    const sipTotal = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0), 1);

    const loveStyle = gwanC / sipTotal > 0.2
        ? '官星(관성)이 강한 당신의 연애 스타일은 주도적이고 책임감이 강합니다. 상대방을 이끌고 보호하는 역할을 자연스럽게 맡게 되며, 이 리더십이 상대에게는 든든한 안정감으로 느껴집니다. 다만 이 강한 주도성이 때로는 상대의 자율성을 침해하는 방식으로 표현되기도 합니다. 관계에서 "내가 옳다"는 확신을 잠시 내려놓는 연습이 필요합니다.'
        : inC / sipTotal > 0.2
        ? '印星(인성)이 강한 당신은 연애에서 헌신적이고 감성적입니다. 상대방에게 모든 것을 주고 싶은 충동을 느끼며 관계에 깊이 몰입합니다. 그러나 이 헌신이 상대에게 부담이 되거나, 자신이 원하는 방식의 사랑을 강요하는 형태로 변질될 위험이 있습니다. 자기 자신을 먼저 사랑하는 연습이 역설적으로 가장 건강한 사랑을 만들어냅니다.'
        : '당신의 연애는 독립적이고 자유로운 기운이 지배합니다. 서로의 공간과 자율성을 존중하는 파트너십 형태의 관계에서 가장 편안함을 느낍니다. 상대에게 지나치게 의존하거나 의존당하는 것을 불편해하므로, 각자의 삶을 충실히 살면서 함께하는 형태가 가장 이상적입니다.';

    const meetTiming = '用神(용신) 기운이 강한 해와 월에 인연의 문이 열립니다. 특히 대운의 천간과 지지가 당신의 일주와 합(合)을 이루는 시기에 결정적인 인연이 찾아오는 경우가 많습니다. 기다리는 것보다 그 시기에 사회적 활동 반경을 의도적으로 넓히고, 새로운 모임과 커뮤니티에 적극적으로 참여하는 것이 실질적인 전략입니다.';

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 6. 닫힌 문을 여는 열쇠 — 이성운과 인연</h3>
        <p class="ch-text">사주에서 日支(일지)는 당신의 안방이자 배우자의 자리입니다. 사회적 가면을 벗어던지고 가장 취약한 민낯을 드러냈을 때, 그것을 품어낼 수 있는 인연의 형태가 이 자리에 각인되어 있습니다. 겉으로 드러나는 사교적 면모와 달리, 실제 당신이 원하는 사랑의 방식은 이 일지에 새겨진 기운과 훨씬 가깝습니다.</p>
        <p class="ch-text">많은 사람들이 사주에서 이성운을 논할 때 단순히 "좋은 사람을 만난다" "이별이 있다"는 수준에서 그칩니다. 그러나 진짜 이성운의 핵심은 내가 어떤 방식으로 사랑하고, 어떤 유형의 사람과 에너지가 맞으며, 내 연애 패턴의 가장 큰 함정이 무엇인지를 파악하는 데 있습니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:20px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">日支(일지) 배우자궁 분석</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0;">${loveText}</p>
        </div>
        <p class="ch-text">${loveStyle}</p>
        <p class="ch-text">${meetTiming}</p>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin-top:16px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">인연 활성화 전략</div>
            <p style="font-size:13.5px;color:#bbb;line-height:1.9;margin:0;">당신에게 맞는 사람은 완벽한 사람이 아니라 당신의 에너지를 가장 잘 보완해주는 사람입니다. 당신이 부족한 오행 기운을 일간(日干)으로 가진 상대와 만날 때 가장 강력한 에너지 보완이 이루어집니다. 또한 일지(日支)가 서로 합(合)을 이루는 상대와는 특별한 유대감과 편안함을 느낍니다.</p>
        </div>
    </div>`;
}'''

if old6 in html:
    html = html.replace(old6, new6)
    print("Chapter 6 교체 성공")
else:
    print("Chapter 6 패턴 불일치")

# Chapter 7 교체
old7 = '''function buildChapter7_Hidden(data) {
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

new7 = r'''function buildChapter7_Hidden(data) {
    const branch = data.dayBranch || '';
    const allPillars = data.pillars || [];
    let hiddenText = "겉으로 드러난 환경 아래에는 거대한 잠재력이 숨겨져 있습니다.";
    if (window.SAJU_DB?.HIDDEN?.[branch]) {
        hiddenText = window.SAJU_DB.HIDDEN[branch];
    }
    const hiddenAll = allPillars.map(p => {
        const b = p.h ? p.h[1] : '';
        const hd = window.SAJU_DB?.HIDDEN?.[b] || '';
        const pillarName = ['연주','월주','일주','시주'][allPillars.indexOf(p)] || '';
        return b ? `<div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.06);"><div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;"><b style="color:var(--gold);font-size:15px;">${b}</b><span style="font-size:11px;color:var(--text-dim);">${pillarName} 지지</span></div><span style="font-size:13.5px;color:#ccc;line-height:1.8;">${hd||'해당 지지의 지장간 정보가 준비 중입니다.'}</span></div>` : '';
    }).filter(Boolean).join('');

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 7. 빙산 아래의 욕망 — 地藏干(지장간) 해부</h3>
        <p class="ch-text">사람들은 원국에 드러난 8글자만으로 운명을 논합니다. 그러나 빙산의 일각처럼, 수면 아래에 숨겨져 당신을 무의식적으로 조종하는 진짜 본능은 地藏干(지장간)에 있습니다. 지장간은 각 지지(地支) 안에 감춰진 하늘의 기운으로, 평소에는 드러나지 않다가 특정 대운이나 세운의 기운과 만날 때 비로소 발동합니다.</p>
        <p class="ch-text">특히 일지(日支) — 배우자궁이자 내면의 자아가 자리한 곳 — 의 지장간은 당신이 평생 무의식적으로 추구하는 욕망의 원형(原型)입니다. 표면적인 성격과 완전히 다른 이 내면의 본능을 아는 것이 자기 이해의 가장 깊은 출발점입니다.</p>
        <div style="background:rgba(255,255,255,0.04);border-left:3px solid var(--gold);padding:18px 20px;border-radius:0 10px 10px 0;margin:20px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;letter-spacing:1px;">日支(일지) ${branch} — 숨겨진 지장간 심층 분석</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0;">${hiddenText}</p>
        </div>
        ${hiddenAll ? `<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:18px;margin-top:16px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:14px;letter-spacing:1px;">원국 전체 지지(地支) 지장간 일람</div>${hiddenAll}</div>` : ''}
        <p class="ch-text" style="margin-top:16px;">이 숨겨진 기운은 평소에는 작동하지 않습니다. 인생의 극적인 위기나 결핍에 몰렸을 때, 혹은 해당 기운을 가진 대운과 세운이 들어올 때 비로소 폭발하며 당신을 전혀 다른 수준으로 끌어올립니다. 지장간의 발동 시점을 파악하면, 인생의 결정적 전환점이 언제 오는지 미리 알 수 있습니다.</p>
    </div>`;
}'''

if old7 in html:
    html = html.replace(old7, new7)
    print("Chapter 7 교체 성공")
else:
    print("Chapter 7 패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"완료 | {len(html):,} bytes")
