import * as THREE from "three";
import { Vector3 } from "../interface/index";
export class MoveTo {
  start: THREE.Vector3;
  end: THREE.Vector3;
  v: number;
  manhattanDistanceToNumber: number;
  constructor(start: THREE.Vector3, end: THREE.Vector3, v?: number) {
    this.start = start;
    this.end = end;
    this.v = v ? v : Math.ceil(this.manhattanDistanceTo() / 200);
    this.manhattanDistanceToNumber = 0;
  }
  setSpeed(v: number) {
    this.v = v;
  }
  manhattanDistanceTo = () => {
    return this.start.manhattanDistanceTo(this.end);
  };
  move() {
    const delta = new THREE.Vector3()
      .subVectors(this.end, this.start)
      .normalize();
    const manhattanDistanceTo = this.manhattanDistanceTo();
    if (manhattanDistanceTo < this.v && manhattanDistanceTo >= 1) {
      this.start.addScaledVector(delta, 1);
    } else if (manhattanDistanceTo > this.v) {
      this.start.addScaledVector(delta, this.v);
    }
    if (this.manhattanDistanceToNumber === Math.floor(manhattanDistanceTo)) {
      return 0;
    }
    this.manhattanDistanceToNumber = Math.floor(manhattanDistanceTo);
    return manhattanDistanceTo;
  }
}

/**
 *巡逻
 * @param {} params
 * @param {} params.three3D 场景
 * @param {} params.coordArray 坐标数组
 * @param {} params.meshName 模型名称
 * @param {} params.isFirstPerson 是否是第三人称
 * @param {} params.modelType 跟随的是模型还是图标
 * @param {} params.factor 移动因素 1  |10  |100
 */
export class Patrol {
  private three3D: any;
  private meshName: string;
  private isFirstPerson: boolean;
  private curvePoints: Vector3[];
  private runGen: any;
  private modelType?: "mash" | "sprite";
  private factor?: 1 | 10 | 100;
  isStop: boolean;
  constructor(params: {
    three3D: any;
    coordArray: Vector3[];
    meshName?: string;
    isFirstPerson?: boolean;
    modelType?: "mash" | "sprite";
    factor?: 1 | 10 | 100;
  }) {
    const {
      three3D,
      coordArray,
      meshName = "",
      isFirstPerson = false,
      modelType = "mash",
      factor = 1,
    } = params;
    this.isFirstPerson = isFirstPerson;
    this.three3D = three3D;
    this.meshName = meshName;
    this.isStop = false;
    this.modelType = modelType;
    this.factor = factor;
    // 总路长
    let distanceToPoint = 0;
    const points = coordArray.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    points.forEach((p, i) => {
      if (i !== 0 && points[i + 1]) {
        distanceToPoint += p.distanceTo(points[i + 1]);
      }
    });
    console.log("距离", distanceToPoint);
    const curve = new THREE.CatmullRomCurve3(points, false);
    this.curvePoints = curve.getPoints(distanceToPoint * (100 / factor));
    // this.init();
  }
  init() {
    console.log("初始化");

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
  stop() {
    this.isStop = true;
  }
  run() {
    if (!this.isStop && this.runGen) return;
    if (!this.runGen) {
      this.init();
    }
    this.isStop = false;
    if (this.isFirstPerson) {
      this.three3D.Three.removeControls();
    }
    this.asyncGenerator(this.runGen);
  }
  switch(flag: boolean) {
    this.isFirstPerson = flag;
    if (this.isFirstPerson) {
      this.three3D.Three.removeControls();
    } else {
      this.three3D.Three.initControls();
    }
  }
  private async asyncGenerator(g: any) {
    g.next().then((v: any) => {
      if (!v || !v.value) {
        if (this.isFirstPerson) {
          this.three3D.Three.initControls();
        }
        this.runGen = null;
        return;
      }
      if (this.isStop) {
        if (this.isFirstPerson) {
          this.three3D.Three.initControls();
        }
        return;
      }
      setTimeout(() => {
        this.asyncGenerator(g);
      }, 1);
    });
  }
  private step(point: Vector3[], i: number): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this;
    return new Promise((res, rej) => {
      if (!this.three3D) return rej(false);
      if (this.modelType === "mash") {
        vm._runModel(point, i, res, vm);
      } else {
        vm._runSprite(point, i, res, vm);
      }
    });
  }
  private _runModel(point: Vector3[], i: number, res: Function, vm: this) {
    if (this.meshName) {
      this.three3D.ModelThree.modelMove(
        this.meshName,
        point[i],
        true,
        1,
        function () {
          res(true);
        },
        function (position: Vector3) {
          if (vm.isFirstPerson) {
            vm.three3D?.Three.setCameraPositions(position);
            vm.three3D?.Three.setCameraLookAt(point[i]);
          }
        },
      );
    } else {
      res(true);
      if (vm.isFirstPerson) {
        this.three3D?.Three.setCameraPositions(point[i]);
        this.three3D?.Three.setCameraLookAt(point[i + 1]);
      }
    }
  }
  private _runSprite(point: Vector3[], i: number, res: Function, vm: this) {
    if (this.meshName) {
      this.three3D.SpriteThree.setLabelPostion(this.meshName, point[i]);
    } else {
      if (vm.isFirstPerson) {
        this.three3D?.Three.setCameraPositions(point[i]);
        this.three3D?.Three.setCameraLookAt(point[i + 1]);
      }
    }
    res(true);
  }
}
