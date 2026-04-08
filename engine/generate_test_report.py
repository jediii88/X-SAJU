import os
import sys

# Set path to current dir
sys.path.append(os.path.abspath(os.path.curdir))

from x_saju.engine.calendar import SajuEngine
from x_saju.engine.interpreter import Interpreter
from x_saju.engine.report_manager import ReportManager

def generate_master_test_report():
    # pillars = Mu-jin (戊辰), Yi-myo (乙卯), Byung-in (丙寅), Mu-zi (戊子)
    pillars = {
        'year': ['戊', '辰'],
        'month': ['乙', '卯'],
        'day': ['丙', '寅'],
        'time': ['戊', '子']
    }
    
    interpreter = Interpreter(pillars)
    report_manager = ReportManager()
    
    analysis_data = interpreter.generate_full_report_structure()
    output_file = 'MASTER_PREMIUM_REPORT_SAMPLE.html'
    final_path = report_manager.generate_report(analysis_data, output_path=output_file)
    
    print(f"REPORT_READY_AT:{os.path.abspath(final_path)}")

if __name__ == "__main__":
    generate_master_test_report()
