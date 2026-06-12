(() => {
  const ISO_C = Math.cos(Math.PI / 6);
  const ISO_S = 0.5;
  function isoXY(x, y, z) {
    return [(x - y) * ISO_C, (x + y) * ISO_S - (z || 0)];
  }
  function isoPt(x, y, z) {
    const p = isoXY(x, y, z);
    return p[0].toFixed(1) + "," + p[1].toFixed(1);
  }
  function isoPoly(pts) {
    return pts.map((p) => isoPt(p[0], p[1], p[2])).join(" ");
  }
  function isoPath(pts) {
    return pts.map((p, i) => (i === 0 ? "M" : "L") + isoPt(p[0], p[1], p[2])).join(" ");
  }
  function shade(hex, amt) {
    if (!hex || hex[0] !== "#") return hex;
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    r = Math.round(r + (t - r) * a);
    g = Math.round(g + (t - g) * a);
    b = Math.round(b + (t - b) * a);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  const IsoCtx = React.createContext({ uid: "u", theme: null });
  function IsoBox({ x, y, z, w, d, h, fill, stroke, sw = 0.8, topFill, frontFill, sideFill, opacity }) {
    const top = isoPoly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]);
    const front = isoPoly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]);
    const side = isoPoly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]);
    const st = stroke || shade(fill, -0.55);
    return /* @__PURE__ */ React.createElement("g", { opacity }, /* @__PURE__ */ React.createElement("polygon", { points: front, fill: frontFill || fill, stroke: st, strokeWidth: sw, strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: side, fill: sideFill || shade(fill, -0.28), stroke: st, strokeWidth: sw, strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: top, fill: topFill || shade(fill, 0.25), stroke: st, strokeWidth: sw, strokeLinejoin: "round" }));
  }
  function IsoCylV({ cx, cy, z, h, r, fill, stroke, sw = 0.8, sq = 0.5, topFill }) {
    const [sx, syB] = isoXY(cx, cy, z);
    const syT = syB - h;
    const ry = r * sq;
    const st = stroke || shade(fill, -0.55);
    const body = `M ${(sx - r).toFixed(1)},${syT.toFixed(1)} L ${(sx - r).toFixed(1)},${syB.toFixed(1)} A ${r} ${ry} 0 0 0 ${(sx + r).toFixed(1)},${syB.toFixed(1)} L ${(sx + r).toFixed(1)},${syT.toFixed(1)} Z`;
    return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("path", { d: body, fill, stroke: st, strokeWidth: sw }), /* @__PURE__ */ React.createElement("rect", { x: sx, y: syT, width: r, height: h, fill: "#000", opacity: "0.16" }), /* @__PURE__ */ React.createElement("rect", { x: sx - r * 0.78, y: syT, width: r * 0.3, height: h, fill: "#fff", opacity: "0.12" }), /* @__PURE__ */ React.createElement("ellipse", { cx: sx, cy: syT, rx: r, ry, fill: topFill || shade(fill, 0.28), stroke: st, strokeWidth: sw }));
  }
  function IsoBarrel({ x0, x1, y, z, r, fill, stroke, sw = 0.8, capFill, domed }) {
    const e0 = isoXY(x0, y, z), e1 = isoXY(x1, y, z);
    const st = stroke || shade(fill, -0.55);
    const nx = -ISO_S, ny = ISO_C;
    const off = r * 0.42;
    return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("line", { x1: e0[0], y1: e0[1], x2: e1[0], y2: e1[1], stroke: st, strokeWidth: r * 2 + sw * 2, strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("line", { x1: e0[0], y1: e0[1], x2: e1[0], y2: e1[1], stroke: fill, strokeWidth: r * 2, strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("line", { x1: e0[0] + nx * off, y1: e0[1] + ny * off, x2: e1[0] + nx * off, y2: e1[1] + ny * off, stroke: "#000", opacity: "0.18", strokeWidth: r, strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("line", { x1: e0[0] - nx * off, y1: e0[1] - ny * off, x2: e1[0] - nx * off, y2: e1[1] - ny * off, stroke: "#fff", opacity: "0.14", strokeWidth: r * 0.6, strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: e1[0], cy: e1[1], r: r * 0.98, fill: capFill || shade(fill, -0.12), stroke: st, strokeWidth: sw }), domed ? /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("circle", { cx: e1[0] - r * 0.06, cy: e1[1] - r * 0.06, r: r * 0.68, fill: shade(capFill || fill, 0.16), stroke: shade(capFill || fill, -0.28), strokeWidth: sw * 0.7 }), /* @__PURE__ */ React.createElement("circle", { cx: e1[0] - r * 0.18, cy: e1[1] - r * 0.2, r: r * 0.3, fill: shade(capFill || fill, 0.36), opacity: "0.55" }), [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const a = i / 8 * Math.PI * 2 + 0.39;
      return /* @__PURE__ */ React.createElement(
        "circle",
        {
          key: i,
          cx: e1[0] + Math.cos(a) * r * 0.85,
          cy: e1[1] + Math.sin(a) * r * 0.85,
          r: Math.max(1.1, r * 0.09),
          fill: shade(capFill || fill, -0.4),
          stroke: shade(capFill || fill, 0.25),
          strokeWidth: "0.5"
        }
      );
    })) : /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("circle", { cx: e1[0], cy: e1[1], r: r * 0.55, fill: "none", stroke: shade(fill, -0.4), strokeWidth: sw }), /* @__PURE__ */ React.createElement("circle", { cx: e1[0], cy: e1[1], r: r * 0.12, fill: shade(fill, -0.4) })));
  }
  function FaceY({ x, y, z, children }) {
    const [tx, ty] = isoXY(x, y, z);
    return /* @__PURE__ */ React.createElement("g", { transform: `matrix(${ISO_C},${ISO_S},0,-1,${tx},${ty})` }, children);
  }
  function FaceX({ x, y, z, children }) {
    const [tx, ty] = isoXY(x, y, z);
    return /* @__PURE__ */ React.createElement("g", { transform: `matrix(${-ISO_C},${ISO_S},0,-1,${tx},${ty})` }, children);
  }
  function IsoFan({ cx, cy, z, r, ring, blade, hub, dur }) {
    const [sx, sy] = isoXY(cx, cy, z);
    return /* @__PURE__ */ React.createElement("g", { transform: `translate(${sx},${sy}) scale(1,0.5)` }, /* @__PURE__ */ React.createElement("circle", { r, fill: "rgba(0,0,0,0.35)", stroke: ring, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("g", { className: "fc-spin", style: dur ? { animationDuration: dur } : null }, [0, 60, 120, 180, 240, 300].map((a) => /* @__PURE__ */ React.createElement("rect", { key: a, x: r * 0.16, y: -r * 0.13, width: r * 0.74, height: r * 0.26, rx: r * 0.13, fill: blade, transform: `rotate(${a})` })), /* @__PURE__ */ React.createElement("circle", { r: r * 0.18, fill: hub })), /* @__PURE__ */ React.createElement("circle", { r, fill: "none", stroke: ring, strokeWidth: "2" }));
  }
  function IsoRail({ pts, h = 14, color, sw = 1.4 }) {
    const segs = [];
    const top = pts.map((p) => isoXY(p[0], p[1], p[2] + h));
    const mid = pts.map((p) => isoXY(p[0], p[1], p[2] + h * 0.55));
    pts.forEach((p, i) => {
      const b = isoXY(p[0], p[1], p[2]);
      segs.push(/* @__PURE__ */ React.createElement("line", { key: "p" + i, x1: b[0], y1: b[1], x2: top[i][0], y2: top[i][1], stroke: color, strokeWidth: sw }));
    });
    const d = (arr) => arr.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
    return /* @__PURE__ */ React.createElement("g", { strokeLinecap: "round" }, segs, /* @__PURE__ */ React.createElement("path", { d: d(top), fill: "none", stroke: color, strokeWidth: sw }), /* @__PURE__ */ React.createElement("path", { d: d(mid), fill: "none", stroke: color, strokeWidth: sw * 0.8, opacity: "0.8" }));
  }
  function Steam({ x, y, z, o, fill = "#fff" }) {
    const [sx, sy] = isoXY(x, y, z);
    return /* @__PURE__ */ React.createElement("g", { style: { "--steamO": o } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(
      "circle",
      {
        key: i,
        className: "fc-steam",
        cx: sx + (i - 1) * 7,
        cy: sy,
        r: 6 + i * 2.5,
        fill,
        style: { animationDelay: i * 1.7 + "s" }
      }
    )));
  }
  Object.assign(window, { ISO_C, ISO_S, isoXY, isoPt, isoPoly, isoPath, shade, IsoCtx, IsoBox, IsoCylV, IsoBarrel, FaceY, FaceX, IsoFan, IsoRail, Steam });
})();
