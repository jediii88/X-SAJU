"""
문제 수정:
1. 인라인 summary div를 각 섹션 '안쪽 끝'에 넣기 (현재 섹션 밖에 있음)
2. 섹션 간 여백 확보
3. report-container에 Chapter 1~9 내용 복원 (기존처럼 전체 풀이도 아래에 유지)
"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ── 1. manse-inline-summary를 sec-manse 안으로 이동 ──
# 현재: 섹션 닫힌 뒤에 div가 있음
# 목표: 섹션 안 manse-table 아래

# 기존 잘못된 위치 제거
html = html.replace(
    '\n                <div id="manse-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-relation">',
    '\n        <div class="section" id="sec-relation">'
)

# sec-manse 안에 삽입 (manse-table 바로 뒤)
html = html.replace(
    '            <div class="manse-table" id="manse-table"></div>\n        </div>\n',
    '            <div class="manse-table" id="manse-table"></div>\n            <div id="manse-inline-summary" class="section-interp" style="display:none;"></div>\n        </div>\n'
)

# ── 2. relation-inline-summary를 sec-relation 안으로 ──
html = html.replace(
    '\n        <div id="relation-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-shinsal">',
    '\n        <div class="section" id="sec-shinsal">'
)
html = html.replace(
    '            <div class="rel-grid" id="relation-grid"></div>\n        </div>\n',
    '            <div class="rel-grid" id="relation-grid"></div>\n            <div id="relation-inline-summary" class="section-interp" style="display:none;"></div>\n        </div>\n'
)

# ── 3. shinsal-inline-summary를 sec-shinsal 안으로 ──
html = html.replace(
    '\n        <div id="shinsal-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div id="wuxing-inline-summary"',
    '\n        <div id="wuxing-inline-summary"'
)
html = html.replace(
    '            <div class="pill-grid" id="shinsal-grid"></div>\n        </div>\n',
    '            <div class="pill-grid" id="shinsal-grid"></div>\n            <div id="shinsal-inline-summary" class="section-interp" style="display:none;"></div>\n        </div>\n'
)

# ── 4. wuxing-inline-summary를 sec-wuxing 안으로 ──
html = html.replace(
    '\n        <div id="wuxing-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section">',
    '\n        <div class="section">'
)
html = html.replace(
    '            <div class="bar-group" id="wuxing-bars"></div>\n        </div>\n',
    '            <div class="bar-group" id="wuxing-bars"></div>\n            <div id="wuxing-inline-summary" class="section-interp" style="display:none;"></div>\n        </div>\n'
)

# ── 5. sipseong-inline-summary: 십성 섹션 안으로 ──
# 기존 위치 확인 후 처리
html = html.replace(
    '<div id="sipseong-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-yonghee">',
    '<div class="section" id="sec-yonghee">'
)
# 십성 bars 뒤에 추가
html = html.replace(
    '            <div class="bar-group" id="sip-bars"></div>\n        </div>\n        <div class="section" id="sec-yonghee">',
    '            <div class="bar-group" id="sip-bars"></div>\n            <div id="sipseong-inline-summary" class="section-interp" style="display:none;"></div>\n        </div>\n        <div class="section" id="sec-yonghee">'
)

# ── 6. yong-inline-summary를 sec-yonghee 안으로 ──
html = html.replace(
    '<div id="yong-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-fortune">',
    '<div class="section" id="sec-fortune">'
)
# 용신 섹션 끝에 추가
html = html.replace(
    '            <div class="yong-cards" id="yong-cards"></div>\n        </div>\n        <div class="section" id="sec-fortune">',
    '            <div class="yong-cards" id="yong-cards"></div>\n            <div id="yong-inline-summary" class="section-interp" style="display:none;"></div>\n        </div>\n        <div class="section" id="sec-fortune">'
)

# ── 7. strength-inline-summary를 sec-fortune 안으로 ──
html = html.replace(
    '            <div id="gauge-percent"',
    '            <div id="gauge-percent"'
)
# gauge 컨테이너 뒤에 삽입 (strength-inline-summary 현재 위치 수정)
# 기존 위치 유지 (injectInlineSummaries에서 이미 이 id를 쓰고 있음)

# ── 8. lifecycle-inline-summary를 sec-lifecycle 안으로 ──
html = html.replace(
    '<div id="lifecycle-inline-summary" style="display:none; margin:0 0 8px 0;"></div>\n        <div class="section" id="sec-category">',
    '<div class="section" id="sec-category">'
)
html = html.replace(
    '            <div id="lifecycle-cards"></div>\n        </div>\n        <div class="section" id="sec-category">',
    '            <div id="lifecycle-cards"></div>\n            <div id="lifecycle-inline-summary" class="section-interp" style="display:none;"></div>\n        </div>\n        <div class="section" id="sec-category">'
)

# ── 9. section-interp CSS 추가 ──
interp_css = """
        /* 섹션 내 해석 박스 */
        .section-interp {
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.07);
        }
        .inline-interp {
            padding: 20px;
            background: rgba(199,167,106,0.05);
            border-radius: 10px;
            margin-bottom: 4px;
        }
        .ii-label {
            font-size: 10px;
            letter-spacing: 2px;
            color: var(--gold);
            margin-bottom: 8px;
        }
        .ii-title {
            font-size: 17px;
            font-weight: 700;
            color: #fff;
            font-family: 'Noto Serif KR', serif;
            margin-bottom: 12px;
            line-height: 1.5;
        }
        .ii-text {
            font-size: 14px;
            line-height: 1.9;
            color: #ccc;
            word-break: keep-all;
        }
        .ii-text p { margin-bottom: 12px; }
        .ii-text b { color: var(--gold); }
"""

html = html.replace(
    '        /* 분야별 운세 카드 */',
    interp_css + '\n        /* 분야별 운세 카드 */'
)

# ── 10. generateDeepReport 복원: 하단에 Chapter 1~9도 출력 ──
old_bottom = (
    "    // ── 하단 심층 리포트 (대운/세운/월운 + 개운법) ──\n"
    "    let bottomHtml = '';\n"
    "    bottomHtml += buildChapterPersonality(data);"
)
new_bottom = (
    "    // ── 하단 심층 리포트: 성격 + 원국 통합 해석 + 대운/세운/월운 ──\n"
    "    let bottomHtml = '';\n"
    "    bottomHtml += buildChapterPersonality(data);\n"
    "    bottomHtml += buildSectionHeader('원국 종합 해석');\n"
    "    bottomHtml += buildChapter1_Basic(data);\n"
    "    bottomHtml += buildChapter2_Wuxing(data);\n"
    "    bottomHtml += buildChapter3_Sipseong(data);\n"
    "    bottomHtml += buildSectionHeader('재물 · 직업 · 애정 · 건강');\n"
    "    bottomHtml += buildChapter4_Wealth(data);\n"
    "    bottomHtml += buildChapter5_Career(data);\n"
    "    bottomHtml += buildChapter6_Love(data);\n"
    "    bottomHtml += buildChapter7_Hidden(data);\n"
    "    bottomHtml += buildChapter8_Health(data);\n"
    "    bottomHtml += buildChapter9_Remedy(data);"
)

if old_bottom in html:
    html = html.replace(old_bottom, new_bottom)
    print("generateDeepReport 복원 성공")
else:
    print("generateDeepReport 패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"완료 | {len(html):,} bytes")
