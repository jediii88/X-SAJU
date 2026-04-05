import sys
import os
import json
sys.path.append(os.getcwd())
from x_saju.generate_full_report import FullReportGenerator

# 1. Generate the actual report HTML
user = {'name': '장경현'}
birth_data = {'year': 1988, 'month': 3, 'day': 12, 'hour': 1, 'minute': 4}

gen = FullReportGenerator(user, birth_data)
report_html = gen.generate_full_report()

# 2. Extract only the pages (content inside body) to embed
# report_html has <html>, <head>, <body>...
# We want to put it in a container that we hide/show.
pages_content = report_html.split('<body>')[1].split('</body>')[0]
styles = report_html.split('<style>')[1].split('</style>')[0]

portal_html = f"""
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>X-SAJU CLOUD PORTAL</title>
    <style>
        {styles}
        
        /* Portal Specific Styles */
        #portal-ui {{
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #000; z-index: 9999; display: flex; justify-content: center; align-items: center;
            font-family: 'Noto Sans KR', sans-serif;
        }}
        .input-card {{
            width: 450px; background: #111; padding: 60px; border-radius: 30px;
            border: 1px solid #222; box-shadow: 0 50px 100px rgba(0,0,0,0.8);
            text-align: center;
        }}
        .input-card h1 {{ font-size: 32px; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 40px; color: #fff; }}
        .field {{ margin-bottom: 25px; text-align: left; }}
        .field label {{ display: block; font-size: 12px; color: #666; font-weight: 900; margin-bottom: 10px; letter-spacing: 0.1em; }}
        .field input, .field select {{
            width: 100%; background: #000; border: 1px solid #333; color: #fff;
            padding: 18px; border-radius: 12px; font-size: 16px; box-sizing: border-box;
            transition: 0.3s;
        }}
        .field input:focus {{ border-color: #fff; outline: none; }}
        
        .run-btn {{
            width: 100%; background: #fff; color: #000; border: none; padding: 22px;
            font-size: 18px; font-weight: 900; border-radius: 12px; cursor: pointer;
            margin-top: 20px; transition: 0.3s; letter-spacing: 0.05em;
        }}
        .run-btn:hover {{ background: #ccc; transform: translateY(-3px); }}
        
        #terminal-overlay {{
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #000; z-index: 10000; display: none; flex-direction: column;
            padding: 50px; box-sizing: border-box; font-family: 'Consolas', monospace;
        }}
        .log-line {{ color: #00ff00; font-size: 16px; margin-bottom: 8px; opacity: 0; transform: translateY(10px); }}
        @keyframes fadeInUp {{ to {{ opacity: 1; transform: translateY(0); }} }}
        
        #report-view {{ display: none; width: 100%; }}
        
        /* Cursor animation */
        .cursor {{ display: inline-block; width: 10px; height: 18px; background: #00ff00; animation: blink 1s infinite; }}
        @keyframes blink {{ 0%, 100% {{ opacity: 1; }} 50% {{ opacity: 0; }} }}
    </style>
</head>
<body style="background: #000; margin: 0;">

    <div id="portal-ui">
        <div class="input-card">
            <h1>X-SAJU CLOUD</h1>
            <div class="field">
                <label>이름 (NAME)</label>
                <input type="text" value="장경현" readonly>
            </div>
            <div class="field">
                <label>생년월일 (BIRTH DATE)</label>
                <input type="text" value="1988-03-12" readonly>
            </div>
            <div class="field">
                <label>태어난 시 (BIRTH TIME)</label>
                <input type="text" value="01:04" readonly>
            </div>
            <button class="run-btn" onclick="startEngine()">RUN X-SAJU ENGINE</button>
        </div>
    </div>

    <div id="terminal-overlay">
        <div id="log-container"></div>
        <p style="color: #00ff00; margin-top: 20px;"><span class="cursor"></span></p>
    </div>

    <div id="report-view">
        {pages_content}
    </div>

    <script>
        const logs = [
            ">>> X-SAJU CORE INITIALIZING...",
            ">>> LOADING SAJU_TABLES_V3.0 (HANJA_TO_HANGEUL, UNSUNG_HANGEUL_TO_HANJA)",
            ">>> CALIBRATING MONOTONE DESIGN ENGINE (92PX THIN FONT)...",
            ">>> TARGET IDENTIFIED: 장경현 (1988-03-12 01:04)",
            ">>> ANALYZING 8 PILLARS (WONGUK)...",
            ">>> SYNTHESIZING 120 CATEGORIES...",
            ">>> GENERATING 183 PAGES MASTER REPORT...",
            ">>> OPTIMIZING TYPOGRAPHY (REMOVING REDUNDANCY)...",
            ">>> FORMATTING LABELS: HANJA(HANGEUL)...",
            ">>> FINAL COMPILING...",
            ">>> COMPLETE. REVEALING REPORT."
        ];

        function startEngine() {{
            document.getElementById('portal-ui').style.display = 'none';
            document.getElementById('terminal-overlay').style.display = 'flex';
            
            const container = document.getElementById('log-container');
            let delay = 0;
            
            logs.forEach((line, index) => {{
                setTimeout(() => {{
                    const p = document.createElement('p');
                    p.className = 'log-line';
                    p.innerText = line;
                    p.style.animation = 'fadeInUp 0.3s forwards';
                    container.appendChild(p);
                    
                    if (index === logs.length - 1) {{
                        setTimeout(() => {{
                            document.getElementById('terminal-overlay').style.fadeOut = '0.5s';
                            setTimeout(() => {{
                                document.getElementById('terminal-overlay').style.display = 'none';
                                document.getElementById('report-view').style.display = 'block';
                                window.scrollTo(0, 0);
                            }}, 500);
                        }}, 1500);
                    }}
                }}, delay);
                delay += (Math.random() * 500) + 300;
            }});
        }}
    </script>
</body>
</html>
"""

with open("X-SAJU_CLOUD_INTERACTIVE_PORTAL.html", "w", encoding="utf-8") as f:
    f.write(portal_html)

print(">>> PORTAL GENERATED: X-SAJU_CLOUD_INTERACTIVE_PORTAL.html")
