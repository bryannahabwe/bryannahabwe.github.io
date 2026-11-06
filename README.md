# Nahabwe Brian — portfolio

Personal engineering portfolio of Nahabwe Brian — built with [Astro](https://astro.build) as a static site and live at **https://bryan.umbatech.com** (canonical, cognix server) and **https://bryannahabwe.github.io** (GitHub Pages).

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # type-check + build to dist/
npm run check:links  # verify every internal link and #anchor in dist/
npm run preview      # serve the production build
```

## Editing content

All copy lives in typed data files — components never hard-code facts.

| File | Holds |
| --- | --- |
| `src/data/profile.ts` | Name, role, contact, socials, nav, education, certificates |
| `src/data/experience.ts` | Roles and highlights |
| `src/data/expertise.ts` | Skill groups, engineering principles, writing list |
| `src/data/projects.ts` | Case studies (`projects`), display order, products |

Content rules: every claim must be traceable to the CV, code or commits; no internal codenames, partner names, hostnames, credentials or production data. To publish a writing draft, set `status: "published"` and add `href`.

## Design system

Tokens (colour, type scale, spacing, motion) are defined once in `src/styles/tokens.css`: a white/blue light theme, a dark theme, and always-dark "night" surfaces for the header, hero and footer. Fonts are self-hosted via Fontsource: Manrope (headings), DM Sans (body and UI), JetBrains Mono (code and labels), Caveat (the two handwritten accents). Line icons are inline SVG in `src/components/Icon.astro`; technology logos come from `simple-icons`. Project card headers are drawn SVG (`ProjectArt.astro`), not stock photos.

## Deploy

`main` is pushed to two remotes: GitHub (`bryannahabwe/bryannahabwe.github.io`) and GitLab (`cognix2/myportfolio`).

- **bryan.umbatech.com:** pushing to GitLab `main` runs `.gitlab-ci.yml` — build, link check, then rebuild the `bryan-portfolio` container on the server. Setup: `deploy/README.md`.
- **github.io, automatic:** pushing to GitHub `main` runs `.github/workflows/deploy.yml` — build, link check, then publish `dist/` to `gh-pages`. Requires *Settings → Actions → General → Workflow permissions → Read and write*.
- **github.io, manual:** `npm run deploy` builds and pushes `dist/` to `gh-pages` with the `gh-pages` package.

`public/service-worker.js` intentionally unregisters the service worker left by the previous Create React App site so returning visitors don't see a cached old build. `public/.nojekyll` stops Pages from hiding the `_astro/` asset folder.
