# FirstCall Web Properties — Build Prompt for Claude Code

You are building a multi-site web property for **FirstCall Group**, a PE-backed commercial HVAC, plumbing, building controls, and electrical services roll-up. The deliverable is a single repository that produces:

1. **One parent marketing site** at `firstcallmechanical.com` (or rebranded to `firstcallgroup.com` — see open questions at the bottom).
2. **One shared branch-site template** that can be configured to produce a standalone-feeling site for each acquired branch (Columbus, DFW, Central Texas, STR Mechanical, C2H, and future acquisitions).

Read this entire prompt before writing any code. Then ask me clarifying questions only on the items flagged in **OPEN QUESTIONS** at the bottom. Everything else, make your best judgment and proceed.

---

## CONTEXT — What exists today

The current site is `https://firstcallmechanical.com/` hosted on Prismic CMS. It is functional but the styling needs a refresh — cleaner, more confident, more "professional B2B" similar to ServiceLogic (`https://www.servicelogic.com/`) and Modigent (`https://modigent.com/`), but distinctly FirstCall.

The 5 branches that need template instances:

| Branch | Current URL | Notes |
|---|---|---|
| Columbus | `firstcallmechanical.com/columbus` | Subpage of parent — stays as subpage |
| Dallas Fort-Worth | `firstcallmechanical.com/dfw` | Subpage of parent — stays as subpage |
| Central Texas | `firstcallmechanical.com/central-texas` | Subpage of parent — stays as subpage |
| STR Mechanical | `https://strmechanical.com/` | Standalone domain — separate site |
| C2H | `https://c2h.com/` | Standalone domain — separate site |

The existing STR and C2H sites already follow a near-identical template (Capabilities grid → Markets Served → "A FirstCall Company" block → service form). **Your job is to formalize that pattern into a real reusable template**, not invent a new layout from scratch. Future acquisitions will spin up a new branch site by copying a config file.

---

## REFERENCES — Sites to study before designing

**Visual feel (cleaner B2B):** these are the north star for tone, density, typography, photography treatment.
- `https://www.servicelogic.com/`
- `https://www.servicelogic.com/locations` (locations map page)
- `https://accelairsystems.com/` (ServiceLogic branch template)
- `https://www.airforceone.com/` (ServiceLogic branch template)

**Structural patterns (parent + portfolio companies):**
- `https://modigent.com/` (parent)
- `https://modigent.com/companies/` (locations/map page)
- `https://cahsinc.com/` (Modigent branch template, useful for comparison)
- `https://climatesolutionstx.com/` (Modigent branch template)

**Current FirstCall sites — read these to inherit content, copy, photography, and current brand cues:**
- `https://firstcallmechanical.com/` (parent — keep most content)
- `https://firstcallmechanical.com/columbus`
- `https://firstcallmechanical.com/dfw`
- `https://firstcallmechanical.com/central-texas`
- `https://strmechanical.com/`
- `https://c2h.com/`

**Important:** lean toward the ServiceLogic / Accel Air aesthetic (clean B2B, photo-led, more conservative) over the Modigent aesthetic (bold, condensed, industrial). FirstCall should feel premium and trustworthy, not "edgy."

---

## ARCHITECTURE

```
firstcall-web/
├── README.md
├── shared/
│   ├── css/
│   │   ├── tokens.css              # Brand tokens (colors, fonts, spacing) — single source of truth
│   │   ├── base.css                # Resets, typography, utilities
│   │   ├── components.css          # Buttons, cards, forms, nav, footer
│   │   └── layouts.css             # Hero, capabilities grid, markets, contact
│   ├── js/
│   │   └── site.js                 # Mobile nav toggle, form handlers, map interactions
│   ├── img/
│   │   ├── logos/
│   │   ├── icons/
│   │   └── photos/
│   └── templates/
│       ├── parent.html
│       ├── locations.html
│       └── branch.html             # Branch site template (used by all branches)
├── parent/
│   ├── index.html
│   ├── locations.html
│   ├── acquisitions.html
│   ├── careers.html
│   └── contact.html
├── branches/
│   ├── columbus/
│   │   ├── config.json
│   │   └── index.html
│   ├── dfw/
│   │   ├── config.json
│   │   └── index.html
│   ├── central-texas/
│   │   ├── config.json
│   │   └── index.html
│   ├── str/
│   │   ├── config.json
│   │   └── index.html
│   └── c2h/
│       ├── config.json
│       └── index.html
└── scripts/
    └── build.js                    # Regenerates branch HTMLs from config + template
```

