// Page shell in FirstCall site format: green nav + hero, cream body, green CTA + footer

const FC_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "stageTheme": "fieldManual",
  "labels": "annotated",
  "speed": 1,
  "density": 1,
  "glow": 1,
  "loopPalette": ["#1D55C4", "#0F8A78", "#D98324", "#E8A95C"]
}/*EDITMODE-END*/;

const FC_THEME_NAMES = { 'plantRoom': 'Plant room (dark green)', 'fieldManual': 'Field manual (light)', 'nightWatch': 'Night watch (high contrast)' };

function FcChip({ children }) {
  return <span className="fc-chip">{children}</span>;
}

function FcInfoCard({ id, onClose }) {
  const c = window.FC_COMPONENTS[id];
  if (!c) return null;
  return (
    <div className="fc-card" role="dialog" aria-label={c.name}>
      <button className="fc-card-x" onClick={onClose} aria-label="Close">×</button>
      <div className="fc-card-zone">{c.zone}</div>
      <div className="fc-card-name">{c.name}</div>
      <div className="fc-card-blurb">{c.blurb}</div>
      <div className="fc-card-rule"></div>
      <div className="fc-card-covered">Covered by</div>
      <div className="fc-card-chips">
        {c.services.map((s) => <FcChip key={s}>{window.FC_SERVICES[s].name}</FcChip>)}
      </div>
    </div>
  );
}

function FcLegend({ T }) {
  const items = [
    { c: T.chw, t: 'Chilled water · supply' },
    { c: T.chwReturn, t: 'Chilled water · return' },
    { c: T.cw, t: 'Condenser water' },
    { c: T.airCool, t: 'Supply air (cool)' },
    { c: T.airWarm, t: 'Return air (warm)' },
    { c: T.signal, t: 'Controls signal' }
  ];
  return (
    <div className="fc-legend" aria-label="Legend">
      {items.map((i) => (
        <span key={i.t} className="fc-legend-item">
          <span className="fc-legend-swatch" style={{ background: i.c }}></span>
          {i.t}
        </span>
      ))}
    </div>
  );
}

function FcReadout({ mode }) {
  const [kw, setKw] = React.useState(0.61);
  React.useEffect(() => {
    if (mode === 'failure') return;
    const target = mode === 'optimized' ? 0.48 : 0.61;
    const iv = setInterval(() => {
      setKw((v) => {
        const next = v + Math.sign(target - v) * Math.min(0.0035, Math.abs(target - v));
        return Math.abs(next - target) < 0.002 ? target : next;
      });
    }, 90);
    return () => clearInterval(iv);
  }, [mode]);
  const failure = mode === 'failure';
  const optimized = mode === 'optimized';
  return (
    <div className={'fc-readout' + (failure ? ' is-bad' : optimized ? ' is-good' : '')}>
      <span className="fc-readout-dot"></span>
      <span className="fc-readout-label">PLANT EFFICIENCY</span>
      <span className="fc-readout-val">{failure ? '— FAULT' : kw.toFixed(2) + ' kW/ton'}</span>
      {optimized && kw > 0.485 && <span className="fc-readout-trend">▾</span>}
    </div>
  );
}

