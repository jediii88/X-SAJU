#!/usr/bin/env python3
# buildChapter1_Basic 전면 재작성
# 천간/지지 개별 카드 → 원국 전체 통합 삶의 지도 서술

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

# buildChapter1_Basic 함수 전체를 찾아서 교체
start_marker = "function buildChapter1_Basic(data) {"
end_marker = "function buildCurrentPeriodSummary("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"마커 위치: start={start_idx}, end={end_idx}")
    exit()

new_ch1 = '''function buildChapter1_Basic(data) {
    const pillars = data.pillars || [];
    const name = data.name || '고객';
    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));
    const gongmangBranches = data.gongmang || [];

    // 오행별 삶의 패턴 (일간 기준, 신강/신약 연계)
    const OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const ds = data.dayStem || '丙';
    const db = data.dayBranch || '寅';
    const dayOh = OH[ds] || 'fire';

    // 일간별 인생 서사 (신강/신약 분기)
    const LIFE_NARRATIVE = {
        wood: {
            strong: `${name}님의 사주는 목(木) 기운이 강한 신강(身强) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신은 태어날 때부터 '첫 번째 발자국'을 남기는 사람으로 설계되어 있습니다. 아무도 가지 않은 길에 먼저 발을 내딛고, 그 길을 개척해서 뒤따르는 사람들이 걸어올 수 있도록 만드는 것이 당신의 천명에 가장 가까운 삶입니다.\n\n20대의 당신은 에너지가 너무 강해 주변과 마찰이 많을 것입니다. '왜 저 사람은 혼자서만 앞서가려 하는가'라는 오해를 받기도 합니다. 하지만 이것은 당신의 결함이 아닙니다. 엔진이 너무 강력해서 생기는 현상입니다. 30대에는 이 에너지를 어디에 쏟을 것인가를 결정하는 시기가 옵니다. 이 선택이 이후 인생 전체의 방향을 결정합니다.\n\n40대부터 당신의 진짜 인생이 시작됩니다. 20~30대의 마찰과 충돌이 오히려 당신을 가장 단단하게 만들었다는 것을 이때 깨닫습니다. 50대 이후에는 당신이 걸어온 길이 누군가의 지도가 됩니다.`,
            weak: `${name}님의 사주는 목(木) 기운이 있지만 주변 환경에 의해 분산되는 신약(身弱) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신의 가장 큰 강점은 '혼자'가 아니라 '함께'일 때 1+1이 10이 된다는 것입니다.\n\n20대의 당신은 혼자 모든 것을 해결하려다가 번번이 한계에 부딪히는 경험을 합니다. 그러나 이것은 약점이 아닙니다. 당신에게는 좋은 파트너와 귀인이 찾아오는 운이 내재되어 있습니다. 문제는 그 귀인을 알아보는 눈을 갖는 것입니다. 30대에 당신의 에너지를 채워주는 결정적 파트너를 만나면, 이후 인생이 완전히 달라집니다.\n\n40대 이후 당신의 삶은 좋은 사람들로 둘러싸인 따뜻한 생태계를 만드는 방향으로 흘러갑니다. 혼자 빛나는 별보다, 별들이 모여 만드는 별자리 같은 존재가 당신의 진짜 정체성입니다.`
        },
        fire: {
            strong: `${name}님의 사주는 화(火) 기운이 강한 신강(身强) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신이 방에 들어서는 순간, 공기가 바뀝니다. 이것은 과장이 아닙니다. 당신은 존재 자체가 에너지인 사람으로 태어났습니다.\n\n20대의 당신은 이 넘치는 에너지를 통제하지 못해 번아웃과 감정 기복을 반복합니다. 열정을 쏟아붓다가 갑자기 무너지는 패턴이 반복됩니다. 그러나 30대에 접어들면서 이 에너지를 다루는 법을 터득하기 시작합니다. 엔진의 출력을 조절하는 법을 배우는 것입니다.\n\n40대의 당신은 이 카리스마와 에너지가 완성된 형태로 드러납니다. 사람들이 당신 곁에 있고 싶어 합니다. 당신의 열정이 전염되기 때문입니다. 50대 이후에는 당신이 쌓아온 존재감이 가장 큰 자산이 됩니다.`,
            weak: `${name}님의 사주는 화(火) 기운이 있지만 주변에서 약해지는 신약(身弱) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신 안에는 폭발적인 열정의 씨앗이 있습니다. 그러나 그 씨앗이 피어나려면 적절한 환경이 필요합니다.\n\n20대의 당신은 열정을 갖고 시작했다가 예상보다 빨리 에너지가 소진되는 경험을 반복합니다. '나는 왜 이렇게 쉽게 지치는가'라는 자책이 생깁니다. 그러나 이것은 당신의 문제가 아니라 환경의 문제입니다. 당신의 에너지를 올려주는 사람과 장소에 있을 때, 당신은 누구보다 빛납니다.\n\n30대에 당신의 에너지를 충전시켜주는 진정한 환경을 찾아낼 때, 이후 삶이 완전히 달라집니다. 그 환경 안에서 당신의 따뜻함과 헌신이 가장 강력한 무기가 됩니다.`
        },
        earth: {
            strong: `${name}님의 사주는 토(土) 기운이 강한 신강(身强) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신은 흔들리지 않는 사람입니다. 주변이 아무리 요동쳐도, 당신은 중심을 잡고 있습니다. 이 안정감이 사람들을 당신 곁으로 끌어당기는 가장 강력한 자력(磁力)입니다.\n\n그러나 이 구조에는 그림자가 있습니다. 변화를 두려워하다가 좋은 기회를 흘려보내는 것입니다. 20~30대에 '좀 더 확실해지면 할게'를 반복하다가 정작 기회가 지나간 후에야 후회하는 패턴이 생길 수 있습니다. 당신의 과제는 70%의 확신이 생겼을 때 실행하는 결단입니다.\n\n40대 이후의 당신은 묵직한 신뢰로 쌓아올린 인간관계와 자산이 최고의 전성기를 만들어냅니다. 느리지만 확실하게 쌓아온 것들이 빛나는 시기가 바로 이때입니다.`,
            weak: `${name}님의 사주는 토(土) 기운이 있지만 흩어지는 신약(身弱) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신은 안정을 원하지만, 삶이 계속 변화를 들이밉니다. 이 긴장감이 20~30대를 가장 힘들게 만드는 요소입니다.\n\n그러나 이 구조의 비밀이 있습니다. 변화 속에서도 중심을 잡을 수 있는 단 하나의 기반을 만드는 것 — 이것이 당신의 삶의 핵심 과제입니다. 그 기반은 직업일 수도, 관계일 수도, 공간일 수도 있습니다. 40대에 그 기반이 완성될 때, 이후의 삶은 안정과 풍요로 가득 찹니다.`
        },
        metal: {
            strong: `${name}님의 사주는 금(金) 기운이 강한 신강(身强) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신의 눈은 레이저입니다. 복잡한 상황 속에서도 핵심을 꿰뚫어보는 능력, 불필요한 것을 단번에 쳐내는 결단력 — 이것이 당신 인생 최강의 무기입니다.\n\n20대의 당신은 이 냉철함이 '차갑다', '감정이 없다'는 오해를 만들기도 합니다. 그러나 이것은 오해입니다. 당신 안에는 강렬한 열정이 있습니다. 다만 그 열정을 낭비하지 않는 방식으로 표현합니다. 30대에 전문성이 이 결단력과 결합될 때, 당신은 해당 분야에서 누구도 무시할 수 없는 존재가 됩니다.\n\n40~50대의 당신은 그 분야의 권위자가 되어 있을 것입니다. 당신이 말하면 사람들이 따릅니다. 이 영향력의 크기를 스스로 제대로 인식하고 책임감 있게 사용하는 것이 중요합니다.`,
            weak: `${name}님의 사주는 금(金) 기운이 있지만 주변에서 눌리는 신약(身弱) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신 안에는 날카로운 판단력과 높은 기준이 있습니다. 그러나 그 기준을 실현할 환경과 에너지가 항상 충분하지 않습니다.\n\n20대의 당신은 '더 잘할 수 있는데 왜 이렇게 안 되는가'라는 내적 갈등이 큽니다. 이것은 당신의 능력 부족이 아니라, 아직 당신에게 맞는 환경을 찾지 못했기 때문입니다. 30대에 당신의 날카로운 능력을 인정해주는 환경과 사람을 찾으면, 이후 삶이 완전히 달라집니다. 40대 이후, 드디어 당신의 정밀한 전문성이 세상에 인정받는 시기가 옵니다.`
        },
        water: {
            strong: `${name}님의 사주는 수(水) 기운이 강한 신강(身强) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신의 머릿속은 항상 바쁩니다. 남들이 보지 못하는 패턴을 보고, 남들이 느끼지 못하는 흐름을 감지합니다. 이 통찰력이 당신 인생 최대의 자산입니다.\n\n그러나 이 구조의 함정이 있습니다. 너무 많이 생각해서 실행을 미루는 것입니다. 완벽한 계획이 완성될 때까지 기다리다가 기회가 지나가는 패턴이 20~30대에 반복될 수 있습니다. 당신의 직관은 대부분 맞습니다. 그 직관을 믿고 실행으로 옮기는 용기가 이 시기의 핵심 과제입니다.\n\n40대 이후의 당신은 오랜 기간 축적된 통찰과 경험이 결합되면서 진짜 지혜가 완성됩니다. 이때부터 당신 주변에 조언을 구하는 사람들이 모여듭니다. 깊은 강처럼, 나이가 들수록 당신의 가치는 올라갑니다.`,
            weak: `${name}님의 사주는 수(水) 기운이 있지만 분산되는 신약(身弱) 구조입니다. 이 원국이 말하는 삶의 지도는 이렇습니다. 당신은 섬세한 감각과 깊은 통찰을 가지고 있습니다. 그러나 이 능력이 표면으로 드러나기까지 시간이 걸립니다.\n\n20대의 당신은 자신의 능력에 대한 확신이 흔들리는 시기입니다. '나는 잘하고 있는 걸까'라는 의문이 자주 찾아옵니다. 그러나 이것은 당신이 부족한 것이 아니라, 아직 준비 중이기 때문입니다. 30대에 당신의 통찰을 믿어주는 한 명의 귀인을 만나면 그 이후가 달라집니다. 40대 이후 당신이 쌓아온 깊이 있는 지혜가 빛을 발하는 시기가 옵니다.`
        }
    };

    const strengthKey = isStrong ? 'strong' : 'weak';
    const lifeNarr = LIFE_NARRATIVE[dayOh]?.[strengthKey] || `${name}님의 사주 원국이 그리는 삶의 지도를 해부합니다.`;

    // 일주 핵심 분석 (DB에서)
    const iljuCore = dbEntry.core || '';

    // 공망 분석
    const gongmangText = gongmangBranches.length > 0
        ? `<div style="background:rgba(231,76,60,0.06);border-left:3px solid rgba(231,76,60,0.4);padding:14px 16px;border-radius:0 8px 8px 0;margin-top:16px;"><div style="font-size:11px;color:#e74c3c;margin-bottom:6px;letter-spacing:1px;">공망(空亡) — 결핍과 갈망의 에너지</div><p style="font-size:13px;color:#ccc;line-height:1.85;margin:0;">${name}님의 사주에는 공망이 있습니다. 공망은 '비어있음'입니다. 그러나 이 비어있음이 반드시 나쁜 것이 아닙니다. 공망된 자리에 대한 끊임없는 갈망이 오히려 당신을 계속 앞으로 나아가게 만드는 원동력이 됩니다. 이 결핍이 채워질 것 같다는 느낌이 들 때 가장 위험한 선택을 하게 되니, 그 순간 한 번 더 냉정하게 판단하십시오.</p></div>`
        : '';

    // 원국 인생 챕터별 요약 (연/월/일/시주)
    const yPillar = pillars[3] || {}; // 연주
    const mPillar = pillars[2] || {}; // 월주
    const dPillar = pillars[1] || {}; // 일주
    const hPillar = pillars[0] || {}; // 시주

    const yH = yPillar.h ? (typeof yPillar.h==='string' ? yPillar.h : yPillar.h.join('')) : '';
    const mH = mPillar.h ? (typeof mPillar.h==='string' ? mPillar.h : mPillar.h.join('')) : '';
    const dH = dPillar.h ? (typeof dPillar.h==='string' ? dPillar.h : dPillar.h.join('')) : '';
    const hH = hPillar.h ? (typeof hPillar.h==='string' ? hPillar.h : hPillar.h.join('')) : '';

    const HK = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const toKr = s => s ? [...s].map(c=>HK[c]||c).join('') : '';

    return `<div class="report-chapter chapter-start">
        <h3 class="ch-title">Chapter 1. 당신의 사주 원국 — 한 사람의 삶의 지도</h3>
        <p class="ch-text">사주 8자는 단순한 기호가 아닙니다. 당신이 태어난 순간, 우주의 에너지가 새겨넣은 인생 설계도입니다. 이 설계도를 읽을 줄 아는 사람과 모르는 사람 사이에는 — 같은 상황에서도 전혀 다른 선택과 전혀 다른 결과가 나타납니다.</p>

        <div style="background:rgba(199,167,106,0.07);border-left:4px solid var(--gold);padding:20px 22px;border-radius:0 12px 12px 0;margin:24px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;letter-spacing:2px;">✦ 원국 종합 통변 — ${name}님의 삶의 지도</div>
            <p style="font-size:14.5px;color:#ddd;line-height:2.0;white-space:pre-line;margin:0;">${lifeNarr}</p>
        </div>

        ${iljuCore ? `<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px 20px;margin:20px 0;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:1px;">일주(日柱) ${dH}(${toKr(dH)}) — 나 자신의 핵심</div><p style="font-size:14px;color:#ddd;line-height:1.9;margin:0;">${iljuCore}</p></div>` : ''}

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin:20px 0;">
            <div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:16px;letter-spacing:1px;">✦ 인생 4막의 흐름</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">🌱 유년기 · 초년기 (0~15세)</div>
                    <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:8px;">연주(年柱) ${yH}(${toKr(yH)})</div>
                    <p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">조상과 뿌리의 에너지가 당신의 유년기 환경을 만들었습니다. 태어난 가정의 분위기, 어린 시절 경험한 세상의 첫인상이 이 기운 안에 담겨 있습니다. 이 시기의 경험이 무의식 깊숙이 새겨져 평생의 기준점이 됩니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">🔥 청년기 (15~35세)</div>
                    <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:8px;">월주(月柱) ${mH}(${toKr(mH)})</div>
                    <p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">부모와 성장 환경, 그리고 직업적 적성의 에너지입니다. 사회에 처음 발을 내딛는 이 시기의 주된 흐름과 도전이 월주에 담겨 있습니다. 어떤 분야에서 재능이 먼저 드러나는지, 어떤 환경에서 성장하는지를 보여줍니다.</p>
                </div>
                <div style="background:rgba(199,167,106,0.08);border-radius:8px;padding:14px;border:1px solid rgba(199,167,106,0.2);">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">⚡ 중년기 (35~55세)</div>
                    <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:8px;">일주(日柱) ${dH}(${toKr(dH)}) ← 나 자신</div>
                    <p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">나 자신과 배우자의 에너지입니다. 사주 8자 중 가장 중요한 자리입니다. 당신이 어떤 사람인지, 내면 깊숙이 무엇을 원하는지, 어떤 사람과 함께할 때 가장 빛나는지가 이 자리에 새겨져 있습니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">🌙 말년기 (55세~)</div>
                    <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:8px;">시주(時柱) ${hH.length>0?hH+'('+toKr(hH)+')':'미상'}</div>
                    <p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">자녀와 말년, 그리고 내면 깊숙이 숨어있는 소망의 에너지입니다. 인생 후반부에 무엇이 당신을 행복하게 하는지, 어떤 유산을 남기고 싶은지가 이 자리에 담겨 있습니다.</p>
                </div>
            </div>
        </div>

        ${gongmangText}

        <div style="background:rgba(199,167,106,0.05);border-radius:10px;padding:18px;margin:20px 0;border:1px solid rgba(199,167,106,0.1);">
            <div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:10px;">✦ 이 원국을 가진 사람이 인생에서 가장 중요하게 기억해야 할 것</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0;">${name}님의 사주는 단점처럼 보이는 것들 안에 가장 강력한 무기가 숨어 있는 구조입니다. 힘들었던 시간, 마찰이 있었던 순간, 무언가가 잘 안 됐던 경험 — 이 모든 것이 사실은 당신을 가장 단단하게 만들어온 과정이었습니다. 당신의 인생은 지금까지 낭비된 시간이 없습니다. 모든 것이 지금의 당신을 만들기 위한 설계의 일부였습니다.</p>
        </div>
    </div>`;
}

'''

content = content[:start_idx] + new_ch1 + content[end_idx:]

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("buildChapter1_Basic 재작성 완료")
