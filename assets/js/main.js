/* PRO24 CONTRACTING — shared site behavior */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".nav-burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-l, .reveal-r");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          var el = e.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var dur = 1600;
          if (reduceMotion) { el.textContent = target + suffix; return; }
          var start = null;
          function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Card spotlight + tilt ---------- */
  var fine = window.matchMedia("(pointer: fine)").matches;
  if (fine && !reduceMotion) {
    document.querySelectorAll(".svc-card").forEach(function (card) {
      card.addEventListener("pointermove", function (ev) {
        var r = card.getBoundingClientRect();
        var x = ev.clientX - r.left;
        var y = ev.clientY - r.top;
        card.style.setProperty("--mx", (x / r.width) * 100 + "%");
        card.style.setProperty("--my", (y / r.height) * 100 + "%");
        var rx = ((y / r.height) - 0.5) * -5;
        var ry = ((x / r.width) - 0.5) * 5;
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Lightbox gallery ---------- */
  var photoCards = Array.prototype.slice.call(document.querySelectorAll(".photo-card"));
  var lightbox = document.querySelector(".lightbox");
  if (photoCards.length && lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lb-caption");
    var idx = 0;
    function show(i) {
      idx = (i + photoCards.length) % photoCards.length;
      var img = photoCards[idx].querySelector("img");
      var cap = photoCards[idx].querySelector("figcaption");
      lbImg.src = img.getAttribute("data-full") || img.src;
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = cap ? cap.textContent : "";
    }
    function openLb(i) {
      show(i);
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeLb() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    photoCards.forEach(function (card, i) {
      card.addEventListener("click", function () { openLb(i); });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
    lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Before / After slider ---------- */
  document.querySelectorAll(".ba-wrap").forEach(function (wrap) {
    function setPos(clientX) {
      var r = wrap.getBoundingClientRect();
      var p = Math.min(Math.max((clientX - r.left) / r.width, 0.03), 0.97);
      wrap.style.setProperty("--ba", p * 100 + "%");
    }
    wrap.addEventListener("pointerdown", function (e) {
      wrap.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    wrap.addEventListener("pointermove", function (e) {
      if (e.buttons > 0) setPos(e.clientX);
    });
  });

  /* ---------- Marquee: duplicate track for seamless loop ---------- */
  document.querySelectorAll(".marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Call bar: appears after scrolling past the hero ---------- */
  var callbar = document.querySelector(".callbar");
  if (callbar) {
    var heroEl = document.querySelector(".hero, .page-hero");
    var updateBar = function () {
      var threshold = heroEl ? heroEl.offsetHeight - 80 : 0;
      callbar.classList.toggle("cb-on", window.scrollY > threshold);
    };
    window.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar, { passive: true });
    updateBar();
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
