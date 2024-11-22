// renderer.ts
interface Config {
  username: string;
  password: string;
}

async function loadConfig(): Promise<Config | null> {
  return window.electronAPI.loadConfig();
}

async function saveConfig(config: Config): Promise<boolean> {
  return window.electronAPI.saveConfig(config);
}

async function resetConfig(): Promise<boolean> {
  return window.electronAPI.resetConfig();
}

function createCredentialsUI(): Promise<Config> {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <style>
        .modal {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          
          background-color: rgba(0, 0, 0, 0.5);
    background-size: cover; 
    background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
        }
        .modal-content {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 300px;
        }
        h2 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }
        .input-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        button {
          width: 100%;
          padding: 10px;
          background-color: #0078d4;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #005a9e;
        }
      </style>
      <div class="modal">
        <div class="modal-content">
          <h2>登录微所有线账号</h2>
          <form id="loginForm">
            <div class="input-group">
              <label for="username">账号：</label>
              <input type="email" id="username" placeholder="请输入您的邮箱" required>
            </div>
            <div class="input-group">
              <label for="password">密码：</label>
              <input type="password" id="password" placeholder="请输入您的密码" required>
            </div>
            <button type="submit">登录</button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector('#loginForm') as HTMLFormElement;
    const usernameInput = modal.querySelector('#username') as HTMLInputElement;
    const passwordInput = modal.querySelector('#password') as HTMLInputElement;

    form.onsubmit = (e) => {
      e.preventDefault();
      const config: Config = {
        username: usernameInput.value,
        password: passwordInput.value,
      };
      document.body.removeChild(modal);
      resolve(config);
    };
  });
}

function addOutput(message: string, outputEditText: HTMLTextAreaElement, color = 'white') {
  const coloredMessage = `<span style="color: ${color}">${message}</span>`;
  outputEditText.innerHTML += coloredMessage + '<br>';
  outputEditText.scrollTop = outputEditText.scrollHeight;
}

const resetConfigButton = document.getElementById('resetConfigButton') as HTMLButtonElement;

resetConfigButton.addEventListener('click', async () => {
  const outputEditText = document.getElementById('outputEditText') as HTMLTextAreaElement;

  try {
    const defaultConfig = await resetConfig();
    if (defaultConfig) {
      // Update UI with default values

      addOutput('配置已重置为默认值', outputEditText, 'green');
    } else {
      addOutput('重置配置失败', outputEditText, 'red');
    }
  } catch (error) {
    console.error('Error resetting config:', error);
    addOutput('重置配置时发生错误', outputEditText, 'red');
  }
});

let intervalId: NodeJS.Timeout | null = null;
document.addEventListener('DOMContentLoaded', async () => {
  console.log('水之剧场已准备就绪');

  const outputEditText = document.getElementById('outputEditText') as HTMLTextAreaElement;
  const runningIntervalCombo = document.getElementById('runningIntervalCombo') as HTMLSelectElement;
  const headlessCombo = document.getElementById('headlessCombo') as HTMLSelectElement;
  const startButton = document.getElementById('startButton') as HTMLButtonElement;

  if (!outputEditText || !runningIntervalCombo || !headlessCombo || !startButton) {
    console.error('舞台道具缺失，无法开始演出');
    return;
  }

  async function runPuppeteerAction(config: Config | null, headless: boolean) {
    if (!config) {
      addOutput('未找到神之印记', outputEditText, 'orange');
      return;
    }
    addOutput('正在凝聚水之元素，准备演绎...', outputEditText, 'cyan');
    try {
      const res = await window.electronAPI.loginWithPuppeteer(
        config.username,
        config.password,
        'https://passport.escience.cn/oauth2/authorize?client_id=47447&redirect_uri=https%3A%2F%2Fwired.ime.ac.cn%2Fsrun_portal_sso&response_type=code&state=1&theme=simple',
        headless
      );
      addOutput('水之演绎圆满谢幕', outputEditText, 'green');
      addOutput(`演绎结果: ${res}`, outputEditText, 'green');
    } catch (error) {
      addOutput(`演绎中遇到涟漪: ${error}`, outputEditText, 'red');
    }
  }

  startButton.addEventListener('click', async () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      startButton.textContent = '开启水之幕帘';
      addOutput('水之演绎暂时停滞', outputEditText, 'yellow');
      addOutput('水之剧场休息中', outputEditText);
      return;
    } else {
      startButton.textContent = '落下水之帘幕';
    }

    console.log('水之幕帘已开启');
    let config: Config | null = null; // await loadConfig();

    if (!config) {
      try {
        addOutput('未找到水之剧本，请输入您的神之印记', outputEditText, 'orange');

        config = await createCredentialsUI();
        if (config) {
          await saveConfig(config);
          addOutput('神之印记已镌刻于水中', outputEditText, 'green');
        } else {
          addOutput('获取神之印记失败', outputEditText, 'red');
          return;
        }
      } catch (error) {
        addOutput(`创建神之印记时遇到波澜: ${error}`, outputEditText, 'red');
        return;
      }
    }

    const interval = parseInt(runningIntervalCombo.value, 10);
    const headless = headlessCombo.value === 'yes';

    addOutput(
      `开启水之舞台，间隔: ${interval} 分钟，隐匿模式: ${headless ? '是' : '否'}`,
      outputEditText,
      'cyan'
    );
    await runPuppeteerAction(config, headless);

    intervalId = setInterval(
      async () => {
        addOutput(`定时唤起水之幻象，间隔: ${interval} 分钟`, outputEditText, 'cyan');
        await runPuppeteerAction(config, headless);
      },
      interval * 60 * 1000
    );
  });

  console.log('水之剧场已就绪，等待开幕');
});
