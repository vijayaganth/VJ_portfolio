"use client";

import { Canvas } from "@react-three/fiber";
import { Orb } from "./Orb";

type Props = {
  pointer: { x: number; y: number };
  active: boolean;
  mobile: boolean;
  onReady: () => void;
};

// The canvas is 1.2× the orb slot (see Orb.module.css) so displacement is never clipped.
// Camera distance makes the unit sphere fill 1/1.2 of the canvas height.
const FOV = 30;
const SCALE = 1.2;
const angular = Math.atan(Math.tan(((FOV / 2) * Math.PI) / 180) / SCALE);
const DISTANCE = 1 / Math.sin(angular);

export default function OrbCanvas({ pointer, active, mobile, onReady }: Props) {
  return (
    <Canvas
      flat
      dpr={[1, mobile ? 1.5 : 2]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: FOV, position: [0, 0, DISTANCE], near: 0.1, far: 20 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true }}
      onCreated={() => requestAnimationFrame(onReady)}
      // Decorative and overlaps the nav: the pointer is read from window, so the canvas must not catch clicks.
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Orb pointer={pointer} detail={mobile ? 24 : 48} />
    </Canvas>
  );
}
