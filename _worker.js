/**
 * Cloudflare Pages multi-domain router.
 *
 * The same Pages project serves two custom domains:
 *   firstcallgroup.com        → FCG content (repo root files)
 *   firstcallmechanical.com   → FCM content (from /mechanical/* + the
 *                                /columbus, /dfw, /central-texas branch
 *                                files at root)
 *
 * Cloudflare Pages' _redirects file doesn't support host-aware 200 rewrites,
 * so this Worker does the routing. Each branch in this function checks the
 * incoming hostname, picks the right file (or redirects to the canonical
 * domain), and falls through to the static-asset fetcher.
 *
 * Wherever we want the URL bar to stay clean (e.g., firstcallmechanical.com/
 * should *look* like the root URL but *serve* /mechanical/index.html), we use
 * env.ASSETS.fetch(new Request(rewrittenUrl, request)) — that's an internal
 * rewrite, not a redirect.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname;

    // =========================================================================
    // firstcallmechanical.com
    // =========================================================================
    if (host === "firstcallmechanical.com") {
      // Clean URL → file path. The address bar stays put; we just serve
      // the matching file from /mechanical/*.
      const rewrites = {
        "/":           "/mechanical/index.html",
        "/locations":  "/mechanical/locations.html",
        "/careers":    "/mechanical/careers.html",
        "/contact":    "/mechanical/contact.html",
      };
      // Allow optional trailing slash on the rewrite keys
      const stripped = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
      const target = rewrites[stripped];
      if (target) {
        const rewritten = new URL(target, url.origin);
        return env.ASSETS.fetch(new Request(rewritten, request));
      }

      // Canonical-clean: /index.html → /
      if (path === "/index.html") {
        return Response.redirect("https://firstcallmechanical.com/" + url.search, 301);
      }

      // FCG-only pages requested on the FCM host → bounce to FCG.
      // (these pages don't exist on firstcallmechanical.com)
      if (/^\/(team|news|acquisitions)(\/.*)?$/.test(path)) {
        return Response.redirect(`https://firstcallgroup.com${path}${url.search}`, 301);
      }

      // Anything else (/columbus, /dfw, /central-texas, /assets/*, /shared/*,
      // robots.txt, sitemap.xml, etc.) — serve as-is.
      return env.ASSETS.fetch(request);
    }

    // =========================================================================
    // firstcallgroup.com
    // =========================================================================
    if (host === "firstcallgroup.com") {
      // Branch URLs on FCG → canonical FCM URLs (each branch has one canonical home)
      if (/^\/(columbus|dfw|central-texas)(\/.*)?$/.test(path)) {
        return Response.redirect(`https://firstcallmechanical.com${path}${url.search}`, 301);
      }

      // /mechanical or /mechanical/* on FCG → strip the prefix, send to clean FCM URL
      if (path === "/mechanical" || path === "/mechanical/") {
        return Response.redirect("https://firstcallmechanical.com/" + url.search, 301);
      }
      if (path.startsWith("/mechanical/")) {
        const newPath = path.substring("/mechanical".length);
        return Response.redirect(`https://firstcallmechanical.com${newPath}${url.search}`, 301);
      }

      // Default: serve as-is (FCG landing, team, news, acquisitions, etc.)
      return env.ASSETS.fetch(request);
    }

    // =========================================================================
    // Any other host (pages.dev preview, localhost, etc.) — serve as-is.
    // =========================================================================
    return env.ASSETS.fetch(request);
  },
};
