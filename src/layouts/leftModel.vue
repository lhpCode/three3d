<script lang="ts" setup>
import headLay from "./components/head/index.vue";
import asideLay from "./components/aside/index.vue";
import mainLay from "./components/main/index.vue";
</script>
<template>
  <div class="left-model">
    <div class="aside">
      <asideLay />
    </div>
    <div class="conter">
      <div class="head-lay">
        <headLay />
      </div>
      <div class="main">
        <mainLay />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.left-model {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-image: var(--them-image-url);
  overflow: hidden;
}
.aside {
  height: 100vh;
}
.conter {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.main {
  padding: 10px;
  flex: 1;
  box-sizing: border-box;
}
</style>
