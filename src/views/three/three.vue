<script lang="ts" setup>
import { onMounted } from "vue";

import { initThree3d, createElement, loadingThree3D } from "./three";
import modelThree from "@/utils/three/index";

const loadElement = createElement({
  width: window.innerWidth + "px",
  height: window.innerHeight + "px",
  position: "fixed",
  left: "0px",
  top: "0px",
  zIndex: "999999",
});

const loadCallback = (v: { loader: number; renderStatus: boolean }) => {
  if (!Three) return;
  const progress = {
    name: "标签2",
    percentage: 0,
    status: "加载资源中",
    customColor: "#00F3B8",
  };
  let c = Three.SpriteThree.createLoading(
    progress.status,
    0,
    progress.customColor,
  );
  try {
    if (!v) {
      console.log("模型加载失败");
      Three.SpriteThree.deleteLabel(progress.name);
    }
    const { loader, renderStatus } = v;
    c = Three.SpriteThree.createLoading(
      progress.status,
      loader,
      progress.customColor,
    );
    progress.percentage = loader;
    if (loader < 100) {
      progress.status = "加载资源中";
      progress.customColor = "#00F3B8";
    } else if (!renderStatus) {
      progress.status = "渲染中";
      progress.customColor = "#e2b35c";
    } else {
      progress.status = "渲染完成";
      progress.customColor = "#74bd49";
      loadingThree3D(loadElement, c, false);
      return;
    }
    loadingThree3D(loadElement, c, true);
  } catch (err) {
    loadingThree3D(loadElement, c, false);
  }
};
const loadGltf = () => {
  if (!Three) return;
  Three.ModelThree.loadModel(
    {
      name: "office_1",
      url: "https://192.168.1.53:8080/webdispatcher/office.glb",
      position: { x: 0, y: 0, z: 0 },
    },
    loadCallback,
  );
};

let Three: modelThree | null = null;

onMounted(async () => {
  Three = initThree3d();
  loadGltf();
});
</script>
<template>
  <div>
    <div id="office" />
  </div>
</template>
<style lang="scss" scoped>
#office {
  width: 100vw;
  height: 100vh;
}
.controls {
  top: 0;
  right: 0;
  position: fixed;
  display: flex;
  .btn {
    margin: 10px 10px;
    width: 120px;
    height: 40px;
    background-color: #fff;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
  }
}
</style>
