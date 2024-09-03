import * as puppeteer from 'puppeteer-core';

export interface ElectronAPI {
  getChromePath: () => Promise<string>;
  puppeteer: typeof puppeteer;
}
