/**
 * Shared client-side handler for any <form data-form-handler> on either site.
 *
 * Behavior:
 *   1. Intercept submit
 *   2. POST FormData to /api/contact (the Pages Function in _worker.js)
 *   3. On success: replace the form with an inline "thanks" panel
 *   4. On error: show the error in the form's [data-form-error] slot and
 *      re-enable the submit button
 */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var forms = document.querySelectorAll("form[data-form-handler]");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        submit(form);
      });
    });
  });

  function submit(form) {
    var btn = form.querySelector('button[type="submit"], input[type="submit"]');
    var errBox = form.querySelector("[data-form-error]");
    var origLabel = btn ? (btn.tagName === "INPUT" ? btn.value : btn.textContent) : null;

    if (errBox) { errBox.hidden = true; errBox.textContent = ""; }
    if (btn) {
      btn.disabled = true;
      if (btn.tagName === "INPUT") btn.value = "Sending…";
      else btn.textContent = "Sending…";
    }

    fetch("/api/contact", { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
      .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
      .then(function (res) {
        if (res.ok && res.body && res.body.ok) {
          showSuccess(form);
        } else {
          var msg = (res.body && res.body.error) || "Submission failed. Please try again.";
          throw new Error(msg);
        }
      })
      .catch(function (err) {
        if (errBox) {
          errBox.textContent = "Sorry — we couldn't send your message. " + err.message;
          errBox.hidden = false;
        } else {
          alert("Sorry — we couldn't send your message. " + err.message);
        }
        if (btn) {
          btn.disabled = false;
          if (btn.tagName === "INPUT") btn.value = origLabel;
          else btn.textContent = origLabel;
        }
      });
  }

  function showSuccess(form) {
    var panel = document.createElement("div");
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    panel.style.cssText =
      "padding:40px 24px;background:#F4F2EA;border:1px solid #E5E1D2;border-radius:12px;text-align:center;color:#1a2331";
    panel.innerHTML =
      '<div style="font-family:Manrope,system-ui,sans-serif;font-size:1.5rem;font-weight:700;margin-bottom:8px">Thanks — we’ll be in touch.</div>' +
      '<div style="color:#5a6371;font-size:1rem">Your message is on its way. We’ll respond as soon as we can.</div>';
    form.replaceWith(panel);
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();
