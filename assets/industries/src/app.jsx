/* FirstCall Capability Explorer — app shell. Mounts CityScene + panel + modal. */
const { useState, useEffect, useRef, useCallback } = React;
const { BUILDINGS, CAPS, EQUIP, FILTERS } = window.FCG;
const byId = BUILDINGS.reduce((m, b) => ((m[b.id] = b), m), {});
const filterToBuilding = BUILDINGS.reduce((m, b) => ((m[b.filter] = b.id), m), {});

/* Network counts — same source as the rest of the site (assets/js/locations-data.js).
   Falls back to the last known numbers if the data script didn't load. */
const NET = (() => {
  const locs = window.FC_LOCATIONS || [];
  const states = new Set(locs.map((l) => l && l.state).filter(Boolean));
  return { branches: locs.length || 26, states: states.size || 12 };
})();

/* ---------- Brand mark ---------- */
function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 40 44" aria-hidden="true">
      <defs>
        <linearGradient id="hex" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2c6b3f" /><stop offset="1" stopColor="#1b4d2b" />
        </linearGradient>
      </defs>
      <path d="M20 1 L37 11 V33 L20 43 L3 33 V11 Z" fill="url(#hex)" stroke="#358350" strokeWidth="1" />
      <path d="M9 19 q11 -7 22 0" fill="none" stroke="#2f86c9" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 25 q11 -7 22 0" fill="none" stroke="#bfe0ef" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 31 q11 -7 22 0" fill="none" stroke="#2f86c9" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Side panel ---------- */
