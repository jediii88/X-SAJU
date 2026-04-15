const fs = require('fs');
let code = fs.readFileSync('report_engine.js', 'utf8');

const ch10Regex = /function buildChapter10_Full\(data\) \{[\s\S]*?\n\}/;
const ch10New = `function buildChapter10_Full(data) {
    let html = \`<div class="report-chapter" style="margin-bottom: 80px;">
        <h3 class="ch-title">Chapter 10. 시간의 파동 (대운, 세운, 그리고 원국의 충돌)</h3>
        <p class="ch-text">사주 팔자(8글자)가 당신이 태어날 때 지어진 '집'이라면, <b>운(運)</b>은 밖에서 불어오는 '날씨와 바람'입니다. 대운(10년), 세운(1년), 월운(1개월)이라는 우주의 시간이 흘러오면서 당신의 원국 8글자와 부딪치고(충), 섞이고(합), 깨지면서(파) 인생의 다양한 사건 사고가 발생합니다.</p>
        
        <ul style="color: #bbb; line-height: 2.0; font-size: 15px; margin-bottom: 30px; background: rgba(255,255,255,0.02); padding: 20px 40px; border-radius: 8px;">
            <li><b>대운(大運):</b> 10년마다 바뀌는 거대한 기후 변화. 내 인생의 무대 전체가 봄에서 여름으로 바뀌는 것과 같은 환경적 셋업.</li>
            <li><b>세운(歲運):</b> 매년 들어오는 1년짜리 기상청 예보. 올해 당장 내게 떨어지는 구체적이고 현실적인 체감 사건.</li>
            <li><b>작용 원리:</b> 운에서 들어오는 글자가 내 원국의 글자와 만나 <b>합(合)</b>을 하면 사람/돈/문서가 묶이거나 들어오고, <b>충(沖)</b>을 하면 기존의 것이 깨지거나 강력한 이동/변화가 일어납니다.</li>
        </ul>

        <h4 style="color: var(--gold); margin: 50px 0 20px; font-size: 24px; border-bottom: 1px solid #333; padding-bottom: 10px;">[거시적 기후 변화: 10년 대운(大運)]</h4>
        <p class="ch-text" style="color:#aaa;">대운은 내 인생을 둘러싼 거대한 10년짜리 기상도입니다.</p>\`;
    
    // 대운 전체 출력 (183페이지 분량의 체감을 주는 무한 루프)
    data.daewunList.slice(0, 8).forEach((dy, idx) => {
        let isCurrent = (new Date().getFullYear() - 1988 + 1 >= dy.age) && (new Date().getFullYear() - 1988 + 1 < dy.age + 10);
        let currentTag = isCurrent ? '<span style="background:var(--gold); color:#000; padding:2px 8px; font-size:10px; border-radius:10px; margin-left:10px;">현재 진행 중인 대운</span>' : '';
        
        html += \`
        <div style="margin-bottom: 25px; padding: 25px; background: \${isCurrent ? 'rgba(199, 167, 106, 0.05)' : '#0a0a0a'}; border-left: 4px solid \${isCurrent ? 'var(--gold)' : '#333'}; border-radius: 5px; border-top: 1px solid #1a1a1a;">
            <p style="color: \${isCurrent ? 'var(--gold)' : '#fff'}; font-weight: 900; margin-bottom: 10px; font-size: 18px;">
                \${dy.age}세 ~ \${dy.age+9}세 : [\${dy.gan}\${dy.zi} 대운] \${currentTag}
            </p>
            <p style="margin: 0; color: #888; font-size: 13px; margin-bottom: 15px;">유입 에너지: \${dy.sip.replace(' / ', ', ')} | 우주적 상태: 12운성 \${dy.unsung}</p>
            <p style="margin: 0; color: #ddd; line-height: 1.8;">이 10년은 밖에서 불어오는 <b>\${dy.sip.split(' / ')[0]}</b>(천간)과 <b>\${dy.sip.split(' / ')[1]}</b>(지지)의 에너지가 당신의 원국(\${data.dayStem}\${data.dayBranch})과 격렬하게 반응하는 시기입니다. 당신의 영혼(일간 \${data.dayStem})은 12운성 <b>\${dy.unsung}</b>의 단계에 놓이게 되며, 외부 환경의 압력을 어떻게 내 무기로 흡수하느냐가 이 10년의 성패를 가릅니다.</p>
        </div>\`;
    });

    html += \`<h4 style="color: var(--gold); margin: 60px 0 20px; font-size: 24px; border-bottom: 1px solid #333; padding-bottom: 10px;">[미시적 전술 지도: 향후 10년 세운(歲運)과 합충 분석]</h4>
        <p class="ch-text" style="color:#aaa;">세운은 올해 당장 내 눈앞에 떨어지는 현실적인 사건 사고를 의미합니다.</p>\`;
        
    // 세운 출력
    data.sewunList.forEach((sy, idx) => {
        let isThisYear = sy.year === new Date().getFullYear();
        let yt = isThisYear ? 'background: rgba(199,167,106,0.1); border: 1px solid var(--gold);' : 'background: #0a0a0a; border: 1px solid #222;';
        
        // 간단한 충(沖) 원리 표시 
        let hasChung = false;
        let branchChung = {"子":"午","午":"子","丑":"未","未":"丑","寅":"申","申":"寅","卯":"酉","酉":"卯","辰":"戌","戌":"辰","巳":"亥","亥":"巳"};
        if(branchChung[data.dayBranch] === sy.zi) hasChung = true;

        let actionText = hasChung 
            ? \`올해 들어오는 <b>\${sy.zi}(\${HAN_KOR[sy.zi]||''})</b>의 기운이 당신의 일지 <b>\${data.dayBranch}(\${HAN_KOR[data.dayBranch]})</b>와 정면으로 충돌(沖)합니다. 안방이나 직장에 강한 변동성(이동, 이직, 이별 등)이 발생할 수 있는 역동적인 해입니다.\`
            : \`올해는 <b>\${sy.sip.split(' / ')[1]}</b>의 기운이 지배적입니다. 이 에너지가 당신의 원국에 안착하면서 해당 십성(결과물, 명예, 활동력 등)에 관련된 현실적 사건이 터집니다.\`;

        html += \`
        <div style="margin-bottom: 15px; padding: 20px; border-radius: 8px; \${yt}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: \${isThisYear ? 'var(--gold)' : '#fff'}; font-size: 18px; font-weight: 800;">\${sy.year}년 (\${sy.gan}\${sy.zi}년)</span>
                <span style="color: #666; font-size: 12px; font-weight: 700;">\${sy.sip.replace(' / ', ' · ')} | \${sy.unsung}</span>
            </div>
            <p style="margin: 0; color: #ccc; font-size: 14px; line-height: 1.7;">\${actionText}</p>
        </div>\`;
    });
    
    html += \`</div>\`;
    return html;
}
`;

code = code.replace(ch10Regex, ch10New);
fs.writeFileSync('report_engine.js', code);
console.log("Chapter 10 Updated");
