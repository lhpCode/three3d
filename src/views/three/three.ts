import modelThree from "@/utils/three/index";
import { Patrol } from "@/utils/three/utils/index";
const params = {
  id: "office",
  cameraPosition: {
    x: 0,
    y: 120,
    z: 0,
  },
  lookAt: { x: 0, y: 0, z: 0 },
  timeMultiply: 0, // 31.4秒一圈的倍率仅 shadow为true有效
  shadow: false, // 阴影
  // far: 10000; // 摄像机视锥体远端面
  lightPostion: { x: 0, y: 0, z: 10 },
  intensity: 7, // 光照强度
  // bgImageArray: string[] // 背景图
  controls: {
    //相机控制器
    enableZoom: true, // 启用或禁用摄像机的缩放。==>true
    zoomSpeed: 1, // 摄像机缩放的速度 ==>0.5
    enableDamping: true, //启用阻尼   ==> true
    maxDistance: 1000, // 相机向外移动多少 ==> 1000
    minDistance: 10, // 相机向内移动多少  ==> 30
    rotateSpeed: 0.1, // 旋转的速度  ==> 0.5
    maxPolarAngle: Math.PI / 2, // 垂直旋转的角度的上限，范围是0到Math.PI  ==> Math.PI / 2
    maxAzimuthAngle: Math.PI, // 水平旋转的角度的上限，范围是-Math.PI到Math.PI（或Infinity无限制）  ==> Math.PI / 4,
    minAzimuthAngle: -Math.PI, // 水平旋转的角度的下限，范围是-Math.PI到Math.PI（或-Infinity无限制）  ==> -Math.PI / 4,
  },
};
export const initThree3d = () => {
  const officeThree = new modelThree(params);
  officeThree.Three.addSun(
    {
      x: 100,
      y: 100,
      z: 100,
    },
    10,
  );
  return officeThree;
};

const array = [
  { x: -13.92, y: 1, z: -3.11 },
  { x: -16.19, y: 1, z: -3.14 },
  { x: -19.99, y: 1, z: -3.14 },
  { x: -20.21, y: 1, z: 1.29 },
  { x: -20.44, y: 1, z: 5.32 },
  { x: -20.03, y: 1, z: 11.69 },
  { x: -17.2, y: 1, z: 11.73 },
  { x: -13.86, y: 1, z: 11.73 },
  { x: -10.97, y: 1, z: 12.02 },
  { x: -6.52, y: 1, z: 12.43 },
  { x: -3.09, y: 1, z: 12.63 },
  { x: 0.25, y: 1, z: 12.57 },
  { x: 3.44, y: 1, z: 12.62 },
  { x: 3.74, y: 1, z: 15.77 },
  { x: 4.07, y: 1, z: 16.97 },
  { x: 5.12, y: 1, z: 17.38 },
  { x: 7.33, y: 1, z: 17.26 },
  { x: 7.23, y: 1, z: 12.92 },
  { x: 8.3, y: 1, z: 12.48 },
  { x: 10.83, y: 1, z: 12.47 },
  { x: 14.93, y: 1, z: 12.57 },
  { x: 17.15, y: 1, z: 12.5 },
  { x: 17.08, y: 1, z: 11.75 },
  { x: 14.29, y: 1, z: 11.76 },
  { x: 8.82, y: 1, z: 11.89 },
  { x: 4.62, y: 1, z: 11.73 },
  { x: -0.45, y: 1, z: 11.81 },
  { x: -4.75, y: 1, z: 11.85 },
  { x: -11.43, y: 1, z: 11.81 },
  { x: -15.83, y: 1, z: 11.75 },
  { x: -16.39, y: 1, z: 9.98 },
  { x: -16.11, y: 1, z: 5.12 },
  { x: -16.29, y: 1, z: -2.27 },
];

export const actionPointArray = async (officeThree: modelThree) => {
  if (!officeThree) return;
  officeThree.SpriteThree.addLine(array);
  const p = new Patrol({
    three3D: officeThree,
    coordArray: array,
    meshName: "测试",
    isFirstPerson: false,
    factor: 1,
    modelType: "mash",
  });
  return p;
};

export const camera = (officeThree: modelThree | undefined | null) => {
  if (!officeThree) return;
  officeThree.Three.setCameraPositions(params.cameraPosition);
  officeThree.Three.setCameraLookAt(params.lookAt);
  officeThree.Three.removeControls();
  officeThree.Three.initControls();
};
export const createElement = (style: any): HTMLElement => {
  const element = document.createElement("div");
  for (const [key] of Object.entries(style)) {
    element.style[key] = style[key];
  }
  document.querySelector("body")!.appendChild(element);
  return element;
};

export const loadingThree3D = (
  element: HTMLElement,
  canvas: HTMLElement,
  flag: boolean,
) => {
  if (flag) {
    element.innerHTML = "";
    element.appendChild(canvas);
  } else {
    element.remove();
  }
};
