import { gsap, SplitText, type Conditions } from "../gsap";
import { orbits, orbitPoint } from "@/components/sections/orbit";

/**
 * H1 reveals line by line. The eyebrow, body and cue are visible from first paint (the body is the
 * LCP element), so they only slide into place. The orbit rings draw in around the orb and their dots
 * travel the rings, passing behind the orb on the far half. Scrolling away, the copy lifts and fades
 * a little faster than the orb, so the two separate in depth.
 * Reduced motion: the H1 fades, nothing moves; the dots rest on the near half of their rings.
 */
export function heroReveal(root: HTMLElement, c: Conditions) {
  const title = root.querySelector<HTMLElement>("[data-split='lines']");
  const rest = root.querySelectorAll<HTMLElement>("[data-hero-reveal]");
  if (!title) return;

  // Hidden by CSS while scripting is enabled (globals.css), to avoid a flash before the split.
  gsap.set(title, { autoAlpha: 1 });

  if (c.reduce) {
    gsap.from(title, { opacity: 0, duration: 0.6, ease: "power1.out" });
    return;
  }

  SplitText.create(title, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, { yPercent: 110, duration: 1, stagger: 0.12, ease: "expo.out", delay: 0.1 }),
  });

  gsap.from(rest, {
    y: c.isMobile ? 12 : 20,
    duration: 1,
    stagger: 0.08,
    ease: "expo.out",
    delay: 0.2,
  });

  const cleanups = [orbitDots(root), scrollAway(root, c)];
  return () => cleanups.forEach((fn) => fn?.());
}

/** Rings draw in, then each dot circles its ring; on the far half it drops behind the orb. */
function orbitDots(root: HTMLElement) {
  const wrap = root.querySelector<HTMLElement>("[data-hero-orb]");
  if (!wrap) return;
  const rings = wrap.querySelectorAll<SVGPathElement>("[data-orbit-layer] path");
  const dots = Array.from(wrap.querySelectorAll<HTMLElement>("[data-orbit-dot]"));

  // Each ring is two arcs (back, front); draw both from their left ends.
  rings.forEach((ring, i) => {
    const length = ring.getTotalLength();
    gsap.fromTo(
      ring,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: 0.4 + i * 0.1 },
    );
  });
  gsap.from(dots, { autoAlpha: 0, scale: 0, duration: 0.6, ease: "back.out(2)", delay: 1.4, stagger: 0.15 });

  // Radians per second, and a starting angle so the two dots never line up.
  const speeds = [0.45, -0.32];
  const angles = [0.9, 2.2];
  let visible = true;
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(wrap);

  const tick = (_time: number, deltaMs: number) => {
    if (!visible) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    dots.forEach((dot, i) => {
      angles[i] += speeds[i] * dt;
      const { left, top } = orbitPoint(orbits[i], angles[i]);
      dot.style.left = `${left}%`;
      dot.style.top = `${top}%`;
      // sin > 0 is the near half (below the centre line before tilt).
      dot.style.zIndex = Math.sin(angles[i]) > 0 ? "3" : "1";
    });
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    io.disconnect();
    dots.forEach((dot) => (dot.style.zIndex = ""));
  };
}

/** Copy lifts and fades faster than the orb as the hero scrolls away. */
function scrollAway(root: HTMLElement, c: Conditions) {
  const hero = root.querySelector<HTMLElement>("[data-hero-orb]")?.closest("section");
  const content = root.querySelector<HTMLElement>("[data-hero-content]");
  const orb = root.querySelector<HTMLElement>("[data-hero-orb]");
  if (!hero || !content || !orb) return;

  const trigger = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  gsap.to(content, { yPercent: c.isMobile ? -8 : -14, opacity: 0.2, ease: "none", scrollTrigger: trigger });
  gsap.to(orb, { yPercent: c.isMobile ? 10 : 18, scale: 0.92, ease: "none", scrollTrigger: { ...trigger } });
}
