import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// import router from "@/router";
import "@/router/protector";
import "@/styles/index.scss";
import { signSvgIcon } from "@/components/svgIcon/icon";
import { hasPermission } from "@/utils/index";
import { initStore } from "@/store/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
signSvgIcon(app);
initStore(app);
// app.use(router);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
// router.isReady().then(() => {});
//自定义按钮指令
app.directive("auth", {
  mounted(el, binding) {
    hasPermission(el, binding);
  },
});
