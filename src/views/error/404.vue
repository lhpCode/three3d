<script lang="ts" setup>
import SvgIcon from "@/components/svgIcon/index.vue";
const styleIcon = {
  width: "220px",
  height: "220px",
  fontSize: "220px",
};
</script>
<template>
  <div class="err-404 flex-center">
    <SvgIcon iconName="#404" :styleIcon="styleIcon" />
    <div class="text">已与舰队失联</div>
  </div>
</template>
<style lang="scss" scoped>
.err-404 {
  flex-direction: column;
  width: 100vw;
  color: #c7c5c5;
  font-size: 32px;
  font-family: serif;
}
</style>
