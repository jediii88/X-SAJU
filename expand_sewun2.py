#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 세운 분석 핵심 원칙 박스 뒤, 카드 루프 전에 추가 섹션 삽입
# 현재: "...세운 분석 원칙" 박스 -> 카드 목록
# 목표: 세운 분석 섹션 확장

TARGET = "        <div style=\"display:flex;flex-direction:column;gap:12px;\">${rows}</div>\n    </div>`;\n}\n\nfunction buildWolunLoop"

EXTRA = """        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:20px 0 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:14px;letter-spacing:1px;">&#9670; 10천간 × 12지지 — 세운 기운 완전 가이드</div>
            <p style="font-size:13px;color:#ccc;line-height:1.9;margin:0 0 12px;">아래 10천간과 12지지의 기운을 이해하면 어떤 연도든 스스로 분석할 수 있는 능력이 생깁니다. 천간은 그 해의 방향성과 에너지의 성질을, 지지는 그 해의 실질적 사건과 흐름을 결정합니다.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                    <div style="font-size:11px;color:var(--gold);font-weight:700;margin-bottom:6px;">10천간 기운 해설</div>
                    <div style="display:flex;flex-direction:column;gap:4px;">
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#4fc3a1;">甲(갑)</b> 새로운 시작과 도전. 창업·출발에 유리. 두려움 없는 첫발이 핵심.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#4fc3a1;">乙(을)</b> 유연한 적응. 관계·협상·네트워킹이 재물을 만드는 해.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ff7043;">丙(병)</b> 태양처럼 드러남. 명성과 인정의 해. 자신을 적극 알려야.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ff7043;">丁(정)</b> 집중과 내실. 한 분야 전문성 강화. 깊이가 성과를 만듦.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ffca28;">戊(무)</b> 묵직한 안정. 장기 투자·부동산 기운. 10년 후를 내다봐야.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ffca28;">己(기)</b> 실용적 마무리. 기존 사업 정리·실속 챙기기.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#b0bec5;">庚(경)</b> 결단과 쇄신. 불필요한 것을 쳐내고 새 기준을 세우는 해.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#b0bec5;">辛(신)</b> 정밀한 완성. 디테일과 품질이 성패를 가름.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#64b5f6;">壬(임)</b> 인맥 확산. 유동적 투자·이동·새 기회가 사방에서 등장.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#64b5f6;">癸(계)</b> 내면 충전. 분석·연구·조용히 내공 쌓는 해.</p>
                    </div>
                </div>
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                    <div style="font-size:11px;color:var(--gold);font-weight:700;margin-bottom:6px;">12지지 기운 해설</div>
                    <div style="display:flex;flex-direction:column;gap:4px;">
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#64b5f6;">子(자)</b> 지혜·집중. 아이디어가 넘치는 해. 문서·계약에 유리.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ffca28;">丑(축)</b> 인내·저력. 눈에 띄지 않는 성실함이 미래 토대를 쌓음.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#4fc3a1;">寅(인)</b> 활동·도전. 새로운 출발과 이동의 에너지가 강함.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#4fc3a1;">卯(묘)</b> 관계·성장. 인맥이 확장되고 협력 기회가 풍부.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ffca28;">辰(진)</b> 잠재력 발동. 예상치 못한 기회와 변수가 공존.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ff7043;">巳(사)</b> 집중·변신. 결단력이 필요한 해. 큰 변화의 전조.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ff7043;">午(오)</b> 성취·인정. 사회적 성과가 드러나는 화려한 해.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ffca28;">未(미)</b> 감성·풍요. 창작·문화·예술 분야에서 결실.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#b0bec5;">申(신)</b> 판단·결단. 빠른 결정이 성패를 가름.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#b0bec5;">酉(유)</b> 완성·보상. 노력이 결실로 돌아오는 해.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#ffca28;">戌(술)</b> 통찰·마무리. 깊은 성찰과 정리가 필요한 국면.</p>
                        <p style="font-size:11px;color:#bbb;line-height:1.7;margin:0;"><b style="color:#64b5f6;">亥(해)</b> 잠복·준비. 표면 침체지만 내면의 힘이 충전되는 해.</p>
                    </div>
                </div>
            </div>
            <div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:14px;border-left:3px solid var(--gold);">
                <div style="font-size:11px;color:var(--gold);margin-bottom:8px;">세운 활용 핵심 전략</div>
                <p style="font-size:12.5px;color:#ccc;line-height:1.88;margin:0;">길한 세운에는 인생의 주요 결정(창업·이직·투자·결혼)을 실행하십시오. 흉한 세운에는 현상 유지와 내공 축적에 집중하되, 몸과 마음의 건강 관리를 최우선으로 두십시오. 가장 강력한 전략은 길한 세운에 씨를 뿌리고, 흉한 세운에 뿌리를 내리며, 다음 길운에 폭발적으로 수확하는 것입니다. 단기적 결과에 집착하지 말고, 10년의 사이클을 보고 전략을 수립하십시오.</p>
            </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">${rows}</div>
    </div>`;
}

function buildWolunLoop"""

if TARGET in content:
    content = content.replace(TARGET, EXTRA, 1)
    print("OK: SewunLoop 추가 확장 완료")
else:
    print("FAIL: SewunLoop 추가 대상 없음")
    idx = content.find('${rows}</div>\n    </div>`;\n}\n\nfunction buildWolunLoop')
    print(f"  idx={idx}")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
