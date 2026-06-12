/* FirstCall Capability Explorer — data model
   Exposed on window.FCG. Plain script (no JSX). */
(function () {
  // ---- Capability catalog ----------------------------------------------
  const CAPS = {
    hvac: {
      id: "hvac",
      name: "HVAC Services",
      short:
        "Install, repair, and optimization of commercial HVAC — chillers, RTUs, air handlers, and VRF systems.",
      icon: "hvac",
    },
    pm: {
      id: "pm",
      name: "Planned Maintenance",
      short:
        "Programmatic service plans — predictable scheduling, transparent reporting, and asset-level tracking.",
      icon: "calendar",
    },
    emergency: {
      id: "emergency",
      name: "Emergency Services",
      short:
        "Staffed dispatch and an on-call technician roster — 24/7 response across the service territory.",
      icon: "bolt",
    },
    retrofit: {
      id: "retrofit",
      name: "Modernization & Retrofit",
      short:
        "System replacements, equipment upgrades, and energy retrofits that extend asset life and improve efficiency.",
      icon: "arrows",
    },
    controls: {
      id: "controls",
      name: "Building Controls",
      short:
        "Design, installation, and integration of building automation that cuts operating cost and improves comfort.",
      icon: "sliders",
    },
    project: {
      id: "project",
      name: "Project Support",
      short:
        "Design-build delivery for new construction, expansions, and capital projects — with the service that follows.",
      icon: "clipboard",
    },
  };

  // ---- Equipment (keyed by id) -----------------------------------------
  // service = which FirstCall capability covers it
  const EQUIP = {
    // Office
    chiller:    { id: "chiller",    label: "Air-Cooled Chiller",        spec: "1,200-ton plant",      service: "hvac" },
    coolTower:  { id: "coolTower",  label: "Cooling Tower",             spec: "Open-loop, 2-cell",    service: "pm" },
    ahuPent:    { id: "ahuPent",    label: "Penthouse Air Handler",     spec: "VAV, 60,000 CFM",      service: "controls" },
    // Hospital
    redRtu:     { id: "redRtu",     label: "Redundant Rooftop Units",   spec: "N+1 packaged RTUs",    service: "emergency" },
    medAhu:     { id: "medAhu",     label: "Medical-Grade Air Handler", spec: "HEPA, 100% O.A.",      service: "hvac" },
    generator:  { id: "generator",  label: "Emergency Generator",       spec: "2 MW standby",         service: "emergency" },
    // Data center
    crac:       { id: "crac",       label: "CRAC / CRAH Units",         spec: "Hot-aisle rows",       service: "emergency" },
    chillPlant: { id: "chillPlant", label: "Central Chiller Plant",     spec: "Redundant loop",       service: "hvac" },
    condenser:  { id: "condenser",  label: "Condenser Farm",            spec: "Air-cooled bank",      service: "pm" },
    // School
    rtu:        { id: "rtu",        label: "Packaged Rooftop Unit",     spec: "Gas/electric RTU",     service: "hvac" },
    boiler:     { id: "boiler",     label: "Boiler Flue",               spec: "Condensing boilers",   service: "pm" },
    // Industrial
    stack:      { id: "stack",      label: "Process Exhaust Stack",     spec: "High-temp vent",       service: "project" },
    processCool:{ id: "processCool",label: "Process Cooling Unit",      spec: "Closed-loop",          service: "hvac" },
    unitHeater: { id: "unitHeater", label: "Unit Heaters",              spec: "Suspended, gas",       service: "pm" },
    // Government
    antenna:    { id: "antenna",    label: "BAS Antenna Array",         spec: "Controls telemetry",   service: "controls" },
    govRtu:     { id: "govRtu",     label: "Packaged Rooftop Units",    spec: "Multi-zone RTUs",      service: "hvac" },
    // Hotel
    vrf:        { id: "vrf",        label: "VRF Condenser Bank",        spec: "Heat-recovery VRF",    service: "hvac" },
    mau:        { id: "mau",        label: "Makeup Air Unit",           spec: "Corridor & kitchen",   service: "pm" },
    // University
    centralPlant:{ id: "centralPlant",label: "Central Utility Plant",  spec: "Chillers + boilers",    service: "hvac" },
    labAhu:     { id: "labAhu",     label: "Lab Air Handler",           spec: "100% outside air",     service: "controls" },
    // Multifamily
    split:      { id: "split",      label: "Split-System Condensers",   spec: "Balcony-mounted",      service: "pm" },
    mfBoiler:   { id: "mfBoiler",   label: "Central Boiler Flue",       spec: "Heat + domestic HW",   service: "hvac" },
  };

  // ---- Buildings (verticals) -------------------------------------------
  const BUILDINGS = [
    {
      id: "office",
      name: "Class-A Office Tower",
      category: "Commercial",
      filter: "Commercial",
      blurb:
        "Tenant comfort and lease value hinge on quiet, reliable conditioning across dozens of floors — through shifting occupancy and peak summer loads.",
      stat: { value: "24 floors", label: "of multi-tenant comfort to hold steady" },
      caps: ["hvac", "controls", "pm", "retrofit"],
      equipment: ["chiller", "coolTower", "ahuPent"],
    },
    {
      id: "hospital",
      name: "Hospital & Medical Center",
      category: "Healthcare",
      filter: "Healthcare",
      blurb:
        "Operating rooms, isolation wards, and pharmacies demand precise temperature, humidity, and pressure around the clock — with zero tolerance for downtime.",
      stat: { value: "100%", label: "uptime expected on critical air systems" },
      caps: ["emergency", "pm", "hvac", "controls"],
      equipment: ["redRtu", "medAhu", "generator"],
    },
    {
      id: "dataCenter",
      name: "Data Center",
      category: "Data Centers",
      filter: "Data Centers",
      blurb:
        "Dense server loads turn cooling into a mission-critical utility. Minutes of CRAC failure risk thermal shutdown, hardware damage, and data loss.",
      stat: { value: "< 5 min", label: "of downtime before thermal risk" },
      caps: ["emergency", "hvac", "controls", "retrofit"],
      equipment: ["crac", "chillPlant", "condenser"],
    },
    {
      id: "school",
      name: "K–12 School District",
      category: "Education",
      filter: "Education",
      blurb:
        "Tight budgets, packed schedules, and indoor-air-quality mandates make efficient, low-disruption service essential — work happens nights and summers, never during class.",
      stat: { value: "1,800+", label: "students per building relying on safe air" },
      caps: ["pm", "hvac", "project", "retrofit"],
      equipment: ["rtu", "boiler"],
    },
    {
      id: "university",
      name: "University Campus",
      category: "Higher Education",
      filter: "Higher Ed",
      blurb:
        "Lecture halls, labs, dorms, and athletics — a small city of buildings, one facilities team, and a central plant that can't take a semester off.",
      stat: { value: "30+", label: "buildings tied to one central plant" },
      caps: ["hvac", "pm", "retrofit", "project"],
      equipment: ["centralPlant", "labAhu"],
    },
    {
      id: "hotel",
      name: "Hotel & Conference Center",
      category: "Hospitality",
      filter: "Hospitality",
      blurb:
        "Guest comfort is the product. Quiet rooms, reliable hot water, and fast, discreet fixes protect both reviews and revenue.",
      stat: { value: "350 keys", label: "of guest comfort riding on quiet systems" },
      caps: ["hvac", "emergency", "pm", "retrofit"],
      equipment: ["vrf", "mau"],
    },
    {
      id: "government",
      name: "Government / Federal Building",
      category: "Government",
      filter: "Government",
      blurb:
        "Energy mandates, compliance reporting, and aging central plants put facility teams under pressure to modernize — without missing a day of operations.",
      stat: { value: "30%", label: "energy-reduction targets driving retrofits" },
      caps: ["controls", "retrofit", "pm", "project"],
      equipment: ["antenna", "govRtu"],
    },
    {
      id: "multifamily",
      name: "Multifamily & Senior Living",
      category: "Multifamily",
      filter: "Multifamily",
      blurb:
        "Residents live with these systems day and night. Heat, cooling, and hot water are habitability issues — and in senior communities, a safety issue.",
      stat: { value: "400 units", label: "where heat and hot water are non-negotiable" },
      caps: ["emergency", "pm", "hvac", "retrofit"],
      equipment: ["split", "mfBoiler"],
    },
    {
      id: "industrial",
      name: "Industrial / Manufacturing",
      category: "Industrial",
      filter: "Industrial",
      blurb:
        "Process heat, ventilation, and make-up air keep production lines running and crews safe — in high-temperature, high-particulate environments that punish equipment.",
      stat: { value: "24/7", label: "production lines that can't go cold" },
      caps: ["hvac", "project", "pm", "emergency"],
      equipment: ["stack", "processCool", "unitHeater"],
    },
  ];

  // Filter order for the pill bar
  const FILTERS = [
    "All",
    "Commercial",
    "Healthcare",
    "Data Centers",
    "Education",
    "Higher Ed",
    "Hospitality",
    "Government",
    "Multifamily",
    "Industrial",
  ];

  window.FCG = { CAPS, EQUIP, BUILDINGS, FILTERS };
})();
