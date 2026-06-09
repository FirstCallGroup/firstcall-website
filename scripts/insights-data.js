"use strict";
/**
 * SINGLE SOURCE OF TRUTH for the FirstCall Mechanical "Insights" blog.
 *
 * To ADD a post:
 *   1) Create the article at  insights/<slug>.html  (copy an existing post;
 *      write the hero, body, and FAQ — that's the authored content).
 *   2) Add ONE entry to POSTS below.
 *   3) Run:  node scripts/build-insights.js
 *
 * That regenerates ALL FOUR hookup places from this file:
 *   (1) hub cards .............. insights.html
 *   (2) sitemap entries ........ sitemap.xml
 *   (3) "Related insights" links . inside every article
 *   (4) branch "service" CTA ..... inside every article
 *
 * RULE — Columbus offers no plumbing. SERVICES.plumbing.columbus is null, so
 * the generator never links or references Columbus in any plumbing context.
 * (The FirstCall *Group* org-schema lists plumbing as a group capability on
 * every page — that is the one allowed, group-level exception and is NOT
 * managed here.)
 */

module.exports = {
  SITE: "https://firstcallmechanical.com",

  // Hub tag label per category (also the filter key on the hub).
  CATEGORIES: {
    hvac:       { label: "Commercial HVAC" },
    plumbing:   { label: "Commercial Plumbing" },
    controls:   { label: "Building Controls" },
    electrical: { label: "Commercial Electrical" },
  },

  // Branch display names for CTA anchors.
  BRANCH_NAMES: { columbus: "Columbus", dfw: "Dallas&ndash;Fort Worth", "central-texas": "Austin" },

  // service type -> CTA label + per-branch target page (null = branch lacks it).
  // This is where the Columbus-no-plumbing rule is enforced.
  SERVICES: {
    "hvac":       { label: "commercial HVAC service",             columbus: "/columbus/commercial-hvac",     dfw: "/dfw/hvac",                "central-texas": "/central-texas/hvac" },
    "hvac-pm":    { label: "commercial HVAC planned maintenance", columbus: "/columbus/planned-maintenance", dfw: "/dfw/planned-maintenance", "central-texas": "/central-texas/planned-maintenance" },
    "controls":   { label: "building controls service",          columbus: "/columbus/building-controls",   dfw: "/dfw/building-controls",   "central-texas": "/central-texas/building-controls" },
    "plumbing":   { label: "commercial plumbing",                columbus: null,                            dfw: "/dfw/plumbing",            "central-texas": null },
    "electrical": null, // no branch electrical service page -> no service CTA
  },

  // One entry per post. category = hub tag/filter; service = CTA mapping above.
  POSTS: [
    { slug: "commercial-hvac-planned-maintenance-costs", date: "2026-04-21", category: "hvac", service: "hvac-pm", readTime: "7 min read", title: "What Drives Commercial HVAC Maintenance Costs", excerpt: "What actually drives commercial HVAC maintenance cost, the questions to ask before you buy, and the standards a thorough, cost-competitive program holds to." },
    { slug: "proactive-commercial-plumbing", date: "2026-04-11", category: "plumbing", service: "plumbing", readTime: "5 min read", title: "Getting Proactive with Commercial Plumbing", excerpt: "Plumbing is the asset most facilities ignore until it fails — how to assess, prioritize, and plan capital ahead of the failure." },
    { slug: "what-goes-into-commercial-hvac-planned-maintenance", date: "2026-03-14", category: "hvac", service: "hvac-pm", readTime: "6 min read", title: "What Goes Into Commercial HVAC Planned Maintenance", excerpt: "A planned maintenance visit, broken into four work categories — efficiency, equipment life, safety, and comfort — handled on every visit." },
    { slug: "choosing-commercial-plumbing-partner", date: "2026-02-27", category: "plumbing", service: "plumbing", readTime: "5 min read", title: "Choosing the Right Commercial Plumbing Maintenance Partner", excerpt: "The questions a good plumbing partner asks, the five practices that signal excellence, and why self-performed service makes promises hold." },
    { slug: "commercial-hvac-equipment-list", date: "2026-02-18", category: "hvac", service: "hvac", readTime: "5 min read", title: "Why a Detailed HVAC Equipment List Matters", excerpt: "A make/model/serial/year equipment list protects warranty dollars, flags single-unit risk sites, and makes CapEx budgeting real." },
    { slug: "commercial-plumbing-planned-maintenance", date: "2025-12-18", category: "plumbing", service: "plumbing", readTime: "6 min read", title: "Building a Commercial Plumbing Planned Maintenance Program That Works", excerpt: "The full asset scope, the multi-site complexity, and the three metrics that prove a commercial plumbing program is working." },
    { slug: "building-energy-management-systems", date: "2025-12-02", category: "controls", service: "controls", readTime: "5 min read", title: "How Commercial Energy Management Systems Control Multi-Site Energy Costs", excerpt: "What a commercial energy management system is, how a cloud-based platform centralizes control of energy spend across every site, and why it pays off at scale." },
    { slug: "maximizing-value-commercial-hvac-planned-maintenance", date: "2025-11-09", category: "hvac", service: "hvac-pm", readTime: "6 min read", title: "Maximizing the Value of a Commercial HVAC Planned Maintenance Program", excerpt: "Climate-aware scheduling, energy data, budget planning, and centralized records turn routine service into a portfolio-wide advantage." },
    { slug: "commercial-hvac-maintenance-glossary", date: "2025-09-20", category: "hvac", service: "hvac", readTime: "6 min read", title: "A Commercial HVAC Maintenance Glossary", excerpt: "Plain-language definitions of the equipment, airflow, efficiency, and controls terms you'll see on commercial HVAC service reports." },
    { slug: "commercial-hvac-asset-management", date: "2025-08-29", category: "hvac", service: "hvac", readTime: "5 min read", title: "Getting Proactive with Commercial HVAC Asset Management", excerpt: "Get ahead of long replacement lead times with an annual HVAC asset review that swaps aging units on your schedule, not the weather's." },
    { slug: "commercial-hvac-refrigerant-transition", date: "2025-08-10", category: "hvac", service: "hvac", readTime: "6 min read", title: "Commercial HVAC Refrigerant Transition: Life After R-22", excerpt: "The refrigerant phase-down is ongoing — how to plan the repair, retrofit, or replace decision for aging equipment." },
    { slug: "commercial-hvac-total-cost-of-ownership", date: "2025-07-14", category: "hvac", service: "hvac", readTime: "5 min read", title: "The Total Cost of Owning and Operating Commercial HVAC", excerpt: "A four-part TCO framework — install, energy, maintenance, repairs over a 12–15-year life — and how planned maintenance shrinks it." },
    { slug: "commercial-plumbing-multi-site", date: "2025-07-08", category: "plumbing", service: "plumbing", readTime: "5 min read", title: "What a Commercial Plumbing Partner Should Deliver for Multi-Site Operations", excerpt: "At scale, local plumbing vendors create coverage gaps and inconsistency — here's what a true self-performing partner delivers." },
    { slug: "commercial-electrical-maintenance", date: "2025-06-27", category: "electrical", service: "electrical", readTime: "5 min read", title: "Commercial Electrical Maintenance Essentials", excerpt: "Four priorities — emergency power testing, equipment support, energy management, and integrated systems — across commercial facilities." },
    { slug: "commercial-hvac-management-must-haves", date: "2025-06-12", category: "hvac", service: "hvac", readTime: "6 min read", title: "Commercial HVAC Management Must-Haves", excerpt: "Six elements of managed commercial HVAC: planned maintenance, coil cleaning, wear assessment, reporting, and emergency response." },
    { slug: "choosing-commercial-hvac-service-company", date: "2025-05-16", category: "hvac", service: "hvac", readTime: "6 min read", title: "Choosing a Commercial HVAC Service Company: 13 Questions to Ask", excerpt: "Thirteen vetting questions on experience, scope, self-performance vs. middleman, and accountability before you sign." },
    { slug: "temporary-heating-and-cooling-solutions", date: "2025-05-15", category: "hvac", service: "hvac", readTime: "5 min read", title: "Turnkey Temporary Heating &amp; Cooling Solutions", excerpt: "Turnkey temporary climate control keeps facilities running when HVAC fails or repair lead times stretch into weeks." },
    { slug: "commercial-cooling-startup", date: "2025-04-28", category: "hvac", service: "hvac", readTime: "5 min read", title: "Starting Up Commercial Cooling the Right Way", excerpt: "Spring rooftop-unit startup as planned maintenance: belts, chemical coil cleanings, refrigerant checks, one consistent scope." },
    { slug: "commercial-hvac-planned-maintenance", date: "2025-03-13", category: "hvac", service: "hvac-pm", readTime: "5 min read", title: "Commercial HVAC Planned Maintenance: A Guide for Multi-Site Operators", excerpt: "Why reactive HVAC is the most expensive way to run a building — and what a planned maintenance program actually covers across a portfolio." },
    { slug: "benefits-commercial-plumbing-maintenance", date: "2025-03-01", category: "plumbing", service: "plumbing", readTime: "5 min read", title: "The Benefits of Commercial Plumbing Maintenance", excerpt: "Four reasons planned plumbing maintenance controls costs, cuts water waste, makes assets measurable, and powers capital budgeting." },
    { slug: "cloud-energy-management-system", date: "2025-02-27", category: "controls", service: "controls", readTime: "5 min read", title: "How a Cloud-Based Energy Management System Lowers Costs", excerpt: "A cloud EMS cuts utility spend, reduces emergency calls, and verifies maintenance — designed and tuned by our own controls technicians." },
    { slug: "strengthen-commercial-hvac-management", date: "2025-01-31", category: "hvac", service: "hvac", readTime: "4 min read", title: "3 Ways to Strengthen Commercial HVAC Management", excerpt: "Three moves — an asset list, a planned maintenance program, and proactive replacement — that reinforce each other to cut risk and cost." },
    { slug: "national-commercial-hvac-maintenance-partner", date: "2025-01-15", category: "hvac", service: "hvac", readTime: "5 min read", title: "The Benefits of a National Commercial HVAC Maintenance Partner", excerpt: "Why a self-performing national partner beats a patchwork of contractors: uniform scope, the right cadence, single-source accountability." },
  ],
};
