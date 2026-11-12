import { gsap, type Conditions } from "../gsap";

/** Each divider draws left to right as it scrolls into view. Reduced motion: lines stay drawn. */
export function journeyLines(root: HTMLElement, c: Conditions) {
  if (c.reduce) return;

  root.querySelectorAll<HTMLElement>("[data-journey-line]").forEach((line) => {
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: "left center",
      ease: "none",
      scrollTrigger: { trigger: line, start: "top 90%", end: "top 60%", scrub: true },
    });
  });
}
