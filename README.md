# Imecas-auto-reconnect

IMECAS自动重连工具， 这是一个用于自动重连微电子所网络的Python工具。它可以定期登录网络，以确保持续的网络连接。



# Windows直接使用，点击文件下面的`run.bat`即可运行




## 功能特性

1. 自动登录：使用保存的凭据定期登录网络。
2. 密码管理：安全地存储和管理用户凭据。
3. 图形用户界面：提供简单的界面用于输入和更新凭据。
4. 定时任务：使用调度器定期执行重连操作。

## 安装

1. 克隆此仓库到本地机器。
2. 安装所需的依赖：
   ```
   pip install requirements.txt
   ```
   or 
   ```
   pdm install # suggested
   ```
3. 安装Playwright浏览器：
   ```
   python -m playwright install
   ```

## 使用方法

1. 运行主程序：
   ```
   python main.py
   ```
2. 首次运行时，会弹出一个窗口要求输入用户名和密码。
3. 输入凭据后，程序会自动开始定期重连任务。

## 配置

你可以在`configs.py`文件中修改以下设置：

- `RECONNECT_INTERVAL_MINUTES`：重连间隔时间（分钟）
- `LOGIN_URL`：登录页面的URL
- `HEAD_LESS`：是否使用无头浏览器模式

## 文件说明

- `main.py`：主程序入口
- `scheduler.py`：调度器，负责定期执行重连任务
- `login_manager.py`：处理登录逻辑
- `passwords_manager.py`：管理用户凭据
- `utils.py`：工具函数（当前为空）

## 注意事项

- 请确保你的凭据信息安全，不要将包含密码的配置文件分享给他人。
- 本工具仅用于合法的网络访问，请遵守相关的使用政策。

## 贡献

欢迎提交问题报告和改进建议。如果你想贡献代码，请先开issue讨论你的想法。

## 许可证

[MIT](LICENSE)
