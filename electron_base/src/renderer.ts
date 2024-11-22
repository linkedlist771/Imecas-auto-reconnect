// renderer.ts
interface Account {
  username: string;
  password: string;
  id: string;  // Unique identifier for each account
}

interface Config {
  accounts: Account[];
  selectedAccountId?: string;  // Currently selected account
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
function createTimerDisplay() {
  const existingTimer = document.getElementById('timerDisplay');
  if (existingTimer) {
    return existingTimer;
  }

  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timerDisplay';
  timerDisplay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    z-index: 999;
    display: none;
  `;
  timerDisplay.textContent = '暂无任务';
  document.body.appendChild(timerDisplay);
  return timerDisplay;
}


function createCredentialsUI(): Promise<Config> {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <style>
        /* Modal Overlay */
        .modal {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          z-index: 1000;
        }

        /* Modal Content */
        .modal-content {
          background-color: #fff;
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          animation: slideIn 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Header */
        .modal-header {
          background-color: #0078d4;
          color: #fff;
          padding: 20px;
          text-align: center;
          border-radius: 16px 16px 0 0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        /* Body */
        .modal-body {
          padding: 20px;
          max-height: calc(90vh - 180px);
          overflow-y: auto;
        }

        /* Footer */
        .modal-footer {
          padding: 15px 20px;
          background-color: #f8f9fa;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-radius: 0 0 16px 16px;
        }

        /* Input Group */
        .input-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #4a4a4a;
          font-weight: 500;
          font-size: 0.9rem;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        input:focus {
          border-color: #0078d4;
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.1);
        }

        /* Buttons */
        button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .button {
          background-color: #0078d4;
          color: white;
        }

        .button:hover {
          background-color: #006abe;
          transform: translateY(-1px);
        }

        .button.green {
          background-color: #28a745;
        }

        .button.green:hover {
          background-color: #218838;
        }

        .button.red {
          background-color: #dc3545;
        }

        .button.red:hover {
          background-color: #c82333;
        }

        .button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          transform: none;
        }

        /* Account List */
        .accounts-list {
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .accounts-list:empty::after {
          content: "暂无账号，请添加新账号";
          display: block;
          text-align: center;
          padding: 2rem;
          color: #999;
          font-size: 0.9rem;
        }

        .account-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
          transition: all 0.2s ease;
        }

        .account-item:last-child {
          border-bottom: none;
        }

        .account-item:hover {
          background-color: #f8f9fa;
        }

        .account-item.selected {
          background-color: #e3f2fd;
          border-left: 4px solid #0078d4;
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .account-avatar {
          width: 36px;
          height: 36px;
          background-color: #0078d4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .account-actions {
          display: flex;
          gap: 8px;
        }

        /* Edit Form */
        .edit-form {
          display: none;
          animation: slideIn 0.3s ease;
        }

        /* Scrollbar */
        .modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .modal-content {
            width: 95%;
            margin: 10px;
          }

          .account-actions {
            flex-direction: column;
          }

          .modal-footer {
            flex-direction: column;
          }

          button {
            width: 100%;
          }
        }
      </style>
      <div class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>账号管理</h2>
          </div>
          <div class="modal-body">
            <div class="accounts-list" id="accountsList"></div>
            <div id="editForm" class="edit-form">
              <div class="input-group">
                <label for="editUsername">账号：</label>
                <input type="email" id="editUsername" placeholder="请输入邮箱" required>
              </div>
              <div class="input-group">
                <label for="editPassword">密码：</label>
                <input type="password" id="editPassword" placeholder="请输入密码" required>
              </div>
              <div class="modal-footer">
                <button id="saveAccountBtn" class="button green">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3 4.3l-7 7-3.6-3.6L4 6.3l2.3 2.3 5.7-5.7 1.3 1.4z" fill="currentColor"/>
                  </svg>
                  保存
                </button>
                <button id="cancelEditBtn" class="button red">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 6.6L3.4 2 2 3.4 6.6 8 2 12.6 3.4 14 8 9.4l4.6 4.6 1.4-1.4L9.4 8 14 3.4 12.6 2 8 6.6z" fill="currentColor"/>
                  </svg>
                  取消
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="addAccountBtn" class="button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              添加账号
            </button>
            <button id="startBtn" class="button green" disabled>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 3l8 5-8 5V3z" fill="currentColor"/>
              </svg>
              开始运行
            </button>
            <button id="closeBtn" class="button red">关闭</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const accountsList = modal.querySelector('#accountsList') as HTMLDivElement;
    const editForm = modal.querySelector('#editForm') as HTMLDivElement;
    const editUsername = modal.querySelector('#editUsername') as HTMLInputElement;
    const editPassword = modal.querySelector('#editPassword') as HTMLInputElement;
    const addAccountBtn = modal.querySelector('#addAccountBtn') as HTMLButtonElement;
    const closeBtn = modal.querySelector('#closeBtn') as HTMLButtonElement;
    const saveAccountBtn = modal.querySelector('#saveAccountBtn') as HTMLButtonElement;
    const cancelEditBtn = modal.querySelector('#cancelEditBtn') as HTMLButtonElement;
    const startBtn = modal.querySelector('#startBtn') as HTMLButtonElement;

    let currentConfig: Config = { accounts: [] };
    let editingAccountId: string | null = null;

    loadConfig().then((config) => {
      if (config && config.accounts) {
        currentConfig = config;
        renderAccounts();
        updateStartButtonState();
      }
    });

    function updateStartButtonState() {
      startBtn.disabled = !currentConfig.selectedAccountId;
    }

    function getInitials(email: string): string {
      return email.split('@')[0].substring(0, 2).toUpperCase();
    }

    function renderAccounts() {
      accountsList.innerHTML = '';
      currentConfig.accounts.forEach(account => {
        const accountItem = document.createElement('div');
        accountItem.className = 'account-item' +
          (account.id === currentConfig.selectedAccountId ? ' selected' : '');
        accountItem.innerHTML = `
          <div class="account-info">
            <div class="account-avatar">${getInitials(account.username)}</div>
            <div>${account.username}</div>
          </div>
          <div class="account-actions">
            <button class="button select-btn">选择</button>
            <button class="button edit-btn">编辑</button>
            <button class="button red delete-btn">删除</button>
          </div>
        `;

        accountItem.querySelector('.select-btn')?.addEventListener('click', () => {
          currentConfig.selectedAccountId = account.id;
          renderAccounts();
          updateStartButtonState();
        });

        accountItem.querySelector('.edit-btn')?.addEventListener('click', () => {
          editingAccountId = account.id;
          editUsername.value = account.username;
          editPassword.value = account.password;
          editForm.style.display = 'block';
          accountsList.style.display = 'none';
        });

        accountItem.querySelector('.delete-btn')?.addEventListener('click', () => {
          if (confirm('确定要删除这个账号吗？该操作无法撤销。')) {
            currentConfig.accounts = currentConfig.accounts.filter(a => a.id !== account.id);
            if (currentConfig.selectedAccountId === account.id) {
              currentConfig.selectedAccountId = undefined;
            }
            renderAccounts();
            updateStartButtonState();
          }
        });

        accountsList.appendChild(accountItem);
      });
    }

    addAccountBtn.addEventListener('click', () => {
      editingAccountId = null;
      editUsername.value = '';
      editPassword.value = '';
      editForm.style.display = 'block';
      accountsList.style.display = 'none';
    });

    saveAccountBtn.addEventListener('click', () => {
      if (!editUsername.value || !editPassword.value) {
        alert('请填写完整的账号和密码信息。');
        return;
      }

      if (editingAccountId) {
        const accountIndex = currentConfig.accounts.findIndex(a => a.id === editingAccountId);
        if (accountIndex !== -1) {
          currentConfig.accounts[accountIndex] = {
            ...currentConfig.accounts[accountIndex],
            username: editUsername.value,
            password: editPassword.value
          };
        }
      } else {
        const newAccount: Account = {
          id: Date.now().toString(),
          username: editUsername.value,
          password: editPassword.value
        };
        currentConfig.accounts.push(newAccount);
      }

      editForm.style.display = 'none';
      accountsList.style.display = 'block';
      renderAccounts();
      updateStartButtonState();
    });

    cancelEditBtn.addEventListener('click', () => {
      editForm.style.display = 'none';
      accountsList.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(currentConfig);
    });

    startBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(currentConfig);
    });
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

    // Initialize timer display
  createTimerDisplay();

  if (!outputEditText || !runningIntervalCombo || !headlessCombo || !startButton) {
    console.error('舞台道具缺失，无法开始演出');
    return;
  }

async function runPuppeteerAction(account: Account, headless: boolean) {
    if (!account) {
        addOutput('未找到有效账号信息', outputEditText, 'orange');
        return;
    }

    addOutput('正在凝聚水之元素，准备演绎...', outputEditText, 'cyan');
    try {
        const res = await window.electronAPI.loginWithPuppeteer(
            account.username,
            account.password,
            'https://passport.escience.cn/oauth2/authorize?client_id=47447&redirect_uri=https%3A%2F%2Fwired.ime.ac.cn%2Fsrun_portal_sso&response_type=code&state=1&theme=simple',
            headless
        );
        addOutput('水之演绎圆满谢幕', outputEditText, 'green');
        addOutput(`演绎结果: ${res}`, outputEditText, 'green');
    } catch (error) {
        addOutput(`演绎中遇到涟漪: ${error}`, outputEditText, 'red');
    }
}

  let timerDisplayInterval: NodeJS.Timeout | null = null;
let nextRunTime: Date | null = null;

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) {
        createTimerDisplay();
        return;
    }

    timerDisplay.style.display = 'block';

    if (!nextRunTime) {
        timerDisplay.textContent = '暂无任务';
        return;
    }

    const now = new Date();
    const timeLeft = nextRunTime.getTime() - now.getTime();

    if (timeLeft <= 0) {
        timerDisplay.textContent = '即将执行...';
        return;
    }

    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    timerDisplay.textContent = `下次执行: ${minutes}分${seconds}秒`;
}



startButton.addEventListener('click', async () => {
     const timerDisplay = document.getElementById('timerDisplay');

    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        if (timerDisplayInterval) {
            clearInterval(timerDisplayInterval);
            timerDisplayInterval = null;
        }
        startButton.textContent = '开启水之幕帘';
        nextRunTime = null;
        if (timerDisplay) {
            timerDisplay.textContent = '暂无任务';
        }
        addOutput('水之演绎暂时停滞', outputEditText, 'yellow');
        addOutput('水之剧场休息中', outputEditText);
        return;
    } else {
        startButton.textContent = '关闭水之帘幕';
    }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = '开启水之幕帘';
    addOutput('水之演绎暂时停滞', outputEditText, 'yellow');
    addOutput('水之剧场休息中', outputEditText);
    return;
  } else {
    startButton.textContent = '关闭水之帘幕';
  }

    console.log('水之幕帘已开启');


  // Always show credentials UI for account selection
    const config = await createCredentialsUI();
    if (!config || !config.accounts.length || !config.selectedAccountId) {
      addOutput('请选择或添加账号', outputEditText, 'orange');
      return;
    }

    await saveConfig(config);
    addOutput('账号配置已保存', outputEditText, 'green');


  console.log(config) ;

   const selectedAccount = config.accounts.find(a => a.id === config.selectedAccountId);
    if (!selectedAccount) {
      addOutput('请选择一个账号', outputEditText, 'red');
      return;
    }

  const interval = parseInt(runningIntervalCombo.value, 10);
  const headless = headlessCombo.value === 'yes';

  addOutput(
    `开启水之舞台，使用账号: ${selectedAccount.username}，间隔: ${interval} 分钟，隐匿模式: ${headless ? '是' : '否'}`,
    outputEditText,
    'cyan'
  );

  await runPuppeteerAction(selectedAccount, headless);
    nextRunTime = new Date(Date.now() + interval * 60 * 1000);

// Start the timer display update
    if (timerDisplayInterval) {
        clearInterval(timerDisplayInterval);
    }
    timerDisplayInterval = setInterval(updateTimerDisplay, 1000);

    intervalId = setInterval(
        async () => {
            addOutput(`定时唤起水之幕帘，使用账号: ${selectedAccount.username}，间隔: ${interval} 分钟`, outputEditText, 'cyan');
            await runPuppeteerAction(selectedAccount, headless);
            nextRunTime = new Date(Date.now() + interval * 60 * 1000);
        },
        interval * 60 * 1000
    );
  });

  console.log('水之剧场已就绪，等待开幕');
});
