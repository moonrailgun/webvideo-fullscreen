/**
 * whitelist
 *
 * 在白名单中的选择器会优先选择
 */
const whitelistPlayerRootSelector = [
  '#player-theater-container', // Youtube
  '.plyr',
  '.player-box > .player-box-main',
  'iframe[src^="https://danmu.yhdmjx.com"]',
];
const flag = '__webvideo_fullscreen';

export function createFullscreenStyle() {
  if (window[flag]) {
    return;
  }

  const s = document.createElement('style');
  s.innerHTML = `
.${flag} {
  position: fixed !important;
  inset: 0 !important;
  z-index: 99999999 !important;
  width: auto !important;
  height: auto !important;
  max-height: 100vh !important;
  max-width: 100vw !important;
}

.${flag} > video, video.${flag} {
  /* 处理简单场景的情况 */
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

iframe.${flag} {
  /* 处理iframe情况 */
  width: 100%;
  height: 100%;
}
`;

  document.body.appendChild(s);

  window[flag] = true;
}

/**
 * 智能获取视频元素
 */
function smartGetVideoContainer(videoEl: HTMLVideoElement): HTMLElement | null {
  const rect = videoEl.getBoundingClientRect();
  const videoWidth = rect.width;
  const videoHeight = rect.height;

  let curEl: HTMLElement = videoEl;
  while (curEl.parentElement) {
    const rect = curEl.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width >= videoWidth + 80 || height >= videoHeight + 80) {
      // 容器超过一定大小，视为越界父容器已经不是播放器容器(包含其他元素)， 跳出查找
      return curEl;
    }

    curEl = curEl.parentElement;
  }

  return null;
}

// Esc退出网页全屏
window.addEventListener('keyup', (e) => {
  if (e.code === 'Escape') {
    stop();
  }
});

export function start() {
  for (const selector of whitelistPlayerRootSelector) {
    const container = document.querySelector(selector);
    if (container) {
      // 找到容器
      console.log('找到白名播放器容器:', selector);
      container.classList.add(flag);
      window.dispatchEvent(new Event('resize')); // 主动触发一次resize事件，因为部分播放器(如youtube) 会根据窗口大小手动调整视频画面位置
      return;
    }
  }

  console.log('没有找到白名单播放器容器，开始使用智能模式');

  const videoEl = document.querySelector('video');
  if (!videoEl) {
    console.warn('没有找到网页播放器元素');
    alert('没有找到网页播放器元素');
    return;
  }

  const container = smartGetVideoContainer(videoEl);
  if (container) {
    console.log('智能模式找到播放器容器:', container);
    container.classList.add(flag);
    window.dispatchEvent(new Event('resize')); // 主动触发一次resize事件，因为部分播放器(如youtube) 会根据窗口大小手动调整视频画面位置
    return;
  }

  alert('查找网页视频元素失败, 请联系开发者进行适配');
}

export function stop() {
  document.querySelectorAll(`.${flag}`).forEach((el) => {
    el.classList.remove(flag);
    window.dispatchEvent(new Event('resize')); // 主动触发一次resize事件，因为部分播放器(如youtube) 会根据窗口大小手动调整视频画面位置
  });
}

export function toggle() {
  if (document.querySelector(`.${flag}`)) {
    console.log('网页视频退出全屏');
    stop();
  } else {
    console.log('网页视频全屏');
    start();
  }
}
