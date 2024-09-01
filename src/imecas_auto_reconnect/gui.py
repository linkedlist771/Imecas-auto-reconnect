import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.dirname(__file__))
from custom_form import CustomForm

from PyQt5.QtWidgets import QApplication, QWidget


class MyApp(CustomForm):
    def __init__(self):
        super(MyApp, self).__init__()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MyApp()
    window.show()
    sys.exit(app.exec_())
