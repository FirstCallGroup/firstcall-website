/**
 * Builds the FirstCall BUILDING SOLUTIONS site (firstcallbuildingsolutions.com).
 *
 * FCBS is the National / Strategic Accounts front door for the FirstCall
 * network: one place where a multi-site or mission-critical customer can reach
 * every FirstCall service and branch. Content structure starts from the CLS
 * Facility Services site (clsfacilityservices.com) per Matthew Hunt's notes,
 * with a "Mission Critical" tab added to the front of the menu.
 *
 * Output: /building-solutions/** (repo root). Routing:
 *   - firstcallbuildingsolutions.com/<path>  -> /building-solutions/<path>  (_worker.js rewrite)
 *   - firstcallgroup.com|firstcallmechanical.com/building-solutions/*  -> 301 to FCBS domain
 *   - Local preview: http://fcbs.localhost:5173/  (scripts/dev-server.js host prefix)
 *
 * Chrome (tokens / header / nav dropdown / footer CSS) is borrowed from the FCM
 * careers page so all FirstCall sites stay visually in sync — same approach as
 * scripts/build-critical-infrastructure.js.
 *
 * Also regenerates sitemap-building-solutions.xml.
 *
 * Run:  node scripts/build-building-solutions.js
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "building-solutions");
const SITE = "https://firstcallbuildingsolutions.com";
const BRAND = "FirstCall Building Solutions";
const TODAY = new Date().toISOString().slice(0, 10);

// Corporate contact (FirstCall Group HQ). Update here if FCBS gets its own line/inbox.
const PHONE_DISPLAY = "(844) 715-0220";
const PHONE_HREF = "tel:+18447150220";
const EMAIL = "info@firstcallgroup.com";
const HQ = { street: "3101 Bee Caves Rd, Suite 250", city: "Rollingwood", state: "TX", zip: "78746" };

// Static fallbacks for the dynamic network counts (fc-counts.js overrides at runtime).
const locData = fs.readFileSync(path.join(ROOT, "assets/js/locations-data.js"), "utf8");
const LOCATIONS = JSON.parse(locData.match(/window\.FC_LOCATIONS\s*=\s*(\[[\s\S]*\]);/)[1]);
const BRANCH_COUNT = LOCATIONS.length;
const STATE_COUNT = new Set(LOCATIONS.map(function (b) { return b.state; })).size;

// Latest Insights posts (FCM blog) — surfaced on the FCBS home page.
const INSIGHTS = require("./insights-data.js");
const LATEST_POSTS = INSIGHTS.POSTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);

// ---------------------------------------------------------------------------
// Chrome donor — FCM careers page (tokens + header + footer + nav dropdown CSS)
// ---------------------------------------------------------------------------
const donor = fs.readFileSync(path.join(ROOT, "mechanical/careers.html"), "utf8");
const CHROME_CSS = donor.slice(donor.indexOf("<style>") + "<style>".length, donor.indexOf("/* ===== PAGE HERO")).replace(/\s+$/, "");
const DROPDOWN_CSS = donor.slice(donor.indexOf("/* ===== Nav dropdown (Branches)"), donor.indexOf("</style>")).replace(/\s+$/, "");

// ---------------------------------------------------------------------------
// Logo — FC mark + "FIRSTCALL" glyphs from the FCM wordmark, with a
// "BUILDING SOLUTIONS" line in place of "MECHANICAL".
// ---------------------------------------------------------------------------
const fcmLogo = fs.readFileSync(path.join(ROOT, "shared/img/logos/firstcall-mechanical-white.svg"), "utf8");
const allPaths = fcmLogo.match(/<path class="cls-1" d="[^"]*"\/>/g);
const MARK_PATHS = allPaths.slice(0, 4).map(function (p) { return p.replace(' class="cls-1"', ""); }).join("");
const leafGroups = fcmLogo.match(/<g>\s*(?:<path class="cls-1" d="[^"]*"\/>\s*)+<\/g>/g);
const FIRSTCALL_GROUP = leafGroups[0].replace(/ class="cls-1"/g, "").replace(/>\s+</g, "><");
const WORDLINE = '<text x="452" y="334" font-family="Manrope, system-ui, -apple-system, \'Segoe UI\', sans-serif" font-weight="800" font-size="92" textLength="1050" lengthAdjust="spacingAndGlyphs">BUILDING SOLUTIONS</text>';
function logoSvg(attrs) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1502.68 337.31" ' + attrs + '><g fill="#fff">' + MARK_PATHS + FIRSTCALL_GROUP + WORDLINE + "</g></svg>";
}
const LOGO = logoSvg('aria-hidden="true"');
const LOGO_LABELLED = logoSvg('aria-label="' + BRAND + '"');
// Standalone file (used for og:image-style references and the schema logo).
fs.writeFileSync(path.join(ROOT, "shared/img/logos/firstcall-building-solutions-white.svg"),
  '<?xml version="1.0" encoding="UTF-8"?>\n' + logoSvg('') + "\n");

const CARET = '<svg class="site-nav__caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4 L6 8 L10 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// ---------------------------------------------------------------------------
// Imagery
// ---------------------------------------------------------------------------
// Real FirstCall equipment photography (already in the repo) + two licensed
// stock data-center frames (Unsplash, same source the FCM pages use).
const IMG = {
  chiller1: "/assets/columbus/photos/production/Chiller_1.avif",
  chiller2: "/assets/columbus/photos/production/Chiller_2.avif",
  tower: "/assets/columbus/photos/production/Cooling%20Tower.avif",
  crew: "/assets/columbus/photos/production/the-crew.jpg",
  racks: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1800&q=80&auto=format&fit=crop",
  hall: "https://images.unsplash.com/photo-1586772002130-b0f3daa6288b?w=1800&q=80&auto=format&fit=crop",
  hallSm: "https://images.unsplash.com/photo-1586772002130-b0f3daa6288b?w=900&q=75&auto=format&fit=crop",
  racksSm: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=75&auto=format&fit=crop",
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trending: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="7" rx="2" stroke="currentColor" stroke-width="2"/><rect x="3" y="13" width="18" height="7" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 7.5h.01M7 16.5h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12h4l2-5 4 10 2-5h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
  map: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="2"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 20h8M12 16v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3c1 3 4 5 4 9a4 4 0 11-8 0c0-1.5.5-2.5 1-3.5.5 1 1.5 1.5 2 1.5 0-3 .5-5 1-7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.6 1 1.3 1 2.5h6c0-1.2.3-1.9 1-2.5A6 6 0 0012 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plug: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 01-12 0V8zM12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sign: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M12 14v7M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  battery: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="7" width="17" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M22 10v4M6 11v2M10 11v2M14 11v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  hospital: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M12 8v6M9 11h6M9 21v-4h6v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/></svg>',
  handshake: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 9l4-3 5 3 5-3 4 3v6l-4 3-5-3-5 3-4-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v6" stroke="currentColor" stroke-width="2"/></svg>',
};

// ---------------------------------------------------------------------------
// Case studies — single source. Set published:true and fill the fields once
// the details arrive (Flexential / Micron from C2H per Matthew). Unpublished
// entries are never rendered, so nothing placeholder ships to the live site.
// ---------------------------------------------------------------------------
const CASE_STUDIES = [
  { published: false, slug: "flexential", client: "Flexential", sector: "Data Centers", branch: "C2H", tag: "data-centers",
    title: "", summary: "", scope: [], results: [] },
  { published: false, slug: "micron", client: "Micron", sector: "Data Centers", branch: "C2H", tag: "data-centers",
    title: "", summary: "", scope: [], results: [] },
];
const PUBLISHED_CASES = CASE_STUDIES.filter(function (c) { return c.published; });

// ---------------------------------------------------------------------------
// Site map / nav
// ---------------------------------------------------------------------------
const MC = [
  { slug: "data-centers", nav: "Data Centers", blurb: "Critical cooling, liquid cooling, commissioning &amp; QA/QC", icon: I.server },
  { slug: "energy-services-resiliency", nav: "Energy Services &amp; Resiliency", blurb: "Efficiency, backup readiness &amp; recovery", icon: I.bolt },
  { slug: "healthcare", nav: "Healthcare", blurb: "Compliant, occupied, always-on environments", icon: I.hospital },
];

// Every page we emit: key -> { out, url, title, desc, crumb }
const PAGES = {
  home:        { out: "index.html", url: "/", title: BRAND + " — National &amp; Strategic Accounts for the FirstCall Network", desc: "One partner for every location and every critical system. FirstCall Building Solutions gives multi-site and mission-critical operators a single point of contact for HVAC, controls, electrical, plumbing, and fire-life safety across the FirstCall network." },
  mcHub:       { out: "mission-critical/index.html", url: "/mission-critical/", title: "Mission Critical — " + BRAND, desc: "Data centers, energy services and resiliency, and healthcare — mechanical, electrical, and controls service for facilities where downtime is not an option.", crumb: "Mission Critical" },
  dataCenters: { out: "mission-critical/data-centers.html", url: "/mission-critical/data-centers", title: "Data Center Cooling, Liquid Cooling &amp; Commissioning — " + BRAND, desc: "Critical cooling maintenance, liquid cooling retrofits and deployments, commissioning, and QA/QC for data centers — delivered by FirstCall's self-performing branches and national network.", crumb: "Data Centers" },
  energy:      { out: "mission-critical/energy-services-resiliency.html", url: "/mission-critical/energy-services-resiliency", title: "Energy Services &amp; Resiliency — " + BRAND, desc: "Energy audits, retro-commissioning, controls optimization, LED and utility rebates, backup-power readiness, and resiliency planning across your portfolio.", crumb: "Energy Services &amp; Resiliency" },
  healthcare:  { out: "mission-critical/healthcare.html", url: "/mission-critical/healthcare", title: "Healthcare Facilities — " + BRAND, desc: "Mechanical, electrical, and controls service for hospitals, health systems, clinics, and senior living — compliant, documented, and delivered in occupied clinical space.", crumb: "Healthcare" },
  about:       { out: "about.html", url: "/about", title: "About — " + BRAND, desc: "FirstCall Building Solutions is the national and strategic accounts arm of FirstCall Group — one team, one contract, one point of contact for the entire FirstCall network.", crumb: "About Us" },
  difference:  { out: "the-firstcall-difference.html", url: "/the-firstcall-difference", title: "The FirstCall Difference — " + BRAND, desc: "A self-performing national network, a dedicated account team, enterprise asset lists, and an asset management portal that gives you full visibility across every location.", crumb: "The FirstCall Difference" },
  services:    { out: "services.html", url: "/services", title: "Services — " + BRAND, desc: "HVAC, building automation and controls, electrical and lighting, LED retrofits and rebates, plumbing, fire and life safety, and signage — proactive and reactive, nationwide.", crumb: "Services" },
  industries:  { out: "industries.html", url: "/industries", title: "Industries — " + BRAND, desc: "Multi-site and mission-critical facility programs for data centers, healthcare, financial institutions, retail, restaurants, industrial, labs, storage, and more.", crumb: "Industries" },
  cases:       { out: "case-studies.html", url: "/case-studies", title: "Case Studies — " + BRAND, desc: "How FirstCall branches deliver for national accounts and mission-critical facilities.", crumb: "Case Studies" },
  contact:     { out: "contact.html", url: "/contact", title: "Contact — " + BRAND, desc: "Talk to the FirstCall national accounts team about a multi-site program, a mission-critical facility, or an emergency.", crumb: "Contact" },
  partner:     { out: "become-a-partner.html", url: "/become-a-partner", title: "Become a Partner — " + BRAND, desc: "Grow your commercial service business with FirstCall. Apply to join the FirstCall partner network supporting national accounts across the United States.", crumb: "Become a Partner" },
};

function navDropdown(label, links, activeUrl, extraAttr) {
  const items = links.map(function (l) {
    const ext = /^https?:/.test(l.href) ? ' rel="noopener"' : "";
    const cur = activeUrl && l.href === activeUrl ? ' aria-current="page"' : "";
    return '            <a class="site-nav__dropdown-link" href="' + l.href + '"' + ext + cur + ">" + l.label + "</a>";
  }).join("\n");
  const toggleCur = activeUrl && links.some(function (l) { return l.href === activeUrl || (l.href.indexOf("#") > 0 && l.href.split("#")[0] === activeUrl); }) ? ' aria-current="page"' : "";
  return '<div class="site-nav__dropdown-wrap" data-dropdown' + (extraAttr || "") + '>\n' +
    '          <button type="button" class="site-nav__link site-nav__dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-dropdown-toggle' + toggleCur + '>' + label + " " + CARET + "</button>\n" +
    '          <div class="site-nav__dropdown" data-dropdown-menu>\n' + items + "\n          </div>\n        </div>";
}

function navLink(label, href, activeUrl) {
  const cur = activeUrl === href ? ' aria-current="page"' : "";
  const ext = /^https?:/.test(href) ? ' rel="noopener"' : "";
  return '<a class="site-nav__link" href="' + href + '"' + ext + cur + ">" + label + "</a>";
}

function header(activeUrl) {
  const mcLinks = [{ label: "Overview", href: "/mission-critical/" }].concat(MC.map(function (m) { return { label: m.nav, href: "/mission-critical/" + m.slug }; }));
  return `  <header class="site-header" role="banner">
    <div class="site-header__inner">
      <a class="site-header__logo" href="/" aria-label="${BRAND} — home">
        ${LOGO}
      </a>
      <nav class="site-nav" data-site-nav aria-label="Primary">
        ${navDropdown("Mission Critical", mcLinks, activeUrl, " data-mc-dropdown")}
        ${navDropdown("About Us", [
          { label: "About " + BRAND, href: "/about" },
          { label: "Leadership Team", href: "https://firstcallgroup.com/team" },
          { label: "Careers", href: "https://firstcallgroup.com/careers" },
        ], activeUrl)}
        ${navDropdown("FirstCall Difference", [
          { label: "National Network", href: "/the-firstcall-difference#national-network" },
          { label: "How We Add Value", href: "/the-firstcall-difference#how-we-add-value" },
          { label: "Asset Management Portal", href: "/the-firstcall-difference#asset-management-portal" },
        ], activeUrl)}
        ${navLink("Services", "/services", activeUrl)}
        ${navLink("Industries", "/industries", activeUrl)}
        ${navDropdown("Resources", [
          { label: "Case Studies", href: "/case-studies" },
          { label: "Insights", href: "https://firstcallmechanical.com/insights" },
          { label: "News", href: "https://firstcallgroup.com/news" },
        ], activeUrl)}
        ${navLink("Contact", "/contact", activeUrl)}
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
          ${LOGO_LABELLED}
          <p>${BRAND} — the national and strategic accounts team for the FirstCall network. One contract, one point of contact, every FirstCall service and branch.</p>
          <p class="site-footer__contact"><a href="${PHONE_HREF}">${PHONE_DISPLAY}</a><br><a href="mailto:${EMAIL}">${EMAIL}</a></p>
        </div>
        <div><div class="site-footer__heading">Mission Critical</div><ul class="site-footer__list">${MC.map(function (m) { return '<li><a href="/mission-critical/' + m.slug + '">' + m.nav + "</a></li>"; }).join("")}<li><a href="/mission-critical/">Overview</a></li></ul></div>
        <div><div class="site-footer__heading">Company</div><ul class="site-footer__list"><li><a href="/about">About Us</a></li><li><a href="/the-firstcall-difference">The FirstCall Difference</a></li><li><a href="https://firstcallgroup.com/team" rel="noopener">Leadership Team</a></li><li><a href="https://firstcallgroup.com/careers" rel="noopener">Careers</a></li><li><a href="/become-a-partner">Become a Partner</a></li></ul></div>
        <div><div class="site-footer__heading">Resources</div><ul class="site-footer__list"><li><a href="/services">Services</a></li><li><a href="/industries">Industries</a></li><li><a href="/case-studies">Case Studies</a></li><li><a href="https://firstcallmechanical.com/insights" rel="noopener">Insights</a></li><li><a href="https://firstcallgroup.com/news" rel="noopener">News</a></li></ul></div>
        <div><div class="site-footer__heading">FirstCall Network</div><ul class="site-footer__list"><li><a href="https://firstcallgroup.com/" rel="noopener">FirstCall Group</a></li><li><a href="https://firstcallmechanical.com/" rel="noopener">FirstCall Mechanical</a></li><li><a href="https://firstcallmechanical.com/locations" rel="noopener">All Network Branches</a></li><li><a href="https://www.linkedin.com/company/firstcall-mechanical/" rel="noopener">LinkedIn</a></li><li><a href="/contact">Contact</a></li></ul></div>
      </div>
      <div class="site-footer__bottom">
        <span>&copy; 2026 ${BRAND}. All rights reserved.</span>
        <span><a href="https://firstcallgroup.com/" rel="noopener">A FirstCall Group company</a> &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></span>
      </div>
    </div>
  </footer>
`;

// ---------------------------------------------------------------------------
// Page CSS (on top of the borrowed chrome)
// ---------------------------------------------------------------------------
const SITE_CSS = `
    /* ===== FirstCall Building Solutions ===== */
    .site-nav__dropdown-link[aria-current="page"] { color: var(--color-accent-light); }
    .site-header__logo svg { height: 40px; width: auto; }
    .site-footer__brand svg { height: 40px; width: auto; margin-bottom: var(--space-4); }
    .site-footer__contact { margin-top: var(--space-4); font-size: var(--text-sm); line-height: 1.8; }
    .site-footer__contact a { color: var(--color-text-on-dark); }
    .site-footer__contact a:hover { color: var(--color-accent-light); }
    .site-footer__grid { grid-template-columns: 1.7fr 1fr 1fr 1fr 1fr; }
    @media (max-width: 1023px) { .site-footer__grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 639px) { .site-footer__grid { grid-template-columns: 1fr; } }
    .site-nav__link { white-space: nowrap; }
    @media (max-width: 1023px) { .site-nav { max-height: calc(100vh - var(--header-height)); overflow-y: auto; -webkit-overflow-scrolling: touch; } }
    @media (min-width: 1024px) and (max-width: 1599px) { .site-nav { gap: var(--space-4); } .site-nav__link { font-size: var(--text-sm); } .site-header__inner { gap: var(--space-5); } }

    .has-hex { position: relative; overflow: hidden; }
    .has-hex::before { content: ""; position: absolute; inset: 0; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 96'><polygon points='28,4 52,18 52,46 28,60 4,46 4,18' fill='none' stroke='%235BA3D6' stroke-width='1' opacity='0.10'/><polygon points='0,52 24,66 24,94 0,108 -24,94 -24,66' fill='none' stroke='%235BA3D6' stroke-width='1' opacity='0.10'/><polygon points='56,52 80,66 80,94 56,108 32,94 32,66' fill='none' stroke='%235BA3D6' stroke-width='1' opacity='0.10'/></svg>"); background-size: 56px 96px; pointer-events: none; }
    .has-hex > * { position: relative; }

    /* Home hero — slow crossfade over chiller + data-center frames */
    .hero { position: relative; min-height: 86vh; display: flex; align-items: center; padding-block: var(--space-9); overflow: hidden; background: var(--color-primary-dark); color: #fff; isolation: isolate; margin-top: calc(var(--header-height) * -1); padding-top: calc(var(--header-height) + var(--space-9)); }
    @media (max-width: 767px) { .hero { min-height: 72vh; padding-block: var(--space-8); padding-top: calc(var(--header-height) + var(--space-7)); } }
    .hero__slides { position: absolute; inset: 0; z-index: -2; }
    .hero__slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; animation: heroFade 24s infinite; transform-origin: center; }
    .hero__slide:nth-child(1) { animation-delay: 0s; }
    .hero__slide:nth-child(2) { animation-delay: 6s; }
    .hero__slide:nth-child(3) { animation-delay: 12s; }
    .hero__slide:nth-child(4) { animation-delay: 18s; }
    @keyframes heroFade { 0% { opacity: 0; transform: scale(1); } 6% { opacity: 1; } 27% { opacity: 1; } 34% { opacity: 0; transform: scale(1.06); } 100% { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .hero__slide { animation: none; } .hero__slide:first-child { opacity: 1; } }
    .hero::before { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(100deg, rgba(15,40,20,0.86) 0%, rgba(15,40,20,0.62) 45%, rgba(15,40,20,0.30) 75%, rgba(15,40,20,0.18) 100%); }
    .hero__inner { position: relative; max-width: 800px; }
    .hero__eyebrow { display: inline-block; font-size: var(--text-sm); font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-caps); color: var(--color-accent-light); margin-bottom: var(--space-4); text-shadow: 0 1px 6px rgba(0,0,0,0.4); }
    .hero__title { font-family: var(--font-display); font-size: clamp(2.5rem, 5.6vw, 5rem); font-weight: var(--weight-bold); line-height: var(--leading-tight); letter-spacing: var(--tracking-tight); margin-bottom: var(--space-5); color: #fff; text-shadow: 0 2px 16px rgba(0,0,0,0.4); max-width: 18ch; }
    .hero__lede { font-size: var(--text-xl); line-height: var(--leading-relaxed); color: rgba(255,255,255,0.94); max-width: 58ch; margin-bottom: var(--space-6); text-shadow: 0 1px 10px rgba(0,0,0,0.35); }
    .hero__cta { display: flex; flex-wrap: wrap; gap: var(--space-3); }

    /* Page hero (dark, optional photo) */
    .page-hero { background: var(--color-primary-dark); color: var(--color-text-on-dark); padding-block: var(--space-9); position: relative; overflow: hidden; isolation: isolate; }
    .page-hero--photo::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(100deg, rgba(15,40,20,0.92) 0%, rgba(15,40,20,0.78) 50%, rgba(15,40,20,0.45) 100%); }
    .page-hero__bg { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; }
    .page-hero__inner { max-width: 860px; }
    .page-hero .eyebrow { color: var(--color-accent-light); }
    .page-hero h1 { color: #fff; margin-bottom: var(--space-5); }
    .page-hero p { color: rgba(242,239,227,0.88); font-size: var(--text-xl); line-height: var(--leading-relaxed); max-width: 64ch; margin-bottom: var(--space-6); }
    .page-hero__cta { display: flex; flex-wrap: wrap; gap: var(--space-4); }
    .crumb { font-size: var(--text-sm); color: rgba(242,239,227,0.6); margin-bottom: var(--space-5); display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .crumb a { color: rgba(242,239,227,0.78); }
    .crumb a:hover { color: var(--color-accent-light); }

    .section-head { max-width: 760px; margin-bottom: var(--space-7); }
    .section-head--center { margin-inline: auto; text-align: center; }
    .section-head h2 { margin-bottom: var(--space-3); }
    .section-head .lead { margin-bottom: 0; }
    .section-head--center .lead { margin-inline: auto; }
    .prose p { color: var(--color-text-muted); font-size: var(--text-lg); line-height: var(--leading-relaxed); margin-bottom: var(--space-4); max-width: 68ch; }
    .prose p:last-child { margin-bottom: 0; }
    .prose a { font-weight: var(--weight-semibold); }

    .stat-strip { background: var(--color-primary); color: #fff; }
    .stat-strip__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); padding-block: var(--space-7); text-align: center; }
    @media (max-width: 899px) { .stat-strip__grid { grid-template-columns: repeat(2, 1fr); } }
    .stat-strip__num { font-family: var(--font-display); font-weight: var(--weight-extrabold); font-size: clamp(2.25rem, 4vw, 3.25rem); line-height: 1; color: #fff; }
    .stat-strip__label { margin-top: var(--space-2); color: rgba(255,255,255,0.82); font-size: var(--text-sm); }

    .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
    @media (max-width: 899px) { .pillars { grid-template-columns: 1fr; } }
    .pillar { display: flex; flex-direction: column; gap: var(--space-4); padding: var(--space-6); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); transition: transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out); text-decoration: none; color: var(--color-text); }
    .pillar:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--color-accent-light); }
    .pillar__icon { width: 52px; height: 52px; border-radius: var(--radius-md); background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; }
    .pillar__icon svg { width: 26px; height: 26px; }
    .pillar h3 { font-size: var(--text-2xl); }
    .pillar p { color: var(--color-text-muted); font-size: var(--text-base); line-height: var(--leading-relaxed); }
    .pillar__more { margin-top: auto; font-weight: var(--weight-semibold); color: var(--color-accent); display: inline-flex; align-items: center; gap: 6px; transition: gap var(--duration-base) var(--ease-out); }
    .pillar__more svg { width: 18px; height: 18px; }
    .pillar:hover .pillar__more { gap: 10px; }
    .pillar--photo { padding: 0; overflow: hidden; }
    .pillar--photo img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
    .pillar--photo .pillar__body { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-5) var(--space-6) var(--space-6); flex: 1; }

    .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
    @media (max-width: 1023px) { .feature-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 639px) { .feature-grid { grid-template-columns: 1fr; } }
    .feature { padding: var(--space-6); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
    .feature__icon { width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-bg-section); color: var(--color-primary); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4); }
    .feature__icon svg { width: 24px; height: 24px; }
    .feature h3 { font-size: var(--text-xl); margin-bottom: var(--space-2); }
    .feature p { color: var(--color-text-muted); font-size: var(--text-base); line-height: var(--leading-relaxed); }
    .feature ul { margin: var(--space-3) 0 0; padding-left: 1.1em; color: var(--color-text-muted); line-height: var(--leading-relaxed); }
    .feature ul li { margin-bottom: 2px; }
    a.feature { display: block; text-decoration: none; color: var(--color-text); transition: border-color var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out); }
    a.feature:hover { border-color: var(--color-accent-light); transform: translateY(-3px); }

    .split { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: var(--space-8); align-items: start; }
    @media (max-width: 899px) { .split { grid-template-columns: 1fr; gap: var(--space-6); } }
    .split--photo { align-items: center; }
    .split__photo { border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg); }
    .split__photo img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
    .checks { list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--space-4); }
    .checks li { display: flex; gap: var(--space-3); align-items: flex-start; }
    .checks svg { width: 22px; height: 22px; flex: none; color: var(--color-accent); margin-top: 3px; }
    .checks strong { display: block; font-family: var(--font-display); font-size: var(--text-lg); letter-spacing: var(--tracking-tight); }
    .checks span { color: var(--color-text-muted); }
    .section--dark .checks span { color: rgba(242,239,227,0.8); }
    .section--dark .checks strong { color: #fff; }

    .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); counter-reset: step; }
    @media (max-width: 899px) { .steps { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 479px) { .steps { grid-template-columns: 1fr; } }
    .steps--3 { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: 899px) { .steps--3 { grid-template-columns: 1fr; } }
    .step { position: relative; }
    .step::before { counter-increment: step; content: counter(step, decimal-leading-zero); font-family: var(--font-display); font-weight: var(--weight-extrabold); font-size: var(--text-3xl); color: var(--color-accent-light); display: block; margin-bottom: var(--space-2); }
    .step h3 { font-size: var(--text-lg); margin-bottom: var(--space-2); }
    .step p { color: var(--color-text-muted); font-size: var(--text-base); line-height: var(--leading-relaxed); }

    .stat-band { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); text-align: center; }
    @media (max-width: 639px) { .stat-band { grid-template-columns: 1fr; gap: var(--space-5); } }
    .stat-band__num { font-family: var(--font-display); font-weight: var(--weight-extrabold); font-size: var(--text-5xl); color: #fff; line-height: 1; }
    .stat-band__label { color: rgba(242,239,227,0.8); margin-top: var(--space-2); }

    .photo-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); }
    @media (max-width: 767px) { .photo-strip { grid-template-columns: repeat(2, 1fr); } }
    .photo-strip img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--radius-lg); }

    .chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
    .chip { display: inline-block; padding: var(--space-2) var(--space-4); border-radius: var(--radius-pill); background: var(--color-bg-card); border: 1px solid var(--color-border); font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text); text-decoration: none; }
    .chip:hover { border-color: var(--color-accent); color: var(--color-accent); }
    .chip--accent { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
    .chip--accent:hover { background: var(--color-primary-mid); color: #fff; }

    .service-group { padding-block: var(--space-7); border-top: 1px solid var(--color-border); }
    .service-group:first-of-type { border-top: 0; padding-top: 0; }
    .service-group__head { display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-6); align-items: start; margin-bottom: var(--space-5); }
    @media (max-width: 899px) { .service-group__head { grid-template-columns: 1fr; gap: var(--space-3); } }
    .service-group__head h2 { font-size: clamp(1.5rem, 2.5vw, var(--text-3xl)); display: flex; align-items: center; gap: var(--space-3); }
    .service-group__head h2 svg { width: 30px; height: 30px; color: var(--color-accent); flex: none; }
    .service-group__head p { color: var(--color-text-muted); font-size: var(--text-lg); line-height: var(--leading-relaxed); }
    .service-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); list-style: none; padding: 0; }
    @media (max-width: 1023px) { .service-list { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 599px) { .service-list { grid-template-columns: 1fr; } }
    .service-list li { padding: var(--space-4) var(--space-5); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
    .service-list strong { display: block; font-family: var(--font-display); font-size: var(--text-base); margin-bottom: 4px; }
    .service-list span { color: var(--color-text-muted); font-size: var(--text-sm); line-height: var(--leading-relaxed); }

    .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
    @media (max-width: 899px) { .related-grid { grid-template-columns: 1fr; } }
    .related-card { display: block; padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg-card); text-decoration: none; color: var(--color-text); transition: border-color var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out); }
    .related-card:hover { border-color: var(--color-accent-light); transform: translateY(-3px); }
    .related-card .eyebrow { margin-bottom: var(--space-2); }
    .related-card h3 { font-size: var(--text-xl); }
    .related-card p { color: var(--color-text-muted); font-size: var(--text-sm); margin-top: var(--space-2); line-height: var(--leading-relaxed); }
    .related-card__meta { display: block; margin-top: var(--space-3); font-size: var(--text-xs); color: var(--color-text-light); text-transform: uppercase; letter-spacing: var(--tracking-caps); }

    .cta-band { background: var(--color-bg-dark); color: var(--color-text-on-dark); padding-block: var(--space-9); text-align: center; }
    .cta-band__inner { max-width: 720px; margin-inline: auto; }
    .cta-band h2 { color: #fff; margin-bottom: var(--space-4); }
    .cta-band p { color: rgba(255,255,255,0.85); margin-bottom: var(--space-6); font-size: var(--text-lg); }
    .cta-band__cta { display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; }
    .section--dark { background: var(--color-bg-dark); color: var(--color-text-on-dark); }
    .section--dark .eyebrow { color: var(--color-accent-light); }
    .section--dark h2, .section--dark h3 { color: #fff; }
    .section--dark .prose p, .section--dark p { color: rgba(242,239,227,0.82); }
    .section--dark .feature { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.14); }
    .section--dark .feature__icon { background: rgba(255,255,255,0.1); color: var(--color-accent-light); }
    .section--dark .feature h3 { color: #fff; }

    .notice { padding: var(--space-6); border: 1px dashed var(--color-border-strong); border-radius: var(--radius-xl); background: var(--color-bg-soft); max-width: 720px; margin-inline: auto; text-align: center; }
    .notice h3 { font-size: var(--text-xl); margin-bottom: var(--space-2); }
    .notice p { color: var(--color-text-muted); }

    /* Forms (same component as the FCM contact page) */
    .contact-form { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: var(--space-7); box-shadow: var(--shadow-md); }
    @media (max-width: 767px) { .contact-form { padding: var(--space-5); } }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4) var(--space-5); }
    @media (max-width: 639px) { .form-grid { grid-template-columns: 1fr; } }
    .form-field { display: flex; flex-direction: column; gap: var(--space-2); }
    .form-field--full { grid-column: 1 / -1; }
    .form-label { font-family: var(--font-body); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text); }
    .form-label .required { color: var(--color-accent); margin-left: 2px; }
    .form-input, .form-textarea, .form-select { width: 100%; padding: var(--space-3) var(--space-4); font-family: var(--font-body); font-size: var(--text-base); color: var(--color-text); background: var(--color-bg); border: 1.5px solid var(--color-border-strong); border-radius: var(--radius-md); transition: border-color var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out); }
    .form-input:hover, .form-textarea:hover, .form-select:hover { border-color: var(--color-text-muted); }
    .form-input:focus, .form-textarea:focus, .form-select:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(0, 85, 140, 0.15); }
    .form-textarea { min-height: 140px; resize: vertical; line-height: var(--leading-normal); }
    .form-help { font-size: var(--text-xs); color: var(--color-text-light); }
    .form-actions { margin-top: var(--space-5); display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; }
    .form-checks { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2) var(--space-4); }
    @media (max-width: 639px) { .form-checks { grid-template-columns: 1fr; } }
    .form-check { display: flex; gap: var(--space-2); align-items: flex-start; font-size: var(--text-sm); color: var(--color-text); cursor: pointer; }
    .form-check input { margin-top: 3px; accent-color: var(--color-accent); width: 16px; height: 16px; flex: none; }
    .form-legend { font-family: var(--font-body); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text); margin-bottom: var(--space-2); padding: 0; }
    fieldset.form-field { border: 0; padding: 0; margin: 0; min-width: 0; }
    .form-error { margin-top: var(--space-4); padding: var(--space-3) var(--space-4); background: #FEF2F2; border: 1px solid #FCA5A5; color: #7F1D1D; border-radius: 8px; font-size: 0.875rem; }

    .contact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); margin-bottom: var(--space-8); }
    @media (max-width: 899px) { .contact-cards { grid-template-columns: 1fr; } }
    .contact-card { padding: var(--space-5); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); display: flex; gap: var(--space-4); align-items: flex-start; }
    .contact-card svg { width: 26px; height: 26px; color: var(--color-accent); flex: none; margin-top: 2px; }
    .contact-card strong { display: block; font-family: var(--font-display); margin-bottom: 4px; }
    .contact-card a, .contact-card span { color: var(--color-text-muted); }
    .contact-card a:hover { color: var(--color-accent); }

    .insight-card { display: flex; flex-direction: column; gap: var(--space-2); }
    .insight-card__meta { font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-caps); color: var(--color-text-light); }`;

// ---------------------------------------------------------------------------
// Head / schema / scripts
// ---------------------------------------------------------------------------
const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": BRAND,
  "alternateName": ["FCBS", "FirstCall National Accounts"],
  "url": SITE + "/",
  "logo": SITE + "/shared/img/logos/firstcall-building-solutions-white.svg",
  "description": "The national and strategic accounts team for the FirstCall network — one contract and one point of contact for HVAC, building controls, electrical, plumbing, and fire-life safety across multi-site and mission-critical portfolios.",
  "parentOrganization": { "@type": "Organization", "name": "FirstCall Group", "url": "https://firstcallgroup.com" },
  "address": { "@type": "PostalAddress", "streetAddress": HQ.street, "addressLocality": HQ.city, "addressRegion": HQ.state, "postalCode": HQ.zip, "addressCountry": "US" },
  "contactPoint": [{ "@type": "ContactPoint", "telephone": "+1-844-715-0220", "contactType": "sales", "email": EMAIL, "areaServed": "US", "availableLanguage": ["English"] }],
  "areaServed": { "@type": "Country", "name": "United States" },
  "sameAs": ["https://firstcallgroup.com", "https://firstcallmechanical.com", "https://www.linkedin.com/company/firstcall-mechanical/"],
};

function breadcrumbSchema(meta) {
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" }];
  if (meta.url.indexOf("/mission-critical/") === 0 && meta.url !== "/mission-critical/") {
    items.push({ "@type": "ListItem", position: 2, name: "Mission Critical", item: SITE + "/mission-critical/" });
  }
  items.push({ "@type": "ListItem", position: items.length + 1, name: meta.crumb.replace(/&amp;/g, "&"), item: SITE + meta.url });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function head(meta, opts) {
  opts = opts || {};
  const schemas = [ORG_SCHEMA];
  if (meta.crumb) schemas.push(breadcrumbSchema(meta));
  if (meta.url === "/") schemas.push({ "@context": "https://schema.org", "@type": "WebSite", name: BRAND, url: SITE + "/" });
  const ogImage = opts.ogImage || IMG.hall;
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
  <link rel="canonical" href="${SITE}${meta.url}" />
  <meta name="description" content="${meta.desc}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${BRAND}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.desc}" />
  <meta property="og:url" content="${SITE}${meta.url}" />
  <meta property="og:image" content="${ogImage}" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

  <style>
${CHROME_CSS}
${DROPDOWN_CSS}
${SITE_CSS}
  </style>
${schemas.map(function (s) { return '  <script type="application/ld+json">\n' + JSON.stringify(s, null, 2) + "\n  </script>"; }).join("\n")}
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>
`;
}

