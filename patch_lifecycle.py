with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html','r') as f:
    html = f.read()

# 1. CSS 추가
CSS_INJECT = """
        /* 카테고리 탭 */
        .cat-tab { background:#111; border:1px solid var(--line); color:var(--text-soft); padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; transition:all 0.2s; }
        .cat-tab.active { background:var(--gold); color:#000; font-weight:700; border-color:var(--gold); }
        .cat-content { font-size:14px; color:var(--text); line-height:1.8; }
        .lifecycle-card { background:#0a0a0a; border:1px solid var(--line); border-radius:12px; padding:14px 16px; }
        .lifecycle-card .lc-era { font-size:11px; color:var(--gold); font-weight:700; letter-spacing:2px; margin-bottom:6px; }
        .lifecycle-card .lc-title { font-size:16px; font-weight:700; color:#fff; margin-bottom:8px; }
        .lifecycle-card .lc-text { font-size:13px; color:var(--text-soft); line-height:1.8; }
"""

css_anchor = "        .gauge-sub {\n            font-size: 13px;\n            color: var(--text-soft);\n            margin-top: 4px;\n        }"
if css_anchor in html:
    html = html.replace(css_anchor, css_anchor + CSS_INJECT, 1)
    print("CSS OK")
else:
    print("CSS anchor not found")

