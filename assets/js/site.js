/* VELTRA — interactions */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || reduce) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObs.observe(el); });

    /* Safety net: fast or programmatic scrolling should never leave content hidden */
    var sweepQueued = false;
    function sweep() {
      if (sweepQueued) return;
      sweepQueued = true;
      requestAnimationFrame(function () {
        sweepQueued = false;
        revealEls.forEach(function (el) {
          if (el.classList.contains("is-in")) return;
          var top = el.getBoundingClientRect().top;
          if (top < window.innerHeight * 0.94) {
            el.classList.add("is-in");
            revealObs.unobserve(el);
          }
        });
      });
    }
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep, { passive: true });
    window.addEventListener("load", sweep);
    sweep();
  }

  /* Number counters + stat bars */
  function formatCount(value, decimals) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    if (reduce) { el.textContent = formatCount(target, decimals) + suffix; return; }
    var start = performance.now();
    var duration = 1500;
    function tick(now) {
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatCount(target, decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  var stats = document.querySelectorAll(".stat");
  if (!("IntersectionObserver" in window)) {
    stats.forEach(function (s) {
      s.classList.add("is-in");
      s.querySelectorAll("[data-count]").forEach(runCounter);
    });
  } else {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var stat = entry.target;
        stat.classList.add("is-in");
        stat.querySelectorAll("[data-count]").forEach(runCounter);
        statObs.unobserve(stat);
      });
    }, { threshold: 0.35 });
    stats.forEach(function (s) { statObs.observe(s); });
  }

  /* Enquiry form (demo only) */
  var form = document.getElementById("enquiryForm");
  var success = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add("is-hidden");
      if (success) {
        success.classList.add("is-visible");
        success.focus({ preventScroll: true });
        success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
    });
    var resetBtn = document.getElementById("formReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        form.classList.remove("is-hidden");
        if (success) success.classList.remove("is-visible");
        var first = form.querySelector("input");
        if (first) first.focus();
      });
    }
  }

  /* Newsletter (demo only) */
  var news = document.getElementById("newsForm");
  if (news) {
    news.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!news.checkValidity()) { news.reportValidity(); return; }
      var note = document.getElementById("newsNote");
      if (note) {
        note.textContent = "You're on the list. Demo only — nothing was sent.";
        note.style.color = "var(--lime)";
      }
      news.reset();
    });
  }

  /* Small hero pointer tilt on the live card */
  var card = document.querySelector(".hero-card");
  if (card && !reduce && window.matchMedia("(hover: hover)").matches) {
    var hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "perspective(900px) rotateY(" + (x * 5) + "deg) rotateX(" + (-y * 5) + "deg)";
    });
    hero.addEventListener("pointerleave", function () { card.style.transform = ""; });
  }
})();
