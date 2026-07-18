/* ============================================================
   Jay's Alaska Adventure — Enhancement Pack (JS)
   Additive only. Reads the DOM after your existing script.js
   has rendered stats/cards from data.js — does not replace it.
   Include this AFTER script.js in index.html.
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---------- 1. Sticky "Day X of 8" progress bar ---------- */
  function initProgressBar() {
    var totalDaysEl = document.querySelector(".hero-bottom div strong");
    var totalDays = totalDaysEl ? parseInt(totalDaysEl.textContent, 10) : 8;
    if (!totalDays) totalDays = 8;

    var bar = document.createElement("div");
    bar.id = "trip-progress-bar";
    bar.innerHTML =
      '<span class="tpb-label" id="tpb-day-label">Day — of ' + totalDays + '</span>' +
      '<span class="tpb-track"><span class="tpb-fill" id="tpb-fill"></span></span>';
    document.body.prepend(bar);
    document.body.classList.add("has-progress-bar");

    function currentDay() {
      var el = document.getElementById("days-complete");
      var n = el ? parseInt(el.textContent, 10) : NaN;
      return isNaN(n) ? 0 : n;
    }

    function update() {
      var day = currentDay();
      var pct = Math.max(0, Math.min(100, (day / totalDays) * 100));
      document.getElementById("tpb-day-label").textContent =
        "Day " + day + " of " + totalDays;
      document.getElementById("tpb-fill").style.width = pct + "%";
    }

    update();
    // Re-check in case script.js populates stats slightly after us
    setTimeout(update, 300);
    setTimeout(update, 1200);

    window.addEventListener("scroll", function () {
      var show = window.scrollY > window.innerHeight * 0.45;
      bar.classList.toggle("is-visible", show);
    }, { passive: true });
  }

  /* ---------- 2. Count-up animation for the stat numbers ---------- */
  function animateCountUp(el, duration) {
    if (!el || reduceMotion) return;
    var raw = el.textContent.trim();
    var match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    var target = parseInt(match[1], 10);
    var suffix = match[2] || "";
    if (!target) { return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
        el.classList.add("tpb-counted");
        setTimeout(function () { el.classList.remove("tpb-counted"); }, 400);
      }
    }
    requestAnimationFrame(step);
  }

  function initCountUp() {
    var ids = [
      "progress-percent", "days-complete", "ports-complete",
      "photos-count", "wildlife-count", "videos-count", "miles-count"
    ];
    var dashboard = document.querySelector(".hero-dashboard");
    if (!dashboard) return;

    var fired = false;
    function trigger() {
      if (fired) return;
      fired = true;
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) animateCountUp(el, 1100);
      });
    }

    if (reduceMotion) return; // leave real numbers as-is
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) trigger();
      });
    }, { threshold: 0.4 });
    observer.observe(dashboard);
    // Dashboard is above the fold on load for most viewports
    setTimeout(trigger, 900);
  }

  /* ---------- 3. Ship marker glides between visited ports ---------- */
  var STOPS = [
    { day: 0, x: 118, y: 538 }, // Seattle
    { day: 3, x: 325, y: 360 }, // Ketchikan
    { day: 4, x: 455, y: 248 }, // Sitka
    { day: 5, x: 580, y: 190 }, // Dawes Glacier
    { day: 6, x: 700, y: 108 }  // Prince Rupert
  ];
  var SHIP_OFFSET_X = -18; // matches original marker's offset from its stop
  var SHIP_OFFSET_Y = -18;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function shipPositionForDay(day) {
    if (day <= STOPS[0].day) return STOPS[0];
    for (var i = 0; i < STOPS.length - 1; i++) {
      var a = STOPS[i], b = STOPS[i + 1];
      if (day >= a.day && day <= b.day) {
        var t = b.day === a.day ? 0 : (day - a.day) / (b.day - a.day);
        return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
      }
    }
    return STOPS[STOPS.length - 1];
  }

  function initShipMarker() {
    var text = document.querySelector("#ship-marker text");
    if (!text) return;

    var currentX = parseFloat(text.getAttribute("x")) || 100;
    var currentY = parseFloat(text.getAttribute("y")) || 520;

    function moveTo(targetX, targetY) {
      if (reduceMotion) {
        text.setAttribute("x", targetX);
        text.setAttribute("y", targetY);
        return;
      }
      var startX = currentX, startY = currentY;
      var start = null, duration = 1400;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        text.setAttribute("x", lerp(startX, targetX, eased));
        text.setAttribute("y", lerp(startY, targetY, eased));
        if (progress < 1) requestAnimationFrame(step);
        else { currentX = targetX; currentY = targetY; }
      }
      requestAnimationFrame(step);
    }

    function update() {
      var el = document.getElementById("days-complete");
      var day = el ? parseInt(el.textContent, 10) : 0;
      if (isNaN(day)) day = 0;
      var pos = shipPositionForDay(day);
      moveTo(pos.x + SHIP_OFFSET_X, pos.y + SHIP_OFFSET_Y);
    }

    setTimeout(update, 400);
  }

  /* ---------- 4. Gallery lightbox wiring (safe, non-destructive) ---------- */
  function initGalleryLightbox() {
    var grid = document.getElementById("gallery-grid");
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightbox-image");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var closeBtn = document.getElementById("lightbox-close");
    if (!grid || !lightbox || !lightboxImg) return;

    function openFor(img, captionText) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || captionText || "";
      if (lightboxCaption) lightboxCaption.textContent = captionText || "";
      lightbox.style.display = "flex";
      lightbox.setAttribute("aria-hidden", "false");
    }
    function close() {
      lightbox.style.display = "none";
      lightbox.setAttribute("aria-hidden", "true");
    }

    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".gallery-card");
      if (!card) return;
      var img = card.querySelector("img");
      if (!img) return; // still a placeholder art block, nothing to open yet
      var captionEl = card.querySelector(".gallery-caption strong");
      openFor(img, captionEl ? captionEl.textContent : "");
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- 5. Scroll-reveal for journal / gallery / wildlife cards ---------- */
  function initScrollReveal() {
    if (reduceMotion) return;
    var containers = ["journal-grid", "gallery-grid", "wildlife-grid"]
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!containers.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("tpb-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    function watch(el) {
      if (el.classList.contains("tpb-reveal")) return;
      el.classList.add("tpb-reveal");
      observer.observe(el);
    }

    containers.forEach(function (container) {
      Array.prototype.forEach.call(container.children, watch);
      new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) watch(node);
          });
        });
      }).observe(container, { childList: true });
    });
  }

  ready(function () {
    initProgressBar();
    initCountUp();
    initShipMarker();
    initGalleryLightbox();
    initScrollReveal();
  });
})();
