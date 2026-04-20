with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Chapter 8 찾아서 전체 교체
start = html.find('function buildChapter8_Health(data) {')
if start == -1:
    print("Chapter 8 NOT FOUND"); exit()

# 함수 끝 찾기
depth = 0; i = start; end = -1
while i < len(html):
    if html[i] == '{': depth += 1
    elif html[i] == '}':
        depth -= 1
        if depth == 0: end = i + 1; break
    i += 1

new_ch8 = r'''function buildChapter8_Health(data) {
    let maxWuxing = 'earth';
    if(data.wuxing && Object.keys(data.wuxing).length > 0) {
        maxWuxing = Object.keys(data.wuxing).reduce((a,b) => data.wuxing[a] > data.wuxing[b] ? a : b);
    }
    const ohKr = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'}[maxWuxing] || '토(土)';
    const organ = {wood:'간(肝)·담낭·신경계',fire:'심장(心)·심혈관·소장',earth:'비장(脾)·위장·소화기',metal:'폐(肺)·대장·호흡기',water:'신장(腎)·방광·호르몬'}[maxWuxing] || '위장·소화기';
    const emotion = {wood:'분노와 억울함',fire:'과도한 흥분과 불안',earth:'지나친 걱정과 생각',metal:'슬픔과 우울감',water:'두려움과 공포'}[maxWuxing] || '스트레스';
    const season = {wood:'봄(3~5월), 寅(인)·卯(묘)월',fire:'여름(6~8월), 巳(사)·午(오)월',earth:'환절기, 辰(진)·戌(술)·丑(축)·未(미)월',metal:'가을(9~11월), 申(신)·酉(유)월',water:'겨울(12~2월), 亥(해)·子(자)월'}[maxWuxing] || '환절기';
    const foodAdvice = {
        wood:'신맛(레몬, 식초, 매실)을 섭취하고 녹황색 채소를 충분히 드십시오. 브로콜리, 시금치, 깻잎 등 녹색 채소가 간 기능 보호에 탁월합니다. 알코올은 간에 직접 부담을 주므로 최대한 줄이거나 끊는 것이 건강 수명을 결정합니다.',
        fire:'쓴맛(녹차, 여주, 쑥)을 적당히 즐기고 심장을 진정시키는 산사, 연자육 등을 활용하십시오. 카페인과 에너지드링크는 심박수를 불규칙하게 만들므로 자제하십시오. 혈압을 정기적으로 체크하는 습관이 생명을 지킵니다.',
        earth:'단맛(천연 과일, 고구마)을 적당히 섭취하고 노란 음식(호박, 옥수수, 생강)이 위장을 보강합니다. 규칙적인 식사 시간이 위장 보호의 핵심입니다. 폭식, 야식, 자극적인 음식이 위장의 가장 큰 적입니다.',
        metal:'매운맛(생강, 도라지, 무)을 적절히 활용하고 흰 음식(배, 연근, 마)이 폐를 보강합니다. 유산소 운동으로 폐활량을 키우는 것이 중요하며, 미세먼지가 심한 날은 외출 시 반드시 마스크를 착용하십시오.',
        water:'짠맛(천연소금, 된장, 미역)을 적절히 섭취하고 검은 음식(흑임자, 검은콩, 블루베리)이 신장을 보강합니다. 충분한 수분 섭취(하루 2L)와 규칙적인 수면이 신장 건강의 절대적 기준입니다.'
    }[maxWuxing] || '균형 잡힌 식단을 유지하십시오.';
    const exerciseAdvice = {
        wood:'걷기·조깅·수영 등 규칙적인 유산소 운동을 권장합니다. 과도한 경쟁적 스포츠보다 명상, 요가, 스트레칭으로 신경계를 안정시키는 것이 간 기능 보호에 효과적입니다. 주 3회 30분 이상의 유산소 운동을 목표로 하십시오.',
        fire:'심박수를 안정시키는 요가·태극권·수영을 권장합니다. 격렬한 운동보다 지속적이고 안정적인 운동이 심혈관 건강에 유리합니다. 운동 전후 혈압과 맥박을 체크하는 습관을 기르십시오.',
        earth:'규칙적인 걷기 운동이 소화기를 활성화합니다. 식후 30분 가벼운 산책이 위장 건강의 핵심입니다. 앉아있는 시간이 길면 소화 기능이 저하되므로 1시간에 한 번씩 일어나 가볍게 몸을 움직이십시오.',
        metal:'폐활량을 키우는 수영과 유산소 운동을 권장합니다. 깊은 호흡을 연습하는 복식호흡이 폐 기능 향상에 탁월합니다. 실내보다 맑은 공기 속에서 하는 야외 운동이 더 효과적입니다.',
        water:'가벼운 스트레칭과 수영으로 신장 기능을 활성화하십시오. 무리한 운동보다 충분한 휴식이 더 중요합니다. 과로와 수면 부족이 신장 에너지를 가장 빠르게 고갈시킵니다.'
    }[maxWuxing] || '규칙적인 운동을 유지하십시오.';
    const checkupAdvice = {
        wood:'간 기능 검사(GOT, GPT), 담낭 초음파, 갑상선 검사를 연 1회 이상 받으십시오.',
        fire:'심전도, 혈압·콜레스테롤 검사, 심장 초음파를 정기적으로 받으십시오.',
        earth:'위내시경, 대장내시경, 혈당 검사를 정기적으로 받으십시오. 소화기 이상 신호는 절대 참고 방치하지 마십시오.',
        metal:'흉부 X선, 폐 기능 검사, 비염·천식 관련 검사를 정기적으로 받으십시오.',
        water:'신장 기능 검사(크레아티닌, BUN), 호르몬 검사, 방광 초음파를 정기적으로 받으십시오.'
    }[maxWuxing] || '전반적인 건강 검진을 연 1회 이상 받으십시오.';

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 8. 신체 취약점과 마지노선 — 건강운 완전 분석</h3>
        <p class="ch-text">사주 명리학은 에너지(오행)의 분배와 편중을 다루는 학문이며, 이는 한의학의 오장육부와 직결됩니다. 당신의 사주에서 특정 에너지가 극도로 과부하 걸릴 때, 마음의 스트레스는 즉각적으로 해당 장기의 병변으로 나타납니다. 수천 년의 임상 데이터가 증명하는 이 법칙을 아는 것이 당신 인생에서 가장 강력한 건강 보험입니다.</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;">
            <div style="background:rgba(231,76,60,0.07);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:rgba(255,120,120,0.8);margin-bottom:8px;letter-spacing:1px;">⚠ 평생 주요 취약 장기</div>
                <div style="font-size:17px;font-weight:700;color:#ff8a80;margin-bottom:6px;">${organ}</div>
                <div style="font-size:13px;color:#bbb;line-height:1.7;">${ohKr} 기운 과부하 시 가장 먼저 타격받습니다.</div>
            </div>
            <div style="background:rgba(255,165,0,0.07);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:rgba(255,200,100,0.8);margin-bottom:8px;letter-spacing:1px;">감정 → 신체 연결고리</div>
                <div style="font-size:17px;font-weight:700;color:#ffcc80;margin-bottom:6px;">${emotion}</div>
                <div style="font-size:13px;color:#bbb;line-height:1.7;">이 감정이 쌓일 때 해당 장기가 가장 먼저 반응합니다.</div>
            </div>
        </div>

        <p class="ch-text">당신의 원국에서 <b>${ohKr}</b>의 기운이 가장 강하게 편중되어 있습니다. 이 기운이 담당하는 장기는 평생 특별히 관리해야 합니다. 특히 <b>${season}</b>에 해당 장기의 이상 신호가 집중적으로 나타나므로, 이 시기를 전후해 정기 검진을 받는 것을 강력히 권장합니다.</p>

        <p class="ch-text">동시에 忌神(기신) 기운이 강해지는 대운과 세운에는 해당 장기의 면역력이 급격히 떨어집니다. 이 시기에는 평소보다 더 세심한 건강 관리가 필요하며, 수면 부족과 과로가 겹칠 경우 큰 병으로 이어지는 경우가 많습니다. 신체 이상 신호를 무시하거나 참는 것은 당신 인생의 가장 비싼 실수가 될 수 있습니다.</p>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin:16px 0;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:10px;letter-spacing:1px;">🥗 맞춤 식이 처방</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.9;margin:0;">${foodAdvice}</p>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin-bottom:16px;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:10px;letter-spacing:1px;">🏃 맞춤 운동 처방</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.9;margin:0;">${exerciseAdvice}</p>
        </div>

        <div style="background:rgba(231,76,60,0.06);border-radius:10px;padding:18px;">
            <div style="font-size:12px;color:rgba(255,120,120,0.8);margin-bottom:10px;letter-spacing:1px;">🏥 권장 정기 검진</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.9;margin:0;">${checkupAdvice}</p>
        </div>

        <p class="ch-text" style="margin-top:16px;">성과를 내기 위해 몸을 연료로 태우지 마십시오. 인생이라는 마라톤에서 가장 강력한 무기는 컨디션 관리입니다. 당신은 멈춰야 할 때 멈추는 것에 큰 용기가 필요한 타입입니다. 그 용기를 내는 것이 장기 레이스의 진정한 승자가 되는 첫 번째 조건입니다.</p>
    </div>`;
}'''

html = html[:start] + new_ch8 + html[end:]
print(f"Chapter 8 교체 성공")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"완료 | {len(html):,} bytes")
