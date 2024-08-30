import asyncio
from playwright.async_api import async_playwright
from playwright.async_api import TimeoutError as PlaywrightTimeOut

from src.imecas_auto_reconnect.configs import get_settings
from src.imecas_auto_reconnect.passwords_manager import PassWordsManager
import subprocess
import sys
from loguru import logger

COUNTS = 0

async def ensure_playwright_browsers():
    try:
        # 尝试导入 playwright.sync_api 来检查 Playwright 是否已安装
        import playwright.sync_api
    except ImportError:
        print("Playwright 未安装。正在安装 Playwright...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright"])

    print("正在检查并安装必要的浏览器...")
    result = subprocess.run(
        [sys.executable, "-m", "playwright", "install"],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print("安装浏览器时出错:")
        print(result.stderr)
        sys.exit(1)
    print("浏览器安装完成。")




async def login_async():
    try:
        global COUNTS
        COUNTS += 1
        logger.info(f"开始登录到 {get_settings().LOGIN_URL}, 第 {COUNTS} 次")
        await ensure_playwright_browsers()
        async with async_playwright() as playwright:
            passwords_manager = PassWordsManager()
            browser = await playwright.chromium.launch(headless=get_settings().HEAD_LESS)
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


# Run the async function
if __name__ == "__main__":
    asyncio.run(login_async())