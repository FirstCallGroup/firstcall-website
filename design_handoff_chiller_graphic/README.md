# Handoff: "How Commercial Cooling Works" — Interactive Chiller Graphic

> **FirstCall Group** marketing/education page featuring an animated, interactive isometric diagram of a commercial central cooling plant. Visitors tap components to learn what each does and which FirstCall service covers it, and toggle between Normal / Failure / Optimized operating modes.

---

## ⚠️ DEPLOYMENT RESTRICTION — READ FIRST

**This is an internal development / preview page ONLY.**

- ✅ Deploy **only** as a Cloudflare **development/preview deployment** — e.g. a Cloudflare Pages **preview branch deployment**, or a non-indexed dev route on an existing Worker/Pages project.
- ❌ **Do NOT** push it to the live production site.
- ❌ **Do NOT** add it to primary/public navigation, the marketing menu, or any user-facing link.
- ❌ **Do NOT** add it to `sitemap.xml` or any feed.
- ✅ Add `<meta name="robots" content="noindex, nofollow">` to the page head, and ideally serve `X-Robots-Tag: noindex` on the route.
- ✅ Treat the route as internal: a hard-to-guess path, behind a preview URL, or behind Cloudflare Access if available.

This restriction is intentional and non-negotiable for this handoff. It also appears in `CLAUDE_CODE_PROMPT.md` — keep it in both places.

---

## 1. Overview

The page is a single, self-contained marketing article. Its centerpiece is an **SVG isometric "cutaway" diagram** of a working commercial cooling system, rendered in three zones:

1. **Central plant** (basement) — water-cooled chiller, chilled-water & condenser-water pumps, boiler, building automation panel.
2. **Rooftop** — cooling tower on steel dunnage, with spinning fans and drifting steam.
3. **The building** — a 3-floor cutaway shell with air-handling unit, supply/return ductwork risers, and VAV boxes per floor.

Animated particles flow continuously along every pipe and duct (chilled water, condenser water, refrigerant, supply/return air, control signals). The user can:

- **Hover/focus** any component to dim everything else and spotlight it.
- **Click/activate** a component to open an info card (what it is + which FirstCall services cover it).
- **Switch operating mode** (Normal / Failure / Optimized) — this retargets flow speeds, recolors readouts, and shows mode callouts (e.g. a "CHILLER FAULT" alarm).
- **Play/pause** the animation and adjust **speed**.
- Open the **BAS system-status panel** (live-updating pseudo-telemetry rows with trend arrows).

The surrounding page chrome (nav, hero, CTA, footer) mimics the FirstCall Group website's visual system: dark-green sections bracketing a cream body.

---

## 2. About the design files (READ THIS)

The files in `source/` are a **design reference built in HTML + in-browser React/Babel**. They are a **prototype that demonstrates the intended look, motion, and behavior** — **not** production code to ship verbatim.

- The runtime uses **CDN React 18 + in-browser Babel** transpilation of `.jsx` files. **This must not ship to production.** Recreate it as a **pre-compiled module** in our codebase's build pipeline (see `CLAUDE_CODE_PROMPT.md`).
- Several features are **front-end demo only** and need real wiring or a deliberate decision to keep them as static illustration — see **§12 Functional work required**.
- A **single-file standalone build** (`source/How Cooling Works (standalone).html`) is included **purely as a visual reference** — open it in any browser to see the finished design with no server. Do not treat it as the production artifact.

**Fidelity: High-fidelity (hifi).** Colors, typography, spacing, motion timing, and interactions are final. Recreate pixel-faithfully using our codebase's patterns, but the exact hex/px/easing values below are authoritative.

---

## 3. File architecture

All paths below are inside `source/`.

