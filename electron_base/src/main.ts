// main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import pie from 'puppeteer-in-electron';
import puppeteer from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';

let browser: any;
let splashWindow: BrowserWindow;

// 在这里初始化 pie
pie
  .initialize(app)
  .then(() => {
    console.log('Pie initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize pie:', error);
  });


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 550,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}
async function initializeBrowser() {
  browser = await pie.connect(app, puppeteer as any);
}

// 新增的登录函数
async function loginWithPuppeteer(
  username: string,
  password: string,
  loginUrl: string,
  headless: boolean = true
) {
  const window = new BrowserWindow({ show: !headless });
  const page = await pie.getPage(browser, window);

  try {
    await page.goto(loginUrl, { timeout: 60000 });

    await page.waitForSelector('input[id="userName"]');
    // 清空用户名输入框，然后输入
    await page.$eval('input[id="userName"]', (el) => (el.value = ''));
    await page.type('input[id="userName"]', username);
    // 清空密码输入框，然后输入
    await page.$eval('input[id="password"]', (el) => (el.value = ''));
    await page.type('input[id="password"]', password);
    await page.click('input[type="submit"]');
    await page.click('input[type="submit"]');
    await page.click('input[type="submit"]');

    // 等待登录完成，这里假设登录后会出现某个特定元素
    try {
      await page.waitForSelector('.some-element', { timeout: 1000 * 5 });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      if (page) {
        await page.close().catch((e) => console.error('Error closing page:', e));
      }
      if (window) {
        window.destroy();
      }
    }
    if (page) {
      await page.close().catch((e) => console.error('Error closing page:', e));
    }
    if (window) {
      window.destroy();
    }
  } catch (error) {
    console.error('Login failed:', error);

    throw error;
  } finally {
    if (page) {
      await page.close().catch((e) => console.error('Error closing page:', e));
    }
    if (window) {
      window.destroy();
    }
  }
}

ipcMain.handle('perform-puppeteer-action', async (event, url, show = false) => {
  const window = new BrowserWindow({ show: show });
  await window.loadURL(url);

  const page = await pie.getPage(browser, window);
  const pageUrl = page.url();

  window.destroy();
  return pageUrl;
});

ipcMain.handle(
  'login-with-puppeteer',
  async (event, username, password, loginUrl, headless = true) => {
    return await loginWithPuppeteer(username, password, loginUrl, headless);
  }
);

// 获取配置文件路径
function getConfigPath() {
  // 获取用户数据目录
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'config.json');
}

// 修改加载配置的处理程序
ipcMain.handle('load-config', async () => {
  try {
    const configPath = getConfigPath();
    // 检查文件是否存在
    const exists = await fs.promises.access(configPath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      // 如果文件不存在，返回默认配置或null
      return null;
    }

    const configData = await fs.promises.readFile(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
});

// 修改保存配置的处理程序
ipcMain.handle('save-config', async (event, config) => {
  try {
    const configPath = getConfigPath();
    // 确保目录存在
    const configDir = path.dirname(configPath);
    await fs.promises.mkdir(configDir, { recursive: true });

    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
});

// 修改重置配置的处理程序
ipcMain.handle('reset-config', async () => {
  try {
    const configPath = getConfigPath();
    const fileExists = await fs.promises.access(configPath)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      await fs.promises.unlink(configPath);
      console.log('Config file deleted successfully');
    } else {
      console.log('Config file does not exist, no deletion necessary');
    }
    return true;
  } catch (error) {
    console.error('Error resetting config:', error);
    return false;
  }
});


app.whenReady().then(async () => {
  await initializeBrowser();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
