// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
// renderer.js
document.addEventListener('DOMContentLoaded', () => {
  const outputEditText = document.getElementById('outputEditText');
  const runningIntervalCombo = document.getElementById('runningIntervalCombo');
  const headlessCombo = document.getElementById('headlessCombo');
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', () => {
    const interval = runningIntervalCombo.innerHTML;
    const headless = headlessCombo.innerHTML === 'yes';

    outputEditText.innerHTML += `Starting with interval: ${interval} minutes, headless: ${headless}\n`;

    // 在这里添加你的自动化处理逻辑
  });
});