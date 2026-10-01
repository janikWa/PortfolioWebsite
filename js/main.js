(function () {
  "use strict";

  /* ---------- header hairline once the page is scrolled ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty("--scroll-progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", function (evt) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(evt.target) || navToggle.contains(evt.target)) return;
      closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 680) closeNav();
    });
  }

  /* ---------- active nav link on scroll ----------
     Only same-page fragment links (href="#id") participate in scroll-spy;
     cross-page links (e.g. "about.html", "index.html#services") keep
     whatever "active" state is hardcoded in the markup for that page. */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']")) : [];
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".about-content, .project-card, .service-card, .work-card, .tech-tile, .teaser, .contact-card, .section-head, .flow-card, .step"
  );
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
    var siblings = Array.prototype.filter.call(el.parentNode.children, function (s) {
      return s.classList.contains("reveal");
    });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index * 0.09, 0.45) + "s");
  });

  // once revealed, drop the reveal transition so the element's own hover transitions apply
  function finishReveal(evt) {
    if (evt.target !== this || evt.propertyName !== "opacity") return;
    this.classList.remove("reveal", "is-visible");
    this.style.removeProperty("--reveal-delay");
    this.removeEventListener("transitionend", finishReveal);
  }

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.addEventListener("transitionend", finishReveal);
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- cursor spotlight on cards (mouse/trackpad only) ---------- */
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".service-card, .flow-card, .project-card, .work-card:not(.work-card--placeholder)").forEach(function (card) {
      card.classList.add("spotlight");
      card.addEventListener("pointermove", function (evt) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (evt.clientX - rect.left) + "px");
        card.style.setProperty("--my", (evt.clientY - rect.top) + "px");
      });
    });
  }

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- rotating word in the hero headline ----------
     Re-queried each tick because the language toggle replaces the h1's innerHTML. */
  if (!prefersReduced) {
    setInterval(function () {
      var el = document.querySelector(".rotator");
      if (!el) return;
      var words = (el.getAttribute("data-words") || "").split("|");
      if (words.length < 2) return;
      var next = words[(words.indexOf(el.textContent.trim()) + 1) % words.length];
      var from = el.getBoundingClientRect().width;
      el.style.width = from + "px";
      el.classList.add("is-out");

      setTimeout(function () {
        if (!el.isConnected) return;
        el.textContent = next;
        el.style.width = "auto";
        var to = el.getBoundingClientRect().width;
        el.style.width = from + "px";
        el.classList.add("is-in");
        el.classList.remove("is-out");
        void el.offsetWidth;
        el.style.width = to + "px";
        el.classList.remove("is-in");
        setTimeout(function () { if (el.isConnected) el.style.width = ""; }, 500);
      }, 300);
    }, 2800);
  }

  /* ---------- hero glow eases toward the cursor ---------- */
  var hero = document.querySelector(".hero");
  if (hero && finePointer && !prefersReduced) {
    var tx = 0, ty = 0, cx = 0, cy = 0, glowFrame = null;
    var stepGlow = function () {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      hero.style.setProperty("--gx", cx.toFixed(1) + "px");
      hero.style.setProperty("--gy", cy.toFixed(1) + "px");
      glowFrame = (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) ? window.requestAnimationFrame(stepGlow) : null;
    };
    var startGlow = function () { if (!glowFrame) glowFrame = window.requestAnimationFrame(stepGlow); };
    hero.addEventListener("pointermove", function (evt) {
      var rect = hero.getBoundingClientRect();
      tx = (evt.clientX - rect.left - rect.width / 2) * 0.35;
      ty = (evt.clientY - rect.top - rect.height / 2) * 0.35;
      startGlow();
    });
    hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; startGlow(); });
  }

  /* ---------- magnetic CTA buttons ---------- */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll(".hero-cta .btn, .contact-cta .btn").forEach(function (btn) {
      btn.addEventListener("pointermove", function (evt) {
        var rect = btn.getBoundingClientRect();
        var dx = evt.clientX - (rect.left + rect.width / 2);
        var dy = evt.clientY - (rect.top + rect.height / 2);
        btn.classList.add("is-magnet");
        btn.style.translate = (dx * 0.22).toFixed(1) + "px " + (dy * 0.3).toFixed(1) + "px";
      });
      btn.addEventListener("pointerleave", function () {
        btn.classList.remove("is-magnet");
        btn.style.translate = "";
      });
    });
  }

  /* ---------- CV timeline animation ---------- */
  var timeline = document.querySelector(".timeline");
  var timelineItems = timeline ? Array.prototype.slice.call(timeline.querySelectorAll(".timeline-item")) : [];

  // staggered slide-in per item (marker pops in slightly after its card)
  timelineItems.forEach(function (item, i) {
    var delay = Math.min(i * 0.08, 0.5) + "s";
    item.style.setProperty("--reveal-delay", delay);
    item.classList.add("reveal");

    var marker = item.querySelector(".timeline-marker");
    if (marker) {
      marker.style.setProperty("--reveal-delay", delay);
      marker.classList.add("reveal");
    }
  });

  if (timelineItems.length) {
    if ("IntersectionObserver" in window) {
      var itemObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            var marker = entry.target.querySelector(".timeline-marker");
            if (marker) marker.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );
      timelineItems.forEach(function (item) { itemObserver.observe(item); });
    } else {
      timelineItems.forEach(function (item) {
        item.classList.add("is-visible");
        var marker = item.querySelector(".timeline-marker");
        if (marker) marker.classList.add("is-visible");
      });
    }
  }

  // vertical line "draws" downward as the timeline scrolls through the viewport
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (timeline && !reduceMotion) {
    var ticking = false;

    var updateTimelineProgress = function () {
      ticking = false;
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var atPageEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
      var progress = atPageEnd ? 1 : Math.min(1, Math.max(0, (vh * 0.65 - rect.top) / rect.height));
      timeline.style.setProperty("--timeline-progress", progress.toFixed(4));
    };

    var requestTick = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateTimelineProgress);
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    updateTimelineProgress();
  } else if (timeline && reduceMotion) {
    timeline.style.setProperty("--timeline-progress", "1");
  }
})();
