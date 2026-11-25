/* VELTRA — shared header, footer and navigation */
(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "";
  var headerMount = document.getElementById("site-header");
  var footerMount = document.getElementById("site-footer");

  var links = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "about", label: "About", href: "about.html" },
    { id: "solutions", label: "Solutions", href: "solutions.html" },
    { id: "projects", label: "Projects", href: "index.html#projects" },
    { id: "contact", label: "Contact", href: "contact.html" }
  ];

  function icon(id, cls) {
    return '<svg class="icon ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + id + '"></use></svg>';
  }

  var navLinks = links.map(function (l) {
    var active = l.id === page;
    return '<li><a href="' + l.href + '"' + (active ? ' aria-current="page"' : "") + '>' + l.label + '</a></li>';
  }).join("");

  if (headerMount) {
    headerMount.innerHTML = [
      '<header class="site-header" id="siteHeader">',
      '  <div class="header-progress" aria-hidden="true"><span id="scrollProgress"></span></div>',
      '  <div class="container header-inner">',
      '    <a class="brand" href="index.html" aria-label="Veltra home">',
      '      <span class="brand-mark" aria-hidden="true">',
      '        <svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5 12 20l8-14.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 5.5h7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
      '      </span>',
      '      <span class="brand-text">',
      '        <span class="brand-name">VELTRA</span>',
      '        <span class="brand-sub">Clean energy</span>',
      '      </span>',
      '    </a>',
      '    <nav class="site-nav" aria-label="Primary">',
      '      <button class="menu-button" type="button" popovertarget="site-menu" popovertargetaction="toggle" aria-controls="site-menu">',
      '        <span>Menu</span>',
      '        ' + icon("menu", "icon--sm"),
      '      </button>',
      '      <ul class="site-menu" id="site-menu" popover="auto">',
      '        ' + navLinks,
      '        <li><a class="menu-cta" href="contact.html">Start a project ' + icon("arrow-up-right", "icon--sm") + '</a></li>',
      '      </ul>',
      '    </nav>',
      '    <div class="header-actions">',
      '      <a class="header-phone" href="mailto:hello@veltra.energy">' + icon("mail", "icon--sm") + ' hello@veltra.energy</a>',
      '      <a class="btn btn--lime btn--sm" href="contact.html">Start a project ' + icon("arrow-up-right", "icon--sm") + '</a>',
      '    </div>',
      '  </div>',
      '</header>'
    ].join("\n");

    var header = document.getElementById("siteHeader");
    var inner = header.querySelector(".header-inner");
    var menu = document.getElementById("site-menu");
    var progress = document.getElementById("scrollProgress");

    function setCollapsed(collapsed) {
      var wasOpen = false;
      try { wasOpen = menu.matches(":popover-open"); } catch (err) { wasOpen = false; }
      if (wasOpen) menu.hidePopover();
      if (collapsed) {
        menu.setAttribute("popover", "auto");
      } else {
        menu.removeAttribute("popover");
      }
      header.classList.toggle("is-wide", !collapsed);
      if (wasOpen && collapsed) menu.showPopover();
    }

    function measure() {
      var wasOpen = false;
      try { wasOpen = menu.matches(":popover-open"); } catch (err) { wasOpen = false; }
      if (wasOpen) menu.hidePopover();
      menu.removeAttribute("popover");
      header.classList.add("is-wide", "is-measuring");
      var fits = inner.scrollWidth <= inner.clientWidth + 1;
      header.classList.remove("is-measuring");
      if (fits) {
        header.classList.add("is-wide");
        if (wasOpen) menu.showPopover();
      } else {
        header.classList.remove("is-wide");
        menu.setAttribute("popover", "auto");
        if (wasOpen) menu.showPopover();
      }
    }

    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(measure);
      ro.observe(inner);
      ro.observe(menu);
    }
    window.addEventListener("resize", measure, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a") && menu.matches(":popover-open")) menu.hidePopover();
    });

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY || document.documentElement.scrollTop;
        header.classList.toggle("is-scrolled", y > 24);
        if (progress) {
          var max = document.documentElement.scrollHeight - window.innerHeight;
          progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + "%";
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (footerMount) {
    footerMount.innerHTML = [
      '<footer class="site-footer">',
      '  <div class="container">',
      '    <div class="footer-top">',
      '      <div>',
      '        <a class="brand" href="index.html" aria-label="Veltra home">',
      '          <span class="brand-mark" aria-hidden="true">',
      '            <svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5 12 20l8-14.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 5.5h7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
      '          </span>',
      '          <span class="brand-text"><span class="brand-name">VELTRA</span><span class="brand-sub">Clean energy</span></span>',
      '        </a>',
      '        <p class="footer-statement">Power that moves. <em>Progress that lasts.</em></p>',
      '      </div>',
      '      <div class="footer-news">',
      '        <h4 class="eyebrow eyebrow--light" style="color:var(--lime)">The grid letter</h4>',
      '        <p style="margin-top:.8rem">One short read a month on the projects, people and technology moving clean energy forward.</p>',
      '        <form class="news-form" id="newsForm">',
      '          <label class="sr-only" for="newsEmail">Email address</label>',
      '          <input id="newsEmail" name="email" type="email" placeholder="you@company.com" required>',
      '          <button class="btn btn--lime btn--sm" type="submit">Subscribe</button>',
      '        </form>',
      '        <p class="news-note" id="newsNote">Demo only. No emails will be sent.</p>',
      '      </div>',
      '    </div>',
      '    <div class="footer-cols">',
      '      <div class="footer-col">',
      '        <h4>Company</h4>',
      '        <ul>',
      '          <li><a href="about.html">About Veltra</a></li>',
      '          <li><a href="about.html#values">Our values</a></li>',
      '          <li><a href="about.html#journey">Our journey</a></li>',
      '          <li><a href="contact.html">Careers</a></li>',
      '        </ul>',
      '      </div>',
      '      <div class="footer-col">',
      '        <h4>Solutions</h4>',
      '        <ul>',
      '          <li><a href="solutions.html#renewable">Renewable energy</a></li>',
      '          <li><a href="solutions.html#hydrogen">Green hydrogen</a></li>',
      '          <li><a href="solutions.html#mobility">Green mobility</a></li>',
      '          <li><a href="solutions.html#process">How we deliver</a></li>',
      '        </ul>',
      '      </div>',
      '      <div class="footer-col">',
      '        <h4>Explore</h4>',
      '        <ul>',
      '          <li><a href="index.html#projects">Projects</a></li>',
      '          <li><a href="index.html#insights">Insights</a></li>',
      '          <li><a href="index.html#about">Who we are</a></li>',
      '          <li><a href="contact.html">Contact</a></li>',
      '        </ul>',
      '      </div>',
      '      <div class="footer-col">',
      '        <h4>Head office</h4>',
      '        <address>Level 9, Tower B, Cyber Green<br>DLF Cyber City, Sector 24<br>Gurugram, Haryana 122002<br><br><a href="mailto:hello@veltra.energy">hello@veltra.energy</a><br><a href="tel:+911244802200">+91 124 480 2200</a></address>',
      '      </div>',
      '    </div>',
      '    <div class="footer-bottom">',
      '      <span>&copy; <span id="year">2026</span> Veltra Clean Energy. Demo concept — a fictional brand.</span>',
      '      <div class="footer-social">',
      '        <a href="https://www.linkedin.com" target="_blank" rel="noopener" aria-label="Veltra on LinkedIn">' + icon("linkedin", "icon--sm") + '</a>',
      '        <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Veltra on Instagram">' + icon("instagram", "icon--sm") + '</a>',
      '        <a href="https://x.com" target="_blank" rel="noopener" aria-label="Veltra on X">' + icon("x", "icon--sm") + '</a>',
      '      </div>',
      '      <div class="footer-legal"><a href="index.html">Home</a><a href="contact.html">Contact</a></div>',
      '    </div>',
      '    <div class="footer-word" aria-hidden="true">VELTRA</div>',
      '  </div>',
      '</footer>'
    ].join("\n");

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }
})();