# 2. JS: 대운 그래프 + 인생시기 + 카테고리
JS_INJECT = r"""
        // ===== 대운 그래프 =====
        (function() {
            const svg = document.getElementById('daeun-graph-svg');
            if(!svg) return;
            const rows = daeunData;
            const n = rows.length;
            if(n === 0) return;
            const OHMAP = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            const sc = {};
            sc[yong]=2; sc[hee]=1; sc[gi]=-2; sc[goo]=-1;
            const scores = rows.map(dy=>{const gz=dy.getGanZhi(); return (sc[OHMAP[gz[0]]]||0)+(sc[OHMAP[gz[1]]]||0);});
            const minS = Math.min(...scores)-1, maxS = Math.max(...scores)+1, range = maxS-minS||1;
            const W = svg.parentElement ? svg.parentElement.clientWidth || 320 : 320;
            const H=130, PL=30,PR=20,PT=20,PB=30, gW=W-PL-PR, gH=H-PT-PB, step=gW/(n-1||1);
            const pts = rows.map((dy,i)=>({
                x: PL+i*step,
                y: PT+gH-((scores[i]-minS)/range)*gH,
                age: dy.getStartAge(),
                gz: dy.getGanZhi(),
                score: scores[i]
            }));
            const midY = PT+gH-((0-minS)/range)*gH;
            let s = `<defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c8941c" stop-opacity="0.3"/><stop offset="100%" stop-color="#c8941c" stop-opacity="0.02"/></linearGradient></defs>`;
            s += `<line x1="${PL}" y1="${midY}" x2="${W-PR}" y2="${midY}" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4,4"/>`;
            const ap = pts.map((p,i)=>(i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`)).join(' ')+` L${pts[n-1].x},${H-PB} L${pts[0].x},${H-PB} Z`;
            s += `<path d="${ap}" fill="url(#gg)"/>`;
            const lp = pts.map((p,i)=>(i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`)).join(' ');
            s += `<path d="${lp}" fill="none" stroke="#c8941c" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
            pts.forEach((p,i)=>{
                const act = i===activeDaeunIdx;
                const col = p.score>=1?'#00C853':p.score<=-1?'#e74c3c':'#c8941c';
                s += `<circle cx="${p.x}" cy="${p.y}" r="${act?7:5}" fill="${col}" stroke="#000" stroke-width="${act?2:1}"/>`;
                s += `<text x="${p.x}" y="${H-PB+14}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.5)">${p.age}세</text>`;
                if(act) s += `<text x="${p.x}" y="${p.y-10}" text-anchor="middle" font-size="9" fill="${col}">${p.gz[0]}${p.gz[1]}</text>`;
            });
            svg.innerHTML = s;
            svg.setAttribute('width', W);
            svg.setAttribute('height', H);
        })();

        // ===== 인생 시기별 풀이 =====
        (function() {
            const el = document.getElementById('lifecycle-cards');
            if(!el) return;
            const OHMAP2 = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            const sc2 = {}; sc2[yong]=2; sc2[hee]=1; sc2[gi]=-2; sc2[goo]=-1;
            const OHKR = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};
            const hmap = {wood:'간담·신경계',fire:'심장·혈관',earth:'위장·소화기',metal:'폐·대장',water:'신장·호르몬'};
            const eras = [
                {era:'🌱 유년기 (0~20세)', filter: d=>d.getStartAge()<20},
                {era:'🔥 초년기 (20~40세)', filter: d=>d.getStartAge()>=20&&d.getStartAge()<40},
                {era:'⚡ 중년기 (40~60세)', filter: d=>d.getStartAge()>=40&&d.getStartAge()<60},
                {era:'🌙 말년기 (60세~)', filter: d=>d.getStartAge()>=60},
            ];
            el.innerHTML = eras.map(({era, filter})=>{
                const ds = daeunData.filter(filter);
                if(!ds.length) return '';
                const avg = ds.reduce((s,d)=>{const gz=d.getGanZhi(); return s+(sc2[OHMAP2[gz[0]]]||0)+(sc2[OHMAP2[gz[1]]]||0);},0)/ds.length;
                const trend = avg>=1?'상승기 — 기운이 뻗어나가는 시기':avg<=-1?'저조기 — 내실을 다지는 준비의 시간':'중화기 — 안정적인 흐름';
                const col = avg>=1?'#00C853':avg<=-1?'#e74c3c':'#c8941c';
                const gzList = ds.map(d=>{const gz=d.getGanZhi(); return gz[0]+gz[1];}).join(' · ');
                return `<div class="lifecycle-card"><div class="lc-era">${era}</div><div class="lc-title" style="color:${col}">${trend}</div><div class="lc-text">대운: ${gzList}<br>${avg>=0?'용신 운과 가까운 시기로 전진의 에너지가 작동합니다.':'기신 운의 영향으로 인내와 준비가 요구되는 시기입니다.'}</div></div>`;
            }).join('');
        })();

        // ===== 카테고리별 분석 =====
        (function() {
            const OHMAP3 = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            const stemEl = OHMAP3[dayStem]||'earth';
            const jaeC = (sipCounts['정재']||0)+(sipCounts['편재']||0);
            const gwanC = (sipCounts['정관']||0)+(sipCounts['편관']||0);
            const inC = (sipCounts['정인']||0)+(sipCounts['편인']||0);
            const sikC = (sipCounts['식신']||0)+(sipCounts['상관']||0);
            const hmap = {wood:'간담·신경계',fire:'심장·혈관',earth:'위장·소화기',metal:'폐·대장',water:'신장·호르몬'};
            const pct = v => Math.round(v/Math.max(sipTotalWeight,1)*100);
            document.getElementById('cat-health').innerHTML = `<p>일간 <b>${dayStem}</b> 기준 주의 신체: <b>${hmap[stemEl]}</b></p><p>${counts[stemEl]>=30?'해당 오행 과다 — 규칙적 생활과 무리한 일정 자제가 핵심입니다.':'오행 균형 양호 — '+hmap[gi]+' 관련 계절에 컨디션 관리에 신경 쓰세요.'}</p>`;
            document.getElementById('cat-wealth').innerHTML = `<p>재성 비중: <b>${pct(jaeC)}%</b></p><p>${jaeC>sipTotalWeight*0.25?'재성 강 — 돈을 끌어당기는 감각, 사업·투자 기회 포착 능력이 뛰어납니다.':jaeC===0?'재성 없음 — 돈이 흘러가는 경향. 지출 관리와 저축 습관이 핵심입니다.':'재성 적정 — 안정보다 가치 창출로 재물을 만드는 스타일입니다.'}</p>`;
            document.getElementById('cat-career').innerHTML = `<p>관성 비중: <b>${pct(gwanC)}%</b></p><p>${gwanC>sipTotalWeight*0.25?'관성 강 — 조직과 명예, 공직·기업·전문직에서 두각을 드러냅니다.':sikC>sipTotalWeight*0.25?'식상 강 — 재능과 표현력으로 승부. 프리랜서·창작직·서비스업에 적합합니다.':'전문성을 쌓아 자신만의 영역을 구축하는 스타일입니다.'}</p>`;
            document.getElementById('cat-love').innerHTML = `<p>${gwanC>0?'관성 있음 — 이성 인연이 자연스럽게 찾아오는 구조. 다만 통제욕 주의.':inC>sipTotalWeight*0.3?'인성 강 — 관계에서 헌신적이나 자기희생 과다 주의. 자신을 먼저 사랑하는 연습 필요.':'인연은 본인이 주도적으로 만들어가는 스타일. 용신 운이 들어오는 대운에서 인연이 활성화됩니다.'}</p>`;
        })();

        window.showCat = function(cat) {
            ['health','wealth','career','love'].forEach(c=>{
                const el = document.getElementById('cat-'+c);
                if(el) el.style.display = c===cat?'block':'none';
            });
            document.querySelectorAll('.cat-tab').forEach((t,i)=>{
                t.classList.toggle('active',['health','wealth','career','love'][i]===cat);
            });
        };
"""

anchor = "        buildFortuneCards('daeun-table', daeunRows2, activeDaeunIdx);"
if anchor in html:
    html = html.replace(anchor, anchor + JS_INJECT, 1)
    print("JS OK")
else:
    print("JS anchor not found")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html','w') as f:
    f.write(html)
print("Done")
