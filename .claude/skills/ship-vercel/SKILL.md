---
name: ship-vercel
description: Release checklist for deploying Vijayaganth's portfolio to Vercel — branch/PR flow, preview review, production promotion and post-deploy checks. Use when preparing a preview or production deploy.
---

# Ship to Vercel

Never deploy to production or push to `main` without Vijayaganth's explicit yes in chat.

1. Gates green: `pnpm lint`, `pnpm build`, `visual-qa`, `perf-a11y-audit`.
2. Branch `feat/<phase>-<topic>`, commit, push, open PR. Vercel creates a preview URL.
3. Run `perf-a11y-audit` Lighthouse against the preview URL (mobile). Share the URL + scores with the user.
4. On approval: merge PR → Vercel deploys `main` to production.
5. Post-deploy: open prod in the browser pane at 1440 and 390, test mailto and LinkedIn links, check console clean, confirm no devtools bridge in network requests.
6. Metadata present: `<title>`, description, Open Graph image (ask before creating one — no invented graphics), favicon.
