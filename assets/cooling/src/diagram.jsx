// SystemDiagram — scene assembly, pipes, flow engine, sensors, modes, interaction
// Ported from design_handoff_chiller_graphic; visuals unchanged. One deliberate
// a11y deviation from the prototype: repeated duct/vav groups render with
// focusable={false} so each logical component is exactly ONE focus stop
// (hover/click still work on every segment).

function hexLerp(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) + ((((pb >> 16) & 255) - ((pa >> 16) & 255)) * t));
  const g = Math.round(((pa >> 8) & 255) + ((((pb >> 8) & 255) - ((pa >> 8) & 255)) * t));
  const bl = Math.round((pa & 255) + (((pb & 255) - (pa & 255)) * t));
  return `rgb(${r},${g},${bl})`;
}

function startFlowEngine(svg, optsRef) {
  const NS = 'http://www.w3.org/2000/svg';
  const layer = svg.querySelector('[data-particle-layer]');
  if (!layer) return () => {};
  while (layer.firstChild) layer.removeChild(layer.firstChild);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paths = Array.prototype.slice.call(svg.querySelectorAll('path[data-flow]'));
  const sys = paths.map((p) => {
    const len = p.getTotalLength();
    const o = optsRef.current;
    const kind = p.dataset.kind || 'dot';
    const baseN = +p.dataset.n || 8;
    const n = Math.max(1, Math.round(baseN * (kind === 'ping' ? 1 : o.density)));
    const gap = len * (+p.dataset.gapx || 0);
    const parts = [];
    for (let i = 0; i < n; i++) {
      let el;
      if (kind === 'chevron') {
        el = document.createElementNS(NS, 'path');
        el.setAttribute('d', 'M-5,-4.2 L4,0 L-5,4.2');
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', p.dataset.color);
        el.setAttribute('stroke-width', '2.6');
        el.setAttribute('stroke-linecap', 'round');
        el.setAttribute('stroke-linejoin', 'round');
      } else {
        el = document.createElementNS(NS, 'circle');
        el.setAttribute('r', p.dataset.size || 2.7);
        el.setAttribute('fill', p.dataset.color);
      }
      el.setAttribute('opacity', kind === 'chevron' ? '0.8' : '0.95');
      layer.appendChild(el);
      parts.push({ el, L: (i / n) * (len + gap) });
    }
    return { p, len, gap, parts, kind, loop: p.dataset.loop, hot: p.dataset.hot, cool: p.dataset.cool, speed: +p.dataset.speed || 50 };
  });
  const cur = { chw: 1, cw: 1, refrig: 1, air: 1, signal: 1, alarm: 0 };

  function place(s, pt) {
    if (pt.L > s.len) { pt.el.setAttribute('display', 'none'); return; }
    pt.el.removeAttribute('display');
    const L2 = Math.max(0, Math.min(s.len, pt.L));
    const pos = s.p.getPointAtLength(L2);
    if (s.kind === 'chevron') {
      const pos2 = s.p.getPointAtLength(Math.min(s.len, L2 + 3));
      const ang = Math.atan2(pos2.y - pos.y, pos2.x - pos.x) * 180 / Math.PI;
      pt.el.setAttribute('transform', `translate(${pos.x.toFixed(1)},${pos.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    } else {
      pt.el.setAttribute('cx', pos.x.toFixed(1));
      pt.el.setAttribute('cy', pos.y.toFixed(1));
    }
    if (s.kind === 'refrig') {
      const f = L2 / s.len; let c;
      if (f < 0.13) c = hexLerp(s.cool, s.hot, f / 0.13);
      else if (f < 0.52) c = s.hot;
      else if (f < 0.58) c = hexLerp(s.hot, s.cool, (f - 0.52) / 0.06);
      else c = s.cool;
      pt.el.setAttribute('fill', c);
    }
    if (s.kind === 'ping') {
      const f = L2 / s.len;
      pt.el.setAttribute('opacity', String((0.95 * Math.min(1, f * 7) * Math.min(1, (1 - f) * 7)).toFixed(2)));
    }
  }

  if (reduced) {
    sys.forEach((s) => s.parts.forEach((pt) => { pt.L = pt.L % Math.max(1, s.len); place(s, pt); }));
    return () => { while (layer.firstChild) layer.removeChild(layer.firstChild); };
  }
  let raf, last = performance.now(), alive = true;
  function frame(now) {
    if (!alive) return;
    const o = optsRef.current;
    const dt = Math.min(0.06, (now - last) / 1000); last = now;
    Object.keys(cur).forEach((k) => {
      const t = o.targets[k] != null ? o.targets[k] : 1;
      cur[k] += (t - cur[k]) * Math.min(1, dt * 1.8);
    });
    const g = o.paused ? 0 : o.speed;
    sys.forEach((s) => {
      if (s.loop === 'alarm' && cur.alarm < 0.05) { s.parts.forEach((pt) => pt.el.setAttribute('display', 'none')); return; }
      const v = g * (cur[s.loop] != null ? cur[s.loop] : 1) * s.speed;
      s.parts.forEach((pt) => { pt.L = (pt.L + v * dt) % (s.len + s.gap); place(s, pt); });
    });
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => { alive = false; cancelAnimationFrame(raf); while (layer.firstChild) layer.removeChild(layer.firstChild); };
}

// ---- pipe with glow + casing + colored core + hidden flow path
function Pipe({ pts, d, r = 4, color, casing, glow = 0, flow, square }) {
  const dd = d || isoPath(pts);
  const cap = square ? 'butt' : 'round';
  return (
    <g strokeLinejoin="round" fill="none">
      {glow > 0.05 && <path d={dd} stroke={color} strokeWidth={r * 2 + 8} opacity={0.08 + 0.13 * glow} filter={`url(#${flow ? flow.uid : 'main'}-glow)`} strokeLinecap={cap}></path>}
      <path d={dd} stroke={casing} strokeWidth={r * 2 + 2.6} strokeLinecap={cap}></path>
      <path d={dd} stroke={color} strokeWidth={Math.max(1.6, r * 2 - 2.4)} opacity="0.92" strokeLinecap={cap}></path>
      {flow && <path d={dd} stroke="none"
        data-flow={flow.id} data-loop={flow.loop} data-color={flow.color || color}
        data-n={flow.n} data-speed={flow.speed} data-kind={flow.kind} data-size={flow.size}
        data-gapx={flow.gapx} data-hot={flow.hot} data-cool={flow.cool}></path>}
    </g>
  );
}

function Label({ x, y, z, dx = 0, dy = -20, text, anchor = 'start', T }) {
  const [sx, sy] = isoXY(x, y, z);
  return (
    <g>
      <line x1={sx} y1={sy} x2={sx + dx} y2={sy + dy} stroke={T.labelLine} strokeWidth="1"></line>
      <circle cx={sx} cy={sy} r="1.8" fill={T.labelLine}></circle>
      <text x={sx + dx + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0)} y={sy + dy + (dy < 0 ? -4 : 11)}
        fontSize="10.5" letterSpacing="1.2" fill={T.label} textAnchor={anchor}
        fontFamily="'IBM Plex Mono', monospace">{text}</text>
    </g>
  );
}

// Interaction wrapper. focusable=false keeps hover/click + dim visuals on a
// segment but takes it out of the tab order (used for the repeated per-floor
// duct/vav segments so each logical component is a single focus stop).
function Comp({ id, children, on, onHover, onSelect, label, focusable = true }) {
  const a11y = focusable
    ? { tabIndex: 0, role: 'button', 'aria-label': label }
    : { 'aria-hidden': true };
  return (
    <g data-comp={id} className={on ? 'fc-on' : ''} {...a11y}
      onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)} onBlur={() => onHover(null)}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id); } }}>
      {children}
    </g>
  );
}

