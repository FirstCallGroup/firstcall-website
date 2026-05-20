#!/usr/bin/env node
/**
 * One-shot: inject the Cloudflare Turnstile widget div + script tag into every
 * form page. The site key is the FirstCall Group + FirstCall Mechanical widget
 * (one widget covers both domains because they share the Pages project).
 *
 * Idempotent — skips files that already have the widget.
 *
 * Run: node scripts/inject-turnstile-widget.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

// FCG + FCM Turnstile site key. Public — safe to embed in HTML.
const SITE_KEY = "0x4AAAAAADTRtvAzm-AenUDm";

const PAGES = [
  "acquisitions.html",
  "central-texas.html",
  "central-texas/contact.html",
  "columbus.html",
  "columbus/contact.html",
  "contact.html",
  "dfw.html",
  "dfw/contact.html",
  "mechanical/contact.html",
];

const SCRIPT_TAG = '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>';

// Match the opening of <div class="form-actions"> (with any leading whitespace).
// We'll inject the Turnstile widget just before it, with the same indentation.
const FORM_ACTIONS_RE = /^(\s*)<div class="form-actions">/m;

let changed = 0;
let skipped = 0;
let missing = 0;

for (const rel of PAGES) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.warn(`  · missing: ${rel}`);
    missing++;
    continue;
  }
  let html = fs.readFileSync(file, "utf8");

  if (html.includes("cf-turnstile")) {
    console.log(`  ${rel.padEnd(38)} already has Turnstile (skipped)`);
    skipped++;
    continue;
  }

  // 1. Inject the widget div before <div class="form-actions">.
  const m = html.match(FORM_ACTIONS_RE);
  if (!m) {
    console.warn(`  · ${rel}: no <div class="form-actions"> match — skipping`);
    missing++;
    continue;
  }
  const indent = m[1];
  const widget = `${indent}<div class="cf-turnstile" data-sitekey="${SITE_KEY}" data-theme="auto" style="margin-top:1rem"></div>\n${m[0]}`;
  html = html.replace(FORM_ACTIONS_RE, widget);

  // 2. Inject the Turnstile script tag right before </body>. Idempotent:
  //    don't double-add if it's somehow already there.
  if (!html.includes("challenges.cloudflare.com/turnstile/v0/api.js")) {
    if (!html.includes("</body>")) {
      console.warn(`  · ${rel}: no </body> — script tag NOT added`);
    } else {
      html = html.replace(/<\/body>/i, `  ${SCRIPT_TAG}\n</body>`);
    }
  }

  fs.writeFileSync(file, html, "utf8");
  console.log(`✓ ${rel.padEnd(38)} widget + script injected`);
  changed++;
}

console.log(`\nDone — ${changed} changed, ${skipped} already current, ${missing} missing.`);
