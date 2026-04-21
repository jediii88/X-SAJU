#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# buildDaewunLoop에서 천간/지지 두 칸 박스 → 종합 서사 한 칸으로 교체
# 핵심: rows.forEach 내부의 카드 HTML 구조 변경

old_card = '''        out += `<div style="background:rgba(255,255,255,${isCurrent?'0.07':'0.03'});border:1px solid ${isCurrent?'var(--gold)':'rgba(255,255,255,0.07)'};border-radius:12px;padding:18px;break-inside:avoid;">
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
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">천간 ${gan}</div>
                    <p style="font-size:12.5px;color:#ddd;line-height:1.75;margin:0;">${ganD}</p>
                </div>
                <div style="background:rgba(0,0,0,0.25);border-radius:8px;padding:12px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">지지 ${ji}</div>
                    <p style="font-size:12.5px;color:#ddd;line-height:1.75;margin:0;">${jiD}</p>
                </div>
            </div>
            ${strategy}
        </div>`;'''

new_card = '''        // PERIOD_NARRATIVE: 간지 조합별 종합 서사
        const ganjiKey = gan+ji;
        const periodNarr = PERIOD_NARRATIVE[ganjiKey] || ganD + ' ' + jiD;
        const ganKr = HK[gan]||gan; const jiKr = HK[ji]||ji;

        out += `<div style="background:rgba(255,255,255,${isCurrent?'0.07':'0.03'});border:1px solid ${isCurrent?'var(--gold)':'rgba(255,255,255,0.07)'};border-radius:12px;padding:18px;break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <div>
                        <div style="font-size:18px;font-weight:800;color:var(--gold);">${age}세 ~ ${age+9}세</div>
                        <div style="font-size:12px;color:rgba(199,167,106,0.6);margin-top:2px;">${ganKr}${jiKr}운 · ${b.replace(/[🌟✦—⚠❌]/g,'').trim()}</div>
                        ${isCurrent?'<span style="font-size:10px;background:var(--gold);color:#000;padding:2px 8px;border-radius:8px;font-weight:700;display:inline-block;margin-top:4px;">▶ 지금 이 시기</span>':''}
                    </div>
                </div>
                <span style="font-size:13px;font-weight:700;color:${c};padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">${b}</span>
            </div>
            <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:14px;margin-bottom:12px;">
                <p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">${periodNarr}</p>
            </div>
            ${strategy}
        </div>`;'''

if old_card in content:
    content = content.replace(old_card, new_card)
    print("대운 카드 구조 교체 완료")
else:
    print("대운 카드 패턴 못 찾음 — 부분 검색")
    # 짧게 잘라서 확인
    snippet = '                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">천간 ${gan}</div>'
    print("천간 라벨 있음:", snippet in content)

# ============================================================
# buildSewunLoop 세운 카드 구조 교체
# 천간/지지 두 칸 → 연도별 종합 서사 하나
# ============================================================
old_sewun_card = '''            rows += `<div style="background:rgba(255,255,255,${isNow?'0.07':'0.03'});border-radius:10px;padding:16px;border:1px solid ${isNow?'var(--gold)':'rgba(255,255,255,0.07)'};break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:22px;font-weight:800;color:var(--gold);font-family:'Noto Serif KR',serif;">${hanja}</span>
                    <span style="font-size:13px;color:#aaa;">${yr}년 ${GAN_KR[stem]} ${JI_KR[branch]}년</span>
                    ${isNow?'<span style="font-size:11px;background:var(--gold);color:#000;padding:2px 8px;border-radius:10px;font-weight:700;">올해</span>':''}
                </div>
                <span style="font-size:13px;font-weight:700;color:${col};padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">${label}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">천간 ${stem}</div>
                    <div style="font-size:12px;color:#ddd;line-height:1.65;">${GAN_DESC[stem]||''}</div>
                </div>
                <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">지지 ${branch}</div>
                    <div style="font-size:12px;color:#ddd;line-height:1.65;">${JI_DESC[branch]||''}</div>
                </div>
            </div>'''

new_sewun_card = '''            // 세운 종합 서사 생성 (천간+지지 조합의 의미를 하나로)
            const stemKr = GAN[ganIdx]; const branchKr = JI[jiIdx];
            const yearNarr = score>=3
                ? `${yr}년은 당신에게 찾아오는 황금의 해입니다. 재물, 직업, 관계 모든 분야에서 긍정적인 에너지가 겹칩니다. 이 해를 절대 허비하지 마십시오. 오랫동안 마음속에 품어온 계획을 이 해에 실행하십시오. 망설임이 가장 큰 실패입니다. 이 해에 내린 선택이 향후 3~5년의 방향을 결정합니다.`
                : score>=1
                ? `${yr}년은 순풍이 부는 해입니다. 큰 위기 없이 계획한 것들이 차근차근 진행됩니다. 이 흐름을 유지하면서 중요한 프로젝트를 꾸준히 진행하십시오. 과욕을 부리지 않으면서도 할 수 있는 것들을 착실하게 실행하는 해입니다.`
                : score===0
                ? `${yr}년은 현상 유지의 해입니다. 특별히 좋지도 나쁘지도 않은 안정적인 흐름입니다. 이 해에는 새로운 시도보다 기존에 진행 중인 것을 잘 마무리하고 다음 해를 준비하는 것이 현명합니다. 급격한 변화보다 내실을 다지는 데 집중하십시오.`
                : score>=-2
                ? `${yr}년은 신중하게 움직여야 하는 해입니다. 에너지가 분산되거나 예상치 못한 방해가 생길 수 있습니다. 무리한 투자나 급격한 변화는 피하고, 이 해는 준비와 내공 강화에 집중하십시오. 수비가 최선의 전략입니다.`
                : `${yr}년은 각별히 조심해야 하는 해입니다. 재물, 건강, 관계 어느 분야에서도 큰 결정은 피하십시오. 현금을 보전하고 건강을 챙기며 이 해를 조용히 넘기는 것이 최선입니다. 폭풍이 지나가면 다시 기회가 옵니다.`;

            rows += `<div style="background:rgba(255,255,255,${isNow?'0.07':'0.03'});border-radius:10px;padding:16px;border:1px solid ${isNow?'var(--gold)':'rgba(255,255,255,0.07)'};break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
                <div>
                    <div style="font-size:17px;font-weight:800;color:var(--gold);">${yr}년</div>
                    <div style="font-size:11px;color:rgba(199,167,106,0.6);margin-top:2px;">${stemKr}${branchKr}년</div>
                    ${isNow?'<span style="font-size:11px;background:var(--gold);color:#000;padding:2px 8px;border-radius:10px;font-weight:700;display:inline-block;margin-top:4px;">▶ 올해</span>':''}
                </div>
                <span style="font-size:13px;font-weight:700;color:${col};padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">${label}</span>
            </div>
            <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:12px;margin-bottom:10px;">
                <p style="font-size:13px;color:#ddd;line-height:1.8;margin:0;">${yearNarr}</p>
            </div>'''

if old_sewun_card in content:
    content = content.replace(old_sewun_card, new_sewun_card)
    print("세운 카드 구조 교체 완료")
else:
    print("세운 카드 패턴 못 찾음")
    snippet2 = '                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">천간 ${stem}</div>'
    print("세운 천간 라벨 있음:", snippet2 in content)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("저장 완료")
