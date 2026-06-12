// Equipment illustration components (pure visual; interaction wrappers live in diagram.jsx)

function EqChiller() {
  const { theme: T } = React.useContext(IsoCtx);
  return (
    <g>
      {/* skid */}
      <IsoBox x={28} y={44} z={0} w={196} d={78} h={8} fill={shade(T.metalC, -0.18)}></IsoBox>
      {/* saddles */}
      <IsoBox x={56} y={52} z={8} w={16} d={62} h={7} fill={T.metalC}></IsoBox>
      <IsoBox x={170} y={52} z={8} w={16} d={62} h={7} fill={T.metalC}></IsoBox>
      {/* condenser barrel (back, warm) — big and stout */}
      <IsoBarrel x0={52} x1={212} y={66} z={46} r={24} fill={T.metalA} capFill={shade(T.cw, -0.5)} domed></IsoBarrel>
      {/* evaporator barrel (front, cool) */}
      <IsoBarrel x0={46} x1={212} y={102} z={42} r={26} fill={T.metalB} capFill={shade(T.chw, -0.42)} domed></IsoBarrel>
      {/* compressor on top, spanning the pair */}
      <IsoBox x={140} y={74} z={66} w={12} d={18} h={10} fill={T.metalC}></IsoBox>
      <IsoBarrel x0={144} x1={204} y={84} z={86} r={14} fill={T.metalC} capFill={shade(T.metalC, 0.1)}></IsoBarrel>
      <IsoBarrel x0={158} x1={178} y={84} z={104} r={5} fill={T.metalB}></IsoBarrel>
    </g>
  );
}

function EqPump({ cx, cy, z = 0 }) {
  const { theme: T } = React.useContext(IsoCtx);
  return (
    <g>
      <IsoBox x={cx - 17} y={cy - 11} z={z} w={34} d={22} h={5} fill={shade(T.metalC, -0.15)}></IsoBox>
      <IsoCylV cx={cx - 7} cy={cy} z={z + 5} h={9} r={9} fill={T.metalB}></IsoCylV>
      <IsoBarrel x0={cx - 4} x1={cx + 15} y={cy} z={z + 17} r={7.5} fill={T.metalA} capFill={shade(T.metalA, 0.05)}></IsoBarrel>
      <IsoCylV cx={cx - 7} cy={cy} z={z + 14} h={8} r={5} fill={T.metalB}></IsoCylV>
    </g>
  );
}

function EqBoiler() {
  const { theme: T } = React.useContext(IsoCtx);
  return (
    <g>
      <IsoBox x={38} y={178} z={0} w={56} d={52} h={6} fill={shade(T.metalC, -0.18)}></IsoBox>
      <IsoCylV cx={66} cy={204} z={6} h={64} r={24} fill={T.metalB} topFill={shade(T.metalB, 0.2)}></IsoCylV>
      <IsoCylV cx={66} cy={204} z={70} h={6} r={16} fill={shade(T.metalB, 0.08)}></IsoCylV>
      <IsoCylV cx={56} cy={194} z={76} h={16} r={4.5} fill={T.metalC}></IsoCylV>
      <FaceY x={56} y={228.6} z={18}>
        <rect x={0} y={0} width={16} height={20} rx={2} fill="rgba(0,0,0,0.28)" stroke={shade(T.metalB, 0.25)} strokeWidth="0.6"></rect>
        <circle cx={8} cy={10} r={3.6} fill={shade(T.cw, -0.05)} opacity="0.9"></circle>
      </FaceY>
    </g>
  );
}

function EqTowerPlatform() {
  const { theme: T } = React.useContext(IsoCtx);
  const legs = [[696, 48], [832, 48], [696, 176], [832, 176]];
  const L = (a, b, w) => {
    const p = isoXY(a[0], a[1], a[2]), q = isoXY(b[0], b[1], b[2]);
    return <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={T.steel} strokeWidth={w || 3.5} strokeLinecap="round"></line>;
  };
  return (
    <g>
      {/* shadow on the roof slab */}
      <polygon points={isoPoly([[692, 44, 344.5], [846, 44, 344.5], [846, 188, 344.5], [692, 188, 344.5]])} fill="rgba(0,0,0,0.09)"></polygon>
      {/* short steel dunnage on the roof */}
      {legs.map((l, i) => (
        <g key={i}>
          <IsoBox x={l[0] - 7} y={l[1] - 7} z={344} w={14} d={14} h={3} fill={shade(T.steel, -0.25)}></IsoBox>
          {L([l[0], l[1], 346], [l[0], l[1], 361], 5)}
        </g>
      ))}
      <IsoBox x={688} y={40} z={360} w={152} d={144} h={8} fill={T.steel}></IsoBox>
    </g>
  );
}

