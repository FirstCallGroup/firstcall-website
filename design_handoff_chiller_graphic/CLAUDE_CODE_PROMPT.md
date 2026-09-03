# Claude Code prompt — "How Commercial Cooling Works" interactive chiller graphic

Paste everything below into Claude Code, running from the root of our front-end repo. Fill in every `[BLANK: …]` first. Read `README.md` (next to this file) for the full design spec — colors, type, spacing, states, interactions, and accessibility are documented there and are authoritative.

---

## ‼️ NON-NEGOTIABLE DEPLOYMENT CONSTRAINT — internal dev/preview only

This page must be treated as an **internal development / preview page on Cloudflare ONLY**. Before writing any code, internalize these rules and do not violate them:

- Deploy **only** as a Cloudflare **preview/development deployment** — a Cloudflare Pages **preview branch deployment** or a **non-indexed dev route**. `[BLANK: which — Pages preview branch, or dev route path]`
- **Do NOT** deploy to the live production site or production branch.
- **Do NOT** add it to public/primary navigation, menus, or any user-facing link.
- **Do NOT** add it to `sitemap.xml`, robots-allowed paths, or any feed.
- **DO** add `<meta name="robots" content="noindex, nofollow">` to the page `<head>`, and serve an `X-Robots-Tag: noindex, nofollow` header on the route if our Cloudflare config allows.
- **DO** keep the route internal — a non-obvious path, preview URL, and/or behind Cloudflare Access. `[BLANK: access control, if any]`
- If our deploy tooling or CI would auto-promote this to production or auto-link it anywhere, **stop and flag it instead of proceeding.**

Echo these constraints back in your plan before implementing, and add a short comment block at the top of the page module restating "internal dev/preview only — noindex, not in production nav."

---

## Fill these in

- **Our stack / framework:** `[BLANK: e.g. React 18 + Vite + TypeScript / Next.js app router / Vue 3 / Astro islands]`
- **Styling system:** `[BLANK: e.g. CSS Modules / Tailwind / styled-components / vanilla-extract / design tokens package]`
- **Where it mounts (route + component):** `[BLANK: e.g. /internal/cooling-explainer, src/routes/...]`
- **Cloudflare target:** `[BLANK: Pages project + preview branch, or Worker dev route]`
- **Telemetry/data source (if the status panel should be real):** `[BLANK: endpoint or "keep as illustrative mock"]`
- **Analytics (if any):** `[BLANK: provider + events, or "none"]`
- **Real link destinations for nav/CTA:** `[BLANK: URLs or routes]`

---

## Task

Recreate the design in `source/` as a **production-quality, pre-compiled module** in our existing front-end environment. The `source/` files are a **design reference** built with in-browser React + Babel and CDN React — a prototype, **not** shippable code. Your job is to rebuild it faithfully using our framework, build pipeline, and conventions.

### Hard requirements

1. **No in-browser Babel. No CDN React at runtime.** Port all `.jsx` into our build pipeline as a normally compiled/bundled module. The prototype shares code by assigning to `window.*` at the bottom of each file (because each `<script type="text/babel">` is isolated) — replace this entirely with proper ES module `import`/`export`.

2. **Pixel-faithful.** This is a **high-fidelity** design. Reproduce the exact colors, typography, spacing, radii, shadows, and motion timing documented in `README.md` §5. Default to the **`fieldManual` (light)** theme. Match:
   - the dark-green / cream page chrome (nav, hero, main, CTA, footer),
   - the isometric SVG scene (central plant, rooftop cooling tower, 3-floor building cutaway),
   - the continuous particle flow along every pipe/duct,
   - the controls bar (mode tabs, efficiency readout, play/pause, speed slider),
   - the BAS status panel, info card, and legend.

3. **Preserve the isometric + flow architecture.** Keep the projection math (`isoXY` etc.), the back-to-front/floor-by-floor draw order (painter's algorithm for correct occlusion), the model-space pipe routes, and the `requestAnimationFrame` particle engine that samples hidden `data-flow` paths with `getTotalLength`/`getPointAtLength`. Re-implement it cleanly in our component model but **do not change the visual result.**

4. **Preserve accessibility exactly (README §8):**
   - Every interactive component focusable (`role="button"`, in tab order) and activatable via **Enter/Space**.
   - Mode tabs as a proper `tablist`/`tab` with `aria-selected`; real `<button>`/`<input>` for play-pause, speed, status toggle, card close, each with labels.
   - `role="img"` + descriptive `aria-label` on the scene SVG; `aria-label` per component group; info card `role="dialog"`.
   - Visible `:focus-visible` indicator.
   - Full `prefers-reduced-motion` support: disable keyframe animations **and** switch the particle engine to static placement.
   - Status conveys state by dot + text + label, never color alone.
   - **Improve one thing:** the prototype repeats the `duct` and `vav` component ids per floor, creating duplicate-labeled focus stops. Consolidate to **one focusable target per logical component** while keeping the visuals.

5. **Keep editable content in ONE place.** Consolidate the component knowledge base (`FC_COMPONENTS`), service names (`FC_SERVICES`), all page copy (hero/section/CTA/footer), in-diagram labels, and mode names into a **single content/config module** (or wire to our CMS: `[BLANK: CMS?]`). Marketing must be able to edit copy without touching scene/render code.

6. **Wire up or consciously stub the demo-only functionality (README §12):**
   - **BAS status panel** + **efficiency readout** currently synthesize fake numbers (sine-noise / eased targets). Either connect to `[BLANK: telemetry source]` or keep as an **explicitly labeled illustrative mock** — your call per what I filled in above.
   - **Operating-mode toggle** (Normal/Failure/Optimized) is an intentional storytelling control, not real system state — keep it as a client-side explainer toggle; no backend needed.
   - **Nav/CTA links** → real destinations `[BLANK: URLs]`.
   - **Remove the Tweaks panel entirely** (`tweaks-panel.jsx`, the `<TweaksPanel>` block, and `useTweaks`). Replace `useTweaks(defaults)` with a static config object. Keep only `speed` and `paused` as genuine user controls.
   - Pick **one theme** (`fieldManual`) unless I asked for a switcher.
   - Add analytics events on component-open and mode-switch if `[BLANK: analytics]` is set.

7. **Fonts/assets:** self-host **IBM Plex Mono** (weights 400/500/600) instead of hot-linking Google Fonts; body uses the system Helvetica/Arial stack. There are **no image/icon files** — everything is inline SVG/CSS.

8. **Move styles into our system:** port the `:root` chrome variables and `diagram.css` keyframes/interaction rules into `[BLANK: styling system]`, preserving the exact token values from README §5.

### Deliverables

- A production module mounted at `[BLANK: route]`, pre-compiled, no runtime Babel/CDN.
- The single content/config module for all editable copy.
- A short README note in the module describing the content file, the theme choice, and the demo-vs-real decisions you made.
- Confirmation (in your summary) that the page is wired as **noindex, internal-only, not in production nav, Cloudflare preview/dev only.**

### Process

1. Restate the deployment constraints and your understanding of our stack.
2. Read `source/` and `README.md`; outline your component structure and the content module shape.
3. Implement, matching the spec.
4. Verify against the standalone reference (`source/How Cooling Works (standalone).html`): visual parity, keyboard nav, reduced-motion, and that nothing pulls CDN React/Babel at runtime.
5. Report the demo-only items you wired vs. stubbed, and the deployment wiring.

Do not push to production or add public links under any circumstance.
