(() => {
  const U = 30;
  const ZU = 27;
  const ORIGIN = { x: 1140, y: 250 };
  const pt = (gx, gy, gz = 0, O = ORIGIN) => [
    O.x + (gx - gy) * U,
    O.y + (gx + gy) * (U * 0.5) - gz * ZU
  ];
  const poly = (pts) => pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    r = Math.round(Math.min(255, r * f));
    g = Math.round(Math.min(255, g * f));
    b = Math.round(Math.min(255, b * f));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function ovalPts(cx, cy, a, b, n = 28, z = 0.02) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = Math.PI * 2 * i / n;
      out.push(pt(cx + a * Math.cos(t), cy + b * Math.sin(t), z));
    }
    return out;
  }
  function IsoBox({ gx, gy, w, d, z0, h, color, stroke = "#5d6e7a", sw = 0.8, top, left, right }) {
    const cTop = top || shade(color, 1.12);
    const cLeft = left || shade(color, 0.74);
    const cRight = right || shade(color, 0.92);
    const T1 = pt(gx, gy, z0 + h), T2 = pt(gx + w, gy, z0 + h), T3 = pt(gx + w, gy + d, z0 + h), T4 = pt(gx, gy + d, z0 + h);
    const B2 = pt(gx + w, gy, z0), B3 = pt(gx + w, gy + d, z0), B4 = pt(gx, gy + d, z0);
    return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("polygon", { points: poly([T2, T3, B3, B2]), fill: cRight, stroke, strokeWidth: sw, strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([T4, T3, B3, B4]), fill: cLeft, stroke, strokeWidth: sw, strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([T1, T2, T3, T4]), fill: cTop, stroke, strokeWidth: sw, strokeLinejoin: "round" }));
  }
  function IsoDisc({ gx, gy, z, r, fill = "#9fb0b8", stroke = "#5d6e7a" }) {
    const [x, y] = pt(gx, gy, z);
    return /* @__PURE__ */ React.createElement("ellipse", { cx: x, cy: y, rx: r * U, ry: r * U * 0.5, fill, stroke, strokeWidth: "0.8" });
  }
  function Steam({ sx, sy, n = 3, spread = 18 }) {
    const puffs = [];
    for (let i = 0; i < n; i++)
      puffs.push(
        /* @__PURE__ */ React.createElement(
          "ellipse",
          {
            key: i,
            className: "steam",
            cx: sx + (i - (n - 1) / 2) * (spread / n),
            cy: sy,
            rx: 8,
            ry: 5.5,
            fill: "#aab8bf",
            style: { opacity: 0, animationDuration: `${3 + i * 0.6}s`, animationDelay: `${i * 0.9}s`, transformBox: "fill-box", transformOrigin: "center" }
          }
        )
      );
    return /* @__PURE__ */ React.createElement("g", null, puffs);
  }
  function bandQuad(face, b, z1, z2, fill, inset = 0.12) {
    if (face === "r") {
      const a2 = b.gy + inset, c2 = b.gy + b.d - inset, X = b.gx + b.w;
      return /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(X, a2, z2), pt(X, c2, z2), pt(X, c2, z1), pt(X, a2, z1)]), fill });
    }
    const a = b.gx + inset, c = b.gx + b.w - inset, Y = b.gy + b.d;
    return /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(a, Y, z2), pt(c, Y, z2), pt(c, Y, z1), pt(a, Y, z1)]), fill });
  }
  function cellQuads(face, b, z1, z2, cols, fill) {
    const out = [];
    const span = face === "r" ? b.d : b.w;
    const base = face === "r" ? b.gy : b.gx;
    for (let c = 0; c < cols; c++) {
      const a = base + span * (c + 0.22) / cols, e = base + span * (c + 0.78) / cols;
      out.push(face === "r" ? /* @__PURE__ */ React.createElement("polygon", { key: face + c + z1, points: poly([pt(b.gx + b.w, a, z2), pt(b.gx + b.w, e, z2), pt(b.gx + b.w, e, z1), pt(b.gx + b.w, a, z1)]), fill }) : /* @__PURE__ */ React.createElement("polygon", { key: face + c + z1, points: poly([pt(a, b.gy + b.d, z2), pt(e, b.gy + b.d, z2), pt(e, b.gy + b.d, z1), pt(a, b.gy + b.d, z1)]), fill }));
    }
    return out;
  }
  function Skin({ b, z0 }) {
    const els = [];
    const H = b.H, fl = b.floors || Math.max(2, Math.round(H));
    const gR = shade(b.glass, 0.96), gL = shade(b.glass, 0.74);
    if (b.skin === "glass") {
      els.push(/* @__PURE__ */ React.createElement("g", { key: "gw" }, bandQuad("r", b, z0 + 0.06, z0 + H - 0.08, shade(b.glass, 0.98), 0.07), bandQuad("l", b, z0 + 0.06, z0 + H - 0.08, shade(b.glass, 0.7), 0.07)));
      const mull = [];
      for (let g = b.gy + 0.4; g < b.gy + b.d - 0.05; g += 0.4)
        mull.push(/* @__PURE__ */ React.createElement("line", { key: "mr" + g.toFixed(2), x1: pt(b.gx + b.w, g, z0)[0], y1: pt(b.gx + b.w, g, z0)[1], x2: pt(b.gx + b.w, g, z0 + H)[0], y2: pt(b.gx + b.w, g, z0 + H)[1], stroke: "#ffffff", strokeWidth: "0.8", opacity: ".35" }));
      for (let g = b.gx + 0.4; g < b.gx + b.w - 0.05; g += 0.4)
        mull.push(/* @__PURE__ */ React.createElement("line", { key: "ml" + g.toFixed(2), x1: pt(g, b.gy + b.d, z0)[0], y1: pt(g, b.gy + b.d, z0)[1], x2: pt(g, b.gy + b.d, z0 + H)[0], y2: pt(g, b.gy + b.d, z0 + H)[1], stroke: "#ffffff", strokeWidth: "0.8", opacity: ".22" }));
      for (let i = 1; i < fl; i++) {
        const z = z0 + H * i / fl;
        mull.push(/* @__PURE__ */ React.createElement("line", { key: "fr" + i, x1: pt(b.gx + b.w, b.gy, z)[0], y1: pt(b.gx + b.w, b.gy, z)[1], x2: pt(b.gx + b.w, b.gy + b.d, z)[0], y2: pt(b.gx + b.w, b.gy + b.d, z)[1], stroke: "#ffffff", strokeWidth: "0.6", opacity: ".18" }));
      }
      els.push(/* @__PURE__ */ React.createElement("g", { key: "mull" }, mull));
      const X = b.gx + b.w;
      els.push(/* @__PURE__ */ React.createElement("polygon", { key: "sheen", points: poly([pt(X, b.gy, z0 + H), pt(X, b.gy + b.d * 0.55, z0 + H), pt(X, b.gy, z0 + H * 0.45)]), fill: "#ffffff", opacity: ".14" }));
    } else {
      els.push(/* @__PURE__ */ React.createElement("g", { key: "sf" }, bandQuad("r", b, z0 + 0.08, z0 + H * 0.72 / fl, "#37474f", 0.18), bandQuad("l", b, z0 + 0.08, z0 + H * 0.72 / fl, "#2c3a42", 0.18)));
    }
    if (b.skin === "bands") {
      for (let i = 1; i < fl; i++) {
        const z1 = z0 + H * (i + 0.2) / fl, z2 = z0 + H * (i + 0.76) / fl;
        els.push(/* @__PURE__ */ React.createElement("g", { key: "b" + i }, bandQuad("r", b, z1, z2, gR), bandQuad("l", b, z1, z2, gL)));
      }
    } else if (b.skin === "cells") {
      const colsR = Math.max(3, Math.round(b.d / 0.6)), colsL = Math.max(3, Math.round(b.w / 0.6));
      for (let i = 1; i < fl; i++) {
        const z1 = z0 + H * (i + 0.24) / fl, z2 = z0 + H * (i + 0.74) / fl;
        els.push(/* @__PURE__ */ React.createElement("g", { key: "c" + i }, cellQuads("r", b, z1, z2, colsR, gR), cellQuads("l", b, z1, z2, colsL, gL)));
      }
    } else if (b.skin === "louver") {
      els.push(/* @__PURE__ */ React.createElement("g", { key: "lv" }, bandQuad("r", b, z0 + H * 0.38, z0 + H * 0.52, shade(b.body, 0.62)), bandQuad("l", b, z0 + H * 0.38, z0 + H * 0.52, shade(b.body, 0.5)), bandQuad("r", b, z0 + H * 0.66, z0 + H * 0.86, gR), bandQuad("l", b, z0 + H * 0.66, z0 + H * 0.86, gL)));
    } else if (b.skin === "clad") {
      const seams = [];
      const stepR = b.d / 5, stepL = b.w / 5;
      for (let k = 1; k < 5; k++) {
        seams.push(/* @__PURE__ */ React.createElement("line", { key: "sr" + k, x1: pt(b.gx + b.w, b.gy + stepR * k, z0)[0], y1: pt(b.gx + b.w, b.gy + stepR * k, z0)[1], x2: pt(b.gx + b.w, b.gy + stepR * k, z0 + H)[0], y2: pt(b.gx + b.w, b.gy + stepR * k, z0 + H)[1], stroke: shade(b.body, 0.78), strokeWidth: "1.2" }));
        seams.push(/* @__PURE__ */ React.createElement("line", { key: "sl" + k, x1: pt(b.gx + stepL * k, b.gy + b.d, z0)[0], y1: pt(b.gx + stepL * k, b.gy + b.d, z0)[1], x2: pt(b.gx + stepL * k, b.gy + b.d, z0 + H)[0], y2: pt(b.gx + stepL * k, b.gy + b.d, z0 + H)[1], stroke: shade(b.body, 0.72), strokeWidth: "1.2" }));
      }
      els.push(/* @__PURE__ */ React.createElement("g", { key: "cl" }, seams, bandQuad("r", b, z0 + H * 0.74, z0 + H * 0.9, gR), bandQuad("l", b, z0 + H * 0.74, z0 + H * 0.9, gL)));
    }
    const zT = z0 + H;
    els.push(/* @__PURE__ */ React.createElement("g", { key: "trim" }, /* @__PURE__ */ React.createElement("line", { x1: pt(b.gx + b.w, b.gy, zT)[0], y1: pt(b.gx + b.w, b.gy, zT)[1], x2: pt(b.gx + b.w, b.gy + b.d, zT)[0], y2: pt(b.gx + b.w, b.gy + b.d, zT)[1], stroke: b.accent, strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("line", { x1: pt(b.gx, b.gy + b.d, zT)[0], y1: pt(b.gx, b.gy + b.d, zT)[1], x2: pt(b.gx + b.w, b.gy + b.d, zT)[0], y2: pt(b.gx + b.w, b.gy + b.d, zT)[1], stroke: shade(b.accent, 0.85), strokeWidth: "2.5" })));
    return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, els);
  }
  function Entrance({ b }) {
    const cx = b.gx + b.w / 2;
    const d0 = b.gy + b.d;
    return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(cx - 0.55, d0, 1), pt(cx + 0.55, d0, 1), pt(cx + 0.55, d0, 0.22), pt(cx - 0.55, d0, 0.22)]), fill: "#243640", stroke: "#5d6e7a", strokeWidth: "0.8" }), /* @__PURE__ */ React.createElement("line", { x1: pt(cx, d0, 1)[0], y1: pt(cx, d0, 1)[1], x2: pt(cx, d0, 0.22)[0], y2: pt(cx, d0, 0.22)[1], stroke: "#7e96a3", strokeWidth: "1" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: cx - 0.65, gy: d0, w: 1.3, d: 0.38, z0: 1.02, h: 0.09, color: b.accent, stroke: shade(b.accent, 0.7) }));
  }
  function Hotspot({ gx, gy, z, r = 10, label, onActivate, kind = "building", cls = "" }) {
    const [x, y] = pt(gx, gy, z);
    const lift = kind === "building" ? 24 : 15;
    const act = (e) => {
      e.stopPropagation();
      onActivate(e);
    };
    return /* @__PURE__ */ React.createElement(
      "g",
      {
        className: "hot" + (cls ? " " + cls : ""),
        tabIndex: 0,
        role: "button",
        "aria-label": label,
        onClick: act,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            act(e);
          }
        }
      },
      /* @__PURE__ */ React.createElement("line", { x1: x, y1: y, x2: x, y2: y - lift, stroke: "#005090", strokeWidth: "1.5", opacity: ".55" }),
      /* @__PURE__ */ React.createElement("circle", { className: "hot-focus", cx: x, cy: y - lift, r: r + 7, fill: "rgba(23,121,196,.14)", stroke: "#182a1f", strokeWidth: "2", opacity: "0" }),
      /* @__PURE__ */ React.createElement(
        "circle",
        {
          className: "pulse-ring" + (kind === "equip" ? " eq" : ""),
          cx: x,
          cy: y - lift,
          r,
          fill: "none",
          stroke: "#1779c4",
          strokeWidth: "2",
          style: { animationDelay: `${-((gx * 7 + gy * 13) % 13 / 5).toFixed(2)}s` }
        }
      ),
      /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y - lift, r: r * 0.46, fill: "#005090", stroke: "#0a2c4a", strokeWidth: ".7" }),
      kind === "building" && /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y - lift, r: r * 0.18, fill: "#fff", opacity: ".95" })
    );
  }
  function Equip({ spec, z0 }) {
    const M = "#c3ced5", g = spec;
    const els = [];
    if (g.kind === "pair") {
      els.push(/* @__PURE__ */ React.createElement(IsoBox, { key: "a", gx: g.gx, gy: g.gy, w: g.w, d: g.d, z0, h: g.h, color: M }));
      els.push(/* @__PURE__ */ React.createElement(IsoBox, { key: "b", gx: g.gx + g.w + 0.25, gy: g.gy, w: g.w, d: g.d, z0, h: g.h, color: M }));
      const fr = Math.min(g.w, g.d) * 0.38;
      [g.gx + g.w / 2, g.gx + g.w * 1.5 + 0.25].forEach((fx, i) => {
        els.push(/* @__PURE__ */ React.createElement("g", { key: "pf" + i }, /* @__PURE__ */ React.createElement(IsoDisc, { gx: fx, gy: g.gy + g.d / 2, z: z0 + g.h, r: fr, fill: "#54707e", stroke: "#3a525e" }), /* @__PURE__ */ React.createElement(IsoDisc, { gx: fx, gy: g.gy + g.d / 2, z: z0 + g.h, r: fr * 0.38, fill: "#8da7b3", stroke: "none" })));
      });
    } else if (g.kind === "row3") {
      for (let i = 0; i < 3; i++) {
        const cw = g.w / 3 - 0.12;
        els.push(/* @__PURE__ */ React.createElement(IsoBox, { key: i, gx: g.gx + i * (g.w / 3), gy: g.gy, w: cw, d: g.d, z0, h: g.h, color: i % 2 ? shade(M, 0.93) : M }));
        const fr = Math.min(cw, g.d) * 0.36;
        els.push(/* @__PURE__ */ React.createElement("g", { key: "rf" + i }, /* @__PURE__ */ React.createElement(IsoDisc, { gx: g.gx + i * (g.w / 3) + cw / 2, gy: g.gy + g.d / 2, z: z0 + g.h, r: fr, fill: "#54707e", stroke: "#3a525e" }), /* @__PURE__ */ React.createElement(IsoDisc, { gx: g.gx + i * (g.w / 3) + cw / 2, gy: g.gy + g.d / 2, z: z0 + g.h, r: fr * 0.38, fill: "#8da7b3", stroke: "none" })));
      }
    } else if (g.kind === "antenna") {
      els.push(/* @__PURE__ */ React.createElement(IsoBox, { key: "m", gx: g.gx, gy: g.gy, w: g.w, d: g.d, z0, h: g.h, color: "#9fb0b8" }));
      const arm = z0 + g.h * 0.72;
      els.push(/* @__PURE__ */ React.createElement("line", { key: "arm", x1: pt(g.gx - 0.35, g.gy + g.d / 2, arm)[0], y1: pt(g.gx - 0.35, g.gy + g.d / 2, arm)[1], x2: pt(g.gx + g.w + 0.35, g.gy + g.d / 2, arm)[0], y2: pt(g.gx + g.w + 0.35, g.gy + g.d / 2, arm)[1], stroke: "#7e96a3", strokeWidth: "2" }));
      const [d1x, d1y] = pt(g.gx - 0.3, g.gy + g.d / 2, arm);
      const [d2x, d2y] = pt(g.gx + g.w + 0.3, g.gy + g.d / 2, arm);
      els.push(/* @__PURE__ */ React.createElement("circle", { key: "d1", cx: d1x, cy: d1y, r: "4", fill: "#eef3f6", stroke: "#7e96a3" }));
      els.push(/* @__PURE__ */ React.createElement("circle", { key: "d2", cx: d2x, cy: d2y, r: "4", fill: "#eef3f6", stroke: "#7e96a3" }));
      const [tx, ty] = pt(g.gx + g.w / 2, g.gy + g.d / 2, z0 + g.h);
      els.push(/* @__PURE__ */ React.createElement("circle", { key: "bl", className: "blink", cx: tx, cy: ty, r: "2.6", fill: "#ff7d6b" }));
    } else if (g.kind === "balcony") {
      [0, 1, 2].forEach((k) => {
        const z = 1.35 + k * 1.15;
        els.push(/* @__PURE__ */ React.createElement(IsoBox, { key: "s" + k, gx: g.gx, gy: g.gy + k * 1, w: 0.3, d: 0.85, z0: z, h: 0.07, color: "#eef3f6" }));
        if (k !== 1) els.push(/* @__PURE__ */ React.createElement(IsoBox, { key: "c" + k, gx: g.gx + 0.03, gy: g.gy + k * 1 + 0.18, w: 0.24, d: 0.5, z0: z + 0.07, h: 0.3, color: M }));
      });
    } else {
      els.push(/* @__PURE__ */ React.createElement(IsoBox, { key: "m", gx: g.gx, gy: g.gy, w: g.w, d: g.d, z0, h: g.h, color: g.color || M }));
    }
    if (g.fans) {
      for (let i = 0; i < g.fans; i++) {
        const fx = g.gx + g.w * ((i + 0.5) / g.fans);
        els.push(/* @__PURE__ */ React.createElement("g", { key: "f" + i }, /* @__PURE__ */ React.createElement(IsoDisc, { gx: fx, gy: g.gy + g.d / 2, z: z0 + g.h, r: Math.min(g.w / g.fans, g.d) * 0.42, fill: "#54707e", stroke: "#3a525e" }), /* @__PURE__ */ React.createElement(IsoDisc, { gx: fx, gy: g.gy + g.d / 2, z: z0 + g.h, r: Math.min(g.w / g.fans, g.d) * 0.16, fill: "#8da7b3", stroke: "none" })));
      }
    }
    if (g.steam) {
      const [sx, sy] = pt(g.gx + g.w / 2, g.gy + g.d / 2, z0 + g.h);
      els.push(/* @__PURE__ */ React.createElement(Steam, { key: "st", sx, sy: sy - 6, n: 3, spread: g.tall ? 22 : 16 }));
    }
    if (g.blink && g.kind !== "antenna") {
      const [bx, by] = pt(g.gx + g.w * 0.85, g.gy + g.d * 0.15, z0 + g.h);
      els.push(/* @__PURE__ */ React.createElement("circle", { key: "bl2", className: "blink", cx: bx, cy: by - 3, r: "2.6", fill: "#37b06b" }));
    }
    if (g.amber) {
      const z = z0 + g.h * 0.55;
      els.push(/* @__PURE__ */ React.createElement("line", { key: "am", x1: pt(g.gx + g.w, g.gy, z)[0], y1: pt(g.gx + g.w, g.gy, z)[1], x2: pt(g.gx + g.w, g.gy + g.d, z)[0], y2: pt(g.gx + g.w, g.gy + g.d, z)[1], stroke: "#f5a623", strokeWidth: "3", opacity: ".9" }));
    }
    return /* @__PURE__ */ React.createElement("g", null, els);
  }
  const BLD = {
    office: {
      // sleek high-tech glass tower + podium
      gx: 1.8,
      gy: 1.8,
      w: 2.6,
      d: 2.6,
      H: 7.6,
      floors: 9,
      skin: "glass",
      body: "#dfe9f1",
      glass: "#3e85c4",
      accent: "#1f5d96",
      deco: "office",
      plinth: { gx: 1.55, gy: 1.55, w: 3.9, d: 3.9 },
      equip: [
        { id: "ahuPent", gx: 2.1, gy: 2.1, w: 1.2, d: 1.3, h: 0.6, fans: 2 },
        { id: "chiller", gx: 4.45, gy: 2, w: 0.7, d: 1.15, h: 0.5, fans: 2, z0: 1.72 },
        { id: "coolTower", gx: 2.3, gy: 4.5, w: 0.95, d: 0.65, h: 1.1, steam: true, color: "#aebec7", z0: 1.72 }
      ]
    },
    government: {
      // state capitol, back row
      gx: 8.9,
      gy: 1.9,
      w: 4,
      d: 2.8,
      H: 2.2,
      floors: 2,
      skin: "cells",
      body: "#efece2",
      glass: "#d8d2c0",
      accent: "#b9b29c",
      deco: "capitol",
      hotZ: 5.6,
      plinth: { gx: 8.65, gy: 1.65, w: 4.5, d: 3.95 },
      equip: [
        { id: "antenna", gx: 9, gy: 3.85, w: 0.3, d: 0.3, h: 1, kind: "antenna" },
        { id: "govRtu", gx: 12, gy: 2.3, w: 0.3, d: 0.8, h: 0.4, kind: "pair" }
      ]
    },
    hospital: {
      // main tower + low wing + ER + cross + helipad
      gx: 16.6,
      gy: 1.2,
      w: 3.2,
      d: 4.4,
      H: 6,
      floors: 6,
      skin: "bands",
      body: "#f4f8fa",
      glass: "#8ec9e8",
      accent: "#3f9be0",
      deco: "hospital",
      plinth: { gx: 16.35, gy: 0.95, w: 5.3, d: 4.9 },
      equip: [
        { id: "redRtu", gx: 16.9, gy: 1.6, w: 0.85, d: 1.15, h: 0.55, kind: "pair" },
        { id: "medAhu", gx: 16.9, gy: 3.3, w: 0.9, d: 1.4, h: 1, fans: 1 },
        { id: "generator", gx: 20, gy: 3.7, w: 1.2, d: 0.85, h: 0.55, blink: true, steam: true, z0: 3.02 }
      ]
    },
    dataCenter: {
      // futuristic dark-glass monolith
      gx: 1.5,
      gy: 8.4,
      w: 4.5,
      d: 3.8,
      H: 3,
      floors: 3,
      skin: "glass",
      body: "#33404d",
      glass: "#2e6ca3",
      accent: "#2fb4e8",
      deco: "datacenter",
      equip: [
        { id: "crac", gx: 1.9, gy: 8.8, w: 2.8, d: 1, h: 0.6, kind: "row3" },
        { id: "chillPlant", gx: 2.1, gy: 10.3, w: 2, d: 1.5, h: 0.85, fans: 2 },
        { id: "condenser", gx: 4.6, gy: 8.9, w: 1.4, d: 2.4, h: 0.5, fans: 3 }
      ]
    },
    hotel: {
      // restaurant at street level
      gx: 24.2,
      gy: 8,
      w: 3.8,
      d: 3.6,
      H: 6.5,
      floors: 7,
      skin: "bands",
      body: "#ecf3f6",
      glass: "#48a3c4",
      accent: "#2f7da0",
      deco: "hotel",
      equip: [
        { id: "vrf", gx: 24.6, gy: 8.4, w: 2.2, d: 1, h: 0.55, kind: "row3" },
        { id: "mau", gx: 24.7, gy: 10.1, w: 1.6, d: 1.2, h: 0.7, fans: 1 }
      ]
    },
    school: {
      // K-12: classroom wing + gym + schoolyard + bus
      gx: 1.2,
      gy: 16.2,
      w: 3.6,
      d: 1.5,
      H: 1.5,
      floors: 2,
      skin: "cells",
      body: "#f4eee0",
      glass: "#74b193",
      accent: "#2e8a63",
      deco: "school",
      plinth: { gx: 0.95, gy: 15.95, w: 4.1, d: 3.9 },
      equip: [
        { id: "rtu", gx: 1.7, gy: 16.45, w: 0.95, d: 0.95, h: 0.45, fans: 1 },
        { id: "boiler", gx: 1.8, gy: 18.4, w: 0.4, d: 0.4, h: 1.2, steam: true, tall: true, color: "#aebec7", z0: 2.52 }
      ]
    },
    university: {
      // UMD-style: red brick + white pillars
      gx: 12.4,
      gy: 16.2,
      w: 5,
      d: 2.8,
      H: 3.2,
      floors: 3,
      skin: "cells",
      body: "#b3604e",
      glass: "#f3e2c2",
      accent: "#efe9da",
      deco: "university",
      equip: [
        { id: "centralPlant", gx: 12.9, gy: 16.6, w: 1.6, d: 1, h: 0.8, fans: 2 },
        { id: "labAhu", gx: 16.1, gy: 16.6, w: 1.1, d: 1.2, h: 0.7, fans: 1 }
      ]
    },
    multifamily: {
      gx: 24.2,
      gy: 16,
      w: 3.8,
      d: 3.2,
      H: 5,
      floors: 5,
      skin: "cells",
      body: "#f4e8dd",
      glass: "#9fc4dd",
      accent: "#c96f4a",
      equip: [
        { id: "split", gx: 28, gy: 16.5, w: 0.3, d: 0.85, h: 0.3, kind: "balcony", hz: 3.4 },
        { id: "mfBoiler", gx: 26.8, gy: 18.3, w: 0.45, d: 0.45, h: 1.6, steam: true, tall: true, color: "#aebec7" }
      ]
    },
    industrial: {
      // factory: sawtooth roof
      gx: 24,
      gy: 24.4,
      w: 5,
      d: 3.6,
      H: 2.2,
      skin: "clad",
      body: "#e6eaec",
      glass: "#9fc0d1",
      accent: "#f5a623",
      deco: "factory",
      equip: [
        { id: "stack", gx: 24.5, gy: 24.6, w: 0.55, d: 0.55, h: 3, steam: true, tall: true, color: "#aebec7" },
        { id: "processCool", gx: 25.9, gy: 24.5, w: 1.3, d: 1.1, h: 0.75, fans: 1, amber: true },
        { id: "unitHeater", gx: 27.9, gy: 24.5, w: 0.9, d: 0.8, h: 0.45, fans: 1 }
      ]
    }
  };
  function Deco({ id, b, zTop }) {
    if (id === "office") {
      const E = { gx: 4.4, gy: 1.8, w: 0.8, d: 3.4 };
      const S = { gx: 1.8, gy: 4.4, w: 2.6, d: 0.8 };
      return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(IsoBox, { gx: E.gx, gy: E.gy, w: E.w, d: E.d, z0: 0.22, h: 1.5, color: "#cfe0ec" }), bandQuad("r", E, 0.32, 1.58, shade("#3e85c4", 0.95), 0.08), bandQuad("l", E, 0.32, 1.58, shade("#3e85c4", 0.68), 0.08), /* @__PURE__ */ React.createElement(IsoBox, { gx: S.gx, gy: S.gy, w: S.w, d: S.d, z0: 0.22, h: 1.5, color: "#cfe0ec" }), bandQuad("l", S, 0.32, 1.58, shade("#3e85c4", 0.68), 0.08), /* @__PURE__ */ React.createElement("line", { x1: pt(5.2, 1.8, 1.72)[0], y1: pt(5.2, 1.8, 1.72)[1], x2: pt(5.2, 5.2, 1.72)[0], y2: pt(5.2, 5.2, 1.72)[1], stroke: "#1f5d96", strokeWidth: "2" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 4.05, gy: 1.95, w: 0.12, d: 0.12, z0: zTop, h: 1.5, color: "#9fb0b8" }), /* @__PURE__ */ React.createElement("circle", { className: "blink", cx: pt(4.11, 2.01, zTop + 1.5)[0], cy: pt(4.11, 2.01, zTop + 1.5)[1], r: "2.4", fill: "#ff7d6b" }));
    }
    if (id === "datacenter") {
      return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("line", { x1: pt(b.gx + b.w, b.gy + 0.15, 1)[0], y1: pt(b.gx + b.w, b.gy + 0.15, 1)[1], x2: pt(b.gx + b.w, b.gy + b.d - 0.15, 1)[0], y2: pt(b.gx + b.w, b.gy + b.d - 0.15, 1)[1], stroke: "#4fd8ff", strokeWidth: "1.8", opacity: ".9" }), /* @__PURE__ */ React.createElement("line", { x1: pt(b.gx + 0.15, b.gy + b.d, 1)[0], y1: pt(b.gx + 0.15, b.gy + b.d, 1)[1], x2: pt(b.gx + b.w - 0.15, b.gy + b.d, 1)[0], y2: pt(b.gx + b.w - 0.15, b.gy + b.d, 1)[1], stroke: "#4fd8ff", strokeWidth: "1.8", opacity: ".7" }), /* @__PURE__ */ React.createElement("line", { x1: pt(b.gx + b.w, b.gy + 0.15, 2.15)[0], y1: pt(b.gx + b.w, b.gy + 0.15, 2.15)[1], x2: pt(b.gx + b.w, b.gy + b.d - 0.15, 2.15)[0], y2: pt(b.gx + b.w, b.gy + b.d - 0.15, 2.15)[1], stroke: "#4fd8ff", strokeWidth: "1.8", opacity: ".9" }), /* @__PURE__ */ React.createElement("circle", { className: "blink", cx: pt(b.gx + b.w, b.gy + 0.5, 2.6)[0], cy: pt(b.gx + b.w, b.gy + 0.5, 2.6)[1], r: "2", fill: "#4fd8ff" }), /* @__PURE__ */ React.createElement("circle", { className: "blink", cx: pt(b.gx + b.w, b.gy + 1.4, 2.6)[0], cy: pt(b.gx + b.w, b.gy + 1.4, 2.6)[1], r: "2", fill: "#4fd8ff", style: { animationDelay: "-1.2s" } }), /* @__PURE__ */ React.createElement("circle", { className: "blink", cx: pt(b.gx + b.w, b.gy + 2.3, 2.6)[0], cy: pt(b.gx + b.w, b.gy + 2.3, 2.6)[1], r: "2", fill: "#4fd8ff", style: { animationDelay: "-2.3s" } }));
    }
    if (id === "capitol") {
      const cols = [10.25, 10.65, 11.05, 11.45];
      const [dx2, dy2] = pt(10.9, 3.5, 3.46);
      return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, bandQuad("r", b, 0.22, 0.7, "#f4f1e8", 0.05), bandQuad("l", b, 0.22, 0.7, shade("#f4f1e8", 0.85), 0.05), /* @__PURE__ */ React.createElement(IsoBox, { gx: 9.95, gy: 4.7, w: 1.9, d: 0.85, z0: 0.22, h: 0.1, color: "#e8e2d0" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 10.1, gy: 4.7, w: 1.6, d: 0.7, z0: 0.32, h: 0.12, color: "#f0ece0" }), cols.map((c) => /* @__PURE__ */ React.createElement(IsoBox, { key: c, gx: c, gy: 5.05, w: 0.14, d: 0.14, z0: 0.44, h: 1.5, color: "#f4f0e4", stroke: "#b9b29c", sw: 0.6 })), /* @__PURE__ */ React.createElement(IsoBox, { gx: 10, gy: 4.65, w: 1.8, d: 0.85, z0: 1.94, h: 0.16, color: "#efece2" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(10, 5.5, 2.1), pt(11.8, 5.5, 2.1), pt(10.9, 5.5, 2.78)]), fill: "#f4f0e4", stroke: "#b9b29c", strokeWidth: "0.8" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 9.9, gy: 2.5, w: 2, d: 2, z0: 2.42, h: 1, color: "#f2efe6", stroke: "#b9b29c", sw: 0.6 }), [-30, -18, -6, 6, 18, 30].map((k) => /* @__PURE__ */ React.createElement("line", { key: "dr" + k, x1: dx2 + k, y1: dy2 + 20.5, x2: dx2 + k, y2: dy2 + 26, stroke: "#b9b29c", strokeWidth: "1", opacity: ".85" })), /* @__PURE__ */ React.createElement("ellipse", { cx: dx2, cy: dy2, rx: "46", ry: "19", fill: "#ddd5bd", stroke: "#b9b29c", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("path", { d: `M${dx2 - 42},${dy2} A42,40 0 0 1 ${dx2 + 42},${dy2} A42,17.5 0 0 1 ${dx2 - 42},${dy2} Z`, fill: "url(#domeG)", stroke: "#b9b29c", strokeWidth: "1.1" }), /* @__PURE__ */ React.createElement("path", { d: `M${dx2 - 14},${dy2} A14,39.5 0 0 1 ${dx2 + 14},${dy2}`, fill: "none", stroke: "#c9c0a8", strokeWidth: "0.9", opacity: ".8" }), /* @__PURE__ */ React.createElement("path", { d: `M${dx2 - 28},${dy2} A28,38.5 0 0 1 ${dx2 + 28},${dy2}`, fill: "none", stroke: "#c9c0a8", strokeWidth: "0.9", opacity: ".7" }), /* @__PURE__ */ React.createElement("path", { d: `M${dx2 - 39},${dy2 - 14} A39,11 0 0 0 ${dx2 + 39},${dy2 - 14}`, fill: "none", stroke: "#c9c0a8", strokeWidth: "0.9", opacity: ".6" }), /* @__PURE__ */ React.createElement("path", { d: `M${dx2 - 28},${dy2 - 14} A34,28 0 0 1 ${dx2 - 4},${dy2 - 36}`, fill: "none", stroke: "#fdfcf8", strokeWidth: "3", opacity: ".7" }), /* @__PURE__ */ React.createElement("rect", { x: dx2 - 3.4, y: dy2 - 52, width: "6.8", height: "13", fill: "#f2efe6", stroke: "#b9b29c", strokeWidth: "0.9" }), /* @__PURE__ */ React.createElement("line", { x1: dx2, y1: dy2 - 52, x2: dx2, y2: dy2 - 60, stroke: "#5d6e7a", strokeWidth: "1.4" }), /* @__PURE__ */ React.createElement("circle", { cx: dx2, cy: dy2 - 62.5, r: "2.6", fill: "#5d6e7a" }));
    }
    if (id === "government") {
      const cols = [9.95, 10.65, 11.35, 12.05];
      return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, bandQuad("r", b, 0.22, 0.85, "#efe9da", 0.05), bandQuad("l", b, 0.22, 0.85, shade("#efe9da", 0.85), 0.05), /* @__PURE__ */ React.createElement(IsoBox, { gx: 9.7, gy: 5, w: 2.6, d: 1, z0: 0.22, h: 0.18, color: "#efe9da" }), cols.map((c) => /* @__PURE__ */ React.createElement(IsoBox, { key: c, gx: c, gy: 5.45, w: 0.16, d: 0.16, z0: 0.4, h: 1.95, color: "#f4f0e4", stroke: "#b9b29c", sw: 0.6 })), /* @__PURE__ */ React.createElement(IsoBox, { gx: 9.6, gy: 4.95, w: 2.8, d: 1.15, z0: 2.35, h: 0.22, color: "#efe9da" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(9.6, 6.1, 2.57), pt(12.4, 6.1, 2.57), pt(11, 6.1, 3.42)]), fill: "#f4f0e4", stroke: "#b9b29c", strokeWidth: "0.8" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(9.85, 6.1, 2.62), pt(12.15, 6.1, 2.62), pt(11, 6.1, 3.28)]), fill: "none", stroke: "#b9b29c", strokeWidth: "0.6" }));
    }
    if (id === "hospital") {
      const W = { gx: 19.8, gy: 2, w: 1.6, d: 3.6 };
      const [hpx, hpy] = pt(18.7, 4.6, zTop);
      return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(IsoBox, { gx: W.gx, gy: W.gy, w: W.w, d: W.d, z0: 0.22, h: 2.8, color: "#eef4f7" }), bandQuad("r", { gx: W.gx, gy: W.gy, w: W.w, d: W.d }, 1.4, 2.1, shade("#8ec9e8", 0.96), 0.15), bandQuad("l", { gx: W.gx, gy: W.gy, w: W.w, d: W.d }, 1.4, 2.1, shade("#8ec9e8", 0.74), 0.15), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(19.8, 2.85, 5.5), pt(19.8, 3.25, 5.5), pt(19.8, 3.25, 4.5), pt(19.8, 2.85, 4.5)]), fill: "#d64545" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(19.8, 2.55, 5.18), pt(19.8, 3.55, 5.18), pt(19.8, 3.55, 4.82), pt(19.8, 2.55, 4.82)]), fill: "#d64545" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 17.3, gy: 5.6, w: 1.5, d: 0.5, z0: 1, h: 0.1, color: "#f4f8fa" }), /* @__PURE__ */ React.createElement("line", { x1: pt(17.3, 6.1, 1)[0], y1: pt(17.3, 6.1, 1)[1], x2: pt(18.8, 6.1, 1)[0], y2: pt(18.8, 6.1, 1)[1], stroke: "#d64545", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("ellipse", { cx: hpx, cy: hpy, rx: 0.8 * U, ry: 0.4 * U, fill: shade("#f4f8fa", 0.88), stroke: "#8aa6b4", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("ellipse", { cx: hpx, cy: hpy, rx: 0.56 * U, ry: 0.28 * U, fill: "none", stroke: "#3f9be0", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: hpx, y: hpy + 5, textAnchor: "middle", fontFamily: "Archivo, sans-serif", fontWeight: "800", fontSize: "14", fill: "#3f9be0" }, "H"));
    }
    if (id === "hotel") {
      const stripes = [];
      for (let i = 0; i < 6; i++)
        stripes.push(/* @__PURE__ */ React.createElement(IsoBox, { key: i, gx: 25 + i * 0.4, gy: 11.6, w: 0.4, d: 0.34, z0: 1.04, h: 0.07, color: i % 2 ? "#f4f7f9" : "#2f9d96", sw: 0.5, stroke: "#1d6e69" }));
      const para = (gx, gy) => {
        const [x, y] = pt(gx, gy, 0.22);
        return /* @__PURE__ */ React.createElement("g", { key: gx + "p" }, /* @__PURE__ */ React.createElement("line", { x1: x, y1: y, x2: x, y2: y - 13, stroke: "#7e96a3", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("ellipse", { cx: x, cy: y - 14, rx: "9", ry: "4.5", fill: "#f4f7f9", stroke: "#2a8a80", strokeWidth: "1" }));
      };
      const [sx, sy] = pt(25.8, 11.6, 7.35);
      return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, stripes, para(25.4, 12.15), para(26.5, 12.2), /* @__PURE__ */ React.createElement(IsoBox, { gx: 25.45, gy: 11.6, w: 1.3, d: 0.95, z0: 1.35, h: 0.12, color: "#f4f7f9", stroke: "#9fb0ba", sw: 0.6 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 25.6, gy: 12.35, w: 0.12, d: 0.12, z0: 0.22, h: 1.13, color: "#e6eaec", sw: 0.5 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 26.6, gy: 12.35, w: 0.12, d: 0.12, z0: 0.22, h: 1.13, color: "#e6eaec", sw: 0.5 }), /* @__PURE__ */ React.createElement("line", { x1: pt(25.35, 11.62, 6.72)[0], y1: pt(25.35, 11.62, 6.72)[1], x2: sx - 14, y2: sy + 7, stroke: "#7e96a3", strokeWidth: "1.4" }), /* @__PURE__ */ React.createElement("line", { x1: pt(26.3, 11.62, 6.72)[0], y1: pt(26.3, 11.62, 6.72)[1], x2: sx + 14, y2: sy + 7, stroke: "#7e96a3", strokeWidth: "1.4" }), /* @__PURE__ */ React.createElement("rect", { x: sx - 24, y: sy - 8, width: "48", height: "15", rx: "2.5", fill: "#f4f7f9", stroke: "#2f7da0", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: sx, y: sy + 3.5, textAnchor: "middle", fontFamily: "Archivo, sans-serif", fontWeight: "800", fontSize: "9.5", letterSpacing: "2.5", fill: "#2f7da0" }, "HOTEL"));
    }
    if (id === "school") {
      const C = { x0: 1.3, y0: 20.1, x1: 2.6, y1: 22 };
      const mid = (C.y0 + C.y1) / 2;
      const [c1x, c1y] = pt((C.x0 + C.x1) / 2, mid, 0.03);
      const hoop = (gy) => {
        const [x, y] = pt((C.x0 + C.x1) / 2, gy, 0.03);
        return /* @__PURE__ */ React.createElement("g", { key: "h" + gy }, /* @__PURE__ */ React.createElement("line", { x1: x, y1: y, x2: x, y2: y - 16, stroke: "#5d6e7a", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: x - 5.5, y: y - 21, width: "11", height: "7", rx: "1", fill: "#f4f7f9", stroke: "#5d6e7a", strokeWidth: "0.9" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y - 13.5, r: "2.6", fill: "none", stroke: "#f5a623", strokeWidth: "1.5" }));
      };
      const trkO = ovalPts(4.6, 21.05, 1.35, 0.92, 24, 0.022);
      const trkL = ovalPts(4.6, 21.05, 1.13, 0.73, 24, 0.024);
      const trkI = ovalPts(4.6, 21.05, 0.92, 0.55, 24, 0.026);
      return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(IsoBox, { gx: 1.4, gy: 18.1, w: 2, d: 1.5, z0: 0.22, h: 2.3, color: "#ece4d2" }), bandQuad("r", { gx: 1.4, gy: 18.1, w: 2, d: 1.5 }, 1.65, 2.15, shade("#74b193", 0.96), 0.15), bandQuad("l", { gx: 1.4, gy: 18.1, w: 2, d: 1.5 }, 1.65, 2.15, shade("#74b193", 0.74), 0.15), (() => {
        const [px, py] = pt(4.55, 17.8, 0.02);
        return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("line", { x1: px, y1: py, x2: px, y2: py - 36, stroke: "#7e8d99", strokeWidth: "1.6" }), /* @__PURE__ */ React.createElement("polygon", { points: `${px},${py - 36} ${px + 12},${py - 33} ${px},${py - 29.5}`, fill: "#2e8a63" }));
      })(), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(3.1, 19.85, 0.018), pt(6.25, 19.85, 0.018), pt(6.25, 22.25, 0.018), pt(3.1, 22.25, 0.018)]), fill: "#5abf5e", stroke: "#3f9e4f", strokeWidth: "0.8" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(trkO), fill: "#c9705a", stroke: "#a85a48", strokeWidth: "0.9" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(trkL), fill: "none", stroke: "#f4f7f9", strokeWidth: "0.9", opacity: ".6" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(trkI), fill: "#4caf50", stroke: "#3f9e4f", strokeWidth: "0.8" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(C.x0, C.y0, 0.02), pt(C.x1, C.y0, 0.02), pt(C.x1, C.y1, 0.02), pt(C.x0, C.y1, 0.02)]), fill: "#6b9ac4", stroke: "#f4f7f9", strokeWidth: "1.2" }), /* @__PURE__ */ React.createElement("line", { x1: pt(C.x0, mid, 0.03)[0], y1: pt(C.x0, mid, 0.03)[1], x2: pt(C.x1, mid, 0.03)[0], y2: pt(C.x1, mid, 0.03)[1], stroke: "#f4f7f9", strokeWidth: "1.2" }), /* @__PURE__ */ React.createElement("ellipse", { cx: c1x, cy: c1y, rx: 0.28 * U, ry: 0.14 * U, fill: "none", stroke: "#f4f7f9", strokeWidth: "1.2" }), hoop(C.y0 + 0.18), hoop(C.y1 - 0.18), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(5, 16.6, 0.018), pt(6.2, 16.6, 0.018), pt(6.2, 19.2, 0.018), pt(5, 19.2, 0.018)]), fill: "#5abf5e", stroke: "#3f9e4f", strokeWidth: "0.8" }), tree(5.6, 17.3, 0.85), tree(5.5, 18.6, 0.85));
    }
    if (id === "university") {
      const T = { gx: 14.4, gy: 16.7, w: 0.8, d: 0.8 };
      const apex = pt(14.8, 17.1, zTop + 2.5);
      const [cx2, cy2] = pt(14.8, T.gy + T.d, zTop + 1.45);
      const cols = [14.05, 14.45, 14.85, 15.25];
      return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, bandQuad("r", b, 0.22, 0.55, "#efe9da", 0.05), bandQuad("l", b, 0.22, 0.55, shade("#efe9da", 0.88), 0.05), bandQuad("r", b, 3.2, 3.42, "#efe9da", 0.05), bandQuad("l", b, 3.2, 3.42, shade("#efe9da", 0.88), 0.05), /* @__PURE__ */ React.createElement(IsoBox, { gx: 13.9, gy: 19, w: 2, d: 0.7, z0: 0.22, h: 0.12, color: "#efe9da" }), cols.map((c) => /* @__PURE__ */ React.createElement(IsoBox, { key: c, gx: c, gy: 19.35, w: 0.14, d: 0.14, z0: 0.34, h: 1.72, color: "#f4f0e4", stroke: "#b9b29c", sw: 0.6 })), /* @__PURE__ */ React.createElement(IsoBox, { gx: 13.8, gy: 18.95, w: 2.2, d: 0.75, z0: 2.06, h: 0.14, color: "#efe9da" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(13.8, 19.7, 2.2), pt(16, 19.7, 2.2), pt(14.9, 19.7, 2.9)]), fill: "#f4f0e4", stroke: "#b9b29c", strokeWidth: "0.8" }));
    }
    if (id === "factory") return null;
    return null;
  }
  function FactoryRoof({ b }) {
    const teeth = [25.8, 26.9];
    const H = 2.42;
    return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, teeth.map((k) => /* @__PURE__ */ React.createElement("g", { key: k }, /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(24, k, H), pt(29, k, H), pt(29, k + 1.1, H + 0.7), pt(24, k + 1.1, H + 0.7)]), fill: "#eef1f3", stroke: "#5d6e7a", strokeWidth: "0.7" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(24, k + 1.1, H + 0.7), pt(29, k + 1.1, H + 0.7), pt(29, k + 1.1, H), pt(24, k + 1.1, H)]), fill: shade("#9fc0d1", 0.8), stroke: "#5d6e7a", strokeWidth: "0.7" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(29, k, H), pt(29, k + 1.1, H + 0.7), pt(29, k + 1.1, H)]), fill: shade("#e6eaec", 0.78), stroke: "#5d6e7a", strokeWidth: "0.7" }))));
  }
  function SchoolBus() {
    return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("ellipse", { cx: pt(0.84, 16.95, 0)[0], cy: pt(0.84, 16.95, 0)[1], rx: "4.6", ry: "2.8", fill: "#243640" }), /* @__PURE__ */ React.createElement("ellipse", { cx: pt(0.84, 17.85, 0)[0], cy: pt(0.84, 17.85, 0)[1], rx: "4.6", ry: "2.8", fill: "#243640" }), /* @__PURE__ */ React.createElement("ellipse", { cx: pt(0.84, 18.45, 0)[0], cy: pt(0.84, 18.45, 0)[1], rx: "3.6", ry: "2.2", fill: "#243640" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 0.26, gy: 16.4, w: 0.58, d: 1.85, z0: 0.07, h: 0.5, color: "#f0b429", stroke: "#9c731a", sw: 0.8 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 0.3, gy: 18.25, w: 0.5, d: 0.36, z0: 0.07, h: 0.3, color: "#f0b429", stroke: "#9c731a", sw: 0.8 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 0.31, gy: 16.46, w: 0.48, d: 1.72, z0: 0.57, h: 0.05, color: "#f7f3e6", stroke: "#c9a94d", sw: 0.5 }), [0, 1, 2, 3].map((k) => /* @__PURE__ */ React.createElement("polygon", { key: "bw" + k, points: poly([pt(0.84, 16.55 + k * 0.42, 0.47), pt(0.84, 16.85 + k * 0.42, 0.47), pt(0.84, 16.85 + k * 0.42, 0.31), pt(0.84, 16.55 + k * 0.42, 0.31)]), fill: "#243640" })), /* @__PURE__ */ React.createElement("line", { x1: pt(0.84, 16.45, 0.2)[0], y1: pt(0.84, 16.45, 0.2)[1], x2: pt(0.84, 18.2, 0.2)[0], y2: pt(0.84, 18.2, 0.2)[1], stroke: "#243640", strokeWidth: "1.6" }), /* @__PURE__ */ React.createElement("circle", { cx: pt(0.55, 18.66, 0.2)[0], cy: pt(0.55, 18.66, 0.2)[1], r: "1.6", fill: "#fff3cf" }));
  }
  function buildingDot(id) {
    const b = BLD[id];
    const hz = b.hotZ != null ? b.hotZ : 0.22 + b.H + 0.7;
    const [x, y] = pt(b.gx + b.w / 2, b.gy + b.d / 2, hz);
    return [x, y - 24];
  }
  function Building({ id, data, dim, sel, onOpen, onHover, onEquipment }) {
    const b = BLD[id];
    const cx = b.gx + b.w / 2, cyc = b.gy + b.d / 2;
    const zTop = 0.22 + b.H;
    const pl = b.plinth || { gx: b.gx - 0.25, gy: b.gy - 0.25, w: b.w + 0.5, d: b.d + 0.5 };
    const sOff = 0.28 + b.H * 0.07;
    return /* @__PURE__ */ React.createElement(
      "g",
      {
        className: "bldg-group" + (dim ? " dim" : "") + (sel ? " sel" : ""),
        onMouseEnter: () => onHover(id),
        onMouseLeave: () => onHover(null)
      },
      /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(pl.gx - sOff, pl.gy - sOff, 0.012), pt(pl.gx + pl.w - sOff, pl.gy - sOff, 0.012), pt(pl.gx + pl.w - sOff, pl.gy + pl.d - sOff, 0.012), pt(pl.gx - sOff, pl.gy + pl.d - sOff, 0.012)]), fill: "#1a2b21", opacity: ".12" }),
      id === "school" && /* @__PURE__ */ React.createElement(SchoolBus, null),
      /* @__PURE__ */ React.createElement(IsoBox, { gx: pl.gx, gy: pl.gy, w: pl.w, d: pl.d, z0: 0, h: 0.22, color: "#e2e9ee", stroke: "#9fb0ba" }),
      /* @__PURE__ */ React.createElement("g", { className: "bldg-hit", onClick: () => onOpen(id) }, /* @__PURE__ */ React.createElement(IsoBox, { gx: b.gx, gy: b.gy, w: b.w, d: b.d, z0: 0.22, h: b.H, color: b.body }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(b.gx + 0.2, b.gy + 0.2, zTop), pt(b.gx + b.w - 0.2, b.gy + 0.2, zTop), pt(b.gx + b.w - 0.2, b.gy + b.d - 0.2, zTop), pt(b.gx + 0.2, b.gy + b.d - 0.2, zTop)]), fill: shade(b.body, 0.94) }), /* @__PURE__ */ React.createElement(Skin, { b, z0: 0.22 }), b.skin !== "glass" && /* @__PURE__ */ React.createElement(Entrance, { b }), b.deco === "factory" ? /* @__PURE__ */ React.createElement(FactoryRoof, { b }) : /* @__PURE__ */ React.createElement(Deco, { id: b.deco, b, zTop })),
      b.equip.map((spec) => {
        const eq = window.FCG.EQUIP[spec.id];
        const z0e = spec.z0 != null ? spec.z0 : zTop;
        const hz = spec.hz != null ? spec.hz : z0e + spec.h;
        return /* @__PURE__ */ React.createElement("g", { key: spec.id }, /* @__PURE__ */ React.createElement(Equip, { spec, z0: z0e }), /* @__PURE__ */ React.createElement(
          Hotspot,
          {
            gx: spec.gx + spec.w / 2,
            gy: spec.gy + spec.d / 2,
            z: hz,
            r: 8,
            kind: "equip",
            cls: "eqhot",
            label: `${eq.label}. Covered by ${window.FCG.CAPS[eq.service].name}. Activate for details.`,
            onActivate: (e) => onEquipment(spec.id, e)
          }
        ));
      }),
      /* @__PURE__ */ React.createElement(
        Hotspot,
        {
          gx: cx,
          gy: cyc,
          z: b.hotZ != null ? b.hotZ : zTop + 0.7,
          r: 12,
          kind: "building",
          label: `${data.name}. ${data.category} vertical. Activate to view FirstCall capabilities.`,
          onActivate: () => onOpen(id)
        }
      )
    );
  }
  function Filler({ dim, cfg }) {
    const sOff = 0.24 + cfg.H * 0.07;
    return /* @__PURE__ */ React.createElement("g", { className: "bldg-group" + (dim ? " dim" : ""), style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(cfg.gx - 0.2 - sOff, cfg.gy - 0.2 - sOff, 0.012), pt(cfg.gx + cfg.w + 0.2 - sOff, cfg.gy - 0.2 - sOff, 0.012), pt(cfg.gx + cfg.w + 0.2 - sOff, cfg.gy + cfg.d + 0.2 - sOff, 0.012), pt(cfg.gx - 0.2 - sOff, cfg.gy + cfg.d + 0.2 - sOff, 0.012)]), fill: "#1a2b21", opacity: ".1" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: cfg.gx - 0.2, gy: cfg.gy - 0.2, w: cfg.w + 0.4, d: cfg.d + 0.4, z0: 0, h: 0.18, color: "#e2e9ee", stroke: "#9fb0ba" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: cfg.gx, gy: cfg.gy, w: cfg.w, d: cfg.d, z0: 0.18, h: cfg.H, color: cfg.body }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(cfg.gx + 0.18, cfg.gy + 0.18, 0.18 + cfg.H), pt(cfg.gx + cfg.w - 0.18, cfg.gy + 0.18, 0.18 + cfg.H), pt(cfg.gx + cfg.w - 0.18, cfg.gy + cfg.d - 0.18, 0.18 + cfg.H), pt(cfg.gx + 0.18, cfg.gy + cfg.d - 0.18, 0.18 + cfg.H)]), fill: shade(cfg.body, 0.94) }), /* @__PURE__ */ React.createElement(Skin, { b: cfg, z0: 0.18 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: cfg.gx + cfg.w * 0.3, gy: cfg.gy + cfg.d * 0.3, w: cfg.w * 0.25, d: cfg.d * 0.25, z0: 0.18 + cfg.H, h: 0.25, color: "#c3ced5" }));
  }
  const FILLERS_BACK = [
    { gx: 24.5, gy: 1.5, w: 2.6, d: 2.6, H: 5.5, floors: 6, skin: "bands", body: "#eef1f4", glass: "#a9c1cf", accent: "#8fa3ad" },
    { gx: 27.7, gy: 2.7, w: 1.9, d: 2.2, H: 3.4, floors: 3, skin: "cells", body: "#edeef0", glass: "#b5c7d2", accent: "#9aa7af" },
    { gx: 1.2, gy: 24.2, w: 4, d: 3, H: 1.8, skin: "clad", body: "#e9ecee", glass: "#b5c7d2", accent: "#9aa7af" },
    // campus library (brick + white trim)
    { gx: 8.4, gy: 16.5, w: 2.4, d: 1.9, H: 2.2, floors: 2, skin: "cells", body: "#b3604e", glass: "#f3e2c2", accent: "#efe9da" }
  ];
  const FILLERS_FRONT = [
    { gx: 28.5, gy: 9.2, w: 1.3, d: 1.6, H: 1.4, floors: 2, skin: "cells", body: "#eef1f4", glass: "#a9c1cf", accent: "#9aa7af" },
    // campus dormitory (brick, matches the hall)
    { gx: 18.9, gy: 16.3, w: 3, d: 2.2, H: 3, floors: 3, skin: "cells", body: "#b3604e", glass: "#f3e2c2", accent: "#efe9da" },
    // campus science hall (brick, west lawn)
    { gx: 8.3, gy: 23.8, w: 2.2, d: 1.8, H: 2, floors: 2, skin: "cells", body: "#b3604e", glass: "#f3e2c2", accent: "#efe9da" }
  ];
  const CALLOUTS = {
    office: { lx: 1140, ly: 26, anchor: "middle", cx: 1140, cy: 56, subDy: 18 },
    government: { lx: 2208, ly: 244, anchor: "end", cx: 2040, cy: 250 },
    hospital: { lx: 2208, ly: 380, anchor: "end", cx: 2040, cy: 386 },
    hotel: { lx: 2208, ly: 710, anchor: "end", cx: 2040, cy: 716 },
    dataCenter: { lx: 72, ly: 330, anchor: "start", cx: 300, cy: 336 },
    school: { lx: 72, ly: 480, anchor: "start", cx: 300, cy: 486 },
    university: { lx: 72, ly: 640, anchor: "start", cx: 300, cy: 646 },
    multifamily: { lx: 1690, ly: 1060, anchor: "start", cx: 1662, cy: 1054 },
    industrial: { lx: 2208, ly: 984, anchor: "end", cx: 2040, cy: 990 }
  };
  function Callouts({ spotlight, onOpen, onHover }) {
    const data = window.FCG.BUILDINGS.reduce((m, b) => (m[b.id] = b, m), {});
    return /* @__PURE__ */ React.createElement("g", null, Object.keys(CALLOUTS).map((id) => {
      const c = CALLOUTS[id];
      const [dx, dy] = buildingDot(id);
      const dim = !!spotlight && spotlight !== id;
      const active = spotlight === id;
      const dir = dx > c.cx ? 1 : -1;
      const path = c.anchor === "middle" ? `M${c.cx},${c.cy} L${dx},${dy}` : `M${c.cx},${c.cy} h${dir * 85} L${dx},${dy}`;
      return /* @__PURE__ */ React.createElement(
        "g",
        {
          key: id,
          className: "callout" + (dim ? " dim" : ""),
          "aria-hidden": "true",
          onClick: () => onOpen(id),
          onMouseEnter: () => onHover(id),
          onMouseLeave: () => onHover(null)
        },
        /* @__PURE__ */ React.createElement("path", { d: path, fill: "none", stroke: active ? "#005090" : "#9aa79b", strokeWidth: "1.3", strokeDasharray: "1 4.5", strokeLinecap: "round" }),
        /* @__PURE__ */ React.createElement("circle", { cx: c.cx, cy: c.cy, r: "3.5", fill: active ? "#005090" : "#8a988c" }),
        /* @__PURE__ */ React.createElement("text", { x: c.lx, y: c.ly, textAnchor: c.anchor, fontFamily: "Archivo, sans-serif", fontWeight: "700", fontSize: "27", fill: active ? "#005090" : "#182a1f" }, data[id].category),
        /* @__PURE__ */ React.createElement("text", { className: "co-sub", x: c.lx, y: c.ly + (c.subDy || 23), textAnchor: c.anchor, fontFamily: "IBM Plex Mono, monospace", fontSize: "14.5", letterSpacing: ".5", fill: "#7d897f" }, data[id].name)
      );
    }));
  }
  function Car({ gx, gy, axis, color, idx, bus }) {
    const along = axis === "x";
    const w = along ? bus ? 1.9 : 0.95 : 0.5, d = along ? 0.5 : bus ? 1.9 : 0.95;
    const [lx, ly] = pt(along ? gx + w : gx + w / 2, along ? gy + d / 2 : gy + d, 0.22);
    const wheelPts = along ? bus ? [[gx + 0.3, gy + d], [gx + 0.95, gy + d], [gx + 1.6, gy + d]] : [[gx + 0.22, gy + d], [gx + 0.75, gy + d]] : bus ? [[gx + w, gy + 0.3], [gx + w, gy + 0.95], [gx + w, gy + 1.6]] : [[gx + w, gy + 0.22], [gx + w, gy + 0.75]];
    return /* @__PURE__ */ React.createElement("g", { className: "car car-" + idx }, wheelPts.map(([wx2, wy2], i) => {
      const [px2, py2] = pt(wx2, wy2, 0);
      return /* @__PURE__ */ React.createElement("ellipse", { key: "w" + i, cx: px2, cy: py2, rx: "2.8", ry: "1.8", fill: "#243640" });
    }), /* @__PURE__ */ React.createElement(IsoBox, { gx, gy, w, d, z0: 0.06, h: bus ? 0.42 : 0.28, color, sw: 0.7, stroke: shade(color, 0.6) }), bus ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement(IsoBox, { gx: gx + 0.06, gy: gy + 0.06, w: w - 0.12, d: d - 0.12, z0: 0.48, h: 0.05, color: "#f7f3e6", sw: 0.5, stroke: "#b9c2c9" }), along ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("line", { x1: pt(gx + 0.12, gy + d, 0.36)[0], y1: pt(gx + 0.12, gy + d, 0.36)[1], x2: pt(gx + w - 0.12, gy + d, 0.36)[0], y2: pt(gx + w - 0.12, gy + d, 0.36)[1], stroke: "#243640", strokeWidth: "2.6" }), /* @__PURE__ */ React.createElement("line", { x1: pt(gx + 0.12, gy + d, 0.16)[0], y1: pt(gx + 0.12, gy + d, 0.16)[1], x2: pt(gx + w - 0.12, gy + d, 0.16)[0], y2: pt(gx + w - 0.12, gy + d, 0.16)[1], stroke: "#2a8a4e", strokeWidth: "2.2" })) : /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("line", { x1: pt(gx + w, gy + 0.12, 0.36)[0], y1: pt(gx + w, gy + 0.12, 0.36)[1], x2: pt(gx + w, gy + d - 0.12, 0.36)[0], y2: pt(gx + w, gy + d - 0.12, 0.36)[1], stroke: "#243640", strokeWidth: "2.6" }), /* @__PURE__ */ React.createElement("line", { x1: pt(gx + w, gy + 0.12, 0.16)[0], y1: pt(gx + w, gy + 0.12, 0.16)[1], x2: pt(gx + w, gy + d - 0.12, 0.16)[0], y2: pt(gx + w, gy + d - 0.12, 0.16)[1], stroke: "#2a8a4e", strokeWidth: "2.2" }))) : /* @__PURE__ */ React.createElement(IsoBox, { gx: along ? gx + 0.22 : gx + 0.08, gy: along ? gy + 0.08 : gy + 0.22, w: along ? 0.5 : 0.34, d: along ? 0.34 : 0.5, z0: 0.34, h: 0.2, color: shade(color, 0.62), sw: 0.7, stroke: shade(color, 0.45) }), /* @__PURE__ */ React.createElement("circle", { cx: lx, cy: ly, r: "1.7", fill: "#fff3cf" }));
  }
  const TRAFFIC = [
    // uniform speed + staggered phases chosen so no two cars ever meet at an intersection
    { gx: 0.3, gy: 6.6, axis: "x", len: 28.5, color: "#f4f7f9", dur: 28, delay: -0.01 },
    { gx: 0.3, gy: 7.15, axis: "x", len: 28.5, color: "#36454f", dur: 28, delay: -14 },
    { gx: 0.3, gy: 14.7, axis: "x", len: 28.5, color: "#e0a63d", dur: 28, delay: -4 },
    { gx: 0.3, gy: 15.1, axis: "x", len: 28.5, color: "#c25450", dur: 28, delay: -21 },
    { gx: 7.15, gy: 0.3, axis: "y", len: 28.5, color: "#3b7fd4", dur: 28, delay: -18 },
    { gx: 6.6, gy: 0.3, axis: "y", len: 28.5, color: "#8a9aa6", dur: 28, delay: -6 },
    { gx: 22.7, gy: 0.3, axis: "y", len: 28.5, color: "#f4f7f9", dur: 28, delay: -20 },
    { gx: 23.15, gy: 0.3, axis: "y", len: 28.5, color: "#36454f", dur: 28, delay: -24 },
    // FirstCall-livery transit bus on the east avenue (phase keeps it clear of all crossings)
    { gx: 22.7, gy: 0.3, axis: "y", len: 28.5, color: "#eef3f6", dur: 28, delay: -6, bus: true }
  ];
  function Traffic() {
    const css = "@media (prefers-reduced-motion: no-preference){" + TRAFFIC.map((c, i) => {
      const dx = ((c.axis === "x" ? c.len : -c.len) * U).toFixed(0);
      const dy = (c.len * U * 0.5).toFixed(0);
      return `@keyframes carm${i}{0%{opacity:0;transform:translate(0,0)}5%{opacity:1}95%{opacity:1}100%{opacity:0;transform:translate(${dx}px,${dy}px)}}.car-${i}{animation:carm${i} ${c.dur}s linear infinite;animation-delay:${c.delay}s}`;
    }).join("") + "}";
    return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("style", null, css), TRAFFIC.map((c, i) => /* @__PURE__ */ React.createElement(Car, { key: i, idx: i, ...c })));
  }
  function tree(gx, gy, s = 1) {
    const [x, y] = pt(gx, gy, 0);
    return /* @__PURE__ */ React.createElement("g", { key: "t" + gx + "-" + gy }, /* @__PURE__ */ React.createElement("rect", { x: x - 1.5, y: y - 13 * s, width: 3, height: 13 * s, fill: "#8a6239" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y - 17 * s, r: 8.5 * s, fill: "#43a04a" }), /* @__PURE__ */ React.createElement("circle", { cx: x - 4 * s, cy: y - 13 * s, r: 5.5 * s, fill: "#5cbf60" }), /* @__PURE__ */ React.createElement("circle", { cx: x + 4 * s, cy: y - 14 * s, r: 5.5 * s, fill: "#37934d" }));
  }
  function bench(gx, gy, vert = false) {
    const w = vert ? 0.14 : 0.42, d = vert ? 0.42 : 0.14;
    return /* @__PURE__ */ React.createElement(IsoBox, { key: "bn" + gx + "-" + gy, gx, gy, w, d, z0: 0.02, h: 0.1, color: "#c09060", stroke: "#8a6239", sw: 0.5 });
  }
  function lamp(gx, gy) {
    const [x, y] = pt(gx, gy, 0);
    return /* @__PURE__ */ React.createElement("g", { key: "lp" + gx + "-" + gy }, /* @__PURE__ */ React.createElement("line", { x1: x, y1: y, x2: x, y2: y - 24, stroke: "#5d6e7a", strokeWidth: "1.6" }), /* @__PURE__ */ React.createElement("rect", { x: x + 1.5, y: y - 22, width: "6.5", height: "4.5", rx: "0.8", fill: "#2e7d49" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y - 26, r: "2.6", fill: "#ffe9b0", stroke: "#c9b96a", strokeWidth: "0.7" }));
  }
  function statue(gx, gy) {
    const [x, y] = pt(gx, gy, 0);
    return /* @__PURE__ */ React.createElement("g", { key: "st" + gx + "-" + gy }, /* @__PURE__ */ React.createElement(IsoBox, { gx: gx - 0.18, gy: gy - 0.18, w: 0.36, d: 0.36, z0: 0, h: 0.4, color: "#cfc9b4", stroke: "#9a937c", sw: 0.6 }), /* @__PURE__ */ React.createElement("rect", { x: x - 2, y: y - 21, width: "4", height: "10", rx: "1.5", fill: "#5d6e7a" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y - 23.5, r: "2.4", fill: "#5d6e7a" }));
  }
  function Ground() {
    const N = 30, thick = 1.4;
    const strip = (a, c, b2, d2, z = 0.02) => poly([pt(a, c, z), pt(b2, c, z), pt(b2, d2, z), pt(a, d2, z)]);
    const grass = (a, c, b2, d2) => /* @__PURE__ */ React.createElement("polygon", { points: strip(a, c, b2, d2, 0.015), fill: "#5abf5e", stroke: "#3f9e4f", strokeWidth: "0.8" });
    const cross = (vert, at, from) => {
      const out = [];
      for (let i = 0; i < 4; i++) {
        const o = from + i * 0.28;
        out.push(vert ? /* @__PURE__ */ React.createElement("line", { key: "c" + at + i + from, x1: pt(at - 0.5, o, 0.03)[0], y1: pt(at - 0.5, o, 0.03)[1], x2: pt(at + 0.5, o, 0.03)[0], y2: pt(at + 0.5, o, 0.03)[1], stroke: "#f4f7f9", strokeWidth: "3.5", opacity: ".85" }) : /* @__PURE__ */ React.createElement("line", { key: "ch" + at + i + from, x1: pt(o, at - 0.5, 0.03)[0], y1: pt(o, at - 0.5, 0.03)[1], x2: pt(o, at + 0.5, 0.03)[0], y2: pt(o, at + 0.5, 0.03)[1], stroke: "#f4f7f9", strokeWidth: "3.5", opacity: ".85" }));
      }
      return out;
    };
    const dash = (vert, at, g) => vert ? /* @__PURE__ */ React.createElement("line", { key: "dv" + at + g, x1: pt(at, g, 0.02)[0], y1: pt(at, g, 0.02)[1], x2: pt(at, Math.min(g + 0.9, N), 0.02)[0], y2: pt(at, Math.min(g + 0.9, N), 0.02)[1], stroke: "#f4f7f9", strokeWidth: "1.8", opacity: ".9" }) : /* @__PURE__ */ React.createElement("line", { key: "dh" + at + g, x1: pt(g, at, 0.02)[0], y1: pt(g, at, 0.02)[1], x2: pt(Math.min(g + 0.9, N), at, 0.02)[0], y2: pt(Math.min(g + 0.9, N), at, 0.02)[1], stroke: "#f4f7f9", strokeWidth: "1.8", opacity: ".9" });
    const dashes = [];
    for (let g = 0.8; g < N; g += 2.2) {
      dashes.push(dash(false, 7, g), dash(false, 15, g), dash(true, 7, g), dash(true, 23, g));
      if (g < 6.6 || g > 18.6) dashes.push(dash(false, 23, g));
      if (g < 5.5) dashes.push(dash(true, 15, g));
    }
    const mowStripes = [];
    for (let k = 0; k < 6; k++)
      if (k % 2 === 0) mowStripes.push(/* @__PURE__ */ React.createElement("polygon", { key: "lw" + k, points: strip(12.7, 20 + k * 1.55, 17.1, Math.min(20 + (k + 1) * 1.55, 29.3), 0.016), fill: "#62c566", opacity: ".55" }));
    const flood = (gx, gy) => {
      const [x, y] = pt(gx, gy, 0);
      return /* @__PURE__ */ React.createElement("g", { key: "fl" + gx + gy }, /* @__PURE__ */ React.createElement("line", { x1: x, y1: y, x2: x, y2: y - 34, stroke: "#8d9aa6", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y - 37, r: "3.5", fill: "#ffe9b0", stroke: "#c9b96a", strokeWidth: "0.8" }));
    };
    return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(N, 0, 0), pt(N, N, 0), pt(N, N, -thick), pt(N, 0, -thick)]), fill: "#5a6a76", stroke: "#3a4751" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(0, N, 0), pt(N, N, 0), pt(N, N, -thick), pt(0, N, -thick)]), fill: "#46545f", stroke: "#3a4751" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(0, 0, 0), pt(N, 0, 0), pt(N, N, 0), pt(0, N, 0)]), fill: "#c6d0d7", stroke: "#8d9aa6", strokeWidth: "1", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(0, 6.4, N, 7.6), fill: "#8d9aa6" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(0, 14.4, N, 15.6), fill: "#8d9aa6" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(0, 22.4, 7.6, 23.6), fill: "#8d9aa6" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(18.6, 22.4, N, 23.6), fill: "#8d9aa6" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(6.4, 0, 7.6, N), fill: "#8d9aa6" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(22.4, 0, 23.6, N), fill: "#8d9aa6" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(14.4, 0, 15.6, 6.4), fill: "#8d9aa6" }), dashes, cross(true, 7, 10.6), cross(true, 23, 10.6), cross(false, 15, 10.6), cross(false, 15, 18.6), grass(7.9, 7.9, 22.1, 14.1), (() => {
      const s = 0.0282, ox = 8.8, oy = 8.91, hh = 0.55, sOff = 0.3;
      const iv = [[4, 74], [41, 8], [115, 8], [152, 74], [115, 140], [41, 140]];
      const g2 = iv.map(([px2, py2]) => [ox + px2 * s, oy + py2 * s]);
      const cxm = ox + 78 * s, cym = oy + 74 * s;
      const P = (v, z) => pt(v[0], v[1], z);
      const topPts = g2.map((v) => P(v, hh));
      const clipPts = g2.map((v) => P([cxm + (v[0] - cxm) * 0.985, cym + (v[1] - cym) * 0.985], hh));
      const pavePts = g2.map((v) => P([cxm + (v[0] - cxm) * 1.38, cym + (v[1] - cym) * 1.38], 0.015));
      const faces = [];
      for (let k = 0; k < 6; k++) {
        const a2 = g2[k], b2 = g2[(k + 1) % 6];
        const mx = (a2[0] + b2[0]) / 2 - cxm, my = (a2[1] + b2[1]) / 2 - cym;
        if (mx + my > 0.15) {
          const f = Math.max(0.7, Math.min(0.94, 0.82 + 0.12 * (mx - my) / (Math.abs(mx) + Math.abs(my) + 1e-3)));
          faces.push(/* @__PURE__ */ React.createElement("polygon", { key: "hf" + k, points: poly([P(a2, hh), P(b2, hh), P(b2, 0), P(a2, 0)]), fill: shade("#2a7045", f), stroke: "#143a20", strokeWidth: "0.8" }));
        }
      }
      const [ex2, ey2] = pt(ox, oy, hh);
      return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("polygon", { points: poly(pavePts), fill: "#d6dee3", stroke: "#b9c2c9", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(g2.map((v) => pt(v[0] - sOff, v[1] - sOff, 0.012))), fill: "#1a2b21", opacity: ".12" }), faces, /* @__PURE__ */ React.createElement("polygon", { points: poly(topPts), fill: "#2a7045" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(clipPts), fill: "none", stroke: "#1b4d2b", strokeWidth: "1.6" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(topPts), fill: "none", stroke: "#143a20", strokeWidth: "1.2" }));
    })(), /* @__PURE__ */ React.createElement("polygon", { points: strip(10.8, 8.1, 11.2, 8.5, 0.013), fill: "#e2dac4" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(10.8, 13.5, 11.2, 13.95, 0.013), fill: "#e2dac4" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(19.55, 10.8, 21.9, 11.2, 0.013), fill: "#e2dac4" }), (() => {
      const s = 0.0282, ox = 14.4, oy = 8.91, hh = 0.55, sOff = 0.3;
      const iv = [[4, 74], [41, 8], [115, 8], [152, 74], [115, 140], [41, 140]];
      const g2 = iv.map(([px2, py2]) => [ox + px2 * s, oy + py2 * s]);
      const cxm = ox + 78 * s, cym = oy + 74 * s;
      const P = (v, z) => pt(v[0], v[1], z);
      const topPts = g2.map((v) => P(v, hh));
      const inPts = g2.map((v) => P([cxm + (v[0] - cxm) * 0.985, cym + (v[1] - cym) * 0.985], hh));
      const pavePts = g2.map((v) => P([cxm + (v[0] - cxm) * 1.3, cym + (v[1] - cym) * 1.3], 0.015));
      const faces = [];
      for (let k = 0; k < 6; k++) {
        const a2 = g2[k], b2 = g2[(k + 1) % 6];
        const mx = (a2[0] + b2[0]) / 2 - cxm, my = (a2[1] + b2[1]) / 2 - cym;
        if (mx + my > 0.1) {
          const f = Math.max(0.7, Math.min(0.94, 0.82 + 0.12 * (mx - my) / (Math.abs(mx) + Math.abs(my) + 1e-3)));
          faces.push(/* @__PURE__ */ React.createElement("polygon", { key: "bhf" + k, points: poly([P(a2, hh), P(b2, hh), P(b2, 0), P(a2, 0)]), fill: shade("#1d5c92", f), stroke: "#0a3a66", strokeWidth: "0.8" }));
        }
      }
      return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("polygon", { points: poly(pavePts), fill: "#d6dee3", stroke: "#b9c2c9", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(g2.map((v) => pt(v[0] - sOff, v[1] - sOff, 0.012))), fill: "#1a2b21", opacity: ".12" }), faces, /* @__PURE__ */ React.createElement("polygon", { points: poly(topPts), fill: "#2a6fa8" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(inPts), fill: "none", stroke: "#0d4578", strokeWidth: "1.4" }), /* @__PURE__ */ React.createElement("polygon", { points: poly(topPts), fill: "none", stroke: "#0a3a66", strokeWidth: "1.1" }));
    })(), tree(8.2, 8.2, 0.9), tree(13.8, 8.1, 0.9), tree(8.1, 13.7, 0.9), tree(19.9, 10.3), tree(19.9, 11.9), tree(21.3, 10.3), tree(21.3, 11.9), bench(20.6, 10.55), bench(20.6, 11.55), lamp(21.1, 10.5), lamp(21.7, 13.7), grass(0.25, 0.25, 1.25, 6.1), tree(0.7, 2.6, 0.9), tree(0.7, 4.6, 0.9), grass(5.75, 0.25, 6.15, 6.1), /* @__PURE__ */ React.createElement(IsoBox, { gx: 5.82, gy: 1.2, w: 0.22, d: 0.9, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 5.82, gy: 3.2, w: 0.22, d: 0.9, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), grass(7.85, 0.25, 8.45, 6.1), tree(8.1, 1.2, 0.85), grass(13.4, 0.25, 14.15, 6.1), tree(13.8, 2, 0.85), /* @__PURE__ */ React.createElement(IsoBox, { gx: 9, gy: 5.75, w: 0.9, d: 0.22, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 11.9, gy: 5.75, w: 0.9, d: 0.22, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), grass(15.7, 0.3, 16.2, 5.8), /* @__PURE__ */ React.createElement(IsoBox, { gx: 15.78, gy: 1.5, w: 0.22, d: 0.9, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), grass(21.8, 0.3, 22.3, 5.9), /* @__PURE__ */ React.createElement(IsoBox, { gx: 21.88, gy: 2.4, w: 0.22, d: 0.9, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), grass(0.25, 7.85, 1.05, 14.1), tree(0.6, 9, 0.85), tree(0.6, 12.8, 0.85), grass(1.4, 12.7, 6.2, 14.1), /* @__PURE__ */ React.createElement(IsoBox, { gx: 2.2, gy: 13.15, w: 0.9, d: 0.22, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 4.2, gy: 13.15, w: 0.9, d: 0.22, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), lamp(5.8, 13.6), grass(28.5, 7.85, 29.75, 11.4), tree(29, 8.6, 0.9), tree(29.1, 10.6, 0.9), grass(26.9, 12.5, 29.6, 13.9), /* @__PURE__ */ React.createElement("polygon", { points: strip(27.3, 12.75, 28.9, 13.55, 0.02), fill: "#d9d2bc" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(27.45, 12.88, 28.75, 13.42, 0.028), fill: "#36a3e8" }), bench(27, 12.62), bench(28.2, 13.62), tree(29.25, 13.6, 0.8), lamp(24.4, 13.5), grass(28.7, 15.8, 29.8, 19.4), tree(29.2, 16.6, 0.85), tree(29.2, 18.4, 0.85), grass(23.8, 19.8, 29.8, 22.2), tree(25, 20.9, 0.95), tree(27.6, 21.3, 0.95), bench(24.5, 20.2), lamp(28.8, 21.8), grass(23.8, 28.6, 29.8, 29.75), tree(24.6, 29.15, 0.85), tree(28.8, 29.2, 0.85), grass(23.8, 5.4, 29.8, 6.15), tree(24.6, 5.75, 0.8), tree(28.6, 5.8, 0.8), grass(0.25, 23.8, 1.05, 29.7), tree(0.6, 26.4, 0.85), lamp(3.4, 0.4), lamp(12, 0.4), lamp(19.6, 0.4), grass(7.9, 15.9, 18.6, 29.8), /* @__PURE__ */ React.createElement("polygon", { points: strip(12.3, 19.9, 12.7, 29.3, 0.018), fill: "#e2dac4" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(17.1, 19.9, 17.5, 29.3, 0.018), fill: "#e2dac4" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(12.3, 29.3, 17.5, 29.7, 0.018), fill: "#e2dac4" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(12.7, 26.8, 17.1, 27.2, 0.018), fill: "#e2dac4" }), mowStripes, /* @__PURE__ */ React.createElement(IsoBox, { gx: 14, gy: 19.95, w: 1.8, d: 0.85, z0: 0, h: 0.34, color: "#d9d2bc", sw: 0.6 }), /* @__PURE__ */ React.createElement("polygon", { points: strip(14.12, 20.07, 15.68, 20.68, 0.36), fill: "#36a3e8" }), [0, 1, 2, 3, 4, 5].map((k) => {
      const gy0 = 20.8 + k * 0.45;
      const h = 0.26 - k * 0.045;
      const w = 1.6 - k * 0.06;
      const gx0 = 14.9 - w / 2;
      return /* @__PURE__ */ React.createElement("g", { key: "cs" + k }, /* @__PURE__ */ React.createElement(IsoBox, { gx: gx0, gy: gy0, w, d: 0.45, z0: 0, h, color: "#d9d2bc", sw: 0.6 }), /* @__PURE__ */ React.createElement("polygon", { points: strip(gx0 + 0.06, gy0 + 0.02, gx0 + w - 0.06, gy0 + 0.43, h + 0.015), fill: "#5ab4ec", opacity: ".9" }));
    }), /* @__PURE__ */ React.createElement("polygon", { points: strip(13.85, 23.55, 15.95, 26.6, 0.02), fill: "#d9d2bc" }), /* @__PURE__ */ React.createElement("polygon", { points: strip(14, 23.7, 15.8, 26.45, 0.028), fill: "#36a3e8" }), (() => {
      const [fx2, fy2] = pt(14.9, 25, 0.03);
      return /* @__PURE__ */ React.createElement("ellipse", { cx: fx2, cy: fy2, rx: "13", ry: "6.5", fill: "#bfe6ff", opacity: ".7" });
    })(), [20.6, 22, 23.4, 24.8, 26.2, 27.6, 29].map((g) => tree(11.8, g, 1.05)), [20.6, 22, 23.4, 24.8, 26.2, 27.6, 29].map((g) => tree(18, g, 1.05)), tree(9.4, 20.6), tree(10.9, 22.6), tree(9, 26.8), tree(10.6, 28.8), statue(13.35, 20.35), bench(13.6, 23.6, true), bench(16.1, 23.6, true), bench(12, 22.4, true), bench(12, 25.8, true), bench(17.6, 22.8, true), bench(17.6, 26.2, true), lamp(12.45, 21.4), lamp(12.45, 24.8), lamp(12.45, 28.2), lamp(17.35, 20.4), lamp(17.35, 23.8), lamp(17.35, 27.2), grass(18.7, 15.9, 22.25, 22.3), tree(11.7, 17.6), tree(18.1, 17.6), /* @__PURE__ */ React.createElement(IsoBox, { gx: 12.6, gy: 19.15, w: 0.9, d: 0.22, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 16, gy: 19.15, w: 0.9, d: 0.22, z0: 0.02, h: 0.16, color: "#3f9e4f", stroke: "#2e7d3c", sw: 0.5 }), /* @__PURE__ */ React.createElement("polygon", { points: strip(19.2, 24.2, 22.2, 27.4, 0.018), fill: "#8d9aa6" }), [0, 1, 2, 3, 4].map((k) => /* @__PURE__ */ React.createElement("g", { key: "st" + k }, /* @__PURE__ */ React.createElement("line", { x1: pt(19.5 + k * 0.62, 24.3, 0.025)[0], y1: pt(19.5 + k * 0.62, 24.3, 0.025)[1], x2: pt(19.5 + k * 0.62, 25.4, 0.025)[0], y2: pt(19.5 + k * 0.62, 25.4, 0.025)[1], stroke: "#f4f7f9", strokeWidth: "1.1", opacity: ".8" }), /* @__PURE__ */ React.createElement("line", { x1: pt(19.5 + k * 0.62, 26.2, 0.025)[0], y1: pt(19.5 + k * 0.62, 26.2, 0.025)[1], x2: pt(19.5 + k * 0.62, 27.3, 0.025)[0], y2: pt(19.5 + k * 0.62, 27.3, 0.025)[1], stroke: "#f4f7f9", strokeWidth: "1.1", opacity: ".8" }))), /* @__PURE__ */ React.createElement(IsoBox, { gx: 19.65, gy: 24.4, w: 0.48, d: 0.9, z0: 0, h: 0.28, color: "#3b7fd4", sw: 0.6 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 20.9, gy: 24.4, w: 0.48, d: 0.9, z0: 0, h: 0.28, color: "#f4f7f9", sw: 0.6 }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 20.27, gy: 26.3, w: 0.48, d: 0.9, z0: 0, h: 0.28, color: "#36454f", sw: 0.6 }), grass(0.15, 0.15, 1.3, 1.3), grass(28.7, 0.15, 29.85, 1.3), grass(0.15, 28.7, 1.3, 29.85), grass(28.7, 28.7, 29.85, 29.85), tree(0.7, 0.7, 0.9), tree(29.25, 0.7, 0.9), tree(0.7, 29.25, 0.9), tree(29.25, 29.25, 0.9), grass(0.2, 5.4, 1.1, 6.2), grass(5.5, 0.2, 6.3, 1.1), grass(28.9, 5.6, 29.8, 6.4), grass(0.2, 21.3, 1.1, 22.1), tree(0.65, 5.8, 0.85), tree(5.9, 0.65, 0.85), tree(29.35, 6, 0.85), tree(0.65, 21.7, 0.85), tree(16.4, 0.8, 0.85), tree(8.3, 0.8, 0.85), tree(24, 14, 0.85), tree(24.1, 21.9, 0.85));
  }
  function StreetProps() {
    return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement(IsoBox, { gx: 14.65, gy: 4, w: 0.62, d: 1.55, z0: 0, h: 0.62, color: "#2a8a4e", stroke: "#10401f" }), /* @__PURE__ */ React.createElement(IsoBox, { gx: 14.65, gy: 5.6, w: 0.62, d: 0.5, z0: 0, h: 0.48, color: "#eef3f6", stroke: "#9fb0ba" }), /* @__PURE__ */ React.createElement("line", { x1: pt(15.27, 4.1, 0.42)[0], y1: pt(15.27, 4.1, 0.42)[1], x2: pt(15.27, 5.7, 0.42)[0], y2: pt(15.27, 5.7, 0.42)[1], stroke: "#005090", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("circle", { cx: pt(14.95, 6.18, 0.55)[0], cy: pt(14.95, 6.18, 0.55)[1], r: "1.8", fill: "#f5a623" })), /* @__PURE__ */ React.createElement("g", { opacity: ".95" }, /* @__PURE__ */ React.createElement(IsoBox, { gx: 23.85, gy: 24, w: 0.26, d: 0.26, z0: 0, h: 6.5, color: "#8d9aa6", stroke: "#5d6e7a" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(23.98, 24.13, 6.5), pt(23.98, 24.13, 6.72), pt(28.1, 24.13, 6.72), pt(28.1, 24.13, 6.5)]), fill: "#aebec7", stroke: "#5d6e7a" }), /* @__PURE__ */ React.createElement("polygon", { points: poly([pt(23.98, 24.13, 6.5), pt(23.98, 24.13, 6.72), pt(22.55, 24.13, 6.72), pt(22.55, 24.13, 6.5)]), fill: "#8d9aa6", stroke: "#5d6e7a" }), /* @__PURE__ */ React.createElement("line", { x1: pt(27.3, 24.13, 6.5)[0], y1: pt(27.3, 24.13, 6.5)[1], x2: pt(27.3, 24.13, 4)[0], y2: pt(27.3, 24.13, 4)[1], stroke: "#7e96a3", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("rect", { x: pt(27.3, 24.13, 4)[0] - 7, y: pt(27.3, 24.13, 4)[1], width: "14", height: "9", rx: "2", fill: "#f5a623" })));
  }
  function WaterTower() {
    const [wx, wy] = pt(5.7, 28, 0);
    return /* @__PURE__ */ React.createElement("g", { style: { pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("ellipse", { cx: wx + 8, cy: wy + 3, rx: "16", ry: "6", fill: "#1a2b21", opacity: ".1" }), /* @__PURE__ */ React.createElement("line", { x1: wx - 13, y1: wy, x2: wx - 9, y2: wy - 48, stroke: "#7e8d99", strokeWidth: "2.4" }), /* @__PURE__ */ React.createElement("line", { x1: wx + 13, y1: wy, x2: wx + 9, y2: wy - 48, stroke: "#5d6e7a", strokeWidth: "2.4" }), /* @__PURE__ */ React.createElement("line", { x1: wx - 5, y1: wy - 4, x2: wx - 3, y2: wy - 48, stroke: "#6e7f8a", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: wx + 5, y1: wy - 4, x2: wx + 3, y2: wy - 48, stroke: "#6e7f8a", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: wx - 12, y1: wy - 14, x2: wx + 12, y2: wy - 26, stroke: "#8d9aa6", strokeWidth: "1.2" }), /* @__PURE__ */ React.createElement("line", { x1: wx + 12, y1: wy - 14, x2: wx - 12, y2: wy - 26, stroke: "#8d9aa6", strokeWidth: "1.2" }), /* @__PURE__ */ React.createElement("path", { d: `M${wx - 16},${wy - 68} h32 v20 a16,6 0 0 1 -32,0 Z`, fill: "#c3ced5", stroke: "#5d6e7a", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("rect", { x: wx - 16, y: wy - 60, width: "32", height: "5", fill: "#2e7d49", opacity: ".9" }), /* @__PURE__ */ React.createElement("ellipse", { cx: wx, cy: wy - 68, rx: "16", ry: "6", fill: "#d8e0e5", stroke: "#5d6e7a", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("path", { d: `M${wx - 16},${wy - 68} L${wx},${wy - 82} L${wx + 16},${wy - 68}`, fill: "#9fb0ba", stroke: "#5d6e7a", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("line", { x1: wx, y1: wy - 82, x2: wx, y2: wy - 87, stroke: "#5d6e7a", strokeWidth: "1.4" }));
  }
  function CityScene({ activeId, hovered, onHover, onOpen, onEquipment, onContact }) {
    const spotlight = hovered || activeId;
    const dimAll = !!spotlight;
    const data = window.FCG.BUILDINGS.reduce((m, b) => (m[b.id] = b, m), {});
    const B = (id) => /* @__PURE__ */ React.createElement(
      Building,
      {
        key: id,
        id,
        data: data[id],
        dim: !!spotlight && spotlight !== id,
        sel: spotlight === id,
        onOpen,
        onHover,
        onEquipment
      }
    );
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "scene-svg",
        viewBox: "0 0 2280 1240",
        preserveAspectRatio: "xMidYMid meet",
        role: "img",
        "aria-label": "Isometric city district of facilities FirstCall Group services"
      },
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("radialGradient", { id: "spot", cx: "0.5", cy: "0.5", r: "0.5" }, /* @__PURE__ */ React.createElement("stop", { offset: "0", stopColor: "#005090", stopOpacity: ".18" }), /* @__PURE__ */ React.createElement("stop", { offset: "1", stopColor: "#005090", stopOpacity: "0" })), /* @__PURE__ */ React.createElement("radialGradient", { id: "domeG", cx: "0.38", cy: "0.32", r: "0.85" }, /* @__PURE__ */ React.createElement("stop", { offset: "0", stopColor: "#fdfbf4" }), /* @__PURE__ */ React.createElement("stop", { offset: "0.55", stopColor: "#f3efe3" }), /* @__PURE__ */ React.createElement("stop", { offset: "1", stopColor: "#d9d2bc" }))),
      /* @__PURE__ */ React.createElement(Ground, null),
      activeId && BLD[activeId] && (() => {
        const b = BLD[activeId];
        const [x, y] = pt(b.gx + b.w / 2, b.gy + b.d / 2, 0);
        return /* @__PURE__ */ React.createElement("ellipse", { cx: x, cy: y, rx: (b.w + b.d) * U * 0.7, ry: (b.w + b.d) * U * 0.35, fill: "url(#spot)" });
      })(),
      /* @__PURE__ */ React.createElement(Traffic, null),
      /* @__PURE__ */ React.createElement(StreetProps, null),
      B("office"),
      B("dataCenter"),
      B("government"),
      B("school"),
      B("hospital"),
      FILLERS_BACK.map((f, i) => /* @__PURE__ */ React.createElement(Filler, { key: "fb" + i, cfg: f, dim: dimAll })),
      /* @__PURE__ */ React.createElement(WaterTower, null),
      B("university"),
      B("hotel"),
      FILLERS_FRONT.map((f, i) => /* @__PURE__ */ React.createElement(Filler, { key: "ff" + i, cfg: f, dim: dimAll })),
      B("multifamily"),
      B("industrial"),
      /* @__PURE__ */ React.createElement(Callouts, { spotlight, onOpen, onHover })
    );
  }
  window.CityScene = CityScene;
})();
