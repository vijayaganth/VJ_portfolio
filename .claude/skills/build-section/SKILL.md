---
name: build-section
description: Step-by-step recipe for porting one section of design/Desktop.reference.html + Mobile.reference.html into a Next.js server component with CSS Modules, with motion hooks ready for later. Use when building or fixing any static section of the portfolio.
---

# Build a section

Load `portfolio-tokens` first.

## Steps
1. **Locate** the section in both reference files (`grep -n` on its heading text). Read the full inline `style=""` of every element in it, desktop and mobile.
2. **Content** – add or confirm its copy in `content/site.ts` (typed, verbatim, including `·`, `–` and `&`). Components read from there; no literal copy in JSX.
3. **Markup** – `components/sections/<Name>.tsx`, a server component wrapped in `<Section id="…" bg="…">`:
   - ids: `top` (hero), `work`, `journey`, `skills`, `contact` (nav anchors).
   - Headings: hero `h1`, every other section `h2`, card/job titles `h3`.
   - Links: real `<a>`; mailto and LinkedIn (`target="_blank" rel="noopener noreferrer"`).
4. **Styles** – `<Name>.module.css`. Translate inline styles to classes using tokens; desktop first, then `@media (max-width: 760px)` with values from the **Mobile** reference.
5. **Motion hooks** (no motion code yet) – add these attributes so `portfolio-motion` can attach without touching markup:
   | Section | Hook |
   | --- | --- |
   | Hero H1 | `data-split="lines"` |
   | Hero orb slot | `<div data-orb-slot>` containing the CSS gradient orb from the reference (it becomes the fallback) |
   | Any section | `data-bg="<token name>"` on `<Section>` |
   | Work track | `data-work-track` on the card list, `data-tilt` on each card |
   | Journey | `data-journey-line` on each divider (render divider as its own element, not a border, so it can scale) |
   | Skills | `data-pill` on each pill |
6. **Check** – `pnpm lint && pnpm build`, then hand off to `visual-qa`.

## Gotchas
- `text-wrap: pretty` on the intro statement; keep it.
- Journey section is yellow with ink text: dividers and focus rings switch to ink.
- Hero orb is `position:absolute` and overflows right; parent hero has `overflow:hidden`. Do not let it cause horizontal scroll at 390.
- Nav links hide at ≤ 760 in the reference. Keep the "Let's talk" button visible.
- Do not add anything not in the reference (no hamburger menu, icons, extra sections) without asking.