function scripts(opts) {
  opts = opts || {};
  let out = "";
  if (opts.counts) out += '  <script src="/assets/js/locations-data.js"></script>\n  <script src="/assets/js/fc-counts.js"></script>\n';
  if (opts.form) out += '  <script src="/assets/js/form-handler.js"></script>\n  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>\n';
  out += `  <script>
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
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && nav.classList.contains("is-open")) {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
            toggle.focus();
          }
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
</html>
`;
  return out;
}

// ---------------------------------------------------------------------------
// Content helpers
// ---------------------------------------------------------------------------
function feature(icon, title, body, items) {
  const list = items && items.length ? "<ul>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" : "";
  return `        <div class="feature"><div class="feature__icon">${icon}</div><h3>${title}</h3><p>${body}</p>${list}</div>`;
}
function featureLink(href, icon, title, body) {
  return `        <a class="feature" href="${href}"><div class="feature__icon">${icon}</div><h3>${title}</h3><p>${body}</p></a>`;
}
function check(title, body) { return `          <li>${I.check}<div><strong>${title}</strong><span>${body}</span></div></li>`; }
function step(title, body) { return `        <div class="step"><h3>${title}</h3><p>${body}</p></div>`; }
function crumb(trail) {
  const parts = [`<a href="/">Home</a>`].concat(trail.slice(0, -1).map(function (t) { return `<a href="${t.href}">${t.label}</a>`; }));
  parts.push(`<span>${trail[trail.length - 1].label}</span>`);
  return `        <nav class="crumb" aria-label="Breadcrumb">${parts.join(" › ")}</nav>`;
}
function pageHero(o) {
  const photo = o.photo ? ` page-hero--photo` : ` has-hex`;
  const bg = o.photo ? `      <img class="page-hero__bg" src="${o.photo}" alt="" aria-hidden="true" loading="eager" fetchpriority="high" />\n` : "";
  return `    <section class="page-hero${photo}">
${bg}      <div class="container">
${o.crumb || ""}
        <div class="page-hero__inner">
          <span class="eyebrow">${o.eyebrow}</span>
          <h1>${o.h1}</h1>
          <p>${o.lede}</p>
          <div class="page-hero__cta">
            ${o.ctas.map(function (c, i) { return `<a class="btn ${i === 0 ? "btn--primary" : "btn--outline-on-dark"} btn--lg" href="${c.href}">${c.label}</a>`; }).join("\n            ")}
          </div>
        </div>
      </div>
    </section>
`;
}
function ctaBand(heading, body, primary, secondary) {
  primary = primary || { label: "Get in Touch", href: "/contact" };
  secondary = secondary || { label: "Explore Mission Critical", href: "/mission-critical/" };
  return `  <section class="cta-band has-hex">
    <div class="container">
      <div class="cta-band__inner">
        <span class="eyebrow">Talk to FirstCall</span>
        <h2>${heading}</h2>
        <p>${body}</p>
        <div class="cta-band__cta">
          <a class="btn btn--primary btn--lg" href="${primary.href}">${primary.label}</a>
          <a class="btn btn--outline-on-dark btn--lg" href="${secondary.href}">${secondary.label}</a>
        </div>
      </div>
    </div>
  </section>
`;
}
function mcRelated(exceptSlug) {
  const cards = MC.filter(function (m) { return m.slug !== exceptSlug; }).map(function (m) {
    return `        <a class="related-card" href="/mission-critical/${m.slug}"><span class="eyebrow">Mission Critical</span><h3>${m.nav}</h3><p>${m.blurb}.</p></a>`;
  }).join("\n");
  return `  <section class="section">
    <div class="container">
      <div class="section-head section-head--center">
        <span class="eyebrow">Explore</span>
        <h2>More Mission Critical.</h2>
      </div>
      <div class="related-grid">
${cards}
      </div>
    </div>
  </section>
`;
}
function honeypot() {
  return `            <input type="hidden" name="_ts" value="" />
            <input type="text" name="_honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none" />`;
}
function turnstile() { return `            <div class="cf-turnstile" data-sitekey="0x4AAAAAADTRtvAzm-AenUDm" data-theme="auto" style="margin-top:1rem"></div>`; }
function formActions(label, help) {
  return `            <div class="form-actions">
              <div data-form-error role="alert" hidden class="form-error"></div>
              <button type="submit" class="btn btn--primary btn--lg">${label}</button>
              <span class="form-help">${help}</span>
            </div>`;
}
function field(id, name, label, opts) {
  opts = opts || {};
  const req = opts.required ? ' required' : "";
  const star = opts.required ? ' <span class="required">*</span>' : "";
  const full = opts.full ? " form-field--full" : "";
  const auto = opts.autocomplete ? ` autocomplete="${opts.autocomplete}"` : "";
  const ph = opts.placeholder ? ` placeholder="${opts.placeholder}"` : "";
  if (opts.type === "textarea") {
    return `              <div class="form-field${full}"><label class="form-label" for="${id}">${label}${star}</label><textarea class="form-textarea" id="${id}" name="${name}"${req}${ph}></textarea></div>`;
  }
  if (opts.type === "select") {
    const o = opts.options.map(function (v) { return `<option value="${v}">${v}</option>`; }).join("");
    return `              <div class="form-field${full}"><label class="form-label" for="${id}">${label}${star}</label><select class="form-select" id="${id}" name="${name}"${req}><option value="">Select…</option>${o}</select></div>`;
  }
  return `              <div class="form-field${full}"><label class="form-label" for="${id}">${label}${star}</label><input class="form-input" id="${id}" name="${name}" type="${opts.type || "text"}"${req}${auto}${ph} /></div>`;
}
function checkGroup(legend, prefix, options) {
  const boxes = options.map(function (o, i) {
    const id = prefix + "-" + i;
    return `                <label class="form-check" for="${id}"><input type="checkbox" id="${id}" name="${o.name}" value="Yes" /> ${o.label}</label>`;
  }).join("\n");
  return `              <fieldset class="form-field form-field--full"><legend class="form-legend">${legend}</legend><div class="form-checks">\n${boxes}\n              </div></fieldset>`;
}
function caseCard(c) {
  return `        <a class="related-card" href="/case-studies#${c.slug}"><span class="eyebrow">${c.sector}</span><h3>${c.client}</h3><p>${c.summary}</p><span class="related-card__meta">Delivered by ${c.branch}, a FirstCall company</span></a>`;
}
function caseStudiesSection(tag, heading) {
  const items = PUBLISHED_CASES.filter(function (c) { return !tag || c.tag === tag; });
  if (!items.length) return "";
  return `  <section class="section section--tinted">
    <div class="container">
      <div class="section-head section-head--center">
        <span class="eyebrow">Case studies</span>
        <h2>${heading}</h2>
      </div>
      <div class="related-grid">
${items.map(caseCard).join("\n")}
      </div>
    </div>
  </section>
`;
}

