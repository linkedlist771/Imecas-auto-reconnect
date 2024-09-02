@echo off
REM 激活虚拟环境
cd src\imecas_auto_reconnect
..\..\.venv\Scripts\python.exe .\gui.py
REM 停留在命令提示符窗口，直到用户按下任意键
pause