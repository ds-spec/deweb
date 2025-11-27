import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 4;

const geometry = new THREE.SphereGeometry(2.7, 100, 100);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uColorChange: { value: 0 },
  },
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.y = -3.5;
scene.add(sphere);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".landing-hero",
    start: "top 60%",
    end: "bottom top",
    scrub: 2,
    // markers: true,
  },
});

// tl.to(
//   ".logo-transform",
//   {
//     opacity: 1,
//     ease: "power2.inOut",
//     duration: 0.5,
//   },
//   "swap"
// )
//   .to(
//     ".logo",
//     {
//       opacity: 0,
//       y: -5,
//       ease: "power2.inOut",
//     },
//     "swap"
//   )
tl.to(".logo", { opacity: 0, duration: 0 }, "swap")
  .to(".logo-transform", { opacity: 1, duration: 0 }, "swap")
  .to(sphere.position, {
    y: 0.5,
    z: -2,
    ease: "power2.inOut",
  })
  .to(
    material.uniforms.uColorChange,
    {
      value: 0,
      ease: "power2.inOut",
    },
    "a"
  );

let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}

animate();
