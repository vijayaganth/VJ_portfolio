"use client";

import { useRef, type ReactNode } from "react";
import { conditions, gsap, ScrollTrigger, useGSAP, type Conditions } from "./gsap";
import { heroReveal } from "./effects/hero";
import { sectionBackgrounds } from "./effects/backgrounds";
import { workScroll, workTilt } from "./effects/work";
import { journeyTimeline } from "./effects/journey";
import { skillsCloud } from "./effects/skills";
import { contactReveal } from "./effects/contact";

/** Attaches all page motion to the static markup through its data-* hooks. */
export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();

      mm.add(conditions, (context) => {
        const c = context.conditions as Conditions;
        // Backgrounds go last so their triggers are measured after the Work pin spacing exists.
        const cleanups = [
          heroReveal(el, c),
          workScroll(el, c),
          journeyTimeline(el, c),
          skillsCloud(el, c),
          contactReveal(el, c),
          sectionBackgrounds(el, c),
        ];
        return () => cleanups.forEach((fn) => fn?.());
      });

      // Pointer handlers live outside the scroll setup; matchMedia reverts them too.
      mm.add(`${conditions.isDesktop} and ${conditions.finePointer} and (prefers-reduced-motion: no-preference)`, () =>
        workTilt(el),
      );

      document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <div id="top" ref={root}>
      {children}
    </div>
  );
}
