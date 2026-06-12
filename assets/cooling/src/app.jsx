/* How Cooling Works — app shell. Renders hero + interactive diagram + CTA
   inside #fc-cooling-root; the site header/footer are static HTML in
   how-cooling-works.html.

   internal dev/preview only — noindex, not in production nav, Cloudflare
   preview (dev branch) only. See assets/cooling/README.md.

   Prototype's Tweaks panel removed per handoff §12: stage theme, labels,
   density and glow collapse to the static FC_CFG below; speed + paused
   remain the only genuine user controls. All copy/data: assets/cooling/data.js. */

const DATA = window.FC_COOLING;
const FC_CFG = { labels: 'annotated', density: 1, glow: 1 };

function FcChip({ children }) {
  return <span className="fc-chip">{children}</span>;
}

function FcInfoCard({ id, onClose }) {
  const c = DATA.components[id];
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
        {c.services.map((s) => <FcChip key={s}>{DATA.services[s].name}</FcChip>)}
      </div>
    </div>
  );
}

/* Equipment quick-select — one button per component, since some SVG hit
   targets (VAV boxes especially) are small or partly occluded. Hover
   spotlights the component in the diagram; click opens its info card. */
function FcPicker({ selected, cardId, onHover, onSelect }) {
  return (
    <div className="fc-picker" role="group" aria-label="Equipment quick select">
      <span className="fc-picker-label">{DATA.copy.picker.label}</span>
      {Object.keys(DATA.components).map((id) => (
        <button key={id} className={'fc-picker-btn' + (cardId === id ? ' is-on' : '')}
          aria-pressed={selected === id}
          onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(id)} onBlur={() => onHover(null)}
          onClick={() => onSelect(id)}>
          {DATA.components[id].name}
        </button>
      ))}
    </div>
  );
}

function FcLegend({ T }) {
  return (
    <div className="fc-legend" aria-label="Legend">
      {DATA.copy.legend.map((i) => (
        <span key={i.loop} className="fc-legend-item">
          <span className="fc-legend-swatch" style={{ background: T[i.loop] }}></span>
          {i.label}
        </span>
      ))}
    </div>
  );
}

/* Illustrative kW/ton readout — eases toward per-mode targets from data.js.
   NOT live data (handoff §12: kept as a labeled mock; see .fc-fineprint). */
function FcReadout({ mode }) {
  const R = DATA.readout;
  const [kw, setKw] = React.useState(R.targets.normal);
  React.useEffect(() => {
    if (mode === 'failure') return;
    const target = R.targets[mode] != null ? R.targets[mode] : R.targets.normal;
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
      <span className="fc-readout-label">{R.label}</span>
      <span className="fc-readout-val">{failure ? R.faultText : kw.toFixed(2) + R.unit}</span>
      {optimized && kw > R.targets.optimized + 0.005 && <span className="fc-readout-trend">▾</span>}
    </div>
  );
}

/* Illustrative BAS telemetry — sine-noise around per-mode bases from data.js. */
function FcStatusPanel({ mode, paused, speed }) {
  const S = DATA.status;
  const [open, setOpen] = React.useState(true);
  const [tick, setTick] = React.useState(0);
  const prevRef = React.useRef({});
  React.useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => setTick((t) => t + 1), Math.max(500, Math.min(2800, 1300 / Math.max(0.2, speed || 1))));
    return () => clearInterval(iv);
  }, [paused, speed]);
  const os = (t, a, seed) => t + Math.sin(tick * 0.9 + seed) * a + Math.sin(tick * 0.37 + seed * 2.3) * a * 0.5;
  return (
    <div className="fc-status">
      <button className="fc-status-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={'fc-status-dot ' + (mode === 'failure' ? 'bad' : 'ok')}></span>
        <span>{S.title}</span>
        <span className="fc-status-chev">{open ? '▾' : '▴'}</span>
      </button>
      {open && <div className="fc-status-body">
        {S.rows.map((r) => {
          const tone = r.tone[mode] || 'ok';
          let trend = 0, valText;
          if (r.base != null) {
            const num = os(r.base[mode], r.amp[mode], r.seed);
            const prev = prevRef.current[r.name];
            const thresh = r.digits === 0 ? 0.55 : 0.13;
            trend = (prev == null || Math.abs(num - prev) < thresh) ? 0 : (num > prev ? 1 : -1);
            prevRef.current[r.name] = num;
            valText = num.toFixed(r.digits == null ? 1 : r.digits) + r.unit;
          } else {
            valText = r.text[mode];
          }
          return (
            <div className="fc-status-row" key={r.name}>
              <span className={'fc-status-dot ' + tone}></span>
              <span className="fc-status-name">{r.name}</span>
              <span className={'fc-status-val ' + tone}>{valText}</span>
              <span className="fc-rtrend-slot">
                {trend !== 0 && <span key={tick} className={'fc-rtrend ' + (trend > 0 ? 'up' : 'down')} aria-hidden="true">{trend > 0 ? '▲' : '▼'}</span>}
              </span>
            </div>
          );
        })}
        {mode === 'failure' && <div className="fc-status-note bad">{S.notes.failure}</div>}
        {mode === 'optimized' && <div className="fc-status-note ok">{S.notes.optimized}</div>}
      </div>}
    </div>
  );
}

