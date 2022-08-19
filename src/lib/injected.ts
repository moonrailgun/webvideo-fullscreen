import {
  createFullscreenStyle,
  toggle,
  start,
  stop,
} from './webpage-fullscreen';

console.log('开始执行代码');

createFullscreenStyle();

window['__webvideo_fullscreen_fn'] = {
  toggle,
  start,
  stop,
};
