#!/usr/bin/env node
/**
 * One-shot: inject a hidden _ts input into every form page so the worker's
 * min-submit-time anti-spam layer can evaluate. form-handler.js stamps
 * Date.now() into this field on DOMContentLoaded.
 *
 * Run: node scripts/inject-ts-field.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

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

// Match the existing hidden _form input line, capture its exact indentation,
// and inject a _ts hidden input right after it. Idempotent: skips if a _ts
// input already exists in the file.
const TS_INPUT_PATTERN = /name="_ts"/;
const FORM_INPUT_RE = /^(\s*)<input type="hidden" name="_form" value="([^"]+)" \/>\s*$/m;

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
  if (TS_INPUT_PATTERN.test(html)) {
    console.log(`  ${rel.padEnd(38)} already has _ts (skipped)`);
    skipped++;
    continue;
  }
  const m = html.match(FORM_INPUT_RE);
  if (!m) {
    console.warn(`  · ${rel}: no <input name="_form"> match — skipping`);
    missing++;
    continue;
  }
  const indent = m[1];
  const replacement = `${m[0]}\n${indent}<input type="hidden" name="_ts" value="" />`;
  html = html.replace(FORM_INPUT_RE, replacement);
  fs.writeFileSync(file, html, "utf8");
  console.log(`✓ ${rel.padEnd(38)} _ts injected`);
  changed++;
}

console.log(`\nDone — ${changed} changed, ${skipped} already current, ${missing} missing.`);
