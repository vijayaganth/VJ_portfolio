import { gsap, type Conditions } from "../gsap";

/** Pills float up from slightly tilted positions, then settle. Reduced motion: fade only. */
export function skillPills(root: HTMLElement, c: Conditions) {
  const section = root.querySelector<HTMLElement>("#skills");
  if (!section) return;

  root.querySelectorAll<HTMLElement>("#skills ul").forEach((group) => {
    const pills = group.querySelectorAll<HTMLElement>("[data-pill]");
    const scrollTrigger = { trigger: group, start: "top 85%" };

    if (c.reduce) {
      gsap.from(pills, { opacity: 0, duration: 0.5, stagger: 0.03, scrollTrigger });
      return;
    }

    gsap.from(pills, {
      opacity: 0,
      y: c.isMobile ? 24 : 40,
      rotation: () => gsap.utils.random(-8, 8),
      duration: 0.9,
      ease: "back.out(1.6)",
      stagger: { each: 0.05, from: "random" },
      scrollTrigger,
    });
  });
}
