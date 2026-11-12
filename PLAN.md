# Portfolio – Ultra plan

Source of truth: `BUILD_BRIEF.md` (scope, copy, colours, rules) and `design/*.reference.html` (layout, spacing).
This plan says **how** we build it and **who** (which agent / skill) does each part.

---

## 1. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router, latest stable) + React 19 + TypeScript strict | Brief default; static export-friendly, `next/font`, image + bundle tooling |
| Package manager | pnpm | Already installed, fast, strict lockfile |
| Styling | CSS Modules + global CSS variables (`app/tokens.css`) | References are hand-written CSS; 1:1 port is faster and more faithful than utility classes. No Tailwind. |
| Fonts | `next/font/google`: Space Grotesk (500, 700), Inter (400, 500), JetBrains Mono (500) | Brief rule; exposed as `--font-display`, `--font-body`, `--font-mono` |
| Motion | `gsap` + `@gsap/react` (`useGSAP`), plugins: ScrollTrigger, SplitText | Brief; all plugins free |
| Smooth scroll | `lenis` (official package), driven by `gsap.ticker`, `ScrollTrigger.update` on scroll | Single RAF loop, no double ticking |
| 3D | `three` + `@react-three/fiber` (+ `@react-three/drei` only if a helper is genuinely needed) | Brief; custom GLSL shader orb, no models/textures |
| Dev tooling | threejs-devtools-mcp, via its proxy on :9222 (injects the bridge; no app code) | Live orb tuning; nothing ships |
| Lint / format | ESLint (next config) + Prettier | Standard |
| Verification | Built-in browser pane screenshots at 1440 and 390; Playwright screenshot script (`pnpm shots`); Lighthouse CLI (`pnpm lh`) | Agents can self-verify against the references |
| Hosting | Vercel (preview per branch, prod on `main`) | Brief |

Not used (on purpose): Tailwind, Framer Motion, a CMS, analytics scripts, any UI kit. Content lives in `content/site.ts`.

---

## 2. Architecture

```
app/
  layout.tsx          fonts, <html> vars, <SmoothScroll> provider
  page.tsx            composes sections in order
  tokens.css          colour + type tokens (from BUILD_BRIEF table)
  globals.css         reset, focus styles, reduced-motion base
components/
  layout/Nav.tsx  Footer.tsx  Section.tsx (bg colour token + data-bg for scroll colour)
  sections/Hero.tsx  Intro.tsx  Work.tsx  Journey.tsx  Skills.tsx  Contact.tsx
  ui/Pill.tsx  WorkCard.tsx  Eyebrow.tsx
  motion/SmoothScroll.tsx   Lenis + ScrollTrigger sync (client)
  motion/useReducedMotion.ts
  orb/OrbCanvas.tsx   R3F <Canvas>, lazy, client-only
  orb/Orb.tsx         mesh + ShaderMaterial
  orb/orb.vert.glsl  orb.frag.glsl
content/site.ts       all copy, links, projects, jobs, skill groups (verbatim from references)
scripts/shots.ts      Playwright: screenshot localhost at 1440 & 390 vs design/
```

Key decisions
- **Server components by default.** Only `SmoothScroll`, animated sections' motion hooks, and `OrbCanvas` are `'use client'`.
- **Static first, motion as a layer.** Every section renders correctly with JS off and with `prefers-reduced-motion`. Motion attaches via `useGSAP` refs, never changes layout markup.
- **Orb is lazy.** `next/dynamic(() => import('./OrbCanvas'), { ssr: false })`, mounted after first paint (`requestIdleCallback`) and only while hero is in view. Static CSS gradient orb from the reference is the placeholder / reduced-motion / no-WebGL fallback.
- **Section colour change on scroll:** one ScrollTrigger per `[data-bg]` section tweens `body` background; sections keep their own bg as the no-JS baseline.
- **Work pinned horizontal scroll:** `gsap.matchMedia()` — `(min-width: 761px) and (prefers-reduced-motion: no-preference)` only. Mobile = vertical stack (reference breakpoint is 760px).

---

## 3. Phases and gates

