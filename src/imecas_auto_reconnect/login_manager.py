import asyncio
from playwright.async_api import async_playwright

from src.imecas_auto_reconnect.configs import get_settings
from src.imecas_auto_reconnect.passwords_manager import PassWordsManager
import subprocess
import sys
import importlib.util
from asyncio.subprocess import PIPE


async def run_command(cmd):
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=PIPE,
        stderr=PIPE
    )

    async def read_stream(stream):
        while True:
            line = await stream.readline()
            if line:
                print(line.decode().strip())
            else:
                break

    await asyncio.gather(
        read_stream(process.stdout),
        read_stream(process.stderr)
    )

    return await process.wait()

async def install_package(package):
    print(f"正在安装 {package}...")
    cmd = [sys.executable, "-m", "pip", "install", package]
    return await run_command(cmd)

async def install_playwright_browsers():
    print("正在检查并安装必要的浏览器...")
    cmd = [sys.executable, "-m", "playwright", "install"]
    return await run_command(cmd)

async def ensure_playwright_browsers():
    if importlib.util.find_spec("playwright") is None:
        print("Playwright 未安装。正在安装 Playwright...")
        result = await install_package("playwright")
        if result != 0:
            print("安装 Playwright 时出错")
            sys.exit(1)

    result = await install_playwright_browsers()
    if result != 0:
        print("安装浏览器时出错")
        sys.exit(1)
    print("浏览器安装完成。")



async def login_async():
    await ensure_playwright_browsers()
    async with async_playwright() as playwright:
        passwords_manager = PassWordsManager()
        browser = await playwright.chromium.launch(headless=False)
        page = await browser.new_page()
        await page.goto(url=get_settings().LOGIN_URL)
        # await page.wait_for_selector('input[id="username"]')
        await asyncio.sleep(2)
        # Perform page operations
        await page.fill('input[id="username"]', passwords_manager.username)
        await page.fill('input[id="password"]', passwords_manager.password)
        await page.click('input[type="submit"]')  # type="submit" id="loginBtn"

        # Wait for page to load
        await page.wait_for_selector('.some-element')

        # Get page content
        content = await page.content()
        print(content)

        # Take screenshot
        await page.screenshot(path="screenshot.png")

        await browser.close()


# Run the async function
if __name__ == "__main__":
    asyncio.run(login_async())