(function () {
  "use strict";

  /* ---------- contact form backend: the only place the endpoint lives (go-live = change API_URL) ---------- */
  const API_URL = "https://dev.form.janikwahrheit.de/send-mail"; // Prod: https://form.janikwahrheit.de/send-mail
  const CLIENT_ID = "janikwahrheit";

  var root = document.documentElement;
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- current year in the footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- back to top ----------
     #top is the sticky header, which is always in view, so the browser never scrolls to it. */
  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener("click", function (evt) {
      evt.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  });

  /* ---------- iPhone / iPad: draw ↗ as a text arrow, not the emoji ----------
     iOS renders a bare ↗ as an emoji; U+FE0E asks for the text glyph. Only there,
     so desktop keeps its arrow exactly as it is. */
  var iOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (iOS) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (var tn = walker.nextNode(); tn; tn = walker.nextNode()) {
      if (tn.nodeValue.indexOf("\u2197") > -1) tn.nodeValue = tn.nodeValue.replace(/\u2197(?!\uFE0E)/g, "\u2197\uFE0E");
    }
  }

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

  /* ---------- nav: underline the section currently in view ----------
     Links to sections on this page follow the scroll; the link to this page itself
     (Start / Über mich) is active above the first section. Links to other pages never are. */
  if (nav) {
    var pagePath = function (p) { return p.replace(/index\.html$/, ""); };
    var here = pagePath(location.pathname);
    var topLink = null, spots = [];
    nav.querySelectorAll("a").forEach(function (a) {
      var u = new URL(a.getAttribute("href"), location.href);
      if (pagePath(u.pathname) !== here) return;
      if (!u.hash) { topLink = a; return; }
      var target = document.getElementById(u.hash.slice(1));
      if (target) spots.push({ link: a, el: target });
    });
    var spyQueued = false;
    var spy = function () {
      spyQueued = false;
      var vh = window.innerHeight;
      var line = (parseFloat(getComputedStyle(root).getPropertyValue("--mast-h")) || 76) + vh * 0.3;
      var current = topLink, best = -Infinity;
      spots.forEach(function (s) {
        var top = s.el.getBoundingClientRect().top;
        if (top <= line && top > best) { best = top; current = s.link; }
      });
      // at the very bottom the last section may never reach the line
      if (window.scrollY + vh >= document.documentElement.scrollHeight - 2 && spots.length) {
        current = spots.reduce(function (a, b) { return a.el.getBoundingClientRect().top > b.el.getBoundingClientRect().top ? a : b; }).link;
      }
      nav.querySelectorAll("a").forEach(function (a) {
        var on = a === current;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    };
    var requestSpy = function () { if (!spyQueued) { spyQueued = true; window.requestAnimationFrame(spy); } };
    window.addEventListener("scroll", requestSpy, { passive: true });
    window.addEventListener("resize", requestSpy);
    requestSpy();
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
    // shift each card sideways so it always stays on screen (also while hidden, so it never widens the page)
    var place = function (tech) {
      var pop = tech.querySelector(".tech-pop");
      if (!pop) return;
      var vw = document.documentElement.clientWidth, pad = 16;
      var left = tech.getBoundingClientRect().left, w = pop.offsetWidth;
      var shift = Math.min(0, vw - pad - (left + w));   // pull left when it would run off the right edge
      shift = Math.max(shift, pad - left);              // but never past the left edge
      pop.style.setProperty("--px", Math.round(shift) + "px");
    };
    var placeAll = function () { techs.forEach(place); };
    placeAll();
    window.addEventListener("resize", placeAll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeAll);
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

  /* ---------- contact form as a chat ----------
     One question at a time; each answer becomes a bubble that can be tapped to go back and change it.
     Sends JSON to API_URL (only Content-Type header, otherwise the CORS preflight fails). */
  var chat = document.querySelector("[data-chat]");
  if (chat) {
    var T = window.siteT || function (k) { return k; };
    var form = chat.querySelector("[data-chat-form]");
    var log = chat.querySelector("[data-chat-log]");
    var ORDER = ["name", "topic", "message", "contact", "send", "done"];
    var QUESTIONS = { name: "home.chat_q_name", topic: "home.chat_q_topic", message: "home.chat_q_message", contact: "home.chat_q_contact", send: "home.chat_q_send" };
    var current = "name";
    var busy = false;
    var timer = null;

    var stepEl = function (name) { return form.querySelector('[data-step="' + name + '"]'); };
    var field = function (name) { return form.elements[name]; };
    var nameVal = function () { return field("name").value.trim(); };
    var scrollLog = function () { log.scrollTop = log.scrollHeight; };

    log.firstElementChild.setAttribute("data-for", "name");

    function focusStep(name) {
      var el = stepEl(name);
      var target = el && el.querySelector("input:not([type=radio]), textarea, input[type=radio], button");
      if (target) target.focus({ preventScroll: true });
    }

    function showStep(name, focus) {
      current = name;
      Array.prototype.forEach.call(form.querySelectorAll(".chat-step"), function (el) { el.hidden = el.getAttribute("data-step") !== name; });
      if (focus) focusStep(name);
      scrollLog();
    }

    function botSay(text, opts) {
      var p = document.createElement("p");
      p.className = "chat-msg chat-msg--bot" + (opts && opts.tone ? " chat-msg--" + opts.tone : "");
      p.textContent = text;
      if (opts && opts.step) p.setAttribute("data-for", opts.step);
      log.appendChild(p);
      scrollLog();
    }

    // typing dots, then the bot's next line, then the matching input
    function ask(step, opts) {
      Array.prototype.forEach.call(form.querySelectorAll(".chat-step"), function (el) { el.hidden = true; });
      var typing = document.createElement("p");
      typing.className = "chat-typing";
      typing.setAttribute("aria-hidden", "true");
      typing.innerHTML = "<i></i><i></i><i></i>";
      log.appendChild(typing);
      scrollLog();
      clearTimeout(timer);
      timer = setTimeout(function () {
        typing.remove();
        if (QUESTIONS[step]) botSay(T(QUESTIONS[step], { name: nameVal() }), { step: step });
        else if (opts && opts.text) botSay(opts.text, { tone: opts.tone });
        showStep(step, !(opts && opts.noFocus));
      }, prefersReduced ? 0 : 650);
    }

    function userSay(step, text) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chat-msg chat-msg--me";
      b.setAttribute("data-edit", step);
      b.title = T("home.chat_edit");
      var span = document.createElement("span");
      span.textContent = text;
      var sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = " – " + T("home.chat_edit");
      b.appendChild(span);
      b.appendChild(sr);
      log.appendChild(b);
    }

    // go back: drop everything after that step's question and show its input again
    function editStep(step) {
      if (busy) return;
      var q = log.querySelector('[data-for="' + step + '"]');
      if (!q) return;
      clearTimeout(timer);
      while (q.nextSibling) log.removeChild(q.nextSibling);
      showStep(step, true);
    }

    function valid(step) {
      var inputs = stepEl(step).querySelectorAll("input, textarea");
      for (var i = 0; i < inputs.length; i++) {
        var el = inputs[i];
        if (el.type !== "radio" && el.type !== "checkbox") el.value = el.value.trim();
        if (!el.checkValidity()) { el.reportValidity(); return false; }
      }
      return true;
    }

    function answerText(step) {
      if (step === "name") return nameVal();
      if (step === "topic") {
        var checked = form.querySelector('input[name="topic"]:checked');
        return checked ? checked.nextElementSibling.textContent : "";
      }
      if (step === "message") return field("message").value;
      if (step === "contact") return field("email").value + (field("phone").value ? " · " + field("phone").value : "");
      return "";
    }

    function next() {
      if (busy || current === "send" || current === "done") return;
      if (!valid(current)) return;
      userSay(current, answerText(current));
      ask(ORDER[ORDER.indexOf(current) + 1]);
    }

    function setBusy(on) {
      busy = on;
      var btn = form.querySelector("[data-submit]");
      btn.disabled = on;
      btn.setAttribute("aria-busy", String(on));
      btn.querySelector("span").textContent = T(on ? "home.chat_sending" : "home.chat_send");
      Array.prototype.forEach.call(log.querySelectorAll("[data-edit]"), function (b) { b.disabled = on; });
    }

    function send() {
      if (busy) return;
      var topic = form.querySelector('input[name="topic"]:checked');
      var payload = {
        client_id: CLIENT_ID,
        name: nameVal(),
        email: field("email").value.trim(),
        message: "Thema: " + (topic ? topic.value : "") + "\n\n" + field("message").value.trim(),
        website_url: field("website_url").value
      };
      var phone = field("phone").value.trim();
      if (phone) payload.phone = phone;

      var fail = function (key) {
        setBusy(false);
        // drop an earlier error so only the latest one shows
        var last = log.lastElementChild;
        if (last && last.classList.contains("chat-msg--err")) last.remove();
        botSay(T(key), { tone: "err" });
        focusStep("send");
      };

      setBusy(true);
      fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) { return { status: res.status, data: data || {} }; });
        })
        .then(function (r) {
          if (r.status === 200) {
            var name = payload.name;
            setBusy(false);
            Array.prototype.forEach.call(log.querySelectorAll("[data-edit]"), function (b) { b.disabled = true; });
            var last = log.lastElementChild;
            if (last && last.classList.contains("chat-msg--err")) last.remove();
            form.reset();
            botSay(T("home.chat_ok", { name: name }), { tone: "ok" });
            showStep("done", true);
          } else if (r.status === 400 && r.data.detail === "Nachricht enthält zu viele Links") {
            fail("home.chat_err_links");
          } else if (r.status === 400) {
            console.error("Kontaktformular: Konfigurationsfehler", r.data);
            fail("home.chat_err_generic");
          } else if (r.status === 422) {
            console.warn("Kontaktformular: Eingaben abgelehnt", r.data);
            fail("home.chat_err_input");
          } else if (r.status === 429) {
            fail("home.chat_err_rate");
          } else {
            console.error("Kontaktformular: HTTP " + r.status, r.data);
            fail("home.chat_err_network");
          }
        })
        .catch(function (err) {
          console.error("Kontaktformular: Netzwerkfehler", err);
          fail("home.chat_err_network");
        });
    }

    function restart() {
      clearTimeout(timer);
      form.reset();
      while (log.children.length > 1) log.removeChild(log.lastChild);
      showStep("name", true);
    }

    form.addEventListener("click", function (evt) {
      if (evt.target.closest("[data-next]")) next();
      else if (evt.target.closest("[data-restart]")) restart();
    });
    form.addEventListener("change", function (evt) {
      if (evt.target.name === "topic" && current === "topic") next();
    });
    form.addEventListener("keydown", function (evt) {
      if (evt.key !== "Enter" || evt.isComposing) return;
      var t = evt.target;
      if (t.tagName === "TEXTAREA") {
        if (evt.metaKey || evt.ctrlKey) { evt.preventDefault(); next(); }
      } else if (t.tagName === "INPUT" && t.type !== "radio") {
        evt.preventDefault();
        next();
      }
    });
    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      if (current === "send") send(); else next();
    });
    log.addEventListener("click", function (evt) {
      var b = evt.target.closest("[data-edit]");
      if (b && !b.disabled) editStep(b.getAttribute("data-edit"));
    });

    // "Kontakt" links on desktop: land in the chat ready to type (no auto-focus on touch: it would pop the keyboard)
    if (finePointer) {
      document.querySelectorAll('a[href="#contact-form"]').forEach(function (a) {
        a.addEventListener("click", function () {
          setTimeout(function () { focusStep(current); }, prefersReduced ? 0 : 700);
        });
      });
    }
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
