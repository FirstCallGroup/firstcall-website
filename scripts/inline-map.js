/**
 * Inline the canonical US map SVG paths + branch pins into the
 * homepage and locations page so they render in any preview context.
 *
 * Run:  node scripts/inline-map.js
 *
 * Reads:   shared/img/maps/us-blank.svg
 * Writes:  replaces the existing <svg class="map-preview__svg"> block
 *          in each target HTML file.
 *
 * Pin coords are derived from real lat/lng using a linear projection
 * tuned to the us-blank.svg viewBox (975 × 610). Tweak `xPerDeg`,
 * `yPerDeg`, or branch lat/lng below and re-run.
 *
 * Branch list comes from reference/branch_master_file.xlsx (locked
 * 2026-05-11). City lat/lng are approximate (city centroid is fine
 * for a country-scale map).
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "shared", "img", "maps", "us-blank.svg");

const targets = [
  path.join(root, "index.html"),
  path.join(root, "locations.html"),
];

const svg = fs.readFileSync(svgPath, "utf8");
const match = svg.match(/<g class="states">([\s\S]*?)<\/g>/);
if (!match) {
  console.error("ERROR: could not find <g class=\"states\"> in us-blank.svg");
  process.exit(1);
}
const statesInner = match[1].trim();

/* ----- lat/lng → SVG (us-blank.svg viewBox 975 × 610) ----- */
const xPerDeg = 15.4;
const yPerDeg = 22.9;
function project(lat, lng) {
  return {
    cx: Math.round(50 + (lng + 125) * xPerDeg),
    cy: Math.round(30 + (49 - lat) * yPerDeg),
  };
}

/* ----- Branches (from branch_master_file.xlsx) -----
 * [id, brand, city, state, lat, lng, optional dx/dy nudges for overlap]
 * Nudges are pixel offsets (+ right / + down) applied to the projected pin.
 */
const branches = [
  ["c2h",        "C2H",                       "Lawrenceville", "GA", 33.95, -83.99],
  ["capcity",    "Capital City",              "Grove City",    "OH", 39.88, -83.09,  -3, 0],
  ["ctc",        "Charlotte Temp Controls",   "Charlotte",     "NC", 35.23, -80.84,  -4, -4],
  ["cls",        "CLS",                       "Mentor",        "OH", 41.67, -81.34],
  ["comfortrol", "Comfortrol",                "Columbus",      "OH", 39.96, -82.99,   3, 0],
  ["cond-air",   "Conditioned Air",           "Macon",         "GA", 32.83, -83.63,  -3, -3],
  ["dfw",        "FirstCall Mechanical DFW",  "Carrollton",    "TX", 32.95, -96.89],
  ["fc-atx",     "FirstCall Mechanical ATX",  "Austin",        "TX", 30.27, -97.74],
  ["icacs",      "ICACS",                     "Freeport",      "NY", 40.66, -73.58,  -3, 0],
  ["kats",       "KATS",                      "Wellsville",    "NY", 42.12, -77.95],
  ["kenyon",     "Kenyon",                    "Tampa",         "FL", 27.95, -82.46,  -3, -3],
  ["kpi",        "KPI Engineering",           "Tampa",         "FL", 27.95, -82.46,   5,  4],
  ["lc-and",     "LC Anderson",               "Boston",        "MA", 42.36, -71.06],
  ["mecon",      "Mecon",                     "Clearwater",    "FL", 27.97, -82.79,  -3,  3],
  ["rw",         "R&W",                       "Asheville",     "NC", 35.60, -82.55],
  ["select",     "Select",                    "West Babylon",  "NY", 40.71, -73.36,   4,  3],
  ["starnes",    "Starnes",                   "Lebanon",       "VA", 36.91, -82.08],
  ["starr",      "Starr",                     "Macon",         "GA", 32.83, -83.63,   4,  4],
  ["str-cha",    "STR Mechanical Charlotte",  "Charlotte",     "NC", 35.23, -80.84,   4,  4],
  ["str-grn",    "STR Mechanical Greenville", "Liberty",       "SC", 34.79, -82.69],
  ["str-ral",    "STR Mechanical Raleigh",    "Raleigh",       "NC", 35.78, -78.64],
  ["str-va",     "STR Mechanical Virginia",   "Chesapeake",    "VA", 36.77, -76.29],
  ["timco",      "Timco",                     "Buford",        "GA", 34.13, -83.98],
  ["optimum",    "Optimum Air Solutions",     "Belle Chasse",  "LA", 29.85, -90.00],
  ["statewide",  "Statewide",                 "South Amboy",   "NJ", 40.49, -74.28],
];

const pinMarkup = branches.map(([id, brand, city, state, lat, lng, dx = 0, dy = 0]) => {
  const { cx, cy } = project(lat, lng);
  const x = cx + dx;
  const y = cy + dy;
  const aria = `${brand} — ${city}, ${state}`;
  return `
              <g class="map-pin" data-map-pin tabindex="0" role="button" aria-label="${aria.replace(/&/g, "&amp;")}">
                <circle class="map-pin__pulse" cx="${x}" cy="${y}" r="5"/>
                <circle class="map-pin__dot"   cx="${x}" cy="${y}" r="5"/>
              </g>`;
}).join("");

const newMap = `<svg class="map-preview__svg" viewBox="0 0 975 610" role="img" aria-label="US map with FirstCall branch locations">
            <g class="states">
${statesInner}
            </g>
${pinMarkup}
          </svg>`;

let total = 0;
for (const htmlPath of targets) {
  if (!fs.existsSync(htmlPath)) {
    console.warn("  · skipping (not found): " + path.basename(htmlPath));
    continue;
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  const re = /<svg class="map-preview__svg"[\s\S]*?<\/svg>/;
  if (!re.test(html)) {
    console.warn("  · no <svg class=\"map-preview__svg\"> block in " + path.basename(htmlPath));
    continue;
  }
  const updated = html.replace(re, newMap);
  if (updated === html) {
    console.log("  · " + path.basename(htmlPath) + " already up to date");
    continue;
  }
  fs.writeFileSync(htmlPath, updated);
  console.log("  ✓ Updated " + path.basename(htmlPath));
  total++;
}
console.log(`✓ Inlined us-blank.svg into ${total} file(s), ${branches.length} pins`);