| # | Phase | Output | Gate (must pass before next) |
| --- | --- | --- | --- |
| 0 | Scaffold | Next app, pnpm, tokens, fonts, lint, `content/site.ts` | `pnpm build` passes |
| 1 | Static sections | All 7 sections matching references | Visual QA at 1440 + 390 vs `design/`; **stop and show Vijayaganth** (brief requirement) |
| 2 | Motion | Lenis, SplitText H1, bg colour scroll, pinned Work + tilt, Journey line draw, Skills pills | Reduced-motion check, 60fps scroll trace, no CLS |
| 3 | Orb | Shader orb, cursor reaction, idle motion, mobile DPR cap | Devtools inspection, draw calls ≤ 2, mobile fps, fallback works |
| 4 | Hardening | a11y, SEO meta/OG, Lighthouse | Lighthouse mobile perf ≥ 90, a11y ≥ 95; prod bundle has no devtools bridge |
| 5 | Ship | Vercel project, domain | Preview URL reviewed, then prod |

Budgets: JS for first load ≤ 180 kB gzip excluding the lazy orb chunk; orb chunk loaded after LCP; LCP element = hero H1; CLS 0.

---

## 4. Agentic AI workflow

The main Claude Code session is the **orchestrator**. It owns the plan, the task list and every user checkpoint. Specialist subagents (`.claude/agents/`) do bounded work and report back; project skills (`.claude/skills/`) hold the know-how each step needs, so any agent loads the same rules.

```
            ┌──────────── Orchestrator (main session) ────────────┐
            │ reads PLAN.md, runs phase gates, asks the user       │
            └──┬────────────┬──────────────┬─────────────┬────────┘
               │            │              │             │
     section-builder  motion-engineer  orb-engineer   qa-reviewer
     (Phase 0-1)      (Phase 2)        (Phase 3)      (every gate, read-only)
        │ skills:         │ skills:        │ skills:       │ skills:
        │ portfolio-      │ portfolio-     │ portfolio-    │ visual-qa
        │ tokens,         │ motion,        │ orb, threejs-*│ perf-a11y-audit
        │ build-section   │ gsap-*         │               │
```

Loop per phase
1. **Plan** – orchestrator splits the phase into tasks (one section / one effect each).
2. **Build** – the matching subagent implements, loading its skills first. Independent sections may run in parallel only if they touch different files.
3. **Verify** – `qa-reviewer` runs `visual-qa` (+ `perf-a11y-audit` from Phase 2 on) and returns a pass/fail list with screenshots.
4. **Fix** – builder fixes fails; max 3 loops, then escalate to the user.
5. **Checkpoint** – orchestrator shows the result to Vijayaganth at the gates marked in §3, commits on a feature branch (`feat/phase-N-…`), opens a PR → Vercel preview.

Tools each step uses
- Browser pane (`mcp__Claude_Browser__*`): dev server preview, screenshots at 1440 / 390, reduced-motion emulation.
- threejs-devtools-mcp: `scene_tree`, `set_uniform` (live preview), `performance_snapshot`, `draw_call_breakdown`; values the user likes go into source via `pending_changes`.
- Bash: `pnpm build`, `pnpm shots`, `pnpm lh`.

Guard rails (all agents)
- Copy comes only from `content/site.ts` / the references. Never invent copy, stats or logos.
- No commits to `main`; no deploy to prod without the user's yes.
- Do not touch `design/` or `BUILD_BRIEF.md`.

---

## 5. Skill map

| Skill | Scope | Used by |
| --- | --- | --- |
| `portfolio-tokens` (project) | colour/type tokens, spacing scale, breakpoints, extracted from references | all builders |
| `build-section` (project) | how to port a reference section to a component, checklist | section-builder |
| `portfolio-motion` (project) | Lenis+ScrollTrigger setup, per-section recipes, reduced motion | motion-engineer |
| `portfolio-orb` (project) | shader orb spec, lazy-load, cursor, mobile, devtools bridge | orb-engineer |
| `visual-qa` (project) | compare dev build to references at 1440 / 390 | qa-reviewer |
| `perf-a11y-audit` (project) | Lighthouse, contrast, keyboard, reduced motion, bundle check | qa-reviewer |
| `ship-vercel` (project) | deploy checklist | orchestrator |
| `gsap-core/-react/-scrolltrigger/-plugins/-timeline/-performance/-utils` (installed) | GSAP API | motion-engineer |
| `threejs-fundamentals/-shaders/-react-three-fiber/-performance/-interaction` (installed) | Three.js / R3F | orb-engineer |