function FcStatusPanel({ mode, paused, speed }) {
  const [open, setOpen] = React.useState(true);
  const [tick, setTick] = React.useState(0);
  const prevRef = React.useRef({});
  React.useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => setTick((t) => t + 1), Math.max(500, Math.min(2800, 1300 / Math.max(0.2, speed || 1))));
    return () => clearInterval(iv);
  }, [paused, speed]);
  const os = (t, a, seed) => t + Math.sin(tick * 0.9 + seed) * a + Math.sin(tick * 0.37 + seed * 2.3) * a * 0.5;
  const F = mode === 'failure', O = mode === 'optimized';
  const rows = [
    { name: 'Chiller CH-1', val: F ? 'FAULT · lockout' : O ? 'running · tuned' : 'running', tone: F ? 'bad' : 'ok' },
    { name: 'CHW pumps', val: O ? '2 / 2 · trimmed' : '2 / 2 running', tone: 'ok' },
    { name: 'Cooling tower', val: F ? 'fans idle' : O ? 'fans auto' : 'fans on', tone: F ? 'warn' : 'ok' },
    { name: 'CHW supply', num: os(F ? 51.6 : O ? 44.0 : 44.2, F ? 0.6 : 0.25, 1), unit: '°F', tone: F ? 'bad' : 'ok' },
    { name: 'CHW return', num: os(F ? 57.9 : O ? 54.8 : 56.1, F ? 0.5 : 0.3, 2), unit: '°F', tone: F ? 'warn' : 'ok' },
    { name: 'Cond water', num: os(F ? 86.2 : O ? 94.1 : 94.8, F ? 0.3 : 0.5, 3), unit: '°F', tone: F ? 'warn' : 'ok' },
    { name: 'Supply air', num: os(F ? 61.5 : O ? 55.0 : 55.4, F ? 0.7 : 0.3, 4), unit: '°F', tone: F ? 'bad' : 'ok' },
    { name: 'Airflow', num: os(F ? 12 : O ? 44 : 42, F ? 1.2 : 1.6, 5), unit: ' kCFM', digits: 0, tone: F ? 'warn' : 'ok' },
    { name: 'Zone humidity', num: os(F ? 57 : O ? 45 : 48, 1.1, 6), unit: ' %RH', digits: 0, tone: F ? 'warn' : 'ok' }
  ];
  return (
    <div className="fc-status">
      <button className="fc-status-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={'fc-status-dot ' + (mode === 'failure' ? 'bad' : 'ok')}></span>
        <span>BAS · SYSTEM STATUS</span>
        <span className="fc-status-chev">{open ? '▾' : '▴'}</span>
      </button>
      {open && <div className="fc-status-body">
        {rows.map((r) => {
          let trend = 0;
          if (r.num != null) {
            const prev = prevRef.current[r.name];
            const thresh = r.digits === 0 ? 0.55 : 0.13;
            trend = (prev == null || Math.abs(r.num - prev) < thresh) ? 0 : (r.num > prev ? 1 : -1);
            prevRef.current[r.name] = r.num;
          }
          const valText = r.num != null ? r.num.toFixed(r.digits == null ? 1 : r.digits) + r.unit : r.val;
          return (
            <div className="fc-status-row" key={r.name}>
              <span className={'fc-status-dot ' + r.tone}></span>
              <span className="fc-status-name">{r.name}</span>
              <span className={'fc-status-val ' + r.tone}>{valText}</span>
              <span className="fc-rtrend-slot">
                {trend !== 0 && <span key={tick} className={'fc-rtrend ' + (trend > 0 ? 'up' : 'down')} aria-hidden="true">{trend > 0 ? '▲' : '▼'}</span>}
              </span>
            </div>
          );
        })}
        {mode === 'failure' && <div className="fc-status-note bad">FirstCall 24/7 dispatched — ETA 38 min</div>}
        {mode === 'optimized' && <div className="fc-status-note ok">Sequences tuned — savings logging</div>}
      </div>}
    </div>
  );
}

