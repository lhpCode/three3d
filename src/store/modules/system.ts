import { defineStore } from "pinia";
import { store } from "../index";
import router from "@/router";

interface TabBar {
  path: string;
  name: string;
}

interface State {
  lang: string;
  themeValue: string;
  isCollapse: boolean;
  removeRouterList: Function[];
  routerList: RouterRes[];
  tabBarList: TabBar[];
}
export const useSystemStore = defineStore({
  id: "system",
  state: (): State => ({
    lang: "zhCN",
    themeValue: "normal",
    isCollapse: false,
    removeRouterList: [],
    routerList: [],
    tabBarList: [],
  }),
  actions: {
    setLang(lang: any) {
      this.lang = lang;
    },
    addTabBar(tab: TabBar) {
      const find = this.tabBarList.find(
        (item: TabBar) => item.path === tab.path,
      );
      if (find) return;
      this.tabBarList.push(tab);
    },
    delTabbar(path: string) {
      this.tabBarList = this.tabBarList.filter(
        (item: TabBar) => item.path !== path,
      );
      if (
        path === window.location.hash.replace("#", "") &&
        this.tabBarList.length > 0
      ) {
        router.push(this.tabBarList[this.tabBarList.length - 1].path);
      }
    },
    switchCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    resetSystem() {
      this.removeRouterList.forEach((item: Function) => item());
      this.removeRouterList = [];
      this.tabBarList = [];
    },
    setRouterList(routerList: any) {
      this.routerList = routerList;
    },
    addRemoveRouterList(router: Function) {
      this.removeRouterList.push(router);
    },
  },
  persist: {
    paths: ["isCollapse", "routerList", "tabBarList", "themeValue", "lang"],
  },
});

export const useSystemStoreWithOut = () => {
  return useSystemStore(store);
};
