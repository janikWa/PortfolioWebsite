(function () {
  "use strict";

  /* ---------- header hairline once the page is scrolled ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
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
    ".about-content, .project-card, .service-card, .work-card, .tech-tile, .teaser, .contact-card, .section-head"
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
      var total = rect.height + vh * 0.5;
      var scrolled = vh * 0.9 - rect.top;
      var progress = Math.min(1, Math.max(0, scrolled / total));
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
