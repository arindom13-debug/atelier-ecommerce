(function () {
  'use strict';

  const header       = document.getElementById('header');
  const utilityStrip = document.getElementById('utility-strip');
  const menuToggle   = document.getElementById('menu-toggle');
  const mobileNav    = document.getElementById('mobile-nav');

  /* ── Header top offset ───────────────────────────────────────
     Keeps the header flush below the utility strip.
     Called on init, on strip hide/show, and on resize.
  ──────────────────────────────────────────────────────────── */
  function syncHeaderTop() {
    if (!header) return;
    const stripVisible = utilityStrip &&
      !utilityStrip.classList.contains('is-hidden');
    header.style.top = stripVisible
      ? (utilityStrip.offsetHeight || 32) + 'px'
      : '0px';
  }

  /* ── Scroll: transparent → warm-white + strip hide ──────────
     is-scrolled threshold: 20px (fires immediately on first scroll)
     strip hides after 80px of scroll
  ──────────────────────────────────────────────────────────── */
  let rafPending = false;

  function handleScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      const y = window.scrollY;

      if (header) {
        header.classList.toggle('is-scrolled', y > 20);
      }

      if (utilityStrip) {
        const shouldHide = y > 80;
        const isHidden   = utilityStrip.classList.contains('is-hidden');
        if (shouldHide !== isHidden) {
          utilityStrip.classList.toggle('is-hidden', shouldHide);
          // Re-sync header after CSS transition (300ms + small buffer)
          setTimeout(syncHeaderTop, 320);
        }
      }

      rafPending = false;
    });
  }

  /* ── Rotating messages ───────────────────────────────────── */
  var msgs   = utilityStrip
    ? Array.from(utilityStrip.querySelectorAll('.utility-strip__msg'))
    : [];
  var msgIdx = 0;

  if (msgs.length > 1) {
    setInterval(function () {
      msgs[msgIdx].classList.remove('is-active');
      msgIdx = (msgIdx + 1) % msgs.length;
      msgs[msgIdx].classList.add('is-active');
    }, 4200);
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

/* ── Featured Story: image fades first, content rises after ─── */
(function () {
  var section = document.querySelector('.feature-story');
  if (!section) return;

  function observeEl(el, threshold) {
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      el.classList.add('is-visible');
      obs.disconnect();
    }, { threshold: threshold || 0.08 }).observe(el);
  }

  var imgWrap = section.querySelector('.feature-story__img-wrap');
  var content = section.querySelector('.feature-story__content');
  if (imgWrap) observeEl(imgWrap, 0.05);
  if (content) observeEl(content, 0.12);
})();

/* ── In the Atelier: media fades, content rises after ──────── */
(function () {
  var section = document.querySelector('.in-atelier');
  if (!section) return;

  function observeEl(el, threshold) {
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      el.classList.add('is-visible');
      obs.disconnect();
    }, { threshold: threshold || 0.08 }).observe(el);
  }

  var media   = section.querySelector('.in-atelier__media');
  var content = section.querySelector('.in-atelier__content');
  if (media)   observeEl(media, 0.05);
  if (content) observeEl(content, 0.12);
})();

/* ── Worn By: 3 portraits, 90 ms stagger ───────────────────── */
revealOnScroll('.worn-by', '.worn-by__item', 90);

/* ── Atelier Selection: 8 cards, 50 ms stagger ─────────────── */
revealOnScroll('.selection', '.product-card', 50);

/* ── Selection filter pills — active state toggle ──────────── */
(function () {
  var filters = document.querySelectorAll('.selection__filter');
  if (!filters.length) return;

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (f) {
        f.classList.remove('is-active');
        f.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
    });
  });
})();

/* ── Maker's Mark: 4 pillars, 80 ms stagger ────────────────── */
revealOnScroll('.makers-mark', '.makers-mark__pillar', 80);

/* ── Journal Preview: 3 cards, 80 ms stagger ───────────────── */
revealOnScroll('.journal', '.journal-card', 80);

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

/* ── Service & Promise: 4 pillars, 90 ms stagger ───────────── */
revealOnScroll('.promise', '.promise__pillar', 90);

/* ── Lived-In Gallery: 6 items, 60 ms stagger ──────────────── */
revealOnScroll('.gallery', '.gallery__item', 60);

/* ── Invitation: single block, gentle fade-rise ─────────────── */
revealOnScroll('.invitation', '.invitation__inner', 0);