// ---------------------------------------------------------------------------
// PAGE BODIES
// ---------------------------------------------------------------------------
function homeBody() {
  const pillars = MC.map(function (m) {
    return `        <a class="pillar" href="/mission-critical/${m.slug}">
          <div class="pillar__icon">${m.icon}</div>
          <h3>${m.nav}</h3>
          <p>${HOME_PILLAR_COPY[m.slug]}</p>
          <span class="pillar__more">Explore ${I.arrow}</span>
        </a>`;
  }).join("\n");
  const posts = LATEST_POSTS.map(function (p) {
    return `        <a class="related-card insight-card" href="https://firstcallmechanical.com/insights/${p.slug}" rel="noopener"><span class="insight-card__meta">${INSIGHTS.CATEGORIES[p.category].label} · ${p.readTime}</span><h3>${p.title}</h3><p>${p.excerpt}</p></a>`;
  }).join("\n");
  return `  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__slides" aria-hidden="true">
        <div class="hero__slide" style="background-image:url('${IMG.racks}')"></div>
        <div class="hero__slide" style="background-image:url('${IMG.chiller1}')"></div>
        <div class="hero__slide" style="background-image:url('${IMG.hall}')"></div>
        <div class="hero__slide" style="background-image:url('${IMG.tower}')"></div>
      </div>
      <div class="container">
        <div class="hero__inner">
          <span class="hero__eyebrow">${BRAND} · National &amp; Strategic Accounts</span>
          <h1 class="hero__title" id="hero-title">One partner for every location. Every critical system.</h1>
          <p class="hero__lede">FirstCall Building Solutions gives multi-site and mission-critical operators a single point of contact for HVAC, building controls, electrical, plumbing, and fire-life safety — self-performed by FirstCall branches and extended nationwide through a vetted partner network.</p>
          <div class="hero__cta">
            <a class="btn btn--primary btn--lg" href="/contact">Start a conversation</a>
            <a class="btn btn--outline-on-dark btn--lg" href="/mission-critical/">Explore Mission Critical</a>
          </div>
        </div>
      </div>
    </section>

    <section class="stat-strip" aria-label="FirstCall network at a glance">
      <div class="container">
        <div class="stat-strip__grid">
          <div><div class="stat-strip__num"><span data-fc-count="branches">${BRANCH_COUNT}</span></div><div class="stat-strip__label">Self-performing FirstCall branches</div></div>
          <div><div class="stat-strip__num"><span data-fc-count="states">${STATE_COUNT}</span></div><div class="stat-strip__label">States with FirstCall crews on the ground</div></div>
          <div><div class="stat-strip__num">50</div><div class="stat-strip__label">States covered through our partner network</div></div>
          <div><div class="stat-strip__num">24/7</div><div class="stat-strip__label">Live dispatch and emergency response</div></div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="mc-heading">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Mission Critical</span>
          <h2 id="mc-heading">Built for facilities where downtime isn't an option.</h2>
          <p class="lead">Data halls, hospitals, and the energy systems behind them run continuously, under load, with redundancy that has to work the moment it's called on. FirstCall focuses its deepest mechanical, electrical, and controls capability on exactly these environments.</p>
        </div>
        <div class="pillars">
${pillars}
        </div>
      </div>
    </section>

    <section class="section section--tinted" aria-labelledby="services-heading">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Services</span>
          <h2 id="services-heading">Proactive and reactive maintenance for every asset in your footprint.</h2>
          <p class="lead">A complete suite of facility services — planned, emergency, and capital — delivered under one program so every location gets the same standard of work.</p>
        </div>
        <div class="feature-grid">
${featureLink("/services#hvac", I.thermo, "HVAC", "Service, planned maintenance, emergency response, CapEx management, temporary heating &amp; cooling, and indoor air quality.")}
${featureLink("/services#building-automation", I.gauge, "Building Automation &amp; Controls", "BAS/BMS, HVAC controls, lighting controls, and energy management systems that put every site on one dashboard.")}
${featureLink("/services#electrical-lighting", I.bolt, "Electrical &amp; Lighting", "Electrical maintenance, lighting maintenance, emergency service, and EV charger installation with rebate management.")}
${featureLink("/services#led-energy", I.bulb, "LED Retrofits &amp; Energy", "Turnkey LED retrofits and utility rebate capture that pay back fast across a portfolio.")}
${featureLink("/services#plumbing", I.droplet, "Plumbing", "Planned plumbing maintenance and reactive service for water heaters, fixtures, drains, backflow, and more.")}
${featureLink("/services#fire-life-safety", I.flame, "Fire &amp; Life Safety", "Inspection, testing, and maintenance programs that keep every location compliant and protected.")}
        </div>
        <div style="text-align:center; margin-top:var(--space-6)"><a class="btn btn--primary" href="/services">See all services</a></div>
      </div>
    </section>

    <section class="section" aria-labelledby="difference-heading">
      <div class="container">
        <div class="split split--photo">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">The FirstCall Difference</span>
              <h2 id="difference-heading">Self-performing branches. One accountable team.</h2>
            </div>
            <div class="prose">
              <p>Most national facility programs are a call center in front of a spreadsheet of subcontractors. FirstCall is different: our network is built from established regional mechanical companies that own the work in their markets, coordinated by a dedicated account team that knows your sites, your assets, and your standards.</p>
            </div>
            <ul class="checks" style="margin-top:var(--space-5);">
${check("A national network with local hands", "FirstCall crews in " + STATE_COUNT + " states, plus vetted partners for complete 50-state coverage.")}
${check("Single point of contact", "One account team for every request, every quote, every invoice — across every location.")}
${check("Enterprise asset lists", "Make, model, age, and serial for every unit you own — the foundation of a smart capital plan.")}
${check("Asset management portal", "Work orders, quotes, invoices, reports, and history in one place, available 24/7.")}
            </ul>
            <div style="margin-top:var(--space-6)"><a class="btn btn--primary" href="/the-firstcall-difference">How we add value</a></div>
          </div>
          <div class="split__photo"><img src="${IMG.chiller2}" alt="A FirstCall technician servicing a commercial chiller" loading="lazy" /></div>
        </div>
      </div>
    </section>

    <section class="section section--dark has-hex" aria-labelledby="industries-heading">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Industries</span>
          <h2 id="industries-heading">Programs for portfolios of every shape.</h2>
          <p class="lead" style="color:rgba(242,239,227,0.82);">From a 50-location bank to a hyperscale data campus, we build the program around how your organization actually operates.</p>
        </div>
        <div class="chips" style="justify-content:center;">
${INDUSTRIES.map(function (n) { return `          <a class="chip${n.mc ? " chip--accent" : ""}" href="/industries#${n.slug}">${n.name}</a>`; }).join("\n")}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="photos-heading">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">On the equipment</span>
          <h2 id="photos-heading">The people who scope the work do the work.</h2>
        </div>
        <div class="photo-strip">
          <img src="${IMG.chiller1}" alt="Commercial chiller serviced by FirstCall" loading="lazy" />
          <img src="${IMG.racksSm}" alt="Data center server racks" loading="lazy" />
          <img src="${IMG.tower}" alt="Rooftop cooling tower" loading="lazy" />
          <img src="${IMG.crew}" alt="A FirstCall service crew on site" loading="lazy" />
        </div>
      </div>
    </section>

    <section class="section section--soft" aria-labelledby="insights-heading">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Insights from the experts</span>
          <h2 id="insights-heading">Practical guidance for multi-site facility teams.</h2>
        </div>
        <div class="related-grid">
${posts}
        </div>
        <div style="text-align:center; margin-top:var(--space-6)"><a class="btn btn--outline" href="https://firstcallmechanical.com/insights" rel="noopener">Read more Insights</a></div>
      </div>
    </section>

${ctaBand("Let's talk about your locations.", "Tell us where your facilities are and what keeps you up at night. We'll bring the right FirstCall branches and specialists to the table.")}
  </main>
`;
}

