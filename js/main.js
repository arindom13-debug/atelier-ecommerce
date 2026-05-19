(function () {
  'use strict';

  const header      = document.getElementById('header');
  const announcement = document.getElementById('announcement');
  const closeBtn    = document.getElementById('announcement-close');
  const menuToggle  = document.getElementById('menu-toggle');
  const mobileNav   = document.getElementById('mobile-nav');

  /* ── Header top offset ───────────────────────────────────────
     Keeps the header flush below the announcement bar.
     Called on init, on bar dismiss, and on resize.
  ──────────────────────────────────────────────────────────── */
  function syncHeaderTop() {
    if (!header) return;
    const barH = (announcement && !announcement.classList.contains('is-dismissed'))
      ? announcement.offsetHeight
      : 0;
    header.style.top = barH + 'px';
  }

  /* ── Scroll: transparent → warm-white ───────────────────────
     Threshold of 20px so it triggers immediately on first scroll.
  ──────────────────────────────────────────────────────────── */
  let rafPending = false;

  function handleScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      if (header) {
        header.classList.toggle('is-scrolled', window.scrollY > 20);
      }
      rafPending = false;
    });
  }

  /* ── Announcement bar dismiss ────────────────────────────── */
  if (closeBtn && announcement) {
    closeBtn.addEventListener('click', function () {
      announcement.classList.add('is-dismissed');
      // Wait for CSS transition (350ms) then snap header to top
      setTimeout(syncHeaderTop, 360);
    });
  }

  /* ── Mobile nav toggle ───────────────────────────────────── */
  if (menuToggle && mobileNav && header) {
    menuToggle.addEventListener('click', function () {
      const isOpen = header.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

      if (isOpen) {
        mobileNav.removeAttribute('hidden');
      } else {
        mobileNav.setAttribute('hidden', '');
      }
    });

    // Close nav when a link is tapped
    mobileNav.querySelectorAll('.header__mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('menu-open');
        mobileNav.setAttribute('hidden', '');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (header.classList.contains('menu-open') && !header.contains(e.target)) {
        header.classList.remove('menu-open');
        mobileNav.setAttribute('hidden', '');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
      }
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', syncHeaderTop, { passive: true });

  syncHeaderTop();
  handleScroll(); // Apply is-scrolled immediately if page reloads mid-scroll
})();

/* ── Generic staggered scroll reveal ────────────────────────
   Used by both Collections and the Atelier Selection.
   Observes `sectionSel`; when it enters the viewport, adds
   `.is-visible` to each `cardSel` child with `staggerMs` delay.
─────────────────────────────────────────────────────────────── */
function revealOnScroll(sectionSel, cardSel, staggerMs) {
  var section = document.querySelector(sectionSel);
  if (!section) return;

  var cards = section.querySelectorAll(cardSel);

  if (!('IntersectionObserver' in window)) {
    cards.forEach(function (c) { c.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    cards.forEach(function (card, i) {
      setTimeout(function () { card.classList.add('is-visible'); }, i * staggerMs);
    });
    observer.disconnect();
  }, { threshold: 0.08 });

  observer.observe(section);
}

/* ── Collections: 3 tiles, 90 ms stagger ───────────────────── */
revealOnScroll('.collections', '.collection-tile', 90);

/* ── Atelier Selection: 8 cards, 50 ms stagger ─────────────── */
revealOnScroll('.selection', '.product-card', 50);

/* ── Heritage & Craft: each block reveals img + text together ── */
document.querySelectorAll('.craft__block').forEach(function (block) {
  if (!('IntersectionObserver' in window)) {
    block.querySelectorAll('.craft__img-col, .craft__text-col').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    block.querySelectorAll('.craft__img-col, .craft__text-col').forEach(function (el) {
      el.classList.add('is-visible');
    });
    observer.disconnect();
  }, { threshold: 0.12 });
  observer.observe(block);
});

/* ── Voices: 3 quotes, 80 ms stagger ───────────────────────── */
revealOnScroll('.voices', '.voice', 80);

/* ── Invitation: single block, gentle fade-rise ─────────────── */
revealOnScroll('.invitation', '.invitation__inner', 0);
