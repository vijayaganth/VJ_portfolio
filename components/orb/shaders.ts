// GLSL for the hero orb. ShaderMaterial (WebGL) – see the portfolio-orb skill for the visual spec.

// 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT).
const noise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
    i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
    i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseStrength;

varying vec3 vViewNormal;
varying vec3 vViewDir;
varying float vNoise;

${noise}

void main() {
  float n = snoise(position * uNoiseScale + vec3(0.0, uTime * 0.12, uTime * 0.08));
  vNoise = n;
  vec3 displaced = position + normal * n * uNoiseStrength;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewNormal = normalize(normalMatrix * normal);
  vViewDir = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform float uFresnelPower;
uniform vec3 uBase;
uniform vec3 uTeal;
uniform vec3 uBlue;
uniform vec3 uMagenta;
uniform vec3 uYellow;

varying vec3 vViewNormal;
varying vec3 vViewDir;
varying float vNoise;

${noise}

// Radial field like the reference CSS gradient: linear from 1 at the centre to 0 at radius r.
float field(vec2 p, vec2 centre, float r) {
  return clamp(1.0 - distance(p, centre) / r, 0.0, 1.0);
}

void main() {
  vec3 n = normalize(vViewNormal);
  // Screen-facing coordinates on the sphere: (0,0) top-left, (1,1) bottom-right, matching CSS gradient positions.
  vec2 p = vec2(n.x * 0.5 + 0.5, 0.5 - n.y * 0.5);

  // Slow organic drift of the colour fields.
  float t = uTime * 0.15;
  vec2 warp = vec2(snoise(vec3(p * 1.6, t)), snoise(vec3(p * 1.6 + 7.3, t))) * 0.07;
  // Fields drift slightly against the pointer for a parallax feel.
  vec2 q = p + warp + vNoise * 0.03 - vec2(uPointer.x, -uPointer.y) * 0.05;

  // The field nearest the pointer brightens slightly.
  vec2 pointer = vec2(uPointer.x * 0.5 + 0.5, 0.5 - uPointer.y * 0.5);
  float near = 1.0 - smoothstep(0.0, 0.55, distance(q, pointer));

  // Same centres, radii and stacking as the reference (radii = CSS stop × farthest-corner distance).
  float boost = 1.0 + near * 0.2;
  vec3 color = uBase;
  color = mix(color, uYellow, field(q, vec2(0.62, 0.62), 0.26));
  color = mix(color, uTeal, min(1.0, field(q, vec2(0.48, 0.78), 0.54) * boost));
  color = mix(color, uBlue, min(1.0, field(q, vec2(0.72, 0.32), 0.50) * boost));
  color = mix(color, uMagenta, min(1.0, field(q, vec2(0.28, 0.28), 0.47) * boost));

  float fresnel = pow(1.0 - max(dot(normalize(vViewDir), n), 0.0), uFresnelPower);
  color += uTeal * fresnel * 0.35;

  // Colours are sRGB values mixed in sRGB, like CSS gradients, so the output is written as-is.
  gl_FragColor = vec4(color, 1.0);
}
`;
