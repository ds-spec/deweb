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

const geometry = new THREE.SphereGeometry(2.7, 250, 128);
const material = new THREE.ShaderMaterial({
  vertexShader,
  // wireframe: true,
  fragmentShader,
  side: THREE.DoubleSide,
  // transparent: true,
  // depthWrite: true,
  // blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uColorChange: { value: 0 },
    uHoverIndex: { value: 0 },
    uBlendFactor: { value: 0 },
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

gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

let xTo = gsap.quickTo(".cursor", "x", { duration: 0.6, ease: "power3" });
let yTo = gsap.quickTo(".cursor", "y", { duration: 0.6, ease: "power3" });

window.addEventListener("mousemove", (e) => {
  // 3. Bas value pass karo, koi 'px' ya calculation nahi
  xTo(e.clientX);
  yTo(e.clientY);
});

const design = document.querySelector(".design");
const development = document.querySelector(".development");
const branding = document.querySelector(".branding");
const magnet = document.querySelector(".magnet");
const magnetWrapper = document.querySelector(".magnet-wrapper");

const xCo = gsap.quickTo(magnet, "x", { ease: "elastic.inOut" });
const yCo = gsap.quickTo(magnet, "y", { ease: "elastic.inOut" });

magnetWrapper.addEventListener("mousemove", (e) => {
  const rect = magnetWrapper.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  xCo(x * 0.3);
  yCo(y * 0.3);
});

magnet.addEventListener("mouseleave", () => {
  gsap.to(magnet, {
    x: 0,
    y: 0,
    ease: "elastic.inOut",
    duration: 1,
    overwrite: true,
  });
});

function setColor(i) {
  material.uniforms.uHoverIndex.value = i + 1;
}

function blendColor() {
  gsap.killTweensOf(material.uniforms.uBlendFactor);
  gsap.to(material.uniforms.uBlendFactor, {
    value: 1.0,
    duration: 0.4,
    ease: "power2.inOut",
  });
}

function resetColor() {
  gsap.killTweensOf(material.uniforms.uBlendFactor);
  gsap.to(material.uniforms.uBlendFactor, {
    value: 0.0,
    duration: 0.6,
    ease: "expo.inOut",
    onComplete: () => {
      material.uniforms.uHoverIndex.value = 0;
    },
  });
}

let leaveTimeout;
design.addEventListener("mouseenter", () => {
  clearTimeout(leaveTimeout);
  blendColor();
  setColor(0);
});
development.addEventListener("mouseenter", () => {
  clearTimeout(leaveTimeout);
  blendColor();
  setColor(1);
});
branding.addEventListener("mouseenter", () => {
  clearTimeout(leaveTimeout);
  blendColor();
  setColor(2);
});
design.addEventListener("mouseleave", () => resetColor());
development.addEventListener("mouseleave", () => resetColor());
branding.addEventListener("mouseleave", () => resetColor());

let tl_nav = gsap.timeline({
  scrollTrigger: {
    trigger: "nav",
    start: "top top",
    end: "bottom top",
    scrub: 2,
  },
});

tl_nav
  .to(".logo", { opacity: 0, ease: "power2.inOut" }, "swap")
  .to(".logo-transform", { opacity: 1, ease: "power2.inOut" }, "swap")
  .from(
    ".logo-transform",
    { y: -20, overflow: "hidden", ease: "power2.inOut" },
    "swap"
  );
tl_nav.to(".hrefs", { opacity: 0, y: -40, ease: "power2.inOut" }, "swap");

const button = document.querySelector(".menu-button");

gsap.set(".l1", { y: -3 });
gsap.set(".l2", { y: 3 });

const tl_menu = gsap.timeline({ paused: true });

tl_menu
  .to(
    ".l1",
    {
      rotate: -45,
      y: 0,
      ease: "power2.inOut",
      transformOrigin: "center center",
    },
    "lines"
  )
  .to(
    ".l2",
    {
      rotate: 45,
      y: 0,
      ease: "power2.inOut",
      transformOrigin: "center center",
    },
    "lines"
  );

const mainDiv = document.querySelector(".main-div");

const tl_menuFullScreen = gsap.timeline({ paused: true });

tl_menuFullScreen
  .fromTo(
    ".menu-overlay",
    {
      clipPath: "circle(0% at 94% 4%)",
    },
    {
      clipPath: "circle(150% at 94% 4%)",
      ease: "power2.inOut",
      duration: 0.8,
      pointerEvents: "all",
    },
    "hrefs-out"
  )
  .to(
    ".hrefs",
    {
      opacity: 0,
      y: -40,
      ease: "power2.inOut",
    },
    "hrefs-out"
  )
  .to(
    ".menu-content",
    {
      opacity: 1,
      duration: 0.4,
    },
    "-=0.4"
  );

button.addEventListener("click", () => {
  if (tl_menu.reversed() || tl_menu.paused()) {
    tl_menu.play();
    // menuOpen();
    // tl_menuFullScreen.play();
    // menuDiv.classList.remove("hidden");
    // mainDiv.classList.add("hidden");
  } else {
    tl_menu.reverse();
  }
  if (tl_menuFullScreen.reversed() || tl_menuFullScreen.paused()) {
    tl_menuFullScreen.play();
    mainDiv.classList.add("hidden");
  } else {
    tl_menuFullScreen.reverse();
    mainDiv.classList.remove("hidden");
  }
});

let tl_hero = gsap.timeline({
  scrollTrigger: {
    trigger: ".main-div",
    start: "top 60%",
    end: "bottom top",
    scrub: 2,
  },
});

tl_hero
  .to(
    sphere.position,
    {
      y: 0.5,
      z: -2,
      ease: "power2.inOut",
    },
    "a"
  )
  .to(
    material.uniforms.uColorChange,
    {
      value: 1,
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
