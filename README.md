# bryannahabwe.github.io

Personal engineering portfolio of Nahabwe Brian — built with [Astro](https://astro.build) as a static site and served by GitHub Pages from the `gh-pages` branch.

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

- **Automatic:** pushing to `main` runs `.github/workflows/deploy.yml` — build, link check, then publish `dist/` to `gh-pages`. Requires *Settings → Actions → General → Workflow permissions → Read and write*.
- **Manual:** `npm run deploy` builds and pushes `dist/` to `gh-pages` with the `gh-pages` package.

`public/service-worker.js` intentionally unregisters the service worker left by the previous Create React App site so returning visitors don't see a cached old build. `public/.nojekyll` stops Pages from hiding the `_astro/` asset folder.
