# Portfolio build brief – Vijayaganth

Single-page portfolio. Build it from the design reference files in `design/`
(Desktop.reference.html = 1440 layout, Mobile.reference.html = 390 layout).
These are static design drafts: copy layout, spacing, copy and colours from them.
The animation and the 3D orb do NOT exist in them; that is what we build.

Design canvas (view only): https://claude.ai/artifact/3NzrKnxyBrzoL3Cn3dhSpn

## Stack (default, change only if there is a reason)
- Next.js (App Router) + TypeScript
- GSAP (ScrollTrigger, SplitText). All GSAP plugins are free.
- Lenis for smooth scroll
- Three.js through React Three Fiber for the hero orb
- Deploy on Vercel

Use the installed skills: gsap-* (official GreenSock), threejs-* (cloudai-x).
Use threejs-devtools-mcp to inspect and tune the orb live in the browser (dev only).

## Colour tokens (palette "Electric ocean")
| token | hex |
| --- | --- |
| base / hero / skills / footer | #06111F |
| intro bg | #0C1A3A |
| work bg | #081A2E |
| text | #EAF6FF |
| muted | #9DB6CC |
| body muted | #C5DAEA |
| divider on dark | #1E3550 |
| teal | #14E3C2 |
| blue | #3D7BFF |
| magenta | #E43DFF |
| yellow (button, highlight) | #FFC93D |
| orb base | #0E2540 |
Text on teal / blue / magenta / yellow surfaces is #06111F.

## Type
- Display: Space Grotesk 500/700, tight tracking (-0.03em to -0.045em)
- Body: Inter 400/500
- Labels: JetBrains Mono 500, uppercase, 0.12em tracking
Load with next/font, not a <link>.

## Sections (in order)
1. Hero (#06111F): nav (Vijayaganth wordmark, Work / Journey / Skills / Contact, yellow "Let's talk" mailto button), eyebrow "Portfolio 2026 · Chennai, India", H1 "Frontend lead turned AI product engineer.", one paragraph, "Scroll to explore" cue. 3D orb on the right.
2. Intro (#0C1A3A): one big statement; "whole products" in #F08CFF, "AI workflows" in yellow.
3. Selected work (#081A2E): 3 cards. Paadam (teal, In development), Remo (blue, In development), ATS (magenta, Freelance client project).
4. The journey (yellow bg, #06111F text): Made By Fire 2014-2018, Latitude Fintech 2018-2019, F22 Labs 2019-2020, Entrans Technologies 2020-2023, HCL Technologies 2023-Present.
5. What I work with (#06111F): 5 groups (Frontend, AI & LLM, MCP, Backend & Data, Cloud & DevOps) with outlined pills, plus the education line.
6. Contact (teal bg): "Got a big idea? Let's build it.", email, LinkedIn.
7. Footer.
Copy is final unless Vijayaganth changes it. Do not invent new copy, stats or logos.
Contact email: vijayaganth.sivalingam@gmail.com
LinkedIn: https://www.linkedin.com/in/vijayaganth-s-87a0865b/

## Motion plan
- Hero: orb is a Three.js shader object (teal / blue / magenta / yellow on #0E2540), reacts to the cursor, slow idle motion. H1 reveals line by line with SplitText.
- Section backgrounds change colour on scroll (ScrollTrigger).
- Work: pinned horizontal scroll on desktop, cards tilt in 3D on pointer move. Plain vertical stack on mobile.
- Journey: the divider line draws as you scroll.
- Skills: pills float in, then settle.
- Lenis smooth scroll, synced with ScrollTrigger.

## Rules
- Respect prefers-reduced-motion (no orb motion, no scroll-jacking, fades only).
- Mobile: smaller orb, lower pixel ratio, no pinned scroll. Target 60fps on a mid-range phone.
- Real <a>, <button>, headings. Keep the contrast of the reference colours.
- Lighthouse performance 90+ on mobile; lazy-load the 3D canvas, never block first paint.
- Dev-only: devtools bridge must not ship in the production build.

## First task
1. Scaffold the Next.js project, set tokens in CSS variables, load fonts.
2. Build all sections static first, matching the reference files at 1440 and 390.
3. Then add Lenis + GSAP animations.
4. Last, add the Three.js orb.
Show me after step 2 before adding motion.
