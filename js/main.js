(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- current year in the footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- mobile nav (full-screen overlay) ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav");

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    root.classList.toggle("nav-locked", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
    nav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", function () { setNav(false); }); });
    document.addEventListener("keydown", function (evt) { if (evt.key === "Escape") setNav(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) setNav(false); });
  }

  /* ---------- reveal: things come into focus ---------- */
  function observe(targets, onEnter, options) {
    if (!("IntersectionObserver" in window)) { targets.forEach(onEnter); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        obs.unobserve(entry.target);
      });
    }, options);
    targets.forEach(function (el) { io.observe(el); });
  }

  var revealTargets = Array.prototype.slice.call(document.querySelectorAll(
    ".h2, .row, .stage, .note, .step, .poster, .teaser-name, .teaser-photo, .teaser-text, " +
    ".contact-copy, .big-links li, .intro-photo, .intro-text, .stack, .cv-row"
  ));
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
    var siblings = Array.prototype.filter.call(el.parentNode.children, function (s) { return s.classList.contains("reveal"); });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index * 0.07, 0.35) + "s");
  });

  // once revealed, drop the reveal transition so hover transitions apply untouched
  function finishReveal(evt) {
    if (evt.target !== this || evt.propertyName !== "opacity") return;
    this.classList.remove("reveal", "is-visible");
    this.style.removeProperty("--reveal-delay");
    this.removeEventListener("transitionend", finishReveal);
  }

  observe(revealTargets, function (el) {
    el.addEventListener("transitionend", finishReveal);
    el.classList.add("is-visible");
  }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

  /* ---------- liquid line draws itself ---------- */
  observe(Array.prototype.slice.call(document.querySelectorAll(".liquid")), function (svg) {
    svg.classList.add("is-drawn");
  }, { threshold: 0.2 });

  /* ---------- fluted glass follows the cursor ----------
     On touch / coarse pointers it drifts on its own (CSS .is-auto). */
  document.querySelectorAll('[data-glass="follow"]').forEach(function (glass) {
    var area = glass.closest("[data-glass-area]");
    if (!area) return;

    if (prefersReduced || !finePointer) {
      glass.classList.add("is-auto");
      return;
    }

    var target = 0, current = 0, frame = null;
    var rest = function () { return area.clientWidth * 0.18; };
    current = target = rest();
    glass.style.setProperty("--gx", current.toFixed(1) + "px");

    var step = function () {
      current += (target - current) * 0.085;
      glass.style.setProperty("--gx", current.toFixed(1) + "px");
      frame = Math.abs(target - current) > 0.4 ? window.requestAnimationFrame(step) : null;
    };
    var kick = function () { if (!frame) frame = window.requestAnimationFrame(step); };

    var zone = area.closest("section, footer") || area;
    zone.addEventListener("pointermove", function (evt) {
      var rect = area.getBoundingClientRect();
      var w = glass.offsetWidth;
      target = Math.max(-w * 0.3, Math.min(rect.width - w * 0.7, evt.clientX - rect.left - w / 2));
      kick();
    });
    zone.addEventListener("pointerleave", function () { target = rest(); kick(); });
    window.addEventListener("resize", function () { target = rest(); kick(); });
  });

  /* ---------- rotating word in the hero headline ----------
     Re-queried each tick because the language toggle replaces the h1's innerHTML. */
  if (!prefersReduced) {
    setInterval(function () {
      var el = document.querySelector(".rotator");
      if (!el || document.hidden) return;
      var words = (el.getAttribute("data-words") || "").split("|");
      if (words.length < 2) return;
      var next = words[(words.indexOf(el.textContent.trim()) + 1) % words.length];
      el.classList.add("is-out");
      setTimeout(function () {
        if (!el.isConnected) return;
        el.textContent = next;
        el.classList.remove("is-out");
        el.classList.add("is-in");
        void el.offsetWidth;
        el.classList.remove("is-in");
      }, 500);
    }, 3000);
  }
})();
