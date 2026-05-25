(function () {
  'use strict';

  /* ================================================================
     ATELIER — UI Interactions
     Covers: Search overlay · Account dropdown · Cart drawer · ATB

     Architecture
     ────────────
     - Pure vanilla JS, no framework dependencies.
     - Cart state stored in module-level `cart` object, persisted to
       localStorage under key STORAGE_KEY.
     - One shared backdrop element dims the page for Search and Cart.
     - Account dropdown uses outside-click detection (no backdrop).
     - Panel open/close uses the hidden-attr + rAF + is-open pattern
       so CSS transitions fire correctly on every browser.
     - `currentPanel` tracks the active panel; opening a new one
       force-closes any existing one without animation (instant).
  ================================================================ */

  var STORAGE_KEY = 'atelier_cart_v1';


  /* ── 1. CART STATE ──────────────────────────────────────────── */

  var cart = {
    items: [],

    load: function () {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (raw) { this.items = JSON.parse(raw); }
      } catch (e) { this.items = []; }
    },

    save: function () {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items)); }
      catch (e) { /* quota exceeded — fail silently */ }
    },

    addItem: function (product) {
      var existing = this._find(product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        this.items.push({
          id:       product.id,
          name:     product.name,
          material: product.material,
          price:    parseFloat(product.price),
          img:      product.img,
          qty:      1
        });
      }
      this.save();
    },

    removeItem: function (id) {
      this.items = this.items.filter(function (i) { return i.id !== id; });
      this.save();
    },

    updateQty: function (id, qty) {
      if (qty <= 0) { this.removeItem(id); return; }
      var item = this._find(id);
      if (item) { item.qty = qty; this.save(); }
    },

    getTotalQty: function () {
      return this.items.reduce(function (sum, i) { return sum + i.qty; }, 0);
    },

    getSubtotal: function () {
      return this.items.reduce(function (sum, i) { return sum + (i.price * i.qty); }, 0);
    },

    _find: function (id) {
      return this.items.find(function (i) { return i.id === id; }) || null;
    }
  };


  /* ── 2. DOM REFERENCES ──────────────────────────────────────── */

  var backdrop       = document.getElementById('ui-backdrop');
  var btnSearch      = document.getElementById('btn-search');
  var btnAccount     = document.getElementById('btn-account');
  var accountWrap    = document.getElementById('account-wrap');
  var btnCart        = document.getElementById('btn-cart');
  var cartCountEl    = document.getElementById('cart-count');

  var searchOverlay  = document.getElementById('search-overlay');
  var searchInput    = document.getElementById('search-input');
  var btnSearchClose = document.getElementById('btn-search-close');

  var accountDropdown = document.getElementById('account-dropdown');

  var cartDrawer     = document.getElementById('cart-drawer');
  var cartBody       = document.getElementById('cart-body');
  var cartFooter     = document.getElementById('cart-footer');
  var cartSubtotal   = document.getElementById('cart-subtotal');
  var btnCartClose   = document.getElementById('btn-cart-close');


  /* ── 3. PANEL STATE ─────────────────────────────────────────── */

  // 'search' | 'account' | 'cart' | null
  var currentPanel = null;


  /* ── 4. SCROLL LOCK ─────────────────────────────────────────── */

  function lockScroll ()   { document.body.classList.add('ui-locked');    }
  function unlockScroll () { document.body.classList.remove('ui-locked'); }


  /* ── 5. BACKDROP ────────────────────────────────────────────── */

  function showBackdrop () {
    if (!backdrop) return;
    backdrop.classList.add('is-active');
  }

  function hideBackdrop () {
    if (!backdrop) return;
    backdrop.classList.remove('is-active');
  }


  /* ── 6. PANEL OPEN / CLOSE HELPERS ─────────────────────────── */

  /* openPanel — removes `hidden`, double-rAF then adds `.is-open`
     (double-rAF guarantees the transition fires even in Safari) */
  function openPanel (el, useBackdrop) {
    el.removeAttribute('hidden');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('is-open');
        if (useBackdrop) showBackdrop();
      });
    });
  }

  /* closePanel — removes `.is-open`, waits for transitionend,
     then re-adds `hidden`. A 600 ms safety timeout prevents a
     stale element if transitionend never fires (reduced-motion). */
  function closePanel (el, useBackdrop) {
    el.classList.remove('is-open');
    if (useBackdrop) hideBackdrop();
    var done = false;
    function finish () {
      if (done) return;
      done = true;
      el.setAttribute('hidden', '');
    }
    el.addEventListener('transitionend', function handler () {
      el.removeEventListener('transitionend', handler);
      finish();
    });
    setTimeout(finish, 600);
  }

  /* forceCloseAll — instantly hides every panel with no animation.
     Called when switching panels so staggered transitions don't
     leave two panels half-visible at once. */
  function forceCloseAll () {
    if (searchOverlay) {
      searchOverlay.classList.remove('is-open');
      searchOverlay.setAttribute('hidden', '');
      if (btnSearch) btnSearch.setAttribute('aria-expanded', 'false');
    }
    if (accountDropdown) {
      accountDropdown.classList.remove('is-open');
      accountDropdown.setAttribute('hidden', '');
      if (btnAccount) btnAccount.setAttribute('aria-expanded', 'false');
    }
    if (cartDrawer) {
      cartDrawer.classList.remove('is-open');
      cartDrawer.setAttribute('hidden', '');
      if (btnCart) btnCart.setAttribute('aria-expanded', 'false');
    }
    hideBackdrop();
    unlockScroll();
    currentPanel = null;
  }


  /* ── 7. SEARCH ──────────────────────────────────────────────── */

  function openSearch () {
    if (currentPanel === 'search') return;
    forceCloseAll();
    currentPanel = 'search';
    if (btnSearch) btnSearch.setAttribute('aria-expanded', 'true');
    openPanel(searchOverlay, true);
    lockScroll();
    // Focus the input after slide-in finishes (~320 ms)
    setTimeout(function () {
      if (searchInput) searchInput.focus();
    }, 340);
  }

  function closeSearch () {
    if (currentPanel !== 'search') return;
    currentPanel = null;
    if (btnSearch) btnSearch.setAttribute('aria-expanded', 'false');
    closePanel(searchOverlay, true);
    unlockScroll();
    if (btnSearch) btnSearch.focus();
  }

  if (btnSearch) {
    btnSearch.addEventListener('click', function () {
      if (currentPanel === 'search') closeSearch();
      else openSearch();
    });
  }

  if (btnSearchClose) {
    btnSearchClose.addEventListener('click', closeSearch);
  }

  // Recent-search pills fill the input field
  if (searchOverlay) {
    searchOverlay.querySelectorAll('.search-overlay__recent-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = btn.textContent.replace('↗ ', '').trim();
          searchInput.focus();
        }
      });
    });

    // Collection links close the overlay before navigating
    searchOverlay.querySelectorAll('.search-overlay__link').forEach(function (link) {
      link.addEventListener('click', function () {
        closeSearch();
      });
    });
  }


  /* ── 8. ACCOUNT DROPDOWN ────────────────────────────────────── */

  function openAccount () {
    if (currentPanel === 'account') { closeAccount(); return; }
    forceCloseAll();
    currentPanel = 'account';
    if (btnAccount) btnAccount.setAttribute('aria-expanded', 'true');
    // Account dropdown uses opacity/transform only — no backdrop
    accountDropdown.removeAttribute('hidden');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        accountDropdown.classList.add('is-open');
      });
    });
    // Move focus into the dropdown
    setTimeout(function () {
      var firstLink = accountDropdown && accountDropdown.querySelector('a');
      if (firstLink) firstLink.focus();
    }, 220);
  }

  function closeAccount () {
    if (currentPanel !== 'account') return;
    currentPanel = null;
    if (btnAccount) btnAccount.setAttribute('aria-expanded', 'false');
    accountDropdown.classList.remove('is-open');
    var done = false;
    function finish () {
      if (done) return;
      done = true;
      accountDropdown.setAttribute('hidden', '');
    }
    accountDropdown.addEventListener('transitionend', function handler () {
      accountDropdown.removeEventListener('transitionend', handler);
      finish();
    });
    setTimeout(finish, 400);
    if (btnAccount) btnAccount.focus();
  }

  if (btnAccount) {
    btnAccount.addEventListener('click', openAccount);
  }


  /* ── 9. CART DRAWER ─────────────────────────────────────────── */

  function renderCart () {
    if (!cartBody) return;
    var items = cart.items;

    if (items.length === 0) {
      cartBody.innerHTML =
        '<div class="cart-empty">' +
          '<p class="cart-empty__line">Your bag is quiet for now.</p>' +
          '<a href="#shop" class="cart-empty__cta">Continue Shopping &rarr;</a>' +
        '</div>';
      if (cartFooter) cartFooter.setAttribute('hidden', '');
      return;
    }

    // Build item HTML
    var html = '';
    items.forEach(function (item) {
      html +=
        '<div class="cart-item" data-id="' + esc(item.id) + '">' +
          '<div class="cart-item__thumb ' + esc(item.img) + '"></div>' +
          '<div class="cart-item__info">' +
            '<p class="cart-item__name">' + esc(item.name) + '</p>' +
            '<p class="cart-item__meta">' + esc(item.material) + '</p>' +
            '<div class="cart-item__controls">' +
              '<button class="cart-item__qty-btn" ' +
                      'data-action="dec" data-id="' + esc(item.id) + '" ' +
                      'aria-label="Decrease quantity of ' + esc(item.name) + '">&#x2212;</button>' +
              '<span class="cart-item__qty" aria-label="Quantity: ' + item.qty + '">' + item.qty + '</span>' +
              '<button class="cart-item__qty-btn" ' +
                      'data-action="inc" data-id="' + esc(item.id) + '" ' +
                      'aria-label="Increase quantity of ' + esc(item.name) + '">+</button>' +
            '</div>' +
            '<div class="cart-item__row">' +
              '<p class="cart-item__price">$' + (item.price * item.qty).toFixed(0) + '</p>' +
              '<button class="cart-item__remove" ' +
                      'data-id="' + esc(item.id) + '" ' +
                      'aria-label="Remove ' + esc(item.name) + ' from bag">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    });
    cartBody.innerHTML = html;

    // Footer
    if (cartFooter) {
      cartFooter.removeAttribute('hidden');
      if (cartSubtotal) {
        cartSubtotal.textContent = '$' + cart.getSubtotal().toFixed(0);
      }
    }

    // Bind quantity buttons
    cartBody.querySelectorAll('.cart-item__qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id   = btn.dataset.id;
        var item = cart._find(id);
        if (!item) return;
        cart.updateQty(id, btn.dataset.action === 'inc' ? item.qty + 1 : item.qty - 1);
        renderCart();
        updateBadge(false);
      });
    });

    // Bind remove buttons
    cartBody.querySelectorAll('.cart-item__remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        cart.removeItem(btn.dataset.id);
        renderCart();
        updateBadge(false);
      });
    });
  }

  function openCart () {
    if (currentPanel === 'cart') return;
    forceCloseAll();
    currentPanel = 'cart';
    if (btnCart) btnCart.setAttribute('aria-expanded', 'true');
    renderCart();
    openPanel(cartDrawer, true);
    lockScroll();
    // Move focus to the close button after slide-in
    setTimeout(function () {
      if (btnCartClose) btnCartClose.focus();
    }, 380);
  }

  function closeCart () {
    if (currentPanel !== 'cart') return;
    currentPanel = null;
    if (btnCart) btnCart.setAttribute('aria-expanded', 'false');
    closePanel(cartDrawer, true);
    unlockScroll();
    if (btnCart) btnCart.focus();
  }

  if (btnCart) {
    btnCart.addEventListener('click', function () {
      if (currentPanel === 'cart') closeCart();
      else openCart();
    });
  }

  if (btnCartClose) {
    btnCartClose.addEventListener('click', closeCart);
  }

  // "Continue Shopping" link inside empty cart closes drawer
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('cart-empty__cta')) {
      closeCart();
    }
  });


  /* ── 10. ADD TO BAG ─────────────────────────────────────────── */

  /* Size picker state — shared by picker open/close/confirm */
  var _sp = { btn: null, product: null };

  /* ── Size picker DOM ── */
  var spPicker   = document.getElementById('size-picker');
  var spScrim    = document.getElementById('size-picker-scrim');
  var spTitle    = document.getElementById('size-picker-title');
  var spGrid     = document.getElementById('size-picker-grid');
  var spAdd      = document.getElementById('size-picker-add');
  var spClose    = document.getElementById('size-picker-close');

  function openSizePicker(atbBtn, product, sizeLabels) {
    if (!spPicker || !spScrim) return;
    _sp.btn     = atbBtn;
    _sp.product = product;

    if (spTitle) spTitle.textContent = product.name;

    /* Build size buttons */
    if (spGrid) {
      spGrid.innerHTML = '';
      sizeLabels.forEach(function (label) {
        var b = document.createElement('button');
        b.type      = 'button';
        b.className = 'size-picker__btn';
        b.textContent = label;
        b.dataset.size = label;
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          spGrid.querySelectorAll('.size-picker__btn').forEach(function (x) {
            x.classList.remove('is-selected');
            x.setAttribute('aria-pressed', 'false');
          });
          b.classList.add('is-selected');
          b.setAttribute('aria-pressed', 'true');
          if (spAdd) spAdd.disabled = false;
        });
        spGrid.appendChild(b);
      });
    }

    if (spAdd) { spAdd.textContent = 'Add to Bag'; spAdd.disabled = true; }

    spScrim.removeAttribute('hidden');
    spPicker.removeAttribute('hidden');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        spScrim.classList.add('is-open');
        spPicker.classList.add('is-open');
        /* Focus first size button for keyboard users */
        var first = spGrid && spGrid.querySelector('.size-picker__btn');
        if (first) first.focus();
      });
    });
    lockScroll();
  }

  function closeSizePicker() {
    if (!spPicker || !spScrim) return;
    spPicker.classList.remove('is-open');
    spScrim.classList.remove('is-open');
    unlockScroll();
    setTimeout(function () {
      spPicker.setAttribute('hidden', '');
      spScrim.setAttribute('hidden', '');
    }, 380);
    _sp.btn = null;
    _sp.product = null;
  }

  function addToCartDirect(btn, product) {
    cart.addItem(product);
    updateBadge(true);

    var orig     = btn.innerHTML;
    btn.innerHTML = 'Added ✓';
    btn.classList.add('is-added');
    btn.disabled  = true;

    setTimeout(function () {
      btn.innerHTML = orig;
      btn.classList.remove('is-added');
      btn.disabled  = false;
    }, 1200);

    setTimeout(function () {
      if (currentPanel === 'cart') { renderCart(); } else { openCart(); }
    }, 300);
  }

  /* ── Size picker confirm ── */
  if (spAdd) {
    spAdd.addEventListener('click', function () {
      var selected = spGrid && spGrid.querySelector('.size-picker__btn.is-selected');
      if (!selected || !_sp.product) return;

      var sizeLabel = selected.dataset.size;
      var product   = {
        id:       _sp.product.id + '--' + sizeLabel.toLowerCase().replace(/\s+/g, '-'),
        name:     _sp.product.name + ' (' + sizeLabel + ')',
        material: _sp.product.material,
        price:    _sp.product.price,
        img:      _sp.product.img
      };
      cart.addItem(product);
      updateBadge(true);

      /* Feedback on size picker button */
      spAdd.textContent = 'Added ✓';
      spAdd.disabled = true;

      /* Feedback on the original ATB button */
      var atbBtn = _sp.btn;
      if (atbBtn) {
        var orig      = atbBtn.innerHTML;
        atbBtn.innerHTML = 'Added ✓';
        atbBtn.classList.add('is-added');
        atbBtn.disabled  = true;
        setTimeout(function () {
          atbBtn.innerHTML = orig;
          atbBtn.classList.remove('is-added');
          atbBtn.disabled  = false;
        }, 1500);
      }

      setTimeout(function () {
        closeSizePicker();
        setTimeout(function () {
          if (currentPanel === 'cart') { renderCart(); } else { openCart(); }
        }, 220);
      }, 420);
    });
  }

  if (spClose) spClose.addEventListener('click', closeSizePicker);
  if (spScrim) spScrim.addEventListener('click', closeSizePicker);

  /* Close size picker on Escape — injected into the existing keydown handler
     below in section 12, but we handle it here too for safety. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && spPicker && !spPicker.hasAttribute('hidden')) {
      closeSizePicker();
    }
  });

  /* ── ATB button click: route to size picker or direct add ── */
  document.querySelectorAll('.product-card__atb').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.disabled) return;

      var product = {
        id:       btn.dataset.id,
        name:     btn.dataset.name,
        material: btn.dataset.material,
        price:    btn.dataset.price,
        img:      btn.dataset.img
      };

      /* Collect available (non-sold-out) size labels from this card */
      var card   = btn.closest('.product-card');
      var spans  = card
        ? Array.prototype.slice.call(
            card.querySelectorAll('.product-card__size:not(.is-unavailable)')
          )
        : [];
      var labels = spans.map(function (s) { return s.textContent.trim(); });
      var isOneSize = labels.length === 1 && labels[0] === 'One Size';

      if (isOneSize || labels.length === 0) {
        /* No real size choice — add straight to cart */
        addToCartDirect(btn, product);
      } else {
        /* Show size picker */
        openSizePicker(btn, product, labels);
      }
    });
  });


  /* ── 11. CART BADGE ─────────────────────────────────────────── */

  function updateBadge (pulse) {
    if (!cartCountEl) return;
    var qty = cart.getTotalQty();

    cartCountEl.textContent  = qty > 0 ? String(qty) : '';
    cartCountEl.dataset.count = String(qty);

    // Keep aria-label on the cart button accurate
    if (btnCart) {
      btnCart.setAttribute('aria-label',
        'Shopping bag' + (qty > 0 ? ', ' + qty + ' item' + (qty !== 1 ? 's' : '') : ''));
    }

    // Scale-pulse animation
    if (pulse && qty > 0) {
      cartCountEl.classList.remove('is-pulsing');
      // Force reflow so the re-added class triggers a fresh animation
      void cartCountEl.offsetWidth;
      cartCountEl.classList.add('is-pulsing');
      cartCountEl.addEventListener('animationend', function handler () {
        cartCountEl.removeEventListener('animationend', handler);
        cartCountEl.classList.remove('is-pulsing');
      });
    }
  }


  /* ── 12. KEYBOARD NAVIGATION ────────────────────────────────── */

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (currentPanel === 'search')  closeSearch();
    if (currentPanel === 'account') closeAccount();
    if (currentPanel === 'cart')    closeCart();
  });


  /* ── 13. OUTSIDE-CLICK HANDLERS ─────────────────────────────── */

  // Backdrop click closes search and cart
  if (backdrop) {
    backdrop.addEventListener('click', function () {
      if (currentPanel === 'search') closeSearch();
      if (currentPanel === 'cart')   closeCart();
    });
  }

  // Outside click closes account dropdown (no backdrop for it)
  document.addEventListener('click', function (e) {
    if (currentPanel !== 'account') return;
    if (accountWrap && accountWrap.contains(e.target)) return;
    // Clicks that land on the backdrop itself are already handled above
    closeAccount();
  });


  /* ── 14. SIMPLE HTML ESCAPE ─────────────────────────────────── */

  function esc (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }


  /* ── 15. INIT ───────────────────────────────────────────────── */

  cart.load();
  updateBadge(false);   // restore badge from localStorage on page load


  /* ── 16. GLOBAL API FOR PDP ─────────────────────────────────── */
  /* Allows product detail page to add items and open cart drawer */

  window.atelierCart = {
    addItem: function (product) {
      cart.addItem(product);
      updateBadge(true);  // show pulse animation
    },
    openCart: function () {
      openCart();
    }
  };


  /* ── 17. SECTION SCROLL-REVEAL ──────────────────────────────── */
  /* Each major section below the Hero fades + rises into view as it
     enters the viewport (opacity 0→1, translateY 20px→0, 600ms
     ease-out). Content within sections continues to stagger via the
     existing per-element reveals, so the page feels smooth and
     intentional on scroll. The `.section-reveal` class is only added
     by JS, so without JS the page renders fully visible. The Hero is
     excluded — it sits outside <main> and is visible on load. */
  (function () {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('main#main-content > section')
    );
    if (!sections.length) return;

    sections.forEach(function (s, i) {
      s.classList.add('section-reveal');
      // Gentle 100ms cadence so adjacent sections don't pop in unison
      s.style.transitionDelay = ((i % 2) * 100) + 'ms';
    });

    if (!('IntersectionObserver' in window)) {
      sections.forEach(function (s) { s.classList.add('is-revealed'); });
      return;
    }

    /* threshold 0 (ratio-independent) so even very tall sections
       reveal reliably; rootMargin sets the trigger point ~12% up
       from the viewport bottom. */
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  })();


  /* ── 14. GLOBAL PRESS FEEDBACK ──────────────────────────────────
     Subtle scale-down on press for every interactive element.
     Implemented here (not via a CSS :active rule) so it never clobbers
     the bespoke per-element hover transitions already in styles.css.

     Two-class technique (see .press-anim / .press-down in styles.css):
       • pointerdown → add both classes (element presses in)
       • pointerup   → drop .press-down so it springs back through the
                       same transition, then remove .press-anim once it
                       settles, restoring the element's native transition.
  ──────────────────────────────────────────────────────────────── */
  (function () {
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var CONTROL = 'a, button, select, summary, label[for], [role="button"], input[type="submit"]';
    var CARD    = '.product-card, .collection-tile';

    var pressed     = null;
    var settleTimer = null;

    function pickTarget(node) {
      if (!node || !node.closest) return null;
      var el = node.closest(CONTROL) || node.closest(CARD);
      if (!el) return null;
      // The product-card overlay link has no visible box of its own —
      // press the whole card instead so the feedback is visible.
      if (el.classList.contains('product-card__media-link')) {
        el = el.closest('.product-card') || el;
      }
      return el;
    }

    function press(e) {
      var el = pickTarget(e.target);
      if (!el) return;
      if (settleTimer) { clearTimeout(settleTimer); settleTimer = null; }
      if (pressed && pressed !== el) {
        pressed.classList.remove('press-anim', 'press-down');
      }
      pressed = el;
      el.classList.add('press-anim', 'press-down');
    }

    function release() {
      if (!pressed) return;
      var el = pressed;
      pressed = null;
      el.classList.remove('press-down');        // animate back to scale(1)
      settleTimer = setTimeout(function () {
        el.classList.remove('press-anim');       // restore native transition
        settleTimer = null;
      }, 220);
    }

    document.addEventListener('pointerdown',   press,   true);
    document.addEventListener('pointerup',     release, true);
    document.addEventListener('pointercancel', release, true);
    document.addEventListener('scroll',        release, true);
    window.addEventListener('blur',            release);
  })();

})();


