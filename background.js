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

// 升级版：缝合怪大画布组装（完美适配高分屏 DPI/DPR 自动无损缩放）
async function stitchAndSaveImage() {
  if (sessionChunks.length === 0 || !captureTabId) return;

  // 1. 严格排序，确保切片按从上到下的顺序绘制
  sessionChunks.sort((a, b) => a.y - b.y);

  await chrome.scripting.executeScript({
    target: { tabId: captureTabId },
    func: async (chunks, maxHeight) => {
      // 2. 使用 Promise.all 并行预加载所有图片切片，获取其真实物理尺寸
      const loadImagesPromises = chunks.map(chunk => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ ...chunk, imgElement: img });
          img.src = chunk.dataUrl;
        });
      });

      const loadedChunks = await Promise.all(loadImagesPromises);
      if (loadedChunks.length === 0) return;

      // 3. 【核心算法】：动态捕捉当前设备的真实屏幕缩放比 (DPR)
      // 用图片的真实物理宽度除以浏览器的逻辑宽度，精准识别 1.25, 1.5, 2.0 等各种高分屏环境
      const firstImg = loadedChunks[0].imgElement;
      const dpr = firstImg.naturalWidth / window.innerWidth;

      // 4. 初始化全高清物理像素画布（不再使用会引发裁剪的逻辑像素宽度）
      const cvs = document.createElement('canvas');
      const maxRelY = Math.max(...chunks.map(c => c.y));
      
      cvs.width = firstImg.naturalWidth; 
      cvs.height = Math.min(maxRelY + window.innerHeight, maxHeight) * dpr;
      
      const ctx = cvs.getContext('2d');
      
      // 防黑条双保险：刷上一层纯白底漆
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      
      // 5. 像素级无缝贴合绘制
      loadedChunks.forEach(chunk => {
        try {
          // 【核心修正】：将逻辑层的滚动坐标 chunk.y 乘以 DPR，转换成物理层绝对坐标
          // 彻底解决高分屏下的居中网页内容右移、左侧留白以及右侧裁剪问题
          const physicalY = Math.round(chunk.y * dpr);
          ctx.drawImage(chunk.imgElement, 0, physicalY);
        } catch (e) {
          console.error("Canvas drawing slice failed:", e);
        }
      });

      // 6. 导出超清无损长图并落盘
      const dataUrl = cvs.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `perfect-hd-longshot-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    },
    args: [sessionChunks, MAX_HEIGHT]
  });
}