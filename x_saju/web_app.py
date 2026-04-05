import os
from flask import Flask, render_template_string, request, jsonify
from x_saju.engine.calendar import SajuEngine
from x_saju.engine.interpreter import Interpreter
from x_saju.generate_full_report import FullReportGenerator

app = Flask(__name__)
engine = SajuEngine()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>X-SAJU CLOUD v3.0</title>
    <style>
        body { font-family: 'Noto Sans KR', sans-serif; background: #000; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .container { width: 100%; max-width: 500px; background: #111; padding: 40px; border-radius: 20px; border: 1px solid #333; }
        h1 { font-size: 32px; font-weight: 900; margin-bottom: 30px; text-align: center; letter-spacing: -0.05em; }
        .input-group { margin-bottom: 20px; }
        label { display: block; font-size: 14px; color: #888; margin-bottom: 8px; }
        input, select { width: 100%; padding: 15px; background: #222; border: 1px solid #444; color: #fff; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
        button { width: 100%; padding: 20px; background: #fff; color: #000; border: none; border-radius: 8px; font-size: 18px; font-weight: 900; cursor: pointer; margin-top: 20px; transition: 0.3s; }
        button:hover { background: #ccc; }
        #status { margin-top: 20px; text-align: center; color: #00ff00; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <h1>X-SAJU CLOUD</h1>
        <div class="input-group">
            <label>이름 (Name)</label>
            <input type="text" id="name" placeholder="성함을 입력하세요">
        </div>
        <div class="input-group">
            <label>생년월일 (Birth Date)</label>
            <input type="date" id="date">
        </div>
        <div class="input-group">
            <label>태어난 시 (Birth Time)</label>
            <select id="time">
                {% for h in range(24) %}
                <option value="{{ h }}">{{ h }}시</option>
                {% endfor %}
            </select>
        </div>
        <button onclick="generate()">마스터 에디션 리포트 생성</button>
        <div id="status"></div>
    </div>

    <script>
        async function generate() {
            const status = document.getElementById('status');
            status.innerText = ">>> ENGINE INITIALIZING...";
            
            const data = {
                name: document.getElementById('name').value,
                date: document.getElementById('date').value,
                hour: document.getElementById('time').value
            };

            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                status.innerText = ">>> SUCCESS! REDIRECTING...";
                window.location.href = result.url;
            } else {
                status.innerText = ">>> ERROR: " + result.message;
            }
        }
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        name = data.get('name', 'Master')
        date_str = data.get('date')
        if not date_str:
            return jsonify({'success': False, 'message': 'Date is required.'})
        
        hour = int(data.get('hour', 0))
        y, m, d = map(int, date_str.split('-'))
        
        # Absolute path for static files in the workspace
        static_dir = os.path.join(os.getcwd(), 'static')
        if not os.path.exists(static_dir): os.makedirs(static_dir)
        
        gen = FullReportGenerator({'name': name}, {'year': y, 'month': m, 'day': d, 'hour': hour, 'minute': 0})
        report_html = gen.generate_full_report()
        
        filename = f"X-SAJU_{name}_WEB_EDITION.html"
        file_path = os.path.join(static_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(report_html)
            
        return jsonify({'success': True, 'url': f'/static/{filename}'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

if __name__ == "__main__":
    if not os.path.exists('static'): os.makedirs('static')
    app.run(host='0.0.0.0', port=5000)
