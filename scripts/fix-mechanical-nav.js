/**
 * Bulletproof fixes for the /mechanical/ pages:
 *
 *  1. Switch the dropdown from opacity/transform transitions to a
 *     display: none / display: block toggle. Some combination of cascade,
 *     transition timing, and computed-style interactions made opacity-based
 *     show/hide unreliable in this environment (computed opacity stayed 0
 *     even when .is-open was on the element).
 *
 *  2. Repoint nav + footer links that should hit the FCM-branded pages
 *     (/mechanical/locations, /careers, /contact) instead of the FCG ones
 *     at the repo root. The /columbus, /dfw, /central-texas branch links
 *     stay pointed at the root files (those branch sites live there).
 *
 *  Run once: node scripts/fix-mechanical-nav.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FILES = ["index.html", "locations.html", "careers.html", "contact.html"]
  .map(f => path.join(ROOT, "mechanical", f));

const NEW_DROPDOWN_BASE = `.site-nav__dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: -8px;
      min-width: 240px;
      background: rgba(15, 40, 20, 0.97);
      backdrop-filter: saturate(180%) blur(10px);
      -webkit-backdrop-filter: saturate(180%) blur(10px);
      border: 1px solid rgba(74, 125, 82, 0.35);
      border-radius: var(--radius-md);
      padding: var(--space-2);
      box-shadow: var(--shadow-lg);
      display: none;
      z-index: 1000;
    }`;

const NEW_DROPDOWN_OPEN = `.site-nav__dropdown.is-open { display: block; }`;

const NEW_DROPDOWN_MOBILE = `.site-nav__dropdown {
        position: static;
        background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none;
        border: none; border-radius: 0; box-shadow: none; padding: 0; min-width: 0;
        display: none;
      }
      .site-nav__dropdown.is-open { display: block; }`;

for (const f of FILES) {
  let html = fs.readFileSync(f, "utf8");
  const before = html.length;

  // 1a. Replace desktop dropdown base (opacity/transform/transition variant).
  html = html.replace(
    /\.site-nav__dropdown \{[\s\S]*?opacity: 0; pointer-events: none;[\s\S]*?z-index: 1;\s*\}/,
    NEW_DROPDOWN_BASE
  );

  // 1b. Replace desktop .is-open rule.
  html = html.replace(
    /\.site-nav__dropdown\.is-open \{ opacity: 1; pointer-events: auto; transform: translateY\(0\); \}/,
    NEW_DROPDOWN_OPEN
  );

  // 1c. Replace mobile dropdown (max-height variant).
  html = html.replace(
    /\.site-nav__dropdown \{\s*position: static;[\s\S]*?max-height: 0; overflow: hidden;[\s\S]*?\}\s*\.site-nav__dropdown\.is-open \{ max-height: 400px; \}/,
    NEW_DROPDOWN_MOBILE
  );

  // 2. Point nav/footer links at FCM-branded pages.
  //    The branch pages (/columbus, /dfw, /central-texas) live at root so they stay.
  //    `/` (FirstCall Group) also stays at root.
  html = html.replace(/href="\/locations"/g, 'href="/mechanical/locations"');
  html = html.replace(/href="\/careers"/g, 'href="/mechanical/careers"');
  html = html.replace(/href="\/contact"/g, 'href="/mechanical/contact"');

  fs.writeFileSync(f, html, "utf8");
  console.log(`${path.relative(ROOT, f)}: ${before} -> ${html.length} bytes`);
}
console.log("Done.");
