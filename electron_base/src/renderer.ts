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
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-content {
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 600px;
          animation: slideIn 0.3s ease;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        h2 {
          margin: 0 0 1.5rem 0;
          color: #1a1a1a;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          position: sticky;
          top: 0;
          background: #fff;
          padding: 1rem 0;
          z-index: 1;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a4a4a;
          font-weight: 500;
          font-size: 0.9rem;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
          border-color: #0078d4;
          box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.1);
        }

        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .primary-btn {
          background-color: #0078d4;
          color: white;
        }

        .primary-btn:hover {
          background-color: #006abe;
          transform: translateY(-1px);
        }

        .secondary-btn {
          background-color: #f3f3f3;
          color: #333;
        }

        .secondary-btn:hover {
          background-color: #e5e5e5;
        }

        .start-btn {
          background-color: #28a745;
          color: white;
        }

        .start-btn:hover {
          background-color: #218838;
        }

        button:disabled {
          background-color: #e0e0e0;
          color: #999;
          cursor: not-allowed;
          transform: none;
        }

        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
          position: sticky;
          bottom: 0;
          background: #fff;
          padding: 1rem 0;
          z-index: 1;
        }

        .accounts-list {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 1.5rem;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          padding: 0.5rem;
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
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          background-color: #f8f9fa;
          transition: all 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .account-item:last-child {
          margin-bottom: 0;
        }

        .account-item:hover {
          background-color: #f3f4f6;
        }

        .account-item.selected {
          background-color: #e3f2fd;
          border: 2px solid #0078d4;
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .account-avatar {
          width: 32px;
          height: 32px;
          background-color: #0078d4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .account-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .edit-form {
          display: none;
          margin-top: 1.5rem;
          padding: 1.5rem;
          border-radius: 12px;
          background-color: #f8f9fa;
          border: 2px solid #f0f0f0;
          animation: slideIn 0.3s ease;
        }

        /* Custom scrollbar */
        .modal-content::-webkit-scrollbar,
        .accounts-list::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track,
        .accounts-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb,
        .accounts-list::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover,
        .accounts-list::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .modal-content {
            padding: 1.5rem;
            width: 95%;
          }

          .button-group {
            flex-wrap: wrap;
          }

          button {
            width: 100%;
          }
        }
      </style>
      <div class="modal">
        <div class="modal-content">
          <h2>账号管理</h2>
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
            <div class="button-group">
              <button id="saveAccountBtn" class="primary-btn">保存</button>
              <button id="cancelEditBtn" class="secondary-btn">取消</button>
            </div>
          </div>
          <div class="button-group">
            <button id="addAccountBtn" class="primary-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              添加账号
            </button>
            <button id="startBtn" class="start-btn" disabled>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 3L12 8L4 13V3Z" fill="currentColor"/>
              </svg>
              开始运行
            </button>
            <button id="closeBtn" class="secondary-btn">关闭</button>
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
    const modalContent = modal.querySelector('.modal-content') as HTMLDivElement;

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

    function scrollToEditForm() {
      editForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            <button class="action-btn secondary-btn select-btn">选择</button>
            <button class="action-btn secondary-btn edit-btn">编辑</button>
            <button class="action-btn secondary-btn delete-btn">删除</button>
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
          scrollToEditForm();
        });

        accountItem.querySelector('.delete-btn')?.addEventListener('click', () => {
          if (confirm('确定要删除该账号吗？')) {
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
      scrollToEditForm();
    });

    saveAccountBtn.addEventListener('click', () => {
      if (!editUsername.value || !editPassword.value) {
        alert('请填写完整的账号信息');
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
      renderAccounts();
      updateStartButtonState();
    });

    cancelEditBtn.addEventListener('click', () => {
      editForm.style.display = 'none';
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


  intervalId = setInterval(
    async () => {
      addOutput(`定时唤起水之幕帘，使用账号: ${selectedAccount.username}，间隔: ${interval} 分钟`, outputEditText, 'cyan');
      await runPuppeteerAction(selectedAccount, headless);
    },
    interval * 60 * 1000
  );
  });

  console.log('水之剧场已就绪，等待开幕');
});
