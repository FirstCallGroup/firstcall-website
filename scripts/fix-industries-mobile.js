/**
 * Patch initIndustries() across all 5 pages that use the hex grid.
 *
 * Old behavior: observed each .industry-hex <g> element with IntersectionObserver.
 * WebKit mobile (iOS Safari) does NOT reliably fire IntersectionObserver for
 * SVG <g> children, so on mobile the hexes stay at opacity:0 forever.
 *
 * New behavior: observe the parent .industries-honeycomb <svg> element, then
 * trigger the staggered reveal on all hexes at once when the SVG is visible.
 * The SVG is an HTML-level element so IntersectionObserver behaves consistently.
 *
 * Run once: node scripts/fix-industries-mobile.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FILES = [
  "index.html",
  "mechanical/index.html",
  "columbus.html",
  "dfw.html",
  "central-texas.html",
].map(f => path.join(ROOT, f));

const NEW_FN = `function initIndustries() {
        var svg = document.querySelector(".industries-honeycomb");
        if (!svg) return;
        var hexes = svg.querySelectorAll(".industry-hex");
        if (!hexes.length) return;
        function reveal() {
          hexes.forEach(function (h, idx) {
            setTimeout(function () { h.classList.add("is-visible"); }, idx * 70);
          });
        }
        var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced || !("IntersectionObserver" in window)) {
          hexes.forEach(function (h) { h.classList.add("is-visible"); });
          return;
        }
        // Observe the parent <svg>, not the inner <g> elements: WebKit mobile
        // does not fire IntersectionObserver reliably for SVG <g> children.
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            reveal();
            obs.unobserve(entry.target);
          });
        }, { threshold: 0.15 });
        obs.observe(svg);
      }`;

const OLD_FN_RE =
  /function initIndustries\(\) \{\s*var hexes = document\.querySelectorAll\(["']\.industry-hex["']\);[\s\S]*?\n      \}/;

for (const file of FILES) {
  if (!fs.existsSync(file)) {
    console.warn("  · missing: " + path.relative(ROOT, file));
    continue;
  }
  let html = fs.readFileSync(file, "utf8");
  if (!OLD_FN_RE.test(html)) {
    console.warn("  · no initIndustries match: " + path.relative(ROOT, file));
    continue;
  }
  const before = html.length;
  html = html.replace(OLD_FN_RE, NEW_FN);
  fs.writeFileSync(file, html, "utf8");
  console.log(`  ${path.relative(ROOT, file).padEnd(30)} ${before} -> ${html.length} bytes`);
}
console.log("Done.");
