with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    html = f.read()

old_graph = '''            const W = svg.parentElement ? svg.parentElement.clientWidth || 320 : 320;
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
            const ap = pts.map((p,i)=>(i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`)).join(\' \')+` L${pts[n-1].x},${H-PB} L${pts[0].x},${H-PB} Z`;
            s += `<path d="${ap}" fill="url(#gg)"/>`;
            const lp = pts.map((p,i)=>(i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`)).join(\' \');
            s += `<path d="${lp}" fill="none" stroke="#c8941c" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
            pts.forEach((p,i)=>{
                const act = i===activeDaeunIdx;
                const col = p.score>=1?\'#00C853\':p.score<=-1?\'#e74c3c\':\'#c8941c\';
                s += `<circle cx="${p.x}" cy="${p.y}" r="${act?7:5}" fill="${col}" stroke="#000" stroke-width="${act?2:1}"/>`;
                s += `<text x="${p.x}" y="${H-PB+14}" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.5)">${p.age}세</text>`;
                if(act) s += `<text x="${p.x}" y="${p.y-10}" text-anchor="middle" font-size="9" fill="${col}">${p.gz[0]}${p.gz[1]}</text>`;
            });
            svg.innerHTML = s;
            svg.setAttribute(\'width\', W);
            svg.setAttribute(\'height\', H);'''

new_graph = '''            const W = svg.parentElement ? svg.parentElement.clientWidth || 340 : 340;
            const H=240, PL=36,PR=20,PT=30,PB=55, gW=W-PL-PR, gH=H-PT-PB, step=gW/(n-1||1);
            const pts = rows.map((dy,i)=>({
                x: PL+i*step,
                y: PT+gH-((scores[i]-minS)/range)*gH,
                age: dy.getStartAge(),
                gz: dy.getGanZhi(),
                score: scores[i]
            }));
            const midY = PT+gH-((0-minS)/range)*gH;
            // 부드러운 베지어 곡선
            function bezierPath(points) {
                if(points.length < 2) return \'\';
                let d = `M${points[0].x},${points[0].y}`;
                for(let i=1; i<points.length; i++) {
                    const px = points[i-1]; const nx = points[i];
                    const cx = (px.x+nx.x)/2;
                    d += ` C${cx},${px.y} ${cx},${nx.y} ${nx.x},${nx.y}`;
                }
                return d;
            }
            const linePath = bezierPath(pts);
            const fillPath = linePath + ` L${pts[n-1].x},${H-PB} L${pts[0].x},${H-PB} Z`;
            let s = `<defs>
                <linearGradient id="gg-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#c8941c" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#c8941c" stop-opacity="0.02"/>
                </linearGradient>
                <filter id="dot-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="line-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>`;
            // 배경 그리드 라인
            for(let yi=0; yi<=4; yi++) {
                const gy = PT + (gH/4)*yi;
                s += `<line x1="${PL}" y1="${gy}" x2="${W-PR}" y2="${gy}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
            }
            // Y축 레이블
            s += `<text x="${PL-8}" y="${PT+5}" text-anchor="end" font-size="10" fill="rgba(199,167,106,0.6)">吉</text>`;
            s += `<text x="${PL-8}" y="${H-PB+4}" text-anchor="end" font-size="10" fill="rgba(180,80,80,0.6)">凶</text>`;
            // 중앙 기준선
            s += `<line x1="${PL}" y1="${midY}" x2="${W-PR}" y2="${midY}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-dasharray="6,4"/>`;
            s += `<text x="${PL-8}" y="${midY+4}" text-anchor="end" font-size="9" fill="rgba(255,255,255,0.3)">中</text>`;
            // 영역 채우기
            s += `<path d="${fillPath}" fill="url(#gg-fill)"/>`;
            // 곡선 라인 (글로우)
            s += `<path d="${linePath}" fill="none" stroke="rgba(199,167,106,0.4)" stroke-width="5" stroke-linecap="round"/>`;
            s += `<path d="${linePath}" fill="none" stroke="rgba(199,167,106,0.95)" stroke-width="2.5" stroke-linecap="round" filter="url(#line-glow)"/>`;
            // 점 + 레이블
            pts.forEach((p,i)=>{
                const act = i===activeDaeunIdx;
                const col = p.score>=1?\'#00C853\':p.score<=-1?\'#e74c3c\':\'#c8941c\';
                const gz = p.gz;
                // 현재 대운 halo
                if(act) {
                    s += `<circle cx="${p.x}" cy="${p.y}" r="18" fill="${col}" opacity="0.10"/>`;
                    s += `<circle cx="${p.x}" cy="${p.y}" r="12" fill="${col}" opacity="0.15"/>`;
                }
                s += `<circle cx="${p.x}" cy="${p.y}" r="${act?9:6}" fill="${col}" stroke="rgba(0,0,0,0.9)" stroke-width="2.5" filter="url(#dot-glow)"/>`;
                // 간지 (점 위)
                s += `<text x="${p.x}" y="${p.y-(act?16:13)}" text-anchor="middle" font-size="${act?12:10}" font-weight="700" fill="${col}">${gz[0]}${gz[1]}</text>`;
                // 나이 (아래)
                s += `<text x="${p.x}" y="${H-PB+18}" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.65)">${p.age}세</text>`;
                // 현재 표시
                if(act) s += `<text x="${p.x}" y="${H-PB+32}" text-anchor="middle" font-size="10" font-weight="700" fill="${col}">▶ 현재</text>`;
            });
            svg.innerHTML = s;
            svg.setAttribute(\'width\', W);
            svg.setAttribute(\'height\', H);'''

if old_graph in html:
    html = html.replace(old_graph, new_graph)
    print("그래프 교체 성공")
else:
    print("패턴 불일치 — 수동 확인 필요")

# SVG 높이도 240으로 업데이트
html = html.replace(
    '<svg id="daeun-graph-svg" width="100%" height="220" style="min-width:300px;"></svg>',
    '<svg id="daeun-graph-svg" width="100%" height="240" style="min-width:320px;"></svg>'
)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w') as f:
    f.write(html)

print("완료")
