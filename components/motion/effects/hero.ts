import { gsap, SplitText, type Conditions } from "../gsap";

/**
 * H1 reveals line by line. The eyebrow, body and cue are visible from first paint (the body is the
 * LCP element), so they only slide into place. Reduced motion: the H1 fades, nothing moves.
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
}
