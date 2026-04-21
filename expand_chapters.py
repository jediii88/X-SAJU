#!/usr/bin/env python3
# X-SAJU 챕터 확장 스크립트

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

errors = []

# ===== 1. buildChapter4_Wealth 확장 =====
# 반환문 끝 "</div>`;" 바로 앞에 새 섹션 삽입
OLD4 = '''        <p class="ch-text">재물의 그릇은 고정된 것이 아닙니다. 용신 기운이 강해지는 대운에서 그릇이 커지고, 기신 기운의 대운에서는 방어가 중요합니다. 재물의 크기를 결정하는 것은 타고난 사주가 아니라, 그 사주의 기운을 얼마나 정확하게 활용하느냐입니다. 당신의 진짜 금고는 아직 열리지 않았습니다.</p>
    </div>`;
}

function buildDaewunLoop'''

NEW4 = '''        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 재물운 유형별 획득 전략 — 당신의 사주 유형에 맞는 로드맵</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 16px;">같은 재물이라도 사주의 구조에 따라 버는 방식이 완전히 달라야 합니다. 자신의 재물 구조를 모르고 남의 방식을 따라하는 것이 가장 큰 재물 손실입니다. 아래 세 가지 재물 구조 중 당신의 유형에 맞는 전략을 사용하십시오.</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;">
                    <div style="font-size:12px;font-weight:700;color:#4fc3a1;margin-bottom:8px;">無財(무재) 사주 — 전문성으로 부를 쌓는 전략</div>
                    <p style="font-size:13px;color:#bbb;line-height:1.88;margin:0;">재성이 없거나 매우 약한 사주에서 가장 큰 실수는 직접적으로 돈을 쫓는 것입니다. 이 구조의 재물 공식은 반대입니다 — 돈을 쫓지 않고 가치를 쌓으면 돈이 따라옵니다. 한 분야에서 대체 불가능한 전문가가 되십시오. 의사·변호사·작가·셰프·전문 강사처럼 "이 사람이 아니면 안 된다"는 인식이 형성될 때 재물이 폭발적으로 들어옵니다. 자격증과 인증, 출판과 강의, 브랜드 파워 구축이 이 유형의 핵심 재물 전략입니다. 초반에는 수입이 적어 불안할 수 있지만, 전문성이 임계점을 넘는 순간 수입이 폭발적으로 늘어납니다. 이 시점까지 포기하지 않는 인내가 무재 사주의 최대 과제입니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;">
                    <div style="font-size:12px;font-weight:700;color:#ffca28;margin-bottom:8px;">財多(재다) 사주 — 투자와 사업으로 부를 증폭하는 전략</div>
                    <p style="font-size:13px;color:#bbb;line-height:1.88;margin:0;">재성이 강한 사주는 돈의 흐름을 감지하는 본능이 탁월합니다. 이 구조의 재물 전략은 적극적인 투자와 사업 확장입니다. 부동산 투자, 주식·ETF, 사업 지분 투자 등 자본이 자본을 낳는 구조를 만드는 것이 핵심입니다. 그러나 재다 사주의 함정은 과욕입니다. 너무 많은 기회에 동시에 올라타면 모든 것이 반토막납니다. 핵심 원칙 하나 — 한 번에 하나의 투자 전략을 완성하고 그 다음으로 넘어가십시오. 성공한 투자자들이 공통적으로 하는 말이 "기회는 많지만 내가 잘 아는 것에만 투자한다"입니다. 재다 사주에서 이 원칙이 특히 중요합니다. 절대 감당할 수 없는 레버리지를 쓰지 마십시오.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;">
                    <div style="font-size:12px;font-weight:700;color:#64b5f6;margin-bottom:8px;">균형 사주 — 복합 전략으로 안정적 부를 구축하는 방법</div>
                    <p style="font-size:13px;color:#bbb;line-height:1.88;margin:0;">재성이 균형 잡힌 사주는 두 전략을 조합하는 것이 최선입니다. 메인 수입은 전문성 기반의 안정적인 직업 또는 사업으로 확보하고, 잉여 현금은 분산 투자(부동산·배당·인덱스 펀드)로 증식합니다. 이 구조의 핵심은 수입원의 이중화입니다 — 한 소스가 흔들려도 다른 소스가 버텨주는 구조. 안정성과 성장성을 동시에 추구하기 때문에 극단적인 부를 만드는 속도는 느리지만, 잃어버리는 일도 적습니다. 복리의 시간이 쌓이면 균형 사주가 가장 지속 가능한 부를 만듭니다.</p>
                </div>
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 용신별 재물 활성화 시기 — 언제 올인하고 언제 지킬 것인가</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 14px;">용신 오행이 강해지는 시기(대운·세운·계절)는 재물 에너지가 가장 강하게 활성화되는 황금기입니다. 이 시기를 미리 알면, 핵심 투자와 사업 결정을 이 때에 집중하여 성과를 극대화할 수 있습니다. 반대로 기신 오행이 강해지는 시기에는 무리한 확장보다 수비가 현명합니다.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="background:rgba(0,200,83,0.07);border-radius:8px;padding:14px;">
                    <div style="font-size:11px;color:#00C853;margin-bottom:8px;letter-spacing:0.5px;">✦ 용신 기운 강화 시기 — 공격 전략</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">용신 오행의 대운과 세운이 겹치는 시기가 인생 최대의 재물 기회입니다. 이 시기에는 ①사업 확장 또는 창업, ②부동산 매입, ③주요 투자 결정, ④이직·승진 도전을 실행하십시오. 용신 계절(봄=목, 여름=화, 환절기=토, 가을=금, 겨울=수)에 중요한 계약을 잡는 것도 운을 활용하는 방법입니다. 핵심은 기회를 흘려보내지 않는 것입니다 — 이 시기에 망설이면 다음 주기까지 10~20년을 기다려야 합니다.</p>
                </div>
                <div style="background:rgba(231,76,60,0.07);border-radius:8px;padding:14px;">
                    <div style="font-size:11px;color:#e74c3c;margin-bottom:8px;letter-spacing:0.5px;">✗ 기신 기운 강화 시기 — 방어 전략</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">기신 오행의 대운·세운이 겹치는 시기에는 재물 수비가 최우선입니다. 이 시기에 해야 할 것들: ①무리한 신규 투자 자제, ②보증 및 연대보증 절대 거부, ③현금 유동성 확보(최소 6개월 생활비), ④기존 자산 점검과 리밸런싱. 흉한 시기에 큰돈을 잃지 않는 것이 길한 시기에 버는 것만큼 중요합니다. 자산의 안전판을 미리 만들어두십시오.</p>
                </div>
            </div>
        </div>
        <p class="ch-text">재물의 그릇은 고정된 것이 아닙니다. 용신 기운이 강해지는 대운에서 그릇이 커지고, 기신 기운의 대운에서는 방어가 중요합니다. 재물의 크기를 결정하는 것은 타고난 사주가 아니라, 그 사주의 기운을 얼마나 정확하게 활용하느냐입니다. 당신의 진짜 금고는 아직 열리지 않았습니다.</p>
    </div>`;
}

function buildDaewunLoop'''

