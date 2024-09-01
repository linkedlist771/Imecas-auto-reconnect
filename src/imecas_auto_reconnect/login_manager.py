import asyncio
import time

from playwright.async_api import async_playwright
from playwright.sync_api import sync_playwright
from playwright.async_api import TimeoutError as PlaywrightTimeOut

from configs import get_settings
from passwords_manager import PassWordsManager
import subprocess
import sys
import importlib.util
from asyncio.subprocess import PIPE
from loguru import logger

COUNTS = 0

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



async def login_async(headless=None):
    try:
        global COUNTS
        COUNTS += 1
        logger.info(f"开始登录到 {get_settings().LOGIN_URL}, 第 {COUNTS} 次")
        await ensure_playwright_browsers()
        async with async_playwright() as playwright:
            passwords_manager = PassWordsManager()
            __headless = headless if headless is not None else get_settings().HEAD_LESS
            browser = await playwright.chromium.launch(headless=__headless)
            page = await browser.new_page()
            try:
                await page.goto(url=get_settings().LOGIN_URL, timeout=1000)
            except PlaywrightTimeOut:
                pass
            # await page.wait_for_selector('input[id="username"]')
            await asyncio.sleep(2)
            # Perform page operations
            await page.fill('input[id="userName"]', passwords_manager.username)
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
    except Exception as e:
        # formec exc
        from traceback import print_exc
        print_exc()
    finally:
        await browser.close()


# write a login which as syn

def login_sync(headless=None):
    try:
        global COUNTS
        COUNTS += 1
        logger.info(f"开始登录到 {get_settings().LOGIN_URL}, 第 {COUNTS} 次")
        ensure_playwright_browsers()
        with sync_playwright() as playwright:
            passwords_manager = PassWordsManager()
            __headless = headless if headless is not None else get_settings().HEAD_LESS
            browser = playwright.chromium.launch(headless=__headless)
            page = browser.new_page()
            try:
                page.goto(url=get_settings().LOGIN_URL, timeout=1000)
            except PlaywrightTimeOut:
                pass
            time.sleep(2)
            # Perform page operations
            page.fill('input[id="userName"]', passwords_manager.username)
            page.fill('input[id="password"]', passwords_manager.password)
            page.click('input[type="submit"]')  # type="submit" id="loginBtn"

            # Wait for page to load
            page.wait_for_selector('.some-element')

            # Get page content
            content = page.content()
            print(content)

            # Take screenshot
            page.screenshot(path="screenshot.png")

            browser.close()
    except Exception as e:
        # format exc
        from traceback import print_exc
        print_exc()
    finally:
        browser.close()


# Run the async function
if __name__ == "__main__":
    asyncio.run(login_async())