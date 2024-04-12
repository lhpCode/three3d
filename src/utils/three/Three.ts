import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// "three": "^0.160.0",
// 渲染组合器
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// 渲染通道
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
// 发光描边
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
// SMAA抗锯齿通道
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
// 伽马校正
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

import { Params, Vector3, FnRenderType } from "./interface/index";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

// import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import { MoveTo } from "./utils/index";
class Raycaster {
  protected readonly event: any;
  protected readonly camera: THREE.PerspectiveCamera;
  constructor(event: any, camera: THREE.PerspectiveCamera) {
    this.event = event;
    this.camera = camera;
  }
  init() {
    const raycaster = new THREE.Raycaster(
      this.camera.position,
      this.normalize(),
    );
    raycaster.camera = this.camera;
    return raycaster;
  }
  protected normalize = () => {
    const vector = new THREE.Vector3(
      (this.event.offsetX / window.innerWidth) * 2 - 1,
      -(this.event.offsetY / window.innerHeight) * 2 + 1,
      0.5,
    ); //三维坐标对象
    vector.unproject(this.camera);
    return vector.sub(this.camera.position).normalize();
  };
}

class Controls {
  public readonly controls: any;
  constructor(
    camera: THREE.PerspectiveCamera,
    domElement: HTMLCanvasElement,
    params: Params,
  ) {
    const controls = new OrbitControls(camera, domElement);
    const {
      enableZoom = true,
      zoomSpeed = 0.5,
      enableDamping = true,
      maxDistance = 1000,
      minDistance = 30,
      rotateSpeed = 0.5,
      maxPolarAngle = Math.PI / 2,
      maxAzimuthAngle = Math.PI / 4,
      minAzimuthAngle = -Math.PI / 4,
    } = params.controls || {};
    controls.enableZoom = enableZoom; // 启用或禁用摄像机的缩放。
    controls.zoomSpeed = zoomSpeed; // 摄像机缩放的速度
    controls.enableDamping = enableDamping; //启用阻尼
    controls.maxDistance = maxDistance ? maxDistance : params.far; // 相机向外移动多少
    controls.minDistance = minDistance; // 相机向内移动多少
    controls.rotateSpeed = rotateSpeed; //旋转的速度
    controls.maxPolarAngle = maxPolarAngle; //垂直旋转的角度的上限，范围是0到Math.PI
    controls.maxAzimuthAngle = maxAzimuthAngle; //水平旋转的角度的上限，范围是-Math.PI到Math.PI（或Infinity无限制）
    controls.minAzimuthAngle = minAzimuthAngle; //水平旋转的角度的下限，范围是-Math.PI到Math.PI（或-Infinity无限制），
    controls.screenSpacePanning = false;
    this.controls = controls;
  }
}

