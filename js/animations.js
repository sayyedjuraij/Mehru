/* ══════════════════════════════════════════
   NEXYOS — ANIMATIONS
   js/animations.js
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── QR GRID GENERATOR ── */
  function buildQrGrid(containerId, cols, rows, density) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    const count = cols * rows;
    for (let i = 0; i < count; i++) {
      const cell = document.createElement('div');
      cell.className = 'qr-cell ' + (Math.random() < density ? 'on' : 'off');
      el.appendChild(cell);
    }
    // Animate QR cells periodically
    setInterval(() => {
      const cells = el.querySelectorAll('.qr-cell');
      const idx = Math.floor(Math.random() * cells.length);
      cells[idx].classList.toggle('on');
      cells[idx].classList.toggle('off');
    }, 180);
  }

  function buildMiniQr(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 36; i++) {
      const cell = document.createElement('div');
      cell.className = 'mini-cell ' + (Math.random() > 0.45 ? 'on' : '');
      el.appendChild(cell);
    }
  }

  buildQrGrid('qrGrid', 10, 10, 0.52);
  buildMiniQr('miniQr');

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  /* ── INTERSECTION OBSERVER: COUNTERS ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach((el) => counterObserver.observe(el));

  /* ── INTERSECTION OBSERVER: ARCH LAYERS ── */
  const archObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-layer'), 10) * 120;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        archObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.arch-layer').forEach((el) => archObserver.observe(el));

  /* ── INTERSECTION OBSERVER: MODULE ITEMS ── */
  const moduleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        moduleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.module-item').forEach((el) => moduleObserver.observe(el));

  /* ── INTERSECTION OBSERVER: GENERAL FADE ── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tech-card, .deliv-card, .schema-table').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
  });

  /* ── CONTACT PARTICLES ── */
  function spawnContactParticles() {
    const container = document.getElementById('contactParticles');
    if (!container) return;
    setInterval(() => {
      const p = document.createElement('div');
      p.className = 'contact-particle';
      const left = Math.random() * 100;
      const drift = (Math.random() - 0.5) * 80;
      const dur = 3 + Math.random() * 3;
      p.style.cssText = `
        left: ${left}%;
        bottom: ${Math.random() * 40}px;
        --drift: ${drift}px;
        animation-duration: ${dur}s;
        animation-delay: ${Math.random() * 2}s;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), (dur + 2) * 1000);
    }, 250);
  }

  spawnContactParticles();

  /* ── 3D TILT EFFECT ON TECH CARDS ── */
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      // Move glow
      const glow = card.querySelector('.tech-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,255,225,0.1), transparent 60%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── TYPING EFFECT ON HERO BADGE ── */
  function typeWriter(el, text, speed) {
    el.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, speed);
      }
    }
    setTimeout(type, 800);
  }

  const badge = document.querySelector('.hero-badge');
  if (badge) {
    const text = badge.textContent;
    typeWriter(badge, text, 40);
  }

  /* ── GLITCH EFFECT ON HOVER FOR H2 ── */
  document.querySelectorAll('h2').forEach((h) => {
    h.addEventListener('mouseenter', () => {
      h.style.animation = 'glitch 0.3s ease';
      setTimeout(() => (h.style.animation = ''), 300);
    });
  });

  // Inject glitch keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitch {
      0%   { text-shadow: none; }
      20%  { text-shadow: 3px 0 #ff2f6e, -3px 0 #00ffe1; transform: skewX(2deg); }
      40%  { text-shadow: -3px 0 #7b2fff, 3px 0 #ff2f6e; transform: skewX(-1deg); }
      60%  { text-shadow: 2px 0 #00ffe1, -2px 0 #7b2fff; transform: skewX(0.5deg); }
      80%  { text-shadow: -1px 0 #ff2f6e, 1px 0 #7b2fff; }
      100% { text-shadow: none; transform: skewX(0deg); }
    }
  `;
  document.head.appendChild(style);

  /* ── BAR ANIMATION in DASHBOARD VISUAL ── */
  function animateBars() {
    const bars = document.querySelectorAll('.bar');
    setInterval(() => {
      bars.forEach((b) => {
        const h = 20 + Math.random() * 70;
        b.style.height = h + 'px';
        b.style.transition = 'height 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      });
    }, 1800);
  }
  animateBars();

  /* ── SCROLL PROGRESS LINE ── */
  const progressLine = document.createElement('div');
  progressLine.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, #7b2fff, #00ffe1);
    z-index: 9000; transition: width 0.1s linear;
    box-shadow: 0 0 12px rgba(0,255,225,0.6);
  `;
  document.body.appendChild(progressLine);

  window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressLine.style.width = progress + '%';
  });

})();
