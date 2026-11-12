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
};

const MAX_MOTES = 120;

/** "#14e3c2" → "20, 227, 194" for rgba(). */
function rgb(hex: string) {
  const n = parseInt(hex.trim().replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** A small bright dot with a thin halo, drawn once, then stamped with drawImage. */
function sprite(color: string, core: string) {
  const size = 32;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${core}, 1)`);
  g.addColorStop(0.22, `rgba(${color}, 1)`);
  g.addColorStop(0.4, `rgba(${color}, 0.25)`);
  g.addColorStop(1, `rgba(${color}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

/**
 * Bioluminescent cursor, kept light: the mouse leaves a sparse trail of small teal and blue dots that
 * twinkle and fade, and a click sends a small ring of dots outward. The dots stay where they were left
 * on the page as you scroll. Mouse (fine pointer) only, never with reduced motion. Drawn on one fixed
 * canvas that only runs while a dot is alive.
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
    const sprites = { teal: sprite(teal, white), blue: sprite(blue, white) };

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      el.width = Math.round(window.innerWidth * dpr);
      el.height = Math.round(window.innerHeight * dpr);
    };
    resize();

    const motes: Mote[] = [];
    const pointer = { x: -999, y: -999 };
    let last: { x: number; y: number } | null = null;
    let travel = 0; // distance moved since the last dot
    let dim = 1; // softer over the light (yellow, teal) sections
    let raf = 0;
    let then = 0;
    let scrollY = window.scrollY;

    const add = (m: Omit<Mote, "life">) => {
      if (motes.length >= MAX_MOTES) motes.shift();
      motes.push({ ...m, life: m.max });
    };

    const dot = (x: number, y: number) =>
      add({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 12,
        vy: -6 - Math.random() * 12,
        r: 2.5 + Math.random() * 2.5,
        max: 0.7 + Math.random() * 0.6,
        sprite: Math.random() < 0.6 ? sprites.teal : sprites.blue,
      });

    const frame = (now: number) => {
      const dt = Math.min((now - then) / 1000 || 0.016, 0.05);
      then = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";

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
        // Fades out while it twinkles; the sprite is 4× the dot so its halo fits.
        ctx.globalAlpha = t * (0.65 + 0.35 * Math.sin(now / 60 + m.x)) * dim;
        const size = m.r * 2;
        ctx.drawImage(m.sprite, m.x - size, m.y - size, size * 2, size * 2);
      }

      ctx.globalAlpha = 1;
      raf = motes.length ? requestAnimationFrame(frame) : 0;
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
      // Sparse trail: one dot per ~18px moved, placed along the path.
      const from = last ?? pointer;
      const dx = pointer.x - from.x;
      const dy = pointer.y - from.y;
      const dist = Math.hypot(dx, dy);
      const gap = 18;
      for (let d = gap - travel; d <= dist; d += gap) dot(from.x + (dx * d) / dist, from.y + (dy * d) / dist);
      travel = (travel + dist) % gap;
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

    // A click sends a small ring of dots outward, like a footstep on the forest floor.
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const n = 10;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        add({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * 80,
          vy: Math.sin(a) * 80,
          r: 3,
          max: 0.6,
          sprite: i % 2 ? sprites.blue : sprites.teal,
        });
      }
      wake();
    };

    const leave = () => {
      last = null;
      travel = 0;
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
