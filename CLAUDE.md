# Vijayaganth portfolio

Single-page portfolio. Next.js (App Router) + TypeScript, CSS Modules + tokens, GSAP + Lenis, React Three Fiber orb, Vercel.

## Read first
- `BUILD_BRIEF.md` – scope, final copy, colours, rules. Do not edit.
- `PLAN.md` – stack, architecture, phases, gates, agent workflow.
- `design/Desktop.reference.html` (1440) and `design/Mobile.reference.html` (390) – layout source of truth. Do not edit.

## Workflow
The main session orchestrates; subagents in `.claude/agents/` build and verify:
- `section-builder` → static sections (Phase 0–1)
- `motion-engineer` → GSAP / Lenis (Phase 2)
- `orb-engineer` → Three.js orb (Phase 3)
- `qa-reviewer` → read-only checks at every gate

Project skills in `.claude/skills/`: `portfolio-tokens`, `build-section`, `portfolio-motion`, `portfolio-orb`, `visual-qa`, `perf-a11y-audit`, `ship-vercel`. Global `gsap-*` and `threejs-*` skills cover library APIs.

## Hard rules
- Never invent copy, stats or logos. Copy lives in `content/site.ts`, verbatim from the references.
- Stop after Phase 1 (static sections) and show Vijayaganth before adding motion.
- Respect `prefers-reduced-motion`. No pinned scroll on mobile. Lazy-load the 3D canvas.
- The threejs devtools bridge is dev-only and must not appear in the production build.
- Tokens only in component CSS; no raw hex.
- Feature branches + PRs; never push to `main` or deploy to prod without an explicit yes.

## Commands (after scaffold)
- `pnpm dev` / `pnpm build` / `pnpm lint`
- `pnpm shots` – Playwright screenshots at 1440 and 390
- `pnpm lh` – Lighthouse mobile report to `reports/`