const FC_TARGETS = {
  normal: { chw: 1, cw: 1, refrig: 1, air: 1, signal: 1, alarm: 0 },
  failure: { chw: 0.05, cw: 0.12, refrig: 0.02, air: 0.3, signal: 1.7, alarm: 1 },
  optimized: { chw: 1.12, cw: 1.12, refrig: 1.05, air: 1.1, signal: 1.35, alarm: 0 }
};

const FC_SENSORS = [
  { id: 's1', pt: [174, 84, 104] },
  { id: 's2', pt: [470, 140, 26] },
  { id: 's3', pt: [392, 154, 46] },
  { id: 's4', pt: [765, 96, 452] },
  { id: 's5', pt: [857, 140, 130] },
  { id: 's6', pt: [681, 150, 228] }
];
const FC_BAS_ANCHOR = [255, 203, 58];

// Refrigeration-cycle inset detail (screen-space, top-right sky; absolute coords so flow dots track it)
function RefrigDetail({ T, uid, annotated }) {
  const loopD = 'M852,28 V-10 Q852,-14 848,-14 H746 Q742,-14 742,-10 V30 Q742,34 746,34 H848 Q852,34 852,30 Z';
  return (
    <g>
      <rect x={720} y={-46} width={166} height={118} rx={10} fill={T.stage} opacity="0.92"></rect>
      <rect x={720} y={-46} width={166} height={118} rx={10} fill="none" stroke={T.hairline} strokeWidth="1" strokeDasharray="3 4"></rect>
      <text x={803} y={-30} fontSize="8" letterSpacing="2" fill={T.inkDim} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace">REFRIGERATION CYCLE</text>
      <text x={803} y={64} fontSize="6.5" letterSpacing="1.5" fill={T.inkFaint} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace">INSIDE CHILLER CH-1</text>
      <Pipe d={loopD} r={2.4} color={shade(T.pipe, 0.25)} casing={T.pipe}
        flow={{ uid, id: 'refrig', loop: 'refrig', n: 8, speed: 26, size: 2.3, kind: 'refrig', hot: T.refrigHot, cool: T.refrigCool }}></Pipe>
      <g transform="translate(852,9)">
        <circle r="6.5" fill={T.metalC} stroke={shade(T.metalC, 0.4)} strokeWidth="1.2"></circle>
        <path d="M-2.5,-3 L3.5,0 L-2.5,3 Z" fill={T.refrigHot}></path>
      </g>
      <g transform="translate(742,10)">
        <rect x="-4.6" y="-4.6" width="9.2" height="9.2" fill={T.metalC} stroke={shade(T.metalC, 0.4)} strokeWidth="1.2" transform="rotate(45)"></rect>
      </g>
      {annotated && <g fontFamily="'IBM Plex Mono', monospace" fontSize="7.5" fill={T.inkFaint} letterSpacing="0.5">
        <text x={797} y={-19} textAnchor="middle">COND</text>
        <text x={797} y={47} textAnchor="middle">EVAP</text>
        <text x={860} y={12}>COMP</text>
        <text x={734} y={13} textAnchor="end">TXV</text>
      </g>}
    </g>
  );
}

