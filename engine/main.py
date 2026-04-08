import sys
from x_saju.ui.main_window import SajuApp
from PySide6.QtWidgets import QApplication

def main():
    app = QApplication(sys.argv)
    window = SajuApp()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
