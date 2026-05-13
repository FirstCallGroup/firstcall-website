#!/usr/bin/env node
/*
 * scripts/sync-industries.js
 *
 * Single source of truth for the "Industries We Serve" hex grid
 * lives in shared/partials/industries-grid--<variant>.html.
 *
 * Each consumer page has a marker block of the form:
 *
 *   <!-- industries-grid:start variant=<variant> -->
 *   ...anything between these two lines is overwritten on sync...
 *   <!-- industries-grid:end -->
 *
 * Running this script:
 *
 *   node scripts/sync-industries.js
 *
 * reads every partial and writes its contents into every matching
 * marker block across the site. Files without markers are left alone.
 *
 * Add new pages by dropping the marker block in and adding them to
 * TARGETS below (or just rely on the auto-scan of *.html in the repo
 * root + branch landings; see SCAN_ROOTS).
 */

"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const PARTIALS_DIR = path.join(REPO_ROOT, "shared", "partials");

// Files to scan for marker blocks. Extend as needed.
const TARGETS = [
  "index.html",
  "columbus.html",
  "dfw.html",
  "central-texas.html",
  "shared/templates/branch.html",
  "shared/styleguide.html",
];

const START_RE = /<!--\s*industries-grid:start\s+variant=([a-z0-9-]+)\s*-->/i;
const END_RE = /<!--\s*industries-grid:end\s*-->/i;

function loadPartial(variant) {
  const file = path.join(PARTIALS_DIR, `industries-grid--${variant}.html`);
  if (!fs.existsSync(file)) return null;
  // Strip the leading comment header from partials so the consumer page
  // doesn't carry maintenance instructions.
  let body = fs.readFileSync(file, "utf8");
  body = body.replace(/^<!--[\s\S]*?-->\s*\n?/, "");
  return body.trimEnd();
}

function syncFile(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(abs)) {
    console.log(`  skip  ${relPath} (file not found)`);
    return { changed: false };
  }
  const before = fs.readFileSync(abs, "utf8");
  let after = before;
  let replacements = 0;
  let cursor = 0;

  while (true) {
    const startIdx = after.indexOf("industries-grid:start", cursor);
    if (startIdx === -1) break;

    // Find the actual <!-- ... --> bounds for the start tag.
    const startTagBegin = after.lastIndexOf("<!--", startIdx);
    const startTagEnd = after.indexOf("-->", startIdx);
    if (startTagBegin === -1 || startTagEnd === -1) break;

    const startTag = after.slice(startTagBegin, startTagEnd + 3);
    const variantMatch = startTag.match(START_RE);
    if (!variantMatch) { cursor = startTagEnd + 3; continue; }
    const variant = variantMatch[1];

    // Find the matching end marker specifically — there may be other HTML
    // comments (e.g. inside the injected SVG) between start and end, so we
    // can't just grab the next "<!--".
    const endMatch = after.slice(startTagEnd).match(/<!--\s*industries-grid:end\s*-->/i);
    if (!endMatch) {
      console.error(`  ERROR ${relPath}: start marker for "${variant}" has no matching end marker`);
      return { changed: false, error: true };
    }
    const endTagBegin = startTagEnd + endMatch.index;
    const endTagEnd = endTagBegin + endMatch[0].length - 3; // position of last "-" so endTagEnd+3 lands past "-->"

    const partial = loadPartial(variant);
    if (partial === null) {
      console.error(`  ERROR ${relPath}: no partial found for variant "${variant}"`);
      return { changed: false, error: true };
    }

    // Preserve the indentation of the start tag so injected content
    // matches surrounding markup formatting.
    const lineStart = after.lastIndexOf("\n", startTagBegin) + 1;
    const indent = after.slice(lineStart, startTagBegin).match(/^[ \t]*/)[0];
    const indented = partial
      .split("\n")
      .map((ln) => (ln.length ? indent + ln : ln))
      .join("\n");

    const head = after.slice(0, startTagEnd + 3);
    const tail = after.slice(endTagBegin);
    after = head + "\n" + indented + "\n" + indent + tail;

    replacements++;
    cursor = after.indexOf("industries-grid:end", startTagEnd) + 1;
  }

  if (replacements === 0) {
    console.log(`  skip  ${relPath} (no markers)`);
    return { changed: false };
  }

  if (after === before) {
    console.log(`  ok    ${relPath} (${replacements} block${replacements > 1 ? "s" : ""}, no change)`);
    return { changed: false };
  }

  fs.writeFileSync(abs, after);
  console.log(`  wrote ${relPath} (${replacements} block${replacements > 1 ? "s" : ""})`);
  return { changed: true };
}

function main() {
  console.log("syncing industries-grid partials...");
  let changedCount = 0;
  let errorCount = 0;
  for (const t of TARGETS) {
    const r = syncFile(t);
    if (r.changed) changedCount++;
    if (r.error) errorCount++;
  }
  console.log(`done. ${changedCount} file${changedCount === 1 ? "" : "s"} updated${errorCount ? `, ${errorCount} error${errorCount === 1 ? "" : "s"}` : ""}.`);
  if (errorCount) process.exit(1);
}

main();
