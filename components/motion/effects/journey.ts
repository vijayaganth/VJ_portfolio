import { gsap, ScrollTrigger, type Conditions } from "../gsap";

/**
 * The timeline rail fills from the top as it scrolls past the reading line, and each stop lights up
 * when the fill reaches it. Role cards slide in as they enter. Reduced motion: rail full, stops lit.
 */
export function journeyTimeline(root: HTMLElement, c: Conditions) {
  const timeline = root.querySelector<HTMLElement>("[data-journey]");
  const fill = root.querySelector<HTMLElement>("[data-journey-fill]");
  if (!timeline || !fill || c.reduce) return;

  const line = "65%"; // where the fill's tip sits in the viewport
  timeline.dataset.journeyMotion = "";

  gsap.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: timeline, start: `top ${line}`, end: `bottom ${line}`, scrub: 0.4 },
    },
  );

  const triggers = Array.from(timeline.querySelectorAll<HTMLElement>("[data-journey-row]")).map((row) => {
    const stop = row.querySelector<HTMLElement>("[data-journey-stop]")!;
    const detail = row.querySelector<HTMLElement>("[data-journey-detail]")!;

    // Swings in from the rail like a door opening toward you.
    gsap.from(detail, {
      x: 48,
      rotationY: -24,
      transformPerspective: 900,
      transformOrigin: "left center",
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 85%" },
    });

    return ScrollTrigger.create({
      trigger: stop,
      start: `center ${line}`,
      // Lit once the fill passes, and stays lit below it; unlit again only when scrolling back above.
      onEnter: () => (stop.dataset.lit = ""),
      onLeaveBack: () => delete stop.dataset.lit,
    });
  });

  return () => {
    delete timeline.dataset.journeyMotion;
    triggers.forEach((t) => delete (t.trigger as HTMLElement).dataset.lit);
  };
}
