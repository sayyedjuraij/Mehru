/* ══════════════════════════════════════════
   NEXYOS — MAIN
   js/main.js
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── LOADER ── */
  const loader       = document.getElementById('loader');
  const loaderFill   = document.getElementById('loader-fill');
  const loaderPct    = document.getElementById('loader-pct');

  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }, 400);
    }
    loaderFill.style.width = pct + '%';
    loaderPct.textContent  = Math.floor(pct) + '%';
  }, 120);

  document.body.style.overflow = 'hidden';

  /* ── CUSTOM CURSOR ── */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
  });

  // Smooth trail
  function trailLoop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursorTrail.style.left = cx + 'px';
    cursorTrail.style.top  = cy + 'px';
    requestAnimationFrame(trailLoop);
  }
  trailLoop();

  // Cursor scale on interactive elements
  document.querySelectorAll('a, button, [data-tilt], .module-item, .schema-table').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      cursorTrail.style.transform = 'translate(-50%,-50%) scale(1.4)';
      cursorTrail.style.borderColor = 'rgba(0,255,225,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorTrail.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorTrail.style.borderColor = 'rgba(0,255,225,0.4)';
    });
  });

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  /* ── MOBILE BURGER ── */
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav-links');
  const navCta   = document.querySelector('.nav-cta');

  if (burger) {
    burger.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.cssText = open
        ? ''
        : 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:rgba(5,5,15,0.98);padding:2rem;border-top:1px solid rgba(0,255,225,0.12);gap:1.5rem;';
      if (navCta) navCta.style.display = open ? '' : 'block';
    });
  }

  /* ── SMOOTH SCROLL for NAV LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav
        if (navLinks) navLinks.style.cssText = '';
      }
    });
  });

  /* ── ACTIVE NAV HIGHLIGHT ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach((s) => sectionObserver.observe(s));

  /* ── SECTION PARALLAX BACKGROUNDS ── */
  const archSection = document.getElementById('architecture');
  window.addEventListener('scroll', () => {
    if (archSection) {
      const rect = archSection.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      archSection.style.backgroundPositionY = `${progress * 30}px`;
    }
  });

  /* ── RIPPLE EFFECT on BTN CLICK ── */
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        background: rgba(255,255,255,0.25);
        transform: scale(0);
        animation: ripple-anim 0.6s ease;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  /* ── PAGE VISIBILITY ── */
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden
      ? '⚡ Nexyos — Come back!'
      : 'Nexyos — AI Feedback Reimagined';
  });

  console.log(
    '%c NEXYOS ',
    'background:#00ffe1;color:#02020a;font-size:24px;font-weight:bold;padding:8px 16px;border-radius:4px;',
    '\nQR-Based AI Feedback System\nhttps://nexyos.com'
  );

})();
