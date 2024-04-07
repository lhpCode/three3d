import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import {
  Vector3,
  SetModel,
  ModelParams,
  ModelMap,
  ShapeGeometry,
  Params,
} from "./interface/index";
import { MoveTo } from "./utils/index";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { addData, getData, openDB } from "./indexdb";

const rgbaToRgb = (color: string) => {
  const rgbaAttr = color.match(/[\d.]+/g);
  if (rgbaAttr && rgbaAttr.length >= 3) {
    const r = rgbaAttr[0];
    const g = rgbaAttr[1];
    const b = rgbaAttr[2];
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  return color;
};

// 根据rgba获取透明度
const getOpacity = (input: string) => {
  const regex = /\((.*?)\)/;
  const result = input.match(regex);
  if (result && result[1]) {
    const resultStr = result[1].split(",");
    if (resultStr.length === 4) {
      return Number(resultStr[3]);
    }
  }
  return null;
};
// 创建线
const createLineMesh = (color: string, linewidth: number, points: any) => {
  const material = new THREE.LineBasicMaterial({
    color: rgbaToRgb(color),
    linewidth,
    linecap: "round",
  });
  const geometry = new THREE.BufferGeometry().setFromPoints(points!);
  return new THREE.Line(geometry, material);
};
// 创建面模型的材质
const createFaceMaterial = (color: string) => {
  const opacity = getOpacity(color);
  const material = new THREE.MeshBasicMaterial({
    color: rgbaToRgb(color),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: opacity ? opacity : 1,
  });
  return material;
};
// 创建面
const createFaceMesh = (array: THREE.Vector3[], color: string) => {
  const heartShape = new THREE.Shape(
    array.map((item) => new THREE.Vector2(item.x, item.z)),
  );
  const geometry = new THREE.ShapeGeometry(heartShape);
  const material = createFaceMaterial(color);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
};

const getModelType = (url: string): string => {
  let pathname = "";
  if (URL) {
    const addr = new URL(url);
    pathname = addr.pathname;
  } else {
    pathname = url.split("?")[0];
  }
  return pathname.split(".")[1];
};
// 获取模型动画
const getActions = (
  animations: THREE.AnimationClip[],
  model: THREE.Object3D,
  activeAction: string = "",
) => {
  const actions: { [key: string]: THREE.AnimationAction } = {};
  const mixerArray: THREE.AnimationMixer[] = [];
  if (animations && animations.length > 0) {
    const mixer: THREE.AnimationMixer = new THREE.AnimationMixer(model);
    mixerArray.push(mixer);
    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      const action: THREE.AnimationAction = mixer.clipAction(clip);
      actions[clip.name] = action;
    }
    if (activeAction) {
      const activeActionPlay: THREE.AnimationAction = actions[activeAction];
      activeActionPlay.play();
    }
  }
  return {
    actions,
    mixerArray,
  };
};

// 设置阴影
const setShadow = (shadow: boolean | null | undefined, model: any) => {
  if (shadow) {
    model.traverse(function (object: {
      isMesh: any;
      castShadow: boolean;
      receiveShadow: boolean;
    }) {
      if (object.isMesh) object.castShadow = true;
      object.receiveShadow = true;
    });
  }
};

class Xhr {
  loaderStartTime: number;
  loaderEndTime: number;
  loader: number;
  renderStatus: boolean;
  renderTime: number | null;
  constructor() {
    this.loaderStartTime = +new Date(); //加载开始时间
    this.loaderEndTime = 0; // 加载结束时间
    this.loader = 0; // 加载进度
    this.renderStatus = false; // 状态
    this.renderTime = null; // 渲染时间
  }
  setLoader(loaded: number, total: number) {
    this.loader = (loaded / total) * 100;
  }
  setLoaderEndTime() {
    this.loaderEndTime = +new Date() - this.loaderStartTime;
  }
  setRenderTime() {
    this.renderTime = +new Date() - this.loaderStartTime - this.loaderEndTime;
    this.renderStatus = true;
  }
}

