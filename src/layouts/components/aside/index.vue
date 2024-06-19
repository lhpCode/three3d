<script lang="ts" setup>
import { ref } from "vue";
import { useSystemStore } from "@/store/modules/system";

import Menu from "./menu.vue";
import SubMenu from "./subMenu.vue";
import MenuItem from "./menu-item.vue";

const systemStore = useSystemStore();
interface MenuList {
  key: string;
  label: string;
  title: string;
  icon?: string;
  children?: MenuList[] | undefined;
}
const getMenuList = (routerList: RouterRes[]): MenuList[] => {
  if (!routerList || routerList.length === 0) return [];
  return routerList.map((router: RouterRes): MenuList => {
    return {
      key: router.path,
      label: router.meta.title,
      title: router.path,
      icon: router?.meta?.icon,
      children: getMenuList(router.children),
    };
  });
};
const items = ref<MenuList[]>(getMenuList(systemStore.routerList));
</script>
<template>
  <div
    class="aside"
    :class="systemStore.isCollapse ? 'close-menu' : 'open-menu'"
  >
    <div class="log">
      <!-- <img class="log-image" src="/image/bd.jpg" /> -->
      <span class="log-name" v-show="!systemStore.isCollapse"
        >bd-admin-cli</span
      >
    </div>
    <Menu :isCollapse="systemStore.isCollapse">
      <div v-for="menu in items" :key="menu.key">
        <SubMenu
          :menu="menu"
          :isCollapse="systemStore.isCollapse"
          v-if="menu.children && menu.children.length > 0"
        />
        <MenuItem v-else :menuItem="menu" />
      </div>
    </Menu>
  </div>
</template>
<style lang="scss" scoped>
.aside {
  transition: width 0.35s;
  .close-menu {
    width: 64px;
  }
  .open-menu {
    width: 220px;
  }
  .log {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    background-color: var(--them-logo-bg-color);
    .log-image {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .log-name {
      margin-left: 10px;
      font-size: 18px;
      font-weight: 900;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
}
</style>
