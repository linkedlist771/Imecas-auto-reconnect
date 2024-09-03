// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener("DOMContentLoaded", () => {
//
// });
import { contextBridge, ipcRenderer } from 'electron';
// rt { app, BrowserWindow, ipcMain } from "electron";
// import pie from "puppeteer-in-electron";
// import puppeteer from "puppeteer-core";
// import * as fs from 'fs';
// import * as path from "path";
//
//
//
//
//
//
//
// let browser: any;
//
// // 在这里初始化 pie
// pie.initialize(app).then(() => {
//   console.log("Pie initialized successfully");
// }).catch((error) => {
//   console.error("Failed to initialize pie:", error);
// });
//
//
// // 添加这些行在文件顶部
// if (process.env.NODE_ENV !== 'production') {
//   const electronReload = require('electron-reload');
//   electronReload(__dirname, {
//     electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
//     hardResetMethod: 'exit'
//   });
// }
//
// function createWindow() {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//       contextIsolation: true,
//       nodeIntegration: false
//     },
//     width: 800,
//   });
//
//   // and load the index.html of the app.
//   mainWindow.loadFile(path.join(__dirname, "../index.html"));
//
//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools();
// }
// async function initializeBrowser() {
//   browser = await pie.connect(app, puppeteer as any);
// }
//
// // 新增的登录函数
// async function loginWithPuppeteer(username: string, password: string, loginUrl: string, headless: boolean = true) {
//   try {
//     const window = new BrowserWindow({ show: !headless });
//     const page = await pie.getPage(browser, window);
//
//     await page.goto(loginUrl, { timeout: 60000 });
//
//     await page.waitForSelector('input[id="userName"]');
//     await page.type('input[id="userName"]', username);
//     await page.type('input[id="password"]', password);
//     await page.click('input[type="submit"]');
//
//     // 等待登录完成，这里假设登录后会出现某个特定元素
//     await page.waitForSelector('.some-element', { timeout: 60000 });
//
//     const content = await page.content();
//     console.log("Login successful. Page content:", content);
//
//     await page.screenshot({ path: "login_screenshot.png" });
//
//     const pageUrl = page.url();
//     window.destroy();
//     return pageUrl;
//   } catch (error) {
//     console.error("Login failed:", error);
//     throw error;
//   }
// }
//
//
//
// ipcMain.handle('perform-puppeteer-action', async (event, url, show = false) => {
//   const window = new BrowserWindow({ show: show });
//   await window.loadURL(url);
//
//   const page = await pie.getPage(browser, window);
//   const pageUrl = page.url();
//
//   window.destroy();
//   return pageUrl;
// });
//
// ipcMain.handle('login-with-puppeteer', async (event, username, password, loginUrl, headless = true) => {
//   return await loginWithPuppeteer(username, password, loginUrl, headless);
// });
//
//
//
// // 设置 IPC 处理程序
// ipcMain.handle('load-config', async () => {
//   try {
//     const configPath = path.join(__dirname, 'config.json');
//     const configData = await fs.promises.readFile(configPath, 'utf8');
//     return JSON.parse(configData);
//   } catch (error) {
//     console.error('Error loading config:', error);
//     return null;
//   }
// });
//
// ipcMain.handle('save-config', async (event, config) => {
//   try {
//     const configPath = path.join(__dirname, 'config.json');
//     await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
//     return true;
//   } catch (error) {
//     console.error('Error saving config:', error);
//     return false;
//   }
// });
contextBridge.exposeInMainWorld('electronAPI', {
  performPuppeteerAction: (url: string) => ipcRenderer.invoke('perform-puppeteer-action', url),
  loginWithPuppeteer: (username: string, password: string, loginUrl: string, headless: boolean) =>
    ipcRenderer.invoke('login-with-puppeteer', username, password, loginUrl, headless),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  resetConfig: () => ipcRenderer.invoke('reset-config'),

  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
});
