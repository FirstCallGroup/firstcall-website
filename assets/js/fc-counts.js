/* Populates dynamic FirstCall network counts on any page.
   Requires assets/js/locations-data.js to be loaded first (defines window.FC_LOCATIONS).

   Usage in markup:
     <span data-fc-count="branches">24</span>   -> textContent replaced with branch count
     <span data-fc-count="states">11</span>     -> textContent replaced with unique state count

   Animated stat counters (data-stat-num + data-stat-value):
     If the element also carries data-fc-count, the data-stat-value
     attribute is updated too, so the count-up animation targets the
     correct number.

   The static numeric fallback inside the element shows for non-JS visitors and
   should be kept reasonably current. */
(function () {
  "use strict";
  function apply() {
    var data = window.FC_LOCATIONS;
    if (!data || !data.length) return;
    var states = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i] && data[i].state) states[data[i].state] = true;
    }
    var values = {
      branches: data.length,
      states: Object.keys(states).length
    };

    Object.keys(values).forEach(function (key) {
      var nodes = document.querySelectorAll('[data-fc-count="' + key + '"]');
      for (var j = 0; j < nodes.length; j++) {
        var el = nodes[j];
        if (el.hasAttribute("data-stat-value")) {
          // Animated stat counter: keep the "0" placeholder so the count-up
          // animation can run; just sync the target value.
          el.setAttribute("data-stat-value", values[key]);
        } else {
          el.textContent = values[key];
        }
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
