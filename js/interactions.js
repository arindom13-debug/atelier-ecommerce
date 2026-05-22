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

      // 1. Update state
      cart.addItem(product);
      updateBadge(true);   // immediate badge increment + pulse

      // 2. Button feedback: "Added ✓" for 1.2 s
      var original    = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.classList.add('is-added');
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('is-added');
        btn.disabled = false;
      }, 1200);

      // 3. Open cart drawer 300 ms later (or re-render if already open)
      setTimeout(function () {
        if (currentPanel === 'cart') {
          renderCart();   // silently refresh contents
        } else {
          openCart();
        }
      }, 300);
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

})();
