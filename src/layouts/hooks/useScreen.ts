import { ref, onMounted, onBeforeUnmount } from "vue";

const screen = ref(false);
const clickFullscreen = () => {
  fullscreen();
  screen.value = getFullscreen();
};

const fullscreen = () => {
  const element = document.documentElement;
  if (!element) return;
  if (!document.fullscreenEnabled) {
    return Promise.reject(new Error("全屏模式被禁用"));
  }
  if (getFullscreen()) {
    exitFullScreen();
    return;
  }
  let result = null;
  if (element.requestFullscreen) {
    result = element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    /* Firefox */
    result = element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    /* Chrome, Safari 和 Opera */
    result = element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE/Edge */
    result = element.msRequestFullscreen();
  }
  return result || Promise.reject(new Error("不支持全屏"));
};

// 退出全屏
const exitFullScreen = (element?: HTMLElement | undefined) => {
  const d = element ? element : document;
  const full =
    d.cancelFullScreen ||
    d.webkitCancelFullScreen ||
    d.mozCancelFullScreen ||
    d.exitFullScreen;
  if (typeof full !== "undefined" && full) {
    full.call(d);
    return;
  }
};

const getFullscreen = (): boolean => {
  const flag =
    document.fullscreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen ||
    document.webkitFullScreen ||
    document.msFullScreen;
  return flag;
};

function resize() {
  screen.value = getFullscreen();
}
function KeyDown(event: any) {
  if (event.keyCode === 122 || event.keyCode === 27) {
    event.returnValue = false;
    clickFullscreen();
    return;
  }
}
export function useScreen() {
  onBeforeUnmount(() => {
    document.removeEventListener("keydown", KeyDown); // 监听按键事件
    document.removeEventListener("resize", resize);
  });
  onMounted(() => {
    window.addEventListener("resize", resize);
    document.addEventListener("keydown", KeyDown, true); // 监听按键事件
  });
  return { clickFullscreen, screen };
}
