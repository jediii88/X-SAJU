with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_func(html, fn_name, new_code):
    start = html.find(f'function {fn_name}(data) {{')
    if start == -1: print(f"{fn_name}: NOT FOUND"); return html
    depth=0; i=start; end=-1
    while i<len(html):
        if html[i]=='{': depth+=1
        elif html[i]=='}':
            depth-=1
            if depth==0: end=i+1; break
        i+=1
    if end==-1: print(f"{fn_name}: END NOT FOUND"); return html
    html = html[:start] + new_code + html[end:]
    print(f"{fn_name}: 교체 성공")
    return html

NEW_CH1 = (
    "function buildChapter1_Basic(data) {\n"
    "    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');\n"
    "    const dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};\n"
    "    const title = dbEntry.title || (iljuKey + ' 일주의 기운');\n"
    "    const core = dbEntry.core || '당신은 끊임없이 환경과 충돌하며 자신만의 영역을 개척하는 기질을 타고났습니다.';\n"
    "    const weapon = dbEntry.weapon || '위기 상황에서 발휘되는 직관과 돌파력이 당신의 가장 큰 무기입니다.';\n"
    "    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';\n"
    "    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));\n"
    "    const stemMeaning = {wood:'甲·乙목 — 봄을 여는 나무의 기운. 끝없는 성장 본능과 개척 정신이 DNA에 새겨져 있습니다. 멈춰 있으면 내면이 갑갑해지고, 새로운 것을 향해 나아가는 것이 생존 방식입니다.',fire:'丙·丁화 — 세상을 밝히는 불꽃의 기운. 열정, 카리스마, 폭발적 표현력이 핵심 자산입니다. 어디서든 자연스럽게 주목받고 영향력을 발휘합니다.',earth:'戊·己토 — 모든 것을 품는 대지의 기운. 묵직한 포용력과 신뢰감이 당신의 가장 큰 자산입니다. 사람들이 자연스럽게 기대고 의지합니다.',metal:'庚·辛금 — 단련된 금속의 기운. 결단력, 원칙, 완성도가 삶을 이끕니다. 압박이 올수록 더욱 날카로워지는 기질입니다.',water:'壬·癸수 — 깊은 바다의 지혜. 통찰력, 유연성, 무한한 잠재력이 내면에 잠들어 있습니다. 복잡한 상황일수록 본질을 꿰뚫는 감각이 발동합니다.'}[stemEl] || '';\n"
    "    const branchMeaning = {'子':'자(子)는 겨울 한복판의 극도 집중과 내면의 힘을 품은 지지입니다.','丑':'축(丑)은 혹독한 겨울을 버텨내는 인내와 저력의 지지입니다.','寅':'인(寅)은 봄을 여는 호랑이의 기운, 개척과 도전의 지지입니다.','卯':'묘(卯)는 봄의 절정, 생명력과 관계 에너지가 폭발하는 지지입니다.','辰':'진(辰)은 용이 잠든 봄의 대지, 거대한 잠재력이 응축된 지지입니다.','巳':'사(巳)는 뱀의 예리함과 여름 폭발력을 품은 변신의 지지입니다.','午':'오(午)는 한여름 정오의 태양, 사회적 성취 에너지가 극에 달한 지지입니다.','未':'미(未)는 여름의 관록, 경험이 지혜로 숙성되는 지지입니다.','申':'신(申)은 가을의 결단, 불필요한 것을 쳐내는 날카로운 지지입니다.','酉':'유(酉)는 가을의 정밀 수확, 완성도와 보상의 지지입니다.','戌':'술(戌)은 가을 황혼의 중후함, 깊은 통찰과 신뢰의 지지입니다.','亥':'해(亥)는 겨울 바다의 심연, 무한한 가능성을 저장한 지지입니다.'}[data.dayBranch] || '';\n"
    "    const strengthDesc = isStrong\n"
    "        ? '당신의 일간 에너지는 <b>身强(신강)</b> 상태입니다. 기운이 충만한 만큼 남에게 끌려다니기보다 내가 판을 짜야 제 능력이 발현됩니다. 조직 안에 갇혀 있으면 에너지가 억눌려 오히려 역효과가 납니다. 창업, 프리랜서, 전문직처럼 자율권이 보장된 환경에서 폭발적인 능력이 드러납니다.'\n"
    "        : '당신의 일간 에너지는 <b>身弱(신약)</b> 상태입니다. 혼자 모든 것을 짊어지기보다 훌륭한 파트너와 팀을 구성할 때 1+1이 10이 되는 시너지를 경험합니다. 좋은 귀인을 곁에 두고 협력하는 것이 인생 전략의 핵심입니다.';\n"
    "    return `<div class=\"report-chapter\">\n"
    "        <h3 class=\"ch-title\">Chapter 1. 나의 본질과 영혼의 그릇 — 日柱(일주) 완전 해부</h3>\n"
    "        <p class=\"ch-text\">명리학에서 日柱(일주)는 단순히 성격을 의미하는 것이 아닙니다. 당신이 평생 짊어지고 가야 할 영혼의 바코드이자 생존의 무기입니다. 年柱(연주)가 가문과 조상의 기운을, 月柱(월주)가 사회적 환경과 부모의 기운을 담고 있다면, 日柱(일주)는 오직 당신 자신만의 본질을 담고 있습니다.</p>\n"
    "        <p class=\"ch-text\">많은 사람들이 사주를 볼 때 겉으로 드러난 성취와 재물에만 주목합니다. 하지만 그 성취들을 만들어내는 근본 에너지, 당신을 진정으로 움직이는 내밀한 기질은 이 일주에 새겨져 있습니다. 이것을 모르면 아무리 열심히 살아도 남의 방식으로 사는 것과 다름없습니다.</p>\n"
    "        <div style=\"background:rgba(199,167,106,0.07);border-radius:12px;padding:20px;margin:20px 0;\">\n"
    "            <div style=\"font-size:22px;font-weight:800;color:var(--gold);font-family:'Noto Serif KR',serif;margin-bottom:14px;\">[${title}]</div>\n"
    "            <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;\">\n"
    "                <div style=\"padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;\"><div style=\"font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;\">天干(천간) 분석</div><div style=\"font-size:13px;color:#ddd;line-height:1.75;\">${stemMeaning}</div></div>\n"
    "                <div style=\"padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;\"><div style=\"font-size:10px;color:var(--text-dim);margin-bottom:6px;letter-spacing:1px;\">地支(지지) 분석</div><div style=\"font-size:13px;color:#ddd;line-height:1.75;\">${branchMeaning}</div></div>\n"
    "            </div>\n"
    "            <p style=\"font-size:14.5px;color:#ddd;line-height:1.9;margin:0;\">${core}</p>\n"
    "        </div>\n"
    "        <p class=\"ch-text\"><b style=\"color:var(--gold);\">[핵심 무기]</b> ${weapon}</p>\n"
    "        <p class=\"ch-text\">${strengthDesc}</p>\n"
    "        <p class=\"ch-text\">때로는 이 기질 때문에 불필요한 마찰을 겪기도 합니다. 하지만 그 마찰열이 당신의 그릇을 한 단계 더 크게 빚어내는 용광로 역할을 합니다. 환경을 탓하지 마십시오. 당신은 그 환경을 이해하고, 재편하고, 지배할 수 있는 기질을 가지고 태어났습니다.</p>\n"
    "    </div>`;\n"
    "}"
)

html = replace_func(html, 'buildChapter1_Basic', NEW_CH1)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"완료 | {len(html):,} bytes")
