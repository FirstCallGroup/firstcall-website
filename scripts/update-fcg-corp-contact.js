/**
 * Update FCG corporate address + phone everywhere they appear.
 *
 *   Before                                          After
 *   3105 Bee Caves Rd, Suite 250, Austin, TX 78746  3101 Bee Caves Rd, Suite 250, Rollingwood, TX 78746
 *   (844) 713-0220                                  (844) 715-0220
 *
 * The Austin BRANCH (10421 Old Manchaca, Austin TX 78748) uses the same
 * city name but a different ZIP; we only rewrite the "Austin" locality
 * that sits inside the FCG corp PostalAddress block.
 *
 * Run: node scripts/update-fcg-corp-contact.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "reference") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (/\.(html|json|js|xml|txt|md)$/i.test(e.name)) files.push(full);
  }
  return files;
}

// Plain-string replacements safe to apply globally.
const PLAIN = [
  ["3105 Bee Caves",      "3101 Bee Caves"],
  ["(844) 713-0220",      "(844) 715-0220"],
  ["+18447130220",        "+18447150220"],
  ["+1-844-713-0220",     "+1-844-715-0220"],
  ["8447130220",          "8447150220"],
  // Display address in footers: "Austin, TX 78746" — corp ZIP 78746 is
  // unambiguous (the Austin branch uses 78748).
  ["Austin, TX 78746",    "Rollingwood, TX 78746"],
];

// Targeted JSON-LD: replace addressLocality "Austin" → "Rollingwood" ONLY
// when it sits immediately after a streetAddress that contains "Bee Caves".
const ADDRESS_LOCALITY_RE =
  /("streetAddress": "[^"]*Bee Caves[^"]*",\s*"addressLocality":\s*)"Austin"/g;

// Also handle the inject-org-schema.js source (unquoted JS object).
const JS_ADDRESS_LOCALITY_RE =
  /(streetAddress: "[^"]*Bee Caves[^"]*",\s*addressLocality:\s*)"Austin"/g;

const files = walk(ROOT);
let totalChanges = 0;
const touched = [];

for (const file of files) {
  // Skip scripts we wrote that document the change (would create circular references)
  if (file.endsWith(path.join("scripts", "update-fcg-corp-contact.js"))) continue;
  if (file.endsWith(path.join("scripts", "update-branch-contacts.js"))) continue;

  let html = fs.readFileSync(file, "utf8");
  const before = html;
  let changes = 0;

  for (const [from, to] of PLAIN) {
    if (from === to) continue;
    const parts = html.split(from);
    if (parts.length > 1) {
      changes += parts.length - 1;
      html = parts.join(to);
    }
  }

  // Targeted addressLocality fixes
  let m;
  while ((m = ADDRESS_LOCALITY_RE.exec(html))) { changes++; }
  html = html.replace(ADDRESS_LOCALITY_RE, '$1"Rollingwood"');
  while ((m = JS_ADDRESS_LOCALITY_RE.exec(html))) { changes++; }
  html = html.replace(JS_ADDRESS_LOCALITY_RE, '$1"Rollingwood"');

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    touched.push([path.relative(ROOT, file), changes]);
    totalChanges += changes;
  }
}

for (const [f, n] of touched) {
  console.log(`  ${f.padEnd(50)} ${n} replacements`);
}
console.log(`\nDone. ${touched.length} files, ${totalChanges} replacements.`);
