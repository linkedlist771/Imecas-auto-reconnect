from cx_Freeze import setup, Executable
import sys
import os
sys.setrecursionlimit(5000)  # Increase the recursion limit of the Python interpreter

# GUI applications require a different base on Windows (the default is for a console application).
base = None
if sys.platform == "win32":
    base = "Win32GUI"
target_dir = ""
# include_files = []
# for file in os.listdir(target_dir):
#     if file.endswith(".py"):
#         include_files.append((os.path.join(target_dir, file), f"{target_dir}/{file}"))
# print(include_files)

build_exe_options = {
    "packages": ["os", "sys", "PyQt5",
                 "pydantic", "apscheduler", "playwright", "loguru", "tzlocal"],
    "excludes": ["http", "email"],
    # "zip_include_packages": ["*"],  # 压缩所有包
    # "zip_exclude_packages": [],  # 不排除任何包从压缩中
    # "optimize": 2  # Python 代码优化级别

}


# Executable
executables = [
    Executable(
        script="gui.py",
        base=base,

    )

]

setup(
    name="ImcasAutoReconnect",
    version="1.0",
    description="ImcasAutoReconnect",
    options={"build_exe": build_exe_options},
    executables=executables
)
