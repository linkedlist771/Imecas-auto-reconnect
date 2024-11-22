// global.d.ts

declare global {
  interface Window {
    electronAPI: {
      performPuppeteerAction: (url: string) => Promise<string>;
      loginWithPuppeteer: (
        username: string,
        password: string,
        loginUrl: string,
        headless: boolean
      ) => Promise<string>;
      loadConfig: () => Promise<Config | null>;
      saveConfig: (config: Config) => Promise<boolean>;
      resetConfig: () => Promise<boolean>;
    };
  }
}

interface Config {
  username: string;
  password: string;
}


export {};