| File | Type | Role |
|---|---|---|
| `How Cooling Works.html` | HTML entry | Document shell. Holds the `:root` CSS variables, **all page-chrome CSS** (nav/hero/main/controls/card/status/legend/CTA/footer + responsive rules), loads fonts + React/Babel + every script. Mounts `<App>` into `#root`. |
| `themes.js` | plain JS (no JSX) | **Data layer.** `window.FC_THEMES` (3 visual themes), `window.FC_SERVICES` (6 service names), `window.FC_COMPONENTS` (the knowledge base: per-component zone / name / blurb / covered-services). **This is where most editable content lives.** |
| `iso.jsx` | React/JSX | **Isometric engine + primitives.** Projection math (`isoXY` etc.), `shade()` color util, and reusable SVG primitives: `IsoBox`, `IsoCylV`, `IsoBarrel`, `FaceX/FaceY`, `IsoFan`, `IsoRail`, `Steam`. Exports to `window`. |
| `equipment.jsx` | React/JSX | **Equipment illustrations** built from iso primitives: `EqChiller`, `EqPump`, `EqBoiler`, `EqTower`(+`EqTowerPlatform`), `EqBuildingShell`, `EqBAS`, `EqAHU`, `EqSlab`, `EqFloorTint`, `EqVAV`. Pure visuals, no interaction. |
| `diagram.jsx` | React/JSX | **Scene assembly + behavior.** `SystemDiagram` composes the whole scene, defines pipe routes, the particle **flow engine** (`startFlowEngine`, requestAnimationFrame), sensors/signal lines, mode targets (`FC_TARGETS`), labels, and the interaction wrapper `Comp`. |
| `app.jsx` | React/JSX | **Page shell + state.** `App` renders nav/hero/main/CTA/footer, owns mode/paused/active/selected state, the controls bar, efficiency readout (`FcReadout`), BAS status panel (`FcStatusPanel`), info card (`FcInfoCard`), legend (`FcLegend`), and the Tweaks panel. Calls `ReactDOM.createRoot(...).render(<App/>)`. |
| `diagram.css` | CSS | **SVG animation keyframes** + interaction styles: `fcspin`, `fcsteam`, `fcpulse`, `fcblink`, `fcfault`; dimming on `.fc-hasactive`; `:focus-visible`; `prefers-reduced-motion` overrides. |
| `tweaks-panel.jsx` | React/JSX | **Prototype-only tooling.** The in-design "Tweaks" panel + `useTweaks` hook. **Do not port to production** — it is an authoring affordance, not a product feature. See §12. |
| `How Cooling Works (standalone).html` | HTML | Self-contained visual reference (all assets inlined). Reference only. |

**Load order in the HTML** (dependencies flow downward):
`themes.js` → `tweaks-panel.jsx` → `iso.jsx` → `equipment.jsx` → `diagram.jsx` → `app.jsx`.

**Cross-file sharing pattern (prototype-specific):** because each `<script type="text/babel">` is transpiled in isolation, each file publishes its exports onto `window` via `Object.assign(window, {...})` at the bottom. In our real build these become normal ES module `import`/`export`. The component **knowledge base is read from `window.FC_COMPONENTS` / `window.FC_SERVICES`** and themes from `window.FC_THEMES`.

---

## 4. Where the editable content lives

| Content | Location |
|---|---|
| Component names, zone labels, descriptive blurbs, which services cover each | `themes.js` → `FC_COMPONENTS` |
| Service display names | `themes.js` → `FC_SERVICES` |
| Color themes (all palettes) | `themes.js` → `FC_THEMES` |
| Page copy: nav, hero headline/subhead, section heads, CTA, footer | `app.jsx` (JSX text) |
| Mode names ("Normal operation" / "Failure scenario" / "Optimized") | `app.jsx`, controls `.map(...)` array |
| In-diagram labels ("WATER-COOLED CHILLER", "44°F SUPPLY", zone captions, etc.) | `diagram.jsx`, the `annotated` `<Label>` block + zone-label `<text>` block |
| BAS status-panel rows + values | `app.jsx` → `FcStatusPanel` `rows` array |
| Efficiency readout numbers (0.61 / 0.48 kW/ton) | `app.jsx` → `FcReadout` |
| Mode flow behavior (speeds per loop) | `diagram.jsx` → `FC_TARGETS` |

**Recommendation for production:** consolidate `FC_COMPONENTS`, `FC_SERVICES`, page copy, and labels into **one content/config object (or CMS/JSON)** so non-engineers can edit copy without touching scene code.

