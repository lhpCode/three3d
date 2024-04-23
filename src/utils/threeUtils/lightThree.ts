import * as THREE from "three";

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface AmbientLight {
  color: number;
  intensity: number;
}
interface PointLight extends AmbientLight {
  distance?: number;
  decay?: number;
}

/**
 * 创建环境光
 * @param {string} name 光线名称
 * @param {object} ambientLight 构建光线参数
 * @param {number} ambientLight.color  (参数可选）颜色的rgb数值。缺省值为 0xffffff
 * @param {number} ambientLight.intensity (参数可选)光照的强度。缺省值为 1
 * @returns THREE.AmbientLight
 */
export const createAmbientLight = (
  name: string,
  ambientLight?: AmbientLight,
) => {
  const { color = 0xffffff, intensity = 1 } = ambientLight || {};
  const light = new THREE.AmbientLight(color, intensity);
  light.name = name;
  return light;
};

/**
 * 创建点光源
 * @param {string} name 光线名称
 * @param {PointLight} pointLight 构建光线参数
 * @param {number} pointLight.color  (参数可选）颜色的rgb数值。缺省值为 0xffffff
 * @param {number} pointLight.intensity (参数可选)光照的强度。缺省值为 1
 * @param {number} pointLight.distance 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
 * @param {number} pointLight.decay 沿着光照距离的衰退量。缺省值 2。
 * @returns
 */
export const createPointLight = (
  name: string,
  pointLight?: PointLight,
  Position?: Vector3,
) => {
  const {
    color = 0xffffff,
    intensity = 1,
    distance = 0,
    decay = 2,
  } = pointLight || {};
  const { x = 0, y = 0, z = 0 } = Position || {};
  console.log(color, intensity, distance, decay);

  const light = new THREE.PointLight(color, intensity, distance, decay);
  light.name = name;
  light.position.set(x, y, z);
  return light;
};
