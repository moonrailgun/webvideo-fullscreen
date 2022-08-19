function injectedFunction(extensionId: string) {
  const flag = '__webvideo_fullscreen';
  if (!window[flag]) {
    console.log('开始注入代码');
    var b = document.createElement('script');
    b.setAttribute('src', `chrome-extension://${extensionId}/lib/injected.js`);
    document.body.appendChild(b);
    b.addEventListener('load', () => {
      console.log('注入代码加载完毕, 开启网页全屏');
      window['__webvideo_fullscreen_fn'].start();
    });
  } else {
    console.log('不能重复注入');
  }

  // 注入完毕后切换状态
  if (window['__webvideo_fullscreen_fn']) {
    window['__webvideo_fullscreen_fn'].toggle();
  }
}

chrome.action.onClicked.addListener(function (tab) {
  if (!tab.id) {
    console.log('No tab id, 跳过');
    return;
  }

  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    world: 'MAIN',
    func: injectedFunction,
    args: [chrome.runtime.id],
  });
});