const HOME_PILLAR_COPY = {
  "data-centers": "Critical cooling maintenance, liquid cooling retrofits and deployments, commissioning, and QA/QC for facilities where every minute of uptime is the product.",
  "energy-services-resiliency": "Audits, retro-commissioning, controls optimization, and backup-power readiness that lower operating cost and keep you running when the grid doesn't.",
  "healthcare": "Compliant, documented mechanical and electrical service for hospitals, health systems, clinics, and senior living — delivered in occupied clinical space.",
};

const INDUSTRIES = [
  { slug: "data-centers", name: "Data Centers", mc: true, icon: I.server, body: "Critical cooling, liquid cooling, commissioning, and 24/7 response for colocation, enterprise, and hyperscale facilities.", href: "/mission-critical/data-centers" },
  { slug: "healthcare", name: "Healthcare", mc: true, icon: I.hospital, body: "Hospitals, health systems, clinics, MOBs, and senior living — pressure relationships, compliance documentation, and infection-control-aware work.", href: "/mission-critical/healthcare" },
  { slug: "financial-institutions", name: "Financial Institutions", icon: I.shield, body: "Banks and credit unions with dozens to hundreds of branches: consistent comfort, security-aware access, and a single monthly invoice." },
  { slug: "retail", name: "Retail", icon: I.sign, body: "Rooftop units, lighting, signage, and plumbing across a store fleet — with the reporting your regional managers actually read." },
  { slug: "restaurants", name: "Restaurants", icon: I.flame, body: "Kitchen exhaust, make-up air, refrigeration-adjacent HVAC, and fast response so a down unit never closes a dining room." },
  { slug: "fitness-centers", name: "Fitness Centers", icon: I.pulse, body: "High-load HVAC, ventilation, and plumbing that keep members comfortable through peak hours." },
  { slug: "industrial", name: "Industrial &amp; Manufacturing", icon: I.factory, body: "Process cooling, plant HVAC, controls, and rotating equipment — planned around your production schedule." },
  { slug: "laboratories", name: "Multi-Site Laboratories", icon: I.doc, body: "Lab HVAC, exhaust, pressure control, and validation-ready documentation across a network of sites." },
  { slug: "storage", name: "Storage &amp; Logistics", icon: I.map, body: "Climate-controlled storage, distribution centers, and cold chain — reliability at scale, with minimal on-site staff." },
  { slug: "childcare", name: "Childcare &amp; Education", icon: I.user, body: "Indoor air quality, comfort, and life safety for the buildings where families expect the highest standard." },
  { slug: "multi-state", name: "Multi-State Businesses", icon: I.handshake, body: "Any organization with 50 to 500+ locations that wants one partner, one program, and one point of contact." },
];

