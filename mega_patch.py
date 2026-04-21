import json, re

GAN_T = {
  '甲': '갑목(甲木)의 기운이 지배하는 이 시기는 새로운 시작과 도전의 계절입니다. 봄에 처음 땅을 뚫고 나오는 새싹처럼 강인하고 직진하는 에너지가 넘칩니다. 두려움 없이 앞으로 나아가는 것이 핵심 전략입니다. 새로운 사업, 이직, 이사, 학업 시작 등 도전적 행보가 이 에너지와 정확히 공명합니다.',
  '乙': '을목(乙木)은 덩굴처럼 유연하게 뻗어나가는 기운입니다. 인간관계와 네트워크가 이 시기 최고의 자산입니다. 이 시기 만나는 귀인(貴人)이 인생의 방향을 바꾸는 결정적 역할을 할 수 있습니다.',
  '丙': '병화(丙火)는 태양처럼 모든 것을 밝게 드러내는 기운입니다. 오랫동안 숨겨왔던 재능과 성과가 세상에 드러나는 시기입니다. 자신을 적극적으로 알리는 강의, 출판, 브랜딩, 발표 등 모든 활동이 극대화됩니다.',
  '丁': '정화(丁火)는 촛불처럼 집중적이고 섬세한 기운입니다. 한 분야를 깊이 파고드는 전문성의 시기입니다. 장인정신, 전문직, 심층 연구가 이 기운과 가장 잘 맞습니다.',
  '戊': '무토(戊土)는 거대한 산처럼 묵직하고 안정적인 기운입니다. 부동산, 자산 축적, 사업 기반 확장 등 10년 후를 내다보는 투자가 이 에너지를 극대화합니다. 느리지만 확실하게 — 그것이 이 시기의 전략입니다.',
  '己': '기토(己土)는 비옥한 농토처럼 실용적이고 섬세한 기운입니다. 이전에 뿌린 씨앗들이 실질적인 결과물로 돌아오는 시기입니다. 꼼꼼한 관리와 내실 있는 운영이 빛을 발합니다.',
  '庚': '경금(庚金)은 날카로운 도끼처럼 불필요한 것을 과감히 쳐내는 기운입니다. 혁신과 개혁의 에너지가 강합니다. 과감한 결단과 구조 개혁이 필요하며 망설임이 가장 큰 적입니다.',
  '辛': '신금(辛金)은 보석을 세공하듯 정밀하게 완성도를 높이는 기운입니다. 디테일에 집중하고 품질을 극대화할 때 최고의 결과물이 나옵니다. 이 시기에 완성된 작업은 오래도록 빛을 발합니다.',
  '壬': '임수(壬水)는 큰 강처럼 에너지가 넓게 확산되는 기운입니다. 인맥이 폭발적으로 확장되고 새로운 기회가 사방에서 찾아오는 시기입니다. 핵심 목표를 명확히 유지하며 흐름을 타는 것이 전략입니다.',
  '癸': '계수(癸水)는 깊은 지하수처럼 보이지 않는 곳에서 힘을 키우는 기운입니다. 겉으로는 정체처럼 보이지만 내면에서 엄청난 에너지가 축적됩니다. 이 시기를 분석·연구·학습으로 채운 사람과 허비한 사람의 차이는 다음 대운에서 극명하게 드러납니다.'
}

JI_T = {
  '子': '자(子) 지지는 지혜와 집중력의 기운입니다. 분석력이 극대화되는 시기로 계획 수립, 자격증 취득, 학업에 유리합니다. 생각한 것을 행동으로 옮기는 용기가 필요합니다.',
  '丑': '축(丑) 지지는 인내와 저력의 기운입니다. 눈에 보이는 성과보다 내공이 쌓이는 시기입니다. 이 기간을 묵묵히 견디며 쌓은 실력이 이후 운에서 폭발적 결과로 이어집니다.',
  '寅': '인(寅) 지지는 강렬한 활동과 변화의 기운입니다. 이동, 변화, 새로운 출발의 에너지가 강하게 발동합니다. 이 시기에 시작한 일이 오래도록 지속되는 뿌리 깊은 나무가 됩니다.',
  '卯': '묘(卯) 지지는 성장과 관계의 기운입니다. 인맥이 넓어지고 협력 기회가 풍부해집니다. 혼자보다 함께할 때 성과가 배가되는 운의 구조입니다.',
  '辰': '진(辰) 지지는 잠재력이 폭발하는 변화의 기운입니다. 예상치 못한 변수가 많지만 유연하게 대응하면 인생의 전환점이 됩니다.',
  '巳': '사(巳) 지지는 내면의 결단력이 요구되는 기운입니다. 오래 고민해온 문제의 답이 이 시기에 명확해집니다. 과감한 선택이 이후 10년의 방향을 결정합니다.',
  '午': '오(午) 지지는 성취와 인정의 기운입니다. 쌓아온 노력이 사회적으로 드러나고 인정받습니다. 이 기세를 타고 더 큰 목표를 향해 나아가야 합니다.',
  '未': '미(未) 지지는 풍요로운 감성과 창작의 기운입니다. 인간적인 관계가 깊어지고 예술·교육 활동에서 빛을 발합니다.',
  '申': '신(申) 지지는 판단력과 실행력의 기운입니다. 기회가 빠르게 스쳐 지나가므로 민첩하게 포착하고 즉시 실행해야 합니다.',
  '酉': '유(酉) 지지는 완성과 보상의 기운입니다. 쌓아온 전문성이 인정받고 노력에 대한 정당한 대가가 돌아옵니다.',
  '戌': '술(戌) 지지는 통찰과 마무리의 기운입니다. 불필요한 것을 정리하고 핵심 가치에 집중하게 됩니다. 이 시기의 내면 성장이 다음 대운의 토대가 됩니다.',
  '亥': '해(亥) 지지는 잠복과 준비의 기운입니다. 표면적으로는 정체처럼 보이지만 내면에서 엄청난 에너지가 축적됩니다. 가장 어두운 밤이 새벽 직전임을 기억하십시오.'
}

