// FirstCall Group — How Commercial Cooling Works
// Theme definitions + component knowledge base (plain JS, no JSX)

window.FC_THEMES = {
  plantRoom: {
    id: 'plantRoom', name: 'Plant room (dark green)', dark: true,
    pageBg: '#0C2519', pageBg2: '#0A1F15',
    stage: '#081B12', stageLine: 'rgba(242,239,230,0.10)',
    ink: '#F2EFE6', inkDim: 'rgba(242,239,230,0.62)', inkFaint: 'rgba(242,239,230,0.34)',
    hairline: 'rgba(242,239,230,0.12)',
    blue: '#2E66D0', blueInk: '#9DBCF5',
    card: '#F7F5EE', cardInk: '#15281F', cardDim: '#5A6B61',
    pad: '#10301F', padSide: '#0B2316', padLine: 'rgba(242,239,230,0.10)',
    wall: '#0F2A1D', wallB: '#0D2619', wallLine: 'rgba(242,239,230,0.08)',
    slab: '#1A3A2A', slabSide: '#122B1E',
    metalA: '#4A689F', metalB: '#3A5384', metalC: '#2B3F66',
    steel: '#33486E', duct: '#5E7188', ductLite: '#46586E',
    accentY: '#E3B23C',
    pipe: '#1E3B4A',
    chw: '#57ADFF', chwReturn: '#43D6C6',
    cw: '#FF8B45', cwReturn: '#FFB877',
    air: '#C2CFD6', airReturn: '#8FA0AB',
    airCool: '#8FC8F5', airWarm: '#F5A09B',
    signal: '#52E3A4', alert: '#FF5D5D', ok: '#52E3A4',
    refrigHot: '#FF6A55', refrigCool: '#63B8FF',
    label: 'rgba(242,239,230,0.78)', labelLine: 'rgba(242,239,230,0.30)',
    glowBase: 1.0, steamO: 0.26, steamFill: '#EAF4F0',
    tint: 0.14
  },
  fieldManual: {
    id: 'fieldManual', name: 'Field manual (light)', dark: false,
    pageBg: '#F2EFE6', pageBg2: '#ECE8DB',
    stage: '#FBFAF4', stageLine: 'rgba(20,40,30,0.12)',
    ink: '#14281E', inkDim: 'rgba(20,40,30,0.66)', inkFaint: 'rgba(20,40,30,0.40)',
    hairline: 'rgba(20,40,30,0.14)',
    blue: '#1D55C4', blueInk: '#1D55C4',
    card: '#FFFFFF', cardInk: '#15281F', cardDim: '#5A6B61',
    pad: '#E2DECE', padSide: '#CDC8B4', padLine: 'rgba(20,40,30,0.16)',
    wall: '#E8E4D6', wallB: '#DFDACA', wallLine: 'rgba(20,40,30,0.10)',
    slab: '#D7D2C0', slabSide: '#C2BCA8',
    metalA: '#4A6BA5', metalB: '#3A5588', metalC: '#2B406A',
    steel: '#3A5588', duct: '#8C99A8', ductLite: '#AAB5C2',
    accentY: '#D9A126',
    pipe: '#33424E',
    chw: '#1D55C4', chwReturn: '#0F8A78',
    cw: '#D98324', cwReturn: '#E8A95C',
    air: '#76879B', airReturn: '#A4B0BD',
    airCool: '#5E84CE', airWarm: '#DC9277',
    signal: '#168A52', alert: '#D43A3A', ok: '#168A52',
    refrigHot: '#D2502F', refrigCool: '#2D63C8',
    label: 'rgba(20,40,30,0.78)', labelLine: 'rgba(20,40,30,0.30)',
    glowBase: 0.35, steamO: 0.5, steamFill: '#9FB4C4',
    tint: 0.22
  },
  nightWatch: {
    id: 'nightWatch', name: 'Night watch (high contrast)', dark: true,
    pageBg: '#05130D', pageBg2: '#040F0A',
    stage: '#030D08', stageLine: 'rgba(180,255,220,0.10)',
    ink: '#EAF6EE', inkDim: 'rgba(234,246,238,0.6)', inkFaint: 'rgba(234,246,238,0.32)',
    hairline: 'rgba(234,246,238,0.12)',
    blue: '#2E66D0', blueInk: '#9DBCF5',
    card: '#0C1F16', cardInk: '#EAF6EE', cardDim: 'rgba(234,246,238,0.6)',
    pad: '#0A1D13', padSide: '#06140D', padLine: 'rgba(180,255,220,0.12)',
    wall: '#081A11', wallB: '#06150E', wallLine: 'rgba(180,255,220,0.08)',
    slab: '#10271A', slabSide: '#0A1C12',
    metalA: '#31476B', metalB: '#263a59', metalC: '#1B2B45',
    steel: '#22364F', duct: '#4D6075', ductLite: '#37485A',
    accentY: '#FFD23F',
    pipe: '#14303D',
    chw: '#4FC3FF', chwReturn: '#3BF0DA',
    cw: '#FF7A2F', cwReturn: '#FFB877',
    air: '#C9D7DE', airReturn: '#7E919D',
    airCool: '#86D4FF', airWarm: '#FF968C',
    signal: '#3DFFA0', alert: '#FF4D4D', ok: '#3DFFA0',
    refrigHot: '#FF5C45', refrigCool: '#56C8FF',
    label: 'rgba(234,246,238,0.8)', labelLine: 'rgba(234,246,238,0.3)',
    glowBase: 1.5, steamO: 0.22, steamFill: '#DFF3EA',
    tint: 0.17
  }
};

