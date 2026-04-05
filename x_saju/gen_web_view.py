import sys
import os
sys.path.append(os.getcwd())
from x_saju.generate_full_report import FullReportGenerator

user = {'name': '장경현'}
birth_data = {'year': 1988, 'month': 3, 'day': 12, 'hour': 1, 'minute': 4}

print(">>> ENGINE STARTING...")
gen = FullReportGenerator(user, birth_data)
report_html = gen.generate_full_report()

static_dir = os.path.join(os.getcwd(), 'static')
if not os.path.exists(static_dir): os.makedirs(static_dir)

filename = "X-SAJU_MASTER_EDITION_WEB_VIEW.html"
file_path = os.path.join(static_dir, filename)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(report_html)

print(f">>> SUCCESS: {file_path}")
