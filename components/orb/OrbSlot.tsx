"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "./Orb.module.css";

const OrbCanvas = dynamic(() => import("./OrbCanvas"), { ssr: false });

/** Skip WebGL where it would hurt: reduced motion, data saver, weak devices, no WebGL2 or software-only WebGL. */
function canRender3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  // failIfMajorPerformanceCaveat: no context when the browser would fall back to software rendering.
  const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return !!gl;
}

/**
 * The hero orb. Renders the static CSS orb from the design first (and as the fallback),
 * then mounts the WebGL orb when the browser is idle and the hero is on screen.
 */
export function OrbSlot({ className }: { className?: string }) {
  const slot = useRef<HTMLDivElement>(null);
  // Mutable pointer shared with the render loop; updating it must not re-render React.
  const [pointer] = useState(() => ({ x: 0, y: 0 }));
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    const start = () => {
      setMobile(window.matchMedia("(max-width: 760px)").matches);
      setEnabled(true);
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : window.setTimeout(start, 1200);

    const hero = slot.current?.closest("section");
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (hero) io.observe(hero);

    // Pointer relative to the orb centre, normalised to roughly -1..1 across the hero.
    const move = (e: PointerEvent) => {
      const r = slot.current?.getBoundingClientRect();
      if (!r) return;
      const span = Math.max(window.innerWidth, window.innerHeight) / 2;
      pointer.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / span));
      pointer.y = Math.max(-1, Math.min(1, -(e.clientY - (r.top + r.height / 2)) / span));
    };
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [pointer]);

  return (
    <div ref={slot} className={`${className ?? ""} ${styles.slot}`} data-orb-slot data-ready={ready || undefined} aria-hidden="true">
      <div className={styles.fallback} />
      {enabled && (
        <div className={styles.canvas}>
          <OrbCanvas pointer={pointer} active={visible} mobile={mobile} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
