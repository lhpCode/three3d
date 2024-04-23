import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
interface Actions {
  [key: string]: THREE.AnimationAction;
}
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * 获取模型动画
 * @param {THREE.AnimationClip[]} animations 动画组
 * @param {THREE.Object3D} model 模型
 * @returns
 */
export const getActions = (
  animations: THREE.AnimationClip[],
  model: THREE.Object3D,
) => {
  const actions: Actions = {};
  const mixerArray: THREE.AnimationMixer[] = [];
  if (animations && animations.length > 0) {
    const mixer: THREE.AnimationMixer = new THREE.AnimationMixer(model);
    mixerArray.push(mixer);
    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      const action: THREE.AnimationAction = mixer.clipAction(clip);
      actions[clip.name] = action;
    }
  }
  return {
    actions,
    mixerArray,
  };
};

/**
 * 播放模型动画
 * @param {Actions}actions 动画
 * @param {number} playKey 播放动画的名称
 * @param {boolean} flag // 暂停 false or 播放 true
 * @param {AnimationActionLoopStyles} loop // 循环模式 THREE.LoopOnce // 循环一次 THREE.LoopRepeat // 重复 THREE.LoopPingPong // 循环往复
 * @returns
 */

export const playActiveAction = (
  actions: Actions,
  playKey: string,
  flag: boolean = true,
  loop: THREE.AnimationActionLoopStyles = THREE.LoopOnce,
) => {
  console.log("动画播放", actions);

  if (!actions) return;
  const activeAction = actions[playKey];
  if (!activeAction) return;
  activeAction.clampWhenFinished = true;
  activeAction.loop = loop;
  activeAction.reset();
  flag ? activeAction.fadeIn(0.1).play() : activeAction.fadeIn(0.3).stop();
};

/**
 * 加载gltf模型
 * @param {string} url 模型地址
 * @param {string} name 模型名称
 * @returns
 */
export const loadGltf = (url: string, name: string): Promise<any> => {
  return new Promise((res, rej) => {
    const loaderGltf = new GLTFLoader();
    loaderGltf.load(
      url,
      (gltf: {
        scene: THREE.Group<THREE.Object3DEventMap>;
        animations: THREE.AnimationClip[];
      }) => {
        const { scene } = gltf;
        scene.name = name;
        res(gltf);
      },
      (xhr: ProgressEvent) => {
        console.log("加载进度：", Math.floor((xhr.loaded / xhr.total) * 100));
      },
      (err: any) => {
        rej(err);
      },
    );
  });
};

export const loadFbx = (url: string, name: string): Promise<any> => {
  return new Promise((res, rej) => {
    const loader = new FBXLoader();
    loader.load(
      url,
      (object: any) => {
        object.name = name;
        res(object);
      },
      (xhr: ProgressEvent) => {
        console.log("加载进度：", Math.floor((xhr.loaded / xhr.total) * 100));
      },
      (err: any) => {
        rej(err);
      },
    );
  });
};

/**查找模型
 * @param {string} name 模型名称
 * @param {THREE.Scene} scene 场景
 * @returns
 */
export const getModel = (name: string, scene: THREE.Scene) => {
  return scene.getObjectByName(name);
};

// 创建面模型的材质
const createFaceMaterial = (color: string, opacity?: number) => {
  const material = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: opacity ? opacity : 1,
  });
  return material;
};
// 创建面
export const createFace = (array: Vector3[], color: string) => {
  const heartShape = new THREE.Shape(
    array.map((item) => new THREE.Vector2(item.x, item.z)),
  );
  const geometry = new THREE.ShapeGeometry(heartShape);
  const material = createFaceMaterial(color);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
};
export const setGeometryStyle = (name: string, color: string, scene: any) => {
  const mesh = scene.scene.getObjectByName(name);
  if (!mesh) return;
  mesh.material = createFaceMaterial(color);
};

// 创建线
export const createLine = (coordArray: Vector3[], lineName: string = "") => {
  const points = coordArray.map((p) => new THREE.Vector3(p.x, p.y, p.z));
  const curve = new THREE.CatmullRomCurve3(points, false);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(points.length * 10),
    ),
    new THREE.LineBasicMaterial({
      color: 0xefffe5,
    }),
  );
  line.name = lineName;
  return line;
};

/**
 *巡逻
 * @param {}          params
 * @param {Three}     params.three3D 实例对象
 * @param {Vector3[]} params.coordArray 坐标数组
 * @param {string}    params.meshName 跟随移动的模型名称
 * @param {boolean}   params.isFirstPerson 是否是第三人称
 * @param {1 | 10 | 100} params.factor 移动因素 1  |10  |100
 * @param {Vector3}   params.rotation 模型旋转补偿角度
 * @param {Vector3}   params.rotation 模型旋转补偿角度
 *
 * @param {function}  callback 运行回调
 */
