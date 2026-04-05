import os
import sys

# Simulation of a 5-page Premium Design Sample
templates_dir = 'x_saju/templates'
output_file = 'MASTER_DESIGN_PREVIEW_5P.html'

def generate_5page_preview():
    print("🚀 Generating X-SAJU Premium 5-Page Design Preview...")
    
    with open(os.path.join(templates_dir, 'master_intro_page.html'), 'r', encoding='utf-8') as f:
        intro_html = f.read()

    with open(os.path.join(templates_dir, 'knowledge_page_sample.html'), 'r', encoding='utf-8') as f:
        knowledge_html = f.read()

    full_content = ""
    
    # Page 1: Hero Analysis (Intro)
    full_content += intro_html.replace("PAGE 01", "DESIGN PREVIEW / PAGE 01")
    
    # Page 2: Knowledge 01 (Dynamic)
    page2 = knowledge_html.replace("오행(五行)의 상호작용", "오행의 기초: 금(金)").replace("PAGE 42 / 183", "DESIGN PREVIEW / PAGE 02")
    full_content += page2
    
    # Page 3: Knowledge 02 (Dynamic)
    page3 = knowledge_html.replace("오행(五行)의 상호작용", "십성론: 편재(偏財)").replace("PAGE 42 / 183", "DESIGN PREVIEW / PAGE 03")
    full_content += page3
    
    # Page 4: Roadmap Preview
    roadmap_page = f"""
    <div style='page-break-before: always; padding: 100px; font-family: sans-serif; background: #000; color: #fff; border-bottom: 1px solid #111;'>
        <div style='font-size: 11px; letter-spacing: 0.5em; color: #444; border-bottom: 1px solid #333; padding-bottom: 10px;'>X-SAJU / ROADMAP PREVIEW</div>
        <h1 style='font-size: 48px; font-weight: 900; margin-top: 50px;'>2026 ACTION PLAN</h1>
        <p style='font-size: 18px; line-height: 1.6; color: #888; max-width: 600px;'>
            당신의 풍부한 에너지를 어떻게 실질적인 수익 구조로 바꿀 것인지에 대한 12개월 정밀 로드맵의 첫 페이지입니다.
        </p>
        <div style='margin-top: 100px; font-size: 11px; color: #444;'>DESIGN PREVIEW / PAGE 04</div>
    </div>
    """
    full_content += roadmap_page

    # Page 5: Closing Logic
    closing_page = f"""
    <div style='page-break-before: always; padding: 100px; font-family: sans-serif; background: #000; color: #fff;'>
        <div style='font-size: 11px; letter-spacing: 0.5em; color: #444;'>X-SAJU / CLOSING</div>
        <h1 style='font-size: 32px; font-weight: 900; margin-top: 50px;'>운명은 데이터이며,<br>데이터는 바꿀 수 있습니다.</h1>
        <div style='margin-top: 200px; font-size: 11px; color: #444;'>DESIGN PREVIEW / PAGE 05</div>
    </div>
    """
    full_content += closing_page

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(full_content)
    
    print(f"✅ Preview Generated: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    generate_5page_preview()
