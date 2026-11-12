import { gsap, ScrollTrigger, type Conditions } from "../gsap";

/**
 * Skills cloud. The legend lights up one group (hover previews, tap pins) in every mode.
 * With motion: the pills sit on a slowly turning 3D sphere that bursts out from the centre on
 * first view, steers toward the pointer, slows near the centre so pills can be read, and spins a
 * little faster while scrolling. It only runs while the section is on screen.
 * Reduced motion: the static wrapped cloud, faded in.
 */
export function skillsCloud(root: HTMLElement, c: Conditions) {
  const section = root.querySelector<HTMLElement>("#skills");
  const cloud = root.querySelector<HTMLElement>("[data-skills-cloud]");
  if (!section || !cloud) return;

  const pills = Array.from(cloud.querySelectorAll<HTMLElement>("[data-pill]"));
  const buttons = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-skills-group]"));
  const cleanups: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    el.addEventListener(type, fn);
    cleanups.push(() => el.removeEventListener(type, fn));
  };

  // Legend: hover previews a group, tap pins it, tapping again clears it.
  let pinned: string | null = null;
  const focus = (group: string | null) => {
    pills.forEach((p) => {
      const match = group !== null && p.dataset.group === group;
      if (group === null || match) delete p.dataset.dim;
      else p.dataset.dim = "";
      if (match) p.dataset.lit = "";
      else delete p.dataset.lit;
    });
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.skillsGroup === pinned)));
  };
  buttons.forEach((b) => {
    on(b, "pointerenter", (e) => e.pointerType === "mouse" && focus(b.dataset.skillsGroup!));
    on(b, "pointerleave", (e) => e.pointerType === "mouse" && focus(pinned));
    on(b, "click", () => {
      pinned = pinned === b.dataset.skillsGroup ? null : b.dataset.skillsGroup!;
      focus(pinned);
    });
  });
  const resetLegend = () => {
    pinned = null;
    focus(null);
    buttons.forEach((b) => b.removeAttribute("aria-pressed"));
  };

  if (c.reduce) {
    gsap.from(pills, { opacity: 0, duration: 0.5, stagger: 0.02, scrollTrigger: { trigger: cloud, start: "top 85%" } });
    return () => {
      cleanups.forEach((fn) => fn());
      resetLegend();
    };
  }

  // Even spread over the sphere (Fibonacci lattice), unit radius.
  const n = pills.length;
  const points = pills.map((_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const a = i * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
  });

  cloud.dataset.sphere = "";
  // An ellipsoid: on phones the cloud is taller than wide, so pills spread vertically, not off the sides.
  const radius = { x: 0, y: 0 };
  const measure = () => {
    radius.x = cloud.clientWidth * (c.isMobile ? 0.3 : 0.4);
    radius.y = cloud.clientHeight * (c.isMobile ? 0.42 : 0.4);
  };
  measure();
  const resized = new ResizeObserver(measure);
  resized.observe(cloud);

  // Spin in radians per second. Idle spin, plus steering from the pointer and a scroll boost.
  const idle = { x: 0.08, y: 0.22 };
  const target = { ...idle };
  const spin = { ...idle };
  const angle = { x: 0.3, y: 0 };
  const burst = { r: 0 }; // 0 → 1 on first view
  let boost = 0;
  let visible = false;

  const render = () => {
    const sx = Math.sin(angle.x), cx = Math.cos(angle.x);
    const sy = Math.sin(angle.y), cy = Math.cos(angle.y);
    const rx = radius.x * burst.r;
    const ry = radius.y * burst.r;
    const front = c.isMobile ? 0.95 : 1.05; // scale of the nearest pill
    points.forEach((p, i) => {
      // Rotate around Y, then X.
      const x1 = p.x * cy + p.z * sy;
      const z1 = -p.x * sy + p.z * cy;
      const y2 = p.y * cx - z1 * sx;
      const z2 = p.y * sx + z1 * cx;
      const depth = (z2 + 1) / 2; // 0 back … 1 front
      const pill = pills[i];
      const scale = 0.55 + depth * (front - 0.55);
      pill.style.transform = `translate3d(${(x1 * rx).toFixed(1)}px, ${(y2 * ry).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      pill.style.opacity = (0.2 + depth * 0.8).toFixed(2);
      pill.style.zIndex = String(Math.round(depth * 100));
    });
  };

  const tick = (_time: number, deltaMs: number) => {
    if (!visible) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    boost *= 0.94;
    spin.x += (target.x - spin.x) * 0.06;
    spin.y += (target.y + boost - spin.y) * 0.06;
    angle.x += spin.x * dt;
    angle.y += spin.y * dt;
    render();
  };
  gsap.ticker.add(tick);
  cleanups.push(() => gsap.ticker.remove(tick));
  render();

  // Steer toward the pointer; near the centre it slows right down so a pill can be read or hovered.
  if (c.finePointer) {
    on(cloud, "pointermove", (e) => {
      const b = cloud.getBoundingClientRect();
      const dx = ((e.clientX - b.left) / b.width - 0.5) * 2;
      const dy = ((e.clientY - b.top) / b.height - 0.5) * 2;
      target.y = dx * 0.9;
      target.x = -dy * 0.9;
    });
    on(cloud, "pointerleave", () => Object.assign(target, idle));
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (visible = self.isActive),
    onUpdate: (self) => (boost = gsap.utils.clamp(-1.5, 1.5, self.getVelocity() / 1500)),
  });

  gsap.to(burst, {
    r: 1,
    duration: 1.6,
    ease: "expo.out",
    onUpdate: render,
    scrollTrigger: { trigger: cloud, start: "top 80%" },
  });

  return () => {
    cleanups.forEach((fn) => fn());
    resized.disconnect();
    resetLegend();
    delete cloud.dataset.sphere;
    pills.forEach((p) => {
      p.style.transform = "";
      p.style.opacity = "";
      p.style.zIndex = "";
    });
  };
}
