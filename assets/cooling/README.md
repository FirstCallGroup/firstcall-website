# How Commercial Cooling Works (interactive chiller graphic)

Animated, interactive isometric diagram of a commercial central cooling plant,
rendered on `/how-cooling-works.html`. Ported from the design handoff in
`design_handoff_chiller_graphic/` (Claude-design prototype) — pre-compiled for
production, no in-browser Babel, no CDN React.

> **⚠️ INTERNAL DEV/PREVIEW ONLY.** This page is `noindex, nofollow`, is NOT
> in `sitemap.xml`, and is NOT linked from any production nav. Deploy only via
> the Cloudflare Pages **dev** (preview) branch — never promote to `main`
> without removing the noindex meta and deliberately deciding on nav/sitemap.

## Files

| File | Role |
| --- | --- |
| `data.js` | **All editable content** — page copy (hero/section/CTA), component knowledge base, service names, mode names, legend labels, BAS status rows, readout targets, plus the single diagram theme (`fieldManual`). Plain JS, loaded directly; edit and refresh, no build step. |
| `src/iso.jsx` | Isometric engine + SVG primitives (projection math, boxes/cylinders/barrels/fans). Verbatim from the handoff. |
| `src/equipment.jsx` | Equipment illustrations (chiller, pumps, boiler, tower, AHU, VAV…). Verbatim from the handoff. |
| `src/diagram.jsx` | Scene assembly, pipe routes, rAF particle flow engine, sensors, mode targets, interaction wrapper. |
| `src/app.jsx` | App shell + state: controls bar, efficiency readout, BAS status panel, info card, legend, hero/CTA copy rendering. |
| `iso.js`, `equipment.js`, `diagram.js`, `app.js` | Compiled output served to the browser. **Never hand-edit** — rebuild from `src/`. |
| `vendor/react*.production.min.js` | Self-hosted React 18.3.1 UMD builds (same files as `assets/industries/vendor/`). |

## Rebuild after editing `src/*.jsx`

```
npx esbuild assets/cooling/src/iso.jsx       --outfile=assets/cooling/iso.js       --format=iife --charset=utf8
npx esbuild assets/cooling/src/equipment.jsx --outfile=assets/cooling/equipment.js --format=iife --charset=utf8
npx esbuild assets/cooling/src/diagram.jsx   --outfile=assets/cooling/diagram.js   --format=iife --charset=utf8
npx esbuild assets/cooling/src/app.jsx       --outfile=assets/cooling/app.js       --format=iife --charset=utf8
```

(`data.js` needs no rebuild — it is served as-is.)

## Deviations from the design handoff

- Prototype's own nav/footer replaced by the standard FCG site header/footer;
  page chrome colors remapped to site tokens (dark green → `--color-bg-dark`/
  `--color-primary`, cream → `--color-bg-soft`, accent `#1D55C4` →
  `--color-accent #00558C`); headings use Manrope, body IBM Plex Sans
  (handoff used Helvetica). The diagram's loop colors are unchanged
  (functional color-coding from the spec).
- Mount node id `root` → `fc-cooling-root`.
- **Tweaks panel removed** (handoff §12): theme fixed to `fieldManual`,
  labels `annotated`, density/glow = 1. Speed + play/pause remain the only
  user controls.
- A11y: repeated per-floor `duct`/`vav` groups are no longer focusable —
  one tab stop per logical component (handoff §8 suggestion). Hover/click
  still work on every segment.
- `[data-comp]:focus-visible` ring is site-accent blue (the handoff's white
  drop-shadow is invisible on the light stage).
- IBM Plex Mono is hot-linked from Google Fonts (site-wide convention)
  rather than self-hosted.

## Demo-vs-real decisions (handoff §12)

- **BAS status panel + efficiency readout: kept as illustrative mocks**,
  synthesized client-side; labeled on-page via the fine print under the
  legend ("Readouts and telemetry are illustrative — not live building
  data."). No telemetry endpoint exists yet.
- **Operating-mode toggle** stays a client-side storytelling control.
- **CTA links** point at real routes: `index.html#capabilities-heading`
  and `contact.html`.
- **Analytics:** none added.

## Still TODO before production (if ever promoted)

- Remove `<meta name="robots" content="noindex, nofollow">`, add a canonical
  URL, and decide on sitemap + nav placement.
- Decide whether to wire the BAS panel/readout to real telemetry.