function SystemDiagram(props) {
  const { uid = 'main', theme, mode = 'normal', speed = 1, paused = false, density = 1,
    glow = 1, labels = 'annotated', chwColor, cwColor, active = null, selected = null,
    onHover = () => {}, onSelect = () => {} } = props;

  const T = Object.assign({}, theme, {
    chw: chwColor || theme.chw,
    cw: cwColor || theme.cw
  });
  const effGlow = glow * T.glowBase;
  const svgRef = React.useRef(null);
  const optsRef = React.useRef({});
  optsRef.current = { speed, paused, density, targets: FC_TARGETS[mode] || FC_TARGETS.normal };

  React.useEffect(() => {
    if (!svgRef.current) return;
    return startFlowEngine(svgRef.current, optsRef);
  }, [density, T.id, T.chw, T.cw, T.chwReturn, T.cwReturn]);

  const hl = active || selected;
  const on = (id) => hl === id;
  const annotated = labels === 'annotated';
  const failure = mode === 'failure';
  const optimized = mode === 'optimized';
  const tintOp = failure ? 0.02 : (T.tint * 0.75) + (optimized ? 0.04 : 0);

  // pipe routes (model space) — rack uses elevated jump-overs (staggered z) so no flat crossings
  // pipe routes — elevated jump-overs; nozzles enter the waterboxes off-center (supply low, return high)
  const chwS = [[212, 94, 26], [266, 94, 20], [266, 140, 20], [700, 140, 20], [724, 140, 34]];
  const chwR = [[724, 162, 34], [700, 162, 20], [284, 162, 20], [284, 162, 54], [284, 114, 54], [212, 114, 54]];
  const cwS = [[212, 58, 60], [300, 58, 60], [300, 200, 60], [300, 200, 20], [640, 200, 20], [640, 200, 408], [640, 176, 408], [716, 176, 408], [716, 171, 408]];
  const cwR = [[706, 174, 376], [650, 174, 376], [650, 224, 376], [650, 224, 22], [316, 224, 22], [316, 224, 46], [316, 76, 46], [212, 76, 32]];
  const airSup = (z) => [[857, 147, 86], [857, 147, z], [990, 147, z]];
  const airRet = [[992, 174, 240], [954, 174, 240], [954, 174, 56], [886, 174, 56]];

  const A = isoXY(FC_BAS_ANCHOR[0], FC_BAS_ANCHOR[1], FC_BAS_ANCHOR[2]);
  const ctx = { uid, theme: T };
  const chiSh = isoXY(126, 84, 0);

  return (
    <IsoCtx.Provider value={ctx}>
      <svg ref={svgRef} viewBox="0 -40 1140 764" role="img"
        aria-label="Animated diagram of a commercial cooling system: central plant, rooftop cooling tower, and building air distribution"
        className={(hl ? 'fc-hasactive ' : '') + (paused ? 'fc-paused' : '')}
        style={{ display: 'block', width: '100%', height: 'auto', '--spinDur': (4.6 / Math.max(0.12, speed * (failure ? 0.45 : 1))) + 's' }}
        onClick={() => onSelect(null)}>
        <defs>
          <filter id={uid + '-glow'} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation={1.1 + 1.9 * Math.max(0.05, effGlow)}></feGaussianBlur>
          </filter>
        </defs>
        <g transform="translate(230,56)">
          {/* ground pad (plant only — tower lives on the roof) */}
          <g data-dimmable="1">
            <IsoBox x={10} y={44} z={-12} w={430} d={206} h={12} fill={T.pad} frontFill={T.padSide} sideFill={shade(T.padSide, -0.2)} stroke={T.padLine} sw={1}></IsoBox>
          </g>
          <g data-dimmable="2"><EqBuildingShell></EqBuildingShell></g>

          <Comp id="basPanel" on={on('basPanel')} onHover={onHover} onSelect={onSelect} label="Building automation panel">
            <EqBAS mode={mode}></EqBAS>
          </Comp>

          {/* soft grounding shadows */}
          <g data-dimmable="sh" fill="rgba(0,0,0,0.09)">
            <polygon points={isoPoly([[24, 40, 0.5], [232, 40, 0.5], [232, 134, 0.5], [24, 134, 0.5]])}></polygon>
            <polygon points={isoPoly([[34, 174, 0.5], [100, 174, 0.5], [100, 236, 0.5], [34, 236, 0.5]])}></polygon>
            <polygon points={isoPoly([[230, 186, 0.5], [282, 186, 0.5], [282, 220, 0.5], [230, 220, 0.5]])}></polygon>
          </g>

          {/* fault halo under chiller */}
          {failure && <ellipse className="fc-fault" cx={chiSh[0]} cy={chiSh[1]} rx={140} ry={62} fill={T.alert} filter={`url(#${uid}-glow)`}></ellipse>}

          {/* failure leader anchors to the chiller compressor sensor */}
          {/* water piping */}
          <g data-dimmable="3">
            <Pipe pts={chwS} r={4} color={T.chw} casing={T.pipe} glow={effGlow}
              flow={{ uid, id: 'chwS', loop: 'chw', n: 13, speed: 55, size: 2.7 }}></Pipe>
            <Pipe pts={chwR} r={4} color={T.chwReturn} casing={T.pipe} glow={effGlow}
              flow={{ uid, id: 'chwR', loop: 'chw', n: 13, speed: 55, size: 2.7 }}></Pipe>
            <Pipe pts={cwS} r={4} color={T.cw} casing={T.pipe} glow={effGlow}
              flow={{ uid, id: 'cwS', loop: 'cw', n: 11, speed: 52, size: 2.7 }}></Pipe>
            <Pipe pts={cwR} r={4} color={T.cwReturn} casing={T.pipe} glow={effGlow}
              flow={{ uid, id: 'cwR', loop: 'cw', n: 11, speed: 52, size: 2.7 }}></Pipe>
          </g>

          <Comp id="chwPumps" on={on('chwPumps')} onHover={onHover} onSelect={onSelect} label="Chilled water pumps">
            <EqPump cx={340} cy={162}></EqPump><EqPump cx={392} cy={162}></EqPump>
          </Comp>
          <Comp id="cwPumps" on={on('cwPumps')} onHover={onHover} onSelect={onSelect} label="Condenser water pumps">
            <EqPump cx={340} cy={224}></EqPump><EqPump cx={392} cy={224}></EqPump>
          </Comp>
          <Comp id="boiler" on={on('boiler')} onHover={onHover} onSelect={onSelect} label="Boiler, heating loop">
            <EqBoiler></EqBoiler>
          </Comp>
          <Comp id="chiller" on={on('chiller')} onHover={onHover} onSelect={onSelect} label="Water-cooled chiller">
            <EqChiller></EqChiller>
          </Comp>

          {/* AHU then ductwork + floors, drawn floor by floor for correct occlusion */}
          <Comp id="ahu" on={on('ahu')} onHover={onHover} onSelect={onSelect} label="Air handling unit">
            <EqAHU></EqAHU>
          </Comp>
          <Comp id="duct" on={on('duct')} onHover={onHover} onSelect={onSelect} label="Supply and return ductwork">
            {/* supply plenum on AHU top + return connector + return riser (mech level) */}
            <IsoBox x={843} y={133} z={96} w={28} d={28} h={24} fill={T.duct}></IsoBox>
            <IsoBox x={878} y={162} z={46} w={68} d={18} h={18} fill={T.ductLite}></IsoBox>
            <IsoBox x={944} y={164} z={46} w={20} d={20} h={74} fill={T.ductLite}></IsoBox>
          </Comp>

          {/* floor 1 */}
          <g data-dimmable="4">
            <EqSlab z={120}></EqSlab>
            <EqFloorTint z={120} color={T.chw} op={tintOp}></EqFloorTint>
            {optimized && <EqFloorTint z={120} color={T.signal} op={0.05}></EqFloorTint>}
          </g>
          <Comp id="duct" focusable={false} on={on('duct')} onHover={onHover} onSelect={onSelect} label="Supply and return ductwork">
            <IsoBox x={843} y={133} z={128} w={28} d={28} h={64} fill={T.duct}></IsoBox>
            <IsoBox x={944} y={164} z={128} w={20} d={20} h={64} fill={T.ductLite}></IsoBox>
            <IsoBox x={871} y={142} z={169} w={126} d={14} h={14} fill={T.duct}></IsoBox>
          </Comp>
          <Comp id="vav" on={on('vav')} onHover={onHover} onSelect={onSelect} label="VAV boxes">
            <EqVAV z={165}></EqVAV>
          </Comp>

          {/* floor 2 */}
          <g data-dimmable="5">
            <EqSlab z={192}></EqSlab>
            <EqFloorTint z={192} color={T.chw} op={tintOp}></EqFloorTint>
            {optimized && <EqFloorTint z={192} color={T.signal} op={0.05}></EqFloorTint>}
          </g>
          <Comp id="duct" focusable={false} on={on('duct')} onHover={onHover} onSelect={onSelect} label="Supply and return ductwork">
            <IsoBox x={843} y={133} z={200} w={28} d={28} h={64} fill={T.duct}></IsoBox>
            <IsoBox x={944} y={164} z={200} w={20} d={20} h={33} fill={T.ductLite}></IsoBox>
            <IsoBox x={962} y={166} z={233} w={34} d={16} h={14} fill={T.ductLite}></IsoBox>
            <IsoBox x={871} y={142} z={241} w={126} d={14} h={14} fill={T.duct}></IsoBox>
          </Comp>
          <Comp id="vav" focusable={false} on={on('vav')} onHover={onHover} onSelect={onSelect} label="VAV boxes">
            <EqVAV z={237}></EqVAV>
          </Comp>

          {/* floor 3 */}
          <g data-dimmable="6">
            <EqSlab z={264}></EqSlab>
            <EqFloorTint z={264} color={T.chw} op={tintOp}></EqFloorTint>
            {optimized && <EqFloorTint z={264} color={T.signal} op={0.05}></EqFloorTint>}
          </g>
          <Comp id="duct" focusable={false} on={on('duct')} onHover={onHover} onSelect={onSelect} label="Supply and return ductwork">
            <IsoBox x={843} y={133} z={272} w={28} d={28} h={58} fill={T.duct}></IsoBox>
            <IsoBox x={839} y={129} z={328} w={36} d={36} h={7} fill={shade(T.duct, 0.12)}></IsoBox>
            <IsoBox x={871} y={142} z={313} w={126} d={14} h={14} fill={T.duct}></IsoBox>
          </Comp>
          <Comp id="vav" focusable={false} on={on('vav')} onHover={onHover} onSelect={onSelect} label="VAV boxes">
            <EqVAV z={309}></EqVAV>
          </Comp>

          {/* roof slab + rooftop cooling tower */}
          <g data-dimmable="7">
            <EqSlab z={336}></EqSlab>
          </g>
          <Comp id="tower" on={on('tower')} onHover={onHover} onSelect={onSelect} label="Cooling tower">
            <EqTowerPlatform></EqTowerPlatform>
            <EqTower></EqTower>
          </Comp>

          {/* hidden air flow paths */}
          <g fill="none" stroke="none">
            {[176, 248, 320].map((z) => (
              <path key={z} d={isoPath(airSup(z))} data-flow={'air' + z} data-loop="air" data-color={T.airCool} data-n="6" data-speed="46" data-kind="chevron"></path>
            ))}
            <path d={isoPath(airRet)} data-flow="airRet" data-loop="air" data-color={T.airWarm} data-n="4" data-speed="40" data-kind="chevron"></path>
          </g>

          {/* refrigeration cycle inset */}
          <Comp id="refrig" on={on('refrig')} onHover={onHover} onSelect={onSelect} label="Refrigeration cycle inside the chiller">
            <RefrigDetail T={T} uid={uid} annotated={annotated}></RefrigDetail>
          </Comp>

          {/* sensors + signal lines */}
          <Comp id="sensors" on={on('sensors')} onHover={onHover} onSelect={onSelect} label="Sensor network reporting to the BAS">
            <g>
              {FC_SENSORS.map((s, idx) => {
                const p = isoXY(s.pt[0], s.pt[1], s.pt[2]);
                const alarmLine = failure && s.id === 's1';
                return (
                  <g key={s.id}>
                    <line x1={p[0]} y1={p[1]} x2={A[0]} y2={A[1]} stroke={alarmLine ? T.alert : T.signal}
                      strokeWidth="1" strokeDasharray="2 5" opacity={alarmLine ? 0.6 : 0.22}></line>
                    <circle className="fc-pulse" cx={p[0]} cy={p[1]} r="5.5" fill={alarmLine ? T.alert : T.signal}
                      style={{ animationDelay: (idx * 0.45) + 's' }}></circle>
                    <circle cx={p[0]} cy={p[1]} r="3" fill={alarmLine ? T.alert : T.signal} stroke={T.stage} strokeWidth="1.2"></circle>
                  </g>
                );
              })}
            </g>
            <g fill="none" stroke="none">
              {FC_SENSORS.map((s) => {
                const p = isoXY(s.pt[0], s.pt[1], s.pt[2]);
                const isAlarm = s.id === 's1';
                return <path key={'pp' + s.id} d={`M${p[0].toFixed(1)},${p[1].toFixed(1)} L${A[0].toFixed(1)},${A[1].toFixed(1)}`}
                  data-flow={'ping' + s.id} data-loop={isAlarm ? 'alarm' : 'signal'}
                  data-color={isAlarm ? T.alert : T.signal} data-n="1" data-speed={isAlarm ? 210 : 120}
                  data-kind="ping" data-size={isAlarm ? 3.4 : 2.6} data-gapx={isAlarm ? 0.7 : 2.4}></path>;
              })}
            </g>
          </Comp>

          {/* particles */}
          <g data-particle-layer="1" data-dimmable="5" pointerEvents="none"></g>

          {/* labels */}
          {annotated && <g pointerEvents="none">
            <Label T={T} x={80} y={126} z={2} dx={-70} dy={48} anchor="middle" text="WATER-COOLED CHILLER"></Label>
            <Label T={T} x={44} y={206} z={46} dx={-30} dy={-6} anchor="end" text="BOILER"></Label>
            <Label T={T} x={366} y={152} z={40} dx={4} dy={-36} anchor="middle" text="CHW PUMPS"></Label>
            <Label T={T} x={366} y={234} z={6} dx={2} dy={38} anchor="middle" text="CW PUMPS"></Label>
            <Label T={T} x={836} y={140} z={400} dx={26} dy={18} text="COOLING TOWER"></Label>
            <Label T={T} x={800} y={192} z={10} dx={6} dy={46} anchor="middle" text="AIR HANDLING UNIT"></Label>
            <Label T={T} x={942} y={150} z={247} dx={26} dy={-12} text="VAV BOX (TYP.)"></Label>
            <Label T={T} x={857} y={147} z={240} dx={-16} dy={-18} anchor="end" text="SUPPLY RISER"></Label>
            <Label T={T} x={255} y={212} z={4} dx={0} dy={36} anchor="middle" text="BAS PANEL"></Label>
            <g fontFamily="'IBM Plex Mono', monospace" fontSize="9" letterSpacing="0.8" fill={T.inkFaint}>
              <text x={isoXY(600, 140, 20)[0]} y={isoXY(600, 140, 20)[1] + 20}>44°F SUPPLY</text>
              <text x={isoXY(640, 162, 20)[0]} y={isoXY(640, 162, 20)[1] + 22}>≈56°F RETURN</text>
              <text x={isoXY(500, 238, 4)[0]} y={isoXY(500, 238, 4)[1] + 14} textAnchor="middle">95°F → 85°F</text>
            </g>
          </g>}

          {/* zone labels */}
          <g fontFamily="'IBM Plex Mono', monospace" fontSize="11" letterSpacing="2.5" fill={T.inkDim} pointerEvents="none">
            <text x="50" y="352" textAnchor="middle">01 — CENTRAL PLANT</text>
            <text x="295" y="120" textAnchor="middle">02 — ROOFTOP</text>
            <text x="640" y="644" textAnchor="middle">03 — THE BUILDING</text>
          </g>

          {/* mode callouts */}
          {failure && <g pointerEvents="none">
            <line x1={isoXY(174, 84, 104)[0]} y1={isoXY(174, 84, 104)[1]} x2={140} y2={-18} stroke={T.alert} strokeWidth="1" strokeDasharray="3 4" opacity="0.7"></line>
            <g transform="translate(120,-44)">
              <rect width="238" height="52" rx="8" fill={T.dark ? '#1A0E0E' : '#FFF5F4'} stroke={T.alert} strokeWidth="1.2"></rect>
              <circle cx="18" cy="18" r="4" fill={T.alert} className="fc-blink"></circle>
              <text x="32" y="22" fontSize="11" fontWeight="700" letterSpacing="1" fill={T.alert} fontFamily="'IBM Plex Mono', monospace">CHILLER FAULT</text>
              <text x="32" y="38" fontSize="10" fill={T.ink} opacity="0.85" fontFamily="'IBM Plex Sans', Helvetica, Arial, sans-serif">FirstCall 24/7 Emergency — technician dispatched</text>
            </g>
          </g>}
          {optimized && <g pointerEvents="none">
            <g transform="translate(-205,-46)">
              <rect width="218" height="38" rx="8" fill={T.dark ? '#0A1F12' : '#F0FAF3'} stroke={T.ok} strokeWidth="1.2"></rect>
              <circle cx="16" cy="19" r="4" fill={T.ok}></circle>
              <text x="28" y="17" fontSize="10.5" fontWeight="700" letterSpacing="1" fill={T.ok} fontFamily="'IBM Plex Mono', monospace">CONTROLS TUNED</text>
              <text x="28" y="30" fontSize="9.5" fill={T.ink} opacity="0.8" fontFamily="'IBM Plex Sans', Helvetica, Arial, sans-serif">Retrofit + sequencing — efficiency improving</text>
            </g>
          </g>}
        </g>
      </svg>
    </IsoCtx.Provider>
  );
}

Object.assign(window, { SystemDiagram, hexLerp, startFlowEngine, Pipe, Label, Comp, FC_TARGETS, FC_SENSORS, RefrigDetail });