function mcHubBody() {
  const pillars = MC.map(function (m) {
    return `        <a class="pillar" href="/mission-critical/${m.slug}">
          <div class="pillar__icon">${m.icon}</div>
          <h3>${m.nav}</h3>
          <p>${HOME_PILLAR_COPY[m.slug]}</p>
          <span class="pillar__more">Explore ${I.arrow}</span>
        </a>`;
  }).join("\n");
  return `  <main id="main">
${pageHero({
    photo: IMG.hall,
    crumb: crumb([{ label: "Mission Critical" }]),
    eyebrow: BRAND + " · Mission Critical",
    h1: "Mechanical, electrical, and controls for facilities that can't go down.",
    lede: "When an hour of downtime is measured in lost compute, a diverted patient, or a plant that won't restart, the mechanical and electrical systems behind the building are the business. FirstCall brings self-performing critical-facility crews, a national network, and a single accountable team to keep them running.",
    ctas: [{ label: "Talk to our team", href: "/contact" }, { label: "Data center inquiry", href: "/mission-critical/data-centers#data-center-form" }],
  })}
    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Where reliability is the whole job</span>
          <h2>Most buildings tolerate a hiccup. Critical facilities don't.</h2>
          <p class="lead">Data halls, hospitals, and energy assets run continuously, under load, with redundancy that has to actually work when it's called on. FirstCall Building Solutions coordinates the FirstCall network's deepest capability for exactly these environments.</p>
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
              <p>FirstCall is a multi-region platform built from established regional mechanical companies — each one self-performing, each one accountable for the work in its own market. For a mission-critical portfolio, that means the crew that scopes the job is the crew that performs it, and your account team coordinates the same standard of work at every site.</p>
            </div>
          </div>
          <ul class="checks">
${check("Self-performing, coast to coast", "FirstCall crews in " + STATE_COUNT + " states, extended nationwide through vetted partners.")}
${check("Concurrent maintainability", "Work is planned so redundant capacity stays redundant while equipment is serviced.")}
${check("MOP discipline", "Methods of procedure are scripted, reviewed, and logged before critical work begins.")}
${check("24/7 emergency response", "Critical systems fail on their own schedule. We answer on yours.")}
          </ul>
        </div>
      </div>
    </section>

${caseStudiesSection(null, "Mission-critical work, delivered.")}
${ctaBand("Tell us what keeps your facility up at night.", "Whether it's a cooling plant, an operating suite, a backup-power gap, or a liquid cooling retrofit, we'll route you to the right FirstCall branch and the right specialists.", { label: "Get in Touch", href: "/contact" }, { label: "Data center inquiry", href: "/mission-critical/data-centers#data-center-form" })}
  </main>
`;
}

function dataCentersBody() {
  return `  <main id="main">
${pageHero({
    photo: IMG.racks,
    crumb: crumb([{ label: "Mission Critical", href: "/mission-critical/" }, { label: "Data Centers" }]),
    eyebrow: "Mission Critical · Data Centers",
    h1: "Keep the cooling on. Keep the racks up.",
    lede: "From CRAH maintenance to liquid cooling retrofits, commissioning, and QA/QC, FirstCall services the mechanical and electrical systems that hold the room — at colocation, enterprise, and hyperscale facilities across the country.",
    ctas: [{ label: "Start a data center inquiry", href: "#data-center-form" }, { label: "Back to Mission Critical", href: "/mission-critical/" }],
  })}
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
              <p>That redundancy only protects you if it's maintained, tested, and ready to carry load the moment a unit drops offline. Keeping standby capacity genuinely standby — and proving it — is the discipline we bring.</p>
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

    <section class="section section--tinted" id="capabilities">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Capabilities</span>
          <h2>The mechanical systems that hold the room.</h2>
        </div>
        <div class="feature-grid">
${feature(I.server, "CRAC / CRAH &amp; precision cooling", "Service, repair, and planned maintenance for computer-room cooling units and in-row systems.")}
${feature(I.droplet, "Chilled-water plants &amp; piping", "Chillers, pumps, cooling towers, dry coolers, and the distribution that ties them together.")}
${feature(I.thermo, "Liquid cooling retrofits &amp; deployments", "CDUs, secondary loops, rear-door heat exchangers, and direct-to-chip integration with your existing plant.")}
${feature(I.doc, "Commissioning &amp; QA/QC", "Level 1&ndash;5 commissioning support, integrated systems testing, and independent QA/QC on mechanical installs.")}
${feature(I.gauge, "Controls &amp; monitoring integration", "Computer-room controls tied into your BMS, DCIM, and monitoring stack.")}
${feature(I.wind, "Airflow &amp; containment", "Humidification, static-pressure, and hot/cold-aisle containment management.")}
${feature(I.shield, "Redundancy &amp; failover testing", "Validate that N+1 / 2N capacity carries load when it's called on.")}
${feature(I.bolt, "Electrical &amp; backup power support", "Electrical maintenance and generator-readiness coordination for the systems feeding the cooling.")}
${feature(I.clock, "24/7 emergency response", "Critical spares and on-call crews for when a unit drops at 3 a.m.")}
        </div>
      </div>
    </section>

    <section class="section" id="liquid-cooling">
      <div class="container">
        <div class="split split--photo">
          <div class="split__photo"><img src="${IMG.hallSm}" alt="Rows of server racks in a data hall" loading="lazy" /></div>
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Liquid cooling</span>
              <h2>Rack densities are climbing. Your cooling has to keep up.</h2>
            </div>
            <div class="prose">
              <p>AI and high-performance compute are pushing rack loads well past what air alone can carry. Liquid cooling — whether a retrofit into an existing hall or part of a new deployment — is a mechanical project first: piping, pumps, heat exchangers, controls, and a plant that has to absorb the new load without giving up redundancy.</p>
              <p>FirstCall scopes the retrofit against your existing chilled-water capacity, installs and commissions the secondary loop and CDUs, and integrates the whole system with your monitoring so operations sees it as one plant, not two.</p>
            </div>
            <ul class="checks" style="margin-top:var(--space-5);">
${check("Retrofit assessment", "Capacity, approach temperatures, and redundancy impact before anything is cut in.")}
${check("Installation &amp; integration", "CDUs, secondary loops, manifolds, and rear-door or direct-to-chip hardware tied to the plant.")}
${check("Commissioning &amp; QA/QC", "Pressure testing, flushing, flow balancing, and functional testing — documented.")}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tinted" id="commissioning">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Commissioning &amp; QA/QC</span>
          <h2>Prove it works before it has to.</h2>
          <p class="lead">Whether we installed the system or someone else did, commissioning is how a data center goes live with confidence. FirstCall supports owners, engineers, and commissioning agents through every level.</p>
        </div>
        <div class="steps">
${step("Design &amp; submittal review", "Constructability and maintainability review of mechanical scopes before equipment ships.")}
${step("Factory &amp; site acceptance", "Witness testing, delivery inspection, and installation verification against the design.")}
${step("Functional performance testing", "Start-up, point-to-point, sequence-of-operations, and failure-mode testing on every system.")}
${step("Integrated systems testing", "Full-load, pull-the-plug validation across mechanical, electrical, and controls — then turnover documentation.")}
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
    <!-- PHASE 2 — FirstCall uptime KPIs. Uncomment and fill once the numbers are published.
    <section class="section section--dark has-hex" id="uptime-kpis" aria-labelledby="kpi-heading">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Our uptime record</span>
          <h2 id="kpi-heading">Measured, not promised.</h2>
        </div>
        <div class="stat-band">
          <div><div class="stat-band__num">99.99%</div><div class="stat-band__label">Cooling availability across maintained data halls (trailing 12 months)</div></div>
          <div><div class="stat-band__num">0</div><div class="stat-band__label">Maintenance-induced outages</div></div>
          <div><div class="stat-band__num">&lt; 2 hr</div><div class="stat-band__label">Median emergency response time</div></div>
        </div>
      </div>
    </section>
    -->

${caseStudiesSection("data-centers", "Data center work, delivered.")}
    <section class="section" id="data-center-form">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Data center inquiry</span>
              <h2>Tell us about the facility.</h2>
            </div>
            <div class="prose">
              <p>Liquid cooling retrofit or new deployment, commissioning support, QA/QC, or a critical cooling maintenance program — give us the basics and a FirstCall critical-facility lead will follow up within one business day.</p>
              <p>Prefer to talk? Call <a href="${PHONE_HREF}">${PHONE_DISPLAY}</a> or email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
            </div>
          </div>
          <form class="contact-form" action="/api/contact" method="POST" data-form-handler novalidate>
            <input type="hidden" name="_form" value="fcbs-data-center" />
${honeypot()}
            <div class="form-grid">
${field("dc-first", "first", "First name", { required: true, autocomplete: "given-name" })}
${field("dc-last", "last", "Last name", { required: true, autocomplete: "family-name" })}
${field("dc-email", "email", "Work email", { required: true, type: "email", autocomplete: "email", full: true })}
${field("dc-phone", "phone", "Phone", { type: "tel", autocomplete: "tel" })}
${field("dc-company", "company", "Company", { required: true, autocomplete: "organization" })}
${field("dc-facility", "facility_location", "Facility location(s)", { full: true, placeholder: "City, state — or multiple sites" })}
${field("dc-type", "facility_type", "Facility type", { type: "select", options: ["Colocation", "Enterprise", "Hyperscale", "Edge / modular", "Other"] })}
${field("dc-capacity", "critical_load", "Critical IT load (approx.)", { placeholder: "e.g. 2 MW, 400 kW" })}
${checkGroup("I'm interested in", "dc-int", [
  { name: "interest_liquid_cooling_retrofit", label: "Liquid cooling retrofit" },
  { name: "interest_liquid_cooling_deployment", label: "Liquid cooling — new deployment" },
  { name: "interest_commissioning", label: "Commissioning support" },
  { name: "interest_qa_qc", label: "QA/QC inspections" },
  { name: "interest_critical_cooling_maintenance", label: "Critical cooling maintenance program" },
  { name: "interest_emergency_response", label: "Emergency response coverage" },
  { name: "interest_controls_integration", label: "Controls &amp; monitoring integration" },
  { name: "interest_other", label: "Something else" },
])}
${field("dc-timeline", "timeline", "Timeline", { type: "select", options: ["Immediate / emergency", "Within 3 months", "3–12 months", "Planning / budgeting", "Not sure yet"] })}
${field("dc-message", "message", "Project details", { type: "textarea", full: true, required: true, placeholder: "Existing cooling plant, rack densities, redundancy model, constraints — whatever helps us come prepared." })}
            </div>
${turnstile()}
${formActions("Send inquiry", "A FirstCall critical-facility lead will respond within one business day.")}
          </form>
        </div>
      </div>
    </section>

${mcRelated("data-centers")}
${ctaBand("Your uptime is a mechanical problem too.", "Talk to a FirstCall team that understands concurrent maintainability, critical cooling, and what it takes to service live load without dropping the room.", { label: "Start a data center inquiry", href: "#data-center-form" }, { label: "See all services", href: "/services" })}
  </main>
`;
}

