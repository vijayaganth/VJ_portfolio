# Vercel deploy checklist

Branch: `feat/phase-4-hardening` (holds phases 1–4, stacked). Nothing is pushed yet; `origin` (github.com/vijayaganth/VJ_portfolio) has no branches.

## 0. Ready now

- [x] `pnpm lint` clean
- [x] `pnpm build` passes; `/` is prerendered static
- [x] Lighthouse mobile (local prod): performance 91–97, accessibility / best practices / SEO 100
- [x] Visual QA vs `design/` at 1440 and 390
- [x] Reduced motion: fades only, no pin, static CSS orb
- [x] No devtools bridge in the bundle. The only `__THREE_DEVTOOLS__` strings are three.js core's own no-op hook, present in every three build.
- [x] Node 22, `packageManager: pnpm@12.14.0` (Vercel reads this through Corepack)

## 1. Decisions owed by Vijayaganth

- [ ] **Favicon**: `app/favicon.ico` is still the default Next.js icon. Supply one, or approve a plain monogram.
- [ ] **OG image**: none yet; link previews show text only. Supply one, or approve a generated `app/opengraph-image.tsx` (name + title on the base colour, no new graphics).
- [ ] **Domain**: custom domain or `*.vercel.app`. Once known, set `metadataBase` in `app/layout.tsx` so OG URLs are absolute.

## 2. GitHub (needs a yes: creates `main`)

- [ ] Push `main` at the first commit (`26f3d81`, plan and references only):
      `git push origin 26f3d81:refs/heads/main`
- [ ] Push the feature branch: `git push -u origin feat/phase-4-hardening`
- [ ] Open the PR `feat/phase-4-hardening → main` (one PR for phases 1–4)

## 3. Vercel project (Vijayaganth does this in the dashboard)

- [ ] vercel.com → Add New → Project → import `vijayaganth/VJ_portfolio`
- [ ] Framework preset: Next.js. Leave build command, output and install command at their defaults.
- [ ] Production branch: `main`
- [ ] Environment variables: none needed
- [ ] Optional: install the Vercel CLI (`pnpm add -g vercel`), then `vercel link` locally

## 4. Preview gate

- [ ] PR preview URL builds green
- [ ] Lighthouse mobile against the preview URL: performance ≥ 90, accessibility ≥ 95
- [ ] Preview at 1440 and 390: pinned Work scroll, tilt, orb, section colours
- [ ] Network tab: no requests to `localhost:9222`, no devtools scripts
- [ ] Vijayaganth reviews the preview and says yes

## 5. Production (only after that yes)

- [ ] Merge the PR → Vercel deploys `main`
- [ ] Add the custom domain (if any) in Vercel → Settings → Domains, set DNS, then redeploy with `metadataBase`
- [ ] Prod check at 1440 and 390, console clean
- [ ] mailto (vijayaganth.sivalingam@gmail.com) and LinkedIn links open correctly
- [ ] Share a link in a chat app to check the preview card (needs the OG image)