---

## 5. Design tokens

### 5.1 Colors

**Page-chrome variables** (defined in `How Cooling Works.html` `:root`; these style the nav/hero/body/CTA/footer, independent of the diagram theme):

| Token | Hex / value | Use |
|---|---|---|
| `--green` | `#0D2417` | Dark-green nav / hero / footer background |
| `--green2` | `#112B1C` | Hero gradient bottom, CTA background |
| `--cream` | `#F2EEE3` | Main body background |
| `--cream-line` | `#E2DCCB` | Borders on light cards/controls |
| `--white` | `#FFFFFF` | Card / control surfaces |
| `--blue` | `#1D55C4` | Primary accent (buttons, active tab, chips, links) |
| `--blue-hov` | `#1A4CB0` | Button hover |
| `--ink` | `#14271D` | Primary text on light |
| `--ink-dim` | `rgba(20,39,29,0.66)` | Secondary text on light |
| `--ink-faint` | `rgba(20,39,29,0.45)` | Tertiary text / hairline labels |
| `--lite` | `#F4F2EA` | Primary text on dark |
| `--lite-dim` | `rgba(244,242,234,0.72)` | Secondary text on dark |
| `--lite-faint` | `rgba(244,242,234,0.45)` | Tertiary text on dark |
| `--lite-hair` | `rgba(244,242,234,0.16)` | Hairline borders on dark |
| `--alert` | `#D43A3A` | Failure / fault red |
| `--ok` | `#1F8A5B` | Optimized / healthy green |
| status warn (inline) | `#D9A126` text `#B07E10` | Status-panel "warn" tone |
| note bad bg/border/text | `#FBEFED` / `#EAC8C2` / `#B03A2E` | Failure note pill |
| note ok bg/border/text | `#EEF6F0` / `#CFE5D6` / `#1F8A5B` | Optimized note pill |
| trend up / down arrow | `#C2452D` / `#1D55C4` | Status row trend arrows |

**Diagram themes** (`themes.js` → `FC_THEMES`). Three complete palettes; the page default is **`fieldManual`**. Each theme defines stage, ink levels, equipment metals, and per-loop flow colors. Default-theme highlights:

`fieldManual` (default, light):
- stage `#FBFAF4`, ink `#14281E`, hairline `rgba(20,40,30,0.14)`
- Chilled water supply `#1D55C4`, CHW return `#0F8A78`
- Condenser water supply `#D98324`, CW return `#E8A95C`
- Supply air (cool) `#5E84CE`, return air (warm) `#DC9277`
- Controls signal `#168A52`, alert `#D43A3A`, ok `#168A52`
- Refrigerant hot `#D2502F`, cool `#2D63C8`
- Equipment metals: `metalA #4A6BA5`, `metalB #3A5588`, `metalC #2B406A`, `steel #3A5588`, duct `#8C99A8`/`#AAB5C2`, pipe casing `#33424E`, accent yellow `#D9A126`
- `glowBase 0.35`, `tint 0.22`, `steamO 0.5`

`plantRoom` (dark green) and `nightWatch` (high-contrast dark) are full alternates — see `themes.js` for every value. Loop colors are brighter on the dark themes (`chw #57ADFF` etc.) and `glowBase` is higher (1.0 / 1.5).

> The Tweaks panel can also override the first four loop colors via `loopPalette` (`chw, chwReturn, cw, cwReturn`). In production this becomes a fixed theme choice unless you intentionally expose theming.

### 5.2 Typography

- **Sans (UI + body):** `'Helvetica Neue', Helvetica, Arial, sans-serif` — system stack, no web font needed.
- **Mono (eyebrows, labels, readouts, telemetry):** `'IBM Plex Mono'`, weights 400/500/600, loaded from Google Fonts (`IBM+Plex+Mono:wght@400;500;600`). Self-host in production.

Type scale (px unless noted):