function EqTower() {
  const { theme: T } = React.useContext(IsoCtx);
  return (
    <g>
      {/* basin */}
      <IsoBox x={698} y={50} z={368} w={132} d={124} h={14} fill={shade(T.metalC, -0.2)}></IsoBox>
      {/* body with louvered fill */}
      <IsoBox x={702} y={54} z={382} w={124} d={116} h={58} fill={T.metalB}></IsoBox>
      <FaceY x={706} y={170} z={387}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={0} y={6 + i * 8} width={116} height={2.6} fill="rgba(0,0,0,0.26)"></rect>
        ))}
      </FaceY>
      <FaceX x={826} y={58} z={387}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={0} y={6 + i * 8} width={108} height={2.6} fill="rgba(0,0,0,0.34)"></rect>
        ))}
      </FaceX>
      {/* fan deck */}
      <IsoBox x={702} y={54} z={440} w={124} d={116} h={7} fill={shade(T.metalA, -0.08)}></IsoBox>
      <IsoCylV cx={737} cy={112} z={447} h={9} r={26} fill={shade(T.metalA, 0.06)}></IsoCylV>
      <IsoCylV cx={793} cy={112} z={447} h={9} r={26} fill={shade(T.metalA, 0.06)}></IsoCylV>
      <IsoFan cx={737} cy={112} z={456} r={21} ring={shade(T.metalC, -0.2)} blade={shade(T.metalC, -0.05)} hub={T.accentY}></IsoFan>
      <IsoFan cx={793} cy={112} z={456} r={21} ring={shade(T.metalC, -0.2)} blade={shade(T.metalC, -0.05)} hub={T.accentY}></IsoFan>
      <Steam x={737} y={112} z={466} o={T.steamO} fill={T.steamFill}></Steam>
      <Steam x={793} y={112} z={466} o={T.steamO} fill={T.steamFill}></Steam>
      {/* guard rail on the dunnage deck */}
      <IsoRail color={T.accentY} h={13} pts={[[688, 184, 368], [840, 184, 368], [840, 40, 368]]}></IsoRail>
    </g>
  );
}

function EqBuildingShell() {
  const { theme: T } = React.useContext(IsoCtx);
  const H = 336, X0 = 680, Y0 = 30, X1 = 1020, Y1 = 190;
  const floors = [120, 192, 264];
  return (
    <g>
      <IsoBox x={X0 - 8} y={Y0 - 8} z={-10} w={356} d={176} h={10} fill={T.pad} frontFill={T.padSide} sideFill={shade(T.padSide, -0.2)} stroke={T.padLine} sw={1}></IsoBox>
      {/* back walls (inner faces) */}
      <polygon points={isoPoly([[X0, Y0, 0], [X0, Y1, 0], [X0, Y1, H], [X0, Y0, H]])} fill={T.wall} stroke={T.wallLine} strokeWidth="1"></polygon>
      <polygon points={isoPoly([[X0, Y0, 0], [X1, Y0, 0], [X1, Y0, H], [X0, Y0, H]])} fill={T.wallB} stroke={T.wallLine} strokeWidth="1"></polygon>
      <g stroke={T.wallLine} strokeWidth="1">
        {floors.map((z) => <polyline key={z} fill="none" points={isoPoly([[X0, Y1, z], [X0, Y0, z], [X1, Y0, z]])}></polyline>)}
        {[760, 840, 920].map((x) => <line key={x} x1={isoXY(x, Y0, 0)[0]} y1={isoXY(x, Y0, 0)[1]} x2={isoXY(x, Y0, H)[0]} y2={isoXY(x, Y0, H)[1]} opacity="0.6"></line>)}
        {[90, 150].map((y) => <line key={y} x1={isoXY(X0, y, 0)[0]} y1={isoXY(X0, y, 0)[1]} x2={isoXY(X0, y, H)[0]} y2={isoXY(X0, y, H)[1]} opacity="0.6"></line>)}
      </g>
      {/* roof edge lines */}
      <polyline fill="none" points={isoPoly([[X0, Y1, H], [X0, Y0, H], [X1, Y0, H]])} stroke={shade(T.wall, 0.25)} strokeWidth="2" opacity="0.7"></polyline>
    </g>
  );
}

