"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** matchMedia conditions shared by every effect. Desktop/mobile split matches the 760px design breakpoint. */
export const conditions = {
  isDesktop: "(min-width: 761px)",
  isMobile: "(max-width: 760px)",
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
};

export type Conditions = Record<keyof typeof conditions, boolean>;

export { gsap, ScrollTrigger, SplitText, useGSAP };
