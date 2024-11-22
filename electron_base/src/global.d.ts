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

interface Account {
  username: string;
  password: string;
  id: string;  // Unique identifier for each account
}

interface Config {
  accounts: Account[];
  selectedAccountId?: string;  // Currently selected account
}



export {};
