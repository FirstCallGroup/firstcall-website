# TODO

## Pre-launch

- [ ] **Audit every button and link across the site — no dead links.** Walk all pages (index, locations, team, news, careers, contact, acquisitions, columbus, columbus/*) and verify each `<a>`, `<button>`, and CTA actually navigates to the intended destination. Catch things like `href="#"`, `href="#contact"` with no matching anchor, broken Paycom URLs, cross-domain links that need full URLs, and stale references after page renames.

- [ ] **Stabilize the Columbus hero video.** Currently the drone pan still feels jumpy — slow the playbackRate further, tune the crop (`object-position`), and shorten the loop window so the motion is subtler and more constant. Goal: a calm, slow background that doesn't pull the eye away from the headline.

- [ ] **Re-crop production photos across the site.** Pass through every photo (Columbus photo strip, Ohio/branch pages, anywhere else) and confirm the focal point is the people / equipment, not empty sky or floor. Some current crops feel off-center.

- [ ] **Lead with people in the Ohio (Columbus) photo coverage.** The new production photos are mostly equipment-heavy (chillers, cooling tower). Add or swap in photos that feature the FirstCall Mechanical Ohio team itself — technicians on site, dispatch, shop crew — and weight the photo strip toward those.

- [ ] **Right-align the primary nav.** The header layout should push the nav links to the right so the logo sits on the far left and the nav + CTA cluster on the far right with no awkward gap in the middle. Audit on all pages — desktop and the mobile drawer.

- [ ] **Footer logo always renders the full "FirstCall Mechanical" wordmark.** Audit the footer SVG on every page (root + columbus/*) and confirm both the FC mark *and* the "MECHANICAL" portion of the wordmark are present — same fix pattern as the recent header logo bug. No "FirstCall"-only stubs anywhere.

- [ ] **Make sure every footer link goes somewhere real.** Walk the footer columns on each page — Services, Contact, Connect, FirstCall Network, the copyright row — and verify every `<a>` lands on a working page (or a real external URL). No `href="#"`, no orphans, no cross-domain links that 404.

- [x] **Rename "Preventative Maintenance" → "Planned Maintenance" everywhere.** Page title, meta description, canonical URL, hero h1, body copy, nav dropdown label, footer service link, internal references on sibling pages, JSON-LD, and the `columbus/preventative-maintenance.html` filename itself (→ `planned-maintenance.html`). Update every link that points to it.

- [ ] **Rebuild the Team page as a low-maintenance, data-driven layout.** Right now every leader is hand-coded HTML — name, title, headshot, bio, modal markup — which means an HTML edit every time someone joins or leaves. Move the leader list to a single JSON (or CMS) source and render the grid + modal from it, so adding/removing a person is one entry, not six file edits. Aim for the design to gracefully handle 4, 7, 10, or 15 people without manual layout fiddling.

## DFW branch site — data still needed

Files: `dfw.html`, `dfw/planned-maintenance.html`, `dfw/hvac-modernization.html`, `dfw/project-work.html`, `dfw/contact.html`, `dfw/careers.html`. Phone, address, and lat/lng are real; everything below is placeholder content carried over from Columbus or stubbed.

- [ ] **Branch email** — currently `dispatch@firstcallmechanical.com` (generic FC Mechanical placeholder). Replace with the actual DFW dispatch / branch inbox.
- [ ] **Hero video** — `<source src="reference/dfw/videos/dfw_hero.mp4">` is a placeholder path that does not exist. The element fails gracefully and the dark-green hero shows behind the text. Drop a real DFW drone / skyline / shop clip at that path (≤10 MB H.264) and the hero plays automatically.
- [ ] **Hero poster image** — currently `reference/columbus/photos/production/Chiller_1.avif`. Swap to a DFW-specific still frame from the new video, or a high-res DFW shop / fleet photo.
- [ ] **Photo strip** — six images on the home page still point into `reference/columbus/photos/production/`. The chiller and cooling-tower equipment shots are brand-generic and fine to keep as fallback, but `IMG_3025.jpg` and `IMG_3030.jpg` are likely Columbus-team shots and should be replaced with DFW-team photos. The `FC DFW Truck.jpeg` is actually a DFW photo and is appropriately re-used.
- [ ] **About / branch story content** — the prose on the home page and on sub-pages references generic "FirstCall Mechanical" language but originally reads as the Columbus story. Rewrite with the DFW partnership history, founding context, what makes the Carrollton operation distinct, and any specific certifications or contractor licenses.
- [ ] **Equipment list** (home page) — currently the generic Columbus equipment list. Audit for any DFW-specific gear or specialties (e.g., gas-fired equipment they don't run in Texas, refrigerant transitions, etc.).
- [ ] **Paycom careers URL** — `dfw/careers.html` still uses `clientkey=TODO`. Replace with the real DFW posting URL.
- [ ] **Service-area cities** — body copy now says "North Texas" / "Dallas-Fort Worth"; tighten if you want explicit city callouts (Plano, Frisco, Arlington, Irving, etc.).

## Central Texas (Austin) branch site — data still needed

Files: `central-texas.html`, `central-texas/planned-maintenance.html`, `central-texas/hvac-modernization.html`, `central-texas/project-work.html`, `central-texas/contact.html`, `central-texas/careers.html`. Address and lat/lng are real; phone is a fallback.

- [ ] **Direct branch phone** — currently shows the FCG corporate line `(844) 715-0220` as a fallback (FCG HQ is in Austin so routing is sensible). Replace with a direct Austin branch dispatch line as soon as one exists. Update both the displayed `(844) 715-0220` and the `tel:+18447150220` href everywhere on the site.
- [ ] **Branch email** — currently `dispatch@firstcallmechanical.com` (placeholder). Replace with the Austin-specific inbox.
- [ ] **Hero video** — `<source src="reference/central-texas/videos/austin_hero.mp4">` is a placeholder. Drop a real Austin clip at that path.
- [ ] **Hero poster image** — currently the Columbus chiller AVIF. Swap to an Austin-specific still or shop photo.
- [ ] **Photo strip** — all six photos still point at `reference/columbus/photos/production/`. Notably the `FC DFW Truck.jpeg` is **wrong** on the Austin page (DFW truck) and should be swapped first. The chiller / cooling-tower equipment shots are generic fallback. Replace with Austin-branch photography.
- [ ] **About / branch story content** — prose is carried over from Columbus. Rewrite with Austin partnership history and what's distinct about the Central Texas operation.
- [ ] **Equipment list** — audit for Austin specifics.
- [ ] **Paycom careers URL** — `central-texas/careers.html` still uses `clientkey=TODO`.
- [ ] **Service-area cities** — body says "Central Texas"; consider explicit callouts (Austin, Round Rock, Cedar Park, San Marcos, Georgetown, etc.).

## Cross-site cleanup

- [ ] **`columbus_downtown.mp4` lives at `reference/columbus/videos/`.** Once DFW and Austin videos exist, move them to `reference/dfw/videos/` and `reference/central-texas/videos/` respectively to match the placeholder paths the sites expect.
- [ ] **`scripts/build-directory.js` and `scripts/inline-map.js`** — these source files still contain a `Capital City` entry from the pre-divest data. If the directory ever gets rebuilt from source, Capital City will reappear. Strip it.

## Anti-spam — Cloudflare Turnstile (FCG + FCM contact forms)

All 9 forms on `firstcallgroup.com` and `firstcallmechanical.com` are wired to Resend via `_worker.js` (`fcg-contact`, `fcg-acquisitions`, `fcm-contact`, and the 6 branch service/contact forms) but are honeypot-only. Mirror the Starnes implementation (Starnes repo, commit `b70d9f8` — "Add anti-spam layers to contact form: Turnstile + time + origin") when spam warrants. Four layers in `_worker.js`, all silent-ok on rejection so bots can't learn:

1. **Origin allowlist** — reject POSTs whose `Origin` isn't a known FCG / FCM hostname (apex + www for both)
2. **Honeypot** — already in place
3. **Min-submit-time** (3 s) — JS writes `Date.now()` into a hidden `_ts` field; worker rejects fast submissions
4. **Cloudflare Turnstile** — verify the widget token via `challenges.cloudflare.com/turnstile/v0/siteverify`

Setup (~30 min — more pages to wire than the single-site projects):
1. Cloudflare dash → Turnstile → Add widget named `FirstCall Mechanical + Group` with hostnames `firstcallgroup.com`, `www.firstcallgroup.com`, `firstcallmechanical.com`, `www.firstcallmechanical.com`, and the Pages preview. One widget covers both because they share the Pages project (this is the one valid exception to per-site widgets).
2. Add `TURNSTILE_SECRET_KEY` as a Pages secret (Production) on the shared FCG/FCM Pages project.
3. Copy the 4-layer pattern from Starnes `_worker.js` and adapt the origin allowlist to FCG + FCM hostnames.
4. Add the Turnstile widget div, `_ts` hidden input, and Turnstile script tag to **all 9 form pages**: `contact.html`, `acquisitions.html`, `columbus.html`, `dfw.html`, `central-texas.html`, plus the branch contact pages under `columbus/contact.html`, `dfw/contact.html`, `central-texas/contact.html`, and `mechanical/contact.html`. Audit `scripts/wire-forms.js` to see if it can stamp these in automatically.
5. Add the `_ts` setter on DOMContentLoaded in `assets/js/form-handler.js`.
6. Push — Cloudflare redeploys with the secret available.
