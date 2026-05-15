/**
 * Update per-branch phone numbers and dispatch emails across all FCM
 * branch pages. Runs once; idempotent — repeating it is a no-op.
 *
 * Scope: only files under each branch's directory. The corporate 844
 * number on FCG pages (careers, team, news, etc.) is intentionally left
 * alone.
 *
 *   Branch       Office              Email
 *   columbus     (614) 337-0111      serviceoh@firstcallmechanical.com
 *   austin       (512) 884-5291      serviceatx@firstcallmechanical.com
 *   dallas       (469) 669-0978      servicedfw@firstcallmechanical.com
 *
 * Run: node scripts/update-branch-contacts.js
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

const BRANCHES = [
  {
    name: "Columbus",
    files: listFiles("columbus.html", "columbus", "branches/columbus/config.json"),
    replacements: [
      // Old phone formats -> new phone formats
      ["(614) 253-9001", "(614) 337-0111"],
      ["+16142539001",    "+16143370111"],
      ["+1-614-253-9001", "+1-614-337-0111"],
      ["6142539001",      "6143370111"],
      // Branch email
      ["dispatch@firstcallmechanical.com", "serviceoh@firstcallmechanical.com"],
    ],
  },
  {
    name: "DFW",
    files: listFiles("dfw.html", "dfw"),
    replacements: [
      // Phone already correct, only email needs to change
      ["dispatch@firstcallmechanical.com", "servicedfw@firstcallmechanical.com"],
    ],
  },
  {
    name: "Austin (Central Texas)",
    files: listFiles("central-texas.html", "central-texas"),
    replacements: [
      // The 844 corp number was wrongly used for the Austin branch — replace with the actual Austin number.
      ["(844) 713-0220",  "(512) 884-5291"],
      ["+18447130220",    "+15128845291"],
      ["+1-844-713-0220", "+1-512-884-5291"],
      ["8447130220",      "5128845291"],
      // Branch email
      ["dispatch@firstcallmechanical.com", "serviceatx@firstcallmechanical.com"],
    ],
  },
];

let totalChanges = 0;
for (const b of BRANCHES) {
  console.log(`\n[${b.name}]`);
  for (const file of b.files) {
    if (!file.match(/\.(html|json)$/i)) continue;
    let html = fs.readFileSync(file, "utf8");
    const before = html;
    let changes = 0;
    for (const [from, to] of b.replacements) {
      if (from === to) continue;
      const split = html.split(from);
      if (split.length > 1) {
        changes += split.length - 1;
        html = split.join(to);
      }
    }
    if (html !== before) {
      fs.writeFileSync(file, html, "utf8");
      console.log(`  ${path.relative(ROOT, file).padEnd(45)} ${changes} replacements`);
      totalChanges += changes;
    }
  }
}
console.log(`\nDone. ${totalChanges} total replacements.`);
