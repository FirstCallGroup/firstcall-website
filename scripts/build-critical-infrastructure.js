/**
 * Builds the "Critical Infrastructure" section for the FirstCall MECHANICAL
 * site (firstcallmechanical.com).
 *
 *  1. Generates the hub + 4 landing pages at /critical-infrastructure/, reusing
 *     the FCM chrome (dark header/footer, logo, tokens) and the FCM native nav
 *     dropdown component (.site-nav__dropdown + initDropdowns) from
 *     mechanical/careers.html.
 *  2. Injects a "Critical Infrastructure" dropdown into the FCM root pages
 *     (mechanical/index.html, locations.html, careers.html, contact.html).
 *  3. Comments out the earlier FirstCall GROUP injection (nav dropdown + footer
 *     link + CSS) on the FCG root pages, leaving it preserved for re-enabling.
 *
 * Routing: the pages live at repo root /critical-infrastructure/. On the FCM
 * domain (and the pages.dev preview / local dev server) they are served
 * directly. _worker.js redirects firstcallgroup.com/critical-infrastructure/*
 * to the FCM domain, the same way the branch pages are handled.
 *
 * Run:  node scripts/build-critical-infrastructure.js
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CI_DIR = path.join(ROOT, "critical-infrastructure");

// FCM pages that carry the primary nav (relative to ROOT).
const FCM_PAGES = ["mechanical/index.html", "mechanical/locations.html", "mechanical/careers.html", "mechanical/contact.html"];
// FCG pages that still carry the earlier (now-disabled) injection.
const FCG_PAGES = ["index.html", "acquisitions.html", "locations.html", "team.html", "news.html", "careers.html", "contact.html"];

// ---------------------------------------------------------------------------
// Chrome donor — FCM careers page (condensed chrome + native Branches dropdown)
// ---------------------------------------------------------------------------
const donor = fs.readFileSync(path.join(ROOT, "mechanical/careers.html"), "utf8");
const LOGO = donor.match(/<svg[^>]*viewBox="0 0 1502\.68 337\.31"[\s\S]*?<\/svg>/)[0];
// Chrome CSS: tokens/base/buttons/header/nav/footer (everything before the
// careers-specific PAGE HERO block).
const CHROME_CSS = donor.slice(donor.indexOf("<style>") + "<style>".length, donor.indexOf("/* ===== PAGE HERO")).replace(/\s+$/, "");
// FCM nav-dropdown component CSS (added after the careers CSS by build-mechanical-sisters.js).
const DROPDOWN_CSS = donor.slice(donor.indexOf("/* ===== Nav dropdown (Branches)"), donor.indexOf("</style>")).replace(/\s+$/, "");

const CARET = '<svg class="site-nav__caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4 L6 8 L10 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trending: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="7" rx="2" stroke="currentColor" stroke-width="2"/><rect x="3" y="13" width="18" height="7" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 7.5h.01M7 16.5h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12h4l2-5 4 10 2-5h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  turbine: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 9V2M12 22v-7M9 12H2M22 12h-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14.5 9.5L18 6M6 18l3.5-3.5M9.5 9.5L6 6M18 18l-3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 6a3.5 3.5 0 014.9 4.2L21 12l-2 2-6.5 6.5a2.1 2.1 0 01-3-3L16 11 14.5 6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  thermo: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 13V5a2 2 0 114 0v8a4 4 0 11-4 0z" stroke="currentColor" stroke-width="2"/></svg>',
  wind: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 8h10a3 3 0 10-3-3M3 12h15a3 3 0 11-3 3M3 16h8a2.5 2.5 0 11-2.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3s6 6.5 6 10.5a6 6 0 11-12 0C6 9.5 12 3 12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 14a8 8 0 1116 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 14l4-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h7l4 4v14H7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 3v4h4M9 13h6M9 17h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  factory: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21V10l6 4V10l6 4V7l3-3v17z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3 21h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  cog: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

// ---------------------------------------------------------------------------
// Sub-pages registry
// ---------------------------------------------------------------------------
const SUBS = [
  { key: "performance-contracting", slug: "performance-contracting", out: "performance-contracting.html", nav: "Performance Contracting", blurb: "Upgrades that fund themselves", icon: I.trending },
  { key: "data-centers", slug: "data-centers", out: "data-centers.html", nav: "Data Centers", blurb: "Uptime-critical cooling & controls", icon: I.server },
  { key: "life-sciences-healthcare", slug: "life-sciences-healthcare", out: "life-sciences-healthcare.html", nav: "Life Sciences & Healthcare", blurb: "Critical, compliant environments", icon: I.pulse },
  { key: "turbines-rotating-equipment", slug: "turbines-rotating-equipment", out: "turbines-rotating-equipment.html", nav: "Turbines & Rotating Equipment", blurb: "Overhaul & field service", icon: I.turbine },
];

// ---------------------------------------------------------------------------
// Nav dropdowns (FCM native component)
// ---------------------------------------------------------------------------
const BRANCHES_DROPDOWN = `<div class="site-nav__dropdown-wrap" data-dropdown>
          <button type="button" class="site-nav__link site-nav__dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-dropdown-toggle>FirstCall Branches ${CARET}</button>
          <div class="site-nav__dropdown" data-dropdown-menu>
            <a class="site-nav__dropdown-link" href="/columbus">Columbus, OH</a>
            <a class="site-nav__dropdown-link" href="/dfw">Dallas-Fort Worth, TX</a>
            <a class="site-nav__dropdown-link" href="/central-texas">Austin, TX</a>
          </div>
        </div>`;

function ciDropdown(activeSlug) {
  const cur = function (s) { return activeSlug === s ? ' aria-current="page"' : ""; };
  const links = SUBS.map(function (s) {
    return '            <a class="site-nav__dropdown-link" href="/critical-infrastructure/' + s.slug + '"' + cur(s.slug) + ">" + s.nav + "</a>";
  }).join("\n");
  return `<div class="site-nav__dropdown-wrap" data-dropdown data-ci-dropdown>
          <button type="button" class="site-nav__link site-nav__dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-dropdown-toggle>Critical Infrastructure ${CARET}</button>
          <div class="site-nav__dropdown" data-dropdown-menu>
            <a class="site-nav__dropdown-link" href="/critical-infrastructure/"${activeSlug === "hub" ? ' aria-current="page"' : ""}>Overview</a>
${links}
          </div>
        </div>`;
}

// ===========================================================================
// PART 1 — inject CI dropdown into FCM root pages
// ===========================================================================
function injectFcm() {
  FCM_PAGES.forEach(function (name) {
    const file = path.join(ROOT, name);
    let html = fs.readFileSync(file, "utf8");
    if (html.indexOf("data-ci-dropdown") !== -1) { console.log("  skip (already has CI dropdown): " + name); return; }
    // Insert the CI dropdown right before the "All Network Branches" link.
    const re = /(\n\s*)(<a class="site-nav__link" href="\/locations">All Network Branches<\/a>)/;
    if (re.test(html)) {
      html = html.replace(re, "$1" + ciDropdown(null) + "$1$2");
      fs.writeFileSync(file, html);
      console.log("  injected CI dropdown: " + name);
    } else {
      console.warn("  !! anchor not found in " + name);
    }
  });
}

// ===========================================================================
// PART 2 — keep Critical Infrastructure OFF the FCG nav, with a placeholder
// comment so it's documented and easy to revisit. (The section moved to FCM.)
// Run `git checkout HEAD -- <fcg pages>` first if a prior live injection needs
// clearing; this function only inserts the marker comment into clean pages.
// ===========================================================================
const FCG_DISABLED_COMMENT =
  "<!-- Critical Infrastructure now lives on FirstCall Mechanical (firstcallmechanical.com/critical-infrastructure/). Intentionally kept off the FCG nav for now. -->";

function disableFcg() {
  FCG_PAGES.forEach(function (name) {
    const file = path.join(ROOT, name);
    let html = fs.readFileSync(file, "utf8");
    if (html.indexOf("Critical Infrastructure now lives on FirstCall Mechanical") !== -1) {
      console.log("  FCG marker already present: " + name);
      return;
    }
    if (html.indexOf("data-nav-dropdown") !== -1) {
      console.warn("  !! " + name + " still has a live FCG dropdown — run `git checkout HEAD -- " + name + "` then re-run.");
      return;
    }
    const re = /(<a class="site-nav__link" href="acquisitions\.html"[^>]*>Acquisitions<\/a>)/;
    if (re.test(html)) {
      html = html.replace(re, "$1\n        " + FCG_DISABLED_COMMENT);
      fs.writeFileSync(file, html);
      console.log("  FCG marker added: " + name);
    } else {
      console.warn("  !! Acquisitions nav anchor not found in " + name);
    }
  });
}

// ===========================================================================
// PART 3 — generate /critical-infrastructure/ pages (FCM chrome)
// ===========================================================================
const LANDING_CSS = `
    /* ===== Critical Infrastructure landing ===== */
    .site-nav__dropdown-link[aria-current="page"] { color: var(--color-accent-light); }
    .has-hex { position: relative; overflow: hidden; }
    .has-hex::before { content: ""; position: absolute; inset: 0; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 96'><polygon points='28,4 52,18 52,46 28,60 4,46 4,18' fill='none' stroke='%235BA3D6' stroke-width='1' opacity='0.10'/><polygon points='0,52 24,66 24,94 0,108 -24,94 -24,66' fill='none' stroke='%235BA3D6' stroke-width='1' opacity='0.10'/><polygon points='56,52 80,66 80,94 56,108 32,94 32,66' fill='none' stroke='%235BA3D6' stroke-width='1' opacity='0.10'/></svg>"); background-size: 56px 96px; pointer-events: none; }
    .has-hex > * { position: relative; }
    .ci-hero { background: var(--color-primary-dark); color: var(--color-text-on-dark); padding-block: var(--space-9); }
    .ci-hero__inner { max-width: 840px; }
    .ci-hero .eyebrow { color: var(--color-accent-light); }
    .ci-hero h1 { color: #fff; margin-bottom: var(--space-5); }
    .ci-hero p { color: rgba(242,239,227,0.85); font-size: var(--text-xl); line-height: var(--leading-relaxed); max-width: 64ch; margin-bottom: var(--space-6); }
    .ci-hero__cta { display: flex; flex-wrap: wrap; gap: var(--space-4); }
    .ci-crumb { font-size: var(--text-sm); color: rgba(242,239,227,0.6); margin-bottom: var(--space-5); display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .ci-crumb a { color: rgba(242,239,227,0.78); }
    .ci-crumb a:hover { color: var(--color-accent-light); }
    .section-head { max-width: 760px; margin-bottom: var(--space-7); }
    .section-head--center { margin-inline: auto; text-align: center; }
    .section-head h2 { margin-bottom: var(--space-3); }
    .section-head .lead { margin-bottom: 0; }
    .prose p { color: var(--color-text-muted); font-size: var(--text-lg); line-height: var(--leading-relaxed); margin-bottom: var(--space-4); max-width: 68ch; }
    .prose p:last-child { margin-bottom: 0; }
    .pillars { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
    @media (max-width: 767px) { .pillars { grid-template-columns: 1fr; } }
    .pillar { display: flex; flex-direction: column; gap: var(--space-4); padding: var(--space-6); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); transition: transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out); text-decoration: none; color: var(--color-text); }
    .pillar:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--color-accent-light); }
    .pillar__icon { width: 52px; height: 52px; border-radius: var(--radius-md); background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; }
    .pillar__icon svg { width: 26px; height: 26px; }
    .pillar h3 { font-size: var(--text-2xl); }
    .pillar p { color: var(--color-text-muted); font-size: var(--text-base); line-height: var(--leading-relaxed); }
    .pillar__more { margin-top: auto; font-weight: var(--weight-semibold); color: var(--color-accent); display: inline-flex; align-items: center; gap: 6px; transition: gap var(--duration-base) var(--ease-out); }
    .pillar__more svg { width: 18px; height: 18px; }
    .pillar:hover .pillar__more { gap: 10px; }
    .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
    @media (max-width: 1023px) { .feature-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 639px) { .feature-grid { grid-template-columns: 1fr; } }
    .feature { padding: var(--space-6); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
    .feature__icon { width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-bg-section); color: var(--color-primary); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4); }
    .feature__icon svg { width: 24px; height: 24px; }
    .feature h3 { font-size: var(--text-xl); margin-bottom: var(--space-2); }
    .feature p { color: var(--color-text-muted); font-size: var(--text-base); line-height: var(--leading-relaxed); }
    .split { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: var(--space-8); align-items: start; }
    @media (max-width: 899px) { .split { grid-template-columns: 1fr; gap: var(--space-6); } }
    .checks { list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--space-4); }
    .checks li { display: flex; gap: var(--space-3); align-items: flex-start; }
    .checks svg { width: 22px; height: 22px; flex: none; color: var(--color-accent); margin-top: 3px; }
    .checks strong { display: block; font-family: var(--font-display); font-size: var(--text-lg); letter-spacing: var(--tracking-tight); }
    .checks span { color: var(--color-text-muted); }
    .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); counter-reset: step; }
    @media (max-width: 899px) { .steps { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 479px) { .steps { grid-template-columns: 1fr; } }
    .step { position: relative; }
    .step::before { counter-increment: step; content: counter(step, decimal-leading-zero); font-family: var(--font-display); font-weight: var(--weight-extrabold); font-size: var(--text-3xl); color: var(--color-accent-light); display: block; margin-bottom: var(--space-2); }
    .step h3 { font-size: var(--text-lg); margin-bottom: var(--space-2); }
    .step p { color: var(--color-text-muted); font-size: var(--text-base); line-height: var(--leading-relaxed); }
    .stat-band { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); text-align: center; }
    @media (max-width: 639px) { .stat-band { grid-template-columns: 1fr; gap: var(--space-5); } }
    .stat-band__num { font-family: var(--font-display); font-weight: var(--weight-extrabold); font-size: var(--text-5xl); color: #fff; line-height: 1; }
    .stat-band__label { color: rgba(242,239,227,0.8); margin-top: var(--space-2); }
    .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
    @media (max-width: 899px) { .related-grid { grid-template-columns: 1fr; } }
    .related-card { display: block; padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg-card); text-decoration: none; color: var(--color-text); transition: border-color var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out); }
    .related-card:hover { border-color: var(--color-accent-light); transform: translateY(-3px); }
    .related-card .eyebrow { margin-bottom: var(--space-2); }
    .related-card h3 { font-size: var(--text-xl); }
    .related-card p { color: var(--color-text-muted); font-size: var(--text-sm); margin-top: var(--space-2); line-height: var(--leading-relaxed); }
    .cta-band { background: var(--color-bg-dark); color: var(--color-text-on-dark); padding-block: var(--space-9); text-align: center; }
    .cta-band__inner { max-width: 720px; margin-inline: auto; }
    .cta-band h2 { color: #fff; margin-bottom: var(--space-4); }
    .cta-band p { color: rgba(255,255,255,0.85); margin-bottom: var(--space-6); font-size: var(--text-lg); }
    .cta-band__cta { display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; }
    .section--dark { background: var(--color-bg-dark); color: var(--color-text-on-dark); }
    .section--dark .eyebrow { color: var(--color-accent-light); }
    .section--dark h2, .section--dark h3 { color: #fff; }
    .section--dark .prose p, .section--dark p { color: rgba(242,239,227,0.82); }
    .site-footer__grid { grid-template-columns: 1.7fr 1fr 1fr 1fr 1fr; }
    @media (max-width: 1023px) { .site-footer__grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 639px) { .site-footer__grid { grid-template-columns: 1fr; } }`;

function breadcrumbSchema(meta) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://firstcallmechanical.com/" },
    { "@type": "ListItem", position: 2, name: "Critical Infrastructure", item: "https://firstcallmechanical.com/critical-infrastructure/" },
  ];
  if (meta.slug) items.push({ "@type": "ListItem", position: 3, name: meta.crumb, item: "https://firstcallmechanical.com/critical-infrastructure/" + meta.slug });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function head(meta) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Lead Forensics -->
  <script type="text/javascript" src="https://secure.intelligent-consortium.com/js/791699.js"></script>
  <noscript><img alt="" src="https://secure.intelligent-consortium.com/791699.png" style="display:none;" /></noscript>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <link rel="icon" type="image/svg+xml" href="/shared/img/logos/firstcall-favicon.svg" />
  <link rel="apple-touch-icon" href="/shared/img/logos/firstcall-favicon.svg" />
  <link rel="canonical" href="https://firstcallmechanical.com/critical-infrastructure/${meta.slug}" />
  <meta name="description" content="${meta.desc}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.desc}" />
  <meta property="og:url" content="https://firstcallmechanical.com/critical-infrastructure/${meta.slug}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

  <style>
${CHROME_CSS}
${DROPDOWN_CSS}
${LANDING_CSS}
  </style>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema(meta), null, 2)}
  </script>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>
`;
}

function header(active) {
  const activeSlug = active || null;
  return `  <header class="site-header" role="banner">
    <div class="site-header__inner">
      <a class="site-header__logo" href="/" aria-label="FirstCall Mechanical — home">
        ${LOGO}
      </a>
      <nav class="site-nav" data-site-nav aria-label="Primary">
        ${BRANCHES_DROPDOWN}
        ${ciDropdown(activeSlug)}
        <a class="site-nav__link" href="/locations">All Network Branches</a>
        <a class="site-nav__link" href="/insights">Insights</a>
        <a class="site-nav__link" href="/careers">Careers</a>
        <a class="site-nav__link" href="/contact">Contact</a>
        <a class="site-nav__link" href="https://firstcallgroup.com/" rel="noopener">FirstCall Group</a>
      </nav>
      <div class="site-header__cta">
        <a class="btn btn--primary btn--sm hide-mobile" href="/contact">Get in Touch</a>
        <button class="menu-toggle" data-menu-toggle aria-label="Open menu" aria-expanded="false"><span class="menu-toggle__bars" aria-hidden="true"></span></button>
      </div>
    </div>
  </header>
`;
}

const FOOTER = `  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          ${LOGO}
          <p>FirstCall Mechanical — commercial HVAC, building controls, and critical-facility service in Columbus, DFW, and Austin. Backed by the FirstCall Group national platform.</p>
        </div>
        <div><div class="site-footer__heading">Critical Infrastructure</div><ul class="site-footer__list"><li><a href="/critical-infrastructure/performance-contracting">Performance Contracting</a></li><li><a href="/critical-infrastructure/data-centers">Data Centers</a></li><li><a href="/critical-infrastructure/life-sciences-healthcare">Life Sciences &amp; Healthcare</a></li><li><a href="/critical-infrastructure/turbines-rotating-equipment">Turbines &amp; Rotating Equipment</a></li></ul></div>
        <div><div class="site-footer__heading">Branches</div><ul class="site-footer__list"><li><a href="/columbus">Columbus, OH</a></li><li><a href="/dfw">Dallas-Fort Worth, TX</a></li><li><a href="/central-texas">Austin, TX</a></li></ul></div>
        <div><div class="site-footer__heading">FirstCall Network</div><ul class="site-footer__list"><li><a href="/insights">Insights</a></li><li><a href="/locations">All Network Branches</a></li><li><a href="https://firstcallgroup.com/" rel="noopener">FirstCall Group</a></li></ul></div>
        <div><div class="site-footer__heading">Connect</div><ul class="site-footer__list"><li><a href="https://www.linkedin.com/company/firstcall-mechanical/" rel="noopener">LinkedIn</a></li><li><a href="/careers">Careers</a></li><li><a href="/contact">Contact</a></li></ul></div>
      </div>
      <div class="site-footer__bottom">
        <span>&copy; 2026 FirstCall Mechanical. All rights reserved.</span>
        <span><a href="https://firstcallgroup.com/" rel="noopener">FirstCall Group</a> &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></span>
      </div>
    </div>
  </footer>
`;

const SCRIPTS = `  <script>
    (function () {
      "use strict";
      function initMobileNav() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-site-nav]");
        if (!toggle || !nav) return;
        toggle.addEventListener("click", function () {
          var open = nav.classList.toggle("is-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
          document.body.style.overflow = open ? "hidden" : "";
        });
        nav.querySelectorAll("a").forEach(function (link) {
          link.addEventListener("click", function () {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
          });
        });
      }
      function initDropdowns() {
        var wraps = document.querySelectorAll("[data-dropdown]");
        wraps.forEach(function (wrap) {
          var toggle = wrap.querySelector("[data-dropdown-toggle]");
          var menu = wrap.querySelector("[data-dropdown-menu]");
          if (!toggle || !menu) return;
          function open() { menu.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true"); }
          function close() { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
          toggle.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.contains("is-open") ? close() : open(); });
          document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) close(); });
          if (window.matchMedia("(min-width: 1024px)").matches) {
            wrap.addEventListener("mouseenter", open);
            wrap.addEventListener("mouseleave", close);
          }
        });
      }
      function initHeaderScroll() {
        var header = document.querySelector(".site-header");
        if (!header) return;
        var ticking = false;
        function update() { if (window.scrollY > 8) header.classList.add("is-scrolled"); else header.classList.remove("is-scrolled"); ticking = false; }
        window.addEventListener("scroll", function () { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } }, { passive: true });
        update();
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () { initMobileNav(); initDropdowns(); initHeaderScroll(); });
      } else { initMobileNav(); initDropdowns(); initHeaderScroll(); }
    })();
  </script>
</body>
</html>`;

// --- content helpers --------------------------------------------------------
function feature(icon, title, body) { return `        <div class="feature"><div class="feature__icon">${icon}</div><h3>${title}</h3><p>${body}</p></div>`; }
function check(title, body) { return `          <li>${I.check}<div><strong>${title}</strong><span>${body}</span></div></li>`; }
function step(title, body) { return `        <div class="step"><h3>${title}</h3><p>${body}</p></div>`; }
function crumb(current) { return `        <nav class="ci-crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/critical-infrastructure/">Critical Infrastructure</a> › <span>${current}</span></nav>`; }
function relatedCards(exceptKey) {
  return SUBS.filter(function (s) { return s.key !== exceptKey; }).map(function (s) {
    return `        <a class="related-card" href="/critical-infrastructure/${s.slug}"><span class="eyebrow">Critical Infrastructure</span><h3>${s.nav}</h3><p>${s.blurb}.</p></a>`;
  }).join("\n");
}
function relatedSection(exceptKey) {
  return `  <section class="section">
    <div class="container">
      <div class="section-head section-head--center">
        <span class="eyebrow">Explore</span>
        <h2>More Critical Infrastructure.</h2>
      </div>
      <div class="related-grid">
${relatedCards(exceptKey)}
      </div>
    </div>
  </section>
`;
}
function ctaBand(heading, body) {
  return `  <section class="cta-band has-hex">
    <div class="container">
      <div class="cta-band__inner">
        <span class="eyebrow">Talk to FirstCall</span>
        <h2>${heading}</h2>
        <p>${body}</p>
        <div class="cta-band__cta">
          <a class="btn btn--primary btn--lg" href="/contact">Get in Touch</a>
          <a class="btn btn--outline-on-dark btn--lg" href="/locations">Find a Branch</a>
        </div>
      </div>
    </div>
  </section>
`;
}

// ---------------------------------------------------------------------------
// PAGE BODIES
// ---------------------------------------------------------------------------
const HUB_PILLAR_COPY = {
  "performance-contracting": "Fund deep facility upgrades from the energy and operational savings they create — with engineered scopes and measured, verified results.",
  "data-centers": "Precision cooling, chilled-water plants, and redundancy maintenance for facilities where uptime is non-negotiable.",
  "life-sciences-healthcare": "Operating and procedure rooms, cleanrooms, critical-environment HVAC, and compliant systems for hospitals, labs, and pharmaceutical manufacturing.",
  "turbines-rotating-equipment": "Inspection, overhaul, and field service for steam and gas turbines, generators, and the compressors that keep a plant running.",
};

function hubBody() {
  const pillars = SUBS.map(function (s) {
    return `        <a class="pillar" href="/critical-infrastructure/${s.slug}">
          <div class="pillar__icon">${s.icon}</div>
          <h3>${s.nav}</h3>
          <p>${HUB_PILLAR_COPY[s.key]}</p>
          <span class="pillar__more">Explore ${I.arrow}</span>
        </a>`;
  }).join("\n");
  return `  <main id="main">
    <section class="ci-hero has-hex">
      <div class="container">
        <div class="ci-hero__inner">
          <span class="eyebrow">FirstCall · Critical Infrastructure</span>
          <h1>Mechanical infrastructure for facilities that can't go down.</h1>
          <p>For the environments where an hour of downtime is measured in lost research, regulatory risk, or compute that never comes back, FirstCall brings the mechanical, controls, and rotating-equipment expertise to keep critical systems running — backed by a national platform of self-performing branches.</p>
          <div class="ci-hero__cta">
            <a class="btn btn--primary btn--lg" href="/contact">Talk to our team</a>
            <a class="btn btn--outline-on-dark btn--lg" href="/locations">Explore our branches</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Where reliability is the whole job</span>
          <h2>Most buildings tolerate a hiccup. Critical facilities don't.</h2>
          <p class="lead" style="margin-inline:auto;">Data halls, hospitals, laboratories, and energy assets run continuously, under load, with redundancy that has to actually work when it's called on. FirstCall focuses its industrial and commercial mechanical capability on exactly these environments.</p>
        </div>
        <div class="pillars">
${pillars}
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="split">
          <div class="section-head" style="margin-bottom:0;">
            <span class="eyebrow">Why FirstCall</span>
            <h2>A national platform with local hands on the equipment.</h2>
            <div class="prose" style="margin-top:var(--space-4);">
              <p>FirstCall is a multi-region platform built from established regional mechanical companies — each one self-performing, each one accountable for the work in its own market. That structure is what lets us serve critical facilities: the crew that scopes the job is the crew that performs it, backed by the depth and specialty capability of the wider group.</p>
            </div>
          </div>
          <ul class="checks">
${check("Self-performing, coast to coast", "Branches across the country — the people who plan the work do the work.")}
${check("One platform, deep specialties", "From building controls to steam-turbine overhaul, capabilities most single firms can't cover.")}
${check("24/7 emergency response", "Critical systems fail on their own schedule. We answer on yours.")}
${check("Planned maintenance that prevents the call", "Disciplined programs that catch failures before they become outages.")}
          </ul>
        </div>
      </div>
    </section>

${ctaBand("Tell us what keeps your facility up at night.", "Whether it's a cooling plant, a cleanroom, a savings target, or a turbine outage, our team will route you to the right branch and the right specialists.")}
  </main>
`;
}

function performanceBody() {
  return `  <main id="main">
    <section class="ci-hero has-hex">
      <div class="container">
${crumb("Performance Contracting")}
        <div class="ci-hero__inner">
          <span class="eyebrow">Critical Infrastructure · Performance Contracting</span>
          <h1>Upgrade your facility. Let the savings pay for it.</h1>
          <p>Performance contracting funds deep mechanical, controls, and efficiency upgrades from the energy and operational savings they generate — with engineered scopes and measured, verified results, so the business case is on paper before the first wrench turns.</p>
          <div class="ci-hero__cta">
            <a class="btn btn--primary btn--lg" href="/contact">Start a facility assessment</a>
            <a class="btn btn--outline-on-dark btn--lg" href="/critical-infrastructure/">Back to Critical Infrastructure</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">What it is</span>
              <h2>A capital project that funds itself.</h2>
            </div>
            <div class="prose">
              <p>Aging chillers, boilers, controls, and lighting quietly bleed money — in energy, in repairs, in downtime. A performance contract bundles those upgrades into a single engineered scope, then ties the investment to the savings it produces.</p>
              <p>Instead of asking for capital up front, you redirect money you're already spending on waste into modern, reliable infrastructure — and the savings are measured against a documented baseline, not assumed.</p>
            </div>
          </div>
          <ul class="checks">
${check("Engineered, not estimated", "Every measure is scoped and modeled before it's proposed.")}
${check("Measured & verified savings", "Results are tracked against a baseline over the life of the agreement.")}
${check("One accountable partner", "FirstCall self-performs the mechanical work — no hand-offs, no finger-pointing.")}
${check("Reliability, not just efficiency", "Newer plant and tuned controls mean fewer failures and emergency calls.")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">How it works</span>
          <h2>From audit to verified savings.</h2>
        </div>
        <div class="steps">
${step("Investment-grade audit", "We benchmark how your facility actually uses energy and where it's being lost.")}
${step("Engineered scope", "A prioritized package of mechanical, controls, and envelope measures — each with projected savings.")}
${step("Measurement &amp; verification", "Savings are measured against a baseline, so results are documented, not promised.")}
${step("Ongoing optimization", "Planned maintenance and controls tuning keep the savings in place year over year.")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Measures we deliver</span>
          <h2>Where the savings come from.</h2>
        </div>
        <div class="feature-grid">
${feature(I.cog, "Chiller &amp; boiler modernization", "Replace and right-size central plant equipment that's past its efficient life.")}
${feature(I.gauge, "Building automation &amp; controls", "BAS/BMS upgrades and sequences that stop equipment from fighting itself.")}
${feature(I.wind, "HVAC optimization &amp; retrocommissioning", "Tune air and water systems back to — and beyond — design intent.")}
${feature(I.bolt, "Lighting &amp; electrical efficiency", "LED retrofits and electrical measures with fast, reliable paybacks.")}
${feature(I.droplet, "Water &amp; domestic systems", "Conservation measures that cut utility cost and consumption.")}
${feature(I.trending, "Metering, monitoring &amp; analytics", "Visibility that turns one-time savings into a permanent baseline.")}
        </div>
      </div>
    </section>

    <section class="section section--dark has-hex">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Who it's for</span>
          <h2>Built for budgets that have to stretch.</h2>
          <p class="lead" style="margin-inline:auto; color:rgba(242,239,227,0.82);">Performance contracting is a fit wherever capital is tight but inefficiency is expensive — hospitals and health systems, universities and K-12, municipal and government facilities, and large commercial and industrial portfolios.</p>
        </div>
      </div>
    </section>

${relatedSection("performance-contracting")}
${ctaBand("See what your facility could save.", "Send us your building and we'll scope an assessment — no obligation, just a clear picture of where the waste is and what it's worth.")}
  </main>
`;
}

function dataCentersBody() {
  return `  <main id="main">
    <section class="ci-hero has-hex">
      <div class="container">
${crumb("Data Centers")}
        <div class="ci-hero__inner">
          <span class="eyebrow">Critical Infrastructure · Data Centers</span>
          <h1>Keep the cooling on. Keep the racks up.</h1>
          <p>In a data center, mechanical failure is downtime — and downtime is the one thing the business can't buy back. FirstCall maintains and services the cooling, controls, and critical mechanical systems that keep compute environments inside spec, around the clock.</p>
          <div class="ci-hero__cta">
            <a class="btn btn--primary btn--lg" href="/contact">Talk to a critical-cooling team</a>
            <a class="btn btn--outline-on-dark btn--lg" href="/critical-infrastructure/">Back to Critical Infrastructure</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Why mechanical is mission-critical</span>
              <h2>Heat is the enemy. Redundancy is the answer.</h2>
            </div>
            <div class="prose">
              <p>Every watt of compute becomes heat that has to go somewhere — continuously, reliably, no matter the season or the load. Data centers are engineered with N+1 and 2N redundancy precisely because the cooling can never fully stop.</p>
              <p>That redundancy only protects you if it's maintained, tested, and ready to carry load the moment a unit drops offline. Keeping standby capacity genuinely standby — that's the discipline we bring.</p>
            </div>
          </div>
          <ul class="checks">
${check("Concurrent maintainability", "We plan work so capacity stays redundant while equipment is serviced.")}
${check("Failover that actually fails over", "Standby units and sequences are tested, not assumed.")}
${check("MOP discipline", "Methods of procedure are scripted, reviewed, and logged before work begins.")}
${check("Live-load awareness", "Crews trained for hot-aisle/cold-aisle environments and energized constraints.")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Capabilities</span>
          <h2>The mechanical systems that hold the room.</h2>
        </div>
        <div class="feature-grid">
${feature(I.server, "CRAC / CRAH &amp; precision cooling", "Service, repair, and planned maintenance for computer-room cooling units.")}
${feature(I.droplet, "Chilled-water plants &amp; piping", "Chillers, pumps, cooling towers, and the distribution that ties them together.")}
${feature(I.gauge, "Controls &amp; monitoring integration", "Computer-room controls tied into your BMS and monitoring stack.")}
${feature(I.wind, "Airflow &amp; containment", "Humidification, static-pressure, and hot/cold-aisle containment management.")}
${feature(I.shield, "Redundancy &amp; failover testing", "Validate that N+1 / 2N capacity carries load when it's called on.")}
${feature(I.clock, "24/7 emergency response", "Critical spares and on-call crews for when a unit drops at 3 a.m.")}
        </div>
      </div>
    </section>

    <section class="section section--dark has-hex">
      <div class="container">
        <div class="stat-band">
          <div><div class="stat-band__num">24/7</div><div class="stat-band__label">Emergency response, every day of the year</div></div>
          <div><div class="stat-band__num">N+1</div><div class="stat-band__label">Maintenance planned around your redundancy model</div></div>
          <div><div class="stat-band__num">MOP</div><div class="stat-band__label">Scripted, reviewed procedures on every critical task</div></div>
        </div>
      </div>
    </section>

${relatedSection("data-centers")}
${ctaBand("Your uptime is a mechanical problem too.", "Talk to a FirstCall team that understands concurrent maintainability, critical cooling, and what it takes to service live load without dropping the room.")}
  </main>
`;
}

function lifeSciencesBody() {
  return `  <main id="main">
    <section class="ci-hero has-hex">
      <div class="container">
${crumb("Life Sciences &amp; Healthcare")}
        <div class="ci-hero__inner">
          <span class="eyebrow">Critical Infrastructure · Life Sciences &amp; Healthcare</span>
          <h1>Critical environments, held to a higher standard.</h1>
          <p>Hospitals, laboratories, and pharmaceutical manufacturing run on mechanical systems where a degree, a pressure relationship, or an air change isn't a comfort setting — it's patient safety, product integrity, and regulatory compliance. FirstCall services those systems with the precision they demand.</p>
          <div class="ci-hero__cta">
            <a class="btn btn--primary btn--lg" href="/contact">Talk to our critical-environments team</a>
            <a class="btn btn--outline-on-dark btn--lg" href="/critical-infrastructure/">Back to Critical Infrastructure</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Why it's different</span>
              <h2>Where HVAC becomes life safety.</h2>
            </div>
            <div class="prose">
              <p>In a patient room, an operating suite, a containment lab, or a sterile fill line, the mechanical system is part of the clinical or manufacturing process. Pressure cascades keep contaminants where they belong. Temperature and humidity protect patients and product. Air changes and filtration are validated and documented.</p>
              <p>We maintain these systems knowing that "close enough" isn't a category that exists here — and that the work has to be done with the facility occupied and operating.</p>
            </div>
          </div>
          <ul class="checks">
${check("Pressure relationships protected", "Positive/negative cascades maintained and verified, not disturbed.")}
${check("Documentation built in", "Work recorded to support validation and compliance readiness.")}
${check("Infection-control aware", "Dust, disruption, and access managed for occupied clinical space.")}
${check("Planned + emergency coverage", "Disciplined maintenance plus 24/7 response when minutes matter.")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Operating &amp; procedure rooms</span>
              <h2>The rooms where the air is part of the procedure.</h2>
            </div>
            <div class="prose">
              <p>Operating rooms and procedure rooms run to tight, code-defined targets: positive pressure to the corridor, the air changes per hour their classification calls for, and temperature and humidity held inside a narrow band. When any of those drift, cases get delayed, sterility is questioned, and the room can be pulled from service — lost revenue on some of the most valuable square footage in the building.</p>
              <p>FirstCall keeps these rooms in spec and ready for use. We test and balance airflow and pressure relationships, service the terminal HEPA filtration, hold temperature and humidity through reheat and humidification, and record every reading so the room is defensible to infection control and your accrediting surveyors. Work is scheduled around your case calendar and performed under infection-control protocols — with 24/7 response when a room goes down unexpectedly.</p>
            </div>
          </div>
          <ul class="checks">
${check("Air changes verified", "Supply, exhaust, and ACH balanced and certified to the room's classification.")}
${check("Pressure to the corridor", "Positive pressure relationships confirmed so the clean space stays clean.")}
${check("Temp &amp; humidity in band", "Reheat and humidification tuned to hold the surgical and procedure range.")}
${check("HEPA serviced &amp; recorded", "Terminal filtration changed, checked, and documented for recertification.")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Capabilities</span>
          <h2>Systems we keep in spec.</h2>
        </div>
        <div class="feature-grid">
${feature(I.pulse, "Critical-environment HVAC", "Operating suites, patient care, and other spaces where the air is part of care.")}
${feature(I.wind, "Cleanrooms &amp; controlled environments", "Classified spaces with the airflow, filtration, and stability they require.")}
${feature(I.thermo, "Lab exhaust &amp; pressurization", "Fume hoods, exhaust, and pressurization control kept balanced and safe.")}
${feature(I.factory, "GMP &amp; pharma utilities", "Process and facility utilities supporting regulated manufacturing.")}
${feature(I.doc, "Validation &amp; compliance support", "Documentation and readiness support for inspections and requalification.")}
${feature(I.clock, "Planned maintenance &amp; 24/7 response", "Programs that prevent failures, and crews on call when they happen anyway.")}
        </div>
      </div>
    </section>

    <section class="section section--dark has-hex">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Held to the standard</span>
          <h2>Built for occupied, regulated, unforgiving spaces.</h2>
          <p class="lead" style="margin-inline:auto; color:rgba(242,239,227,0.82);">From community hospitals and surgical centers to research universities, biotech labs, and pharmaceutical manufacturers — we work where the mechanical system is inseparable from safety and compliance.</p>
        </div>
      </div>
    </section>

${relatedSection("life-sciences-healthcare")}
${ctaBand("Precision your facility can document.", "Bring us your critical environments — surgical suites, cleanrooms, labs, or GMP utilities — and we'll service them to the standard your patients, product, and auditors require.")}
  </main>
`;
}

function turbinesBody() {
  return `  <main id="main">
    <section class="ci-hero has-hex">
      <div class="container">
${crumb("Turbines &amp; Rotating Equipment")}
        <div class="ci-hero__inner">
          <span class="eyebrow">Critical Infrastructure · Turbines &amp; Rotating Equipment</span>
          <h1>When the machine has to run, we keep it turning.</h1>
          <p>Steam and gas turbines, generators, and the compressors that move a plant's lifeblood are the most critical — and least forgiving — assets on site. Through our KATS Solutions team, FirstCall delivers OEM-grade inspection, overhaul, and field service for rotating equipment, built on root-cause diagnosis rather than parts-swapping.</p>
          <div class="ci-hero__cta">
            <a class="btn btn--primary btn--lg" href="/contact">Talk to a rotating-equipment specialist</a>
            <a class="btn btn--outline-on-dark btn--lg" href="https://kats.pro/" rel="noopener">Visit KATS Solutions</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Our approach</span>
              <h2>Solutions, not just parts.</h2>
            </div>
            <div class="prose">
              <p>The cheapest repair is the one that fixes the actual problem. Our rotating-equipment work starts with diagnosis — understanding why a machine failed before deciding what it needs — so you're not back in an outage six months later.</p>
              <p>Customers tell us it feels like working with the OEMs of yesteryear: deep craft, straight answers, and ownership of the result — whether we're upgrading a critical machine or helping you maintain a fleet.</p>
            </div>
          </div>
          <ul class="checks">
${check("Root-cause first", "We diagnose the failure mode before we quote the repair.")}
${check("Field service or shop", "On-site outages and turnarounds, or full shop overhaul and reconditioning.")}
${check("Parts &amp; reconditioning", "Sourced, reconditioned, and supplied to keep critical machines running.")}
${check("Engineered upgrades", "Modernize a critical machine to run more efficiently and more reliably.")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Equipment &amp; services</span>
          <h2>The rotating equipment we keep alive.</h2>
        </div>
        <div class="feature-grid">
${feature(I.turbine, "Steam turbine service &amp; overhaul", "Inspection, repair, and full overhaul of steam turbines and their controls.")}
${feature(I.bolt, "Gas turbine &amp; generator support", "Field service and overhaul support for gas turbines and generation packages.")}
${feature(I.cog, "Centrifugal compressors", "Maintenance and overhaul for the centrifugal machines at the heart of the process.")}
${feature(I.wrench, "Reciprocating compressors &amp; engines", "Repair and overhaul of reciprocating compression and engine assets.")}
${feature(I.gauge, "Trip &amp; throttle (T&amp;T) valves", "Service and supply for the protective valves that safeguard the train.")}
${feature(I.factory, "Field service, parts &amp; reconditioning", "Mobile crews, critical spares, and reconditioned components when you need them.")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">How an engagement runs</span>
          <h2>From inspection to back in service.</h2>
        </div>
        <div class="steps">
${step("Inspect", "Assess condition in the field or in the shop, and capture what the data shows.")}
${step("Diagnose", "Find the root cause — not just the broken part — before recommending a scope.")}
${step("Overhaul &amp; repair", "Execute the work to OEM-grade standards, in the shop or on site.")}
${step("Commission &amp; maintain", "Return the machine to service and keep it there with planned maintenance.")}
        </div>
      </div>
    </section>

    <section class="section section--dark has-hex">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Where we work</span>
          <h2>Trusted on the assets that can't fail.</h2>
          <p class="lead" style="margin-inline:auto; color:rgba(242,239,227,0.82);">Natural-gas pipelines and compression, power generation, institutional central plants, and heavy industry — wherever rotating equipment is the difference between running and stopped.</p>
        </div>
      </div>
    </section>

${relatedSection("turbines-rotating-equipment")}
${ctaBand("Have a turbine, compressor, or generator to address?", "Whether it's a planned overhaul or an unplanned outage, our rotating-equipment specialists can scope the work and get the machine back in service.")}
  </main>
`;
}

// ---------------------------------------------------------------------------
// Assemble + write
// ---------------------------------------------------------------------------
function page(meta, active, body) { return head(meta) + header(active) + body + FOOTER + SCRIPTS + "\n"; }

const PAGES = [
  { out: "index.html", active: "hub", body: hubBody,
    meta: { slug: "", crumb: "Critical Infrastructure", title: "Critical Infrastructure — FirstCall Mechanical", desc: "Mechanical, controls, and rotating-equipment service for facilities that can't go down — data centers, hospitals and labs, energy assets, and efficiency upgrades." } },
  { out: "performance-contracting.html", active: "performance-contracting", body: performanceBody,
    meta: { slug: "performance-contracting", crumb: "Performance Contracting", title: "Performance Contracting — FirstCall Mechanical", desc: "Fund mechanical and efficiency upgrades from the energy savings they create — engineered scopes with measured, verified results, self-performed by FirstCall." } },
  { out: "data-centers.html", active: "data-centers", body: dataCentersBody,
    meta: { slug: "data-centers", crumb: "Data Centers", title: "Data Center Mechanical &amp; Cooling Services — FirstCall Mechanical", desc: "Precision cooling, chilled-water plants, and redundancy maintenance for data centers — concurrent maintainability, MOP discipline, and 24/7 emergency response." } },
  { out: "life-sciences-healthcare.html", active: "life-sciences-healthcare", body: lifeSciencesBody,
    meta: { slug: "life-sciences-healthcare", crumb: "Life Sciences & Healthcare", title: "Life Sciences & Healthcare Mechanical Services — FirstCall Mechanical", desc: "Operating and procedure rooms, cleanrooms, critical-environment HVAC, and GMP utilities for hospitals, labs, and pharma — serviced to compliance by FirstCall." } },
  { out: "turbines-rotating-equipment.html", active: "turbines-rotating-equipment", body: turbinesBody,
    meta: { slug: "turbines-rotating-equipment", crumb: "Turbines & Rotating Equipment", title: "Turbines & Rotating Equipment Service — FirstCall Mechanical", desc: "OEM-grade inspection, overhaul, and field service for steam and gas turbines, generators, and compressors — from FirstCall's KATS Solutions rotating-equipment team." } },
];

function buildPages() {
  if (!fs.existsSync(CI_DIR)) fs.mkdirSync(CI_DIR, { recursive: true });
  PAGES.forEach(function (p) {
    fs.writeFileSync(path.join(CI_DIR, p.out), page(p.meta, p.active, p.body()));
    console.log("  wrote: critical-infrastructure/" + p.out);
  });
}

console.log("Injecting CI dropdown into FCM pages:");
injectFcm();
console.log("Disabling earlier FCG injection:");
disableFcg();
console.log("Generating /critical-infrastructure/ pages (FCM chrome):");
buildPages();
console.log("Done.");
