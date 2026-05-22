/* =====================================================
   ATELIER — Product Detail Page (PDP) controller
   Renders the full PDP from central product data and
   wires gallery lightbox, sticky panel selectors,
   accordions, reviews, related products, size guide,
   and Add-to-Bag → cart integration.
   Depends on: products.js (data), interactions.js (cart API)
   ===================================================== */
(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────── */

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getSlug() {
    var p = new URLSearchParams(location.search).get('slug');
    if (p) return p;
    var parts = location.pathname.split('/').filter(Boolean);
    var last = parts[parts.length - 1];
    if (last && last !== 'product.html' && last !== 'products') return last;
    return null;
  }

  // Thin star — filled (earned) or outline. `n` of 5 filled.
  function stars(rating, sizeClass) {
    var out = '', full = Math.round(rating);
    for (var i = 0; i < 5; i++) {
      var on = i < full;
      out += '<svg class="pdp-star ' + (sizeClass || '') + '" viewBox="0 0 24 24" ' +
        'fill="' + (on ? 'currentColor' : 'none') + '" stroke="currentColor" ' +
        'stroke-width="1.2" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5L12 16.9 5.5 20l1.5-6.5-5-4.4 6.6-.6z"/></svg>';
    }
    return out;
  }

  var product = window.getProductBySlug ? window.getProductBySlug(getSlug()) : null;
  var mainEl = document.getElementById('pdp-main');

  if (!product) {
    if (mainEl) {
      mainEl.className = '';
      mainEl.innerHTML = '<p class="pdp-error">We couldn’t find that piece. ' +
        '<a href="/#shop">Return to the selection &rarr;</a></p>';
    }
    return;
  }

  var collection = window.getCollectionBySlug(product.collection);
  document.title = 'Atelier — ' + product.name;

  // Maps product slug → existing homepage image CSS class (for cart thumb)
  var IMG_CLASS = {
    'kantha-wrap-jacket':     'product-img--kantha',
    'linen-drawstring-shirt': 'product-img--linen-shirt',
    'jamdani-muslin-kurta':   'product-img--muslin-kurta',
    'washed-linen-trouser':   'product-img--linen-trouser',
    'block-print-dupatta':    'product-img--dupatta',
    'heritage-cotton-tunic':  'product-img--tunic',
    'embroidered-lawn-blouse':'product-img--lawn',
    'pleated-muslin-dress':   'product-img--muslin-dress'
  };

  // Unique image list for the gallery
  var imgs = [product.images.primary, product.images.secondary, product.images.detail]
    .filter(Boolean)
    .filter(function (u, i, arr) { return arr.indexOf(u) === i; });


  /* ── 1. Breadcrumb ────────────────────────────────── */

  document.getElementById('pdp-crumb').innerHTML =
    '<a href="/">Home</a>' +
    '<span class="pdp-crumb__sep">/</span>' +
    '<a href="/#collections">Collections</a>' +
    '<span class="pdp-crumb__sep">/</span>' +
    (collection
      ? '<a href="/collections/' + esc(collection.slug) + '">' + esc(collection.name) + '</a>'
      : '<span>Collection</span>') +
    '<span class="pdp-crumb__sep">/</span>' +
    '<span class="pdp-crumb__current">' + esc(product.name) + '</span>';


  /* ── 2 + 3. Gallery + Info Panel ──────────────────── */

  var galleryItems = imgs.map(function (src, i) {
    return '<figure class="pdp-gallery__item" data-index="' + i + '" role="button" tabindex="0" ' +
      'aria-label="View image ' + (i + 1) + ' full screen">' +
      '<img src="' + esc(src) + '" alt="' + esc(product.name) + ' — view ' + (i + 1) + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '">' +
      '</figure>';
  }).join('');

  var dots = imgs.map(function (_, i) {
    return '<button class="pdp-gallery__dot' + (i === 0 ? ' is-active' : '') + '" data-dot="' + i + '" aria-label="Go to image ' + (i + 1) + '"></button>';
  }).join('');

  var pill = product.isNew ? 'New' : (product.isLimited ? 'Limited' : '');

  var swatches = product.colors.map(function (c, i) {
    return '<button class="pdp-swatch" style="background:' + esc(c.hex) + '" ' +
      'data-color="' + esc(c.label) + '" title="' + esc(c.label) + '" ' +
      'aria-label="Colour: ' + esc(c.label) + '" aria-pressed="false"></button>';
  }).join('');

  var sizeBtns = product.sizes.map(function (s) {
    var cls = 'pdp-size' + (s.available ? '' : ' is-out');
    return '<button class="' + cls + '" data-size="' + esc(s.size) + '" ' +
      (s.available ? '' : 'disabled aria-disabled="true" ') +
      'aria-pressed="false">' + esc(s.size) + '</button>';
  }).join('');

  var scarcity = (product.stockLevel < 4)
    ? '<p class="pdp-scarcity">Only ' + product.stockLevel + ' left</p>' : '';

  mainEl.innerHTML =
    '<div class="pdp-gallery-wrap">' +
      '<div class="pdp-gallery" id="pdp-gallery">' + galleryItems + '</div>' +
      '<div class="pdp-gallery__dots" id="pdp-dots">' + dots + '</div>' +
    '</div>' +
    '<div class="pdp-panel">' +
      (collection ? '<a class="pdp-panel__eyebrow" href="/collections/' + esc(collection.slug) + '">' + esc(collection.name) + '</a>' : '') +
      (pill ? '<br><span class="pdp-panel__pill">' + pill + '</span>' : '') +
      '<h1 class="pdp-panel__name">' + esc(product.name) + '</h1>' +
      '<p class="pdp-panel__material">' + esc(product.material) + '</p>' +
      '<p class="pdp-panel__price">$' + esc(product.price) + '</p>' +
      '<p class="pdp-panel__desc">' + esc(product.descriptor) + '</p>' +

      '<div class="pdp-row">' +
        '<div class="pdp-row__head">' +
          '<span class="pdp-row__label">Colour</span>' +
          '<span class="pdp-row__selected" id="pdp-color-sel">Select</span>' +
        '</div>' +
        '<div class="pdp-swatches" id="pdp-swatches">' + swatches + '</div>' +
      '</div>' +

      '<div class="pdp-row">' +
        '<div class="pdp-row__head">' +
          '<span class="pdp-row__label">Size</span>' +
          '<span class="pdp-row__selected" id="pdp-size-sel">Select</span>' +
        '</div>' +
        '<div class="pdp-sizes" id="pdp-sizes">' + sizeBtns + '</div>' +
        '<button class="pdp-sizeguide" id="pdp-sizeguide-open">Size Guide &rarr;</button>' +
        '<p class="pdp-warning" id="pdp-warning" role="alert" aria-live="polite"></p>' +
      '</div>' +

      scarcity +

      '<div class="pdp-actions">' +
        '<button class="pdp-atb" id="pdp-atb">Add to Bag</button>' +
        '<br>' +
        '<button class="pdp-wishlist" id="pdp-wishlist" aria-pressed="false">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          '<span>Save to Wishlist &rarr;</span>' +
        '</button>' +
        '<p class="pdp-reassure">Complimentary shipping &middot; 30-day returns &middot; Lifetime mending</p>' +
      '</div>' +
    '</div>';


  /* ── 4. Accordion ─────────────────────────────────── */

  var makerHtml = '';
  if (product.maker) {
    makerHtml =
      '<div class="pdp-maker">' +
        '<p class="pdp-maker__name">' + esc(product.maker.name) + '</p>' +
        '<span class="pdp-maker__line">' + esc(product.maker.location) + '</span>' +
        '<span class="pdp-maker__line">Handcrafted over ' + product.maker.daysToCraft +
          ' day' + (product.maker.daysToCraft !== 1 ? 's' : '') + ' in ' +
          esc((product.maker.location || '').split(',')[0]) + '</span>' +
      '</div>';
  }

  var accSections = [
    { title: 'Description', body: esc(product.fullDescription || product.descriptor) },
    { title: 'Material & Composition', body: esc(product.materialComposition || product.material) },
    { title: 'Care Instructions', body: esc(product.careInstructions || 'Care with intention.') },
    { title: 'Fit & Sizing', body: esc(product.fitSizing || 'True to size.') },
    { title: 'The Maker', body: makerHtml || 'Handcrafted with care.' }
  ];

  document.getElementById('pdp-accordion').innerHTML = accSections.map(function (s, i) {
    return '<div class="pdp-acc__item' + (i === 0 ? ' is-open' : '') + '">' +
      '<button class="pdp-acc__head" aria-expanded="' + (i === 0 ? 'true' : 'false') + '">' +
        '<span class="pdp-acc__title">' + s.title + '</span>' +
        '<span class="pdp-acc__icon" aria-hidden="true"></span>' +
      '</button>' +
      '<div class="pdp-acc__panel"><div class="pdp-acc__body">' + s.body + '</div></div>' +
    '</div>';
  }).join('');


  /* ── 5. Fit & Reviews ─────────────────────────────── */

  var fd = product.fitData || { runsSmall: 10, trueToSize: 80, runsLarge: 10 };
  var fitPos = (fd.runsSmall * 0 + fd.trueToSize * 50 + fd.runsLarge * 100) / 100;

  var reviewCards = (product.reviews || []).slice(0, 3).map(function (r) {
    return '<article class="pdp-review">' +
      '<div class="pdp-review__stars">' + stars(r.rating) + '</div>' +
      '<h3 class="pdp-review__title">' + esc(r.title) + '</h3>' +
      '<p class="pdp-review__body">' + esc(r.body) + '</p>' +
      '<div class="pdp-review__divider"></div>' +
      '<p class="pdp-review__name">' + esc(r.reviewer) + '</p>' +
      '<p class="pdp-review__meta">Bought ' + esc(r.size) + ' &middot; ' + esc(r.height) +
        (r.verified ? ' &middot; Verified buyer' : '') + '</p>' +
      '<a class="pdp-review__on" href="#">On — ' + esc(product.name) + '</a>' +
    '</article>';
  }).join('');

  document.getElementById('pdp-reviews').innerHTML =
    '<span class="pdp-sec-eyebrow">Fit &amp; Reviews</span>' +
    '<h2 class="pdp-sec-headline">What our community is saying.</h2>' +
    '<div class="pdp-stats">' +
      '<div class="pdp-stat">' +
        '<span class="pdp-stat__label">Rating</span>' +
        '<div class="pdp-stat__big">' + (product.averageRating || '—') + '</div>' +
        '<div class="pdp-stat__stars">' + stars(product.averageRating || 0, 'pdp-star--lg') + '</div>' +
        '<p class="pdp-stat__sub">from ' + (product.reviewCount || 0) + ' reviews</p>' +
      '</div>' +
      '<div class="pdp-stat">' +
        '<span class="pdp-stat__label">Fit</span>' +
        '<div class="pdp-fit">' +
          '<div class="pdp-fit__track">' +
            '<span class="pdp-fit__dot pdp-fit__dot--1"></span>' +
            '<span class="pdp-fit__dot pdp-fit__dot--2"></span>' +
            '<span class="pdp-fit__dot pdp-fit__dot--3"></span>' +
            '<span class="pdp-fit__marker" style="left:' + fitPos + '%"></span>' +
          '</div>' +
          '<div class="pdp-fit__labels"><span>Runs small</span><span>True to size</span><span>Runs large</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="pdp-stat">' +
        '<span class="pdp-stat__label">Recommend</span>' +
        '<div class="pdp-stat__big">' + (product.recommendationRate || '—') + '%</div>' +
        '<p class="pdp-stat__sub">would recommend</p>' +
      '</div>' +
    '</div>' +
    '<div class="pdp-review-grid">' + reviewCards + '</div>' +
    '<a class="pdp-readall" href="#">Read All Reviews &rarr;</a>';


  /* ── 6. Styled With ───────────────────────────────── */

  var related = (product.relatedProducts || [])
    .map(function (slug) { return window.getProductBySlug(slug); })
    .filter(Boolean);

  if (related.length) {
    var relCards = related.map(function (p) {
      return '<a class="pdp-rel-card" href="/products/' + esc(p.slug) + '">' +
        '<div class="pdp-rel-card__img"><img src="' + esc(p.images.primary) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        '<h3 class="pdp-rel-card__name">' + esc(p.name) + '</h3>' +
        '<p class="pdp-rel-card__material">' + esc(p.material) + '</p>' +
        '<p class="pdp-rel-card__price">$' + esc(p.price) + '</p>' +
      '</a>';
    }).join('');

    document.getElementById('pdp-styled').innerHTML =
      '<span class="pdp-sec-eyebrow">Styled With</span>' +
      '<h2 class="pdp-sec-headline">Complete the look.</h2>' +
      '<div class="pdp-related-grid">' + relCards + '</div>';
  } else {
    document.getElementById('pdp-styled').style.display = 'none';
  }


  /* ============================================================
     INTERACTIONS
     ============================================================ */

  var selectedColor = null;
  var selectedSize = null;
  var warning = document.getElementById('pdp-warning');

  function clearWarning() { warning.textContent = ''; warning.classList.remove('is-visible'); }

  /* Colour selection */
  document.querySelectorAll('.pdp-swatch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      document.querySelectorAll('.pdp-swatch').forEach(function (s) {
        s.classList.remove('is-selected'); s.setAttribute('aria-pressed', 'false');
      });
      sw.classList.add('is-selected'); sw.setAttribute('aria-pressed', 'true');
      selectedColor = sw.dataset.color;
      document.getElementById('pdp-color-sel').textContent = selectedColor;
      clearWarning();
    });
  });

  /* Size selection */
  document.querySelectorAll('.pdp-size').forEach(function (btn) {
    if (btn.disabled) return;
    btn.addEventListener('click', function () {
      document.querySelectorAll('.pdp-size').forEach(function (s) {
        s.classList.remove('is-selected'); s.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-selected'); btn.setAttribute('aria-pressed', 'true');
      selectedSize = btn.dataset.size;
      document.getElementById('pdp-size-sel').textContent = selectedSize;
      clearWarning();
    });
  });

  /* Add to Bag — validate then push to cart + open drawer */
  document.getElementById('pdp-atb').addEventListener('click', function () {
    if (!selectedColor || !selectedSize) {
      warning.textContent = !selectedSize ? 'Please select a size' : 'Please select a colour';
      warning.classList.add('is-visible');
      return;
    }
    clearWarning();
    if (window.atelierCart && window.atelierCart.addItem) {
      window.atelierCart.addItem({
        id:       product.id + '|' + selectedColor + '|' + selectedSize,
        name:     product.name,
        material: product.material + ' · ' + selectedColor + ' · ' + selectedSize,
        price:    product.price,
        img:      IMG_CLASS[product.slug] || ''
      });
      window.atelierCart.openCart();
    }
  });

  /* Wishlist toggle */
  var wish = document.getElementById('pdp-wishlist');
  wish.addEventListener('click', function () {
    var on = wish.classList.toggle('is-saved');
    wish.setAttribute('aria-pressed', on ? 'true' : 'false');
    wish.querySelector('span').textContent = on ? 'Saved to Wishlist' : 'Save to Wishlist →';
  });


  /* ── Accordion (one open at a time; CSS max-height animation) ──
     Pure class toggle — no offsetHeight measuring or transitionend
     dependency, so it works reliably across browsers and with
     reduced-motion. The .is-open class drives max-height in CSS. */

  var accItems = Array.prototype.slice.call(document.querySelectorAll('.pdp-acc__item'));
  accItems.forEach(function (item) {
    var head = item.querySelector('.pdp-acc__head');
    head.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      // Collapse every section first (one open at a time)
      accItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.pdp-acc__head').setAttribute('aria-expanded', 'false');
      });
      // Re-open the clicked one only if it was previously closed
      if (willOpen) {
        item.classList.add('is-open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ── Lightbox ─────────────────────────────────────── */

  var lb = document.getElementById('pdp-lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCounter = document.getElementById('lb-counter');
  var lbIndex = 0;

  function showLb(i) {
    lbIndex = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[lbIndex];
    lbImg.alt = product.name + ' — view ' + (lbIndex + 1);
    lbCounter.textContent = (lbIndex + 1) + ' / ' + imgs.length;
  }
  function openLb(i) {
    showLb(i);
    lb.classList.add('is-open');
    document.body.classList.add('ui-locked');
  }
  function closeLb() {
    lb.classList.remove('is-open');
    document.body.classList.remove('ui-locked');
  }

  document.querySelectorAll('.pdp-gallery__item').forEach(function (item) {
    item.addEventListener('click', function () { openLb(parseInt(item.dataset.index, 10)); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(parseInt(item.dataset.index, 10)); }
    });
  });
  document.getElementById('lb-prev').addEventListener('click', function () { showLb(lbIndex - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { showLb(lbIndex + 1); });
  document.getElementById('lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
  });


  /* ── Mobile carousel dots ─────────────────────────── */

  var gallery = document.getElementById('pdp-gallery');
  var dotEls = Array.prototype.slice.call(document.querySelectorAll('.pdp-gallery__dot'));
  if (gallery && dotEls.length) {
    gallery.addEventListener('scroll', function () {
      var i = Math.round(gallery.scrollLeft / gallery.clientWidth);
      dotEls.forEach(function (d, di) { d.classList.toggle('is-active', di === i); });
    });
    dotEls.forEach(function (d, di) {
      d.addEventListener('click', function () {
        gallery.scrollTo({ left: di * gallery.clientWidth, behavior: 'smooth' });
      });
    });
  }


  /* ── Size Guide drawer ────────────────────────────── */

  var sgDrawer = document.getElementById('pdp-sizedrawer');
  var backdrop = document.getElementById('ui-backdrop');

  function openSG() {
    sgDrawer.removeAttribute('hidden');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        sgDrawer.classList.add('is-open');
        if (backdrop) backdrop.classList.add('is-active');
      });
    });
    document.body.classList.add('ui-locked');
  }
  function closeSG() {
    sgDrawer.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-active');
    document.body.classList.remove('ui-locked');
    var done = false;
    function finish() { if (done) return; done = true; sgDrawer.setAttribute('hidden', ''); }
    sgDrawer.addEventListener('transitionend', function h() { sgDrawer.removeEventListener('transitionend', h); finish(); });
    setTimeout(finish, 600);
  }

  document.getElementById('pdp-sizeguide-open').addEventListener('click', openSG);
  document.getElementById('sg-close').addEventListener('click', closeSG);
  if (backdrop) {
    backdrop.addEventListener('click', function () {
      if (sgDrawer.classList.contains('is-open')) closeSG();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sgDrawer.classList.contains('is-open')) closeSG();
  });

})();