if OLD4 in content:
    content = content.replace(OLD4, NEW4, 1)
    print("OK: buildChapter4_Wealth 확장 완료")
else:
    errors.append("FAIL: buildChapter4_Wealth 대상 텍스트 없음")
    idx = content.find('당신의 진짜 금고는 아직')
    print(f"  DEBUG: '당신의 진짜 금고는 아직' found at idx={idx}")

# ===== 2. buildChapter7_Hidden 확장 =====
OLD7 = '''        <p class="ch-text" style="margin-top:16px;">이 숨겨진 기운은 평소에는 작동하지 않습니다. 인생의 극적인 위기나 결핍에 몰렸을 때, 혹은 해당 기운을 가진 대운과 세운이 들어올 때 비로소 폭발하며 당신을 전혀 다른 수준으로 끌어올립니다. 지장간의 발동 시점을 파악하면, 인생의 결정적 전환점이 언제 오는지 미리 알 수 있습니다.</p>
    </div>`;
}

function buildChapter8_Health'''

NEW7 = '''        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 지장간의 심층 의미 — 표면 아래 숨겨진 진짜 본능</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 14px;">지장간(地藏干)이란 각 지지(地支) 안에 숨겨진 하늘의 기운입니다. 사주 원국의 8글자는 세상에 드러난 당신의 겉모습이지만, 지장간은 그 아래에 숨겨진 당신의 무의식적 욕망과 잠재적 능력의 원천입니다. 특히 일지(日支) — 일간이 앉은 자리 — 의 지장간은 배우자궁이자 내면의 욕망이 가장 밀집된 곳입니다. 평소에는 드러나지 않다가, 지장간의 오행과 같은 기운이 대운 또는 세운으로 들어올 때 비로소 폭발적으로 발동합니다. 이것이 바로 "예상치 못한 재능의 발현" 또는 "갑작스러운 성격 변화"의 진짜 원인입니다. 지장간을 이해하면 자신의 잠재적 가능성과 숨겨진 약점을 모두 파악할 수 있습니다.</p>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px;">12지지별 지장간 완전 해설</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:5px;">子(자) — 지장간: 壬癸</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수한 수(水) 기운의 집결지. 자의 내면에는 지혜와 지략, 그리고 깊은 감수성이 잠들어 있습니다. 이 지장간이 발동하면 탁월한 분석력과 전략적 통찰이 폭발합니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:5px;">丑(축) — 지장간: 己癸辛</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·수·금의 복합 기운. 축의 내면에는 인내와 저력, 그리고 정밀한 판단력이 숨겨져 있습니다. 겉으로는 느리고 무거워 보이지만, 내면에는 엄청난 에너지가 축적되어 있습니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:5px;">寅(인) — 지장간: 甲丙戊</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">목·화·토의 복합 기운. 인의 내면에는 강인한 도전 정신과 열정, 그리고 사람을 이끄는 리더십이 내재됩니다. 인이 발동하면 강렬한 추진력으로 새로운 시대를 엽니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:5px;">卯(묘) — 지장간: 甲乙</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수한 목(木) 기운. 묘의 내면에는 섬세한 감성과 관계 맺는 능력, 그리고 끊임없이 성장하려는 본능이 있습니다. 인간관계와 창의적 표현에서 탁월한 재능이 발현됩니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:5px;">辰(진) — 지장간: 乙戊癸</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">목·토·수의 복합 기운. 진의 내면에는 변화와 혁신의 에너지, 그리고 예측 불가한 잠재력이 응집되어 있습니다. 진이 발동하면 예상치 못한 방향으로 운명이 전환됩니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#ff7043;font-weight:700;margin-bottom:5px;">巳(사) — 지장간: 丙庚戊</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">화·금·토의 복합 기운. 사의 내면에는 집중적인 통찰력과 결단력, 그리고 변신의 에너지가 있습니다. 발동하면 냉철한 판단으로 인생의 방향을 완전히 바꾸는 결단을 내립니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#ff7043;font-weight:700;margin-bottom:5px;">午(오) — 지장간: 丙己丁</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">화·토·화의 복합 기운. 오의 내면에는 강렬한 열정과 사회적 성취욕, 그리고 빛나고 싶은 본능이 있습니다. 발동하면 주목받는 위치로 급격히 부상하는 드라마틱한 전환이 일어납니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:5px;">未(미) — 지장간: 己乙丁</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·목·화의 복합 기운. 미의 내면에는 따뜻한 감수성과 예술적 재능, 그리고 사람을 배려하는 마음이 있습니다. 인간적 관계와 창작 분야에서 예상을 초월하는 능력이 발현됩니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#b0bec5;font-weight:700;margin-bottom:5px;">申(신) — 지장간: 庚壬戊</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">금·수·토의 복합 기운. 신의 내면에는 날카로운 분석력과 변화를 향한 추진력, 그리고 실행력이 있습니다. 발동하면 신속한 결단으로 기회를 낚아채는 탁월한 능력이 드러납니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#b0bec5;font-weight:700;margin-bottom:5px;">酉(유) — 지장간: 庚辛</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수한 금(金) 기운. 유의 내면에는 완벽주의와 정밀한 심미안, 그리고 보석처럼 빛나는 재능이 있습니다. 발동하면 최고의 완성도와 품질로 세상의 인정을 받는 작업을 완성합니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:5px;">戌(술) — 지장간: 戊辛丁</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·금·화의 복합 기운. 술의 내면에는 깊은 통찰과 끝까지 파고드는 탐구심, 그리고 강인한 의지가 있습니다. 발동하면 겉으로는 평온해 보이지만 내면에서 거대한 변환이 진행됩니다.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;">
                            <div style="font-size:11px;color:#64b5f6;font-weight:700;margin-bottom:5px;">亥(해) — 지장간: 壬甲</div>
                            <p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">수·목의 복합 기운. 해의 내면에는 방대한 지식욕과 새로운 시작을 향한 갈망, 그리고 자유로운 정신이 있습니다. 발동하면 지혜와 창조력이 동시에 폭발하며 전혀 새로운 방향으로 나아갑니다.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:16px;border-left:3px solid var(--gold);">
                <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">지장간과 일간의 관계 — 십성으로 읽는 숨겨진 욕망</div>
                <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0 0 10px;">지장간이 일간과 맺는 십성 관계는 당신이 내면 깊숙이 욕망하는 것을 드러냅니다. 지장간의 십성이 비견이나 겁재라면 — 내면에는 독립과 경쟁에 대한 강렬한 욕구가 있습니다. 식신이나 상관이라면 — 창조와 표현에 대한 본능적 갈망이 잠들어 있습니다. 정재나 편재라면 — 물질적 성취와 세상을 지배하고 싶은 욕구가 핵심입니다. 정관이나 편관이라면 — 사회적 인정과 권력에 대한 은밀한 욕망이 있습니다. 정인이나 편인이라면 — 지식과 보호받고 싶은 깊은 내면의 필요가 있습니다. 이 욕망이 채워지지 않을 때 사람은 불안하고, 이 욕망이 충족될 때 진정한 만족을 느낍니다.</p>
                <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">지장간의 발동 시점을 정확히 파악하면, 자신의 인생에서 언제 잠재력이 폭발하고 언제 내면의 갈등이 극대화되는지 미리 알 수 있습니다. 이것이 지장간 분석의 진짜 가치입니다.</p>
            </div>
        </div>
        <p class="ch-text" style="margin-top:16px;">이 숨겨진 기운은 평소에는 작동하지 않습니다. 인생의 극적인 위기나 결핍에 몰렸을 때, 혹은 해당 기운을 가진 대운과 세운이 들어올 때 비로소 폭발하며 당신을 전혀 다른 수준으로 끌어올립니다. 지장간의 발동 시점을 파악하면, 인생의 결정적 전환점이 언제 오는지 미리 알 수 있습니다.</p>
    </div>`;
}

function buildChapter8_Health'''

if OLD7 in content:
    content = content.replace(OLD7, NEW7, 1)
    print("OK: buildChapter7_Hidden 확장 완료")
else:
    errors.append("FAIL: buildChapter7_Hidden 대상 텍스트 없음")
    idx = content.find('이 숨겨진 기운은 평소에는')
    print(f"  DEBUG: '이 숨겨진 기운은 평소에는' found at idx={idx}")

# ===== 3. buildChapter9_Remedy 확장 =====
OLD9 = '''        <div style="background:rgba(199,167,106,0.06);border-radius:10px;padding:16px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px