export default class ModelThree {
  private readonly modelMap: Map<string, ModelMap>; // 模型
  private readonly modelGroup: THREE.Group; // 模型组
  private readonly electronRailGroup: THREE.Group;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly params: Params;
  private readonly electronRail: Map<string, number[][]>; // 电子围栏坐标组
  private readonly loadingMap: Map<string, Xhr>;
  private db: any;
  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    params: Params,
    db: any,
  ) {
    this.db = db;
    this.params = params;
    this.scene = scene;
    this.camera = camera;
    this.modelGroup = new THREE.Group();
    this.modelGroup.name = "modelGroup";
    this.scene.add(this.modelGroup);
    this.electronRailGroup = new THREE.Group();
    this.electronRailGroup.name = "electronRailGroup";
    this.scene.add(this.electronRailGroup);
    this.renderer = renderer;
    this.modelMap = new Map<string, ModelMap>();
    this.loadingMap = new Map<string, Xhr>();
    this.electronRail = new Map<string, number[][]>();
  }
  render = (dt: any) => {
    if (this.modelMap) {
      this.modelMap.forEach((actionsValue: any) => {
        if (Object.hasOwn(actionsValue, "mixerArray")) {
          actionsValue["mixerArray"].forEach((item: any) => {
            item.update(dt);
          });
        }
      });
    }
  };
  /**加载模型
   * @param {ModelParams} modelParams // 加载模型参数
   * @param {Function} callBack // 加载状态回调
   */
  loadModel(modelParams: ModelParams, callBack?: Function) {
    const { url, name } = modelParams;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const load = (db: any) => {
      getData(db, "model", url)
        .then(async (v: any) => {
          let path = url;
          if (v) {
            path = URL.createObjectURL(v.model);
            that.dbLoad(
              {
                ...modelParams,
                url: path,
              },
              callBack,
            );
          } else {
            const loadXhr: Xhr | undefined = new Xhr();
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = () => {
              if (xhr.status === 200) {
                const arrayBuffer = xhr.response;
                const model = new Blob([arrayBuffer]);
                addData(db, "model", {
                  path: url,
                  model: model,
                });
                path = URL.createObjectURL(model);
                that.dbLoad(
                  {
                    ...modelParams,
                    url: path,
                  },
                  callBack,
                  loadXhr,
                );
              } else {
                that.dbLoad(modelParams, callBack);
              }
            };
            // 监听 onprogress 事件来获取请求进度
            xhr.onprogress = function (event) {
              if (event.lengthComputable) {
                loadXhr!.setLoaderEndTime();
                loadXhr!.setLoader(event.loaded, event.total);
                that.loadingMap.set(name, loadXhr!);
                if (callBack) {
                  callBack(that.loading());
                }
              } else {
                console.log("无法计算进度", event);
              }
            };

            xhr.onerror = function () {
              console.error("请求发生错误");
            };
            xhr.send(); // 发送请求
          }
        })
        .catch(() => {
          that.dbLoad(modelParams, callBack);
        });
    };
    if (this.db) {
      load(this.db);
    } else {
      openDB("threeDB", "model", 2)!.then((db) => {
        if (db) {
          this.db = db;
          load(db);
        } else {
          that.dbLoad(modelParams, callBack);
        }
      });
    }
  }
  // 加载模型
  dbLoad(modelParams: ModelParams, callBack?: Function, load?: Xhr) {
    const {
      KTX2,
      url,
      position: { x = 0, y = 0, z = 0 },
      scale,
      name,
      rotation,
      activeAction,
      DRACO,
    } = modelParams;

    let loader = null;
    const type: string = getModelType(url);
    if (type === "fbx") {
      loader = new FBXLoader();
    } else {
      loader = new GLTFLoader();
      if (DRACO) {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(DRACO);
        loader.setDRACOLoader(dracoLoader);
      }
    }
    if (KTX2) {
      const ktx2Loader = new KTX2Loader()
        .setTranscoderPath(KTX2)
        .detectSupport(this.renderer);
      loader.setKTX2Loader(ktx2Loader);
      loader.setMeshoptDecoder(MeshoptDecoder);
    }
    let loadXhr: Xhr | null | undefined = null;
    if (!load) {
      loadXhr = new Xhr();
    } else {
      loadXhr = load;
    }
    loader.load(
      url,
      (gltf: {
        scene: THREE.Group<THREE.Object3DEventMap>;
        animations: THREE.AnimationClip[];
      }) => {
        let model: any = null;
        if (gltf.scene) {
          model = gltf.scene;
        } else {
          model = gltf;
        }
        const { actions, mixerArray } = getActions(
          gltf.animations,
          model,
          activeAction,
        );
        setShadow(this.params.shadow, model);
        model.position.set(x, y, z);
        if (scale) {
          model.scale.set(scale.x, scale.y, scale.z);
        }
        if (rotation) {
          model.rotation.set(rotation.x, rotation.y, rotation.z);
        }
        this.modelMap.set(name, {
          mode: model,
          actions,
          mixerArray,
        });
        model.name = name;
        this.modelGroup.add(model);
        loadXhr!.setRenderTime();
        this.loadingMap.set(name, loadXhr!);
        if (callBack) {
          callBack(this.loading());
        }
      },
      (xhr: { loaded: number; total: number }) => {
        loadXhr!.setLoaderEndTime();
        loadXhr!.setLoader(xhr.loaded, xhr.total);
        this.loadingMap.set(name, loadXhr!);
        if (callBack) {
          callBack(this.loading());
        }
      },
      (err: any) => {
        console.log(err);

        if (callBack) {
          this.loadingMap.delete(name);
          callBack(null);
        }
      },
    );
  }

  /**播放模型动画
   * @param name 模型名称
   * @param playKey 播放动画的名称
   * @param flag // 暂停 false or 播放 true
   * @returns
   */
  playActiveAction(name: string, playKey: string, flag: boolean = true) {
    const model = this.modelMap.get(name);
    if (!model) return;
    const activeAction = model.actions[playKey];
    if (!activeAction) return;
    activeAction.clampWhenFinished = true;
    activeAction.loop = THREE.LoopOnce;
    activeAction.reset();
    flag ? activeAction.fadeIn(0.1).play() : activeAction.fadeIn(0.3).stop();
  }
  // 设置模型位置
  setModelPosition(params: SetModel) {
    const { name, position } = params;
    const model = this.getModel(name);
    if (!model) return;
    model.position.set(position.x, position.y, position.z);
  }
  /**判断是否在模型内
   * @param params 参数
   * @param {string} params.name 模型名
   * @param {Vector3} params.point 点位置
   * @param {string} params.childrenName 子模型
   * @returns  boolen
   */
  isInModel(params: {
    name: string;
    point: Vector3;
    childrenName: string | undefined;
  }) {
    const { name, point, childrenName } = params;
    const model = this.getModel(name, childrenName);
    if (!model) return false;
    const boundingBox = new THREE.Box3().setFromObject(model);
    return boundingBox.containsPoint(
      new THREE.Vector3(point.x, point.y, point.z),
    );
  }
  getBoxHelp(name: string, childrenName: string | undefined = "") {
    const model = this.getModel(name, childrenName);
    if (!model) return;
    const BoxHelper = new THREE.BoxHelper(model);
    this.scene.add(BoxHelper);
    return BoxHelper.geometry.attributes.position.array;
  }
  /**模型移动
   * @param {string} name 模型名
   * @param {Vector3} position  移动目的坐标
   * @param {boolean} animation 是否开启移动动画
   * @param {number} speed  移动速度
   * @param {Function} callback 移动完成回调
   * @returns
   */
  modelMove(
    name: string,
    position: Vector3,
    animation?: boolean,
    speed?: number,
    callback?: Function,
    run?: Function,
  ) {
    const model = this.getModel(name);
    if (!model) return;
    if (!animation) {
      model.position.set(position.x, position.y, position.z);
      if (callback) callback();
      return;
    }
    const endPosition = new THREE.Vector3(position.x, position.y, position.z);
    const M = new MoveTo(model.position, endPosition, speed);
    const fn = () => {
      if (run) run(model.position);
      const manhattanDistanceTo = M.move();
      if (manhattanDistanceTo <= 1) {
        model.position.set(position.x, position.y, position.z);
        if (callback) callback();
      } else {
        requestAnimationFrame(fn);
      }
    };
    fn();
  }

  clickModelMove(modelPosition: THREE.Vector3, Position: THREE.Vector3) {
    const startPosition = new THREE.Vector3(
      modelPosition.x,
      0,
      modelPosition.z,
    ); // 起始位置
    const endPosition = new THREE.Vector3(Position.x, 0, Position.z); // 结束位置
    //计算移动的向量
    const delta = new THREE.Vector3().subVectors(endPosition, startPosition);
    return delta.normalize();
  }
  // 模型朝向
  modelLookAt(name: string, Position: THREE.Vector3) {
    const model = this.getModel(name);
    if (!model) return;
    const target = new THREE.Vector3(Position.x, 1, Position.z); // x, y, z 是你想要模型朝向的点的坐标
    model.lookAt(target);
  }
  /**查找模型
   * @param {string} name 模型名称
   * @param {string} childrenName 模型内子模型名称
   * @returns
   */
  getModel = (
    name: string,
    childrenName: string | undefined = "",
  ): THREE.Object3D<THREE.Object3DEventMap> | undefined => {
    let model = this.modelGroup.getObjectByName(name);
    if (!model)
      model = this.scene.getObjectByName(name) as
        | THREE.Object3D<THREE.Object3DEventMap>
        | undefined;
    if (childrenName && model) {
      const modelChildren = model.getObjectByName(childrenName);
      return modelChildren;
    }
    return model;
  };
  /** 模型显示隐藏
   * @param showParams 参数
   * @param {string} showParams.name 模型名称
   * @param {boolean} showParams.visible 模型显示状态
   * @param {string} showParams.childrenName 查找模型内子模型 仅查找一层
   */
  showModel(showParams: {
    name: string;
    visible: boolean;
    childrenName?: string;
  }) {
    const { name = "", childrenName = "", visible = true } = showParams;
    const model = this.getModel(name, childrenName);
    if (model) {
      model.visible = visible;
    }
  }
  deleteModel(name: string) {
    const model = this.getModel(name);
    if (model) {
      this.modelGroup.remove(model);
    }
  }
  /**添加多边形围栏
   * @param {[x: number, y: number, z: number][] | [x: number, z: number][] }pathArray 点坐标数组
   * @param { ShapeGeometry }params 模型参数
   * @param { Function}callBack 创建失败回调
   * @returns void
   */
  addShapeGeometry(
    pathArray: [x: number, y: number, z: number][] | [x: number, z: number][],
    params: ShapeGeometry,
    callBack?: Function,
  ) {
    const {
      name,
      color = "#FF962C",
      linewidth = 4,
      type = "line",
      visible = true,
    } = params;
    if (this.electronRail.get(name)) return;
    const array: THREE.Vector3[] = [];
    const length = pathArray.length;
    const maxXYZLength = pathArray[0].length;
    const position = pathArray[0];

    for (let i = 0; i < length; i++) {
      const item = pathArray[i];
      const itemIndex = item.length;
      if (itemIndex !== maxXYZLength || itemIndex > 3 || itemIndex < 2) {
        if (callBack) callBack();
        return;
      }
      const [x, y, z] = item;
      itemIndex === 2
        ? array.push(new THREE.Vector3(x, 0, y))
        : array.push(new THREE.Vector3(x, position[1], z));
    }
    this.electronRail.set(name, pathArray);
    let mesh = null;
    if (type === "face") {
      mesh = createLineMesh(color, linewidth, array);
      const faceMesh = createFaceMesh(array, color);
      faceMesh.position.y = position[1];
      mesh.add(faceMesh);
    } else {
      let points = array;
      if (type === "curve") {
        points = new THREE.CatmullRomCurve3(array).getPoints(array.length * 10);
      }
      mesh = createLineMesh(color, linewidth, points);
    }
    mesh.name = name;
    mesh.visible = visible;
    this.electronRailGroup.add(mesh);
    console.log("添加", mesh);
  }
  // 删除多边形围栏
  deletGeometry(name: string) {
    const model: any = this.electronRailGroup.getObjectByName(name);
    if (model) {
      this.modelGroup.remove(model);
      this.electronRail.delete(name);
    }
  }
  // 多边形围栏显示隐藏
  showGeometry(name: string, visible: boolean = true) {
    const model: any = this.electronRailGroup.getObjectByName(name);
    if (!model) return;
    model.visible = visible;
  }
  // 设置多边形围栏样式
  setGeometryStyle(params: ShapeGeometry) {
    const { name, color = "#FF962C", linewidth = 4 } = params;
    const model: any = this.electronRailGroup.getObjectByName(name);
    if (!model) return;
    model.material = new THREE.LineBasicMaterial({
      color: rgbaToRgb(color),
      linewidth,
      linecap: "round",
    });
    if (model.children.length > 0) {
      model.children[0].material = createFaceMaterial(rgbaToRgb(color));
    }
  }
  loading = () => {
    const index = this.loadingMap.size;
    let loader = 0;
    let status = true;
    this.loadingMap.forEach((value) => {
      loader += value.loader;
      if (!value.renderStatus) {
        status = value.renderStatus;
      }
    });
    return {
      loader: Math.floor(loader / index),
      renderStatus: status,
    };
  };
  /**
   * p :[x,y] ,带判定的P点
   * poly: [[x0,y0],[x1,y1]......] 多边形的路径
   */
  rayCasting(p: number[], poly: number[][]) {
    // px，py为p点的x和y坐标
    const [px, py] = p;
    let flag = false;
    const length = poly.length;
    // 这个for循环是为了遍历多边形的每一个线段
    for (let i = 0, l = length, j = l - 1; i < l; j = i, i++) {
      const [sx, sy] = poly[i];
      const [tx, ty] = poly[j];
      // 点与多边形顶点重合
      if ((sx === px && sy === py) || (tx === px && ty === py)) return true;
      // 点的射线和多边形的一条边重合，并且点在边上
      if (
        sy === ty &&
        sy === py &&
        ((sx > px && tx < px) || (sx < px && tx > px))
      )
        return true;
      // 判断线段两端点是否在射线两侧
      if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
        // 求射线和线段的交点x坐标，交点y坐标当然是py
        const x = sx + ((py - sy) * (tx - sx)) / (ty - sy);
        // 点在多边形的边上
        if (x === px) return true;
        // x大于px来保证射线是朝右的，往一个方向射，假如射线穿过多边形的边界，flag取反一下
        if (x > px) flag = !flag;
      }
    }
    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag ? true : false;
  }
}
