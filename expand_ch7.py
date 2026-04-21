#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# buildChapter7_Hidden 확장 - 마지막 ch-text 앞에 삽입
TARGET7 = '        <p class="ch-text" style="margin-top:16px;">이 숨겨진 기운은 평소에는 작동하지 않습니다.'

EXTRA7 = '''        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 지장간 심층 의미 — 표면 아래 숨겨진 진짜 본능</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 14px;">地藏干(지장간)이란 각 지지 안에 숨겨진 천간의 기운입니다. 원국의 8글자는 세상에 드러난 겉모습이지만, 지장간은 그 아래에 숨겨진 무의식적 욕망과 잠재력의 원천입니다. 특히 일지(日支)의 지장간은 배우자궁이자 내면의 욕망이 가장 밀집된 곳입니다. 평소에는 드러나지 않다가, 지장간 오행과 같은 기운이 대운 또는 세운으로 들어올 때 비로소 폭발합니다. 이것이 갑작스러운 재능 발현 또는 성격 변화의 진짜 원인입니다. 지장간을 이해하면 자신의 잠재적 가능성과 숨겨진 약점을 모두 파악할 수 있습니다.</p>
            <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;margin-bottom:12px;">
                <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">12지지별 지장간 완전 해설</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#64b5f6;font-weight:700;margin-bottom:4px;">子(자) — 壬癸</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 수기운 집결. 지혜·지략·깊은 감수성이 잠든 곳. 분석력과 전략적 통찰이 폭발합니다.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">丑(축) — 己癸辛</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·수·금 복합. 인내·저력·정밀한 판단력 내재. 겉은 느려보이나 내면엔 엄청난 에너지 축적.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:4px;">寅(인) — 甲丙戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">목·화·토 복합. 강인한 도전 정신·열정·리더십 내재. 발동하면 새로운 시대를 여는 추진력.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:4px;">卯(묘) — 甲乙</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 목기운. 섬세한 감성·관계 맺는 능력·성장 본능. 인간관계와 창의 표현에서 탁월.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">辰(진) — 乙戊癸</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">목·토·수 복합. 변화·혁신·예측불가 잠재력. 발동하면 예상치 못한 방향으로 운명 전환.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ff7043;font-weight:700;margin-bottom:4px;">巳(사) — 丙庚戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">화·금·토 복합. 집중 통찰·결단·변신 에너지. 냉철한 판단으로 인생 방향을 완전히 바꿉니다.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ff7043;font-weight:700;margin-bottom:4px;">午(오) — 丙己丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">화·토·화 복합. 강렬한 열정·성취욕·빛나고 싶은 본능. 발동하면 주목받는 위치로 급부상.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">未(미) — 己乙丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·목·화 복합. 따뜻한 감수성·예술적 재능·배려심. 인간관계와 창작에서 예상을 초월하는 능력.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#b0bec5;font-weight:700;margin-bottom:4px;">申(신) — 庚壬戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">금·수·토 복합. 날카로운 분석·변화 추진력·실행력. 신속한 결단으로 기회를 낚아채는 능력.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#b0bec5;font-weight:700;margin-bottom:4px;">酉(유) — 庚辛</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 금기운. 완벽주의·정밀한 심미안·보석 같은 재능. 최고의 완성도로 세상의 인정을 받습니다.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">戌(술) — 戊辛丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·금·화 복합. 깊은 통찰·탐구심·강인한 의지. 겉은 평온해 보이지만 내면에서 거대한 변환 진행.</p></div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#64b5f6;font-weight:700;margin-bottom:4px;">亥(해) — 壬甲</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">수·목 복합. 방대한 지식욕·새로운 시작 갈망·자유로운 정신. 지혜와 창조력이 동시에 폭발.</p></div>
                </div>
            </div>
            <div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:16px;border-left:3px solid var(--gold);">
                <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">지장간과 일간의 관계 — 십성으로 읽는 숨겨진 욕망</div>
                <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0 0 10px;">지장간이 일간과 맺는 十星(십성) 관계는 당신이 내면 깊숙이 욕망하는 것을 드러냅니다. 비견·겁재 지장간이라면 독립과 경쟁에 대한 강렬한 욕구가 있습니다. 식신·상관이라면 창조와 표현에 대한 본능적 갈망이 잠들어 있습니다. 정재·편재라면 물질적 성취와 세상을 지배하고 싶은 욕구가 핵심입니다. 정관·편관이라면 사회적 인정과 권력에 대한 은밀한 욕망이 있습니다. 정인·편인이라면 지식과 보호받고 싶은 깊은 내면의 필요가 있습니다.</p>
                <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">이 욕망이 채워지지 않을 때 사람은 불안하고, 채워질 때 진정한 만족을 느낍니다. 지장간의 발동 시점을 정확히 파악하면, 자신의 인생에서 언제 잠재력이 폭발하고 언제 내면의 갈등이 극대화되는지 미리 알 수 있습니다. 이것이 지장간 분석의 진짜 가치입니다.</p>
            </div>
        </div>
'''

if TARGET7 in content:
    content = content.replace(TARGET7, EXTRA7 + TARGET7, 1)
    print("OK: buildChapter7_Hidden 확장 완료")
else:
    print("FAIL: buildChapter7_Hidden 대상 없음")
    idx = content.find('이 숨겨진 기운은 평소에는')
    print(f"  idx={idx}")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
