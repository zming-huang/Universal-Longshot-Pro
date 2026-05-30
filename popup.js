const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const statusText = document.getElementById('status-text');

// 恢复之前的捕获状态面板
chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
  if (response && response.isCapturing) {
    showCapturing();
  }
});

btnStart.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.runtime.sendMessage({ action: "START_SESSION", tabId: tab.id }, () => {
    showCapturing();
  });
});

btnStop.addEventListener('click', () => {
  btnStop.disabled = true;
  btnStop.innerText = 'Processing...';
  statusText.innerText = 'Stitching image fragments...';
  
  chrome.runtime.sendMessage({ action: "FINISH_SESSION" }, () => {
    window.close(); // 顺利完成后自动关闭小弹窗
  });
});

function showCapturing() {
  btnStart.style.display = 'none';
  btnStop.style.display = 'block';
  statusText.style.display = 'block';
  statusText.innerText = 'Please scroll down the page manually. Click button here when done.';
}