window.FC_SERVICES = {
  hvac:   { name: 'HVAC Services' },
  pm:     { name: 'Planned Maintenance' },
  emerg:  { name: '24/7 Emergency' },
  retro:  { name: 'Modernization & Retrofit' },
  bas:    { name: 'Building Controls' },
  proj:   { name: 'Project Support' }
};

window.FC_COMPONENTS = {
  chiller: {
    zone: '01 · Central plant', name: 'Water-Cooled Chiller',
    blurb: 'Uses a refrigeration cycle to pull heat out of the chilled-water loop and hand it off to the condenser-water loop.',
    services: ['hvac', 'emerg']
  },
  refrig: {
    zone: '01 · Central plant', name: 'Refrigeration Cycle',
    blurb: 'Inside the chiller: refrigerant is compressed, condensed, expanded, then evaporated — moving heat uphill from cold water to warm water.',
    services: ['hvac']
  },
  chwPumps: {
    zone: '01 · Central plant', name: 'Chilled Water Pumps',
    blurb: 'Circulate ~44°F water from the plant out to the air handlers and back, around the clock.',
    services: ['pm']
  },
  cwPumps: {
    zone: '01 · Central plant', name: 'Condenser Water Pumps',
    blurb: 'Push warm condenser water up to the cooling tower so the building\u2019s heat can leave for good.',
    services: ['pm']
  },
  boiler: {
    zone: '01 · Central plant', name: 'Boiler (Heating Loop)',
    blurb: 'The chiller\u2019s winter counterpart — heats water for the building\u2019s heating loop. Smaller role on a cooling day.',
    services: ['hvac']
  },
  tower: {
    zone: '02 · Rooftop', name: 'Cooling Tower',
    blurb: 'Rejects the building\u2019s heat to the outdoors by evaporating a small amount of water over fill media while the fan draws air through.',
    services: ['pm']
  },
  ahu: {
    zone: '03 · The building', name: 'Air Handling Unit',
    blurb: 'Filters return air, draws it across a chilled-water coil, and fans it back out as cool, dry supply air.',
    services: ['hvac', 'retro']
  },
  duct: {
    zone: '03 · The building', name: 'Supply & Return Ductwork',
    blurb: 'Carries conditioned air up the riser to every floor, then returns it to the AHU to be cooled again.',
    services: ['proj']
  },
  vav: {
    zone: '03 · The building', name: 'VAV Boxes',
    blurb: 'Variable-air-volume boxes meter just the right amount of cool air into each zone, floor by floor.',
    services: ['bas']
  },
  basPanel: {
    zone: '03 · The building', name: 'Building Automation Panel',
    blurb: 'The plant\u2019s brain — watches every sensor, sequences the equipment, and raises the alarm the moment something drifts.',
    services: ['bas']
  },
  sensors: {
    zone: 'System-wide', name: 'Sensor Network',
    blurb: 'Temperature, pressure and flow points across the system, reporting back to the BAS in real time.',
    services: ['bas']
  }
};
