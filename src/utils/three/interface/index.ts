interface Controls {
  enableZoom?: boolean; // 启用或禁用摄像机的缩放。==>true
  zoomSpeed?: number; // 摄像机缩放的速度 ==>0.5
  enableDamping?: boolean; //启用阻尼   ==> true
  maxDistance?: number; // 相机向外移动多少 ==> 1000
  minDistance?: number; // 相机向内移动多少  ==> 30
  rotateSpeed?: number; // 旋转的速度  ==> 0.5
  maxPolarAngle?: number; // 垂直旋转的角度的上限，范围是0到Math.PI  ==> Math.PI / 2
  maxAzimuthAngle?: number; // 水平旋转的角度的上限，范围是-Math.PI到Math.PI（或Infinity无限制）  ==> Math.PI / 4,
  minAzimuthAngle?: number; // 水平旋转的角度的下限，范围是-Math.PI到Math.PI（或-Infinity无限制）  ==> -Math.PI / 4,
}
export interface Params {
  id: string;
  cameraPosition: Vector3; // 相机坐标
  lookAt?: Vector3; // 相机视角
  timeMultiply?: number; // 模拟太阳光旋转时间倍率  timeMultiply * 31.4秒 仅 shadow为true有效
  shadow?: boolean; // 阴影
  far?: number; // 摄像机视锥体远端面
  lightPostion?: Vector3; // 光照高度
  intensity?: number; // 光照强度
  bgImageArray?: string[]; // 背景图
  controls?: Controls; //相机控制器
}
export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export interface SetModel {
  name: string;
  position: Vector3;
}

export interface ModelParams {
  name: string; // 模型名
  url: string; // 模型路径
  KTX2?: string; //KTX2材质
  position: Vector3; // 模型坐标
  scale?: Vector3; // 模型缩放比例
  rotation?: Vector3; // 模型旋转弧度
  activeAction?: string; //模型默认播放动画
  DRACO?: string;
}

export interface ModelMove {
  name: string;
  speed: number[];
  dt: number;
}

// 注册回调事件类型,点击事件click和渲染事件render,精灵图点击spriteClick，模型点击modelClick
export type FnRenderType = "click" | "spriteClick" | "modelClick" | "mouseMove";

export type ModelMap = {
  mode: any; // 模型
  actions: {
    // 播放动画使用
    [key: string]: THREE.AnimationAction;
  };
  mixerArray: THREE.AnimationMixer[]; // 推进混合器时间并更新动画，在渲染循环中完成
};

export interface Loader {
  loaderStartTime: number; //加载开始时间
  loaderEndTime: number; // 加载结束时间
  loader: number; // 加载进度
  renderStatus: boolean; // 状态
  renderTime: null | number; // 渲染时间
}

export interface SpriteParams {
  value: string;
  x?: number;
  y?: number;
  z?: number;
  width?: number;
  height?: number;
  color?: string;
  zoom?: number;
  name?: string;
}

export interface ShapeGeometry {
  name: string; // 围栏名称 *唯一性
  visible?: boolean; // 围栏显示状态 默认显示
  type?: "curve" | "line" | "face"; // 围栏类型 ， curve曲线 line 直线 默认值为line
  color?: string; //"围栏颜色"
  linewidth?: number; // 围栏宽度
  linecap?: "butt" | "round" | "square"; // 两端的样式 默认值为 'round'
}

export type LabelType = "CSS2DObject" | "CSS3DObject" | "CSS3DSprite";

export interface LabelParams {
  name: string; // 标签名称 *唯一性
  type: LabelType; // 标签类型
  element: HTMLElement; // html
  position?: Vector3; // 坐标
  scale?: Vector3; // 缩放比例
}
