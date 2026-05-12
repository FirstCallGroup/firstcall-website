/* ============================================================
   FirstCall site.js — shared interactions for every page.
   No framework, no dependencies. Defensive about missing nodes
   so individual pages can opt in by adding the markup.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    // Close the menu when a nav link is followed.
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close on Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var ticking = false;

    function update() {
      if (window.scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* ---------- Map preview pin popovers ---------- */
  function initMapPins() {
    var pins = document.querySelectorAll("[data-map-pin]");
    if (!pins.length) return;

    pins.forEach(function (pin) {
      pin.addEventListener("mouseenter", function () { pin.classList.add("is-active"); });
      pin.addEventListener("mouseleave", function () { pin.classList.remove("is-active"); });
      pin.addEventListener("focus",      function () { pin.classList.add("is-active"); });
      pin.addEventListener("blur",       function () { pin.classList.remove("is-active"); });
    });
  }

  /* ---------- Boot ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initMobileNav();
      initHeaderScroll();
      initMapPins();
    });
  } else {
    initMobileNav();
    initHeaderScroll();
    initMapPins();
  }
})();