/* ── AUTH MODALS — Sign In / Create Account ─────────────────── */
(function () {
  'use strict';

  var signinModal = document.getElementById('signin-modal');
  var signupModal = document.getElementById('signup-modal');
  var openSignin  = document.getElementById('open-signin');
  var openSignup  = document.getElementById('open-signup');
  var closeSignin = document.getElementById('btn-signin-close');
  var closeSignup = document.getElementById('btn-signup-close');
  var goToSignup  = document.getElementById('go-to-signup');
  var goToSignin  = document.getElementById('go-to-signin');

  /* ── Open / close helpers ── */
  function openAuthModal(modal) {
    if (!modal) return;
    document.body.classList.add('ui-locked');
    modal.removeAttribute('hidden');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
        var first = modal.querySelector('input');
        if (first) setTimeout(function () { first.focus(); }, 160);
      });
    });
  }

  function closeAuthModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('ui-locked');
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      modal.setAttribute('hidden', '');
      /* Reset form + any error states */
      var form = modal.querySelector('form');
      if (form) {
        form.reset();
        form.querySelectorAll('.is-error').forEach(function (el) {
          el.classList.remove('is-error');
        });
        var btn = form.querySelector('.auth-form__submit');
        if (btn) { btn.textContent = btn.dataset.orig || btn.textContent; btn.disabled = false; }
      }
    }
    modal.addEventListener('transitionend', function h() {
      modal.removeEventListener('transitionend', h);
      finish();
    });
    setTimeout(finish, 400);
  }

  function closeDropdown() {
    var dd = document.getElementById('account-dropdown');
    if (dd) { dd.classList.remove('is-open'); dd.setAttribute('hidden', ''); }
    var btn = document.getElementById('btn-account');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  /* ── Bind open triggers ── */
  if (openSignin) {
    openSignin.addEventListener('click', function () {
      closeDropdown();
      openAuthModal(signinModal);
    });
  }

  if (openSignup) {
    openSignup.addEventListener('click', function () {
      closeDropdown();
      openAuthModal(signupModal);
    });
  }

  /* ── Bind close buttons ── */
  if (closeSignin) closeSignin.addEventListener('click', function () { closeAuthModal(signinModal); });
  if (closeSignup) closeSignup.addEventListener('click', function () { closeAuthModal(signupModal); });

  /* ── Switch between modals ── */
  if (goToSignup) {
    goToSignup.addEventListener('click', function () {
      closeAuthModal(signinModal);
      setTimeout(function () { openAuthModal(signupModal); }, 260);
    });
  }
  if (goToSignin) {
    goToSignin.addEventListener('click', function () {
      closeAuthModal(signupModal);
      setTimeout(function () { openAuthModal(signinModal); }, 260);
    });
  }

  /* ── Backdrop click closes ── */
  [signinModal, signupModal].forEach(function (modal) {
    if (!modal) return;
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeAuthModal(modal);
    });
  });

  /* ── Escape key closes ── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (signinModal && !signinModal.hasAttribute('hidden')) closeAuthModal(signinModal);
    if (signupModal && !signupModal.hasAttribute('hidden')) closeAuthModal(signupModal);
  });

  /* ── Form submission (client-side feedback — static site) ── */
  function bindForm(form, modal) {
    if (!form) return;
    var submitBtn = form.querySelector('.auth-form__submit');
    if (submitBtn) submitBtn.dataset.orig = submitBtn.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('input[required]').forEach(function (input) {
        var empty = !input.value.trim();
        input.classList.toggle('is-error', empty);
        if (empty) valid = false;
      });
      if (!valid) return;

      if (submitBtn) {
        submitBtn.textContent = 'Done ✓';
        submitBtn.disabled = true;
      }
      setTimeout(function () { closeAuthModal(modal); }, 900);
    });

    /* Clear error on input */
    form.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('input', function () { input.classList.remove('is-error'); });
    });
  }

  bindForm(document.getElementById('signin-form'), signinModal);
  bindForm(document.getElementById('signup-form'), signupModal);

})();


