// background.js
let sessionChunks = [];
let isCapturing = false;
let captureTabId = null;
let initialY = 0;
let lastCheckedY = 0;
let lastCapturedY = 0;
let monitorInterval = null;
let finishResponseCallback = null;

const MAX_HEIGHT = 20000; // 2万像素安全红线

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GET_STATUS") {
    sendResponse({ isCapturing: isCapturing });
  }

  if (message.action === "START_SESSION") {
    isCapturing = true;
    captureTabId = message.tabId;
    sessionChunks = [];

    // 获取初始位置
    chrome.scripting.executeScript({
      target: { tabId: captureTabId },
      func: () => window.scrollY
    }, async (results) => {
      const currentScrollY = results[0]?.result || 0;
      initialY = currentScrollY;
      lastCheckedY = currentScrollY;
      lastCapturedY = currentScrollY;

      // 1. 核心战术：拍下起始第一帧 (此时包含顶部的 Banner，使其在长图最上方完美保留一次)
      await captureChunk(0);

      // 2. 核心战术：第一帧拍完后，立刻在网页环境中将所有的吸顶、固定、悬浮挂件“隐形”
      await hideStickyAndFixedElements();

      // 3. 启动高频静止侦测雷达
      monitorInterval = setInterval(detectStaticAndCapture, 100);
      sendResponse();
    });
    return true;
  }

  if (message.action === "FINISH_SESSION") {
    clearInterval(monitorInterval);
    isCapturing = false;
    finishResponseCallback = sendResponse;

    // 4. 截图结束，立刻恢复网页上被隐形的 Banner，不影响用户的正常浏览
    restoreStickyAndFixedElements().then(() => {
      // 执行大画布缝合
      return stitchAndSaveImage();
    }).then(() => {
      if (finishResponseCallback) {
        finishResponseCallback();
        finishResponseCallback = null;
      }
    });
    return true;
  }
});

// 静止侦测雷达
function detectStaticAndCapture() {
  if (!isCapturing || !captureTabId) return;

  chrome.scripting.executeScript({
    target: { tabId: captureTabId },
    func: () => ({ scrollY: window.scrollY, innerHeight: window.innerHeight, scrollHeight: document.documentElement.scrollHeight })
  }, (results) => {
    if (chrome.runtime.lastError || !results || !results[0]) return;
    
    const { scrollY, innerHeight, scrollHeight } = results[0].result;
    const relativeY = scrollY - initialY;

    // 检测手停
    if (scrollY === lastCheckedY) {
      const hasMovedEnough = Math.abs(scrollY - lastCapturedY) > 150;
      const isAtBottom = (scrollY + innerHeight >= scrollHeight - 5);

      if (hasMovedEnough || isAtBottom) {
        if (scrollY !== lastCapturedY || sessionChunks.length === 1) { 
          captureChunk(relativeY);
          lastCapturedY = scrollY;
        }
      }
    }

    lastCheckedY = scrollY;

    // 红线安全截断
    if (relativeY + innerHeight >= MAX_HEIGHT) {
      clearInterval(monitorInterval);
      isCapturing = false;
      restoreStickyAndFixedElements().then(() => {
        return stitchAndSaveImage();
      }).then(() => {
        if (finishResponseCallback) { finishResponseCallback(); finishResponseCallback = null; }
      });
    }
  });
}

// 纯净的异步快门
function captureChunk(relativeY) {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (!chrome.runtime.lastError && dataUrl) {
        if (!sessionChunks.some(c => c.y === relativeY)) {
          sessionChunks.push({ y: relativeY, dataUrl: dataUrl });
        }
      }
      resolve();
    });
  });
}

// 【战术注入】：寻找并隐形所有的吸顶和悬浮元素
async function hideStickyAndFixedElements() {
  if (!captureTabId) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: captureTabId },
      func: () => {
        window.__screenshotHiddenEls = [];
        const all = document.querySelectorAll('*');
        all.forEach(el => {
          const style = window.getComputedStyle(el);
          // 锁定所有固定定位或粘性定位的干扰元素
          if (style.position === 'fixed' || style.position === 'sticky') {
            const rect = el.getBoundingClientRect();
            // 只有可见的、有面积的元素才处理
            if (rect.height > 0 && rect.width > 0) {
              window.__screenshotHiddenEls.push({
                el: el,
                savedValue: el.style.getPropertyValue('visibility'),
                savedPriority: el.style.getPropertyPriority('visibility')
              });
              // 使用最高优先级隐形，同时保留其原有的 DOM 占位，防止网页布局塌陷
              el.style.setProperty('visibility', 'hidden', 'important');
            }
          }
        });
      }
    });
  } catch (e) {
    console.error("Hide fixed elements failed:", e);
  }
}

// 【战术还原】：完美恢复网页原貌
async function restoreStickyAndFixedElements() {
  if (!captureTabId) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: captureTabId },
      func: () => {
        if (window.__screenshotHiddenEls) {
          window.__screenshotHiddenEls.forEach(item => {
            if (item.el) {
              item.el.style.setProperty('visibility', item.savedValue, item.savedPriority);
            }
          });
          delete window.__screenshotHiddenEls;
        }
      }
    });
  } catch (e) {
    console.error("Restore fixed elements failed:", e);
  }
}

// 大画布组装与落盘
async function stitchAndSaveImage() {
  if (sessionChunks.length === 0 || !captureTabId) return;

  sessionChunks.sort((a, b) => a.y - b.y);

  await chrome.scripting.executeScript({
    target: { tabId: captureTabId },
    func: (chunks, maxHeight) => {
      const cvs = document.createElement('canvas');
      const maxRelY = Math.max(...chunks.map(c => c.y));
      
      cvs.width = window.innerWidth;
      cvs.height = Math.min(maxRelY + window.innerHeight, maxHeight);
      
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      
      let loaded = 0;
      chunks.forEach(chunk => {
        const img = new Image();
        img.onload = () => {
          try {
            ctx.drawImage(img, 0, chunk.y);
          } catch (e) {
            console.error(e);
          }
          loaded++;
          if (loaded === chunks.length) {
            const dataUrl = cvs.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `clean-longshot-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
          }
        };
        img.src = chunk.dataUrl;
      });
    },
    args: [sessionChunks, MAX_HEIGHT]
  });
}