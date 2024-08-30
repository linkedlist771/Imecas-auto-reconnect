from src.imecas_auto_reconnect.configs import CONFIG_JSON_PATH
import json
import tkinter as tk
from tkinter import messagebox

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
        self.root = tk.Tk()
        self.root.title("微电子所上网密码输入")
        self.root.geometry("300x150")

        tk.Label(self.root, text="用户名:").pack()
        self.username_entry = tk.Entry(self.root)
        self.username_entry.pack()

        tk.Label(self.root, text="密码:").pack()
        self.password_entry = tk.Entry(self.root, show="*")
        self.password_entry.pack()

        tk.Button(self.root, text="保存", command=self.save_credentials).pack()

        self.root.mainloop()

    def save_credentials(self):
        self.username = self.username_entry.get()
        self.password = self.password_entry.get()

        if self.username and self.password:
            save_choice = messagebox.askyesno("保存凭据", "是否保存这些凭据？")
            if save_choice:
                self.save_password2_config()
                messagebox.showinfo("保存成功", "凭据已保存。")
            else:
                messagebox.showinfo("未保存", "凭据未保存。")
            self.root.destroy()
        else:
            messagebox.showerror("错误", "用户名和密码不能为空！")

if __name__ == "__main__":
    password_manager = PassWordsManager()

    root = tk.Tk()
    root.title("微电子所上网密码输入")
    root.geometry("300x150")

    tk.Label(root, text=f"当前用户名: {password_manager.username}").pack()
    tk.Label(root, text=f"当前密码: {'*' * len(password_manager.password)}").pack()

    def update_credentials():
        password_manager.require_password_from_user()
        root.destroy()

    tk.Button(root, text="更新凭据", command=update_credentials).pack()

    root.mainloop()

    print("密码管理器会话已完成。")