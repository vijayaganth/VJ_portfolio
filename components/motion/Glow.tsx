"use client";

import { useEffect, useRef } from "react";
import styles from "./Glow.module.css";

type Mote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  sprite: HTMLCanvasElement;
  spark: boolean;
};

const MAX_MOTES = 260;

/** "#14e3c2" → "20, 227, 194" for rgba(). */
function rgb(hex: string) {
  const n = parseInt(hex.trim().replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** A soft round glow drawn once, then stamped with drawImage (far cheaper than a gradient per mote). */
function sprite(color: string, core: string) {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${core}, 1)`);
  g.addColorStop(0.18, `rgba(${color}, 0.9)`);
  g.addColorStop(0.45, `rgba(${color}, 0.3)`);
  g.addColorStop(1, `rgba(${color}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

/**
 * Bioluminescent cursor: wherever the mouse goes, teal and blue light blooms and fades, with small
 * sparks like glowing moss, and a click sends a ring of light outward. The light stays where it was
 * left on the page as you scroll. Mouse (fine pointer) only, never with reduced motion. Drawn on one
 * fixed canvas that only runs while something is glowing.
 */
export function Glow() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !fine || reduce) return;
    const ctx = el.getContext("2d")!;

    const css = getComputedStyle(document.documentElement);
    const teal = rgb(css.getPropertyValue("--c-teal"));
    const blue = rgb(css.getPropertyValue("--c-blue"));
    const white = rgb(css.getPropertyValue("--c-text"));
    const sprites = { teal: sprite(teal, teal), blue: sprite(blue, blue), spark: sprite(teal, white) };

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      el.width = Math.round(window.innerWidth * dpr);
      el.height = Math.round(window.innerHeight * dpr);
    };
    resize();

    const motes: Mote[] = [];
    const pointer = { x: -999, y: -999, inside: false };
    let last: { x: number; y: number } | null = null;
    let halo = 0; // the pool of light right under the cursor, 0..1
    let dim = 1; // softer over the light (yellow, teal) sections
    let raf = 0;
    let then = 0;
    let scrollY = window.scrollY;

    const add = (m: Omit<Mote, "life">) => {
      if (motes.length >= MAX_MOTES) motes.shift();
      motes.push({ ...m, life: m.max });
    };

    const bloom = (x: number, y: number) => {
      const spread = 12;
      add({
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 6,
        r: 22 + Math.random() * 30,
        max: 1.1 + Math.random() * 0.9,
        sprite: Math.random() < 0.6 ? sprites.teal : sprites.blue,
        spark: false,
      });
      if (Math.random() < 0.35) {
        add({
          x: x + (Math.random() - 0.5) * 50,
          y: y + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 10,
          vy: -8 - Math.random() * 14,
          r: 3 + Math.random() * 4,
          max: 0.8 + Math.random() * 1.2,
          sprite: sprites.spark,
          spark: true,
        });
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - then) / 1000 || 0.016, 0.05);
      then = now;
      halo += ((pointer.inside ? 1 : 0) - halo) * Math.min(1, dt * 4);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";

      if (halo > 0.01) {
        const r = 150;
        ctx.globalAlpha = 0.16 * halo * dim;
        ctx.drawImage(sprites.teal, pointer.x - r, pointer.y - r, r * 2, r * 2);
      }

      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.life -= dt;
        if (m.life <= 0) {
          motes.splice(i, 1);
          continue;
        }
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const t = m.life / m.max; // 1 → 0
        // Sparks twinkle; blooms swell a little as they fade.
        const alpha = m.spark ? t * (0.6 + 0.4 * Math.sin(now / 70 + m.x)) : t * t * 0.7;
        const size = m.spark ? m.r : m.r * (1 + (1 - t) * 0.7);
        ctx.globalAlpha = alpha * dim;
        ctx.drawImage(m.sprite, m.x - size, m.y - size, size * 2, size * 2);
      }

      ctx.globalAlpha = 1;
      raf = motes.length || halo > 0.01 ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (raf) return;
      then = performance.now();
      raf = requestAnimationFrame(frame);
    };

    let probe = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      // Trail: a bloom every ~10px along the path, so fast moves leave an unbroken line of light.
      const from = last ?? pointer;
      const steps = Math.min(8, Math.ceil(Math.hypot(pointer.x - from.x, pointer.y - from.y) / 10));
      for (let s = 1; s <= steps; s++) bloom(from.x + ((pointer.x - from.x) * s) / steps, from.y + ((pointer.y - from.y) * s) / steps);
      last = { x: pointer.x, y: pointer.y };
      // What is under the cursor (the canvas ignores the pointer), checked at most once a frame.
      if (!probe) {
        probe = requestAnimationFrame(() => {
          probe = 0;
          const under = document.elementFromPoint(pointer.x, pointer.y);
          dim = under?.closest("[data-surface='light']") ? 0.45 : 1;
        });
      }
      wake();
    };

    // A click sends a ring of light outward, like a footstep on the forest floor.
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const n = 18;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const speed = 170 + Math.random() * 40;
        add({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          r: 16 + Math.random() * 10,
          max: 0.75,
          sprite: i % 2 ? sprites.blue : sprites.teal,
          spark: false,
        });
      }
      wake();
    };

    const leave = () => {
      pointer.inside = false;
      last = null;
    };

    // Light stays where it was left on the page: shift it with the scroll.
    const scroll = () => {
      const dy = window.scrollY - scrollY;
      scrollY = window.scrollY;
      if (!dy) return;
      motes.forEach((m) => (m.y -= dy));
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(probe);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvas} className={styles.glow} aria-hidden="true" />;
}
