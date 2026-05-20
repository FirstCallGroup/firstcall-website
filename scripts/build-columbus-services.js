#!/usr/bin/env node
/**
 * One-shot generator for the 6 Columbus service pages.
 *
 * Reads the existing hvac-modernization.html as a structural shell (head,
 * header, footer, scripts, CSS — everything except the <main> content), then
 * rewrites it for each service slug with the per-page content defined below.
 *
 * Also updates the Services nav dropdown across ALL Columbus pages (the 6
 * service pages, careers, contact, and the columbus.html landing) to the new
 * 6-item ordering. And rewrites the existing planned-maintenance / careers /
 * contact pages to point the dropdown at the new slugs.
 *
 * Run: node scripts/build-columbus-services.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const columbusDir = path.join(root, "columbus");

// =============================================================================
// Icon library — small inline SVGs used across feature cards
// (Defined first so the PAGES array below can reference them.)
// =============================================================================

function ICON(d) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`; }
const ICON_RTU         = ICON('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 19v2M17 19v2"/><path d="M3 10h18"/>');
const ICON_CHILLER     = ICON('<circle cx="12" cy="12" r="9"/><path d="M12 5v7l4 2"/>');
const ICON_BOILER      = ICON('<path d="M4 21V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13"/><path d="M9 21v-6h6v6"/><path d="M12 6V3"/>');
const ICON_AHU         = ICON('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>');
const ICON_VRF         = ICON('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>');
const ICON_PRECISION   = ICON('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h.01M11 8h.01M15 8h.01M3 12h18"/>');
const ICON_WALK_IN     = ICON('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 12h18M12 4v16"/>');
const ICON_REACH_IN    = ICON('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 12h14M9 7v.01M9 16v.01"/>');
const ICON_ICE         = ICON('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h2v2H8zM14 8h2v2h-2zM8 14h2v2H8zM14 14h2v2h-2z"/>');
const ICON_DISPLAY     = ICON('<rect x="2" y="6" width="20" height="12" rx="1"/><path d="M6 6v12M18 6v12M2 12h20"/>');
const ICON_COMPLIANCE  = ICON('<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="6" width="18" height="15" rx="2"/>');
const ICON_RACK        = ICON('<path d="M3 7h18M3 12h18M3 17h18"/>');
const ICON_CONTROLS    = ICON('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>');
const ICON_RETROFIT    = ICON('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v6h-6"/>');
const ICON_GRAPHICS    = ICON('<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4M7 13l3-3 3 2 4-4"/>');
const ICON_INTEGRATION = ICON('<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h7M8.5 18h7M6 8.5v7M18 8.5v7"/>');
const ICON_SEQUENCE    = ICON('<path d="M3 12h4l3-8 4 16 3-8h4"/>');
const ICON_SERVICE     = ICON('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>');
const ICON_PHONE       = ICON('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>');
const ICON_DISPATCH    = ICON('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01"/>');
const ICON_TRUCK       = ICON('<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>');
const ICON_PRIORITY    = ICON('<polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"/>');
const ICON_REFRIG      = ICON('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 12h14M9 7v.01M9 16v.01"/>');
const ICON_DOCS        = ICON('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/>');
const ICON_CHANGEOUT   = ICON('<path d="M3 7h18M3 12h18M3 17h18"/><path d="M8 4l-5 3 5 3M16 14l5 3-5 3"/>');
const ICON_DESIGN      = ICON('<path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M9 21V13h6v8"/>');
const ICON_CAPITAL     = ICON('<path d="M3 20h18M5 20V10M9 20V4M13 20V8M17 20V12M21 20V6"/>');
const ICON_REBATE      = ICON('<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>');
const ICON_COMMISSION  = ICON('<polyline points="20 6 9 17 4 12"/>');

// =============================================================================
// Per-page content
// =============================================================================

const PAGES = [
  {
    slug: "commercial-hvac",
    title: "Commercial HVAC",
    metaDescription: "Commercial HVAC service from FirstCall Columbus — rooftop units, chillers, boilers, VRF, and air handlers across central Ohio. EPA-certified techs, 24/7 emergency response.",
    schemaName: "Commercial HVAC Service — FirstCall Columbus",
    schemaDescription: "Comprehensive commercial HVAC service, repair, and replacement for central Ohio facilities — rooftop units, chillers, boilers, air handlers, VRF systems, and IAQ.",
    hero: {
      eyebrow: "Service",
      title: "Commercial HVAC",
      lede: "Comprehensive heating, ventilation, and air conditioning service for commercial and industrial facilities — from an emergency call on a rooftop unit at 2 a.m. to a full chiller plant overhaul.",
    },
    features: {
      eyebrow: "What we service",
      heading: "Every system in the mechanical room.",
      lead: "Our techs work the full breadth of commercial HVAC equipment — packaged units, split systems, central plants, and the controls that tie them together.",
      items: [
        { icon: ICON_RTU,        title: "Rooftop units", body: "Service, repair, and replacement for packaged RTUs — gas-electric, heat pump, and dedicated outside air units." },
        { icon: ICON_CHILLER,    title: "Chillers &amp; cooling towers", body: "Air-cooled, water-cooled, and absorption chillers — start-up, teardown, eddy-current tube testing, refrigerant management." },
        { icon: ICON_BOILER,     title: "Boilers &amp; hot water", body: "Hot water and steam boilers, condensate systems, combustion analysis and tuning, code-required annual inspections." },
        { icon: ICON_AHU,        title: "Air handlers &amp; DOAS", body: "AHUs, fan coils, VAV boxes, and dedicated outside air units — coil cleaning, motor and bearing replacement, balance, controls integration." },
        { icon: ICON_VRF,        title: "VRF / VRV systems", body: "Multi-zone variable refrigerant systems — leak detection, EEPROM diagnostics, indoor-unit replacement, condenser service." },
        { icon: ICON_PRECISION,  title: "Precision &amp; data center cooling", body: "Liebert / CRAC / CRAH units and in-row cooling — humidity control, redundancy commissioning, and same-day parts for the mission-critical floor." },
      ],
    },
    info: {
      eyebrow: "Why FirstCall Columbus",
      heading: "We service what we install — and we install what we service.",
      paragraphs: [
        "Most HVAC firms split into install crews and service crews that don't talk. Ours don't. The tech who shows up to fix your rooftop unit at 2 a.m. has probably worked on the install crew that put it there.",
        "That means faster diagnosis, cleaner repairs, and a service record that actually reflects what's in your building.",
      ],
      bullets: [
        "Factory-trained on Trane, Carrier, Daikin, JCI, Lennox, Mitsubishi, LG, and Liebert",
        "EPA-certified universal techs on every truck",
        "Manufacturer warranty handling — we file the paperwork, you don't",
        "Aligned with your in-house facilities team, not in competition with them",
        "Same crew for service and projects — no handoff friction",
      ],
    },
    cta: {
      eyebrow: "Ready to talk?",
      heading: "Let's keep your buildings running.",
      paragraph: "Tell us about your facility — current equipment, pain points, expansion plans — and we'll come back with a proposal within the week.",
    },
  },
  {
    slug: "commercial-refrigeration",
    title: "Commercial Refrigeration",
    metaDescription: "Commercial refrigeration service from FirstCall Columbus — walk-ins, reach-ins, ice machines, display cases across central Ohio. EPA-certified techs, 24/7 emergency response.",
    schemaName: "Commercial Refrigeration Service — FirstCall Columbus",
    schemaDescription: "Walk-in coolers and freezers, reach-ins, ice machines, refrigerated display cases, and rack systems — service, repair, replacement, and 24/7 emergency response for central Ohio.",
    hero: {
      eyebrow: "Service",
      title: "Commercial Refrigeration",
      lede: "Walk-in coolers and freezers, reach-ins, ice machines, refrigerated display cases, beverage equipment — service, repair, replacement, and 24/7 emergency response for the equipment that keeps your inventory from spoiling.",
    },
    features: {
      eyebrow: "What we service",
      heading: "From the ice machine to the walk-in cooler.",
      lead: "Restaurants, supermarkets, convenience stores, distribution centers — central Ohio runs on refrigeration. We service the full equipment list and keep parts on the trucks for the common failures.",
      items: [
        { icon: ICON_WALK_IN,    title: "Walk-in coolers &amp; freezers", body: "Service, repair, and replacement — compressors, evaporators, condensers, defrost controls, door gaskets, and condensate management." },
        { icon: ICON_REACH_IN,   title: "Reach-in &amp; prep units", body: "Reach-in coolers and freezers, sandwich and pizza prep tables, undercounter units — for the kitchen line, the bar, and the back-of-house." },
        { icon: ICON_ICE,        title: "Ice machines", body: "Hoshizaki, Manitowoc, Scotsman, Follett, Ice-O-Matic — diagnosis, cleaning, water-line and filter service, and full replacement when a rebuild stops making sense." },
        { icon: ICON_DISPLAY,    title: "Refrigerated display cases", body: "Open and closed-door grocery cases, deli and meat cases, beverage merchandisers — coil cleaning, refrigerant management, and door gasket replacement." },
        { icon: ICON_COMPLIANCE, title: "Refrigerant compliance", body: "EPA Section 608 leak detection and repair, refrigerant recovery and tracking, and AIM Act / HFC phase-down planning so your equipment stays legal as the rules change." },
        { icon: ICON_RACK,       title: "Rack systems &amp; remote condensers", body: "Supermarket and convenience-store rack systems, parallel compressor racks, remote condensing units — controls tuning, leak isolation, and end-of-life replacement planning." },
      ],
    },
    info: {
      eyebrow: "Why FirstCall Columbus",
      heading: "When the cooler goes down, the clock is running.",
      paragraphs: [
        "Refrigeration failures are different from HVAC. A rooftop unit going out at 8 p.m. is uncomfortable; a walk-in going out at 8 p.m. is a four-figure inventory loss by morning. The math gets worse with every hour.",
        "Our refrigeration techs run on a parts-stocked truck rotation tuned for the common failures: condenser fan motors, compressor contactors, defrost timers, expansion valves. Diagnose, repair, log, leave. One trip whenever the part is on the truck.",
      ],
      bullets: [
        "EPA Section 608 universal-certified techs on every refrigeration truck",
        "Common compressors, condenser fan motors, and contactors stocked on trucks",
        "Manufacturer-authorized service for Hoshizaki, Manitowoc, Scotsman ice machines",
        "Refrigerant leak detection and HFC compliance handled",
        "24/7 emergency response — restaurants and supermarkets are priority dispatch",
      ],
    },
    cta: {
      eyebrow: "Equipment down? Planning a build-out?",
      heading: "Let's keep your cold chain cold.",
      paragraph: "Whether you need a tech today or a quote on a new walk-in, give us a call. New equipment install, end-of-life replacements, and PM contracts all start with a site walk.",
    },
  },
  {
    slug: "building-controls",
    title: "Building Controls",
    metaDescription: "Building automation and controls from FirstCall Columbus — BAS design, install, integration, and service for central Ohio commercial facilities.",
    schemaName: "Building Controls — FirstCall Columbus",
    schemaDescription: "Design, install, integration, and service of building automation systems (BAS) — DDC controllers, graphics, sequences of operation, and pneumatic-to-DDC retrofits.",
    hero: {
      eyebrow: "Service",
      title: "Building Controls",
      lede: "Design, installation, integration, and service of building automation systems that reduce operating costs and keep your facility running the way it was designed to.",
    },
    features: {
      eyebrow: "What we do",
      heading: "From sensor to dashboard.",
      lead: "We design and program building automation systems that actually do what your operations team needs, not what looked good on the original engineering plan ten years ago.",
      items: [
        { icon: ICON_CONTROLS,    title: "BAS design &amp; install", body: "New construction and renovation BAS design — sequences of operation, point lists, panel layouts, and end-to-end installation by in-house controls techs." },
        { icon: ICON_RETROFIT,    title: "Pneumatic-to-DDC retrofits", body: "Replace aging pneumatic controls with modern DDC — central plant first, terminal units phased over time, with no service interruption to occupied spaces." },
        { icon: ICON_GRAPHICS,    title: "Graphics &amp; dashboards", body: "Web-based graphics that mean something — floor-plan overlays, real-time trends, and alarms tuned to what your operators actually act on." },
        { icon: ICON_INTEGRATION, title: "Integration &amp; protocols", body: "BACnet, Modbus, LonWorks, OPC, MQTT — we bridge legacy equipment into your BAS and tie chillers, RTUs, boilers, and meters into one view." },
        { icon: ICON_SEQUENCE,    title: "Sequence tuning &amp; optimization", body: "Re-commission sequences to match how the building actually operates — economizer cutovers, reset schedules, OAT-based supply temperature setpoints, demand-based ventilation." },
        { icon: ICON_SERVICE,     title: "Controls service contracts", body: "PM visits that include sensor calibration, controller battery replacement, firmware updates, and software-side health checks — not just the mechanical equipment." },
      ],
    },
    info: {
      eyebrow: "Why FirstCall Columbus",
      heading: "Controls that match how your building actually runs.",
      paragraphs: [
        "Most building automation systems were designed for a building that no longer exists. Tenants changed. Occupancy patterns shifted. The chiller got replaced but the original sequence never got updated. We fix the gap between what the BAS thinks is happening and what's actually happening.",
        "Our controls team works hand-in-hand with the mechanical service crew, so when a chiller starts short-cycling on a Tuesday morning, we know whether it's the equipment or the sequence — and we can fix either one.",
      ],
      bullets: [
        "In-house controls techs, not subcontracted",
        "Manufacturer-agnostic — we work with the system you have, not the one we want to sell",
        "Tridium Niagara, JCI Metasys, ALC WebCTRL, Distech, Honeywell experience",
        "Sequence of operation documentation handed off in human-readable form",
        "Open protocols by default — no proprietary lock-in",
      ],
    },
    cta: {
      eyebrow: "BAS feeling old?",
      heading: "Let's modernize what's worth keeping.",
      paragraph: "Whether you need a single sequence rewrite or a full pneumatic-to-DDC overhaul, we'll come look at the building first and tell you what's actually worth doing.",
    },
  },
  {
    slug: "emergency",
    title: "Emergency Services",
    metaDescription: "24/7 commercial HVAC and refrigeration emergency response from FirstCall Columbus — staffed dispatch, same number as office: (614) 337-0111.",
    schemaName: "24/7 Emergency Service — FirstCall Columbus",
    schemaDescription: "Round-the-clock commercial HVAC, refrigeration, and building controls emergency response across central Ohio — staffed dispatch and on-call technician roster.",
    hero: {
      eyebrow: "Service",
      title: "Emergency Services",
      lede: "Around-the-clock response for commercial HVAC, refrigeration, and controls emergencies across central Ohio. Same line as the office: <a href=\"tel:+16143370111\" style=\"color: inherit; text-decoration: underline; font-weight: 600\">(614) 337-0111</a>.",
    },
    features: {
      eyebrow: "When you need us",
      heading: "Staffed dispatch, on-call techs, parts on the truck.",
      lead: "Most building emergencies don't wait for business hours. When yours doesn't, our dispatch line is staffed by a human who knows which tech to route the call to.",
      items: [
        { icon: ICON_PHONE,      title: "One number, 24/7", body: "<strong>(614) 337-0111</strong> reaches a real person any hour. No phone tree, no robocall, no leaving a voicemail and hoping." },
        { icon: ICON_DISPATCH,   title: "Staffed dispatch", body: "Dispatch decides which on-call tech to send based on the equipment, the building, and who's closest. Not just first-name-on-the-roster." },
        { icon: ICON_TRUCK,      title: "Parts on the truck", body: "Common failure parts ride with the techs — condenser fan motors, contactors, capacitors, defrost timers, expansion valves. One trip whenever it's a common failure." },
        { icon: ICON_PRIORITY,   title: "PM customers go first", body: "If you're on a planned maintenance contract with us, you skip the queue. The contract is the priority list." },
        { icon: ICON_REFRIG,     title: "Refrigeration priority", body: "Walk-ins, refrigerated cases, and ice machines get dispatched ahead of comfort-cooling calls. Spoilage clocks don't wait." },
        { icon: ICON_DOCS,       title: "Documented every time", body: "Every emergency call gets a service ticket with the diagnosis, the parts used, and any follow-up recommended — so the next person who looks at the unit has context." },
      ],
    },
    info: {
      eyebrow: "How emergency works",
      heading: "Same number you call during the day.",
      paragraphs: [
        "After 4:30 p.m. weekdays and on weekends, the office line forwards to staffed dispatch. The person who answers can see your service history, knows which tech worked on the unit last, and can pull up the building.",
        "If you've got an existing PM contract, dispatch flags you as priority and routes the call to the tech closest to your site. If you're not on a contract yet, you still get a tech — just behind the contract customers if it's a busy night.",
      ],
      bullets: [
        "Same phone number as office hours: (614) 337-0111",
        "Human-answered dispatch, not an automated phone tree",
        "Priority routing for PM contract customers",
        "Refrigeration emergencies bumped above comfort cooling",
        "Service ticket and follow-up notes for every after-hours call",
      ],
    },
    cta: {
      eyebrow: "Emergency right now?",
      heading: "Call (614) 337-0111.",
      paragraph: "Same line as office hours. If it's after 4:30 p.m. or the weekend, it's the on-call rotation. They'll triage and dispatch.",
    },
  },
  {
    slug: "project-support",
    title: "Project Support",
    metaDescription: "Mechanical project support from FirstCall Columbus — design-build, retrofit, and equipment-upgrade projects for central Ohio commercial facilities.",
    schemaName: "Project Support — FirstCall Columbus",
    schemaDescription: "Design-build, retrofit, mechanical equipment changeouts, and capital project support for commercial facilities — engineered installs by the same crew that services the equipment after.",
    hero: {
      eyebrow: "Service",
      title: "Project Support",
      lede: "Design-build, retrofit, and equipment-upgrade projects delivered by tradespeople who know the install — and the service after.",
    },
    features: {
      eyebrow: "Project types",
      heading: "From a single change-out to a central plant overhaul.",
      lead: "Most of our project work isn't ground-up new construction — it's the harder kind. Replacements in occupied buildings. Retrofits with tight cutover windows. Upgrades that have to coordinate with operations.",
      items: [
        { icon: ICON_CHANGEOUT,   title: "Equipment change-outs", body: "RTU, chiller, boiler, AHU, and pump replacements — load review, right-sizing, crane work, controls integration, commissioning, and as-built docs." },
        { icon: ICON_RETROFIT,    title: "System retrofits", body: "Pneumatic-to-DDC controls, BAS upgrades, hydronic re-piping, refrigerant phase-down conversions — staged for minimum disruption." },
        { icon: ICON_DESIGN,      title: "Design-build", body: "We bring engineering, fabrication, and field crews under one roof so the design accounts for what the install crew can actually deliver — and what facilities can actually maintain." },
        { icon: ICON_CAPITAL,     title: "Capital planning support", body: "Multi-year capital roadmaps with condition-based prioritization. We tell you which units to replace this year and which can wait — based on actual service history, not a depreciation schedule." },
        { icon: ICON_REBATE,      title: "Utility rebates &amp; incentives", body: "AEP Ohio, Columbia Gas, and federal incentive paperwork — we file it. You don't chase the rebate; we do." },
        { icon: ICON_COMMISSION,  title: "Commissioning &amp; documentation", body: "Functional performance tests, sequence verification, training for facilities staff, and a clean as-built handover that future-you will thank past-you for." },
      ],
    },
    info: {
      eyebrow: "How we work",
      heading: "Engineered, not just installed.",
      paragraphs: [
        "We don't drop in like-for-like replacements without verifying the new equipment is the right size. Buildings change. Loads change. Equipment selections that were right ten years ago are often oversized today — and oversized equipment costs you in efficiency, comfort, and reliability.",
        "Every project starts with a load review and a discussion about what's actually running through the building today.",
      ],
      bullets: [
        "Load review and right-sizing before any equipment selection",
        "Multiple manufacturer options with side-by-side comparisons",
        "Coordination with your operations team on cutover windows",
        "Crane lifts, rigging, and structural coordination as needed",
        "Controls integration with existing BAS",
        "Commissioning and as-built documentation at handover",
        "Utility rebate paperwork — we handle it",
      ],
    },
    cta: {
      eyebrow: "Project on the horizon?",
      heading: "Get a proposal.",
      paragraph: "Send us a scope, an RFP, or just a wishlist — we'll come look at the site and come back with a real number. Quotes typically within two weeks.",
    },
  },
];

// Keep planned-maintenance.html unchanged in content but update its nav.
// We'll handle that separately via a simple find-and-replace.

// =============================================================================
// Render helpers
// =============================================================================

function renderFeatureCards(items) {
  return items.map(it => `          <article class="feature">
            <span class="feature__icon" aria-hidden="true">${it.icon}</span>
            <h3>${it.title}</h3>
            <p>${it.body}</p>
          </article>`).join("\n");
}

function renderInfoBullets(bullets) {
  return bullets.map(b => `              <li>${b}</li>`).join("\n");
}

function renderInfoParagraphs(ps) {
  return ps.map(p => `            <p>${p}</p>`).join("\n");
}

const NAV_DROPDOWN_ITEMS = [
  { slug: "commercial-hvac",         title: "Commercial HVAC" },
  { slug: "commercial-refrigeration", title: "Commercial Refrigeration" },
  { slug: "building-controls",       title: "Building Controls" },
  { slug: "planned-maintenance",     title: "Planned Maintenance" },
  { slug: "emergency",               title: "Emergency Services" },
  { slug: "project-support",         title: "Project Support" },
];

function renderServicesDropdown(activeSlug, hrefPrefix) {
  return NAV_DROPDOWN_ITEMS.map(it => {
    const ariaCurrent = it.slug === activeSlug ? ' aria-current="page"' : "";
    return `            <a class="site-nav__dropdown-link" href="${hrefPrefix}${it.slug}.html"${ariaCurrent}>${it.title}</a>`;
  }).join("\n");
}

function renderFooterServicesList(hrefPrefix) {
  return NAV_DROPDOWN_ITEMS.map(it =>
    `            <li><a href="${hrefPrefix}${it.slug}.html">${it.title}</a></li>`
  ).join("\n");
}

// =============================================================================
// Build shell from existing hvac-modernization.html
// =============================================================================

const TEMPLATE_PATH = path.join(columbusDir, "hvac-modernization.html");
const shellSource = fs.readFileSync(TEMPLATE_PATH, "utf8");

// Extract pieces by line markers. The "shell" is everything outside the
// per-page content blocks we want to swap.

function buildPageHTML(p) {
  let html = shellSource;

  // --- HEAD: title, meta description, OG, canonical, schema ---
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${p.title} — FirstCall Mechanical Columbus</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${p.metaDescription}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="https://firstcallmechanical.com/columbus/${p.slug}" />`
  );
  // og:title + og:description + og:url if present
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${p.title} — FirstCall Mechanical Columbus" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${p.metaDescription}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="https://firstcallmechanical.com/columbus/${p.slug}" />`
  );

  // --- Service schema name + description ---
  // Replace the "name" and "description" fields inside the @type:Service block.
  // The block lives between fc:service-schema:start and fc:service-schema:end.
  html = html.replace(
    /("@type":\s*"Service"[\s\S]*?"name":\s*")[^"]+(")/,
    `$1${p.schemaName}$2`
  );
  html = html.replace(
    /("@type":\s*"Service"[\s\S]*?"description":\s*")[^"]+(")/,
    `$1${p.schemaDescription}$2`
  );

  // --- Services nav dropdown (header) — 6 items, active = this page ---
  html = html.replace(
    /(<div class="site-nav__dropdown" data-dropdown-menu>)[\s\S]*?(<\/div>\s*<\/div>\s*<div class="site-nav__dropdown-wrap")/,
    `$1\n${renderServicesDropdown(p.slug, "")}\n          $2`
  );

  // --- <main> block: replace entirely ---
  const mainHTML = `  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="page-hero__inner">
          <span class="page-hero__eyebrow">${p.hero.eyebrow}</span>
          <h1 class="page-hero__title">${p.hero.title}</h1>
          <p class="page-hero__lede">${p.hero.lede}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div style="max-width: 720px; margin-inline: auto; text-align: center; margin-bottom: var(--space-7);">
          <span class="eyebrow">${p.features.eyebrow}</span>
          <h2>${p.features.heading}</h2>
          <p class="lead" style="margin-inline: auto; margin-top: var(--space-3);">${p.features.lead}</p>
        </div>
        <div class="feature-grid">
${renderFeatureCards(p.features.items)}
        </div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="info-grid">
          <div>
            <span class="eyebrow">${p.info.eyebrow}</span>
            <h2>${p.info.heading}</h2>
${renderInfoParagraphs(p.info.paragraphs)}
          </div>
          <div>
            <ul>
${renderInfoBullets(p.info.bullets)}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-band__inner">
        <span class="eyebrow" style="color: var(--color-accent-light)">${p.cta.eyebrow}</span>
        <h2>${p.cta.heading}</h2>
        <p>${p.cta.paragraph}</p>
        <div class="cta-band__row">
          <a class="btn btn--primary btn--lg" href="contact.html">Request a Quote</a>
          <a class="btn btn--lg" href="tel:+16143370111" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)">Call (614) 337-0111</a>
        </div>
      </div>
    </section>
  </main>`;
  html = html.replace(/<main id="main">[\s\S]*?<\/main>/, mainHTML);

  // --- Footer services list — 6 items ---
  html = html.replace(
    /(<div class="site-footer__heading">Services<\/div>\s*<ul class="site-footer__list">)[\s\S]*?(<\/ul>)/,
    `$1\n${renderFooterServicesList("")}\n          $2`
  );

  return html;
}

// =============================================================================
// Write each page
// =============================================================================

for (const p of PAGES) {
  const outPath = path.join(columbusDir, `${p.slug}.html`);
  fs.writeFileSync(outPath, buildPageHTML(p), "utf8");
  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`✓ columbus/${p.slug}.html (${sizeKB} KB)`);
}

// =============================================================================
// Update the remaining pages (planned-maintenance, careers, contact) to use
// the new 6-item Services dropdown and the new footer services list.
// =============================================================================

for (const filename of ["planned-maintenance.html", "careers.html", "contact.html"]) {
  const filePath = path.join(columbusDir, filename);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, "utf8");
  const activeSlug = filename === "planned-maintenance.html" ? "planned-maintenance" : null;

  html = html.replace(
    /(<div class="site-nav__dropdown" data-dropdown-menu>)[\s\S]*?(<\/div>\s*<\/div>\s*<div class="site-nav__dropdown-wrap")/,
    `$1\n${renderServicesDropdown(activeSlug, "")}\n          $2`
  );
  html = html.replace(
    /(<div class="site-footer__heading">Services<\/div>\s*<ul class="site-footer__list">)[\s\S]*?(<\/ul>)/,
    `$1\n${renderFooterServicesList("")}\n          $2`
  );

  fs.writeFileSync(filePath, html, "utf8");
  console.log(`✓ columbus/${filename} — nav + footer updated`);
}

// =============================================================================
// Remove the legacy pages (hvac-modernization.html, project-work.html) since
// commercial-hvac.html and project-support.html replace them.
// =============================================================================

for (const legacy of ["hvac-modernization.html", "project-work.html"]) {
  const legacyPath = path.join(columbusDir, legacy);
  if (fs.existsSync(legacyPath)) {
    fs.unlinkSync(legacyPath);
    console.log(`✗ removed columbus/${legacy}`);
  }
}

console.log("\nDone.");
