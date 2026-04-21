with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 찾을 블록 시작/끝
start_marker = '        // ─── 인생 전반 서술 (만세력 아래) ───\n        (function(){'
end_marker = '        // ─── 대운 상세 풀이 ───'

start = html.find(start_marker)
end = html.find(end_marker)

if start < 0 or end < 0:
    print(f'마커 못찾음: start={start}, end={end}')
    # 대체 마커 시도
    start_marker2 = '// ─── 인생 전반 서술'
    start = html.find(start_marker2)
    print(f'대체 마커: {start}')
    exit()

print(f'교체 범위: {start} ~ {end}')

new_block = '''        // ─── 인생 전반 서술 (만세력 아래) ───
        (function(){
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var KN={wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};
            var STEM_CHAR={
                '甲':'갑목의 기운을 가진 이 기둥은 봄을 알리는 큰 나무처럼 거침없이 위를 향합니다. 어디서든 선두에 서고 싶어하며, 새로운 것을 시작하는 데 천부적 재능이 있습니다. 다만 한번 방향을 정하면 좀처럼 꺾이지 않는 고집도 있습니다.',
                '乙':'을목의 기운을 가진 이 기둥은 덩굴처럼 유연하게 목표를 향해 나아갑니다. 강한 바람에도 꺾이지 않고 결국 원하는 곳에 닿는 끈질긴 생명력이 특징입니다. 인간관계에서 특히 빛을 발하며, 결정적 순간에 귀인의 도움을 받습니다.',
                '丙':'병화의 기운을 가진 이 기둥은 태양처럼 존재 자체로 주변을 밝힙니다. 어디서든 자연스럽게 중심이 되고, 사람들의 마음을 끌어당기는 카리스마가 있습니다. 숨기는 것 없이 솔직하고 열정적이며, 무대 위에서 가장 빛납니다.',
                '丁':'정화의 기운을 가진 이 기둥은 촛불처럼 집중적으로 한 지점을 밝힙니다. 넓게 퍼지기보다 깊게 파고드는 전문성이 있으며, 신중하게 선택한 소수의 관계에서 깊은 신뢰를 쌓습니다.',
                '戊':'무토의 기운을 가진 이 기둥은 거대한 산처럼 묵직하고 믿음직합니다. 말보다 행동으로 보여주는 스타일이며, 주변 사람들이 자연스럽게 의지하게 됩니다. 오랜 시간이 지나도 변하지 않는 원칙과 신뢰가 핵심 자산입니다.',
                '己':'기토의 기운을 가진 이 기둥은 비옥한 땅처럼 무엇이든 품고 기를 수 있는 포용력이 있습니다. 실용적이고 세심하며, 이전에 뿌린 씨앗이 반드시 결실로 돌아오는 구조를 만들어냅니다.',
                '庚':'경금의 기운을 가진 이 기둥은 단련된 쇠처럼 단단하고 결단력이 강합니다. 불필요한 것을 과감히 쳐내고 핵심에 집중하는 능력이 탁월합니다. 한번 마음먹은 것은 끝까지 밀어붙이는 추진력이 강점입니다.',
                '辛':'신금의 기운을 가진 이 기둥은 보석처럼 정제되고 아름다운 에너지입니다. 완성도와 디테일에 민감하며, 무엇을 만들든 최고 수준을 추구합니다. 예민한 감수성이 때로는 상처가 되기도 하지만, 그 섬세함이 곧 경쟁력입니다.',
                '壬':'임수의 기운을 가진 이 기둥은 큰 강처럼 넓고 깊습니다. 어떤 상황에서도 흔들리지 않는 포용력과 전략적 사고가 강점입니다. 단기보다 장기, 좁은 길보다 넓은 길을 선택하는 대국적 시야를 가졌습니다.',
                '癸':'계수의 기운을 가진 이 기둥은 이슬처럼 섬세하고 깊은 직관력이 있습니다. 타인의 감정을 읽는 능력이 뛰어나며, 보이지 않는 것을 보는 통찰이 삶의 결정적 무기가 됩니다.'
            };
            var BRANCH_DESC={
                '子':'자(子)의 기운은 겨울 한밤중 깊은 물처럼 조용하지만 강렬한 집중력이 숨어있습니다. 혼자 있을 때 가장 빛을 발하며, 깊이 파고드는 능력이 탁월합니다. 이 기운이 있는 시기·자리에서는 분석·연구·계획이 최고의 성과를 냅니다.',
                '丑':'축(丑)의 기운은 얼어붙은 땅 아래서 조용히 꿈틀대는 봄의 전조입니다. 겉으로는 느려 보여도 내면에서 엄청난 에너지가 쌓이고 있습니다. 인내와 저력이 이 자리의 핵심이며, 때가 되면 폭발적으로 터집니다.',
                '寅':'인(寅)의 기운은 이른 새벽 먹이를 향해 거침없이 뛰어나가는 호랑이입니다. 개척과 도전의 에너지가 가득하며, 이 기운이 작동하는 시기에는 새로운 시작과 대담한 행동이 큰 성과로 이어집니다.',
                '卯':'묘(卯)의 기운은 봄이 절정에 달한 순간, 꽃과 잎이 동시에 터져 나오는 생명력입니다. 관계와 표현의 에너지가 강하고, 이 기운이 있는 자리에서는 사람과의 연결이 가장 큰 자산이 됩니다.',
                '辰':'진(辰)의 기운은 봄 대지를 뚫고 하늘로 솟구치는 용의 에너지입니다. 예측 불허의 변화와 잠재력이 폭발하는 자리로, 이 기운이 발동하면 인생이 완전히 다른 궤도로 전환될 수 있습니다.',
                '巳':'사(巳)의 기운은 허물을 벗고 새롭게 탄생하는 뱀의 에너지입니다. 예리한 지혜와 집중력이 강점이며, 이 자리에서는 길고 조용한 준비 끝에 결정적인 한 방이 터집니다.',
                '午':'오(午)의 기운은 한여름 정오의 태양처럼 모든 것이 절정에 달하는 에너지입니다. 열정과 추진력이 넘치며, 이 기운이 작동하는 시기에는 적극적으로 나설수록 인정과 성취가 따라옵니다.',
                '未':'미(未)의 기운은 여름의 끝자락, 풍성하게 영글어가는 대지의 에너지입니다. 감성과 예술적 감각이 풍부하며, 인간적인 따뜻함으로 주변 사람들의 마음을 움직입니다.',
                '申':'신(申)의 기운은 재빠르게 나무를 오르내리는 원숭이처럼 기민하고 영리한 에너지입니다. 상황 판단이 빠르고 실행력이 뛰어나며, 이 기운이 작동할 때는 생각을 즉시 행동으로 옮겨야 합니다.',
                '酉':'유(酉)의 기운은 가을 수확처럼 쌓아온 노력이 결실을 맺는 에너지입니다. 완성도와 심미안이 탁월하며, 전문성을 갈고닦아온 사람에게 드디어 그 가치를 인정받는 자리입니다.',
                '戌':'술(戌)의 기운은 가을 황혼 무렵, 하루를 마무리하는 충직한 개의 에너지입니다. 신뢰와 의리가 핵심 가치이며, 이 자리에서는 깊은 통찰과 불필요한 것을 정리하는 힘이 발동합니다.',
                '亥':'해(亥)의 기운은 겨울의 깊은 바다처럼 무한한 잠재력이 숨어있는 에너지입니다. 보이지 않는 곳에서 엄청난 힘이 축적되며, 이 기운이 발동하면 상상을 초월하는 결과가 나타납니다.'
            };
            // 주별 인생 시기 맥락
            var PILLAR_CTX={
                '년주':{period:'0~20세 유년기·초년',palace:'조상궁·부모궁',
                    intro:'년주는 당신이 이 세상에 태어나기 전부터 이미 결정된 것들 — 가문의 기운, 조상의 에너지, 태어난 시대의 기후 — 을 담고 있습니다. 이 기운은 초년기(0~20세)의 환경을 결정하며, 부모·형제와의 관계 패턴과 사회적 출발점을 형성합니다.',
                    ending:'이 기둥의 천간과 지지가 일주와 어떻게 작용하느냐에 따라 부모로부터의 독립 시기와 방식이 결정됩니다.'},
                '월주':{period:'20~40세 청년기',palace:'부모궁·직업궁',
                    intro:'월주는 청년기(20~40세)의 성장 환경과 직업적 방향성을 담고 있습니다. 월지의 오행이 당신의 십성 구조 전체를 지배하며, 어떤 직업군에서 빛을 발하는지, 부모·직장 상사와의 관계가 어떻게 흐르는지를 결정합니다.',
                    ending:'월주가 일주와 합(合)이 되면 직업이 적성에 잘 맞아 성장이 빠르고, 충(沖)이 되면 직업 변동이나 독립이 일찍 찾아옵니다.'},
                '일주':{period:'30~50세 중년기',palace:'나 자신·배우자궁',
                    intro:'일주는 사주의 핵심입니다. 일간이 당신의 본질적 기질과 가치관을 나타내고, 일지는 배우자궁이자 내면 깊숙이 숨어있는 진짜 욕망을 담고 있습니다. 중년기(30~50대)의 사회적 삶과 가정의 안정도를 결정합니다.',
                    ending:'일지의 기운이 길하면 배우자 복이 크고 가정이 안정됩니다. 일지에 공망이나 충이 있으면 결혼 후 변화가 생길 수 있으나, 이는 성장의 기회이기도 합니다.'},
                '시주':{period:'50세 이후 말년기',palace:'자녀궁·말년궁',
                    intro:'시주는 50대 이후 말년의 삶의 방향과, 남에게는 보이지 않는 당신의 가장 은밀한 내면의 욕망을 담고 있습니다. 자녀와의 관계, 노후의 건강과 안정, 그리고 이 세상을 떠날 때 어떤 모습일지를 암시합니다.',
                    ending:'시주가 일주와 조화를 이루면 말년에 자녀 덕을 보고 평안을 누립니다. 시주의 기운을 이해하면 지금 무엇을 준비해야 하는지가 명확해집니다.'}
            };
            var pN={'시주':'⏰ 시주 — 말년·자녀 (50세 이후)','일주':'👤 일주 — 나 자신·배우자 (중년기)','월주':'🌿 월주 — 직업·청년기 (20~40세)','년주':'🌳 년주 — 유년기·조상 (0~20세)'};
            var lc='<div class="report-chapter"><h3 class="ch-title">인생 전반 서술 — 유년기부터 말년까지</h3><p class="ch-text">사주의 네 기둥은 각각 당신 인생의 서로 다른 시기를 담당합니다. 년주는 뿌리, 월주는 줄기, 일주는 꽃, 시주는 열매입니다. 태어난 순간 이미 설계된 이 4개의 기둥이 어떻게 맞물리는지에 따라 인생의 서사가 결정됩니다.</p>';
            var orderMap={'년주':0,'월주':1,'일주':2,'시주':3};
            var sortedPillars=pillars.slice().sort(function(a,b){return (orderMap[a.n]||0)-(orderMap[b.n]||0);});
            sortedPillars.forEach(function(p){
                if(!p||!p.h)return;
                var nm=p.n;
                var gan=p.h[0];var ji=p.h[1];
                var han=gan+ji;
                var ctx=PILLAR_CTX[nm]||{period:'',palace:'',intro:'',ending:''};
                var ganOh=OH[gan]||'earth';var jiOh=JO[ji]||'earth';
                var ganKn=KN[ganOh]||'';var jiKn=KN[jiOh]||'';
                var ganDesc=STEM_CHAR[gan]||gan+'의 기운이 이 기둥을 이끕니다.';
                var jiDesc=BRANCH_DESC[ji]||ji+'의 기운이 이 기둥의 바탕을 이룹니다.';
                var sipVal=(data.pillars_sipseong&&data.pillars_sipseong[orderMap[nm]])||'';
                var isBorderGold = nm==='일주';
                lc+='<div style="margin:16px 0;padding:20px;background:rgba(255,255,255,'+(isBorderGold?'0.05':'0.03')+');border-left:4px solid '+(isBorderGold?'var(--gold)':'rgba(199,167,106,0.4)')+';border-radius:0 10px 10px 0;">';
                lc+='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px;">';
                lc+='<div><div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:4px;">'+(pN[nm]||nm)+'</div>';
                lc+='<div style="font-size:26px;font-weight:900;font-family:Noto Serif KR,serif;color:'+(isBorderGold?'var(--gold)':'#ddd')+';">'+han+'</div></div>';
                lc+='<div style="text-align:right;font-size:11px;color:#888;line-height:1.7;"><div>'+ctx.palace+'</div><div>'+ganKn+' + '+jiKn+'</div>'+(sipVal?'<div style="color:rgba(199,167,106,0.7);">십성: '+sipVal+'</div>':'')+'</div></div>';
                lc+='<p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0 0 12px;">'+ctx.intro+'</p>';
                lc+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">';
                lc+='<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:10px;color:var(--text-dim);margin-bottom:5px;letter-spacing:1px;">천간 '+gan+' ('+ganKn+')</div><p style="font-size:12.5px;color:#ddd;line-height:1.75;margin:0;">'+ganDesc+'</p></div>';
                lc+='<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:10px;color:var(--text-dim);margin-bottom:5px;letter-spacing:1px;">지지 '+ji+' ('+jiKn+')</div><p style="font-size:12.5px;color:#ddd;line-height:1.75;margin:0;">'+jiDesc+'</p></div>';
                lc+='</div>';
                lc+='<div style="background:rgba(199,167,106,0.05);border-radius:6px;padding:10px;border-left:2px solid rgba(199,167,106,0.3);">';
                lc+='<div style="font-size:10px;color:var(--gold);margin-bottom:5px;letter-spacing:1px;">✦ '+ctx.period+' 핵심 조언</div>';
                lc+='<p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">'+ctx.ending+'</p>';
                lc+='</div>';
                lc+='</div>';
            });
            lc+='</div>';
            var ms=document.getElementById('manse-inline-summary');
            if(ms) ms.insertAdjacentHTML('afterend',lc);
        })();

'''

html = html[:start] + new_block + html[end:]

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f'완료. 신규 블록 크기: {len(new_block)}bytes')