### Why this structure
- **One template, many branches.** All five branch sites use the same `branch.html` template; each one's `config.json` injects the specifics (logo, phone, photos, hero copy, services offered, license disclosures, contact info). When you acquire a new company, you copy a folder and edit a JSON file.
- **Single source of truth for design tokens.** `shared/css/tokens.css` defines every color, font, and spacing variable. Restyle the entire network of sites by editing one file.
- **No build tool required at runtime.** Each branch's `index.html` is a real, complete, openable HTML file. The `build.js` script regenerates HTMLs from template + config when either changes — but the HTMLs must be human-readable and editable standalone, so a non-developer can open `branches/columbus/index.html`, change a phone number, and save.
- **Plain HTML/CSS/vanilla JS.** No React, no Next.js. The user reviews and edits HTML directly. Use Tailwind only via CDN if absolutely needed; prefer hand-written CSS using the tokens file.

---

## BRAND DERIVATION

The user does not have a formal brand guide. **Derive the brand by analyzing `https://firstcallmechanical.com/`:**

1. Fetch the existing site CSS and identify the primary color, accent color, typography, and logo treatment.
2. The current FirstCall logo is at `https://firstcall-mech.cdn.prismic.io/firstcall-mech/adVMuuzlhpBNhbFN_HeroWhite-vAH_fixed_.svg` — use this as the logo reference.
3. Document your derived tokens in `shared/css/tokens.css` with comments explaining each choice.
4. If the existing site has a thin or dated palette, you may *refine* (e.g., introduce a complementary accent, tighten the type scale), but do not abandon the existing identity. The goal is "the FirstCall site, but visibly more polished," not a rebrand.

Use distinctive but professional typography (not Inter, not Roboto, not Arial). Good candidates for a clean B2B feel: **Inter Display** with **Source Sans 3**, or **Manrope** with **IBM Plex Sans**, or **DM Sans** with **DM Serif Display** for accents. Choose one pairing and commit.

---

## PARENT SITE — Pages and content

### `/` (Homepage)
Keep the section structure of the existing `firstcallmechanical.com` homepage but execute it more cleanly:

1. **Header** — logo left, nav right: Locations · Acquisitions · Careers · Contact. Mobile: hamburger menu.
2. **Hero** — tagline "Durable Partnerships. With our teams and our customers." + supporting copy from the existing site. Use a single high-quality photo (not the existing 8-photo collage — that feels cluttered). Provide a clear CTA pair: "Explore Locations" / "Contact Us."
3. **Three branch quick-cards** below hero — Columbus, DFW, Central Texas with phone numbers and "Visit Site" links (preserve the existing functionality).
4. **Our Capabilities** — 6 services from the existing site (HVAC Services, Building Controls, Plumbing Services, Planned Maintenance, Emergency Services, Project Support). Use the existing SVG icons. Grid: 3×2 desktop, 2×3 tablet, 1×6 mobile.
5. **Markets Served** — preserve the existing SVG diagram and section title.
6. **A FirstCall Company** — preserve the existing paragraph and Learn More link to firstcallgroup.com.
7. **Map preview** — small section showing US map with all branch pins; CTA to `/locations`.
8. **Acquisitions Program CTA** — large band styled similarly to Modigent's "Acquisitions Program" section, with copy adapted for FirstCall. Links to `/acquisitions`.
9. **Footer** — copyright, contact, careers, LinkedIn, privacy policy.

