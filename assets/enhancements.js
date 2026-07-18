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

  // "days-complete" is the site's own current trip-day index — the same
  // value script.js uses for the timeline's "current" marker, ports-complete,
  // and the ship position. Mirror it exactly; don't adjust it here. If the
  // auto-calculated day is ever off, fix it at the source with
  // `currentDayOverride` in data.js (per the README), not in this file.
  function getCurrentTripDay(totalDays) {
    var el = document.getElementById("days-complete");
    var day = el ? parseInt(el.textContent, 10) : NaN;
    if (isNaN(day)) day = 0;
    if (totalDays) day = Math.min(day, totalDays);
    return day;
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

    function update() {
      var day = getCurrentTripDay(totalDays);
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

  ready(function () {
    initProgressBar();
    initCountUp();
  });
})();
