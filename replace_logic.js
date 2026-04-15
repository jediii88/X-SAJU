const fs = require('fs');

let code = fs.readFileSync('report_engine.js', 'utf8');

// Chapter 1 Replacement
const ch1Regex = /function buildChapter1_Full\(data\) \{[\s\S]*?(?=function buildChapter2_Full)/;
const ch1New = `function buildChapter1_Full(data) {
    let iljuKey = data.dayStem + data.dayBranch;
    let dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    
    // 년, 월, 일, 시의 한자/한글 데이터
    const yH = data.pillars[3].h; 
    const mH = data.pillars[2].h; 
    const dH = data.pillars[1].h; 
    const tH = data.pillars[0].h; 
    
    return \`
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 1. 당신의 소우주: 8글자의 논리적 해부</h3>
        <p class="ch-text">사주(四柱)란 당신이 태어난 연, 월, 일, 시의 4개의 기둥을 의미하며, 각 기둥은 위(천간)와 아래(지지) 두 글자로 이루어져 총 8글자(팔자)가 됩니다. 이 8글자는 단순한 점괘가 아니라, 당신의 기질과 환경을 설계한 <b>정밀한 우주적 설계도</b>입니다.</p>
        
        <div style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 10px; border: 1px solid #333; margin: 30px 0;">
            <p style="color: var(--gold); font-size: 16px; font-weight: 800; margin-top: 0;">[ \${data.name} 님의 사주 원국 8글자 ]</p>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; margin-top: 20px;">
                <div style="border: 1px solid #444; padding: 15px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 10px;">시주(말년/무기)</div>
                    <div style="font-size: 24px; font-weight: 900; color: \${HAN_COLOR[tH[0]]}">\${tH[0]}<span style="font-size:12px; color:#aaa;">(\${HAN_KOR[tH[0]]})</span></div>
                    <div style="font-size: 24px; font-weight: 900; color: \${HAN_COLOR[tH[1]]}; margin-top: 5px;">\${tH[1]}<span style="font-size:12px; color:#aaa;">(\${HAN_KOR[tH[1]]})</span></div>
                </div>
                <div style="border: 1px solid #444; padding: 15px; border-radius: 5px; background: rgba(199,167,106,0.1); border-color: var(--gold);">
                    <div style="font-size: 12px; color: var(--gold); margin-bottom: 10px;">일주(본질/안방)</div>
                    <div style="font-size: 24px; font-weight: 900; color: \${HAN_COLOR[dH[0]]}">\${dH[0]}<span style="font-size:12px; color:#aaa;">(\${HAN_KOR[dH[0]]})</span></div>
                    <div style="font-size: 24px; font-weight: 900; color: \${HAN_COLOR[dH[1]]}; margin-top: 5px;">\${dH[1]}<span style="font-size:12px; color:#aaa;">(\${HAN_KOR[dH[1]]})</span></div>
                </div>
                <div style="border: 1px solid #444; padding: 15px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 10px;">월주(환경/직업)</div>
                    <div style="font-size: 24px; font-weight: 900; color: \${HAN_COLOR[mH[0]]}">\${mH[0]}<span style="font-size:12px; color:#aaa;">(\${HAN_KOR[mH[0]]})</span></div>
                    <div style="font-size: 24px; font-weight: 900; color: \${HAN_COLOR[mH[1]]}; margin-top: 5px;">\${mH[1]}<span style="font-size:12px; color:#aaa;">(\${HAN_KOR[mH[1]]})</span></div>
                </div>
                <div style="border: 1px solid #444; padding: 15px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #888; margin-bottom: 10px;">년주(조상/초년)</div>
                    <div style="font-size: 24px; font-weight: 900; color: \${HAN_COLOR[yH[0]]}">\${yH[0]}<span style="font-size:12px; color:#aaa;">(\${HAN_KOR[yH[0]]})</span></div>
                    <div style="font-size: 24px; font-weight: 900; color: \${HAN_COLOR[yH[1]]}; margin-top: 5px;">\${yH[1]}<span style="font-size:12px; color:#aaa;">(\${HAN_KOR[yH[1]]})</span></div>
                </div>
            </div>
        </div>

        <p class="ch-text">가장 중심이 되는 글자는 일주의 윗글자, 즉 <b>일간(日干) \${data.dayStem}(\${HAN_KOR[data.dayStem]})</b>입니다. 이 글자가 곧 당신의 '영혼의 본체'입니다. 당신은 우주적으로 \${RELATION_LABELS[HAN_COLOR[data.dayStem]]}의 기운을 띠고 태어났으며, 일지(아랫글자)인 \${data.dayBranch}(\${HAN_KOR[data.dayBranch]})를 깔고 앉아 있습니다.</p>
        <p class="ch-text">월주 \${mH[0]}\${mH[1]}(\${HAN_KOR[mH[0]]}\${HAN_KOR[mH[1]]})는 당신이 태어난 계절적 환경을 의미하며, 직업과 사회성을 지배합니다. 당신의 \${data.dayStem}(\${HAN_KOR[data.dayStem]}) 본체는 이 월주의 환경 속에서 주변 글자들과 밀고 당기며(생극제화) 당신만의 고유한 성향을 만들어냅니다.</p>

        <div style="background: rgba(199,167,106,0.05); padding: 25px; border-left: 3px solid var(--gold); margin-top: 30px;">
            <p style="color: var(--gold); font-size: 15px; font-weight: 700; margin-top: 0;">[일주 \${iljuKey}(\${HAN_KOR[data.dayStem]}\${HAN_KOR[data.dayBranch]})의 본질]</p>
            <p style="margin: 0; color: #ccc; line-height: 1.8;">\${dbEntry.core || '본질 해독 중입니다.'}</p>
        </div>
    </div>\`;
}
`;
code = code.replace(ch1Regex, ch1New);


// Chapter 3 Replacement
const ch3Regex = /function buildChapter3_Full\(data\) \{[\s\S]*?(?=function buildChapter4_Full)/;
const ch3New = `function buildChapter3_Full(data) {
    let mainSip = Object.keys(data.sipseong).reduce((a, b) => data.sipseong[a] > data.sipseong[b] ? a : b) || "비견";
    let sipText = window.SAJU_DB?.SIPSEONG?.[mainSip] || "당신만의 독특한 사회적 페르소나를 가지고 있습니다.";
    
    return \`
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 3. 십성(十星)의 원리와 사회적 무기</h3>
        <p class="ch-text">사주에서 <b>십성(十星)</b>이란, 내 본체인 일간(\${data.dayStem})을 기준으로 나머지 7개의 글자가 나와 어떤 관계를 맺고 있는지를 10가지 역할로 분류한 시스템입니다. 이것이 바로 당신이 세상을 바라보고 대응하는 '뇌의 운영체제(S/W)'가 됩니다.</p>
        
        <ul style="color: #bbb; line-height: 2.0; font-size: 15px; margin-bottom: 30px; background: rgba(255,255,255,0.02); padding: 20px 40px; border-radius: 8px;">
            <li><b>식상(식신/상관):</b> 내가 에너지를 빼내어 낳는 기운 (표현력, 기술, 아이디어)</li>
            <li><b>재성(정재/편재):</b> 내가 극(통제)하여 쟁취하는 기운 (결과물, 목표, 재물)</li>
            <li><b>관성(정관/편관):</b> 나를 극(통제)하여 억누르는 기운 (규율, 명예, 직장)</li>
            <li><b>인성(정인/편인):</b> 나를 돕고 생(生)해주는 기운 (학문, 인정, 문서)</li>
            <li><b>비겁(비견/겁재):</b> 나와 같은 기운 (경쟁자, 자아, 독립심)</li>
        </ul>

        <p class="ch-text">당신의 원국 8글자를 이 원리로 분석했을 때, 가장 압도적인 비율을 차지하는 주력 운영체제는 <b>[\${mainSip}]</b>입니다.</p>
        
        <div style="padding: 25px; border-left: 4px solid var(--gold); background: #111; margin-top: 25px;">
            <p style="margin-top: 0; color: var(--gold); font-size: 16px; font-weight: 800;">주력 페르소나 (Primary OS): [\${mainSip}]</p>
            <p style="margin: 0; color: #ddd; line-height: 1.8;">\${sipText}</p>
        </div>
    </div>\`;
}
`;
code = code.replace(ch3Regex, ch3New);


// Chapter 9 Replacement
const ch9Regex = /function buildChapter9_Full\(data\) \{[\s\S]*?(?=function buildChapter10_Full)/;
const ch9New = `function buildChapter9_Full(data) {
    let gongmang = data.gongmang || '-';
    let gmSip = gongmang.split('').map(c => typeof getSipseong === 'function' ? getSipseong(data.dayStem, c) : '').join(', ');
    
    return \`
    <div class="report-chapter">
        <h3 class="ch-title">Chapter 9. 공망(空亡): 결핍의 원리와 역발상</h3>
        <p class="ch-text">명리학에서 <b>공망(空亡)</b>은 하늘이 비어있다는 뜻입니다. 천간(하늘의 기운)은 10개인데 지지(땅의 기운)는 12개입니다. 이들을 순서대로 짝짓다 보면 필연적으로 2개의 지지가 짝을 찾지 못하고 남게 되는데, 이를 공망이라 부릅니다.</p>
        <p class="ch-text">당신의 일주(\${data.dayStem}\${data.dayBranch})를 기준으로 짝을 맞추어 보면, <b>[\${gongmang}]</b> 두 글자가 짝이 없는 공망의 상태가 됩니다. 이 두 글자에 해당하는 십성이 바로 <b>[\${gmSip}]</b>입니다.</p>
        <p class="ch-text">과거에는 이를 흉살로 보았으나, 현대 명리학에서는 이를 <b>'평생을 관통하는 갈증과 동기부여'</b>로 해석합니다. 채워지지 않기에 끝없이 갈구하고, 그 갈구하는 힘이 당신을 남들보다 높은 곳으로 밀어 올리는 로켓의 분사구가 됩니다.</p>
        <div class="axe-advice" style="border-left-color: #9b59b6;">
            이 결핍(\${gmSip})을 완벽하게 채우려 집착하지 마십시오. 비어있기 때문에 새로운 것을 담을 수 있는 당신만의 무한한 공간입니다.
        </div>
    </div>\`;
}
`;
code = code.replace(ch9Regex, ch9New);

fs.writeFileSync('report_engine.js', code);
console.log("SUCCESS");
