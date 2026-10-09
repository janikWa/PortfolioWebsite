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
    ".browser, .teaser-name, .teaser-photo, .teaser-text, " +
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

  /* ---------- hover blur: a soft blur spot grows under the cursor over big type ----------
     Pointer devices only; on touch the type simply stays sharp. */
  if (finePointer) {
    document.querySelectorAll(".blur-lens").forEach(function (lens) {
      var area = lens.closest("[data-glass-area]");
      if (!area) return;
      var tx = 0, ty = 0, cx = 0, cy = 0, ts = 0, cs = 0, raf = null, placed = false;
      var ease = prefersReduced ? 1 : 0.16;

      var step = function () {
        cx += (tx - cx) * ease; cy += (ty - cy) * ease; cs += (ts - cs) * (prefersReduced ? 1 : 0.12);
        lens.style.setProperty("--lx", cx.toFixed(1) + "px");
        lens.style.setProperty("--ly", cy.toFixed(1) + "px");
        lens.style.setProperty("--ls", cs.toFixed(3));
        var moving = Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3 || Math.abs(ts - cs) > 0.002;
        raf = moving ? window.requestAnimationFrame(step) : null;
      };
      var kick = function () { if (!raf) raf = window.requestAnimationFrame(step); };

      area.addEventListener("pointermove", function (evt) {
        var r = area.getBoundingClientRect();
        tx = evt.clientX - r.left; ty = evt.clientY - r.top;
        if (!placed) { cx = tx; cy = ty; placed = true; }   // appear where the cursor enters, then follow
        ts = 1; kick();
      });
      area.addEventListener("pointerleave", function () { ts = 0; placed = false; kick(); });
    });
  }

  /* ---------- tabbed windows: client sites (browser) and side projects (editor) ---------- */
  function tabs(root, tabSel, onSelect) {
    var list = Array.prototype.slice.call(root.querySelectorAll(tabSel));
    if (!list.length) return;
    root.classList.add("is-tabs");
    var select = function (tab, focus) {
      list.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("is-active", on);
      });
      if (focus) tab.focus();
      onSelect(tab);
    };
    list.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (evt) {
        var d = evt.key === "ArrowRight" || evt.key === "ArrowDown" ? 1 : evt.key === "ArrowLeft" || evt.key === "ArrowUp" ? -1 : 0;
        if (!d) return;
        evt.preventDefault();
        select(list[(i + d + list.length) % list.length], true);
      });
    });
    select(list.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || list[0]);
  }

  var browser = document.querySelector("[data-browser]");
  if (browser) {
    var addr = browser.querySelector("[data-addr]");
    var open = browser.querySelector("[data-open]");
    var caps = Array.prototype.slice.call(document.querySelectorAll(".bcap"));
    if (caps.length) caps[0].parentNode.classList.add("is-tabs");
    tabs(browser, ".browser-tab", function (tab) {
      addr.textContent = tab.getAttribute("data-url") || "about:blank";
      var href = tab.getAttribute("data-href");
      open.hidden = !href;
      if (href) open.href = href;
      caps.forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("data-cap") === tab.id); });
    });
    // the live site only takes the pointer after an explicit click, so page scrolling is never hijacked
    browser.querySelectorAll("[data-shield]").forEach(function (shield) {
      shield.addEventListener("click", function () { shield.closest(".bpanel").classList.add("is-live"); });
    });
  }

  var editor = document.querySelector("[data-editor]");
  if (editor) {
    var tabLabel = editor.querySelector("[data-editor-tab]");
    var langLabel = editor.querySelector("[data-editor-lang]");
    editor.querySelectorAll(".code").forEach(function (code) {
      Array.prototype.forEach.call(code.children, function (li, k) { li.style.setProperty("--li", k); });
    });
    tabs(editor, ".editor-file", function (file) {
      tabLabel.textContent = file.textContent;
      langLabel.textContent = file.getAttribute("data-lang");
    });
  }

  /* ---------- core technologies: detail card on hover (pointer) or tap (touch / keyboard) ---------- */
  var techs = Array.prototype.slice.call(document.querySelectorAll(".tech")).filter(function (t) { return t.querySelector(".tech-pop"); });
  if (techs.length) {
    var place = function (tech) {
      var r = tech.getBoundingClientRect();
      var pop = tech.querySelector(".tech-pop");
      var w = pop ? Math.min(420, pop.scrollWidth || 320) : 320;
      tech.classList.toggle("pop-left", r.left + w > document.documentElement.clientWidth - 16);
    };
    var closeAll = function (except) {
      techs.forEach(function (t) {
        if (t === except) return;
        t.classList.remove("is-open");
        t.querySelector(".tech-btn").setAttribute("aria-expanded", "false");
      });
    };
    techs.forEach(function (tech) {
      var btn = tech.querySelector(".tech-btn");
      tech.addEventListener("pointerenter", function () { place(tech); });
      btn.addEventListener("focus", function () { place(tech); });
      btn.addEventListener("click", function () {
        var open = !tech.classList.contains("is-open");
        closeAll(tech);
        place(tech);
        tech.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });
    document.addEventListener("click", function (evt) { if (!evt.target.closest(".tech")) closeAll(null); });
    document.addEventListener("keydown", function (evt) { if (evt.key === "Escape") closeAll(null); });
  }

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
