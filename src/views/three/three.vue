<script lang="ts" setup>
import { onMounted, ref } from "vue";
import modelThree from "@/utils/three/index";
import * as THREE from "three";

const officeThree = ref<modelThree | null>(null);
const params = {
  id: "office",
  cameraPosition: {
    x: 1,
    y: 0.3,
    z: 0,
  },
  lookAt: { x: 0, y: 0, z: 0 },
  timeMultiply: 0, // 31.4秒一圈的倍率仅 shadow为true有效
  shadow: false, // 阴影
  // far: 10000; // 摄像机视锥体远端面
  lightPostion: { x: 0, y: 10, z: 10 },
  intensity: 7, // 光照强度
  // bgImageArray: string[] // 背景图
  controls: {
    //相机控制器
    enableZoom: true, // 启用或禁用摄像机的缩放。==>true
    zoomSpeed: 1, // 摄像机缩放的速度 ==>0.5
    enableDamping: true, //启用阻尼   ==> true
    maxDistance: 100, // 相机向外移动多少 ==> 1000
    minDistance: 10, // 相机向内移动多少  ==> 30
    rotateSpeed: 0.1, // 旋转的速度  ==> 0.5
    maxPolarAngle: Math.PI / 2, // 垂直旋转的角度的上限，范围是0到Math.PI  ==> Math.PI / 2
    maxAzimuthAngle: Math.PI, // 水平旋转的角度的上限，范围是-Math.PI到Math.PI（或Infinity无限制）  ==> Math.PI / 4,
    minAzimuthAngle: -Math.PI, // 水平旋转的角度的下限，范围是-Math.PI到Math.PI（或-Infinity无限制）  ==> -Math.PI / 4,
  },
};
let grid;
const loadModel = (url: string) => {
  if (!officeThree.value) return;
  officeThree.value.ModelThree.loadModel(
    {
      name: "car", // 模型名
      url: url, // 模型路径
      position: { x: 0, y: 0, z: 0 }, // 模型坐标
      scale: { x: 1, y: 1, z: 1 }, // 模型缩放比例
      DRACO: "https://threejs.org/examples/jsm/libs/draco/gltf/",
      rotation: { x: 0, y: 0, z: 0 }, // 模型旋转弧度
    },
    () => {
      const glass = officeThree.value.ModelThree.getModel("glass");
      if (!glass) return;
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.25,
        roughness: 0,
        transmission: 1.0,
      });
      glass.material = glassMaterial;
      carWheelRun();

      grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
      grid.material.opacity = 0.2;
      grid.material.depthWrite = false;
      grid.material.transparent = true;

      officeThree.value.Three.scene.add(grid);
    },
  );
};

const carWheelRun = () => {
  const model = [];
  const wheel_fl = officeThree.value.ModelThree.getModel("wheel_fl");
  if (!wheel_fl) return;
  const wheel_fr = officeThree.value.ModelThree.getModel("wheel_fr");
  const wheel_rl = officeThree.value.ModelThree.getModel("wheel_rl");
  const wheel_rr = officeThree.value.ModelThree.getModel("wheel_rr");
  model.push(wheel_fl, wheel_fr, wheel_rl, wheel_rr);

  setInterval(() => {
    for (let i = 0; i < model.length; i++) {
      const time = -new Date() / 2000;
      model[i].rotation.x = time * Math.PI * 2;
      grid.position.z = -time % 1;
    }
  }, 100);
};

const initThree3d = () => {
  officeThree.value = new modelThree(params);
  loadModel("https://threejs.org/examples/models/gltf/ferrari.glb");
};

onMounted(() => {
  initThree3d();
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
</style>
