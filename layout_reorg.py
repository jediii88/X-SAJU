"""
레이아웃 통합 재구성 스크립트
- step-2와 step-3를 하나의 통합 리포트로 합침
- 만세력 섹션 아래에 바로 풀이가 붙는 구조
- 기존 내용 삭제 없이 재배치만
"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    html = f.read()

# 1. startReport 함수를 수정: go(3) 대신 인라인 주입 방식으로
# generateDeepReport가 각 섹션에 직접 주입하도록 변경

old_startReport = '''function startReport() {
    showLoading('당신의 운명 데이터를 분석하여\\n서사를 구축하고 있습니다...', () => {
        generateDeepReport(globalSajuData);
        go(3);
    });
}
// generateDeepReport is now imported from report_engine.js'''

new_startReport = '''function startReport() {
    showLoading('당신의 운명 데이터를 분석하여\\n서사를 구축하고 있습니다...', () => {
        generateDeepReport(globalSajuData);
        // 버튼 영역 숨기고 리포트 섹션 표시
        const reportSec = document.getElementById('sec-report');
        if(reportSec) reportSec.style.display = 'none';
        const reportFull = document.getElementById('sec-report-full');
        if(reportFull) reportFull.style.display = 'block';
        // 부드럽게 스크롤
        setTimeout(() => {
            const t = document.getElementById('report-inline-top');
            if(t) t.scrollIntoView({behavior:'smooth'});
        }, 100);
    });
}'''

html = html.replace(old_startReport, new_startReport)

# 2. step-3 전체를 없애고 step-2 안에 인라인 리포트 섹션 추가
# "심층 사주풀이 시작" 버튼 섹션(sec-report) 아래에 인라인 리포트 div 추가

old_report_section = '''        <div class="section" id="sec-report" style="margin-top: 30px; text-align: center; padding-bottom: 40px;">
            <div style="margin-bottom: 20px; font-size: 15px; color: var(--gold); font-weight: 700;">내 사주의 진짜 이야기 — 지금 풀어드립니다</div>
            <button class="btn" style="background: var(--gold); color: #000; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(199, 167, 106, 0.4);" onclick="startReport()">심층 사주풀이 시작</button>
        </div>

        <button class="btn subtle" onclick="go(1)">입력 정보 수정</button>

    </div>

    <!-- STEP 3: 심층 리포트 (Deep Interpretation) -->
    <div id="step-3" class="page" style="padding-bottom:50px;">
        <div class="logo">X-SAJU <span>REPORT</span></div>
        <div style="text-align:center; color:var(--text-soft); font-size:13px; margin-bottom:30px; letter-spacing:1px;">본격적인 운명의 서사가 펼쳐집니다.</div>
        
        <div id="report-container" style="background:var(--card-bg); padding:24px; border-radius:12px; border:1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <!-- 리포트 내용 동적 렌더링 -->
        </div>

        <button class="btn subtle" onclick="go(2)" style="margin-top:30px;">만세력으로 돌아가기</button>
    </div>'''

new_report_section = '''        <div class="section" id="sec-report" style="margin-top: 30px; text-align: center; padding-bottom: 40px;">
            <div style="margin-bottom: 8px; font-size: 15px; color: var(--gold); font-weight: 700;">내 사주의 진짜 이야기 — 지금 풀어드립니다</div>
            <div style="margin-bottom: 20px; font-size: 13px; color: var(--text-soft);">만세력 데이터를 기반으로 당신의 운명을 한 편의 서사로 펼쳐드립니다</div>
            <button class="btn" style="background: var(--gold); color: #000; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(199, 167, 106, 0.4);" onclick="startReport()">✦ 심층 사주풀이 시작</button>
        </div>

        <!-- 인라인 통합 리포트 (버튼 클릭 후 이 자리에 펼쳐짐) -->
        <div id="sec-report-full" style="display:none; padding-bottom:60px;">
            <div id="report-inline-top" style="text-align:center; padding: 30px 0 10px;">
                <div style="font-size:11px; letter-spacing:3px; color:var(--text-soft); margin-bottom:6px;">X · S A J U · R E P O R T</div>
                <div style="font-size:22px; font-weight:800; color:var(--gold); font-family:'Noto Serif KR',serif;">당신의 운명 서사</div>
            </div>
            <div id="report-container" style="padding:0; border-radius:0; background:transparent; border:none; box-shadow:none;">
                <!-- 리포트 내용 동적 렌더링 -->
            </div>
            <div style="text-align:center; margin-top:40px; padding-top:20px; border-top:1px solid var(--border);">
                <button class="btn subtle" onclick="window.print()">🖨️ PDF로 저장</button>
            </div>
        </div>

        <button class="btn subtle" onclick="go(1)" style="margin-bottom:30px;">입력 정보 수정</button>

    </div>'''

html = html.replace(old_report_section, new_report_section)

# 3. generateDeepReport 함수에서 각 섹션별 인라인 풀이를 해당 섹션 바로 아래에 주입하도록 수정
# 현재: report-container에 전체 HTML을 한번에 주입
# 변경: report-container를 유지하되, 추가로 각 섹션 ID 아래에 풀이 박스도 주입

old_generate = '''    document.getElementById('report-container').innerHTML = html;
}'''

new_generate = '''    // 메인 리포트 컨테이너에 전체 내용 주입
    document.getElementById('report-container').innerHTML = html;
    
    // 각 만세력 섹션 아래 인라인 풀이 주입
    injectInlineSummaries(data);
}

function injectInlineSummaries(data) {
    // 1. 사주원국 섹션 아래 - 일주 핵심 서사
    const manseInline = document.getElementById('manse-inline-summary');
    if(manseInline && data.dayStem && data.dayBranch) {
        const iljuKey = data.dayStem + data.dayBranch;
        const db = window.SAJU_DB?.ILJU?.[iljuKey] || {};
        const title = db.title || (iljuKey + '의 기운');
        const core = db.core || '당신만의 특별한 에너지가 사주원국에 담겨 있습니다.';
        manseInline.innerHTML = `
            <div class="inline-interp">
                <div class="ii-label">✦ 일주 해석</div>
                <div class="ii-title">${title}</div>
                <div class="ii-text">${core}</div>
            </div>`;
        manseInline.style.display = 'block';
    }
    // 2. 오행 섹션 아래 - 오행 해석
    const wuxingInline = document.getElementById('wuxing-inline-summary');
    if(wuxingInline && data.wuxing) {
        const maxW = Object.keys(data.wuxing).reduce((a,b) => data.wuxing[a] > data.wuxing[b] ? a : b);
        const excessText = window.SAJU_DB?.WUXING_EXCESS?.[maxW] || '';
        const ohKr = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'}[maxW];
        wuxingInline.innerHTML = `
            <div class="inline-interp">
                <div class="ii-label">✦ 오행 해석</div>
                <div class="ii-title">${ohKr} 기운의 지배</div>
                <div class="ii-text">${excessText}</div>
            </div>`;
        wuxingInline.style.display = 'block';
    }
    // 3. 신강신약 섹션 아래 - 신강/신약 해석
    const strengthInline = document.getElementById('strength-inline-summary');
    if(strengthInline && data.strengthText) {
        const isStrong = data.strengthText.includes('신강') || data.strengthText.includes('강');
        strengthInline.innerHTML = `
            <div class="inline-interp">
                <div class="ii-label">✦ 신강·신약 해석</div>
                <div class="ii-title">${data.strengthText}</div>
                <div class="ii-text">${isStrong 
                    ? '기운이 충만한 당신은 주도적으로 세상을 이끌어가는 자리에 있어야 진정한 능력을 발휘합니다. 남 밑에 있으면 에너지가 억눌려 오히려 손해입니다. 내 판을 직접 짜는 창업, 프리랜서, 전문직에서 빛을 발합니다.'
                    : '기운이 다소 약한 당신은 혼자 모든 것을 짊어지기보다 훌륭한 파트너와 팀을 구성할 때 1+1이 10이 되는 폭발적인 시너지를 경험합니다. 좋은 귀인을 곁에 두는 것이 인생 전략의 핵심입니다.'
                }</div>
            </div>`;
        strengthInline.style.display = 'block';
    }
}'''

html = html.replace(old_generate, new_generate)

# 4. 만세력 섹션들 내부에 인라인 풀이 div 삽입
# sec-manse 끝에 manse-inline-summary 추가
html = html.replace(
    '<div class="section" id="sec-relation">',
    '<div id="manse-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-relation">'
)

# sec-wuxing 끝(오행) 뒤에 오행 인라인 삽입 - 십성 섹션 앞에
html = html.replace(
    '<div class="section">\n            <div class="section-title"><div class="title-left"><span>십성 분포</span>',
    '<div id="wuxing-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section">\n            <div class="section-title"><div class="title-left"><span>십성 분포</span>'
)

# sec-fortune(신강신약) 끝에 신강신약 인라인 삽입 - 대운 섹션 앞에
html = html.replace(
    '<div class="section">\n            <div class="section-title"><div class="title-left"><span>대운</span>',
    '<div id="strength-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section">\n            <div class="section-title"><div class="title-left"><span>대운</span>'
)

# 5. 인라인 해석 CSS 추가
old_css_end = '        .report-chapter { margin-bottom: 40px; }'
new_css = '''        .report-chapter { margin-bottom: 40px; }
        
        /* 인라인 해석 박스 */
        .inline-interp {
            background: linear-gradient(135deg, #0d0d1a 0%, #12121f 100%);
            border: 1px solid rgba(199,167,106,0.3);
            border-left: 3px solid var(--gold);
            border-radius: 8px;
            padding: 20px 22px;
            margin: 8px 0 16px;
        }
        .ii-label {
            font-size: 11px;
            letter-spacing: 2px;
            color: var(--gold);
            margin-bottom: 8px;
            font-weight: 700;
        }
        .ii-title {
            font-size: 17px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 10px;
            font-family: 'Noto Serif KR', serif;
        }
        .ii-text {
            font-size: 14px;
            line-height: 1.8;
            color: #ccc;
            word-break: keep-all;
        }
        
        /* 별 파티클 배경 */
        #star-canvas {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.5;
        }
        .container { position: relative; z-index: 1; }
        
        /* 성운 배경 */
        body::before {
            content: '';
            position: fixed;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: 
                radial-gradient(ellipse at 20% 20%, rgba(88,28,220,0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(28,88,220,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(140,60,255,0.04) 0%, transparent 60%);
            pointer-events: none;
            z-index: 0;
            animation: nebula-shift 20s ease-in-out infinite alternate;
        }
        @keyframes nebula-shift {
            0% { transform: translate(0,0) scale(1); }
            100% { transform: translate(2%,2%) scale(1.05); }
        }
        
        /* 글로우 효과 */
        .brand, .logo { text-shadow: 0 0 20px rgba(199,167,106,0.4); }
        .btn:not(.subtle) { box-shadow: 0 4px 20px rgba(199,167,106,0.2); }
        .section-title span:first-child { text-shadow: 0 0 10px rgba(199,167,106,0.2); }
        
        /* PDF 출력 스타일 */
        @media print {
            #star-canvas, body::before { display: none !important; }
            body { background: #fff !important; color: #111 !important; }
            .container { max-width: 100% !important; }
            .jeomsin-nav, .btn, #sec-report { display: none !important; }
            .section { break-inside: avoid; border: 1px solid #ddd !important; background: #fff !important; }
            .inline-interp { background: #f9f9f9 !important; border-color: #999 !important; }
            .ii-text, .ch-text { color: #333 !important; }
            .ii-title, .ch-title { color: #111 !important; }
            .section-title span { color: #111 !important; }
        }'''

html = html.replace(old_css_end, new_css)

# 6. 별 파티클 캔버스와 JS를 body 시작 부분에 추가
old_body_start = '<div class="loading" id="loading">'
new_body_start = '''<canvas id="star-canvas"></canvas>
<script>
// 별 파티클 애니메이션
(function() {
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    function initStars() {
        stars = [];
        for(let i = 0; i < 160; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.2 + 0.2,
                alpha: Math.random(),
                speed: Math.random() * 0.003 + 0.001,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = Date.now() * 0.001;
        stars.forEach(s => {
            const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255,248,220,${a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    window.addEventListener('resize', () => { resize(); initStars(); });
    resize();
    initStars();
    draw();
})();
</script>

<div class="loading" id="loading">'''

html = html.replace(old_body_start, new_body_start)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w') as f:
    f.write(html)

print("레이아웃 재구성 완료!")
print(f"파일 크기: {len(html):,} bytes")