function energyBody() {
  return `  <main id="main">
${pageHero({
    crumb: crumb([{ label: "Mission Critical", href: "/mission-critical/" }, { label: "Energy Services &amp; Resiliency" }]),
    eyebrow: "Mission Critical · Energy Services &amp; Resiliency",
    h1: "Spend less to run the building. Stay running when it counts.",
    lede: "Energy services cut what your portfolio pays for every kilowatt-hour. Resiliency makes sure the facility keeps operating through a heat wave, a storm, or a grid event. FirstCall delivers both — engineered, self-performed, and measured across every site.",
    ctas: [{ label: "Start a portfolio assessment", href: "/contact" }, { label: "Back to Mission Critical", href: "/mission-critical/" }],
  })}
    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Energy services</span>
              <h2>Waste hides in the mechanical plant. We know where to look.</h2>
            </div>
            <div class="prose">
              <p>Aging chillers, drifting controls, simultaneous heating and cooling, lighting that never turns off — across dozens or hundreds of sites, small inefficiencies become a line item nobody can explain. We benchmark how each building actually uses energy, prioritize the measures with the fastest payback, and self-perform the work.</p>
              <p>For larger programs, <a href="https://firstcallmechanical.com/critical-infrastructure/performance-contracting" rel="noopener">performance contracting</a> lets the savings fund the upgrade, with results measured against a documented baseline.</p>
            </div>
          </div>
          <ul class="checks">
${check("Investment-grade audits", "Site-by-site benchmarking that turns utility bills into a prioritized measure list.")}
${check("Retro-commissioning", "Tune air and water systems back to design intent — often the fastest payback in the building.")}
${check("Controls &amp; EMS optimization", "Schedules, setpoints, and sequences managed centrally across the portfolio.")}
${check("Measured &amp; verified", "Savings tracked against a baseline so results are documented, not promised.")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Measures we deliver</span>
          <h2>Where the savings come from.</h2>
        </div>
        <div class="feature-grid">
${feature(I.cog, "Chiller, boiler &amp; RTU modernization", "Replace and right-size equipment that's past its efficient life — planned as capital, not as an emergency.")}
${feature(I.gauge, "Building automation &amp; controls", "BAS/BMS upgrades and sequences that stop equipment from fighting itself.")}
${feature(I.wind, "HVAC optimization &amp; retrocommissioning", "Economizers, VFDs, static-pressure resets, and airflow tuned to real occupancy.")}
${feature(I.bulb, "LED retrofits &amp; lighting controls", "Turnkey LED conversions with occupancy and daylight controls — and the rebate paperwork handled.")}
${feature(I.plug, "Utility rebates &amp; incentives", "We identify, apply for, and document utility and grant programs so the incentive actually lands.")}
${feature(I.trending, "Metering, monitoring &amp; analytics", "Portfolio-level visibility that turns one-time savings into a permanent baseline.")}
        </div>
      </div>
    </section>

    <section class="section section--dark has-hex" id="resiliency">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Resiliency</span>
          <h2>Plan for the day the grid, the weather, or the equipment lets you down.</h2>
          <p class="lead" style="color:rgba(242,239,227,0.82);">Resiliency is the difference between an incident and an outage. We help operators find single points of failure, harden them, and rehearse the response before it's needed.</p>
        </div>
        <div class="feature-grid">
${feature(I.shield, "Redundancy &amp; single-point-of-failure review", "Which unit, breaker, pump, or sequence takes the site down if it fails — and what to do about it.")}
${feature(I.battery, "Backup power readiness", "Generator, ATS, and UPS-adjacent mechanical coordination so cooling comes back when power does.")}
${feature(I.thermo, "Temporary heating &amp; cooling", "Turnkey rental chillers, air handlers, and heat when a unit is down or lead times are long.")}
${feature(I.doc, "Emergency response plans", "Site-specific playbooks: who to call, what to isolate, which spares are staged.")}
${feature(I.clock, "24/7 dispatch &amp; critical spares", "Staffed dispatch and on-call crews across the network, with spares for the parts that matter.")}
${feature(I.map, "Seasonal &amp; storm readiness", "Pre-season startup, freeze protection, and post-event recovery across every site in the path.")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">How it works</span>
          <h2>From audit to verified results.</h2>
        </div>
        <div class="steps">
${step("Portfolio benchmark", "Utility data and site walks establish where each building stands and where the outliers are.")}
${step("Engineered scope", "A prioritized package of efficiency and resiliency measures, each with projected savings and risk reduction.")}
${step("Self-performed delivery", "FirstCall branches install, commission, and document the work — one accountable team.")}
${step("Ongoing optimization", "Planned maintenance and controls tuning keep the savings and the readiness in place year over year.")}
        </div>
      </div>
    </section>

${mcRelated("energy-services-resiliency")}
${ctaBand("See what your portfolio could save — and where it's exposed.", "Send us a utility bill and a site list. We'll scope an assessment with no obligation.", { label: "Get in Touch", href: "/contact" }, { label: "See all services", href: "/services" })}
  </main>
`;
}

function healthcareBody() {
  return `  <main id="main">
${pageHero({
    crumb: crumb([{ label: "Mission Critical", href: "/mission-critical/" }, { label: "Healthcare" }]),
    eyebrow: "Mission Critical · Healthcare",
    h1: "Critical environments, held to a higher standard.",
    lede: "In a hospital, a degree, a pressure relationship, or an air change isn't a comfort setting — it's patient safety and regulatory compliance. FirstCall services the mechanical, electrical, and controls systems behind health systems, clinics, and senior living with the precision and documentation they demand.",
    ctas: [{ label: "Talk to our healthcare team", href: "/contact" }, { label: "Back to Mission Critical", href: "/mission-critical/" }],
  })}
    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Why it's different</span>
              <h2>Where HVAC becomes life safety.</h2>
            </div>
            <div class="prose">
              <p>In a patient room, an operating suite, an isolation room, or a compounding pharmacy, the mechanical system is part of the clinical process. Pressure cascades keep contaminants where they belong. Temperature and humidity protect patients and product. Air changes and filtration are validated and documented.</p>
              <p>We maintain these systems knowing that "close enough" isn't a category that exists here — and that the work has to happen with the facility occupied and operating.</p>
            </div>
          </div>
          <ul class="checks">
${check("Pressure relationships protected", "Positive/negative cascades maintained and verified, not disturbed.")}
${check("Documentation built in", "Work recorded to support Joint Commission, CMS, and state survey readiness.")}
${check("Infection-control aware", "ICRA-aligned work practices: dust, disruption, and access managed for occupied clinical space.")}
${check("Planned + emergency coverage", "Disciplined maintenance plus 24/7 response when minutes matter.")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Capabilities</span>
          <h2>The systems behind the standard of care.</h2>
        </div>
        <div class="feature-grid">
${feature(I.hospital, "Operating &amp; procedure rooms", "Temperature, humidity, air-change, and pressurization maintained to ASHRAE 170 and your facility's design.")}
${feature(I.wind, "Isolation rooms &amp; pressure monitoring", "AII/PE room verification, exhaust, and monitoring tied into the BAS.")}
${feature(I.thermo, "Central plant &amp; air handling", "Chillers, boilers, AHUs, and steam serviced with redundancy and concurrent maintainability in mind.")}
${feature(I.gauge, "Building automation &amp; controls", "Sequences, alarms, and trending that make compliance visible and reportable.")}
${feature(I.droplet, "Plumbing &amp; domestic water", "Water heaters, mixing valves, backflow, and legionella-aware maintenance.")}
${feature(I.bolt, "Electrical &amp; lighting", "Electrical maintenance and lighting programs across MOBs, clinics, and campus buildings.")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="split">
          <div class="section-head" style="margin-bottom:0;">
            <span class="eyebrow">Multi-site health systems</span>
            <h2>One program for the hospital, the MOBs, and every clinic in between.</h2>
            <div class="prose" style="margin-top:var(--space-4);">
              <p>Health systems don't stop at the main campus. Ambulatory sites, urgent care, medical office buildings, labs, and senior living communities all need the same standard — usually with far fewer on-site facilities staff. FirstCall Building Solutions delivers one planned maintenance program, one emergency number, and one portal across the whole footprint.</p>
            </div>
          </div>
          <ul class="checks">
${check("Enterprise asset list", "Every AHU, RTU, water heater, and controller inventoried with age, condition, and warranty.")}
${check("Capital planning", "Replacement forecasts so the aging equipment gets budgeted before it fails.")}
${check("Consistent reporting", "Compliance documentation and work history you can hand to a surveyor.")}
${check("Local crews, national coverage", "Self-performing FirstCall branches plus vetted partners wherever your sites are.")}
          </ul>
        </div>
      </div>
    </section>

${caseStudiesSection("healthcare", "Healthcare work, delivered.")}
${mcRelated("healthcare")}
${ctaBand("Let's talk about your clinical environments.", "From a single operating suite to a multi-state health system, we'll bring the FirstCall branches and specialists who know the standard.", { label: "Get in Touch", href: "/contact" }, { label: "See all services", href: "/services" })}
  </main>
`;
}

function aboutBody() {
  return `  <main id="main">
${pageHero({
    photo: IMG.chiller1,
    crumb: crumb([{ label: "About Us" }]),
    eyebrow: "About " + BRAND,
    h1: "The front door to the entire FirstCall network.",
    lede: "FirstCall Building Solutions is the national and strategic accounts team for FirstCall Group. When a customer has locations across regions — or a facility that can never go down — we're the single team, single contract, and single point of contact that brings every FirstCall service and branch to the table.",
    ctas: [{ label: "Get in Touch", href: "/contact" }, { label: "Meet the leadership team", href: "https://firstcallgroup.com/team" }],
  })}
    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Who we are</span>
              <h2>Built from the best regional service companies in the country.</h2>
            </div>
            <div class="prose">
              <p>FirstCall Group was founded in 2022 to bring together established commercial and industrial mechanical service companies under one platform — companies that keep their local name, their leadership, and their crews, and gain the scale, talent, and capital of a national organization.</p>
              <p>Today that network spans <span data-fc-count="branches">${BRANCH_COUNT}</span> branches in <span data-fc-count="states">${STATE_COUNT}</span> states. It includes CLS Facility Services, whose five decades of multi-site facilities management for organizations with 50 to 500 locations is the foundation of the national accounts program you'll find here.</p>
              <p>FirstCall Building Solutions exists so a customer never has to figure out which FirstCall company to call. You call us. We bring the network.</p>
            </div>
          </div>
          <ul class="checks">
${check("One contract, one invoice", "A single agreement and consolidated billing across every location and every trade.")}
${check("A dedicated account team", "Named people who know your sites and your standards — not a call center.")}
${check("Self-performing branches", "FirstCall crews do the work in their own markets, coordinated to one standard.")}
${check("A vetted partner network", "Long-tenured partners extend coverage to all 50 states.")}
          </ul>
        </div>
      </div>
    </section>

    <section class="stat-strip" aria-label="FirstCall network at a glance">
      <div class="container">
        <div class="stat-strip__grid">
          <div><div class="stat-strip__num"><span data-fc-count="branches">${BRANCH_COUNT}</span></div><div class="stat-strip__label">FirstCall branches</div></div>
          <div><div class="stat-strip__num"><span data-fc-count="states">${STATE_COUNT}</span></div><div class="stat-strip__label">States with FirstCall crews</div></div>
          <div><div class="stat-strip__num">50</div><div class="stat-strip__label">States covered through our partner network</div></div>
          <div><div class="stat-strip__num">2022</div><div class="stat-strip__label">FirstCall Group founded in Austin, Texas</div></div>
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">How we work</span>
          <h2>A relationship, not a ticket queue.</h2>
        </div>
        <div class="steps">
${step("Understand the portfolio", "We inventory your sites and assets, learn how your organization operates, and agree on the standard.")}
${step("Build the program", "Planned maintenance, emergency coverage, and capital planning designed for your footprint — not a template.")}
${step("Deploy the network", "FirstCall branches and vetted partners are assigned site by site, with one account team coordinating.")}
${step("Report and improve", "Portal visibility, quarterly reviews, and asset data that make next year's budget smarter than this year's.")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Leadership &amp; careers</span>
          <h2>The people behind the platform.</h2>
          <p class="lead">FirstCall Building Solutions is led by the FirstCall Group leadership team and staffed by account managers, engineers, and coordinators drawn from across the network.</p>
        </div>
        <div class="related-grid">
        <a class="related-card" href="https://firstcallgroup.com/team" rel="noopener"><span class="eyebrow">FirstCall Group</span><h3>Leadership Team</h3><p>Meet the executives and regional leaders guiding the FirstCall network.</p></a>
        <a class="related-card" href="https://firstcallgroup.com/careers" rel="noopener"><span class="eyebrow">Join us</span><h3>Careers</h3><p>Technicians, account managers, engineers, and dispatchers — see open roles across FirstCall.</p></a>
        <a class="related-card" href="/become-a-partner"><span class="eyebrow">Partner network</span><h3>Become a Partner</h3><p>Commercial service contractors: apply to support FirstCall national accounts in your market.</p></a>
        </div>
      </div>
    </section>

${ctaBand("Let's start with your site list.", "Tell us where your facilities are and what you need from a partner. We'll show you how the FirstCall network fits.")}
  </main>
`;
}

