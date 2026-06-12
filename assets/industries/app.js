(() => {
  const { useState, useEffect, useRef, useCallback } = React;
  const { BUILDINGS, CAPS, EQUIP, FILTERS } = window.FCG;
  const byId = BUILDINGS.reduce((m, b) => (m[b.id] = b, m), {});
  const filterToBuilding = BUILDINGS.reduce((m, b) => (m[b.filter] = b.id, m), {});
  const NET = (() => {
    const locs = window.FC_LOCATIONS || [];
    const states = new Set(locs.map((l) => l && l.state).filter(Boolean));
    return { branches: locs.length || 26, states: states.size || 12 };
  })();
  function Panel({ building, onClose, onCTA }) {
    const closeRef = useRef(null);
    useEffect(() => {
      if (building && closeRef.current) {
        const t = setTimeout(() => closeRef.current && closeRef.current.focus(), 380);
        return () => clearTimeout(t);
      }
    }, [building]);
    const b = building;
    return /* @__PURE__ */ React.createElement(
      "aside",
      {
        className: "panel" + (b ? " open" : ""),
        role: "dialog",
        "aria-modal": "false",
        "aria-label": b ? `${b.name} capabilities` : "Capability details",
        "aria-hidden": !b
      },
      b && /* @__PURE__ */ React.createElement("div", { className: "panel-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "panel-hero" }, /* @__PURE__ */ React.createElement("button", { ref: closeRef, className: "panel-close", onClick: onClose, "aria-label": "Close panel" }, /* @__PURE__ */ React.createElement(Icons.close, null)), /* @__PURE__ */ React.createElement("div", { className: "panel-cat" }, b.category), /* @__PURE__ */ React.createElement("h2", { className: "panel-name" }, b.name), /* @__PURE__ */ React.createElement("p", { className: "panel-blurb" }, b.blurb), /* @__PURE__ */ React.createElement("h3", { className: "panel-stat-h" }, "Challenges Faced"), /* @__PURE__ */ React.createElement("div", { className: "panel-stat" }, /* @__PURE__ */ React.createElement("span", { className: "stat-val" }, b.stat.value), /* @__PURE__ */ React.createElement("span", { className: "stat-lbl" }, b.stat.label))), /* @__PURE__ */ React.createElement("h3", { className: "panel-section-h" }, "How FirstCall helps"), /* @__PURE__ */ React.createElement("div", { className: "caps" }, b.caps.map((cid) => {
        const c = CAPS[cid];
        return /* @__PURE__ */ React.createElement("div", { className: "cap-card", key: cid }, /* @__PURE__ */ React.createElement("span", { className: "cap-ic" }, /* @__PURE__ */ React.createElement(Icons.Cap, { name: c.icon })), /* @__PURE__ */ React.createElement("div", { className: "cap-body" }, /* @__PURE__ */ React.createElement("h4", null, c.name), /* @__PURE__ */ React.createElement("p", null, c.short)));
      })), /* @__PURE__ */ React.createElement("h3", { className: "panel-section-h" }, "Systems on site"), /* @__PURE__ */ React.createElement("div", { className: "equip-row" }, b.equipment.map((eid) => {
        const e = EQUIP[eid];
        return /* @__PURE__ */ React.createElement("span", { className: "equip-chip", key: eid, title: `Covered by ${CAPS[e.service].name}` }, e.label);
      })), /* @__PURE__ */ React.createElement("div", { className: "panel-cta" }, /* @__PURE__ */ React.createElement("button", { className: "btn-cta", onClick: () => onCTA(b) }, /* @__PURE__ */ React.createElement(Icons.phone, null), " Get in Touch"), /* @__PURE__ */ React.createElement("div", { className: "dispatch-line" }, "24/7 dispatch — ", /* @__PURE__ */ React.createElement("a", { href: "tel:8447150220" }, "844.715.0220"))))
    );
  }
  function Tooltip({ tip, onClose }) {
    if (!tip) return null;
    const e = EQUIP[tip.eqId];
    const svc = CAPS[e.service];
    return /* @__PURE__ */ React.createElement("div", { className: "tip" + (tip ? " show" : ""), style: { left: tip.x, top: tip.y }, role: "dialog", "aria-label": `${e.label} details` }, /* @__PURE__ */ React.createElement("button", { className: "tip-close", onClick: onClose, "aria-label": "Close" }, "×"), /* @__PURE__ */ React.createElement("div", { className: "tip-eq" }, e.label), /* @__PURE__ */ React.createElement("div", { className: "tip-spec" }, e.spec), /* @__PURE__ */ React.createElement("div", { className: "tip-div" }), /* @__PURE__ */ React.createElement("div", { className: "tip-cov" }, "Covered by"), /* @__PURE__ */ React.createElement("div", { className: "tip-svc" }, /* @__PURE__ */ React.createElement("span", { className: "tip-dot" }), /* @__PURE__ */ React.createElement("span", { className: "tip-svc-name" }, svc.name)));
  }
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
    return /* @__PURE__ */ React.createElement("div", { className: "modal-scrim" + (open ? " show" : ""), onClick: onClose, "aria-hidden": !open }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Contact FirstCall Group",
        onClick: (e) => e.stopPropagation()
      },
      !sent ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "modal-head" }, /* @__PURE__ */ React.createElement("button", { className: "panel-close", style: { position: "absolute", top: 16, right: 16 }, onClick: onClose, "aria-label": "Close" }, /* @__PURE__ */ React.createElement(Icons.close, null)), /* @__PURE__ */ React.createElement("span", { className: "ex-eyebrow" }, "Get in Touch"), /* @__PURE__ */ React.createElement("h2", { className: "modal-title" }, "Let's keep it running."), /* @__PURE__ */ React.createElement("p", { className: "modal-sub" }, "Tell us about your facility and the nearest FirstCall branch will reach out — typically within one business day.")), /* @__PURE__ */ React.createElement("form", { className: "modal-body", onSubmit: (e) => {
        e.preventDefault();
        setSent(true);
      } }, /* @__PURE__ */ React.createElement("div", { className: "field-row" }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "fc-name" }, "Name"), /* @__PURE__ */ React.createElement("input", { id: "fc-name", ref: firstRef, required: true, placeholder: "Jordan Avery" })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "fc-co" }, "Company"), /* @__PURE__ */ React.createElement("input", { id: "fc-co", required: true, placeholder: "Acme Facilities" }))), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "fc-email" }, "Work email"), /* @__PURE__ */ React.createElement("input", { id: "fc-email", type: "email", required: true, placeholder: "jordan@acme.com" })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "fc-type" }, "Facility type"), /* @__PURE__ */ React.createElement("select", { id: "fc-type", value: facility, onChange: (e) => setFacility(e.target.value) }, BUILDINGS.map((b) => /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.category }, b.category)), /* @__PURE__ */ React.createElement("option", { value: "General" }, "Other / multiple"))), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "fc-msg" }, "What do you need?"), /* @__PURE__ */ React.createElement("textarea", { id: "fc-msg", placeholder: "Planned maintenance, an emergency contract, a retrofit estimate…" })), /* @__PURE__ */ React.createElement("button", { className: "btn-cta", type: "submit" }, /* @__PURE__ */ React.createElement(Icons.phone, null), " Start a Conversation"))) : /* @__PURE__ */ React.createElement("div", { className: "modal-success" }, /* @__PURE__ */ React.createElement("div", { className: "success-ic" }, /* @__PURE__ */ React.createElement(Icons.check, null)), /* @__PURE__ */ React.createElement("h2", { className: "modal-title", style: { marginBottom: 8 } }, "Request received."), /* @__PURE__ */ React.createElement("p", { className: "modal-sub", style: { marginBottom: 22 } }, "Thanks — the nearest FirstCall branch will be in touch shortly. For urgent issues, our 24/7 dispatch line is always staffed: ", /* @__PURE__ */ React.createElement("a", { href: "tel:8447150220", style: { color: "var(--blue)", textDecoration: "none", fontWeight: 600 } }, "844.715.0220"), "."), /* @__PURE__ */ React.createElement("button", { className: "btn-cta", style: { maxWidth: 200, margin: "0 auto" }, onClick: onClose }, "Done"))
    ));
  }
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
      if (f === "All") {
        setActiveId(null);
      } else if (filterToBuilding[f]) {
        const id = filterToBuilding[f];
        setActiveId(id);
        const stage = stageRef.current;
        if (stage && stage.scrollWidth > stage.clientWidth) {
          const geoX = { office: 0.5, government: 0.6, hospital: 0.71, dataCenter: 0.41, hotel: 0.71, school: 0.31, university: 0.47, multifamily: 0.61, industrial: 0.5 }[id] || 0.5;
          stage.scrollTo({ left: geoX * stage.scrollWidth - stage.clientWidth / 2, behavior: "smooth" });
        }
      }
    }, []);
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
      const onScroll = () => {
        setTip(null);
        setHintGone(true);
      };
      stage.addEventListener("scroll", onScroll, { passive: true });
      return () => stage.removeEventListener("scroll", onScroll);
    }, []);
    return /* @__PURE__ */ React.createElement("div", { className: "explorer" }, /* @__PURE__ */ React.createElement("header", { className: "ex-header" }, /* @__PURE__ */ React.createElement("span", { className: "ex-eyebrow" }, "Industries We Serve"), /* @__PURE__ */ React.createElement("h1", { className: "ex-title" }, "Built for the buildings that matter."), /* @__PURE__ */ React.createElement("p", { className: "ex-lead" }, "FirstCall branches support the most complex, mission-critical, and technically demanding facilities in North America. Tap a building to see how the network keeps it running."), /* @__PURE__ */ React.createElement("div", { className: "net-stats" }, /* @__PURE__ */ React.createElement("b", null, NET.branches), " branches nationwide · ", /* @__PURE__ */ React.createElement("b", null, NET.states), " states served · ", /* @__PURE__ */ React.createElement("b", null, "24/7"), " emergency response")), /* @__PURE__ */ React.createElement("div", { className: "filterbar", role: "group", "aria-label": "Filter by industry" }, /* @__PURE__ */ React.createElement("span", { className: "filter-label" }, "Industry"), FILTERS.map((f) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: f,
        className: "pill" + (filter === f ? " active" : ""),
        "aria-pressed": filter === f,
        onClick: () => selectFilter(f)
      },
      f
    ))), /* @__PURE__ */ React.createElement("div", { className: "stage-wrap", ref: stageWrapRef }, /* @__PURE__ */ React.createElement("div", { className: "stage", ref: stageRef }, /* @__PURE__ */ React.createElement("div", { className: "scene-inner" }, /* @__PURE__ */ React.createElement(
      CityScene,
      {
        activeId,
        hovered,
        onHover: setHovered,
        onOpen: openBuilding,
        onEquipment,
        onContact: () => {
          setTip(null);
          setModal({ open: true, context: null });
        }
      }
    ))), !hintGone && /* @__PURE__ */ React.createElement("div", { className: "scroll-hint" }, "swipe to explore →"), /* @__PURE__ */ React.createElement("div", { className: "scrim" + (activeId ? " show" : ""), onClick: closePanel, "aria-hidden": "true" }), /* @__PURE__ */ React.createElement(
      Panel,
      {
        building: activeId ? byId[activeId] : null,
        onClose: closePanel,
        onCTA: (b) => setModal({ open: true, context: b ? b.category : null })
      }
    ), /* @__PURE__ */ React.createElement(Tooltip, { tip, onClose: () => setTip(null) })), /* @__PURE__ */ React.createElement(
      ContactModal,
      {
        open: modal.open,
        context: modal.context,
        onClose: () => setModal({ open: false, context: null })
      }
    ));
  }
  ReactDOM.createRoot(document.getElementById("fc-explorer-root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
