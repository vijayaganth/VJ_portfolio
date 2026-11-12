---
name: perf-a11y-audit
description: Performance, accessibility and production-safety audit for the portfolio — Lighthouse mobile ≥ 90, contrast, keyboard, reduced motion, bundle budgets, and confirming the threejs devtools bridge is absent from production. Use at Phase 2+ gates and before any deploy.
---

# Perf + a11y audit

Run against a **production** build: `pnpm build && pnpm start` (port 3000).

## Performance
- `pnpm lh` → `npx lighthouse http://localhost:3000 --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./reports/lh.json --chrome-flags="--headless"`.
  Gates: perf ≥ 90, a11y ≥ 95, best-practices ≥ 95, SEO ≥ 95. CLS = 0, LCP element is the hero H1.
- Bundles: read `.next` build output. First-load JS ≤ 180 kB gzip; three/R3F must be in a separate lazy chunk not requested before LCP (check the network list in the browser pane).
- Devtools bridge absent: `grep -rl "threejs-devtools\|DevBridge" .next/static && echo FAIL || echo clean`.
- Orb: via threejs-devtools-mcp in dev, `performance_snapshot` desktop and with mobile emulation; draw calls ≤ 2.

## Accessibility
- Contrast: every text/background pair from `portfolio-tokens` ≥ 4.5:1 (≥ 3:1 for ≥ 24px text). Compute, don't eyeball.
- Keyboard: Tab through the page; every link/button reachable, visible focus ring, order matches visual order; pinned Work section does not trap focus.
- One h1, h2 per section, landmarks (`header`, `main`, `footer`, `nav`), `lang="en"`, orb canvas `aria-hidden`.
- Reduced motion: no Lenis, no pin, no orb animation, content visible.
- Touch targets ≥ 44px at 390.

## Report
Table of gate → value → PASS/FAIL, then fixes ranked by impact.