function differenceBody() {
  return `  <main id="main">
${pageHero({
    crumb: crumb([{ label: "The FirstCall Difference" }]),
    eyebrow: "The FirstCall Difference",
    h1: "More than maintenance. Full visibility and control over every asset.",
    lede: "National coverage is table stakes. What sets FirstCall apart is who does the work, how much you can see, and how easy it is to reach a person who knows your sites.",
    ctas: [{ label: "Get in Touch", href: "/contact" }, { label: "See all services", href: "/services" }],
  })}
    <section class="section" id="national-network">
      <div class="container">
        <div class="split split--photo">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">National Network</span>
              <h2>Self-performing branches first. Vetted partners everywhere else.</h2>
            </div>
            <div class="prose">
              <p>The FirstCall network is built from established regional mechanical companies — <span data-fc-count="branches">${BRANCH_COUNT}</span> branches in <span data-fc-count="states">${STATE_COUNT}</span> states, each one self-performing and accountable for the work in its own market. Where we don't yet have a branch, we work with proven commercial service partners we've vetted for licensing, insurance, safety record, and response time.</p>
              <p>Either way, your account team coordinates the same scope, the same standard, and the same reporting at every site — and you have complete coverage across all 50 states.</p>
            </div>
            <div style="margin-top:var(--space-5); display:flex; gap:var(--space-3); flex-wrap:wrap;">
              <a class="btn btn--primary" href="https://firstcallmechanical.com/locations" rel="noopener">See all network branches</a>
              <a class="btn btn--outline" href="/become-a-partner">Become a partner</a>
            </div>
          </div>
          <div class="split__photo"><img src="${IMG.crew}" alt="A FirstCall service crew on site" loading="lazy" /></div>
        </div>
      </div>
    </section>

    <section class="section section--tinted" id="how-we-add-value">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">How We Add Value</span>
          <h2>Every aspect documented, assessed, and made visible for decision-making.</h2>
          <p class="lead">A good maintenance partner fixes what breaks. A great one makes sure you always know what you own, what condition it's in, and what it will cost next year.</p>
        </div>
        <div class="feature-grid">
${feature(I.list, "Enterprise asset lists", "Complete inventories of every unit at every site — make, model, age, serial, condition, and warranty status.")}
${feature(I.trending, "CapEx planning", "Replacement forecasts built from real asset data, so aging equipment is budgeted before it becomes an emergency.")}
${feature(I.doc, "Transparent reporting", "Work order history, spend by site and by trade, and PM completion — customized to how your team reviews it.")}
${feature(I.shield, "Warranty management", "Key HVAC warranty items tracked so covered repairs don't get paid for twice.")}
${feature(I.cog, "Planned maintenance that prevents the call", "Disciplined, climate-aware programs that catch failures before they become outages.")}
${feature(I.user, "Human contact", "No robots or call services. Familiar faces who know your account and answer the phone.")}
        </div>
      </div>
    </section>

    <section class="section" id="asset-management-portal">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Asset Management Portal</span>
              <h2>A complete, real-time view of every asset at every location.</h2>
            </div>
            <div class="prose">
              <p>The portal is where your program lives: work orders, quotes, invoices, asset records, and reports for every site in one place, available 24/7 to everyone on your team who needs it.</p>
            </div>
          </div>
          <ul class="checks">
${check("Work orders &amp; status", "Place requests, watch progress, and see every open work order across all services and locations.")}
${check("Quotes &amp; approvals online", "Review and approve estimates from anywhere — with the asset history attached.")}
${check("Asset records", "Full equipment lists and site-by-site work histories across HVAC, electrical, plumbing, and more.")}
${check("Custom reporting", "Analyze spend, PM completion, and asset condition to prioritize sites with unique needs.")}
${check("Documents &amp; invoices", "Compliance documentation, service reports, and consolidated invoices — searchable.")}
          </ul>
        </div>
      </div>
    </section>

${ctaBand("See the FirstCall difference on your own portfolio.", "Bring us a site list and a recent utility bill. We'll show you what full visibility looks like.")}
  </main>
`;
}

function servicesBody() {
  function group(id, icon, title, intro, items) {
    return `      <section class="service-group" id="${id}" aria-labelledby="${id}-heading">
        <div class="service-group__head">
          <h2 id="${id}-heading">${icon}${title}</h2>
          <p>${intro}</p>
        </div>
        <ul class="service-list">
${items.map(function (it) { return `          <li><strong>${it[0]}</strong><span>${it[1]}</span></li>`; }).join("\n")}
        </ul>
      </section>`;
  }
  return `  <main id="main">
${pageHero({
    crumb: crumb([{ label: "Services" }]),
    eyebrow: "Services",
    h1: "Proactive and reactive maintenance for every location.",
    lede: "FirstCall Building Solutions provides a comprehensive suite of facility services — HVAC, building automation, electrical and lighting, LED and energy, plumbing, fire and life safety, and signage — tailored to multi-site and mission-critical organizations and delivered through the FirstCall network.",
    ctas: [{ label: "Build my program", href: "/contact" }, { label: "Mission Critical services", href: "/mission-critical/" }],
  })}
    <div class="section">
      <div class="container">
${group("hvac", I.thermo, "HVAC", "The core of every facility program. FirstCall branches self-perform HVAC service on rooftop units, split systems, chillers, boilers, VRF, and custom air handlers across every market we serve.", [
  ["HVAC Solutions", "Repair, replacement, and optimization for commercial and industrial equipment of every make."],
  ["HVAC Planned Maintenance", "Climate-aware PM programs with consistent scope, reporting, and asset-level tracking at every site."],
  ["Emergency Services", "24/7 staffed dispatch and on-call technicians across the network."],
  ["HVAC CapEx Management", "Replacement forecasting and program-managed capital projects built from your asset data."],
  ["Temporary Heating &amp; Cooling", "Turnkey rental chillers, air handlers, and heat when a unit is down or lead times run long."],
  ["Indoor Air Quality &amp; Air Scrubbers", "Filtration upgrades, air scrubber installation, and ventilation improvements."],
])}
${group("building-automation", I.gauge, "Building Automation &amp; Controls", "Put every site on one dashboard. Design, installation, integration, and service of the controls that decide how your buildings actually run.", [
  ["Building Automation Systems", "BAS design-build, retrofit, and service across major platforms."],
  ["HVAC Controls", "Sequences, setpoints, and scheduling that stop equipment from fighting itself."],
  ["Lighting Controls", "Occupancy, daylight, and schedule-based control that cuts lighting energy portfolio-wide."],
  ["Building Management Systems", "Integration of HVAC, lighting, metering, and alarms into one view."],
  ["Energy Management Systems", "Cloud-based EMS that manages setpoints and schedules centrally and flags anomalies before they become bills."],
])}
${group("electrical-lighting", I.bolt, "Electrical &amp; Lighting", "Licensed electrical service and lighting maintenance for the sites where a dark parking lot or a tripped panel is a safety and revenue problem.", [
  ["Electrical Maintenance", "Panels, switchgear, distribution, and emergency power testing on a planned schedule."],
  ["Lighting Maintenance", "Interior, exterior, and parking-lot lighting kept at spec across the fleet."],
  ["Emergency Services", "24/7 electrical response through the FirstCall network."],
  ["EV Charger Installation &amp; Rebates", "Site assessment, installation, and utility rebate capture for fleet and customer charging."],
])}
${group("led-energy", I.bulb, "LED Retrofits &amp; Energy", "Fast-payback efficiency measures delivered turnkey — with the rebate paperwork handled so the incentive actually lands.", [
  ["Turnkey LED Retrofit", "Audit, design, fixture supply, installation, and recycling across every site."],
  ["Utility Rebates &amp; Incentives", "We identify, apply for, and document utility and grant programs on your behalf."],
  ["Energy Audits &amp; Retro-Commissioning", "Benchmark each building and tune systems back to design intent. <a href=\"/mission-critical/energy-services-resiliency\">Learn more</a>."],
])}
${group("plumbing", I.droplet, "Plumbing", "Plumbing is the asset most facilities ignore until it fails. We bring the same planned, documented approach to water that we bring to air.", [
  ["Plumbing Solutions", "Repair and replacement for water heaters, fixtures, drains, pumps, and piping."],
  ["Plumbing Planned Maintenance", "Backflow testing, water heater service, drain maintenance, and fixture audits on a schedule."],
  ["Emergency Services", "Leaks, backups, and no-hot-water calls handled 24/7."],
])}
${group("fire-life-safety", I.flame, "Fire &amp; Life Safety", "Inspection, testing, and maintenance programs that keep every location compliant and protected — with documentation ready for the AHJ.", [
  ["Fire &amp; Life Safety Planned Maintenance", "Sprinkler, alarm, extinguisher, and emergency lighting inspections on the required cadence."],
  ["Emergency Services", "Impairment response and repair coordinated through your account team."],
])}
${group("facility-infrastructure", I.sign, "Signage &amp; Facility Infrastructure", "The rest of what keeps a location open and on-brand.", [
  ["Sign Maintenance", "Illuminated signage repair, lamp and LED conversions, and inspections across the fleet."],
  ["Project Support", "Design-build delivery for expansions, remodels, and capital projects — and the service that follows."],
])}
      </div>
    </div>

${ctaBand("Every service. Every location. One program.", "Tell us which trades and which sites, and we'll design a program around how your organization actually operates.")}
  </main>
`;
}

function industriesBody() {
  const cards = INDUSTRIES.map(function (n) {
    const inner = `<div class="feature__icon">${n.icon}</div><h3>${n.name}</h3><p>${n.body}</p>`;
    return n.href
      ? `        <a class="feature" id="${n.slug}" href="${n.href}">${inner}<p style="margin-top:var(--space-3);"><strong style="color:var(--color-accent);">Explore Mission Critical ›</strong></p></a>`
      : `        <div class="feature" id="${n.slug}">${inner}</div>`;
  }).join("\n");
  return `  <main id="main">
${pageHero({
    crumb: crumb([{ label: "Industries" }]),
    eyebrow: "Industries",
    h1: "Customized facility programs for the way your industry operates.",
    lede: "FirstCall Building Solutions supports organizations with dozens to hundreds of corporate-run facilities across multiple states — helping them deliver a consistent experience, keep assets at peak performance, control cost, maintain compliance, and see the whole program in one place.",
    ctas: [{ label: "Talk about my portfolio", href: "/contact" }, { label: "See all services", href: "/services" }],
  })}
    <section class="section">
      <div class="container">
        <div class="feature-grid">
${cards}
        </div>
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="split">
          <div class="section-head" style="margin-bottom:0;">
            <span class="eyebrow">Our approach</span>
            <h2>Relationship-based. Data-driven.</h2>
            <div class="prose" style="margin-top:var(--space-4);">
              <p>Every program starts with a conversation about how your locations operate — hours, staffing, brand standards, compliance obligations — and an inventory of what you own. From there we design planned maintenance, emergency coverage, and capital planning that fit, and we track all of it in the asset management portal so you can see it any time.</p>
            </div>
          </div>
          <ul class="checks">
${check("Program design around your operations", "Not a template — the scope, cadence, and reporting your organization needs.")}
${check("Self-performing branches + vetted partners", "FirstCall crews where we have them; long-tenured partners everywhere else.")}
${check("One point of contact", "A dedicated account team for every request, at every site.")}
${check("Full visibility", "Work orders, quotes, invoices, assets, and reports in one portal.")}
          </ul>
        </div>
      </div>
    </section>

${ctaBand("Don't see your industry? Let's talk anyway.", "If you operate facilities in more than one place, we can build a program for them.")}
  </main>
`;
}

