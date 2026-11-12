---
name: portfolio-tokens
description: Colour, type, spacing and breakpoint tokens for Vijayaganth's portfolio, extracted from BUILD_BRIEF.md and design/*.reference.html. Load before writing any CSS or component markup in this project.
---

# Portfolio tokens

Sources of truth, in order: `BUILD_BRIEF.md` → `design/Desktop.reference.html` (1440) → `design/Mobile.reference.html` (390).
At widths ≤ 760px the **Mobile reference wins** where it differs from the desktop file's own `@media (max-width:760px)` block.

## `app/tokens.css`

```css
:root {
  /* surfaces */
  --c-base: #06111F;      /* hero, skills, footer, page */
  --c-intro: #0C1A3A;
  --c-work: #081A2E;
  --c-orb-base: #0E2540;
  --c-divider: #1E3550;
  /* text */
  --c-text: #EAF6FF;
  --c-muted: #9DB6CC;
  --c-body-muted: #C5DAEA;
  --c-ink: #06111F;       /* text on teal/blue/magenta/yellow */
  /* accents */
  --c-teal: #14E3C2;
  --c-blue: #3D7BFF;
  --c-magenta: #E43DFF;
  --c-magenta-text: #F08CFF; /* "whole products" in Intro */
  --c-yellow: #FFC93D;

  --font-display: var(--font-space-grotesk), system-ui, sans-serif;
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;

  --container: 1200px;
  --gutter: 56px;          /* 24px on mobile */
  --radius-card: 24px;
  --radius-pill: 999px;
  --tap: 44px;
}
@media (max-width: 760px) { :root { --gutter: 24px; } }
```

## Type scale (desktop → mobile)

| Role | Font | Desktop | Mobile | Tracking / leading |
| --- | --- | --- | --- | --- |
| Wordmark | display 700 | 22 | check mobile ref | -0.02em |
| Hero H1 | display 700 | 96 / lh 1 | 52–56 (mobile ref) | -0.045em |
| Hero para | body 400 | 20 / 1.5, max 520px, `--c-body-muted` | 16–17 | |
| Intro statement | display 500 | 64 / 1.1, max 1040px, `text-wrap: pretty` | 30–34 | -0.03em |
| Section H2 | display 700 | 72 / 1 | 40–44 | -0.04em |
| Card title | display 700 | 48 / 1 | mobile ref | -0.03em |
| Journey role | display 700 | 32 / 1.1 | mobile ref | -0.02em |
| Contact H2 | display 700 | 120 / 0.98, max 980px | 52–56 | -0.045em |
| Contact email | display 500 | 40, 3px underline border | 24 | -0.02em |
| Skill pill | display 500 | 20, 2px border, 10px 22px | mobile ref | |
| Label / eyebrow | mono 500 | 14, uppercase | 12–13 | 0.12em |
| Body | body 400 | 17–18 / 1.5 | 16 | |

Always read the exact number from the reference file for the element you are building; this table is a map, not a substitute.

## Layout
- Container `max-width: 1200px; margin: 0 auto; padding-inline: var(--gutter)`.
- Section vertical padding (desktop): hero 200 top / 96 bottom; intro 140; work 120; journey 120; skills 140; contact 120–140; footer 36. Mobile: mostly 80px; hero 260 top / 64 bottom.
- Work cards: grid `repeat(auto-fit, minmax(min(320px,100%),1fr))`, gap 24, min-height 440, padding 32, radius 24. Card colours in order teal, blue, magenta.
- Journey and Skills rows: grid `220px 1fr`, gap 32, `border-top: 1.5px solid` (ink on yellow, `--c-divider` on dark); collapse to one column ≤ 760.
- Skill group pill border colours cycle teal, blue, magenta, yellow.

## Rules
- Component CSS uses `var(--…)` only. A raw hex in a module is a bug.
- Focus ring: `2px solid var(--c-yellow)`, offset 4px; on yellow/teal surfaces use `--c-ink`.
