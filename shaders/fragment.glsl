precision mediump float;
varying vec2 vUv;
varying float vElevation;
uniform float uColorChange;

void main() {
  vec4 c1 = vec4(1.0, 0.725, 0.937, 1.0);
  vec4 c2 = vec4(1.0, 0.886, 0.996, 1.0);

  vec4 c3 = vec4(1.0, 0.931, 0.900, 1.0);
  vec4 c4 = vec4(1.0, 0.995, 0.995, 1.0);

  float smoothstep = smoothstep(-.5, 1., vElevation);
  vec4 color = mix(c1, c2, smoothstep);
  vec4 color2 = mix(c3, c4, smoothstep);

  vec4 finalColor = mix(color, color2, uColorChange);

  gl_FragColor = finalColor;
}
