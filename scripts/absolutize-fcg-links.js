/**
 * Make every "FirstCall Group" nav/footer link an absolute URL so it
 * cross-domains to firstcallgroup.com instead of resolving to whatever host
 * is currently serving the page.
 *
 * Before:
 *   <a class="site-nav__link" href="/" rel="noopener">FirstCall Group</a>
 *   <a href="index.html" rel="noopener">FirstCall Group</a>
 *   <a href="../index.html" rel="noopener">FirstCall Group</a>
 *
 * After (every variant):
 *   <a ... href="https://firstcallgroup.com/" rel="noopener">FirstCall Group</a>
 *
 * Touches every page on either site since the FCG link appears in nav,
 * footer column, and footer-bottom on most pages. Also updates the build
 * script source so future regenerations stay correct.
 *
 * Run: node scripts/absolutize-fcg-links.js
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "reference") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (/\.(html|js)$/i.test(e.name)) files.push(full);
  }
  return files;
}

// Match any <a ...> with the FirstCall Group text and a relative-looking href,
// regardless of attribute order. Only swap the href; preserve other attributes.
const RE = /(<a[^>]*href=")(\/|index\.html|\.\.\/index\.html)("[^>]*>FirstCall Group<\/a>)/g;
const NEW_HREF = "https://firstcallgroup.com/";

// Also match the JS-encoded string inside scripts/build-mechanical-sisters.js,
// where the nav block is stored as a single-quoted concatenated string.
const RE_JS = /(<a class="site-nav__link" href=")\/(" rel="noopener">FirstCall Group<\/a>)/g;

let total = 0;
const touched = [];
for (const file of walk(ROOT)) {
  if (file.endsWith(path.join("scripts", "absolutize-fcg-links.js"))) continue;
  const html = fs.readFileSync(file, "utf8");
  const before = html;
  let count = 0;
  const after = html
    .replace(RE, (_, a, _href, c) => { count++; return a + NEW_HREF + c; })
    .replace(RE_JS, (_, a, c) => { count++; return a + NEW_HREF + c; });
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    touched.push([path.relative(ROOT, file), count]);
    total += count;
  }
}
for (const [f, n] of touched) console.log(`  ${f.padEnd(45)} ${n} replacements`);
console.log(`\nDone. ${touched.length} files, ${total} replacements.`);
