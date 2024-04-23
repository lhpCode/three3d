import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
export type LabelType = "CSS2DObject" | "CSS3DObject" | "CSS3DSprite";
export interface LabelParams {
  name: string; // 标签名称 *唯一性
  type: LabelType; // 标签类型
  element: HTMLElement; // html
}

export const createLabel = (labelParams: LabelParams) => {
  const { name, element, type = "CSS2DObject" } = labelParams;
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
  nodeModel.center = new THREE.Vector2(0.5, 1);
  return nodeModel;
};
