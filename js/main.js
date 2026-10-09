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

  // the CV page (/aboutme) stays static: no reveal animation
  var revealTargets = document.body.classList.contains("cv-page") ? [] : Array.prototype.slice.call(document.querySelectorAll(
    ".h2, .row, .stage, .note, .step, .poster, .teaser-name, .teaser-photo, .teaser-text, " +
    ".contact-copy, .big-links li"
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

  /* ---------- fluted glass follows the cursor (hero + footer wordmark) ----------
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

  /* ---------- scramble: letters cycle through glyphs before they lock, left to right ---------- */
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  function scramble(el, target, done) {
    var from = el.textContent, frame = 0, total = 16;
    el.classList.add("is-scrambling");
    (function step() {
      if (!el.isConnected) return;
      var locked = Math.floor((frame / total) * target.length);
      var len = Math.round(from.length + (target.length - from.length) * Math.min(1, frame / total));
      var out = "";
      for (var i = 0; i < len; i++) {
        out += i < locked ? target[i] : (target[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0]);
      }
      el.textContent = out;
      if (frame++ < total) { setTimeout(step, 45); return; }
      el.textContent = target;
      el.classList.remove("is-scrambling");
      if (done) done();
    })();
  }

  /* ---------- CV timeline (/aboutme) ----------
     A cobalt line fills with scroll progress; each step's node lights up once the line passes it.
     Steps enter by drawing their rule, scrambling the date and sliding the text up. */
  var cv = document.querySelector(".cv");
  if (cv) {
    var rows = Array.prototype.slice.call(cv.querySelectorAll(".cv-row"));

    if (!prefersReduced) {
      cv.parentNode.classList.add("cv-anim");
      var queued = 0;
      observe(rows, function (row) {
        var delay = queued++ * 110;
        setTimeout(function () { queued = Math.max(0, queued - 1); }, 400);
        setTimeout(function () {
          row.classList.add("is-in");
          var date = row.querySelector(".cv-date");
          if (date) { date.style.opacity = "1"; scramble(date, date.textContent.trim()); }
        }, delay);
      }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });
    } else {
      rows.forEach(function (row) { row.classList.add("is-in"); });
    }

    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var line = vh * 0.62;
      var rect = cv.getBoundingClientRect();
      var atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
      var p = atEnd ? 1 : Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      cv.style.setProperty("--p", p.toFixed(4));
      rows.forEach(function (row) {
        var top = row.getBoundingClientRect().top + 30;
        row.classList.toggle("is-passed", atEnd || top < line);
      });
    };
    var request = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  }

  /* ---------- rotating word in the hero headline ----------
     Re-queried each tick because the language toggle replaces the h1's innerHTML. */
  if (!prefersReduced) {
    setInterval(function () {
      var el = document.querySelector(".rotator");
      if (!el || document.hidden || el.classList.contains("is-scrambling")) return;
      var words = (el.getAttribute("data-words") || "").split("|");
      if (words.length < 2) return;
      var current = words.indexOf(el.textContent.trim());
      scramble(el, words[(current + 1) % words.length]);
    }, 3000);
  }
})();
