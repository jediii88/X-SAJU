#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# buildChapter9_Remedy 확장 - 귀인의 조건 섹션 뒤에 추가 삽입
TARGET9 = "            <p style=\"font-size:13.5px;color:#ddd;line-height:1.8;margin:0;\">${colorDB.guien}이 당신에게 가장 강력한 귀인 에너지를 줍니다. 이 일간을 가진 사람들과의 협력과 동업은 용신 보충의 가장 빠른 지름길입니다. 주변에 이런 기운을 가진 사람이 있다면 적극적으로 가까이 하십시오.</p>\n        </div>\n    </div>`;\n}"

EXTRA9 = """            <p style="font-size:13.5px;color:#ddd;line-height:1.8;margin:0;">${colorDB.guien}이 당신에게 가장 강력한 귀인 에너지를 줍니다. 이 일간을 가진 사람들과의 협력과 동업은 용신 보충의 가장 빠른 지름길입니다. 주변에 이런 기운을 가진 사람이 있다면 적극적으로 가까이 하십시오.</p>
        </div>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 오행별 용신 심층 개운법 — 매일의 선택이 운명을 바꾼다</div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="background:${{wood:'rgba(79,195,161,0.06)',fire:'rgba(255,112,67,0.06)',earth:'rgba(255,202,40,0.06)',metal:'rgba(176,190,197,0.06)',water:'rgba(100,181,246,0.06)'}}[yong]||'rgba(255,255,255,0.04)';border-radius:8px;padding:16px;border-left:3px solid var(--gold);">
                    <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">${yongKr} 용신(用神) — 당신의 운명을 여는 열쇠</div>
                    <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0 0 10px;">${{
                        wood: '목(木) 용신인 당신에게 초록의 세계는 에너지의 원천입니다. 동쪽을 향한 책상 배치와 침실 방향이 용신 기운을 극대화합니다. 초록·청록·연두 계열의 옷과 소품을 의식적으로 활용하십시오. 봄(3~5월)이 당신의 황금 시즌입니다. 이 시기에 중요한 결정과 계약을 집중하십시오. 나무와 숲 속에서의 시간, 식물 가꾸기, 등산이 목 기운을 보충합니다. 신맛 음식(레몬·식초·매실·녹차)을 규칙적으로 섭취하십시오. 목 기운 일간인 甲(갑)·乙(을) 일간의 사람이 가장 강력한 귀인입니다. 동쪽 방향의 이동과 확장이 길합니다.',
                        fire: '화(火) 용신인 당신에게 빨강과 열정의 에너지가 운명의 엔진입니다. 남쪽을 향한 방향 배치와 붉은·주황·분홍 계열의 컬러 활용이 화기를 활성화합니다. 여름(6~8월)이 당신의 전성기이며 오전부터 정오까지의 시간대가 최적의 활동 시간입니다. 촛불을 자주 켜거나 따뜻한 조명 환경을 만드는 것이 화 기운을 보충합니다. 쓴맛 음식(녹차·여주·쑥·아메리카노)을 적당히 즐기고 심장 건강에 신경쓰십시오. 화 기운 일간인 丙(병)·丁(정) 일간의 사람이 에너지를 불어넣는 귀인입니다. 열정적이고 사교적인 활동, 무대에 오르는 경험이 운을 활성화합니다.',
                        earth: '토(土) 용신인 당신에게 황토와 중심의 안정감이 운명의 뿌리입니다. 집이나 사무실의 중앙과 북동·남서 방향이 토 기운의 핵심 방위입니다. 노랑·황토·베이지·오렌지 계열의 색상을 활용하고, 환절기(3·6·9·12월)를 적극 활용하십시오. 황토방·찜질·온천이 토 기운을 충전합니다. 단맛 음식(꿀·고구마·호박·대추)이 에너지를 보충합니다. 토 기운 일간인 戊(무)·己(기) 일간의 사람이 귀인입니다. 안정적이고 장기적인 투자, 부동산 관련 활동이 이 기운을 극대화합니다.',
                        metal: '금(金) 용신인 당신에게 흰색과 금속의 결단력이 운명의 날입니다. 서쪽과 북서쪽이 행운 방위이며 흰색·금색·은색·회색 계열의 색상이 금 기운을 활성화합니다. 가을(9~11월)이 전성기이며 저녁 시간대가 최적 활동 시간입니다. 금속 소품(시계·반지·목걸이)을 몸에 지니는 것이 금 기운을 보충합니다. 매운맛 음식(생강·마늘·고추·도라지)으로 폐 기운을 강화하십시오. 금 기운 일간인 庚(경)·辛(신) 일간의 사람이 귀인입니다. 단호한 결단과 정리 정돈이 이 기운을 극대화합니다.',
                        water: '수(水) 용신인 당신에게 검정과 파란색의 지혜 에너지가 운명의 원천입니다. 북쪽이 행운 방위이며 검정·파랑·감색·남색 계열의 색상이 수 기운을 활성화합니다. 겨울(12~2월)과 밤부터 새벽 시간대가 최고의 활동 시간입니다. 수족관·분수·바다·강 근처에서 에너지를 충전하십시오. 짠맛 음식(된장·미역·검은콩·블루베리)이 신장 기운을 보강합니다. 수 기운 일간인 壬(임)·癸(계) 일간의 사람이 지혜를 더해주는 귀인입니다. 분석·연구·학습·명상이 이 기운을 극대화합니다.'
                    }}[yong] || '용신 오행에 맞는 색상·방향·음식을 일상에 적극 활용하십시오. 작은 습관의 변화가 운의 흐름을 바꿉니다.'}</p>
                </div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 귀인 유형과 만남 전략</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 14px;">명리학에서 귀인(貴人)이란 단순히 좋은 사람이 아닙니다. 당신의 용신 기운을 보충해주는 오행 에너지를 가진 사람입니다. 같은 직장에 있어도 어떤 사람과 가까이 있느냐에 따라 당신의 에너지 상태가 완전히 달라집니다. 용신 오행의 일간을 가진 사람이 당신의 가장 강력한 귀인입니다. 이 귀인과의 협업은 시너지가 극대화됩니다. 반대로 기신 오행의 일간을 가진 사람과의 지나친 밀착은 에너지를 소진시킵니다. 귀인과의 만남 전략: 용신 오행의 방위(동·남·서·북)에 있는 장소에서의 만남이 더 좋은 인연을 이어줍니다. 용신 계절(봄·여름·가을·겨울)에 중요한 만남의 자리를 만드십시오. 당신이 먼저 용신 에너지를 발산하는 사람이 되면, 비슷한 기운의 귀인이 자연스럽게 끌려옵니다.</p>
        </div>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 인생 시기별 종합 전략 — 20대부터 60대까지의 로드맵</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:6px;">20대 — 기반 구축의 시기</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">이 시기의 핵심은 전문성의 씨앗을 심는 것입니다. 용신 오행과 관련된 분야에서 기술과 지식을 쌓으십시오. 20대에 한 분야에 1만 시간을 투자한 사람은 30대에 폭발적 성과를 냅니다. 이 시기의 인간관계는 평생의 귀인이 됩니다. 양보다 질로 깊은 관계를 만드십시오. 재물보다 경험과 실력에 투자하는 것이 이 시기의 정답입니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:6px;">30대 — 실력 폭발의 시기</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">20대에 쌓은 씨앗이 결실을 맺기 시작합니다. 사업이든 커리어든 용신 오행을 활용한 방향으로 집중적인 에너지를 투입하십시오. 이 시기에 핵심 자산(부동산·주식·사업 지분)의 첫 포석을 두어야 합니다. 결혼과 가정을 꾸리는 시기라면 파트너가 귀인인지 확인하십시오. 30대의 가장 큰 실수는 남들의 성공을 부러워하며 자신의 방향을 잃는 것입니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:6px;">40대 — 수확과 재정비의 시기</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">이 시기는 수확의 계절입니다. 30대에 투자한 것들이 본격적인 결과로 돌아옵니다. 동시에 건강과 체력이 서서히 변화하기 시작합니다. 용신 오행에 맞는 건강 관리가 이 시기의 핵심 투자입니다. 사회적 포지션과 브랜드를 정립하는 시기이며, 선택과 집중으로 에너지를 아끼십시오. 불필요한 인간관계를 정리하고 핵심 귀인과의 관계를 더욱 깊게 만드십시오.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:6px;">50대 이후 — 유산을 만드는 시기</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">이 시기에는 자신의 경험과 지혜를 다음 세대에 전달하는 역할이 운을 극대화합니다. 멘토링·교육·저술·강의를 통해 자신의 이름이 남는 일을 하십시오. 재물은 수비 전략으로 지키되, 의미 있는 곳에 투자하십시오. 용신 기운이 남아 있는 한 포기란 없습니다. 인생의 마지막 장이 가장 빛날 수도 있습니다.</p>
                </div>
            </div>
        </div>
    </div>`;
}"""

if TARGET9 in content:
    content = content.replace(TARGET9, EXTRA9, 1)
    print("OK: buildChapter9_Remedy 확장 완료")
else:
    print("FAIL: TARGET9 없음")
    idx = content.find('귀인의 조건')
    print(f"  idx={idx}")
    if idx > 0:
        print(repr(content[idx-20:idx+200]))

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