function Panel({ building, onClose, onCTA }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (building && closeRef.current) {
      const t = setTimeout(() => closeRef.current && closeRef.current.focus(), 380);
      return () => clearTimeout(t);
    }
  }, [building]);

  const b = building;
  return (
    <aside className={"panel" + (b ? " open" : "")} role="dialog" aria-modal="false"
           aria-label={b ? `${b.name} capabilities` : "Capability details"} aria-hidden={!b}>
      {b && (
        <div className="panel-scroll">
          <div className="panel-hero">
            <button ref={closeRef} className="panel-close" onClick={onClose} aria-label="Close panel">
              <Icons.close />
            </button>
            <div className="panel-cat">{b.category}</div>
            <h2 className="panel-name">{b.name}</h2>
            <p className="panel-blurb">{b.blurb}</p>
            <h3 className="panel-stat-h">Challenges Faced</h3>
            <div className="panel-stat">
              <span className="stat-val">{b.stat.value}</span>
              <span className="stat-lbl">{b.stat.label}</span>
            </div>
          </div>

          <h3 className="panel-section-h">How FirstCall helps</h3>
          <div className="caps">
            {b.caps.map((cid) => {
              const c = CAPS[cid];
              return (
                <div className="cap-card" key={cid}>
                  <span className="cap-ic"><Icons.Cap name={c.icon} /></span>
                  <div className="cap-body">
                    <h4>{c.name}</h4>
                    <p>{c.short}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="panel-section-h">Systems on site</h3>
          <div className="equip-row">
            {b.equipment.map((eid) => {
              const e = EQUIP[eid];
              return (
                <span className="equip-chip" key={eid} title={`Covered by ${CAPS[e.service].name}`}>
                  {e.label}
                </span>
              );
            })}
          </div>

          <div className="panel-cta">
            <button className="btn-cta" onClick={() => onCTA(b)}>
              <Icons.phone /> Get in Touch
            </button>
            <div className="dispatch-line">24/7 dispatch — <a href="tel:8447150220">844.715.0220</a></div>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ---------- Equipment tooltip ---------- */
function Tooltip({ tip, onClose }) {
  if (!tip) return null;
  const e = EQUIP[tip.eqId];
  const svc = CAPS[e.service];
  return (
    <div className={"tip" + (tip ? " show" : "")} style={{ left: tip.x, top: tip.y }} role="dialog" aria-label={`${e.label} details`}>
      <button className="tip-close" onClick={onClose} aria-label="Close">×</button>
      <div className="tip-eq">{e.label}</div>
      <div className="tip-spec">{e.spec}</div>
      <div className="tip-div" />
      <div className="tip-cov">Covered by</div>
      <div className="tip-svc">
        <span className="tip-dot" />
        <span className="tip-svc-name">{svc.name}</span>
      </div>
    </div>
  );
}

/* ---------- Contact modal ---------- */
function ContactModal({ open, context, onClose }) {
  const [sent, setSent] = useState(false);
  const [facility, setFacility] = useState("General");
  const firstRef = useRef(null);
  useEffect(() => {
    if (open) {
      setSent(false);
      setFacility(context || "General");
      const t = setTimeout(() => firstRef.current && firstRef.current.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [open, context]);

  return (
    <div className={"modal-scrim" + (open ? " show" : "")} onClick={onClose} aria-hidden={!open}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Contact FirstCall Group"
           onClick={(e) => e.stopPropagation()}>
        {!sent ? (
          <>
            <div className="modal-head">
              <button className="panel-close" style={{ position: "absolute", top: 16, right: 16 }} onClick={onClose} aria-label="Close">
                <Icons.close />
              </button>
              <span className="ex-eyebrow">Get in Touch</span>
              <h2 className="modal-title">Let's keep it running.</h2>
              <p className="modal-sub">Tell us about your facility and the nearest FirstCall branch will reach out — typically within one business day.</p>
            </div>
            <form className="modal-body" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="fc-name">Name</label>
                  <input id="fc-name" ref={firstRef} required placeholder="Jordan Avery" />
                </div>
                <div className="field">
                  <label htmlFor="fc-co">Company</label>
                  <input id="fc-co" required placeholder="Acme Facilities" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="fc-email">Work email</label>
                <input id="fc-email" type="email" required placeholder="jordan@acme.com" />
              </div>
              <div className="field">
                <label htmlFor="fc-type">Facility type</label>
                <select id="fc-type" value={facility} onChange={(e) => setFacility(e.target.value)}>
                  {BUILDINGS.map((b) => <option key={b.id} value={b.category}>{b.category}</option>)}
                  <option value="General">Other / multiple</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="fc-msg">What do you need?</label>
                <textarea id="fc-msg" placeholder="Planned maintenance, an emergency contract, a retrofit estimate…" />
              </div>
              <button className="btn-cta" type="submit"><Icons.phone /> Start a Conversation</button>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <div className="success-ic"><Icons.check /></div>
            <h2 className="modal-title" style={{ marginBottom: 8 }}>Request received.</h2>
            <p className="modal-sub" style={{ marginBottom: 22 }}>Thanks — the nearest FirstCall branch will be in touch shortly. For urgent issues, our 24/7 dispatch line is always staffed: <a href="tel:8447150220" style={{ color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>844.715.0220</a>.</p>
            <button className="btn-cta" style={{ maxWidth: 200, margin: "0 auto" }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [activeId, setActiveId] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [filter, setFilter] = useState("All");
  const [tip, setTip] = useState(null);
  const [modal, setModal] = useState({ open: false, context: null });
  const [hintGone, setHintGone] = useState(false);
  const stageWrapRef = useRef(null);
  const stageRef = useRef(null);

  const openBuilding = useCallback((id) => {
    setActiveId(id);
    setTip(null);
    setFilter(byId[id].filter);
  }, []);

  const closePanel = useCallback(() => {
    setActiveId(null);
    setFilter("All");
  }, []);

  const onEquipment = useCallback((eqId, e) => {
    const wrap = stageWrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    let x = e.clientX - r.left;
    const y = e.clientY - r.top;
    x = Math.max(120, Math.min(r.width - 120, x));
    setTip({ eqId, x, y });
  }, []);

  const selectFilter = useCallback((f) => {
    setFilter(f);
    setTip(null);
    if (f === "All") { setActiveId(null); }
    else if (filterToBuilding[f]) {
      const id = filterToBuilding[f];
      setActiveId(id);
      // center the building on mobile pan
      const stage = stageRef.current;
      if (stage && stage.scrollWidth > stage.clientWidth) {
        const geoX = { office: 0.5, government: 0.6, hospital: 0.71, dataCenter: 0.41, hotel: 0.71, school: 0.31, university: 0.47, multifamily: 0.61, industrial: 0.5 }[id] || 0.5;
        stage.scrollTo({ left: geoX * stage.scrollWidth - stage.clientWidth / 2, behavior: "smooth" });
      }
    }
  }, []);

  // Esc closes things; scroll closes tooltip
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (modal.open) setModal({ open: false, context: null });
      else if (tip) setTip(null);
      else if (activeId) closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal.open, tip, activeId, closePanel]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onScroll = () => { setTip(null); setHintGone(true); };
    stage.addEventListener("scroll", onScroll, { passive: true });
    return () => stage.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="explorer">
      <header className="ex-header">
        <span className="ex-eyebrow">Industries We Serve</span>
        <h1 className="ex-title">Built for the buildings that matter.</h1>
        <p className="ex-lead">FirstCall branches support the most complex, mission-critical, and technically demanding facilities in North America. Tap a building to see how the network keeps it running.</p>
        <div className="net-stats"><b>{NET.branches}</b> branches nationwide · <b>{NET.states}</b> states served · <b>24/7</b> emergency response</div>
      </header>

      <div className="filterbar" role="group" aria-label="Filter by industry">
        <span className="filter-label">Industry</span>
        {FILTERS.map((f) => (
          <button key={f} className={"pill" + (filter === f ? " active" : "")}
                  aria-pressed={filter === f} onClick={() => selectFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="stage-wrap" ref={stageWrapRef}>
        <div className="stage" ref={stageRef}>
          <div className="scene-inner">
            <CityScene
              activeId={activeId} hovered={hovered}
              onHover={setHovered} onOpen={openBuilding} onEquipment={onEquipment}
              onContact={() => { setTip(null); setModal({ open: true, context: null }); }} />
          </div>
        </div>
        {!hintGone && <div className="scroll-hint">swipe to explore →</div>}

        <div className={"scrim" + (activeId ? " show" : "")} onClick={closePanel} aria-hidden="true" />
        <Panel building={activeId ? byId[activeId] : null} onClose={closePanel}
               onCTA={(b) => setModal({ open: true, context: b ? b.category : null })} />
        <Tooltip tip={tip} onClose={() => setTip(null)} />
      </div>

      <ContactModal open={modal.open} context={modal.context}
                    onClose={() => setModal({ open: false, context: null })} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("fc-explorer-root")).render(<App />);
