# Claude Code Prompt — FirstCall Capability Explorer (production embed)

Paste the prompt below into Claude Code, with this `design_handoff_capability_explorer/`
folder available in the working directory. Fill in the two bracketed blanks first.

---

I'm adding an interactive "Capability Explorer" section to our website, **firstcallgroup.com**.

A working high-fidelity prototype is in `design_handoff_capability_explorer/`. Read
`README.md` there first — it explains the architecture, design tokens, interactions,
accessibility, and the one piece of functional work (wiring the contact form). The prototype
is in `source/`: an entry HTML file plus `data.js`, `icons.jsx`, `scene.jsx`, and `app.jsx`
(React 18 + JSX, currently compiled in-browser by Babel from a CDN).

**Our site's stack:** [TELL CLAUDE CODE WHAT IT IS — e.g. "Next.js (React) app in this repo",
or "WordPress theme, no React", or "static HTML + vanilla JS". If you're not sure, ask Claude
Code to inspect the repo and tell you.]

**Goal:** integrate this as a real production section, not the in-browser-Babel prototype.

Please:
1. Inspect our codebase and confirm the framework, build tooling, font loading, and where
   marketing sections are defined.
2. Port the four prototype scripts into our build as proper, **pre-compiled** modules — no
   in-browser Babel, no CDN React at runtime. Convert the `window.FCG`, `window.Icons`,
   `window.CityScene` globals into normal imports/exports. Reuse `scene.jsx`'s SVG drawing code
   directly; do not redraw the isometric scene.
3. Keep the design pixel-faithful: same colors, Archivo / IBM Plex Sans / IBM Plex Mono type,
   spacing, copy, animations, and the responsive behavior (desktop side panel → mobile bottom
   sheet, horizontal swipe on small screens). Load the three fonts through our existing font
   pipeline (self-host if we already self-host).
4. Preserve all accessibility: focusable `role="button"` hotspots with aria-labels and
   Enter/Space activation, dialog roles + focus management on the panel and modal, Esc-to-close
   priority (modal → tooltip → panel), and `prefers-reduced-motion` gating.
5. Mount it into [WHERE — e.g. "a new /capability-explorer page" or "a section block on the
   Industries page"]. Match our page template/CMS conventions.
6. **Wire the "Talk to FirstCall" contact form** to our real lead handler:
   [TELL CLAUDE CODE THE ENDPOINT/SERVICE — e.g. "POST to our HubSpot form ID X", "our
   /api/contact route", or "email to dispatch@..."]. Add server-side validation and basic spam
   protection. Keep the success state and the 844.715.0220 dispatch line.
7. Keep all editable content in one place (the current `data.js` structure) so marketing can
   revise vertical names, blurbs, and capabilities without touching app logic.

Don't change the visual design or copy without asking. When done, give me a short summary of
what you changed, how to edit the content, and anything I still need to configure (form
endpoint keys, analytics, etc.).