/* ── INVITATION FORM — Success state ───────────────────────────
   On submit: validate email, hide the form row, reveal the
   success block with a gentle fade. The button briefly shows
   "Thank you ✓" before the swap so the transition feels earned.
─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var form       = document.querySelector('.invitation__form');
  var successEl  = document.getElementById('invite-success');
  if (!form || !successEl) return;

  var emailInput  = form.querySelector('input[type="email"]');
  var submitBtn   = form.querySelector('.invitation__submit');
  var microcopy   = document.getElementById('invite-note');
  /* Fade out the whole form + microcopy, then show success */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Basic validation */
    if (emailInput && !emailInput.value.trim()) {
      emailInput.focus();
      return;
    }

    /* Disable + show micro-feedback on the button */
    if (submitBtn) {
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Thank you ✓';
    }

    /* Swap form → success after a short pause */
    setTimeout(function () {
      form.style.transition = 'opacity 0.4s ease';
      form.style.opacity    = '0';
      if (microcopy) {
        microcopy.style.transition = 'opacity 0.4s ease';
        microcopy.style.opacity    = '0';
      }
      setTimeout(function () {
        form.style.display = 'none';
        if (microcopy) microcopy.style.display = 'none';
        successEl.style.opacity    = '0';
        successEl.style.transition = 'opacity 0.5s ease';
        successEl.removeAttribute('hidden');
        /* Force reflow then fade in */
        void successEl.offsetWidth;
        successEl.style.opacity = '1';
      }, 420);
    }, 600);
  });
})();
