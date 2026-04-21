#!/usr/bin/env python3
# buildChapter1_Basic 완전 교체 (line 2349~2509)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 정확한 시작/끝 라인 찾기
start_line = None
end_line = None

for i, line in enumerate(lines):
    if line.strip().startswith('function buildChapter1_Basic(data)') and start_line is None:
        start_line = i
    if start_line is not None and end_line is None and i > start_line:
        if line.startswith('function ') and 'buildChapter1_Basic' not in line:
            end_line = i
            break

print(f"교체 범위: {start_line+1}~{end_line} (총 {end_line-start_line}줄)")

new_func = '''function buildChapter1_Basic(data) {
    const name = data.name || '고객';
    const pillars = data.pillars || [];
    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const dbEntry = window.SAJU_DB?.ILJU?.[iljuKey] || {};
    const isStrong = data.strengthText && (data.strengthText.includes(\'신강\') || data.strengthText.includes(\'강\'));
    const gongmangBranches = data.gongmang || [];

    const OH = {\'甲\':\'wood\',\'乙\':\'wood\',\'丙\':\'fire\',\'丁\':\'fire\',\'戊\':\'earth\',\'己\':\'earth\',\'庚\':\'metal\',\'辛\':\'metal\',\'壬\':\'water\',\'癸\':\'water\'};
    const ds = data.dayStem || \'丙\';
    const dayOh = OH[ds] || \'fire\';
    const HK = {\'甲\':\'갑\',\'乙\':\'을\',\'丙\':\'병\',\'丁\':\'정\',\'戊\':\'무\',\'己\':\'기\',\'庚\':\'경\',\'辛\':\'신\',\'壬\':\'임\',\'癸\':\'계\',\'子\':\'자\',\'丑\':\'축\',\'寅\':\'인\',\'卯\':\'묘\',\'辰\':\'진\',\'巳\':\'사\',\'午\':\'오\',\'未\':\'미\',\'申\':\'신\',\'酉\':\'유\',\'戌\':\'술\',\'亥\':\'해\'};
    const toKr = s => s ? [...s].map(c=>HK[c]||c).join(\'\') : \'\';

    // 오행별 + 신강/신약별 삶의 지도 서사
    const LIFE_NARRATIVE = {
        wood: {
            strong: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "이 사람은 태어날 때부터 길을 만드는 사람이다."\n\n남들이 가지 않은 곳에 먼저 발을 내딛고, 뒤따르는 사람들이 걸어올 수 있는 길을 닦는 것 — 이것이 \'+name+\'님의 원국이 가리키는 삶의 방향입니다. 에너지가 넘치고 추진력이 강합니다. 문제는 이 에너지가 너무 강해서 20~30대에 주변과 마찰이 잦다는 것입니다. "왜 저 사람은 혼자서만 앞서가려 하나"라는 오해를 받을 수 있습니다.\n\n그러나 이것은 결함이 아닙니다. 엔진이 강력한 것입니다. 30대에 이 에너지를 어디에 쏟을지 방향을 결정하는 순간이 찾아옵니다. 이 선택이 이후 인생 전체를 바꿉니다. 40대부터 당신이 걸어온 길이 누군가에게 지도가 됩니다.\n\n이 원국의 핵심 과제: 속도를 낮추는 것이 아니라, 방향을 명확히 하는 것.\n조심할 것: 고집이 강해서 "내가 맞다"고 믿는 순간 주변의 좋은 조언을 못 듣는 경향.\n강점: 처음 시작하는 것, 아무도 안 해본 것을 해내는 것.\',
            weak: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "이 사람은 혼자일 때보다 함께일 때 1+1이 10이 되는 사람이다."\n\n당신의 원국은 좋은 파트너와 귀인이 찾아오는 구조입니다. 혼자 모든 것을 해결하려는 시도가 20~30대에 한계에 부딪히는 경험을 반복하지만 — 이것은 당신이 부족해서가 아니라, 혼자 가는 것이 당신의 방식이 아니기 때문입니다.\n\n핵심은 좋은 파트너를 알아보는 눈을 기르는 것입니다. 30대에 에너지를 채워주는 결정적 파트너를 만나면 이후 인생이 완전히 달라집니다. 40대 이후에는 좋은 사람들로 둘러싸인 생태계의 중심이 됩니다.\n\n이 원국의 핵심 과제: 혼자 모든 것을 감당하려는 고집을 내려놓는 것.\n강점: 협력을 이끌어내는 능력, 네트워크의 힘.\'
        },
        fire: {
            strong: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "이 사람이 들어오면 공기가 바뀐다."\n\n존재 자체가 에너지입니다. 어떤 공간에 들어가도 분위기를 주도하는 카리스마, 말 한마디로 사람들을 움직이는 표현력 — 이것이 \'+name+\'님의 가장 강력한 무기입니다. 그러나 이 넘치는 에너지를 통제하지 못하면 20대에 번아웃과 감정 기복을 반복합니다. 열정을 쏟아붓다가 갑자기 무너지는 패턴이 생깁니다.\n\n30대에 이 에너지를 다루는 법을 터득하는 것이 이 원국의 가장 중요한 과제입니다. 40대의 당신은 이 카리스마가 완성된 형태로 드러납니다. 50대 이후에는 당신이 쌓아온 존재감과 영향력이 가장 큰 자산이 됩니다.\n\n이 원국의 핵심 과제: 에너지 관리. 불이 너무 세면 모든 것을 태웁니다.\n조심할 것: 충동적인 결정, 상대가 준비되기 전에 밀어붙이는 것.\n강점: 영감, 열정, 사람들을 끌어당기는 힘.\',
            weak: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "이 사람 안에는 폭발적인 열정의 씨앗이 있다. 다만 그 씨앗이 피어나려면 환경이 맞아야 한다."\n\n에너지가 빠르게 소진되는 경향이 있습니다. "나는 왜 이렇게 쉽게 지치는가"라는 자책이 생기지만, 이것은 당신의 문제가 아니라 환경의 문제입니다. 당신의 에너지를 충전시켜주는 사람과 장소에 있을 때, 누구보다 밝게 빛납니다.\n\n30대에 진정한 환경과 사람을 찾아낼 때 이후 삶이 달라집니다. 그 환경 안에서 당신의 따뜻함과 헌신이 가장 강력한 무기가 됩니다.\n\n이 원국의 핵심 과제: 내 에너지를 빼앗는 사람과 채워주는 사람을 구별하는 것.\n강점: 헌신, 따뜻함, 한 번 켜지면 꺼지지 않는 집중력.\'
        },
        earth: {
            strong: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "이 사람은 흔들리지 않는다."\n\n주변이 아무리 요동쳐도 중심을 잡는 안정감 — 이것이 사람들이 당신 곁에 오고 싶어하는 이유입니다. 신뢰와 포용이 이 원국의 핵심 자산입니다.\n\n그러나 그림자가 있습니다. 변화를 두려워하다가 좋은 기회를 흘려보내는 것입니다. "좀 더 확실해지면 할게"를 반복하다가 정작 기회가 지나간 후 후회하는 패턴이 생깁니다. 이 원국의 핵심 과제는 70%의 확신이 생겼을 때 실행하는 결단입니다.\n\n40대 이후에는 묵직한 신뢰로 쌓아올린 관계와 자산이 빛나는 전성기가 옵니다.\n\n조심할 것: 결정을 지나치게 미루는 것, 변화에 대한 과도한 저항.\n강점: 장기적 신뢰 구축, 안정적 기반 마련, 포용력.\',
            weak: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "안정을 원하는데, 삶이 계속 변화를 들이민다."\n\n이 긴장감이 20~30대를 힘들게 만드는 핵심 요소입니다. 그러나 이 구조의 비밀이 있습니다 — 변화 속에서도 무너지지 않는 단 하나의 기반을 만드는 것이 이 원국의 핵심 과제입니다. 그 기반은 직업일 수도, 관계일 수도, 공간일 수도 있습니다.\n\n40대에 그 기반이 완성될 때, 이후의 삶은 안정과 풍요로 채워집니다.\'
        },
        metal: {
            strong: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "이 사람의 눈은 레이저다."\n\n복잡한 상황 속에서 핵심을 꿰뚫어보는 능력, 불필요한 것을 단번에 쳐내는 결단력 — 이것이 최강의 무기입니다. 20대에는 이 냉철함이 "차갑다"는 오해를 만들기도 합니다. 그러나 이것은 오해입니다. 당신 안에는 강렬한 열정이 있습니다. 다만 낭비하지 않는 방식으로 표현합니다.\n\n30대에 전문성과 결단력이 결합될 때, 해당 분야에서 누구도 무시할 수 없는 존재가 됩니다. 40~50대에는 그 분야의 권위자가 되어 있을 것입니다.\n\n이 원국의 핵심 과제: 결단력을 유지하되, 주변 사람들에 대한 공감도 함께 키우는 것.\n강점: 전문성, 원칙, 불필요한 것을 쳐내는 용기.\',
            weak: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "날카로운 칼이 있는데, 아직 칼집이 없다."\n\n높은 기준과 예리한 판단력이 있습니다. 그러나 그것을 실현할 환경과 에너지가 항상 충분하지 않습니다. "더 잘할 수 있는데 왜 안 되는가"라는 내적 갈등이 20대를 지배합니다.\n\n30대에 당신의 능력을 인정해주는 환경과 사람을 만나면 이후가 달라집니다. 40대 이후, 정밀한 전문성이 세상에 제대로 인정받는 시기가 옵니다.\'
        },
        water: {
            strong: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "이 사람은 남들이 보지 못하는 것을 본다."\n\n패턴을 감지하는 능력, 흐름을 읽는 직관 — 이것이 이 원국의 핵심 자산입니다. 그러나 함정이 있습니다. 너무 많이 생각해서 실행을 미루는 것입니다. 완벽한 계획이 완성될 때까지 기다리다가 기회가 지나가는 패턴이 반복됩니다.\n\n당신의 직관은 대부분 맞습니다. 그 직관을 믿고 실행으로 옮기는 용기가 이 시기의 핵심 과제입니다. 40대 이후에는 오랜 기간 축적된 통찰이 완성된 지혜가 됩니다. 나이가 들수록 당신의 가치는 올라갑니다.\n\n이 원국의 핵심 과제: 분석을 멈추고 실행하는 타이밍을 잡는 것.\n강점: 깊은 통찰, 전략적 사고, 상황을 꿰뚫어보는 능력.\',
            weak: name+\'님의 사주를 한 문장으로 요약하면 이렇습니다. "천천히 깊어지는 강이다."\n\n섬세한 감각과 통찰이 있지만, 그것이 표면으로 드러나기까지 시간이 걸립니다. 20대에 자신의 능력에 대한 확신이 흔들리는 시기를 지납니다. 그러나 이것은 준비 중이기 때문입니다.\n\n30대에 당신의 통찰을 믿어주는 한 명의 귀인을 만나면 그 이후가 달라집니다. 40대 이후 깊이 쌓아온 지혜가 빛을 발하는 시기가 찾아옵니다.\'
        }
    };

    const strengthKey = isStrong ? \'strong\' : \'weak\';
    const lifeNarr = LIFE_NARRATIVE[dayOh]?.[strengthKey] || name+\'님의 사주 원국이 그리는 삶의 지도입니다.\';
    const iljuCore = dbEntry.core || \'\';

    const gongmangText = gongmangBranches.length > 0
        ? \'<div style="background:rgba(231,76,60,0.06);border-left:3px solid rgba(231,76,60,0.4);padding:14px 16px;border-radius:0 8px 8px 0;margin-top:16px;"><div style="font-size:11px;color:#e74c3c;margin-bottom:6px;letter-spacing:1px;">공망(空亡) — 결핍과 갈망의 에너지</div><p style="font-size:13px;color:#ccc;line-height:1.85;margin:0;">\'+name+\'님의 사주에는 공망이 있습니다. 공망은 비어있음입니다. 그러나 이 비어있음이 반드시 나쁜 것이 아닙니다. 이 결핍에 대한 끊임없는 갈망이 오히려 앞으로 나아가게 만드는 원동력이 됩니다. 채워질 것 같다는 느낌이 들 때 가장 위험한 선택을 하게 되니, 그 순간 한 번 더 냉정하게 판단하십시오.</p></div>\'
        : \'\';

    const yPillar = pillars[3] || {};
    const mPillar = pillars[2] || {};
    const dPillar = pillars[1] || {};
    const hPillar = pillars[0] || {};
    const yH = yPillar.h ? (typeof yPillar.h===\'string\' ? yPillar.h : yPillar.h.join(\'\')) : \'\';
    const mH = mPillar.h ? (typeof mPillar.h===\'string\' ? mPillar.h : mPillar.h.join(\'\')) : \'\';
    const dH = dPillar.h ? (typeof dPillar.h===\'string\' ? dPillar.h : dPillar.h.join(\'\')) : \'\';
    const hH = hPillar.h ? (typeof hPillar.h===\'string\' ? hPillar.h : hPillar.h.join(\'\')) : \'\';

    // 출생연도에서 인생 4막 연도 계산
    const birthYear = data.birthYear || 1988;
    const y1 = birthYear;          // 유년기 시작
    const y2 = birthYear + 15;     // 청년기 시작
    const y3 = birthYear + 35;     // 중년기 시작
    const y4 = birthYear + 55;     // 말년기 시작

    return \'<div class="report-chapter chapter-start">\\n\'+
        \'<h3 class="ch-title">Chapter 1. 당신의 사주 원국 — 한 사람의 삶의 지도</h3>\\n\'+
        \'<p class="ch-text">사주 8자는 단순한 기호가 아닙니다. 당신이 태어난 순간 우주의 에너지가 새겨넣은 인생 설계도입니다. 이 설계도를 읽을 줄 아는 사람과 모르는 사람 사이에는 — 같은 상황에서도 전혀 다른 선택과 전혀 다른 결과가 나타납니다.</p>\\n\'+
        \'<div style="background:rgba(199,167,106,0.07);border-left:4px solid var(--gold);padding:20px 22px;border-radius:0 12px 12px 0;margin:24px 0;">\\n\'+
        \'<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;letter-spacing:2px;">✦ 원국 종합 통변 — \'+name+\'님의 삶의 지도</div>\\n\'+
        \'<p style="font-size:14.5px;color:#ddd;line-height:2.0;white-space:pre-line;margin:0;">\'+lifeNarr+\'</p></div>\\n\'+
        (iljuCore ? \'<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px 20px;margin:20px 0;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:1px;">일주 \'+dH+\'(\'+toKr(dH)+\') — 나 자신의 핵심 기질</div><p style="font-size:14px;color:#ddd;line-height:1.9;margin:0;">\'+iljuCore+\'</p></div>\' : \'\')+
        \'<div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin:20px 0;">\\n\'+
        \'<div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:16px;letter-spacing:1px;">✦ 인생 4막의 흐름 — 연도별</div>\\n\'+
        \'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">\\n\'+
        \'<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">\\n\'+
        \'<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">🌱 유년기 · 초년기</div>\\n\'+
        \'<div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:4px;">\'+y1+\'~\'+y2+\'년</div>\\n\'+
        \'<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">연주(年柱) \'+yH+\'(\'+toKr(yH)+\')</div>\\n\'+
        \'<p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">조상과 뿌리의 에너지가 유년기 환경을 만들었습니다. 태어난 가정의 분위기, 어린 시절 세상의 첫인상이 이 기운 안에 담겨 있습니다. 이 시기의 경험이 무의식 깊숙이 새겨져 평생의 기준점이 됩니다.</p></div>\\n\'+
        \'<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">\\n\'+
        \'<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">🔥 청년기</div>\\n\'+
        \'<div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:4px;">\'+y2+\'~\'+y3+\'년</div>\\n\'+
        \'<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">월주(月柱) \'+mH+\'(\'+toKr(mH)+\')</div>\\n\'+
        \'<p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">사회에 처음 발을 내딛는 이 시기의 주된 흐름이 월주에 담겨 있습니다. 어떤 분야에서 재능이 먼저 드러나는지, 어떤 환경에서 성장하는지를 보여줍니다.</p></div>\\n\'+
        \'<div style="background:rgba(199,167,106,0.08);border-radius:8px;padding:14px;border:1px solid rgba(199,167,106,0.2);">\\n\'+
        \'<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">⚡ 중년기</div>\\n\'+
        \'<div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:4px;">\'+y3+\'~\'+y4+\'년</div>\\n\'+
        \'<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">일주(日柱) \'+dH+\'(\'+toKr(dH)+\') ← 나 자신</div>\\n\'+
        \'<p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">사주 8자 중 가장 중요한 자리입니다. 당신이 어떤 사람인지, 내면 깊숙이 무엇을 원하는지, 어떤 사람과 함께할 때 가장 빛나는지가 이 자리에 새겨져 있습니다.</p></div>\\n\'+
        \'<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">\\n\'+
        \'<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">🌙 말년기</div>\\n\'+
        \'<div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:4px;">\'+y4+\'년~</div>\\n\'+
        \'<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">시주(時柱) \'+hH+\'(\'+toKr(hH)+\')</div>\\n\'+
        \'<p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">자녀와 말년, 내면 깊숙이 숨어있는 소망의 에너지입니다. 인생 후반부에 무엇이 당신을 행복하게 하는지, 어떤 유산을 남기고 싶은지가 담겨 있습니다.</p></div></div></div>\\n\'+
        gongmangText+
        \'<div style="background:rgba(199,167,106,0.05);border-radius:10px;padding:18px;margin:20px 0;border:1px solid rgba(199,167,106,0.1);">\\n\'+
        \'<div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:10px;">✦ 이 원국을 가진 사람이 인생에서 가장 기억해야 할 것</div>\\n\'+
        \'<p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0;">\'+name+\'님의 사주는 단점처럼 보이는 것들 안에 가장 강력한 무기가 숨어 있는 구조입니다. 힘들었던 시간, 마찰이 있었던 순간, 무언가가 잘 안 됐던 경험 — 이 모든 것이 사실은 당신을 가장 단단하게 만들어온 과정이었습니다. 당신의 인생은 지금까지 낭비된 시간이 없습니다. 모든 것이 지금의 당신을 만들기 위한 설계의 일부였습니다.</p></div>\\n\'+
        \'</div>\';
}

'''

new_lines = lines[:start_line] + [new_func] + lines[end_line:]

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# 확인
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    content = f.read()

count = content.count('function buildChapter1_Basic')
print(f