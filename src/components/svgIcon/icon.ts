import SvgIcon from "@/components/svgIcon/index.vue";
import { type App } from "vue";
export const signSvgIcon = (vue: App) => {
  vue.component("SvgIcon", SvgIcon);
};
