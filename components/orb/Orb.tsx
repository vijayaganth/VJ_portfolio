"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, LinearSRGBColorSpace, MathUtils, type Group, type ShaderMaterial } from "three";
import { fragmentShader, vertexShader } from "./shaders";

type Props = {
  /** Pointer position over the hero, -1..1 on both axes (y up). Mutated by the parent, read every frame. */
  pointer: { x: number; y: number };
  detail: number;
};

// Tuned values; adjust live with threejs-devtools-mcp, then write them back here.
export const orbDefaults = {
  noiseScale: 1.1,
  noiseStrength: 0.02,
  fresnelPower: 2.5,
  maxTilt: 0.25,
  idleSpeed: 0.05,
};

// Keep the hex values as raw sRGB numbers (no conversion to linear) so the shader mixes like CSS.
const srgb = (hex: number) => new Color().setHex(hex, LinearSRGBColorSpace);

export function Orb({ pointer, detail }: Props) {
  const group = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: { x: 0, y: 0 } },
      uNoiseScale: { value: orbDefaults.noiseScale },
      uNoiseStrength: { value: orbDefaults.noiseStrength },
      uFresnelPower: { value: orbDefaults.fresnelPower },
      uBase: { value: srgb(0x0e2540) },
      uTeal: { value: srgb(0x14e3c2) },
      uBlue: { value: srgb(0x3d7bff) },
      uMagenta: { value: srgb(0xe43dff) },
      uYellow: { value: srgb(0xffc93d) },
    }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    const m = material.current;
    if (!g || !m) return;

    m.uniforms.uTime.value = state.clock.elapsedTime;
    const p = m.uniforms.uPointer.value;
    p.x = MathUtils.damp(p.x, pointer.x, 4, delta);
    p.y = MathUtils.damp(p.y, pointer.y, 4, delta);

    // Lean toward the pointer, on top of a very slow idle spin.
    g.rotation.x = MathUtils.damp(g.rotation.x, -pointer.y * orbDefaults.maxTilt, 4, delta);
    g.rotation.y = MathUtils.damp(g.rotation.y, pointer.x * orbDefaults.maxTilt, 4, delta);
    g.rotation.z += delta * orbDefaults.idleSpeed;
  });

  return (
    <group ref={group}>
      {/* Slightly oversized so the displaced surface never dips inside the slot's circular glow. */}
      <mesh scale={1 + orbDefaults.noiseStrength * 1.5}>
        <icosahedronGeometry args={[1, detail]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
}
