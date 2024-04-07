<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useSystemStore } from "@/store/modules/system";

import { ref, watch } from "vue";
import { getCssValue } from "@/utils/index";

const systemStore = useSystemStore();
const router = useRouter();
const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const addTabBar = (path: string) => {
  const routerList = router.getRoutes();
  const tab = routerList.find((item) => item.path === path);
  if (!tab) return;

  systemStore.addTabBar({
    path: tab.path,
    name: tab.meta.title,
  });
};
addTabBar("/home");
const select = (v) => {
  v.indexOf("https") === -1 ? router.push(v) : window.open(v);
  addTabBar(v);
};
const textColor = ref("");
const backgroundColor = ref("");
watch(
  () => systemStore.themeValue,
  () => {
    textColor.value = getCssValue("--them-menu-font-color");
    backgroundColor.value = getCssValue("--them-menu-bg-color");
  },
  { immediate: true },
);

const defaultActive = ref(router.currentRoute.value.fullPath);
</script>
<template>
  <el-menu
    :class="{ 'a-menu': props.isCollapse }"
    :collapse-transition="false"
    :collapse="props.isCollapse"
    active-text-color="#ffffff"
    :text-color="textColor"
    :background-color="backgroundColor"
    class="el-menu-vertical-demo"
    :default-active="defaultActive"
    :show-timeout="0"
    :hide-timeout="0"
    @select="select"
  >
    <slot />
  </el-menu>
</template>
<style lang="scss" scoped>
.el-menu-vertical-demo {
  width: 100%;
  border: 0 !important;
}
</style>
