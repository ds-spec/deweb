precision mediump float;
varying vec2 vUv;
varying float vElevation;
uniform float uColorChange;
uniform float uHoverIndex;
uniform float uBlendFactor;

void main() {
  vec4 c1 = vec4(1.0, 0.725, 0.937, 1.0);
  vec4 c2 = vec4(1.0, 0.886, 0.996, 1.0);

  vec4 c3 = vec4(1.0, 0.925, 0.925, 1.0);
  vec4 c4 = vec4(1.0, 1.0, 1.0, 1.0);

  vec4 P1a = vec4(0.949, 0.914, 1.0, 1.0);
  vec4 P1b = vec4(0.843, 0.749, 1.0, 1.0);

  vec4 P2a = vec4(0.835, 0.945, 1.0, 1.0);
  vec4 P2b = vec4(0.663, 0.847, 0.937, 1.0);

  vec4 P3a = vec4(1.0, 0.965, 0.874, 1.0);
  vec4 P3b = vec4(0.937, 0.843, 0.659, 1.0);

  float smoothstep = smoothstep(-.5, 1., vElevation);
  vec4 defaultColor = mix(c1, c2, smoothstep);
  vec4 color2 = mix(c3, c4, smoothstep);

  vec4 hover1 = mix(P1a, P1b, smoothstep);
  vec4 hover2 = mix(P2a, P2b, smoothstep);
  vec4 hover3 = mix(P3a, P3b, smoothstep);
  
  vec4 hoverColor;

if(uHoverIndex < 0.5){
  hoverColor = defaultColor;
}else if(uHoverIndex < 1.5){
  hoverColor = hover1;
}else if(uHoverIndex < 2.5){
  hoverColor = hover2;
}else{
  hoverColor = hover3;
}

    // uHoverIndex < 0.5 ? hover1 : uHoverIndex < 1.5 ? hover1 : uHoverIndex < 2.5 ? hover2 : uHoverIndex < 3.5 ? hover3 : defaultColor;

  vec4 blendColor = mix(defaultColor, hoverColor, uBlendFactor);

  vec4 scrollColor = mix(defaultColor, color2, smoothstep);

  vec4 finalColor = mix(blendColor, scrollColor, uColorChange);

  gl_FragColor = finalColor;
}
