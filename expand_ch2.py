with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

fn_name = 'buildChapter2_Wuxing'
start = html.find(f'function {fn_name}(data) {{')
depth=0; i=start; end=-1
while i<len(html):
    if html[i]=='{': depth+=1
    elif html[i]=='}':
        depth-=1
        if depth==0: end=i+1; break
    i+=1

new_code = (
"function buildChapter2_Wuxing(data) {\n"
"    const wuxing = data.wuxing || {};\n"
"    const OHKR2 = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};\n"
"    let maxW = 'earth', minW = 'water';\n"
"    if(Object.keys(wuxing).length > 0) {\n"
"        maxW = Object.keys(wuxing).reduce((a,b) => wuxing[a]>wuxing[b]?a:b);\n"
"        minW = Object.keys(wuxing).reduce((a,b) => wuxing[a]<wuxing[b]?a:b);\n"
"    }\n"
"    const excessText = window.SAJU_DB?.WUXING_EXCESS?.[maxW] || '기운이 한쪽으로 강하게 쏠려 있습니다.';\n"
"    const maxKr = OHKR2[maxW]||maxW; const minKr = OHKR2[minW]||minW;\n"
"    const excessPer = {wood:'목(木) 기운이 지배적인 당신은 끝없이 성장하고 확장하려는 본능이 강합니다. 멈춰 있으면 내면이 갑갑해집니다. 새로운 프로젝트, 새로운 관계, 새로운 목표를 향해 끊임없이 나아가는 것이 당신의 생존 방식입니다. 이 에너지는 창업가, 개척자, 선도자에게 가장 어울립니다. 단 지속력보다 시작력이 강한 편이므로 마무리를 의식적으로 챙기는 훈련이 필요합니다.',\n"
"        fire:'화(火) 기운이 지배적인 당신은 어디서든 주목받고 영향력을 발휘하는 천부적 재능이 있습니다. 열정이 넘치고 표현력이 폭발적이며 주변 에너지를 끌어올리는 능력이 탁월합니다. 단 이 뜨거운 에너지는 제어하지 않으면 번아웃을 유발하거나 주변과의 충돌로 이어집니다. 냉각 시간을 의도적으로 갖는 것이 지속 가능한 성취의 열쇠입니다.',\n"
"        earth:'토(土) 기운이 지배적인 당신은 묵직한 안정감과 신뢰감이 가장 큰 자산입니다. 사람들이 자연스럽게 의지합니다. 이 중후함이 리더십의 기반이 되며 어떤 환경에서도 흔들리지 않는 중심축이 됩니다. 다만 변화에 대한 저항이 강해 새로운 기회를 놓치는 경우가 생깁니다. 의도적인 변화 수용이 필요합니다.',\n"
"        metal:'금(金) 기운이 지배적인 당신은 불필요한 것을 과감히 쳐내는 결단력이 탁월합니다. 원칙과 기준이 명확하여 어떤 압박에도 흔들리지 않습니다. 이 냉철함이 전문성과 결합할 때 분야 최고 권위자가 됩니다. 단 감정 표현이 부족하여 가까운 사람들과의 관계에서 오해를 받을 수 있습니다.',\n"
"        water:'수(水) 기운이 지배적인 당신은 깊은 통찰력과 유연성을 가지고 있습니다. 복잡한 상황을 꿰뚫어보고 남들이 보지 못하는 본질을 파악합니다. 전략가, 분석가, 기획자로서의 천재적 능력으로 발현됩니다. 단 결정을 미루고 지나치게 분석하는 경향이 기회를 놓치게 만들기도 합니다.'\n"
"    }[maxW] || '';\n"
"    const lackDesc = {wood:'목(木) 기운이 부족합니다. 새로운 도전에 대한 두려움이 잠재됩니다. 의도적으로 새로운 것에 뛰어드는 경험 확장이 잠재된 능력을 깨웁니다.',\n"
"        fire:'화(火) 기운이 부족합니다. 열정과 표현력이 내면으로 향하는 경향이 있습니다. 생각과 감정을 세상에 드러내는 연습이 잠재 능력을 깨우는 열쇠입니다.',\n"
"        earth:'토(土) 기운이 부족합니다. 안정감보다 변화를 선호하는 경향이 있습니다. 한 곳에서 꾸준히 성장하는 것이 가장 큰 도전이자 기회입니다.',\n"
"        metal:'금(金) 기운이 부족합니다. 결단을 내리고 마무리하는 것이 어렵습니다. 시작한 일을 끝맺고 불필요한 것을 버리는 용기가 인생을 도약시킵니다.',\n"
"        water:'수(水) 기운이 부족합니다. 행동이 판단보다 앞서는 경향이 있습니다. 결정 전 충분히 생각하고 전략을 세우는 습관이 실수를 줄이고 성과를 극대화합니다.'\n"
"    }[minW] || '';\n"
"    const balanceRows = Object.entries(wuxing).sort((a,b)=>b[1]-a[1]).map(([k,v]) => {\n"
"        const pct = Math.round(v); const isMax = k===maxW; const isMin = k===minW;\n"
"        const col = isMax ? 'var(--gold)' : isMin ? '#666' : '#aaa';\n"
"        const ohChar = {wood:'木',fire:'火',earth:'土',metal:'金',water:'水'}[k]||k;\n"
"        return `<div style=\"display:flex;align-items:center;gap:10px;margin-bottom:8px;\"><div style=\"width:44px;text-align:right;font-size:13px;color:${col};\">${ohChar} ${OHKR2[k]}</div><div style=\"flex:1;background:rgba(255,255,255,0.07);border-radius:4px;height:8px;overflow:hidden;\"><div style=\"width:${Math.min(pct,100)}%;height:100%;background:${col};border-radius:4px;\"></div></div><div style=\"width:36px;font-size:13px;color:${col};\">${pct}%</div></div>`;\n"
"    }).join('');\n"
"    return `<div class=\"report-chapter\">\n"
"        <h3 class=\"ch-title\">Chapter 2. 五行(오행)의 세력 — 절대적 무기와 아킬레스건</h3>\n"
"        <p class=\"ch-text\">사람들은 오행(목화토금수)이 골고루 섞인 中和(중화)된 사주를 좋은 사주라고 말합니다. 평범하게 큰 굴곡 없이 살기엔 중화가 최고일 수 있습니다. 하지만 한 시대를 풍미하는 사람들은 거의 예외 없이 오행이 극단적으로 쏠려 있습니다. 편중이 클수록 그 에너지가 인생을 더 강렬하게 조각합니다.</p>\n"
"        <div style=\"background:rgba(255,255,255,0.04);border-radius:12px;padding:18px;margin:20px 0;\">\n"
"            <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:14px;letter-spacing:1px;\">오행 에너지 분포</div>\n"
"            ${balanceRows}\n"
"        </div>\n"
"        <p class=\"ch-text\">당신의 사주를 해부한 결과, 절대적 무기이자 아킬레스건은 <b style=\"color:var(--gold);\">${maxKr}</b>의 기운입니다. 이 기운이 당신의 뇌 구조, 판단 방식, 인간관계 패턴의 80% 이상을 지배합니다.</p>\n"
"        <div style=\"background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:16px 0;\">\n"
"            <div style=\"font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;\">${maxKr} 기운 집중 분석</div>\n"
"            <p style=\"font-size:14.5px;color:#ddd;line-height:1.9;margin:0 0 12px;\">${excessText}</p>\n"
"            <p style=\"font-size:14px;color:#ccc;line-height:1.85;margin:0;\">${excessPer}</p>\n"
"        </div>\n"
"        <p class=\"ch-text\">반대로 가장 부족한 <b>${minKr}</b> 기운은 당신이 무의식적으로 갈망하는 결핍의 영역입니다. ${lackDesc}</p>\n"
"        <p class=\"ch-text\">이 편중된 에너지를 억누르거나 부끄러워하지 마십시오. 당신의 과제는 이 에너지를 흉기에서 명검으로 전환하는 것입니다. 用神(용신) 기운을 적극 활용하고 忌神(기신) 기운을 경계하는 것이 인생 전략의 핵심입니다.</p>\n"
"    </div>`;\n"
"}"
)

html = html[:start] + new_code + html[end:]
print(f"Chapter 2 교체 성공")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"완료 | {len(html):,} bytes")
