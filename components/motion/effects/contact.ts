import { gsap, ScrollTrigger, SplitText, type Conditions } from "../gsap";

/**
 * Contact: the headline rises line by line, then the ink highlight wipes in under "Let's build it."
 * The two links fade up, and on desktop with a fine pointer they lean toward the cursor.
 * The band at the foot scrolls sideways forever, faster (and in the scroll direction) while scrolling.
 * Reduced motion: everything in place, a fade only; the band stands still.
 */
export function contactReveal(root: HTMLElement, c: Conditions) {
  const section = root.querySelector<HTMLElement>("#contact");
  const title = root.querySelector<HTMLElement>("[data-contact-title]");
  const mark = root.querySelector<HTMLElement>("[data-contact-mark]");
  const actions = root.querySelector<HTMLElement>("[data-contact-actions]");
  const track = root.querySelector<HTMLElement>("[data-contact-marquee]");
  if (!section || !title || !mark || !actions || !track) return;

  if (c.reduce) {
    gsap.from([title, actions], {
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: { trigger: title, start: "top 85%" },
    });
    return;
  }

  const cleanups: (() => void)[] = [];

  // Headline lines, then the highlight, then the links.
  const tl = gsap.timeline({ scrollTrigger: { trigger: title, start: "top 75%" } });
  const split = SplitText.create(title, { type: "lines", mask: "lines" });
  tl.from(split.lines, { yPercent: 110, duration: 1, stagger: 0.12, ease: "expo.out" })
    .from(mark, { scaleX: 0, duration: 0.8, ease: "expo.inOut" }, 0.35)
    .from(actions.children, { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.55);
  cleanups.push(() => split.revert());

  // Band: two identical runs, so wrapping at half the track loops without a seam.
  // Base speed in % of the track per second; scrolling adds a boost that decays, and flips the direction.
  const base = c.isMobile ? 1.9 : 1.5;
  const setX = gsap.quickSetter(track, "xPercent");
  const wrap = gsap.utils.wrap(-50, 0);
  let pos = 0;
  let direction = 1;
  let boost = 0;
  let visible = false;
  const tick = (_time: number, deltaMs: number) => {
    if (!visible) return;
    boost *= 0.92;
    pos = wrap(pos - (base + boost) * direction * (Math.min(deltaMs, 50) / 1000));
    setX(pos);
  };
  gsap.ticker.add(tick);
  cleanups.push(() => {
    gsap.ticker.remove(tick);
    gsap.set(track, { clearProps: "transform" });
  });
  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (visible = self.isActive),
    onUpdate: (self) => {
      direction = self.direction;
      boost = Math.min(12, Math.abs(self.getVelocity()) / 200);
    },
  });

  // Links lean toward the cursor and spring back on leave.
  if (c.isDesktop && c.finePointer) {
    actions.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((link) => {
      const x = gsap.quickTo(link, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(link, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const b = link.getBoundingClientRect();
        // -1 … 1 from the centre, so a wide pill moves no further than a small one.
        x(((e.clientX - b.left) / b.width - 0.5) * 2 * 10);
        y(((e.clientY - b.top) / b.height - 0.5) * 2 * 6);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      link.addEventListener("pointermove", move);
      link.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        link.removeEventListener("pointermove", move);
        link.removeEventListener("pointerleave", leave);
      });
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
