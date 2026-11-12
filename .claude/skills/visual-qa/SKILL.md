---
name: visual-qa
description: Compare the running portfolio against design/Desktop.reference.html (1440) and design/Mobile.reference.html (390) section by section and report concrete differences. Use at every phase gate and after any section is built or changed.
---

# Visual QA

## Setup
1. Dev server running (`pnpm dev`, port 3000; start through `.claude/launch.json` / browser pane `preview_start`).
2. Open the reference files in a second tab (`file://…/design/Desktop.reference.html`).

## Per viewport (1440×900, then 390×844 with `resize_window`)
For each section in order (Hero, Intro, Work, Journey, Skills, Contact, Footer):
1. Screenshot the reference and the build at the same scroll position (`scroll_to` the section).
2. Compare: copy (exact text), font family/weight/size, letter-spacing, line-height, colours, padding/gaps, element order, wrap points of big headings, pill/card radius and borders.
3. For a suspect value, read computed styles in both pages with `javascript_tool`:
   `getComputedStyle(el).fontSize` etc. Report the numbers, not impressions.
4. Check no horizontal scroll: `document.documentElement.scrollWidth <= innerWidth`.

Optionally `pnpm shots` (Playwright) writes `shots/{desktop,mobile}-{section}.png` for both reference and build.

## From Phase 2 on, also
- Reduced motion (emulate with Playwright `reducedMotion: 'reduce'` in `pnpm shots`): content fully visible, no pin.
- Content is never hidden at rest after scrolling past (no stuck `opacity:0`).

## Report format
`FAIL | Work | 390 | card title 48px, expected 40px (Mobile ref) | shots/mobile-work.png`
List FAILs first (above the fold first), then a single PASS line per section. Ignore differences caused only by animation state mid-tween.
