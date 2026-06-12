(() => {
  const DATA = window.FC_COOLING;
  const FC_CFG = { labels: "annotated", density: 1, glow: 1 };
  function FcChip({ children }) {
    return /* @__PURE__ */ React.createElement("span", { className: "fc-chip" }, children);
  }
  function FcInfoCard({ id, onClose }) {
    const c = DATA.components[id];
    if (!c) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "fc-card", role: "dialog", "aria-label": c.name }, /* @__PURE__ */ React.createElement("button", { className: "fc-card-x", onClick: onClose, "aria-label": "Close" }, "×"), /* @__PURE__ */ React.createElement("div", { className: "fc-card-zone" }, c.zone), /* @__PURE__ */ React.createElement("div", { className: "fc-card-name" }, c.name), /* @__PURE__ */ React.createElement("div", { className: "fc-card-blurb" }, c.blurb), /* @__PURE__ */ React.createElement("div", { className: "fc-card-rule" }), /* @__PURE__ */ React.createElement("div", { className: "fc-card-covered" }, "Covered by"), /* @__PURE__ */ React.createElement("div", { className: "fc-card-chips" }, c.services.map((s) => /* @__PURE__ */ React.createElement(FcChip, { key: s }, DATA.services[s].name))));
  }
  function FcLegend({ T }) {
    return /* @__PURE__ */ React.createElement("div", { className: "fc-legend", "aria-label": "Legend" }, DATA.copy.legend.map((i) => /* @__PURE__ */ React.createElement("span", { key: i.loop, className: "fc-legend-item" }, /* @__PURE__ */ React.createElement("span", { className: "fc-legend-swatch", style: { background: T[i.loop] } }), i.label)));
  }
  function FcReadout({ mode }) {
    const R = DATA.readout;
    const [kw, setKw] = React.useState(R.targets.normal);
    React.useEffect(() => {
      if (mode === "failure") return;
      const target = R.targets[mode] != null ? R.targets[mode] : R.targets.normal;
      const iv = setInterval(() => {
        setKw((v) => {
          const next = v + Math.sign(target - v) * Math.min(35e-4, Math.abs(target - v));
          return Math.abs(next - target) < 2e-3 ? target : next;
        });
      }, 90);
      return () => clearInterval(iv);
    }, [mode]);
    const failure = mode === "failure";
    const optimized = mode === "optimized";
    return /* @__PURE__ */ React.createElement("div", { className: "fc-readout" + (failure ? " is-bad" : optimized ? " is-good" : "") }, /* @__PURE__ */ React.createElement("span", { className: "fc-readout-dot" }), /* @__PURE__ */ React.createElement("span", { className: "fc-readout-label" }, R.label), /* @__PURE__ */ React.createElement("span", { className: "fc-readout-val" }, failure ? R.faultText : kw.toFixed(2) + R.unit), optimized && kw > R.targets.optimized + 5e-3 && /* @__PURE__ */ React.createElement("span", { className: "fc-readout-trend" }, "▾"));
  }
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
    return /* @__PURE__ */ React.createElement("div", { className: "fc-status" }, /* @__PURE__ */ React.createElement("button", { className: "fc-status-head", onClick: () => setOpen(!open), "aria-expanded": open }, /* @__PURE__ */ React.createElement("span", { className: "fc-status-dot " + (mode === "failure" ? "bad" : "ok") }), /* @__PURE__ */ React.createElement("span", null, S.title), /* @__PURE__ */ React.createElement("span", { className: "fc-status-chev" }, open ? "▾" : "▴")), open && /* @__PURE__ */ React.createElement("div", { className: "fc-status-body" }, S.rows.map((r) => {
      const tone = r.tone[mode] || "ok";
      let trend = 0, valText;
      if (r.base != null) {
        const num = os(r.base[mode], r.amp[mode], r.seed);
        const prev = prevRef.current[r.name];
        const thresh = r.digits === 0 ? 0.55 : 0.13;
        trend = prev == null || Math.abs(num - prev) < thresh ? 0 : num > prev ? 1 : -1;
        prevRef.current[r.name] = num;
        valText = num.toFixed(r.digits == null ? 1 : r.digits) + r.unit;
      } else {
        valText = r.text[mode];
      }
      return /* @__PURE__ */ React.createElement("div", { className: "fc-status-row", key: r.name }, /* @__PURE__ */ React.createElement("span", { className: "fc-status-dot " + tone }), /* @__PURE__ */ React.createElement("span", { className: "fc-status-name" }, r.name), /* @__PURE__ */ React.createElement("span", { className: "fc-status-val " + tone }, valText), /* @__PURE__ */ React.createElement("span", { className: "fc-rtrend-slot" }, trend !== 0 && /* @__PURE__ */ React.createElement("span", { key: tick, className: "fc-rtrend " + (trend > 0 ? "up" : "down"), "aria-hidden": "true" }, trend > 0 ? "▲" : "▼")));
    }), mode === "failure" && /* @__PURE__ */ React.createElement("div", { className: "fc-status-note bad" }, S.notes.failure), mode === "optimized" && /* @__PURE__ */ React.createElement("div", { className: "fc-status-note ok" }, S.notes.optimized)));
  }
  function App() {
    const theme = DATA.theme;
    const C = DATA.copy;
    const [mode, setMode] = React.useState("normal");
    const [paused, setPaused] = React.useState(false);
    const [speed, setSpeed] = React.useState(1);
    const [active, setActive] = React.useState(null);
    const [selected, setSelected] = React.useState(null);
    const cardId = selected || active;
    return /* @__PURE__ */ React.createElement("div", { className: "fc-page" }, /* @__PURE__ */ React.createElement("header", { className: "fc-hero" }, /* @__PURE__ */ React.createElement("div", { className: "fc-hero-inner" }, /* @__PURE__ */ React.createElement("div", { className: "fc-eyebrow-dark" }, C.hero.eyebrow), /* @__PURE__ */ React.createElement("h1", null, C.hero.title), /* @__PURE__ */ React.createElement("p", null, C.hero.lede))), /* @__PURE__ */ React.createElement("section", { className: "fc-main" }, /* @__PURE__ */ React.createElement("div", { className: "fc-main-inner" }, /* @__PURE__ */ React.createElement("div", { className: "fc-section-head" }, /* @__PURE__ */ React.createElement("div", { className: "fc-eyebrow" }, C.section.eyebrow), /* @__PURE__ */ React.createElement("h2", null, C.section.title), /* @__PURE__ */ React.createElement("p", null, C.section.sub)), /* @__PURE__ */ React.createElement("div", { className: "fc-controls" }, /* @__PURE__ */ React.createElement("div", { className: "fc-seg", role: "tablist", "aria-label": "Operating mode" }, C.modes.map(([id, name]) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: id,
        role: "tab",
        "aria-selected": mode === id,
        className: "fc-seg-btn" + (mode === id ? " is-on" : "") + (id === "failure" && mode === id ? " is-bad" : "") + (id === "optimized" && mode === id ? " is-good" : ""),
        onClick: () => setMode(id)
      },
      name
    ))), /* @__PURE__ */ React.createElement(FcReadout, { mode }), /* @__PURE__ */ React.createElement("div", { className: "fc-motion" }, /* @__PURE__ */ React.createElement("button", { className: "fc-play", onClick: () => setPaused(!paused), "aria-label": paused ? "Play animation" : "Pause animation" }, paused ? "►" : "❚❚"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "0.2",
        max: "2",
        step: "0.05",
        value: speed,
        "aria-label": "Animation speed",
        onChange: (e) => setSpeed(+e.target.value)
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "fc-motion-x" }, Number(speed).toFixed(1), "×"))), /* @__PURE__ */ React.createElement("div", { className: "fc-stage" }, /* @__PURE__ */ React.createElement(
      SystemDiagram,
      {
        uid: "main",
        theme,
        mode,
        speed,
        paused,
        density: FC_CFG.density,
        glow: FC_CFG.glow,
        labels: FC_CFG.labels,
        active,
        selected,
        onHover: setActive,
        onSelect: (id) => setSelected(id)
      }
    ), /* @__PURE__ */ React.createElement(FcStatusPanel, { mode, paused, speed }), cardId && /* @__PURE__ */ React.createElement(FcInfoCard, { id: cardId, onClose: () => {
      setSelected(null);
      setActive(null);
    } })), /* @__PURE__ */ React.createElement(FcLegend, { T: theme }), /* @__PURE__ */ React.createElement("p", { className: "fc-fineprint" }, C.fineprint))), /* @__PURE__ */ React.createElement("section", { className: "fc-cta" }, /* @__PURE__ */ React.createElement("div", { className: "fc-cta-inner" }, /* @__PURE__ */ React.createElement("div", { className: "fc-eyebrow-dark" }, C.cta.eyebrow), /* @__PURE__ */ React.createElement("h2", null, C.cta.title), /* @__PURE__ */ React.createElement("p", null, C.cta.body), /* @__PURE__ */ React.createElement("div", { className: "fc-cta-btns" }, /* @__PURE__ */ React.createElement("a", { className: "fc-btn", href: C.cta.primary.href }, C.cta.primary.label), /* @__PURE__ */ React.createElement("a", { className: "fc-btn fc-btn-ghost", href: C.cta.ghost.href }, C.cta.ghost.label)))));
  }
  ReactDOM.createRoot(document.getElementById("fc-cooling-root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
