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
