# -*- coding: utf-8 -*-
import os
from engine.saju_tables import HANJA_TO_HANGEUL, HANJA_TO_ELEMENT
from engine.interpreter import Interpreter
from engine.calendar import SajuEngine

class FullReportGenerator:
    VERSION = "2.9"
    
    def __init__(self, user_info, birth_data):
        self.user_info = user_info
        # Use SajuEngine to calculate pillars from birth data
        engine = SajuEngine()
        self.pillars = engine.get_saju_pillars(
            birth_data['year'], 
            birth_data['month'], 
            birth_data['day'], 
            birth_data['hour'], 
            birth_data['minute']
        )
        self.interpreter = Interpreter(self.pillars)
        
    def get_pillar_html(self, hanja):
        hangeul = HANJA_TO_HANGEUL.get(hanja, "")
        element = HANJA_TO_ELEMENT.get(hanja, "metal") # Default to metal/white if unknown
        return f"""
                <div class="grid-item">
                    <span class="hanja-character color-{element}">{hanja}</span>
                    <span class="hangeul-sub">{hangeul}</span>
                </div>
        """

    def generate_full_report(self):
        pages = []
        # Get data for 183 pages from Interpreter
        report_data = self.interpreter.get_full_report_data()
        
        # 1. Intro (Page 1) - Based on User's reference v2.0
        p1_data = report_data[0]
        
        # Sipseong Row
        pillar_analysis = self.interpreter.analyze_pillars()
        sipseong_row = f"""
                <div class="grid-row-label">십성</div>
                <div class="grid-item sipseong-text">{pillar_analysis['time']['sipseong']}</div>
                <div class="grid-item sipseong-text">{pillar_analysis['day']['sipseong']}</div>
                <div class="grid-item sipseong-text">{pillar_analysis['month']['sipseong']}</div>
                <div class="grid-item sipseong-text">{pillar_analysis['year']['sipseong']}</div>
        """

        counts, percentages = self.interpreter.get_element_balance()
        energy_analysis = f"""
            <div class="energy-analysis">
                <div class="energy-item">
                    <span class="energy-label">나무 (木)</span>
                    <span class="energy-value">{percentages['木']}%</span>
                </div>
                <div class="energy-item">
                    <span class="energy-label">불 (火)</span>
                    <span class="energy-value">{percentages['火']}%</span>
                </div>
                <div class="energy-item">
                    <span class="energy-label">땅 (土)</span>
                    <span class="energy-value">{percentages['土']}%</span>
                </div>
                <div class="energy-item">
                    <span class="energy-label">금 (金)</span>
                    <span class="energy-value">{percentages['金']}%</span>
                </div>
            </div>
        """

        intro_content = f"""
        <div class="page-container">
            <div class="subtitle">운명의 정밀한 기록 / 도끼 코어 v{self.VERSION} (Density & Clarity)</div>
            <div class="hero-title">비어있는 여백 사이로<br>당신의 지도가 그려집니다.</div>

            <div class="wonguk-container-v20">
                <!-- Header Labels -->
                <div class="grid-label-col"></div>
                <div class="grid-item pillar-name-top">시주</div>
                <div class="grid-item pillar-name-top">일주</div>
                <div class="grid-item pillar-name-top">월주</div>
                <div class="grid-item pillar-name-top">연주</div>

                <!-- Cheongan Row -->
                <div class="grid-row-label">천간</div>
                {self.get_pillar_html(self.pillars['time'][0])}
                {self.get_pillar_html(self.pillars['day'][0])}
                {self.get_pillar_html(self.pillars['month'][0])}
                {self.get_pillar_html(self.pillars['year'][0])}

                <!-- Jiji Row -->
                <div class="grid-row-label">지지</div>
                {self.get_pillar_html(self.pillars['time'][1])}
                {self.get_pillar_html(self.pillars['day'][1])}
                {self.get_pillar_html(self.pillars['month'][1])}
                {self.get_pillar_html(self.pillars['year'][1])}

                {sipseong_row}
            </div>

            {energy_analysis}

            <div class="main-text">
                {self.user_info['name']} 마스터님의 운명 시스템입니다.<br>
                {p1_data['content']}<br>
                <span class="highlight">실질적인 가치</span>로 바꾸는 법을 제안합니다.
            </div>

            <div class="footer">
                X-SAJU PREMIUM REPORT / NO. 1
            </div>
        </div>
        """
        pages.append(intro_content)
        
        # 2. Analysis Pages (Page 2-183)
        for i in range(2, 184):
            data = report_data[i-1]
            
            # Determine if this is more "Theory" or "Personal"
            # Most of these pages (11-183) are theoretical explanations applied to the user.
            is_theory = i > 10
            type_label = "학술적 해설 (GENERAL THEORY)" if is_theory else "정밀 분석 (PERSONAL INSIGHT)"
            
            page = f"""
            <div class="page-container knowledge-page">
                <div class="top-nav">
                    <span class="category">{data['category']}</span>
                    <span class="page-num">PAGE {i}</span>
                </div>
                
                <div class="theory-tag">{type_label}</div>
                <div class="term-title">{data['title']}</div>

                <div class="content-wrapper">
                    <div class="section-block theory-section">
                        <div class="section-label">CORE DEFINITION</div>
                        <p class="section-text">{data['content']}</p>
                    </div>

                    <div class="section-block application-section">
                        <div class="section-label">MASTER'S APPLICATION</div>
                        <p class="section-text">
                            이 기운은 당신의 고유한 성향과 결합하여 삶의 중요한 변곡점을 만들어냅니다. 
                            단순한 이론을 넘어, 당신의 {self.pillars['day'][0]} 기운이 이 에너지를 어떻게 
                            수용하고 활용하느냐에 따라 성공의 밀도가 달라집니다.
                        </p>
                    </div>

                    <div class="section-block strategy-section">
                        <div class="section-label">STRATEGIC ACTION</div>
                        <div class="strategy-box">
                            현대 사회에서의 {data['category']} 활용은 지식의 습득보다 '타이밍'과 '태도'의 문제입니다. 
                            위의 분석 내용을 바탕으로 오늘 하루, 당신의 환경을 정교하게 조정해 보십시오.
                        </div>
                    </div>
                </div>

                <div class="page-footer">
                    <span>X-SAJU PREMIUM MASTER EDITION</span>
                    <span>© AXE ENGINE V{self.VERSION}</span>
                </div>
            </div>
            """
            pages.append(page)

        # Final Page (184 if we have 183 data pages + intro)
        # Actually, let's stick to exactly 183 pages total
        # The loop above should be range(2, 183) and then 183 is final
        # But I'll follow the Interpreter's 183 pages count.

        # Combined CSS (Exactly from v2.0)
        html_content = f"""
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>X-SAJU 183P FINAL - {self.user_info['name']}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;700;900&family=Noto+Serif+KR:wght@200;400;700;900&display=swap');
                
                body {{ 
                    font-family: 'Noto Sans KR', sans-serif; 
                    background-color: #000000; 
                    color: #ffffff; 
                    margin: 0; padding: 0; line-height: 1.6;
                    display: flex; flex-direction: column; align-items: center;
                }}
                
                .page-container {{ 
                    width: 800px; min-height: 1131px; padding: 100px 70px;
                    background: #000000; position: relative;
                    box-sizing: border-box; overflow: hidden; page-break-after: always;
                    display: flex; flex-direction: column; align-items: center;
                    margin-bottom: 40px;
                }}
                
                .knowledge-page {{
                    background: #111111;
                    border: 1px solid #222;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }}

                .subtitle {{ 
                    font-size: 14px; font-weight: 300; color: #666; 
                    letter-spacing: 0.5em; margin-bottom: 30px; text-align: center; 
                    font-family: 'Noto Serif KR', serif; 
                }}
                .hero-title {{ 
                    font-size: 54px; font-weight: 200; line-height: 1.2; 
                    margin-bottom: 100px; letter-spacing: -0.05em; color: #ffffff; 
                    text-align: center; word-break: keep-all; font-family: 'Noto Serif KR', serif; 
                }}
                
                /* v2.0 Wonguk Grid Layout */
                .wonguk-container-v20 {{ 
                    display: grid; 
                    grid-template-columns: 80px 1fr 1fr 1fr 1fr; 
                    width: 100%; 
                    margin-bottom: 100px; 
                    border: 1px solid #444; 
                    background: #050505; 
                }}
                .grid-item {{
                    text-align: center;
                    padding: 35px 0;
                    border-right: 1px solid #222;
                    border-bottom: 1px solid #222;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }}
                .grid-item:nth-child(5n) {{ border-right: none; }}
                
                .grid-row-label {{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    font-weight: 700;
                    color: #555;
                    background: #0a0a0a;
                    border-right: 1px solid #333;
                    border-bottom: 1px solid #222;
                    letter-spacing: 0.3em;
                    writing-mode: vertical-lr;
                    text-orientation: upright;
                }}
                
                .grid-label-col {{
                    background: #0a0a0a;
                    border-right: 1px solid #333;
                    border-bottom: 1px solid #222;
                }}

                .pillar-name-top {{
                    font-size: 15px;
                    font-weight: 300;
                    color: #666;
                    letter-spacing: 0.2em;
                    padding: 15px 0 !important;
                }}

                .hanja-character {{ 
                    font-size: 92px; font-weight: 200; line-height: 1; margin-bottom: 5px; 
                    display: block; font-family: 'Noto Sans KR', sans-serif; 
                }}
                .hangeul-sub {{ 
                    font-size: 16px; font-weight: 300; color: #B3B3B3; 
                    letter-spacing: 0.1em; display: block; 
                }}
                .sipseong-text {{ 
                    font-size: 18px; font-weight: 300; color: #E6E6E6; 
                    letter-spacing: 0.05em; padding: 20px 0 !important;
                }}

                /* Energy Analysis */
                .energy-analysis {{
                    display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; 
                    gap: 1px; background: #222; margin-bottom: 100px;
                }}
                .energy-item {{ background: #000; text-align: center; padding: 40px 10px; }}
                .energy-label {{ 
                    font-size: 14px; font-weight: 400; color: #999; 
                    letter-spacing: 0.1em; margin-bottom: 15px; display: block; 
                }}
                .energy-value {{ 
                    font-size: 24px; font-weight: 200; color: #E6E6E6; 
                    font-family: 'Noto Serif KR', serif; 
                }}

                .main-text {{ 
                    font-size: 24px; font-weight: 200; color: #ffffff; line-height: 2.0; 
                    text-align: center; max-width: 600px; margin: 0 auto; 
                    word-break: keep-all; font-family: 'Noto Serif KR', serif; 
                }}
                .highlight {{ 
                    color: #fff; font-weight: 900; font-family: 'Noto Sans KR', sans-serif; 
                    border-bottom: 3px solid #ffffff; padding-bottom: 5px; 
                }}
                .footer {{ 
                    position: absolute; bottom: 80px; width: 100%; left: 0; 
                    text-align: center; font-size: 11px; font-weight: 900; color: #666; 
                    letter-spacing: 0.6em; 
                }}

                .category {{ 
                    font-size: 11px; font-weight: 700; 
                    letter-spacing: 0.2em; color: #888; text-transform: uppercase; 
                }}
                .top-nav {{
                    display: flex; justify-content: space-between; width: 100%;
                    margin-bottom: 50px; border-bottom: 1px solid #333; padding-bottom: 15px;
                }}
                .page-num {{ font-size: 11px; font-weight: 900; color: #555; }}
                
                .theory-tag {{
                    align-self: flex-start;
                    font-size: 10px; font-weight: 900; background: #333; color: #fff;
                    padding: 4px 10px; letter-spacing: 0.1em; margin-bottom: 20px;
                }}

                .term-title {{ 
                    align-self: flex-start; font-size: 42px; font-weight: 900; 
                    margin-bottom: 60px; letter-spacing: -0.04em; color: #ffffff; 
                    font-family: 'Noto Serif KR', serif; line-height: 1.2;
                }}
                
                .content-wrapper {{
                    width: 100%; flex-grow: 1; display: flex; flex-direction: column; gap: 50px;
                }}
                
                .section-block {{
                    width: 100%;
                }}
                .section-label {{
                    font-size: 12px; font-weight: 900; color: #666; letter-spacing: 0.2em;
                    margin-bottom: 20px; border-left: 3px solid #666; padding-left: 15px;
                }}
                .section-text {{
                    font-size: 19px; font-weight: 300; color: #ccc; line-height: 1.8;
                    word-break: keep-all;
                }}
                
                .strategy-box {{
                    background: #1a1a1a; padding: 40px; border-radius: 2px;
                    font-size: 18px; font-weight: 300; color: #fff; line-height: 1.8;
                    border: 1px solid #333; font-style: italic;
                }}

                .page-footer {{ 
                    width: 100%; margin-top: 50px; border-top: 1px solid #333; padding-top: 20px;
                    font-size: 10px; color: #444; display: flex; justify-content: space-between; 
                    letter-spacing: 0.2em; font-weight: 900;
                }}

                .color-wood {{ color: #4CAF50; opacity: 0.9; }}
                .color-fire {{ color: #FF5252; opacity: 0.9; }}
                .color-earth {{ color: #FFC107; opacity: 0.9; }}
                .color-metal {{ color: #ffffff; opacity: 1; }}
                .color-water {{ color: #2196F3; opacity: 0.9; }}
            </style>
        </head>
        <body>
            {''.join(pages)}
        </body>
        </html>
        """
        return html_content

if __name__ == "__main__":
    import sys
    import os
    
    # Add parent directory to path to allow absolute imports
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Simple check for GUI flag, but don't import PySide6 globally
    if "--gui" in sys.argv:
        try:
            from PySide6.QtWidgets import QApplication
            from x_saju.ui.main_window import SajuApp
            app = QApplication(sys.argv)
            window = SajuApp()
            window.show()
            sys.exit(app.exec())
        except ImportError:
            print("Error: PySide6 not installed. Please run 'pip install PySide6'.")
            sys.exit(1)
    else:
        # Import Generator locally to use absolute import after path fix
        from x_saju.generate_full_report import FullReportGenerator
        user = {'name': '장경현'}
        birth_data = {'year': 1988, 'month': 3, 'day': 12, 'hour': 1, 'minute': 4}
        gen = FullReportGenerator(user, birth_data)
        report_html = gen.generate_full_report()
        
        if not os.path.exists('reports'): os.makedirs('reports')
        with open('reports/X-SAJU_MASTER_EDITION_v2.9.1.html', 'w', encoding='utf-8') as f:
            f.write(report_html)
        print("Master Analysis Engine v2.9.1 (GUI/CLI Unified) Completed.")
