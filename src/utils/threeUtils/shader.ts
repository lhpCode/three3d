import * as THREE from "three";

export const circleShader = (rgb?: [number, number, number]) => {
  console.log(rgb);

  const vertexShader = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
      gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4( position, 1.0 );
  }
  `;
  const fragmentShader = `
varying vec2 vUv; 
uniform vec3 uColor1; 
uniform vec3 uColor2;
uniform float uTime;
void main() {
    float distanceFromCenter = distance(vUv, vec2(0.5));  
    distanceFromCenter = step(0.03,abs(distanceFromCenter-fract(uTime)));
    float radius = 0.25;
    float isInsideCircle = step(radius, distanceFromCenter);  
    vec4 color = isInsideCircle * vec4(uColor1,0.0) + (1.0 - isInsideCircle) * vec4(uColor2,1.0);   
    gl_FragColor =color;  
}
`;
  const color = rgb || [68, 222, 255];
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 1 },
      uColor2: { value: rgbToVec3(...color) },
      uColor1: { value: rgbToVec3(255, 255, 255) },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: true, // 确保深度测试是启用的
    depthWrite: true, // 确保深度写入是启用的
  });

  let time = 0.01;
  function A() {
    time += 0.01;
    material.uniforms.uTime.value = time;
    requestAnimationFrame(A);
  }
  A();
  return material;
};

const rgbToVec3 = (x: number, y: number, z: number) => {
  return {
    x: x / 255.0,
    y: y / 255.0,
    z: z / 255.0,
  };
};