WL_T = {
  '寅': '인(寅)월 — 봄의 시작, 새로운 기운이 발동합니다. 새로운 계획, 프로젝트 착수, 인맥 확장에 최적입니다. 머뭇거리지 말고 이달에 첫발을 내딛으십시오.',
  '卯': '묘(卯)월 — 성장과 확장의 기운입니다. 인맥을 넓히고 협업 제안에 적극 응하세요. 이달의 만남이 중요한 장기 인연이 됩니다.',
  '辰': '진(辰)월 — 변화와 전환의 기운입니다. 예상치 못한 기회가 찾아올 수 있으니 유연하게 대응하십시오.',
  '巳': '사(巳)월 — 집중력이 최고조인 달입니다. 중요한 결정을 내리고 실행에 집중하십시오. 이달의 결단이 하반기를 좌우합니다.',
  '午': '오(午)월 — 에너지와 활력이 넘칩니다. 사회적 활동, 발표, 영업에 최적입니다. 적극적으로 나서면 인정받습니다.',
  '未': '미(未)월 — 관계와 감성이 풍부해집니다. 인간관계를 돌보고 협력을 강화하십시오. 감사와 배려가 큰 보답으로 돌아옵니다.',
  '申': '신(申)월 — 결단과 실행력이 요구됩니다. 판단한 것을 즉시 행동으로 옮기십시오. 속도가 결과를 결정하는 달입니다.',
  '酉': '유(酉)월 — 마무리와 완성의 기운입니다. 진행 중인 일을 깔끔하게 마무리하고 품질을 점검하십시오.',
  '戌': '술(戌)월 — 성찰과 정리의 달입니다. 불필요한 것을 정리하고 중요한 것에만 집중하십시오.',
  '亥': '해(亥)월 — 준비와 내공의 달입니다. 학습, 자기 성찰에 집중하면 내년에 큰 도약이 찾아옵니다.',
  '子': '자(子)월 — 지혜와 집중의 달입니다. 복잡한 문제를 분석하고 장기 계획을 수립하기에 최적입니다.',
  '丑': '축(丑)월 — 인내와 축적의 달입니다. 결과를 서두르지 말고 착실하게 실력을 쌓는 것이 이달의 전략입니다.'
}

PLC = {
  '시주': '시주(時柱)는 자녀궁이자 말년의 기운을 담은 기둥입니다. 50대 이후 당신의 삶이 어떤 방향으로 흘러가는지를 보여줍니다. 당신의 가장 깊은 내면, 남에게 보이지 않는 은밀한 욕망과 두려움이 숨어있는 자리이기도 합니다. 시주의 기운이 길하면 자녀로 인한 기쁨이 크고 말년에 평안한 노후를 맞이합니다.',
  '일주': '일주(日柱)는 당신 자신입니다. 일간(日干)이 당신의 본질적 기질이고, 일지(日支)는 배우자궁이자 내면 깊숙이 숨어있는 진짜 욕망입니다. 30대~50대 당신의 사회적 삶과 가정의 기운을 담고 있습니다. 일지에 길한 기운이 있으면 배우자 복이 크고 가정이 안정됩니다.',
  '월주': '월주(月柱)는 부모궁이자 직업과 사회적 활동의 기운을 담은 기둥입니다. 청소년기부터 30대까지 당신의 성장 환경과 직업적 적성을 보여줍니다. 월지(月支)의 계절 기운이 당신의 오행 전체를 지배합니다. 직업 선택, 사회 진출, 부모와의 관계 패턴이 모두 월주에서 시작됩니다.',
  '년주': '년주(年柱)는 조상과 유년기의 기운을 담은 기둥입니다. 0세~20세, 태어난 시대와 가문의 기운, 조상으로부터 물려받은 유전적 기질이 담겨있습니다. 년주가 길하면 초년에 도움이 많습니다. 년주와 일주가 충돌하면 조상이나 부모로부터의 독립이 일찍 찾아올 수 있습니다.'
}

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

