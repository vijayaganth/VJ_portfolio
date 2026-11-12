---
name: portfolio-motion
description: Motion architecture and per-section animation recipes for Vijayaganth's portfolio — Lenis + GSAP ScrollTrigger sync in Next.js App Router, SplitText hero reveal, scroll-driven background colour, pinned horizontal Work scroll with card tilt, Journey line draw, Skills pills, and reduced-motion behaviour. Use for any animation work in this project.
---

# Portfolio motion

Also load: `gsap-react`, `gsap-scrolltrigger`, `gsap-plugins` (SplitText), `gsap-performance`.
Motion attaches to the `data-*` hooks defined in `build-section`. Never edit layout markup to make an animation work; if a hook is missing, add only the attribute.

## 1. Setup (once)

`components/motion/gsap.ts`
```ts
'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
export { gsap, ScrollTrigger, SplitText, useGSAP };
```

`components/motion/SmoothScroll.tsx` (client, wraps `{children}` in `app/layout.tsx`)
- `const lenis = new Lenis({ autoRaf: false })`; `lenis.on('scroll', ScrollTrigger.update)`;
  `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`.
- Skip Lenis entirely when `prefers-reduced-motion: reduce`.
- Anchor links (`#work` …) go through `lenis.scrollTo(target, { offset: 0 })`.
- Cleanup: remove ticker callback, `lenis.destroy()`.

Every effect: `useGSAP(() => { const mm = gsap.matchMedia(); mm.add({...}) }, { scope: ref })`.
Conditions used everywhere:
```ts
{ isDesktop: '(min-width: 761px)', isMobile: '(max-width: 760px)',
  reduce: '(prefers-reduced-motion: reduce)' }
```

## 2. Recipes

| Section | Effect | Recipe | Reduced motion |
| --- | --- | --- | --- |
| Hero H1 | line-by-line reveal | `SplitText.create(h1, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: self => gsap.from(self.lines, { yPercent: 110, stagger: .12, duration: .9, ease: 'expo.out' }) })`. Wait for `document.fonts.ready`. Eyebrow, para, cue fade up after. | opacity fade only |
| All | bg colour on scroll | For each `[data-bg]`: `ScrollTrigger.create({ trigger, start: 'top 50%', end: 'bottom 50%', onToggle: s => s.isActive && gsap.to('body', { backgroundColor: var, duration: .6, overwrite: 'auto' }) })`. Read colour via `getComputedStyle`. Sections become transparent only after JS adds `.js-bg` on `<html>` (no-JS keeps section bgs). | instant `set`, no tween |
| Work (desktop) | pinned horizontal scroll | Pin section; tween `[data-work-track]` `x: () => -(track.scrollWidth - window.innerWidth + gutter)`, `scrub: 1`, `end: () => '+=' + distance`, `invalidateOnRefresh: true`. Switch the track from grid to a flex row only inside this mm branch (class toggle). | no pin, grid stays |
| Work cards | 3D tilt | On `pointermove`: `gsap.quickTo(card, 'rotationY')` / `'rotationX'` ±8°, `transformPerspective: 900`; reset on leave. Only `(hover: hover) and (pointer: fine)`. | off |
| Journey | timeline fill | `[data-journey-fill]` `scaleY 0→1` scrubbed over `[data-journey]` (`top 65%` → `bottom 65%`); each `[data-journey-stop]` gets `data-lit` when the fill passes (`onEnter` / `onLeaveBack`); `[data-journey-detail]` (outer layer) fades up from `y: 24` and leans `rotationX 10→0` scrubbed from `top bottom` to `top 55%`; the inner card tilts with the pointer (`data-tilt="soft"`). No sideways or rotationY entrance (looked like stretching). Newest role first. | rail full, stops lit, no slide |
| Skills | 3D skills cloud | `skillsCloud`: `[data-skills-cloud]` gets `data-sphere`; pills on a Fibonacci sphere (ellipsoid, taller on mobile) turned on `gsap.ticker`, depth sets scale/opacity/z-index; bursts out from the centre at `top 80%`; steers toward the pointer (fine pointer), slows near the centre; scroll velocity adds spin; ticker work skipped while the section is off screen. Legend `[data-skills-group]`: hover previews, tap pins (`data-dim` / `data-lit` on pills). Grouped lists stay in the DOM for screen readers. | static wrapped cloud, fade only; legend still works |
| Mobile (all) | lighter | No pin, no tilt, shorter distances (y 24), same reveals. | |

## 3. Rules
- Transforms and opacity only. `will-change` only during the tween.
- Never `from()` content that is above the fold without `immediateRender` + fonts ready, or the H1 flashes.
- Call `ScrollTrigger.refresh()` after fonts load and after the orb canvas mounts.
- No CLS: SplitText `mask` lines, no height changes.
- Test: scroll top→bottom at 1440 and 390, toggle reduced motion in the browser pane, check console is clean.
