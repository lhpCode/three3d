import * as THREE from "three";
import { Vector3, LabelParams } from "./interface/index";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
// import { Flow } from "three/addons/modifiers/CurveModifier.js";

import {
  CSS3DObject,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";

type Params = {
  width: number;
  height: number;
};

export default class SpriteThree {
  private readonly spriteGroup: THREE.Group;
  private readonly spriteMap: Map<string, any>;
  protected readonly params: Params;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    params: Params,
  ) {
    this.scene = scene;
    this.camera = camera;
    this.spriteMap = new Map<string, any>();
    this.params = params;
    const group = new THREE.Group();
    group.name = "spriteGroup";
    this.spriteGroup = group;
    this.scene.add(group);
  }
  //绘制加载动画
  createLoading(value: string, schedule: number, color: string = "#00F3B8") {
    const { width, height } = this.params;
    const dpr = 1;
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.pointerEvents = "none";
    ctx.fillStyle = `rgba(0,0,0,${1 - schedule / 100})`;
    ctx.beginPath();
    ctx.fillRect(0, 0, width, height);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = color;
    const x = width / 3;
    const y = 200;
    const startWidth = width / 2 - x / 2;
    const font = 26;
    const left = 75;
    let ctxHeight = height / 2 - font;
    const boxHeight = y / 4;
    ctx.font = font + "px Calibri";
    const text = ctx.measureText(value);
    ctx.strokeStyle = color;
    ctx.fillText(value, width / 2 - text.width / 2, ctxHeight);
    ctx.restore();
    ctxHeight = ctxHeight + font * 1.5;
    ctx.strokeStyle = color;
    ctx.moveTo(startWidth + left + 8, ctxHeight);
    ctx.lineTo(startWidth + x - left - 8, ctxHeight);
    ctx.arcTo(
      startWidth + x - left,
      ctxHeight,
      startWidth + x - left,
      ctxHeight + boxHeight,
      10,
    );
    ctx.arcTo(
      startWidth + x - left,
      ctxHeight + boxHeight,
      startWidth + left,
      ctxHeight + boxHeight,
      10,
    );
    ctx.arcTo(
      startWidth + left,
      ctxHeight + boxHeight,
      startWidth + left,
      ctxHeight,
      10,
    );
    ctx.arcTo(
      startWidth + left,
      ctxHeight,
      startWidth + x - left,
      ctxHeight,
      10,
    );
    ctx.stroke();
    const border = 8;
    const loadingWidth = 20;
    let progressLeft = left + border;
    ctxHeight = ctxHeight + border;
    ctx.fillStyle = color;
    const progressWidth = x - left * 2 - 2 - border * 2;
    const num = Math.floor(progressWidth / (loadingWidth + border));
    const index = Math.floor((num * schedule) / 100);
    for (let i = 0; i < index; i++) {
      ctx.fillRect(
        progressLeft + startWidth,
        ctxHeight,
        loadingWidth,
        boxHeight - border * 2,
      );
      progressLeft = progressLeft + loadingWidth + border;
      const addWidth = progressWidth - (loadingWidth + border) * index;
      if (addWidth > border && i === num - 1) {
        ctx.fillRect(
          progressLeft + startWidth,
          ctxHeight,
          addWidth,
          boxHeight - border * 2,
        );
      }
    }
    ctx.font = font + "px Calibri";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    const text1 = Math.floor(schedule) + "%";
    const textSchedule = ctx.measureText(text1);
    ctx.fillText(
      text1,
      startWidth + x - textSchedule.width - (left - textSchedule.width) / 2,
      ctxHeight + boxHeight / 2,
    );
    ctx.restore();
    return canvas;
  }
  // 添加精灵图标签
  addLabel(labelParams: LabelParams) {
    const {
      name,
      element,
      type = "CSS2DObject",
      position = { x: 0, y: 0, z: 0 },
      scale = { x: 1, y: 1, z: 1 },
    } = labelParams;
    if (this.spriteMap.has(name)) return;
    if (typeof element !== "object") return;
    if (typeof HTMLElement === "function") {
      const flag = element instanceof HTMLElement;
      if (!flag) return;
    }
    let nodeModel = null;
    switch (type) {
      case "CSS2DObject":
        nodeModel = new CSS2DObject(element);
        break;
      case "CSS3DObject":
        nodeModel = new CSS3DObject(element);
        break;
      case "CSS3DSprite":
        nodeModel = new CSS3DSprite(element);
        break;
      default:
        throw new Error("type类型错误");
    }
    if (!nodeModel) return;
    nodeModel.name = name;
    nodeModel.position.set(position.x, position.y, position.z);
    const { x, y, z } = scale;
    if (x > 0 && y > 0 && z > 0) {
      nodeModel.scale.set(x, y, z);
    }
    nodeModel.center = new THREE.Vector2(0.5, 1);
    this.spriteMap.set(name, nodeModel);
    this.spriteGroup.add(nodeModel);
  }
  // 删除标签
  deleteLabel(name: string) {
    if (!this.spriteMap.has(name)) return;
    const model: any = this.spriteGroup.getObjectByName(name);
    if (!model) return;
    this.spriteMap.delete(name);
    this.spriteGroup.remove(model);
  }
  // 设置标签显示隐藏
  showLabel(name: string, visible: boolean) {
    const model = this.spriteGroup.getObjectByName(name);
    if (!model) return;
    model.visible = visible;
  }
  // 设置精灵图标签位置
  setLabelPostion(name: string, position: Vector3) {
    const model = this.spriteGroup.getObjectByName(name);
    if (!model) return;
    model.position.set(position.x, position.y, position.z);
  }
  // 设置精灵图标签样式
  setLabelStyle(labelParams: LabelParams) {
    const model = this.spriteGroup.getObjectByName(labelParams.name);
    if (model) {
      this.deleteLabel(labelParams.name);
    }
    this.addLabel(labelParams);
  }
  // 添加线
  addLine(coordArray: Vector3[], lineName: string = "") {
    const points = coordArray.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(points, false);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(points.length * 10),
      ),
      new THREE.LineBasicMaterial({
        color: 0x0000ff,
      }),
    );
    line.name = lineName;
    this.scene.add(line);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = "测试";
    this.scene.add(cube);
  }
}