function FcWordmark() {
  return (
    <div className="fc-mark">
      <span className="fc-mark-glyph"></span>
      <span className="fc-mark-word">FirstCall<em>Group</em></span>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(FC_TWEAK_DEFAULTS);
  const baseTheme = window.FC_THEMES[t.stageTheme] || window.FC_THEMES.fieldManual;
  const lp = Array.isArray(t.loopPalette) ? t.loopPalette : [];
  const theme = Object.assign({}, baseTheme,
    lp[0] ? { chw: lp[0] } : null, lp[1] ? { chwReturn: lp[1] } : null,
    lp[2] ? { cw: lp[2] } : null, lp[3] ? { cwReturn: lp[3] } : null);
  const [mode, setMode] = React.useState('normal');
  const [paused, setPaused] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const cardId = selected || active;

  return (
    <div className="fc-page" data-screen-label="How Cooling Works">
      <nav className="fc-nav" data-screen-label="Nav">
        <FcWordmark></FcWordmark>
        <a className="fc-nav-link" href="https://firstcallgroup.com">firstcallgroup.com ↗</a>
      </nav>

      <header className="fc-hero" data-screen-label="Hero">
        <div className="fc-hero-inner">
          <div className="fc-eyebrow-dark">FirstCall &nbsp;|&nbsp; Building Systems</div>
          <h1>How commercial cooling works.</h1>
          <p>From the chiller in the basement to the tower on the roof — follow the water, refrigerant and air through a working central plant, and see which FirstCall service keeps each piece running.</p>
        </div>
      </header>

      <main className="fc-main" data-screen-label="System Diagram">
        <div className="fc-main-inner">
          <div className="fc-section-head">
            <div className="fc-eyebrow">Interactive Diagram</div>
            <h2>One system. Three zones.</h2>
            <p>Tap any component to see what it does — and which FirstCall service covers it.</p>
          </div>

          <div className="fc-controls">
            <div className="fc-seg" role="tablist" aria-label="Operating mode">
              {[['normal', 'Normal operation'], ['failure', 'Failure scenario'], ['optimized', 'Optimized']].map(([id, name]) => (
                <button key={id} role="tab" aria-selected={mode === id}
                  className={'fc-seg-btn' + (mode === id ? ' is-on' : '') + (id === 'failure' && mode === id ? ' is-bad' : '') + (id === 'optimized' && mode === id ? ' is-good' : '')}
                  onClick={() => setMode(id)}>{name}</button>
              ))}
            </div>
            <FcReadout mode={mode}></FcReadout>
            <div className="fc-motion">
              <button className="fc-play" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play animation' : 'Pause animation'}>
                {paused ? '►' : '❚❚'}
              </button>
              <input type="range" min="0.2" max="2" step="0.05" value={t.speed} aria-label="Animation speed"
                onChange={(e) => setTweak('speed', +e.target.value)}></input>
              <span className="fc-motion-x">{Number(t.speed).toFixed(1)}×</span>
            </div>
          </div>

          <div className="fc-stage" style={{ background: theme.stage, borderColor: theme.dark ? 'rgba(0,0,0,0.25)' : '#E2DCCB' }}>
            <SystemDiagram uid="main" theme={theme} mode={mode} speed={t.speed} paused={paused}
              density={t.density} glow={t.glow} labels={t.labels}
              active={active} selected={selected}
              onHover={setActive} onSelect={(id) => setSelected(id)}></SystemDiagram>
            <FcStatusPanel mode={mode} paused={paused} speed={t.speed}></FcStatusPanel>
            {cardId && <FcInfoCard id={cardId} onClose={() => { setSelected(null); setActive(null); }}></FcInfoCard>}
          </div>

          <FcLegend T={theme}></FcLegend>
        </div>
      </main>

      <section className="fc-cta" data-screen-label="CTA">
        <div className="fc-cta-inner">
          <div className="fc-eyebrow-dark">Capabilities Across The Network</div>
          <h2>Every component above is covered.</h2>
          <p>From chillers and rooftop units to building controls and emergency response — FirstCall branches deliver the full stack across every market we serve.</p>
          <div className="fc-cta-btns">
            <a className="fc-btn" href="https://firstcallgroup.com">Our Services</a>
            <a className="fc-btn fc-btn-ghost" href="https://firstcallgroup.com">24/7 Emergency Response</a>
          </div>
        </div>
      </section>

      <footer className="fc-foot" data-screen-label="Footer">
        <div className="fc-foot-inner">
          <FcWordmark></FcWordmark>
          <span className="fc-foot-caps">HVAC Services · Planned Maintenance · Emergency Services · Modernization &amp; Retrofit · Building Controls · Project Support</span>
          <span className="fc-foot-c">© 2026 FirstCall Group. All rights reserved.</span>
        </div>
      </footer>

      <TweaksPanel>
        <TweakSection label="Diagram style"></TweakSection>
        <TweakSelect label="Stage theme" value={FC_THEME_NAMES[t.stageTheme]}
          options={Object.values(FC_THEME_NAMES)}
          onChange={(v) => setTweak('stageTheme', Object.keys(FC_THEME_NAMES).find((k) => FC_THEME_NAMES[k] === v) || 'fieldManual')}></TweakSelect>
        <TweakRadio label="Labels" value={t.labels} options={['minimal', 'annotated']}
          onChange={(v) => setTweak('labels', v)}></TweakRadio>
        <TweakSection label="Motion"></TweakSection>
        <TweakSlider label="Speed" value={t.speed} min={0.2} max={2} step={0.05} unit="×"
          onChange={(v) => setTweak('speed', v)}></TweakSlider>
        <TweakSlider label="Flow density" value={t.density} min={0.4} max={2} step={0.1} unit="×"
          onChange={(v) => setTweak('density', v)}></TweakSlider>
        <TweakSlider label="Glow" value={t.glow} min={0} max={2} step={0.1} unit="×"
          onChange={(v) => setTweak('glow', v)}></TweakSlider>
        <TweakSection label="Loop colors"></TweakSection>
        <TweakColor label="Palette" value={t.loopPalette}
          options={[
            ['#1D55C4', '#0F8A78', '#D98324', '#E8A95C'],
            ['#2D6FB0', '#4FA3A3', '#B65C32', '#CE8A63'],
            ['#1D6FE0', '#0FA3A0', '#E2641F', '#EE9159']
          ]}
          onChange={(v) => setTweak('loopPalette', v)}></TweakColor>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App></App>);
