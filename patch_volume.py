"""
대운 풀이 전면 확장 + Axe 제거 + 성격 챕터 추가
"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    html = f.read()

# ── 1. buildDaewunLoop 교체: 대운 각각 4~5섹션 ──
old_dw = '''    let html = `<div class="report-chapter"><h3 class="ch-title">Chapter 10. 大運(대운) 80년 심층 해부</h3>
    <p class="ch-text" style="margin-bottom:25px;">大運(대운)은 10년 단위로 교체되는 당신 인생의 '날씨'입니다. 用神(용신) 기운의 대운이 오면 순풍을 타고, 忌神(기신) 기운이 오면 역풍을 만납니다. 어떤 날씨가 오든 미리 알고 대비하면 피해를 최소화하고 기회를 극대화할 수 있습니다.</p>
    <div class="timeline">`;

    daewuns.forEach((dw, idx) => {
        const gz = dw.gz || ['甲','子'];
        const stemOH = OHMAP[gz[0]] || 'earth';
        const branchOH = OHMAP[gz[1]] || 'earth';
        const score = (sc[stemOH]||0) + (sc[branchOH]||0);
        const isGood = score >= 1;
        const isBad = score <= -1;
        const borderColor = isGood ? '#00C853' : isBad ? '#e74c3c' : 'var(--gold)';
        const label = isGood ? '🟢 吉運(길운)' : isBad ? '🔴 凶運(흉운)' : '🟡 中和運(중화운)';
        const theme = DW_THEMES[idx % DW_THEMES.length];
        const advice = isGood 
            ? `이 대운은 당신의 용신(${OHKR[yong]})과 공명합니다. 적극적으로 확장하고 도전하십시오. 10년 중 최소 3~4년은 폭발적인 성과를 낼 수 있는 황금기가 포함되어 있습니다.`
            : isBad 
            ? `기신(${OHKR[gi]})의 기운이 강한 시기입니다. 무리한 투자나 사업 확장을 자제하고 내실을 다지십시오. 이 시기를 잘 버텨낸 자만이 다음 좋은 대운의 과실을 온전히 수확합니다.`
            : `중화운으로 큰 부침 없이 안정적인 흐름을 유지합니다. 특별한 행운도 재난도 아닌, 실력대로 평가받는 시기입니다.`;
        
        html += `
            <div class="timeline-item" style="margin-bottom: 25px; padding: 20px; background: rgba(255,255,255,0.04); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-left: 4px solid ${borderColor}; border-radius: 4px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h4 style="color: ${borderColor}; font-size: 18px; margin:0;">${dw.age}세 ~ ${dw.age+9}세 : [${dw.name}]</h4>
                    <span style="font-size:12px; color:${borderColor}; font-weight:700;">${label}</span>
                </div>
                <p style="color: #fff; font-size: 15px; font-weight:700; margin-bottom:8px;">${theme[0]}</p>
                <p style="color: #ccc; font-size: 14px; line-height: 1.8; margin-bottom:12px;">${theme[1]}</p>
                <div style="background:#1a1a1a; padding:12px; border-radius:6px; font-size:13px; color:#bbb; line-height:1.7;">
                    <b style="color:${borderColor};">📌 이 시기 핵심 전략: </b>${advice}
                </div>
            </div>
        `;
    });
    html += `</div></div>`;
    return html;
}'''

new_dw = r'''    const DW_STEM_DESC = {
        '甲':'큰 나무처럼 곧고 강한 리더십의 기운이 천간에 흐릅니다. 새로운 시작과 독립, 개척 정신이 이 시기를 지배합니다. 지금까지 준비해온 것들을 세상 밖으로 내보낼 최적의 환경이 갖춰집니다.',
        '乙':'덩굴처럼 유연하게 환경에 적응하는 기운이 천간에 흐릅니다. 부드럽지만 목표를 향해 끝없이 나아가는 생명력이 발현됩니다. 강직하게 정면 돌파하기보다 유연하게 돌아가는 전략이 효과적입니다.',
        '丙':'태양처럼 사방을 밝히는 강렬한 기운이 천간에 흐릅니다. 사회적 존재감이 극대화되고 리더로서의 면모가 드러나는 시기입니다. 당신의 이름이 더 넓은 무대에 알려지기 시작합니다.',
        '丁':'별처럼 깊고 섬세하게 빛나는 기운이 천간에 흐릅니다. 감수성과 통찰력이 날카로워지며 내면의 재능이 꽃을 피웁니다. 겉으로 화려하지 않더라도 내실 있는 성취가 쌓이는 시기입니다.',
        '戊':'거대한 산처럼 묵직하고 중후한 안정의 기운이 천간에 흐릅니다. 이 시기에 쌓은 기반은 쉽사리 무너지지 않습니다. 사람들이 당신을 믿고 의지하며, 신뢰 자본이 급격히 쌓이는 시기입니다.',
        '己':'기름진 논밭처럼 무엇이든 품어내는 포용의 기운이 천간에 흐릅니다. 사람들이 자연스럽게 모여들고 신뢰가 쌓이는 시기입니다. 실무 능력과 세밀한 실행력이 빛을 발합니다.',
        '庚':'차갑게 단련된 금속의 기운이 천간에 흐릅니다. 외부의 압박이 강해지지만 그 압박이 당신을 더욱 날카롭고 강하게 벼립니다. 결단력이 요구되는 상황이 빈번하게 찾아옵니다.',
        '辛':'순수하게 정제된 보석의 기운이 천간에 흐릅니다. 완성도와 전문성이 빛을 발하며, 세상이 당신의 진짜 가치를 알아보기 시작합니다. 오래 갈고닦은 실력이 정당한 보상을 받습니다.',
        '壬':'대해처럼 깊고 광활한 지혜의 기운이 천간에 흐릅니다. 큰 그림을 그리고 전략적으로 사고하는 능력이 극대화됩니다. 넓은 시야로 새로운 분야를 개척하는 선구자 역할이 주어집니다.',
        '癸':'깊은 샘처럼 차갑고 명확한 분석의 기운이 천간에 흐릅니다. 논리와 직관이 예리하게 살아나며 숨겨진 진실을 꿰뚫어봅니다. 조용하지만 실력으로 승부하는 조용한 전성기입니다.'
    };
    const DW_BRANCH_DESC = {
        '子':'자(子)수의 지지 기운이 땅 속 깊이 흐릅니다. 겨울의 절정처럼 극도의 집중과 축적의 에너지가 보이지 않는 곳에서 응집됩니다. 준비한 자에게 결실이 찾아오는 구조입니다.',
        '丑':'축(丑)토의 지지 기운이 흐릅니다. 혹독한 겨울을 견디는 얼어붙은 대지처럼 외부 환경은 녹록지 않습니다. 그러나 이 인내의 시간이 다음 봄을 준비하는 가장 강력한 기반입니다.',
        '寅':'인(寅)목의 지지 기운이 흐릅니다. 대지를 박차고 솟아오르는 봄의 첫 호랑이 기운입니다. 새로운 출발과 도전의 에너지가 강하게 발동하며 막혔던 길이 열립니다.',
        '卯':'묘(卯)목의 지지 기운이 흐릅니다. 봄꽃이 만발하는 생명 폭발의 에너지입니다. 관계와 창의력이 만개하며 귀인과의 만남이 빈번해지는 시기입니다.',
        '辰':'진(辰)토의 지지 기운이 흐릅니다. 용이 잠든 봄의 대지처럼 거대한 잠재력이 서서히 깨어나고 있습니다. 겉으로는 조용해 보이지만 내부에서 결정적인 변화가 일어납니다.',
        '巳':'사(巳)화의 지지 기운이 흐릅니다. 강렬한 여름의 시작, 뱀의 예리한 관찰력과 폭발적 변신의 에너지가 흐릅니다. 숨겨진 재능이 세상 밖으로 드러나는 시기입니다.',
        '午':'오(午)화의 지지 기운이 흐릅니다. 한여름 정오의 태양처럼 에너지가 극에 달합니다. 사회적 성취의 절정기가 오며 이름이 알려지고 인정받는 시기입니다.',
        '未':'미(未)토의 지지 기운이 흐릅니다. 무더운 여름의 축적된 열기와 땅의 관록입니다. 경험이 지혜로 숙성되고 인간관계에서 두터운 신뢰가 쌓이는 시기입니다.',
        '申':'신(申)금의 지지 기운이 흐릅니다. 가을 서리처럼 냉철한 결단의 기운입니다. 불필요한 것을 과감히 쳐내는 용기가 필요한 시기로, 선택과 집중이 핵심 전략입니다.',
        '酉':'유(酉)금의 지지 기운이 흐릅니다. 가을 추수의 정밀한 수확 기운입니다. 노력에 대한 정당한 보상이 이루어지며, 그동안 투자한 것들이 결실을 맺습니다.',
        '戌':'술(戌)토의 지지 기운이 흐릅니다. 가을이 저물어가는 황혼의 중후함입니다. 깊어진 통찰로 주변을 이끄는 역할이 주어지며, 인생의 진정한 가치를 재정립하는 시기입니다.',
        '亥':'해(亥)수의 지지 기운이 흐릅니다. 겨울 바다의 심연처럼 무한한 가능성이 잠든 저장고입니다. 다음 사이클을 위한 에너지를 충전하고 내면을 깊이 들여다보는 시기입니다.'
    };
    const HAP_KEYS = {'子丑':['子丑합토','귀인과의 결합, 안정적 자원 확보'],'寅亥':['寅亥합목','성장의 기운 활성화, 새 출발'],'卯戌':['卯戌합화','열정과 변화의 에너지 폭발'],'辰酉':['辰酉합금','전문성 결실, 완성도 극대화'],'巳申':['巳申합수','지혜와 계획의 결합'],'午未':['午未합토','중화와 안정의 에너지']};
    const CHUNG_KEYS = {'子午':['子午충','물과 불의 정면 충돌 — 이직·이사·관계 변화가 옵니다. 큰 변동에 대비하십시오.'],'丑未':['丑未충','안정 기반이 흔들림 — 이별·재정 변동. 유연하게 대응하십시오.'],'寅申':['寅申충','봄과 가을의 충돌 — 교통사고·이동 다발. 각별히 안전에 주의하십시오.'],'卯酉':['卯酉충','관계의 균열 — 소송·갈등 주의. 감정적 대응을 자제하십시오.'],'辰戌':['辰戌충','땅의 진동 — 부동산·직장 변동. 중요 계약 시 신중하게 검토하십시오.'],'巳亥':['巳亥충','숨겨진 충돌 — 건강 이상·비밀 누설 주의. 내면의 안정에 집중하십시오.']};

    let html = `<div class="report-chapter" id="sec-daeun-detail"><h3 class="ch-title">Chapter 10. 大運(대운) 80년 심층 해부</h3>
    <p class="ch-text" style="margin-bottom:12px;">大運(대운)은 10년 단위로 교체되는 당신 인생의 계절입니다. 用神(용신) 기운의 대운에는 순풍을 타고, 忌神(기신) 기운에는 역풍을 만납니다. 어떤 계절이 오든 미리 알고 준비하면, 그 계절의 주인이 될 수 있습니다.</p>
    <div style="background:rgba(199,167,106,0.07);border-radius:10px;padding:14px 18px;margin-bottom:28px;display:flex;gap:20px;flex-wrap:wrap;">
        <div><div style="font-size:10px;color:var(--text-dim);margin-bottom:3px;">用神(용신)</div><b style="color:#00C853;">${OHKR[yong]}</b></div>
        <div><div style="font-size:10px;color:var(--text-dim);margin-bottom:3px;">喜神(희신)</div><b style="color:#4fc3f7;">${OHKR[hee]}</b></div>
        <div><div style="font-size:10px;color:var(--text-dim);margin-bottom:3px;">忌神(기신)</div><b style="color:#e74c3c;">${OHKR[gi]}</b></div>
        <div><div style="font-size:10px;color:var(--text-dim);margin-bottom:3px;">仇神(구신)</div><b style="color:#ff8a65;">${OHKR[goo]}</b></div>
    </div>
    <div class="timeline">`;

    daewuns.forEach((dw, idx) => {
        const gz = dw.gz || ['甲','子'];
        const stem = gz[0]; const branch = gz[1];
        const stemOH = OHMAP[stem] || 'earth';
        const branchOH = OHMAP[branch] || 'earth';
        const score = (sc[stemOH]||0) + (sc[branchOH]||0);
        const isGood = score >= 1;
        const isBad = score <= -1;
        const borderColor = isGood ? '#00C853' : isBad ? '#e74c3c' : 'var(--gold)';
        const label = isGood ? '🟢 吉運(길운)' : isBad ? '🔴 凶運(흉운)' : '🟡 中和運(중화운)';
        const theme = DW_THEMES[idx % DW_THEMES.length];

        // 원국 지지와 합충 분석
        const pillars = data.pillars || [];
        const origBranches = pillars.map(p => p.h ? p.h[1] : '').filter(Boolean);
        let hapHtml = '', chungHtml = '';
        origBranches.forEach(ob => {
            const pair = [ob, branch].sort().join('');
            if(HAP_KEYS[pair]) hapHtml += `<span style="color:#4fc3f7;font-size:12px;background:rgba(79,195,247,0.08);padding:3px 8px;border-radius:4px;">${HAP_KEYS[pair][0]} — ${HAP_KEYS[pair][1]}</span> `;
            if(CHUNG_KEYS[pair]) chungHtml += `<span style="color:#e74c3c;font-size:12px;background:rgba(231,76,60,0.08);padding:3px 8px;border-radius:4px;">${CHUNG_KEYS[pair][0]}</span> `;
        });

        const stemDesc = DW_STEM_DESC[stem] || '';
        const branchDesc = DW_BRANCH_DESC[branch] || '';

        const strategy = isGood
            ? `用神(용신) ${OHKR[yong]}과 공명하는 이 대운은 당신 인생의 황금기입니다. 그동안 쌓아온 것들이 세상에 드러나고 사회적 인정이 뒤따릅니다. 이 10년 안에 최소 3~4년은 폭발적인 기회가 찾아옵니다. 귀인과의 만남이 활성화되고 새로운 협력관계가 형성됩니다. 조심스럽게 기다릴 것이 아니라 과감하게 확장하고 투자하십시오. 이 시기에 확보한 자산과 인맥이 평생의 자산이 됩니다.`
            : isBad
            ? `忌神(기신) ${OHKR[gi]}의 기운이 강해지는 이 대운은 제동이 걸리는 시기입니다. 그러나 이것은 패배가 아닙니다. 폭풍 속에서도 뿌리를 깊이 내리는 나무처럼, 이 시기를 어떻게 버티느냐가 다음 황금기의 규모를 결정합니다. 무리한 투자와 확장을 자제하고 핵심 역량 강화와 현금 확보에 집중하십시오. 이 시기를 온전히 버텨낸 자만이 다음 吉運(길운)의 과실을 온전히 수확합니다.`
            : `큰 길흉의 파도 없이 실력대로 평가받는 中和運(중화운)입니다. 화려한 행운보다는 꾸준한 실력 향상과 기반 다지기에 집중하십시오. 이 시기에 묵묵히 쌓아올린 것들이 다음 吉運(길운)이 왔을 때 폭발적인 성과로 전환되는 기폭제가 됩니다.`;

        const healthMap = {wood:'간담·신경계 이상 신호에 즉각 반응하십시오. 피로가 쌓이면 간 수치부터 확인하세요.',fire:'심장·혈관 계통을 점검하십시오. 가슴 두근거림, 혈압 이상, 수면 장애가 신호입니다.',earth:'위장·소화기 계통이 예민해집니다. 불규칙한 식사와 폭식을 피하고 규칙적인 생활을 유지하십시오.',metal:'호흡기·폐 계통을 챙기십시오. 미세먼지 노출을 줄이고 정기적인 폐 기능 검사를 권장합니다.',water:'신장·호르몬 계통의 에너지 고갈에 주의하십시오. 충분한 수면과 수분 섭취가 최우선 건강 관리입니다.'};
        const healthNote = healthMap[stemOH] || '전반적인 건강 관리를 게을리하지 마십시오.';

        const chungWarning = chungHtml ? `<div style="background:rgba(231,76,60,0.07);border-radius:8px;padding:12px 14px;margin-bottom:12px;"><div style="font-size:11px;color:rgba(255,120,120,0.8);margin-bottom:6px;letter-spacing:1px;">⚠ 원국과의 충돌 경보</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${chungHtml}</div><div style="font-size:12px;color:#bbb;margin-top:8px;">${CHUNG_KEYS[Object.keys(CHUNG_KEYS).find(k=>origBranches.some(ob=>[ob,branch].sort().join('')===k))||'']?.[1]||'충(冲)의 기운이 작용합니다. 중요한 결정 전 신중하게 점검하십시오.'}</div></div>` : '';
        const hapInfo = hapHtml ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">${hapHtml}</div>` : '';

        html += `
            <div class="timeline-item" style="margin-bottom:36px;padding:24px;background:rgba(255,255,255,0.04);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-left:4px solid ${borderColor};border-radius:0 12px 12px 0;box-shadow:0 4px 24px rgba(0,0,0,0.35);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
                    <h4 style="color:${borderColor};font-size:20px;margin:0;font-family:'Noto Serif KR',serif;">${dw.age}세 ~ ${dw.age+9}세 &nbsp;·&nbsp; ${stem}${branch}(${dw.name||stem+branch}) 대운</h4>
                    <span style="font-size:13px;color:${borderColor};font-weight:700;background:rgba(255,255,255,0.06);padding:5px 14px;border-radius:20px;">${label}</span>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
                    <div style="padding:14px;background:rgba(255,255,255,0.03);border-radius:8px;">
                        <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">天干(천간) ${stem} 분석</div>
                        <div style="font-size:13.5px;color:#ddd;line-height:1.75;">${stemDesc}</div>
                    </div>
                    <div style="padding:14px;background:rgba(255,255,255,0.03);border-radius:8px;">
                        <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;">地支(지지) ${branch} 분석</div>
                        <div style="font-size:13.5px;color:#ddd;line-height:1.75;">${branchDesc}</div>
                    </div>
                </div>

                ${hapInfo}${chungWarning}

                <p style="color:#fff;font-size:16px;font-weight:700;margin-bottom:10px;font-family:'Noto Serif KR',serif;">${theme[0]}</p>
                <p style="color:#ccc;font-size:14.5px;line-height:1.9;margin-bottom:16px;">${theme[1]}</p>

                <div style="background:rgba(255,255,255,0.04);border-left:3px solid ${borderColor};padding:16px 18px;border-radius:0 8px 8px 0;margin-bottom:14px;">
                    <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">이 시기의 핵심 전략</div>
                    <p style="color:#ddd;font-size:14.5px;line-height:1.9;margin:0;">${strategy}</p>
                </div>

                <div style="background:rgba(255,80,80,0.05);border-radius:8px;padding:12px 14px;display:flex;gap:10px;align-items:flex-start;">
                    <span style="font-size:18px;flex-shrink:0;">🫀</span>
                    <div>
                        <div style="font-size:11px;color:rgba(255,160,160,0.7);margin-bottom:5px;letter-spacing:1px;">건강 주의사항</div>
                        <div style="font-size:13.5px;color:#bbb;line-height:1.75;">${healthNote}</div>
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div></div>`;
    return html;
}'''

if old_dw in html:
    html = html.replace(old_dw, new_dw)
    print("buildDaewunLoop 교체 성공")
else:
    print("buildDaewunLoop 패턴 불일치")

# ── 2. buildSewunLoop Axe 레이블 제거 ──
html = html.replace(
    '''                <div style="background: rgba(255,255,255,0.05); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); padding: 15px; border-radius: 6px; border-left: 3px solid #d32f2f;">
                    <span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🚨 Axe의 행동 지침:</span>
                    <span style="color: #bbb; font-size: 14px; line-height: 1.6;"> ${i%2===0 ? "올해는 투자를 확장하거나 새로운 일을 벌이기보다는, 내실을 다지고 현금을 확보하는 방어적 태세가 당신을 살립니다." : "올해는 당신의 판입니다. 70%의 확신만 섰다면 뒤돌아보지 말고 즉시 실행하십시오. 머뭇거리면 기운을 뺏깁니다."}</span>
                </div>''',
    '''                <div style="background:rgba(255,255,255,0.04);border-left:3px solid ${i%2===0?'#e74c3c':'#00C853'};padding:14px 16px;border-radius:0 8px 8px 0;margin-top:4px;">
                    <div style="