import three from "./Three";
import ModelThree from "./ModelThree";
import SpriteThree from "./SpriteThree";
import { Params } from "./interface/index";
import * as THREE from "three";
import { openDB } from "./indexdb";
export default class SLThree {
  public readonly Three: three;
  public readonly ModelThree: ModelThree;
  public readonly SpriteThree: SpriteThree;
  public fps: number | undefined;
  constructor(params: Params) {
    let db;
    if (openDB) {
      openDB("threeDB", "model", 2)!.then((v) => {
        db = v;
      });
    }
    this.Three = new three(params);
    const scene = this.Three.scene;
    const camera = this.Three.camera!;
    const renderer = this.Three.renderer!;
    this.ModelThree = new ModelThree(scene, camera, renderer, params, db);
    this.SpriteThree = new SpriteThree(scene, camera, {
      width: this.Three.width,
      height: this.Three.height,
    });
    const clock = new THREE.Clock();
    const render = () => {
      const dt = clock.getDelta();
      this.fps = Math.floor(1 / dt);
      this.Three.render();
      this.ModelThree.render(dt);
      requestAnimationFrame(render);
    };
    render();
    window.addEventListener("resize", () => {
      this.Three.resize();
    });
  }
}
