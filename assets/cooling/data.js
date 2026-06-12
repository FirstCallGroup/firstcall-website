/* How Commercial Cooling Works — ALL editable content + diagram theme.
   Plain JS, served as-is (no build step). Edit and refresh.

   Everything marketing might touch lives here: page copy, component
   knowledge base, service names, mode names, legend labels, BAS status
   rows, readout targets. Scene/render code is in src/*.jsx (compiled).

   NOTE: all telemetry numbers below are ILLUSTRATIVE — synthesized
   client-side for storytelling. Nothing is wired to a real BAS. */

window.FC_COOLING = {

  /* ---- Diagram theme (single theme: "fieldManual" light, per handoff).
     Loop colors are functional color-coding from the design spec;
     page chrome colors live in the page CSS as site tokens. ---- */
  theme: {
    id: 'fieldManual', dark: false,
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

  /* ---- Service display names (chips on the info card) ---- */
  services: {
    hvac:  { name: 'HVAC Services' },
    pm:    { name: 'Planned Maintenance' },
    emerg: { name: '24/7 Emergency' },
    retro: { name: 'Modernization & Retrofit' },
    bas:   { name: 'Building Controls' },
    proj:  { name: 'Project Support' }
  },

  /* ---- Component knowledge base (tap a component → info card) ---- */
  components: {
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
      blurb: 'Push warm condenser water up to the cooling tower so the building’s heat can leave for good.',
      services: ['pm']
    },
    boiler: {
      zone: '01 · Central plant', name: 'Boiler (Heating Loop)',
      blurb: 'The chiller’s winter counterpart — heats water for the building’s heating loop. Smaller role on a cooling day.',
      services: ['hvac']
    },
    tower: {
      zone: '02 · Rooftop', name: 'Cooling Tower',
      blurb: 'Rejects the building’s heat to the outdoors by evaporating a small amount of water over fill media while the fan draws air through.',
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
      blurb: 'The plant’s brain — watches every sensor, sequences the equipment, and raises the alarm the moment something drifts.',
      services: ['bas']
    },
    sensors: {
      zone: 'System-wide', name: 'Sensor Network',
      blurb: 'Temperature, pressure and flow points across the system, reporting back to the BAS in real time.',
      services: ['bas']
    }
  },

  /* ---- Page copy ---- */
  copy: {
    hero: {
      eyebrow: 'FirstCall  |  Building Systems',
      title: 'How commercial cooling works.',
      lede: 'From the chiller in the basement to the tower on the roof — follow the water, refrigerant and air through a working central plant, and see which FirstCall service keeps each piece running.'
    },
    section: {
      eyebrow: 'Interactive Diagram',
      title: 'One system. Three zones.',
      sub: 'Tap any component to see what it does — and which FirstCall service covers it.'
    },
    modes: [
      ['normal', 'Normal operation'],
      ['failure', 'Failure scenario'],
      ['optimized', 'Optimized']
    ],
    legend: [
      { loop: 'chw',       label: 'Chilled water · supply' },
      { loop: 'chwReturn', label: 'Chilled water · return' },
      { loop: 'cw',        label: 'Condenser water' },
      { loop: 'airCool',   label: 'Supply air (cool)' },
      { loop: 'airWarm',   label: 'Return air (warm)' },
      { loop: 'signal',    label: 'Controls signal' }
    ],
    fineprint: 'Readouts and telemetry are illustrative — not live building data.',
    cta: {
      eyebrow: 'Capabilities Across The Network',
      title: 'Every component above is covered.',
      body: 'From chillers and rooftop units to building controls and emergency response — FirstCall branches deliver the full stack across every market we serve.',
      primary: { label: 'Our Services', href: 'index.html#capabilities-heading' },
      ghost:   { label: '24/7 Emergency Response', href: 'contact.html' }
    }
  },

  /* ---- Plant-efficiency readout (illustrative) ---- */
  readout: {
    label: 'PLANT EFFICIENCY',
    unit: ' kW/ton',
    faultText: '— FAULT',
    targets: { normal: 0.61, optimized: 0.48 }
  },

  /* ---- BAS status panel (illustrative pseudo-telemetry).
     Text rows: `text` per mode. Numeric rows: `base` per mode + `amp`
     (sine-noise amplitude) + `seed`; values synthesized in app.js. ---- */
  status: {
    title: 'BAS · SYSTEM STATUS',
    rows: [
      { name: 'Chiller CH-1',  text: { normal: 'running', failure: 'FAULT · lockout', optimized: 'running · tuned' },
        tone: { normal: 'ok', failure: 'bad', optimized: 'ok' } },
      { name: 'CHW pumps',     text: { normal: '2 / 2 running', failure: '2 / 2 running', optimized: '2 / 2 · trimmed' },
        tone: { normal: 'ok', failure: 'ok', optimized: 'ok' } },
      { name: 'Cooling tower', text: { normal: 'fans on', failure: 'fans idle', optimized: 'fans auto' },
        tone: { normal: 'ok', failure: 'warn', optimized: 'ok' } },
      { name: 'CHW supply',    base: { normal: 44.2, failure: 51.6, optimized: 44.0 }, amp: { normal: 0.25, failure: 0.6, optimized: 0.25 },
        seed: 1, unit: '°F', tone: { normal: 'ok', failure: 'bad', optimized: 'ok' } },
      { name: 'CHW return',    base: { normal: 56.1, failure: 57.9, optimized: 54.8 }, amp: { normal: 0.3, failure: 0.5, optimized: 0.3 },
        seed: 2, unit: '°F', tone: { normal: 'ok', failure: 'warn', optimized: 'ok' } },
      { name: 'Cond water',    base: { normal: 94.8, failure: 86.2, optimized: 94.1 }, amp: { normal: 0.5, failure: 0.3, optimized: 0.5 },
        seed: 3, unit: '°F', tone: { normal: 'ok', failure: 'warn', optimized: 'ok' } },
      { name: 'Supply air',    base: { normal: 55.4, failure: 61.5, optimized: 55.0 }, amp: { normal: 0.3, failure: 0.7, optimized: 0.3 },
        seed: 4, unit: '°F', tone: { normal: 'ok', failure: 'bad', optimized: 'ok' } },
      { name: 'Airflow',       base: { normal: 42, failure: 12, optimized: 44 }, amp: { normal: 1.6, failure: 1.2, optimized: 1.6 },
        seed: 5, unit: ' kCFM', digits: 0, tone: { normal: 'ok', failure: 'warn', optimized: 'ok' } },
      { name: 'Zone humidity', base: { normal: 48, failure: 57, optimized: 45 }, amp: { normal: 1.1, failure: 1.1, optimized: 1.1 },
        seed: 6, unit: ' %RH', digits: 0, tone: { normal: 'ok', failure: 'warn', optimized: 'ok' } }
    ],
    notes: {
      failure: 'FirstCall 24/7 dispatched — ETA 38 min',
      optimized: 'Sequences tuned — savings logging'
    }
  }
};
