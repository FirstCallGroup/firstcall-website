/**
 * Update the FCG corporate email everywhere it appears.
 *   info@firstcallmechanical.com  ->  info@firstcallgroup.com
 *
 * The branch dispatch emails (serviceoh@, servicedfw@, serviceatx@) and
 * the acquisitions email (acquisitions@firstcallgroup.com) are unaffected.
 *
 * Run: node scripts/update-fcg-email.js
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

const OLD = "info@firstcallmechanical.com";
const NEW = "info@firstcallgroup.com";

let total = 0;
const touched = [];
for (const file of walk(ROOT)) {
  // Skip this script (would otherwise rewrite its own constants)
  if (file.endsWith(path.join("scripts", "update-fcg-email.js"))) continue;
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(OLD)) continue;
  const parts = html.split(OLD);
  fs.writeFileSync(file, parts.join(NEW), "utf8");
  const count = parts.length - 1;
  touched.push([path.relative(ROOT, file), count]);
  total += count;
}
for (const [f, n] of touched) console.log(`  ${f.padEnd(45)} ${n} replacements`);
console.log(`\nDone. ${touched.length} files, ${total} replacements.`);
