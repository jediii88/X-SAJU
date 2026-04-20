"""
전체 레이아웃 재설계
1. runAnalysis 완료 → 자동으로 전체 리포트 생성 (버튼 제거)
2. "심층 사주풀이 시작" 버튼 섹션 제거
3. step-2에서 바로 완전한 리포트 출력
4. 분야별 운세 탭 → 섹션으로 전환 (건강/재물/직업/애정 항상 펼침)
5. 플로팅 목차 네비게이터 추가 (웹 전용, PDF 숨김)
"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    html = f.read()

# ── 1. go(2) → go(2) + 자동 리포트 생성 ──
html = html.replace(
    '        go(2);\n    });\n}\n</script>',
    '        go(2);\n        // 계산 완료 즉시 전체 리포트 자동 생성\n        setTimeout(() => {\n            generateDeepReport(globalSajuData);\n            const reportFull = document.getElementById(\'sec-report-full\');\n            if(reportFull) reportFull.style.display = \'block\';\n            const reportSec = document.getElementById(\'sec-report\');\n            if(reportSec) reportSec.style.display = \'none\';\n            // 플로팅 목차 표시\n            const toc = document.getElementById(\'floating-toc\');\n            if(toc) toc.style.display = \'block\';\n        }, 100);\n    });\n}\n</script>'
)

# ── 2. 분야별 운세 탭 → 섹션 펼침으로 교체 ──
old_cat_section = '''        <div class="section" id="sec-category">
            <div class="section-title"><div class="title-left"><span>분야별 운세</span></div><span>건강 · 재물 · 직업 · 애정</span></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
                <button class="cat-tab active" onclick="showCat('health')">🫀 건강</button>
                <button class="cat-tab" onclick="showCat('wealth')">💰 재물</button>
                <button class="cat-tab" onclick="showCat('career')">🏆 직업</button>
                <button class="cat-tab" onclick="showCat('love')">❤️ 애정</button>
            </div>
            <div id="cat-health" class="cat-content"></div>
            <div id="cat-wealth" class="cat-content" style="display:none;"></div>
            <div id="cat-career" class="cat-content" style="display:none;"></div>
            <div id="cat-love" class="cat-content" style="display:none;"></div>
        </div>'''

new_cat_section = '''        <!-- 분야별 운세: 탭 제거, 섹션으로 펼침 (PDF 완전 출력) -->
        <div class="section" id="sec-category">
            <div class="section-title"><div class="title-left"><span id="toc-anchor-cat">분야별 심층 운세</span></div><span>건강 · 재물 · 직업 · 애정</span></div>
            <div id="cat-health" class="cat-content cat-section"></div>
            <div id="cat-wealth" class="cat-content cat-section"></div>
            <div id="cat-career" class="cat-content cat-section"></div>
            <div id="cat-love" class="cat-content cat-section"></div>
        </div>'''

html = html.replace(old_cat_section, new_cat_section)

# ── 3. showCat 함수 제거 (탭 방식 로직 무효화) ──
# cat-content display:none 해제 CSS 추가 (기존 .cat-content { display:none } 있으면 제거)
html = html.replace(
    '.cat-content { display: none; }',
    '.cat-content { display: block; }'
)
# 없을 경우 대비 cat-section 클래스 추가
if '.cat-section' not in html:
    html = html.replace(
        '        .report-chapter {',
        '        .cat-section { display: block !important; margin-bottom: 20px; }\n        .report-chapter {'
    )

# ── 4. sec-report (버튼) 숨기기 + sec-report-full 항상 준비 ──
# 버튼 섹션 레이블 변경 (완전 제거 대신 숨김)
html = html.replace(
    '<div class="section" id="sec-report" style="margin-top: 30px; text-align: center; padding-bottom: 40px;">',
    '<div class="section" id="sec-report" style="display:none;">'
)

# ── 5. 플로팅 목차 네비게이터 추가 ──
# body 시작 직후에 추가
floating_toc = '''
<!-- 플로팅 목차 네비게이터 (웹 전용, PDF 숨김) -->
<div id="floating-toc" style="display:none; position:fixed; right:12px; top:50%; transform:translateY(-50%); z-index:9999; background:rgba(0,0,0,0.75); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-radius:14px; padding:10px 6px; box-shadow:0 8px 32px rgba(0,0,0,0.6); max-width:44px; overflow:hidden; transition:max-width 0.3s, padding 0.3s;" onmouseenter="expandToc()" onmouseleave="collapseToc()">
    <div style="font-size:10px; color:rgba(199,167,106,0.8); text-align:center; margin-bottom:8px; letter-spacing:1px; white-space:nowrap;">☰</div>
    <div id="toc-links" style="display:flex; flex-direction:column; gap:4px; min-width:120px;">
        <a onclick="tocGo('sec-manse')" class="toc-link">사주원국</a>
        <a onclick="tocGo('sec-relation')" class="toc-link">합·충·형</a>
        <a onclick="tocGo('sec-wuxing')" class="toc-link">오행 분석</a>
        <a onclick="tocGo('sec-fortune')" class="toc-link">신강신약</a>
        <a onclick="tocGo('sec-daeun-graph')" class="toc-link">인생 그래프</a>
        <a onclick="tocGo('sec-lifecycle')" class="toc-link">시기별 운</a>
        <a onclick="tocGo('sec-category')" class="toc-link">분야별 운세</a>
        <a onclick="tocGo('sec-report-full')" class="toc-link">심층 풀이</a>
        <div style="border-top:1px solid rgba(255,255,255,0.1); margin:4px 0;"></div>
        <a onclick="window.print()" class="toc-link" style="color:rgba(199,167,106,0.9);">🖨 PDF 저장</a>
    </div>
</div>
<style>
.toc-link {
    font-size:12px; color:rgba(255,255,255,0.7); cursor:pointer;
    padding:5px 10px; border-radius:6px; white-space:nowrap;
    display:block; transition:background 0.15s, color 0.15s;
    text-decoration:none;
}
.toc-link:hover { background:rgba(199,167,106,0.15); color:var(--gold); }
#floating-toc #toc-links { opacity:0; transition:opacity 0.2s; pointer-events:none; }
#floating-toc:hover #toc-links { opacity:1; pointer-events:all; }
@media print {
    #floating-toc { display:none !important; }
    .cat-section, .cat-content { display:block !important; page-break-inside:avoid; }
}
</style>
<script>
function tocGo(id) {
    var el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}
function expandToc() {
    var t = document.getElementById('floating-toc');
    t.style.maxWidth = '160px';
    t.style.padding = '10px 8px';
}
function collapseToc() {
    var t = document.getElementById('floating-toc');
    t.style.maxWidth = '44px';
    t.style.padding = '10px 6px';
}
</script>
'''

html = html.replace('<canvas id="star-canvas"></canvas>', floating_toc + '<canvas id="star-canvas"></canvas>')

# ── 6. sec-report-full 상단에 목차 표 추가 ──
old_report_inline_top = '''        <div id="report-inline-top" style="text-align:center; padding: 30px 0 10px;">
                <div style="font-size:11px; letter-spacing:3px; color:var(--text-soft); margin-bottom:6px;">X · S A J U · R E P O R T</div>
                <div style="font-size:22px; font-weight:800; color:var(--gold); font-family:'Noto Serif KR',serif;">당신의 운명 서사</div>
            </div>'''

new_report_inline_top = '''        <div id="report-inline-top" style="text-align:center; padding: 30px 0 10px;">
                <div style="font-size:11px; letter-spacing:3px; color:var(--text-soft); margin-bottom:6px;">X · S A J U · R E P O R T</div>
                <div style="font-size:22px; font-weight:800; color:var(--gold); font-family:'Noto Serif KR',serif;">당신의 운명 서사</div>
                <!-- 목차 -->
                <div style="margin:24px 0 10px; text-align:left; background:rgba(199,167,106,0.06); border-radius:12px; padding:18px 20px;">
                    <div style="font-size:11px; letter-spacing:2px; color:var(--gold); margin-bottom:12px;">C O N T E N T S</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 16px;">
                        <div class="toc-item" onclick="tocGo('sec-manse')">I. 사주원국 · 팔자</div>
                        <div class="toc-item" onclick="tocGo('sec-wuxing')">II. 오행 분포 분석</div>
                        <div class="toc-item" onclick="tocGo('sec-fortune')">III. 신강신약 판정</div>
                        <div class="toc-item" onclick="tocGo('sec-yonghee')">IV. 용신 · 기신</div>
                        <div class="toc-item" onclick="tocGo('sec-daeun-graph')">V. 인생 흐름 그래프</div>
                        <div class="toc-item" onclick="tocGo('sec-lifecycle')">VI. 시기별 운세</div>
                        <div class="toc-item" onclick="tocGo('sec-category')">VII. 건강 · 재물 · 직업 · 애정</div>
                        <div class="toc-item" onclick="tocGo('report-container')">VIII. 심층 운명 서사</div>
                    </div>
                </div>
            </div>
            <style>
            .toc-item { font-size:13px; color:rgba(255,255,255,0.7); padding:6px 0; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.06); transition:color 0.15s; }
            .toc-item:hover { color:var(--gold); }
            @media print { .toc-item { cursor:default; color:#333; border-bottom:1px solid #eee; } }
            </style>'''

html = html.replace(old_report_inline_top, new_report_inline_top)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w') as f:
    f.write(html)

print(f"레이아웃 재설계 완료 | {len(html):,} bytes")