### `/locations` (Locations / Map page)
1. Page header: "Our Locations"
2. Full-width interactive US map with pins for all 5 branches. Use Leaflet (open source, no API key needed) or a static SVG with positioned pins if Leaflet feels heavy. Pins clickable, opening info popovers.
3. Below the map: search/filter input.
4. Grid of branch cards (similar pattern to Modigent's `/companies` page but in the cleaner ServiceLogic aesthetic). Each card: branch name, one-sentence description, address, phone, "Visit Website" link. Cards link to either the subpage (`/columbus`) or external domain (`strmechanical.com`).
5. Acquisitions CTA at bottom.

### `/acquisitions`
Adapt the messaging from the existing FirstCall Group narrative. Sections: hero, "Why partner with FirstCall," "Our approach" (3-4 points), "What you keep / what we provide" two-column, testimonial or quote, contact form for sellers/brokers.

### `/careers`, `/contact`
Standard pages. Careers can link out to the existing Paycom URL. Contact is a simple form (does not need to actually submit — placeholder action is fine; document this in the README).

---

## BRANCH TEMPLATE — `shared/templates/branch.html`

Every branch site must include these sections in this order, all driven by `config.json`:

1. **Header** — branch logo + nav. Nav links come from config (Columbus might just have "Careers, Contact"; STR has "Charlotte, Virginia, Greenville, Careers"; C2H has "Capabilities, Careers, Contact"). "A FirstCall Company" tagline below or beside the logo.
2. **Hero** — branch tagline + paragraph + phone CTA + contact form CTA. Hero photo from config.
3. **Photo strip** — horizontal scrolling row of 4-6 branch photos. (Replaces the cluttered 8-photo collage on current sites.)
4. **Our Capabilities** — 4-6 service pillars (config-driven; not every branch offers all services — Columbus may not list Plumbing, for example).
5. **Technical Experience** — long bulleted list of equipment types serviced (config-driven; varies by branch).
6. **Markets Served** — uses the shared FirstCall Markets Served SVG diagram.
7. **A FirstCall Company** — standardized block with link to parent site. Identical across all branches.
8. **How Can We Help / Service Form** — title customized per branch ("At STR we're dedicated..."), but form structure identical.
9. **Footer** — copyright, LinkedIn, Careers (Paycom link is shared), Contact, branch address, branch phone. State licenses (text from config, shown only if present — DFW has Texas + Oklahoma licenses; others may have different ones).

### `config.json` schema (for branches)
Define this schema clearly and stick to it. Approximate shape:

```json
{
  "slug": "dfw",
  "name": "FirstCall Mechanical — Dallas Fort-Worth",
  "shortName": "Dallas Fort-Worth",
  "tagline": "Dallas Fort-Worth",
  "heroParagraph": "Our team of expert technicians...",
  "phone": "(469) 669-0978",
  "phoneE164": "+14696690978",
  "email": "dispatch@firstcallmechanical.com",
  "address": {"street": "...", "city": "Dallas", "state": "TX", "zip": "..."},
  "logo": "shared/img/logos/firstcall-mech-white.svg",
  "logoDark": "shared/img/logos/firstcall-mech-dark.svg",
  "navLinks": [
    {"label": "Careers", "href": "https://www.paycomonline.net/..."},
    {"label": "Contact", "href": "#contact"}
  ],
  "heroPhoto": "shared/img/photos/dfw-hero.jpg",
  "photoStrip": ["...", "...", "..."],
  "services": ["building-controls", "equipment-upgrades", "emergency-repair", "planned-maintenance"],
  "technicalExperience": ["AHUs", "Boilers", "Booster Pumps", "..."],
  "stateLicenses": [
    {"number": "TACLA147472E", "body": "Regulated by the Texas Department of Licensing and Regulation..."}
  ],
  "mapCoords": {"lat": 32.7767, "lng": -96.7970},
  "parentLink": "https://firstcallmechanical.com",
  "isExternalDomain": false
}
```

Use the existing site content from the URLs above to populate each config. Do not invent copy. If something is missing, leave a `TODO:` comment in the config so the user knows to fill it in.

---

## TEMPLATING APPROACH

Use a `scripts/build.js` Node script (Node 18+, built-ins only — no npm dependencies) that:
1. Reads `shared/templates/branch.html`.
2. For each `branches/{slug}/config.json`, hydrates the template with the config values and writes the result to `branches/{slug}/index.html`.
3. Uses simple `{{placeholder}}` syntax and `{{#each services}}...{{/each}}` for loops. Keep it dead simple — don't pull in Handlebars or Mustache.

The generated HTML must be clean, readable, and self-contained so the user can also edit it directly. Provide a `package.json` with `"build": "node scripts/build.js"`. The runtime sites are still plain HTML/CSS/JS — the build script is only used when editing the template or configs.

---

## TECHNICAL REQUIREMENTS

- **Responsive:** desktop, tablet, mobile. Test mental model at 1440px, 1024px, 768px, 375px breakpoints.
- **Accessible:** semantic HTML, ARIA labels on nav/menus/icons, contrast ratios meeting WCAG AA, focus states on all interactive elements, skip-to-content link.
- **Performance:** no heavy frameworks; inline critical CSS for above-the-fold; lazy-load below-the-fold images; use `<picture>` for responsive images.
- **SEO:** proper title tags, meta descriptions, Open Graph tags, JSON-LD `LocalBusiness` schema on each branch site.
- **Map:** use Leaflet with OpenStreetMap tiles (free, no API key). If Leaflet is overkill for the inline map preview on the homepage, use a static SVG instead and reserve Leaflet for `/locations`.
- **Forms:** structure correctly with labels and required fields, but `action` can be a placeholder — note in the README that the user will wire up Formspree, HubSpot, or similar later.

---

## DELIVERABLES & ORDER OF OPERATIONS

Build in this order so I can review at each milestone:

1. **Milestone 1 — Tokens & design system.** Create `shared/css/tokens.css`, `base.css`, `components.css`. Build a simple `shared/styleguide.html` page that shows every component (buttons, cards, form fields, headings, color swatches, type scale) in one place. **Stop here and show me.**
2. **Milestone 2 — Parent homepage.** Build `parent/index.html` using the tokens. **Stop and show me.**
3. **Milestone 3 — Locations page.** Build `parent/locations.html` with the working map. **Stop and show me.**
4. **Milestone 4 — Branch template + Columbus.** Build `shared/templates/branch.html` and the first branch (`branches/columbus/`). **Stop and show me.**
5. **Milestone 5 — Remaining 4 branches + build script.** Generate DFW, Central Texas, STR, C2H from configs. **Show me.**
6. **Milestone 6 — Acquisitions, Careers, Contact pages + README.** Polish, write the README, hand off.

After each milestone, the user will say "looks good, continue" or give edit notes. **Don't proceed past a milestone without confirmation.**

The README must clearly explain:
- How to open and preview a page locally (just open the HTML, or `python -m http.server` from the root).
- How to edit a branch's content (edit `config.json`, run `npm run build`, or edit HTML directly).
- How to add a new branch (copy a folder, edit config, rerun build).
- How to update brand tokens globally (edit `tokens.css`, refresh).
- Where the user still needs to wire things up (form backends, real photos, analytics).

---

## OPEN QUESTIONS — ask the user before starting

Ask these in **one message** before writing any code:

1. The parent site lives at `firstcallmechanical.com` but the corporate entity is FirstCall **Group** at `firstcallgroup.com`. Which is the parent we're building? Is this consolidating both?
2. Do you want me to include real photos from the existing sites (by referencing their CDN URLs), or use placeholders and let you swap in new photos later?
3. Service-pillar SVG icons — should I pull the existing ones from `firstcall-mech.cdn.prismic.io`, or redraw them in a consistent set?
4. For the locations map, do you want all 5 pins to be live and clickable on day one, or should some be flagged as "Coming Soon" if the data isn't ready?
5. Any specific branches' content you want to revise rather than carry over verbatim?

After I answer these, proceed with Milestone 1.