export default class Thre3d {
  protected readonly params: Params;
  public scene: THREE.Scene; // 网格
  public camera: THREE.PerspectiveCamera | null; // 相机
  public renderer: THREE.WebGLRenderer | null; // WebGL渲染器
  protected directionalLight: THREE.DirectionalLight | null; // 模拟太阳光
  private fnEvent: Map<FnRenderType, Function>; // 事件类型函数
  public width: number;
  public height: number;
  protected controls: any; // 轨道控制器
  protected composer: any;
  protected dome: HTMLElement | null;
  protected cameraPositionsFn: Function | null;
  protected cameraLookAtFn: Function | null;
  labelRenderer: any;
  css3Renderer: any;
  constructor(params: Params) {
    this.params = params;
    this.cameraPositionsFn = null;
    this.cameraLookAtFn = null;
    this.width = 0;
    this.height = 0;
    this.labelRenderer = null;
    this.css3Renderer = null;
    this.dome = null;
    this.directionalLight = null;
    this.fnEvent = new Map<FnRenderType, Function>();
    this.controls = null;
    this.composer = null;
    this.renderer = null;
    this.camera = null;
    this.scene = new THREE.Scene();
    this.#init();
  }
  #init() {
    this.dome = document.querySelector(`#${this.params.id}`);
    if (!this.dome) return;
    this.width = this.dome.clientWidth; //宽度
    this.height = this.dome.clientHeight; //高度
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.width / this.height,
      1,
      this.params.far ? this.params.far : 10000,
    );
    this.renderer = new THREE.WebGLRenderer({
      alpha: true, //渲染器透明
      antialias: true, //抗锯齿
      precision: "highp", //着色器开启高精度
      logarithmicDepthBuffer: true, // 是否使用对数深度缓存
    });
    this.renderer.render(this.scene, this.camera); //执行渲染操作
    this.scene.fog = new THREE.Fog(0xffffff, 400, 10000);
    this.dome.addEventListener("click", this.#onMouseClick, false); //点击事件
    // WebGL渲染器
    const renderer = this.renderer;
    //开启HiDPI设置
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.dome.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();

    labelRenderer.domElement.style.position = "absolute";
    // 相对标签原位置位置偏移大小
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.left = "0px";
    labelRenderer.domElement.style.pointerEvents = "none";
    this.labelRenderer = labelRenderer;
    this.dome.appendChild(labelRenderer.domElement);

    // 创建一个CSS3渲染器CSS3DRenderer
    const css3Renderer = new CSS3DRenderer();

    // HTML标签<div id="tag"></div>外面父元素叠加到canvas画布上且重合
    css3Renderer.domElement.style.position = "absolute";
    css3Renderer.domElement.style.top = "0px";
    //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
    css3Renderer.domElement.style.pointerEvents = "none";
    this.css3Renderer = css3Renderer;
    this.dome.appendChild(css3Renderer.domElement);
    this.initControls();
    this.#reset();

    this.#setScene();
  }
  // 添加发光通道
  addEffectComposer = () => {
    const effectColorSpaceConversion = new ShaderPass(GammaCorrectionShader);
    const composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);
    const outlinePass = new OutlinePass(
      new THREE.Vector2(this.width, this.height),
      this.scene,
      this.camera,
    );
    //模型描边颜色，默认白色
    outlinePass.visibleEdgeColor.set(0xffff00);
    //高亮发光描边厚度
    outlinePass.edgeThickness = 4;
    //高亮描边发光强度
    outlinePass.edgeStrength = 6;
    //模型闪烁频率控制，默认0不闪烁
    outlinePass.pulsePeriod = 2;
    composer.addPass(outlinePass);
    const pixelRatio = this.renderer!.getPixelRatio();
    // SMAA抗锯齿通道
    const smaaPass = new SMAAPass(
      this.width * pixelRatio,
      this.height * pixelRatio,
    );
    composer.addPass(smaaPass);

    this.renderer!.domElement.style.touchAction = "none";
    this.renderer!.domElement.addEventListener("pointermove", onPointerMove);
    const mouse = new THREE.Vector2();
    let selectedObjects: THREE.Object3D[] = [];
    function onPointerMove(event: any) {
      if (event.isPrimary === false) return;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      checkIntersection();
    }
    const raycaster = new THREE.Raycaster();
    const checkIntersection = () => {
      raycaster.setFromCamera(mouse, this.camera!);
      const intersects = raycaster.intersectObject(this.scene, true);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        addSelectedObject(selectedObject);
        outlinePass.selectedObjects = selectedObjects;
      } else {
        // outlinePass.selectedObjects = [];
      }
    };
    function addSelectedObject(object: THREE.Object3D) {
      selectedObjects = [];
      selectedObjects.push(object);
    }
    composer.addPass(effectColorSpaceConversion);
    this.composer = composer;
  };
  #setScene = () => {
    this.scene.background = new THREE.Color(0x333333);
    // 雾
    // // this.scene.fog = new THREE.Fog(0x333333, 10, 15);
    // 环境光
    // this.scene.environment = new RGBELoader().load(
    //   "https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr",
    // );
    // this.scene.environment.mapping = THREE.EquirectangularReflectionMapping;
    // 天空
    // 注释，有需要自己添加背景图
    // this.scene.background = new THREE.CubeTextureLoader()
    //   .setPath("/texture/sky/")
    //   .load([
    //     "sky.left.jpg",
    //     "sky.right.jpg",
    //     "sky.top.jpg",
    //     "sky.bottom.jpg",
    //     "sky.back.jpg",
    //     "sky.front.jpg",
    //   ]);
    // 辅助坐标系
    const AxesHelper = new THREE.AxesHelper(10000);
    AxesHelper.name = "辅助坐标系";
    this.scene.add(AxesHelper);
  };
  //点击事件
  #onMouseClick = (event: any) => {
    event.preventDefault();
    const raycaster = new Raycaster(event, this.camera!).init();
    const intersects = raycaster.intersectObjects(this.scene.children);
    const selected = intersects[0]; //intersects是射线沿着摄像机机镜头的方向穿过的所有物体，这里取第一个物体
    if (!selected) return;
    const {
      object: { type },
    } = selected;
    const x = Math.floor(selected.point.x * 100) / 100;
    const y = Math.floor(selected.point.y * 100) / 100;
    const z = Math.floor(selected.point.z * 100) / 100;
    console.log("x:" + x + ",y:" + y + ",z:" + z);
    let returnFlag = false;
    let sFn, mFn;
    switch (type) {
      case "Sprite":
        sFn = this.fnEvent.get("spriteClick");
        if (sFn) sFn(selected);
        returnFlag = true;
        console.log("精灵图", selected);
        break;
      case "Mesh":
        mFn = this.fnEvent.get("modelClick");
        if (mFn) mFn(selected);
        break;
      default:
        console.log("暂未定义的类型", type);
    }
    if (returnFlag) return;
    const cFn = this.fnEvent.get("click");
    if (cFn) cFn(new THREE.Vector3(x, y, z));
  };
  #onMouseMove = (event: any) => {
    event.preventDefault();
    const raycaster = new Raycaster(event, this.camera!).init();
    const intersects = raycaster.intersectObjects(this.scene.children);
    const selected = intersects[0]; //intersects是射线沿着摄像机机镜头的方向穿过的所有物体，这里取第一个物体
    if (!selected) return;
    const x = Math.floor(selected.point.x * 1000) / 1000;
    const y = Math.floor(selected.point.y * 1000) / 1000;
    const z = Math.floor(selected.point.z * 1000) / 1000;
    const address = new THREE.Vector3(x, y, z);
    const mFn = this.fnEvent.get("mouseMove");
    if (mFn) mFn(address);
    return address;
  };
  render = () => {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera!); //执行渲染操作
    }
    if (this.composer) {
      this.composer.render(this.scene, this.camera);
    }
    if (this.labelRenderer) {
      this.labelRenderer.render(this.scene, this.camera);
    }
    if (this.css3Renderer) {
      this.css3Renderer.render(this.scene, this.camera);
    }
    if (this.controls) {
      this.controls.update();
    }
    if (this.cameraPositionsFn) {
      this.cameraPositionsFn();
    }
    if (this.cameraLookAtFn) {
      this.cameraLookAtFn();
    }
  };
  resize = () => {
    this.dome = document.querySelector(`#${this.params.id}`);
    if (!this.dome) return;
    this.width = this.dome.clientWidth; //宽度
    this.height = this.dome.clientHeight; //高度
    this.#reset();
  };
  #reset = () => {
    this.camera!.aspect = this.width / this.height;
    this.camera!.updateProjectionMatrix();
    this.renderer!.setSize(this.width, this.height);
    this.labelRenderer.setSize(this.width, this.height);
    this.css3Renderer.setSize(this.width, this.height);
  };
  /** 平行光
   * @param {Vector3} position 坐标
   * @param {boolean} intensity  光线强度
   */
  addSun(position: Vector3 | undefined, intensity: number | undefined = 2.5) {
    const { x = 2000, y = 40000, z = 2000 } = position || {};
    if (this.params.shadow) {
      const directionalLight = new THREE.DirectionalLight(0xffffff, intensity); // 新建一个平行光源，颜色未白色，强度为1
      directionalLight.position.set(x, y, z); // 将此平行光源调整到一个合适的位置
      directionalLight.castShadow = true; // 将此平行光源产生阴影的属性打开
      const d = 100; //阴影范围 // 设置平行光的的阴影属性，即一个长方体的长宽高，在设定值的范围内的物体才会产生阴影
      directionalLight.shadow.camera.left = -d;
      directionalLight.shadow.camera.right = d;
      directionalLight.shadow.camera.top = d;
      directionalLight.shadow.camera.bottom = -d;
      directionalLight.shadow.camera.near = 20;
      directionalLight.shadow.camera.far = 8000;
      directionalLight.shadow.mapSize.x = 2048; // 定义阴影贴图的宽度和高度,必须为2的整数此幂
      directionalLight.shadow.mapSize.y = 2048; // 较高的值会以计算时间为代价提供更好的阴影质量
      directionalLight.shadow.bias = -0.0005; //解决条纹阴影的出现
      this.directionalLight = directionalLight;
      directionalLight.name = "sunShadow";
      this.scene.add(directionalLight); // 将此平行光源加入场景中，我们才可以看到这个光源
    } else {
      const group = new THREE.Group();
      group.name = "sun";

      for (let i = 0; i < 4; i++) {
        const directionalLight1 = new THREE.DirectionalLight(
          0xffffff,
          intensity / 4,
        );
        switch (i) {
          case 0:
            directionalLight1.position.set(x, y, z);
            break;
          case 1:
            directionalLight1.position.set(-x, y, z);
            break;
          case 2:
            directionalLight1.position.set(x, y, -z);
            break;
          case 3:
            directionalLight1.position.set(-x, y, -z);
            break;
          default:
            break;
        }
        group.add(directionalLight1);
      }

      this.scene.add(group);
    }
  }
  // 注册事件
  on(type: FnRenderType, fn: Function) {
    this.fnEvent.set(type, fn);
  }
  // 移除事件
  removeOn(type: FnRenderType) {
    const m = this.fnEvent.get(type);
    if (m) this.fnEvent.delete(type);
  }
  /**
   * 切换视角
   * @param {Vector3} position  position目的坐标
   * @param {boolean} animation  是否启动动画
   * @param {Function} callback  到达目的回调函数
   */
  setCameraPositions = (
    position: Vector3,
    animation?: boolean,
    callback?: Function,
  ) => {
    if (!animation) {
      this.cameraPositionsFn = null;
      this.camera!.position.set(position.x, position.y, position.z);
      if (callback) callback();
      return;
    }
    const endPosition = new THREE.Vector3(position.x, position.y, position.z); // 结束位置
    const M = new MoveTo(this.camera!.position, endPosition, 5);
    const target = JSON.parse(JSON.stringify(this.controls.target));
    this.cameraPositionsFn = () => {
      this.controls.target.set(0, 0, 0);
      this.controls.update();
      const manhattanDistanceTo = M.move();
      this.controls.target.set(target.x, target.y, target.z);
      this.controls.update();
      if (manhattanDistanceTo < 1) {
        this.cameraPositionsFn = null;
      }
      //
    };
  };
  /**切换注视点
   * @param {Vector3} position  position目的坐标
   * @param {boolean} animation  是否启动动画
   * @param {Function} callback  到达目的回调函数
   * @returns
   */
  setCameraLookAt = (
    position: Vector3,
    animation?: boolean,
    callback?: Function,
  ) => {
    if (!animation) {
      if (!this.camera) return;
      this.cameraLookAtFn = null;
      this.camera.lookAt(position.x, position.y, position.z);
      if (!this.controls) return;
      this.controls.target.set(position.x, position.y, position.z);
      if (callback) callback();
      return;
    }
    const endPosition = new THREE.Vector3(position.x, position.y, position.z); // 结束位置
    const M = new MoveTo(this.controls.target, endPosition, 30);
    this.cameraLookAtFn = () => {
      const manhattanDistanceTo = M.move();
      if (manhattanDistanceTo < 1) {
        this.controls.target.copy(endPosition);
        this.cameraLookAtFn = null;
        if (callback) callback();
      }
    };
  };
  removeControls() {
    if (!this.controls) return;
    this.controls.object = null;
    this.controls = null;
  }
  initControls() {
    if (!this.camera || !this.renderer) return;
    const {
      cameraPosition: { x = 0, y = 100, z = 200 },
      lookAt,
    } = this.params;
    const { x: lookAtX = 0, y: lookAtY = 0, z: lookAtZ = 0 } = lookAt || {};
    // 设置相机控件轨道控制器OrbitControls
    const controls = new Controls(
      this.camera,
      this.renderer.domElement,
      this.params,
    ).controls;
    controls.target.set(lookAtX, lookAtY, lookAtZ);
    this.controls = controls;
    this.camera.lookAt(lookAtX, lookAtY, lookAtZ);
    this.camera.position.set(x, y, z);
    this.controls.update();
  }
  getScene() {
    return this.scene;
  }
  sceneAdd(any: any) {
    this.scene.add(any);
  }
}
