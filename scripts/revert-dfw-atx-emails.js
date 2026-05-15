/**
 * Revert DFW and Austin branch dispatch emails per branch-team confirmation:
 *   servicedfw@firstcallmechanical.com  ->  dispatch@firstcallmechanical.com
 *   serviceatx@firstcallmechanical.com  ->  dispatch@firstcallmechanical.com
 *
 * Columbus stays on serviceoh@firstcallmechanical.com (Columbus team
 * confirmed earlier).
 *
 * Run: node scripts/revert-dfw-atx-emails.js
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

function listFiles(...candidates) {
  const out = [];
  for (const rel of candidates) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      for (const f of fs.readdirSync(full)) {
        const sub = path.join(full, f);
        if (fs.statSync(sub).isFile()) out.push(sub);
      }
    } else {
      out.push(full);
    }
  }
  return out;
}

const SETS = [
  {
    name: "DFW",
    files: listFiles("dfw.html", "dfw"),
    from: "servicedfw@firstcallmechanical.com",
    to:   "dispatch@firstcallmechanical.com",
  },
  {
    name: "Austin",
    files: listFiles("central-texas.html", "central-texas"),
    from: "serviceatx@firstcallmechanical.com",
    to:   "dispatch@firstcallmechanical.com",
  },
];

let total = 0;
for (const s of SETS) {
  console.log(`\n[${s.name}]`);
  for (const file of s.files) {
    if (!/\.(html|json)$/i.test(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    if (!html.includes(s.from)) continue;
    const parts = html.split(s.from);
    fs.writeFileSync(file, parts.join(s.to), "utf8");
    const count = parts.length - 1;
    console.log(`  ${path.relative(ROOT, file).padEnd(40)} ${count} replacements`);
    total += count;
  }
}
console.log(`\nDone. ${total} replacements.`);