| Element | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Hero `h1` | `clamp(32, 4.6vw, 50)` | 700 | `-1px` | dark bg |
| Hero `p` | `16.5` | 400 | — | line-height 1.6, max-width 640 |
| Section `h2` | `clamp(24, 3vw, 34)` | 700 | `-0.5px` | |
| Section `p` | `15` | 400 | — | |
| Eyebrow (mono) | `11` | — | `3px` | uppercase |
| Segmented btn | `13.5` | 400/600 active | — | |
| Readout (mono) | `12` | 400/600 | — | label `10` tracking `1.5px` |
| Card name | `17` | 700 | `-0.2px` | |
| Card blurb | `13` | 400 | — | line-height 1.5 |
| Card zone/covered (mono) | `9.5` | — | `2px` | uppercase |
| Chip | `11.5` | 600 | — | |
| Status head (mono) | `10` | — | `2px` | |
| Status row (mono) | `10` | — | — | |
| Status note (mono) | `9.5` | — | `0.5px` | |
| Legend item (mono) | `11` | — | `0.5px` | |
| CTA `h2` | `clamp(24, 3.2vw, 36)` | 700 | `-0.5px` | |
| Footer caps | `12` | — | — | |
| In-SVG labels (mono) | `7.5`–`11` | — | `0.5`–`2.5px` | scale with viewBox |

### 5.3 Spacing

Layout max-width **1180px** (hero/main/footer), **760px** (CTA). Section paddings: hero `72px 40px 64px`, main `64px 40px 56px`, CTA `70px 40px 76px`, nav `18px 40px`, footer `28px 40px 34px`. Mobile (`≤760px`) drops horizontal padding to `20px`. Control bar gap `14px`; legend gap `10px 22px`; card padding `18px`; status rows `5.5px 0`.

### 5.4 Border radius

`6px` buttons · `8px` segmented control / readout / play btn / mode callout pills · `10px` status panel / refrig inset · `12px` info card · `14px` stage · `999px` chips · `2px` brand glyph · `16px 16px 0 0` mobile bottom-sheet card.

### 5.5 Shadows

- Controls/readout: `0 1px 2px rgba(20,39,29,0.04)`
- Info card: `0 14px 44px rgba(0,0,0,0.3)` (mobile sheet `0 -10px 40px rgba(0,0,0,0.45)`)
- Status panel: `0 12px 32px rgba(20,39,29,0.16)`
- SVG glow: gaussian-blur filter, `stdDeviation = 1.1 + 1.9·effGlow`, opacity `0.08 + 0.13·glow` on pipes; fault halo reuses the same filter.

### 5.6 Easing & durations

| Thing | Duration | Easing |
|---|---|---|
| Segmented btn bg/color | `0.2s` | default |
| Component dim / `[data-comp]` opacity | `0.3s` | default |
| Stage bg (theme change) | `0.5s` | default |
| Info card entrance (`fccard`) | `0.22s` | ease-out (translateY 6→0, fade) |
| Floor tint fade | `1.2s` | opacity + fill |
| Fan spin (`fcspin`) | `var(--spinDur)` = `4.6 / (speed·faultFactor)`s | linear, infinite |
| Steam (`fcsteam`) | `5.2s` | ease-out infinite (rises 52px, scales 0.5→1.6) |
| Sensor pulse (`fcpulse`) | `3s` | ease-out infinite (scale 0.4→2.4, fade) |
| Blink (`fcblink`) | `1.7s` (`1s` for readout dot) | steps(2,start) infinite |
| Fault halo (`fcfault`) | `1.1s` | ease-in-out infinite (opacity 0.12↔0.55) |
| Status row trend arrow | `1.7s` | ease (rise + fade once per appearance) |
| Flow-target interpolation | ~ per-frame lerp | `cur += (target-cur)·min(1, dt·1.8)` |

---

## 6. Screens / sub-states

There is one page, one viewport. "Screens" here are **states**, all on the same canvas. (Each major region carries a `data-screen-label` for review tooling.)

