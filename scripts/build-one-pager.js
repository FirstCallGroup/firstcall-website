// Inlines three things into one-pager.html between marker comments, so a copy
// of the page renders correctly anywhere — even opened straight from disk:
//   <!--FC_LOGO:BEGIN/END-->  the white FirstCall Group logo SVG
//   <!--FC_MAP:BEGIN/END-->   the blank US map SVG
//   <!--FC_DATA:BEGIN/END-->  a snapshot of the location data, used only as a
//                             fallback when the live site scripts fail to load
// Idempotent — re-run after any change to the logo, the map, or
// assets/js/locations-data.js (the /add-branch workflow does this):
//   node scripts/build-one-pager.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const PAGE = path.join(ROOT, "one-pager.html");

function readSvg(rel) {
  return fs
    .readFileSync(path.join(ROOT, rel), "utf8")
    .replace(/^<\?xml[^>]*\?>\s*/, "")
    .trim();
}

const logo = readSvg("shared/img/logos/firstcall-group-white.svg");

const map = readSvg("shared/img/maps/us-blank.svg")
  .replace(/<style>[\s\S]*?<\/style>\s*/, "") // the page's CSS owns map styling
  .replace(/\srole="img"/, "")
  .replace(/\saria-label="[^"]*"/, "") // the #fc-map container carries the label
  .replace(/<svg\s/, '<svg aria-hidden="true" ');

function splice(html, name, content) {
  const re = new RegExp("(<!--" + name + ":BEGIN-->)[\\s\\S]*?(<!--" + name + ":END-->)");
  if (!re.test(html)) throw new Error("marker " + name + " not found in one-pager.html");
  return html.replace(re, function (_m, begin, end) {
    return begin + "\n" + content + "\n" + end;
  });
}

// Snapshot of the live location data, evaluated the same way the browser does.
function runForWindow(rel) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), sandbox);
  return sandbox.window;
}
const locWin = runForWindow("assets/js/locations-data.js");
const mapWin = runForWindow("assets/js/fc-map-states.js");
const brandWin = runForWindow("assets/js/collateral-brands.js");
if (!Array.isArray(locWin.FC_LOCATIONS) || !locWin.FC_LOCATIONS.length) {
  throw new Error("FC_LOCATIONS snapshot came back empty");
}
if (!Array.isArray(brandWin.FC_BRANDS) || !brandWin.FC_BRANDS.length) {
  throw new Error("FC_BRANDS snapshot came back empty");
}
const snapshotDate = new Date().toLocaleDateString("en-US", {
  year: "numeric", month: "long", day: "numeric",
});
const data = [
  "<script>",
  "  /* Snapshot generated " + snapshotDate + " by scripts/build-one-pager.js.",
  "     Used ONLY when the shared site scripts above fail to load (i.e. this",
  "     file was copied somewhere standalone). On the website, live data wins. */",
  "  (function () {",
  '    window.FC_ONEPAGER_SNAPSHOT_DATE = "' + snapshotDate + '";',
  "    if (!window.FC_LOCATIONS || !window.FC_LOCATIONS.length) {",
  "      window.FC_ONEPAGER_USING_SNAPSHOT = true;",
  "      window.FC_LOCATIONS = " + JSON.stringify(locWin.FC_LOCATIONS) + ";",
  "    }",
  "    window.FC_MAP = window.FC_MAP || {};",
  "    if (!window.FC_MAP.STATE_NAMES) window.FC_MAP.STATE_NAMES = " +
    JSON.stringify(mapWin.FC_MAP.STATE_NAMES) + ";",
  "    if (!window.FC_MAP.COVERAGE_STATES) window.FC_MAP.COVERAGE_STATES = " +
    JSON.stringify(mapWin.FC_MAP.COVERAGE_STATES) + ";",
  "    if (!window.FC_BRANDS) window.FC_BRANDS = " +
    JSON.stringify(brandWin.FC_BRANDS) + ";",
  "  })();",
  "<\/script>",
].join("\n");

let html = fs.readFileSync(PAGE, "utf8");
html = splice(html, "FC_LOGO", logo);
html = splice(html, "FC_MAP", map);
html = splice(html, "FC_DATA", data);
fs.writeFileSync(PAGE, html);
console.log(
  "one-pager.html: inlined logo (" + logo.length + " B), map (" + map.length +
  " B), data snapshot (" + locWin.FC_LOCATIONS.length + " branches, " + snapshotDate + ")"
);
