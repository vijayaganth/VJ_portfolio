import { gsap, ScrollTrigger, type Conditions } from "../gsap";

/**
 * The timeline rail fills from the top as it scrolls past the reading line, and each stop lights up
 * when the fill reaches it. Role cards fade up and lean back slightly in 3D until mid-screen.
 * Reduced motion: rail full, stops lit, cards flat.
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

    // Fades up as it enters.
    gsap.from(detail, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: row, start: "top 90%" },
    });

    // A small 3D lean tied to scroll: bottom edge tipped away as it rises, flat by mid-screen.
    // Tipping away (negative) only ever foreshortens the card, so it never looks stretched.
    gsap.fromTo(
      detail,
      { rotationX: -10, transformPerspective: 1200, transformOrigin: "center top" },
      {
        rotationX: 0,
        ease: "none",
        scrollTrigger: { trigger: row, start: "top bottom", end: "top 55%", scrub: 0.5 },
      },
    );

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
