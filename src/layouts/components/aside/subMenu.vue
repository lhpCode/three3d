<script lang="ts" setup>
import SvgIcon from "@/components/svgIcon/index.vue";
import { useSystemStore } from "@/store/modules/system";
const systemStore = useSystemStore();
import MenuItem from "./menu-item.vue";
const props = defineProps(["menu", "isCollapse", "view"]);
const styleIcon = {
  width: "20px",
  height: "20px",
  fontSize: "20px",
};
</script>
<template>
  <el-sub-menu
    :index="props.menu.key"
    v-if="menu.children && menu.children.length > 0"
    :key="props.menu.key"
  >
    <template #title>
      <SvgIcon :iconName="menu.icon" :styleIcon="styleIcon" />
      <span v-if="!systemStore.isCollapse || props.view">{{ menu.label }}</span>
    </template>

    <div v-for="menuItem in menu.children" :key="menuItem.key">
      <SubMenu
        :view="true"
        :menu="menuItem"
        :isCollapse="systemStore.isCollapse"
        v-if="menuItem.children && menuItem.children.length > 0"
      />
      <div class="my-menu" v-else>
        <MenuItem :menuItem="menuItem" />
      </div>
    </div>
  </el-sub-menu>
</template>
<style lang="scss" scoped>
.el-menu-vertical-demo {
  border: 0 !important;
}
:deep(.el-sub-menu__title) {
  color: var(--them-menu-font-color) !important;
}
</style>
