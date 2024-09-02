import sys
import os
from PyQt5.QtWidgets import QApplication, QWidget, QSplashScreen, QProgressBar, QLabel
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QPixmap, QFont

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.dirname(__file__))

from custom_form import CustomForm

class SplashScreen(QSplashScreen):
    def __init__(self):
        super().__init__()
        # 加载背景图片
        pixmap = QPixmap("resized_background.jpeg")
        self.setPixmap(pixmap)

        # 创建进度条
        self.progress_bar = QProgressBar(self)
        self.progress_bar.setGeometry(20, pixmap.height() - 50, pixmap.width() - 40, 25)
        self.progress_bar.setAlignment(Qt.AlignCenter)
        self.progress_bar.setStyleSheet("""
            QProgressBar {
                border: 2px solid grey;
                border-radius: 5px;
                text-align: center;
            }
            QProgressBar::chunk {
                background-color: #4CAF50;
                width: 10px;
                margin: 0.5px;
            }
        """)

        # 创建文字标签
        self.loading_label = QLabel("水之女王即将登场...", self)
        self.loading_label.setAlignment(Qt.AlignCenter)
        self.loading_label.setGeometry(0, pixmap.height() // 2 - 30, pixmap.width(), 60)
        self.loading_label.setStyleSheet("""
            QLabel {
                color: white;
                background-color: rgba(0, 0, 0, 150);
                font-size: 24px;
                font-weight: bold;
            }
        """)

    def progress(self):
        return self.progress_bar.value()

    def setProgress(self, value):
        self.progress_bar.setValue(value)

class MyApp(CustomForm):
    def __init__(self):
        super(MyApp, self).__init__()

def load_app(total_load_time=5000):  # 默认加载时间为5秒
    # 创建应用实例
    app = QApplication(sys.argv)

    # 创建并显示启动画面
    splash = SplashScreen()
    splash.show()

    # 创建主窗口，但不立即显示
    window = MyApp()

    # 计算每步的延迟时间
    steps = 100
    delay = total_load_time // steps

    # 模拟加载过程
    def load_step(step=0):
        if step < steps:
            splash.setProgress(step + 1)
            QTimer.singleShot(delay, lambda: load_step(step + 1))
        else:
            splash.finish(window)
            window.show()

    # 启动加载过程
    QTimer.singleShot(10, load_step)

    return app, window

if __name__ == "__main__":
    # 设置总加载时间（毫秒）
    TOTAL_LOAD_TIME = 3000  # 5秒

    app, window = load_app(TOTAL_LOAD_TIME)
    sys.exit(app.exec_())