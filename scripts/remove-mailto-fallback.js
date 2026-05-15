/**
 * Strip the legacy mailto: submit handler from every form-bearing page.
 *
 * Before /assets/js/form-handler.js + /api/contact existed, each form's
 * page had an inline initForm() function whose submit handler did
 *   window.location.href = "mailto:..."
 * to open the visitor's mail client with the form contents pre-filled.
 *
 * That handler now runs in parallel with the real fetch handler, so after
 * the form submits successfully via /api/contact, the user *also* gets a
 * mailto: popup. This script replaces initForm() with a no-op stub.
 *
 * Idempotent — once initForm is a stub, re-running this is a no-op.
 *
 * Run: node scripts/remove-mailto-fallback.js
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const FILES = [
  "contact.html",
  "acquisitions.html",
  "columbus.html",
  "dfw.html",
  "central-texas.html",
  "columbus/contact.html",
  "dfw/contact.html",
  "central-texas/contact.html",
].map(f => path.join(ROOT, f));

const STUB =
  `function initForm() {
        // Submissions handled by /assets/js/form-handler.js -> /api/contact (Resend).
        // Intentional no-op kept so older initForm() call sites don't break.
      }`;

const INIT_FORM_BLOCK_RE =
  /function initForm\(\) \{[\s\S]*?window\.location\.href = "mailto:"[\s\S]*?\}\);\s*\}/;

let total = 0;
for (const file of FILES) {
  if (!fs.existsSync(file)) {
    console.warn(`  · missing: ${path.relative(ROOT, file)}`);
    continue;
  }
  let html = fs.readFileSync(file, "utf8");
  if (!INIT_FORM_BLOCK_RE.test(html)) {
    console.log(`  ${path.relative(ROOT, file).padEnd(40)} no mailto block (already stripped?)`);
    continue;
  }
  html = html.replace(INIT_FORM_BLOCK_RE, STUB);
  fs.writeFileSync(file, html, "utf8");
  console.log(`  ${path.relative(ROOT, file).padEnd(40)} mailto handler removed`);
  total++;
}
console.log(`\nDone. ${total} files updated.`);