function casesBody() {
  const body = PUBLISHED_CASES.length
    ? `        <div class="related-grid">
${PUBLISHED_CASES.map(function (c) {
  return `        <article class="related-card" id="${c.slug}"><span class="eyebrow">${c.sector}</span><h3>${c.client}${c.title ? " — " + c.title : ""}</h3><p>${c.summary}</p>${c.scope.length ? "<ul>" + c.scope.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul>" : ""}${c.results.length ? "<ul>" + c.results.map(function (s) { return "<li><strong>" + s + "</strong></li>"; }).join("") + "</ul>" : ""}<span class="related-card__meta">Delivered by ${c.branch}, a FirstCall company</span></article>`;
}).join("\n")}
        </div>`
    : `        <div class="notice">
          <h3>Case studies are on the way.</h3>
          <p>We're documenting recent mission-critical and multi-site programs delivered by FirstCall branches. In the meantime, ask us for references in your sector — we're happy to connect you with customers who can speak to the work.</p>
          <div style="margin-top:var(--space-5)"><a class="btn btn--primary" href="/contact">Request references</a></div>
        </div>`;
  return `  <main id="main">
${pageHero({
    crumb: crumb([{ label: "Case Studies" }]),
    eyebrow: "Resources · Case Studies",
    h1: "How FirstCall delivers for national accounts and mission-critical facilities.",
    lede: "Real programs, real sites, real results — from data center cooling to multi-state maintenance portfolios.",
    ctas: [{ label: "Get in Touch", href: "/contact" }, { label: "Read Insights", href: "https://firstcallmechanical.com/insights" }],
  })}
    <section class="section">
      <div class="container">
${body}
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">More resources</span>
          <h2>Guidance for multi-site facility teams.</h2>
        </div>
        <div class="related-grid">
        <a class="related-card" href="https://firstcallmechanical.com/insights" rel="noopener"><span class="eyebrow">Insights</span><h3>Insights blog</h3><p>Planned maintenance, asset management, energy systems, and vendor selection for multi-site operators.</p></a>
        <a class="related-card" href="https://firstcallgroup.com/news" rel="noopener"><span class="eyebrow">News</span><h3>FirstCall news</h3><p>New partner branches, leadership, and network announcements.</p></a>
        <a class="related-card" href="/the-firstcall-difference"><span class="eyebrow">The FirstCall Difference</span><h3>How we add value</h3><p>National network, enterprise asset lists, and the asset management portal.</p></a>
        </div>
      </div>
    </section>

${ctaBand("Want to be the next case study?", "Tell us about your portfolio and what a win would look like.")}
  </main>
`;
}

function contactBody() {
  return `  <main id="main">
${pageHero({
    crumb: crumb([{ label: "Contact" }]),
    eyebrow: "Contact",
    h1: "Let's talk about your locations.",
    lede: "Whether you're exploring a national maintenance program, planning a mission-critical project, or need help right now, the FirstCall national accounts team is one call or one form away.",
    ctas: [{ label: "Send a message", href: "#contact-form" }, { label: "Data center inquiry", href: "/mission-critical/data-centers#data-center-form" }],
  })}
    <section class="section" id="contact-form">
      <div class="container">
        <div class="contact-cards">
          <div class="contact-card">${I.phone}<div><strong>Call</strong><a href="${PHONE_HREF}">${PHONE_DISPLAY}</a><br><span>24/7 emergency dispatch through the FirstCall network</span></div></div>
          <div class="contact-card">${I.mail}<div><strong>Email</strong><a href="mailto:${EMAIL}">${EMAIL}</a><br><span>National accounts, partnerships, and general inquiries</span></div></div>
          <div class="contact-card">${I.pin}<div><strong>Headquarters</strong><span>${HQ.street}<br>${HQ.city}, ${HQ.state} ${HQ.zip}</span></div></div>
        </div>
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Get started</span>
              <h2>Tell us about your portfolio.</h2>
            </div>
            <div class="prose">
              <p>Share a little about your organization, where your facilities are, and what you need from a partner. A member of the national accounts team will respond within one business day.</p>
              <p>Have a data center project? Use the <a href="/mission-critical/data-centers#data-center-form">data center inquiry form</a> so the right specialists see it first. Commercial service contractors interested in joining the network can <a href="/become-a-partner">apply here</a>.</p>
            </div>
          </div>
          <form class="contact-form" action="/api/contact" method="POST" data-form-handler novalidate>
            <input type="hidden" name="_form" value="fcbs-contact" />
${honeypot()}
            <div class="form-grid">
${field("f-first", "first", "First name", { required: true, autocomplete: "given-name" })}
${field("f-last", "last", "Last name", { required: true, autocomplete: "family-name" })}
${field("f-email", "email", "Work email", { required: true, type: "email", autocomplete: "email", full: true })}
${field("f-phone", "phone", "Phone", { type: "tel", autocomplete: "tel" })}
${field("f-company", "company", "Company", { required: true, autocomplete: "organization" })}
${field("f-locations", "number_of_locations", "Number of locations", { type: "select", options: ["1–10", "11–50", "51–150", "151–500", "500+"] })}
${field("f-states", "states_regions", "States / regions", { placeholder: "e.g. TX, GA, NC — or Southeast" })}
${field("f-interest", "interest", "I'm interested in", { type: "select", full: true, options: ["National account program", "Mission critical / data center", "Energy services &amp; resiliency", "Healthcare facilities", "Planned maintenance program", "Emergency service", "Capital project", "Partnership / vendor network", "Other"] })}
${field("f-message", "message", "Message", { type: "textarea", full: true, required: true })}
            </div>
${turnstile()}
${formActions("Send Message", "We typically respond within one business day.")}
          </form>
        </div>
      </div>
    </section>

${ctaBand("Facilities that can't go down?", "Our Mission Critical team supports data centers, healthcare, and energy resiliency programs nationwide.", { label: "Explore Mission Critical", href: "/mission-critical/" }, { label: "See all services", href: "/services" })}
  </main>
`;
}

function partnerBody() {
  return `  <main id="main">
${pageHero({
    crumb: crumb([{ label: "Become a Partner" }]),
    eyebrow: "Partner Network",
    h1: "Grow your commercial service business with FirstCall.",
    lede: "We actively partner with commercial service contractors in multiple trades to support national accounts across the United States. If you self-perform quality work, answer the phone at 2 a.m., and want steady program work in your market, we'd like to hear from you.",
    ctas: [{ label: "Apply now", href: "#partner-form" }, { label: "About FirstCall", href: "/about" }],
  })}
    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">What we look for</span>
          <h2>Partners we keep for a decade, not a quarter.</h2>
          <p class="lead">Our best partner relationships are measured in years. We look for contractors who operate the way FirstCall branches do.</p>
        </div>
        <div class="feature-grid">
${feature(I.wrench, "Self-performing", "Your own licensed technicians on the truck — not a broker.")}
${feature(I.clock, "24/7 responsive", "Staffed or on-call dispatch and a track record of showing up.")}
${feature(I.shield, "Licensed, insured, safe", "Current trade licenses, commercial insurance, and a documented safety program.")}
${feature(I.doc, "Good paperwork", "Clear scopes, timely service reports, and invoices that match the quote.")}
${feature(I.map, "Defined territory", "A service area you can cover reliably, with room to grow with us.")}
${feature(I.handshake, "Program-minded", "Comfortable working to a national customer's standard, schedule, and portal.")}
        </div>
      </div>
    </section>

    <section class="section section--tinted" id="partner-form">
      <div class="container">
        <div class="split">
          <div>
            <div class="section-head" style="margin-bottom:var(--space-5);">
              <span class="eyebrow">Apply</span>
              <h2>Tell us about your business.</h2>
            </div>
            <div class="prose">
              <p>Provide a few brief details and our partner network team will be in touch. Interested in joining FirstCall as a partner branch rather than a vendor? Visit <a href="https://firstcallgroup.com/acquisitions" rel="noopener">FirstCall Group acquisitions</a>.</p>
            </div>
          </div>
          <form class="contact-form" action="/api/contact" method="POST" data-form-handler novalidate>
            <input type="hidden" name="_form" value="fcbs-partner" />
${honeypot()}
            <div class="form-grid">
${field("p-company", "company", "Company name", { required: true, autocomplete: "organization", full: true })}
${field("p-first", "first", "Contact first name", { required: true, autocomplete: "given-name" })}
${field("p-last", "last", "Contact last name", { required: true, autocomplete: "family-name" })}
${field("p-email", "email", "Email", { required: true, type: "email", autocomplete: "email" })}
${field("p-phone", "phone", "Phone", { required: true, type: "tel", autocomplete: "tel" })}
${field("p-website", "website", "Website", { type: "url", placeholder: "https://" })}
${field("p-hq", "headquarters", "Headquarters (city, state)", { required: true })}
${field("p-area", "service_area", "Service area", { full: true, placeholder: "Metros, counties, or states you cover" })}
${checkGroup("Trades you self-perform", "p-trade", [
  { name: "trade_hvac", label: "HVAC" },
  { name: "trade_refrigeration", label: "Refrigeration" },
  { name: "trade_electrical", label: "Electrical" },
  { name: "trade_lighting", label: "Lighting / LED" },
  { name: "trade_plumbing", label: "Plumbing" },
  { name: "trade_fire_life_safety", label: "Fire &amp; life safety" },
  { name: "trade_building_automation", label: "Building automation / controls" },
  { name: "trade_signage", label: "Signage" },
  { name: "trade_general", label: "General facility / handyman" },
])}
${field("p-techs", "technician_count", "Number of field technicians", { type: "select", options: ["1–5", "6–15", "16–40", "41–100", "100+"] })}
${field("p-emergency", "emergency_247", "24/7 emergency service?", { type: "select", options: ["Yes — staffed dispatch", "Yes — on-call", "No"] })}
${field("p-message", "message", "Anything else we should know", { type: "textarea", full: true, placeholder: "Licenses, certifications, notable customers, capacity…" })}
            </div>
${turnstile()}
${formActions("Submit application", "Our partner network team reviews every application.")}
          </form>
        </div>
      </div>
    </section>

${ctaBand("Already a FirstCall customer?", "Reach the national accounts team for service, quotes, or program questions.", { label: "Contact us", href: "/contact" }, { label: "See all services", href: "/services" })}
  </main>
`;
}

// ---------------------------------------------------------------------------
// BUILD
// ---------------------------------------------------------------------------
function write(meta, body, opts) {
  opts = opts || {};
  const html = head(meta, opts) + header(meta.url) + body + FOOTER + scripts(opts);
  const file = path.join(OUT, meta.out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log("  wrote building-solutions/" + meta.out + " (" + (html.length / 1024).toFixed(0) + " KB)");
}

console.log("Building " + BRAND + " site -> /building-solutions/");
write(PAGES.home, homeBody(), { counts: true });
write(PAGES.mcHub, mcHubBody(), { ogImage: IMG.hall });
write(PAGES.dataCenters, dataCentersBody(), { form: true, ogImage: IMG.racks });
write(PAGES.energy, energyBody());
write(PAGES.healthcare, healthcareBody());
write(PAGES.about, aboutBody(), { counts: true });
write(PAGES.difference, differenceBody(), { counts: true });
write(PAGES.services, servicesBody());
write(PAGES.industries, industriesBody());
write(PAGES.cases, casesBody());
write(PAGES.contact, contactBody(), { form: true });
write(PAGES.partner, partnerBody(), { form: true });

// Sitemap (served at firstcallbuildingsolutions.com/sitemap.xml via _worker.js)
const PRIORITY = { "/": "1.0", "/mission-critical/": "0.9", "/mission-critical/data-centers": "0.9" };
const urls = Object.keys(PAGES).map(function (k) {
  const p = PAGES[k];
  return "  <url>\n    <loc>" + SITE + p.url + "</loc>\n    <lastmod>" + TODAY + "</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>" + (PRIORITY[p.url] || "0.8") + "</priority>\n  </url>";
}).join("\n");
fs.writeFileSync(path.join(ROOT, "sitemap-building-solutions.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n");
console.log("  wrote sitemap-building-solutions.xml (" + Object.keys(PAGES).length + " URLs)");
console.log("Done.");
