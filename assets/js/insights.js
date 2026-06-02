/* FirstCall Mechanical — Insights section behavior
   Shared by the hub (insights.html) and article pages.
   - Mobile nav toggle + Branches dropdown + sticky-header shadow (mirrors site)
   - Hub filtering by service line (data-filter / data-cat) */
(function () {
  "use strict";

  function initMobileNav() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  function initDropdowns() {
    var wraps = document.querySelectorAll("[data-dropdown]");
    wraps.forEach(function (wrap) {
      var toggle = wrap.querySelector("[data-dropdown-toggle]");
      var menu = wrap.querySelector("[data-dropdown-menu]");
      if (!toggle || !menu) return;
      function open() { menu.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true"); }
      function close() { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        menu.classList.contains("is-open") ? close() : open();
      });
      document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) close(); });
      if (window.matchMedia("(min-width: 1024px)").matches) {
        wrap.addEventListener("mouseenter", open);
        wrap.addEventListener("mouseleave", close);
      }
    });
  }

  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var ticking = false;
    function update() {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initFilters() {
    var filters = document.querySelectorAll(".insights-filter");
    var cards = document.querySelectorAll(".insight-card");
    var count = document.querySelector("[data-filter-count]");
    var empty = document.querySelector("[data-insights-empty]");
    if (!filters.length || !cards.length) return;
    var total = cards.length;

    function setCount(visible, active) {
      if (!count) return;
      var label = visible + " of " + total + " " + (visible === 1 ? "article" : "articles");
      count.textContent = active && active !== "all" ? label + " in " + active : label;
    }
    setCount(total);

    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filters.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var visible = 0;
        cards.forEach(function (card) {
          var cat = card.getAttribute("data-cat");
          var match = (f === "all") || (cat === f);
          if (match) { card.classList.remove("is-hidden"); visible++; }
          else card.classList.add("is-hidden");
        });
        setCount(visible, btn.textContent.trim());
        if (empty) empty.classList.toggle("is-visible", visible === 0);
      });
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(function () { initMobileNav(); initDropdowns(); initHeaderScroll(); initFilters(); });
})();
