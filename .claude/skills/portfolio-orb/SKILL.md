---
name: portfolio-orb
description: Spec and implementation guide for the hero 3D orb in Vijayaganth's portfolio — React Three Fiber canvas, custom GLSL shader in teal/blue/magenta/yellow on #0E2540, cursor reaction, idle motion, lazy loading, mobile limits, fallback, and the dev-only threejs-devtools bridge. Use for anything in components/orb/.
---

# Hero orb

Also load: `threejs-react-three-fiber`, `threejs-shaders`, `threejs-fundamentals`, `threejs-performance`, `threejs-interaction`.

## Visual spec
- Replaces the CSS gradient orb in `[data-orb-slot]`; same box: desktop 580×580 at right -40 / top 80; mobile 300×300 at right -70 / top 96 (Mobile reference).
- Look: soft glowing sphere on `--c-orb-base #0E2540`. Colour fields like the reference gradient: magenta upper-left, blue upper-right, teal bottom, small yellow hot spot centre-right; outer glow teal ~30% alpha.
- Surface: slow organic flow (3D simplex noise displacing normals/vertices slightly, colour fields drifting). Fresnel rim in teal.
- Idle: very slow rotation + noise time (period ≈ 20s). Never fast or bouncy.
- Cursor: orb leans/rotates toward the pointer (max ~0.25 rad) and the nearest colour field brightens; damped (`THREE.MathUtils.damp`, λ≈4). Pointer tracked on `window`, normalised to the hero.

## Implementation
```
components/orb/
  OrbSlot.tsx     client: renders CSS fallback, mounts <OrbCanvas> lazily
  OrbCanvas.tsx   <Canvas dpr={[1, isMobile ? 1.5 : 2]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} frameloop="demand"|"always">
  Orb.tsx         <mesh><icosahedronGeometry args={[1, isMobile ? 32 : 64]} /><shaderMaterial …/></mesh>
  shaders/orb.vert.glsl, orb.frag.glsl  (import as strings via a raw loader or template literals)
```
Uniforms: `uTime, uPointer (vec2), uHover (float), uTeal, uBlue, uMagenta, uYellow, uBase (vec3), uNoiseScale, uNoiseStrength, uFresnelPower, uGlow`.

Loading
- `const OrbCanvas = dynamic(() => import('./OrbCanvas'), { ssr: false })`.
- Mount after `requestIdleCallback` (fallback `setTimeout 1200`) **and** when hero intersects; unmount or set `frameloop="never"` when hero leaves view.
- Cross-fade the CSS fallback out once the first frame renders (`onCreated` → state).
- Skip WebGL entirely (keep CSS orb) when: `prefers-reduced-motion`, no WebGL2, `navigator.connection?.saveData`, or `deviceMemory < 4`.

Performance budget: 1 draw call (2 if a glow sprite is used), no textures, no postprocessing bloom (fake glow in shader / CSS box-shadow on the slot), orb chunk ≤ 160 kB gzip, 60fps on mid-range phone.

## Dev tooling (threejs-devtools-mcp)
- No bridge code lives in the app: the MCP's proxy injects it. `set_dev_port 3000`, then open `http://localhost:9222` in a browser (Playwright with local Chrome and `--use-angle=swiftshader` works headless). Nothing ships to production. The `__THREE_DEVTOOLS__` strings in the built three chunk are three.js's own no-op hook, not ours.
- Tuning loop: `scene_tree` → `shader_list` → `set_uniform` (live preview, tell the user nothing is saved) → `take_screenshot` → on approval `pending_changes` → write values into `Orb.tsx` defaults → `pending_changes clear=true`.
- Perf check: `performance_snapshot`, `draw_call_breakdown`, `memory_stats`, `dispose_check` after hot reloads.
