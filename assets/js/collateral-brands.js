/* Brand registry for the Sales Collateral Library (collateral.html) and the
   brandable one-pager (one-pager.html?brand=<slug>).

   Each entry:
     slug        — URL key (one-pager.html?brand=slug)
     name        — display name
     logo        — path to a logo file, or null to render a wordmark fallback
     logoTheme   — "light" (white logo, sits on the green masthead) or
                   "chip"  (color/dark logo, rendered inside a white chip)
     phone/web   — brand contact for the masthead + footer (corporate fallback
                   is applied at render time when null)
     eyebrow / headline / lede — page copy. Ledes may use {branches} and
                   {states} tokens; they're replaced with live counts at render.
     locBrands   — exact `brand` strings from locations-data.js; those pins are
                   highlighted on the map as the brand's own branches.

   Copy for brands with rebuilt websites was ported from each site project's
   config.json (Strategic Projects/AI/<Brand>/config.json). Copy for the rest
   is template-generated from locations data — refine freely; this file is the
   single place to edit. */
window.FC_BRANDS = [
  {
    slug: "firstcall-group",
    name: "FirstCall Group",
    logo: "shared/img/logos/firstcall-group-white.svg",
    logoTheme: "light",
    phone: "(844) 715-0220",
    web: "firstcallgroup.com",
    eyebrow: "FirstCall · Multi-Region Commercial Mechanical",
    headline: "Durable partnerships, built across the country.",
    lede: "FirstCall is a multi-region commercial mechanical service platform — HVAC, building controls, and planned maintenance — partnering with property owners and facility managers across the United States. Local brands and local crews, backed by national depth.",
    locBrands: []
  },
  {
    slug: "firstcall-mechanical",
    name: "FirstCall Mechanical",
    logo: "shared/img/logos/firstcall-mechanical-white.svg",
    logoTheme: "light",
    phone: null,
    web: "firstcallmechanical.com",
    eyebrow: "FirstCall Mechanical · Columbus · Austin · Dallas–Fort Worth",
    headline: "The FirstCall flag, flying in three metros.",
    lede: "FirstCall Mechanical operates company-flag branches in Columbus, Central Texas, and Dallas–Fort Worth — commercial HVAC, planned maintenance, and emergency service, connected to a network of {branches} branches across {states} states.",
    locBrands: ["FirstCall Mechanical — Columbus", "FirstCall Mechanical — Austin", "FirstCall Mechanical — DFW"]
  },
  {
    slug: "timco",
    name: "Timco",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "timcoair.com",
    eyebrow: "Timco · A FirstCall Company",
    headline: "Metro Atlanta's commercial HVAC team. National depth behind it.",
    lede: "Timco serves metro Atlanta and North Georgia from Buford — commercial HVAC service, planned maintenance, and emergency response, backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["Timco"]
  },
  {
    slug: "c2h",
    name: "C2H",
    logo: "assets/collateral/logos/c2h.svg",
    logoTheme: "light",
    phone: "(678) 827-1224",
    web: "c2h.com",
    eyebrow: "C2H · A FirstCall Company",
    headline: "Durable Partnerships. Built for Georgia & Tennessee.",
    lede: "Our team keeps commercial buildings running across Georgia and Tennessee — HVAC, planned maintenance, emergency response, project support, electrical, plumbing, and building controls, backed by a national platform.",
    locBrands: ["C2H"]
  },
  {
    slug: "conditioned-air",
    name: "Conditioned Air",
    logo: "assets/collateral/logos/conditioned-air.svg",
    logoTheme: "chip",
    phone: "(478) 901-2904",
    web: "conditionedairinc.com",
    eyebrow: "Conditioned Air · A FirstCall Company",
    headline: "Keeping Macon comfortable since 1938.",
    lede: "Conditioned Air is the oldest heating and air conditioning company in Middle Georgia — commercial, industrial, and residential HVAC from the same family-built team that's answered Macon's calls for almost nine decades. Now backed by FirstCall.",
    locBrands: ["Conditioned Air"]
  },
  {
    slug: "starr",
    name: "Starr Electric",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "starrelectric.biz",
    eyebrow: "Starr · A FirstCall Company",
    headline: "Middle Georgia's commercial electrical contractor.",
    lede: "Starr delivers commercial electrical service and construction across Middle Georgia from Macon — with the FirstCall network's {branches} branches across {states} states behind every project.",
    locBrands: ["Starr"]
  },
  {
    slug: "cls",
    name: "CLS Facility Services",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "clsfacilityservices.com",
    eyebrow: "CLS Facility Services · A FirstCall Company",
    headline: "Facility services for Northeast Ohio and beyond.",
    lede: "CLS Facility Services keeps facilities running from Mentor, Ohio — HVAC, mechanical, and planned maintenance programs, backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["CLS Facility Services"]
  },
  {
    slug: "rw-mechanical",
    name: "R&W Mechanical",
    logo: "assets/collateral/logos/rw-mechanical.svg",
    logoTheme: "chip",
    phone: "(828) 274-4305",
    web: "rw-mechanical.com",
    eyebrow: "R&W Mechanical · A FirstCall Company",
    headline: "Keeping the mountains comfortable since 1958.",
    lede: "For nearly seven decades, western North Carolina has relied on R&W for quality installation and service of heating, cooling, and ventilation systems — with in-house planning, our own metal fabrication shop, and the planned maintenance that keeps buildings running. Now backed by FirstCall.",
    locBrands: ["R&W Mechanical"]
  },
  {
    slug: "ctc",
    name: "Charlotte Temperature Controls",
    logo: "assets/collateral/logos/ctc.svg",
    logoTheme: "light",
    phone: "(704) 509-0707",
    web: "ctccontrols.com",
    eyebrow: "Charlotte Temperature Controls · A FirstCall Company",
    headline: "Connections That Matter. Serving the Carolinas for 35+ years.",
    lede: "Building automation and HVAC service across North and South Carolina. From hospital BAS to multi-site retail networks, we design, install, and service the controls that keep commercial buildings running. Local team. National platform.",
    locBrands: ["Charlotte Temp Controls"]
  },
  {
    slug: "str-mechanical",
    name: "STR Mechanical",
    logo: "assets/collateral/logos/str-mechanical.svg",
    logoTheme: "light",
    phone: "(704) 536-5335",
    web: "strmechanical.com",
    eyebrow: "STR Mechanical · A FirstCall Company",
    headline: "Success Through Reputation. Built for the Carolinas and Virginia.",
    lede: "STR Mechanical keeps commercial buildings running across the Carolinas, Hampton Roads, and the Upstate — HVAC, building controls, planned maintenance, and emergency service, backed by a national platform.",
    locBrands: ["STR Mechanical", "STR Mechanical — Raleigh", "STR Mechanical — Chesapeake", "STR Mechanical — Greenville"]
  },
  {
    slug: "icacs",
    name: "ICACS",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "industrialcoolinginc.com",
    eyebrow: "ICACS · A FirstCall Company",
    headline: "Industrial cooling for Long Island and the New York metro.",
    lede: "ICACS serves Long Island and metro New York from Freeport — industrial cooling, process refrigeration, and commercial HVAC, backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["ICACS (Industrial Cooling)"]
  },
  {
    slug: "kats",
    name: "KATS Solutions",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "kats.pro",
    eyebrow: "KATS Solutions · A FirstCall Company",
    headline: "Western New York's commercial mechanical team.",
    lede: "KATS Solutions serves Western New York and the Southern Tier from Wellsville — commercial mechanical and HVAC services, backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["KATS Solutions"]
  },
  {
    slug: "select",
    name: "Select",
    logo: "assets/collateral/logos/select.svg",
    logoTheme: "light",
    phone: "(631) 694-5287",
    web: "selectenv.com",
    eyebrow: "Select · A FirstCall Company",
    headline: "Long Island's commercial HVAC, controls, and refrigeration team since 1980.",
    lede: "Over four decades serving the South Shore — from cold storage at the docks to building automation in corporate campuses to ice machines behind the counter. Local crews. National platform. One call.",
    locBrands: ["Select Environmental"]
  },
  {
    slug: "mecon",
    name: "Mecon",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "meconinc.com",
    eyebrow: "Mecon · A FirstCall Company",
    headline: "Tampa Bay's commercial mechanical contractor.",
    lede: "Mecon serves Tampa Bay from Clearwater — commercial mechanical contracting and HVAC service, backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["Mecon"]
  },
  {
    slug: "kenyon",
    name: "Kenyon & Partners",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "kenyonandpartners.com",
    eyebrow: "Kenyon & Partners · A FirstCall Company",
    headline: "Commercial HVAC service for Tampa Bay.",
    lede: "Kenyon & Partners serves Tampa Bay — commercial HVAC service and mechanical contracting, backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["Kenyon & Partners"]
  },
  {
    slug: "kpi",
    name: "KPI Engineering",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "kpiengineering.com",
    eyebrow: "KPI Engineering · A FirstCall Company",
    headline: "Engineering depth for Florida's commercial facilities.",
    lede: "KPI Engineering brings mechanical engineering and design services to Tampa Bay and beyond — backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["KPI Engineering"]
  },
  {
    slug: "starnes",
    name: "Starnes",
    logo: "assets/collateral/logos/starnes.svg",
    logoTheme: "light",
    phone: "(276) 889-2410",
    web: "starnesinc.com",
    eyebrow: "Starnes · A FirstCall Company",
    headline: "Durable Partnerships. Lebanon's HVAC team since 1975.",
    lede: "Three generations of Southwest Virginia businesses have called us for commercial HVAC, refrigeration, planned maintenance, and round-the-clock emergency response. Local team. National platform.",
    locBrands: ["Starnes"]
  },
  {
    slug: "lc-anderson",
    name: "LC Anderson",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "lc-anderson.com",
    eyebrow: "LC Anderson · A FirstCall Company",
    headline: "Greater Boston's commercial HVAC partner.",
    lede: "LC Anderson serves Greater Boston — commercial HVAC service and installation, backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["LC Anderson"]
  },
  {
    slug: "optimum",
    name: "Optimum Air Solutions",
    logo: "assets/collateral/logos/optimum.svg",
    logoTheme: "light",
    phone: "(504) 912-5191",
    web: "optimumairsolutions.com",
    eyebrow: "Optimum Air Solutions · A FirstCall Company",
    headline: "Breathe easy in the Big Easy.",
    lede: "Optimum Air Solutions keeps Greater New Orleans comfortable and running — commercial, industrial, and oil & gas HVAC, plus residential service from the same crew. Belle Chasse born, Gulf Coast tested.",
    locBrands: ["Optimum Air Solutions"]
  },
  {
    slug: "statewide",
    name: "Statewide",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "statewideconditioninginc.com",
    eyebrow: "Statewide · A FirstCall Company",
    headline: "Central New Jersey's commercial HVAC team.",
    lede: "Statewide serves Central New Jersey from South Amboy — commercial HVAC and air conditioning service, backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["Statewide"]
  },
  {
    slug: "abs",
    name: "Automated Building Solutions",
    logo: null,
    logoTheme: "light",
    phone: null,
    web: "absautomation.com",
    eyebrow: "ABS · A FirstCall Company",
    headline: "Building automation and controls for New Jersey.",
    lede: "Automated Building Solutions designs, installs, and services building automation and controls from South Amboy, New Jersey — backed by the FirstCall network's {branches} branches across {states} states.",
    locBrands: ["Automated Building Solutions (ABS)"]
  },
  {
    slug: "cis",
    name: "Comfort Indoor Solutions",
    logo: "assets/collateral/logos/cis.svg",
    logoTheme: "chip",
    phone: "(630) 534-2686",
    web: "cis-hvac.com",
    eyebrow: "Comfort Indoor Solutions · A FirstCall Company",
    headline: "Keeping Chicagoland comfortable since 1978.",
    lede: "Comfort Indoor Solutions has answered Bensenville and Chicago's suburbs for nearly five decades — heating, cooling, and indoor air quality, from technicians who average more than 15 years with the company. Now backed by FirstCall.",
    locBrands: ["Comfort Indoor Solutions (CIS)"]
  }
];