1. **Nav** — dark green bar; brand wordmark (rotated-square glyph + "FirstCall*Group*") left, external site link right.
2. **Hero** — dark-green gradient; mono eyebrow, large headline "How commercial cooling works.", supporting paragraph.
3. **System Diagram (main)** — cream body containing:
   - Section head (eyebrow + h2 "One system. Three zones." + sub).
   - **Controls bar:** mode segmented control (3), efficiency readout, play/pause + speed slider.
   - **Stage:** the SVG scene + overlaid BAS status panel + (conditionally) info card.
   - **Legend:** six loop swatches with labels.
4. **CTA** — dark-green block, eyebrow + h2 + paragraph + two buttons (primary "Our Services", ghost "24/7 Emergency Response").
5. **Footer** — dark green; wordmark, capabilities caption, copyright.

### Diagram sub-states (mutually layered)

- **Default / idle:** all loops flowing at base rate, status panel open, no component highlighted.
- **Hover/focus a component:** `.fc-hasactive` dims all other components (`opacity 0.2`) and dimmable scenery (`0.22`); the focused `[data-comp]` stays full and (keyboard) gets a `drop-shadow` focus ring.
- **Component selected (info card open):** card animates in top-right (desktop) / bottom sheet (mobile) with zone, name, blurb, and service chips. Close via × or clicking empty SVG.
- **Mode = Normal:** readout ~`0.61 kW/ton`, green status dots, base flow speeds.
- **Mode = Failure:** chiller fault — flows collapse (`chw 0.05`, `refrig 0.02`…), **alarm signal particles** stream to the BAS, red fault halo pulses under the chiller, "CHILLER FAULT" callout + "FirstCall 24/7 dispatched" note, readout shows `— FAULT`, several status rows flip to bad/warn.
- **Mode = Optimized:** flows speed up (`1.12`), signal tint added to floors, "CONTROLS TUNED" callout + savings note, readout eases toward `0.48 kW/ton` with a downward trend mark.
- **Paused:** all CSS animations `animation-play-state: paused` and the rAF particle engine multiplies velocity by 0 (particles freeze in place).
- **Reduced motion:** particle engine places dots statically (no rAF loop); all keyframe animations disabled; trend arrows show static.

---

## 7. Interactions & behavior

- **Hover / focus** (`Comp` wrapper, `<g data-comp role="button" tabIndex=0>`): `onMouseEnter/onFocus` → `setActive(id)`; leave/blur → `setActive(null)`. Drives the dimming class on the SVG.
- **Click / keyboard activate:** click, or **Enter/Space** (with `preventDefault`), → `setSelected(id)` → opens info card. Clicking blank SVG (`onClick` on `<svg>`) → `onSelect(null)` clears selection.
- **Mode tabs:** `role="tablist"` / `role="tab"` / `aria-selected`; clicking sets `mode`, which swaps `FC_TARGETS`, recolors the readout/active-tab, and toggles callouts.
- **Play/pause:** toggles `paused`; button `aria-label` flips between "Play animation" / "Pause animation".
- **Speed slider:** `min 0.2 max 2 step 0.05`; bound to the `speed` value, shown as `1.0×`. Feeds both the rAF engine velocity and `--spinDur`.
- **Status panel collapse:** header button toggles body, `aria-expanded` tracked.
- **Info card close:** × button (`aria-label="Close"`); also cleared by selecting null.

### Animation systems

1. **Particle flow engine** (`startFlowEngine`, `diagram.jsx`): finds every `<path data-flow>`, samples it with `getTotalLength`/`getPointAtLength`, and advances dot/chevron/refrigerant/ping particles along each path each rAF frame. Per-loop velocity = `globalSpeed · curValue · pathSpeed`; `curValue` lerps toward the mode target. Refrigerant particles shift color hot↔cool along the path; "ping" particles (sensor signals) fade in/out across the line. Respects `prefers-reduced-motion` (static placement).
2. **CSS keyframes** (`diagram.css`): fan spin, steam, sensor pulse, blink, fault halo — all pausable via the `.fc-paused` class on the SVG.

---

## 8. Accessibility requirements

