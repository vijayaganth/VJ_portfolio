import { gsap, type Conditions } from "../gsap";

/** Desktop: pin the Work section and move the cards sideways as you scroll down. */
export function workScroll(root: HTMLElement, c: Conditions) {
  const section = root.querySelector<HTMLElement>("#work");
  const track = root.querySelector<HTMLElement>("[data-work-track]");
  if (!section || !track) return;

  if (!c.isDesktop || c.reduce) {
    gsap.from(track.children, {
      opacity: 0,
      y: c.reduce ? 0 : 32,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: { trigger: track, start: "top 85%" },
    });
    return;
  }

  track.dataset.horizontal = "";
  const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);

  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      pin: true,
      // On viewports shorter than the section, pin it centred so the cards stay in view.
      start: () => `top+=${Math.max(0, section.offsetHeight - window.innerHeight) / 2} top`,
      end: () => `+=${distance()}`,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  return () => {
    delete track.dataset.horizontal;
  };
}

/** Cards tilt toward the pointer in 3D. Desktop with a fine pointer only. */
export function workTilt(root: HTMLElement) {
  const cards = root.querySelectorAll<HTMLElement>("[data-tilt]");
  const cleanups: (() => void)[] = [];

  cards.forEach((card) => {
    gsap.set(card, { transformPerspective: 900 });
    const rotX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
    const rotY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 16);
      rotX(-py * 16);
    };
    const leave = () => {
      rotX(0);
      rotY(0);
    };

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
