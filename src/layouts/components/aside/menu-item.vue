<script lang="ts" setup>
import SvgIcon from "@/components/svgIcon/index.vue";

const props = defineProps(["menuItem"]);
const styleIcon = {
  width: "20px",
  height: "20px",
  fontSize: "20px",
};
</script>
<template>
  <div class="my-menu">
    <el-menu-item :index="props.menuItem.key" :key="props.menuItem.key">
      <SvgIcon :iconName="props.menuItem.icon" :styleIcon="styleIcon" />
      <template #title>
        <span> {{ props.menuItem.label }}</span>
      </template>
    </el-menu-item>
  </div>
</template>

<style lang="scss" scoped>
.my-menu {
  box-sizing: border-box;
  .is-active {
    border-radius: 4px;
    background-color: #1677ff;
    color: var(--them-menu-font-color) !important;
  }

  :deep(.el-menu-item) {
    color: var(--them-menu-font-color);
    &:hover {
      opacity: 0.7;
      color: var(--them-menu-font-color) !important;
      background-color: var(--them-menu-hove-color);
      border-radius: 4px;
    }
  }
}
</style>