- **Keyboard:** every interactive component is a focusable `role="button"` (`tabIndex=0`) and activates on **Enter/Space**. Mode tabs use proper `tablist`/`tab`/`aria-selected`. Play/pause, speed, status toggle, and card close are real buttons/inputs with labels. **Preserve this** — do not replace with non-focusable SVG click handlers.
- **Focus order:** nav link → mode tabs → play/pause → speed → (within SVG, document order) components: `basPanel`, `chwPumps`, `cwPumps`, `boiler`, `chiller`, `ahu`, `duct`(×4 floors share id), `vav`(×3), `tower`, `refrig`, `sensors` → status toggle → card close (when open) → CTA buttons → footer. **Note:** `duct` and `vav` ids repeat per floor, creating several focus stops with the same label — consider consolidating to one focusable target per logical component in production.
- **Focus visible:** `[data-comp]:focus-visible` draws a white `drop-shadow` ring. Keep a clearly visible focus indicator that meets contrast.
- **ARIA roles/labels:** SVG has `role="img"` + descriptive `aria-label`; each component `<g>` has an `aria-label` (e.g. "Water-cooled chiller"); info card is `role="dialog"` with `aria-label`; legend has `aria-label="Legend"`. Decorative particles/labels use `aria-hidden`/`pointerEvents=none`.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables all keyframe animation and switches the particle engine to static placement. **Must be preserved.**
- **Color independence:** status uses dot + text tone + label, not color alone. Maintain text labels alongside color in production.
- **Contrast:** verify mono labels at small sizes (7.5–10px in-SVG) meet contrast on the chosen theme; the light `fieldManual` theme is the production default.

---

## 9. React / state structure

Single React 18 root (`ReactDOM.createRoot(#root).render(<App/>)`).

**`App` owns state:**
- `mode` — `'normal' | 'failure' | 'optimized'` (default `'normal'`).
- `paused` — boolean.
- `active` — hovered/focused component id (or null).
- `selected` — clicked component id (or null).
- `t` (Tweaks) — `{ stageTheme, labels, speed, density, glow, loopPalette }`. **In production these collapse to fixed config**, except possibly `speed`/`paused` which are genuine user controls. `cardId = selected || active`.

**Component tree:**
```
App
├─ FcWordmark (nav)
├─ Hero (static)
├─ main
│  ├─ controls: mode tabs, FcReadout(mode), play/pause, speed slider
│  ├─ stage
│  │  ├─ SystemDiagram(theme, mode, speed, paused, density, glow, labels, active, selected, onHover, onSelect)
│  │  │  ├─ Eq* equipment (from equipment.jsx) wrapped in Comp(id) interaction groups
│  │  │  ├─ Pipe routes (+ hidden data-flow paths)
│  │  │  ├─ RefrigDetail inset
│  │  │  ├─ sensors + signal ping paths
│  │  │  ├─ particle layer (filled by startFlowEngine via useEffect/rAF)
│  │  │  └─ labels / zone captions / mode callouts
│  │  ├─ FcStatusPanel(mode, paused, speed)  // setInterval-driven pseudo telemetry
│  │  └─ FcInfoCard(id)                       // reads window.FC_COMPONENTS
│  └─ FcLegend(theme)
├─ CTA (static)
├─ Footer
└─ TweaksPanel (PROTOTYPE ONLY — remove in production)
```

**Data fetching:** none. All "telemetry" is synthesized client-side (`FcReadout` interval easing toward a target; `FcStatusPanel` `os()` sine-noise around base values). See §12.

**Side effects:** `SystemDiagram` runs `startFlowEngine` in a `useEffect` keyed on `[density, theme id, loop colors]`, returning a cleanup that cancels rAF and clears the particle layer. `FcReadout`/`FcStatusPanel` use `setInterval` cleaned up on unmount/mode change.

---

## 10. The isometric system (so a new dev can rebuild the scene)