function App() {
  const theme = DATA.theme;
  const C = DATA.copy;
  const [mode, setMode] = React.useState('normal');
  const [paused, setPaused] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [active, setActive] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const cardId = selected || active;

  return (
    <div className="fc-page">
      <header className="fc-hero">
        <div className="fc-hero-inner">
          <div className="fc-eyebrow-dark">{C.hero.eyebrow}</div>
          <h1>{C.hero.title}</h1>
          <p>{C.hero.lede}</p>
        </div>
      </header>

      <section className="fc-main">
        <div className="fc-main-inner">
          <div className="fc-section-head">
            <div className="fc-eyebrow">{C.section.eyebrow}</div>
            <h2>{C.section.title}</h2>
            <p>{C.section.sub}</p>
          </div>

          <div className="fc-controls">
            <div className="fc-seg" role="tablist" aria-label="Operating mode">
              {C.modes.map(([id, name]) => (
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
              <input type="range" min="0.2" max="2" step="0.05" value={speed} aria-label="Animation speed"
                onChange={(e) => setSpeed(+e.target.value)}></input>
              <span className="fc-motion-x">{Number(speed).toFixed(1)}×</span>
            </div>
          </div>

          <FcPicker selected={selected} cardId={cardId} onHover={setActive} onSelect={(id) => setSelected(id)}></FcPicker>

          <div className="fc-stage">
            <SystemDiagram uid="main" theme={theme} mode={mode} speed={speed} paused={paused}
              density={FC_CFG.density} glow={FC_CFG.glow} labels={FC_CFG.labels}
              active={active} selected={selected}
              onHover={setActive} onSelect={(id) => setSelected(id)}></SystemDiagram>
            <FcStatusPanel mode={mode} paused={paused} speed={speed}></FcStatusPanel>
            {cardId && <FcInfoCard id={cardId} onClose={() => { setSelected(null); setActive(null); }}></FcInfoCard>}
          </div>

          <FcLegend T={theme}></FcLegend>
          <p className="fc-fineprint">{C.fineprint}</p>
        </div>
      </section>

      <section className="fc-cta">
        <div className="fc-cta-inner">
          <div className="fc-eyebrow-dark">{C.cta.eyebrow}</div>
          <h2>{C.cta.title}</h2>
          <p>{C.cta.body}</p>
          <div className="fc-cta-btns">
            <a className="fc-btn" href={C.cta.primary.href}>{C.cta.primary.label}</a>
            <a className="fc-btn fc-btn-ghost" href={C.cta.ghost.href}>{C.cta.ghost.label}</a>
          </div>
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('fc-cooling-root')).render(<App></App>);
