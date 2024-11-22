// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener("DOMContentLoaded", () => {
//
// });
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
  performPuppeteerAction: (url: string) => ipcRenderer.invoke('perform-puppeteer-action', url),
  loginWithPuppeteer: (username: string, password: string, loginUrl: string, headless: boolean) =>
    ipcRenderer.invoke('login-with-puppeteer', username, password, loginUrl, headless),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  resetConfig: () => ipcRenderer.invoke('reset-config'),

  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
});