- Projection: `isoXY(x,y,z) = [(x−y)·cos30°, (x+y)·0.5 − z]`. Model space is a right-handed grid; `+x` and `+y` are floor axes, `+z` is up. Light is assumed upper-left (the `+y` face is the lit "front").
- Primitives in `iso.jsx` build everything from polygons/cylinders/barrels in model coords, so **draw order = depth order** (painter's algorithm). The scene is assembled **back-to-front, floor-by-floor** in `SystemDiagram` to get correct occlusion — preserve that ordering if you refactor.
- Pipe routes are arrays of `[x,y,z]` model points (`chwS`, `chwR`, `cwS`, `cwR`, `airSup`, `airRet`) converted to SVG paths via `isoPath`. Each visible `Pipe` also emits a hidden `data-flow` twin path that the particle engine animates.
- `shade(hex, amt)` lightens/darkens a hex toward white/black for face shading — used pervasively instead of separate color tokens per face.

---

## 11. Assets

- **No external image/icon files.** Everything is inline SVG (the diagram) or CSS (page chrome). The brand "logo" is a CSS rotated square + text wordmark.
- **Fonts:** IBM Plex Mono (Google Fonts) + system Helvetica/Arial stack. **Self-host IBM Plex Mono** in production rather than hot-linking Google Fonts.
- **Standalone build** inlines fonts + scripts for offline reference only.
- **External links** point to `https://firstcallgroup.com` (nav, CTA buttons) — confirm real destinations.

---

## 12. Functional work required (demo-only → needs real wiring or a decision)

These are currently **front-end illusions**. For each, either wire to real data or consciously keep as static illustration:

1. **BAS system-status telemetry** (`FcStatusPanel`): values are generated by a sine-noise function (`os()`) around hardcoded base numbers, with fake trend arrows. **If this should reflect real building data,** wire it to your BAS/IoT/telemetry endpoint: `[BLANK: telemetry source / endpoint]`. Otherwise label it clearly as an illustrative mock.
2. **Plant efficiency readout** (`FcReadout`): the `kW/ton` number eases toward hardcoded targets (0.61 / 0.48). Same decision — real metric vs. illustration.
3. **Operating-mode toggle** (Normal/Failure/Optimized): purely a **demo storytelling control**. It is not a real system state. Decide whether it stays a user-facing explainer toggle (likely yes) — it does **not** need a backend.
4. **CTA buttons & nav link:** placeholder `https://firstcallgroup.com` hrefs — point to real routes / tracking.
5. **Component knowledge base** (`FC_COMPONENTS`): copy is final but should move into your content layer/CMS so marketing can edit without a deploy.
6. **Tweaks panel** (`tweaks-panel.jsx` + the `<TweaksPanel>` block in `app.jsx` and the `useTweaks` wiring): **authoring tool, remove entirely from production.** Replace `useTweaks(defaults)` with a static config object. Keep only `speed`/`paused` as genuine user controls if desired.
7. **Theme system:** three themes exist; production should pick **one** (default `fieldManual`) unless a theme switcher is a real requirement.
8. **Analytics:** none present — add event tracking on component opens / mode switches if needed: `[BLANK: analytics]`.

---

## 13. Build / integration notes

- **Remove in-browser Babel + CDN React.** Port `.jsx` to our build pipeline as a pre-compiled module; convert the `window.*` export pattern to real module `import`/`export`.
- Move `:root` chrome variables and `diagram.css` into our styling system (CSS modules / tokens), keeping the exact values in §5.
- Mount target: `[BLANK: route + mount point in our app]`.
- Keep the whole thing **non-indexed and out of production nav** (see top banner).

---

## 14. Files in this handoff

```
design_handoff_chiller_graphic/
├─ README.md                          (this file)
├─ CLAUDE_CODE_PROMPT.md              (ready-to-paste prompt for Claude Code)
└─ source/
   ├─ How Cooling Works.html          (HTML entry point)
   ├─ themes.js                       (themes + content knowledge base)
   ├─ iso.jsx                         (isometric engine + primitives)
   ├─ equipment.jsx                   (equipment illustrations)
   ├─ diagram.jsx                     (scene assembly + flow engine + interaction)
   ├─ app.jsx                         (page shell + state + controls)
   ├─ diagram.css                     (SVG animation + interaction styles)
   ├─ tweaks-panel.jsx                (PROTOTYPE-ONLY authoring tool — do not ship)
   └─ How Cooling Works (standalone).html   (self-contained visual reference)
```