OLD = '        go(2);\n        window.scrollTo(0,0);\n        try { generateDeepReport(globalSajuData); } catch(e) { console.error(e); }'

NEW = '''
        // ─── 만세력 아래: 인생 전반 서술 ───
        (function(){
            var PLC=''' + json.dumps(PLC, ensure_ascii=False) + ''';
            var pN={'시주':'⏰ 시주 — 말년·자녀','일주':'👤 일주 — 나 자신·배우자','월주':'🌿 월주 — 직업·청년기','년주':'🌳 년주 — 유년기·조상'};
            var lc='<div class="report-chapter"><h3 class="ch-title">인생 전반 서술 — 유년기부터 말년까지</h3><p class="ch-text">사주의 네 기둥은 각각 당신 인생의 서로 다른 시기를 담당합니다. 년주는 뿌리, 월주는 줄기, 일주는 꽃, 시주는 열매입니다.</p>';
            pillars.forEach(function(p){if(!p||!p.h)return;var nm=p.n;var han=p.h[0]+p.h[1];var desc=PLC[nm]||'';lc+='<div style="margin:14px 0;padding:16px;background:rgba(255,255,255,0.04);border-left:3px solid var(--gold);border-radius:0 8px 8px 0;"><div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px;">'+(pN[nm]||nm)+' <span style="font-size:18px;font-family:Noto Serif KR,serif;">'+han+'</span></div><p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">'+desc+'</p></div>';});
            lc+='</div>';
            var ms=document.getElementById('manse-inline-summary');
            if(ms) ms.insertAdjacentHTML('afterend',lc);
        })();

        // ─── 대운 상세 풀이 ───
        (function(){
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var sc={}; sc[yong]=2;sc[hee]=1;sc[gi]=-2;sc[goo]=-1;
            var GAN_T=''' + json.dumps(GAN_T, ensure_ascii=False) + ''';
            var JI_T=''' + json.dumps(JI_T, ensure_ascii=False) + ''';
            function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
            function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
            function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}
            var h2='<div class="report-chapter"><h3 class="ch-title">대운(大運) 80년 — 10년 단위 완전 해부</h3><p class="ch-text">대운은 인생의 기후입니다. 용신 기운의 대운에서 집중 공략하고, 기신 기운의 대운에서 내공을 쌓으십시오.</p>';
            daeunData.forEach(function(dy,idx){
                var gz=dy.getGanZhi();var g=gz[0];var j=gz[1];
                var age=dy.getStartAge();
                var endAge=idx<daeunData.length-1?daeunData[idx+1].getStartAge():age+10;
                var s=gs(g,j);var isCur=idx===activeDaeunIdx;var col=gc(s);
                var strat=s>=2?'이 대운은 용신·희신 기운이 강한 길한 시기입니다. 공격적으로 확장하고 중요한 결정을 실행에 옮기십시오. 새로운 사업·투자·인맥 확장을 모두 적극적으로 추진하십시오. 이런 길운은 평생 몇 번 오지 않으니 최대한 활용하는 것이 인생의 전환점이 됩니다.'
                    :s>=0?'이 대운은 큰 기복 없이 안정적으로 흐릅니다. 도약보다는 내실을 다지고 꾸준히 자신을 개발하는 시기입니다.'
                    :'이 대운은 기신·구신 기운이 강한 시기입니다. 무리한 확장은 피하고 지금 갖고 있는 것을 지키는 수비 전략이 현명합니다. 이 시기를 충실히 내공 쌓기로 채운 사람이 다음 길운에서 가장 크게 도약합니다.';
                h2+='<div style="margin-bottom:18px;padding:18px;background:rgba(255,255,255,'+(isCur?'0.07':'0.03')+');border:1px solid '+(isCur?'var(--gold)':'rgba(255,255,255,0.07)')+';border-radius:12px;">';
                h2+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">';
                h2+='<div style="display:flex;align-items:center;gap:10px;"><span style="font-size:26px;font-weight:900;color:var(--gold);font-family:Noto Serif KR,serif;">'+g+j+'</span>';
                h2+='<div><div style="font-size:13px;color:#bbb;">'+age+'세 ~ '+(endAge-1)+'세</div>'+(isCur?'<span style="font-size:10px;background:var(--gold);color:#000;padding:1px 8px;border-radius:8px;font-weight:700;">▶ 현재</span>':'')+'</div></div>';
                h2+='<span style="font-size:13px;font-weight:700;color:'+col+';padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">'+gb(s)+'</span></div>';
                h2+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">';
                h2+='<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;"><div style="font-size:10px;color:var(--text-dim);margin-bottom:5px;">천간(天干) '+g+'</div><p style="font-size:12.5px;color:#ddd;line-height:1.75;margin:0;">'+(GAN_T[g]||g+' 기운이 이 시기를 이끕니다.')+'</p></div>';
                h2+='<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;"><div style="font-size:10px;color:var(--text-dim);margin-bottom:5px;">지지(地支) '+j+'</div><p style="font-size:12.5px;color:#ddd;line-height:1.75;margin:0;">'+(JI_T[j]||j+' 기운이 뒷받침합니다.')+'</p></div></div>';
                h2+='<div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:12px;border-left:2px solid '+col+';"><div style="font-size:10px;color:var(--text-dim);margin-bottom:5px;">이 대운의 전략</div><p style="font-size:13px;color:#ccc;line-height:1.8;margin:0;">'+strat+'</p></div></div>';
            });
            h2+='</div>';
            var rc=document.getElementById('report-container');
            if(rc) rc.insertAdjacentHTML('beforeend',h2);
        })();

        // ─── 세운 10년 상세 풀이 ───
        (function(){
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var KN={wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};
            var sc={}; sc[yong]=2;sc[hee]=1;sc[gi]=-2;sc[goo]=-1;
            function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
            function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
            function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}
            var curY=new Date().getFullYear();
            var h3='<div class="report-chapter"><h3 class="ch-title">세운(歲運) 10년 — 연도별 완전 분석</h3><p class="ch-text">세운은 그해의 날씨입니다. 용신 기운이 강한 해에 중요한 행동을 집중하고, 기신 기운의 해에는 수비 전략을 택하십시오.</p>';
            for(var yr=curY;yr<curY+10;yr++){
                var yL=Solar.fromYmd(yr,6,15).getLunar();
                var yE=yL.getEightChar();
                var gz=yE.getYear();var g=gz[0];var j=gz[1];
                var s=gs(g,j);var col=gc(s);var isThis=(yr===curY);
                var ganOh=OH[g]||'earth';var jiOh=JO[j]||'earth';
                var adv=s>=2?'올해는 적극적으로 행동하십시오. 중요한 시작, 도전, 투자가 좋은 결실로 이어집니다. 이 해의 기세를 타면 다음 해까지 탄력이 이어집니다.'
                    :s>=0?'올해는 안정적인 한 해입니다. 꾸준히 실력을 쌓고 내실을 다지는 것이 최선의 전략입니다.'
                    :'올해는 수비가 최선입니다. 새로운 모험이나 큰 투자는 미루고 기존에 갖고 있는 것을 지키십시오. 이 해를 무사히 넘기면 다음 해에 기회가 찾아옵니다.';
                var gDesc='천간 '+g+'('+KN[ganOh]+') 기운이 올 한 해를 이끕니다. '+KN[ganOh]+' 에너지가 강해지는 해입니다.';
                var jDesc='지지 '+j+'('+KN[jiOh]+') 기운이 뒷받침합니다. 이 지지 에너지가 올해의 현실적 조건을 만들어냅니다.';
                h3+='<div style="margin-bottom:14px;padding:16px;background:rgba(255,255,255,'+(isThis?'0.07':'0.03')+');border:1px solid '+(isThis?'var(--gold)':'rgba(255,255,255,0.07)')+';border-radius:12px;">';
                h3+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">';
                h3+='<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:20px;font-weight:900;color:var(--gold);font-family:Noto Serif KR,serif;">'+g+j+'</span>';
                h3+='<span style="font-size:14px;color:#bbb;">'+yr+'년'+(isThis?' <span style="font-size:10px;background:var(--gold);color:#000;padding:1px 7px;border-radius:8px;font-weight:700;">올해</span>':'')+'</span></div>';
                h3+='<span style="font-size:12px;font-weight:700;color:'+col+';">'+gb(s)+'</span></div>';
                h3+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
                h3+='<div style="background:rgba(0,0,0,0.25);border-radius:6px;padding:10px;"><div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">천간 '+g+'</div><p style="font-size:12px;color:#ddd;line-height:1.7;margin:0;">'+gDesc+'</p></div>';
                h3+='<div style="background:rgba(0,0,0,0.25);border-radius:6px;padding:10px;"><div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">지지 '+j+'</div><p style="font-size:12px;color:#ddd;line-height:1.7;margin:0;">'+jDesc+'</p></div></div>';
                h3+='<div style="background:rgba(199,167,106,0.06);border-radius:6px;padding:10px;