/**
 * Make FCM branch internal nav links absolute (https://firstcallmechanical.com/...)
 * so they point at the canonical FCM host regardless of which domain happens
 * to serve the file. Touches columbus.html, dfw.html, central-texas.html.
 *
 * Run once: node scripts/absolutize-branch-links.js
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const FILES = ["columbus.html", "dfw.html", "central-texas.html"]
  .map(f => path.join(ROOT, f));

const map = {
  'href="columbus.html"':       'href="https://firstcallmechanical.com/columbus"',
  'href="dfw.html"':            'href="https://firstcallmechanical.com/dfw"',
  'href="central-texas.html"':  'href="https://firstcallmechanical.com/central-texas"',
};

for (const f of FILES) {
  let html = fs.readFileSync(f, "utf8");
  const before = html.length;
  for (const [from, to] of Object.entries(map)) {
    html = html.split(from).join(to);
  }
  fs.writeFileSync(f, html, "utf8");
  console.log(`${path.relative(ROOT, f)}: ${before} -> ${html.length} bytes`);
}
console.log("Done.");
