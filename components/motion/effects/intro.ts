import { gsap, type Conditions } from "../gsap";

/**
 * Intro statement lights up word by word as it scrolls through the viewport; each highlighted
 * phrase's marker sweeps in as its words are reached, and the gradient rule fills alongside.
 * The colour fields drift slowly against the scroll.
 * Reduced motion: the statement fades in whole, markers and rule already full.
 */
export function introReveal(root: HTMLElement, c: Conditions) {
  const statement = root.querySelector<HTMLElement>("[data-intro]");
  const rule = root.querySelector<HTMLElement>("[data-intro-rule]");
  if (!statement || !rule) return;

  if (c.reduce) {
    gsap.from(statement, { opacity: 0, duration: 0.6, scrollTrigger: { trigger: statement, start: "top 85%" } });
    return;
  }

  const words = Array.from(statement.querySelectorAll<HTMLElement>("[data-intro-word]"));
  const step = 0.1; // timeline seconds between words; only the ratio matters under scrub

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: statement, start: "top 80%", end: "bottom 60%", scrub: 0.6 },
  });
  tl.fromTo(words, { opacity: 0.14 }, { opacity: 1, duration: step * 3, stagger: step }, 0);
  tl.fromTo(rule, { scaleY: 0 }, { scaleY: 1, duration: step * (words.length + 2) }, 0);

  // Each marker sweeps across while its own words light up.
  statement.querySelectorAll<HTMLElement>("[data-intro-marker]").forEach((marker) => {
    const own = Array.from(marker.parentElement!.querySelectorAll<HTMLElement>("[data-intro-word]"));
    const first = words.indexOf(own[0]);
    tl.fromTo(marker, { scaleX: 0 }, { scaleX: 1, duration: step * (own.length + 2) }, step * first);
  });

  root.querySelectorAll<HTMLElement>("[data-intro-blob]").forEach((blob, i) => {
    gsap.fromTo(
      blob,
      { yPercent: i ? 30 : -20 },
      {
        yPercent: i ? -30 : 20,
        ease: "none",
        scrollTrigger: { trigger: statement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}
