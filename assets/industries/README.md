# Capability Explorer (Industries page)

Interactive isometric "Industries We Serve" section rendered on `/industries.html`.
Ported from the design handoff in `design_handoff_capability_explorer/` (Claude-design
prototype) — pre-compiled for production, no in-browser Babel.

## Files

| File | Role |
| --- | --- |
| `data.js` | **All editable content** — industry names, blurbs, "Challenges Faced" stats, capability descriptions, equipment labels. Plain JS, loaded directly; edit and refresh, no build step. |
| `src/icons.jsx`, `src/scene.jsx`, `src/app.jsx` | Source (React 18 + JSX). `scene.jsx` is the hand-built isometric SVG district — do not redraw. |
| `icons.js`, `scene.js`, `app.js` | Compiled output served to the browser. **Never hand-edit** — rebuild from `src/`. |
| `vendor/react*.production.min.js` | Self-hosted React 18.3.1 UMD builds. |

The page also loads `assets/js/locations-data.js` first so the header stat line
(branches / states) stays in sync with the network directory automatically.

## Rebuild after editing `src/*.jsx`

```
npx esbuild assets/industries/src/icons.jsx --outfile=assets/industries/icons.js --format=iife --charset=utf8
npx esbuild assets/industries/src/scene.jsx --outfile=assets/industries/scene.js --format=iife --charset=utf8
npx esbuild assets/industries/src/app.jsx   --outfile=assets/industries/app.js   --format=iife --charset=utf8
```

(`data.js` needs no rebuild — it is served as-is.)

## Deviations from the design handoff

- `.eyebrow` class renamed to `.ex-eyebrow` (collides with the site-chrome class).
- Mount node id `root` → `fc-explorer-root`.
- Header stat line is computed from `window.FC_LOCATIONS` instead of hardcoded "25+ / 11".
- Side panel: added a "Challenges Faced" mono heading above the stat block; the
  data-center stat label reads "of downtime before thermal risk".

## Still TODO before production

- Wire the "Talk to FirstCall" modal form to `/api/contact` in `_worker.js`
  (needs a `_form` routing entry, honeypot, and `_ts` field — currently the
  submit button only flips to the demo success state).
- Add the Industries link to the nav/footer of the other FCG pages + sitemap.
