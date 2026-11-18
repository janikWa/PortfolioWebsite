/* Dark mode (test) — loaded synchronously in <head> so the page never flashes the wrong theme.
   Order: ?theme=dark|light (testing) → stored choice → system preference. */
(function () {
  "use strict";

  var KEY = "site-theme";
  var COLORS = { light: "#E4E4E1", dark: "#121211" };
  var root = document.documentElement;

  function stored() {
    try { var v = localStorage.getItem(KEY); return v === "dark" || v === "light" ? v : null; } catch (e) { return null; }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", COLORS[theme]);
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  var param = new URLSearchParams(location.search).get("theme");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var initial = param === "dark" || param === "light" ? param : stored() || (mq && mq.matches ? "dark" : "light");
  apply(initial);

  // follow the system setting live, unless the visitor has chosen explicitly
  if (mq && mq.addEventListener) {
    mq.addEventListener("change", function (e) { if (!stored()) apply(e.matches ? "dark" : "light"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.getAttribute("data-theme"));
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* storage unavailable */ }
    });
  });
})();