function EqBAS({ mode }) {
  const { theme: T } = React.useContext(IsoCtx);
  const ok = mode !== 'failure';
  const tip = isoXY(255, 202, 80);
  const top = isoXY(255, 202, 64);
  return (
    <g>
      <IsoBox x={234} y={190} z={0} w={42} d={24} h={4} fill={shade(T.metalC, -0.3)}></IsoBox>
      <IsoBox x={238} y={194} z={4} w={34} d={17} h={60} fill={T.metalB}></IsoBox>
      <line x1={top[0]} y1={top[1]} x2={tip[0]} y2={tip[1]} stroke={shade(T.metalB, 0.3)} strokeWidth="1.4"></line>
      <circle className="fc-pulse" cx={tip[0]} cy={tip[1]} r="5" fill={ok ? T.signal : T.alert}></circle>
      <circle cx={tip[0]} cy={tip[1]} r="2.4" fill={ok ? T.signal : T.alert}></circle>
      <FaceY x={240} y={211.6} z={9}>
        <rect x={0} y={0} width={30} height={52} rx={2} fill="rgba(0,0,0,0.18)" stroke={shade(T.metalB, 0.35)} strokeWidth="0.9"></rect>
        <rect x={3} y={28} width={24} height={18} rx={1.5} fill="rgba(0,0,0,0.55)" stroke={ok ? T.signal : T.alert} strokeWidth="0.7" opacity="0.9"></rect>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={5.5} y={31.5 + i * 4.6} width={16 - i * 4} height={2.1} rx={1} fill={ok ? T.signal : T.alert} opacity={0.55 + i * 0.16} className={ok ? '' : 'fc-blink'}></rect>
        ))}
        <circle cx={24} cy={22} r={1.8} fill={ok ? T.signal : T.alert} className="fc-blink"></circle>
        <circle cx={19} cy={22} r={1.8} fill={T.accentY}></circle>
        {[0, 1, 2, 3].map((i) => (
          <rect key={'k' + i} x={4.5 + i * 5.4} y={7} width={4.2} height={5} rx={0.9} fill={shade(T.metalB, -0.25)}></rect>
        ))}
      </FaceY>
    </g>
  );
}

function EqAHU() {
  const { theme: T } = React.useContext(IsoCtx);
  return (
    <g>
      <IsoBox x={720} y={110} z={4} w={160} d={80} h={92} fill={T.metalB}></IsoBox>
      <FaceY x={722} y={191} z={8}>
        <rect x={0} y={0} width={156} height={84} rx={2} fill="rgba(0,0,0,0.14)"></rect>
        <line x1={48} y1={2} x2={48} y2={82} stroke={shade(T.metalB, -0.4)} strokeWidth="1.4"></line>
        <line x1={100} y1={2} x2={100} y2={82} stroke={shade(T.metalB, -0.4)} strokeWidth="1.4"></line>
        {/* filter hatch */}
        <g stroke={shade(T.metalB, 0.35)} strokeWidth="1.2" opacity="0.7">
          {[12, 24, 36].map((u) => <line key={u} x1={u - 8} y1={76} x2={u + 8} y2={8}></line>)}
        </g>
        {/* chilled water coil */}
        <g stroke={T.chw} strokeWidth="1.7" opacity="0.85">
          {[58, 66, 74, 82, 90].map((u) => <line key={u} x1={u} y1={9} x2={u} y2={75}></line>)}
        </g>
        {/* supply fan */}
        <circle cx={128} cy={42} r={20} fill="rgba(0,0,0,0.3)" stroke={shade(T.metalB, 0.35)} strokeWidth="1.4"></circle>
        <g className="fc-spin">
          {[0, 90, 180, 270].map((a) => (
            <rect key={a} x={131} y={40} width={14} height={4.5} rx={2.2} fill={shade(T.metalB, 0.45)} transform={`rotate(${a} 128 42)`}></rect>
          ))}
        </g>
        <circle cx={128} cy={42} r={3} fill={T.accentY}></circle>
      </FaceY>
    </g>
  );
}

function EqSlab({ z }) {
  const { theme: T } = React.useContext(IsoCtx);
  return <IsoBox x={684} y={34} z={z} w={332} d={152} h={8} fill={T.slab} frontFill={T.slabSide} sideFill={shade(T.slabSide, -0.18)} stroke="rgba(0,0,0,0.25)"></IsoBox>;
}

function EqFloorTint({ z, color, op }) {
  // decorative wash over the whole floor plane — must not intercept clicks
  // meant for the equipment beneath it (VAV boxes especially)
  return <polygon points={isoPoly([[684, 34, z + 8.5], [1016, 34, z + 8.5], [1016, 186, z + 8.5], [684, 186, z + 8.5]])} fill={color} opacity={op} pointerEvents="none" style={{ transition: 'opacity 1.2s, fill 1.2s' }}></polygon>;
}

function EqVAV({ z }) {
  const { theme: T } = React.useContext(IsoCtx);
  return (
    <g>
      <IsoBox x={914} y={138} z={z} w={28} d={24} h={20} fill={T.metalA}></IsoBox>
      <IsoBox x={910} y={142} z={z + 4} w={4} d={16} h={12} fill={shade(T.metalA, -0.2)}></IsoBox>
    </g>
  );
}

Object.assign(window, { EqChiller, EqPump, EqBoiler, EqTowerPlatform, EqTower, EqBuildingShell, EqBAS, EqAHU, EqSlab, EqFloorTint, EqVAV });