export class Patrol {
  private three3D: any;
  private meshName: string;
  private isFirstPerson: boolean;
  private curvePoints: Vector3[];
  private runGen: any;
  private factor?: 1 | 10 | 100;
  private rotation: Vector3 | undefined;
  private finishCallback: Function | undefined;
  isStop: boolean;
  constructor(
    params: {
      three3D: any;
      coordArray: Vector3[];
      meshName?: string;
      isFirstPerson?: boolean;
      factor?: 1 | 10 | 100;
      rotation?: Vector3;
    },
    callback?: Function,
  ) {
    const {
      three3D,
      coordArray,
      meshName = "",
      isFirstPerson = false,
      factor = 1,
      rotation,
    } = params;
    this.rotation = rotation;
    this.isFirstPerson = isFirstPerson;
    this.three3D = three3D;
    this.meshName = meshName;
    this.isStop = false;
    this.factor = factor;
    this.finishCallback = callback;
    // 总路长
    let distanceToPoint = 0;
    const points = coordArray.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    points.forEach((p, i) => {
      if (i !== 0 && points[i + 1]) {
        distanceToPoint += p.distanceTo(points[i + 1]);
      }
    });
    const curve = new THREE.CatmullRomCurve3(points, false);
    this.curvePoints = curve.getPoints(distanceToPoint * (100 / factor));
  }
  init() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this;

    async function* stepGen() {
      for (let i = 0; i < vm.curvePoints.length; i++) {
        yield vm.step(vm.curvePoints, i);
      }
      yield false;
    }
    this.runGen = stepGen();
  }
  reset() {
    this.runGen = null;
    this.isStop = false;
  }
  stop() {
    this.isStop = true;
  }
  run() {
    if (!this.isStop && this.runGen) return;
    if (!this.runGen) {
      this.init();
    }
    this.isStop = false;
    this.asyncGenerator(this.runGen);
  }
  switch(flag: boolean) {
    this.isFirstPerson = flag;
  }
  private async asyncGenerator(g: any) {
    if (this.isStop) return;
    g.next().then((v: any) => {
      const { done, value } = v;
      if (!done) {
        setTimeout(() => {
          this.asyncGenerator(g);
        }, 1);
      }
      this.finishCallback ? this.finishCallback(done, value) : null;
    });
  }
  private step(point: Vector3[], i: number): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this;
    return new Promise((res, rej) => {
      if (!this.three3D) return rej(false);
      try {
        vm._runModel(point, i, res, vm);
      } catch (err) {
        console.log(err);
        rej(false);
      }
    });
  }
  private _runModel(point: Vector3[], i: number, res: Function, vm: this) {
    const lookAt = i < point.length - 11 ? point[i + 10] : point[0];
    if (this.meshName) {
      const model = this.three3D.scene.getObjectByName(this.meshName);
      model.position.set(point[i].x, point[i].y, point[i].z);
      model.lookAt(lookAt.x, lookAt.y, lookAt.z);
      // 模型初始方向决定y轴旋转方法
      if (this.rotation) {
        const { x = 0, y = 0, z = 0 } = this.rotation;
        model.rotation.x = model.rotation.x + x;
        model.rotation.y = model.rotation.y + y;
        model.rotation.z = model.rotation.z + z;
      }

      if (vm.isFirstPerson) {
        this.three3D.camera.position.set(
          point[i].x,
          point[i].y + 1.8,
          point[i].z,
        );
        this.three3D.controls.setCameraLookAt({
          x: lookAt.x,
          y: lookAt.y + 1.8,
          z: lookAt.z,
        });
      }
      res(point[i]);
    }
  }
}

export const pointInThis = (point: Vector3, pathList: Vector3[]) => {
  const { x: px, z: py } = point;
  let flag = false;
  const length = pathList.length;
  for (let i = 0, l = length, j = l - 1; i < l; j = i, i++) {
    const { x: sx, z: sy } = pathList[i];
    const { x: tx, z: ty } = pathList[j];
    if ((sx === px && sy === py) || (tx === px && ty === py)) return true;
    if (
      sy === ty &&
      sy === py &&
      ((sx > px && tx < px) || (sx < px && tx > px))
    )
      return true;
    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      const x = sx + ((py - sy) * (tx - sx)) / (ty - sy);
      if (x === px) return true;
      if (x > px) flag = !flag;
    }
  }
  return flag ? true : false;
};
