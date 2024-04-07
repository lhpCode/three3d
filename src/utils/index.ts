import router from "@/router";
import { DirectiveBinding } from "vue";
/**
 * 获取css全局变量
 * @param {string} cssValueName css全局变量名
 * @returns {string} 颜色
 */
export const getCssValue = (cssValueName: string): string => {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(
      cssValueName,
    );
  } catch {
    return "";
  }
};

/**
 * 设置css全局变量
 * @param {string}cssName 全局css变量
 * @param {string}cssValue 颜色
 */
export const setCssValue = (cssName: string, cssValue: string) => {
  try {
    document.documentElement.style.setProperty(cssName, cssValue);
  } catch (error) {
    console.error(error);
  }
};
// 切换主题
export const switchThemeColor = (themeName: string) => {
  window.document.documentElement.setAttribute("data-theme", themeName);
};

// 获取LocalStorage
export const getLocalStorage = <T>(keyName: string): T | null => {
  if (!keyName) return null;
  const ls = localStorage.getItem(keyName);
  if (!ls) return null;
  return JSON.parse(ls);
};

/**
 *设置LocalStorage
 * @param {string} keyName
 * @param {object} value
 * @returns {boolean}
 */
export const setLocalStorage = (keyName: string, value: Object): boolean => {
  if (!keyName) return false;
  localStorage.setItem(keyName, JSON.stringify(value));
  return true;
};

/**
 * 删除LocalStorage
 * @param {string} keyName 删除key
 * @param {Boolean} isAll 是否清空LocalStorage
 */
export const delLocalStorage = (keyName: string, isAll: Boolean = false) => {
  if (isAll) localStorage.clear();
  localStorage.removeItem(keyName);
};

/**
 * 验证权限
 * 权限从当前路由下meta对象的permission中获取
 */
export const hasPermission = (el: any, binding: DirectiveBinding<any>) => {
  const { arg, value } = binding;
  const path = router.currentRoute.value.fullPath;
  const routers = router.getRoutes();
  const routerObj = routers.find((item) => item.path === path);
  if (routerObj && routerObj.meta) {
    const { permission } = routerObj.meta as { permission: Array<string> };
    if (Object.prototype.toString.call(permission) !== "[object Array]") return;
    const flag = permission.some((item) => item === arg || item === value);
    if (!flag) el.parentNode.removeChild(el);
  }
};
