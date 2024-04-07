// 主题切换
import { onMounted } from "vue";
import { switchThemeColor } from "@/utils/index";
import { useSystemStoreWithOut } from "@/store/modules/system";

const systemStore = useSystemStoreWithOut();
const themeList = [
  {
    name: "默认",
    value: "normal",
  },
  {
    name: "暗黑",
    value: "dark",
  },
  {
    name: "深蓝",
    value: "darkBlue",
  },
  {
    name: "蓝白",
    value: "light",
  },
  {
    name: "炫彩",
    value: "florid",
  },
];
switchThemeColor(systemStore.themeValue);
const command = (v: string) => {
  systemStore.themeValue = v;
  switchThemeColor(v);
};

export function useTheme() {
  onMounted(() => {});
  return { command, themeList };
}
