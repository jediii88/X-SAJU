#!/usr/bin/env python3
# buildChapter7_Hidden 함수 3108~3179번 줄을 확장 버전으로 교체

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 3108~3179 (1-indexed) = 3107~3178 (0-indexed)
# 함수 경계 확인
start_idx = 3107  # function buildChapter7_Hidden(data) {
end_idx = 3179    # 빈 줄 (buildChapter8_Health 직전)

new_func = r'''function buildChapter7_Hidden(data) {
    const pillars = data.pillars || [];
    const dayStem = data.dayStem || "";
    const dayBranch = data.dayBranch || "";
    const HIDDEN = {"子":["壬","癸"],"丑":["己","癸","辛"],"寅":["甲","丙","戊"],"卯":["甲","乙"],"辰":["戊","乙","癸"],"巳":["丙","庚","戊"],"午":["丙","己","丁"],"未":["己","丁","乙"],"申":["庚","壬","戊"],"酉":["庚","辛"],"戌":["戊","辛","丁"],"亥":["壬","甲"]};
    const BKR = {"子":"자","丑":"축","寅":"인","卯":"묘","辰":"진","巳":"사","午":"오","未":"미","申":"신","酉":"유","戌":"술","亥":"해"};
    const SKR = {"甲":"갑목","乙":"을목","丙":"병화","丁":"정화","戊":"무토","己":"기토","庚":"경금","辛":"신금","壬":"임수","癸":"계수"};
    const HDM = {
        "子":"자(子) 안에는 임수와 계수가 숨어있습니다. 지혜와 탐구의 기운이 내면 깊이 잠들어 있습니다. 표면에서 보이는 것보다 훨씬 깊은 내면의 지혜를 지니고 있으며, 혼자 있는 시간에 엄청난 통찰이 쌓입니다. 분석력과 전략적 사고가 발동하는 시기에 예상을 뛰어넘는 지적 능력이 드러나며, 수 기운의 대운이 들어올 때 인생의 결정적 도약이 일어납니다.",
        "丑":"축(丑) 안에는 기토, 계수, 신금이 공존합니다. 안정·지혜·정밀함이 동시에 내재되어 있습니다. 느려 보이지만 내면에서 엄청난 에너지가 응축되는 상태입니다. 이 에너지가 폭발하는 시기에 주변이 깜짝 놀랄 성과를 냅니다. 인내가 극에 달할 때 가장 놀라운 결과가 터져나옵니다.",
        "寅":"인(寅) 안에는 갑목, 병화, 무토가 숨어있습니다. 개척·열정·안정의 세 에너지가 폭발적으로 공존합니다. 무언가를 시작할 때 엄청난 에너지를 발휘하며, 인생에서 가장 중요한 출발의 순간에 이 에너지가 진가를 발휘합니다. 목 기운의 대운에서 강렬한 출발과 리더십이 폭발합니다.",
        "卯":"묘(卯) 안에는 갑목과 을목이 함께 있습니다. 성장과 관계의 에너지가 집중되어 있습니다. 사람을 끌어당기는 능력, 관계를 통해 성장하는 능력이 강합니다. 이 내면의 목 기운이 활성화될 때 인맥과 협력이 인생을 크게 도약시킵니다. 봄의 에너지처럼 모든 것이 싹트는 시기를 만들어냅니다.",
        "辰":"진(辰) 안에는 무토, 을목, 계수가 공존합니다. 안정·성장·지혜가 한데 모인 용의 자리입니다. 예측 불허의 잠재력이 숨어있어 이 기운이 폭발하는 시기에 인생이 완전히 다른 궤도로 전환됩니다. 진은 변화와 혁신의 에너지로 시대를 앞선 인물들이 가진 지지입니다.",
        "巳":"사(巳) 안에는 병화, 경금, 무토가 있습니다. 열정·결단·안정이 공존합니다. 뱀이 허물을 벗듯 완전한 변신을 통해 성장합니다. 한 번의 큰 변화를 통해 이전과 완전히 다른 사람이 됩니다. 화 기운과 금 기운이 동시에 내재되어 열정적이면서도 냉철한 판단이 가능합니다.",
        "午":"오(午) 안에는 병화, 기토, 정화가 있습니다. 태양의 절정, 성취와 인정의 에너지입니다. 세상의 인정을 받고 싶은 욕구가 강하며, 내면의 불 기운이 사회적 활동으로 폭발할 때 탁월한 성과를 냅니다. 화 기운의 대운에서 모든 것이 드러나고 빛나는 시기가 옵니다.",
        "未":"미(未) 안에는 기토, 정화, 을목이 있습니다. 감성·열정·성장이 내재되어 있습니다. 예술적 감수성과 따뜻한 인간미가 강합니다. 사람의 마음을 움직이는 능력이 있으며 창작 활동에서 특히 강한 잠재력이 발현됩니다. 인간적 관계와 문화 분야에서 빛나는 재능이 숨어있습니다.",
        "申":"신(申) 안에는 경금, 임수, 무토가 있습니다. 결단·지혜·안정이 공존합니다. 기민한 판단력과 실행력이 강점입니다. 머뭇거림 없이 행동할 때 가장 큰 성과를 냅니다. 금과 수 기운이 동시에 내재되어 냉철한 분석과 빠른 실행이 가능한 조합입니다.",
        "酉":"유(酉) 안에는 경금과 신금이 있습니다. 완성과 정밀함의 에너지입니다. 가을 수확처럼 쌓아온 노력이 결실을 맺는 자리입니다. 완성도에 대한 집착이 분야 최고의 전문성으로 이어집니다. 순수한 금 기운이 집중되어 어떤 분야에서든 최고의 수준을 추구하는 본능이 강합니다.",
        "戌":"술(戌) 안에는 무토, 신금, 정화가 있습니다. 신뢰·정밀함·열정이 공존합니다. 깊은 충성심과 의리, 불필요한 것을 걷어내는 통찰이 이 지지의 핵심입니다. 인생의 마무리 국면에서 진가를 발휘하며 끝까지 함께하는 사람으로 인정받습니다.",
        "亥":"해(亥) 안에는 임수와 갑목이 있습니다. 깊은 잠재력과 새로운 시작의 씨앗입니다. 조용히 준비하다 가장 결정적인 순간에 폭발하는 에너지를 가지고 있습니다. 수 기운의 지혜와 목 기운의 성장이 결합하여 방대한 지식과 새로운 출발의 에너지가 공존합니다."
    };
    const dayHidden = HIDDEN[dayBranch] || [];
    const dayHiddenText = dayHidden.length > 0 ? dayHidden.map(s => SKR[s]||s).join(", ") : "지장간 정보 없음";
    const cards = pillars.map((p) => {
        const ji = typeof p.h === "string" ? p.h[1] : (p.h ? p.h[1] : "");
        const hidden = HIDDEN[ji] || [];
        if(!ji || hidden.length === 0) return "";
        const hiddenKr = hidden.map(s => SKR[s]||s).join(" · ");
        const meaning = HDM[ji] || "";
        return `<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin-bottom:14px;break-inside:avoid;">`
            + `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px;">`
            + `<div><span style="font-size:11px;color:var(--gold);letter-spacing:1px;">${p.n} — ${BKR[ji]||ji}(${ji})</span>`
            + `<div style="font-size:17px;font-weight:700;color:#ddd;margin-top:4px;">숨겨진 천간: ${hiddenKr}</div></div>`
            + `<span style="font-size:12px;color:#888;">지장간 ${hidden.length}개</span></div>`
            + `<p style="font-size:13.5px;color:#bbb;line-height:1.9;margin:0;">${meaning}</p>`
            + `</div>`;
    }).filter(Boolean).join("");
    return `<div class="report-chapter chapter-start">`
        + `<h3 class="ch-title">Chapter 7. 지장간 — 표면 너머 숨겨진 또 다른 나</h3>`
        + `<p class="ch-text">사주의 지지 각각의 내부에는 1~3개의 천간이 숨겨져 있습니다. 이것을 地藏干(지장간)이라 합니다. 겉으로 드러나지 않는 당신의 진짜 내면, 잠재된 재능, 숨겨진 욕망, 아직 발현되지 않은 능력을 담고 있습니다. 표면적 성격은 천간에서 나오지만, 진짜 동기와 숨겨진 욕망은 지장간에서 나옵니다.</p>`
        + `<p class="ch-text">지장간은 평소에는 조용히 잠들어 있지만 세 가지 상황에서 강렬하게 발동합니다. 첫째, 해당 지장간 오행과 같은 대운이나 세운이 들어올 때입니다. 둘째, 인생의 극한 위기 상황에서 숨겨진 에너지가 폭발합니다. 셋째, 지장간 오행을 가진 특정 인물과의 만남이 이 에너지를 자극합니다. 지장간의 발동 시점을 파악하면 예상치 못한 자신의 모습이 언제 나타날지 미리 알 수 있습니다.</p>`
        + `<div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 20px;border-radius:0 10px 10px 0;margin:20px 0;">`
        + `<div style="font-size:11px;color:var(--gold);margin-bottom:8px;letter-spacing:1px;">일지(日支) 지장간 — 내면의 핵심</div>`
        + `<p style="font-size:15px;color:#ddd;line-height:1.9;margin:0;">당신의 일지 <b style="color:var(--gold);">${BKR[dayBranch]||dayBranch}(${dayBranch})</b> 안에는 <b style="color:var(--gold);">${dayHiddenText}</b>의 기운이 숨어있습니다. 이것이 당신의 무의식 깊은 곳에서 진짜로 원하는 것, 의식하지 못하는 동기, 그리고 아직 세상에 드러내지 않은 잠재력의 원천입니다.</p>`
        + `</div>`
        + `<h4 style="color:var(--gold);font-size:16px;margin:24px 0 16px;border-bottom:1px solid rgba(199,167,106,0.3);padding-bottom:8px;">4주 지장간 완전 해부</h4>`
        + (cards || `<p style="color:#999;">지장간 데이터를 계산 중입니다.</p>`)
        + `<div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">`
        + `<div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 12지지별 지장간 완전 해설</div>`
        + `<p style="font-size:13px;color:#ccc;line-height:1.9;margin:0 0 14px;">각 지지 안에 숨겨진 지장간은 그 지지의 표면적 의미를 넘어서는 복합적 에너지를 담고 있습니다. 대운과 세운에서 같은 지지가 들어올 때 이 지장간들이 차례로 발동하여 10년의 흐름 속에서 다양한 사건과 기회를 만들어냅니다.</p>`
        + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#64b5f6;font-weight:700;margin-bottom:4px;">子(자) — 壬癸</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 수기운 집결. 지혜·지략·깊은 감수성이 잠든 곳. 분석력과 전략적 통찰이 폭발합니다. 이 지장간이 발동하면 예상을 뛰어넘는 지적 능력이 드러납니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">丑(축) — 己癸辛</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·수·금 복합. 인내·저력·정밀한 판단력 내재. 겉은 느려보이나 내면엔 엄청난 에너지가 축적되어 있습니다. 발동 시 놀라운 지구력을 발휘합니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:4px;">寅(인) — 甲丙戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">목·화·토 복합. 강인한 도전 정신·열정·리더십 내재. 발동하면 강렬한 추진력으로 새로운 시대를 열어젖힙니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:4px;">卯(묘) — 甲乙</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 목기운. 섬세한 감성·관계 맺는 능력·성장 본능. 인간관계와 창의적 표현에서 탁월한 재능이 발현됩니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">辰(진) — 乙戊癸</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">목·토·수 복합. 변화·혁신·예측불가 잠재력 응집. 발동하면 예상치 못한 방향으로 운명이 전환됩니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ff7043;font-weight:700;margin-bottom:4px;">巳(사) — 丙庚戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">화·금·토 복합. 집중적 통찰·결단·변신 에너지. 냉철한 판단으로 인생의 방향을 완전히 바꾸는 결단을 내립니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ff7043;font-weight:700;margin-bottom:4px;">午(오) — 丙己丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">화·토·화 복합. 강렬한 열정·성취욕·빛나고 싶은 본능. 발동하면 주목받는 위치로 급격히 부상합니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">未(미) — 己乙丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·목·화 복합. 따뜻한 감수성·예술적 재능·배려심. 인간관계와 창작 분야에서 예상을 초월하는 능력이 발현됩니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#b0bec5;font-weight:700;margin-bottom:4px;">申(신) — 庚壬戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">금·수·토 복합. 날카로운 분석력·변화 추진력·실행력. 신속한 결단으로 기회를 낚아채는 탁월한 능력.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#b0bec5;font-weight:700;margin-bottom:4px;">酉(유) — 庚辛</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 금기운. 완벽주의·정밀한 심미안·보석 같은 재능. 최고의 완성도로 세상의 인정을 받는 작업을 완성합니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">戌(술) — 戊辛丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·금·화 복합. 깊은 통찰·끝까지 파고드는 탐구심·강인한 의지. 겉은 평온해 보이지만 내면에서 거대한 변환 진행.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#64b5f6;font-weight:700;margin-bottom:4px;">亥(해) — 壬甲</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">수·목 복합. 방대한 지식욕·새로운 시작 갈망·자유로운 정신. 발동하면 지혜와 창조력이 동시에 폭발하며 새 방향으로 나아갑니다.</p></div>`
        + `</div>`
        + `</div>`
        + `<div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:16px;border-left:3px solid var(--gold);margin:16px 0;">`
        + `<div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">지장간과 일간의 관계 — 십성으로 읽는 숨겨진 욕망</div>`
        + `<p style="font-size:13px;color:#ccc;line-height:1.88;margin:0 0 10px;">地藏干(지장간)이 일간과 맺는 십성 관계는 당신이 내면 깊숙이 욕망하는 것을 드러냅니다. 지장간의 십성이 비견·겁재라면 독립과 경쟁에 대한 강렬한 욕구가 있습니다. 식신·상관이라면 창조와 표현에 대한 본능적 갈망이 잠들어 있습니다. 정재·편재라면 물질적 성취와 세상을 지배하고 싶은 욕구가 핵심입니다. 정관·편관이라면 사회적 인정과 권력에 대한 은밀한 욕망이 있습니다. 정인·편인이라면 지식과 보호받고 싶은 깊은 내면의 필요가 있습니다.</p>`
        + `<p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">이 욕망이 채워지지 않을 때 사람은 불안하고, 채워질 때 진정한 만족을 느낍니다. 지장간의 발동 시점을 정확히 파악하면, 자신의 인생에서 언제 잠재력이 폭발하고 언제 내면의 갈등이 극대화되는지 미리 알 수 있습니다. 이것이 지장간 분석의 진짜 가치입니다.</p>`
        + `</div>`
        + `<p class="ch-text" style="margin-top:20px;">지장간은 대운이나 세운의 특정 기운이 들어올 때 활성화됩니다. 평소에 잠들어 있던 지장간의 에너지가 외부 기운과 만나 반응하면서 예상치 못한 사건과 기회가 생깁니다. 특히 지장간의 여기(餘氣), 중기(中氣), 정기(正氣) 순서로 에너지가 발현되는 시점을 이해하면 10년 단위 대운의 흐름 속에서 언제 어떤 일이 일어날지 더 정확하게 예측할 수 있습니다.</p>`
        + `</div>`;
}

'''

result = lines[:start_idx] + [new_func] + lines[end_idx:]

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.writelines(result)
print(f"Done. Lines: {len(lines)} -> {len(result)}")
