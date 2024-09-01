from configs import CONFIG_JSON_PATH
import json
import sys
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout, QMessageBox

class PassWordsManager(object):
    def __init__(self):
        passwords = self.load_password_from_config()
        self.username = passwords.get("username")
        self.password = passwords.get("password")
        if not self.username or not self.password:
            self.require_password_from_user()

    def load_password_from_config(self):
        try:
            return json.loads(CONFIG_JSON_PATH.read_text())
        except FileNotFoundError:
            return {}

    def save_password2_config(self):
        config_data = {
            "username": self.username,
            "password": self.password
        }
        with open(CONFIG_JSON_PATH, 'w') as config_file:
            json.dump(config_data, config_file, indent=4)

    def require_password_from_user(self):
        self.app = QApplication(sys.argv)
        self.window = QWidget()
        self.window.setWindowTitle("微电子所上网密码输入")
        self.window.setGeometry(100, 100, 300, 150)

        layout = QVBoxLayout()

        layout.addWidget(QLabel("用户名:"))
        self.username_entry = QLineEdit()
        layout.addWidget(self.username_entry)

        layout.addWidget(QLabel("密码:"))
        self.password_entry = QLineEdit()
        self.password_entry.setEchoMode(QLineEdit.Password)
        layout.addWidget(self.password_entry)

        save_button = QPushButton("保存")
        save_button.clicked.connect(self.save_credentials)
        layout.addWidget(save_button)

        self.window.setLayout(layout)
        self.window.show()
        self.app.exec_()

    def save_credentials(self):
        self.username = self.username_entry.text()
        self.password = self.password_entry.text()

        if self.username and self.password:
            save_choice = QMessageBox.question(self.window, "保存凭据", "是否保存这些凭据？",
                                               QMessageBox.Yes | QMessageBox.No)
            if save_choice == QMessageBox.Yes:
                self.save_password2_config()
                QMessageBox.information(self.window, "保存成功", "凭据已保存。")
            else:
                QMessageBox.information(self.window, "未保存", "凭据未保存。")
            self.window.close()
        else:
            QMessageBox.critical(self.window, "错误", "用户名和密码不能为空！")

if __name__ == "__main__":
    password_manager = PassWordsManager()

    app = QApplication(sys.argv)
    window = QWidget()
    window.setWindowTitle("微电子所上网密码输入")
    window.setGeometry(100, 100, 300, 200)

    layout = QVBoxLayout()

    layout.addWidget(QLabel("用户名:"))
    username_entry = QLineEdit(password_manager.username)
    layout.addWidget(username_entry)

    layout.addWidget(QLabel("密码:"))
    password_entry = QLineEdit(password_manager.password)
    password_entry.setEchoMode(QLineEdit.Password)
    layout.addWidget(password_entry)

    def save_updated_credentials():
        password_manager.username = username_entry.text()
        password_manager.password = password_entry.text()
        password_manager.save_password2_config()
        QMessageBox.information(window, "保存成功", "凭据已更新。")

    save_button = QPushButton("保存")
    save_button.clicked.connect(save_updated_credentials)
    layout.addWidget(save_button)

    window.setLayout(layout)
    window.show()

    app.exec_()

    print("密码管理器会话已完成。")