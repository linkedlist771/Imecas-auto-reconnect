@echo off
REM 激活虚拟环境
call .venv\Scripts\activate.bat

REM 切换到src目录
cd src
cd imecas_auto_reconnect

REM 启动GUI程序
python gui.py

REM 停留在命令提示符窗口，直到用户按下任意键
pause