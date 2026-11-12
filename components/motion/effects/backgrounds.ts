import { gsap, ScrollTrigger, type Conditions } from "../gsap";

/**
 * The page background takes the colour of the section crossing the middle of the viewport.
 * Sections keep their own background until JS adds .bg-motion, so no-JS still looks right.
 */
export function sectionBackgrounds(root: HTMLElement, c: Conditions) {
  const sections = root.querySelectorAll<HTMLElement>("[data-bg]");
  const html = document.documentElement;
  const colour = (s: HTMLElement) => getComputedStyle(html).getPropertyValue(`--c-${s.dataset.bg}`).trim();

  html.classList.add("bg-motion");
  gsap.set(document.body, { backgroundColor: colour(sections[0]) });

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 55%",
      end: "bottom 55%",
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.to(document.body, {
          backgroundColor: colour(section),
          duration: c.reduce ? 0 : 0.6,
          ease: "power1.out",
          overwrite: "auto",
        });
      },
    });
  });

  return () => {
    html.classList.remove("bg-motion");
    gsap.set(document.body, { clearProps: "backgroundColor" });
  };
}
