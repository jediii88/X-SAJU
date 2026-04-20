"""
Glassmorphism 적용 스크립트
- body 배경: 우주 딥 퍼플/블랙 그라디언트
- 카드/섹션: backdrop-filter blur + 반투명 배경
- 버튼: 유리 질감
- 테두리: 얇은 흰 반투명
"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r') as f:
    html = f.read()

# 1. :root 변수 교체 — 글라스 디자인용
old_root = """:root {
            --bg: #000;
            --panel: #0a0a0a;
            --panel-2: #050505;
            --line: rgba(255,255,255,0.08);
            --line-soft: rgba(255,255,255,0.04);
            --text: rgba(255,255,255,0.96);
            --text-soft: rgba(255,255,255,0.70);
            --text-dim: rgba(255,255,255,0.42);
            --gold: #c7a76a;
            --wood: #52b36a;
            --fire: #d45a52;
            --earth: #c9a24c;
            --metal: #9ea4aa;
            --water: #4e87d9;
        }"""

new_root = """:root {
            --bg: #04040f;
            --panel: rgba(255,255,255,0.04);
            --panel-2: rgba(255,255,255,0.02);
            --line: rgba(255,255,255,0.10);
            --line-soft: rgba(255,255,255,0.05);
            --text: rgba(255,255,255,0.96);
            --text-soft: rgba(255,255,255,0.70);
            --text-dim: rgba(255,255,255,0.42);
            --gold: #c7a76a;
            --gold-glow: rgba(199,167,106,0.25);
            --glass-bg: rgba(255,255,255,0.05);
            --glass-border: rgba(255,255,255,0.12);
            --glass-hover: rgba(255,255,255,0.08);
            --wood: #52b36a;
            --fire: #d45a52;
            --earth: #c9a24c;
            --metal: #9ea4aa;
            --water: #4e87d9;
        }"""

html = html.replace(old_root, new_root)

# 2. body 배경 — 우주 딥 그라디언트
old_body_bg = "            background: var(--bg);\n            color: var(--text);"
new_body_bg = """            background: radial-gradient(ellipse at 30% 20%, #0d0620 0%, #04040f 60%) fixed;
            background-color: #04040f;
            color: var(--text);"""
html = html.replace(old_body_bg, new_body_bg)

# 3. .btn 글라스 버튼
old_btn = """        .btn {
            width: 100%;
            padding: 18px 16px;
            margin-top: 20px;
            border: 1px solid rgba(255,255,255,0.16);
            background: transparent;
            color: var(--text);
            font-size: 15px;
            font-weight: 300;
            letter-spacing: 0.08em;
            cursor: pointer;
        }

        .btn.subtle {
            margin-top: 10px;
            border-color: transparent;
            color: var(--text-dim);
            font-size: 13px;
            letter-spacing: 0.04em;
        }"""

new_btn = """        .btn {
            width: 100%;
            padding: 18px 16px;
            margin-top: 20px;
            border: 1px solid var(--glass-border);
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: var(--text);
            font-size: 15px;
            font-weight: 300;
            letter-spacing: 0.08em;
            cursor: pointer;
            border-radius: 12px;
            transition: background 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            background: var(--glass-hover);
            box-shadow: 0 4px 24px rgba(199,167,106,0.15);
        }

        .btn.subtle {
            margin-top: 10px;
            border-color: transparent;
            background: transparent;
            color: var(--text-dim);
            font-size: 13px;
            letter-spacing: 0.04em;
        }"""

html = html.replace(old_btn, new_btn)

# 4. .section 글라스 카드
old_section = """        .section {
            padding-top: 60px; /* offset for sticky nav */
            margin-top: -22px;
        }

        .section-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--line);
            font-size: 13px;
            color: var(--text-soft);
            font-weight: 400;
            letter-spacing: -0.01em;
        }"""

new_section = """        .section {
            padding-top: 60px; /* offset for sticky nav */
            margin-top: -22px;
        }
        /* 글라스 카드 래퍼 */
        .section > *:not(.section-title) {
            position: relative;
        }
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 12px;
        }

        .section-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--line);
            font-size: 13px;
            color: var(--text-soft);
            font-weight: 400;
            letter-spacing: -0.01em;
        }"""

html = html.replace(old_section, new_section)

# 5. input-group 글라스
old_input_group = "background: var(--panel);"
# 여러 곳 있으니 구체적으로
html = html.replace(
    "        .input-group {\n            padding: 20px 0;\n            border-bottom: 1px solid var(--line);\n        }",
    "        .input-group {\n            padding: 20px 0;\n            border-bottom: 1px solid var(--line);\n        }"
)

# 6. 각종 #111, #1a1a1a, #151515 배경을 글라스로
replacements = [
    ('background: #111;', 'background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);'),
    ('background: #1a1a1a;', 'background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);'),
    ('background: #151515;', 'background: rgba(255,255,255,0.04); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);'),
    ('background: #1e1e1e;', 'background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);'),
    ("background: #111; padding: 20px; border-left: 3px solid var(--gold); margin: 20px 0;",
     "background: rgba(199,167,106,0.07); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 20px; border-left: 3px solid var(--gold); margin: 20px 0; border-radius: 0 8px 8px 0;"),
    ("background: #111; padding: 20px; border-left: 3px solid var(--gold); margin: 20px 0; border-radius: 0 8px 8px 0;",
     "background: rgba(199,167,106,0.07); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 20px; border-left: 3px solid var(--gold); margin: 20px 0; border-radius: 0 8px 8px 0;"),
]
for old, new in replacements:
    html = html.replace(old, new)

# 7. btn-toggle 글라스
old_btn_toggle = """        .btn-toggle {
            flex: 1;
            padding: 8px 4px;
            background: #1a1a1a; color: #666;
            border: 1px solid #333; border-radius: 6px;
            font-size: 13px; cursor: pointer; transition: all 0.2s;
        }
        .btn-toggle.active {
            background: var(--gold); color: #000; font-weight: 600;
        }"""

new_btn_toggle = """        .btn-toggle {
            flex: 1;
            padding: 8px 4px;
            background: rgba(255,255,255,0.05);
            color: var(--text-dim);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            font-size: 13px; cursor: pointer;
            transition: all 0.2s;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        .btn-toggle.active {
            background: rgba(199,167,106,0.2);
            color: var(--gold);
            font-weight: 600;
            border-color: var(--gold);
        }"""

html = html.replace(old_btn_toggle, new_btn_toggle)

# 8. toggle-item 글라스
html = html.replace(
    "        .toggle-item {\n            background: #111;\n            border: 1px solid #2a2a2a;\n            border-radius: 10px;\n            padding: 12px 14px;\n        }",
    "        .toggle-item {\n            background: var(--glass-bg);\n            backdrop-filter: blur(12px);\n            -webkit-backdrop-filter: blur(12px);\n            border: 1px solid var(--glass-border);\n            border-radius: 12px;\n            padding: 14px 16px;\n        }"
)

# 9. axe-advice 글라스
html = html.replace(
    ".axe-advice { background: #111; padding: 18px; border-radius: 8px; border-left: 3px solid var(--gold);",
    ".axe-advice { background: rgba(199,167,106,0.07); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 18px; border-radius: 8px; border-left: 3px solid var(--gold);"
)

# 10. report-chapter 글라스
html = html.replace(
    "        .report-chapter { margin-bottom: 40px; }",
    "        .report-chapter { margin-bottom: 40px; background: var(--glass-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--glass-border); border-radius: 16px; padding: 24px; }"
)

# 11. inline-interp 글라스
html = html.replace(
    "        .inline-interp {\n            background: linear-gradient(135deg, #0d0d1a 0%, #12121f 100%);\n            border: 1px solid rgba(199,167,106,0.3);\n            border-left: 3px solid var(--gold);\n            border-radius: 8px;\n            padding: 20px 22px;\n            margin: 8px 0 16px;\n        }",
    "        .inline-interp {\n            background: rgba(199,167,106,0.06);\n            backdrop-filter: blur(16px);\n            -webkit-backdrop-filter: blur(16px);\n            border: 1px solid rgba(199,167,106,0.2);\n            border-left: 3px solid var(--gold);\n            border-radius: 12px;\n            padding: 20px 22px;\n            margin: 8px 0 16px;\n        }"
)

# 12. jeomsin-nav 글라스
html = html.replace(
    "        .jeomsin-nav {\n            display: flex;\n            gap: 0;\n            background: #111;\n            border-radius: 10px;\n            padding: 4px;\n            margin-bottom: 24px;\n            position: sticky;\n            top: 0;\n            z-index: 100;\n        }",
    "        .jeomsin-nav {\n            display: flex;\n            gap: 0;\n            background: rgba(10,10,20,0.7);\n            backdrop-filter: blur(20px);\n            -webkit-backdrop-filter: blur(20px);\n            border: 1px solid var(--glass-border);\n            border-radius: 12px;\n            padding: 4px;\n            margin-bottom: 24px;\n            position: sticky;\n            top: 0;\n            z-index: 100;\n        }"
)

# 13. container 글라스 (있으면)
html = html.replace(
    "        .container {\n            max-width: 480px;\n            margin: 0 auto;\n            padding: 32px 20px 80px;\n        }",
    "        .container {\n            max-width: 480px;\n            margin: 0 auto;\n            padding: 32px 20px 80px;\n            position: relative;\n            z-index: 1;\n        }"
)

# 14. loading 글라스
html = html.replace(
    "        .loading {\n            position: fixed; inset: 0;\n            background: rgba(0,0,0,0.95);",
    "        .loading {\n            position: fixed; inset: 0;\n            background: rgba(4,4,15,0.92);\n            backdrop-filter: blur(20px);\n            -webkit-backdrop-filter: blur(20px);"
)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w') as f:
    f.write(html)

print("글라스모피즘 적용 완료!")
print(f"파일 크기: {len(html):,} bytes")
