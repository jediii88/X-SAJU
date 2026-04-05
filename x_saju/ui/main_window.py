import sys
import os
from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QLabel, QLineEdit, QPushButton, 
                             QTextEdit, QComboBox, QCheckBox, QDateEdit)
from PySide6.QtCore import QDate, Qt
from x_saju.engine.calendar import SajuEngine
from x_saju.engine.interpreter import Interpreter

# Ensure current directory is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class SajuApp(QMainWindow):
    VERSION = "2.9.1"
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle(f"X-SAJU CORE ENGINE v{self.VERSION}")
        self.resize(900, 850)
        self.setStyleSheet("background-color: #ffffff; color: #000000; font-family: 'Noto Sans KR';")
        
        self.engine = SajuEngine()
        self.init_ui()

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)
        layout.setContentsMargins(30, 30, 30, 30)
        layout.setSpacing(15)

        # Header
        header = QLabel("X-SAJU / MASTER CORE SYSTEM")
        header.setStyleSheet("font-size: 32px; font-weight: 900; color: #000; letter-spacing: -0.05em; margin-bottom: 10px;")
        header.setAlignment(Qt.AlignCenter)
        layout.addWidget(header)

        # Input Group
        input_container = QWidget()
        input_container.setStyleSheet("background-color: #f2f2f2; border-radius: 12px; padding: 20px;")
        input_layout = QVBoxLayout(input_container)
        
        row1 = QHBoxLayout()
        self.name_input = QLineEdit()
        self.name_input.setPlaceholderText("성함 (Name)")
        self.name_input.setStyleSheet("padding: 12px; font-size: 16px; border: 1px solid #ddd; background: white;")
        row1.addWidget(QLabel("이름:"))
        row1.addWidget(self.name_input)
        
        self.gender_combo = QComboBox()
        self.gender_combo.addItems(["남성 (Male)", "여성 (Female)"])
        self.gender_combo.setStyleSheet("padding: 10px; font-size: 16px; background: white;")
        row1.addWidget(QLabel("성별:"))
        row1.addWidget(self.gender_combo)
        input_layout.addLayout(row1)

        row2 = QHBoxLayout()
        self.date_input = QDateEdit()
        self.date_input.setCalendarPopup(True)
        self.date_input.setDate(QDate(1988, 3, 12)) # Default test date
        self.date_input.setStyleSheet("padding: 10px; font-size: 16px; background: white;")
        row2.addWidget(QLabel("생년월일:"))
        row2.addWidget(self.date_input)
        
        self.hour_combo = QComboBox()
        for h in range(24): self.hour_combo.addItem(f"{h:02d}시")
        self.hour_combo.setCurrentIndex(1)
        self.min_combo = QComboBox()
        for m in range(60): self.min_combo.addItem(f"{m:02d}분")
        self.min_combo.setCurrentIndex(4)
        row2.addWidget(QLabel("태어난 시:"))
        row2.addWidget(self.hour_combo)
        row2.addWidget(self.min_combo)
        input_layout.addLayout(row2)
        
        layout.addWidget(input_container)

        # Action Button
        self.btn_generate = QPushButton("183P 마스터 에디션 리포트 생성 (RUN ENGINE)")
        self.btn_generate.setStyleSheet("""
            QPushButton {
                background-color: #000000; color: #ffffff; padding: 20px; 
                font-size: 18px; font-weight: 900; border-radius: 8px; margin: 10px 0;
            }
            QPushButton:hover { background-color: #333333; }
        """)
        self.btn_generate.clicked.connect(self.run_engine)
        layout.addWidget(self.btn_generate)

        # Status / Output
        self.status_label = QLabel("SYSTEM STATUS: READY")
        self.status_label.setStyleSheet("font-weight: bold; color: #666; font-size: 14px;")
        layout.addWidget(self.status_label)

        self.output_log = QTextEdit()
        self.output_log.setReadOnly(True)
        self.output_log.setStyleSheet("""
            background-color: #000000; color: #00ff00; font-family: 'Consolas', monospace; 
            font-size: 14px; border-radius: 8px; padding: 15px;
        """)
        self.output_log.setText(">>> X-SAJU CORE KERNEL v2.9.1 INITIALIZED...\n>>> WAITING FOR INPUT...")
        layout.addWidget(self.output_log)

    def log(self, message):
        self.output_log.append(f">>> {message}")
        QApplication.processEvents()

    def run_engine(self):
        try:
            name = self.name_input.text() or "Master"
            qdate = self.date_input.date()
            y, m, d = qdate.year(), qdate.month(), qdate.day()
            h = self.hour_combo.currentIndex()
            mi = self.min_combo.currentIndex()
            
            self.log(f"STARTING ANALYSIS ENGINE FOR: {name}")
            self.log(f"INPUT DATA: {y}-{m}-{d} {h:02d}:{mi:02d}")
            
            # 1. Calculate Wonguk
            self.log("CALCULATING WONGUK (4 PILLARS) FROM SOLAR TERMS...")
            pillars = self.engine.get_saju_pillars(y, m, d, h, mi)
            w_text = f"YEAR: {pillars['year'][0]}{pillars['year'][1]} | MONTH: {pillars['month'][0]}{pillars['month'][1]} | DAY: {pillars['day'][0]}{pillars['day'][1]} | TIME: {pillars['time'][0]}{pillars['time'][1]}"
            self.log(f"RESULT: {w_text}")
            
            # 2. Generate Report via FullReportGenerator
            from x_saju.generate_full_report import FullReportGenerator
            self.log("INITIALIZING 183-PAGE REPORT GENERATOR...")
            birth_data = {'year': y, 'month': m, 'day': d, 'hour': h, 'minute': mi}
            gen = FullReportGenerator({'name': name}, birth_data)
            
            self.log("COMPILING 120+ CATEGORIES & 183 PAGES...")
            report_html = gen.generate_full_report()
            
            # Save file
            if not os.path.exists('reports'): os.makedirs('reports')
            filename = f"reports/X-SAJU_{name}_MASTER_EDITION.html"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(report_html)
                
            self.log(f"SUCCESS: REPORT GENERATED AT {filename}")
            self.status_label.setText(f"SYSTEM STATUS: COMPLETED ({filename})")
            
            # Open report automatically
            import webbrowser
            webbrowser.open(f"file://{os.path.abspath(filename)}")
            
        except Exception as e:
            self.log(f"ERROR: {str(e)}")
            self.status_label.setText("SYSTEM STATUS: FAILED")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = SajuApp()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = SajuApp()
    window.show()
    sys.exit(app.exec())
