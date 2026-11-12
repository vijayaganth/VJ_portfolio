import { gsap, SplitText, type Conditions } from "../gsap";

/** H1 reveals line by line; eyebrow, body and cue fade up after. Reduced motion: plain fade. */
export function heroReveal(root: HTMLElement, c: Conditions) {
  const title = root.querySelector<HTMLElement>("[data-split='lines']");
  const rest = root.querySelectorAll<HTMLElement>("[data-hero-reveal]");
  if (!title) return;

  // Hidden by CSS while scripting is enabled (globals.css), to avoid a flash before the split.
  gsap.set([title, ...rest], { autoAlpha: 1 });

  if (c.reduce) {
    gsap.from([title, ...rest], { opacity: 0, duration: 0.6, stagger: 0.08, ease: "power1.out" });
    return;
  }

  gsap.from(rest[0], { opacity: 0, y: 12, duration: 0.6, ease: "power2.out" });

  SplitText.create(title, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        delay: 0.1,
      }),
  });

  gsap.from([...rest].slice(1), {
    opacity: 0,
    y: c.isMobile ? 16 : 24,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.55,
  });
}
