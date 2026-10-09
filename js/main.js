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
    ".poster, .teaser-name, .teaser-photo, .teaser-text, " +
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

  /* ---------- scroll scenes (scrubbed to scroll position, Apple-style) ----------
     Everything below reads scroll progress every frame and writes CSS variables,
     so the motion follows the scroll in both directions. */
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var scenes = [];

  if (!prefersReduced && !document.body.classList.contains("cv-page")) {

    // 1) headlines: words light up one by one
    var splitWords = function (h) {
      if (h.querySelector(".w")) return;
      var words = h.textContent.trim().split(/\s+/);
      var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
      h.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + "</span>"; }).join(" ");
      h._words = Array.prototype.slice.call(h.querySelectorAll(".w"));
    };
    document.querySelectorAll(".h2").forEach(function (h) {
      splitWords(h);
      // the language toggle rewrites the text: split again
      new MutationObserver(function () { if (!h.querySelector(".w")) { splitWords(h); requestScenes(); } }).observe(h, { childList: true });
      scenes.push(function (vh) {
        var r = h.getBoundingClientRect();
        var p = clamp((vh * 0.92 - r.top) / (vh * 0.5), 0, 1);
        var n = h._words.length;
        h._words.forEach(function (w, k) { w.style.setProperty("--o", (0.14 + 0.86 * clamp(p * (n + 2) - k, 0, 1)).toFixed(3)); });
      });
    });

    // 2) approach: the liquid line draws with the scroll, stages rise out of blur
    var approach = document.getElementById("approach");
    if (approach) {
      var path = approach.querySelector(".liquid-path");
      var risers = Array.prototype.slice.call(approach.querySelectorAll(".stage, .note"));
      risers.forEach(function (el) { el.classList.add("scrub"); });
      scenes.push(function (vh) {
        var r = approach.getBoundingClientRect();
        var p = clamp((vh - r.top) / (r.height + vh * 0.4), 0, 1);
        if (path) path.style.setProperty("--draw", (1 - clamp(p * 1.25, 0, 1)).toFixed(4));
        risers.forEach(function (el) {
          var top = el.getBoundingClientRect().top;
          el.style.setProperty("--v", clamp((vh * 0.92 - top) / (vh * 0.32), 0, 1).toFixed(3));
        });
      });
    }

    var mastH = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--mast-h")) || 76; };

    // 3) services: the stage pins, each panel zooms in from small to full; the one below recedes
    var zoomTrack = document.querySelector("[data-zoom]");
    if (zoomTrack) {
      zoomTrack.closest("section").classList.add("is-zoom");
      var panels = Array.prototype.slice.call(zoomTrack.querySelectorAll(".zpanel"));
      var zn = panels.length;
      scenes.push(function (vh) {
        var r = zoomTrack.getBoundingClientRect();
        var stageH = vh - mastH();
        var p = clamp(-r.top / Math.max(1, r.height - stageH), 0, 1);
        var pos = p * (zn - 1 + 0.4);
        var zs = panels.map(function (panel, i) {
          // first panel zooms while the section scrolls into view; the others zoom in turn while pinned
          return i === 0 ? clamp((vh - r.top) / (vh * 0.95), 0, 1) : clamp((pos - (i - 0.75)) / 0.6, 0, 1);
        });
        panels.forEach(function (panel, i) {
          var z = zs[i], d = i < zn - 1 ? zs[i + 1] : 0;
          var ez = 1 - Math.pow(1 - z, 3);   // ease-out so the zoom settles softly
          panel.style.setProperty("--z", ez.toFixed(4));
          panel.style.setProperty("--d", d.toFixed(4));
          panel.style.setProperty("--a", (i === 0 ? 1 : clamp(z * 3, 0, 1)).toFixed(3));
          panel.style.setProperty("--c", clamp((z - 0.55) / 0.45, 0, 1).toFixed(3));
          panel.style.zIndex = String(i + 1);
        });
      });
    }

    // 4) process: the stage pins and the row of steps slides sideways along the line
    var hwrap = document.querySelector("[data-htrack]");
    if (hwrap) {
      hwrap.closest("section").classList.add("is-htrack");
      var htrack = hwrap.querySelector(".htrack");
      var hstage = hwrap.querySelector(".htrack-stage");
      var hsteps = Array.prototype.slice.call(htrack.querySelectorAll(".step"));
      var dist = 0;
      var measure = function () {
        dist = Math.max(0, htrack.scrollWidth - hstage.clientWidth);
        hwrap.style.setProperty("--dist", dist + "px");
      };
      measure();
      window.addEventListener("resize", measure);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
      scenes.push(function (vh) {
        var r = hwrap.getBoundingClientRect();
        var stageH = vh - mastH();
        var p = clamp(-r.top / Math.max(1, r.height - stageH), 0, 1);
        htrack.style.setProperty("--tx", (-p * dist).toFixed(1) + "px");
        var center = hstage.getBoundingClientRect().left + hstage.clientWidth * 0.5;
        var trackLeft = htrack.getBoundingClientRect().left;
        htrack.style.setProperty("--lf", Math.max(0, center - trackLeft).toFixed(1) + "px");
        hsteps.forEach(function (step, i) {
          var left = step.getBoundingClientRect().left;
          step.classList.toggle("is-lit", left < center || (i === hsteps.length - 1 && p > 0.98));
        });
      });
    }
  }

  var scenesQueued = false;
  function runScenes() {
    scenesQueued = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    scenes.forEach(function (fn) { fn(vh); });
  }
  function requestScenes() { if (!scenesQueued && scenes.length) { scenesQueued = true; window.requestAnimationFrame(runScenes); } }
  window.addEventListener("scroll", requestScenes, { passive: true });
  window.addEventListener("resize", requestScenes);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(requestScenes);
  requestScenes();

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
