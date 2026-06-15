/**
 * Cloudflare Pages multi-domain router + form-submission handler.
 *
 * Routing — same Pages project serves two custom domains:
 *   firstcallgroup.com        → FCG content (repo root files)
 *   firstcallmechanical.com   → FCM content (from /mechanical/* + the
 *                                /columbus, /dfw, /central-texas branch
 *                                files at root)
 *
 * Forms — POST /api/contact accepts form submissions from any of the 9
 * forms across both sites, looks up recipients by the `_form` hidden
 * field, and forwards the message via the Resend API. Recipients live in
 * FORM_ROUTING below; the Resend API key lives in env.RESEND_API_KEY
 * (set as a Cloudflare Pages secret, NEVER in the repo).
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================================================================
    // Form submissions — same endpoint on both hosts
    // =========================================================================
    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContactForm(request, env);
    }

    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname;

    // =========================================================================
    // firstcallmechanical.com
    // =========================================================================
    if (host === "firstcallmechanical.com") {
      // Map firstcallmechanical.com URLs → the actual file paths in /mechanical/.
      // Use the canonical (no-.html) form Pages serves, otherwise Pages 301s
      // /mechanical/foo.html → /mechanical/foo and the redirect leaks through
      // to the browser (the URL bar ends up showing /mechanical/...).
      const rewrites = {
        "/":           "/mechanical/",
        "/locations":  "/mechanical/locations",
        "/careers":    "/mechanical/careers",
        "/contact":    "/mechanical/contact",
      };
      const stripped = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
      const target = rewrites[stripped];
      if (target) {
        const rewritten = new URL(target, url.origin);
        // Belt-and-suspenders: if Pages still returns a redirect for the asset,
        // follow it server-side so the browser stays on the user-typed URL.
        return fetchAssetFollowingRedirects(env, request, rewritten);
      }

      if (path === "/index.html") {
        return Response.redirect("https://firstcallmechanical.com/" + url.search, 301);
      }

      if (/^\/(team|news|acquisitions)(\/.*)?$/.test(path)) {
        return Response.redirect(`https://firstcallgroup.com${path}${url.search}`, 301);
      }

      return env.ASSETS.fetch(request);
    }

    // =========================================================================
    // firstcallgroup.com
    // =========================================================================
    if (host === "firstcallgroup.com") {
      if (/^\/(columbus|dfw|central-texas)(\/.*)?$/.test(path)) {
        return Response.redirect(`https://firstcallmechanical.com${path}${url.search}`, 301);
      }

      // The Insights blog is FCM content (root /insights*); keep it on the FCM domain.
      if (/^\/insights(\/.*)?$/.test(path)) {
        return Response.redirect(`https://firstcallmechanical.com${path}${url.search}`, 301);
      }

      if (path === "/mechanical" || path === "/mechanical/") {
        return Response.redirect("https://firstcallmechanical.com/" + url.search, 301);
      }
      if (path.startsWith("/mechanical/")) {
        const newPath = path.substring("/mechanical".length);
        return Response.redirect(`https://firstcallmechanical.com${newPath}${url.search}`, 301);
      }

      return env.ASSETS.fetch(request);
    }

    // Any other host (pages.dev preview, localhost, etc.) — serve as-is.
    return env.ASSETS.fetch(request);
  },
};

// Serve a static asset under a different URL while keeping the user-typed URL
// in the browser bar. Pages auto-canonicalizes things like /foo/index.html →
// /foo/ → /foo with 301s; if we passed those redirects through, the browser
// would follow them and the URL bar would change.
//
// Strategy: follow Pages' redirect chain server-side (capped at 5 hops, same
// origin only), then ALWAYS wrap the final body in a fresh 200 response. This
// means even if the last hop is still a 3xx, the browser only ever sees a 200
// and never navigates.
async function fetchAssetFollowingRedirects(env, originalRequest, targetUrl) {
  let response = await env.ASSETS.fetch(new Request(targetUrl, originalRequest));
  let hops = 0;
  while (response.status >= 300 && response.status < 400 && hops < 5) {
    const location = response.headers.get("Location");
    if (!location) break;
    const nextUrl = new URL(location, targetUrl);
    // Only follow same-origin redirects — anything cross-origin should pass through.
    if (nextUrl.origin !== targetUrl.origin) break;
    response = await env.ASSETS.fetch(new Request(nextUrl, originalRequest));
    hops += 1;
  }
  // Always wrap the final response body in a fresh 200. Even if Pages couldn't
  // be coaxed into giving us a 200, this guarantees the browser sees no
  // redirect and stays on the user-typed URL.
  const body = await response.arrayBuffer();
  const headers = new Headers();
  const ct = response.headers.get("content-type") || "text/html; charset=utf-8";
  headers.set("content-type", ct);
  const cc = response.headers.get("cache-control");
  if (cc) headers.set("cache-control", cc);
  return new Response(body, { status: 200, headers });
}

// =============================================================================
// Form-submission handler
// =============================================================================

// One row per form. Each value is the recipient list for that form.
// Adding a new form: add a row here AND set <input name="_form" value="..."> in the page.
const FORM_ROUTING = {
  "fcg-contact":          ["chris@firstcallgroup.com",          "Adam.Hostetter@firstcallgroup.com"],
  "fcg-acquisitions":     ["chris@firstcallgroup.com",          "Adam.Hostetter@firstcallgroup.com"],
  "fcm-contact":          ["info@firstcallgroup.com",           "Adam.Hostetter@firstcallgroup.com"],
  "fcm-columbus-service": ["ohioservice@firstcallmechanical.com", "Adam.Hostetter@firstcallgroup.com", "spriest@firstcallmechanical.com"],
  "fcm-dfw-service":      ["dispatch@firstcallmechanical.com",  "Adam.Hostetter@firstcallgroup.com", "scott.smith@firstcallmechanical.com"],
  "fcm-atx-service":      ["dispatch@firstcallmechanical.com",  "Adam.Hostetter@firstcallgroup.com", "scott.smith@firstcallmechanical.com"],
  "fcm-columbus-contact": ["ohioservice@firstcallmechanical.com", "Adam.Hostetter@firstcallgroup.com", "spriest@firstcallmechanical.com"],
  "fcm-dfw-contact":      ["dispatch@firstcallmechanical.com",  "Adam.Hostetter@firstcallgroup.com", "scott.smith@firstcallmechanical.com"],
  "fcm-atx-contact":      ["dispatch@firstcallmechanical.com",  "Adam.Hostetter@firstcallgroup.com", "scott.smith@firstcallmechanical.com"],
};

const FORM_LABELS = {
  "fcg-contact":          "FirstCall Group contact form",
  "fcg-acquisitions":     "FirstCall Group acquisitions inquiry",
  "fcm-contact":          "FirstCall Mechanical contact form",
  "fcm-columbus-service": "Columbus service request",
  "fcm-dfw-service":      "DFW service request",
  "fcm-atx-service":      "Austin service request",
  "fcm-columbus-contact": "Columbus contact form",
  "fcm-dfw-contact":      "DFW contact form",
  "fcm-atx-contact":      "Austin contact form",
};

// The "from" address must be on a domain you've verified in Resend.
// firstcallgroup.com should be verified (DNS records added to the Cloudflare
// zone for firstcallgroup.com).
const FROM_EMAIL = "FirstCall <noreply@firstcallgroup.com>";

// =============================================================================
// Anti-spam (five layers, cheapest first; any match → silent ok so bots
// can't tell the submission was rejected):
//   1. Origin allowlist  — reject POSTs not from FCG/FCM hostnames
//   2. Honeypot          — hidden _honeypot input filled = bot
//   3. Min-submit-time   — JS writes _ts on page load; reject if < 3 s
//   4. Cloudflare Turnstile — siteverify cf-turnstile-response token
//                            (conditional: skipped when TURNSTILE_SECRET_KEY
//                            is not set on the Pages project, so the worker
//                            keeps working before the widget is configured)
//   5. Non-Latin script  — reject submissions whose user-supplied text
//                          contains Cyrillic/CJK/Arabic/etc. (we operate in
//                          the US in English + Spanish only). Latin Extended
//                          (ñ, á, é) passes through.
// =============================================================================

const ALLOWED_ORIGINS = new Set([
  "https://firstcallgroup.com",
  "https://www.firstcallgroup.com",
  "https://firstcallmechanical.com",
  "https://www.firstcallmechanical.com",
  "https://firstcall-website.pages.dev",
]);

const MIN_SUBMIT_MS = 3000;

async function handleContactForm(request, env) {
  try {
    // Layer 1 — Origin allowlist.
    const origin = request.headers.get("origin") || "";
    if (!ALLOWED_ORIGINS.has(origin)) {
      console.warn("Origin rejected:", origin);
      return silentOk();
    }

    // Parse body — accept JSON or form-encoded.
    const ct = request.headers.get("content-type") || "";
    const data = ct.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());

    // Layer 2 — Honeypot.
    if (data._honeypot) {
      console.warn("Honeypot triggered");
      return silentOk();
    }

    // Layer 3 — Min-submit-time. _ts is set by form-handler.js on DOMContentLoaded.
    const ts = parseInt(data._ts, 10);
    if (!Number.isFinite(ts) || Date.now() - ts < MIN_SUBMIT_MS) {
      console.warn("Time check failed: _ts=", data._ts, "elapsed=", Date.now() - ts);
      return silentOk();
    }

    // Layer 4 — Cloudflare Turnstile (conditional). If TURNSTILE_SECRET_KEY
    // isn't set, skip — the other 4 layers still protect the form. When the
    // secret IS set, the token becomes required.
    if (env.TURNSTILE_SECRET_KEY) {
      const turnstileToken = data["cf-turnstile-response"] || "";
      const turnstileOk = await verifyTurnstile(turnstileToken, request, env);
      if (!turnstileOk) {
        console.warn("Turnstile verify failed");
        return silentOk();
      }
    }

    // Layer 5 — Non-Latin script reject. English + Spanish only.
    const userText = [data.name, data.company, data.address, data.message]
      .filter(s => typeof s === "string")
      .join(" ");
    if (isLikelyForeignScript(userText)) {
      console.warn("Non-Latin script rejected");
      return silentOk();
    }

    // Layer 6 — Markup/script probe. Vulnerability scanners spray <script>,
    // javascript: URIs, and on*= handlers into every field. The email already
    // escapes everything, so this just keeps that junk out of the inbox.
    if (containsMaliciousMarkup(data)) {
      console.warn("Markup/script probe rejected");
      return silentOk();
    }

    const formId = String(data._form || "").trim();
    const to = FORM_ROUTING[formId];
    if (!to) {
      return jsonResp({ error: `Unknown form id: ${formId}` }, 400);
    }

    const subject = buildSubject(formId, data);
    const html = renderEmailHTML(formId, data);
    const text = renderEmailText(formId, data);
    const replyTo =
      typeof data.email === "string" && /@/.test(data.email) ? data.email : undefined;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        reply_to: replyTo,
        subject,
        html,
        text,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Resend failure:", resp.status, errText);
      return jsonResp({ error: "Email delivery failed. Please try again or contact us directly." }, 502);
    }

    return jsonResp({ ok: true });
  } catch (e) {
    console.error("Form handler error:", e && e.stack || e);
    return jsonResp({ error: "Server error. Please try again." }, 500);
  }
}

async function verifyTurnstile(token, request, env) {
  if (!token || !env.TURNSTILE_SECRET_KEY) return false;
  const body = new URLSearchParams();
  body.append("secret", env.TURNSTILE_SECRET_KEY);
  body.append("response", token);
  const ip = request.headers.get("cf-connecting-ip");
  if (ip) body.append("remoteip", ip);
  try {
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const json = await resp.json();
    return !!json.success;
  } catch (e) {
    console.error("Turnstile siteverify error:", e);
    return false;
  }
}

function silentOk() {
  return jsonResp({ ok: true });
}

// True if `text` contains more than a few non-Latin characters (Cyrillic /
// CJK / Arabic / Devanagari / Thai / Hangul / Hebrew). Allows Latin Extended
// (accents, ñ, á, é, ü, etc.) so English and Spanish pass through cleanly.
function isLikelyForeignScript(text) {
  if (!text || typeof text !== "string") return false;
  const nonLatin = text.match(
    /[Ѐ-ӿԀ-ԯ֐-׿؀-ۿ܀-ݏऀ-ॿ฀-๿　-鿿가-힯]/g
  );
  return !!nonLatin && nonLatin.length > 3;
}

// True if any user-supplied string value looks like an HTML/JS injection probe.
// Internal fields (_form, _ts, cf-turnstile-response, etc.) are skipped — only
// human-entered values are checked. Matches: <script> / </script>, <iframe>,
// javascript: URIs, and inline event handlers like onerror= / onload=.
const MALICIOUS_MARKUP = /<\s*script|<\s*\/\s*script|<\s*iframe|javascript\s*:|\bon\w+\s*=/i;
function containsMaliciousMarkup(data) {
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith("_") || k === "cf-turnstile-response") continue;
    if (typeof v === "string" && MALICIOUS_MARKUP.test(v)) return true;
  }
  return false;
}

function jsonResp(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function buildSubject(formId, data) {
  const label = FORM_LABELS[formId] || formId;
  const name = typeof data.name === "string" && data.name.trim() ? ` — ${data.name.trim()}` : "";
  return `[Web] ${label}${name}`;
}

function renderEmailHTML(formId, data) {
  const rows = Object.entries(data)
    .filter(([k]) => !k.startsWith("_") && k !== "cf-turnstile-response")
    .map(([k, v]) => `
      <tr>
        <td style="padding:6px 16px 6px 0; vertical-align:top; color:#5a6371; font-weight:600; white-space:nowrap">${esc(prettyLabel(k))}</td>
        <td style="padding:6px 0; vertical-align:top; white-space:pre-wrap; word-break:break-word">${esc(String(v ?? ""))}</td>
      </tr>`).join("");
  const label = FORM_LABELS[formId] || formId;
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a2331;max-width:640px;margin:0 auto;padding:24px;background:#fcfbf7">
<div style="background:#fff;border:1px solid #e5e1d2;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(15,42,31,0.06)">
<h2 style="margin:0 0 4px 0;font-weight:700">New form submission</h2>
<p style="color:#5a6371;margin:0 0 16px 0;font-size:13px">${esc(label)} &mdash; <code style="background:#f4f2ea;padding:2px 6px;border-radius:4px">${esc(formId)}</code></p>
<table style="border-collapse:collapse;border-top:1px solid #e5e1d2;padding-top:12px;width:100%;font-size:14px">${rows}</table>
</div>
</body></html>`;
}

function renderEmailText(formId, data) {
  const label = FORM_LABELS[formId] || formId;
  const lines = [`New form submission`, label, `(${formId})`, ""];
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith("_") || k === "cf-turnstile-response") continue;
    lines.push(`${prettyLabel(k)}: ${v}`);
  }
  return lines.join("\n");
}

function prettyLabel(k) {
  return k.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
