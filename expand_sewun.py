#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 세운 카드에서 닫는 부분에 4분야 조언 추가
# 현재: `</div>\n            </div>\n        </div>`;`
# 목표: 그 앞에 score 기반 4분야 조언 그리드 삽입

OLD_SEW = """                </div>
            </div>
        </div>`;
    }

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 11. 향후 10년 세운 정밀 타격</h3>"""

NEW_SEW = """                </div>
            </div>
            <div style="background:rgba(255,255,255,${score>=2?'0.04':score>=0?'0.03':'0.02'});border-radius:8px;padding:12px;margin-top:8px;border:1px solid rgba(${score>=2?'0,200,83':score>=0?'255,255,255':'255,150,0'},0.${score>=2?'15':'07'});">
                <div style="font-size:10px;color:${col};font-weight:700;margin-bottom:8px;">4분야 종합 조언</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <div style="background:rgba(0,0,0,0.2);border-radius:5px;padding:7px 9px;">
                        <div style="font-size:9px;color:#c7a76a;margin-bottom:3px;">💰 재물</div>
                        <p style="font-size:11px;color:#bbb;line-height:1.65;margin:0;">${score>=2?'투자·사업 확장의 최적 시기. 주요 재물 결정을 이 해에 집중하십시오. 새로운 수입원을 개척하기에 최적입니다.':score>=0?'재물은 안정적입니다. 꾸준한 저축과 기존 자산 관리에 집중하며 복리를 쌓으십시오.':'대규모 투자와 보증은 피하십시오. 현금 유동성 확보와 지출 최소화가 최우선입니다.'}</p>
                    </div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:5px;padding:7px 9px;">
                        <div style="font-size:9px;color:#c7a76a;margin-bottom:3px;">💼 직업</div>
                        <p style="font-size:11px;color:#bbb;line-height:1.65;margin:0;">${score>=2?'커리어 도약의 황금기. 이직·승진·창업 도전을 두려워하지 마십시오. 이 해의 선택이 10년을 결정합니다.':score>=0?'현재 위치에서 전문성을 높이는 시기. 자격증 취득과 네트워크 구축에 집중하십시오.':'급격한 직장 변화는 리스크가 큽니다. 내공을 쌓고 다음 기회를 준비하는 시기로 활용하십시오.'}</p>
                    </div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:5px;padding:7px 9px;">
                        <div style="font-size:9px;color:#c7a76a;margin-bottom:3px;">❤️ 애정</div>
                        <p style="font-size:11px;color:#bbb;line-height:1.65;margin:0;">${score>=2?'인연의 문이 활짝 열립니다. 새로운 만남에 적극적이고 기존 관계를 더욱 깊게 발전시키기에 최적의 시기.':score>=0?'관계는 안정적입니다. 신뢰를 쌓고 서로 이해를 넓히는 데 집중하십시오.':'인간관계에서 오해와 갈등이 생길 수 있습니다. 감정적 대응을 자제하고 신중히 소통하십시오.'}</p>
                    </div>
                    <div style="background:rgba(0,0,0,0.2);border-radius:5px;padding:7px 9px;">
                        <div style="font-size:9px;color:#c7a76a;margin-bottom:3px;">🏥 건강</div>
                        <p style="font-size:11px;color:#bbb;line-height:1.65;margin:0;">${score>=2?'건강 에너지가 충만합니다. 이 시기에 운동 습관을 구축하면 효과가 배가됩니다. 활발한 활동을 즐기십시오.':score>=0?'건강은 무난하나 과로를 경계하십시오. 규칙적인 수면과 식사, 정기 검진을 유지하십시오.':'면역력이 저하될 수 있습니다. 수면 7시간 이상, 알코올 절제, 정기 검진이 필수입니다.'}</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 11. 향후 10년 세운 정밀 타격</h3>"""

if OLD_SEW in content:
    content = content.replace(OLD_SEW, NEW_SEW, 1)
    print("OK: buildSewunLoop 확장 완료")
else:
    print("FAIL: buildSewunLoop 대상 없음")
    idx = content.find('Chapter 11. 향후 10년')
    print(f"  idx={idx}")
    if idx > 0:
        print(repr(content[idx-300:idx+50]))

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
