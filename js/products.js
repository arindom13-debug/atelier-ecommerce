/* =====================================================
   ATELIER — Central Product Data
   Single source of truth for products + collections.
   Exposed as globals (no bundler) so any page can read it:
     window.ATELIER_PRODUCTS, window.ATELIER_COLLECTIONS
   Helpers: getProductBySlug, getCollectionBySlug, getProductsByCollection
   ===================================================== */
(function () {
  'use strict';

  var COLLECTIONS = [
    {
      slug: 'the-linen-edit',
      name: 'The Linen Edit',
      descriptor: 'Breathable weaves for languid afternoons',
      meta: '12 Pieces · Hand-loomed',
      pieces: 12,
      image: 'https://images.unsplash.com/photo-1700317440744-a126fc87b900?auto=format&fit=crop&w=900&h=1200&q=85'
    },
    {
      slug: 'heritage-cotton',
      name: 'Heritage Cotton',
      descriptor: 'Woven stories, rooted in tradition',
      meta: '8 Pieces · Hand-woven',
      pieces: 8,
      image: 'https://images.unsplash.com/photo-1659297949927-06fa02629af0?auto=format&fit=crop&w=800&h=600&q=85'
    },
    {
      slug: 'silk-muslin',
      name: 'Silk & Muslin',
      descriptor: 'The quietest luxury, against the skin',
      meta: '10 Pieces · Naturally dyed',
      pieces: 10,
      image: 'https://images.unsplash.com/photo-1694971112579-464e82f35a13?auto=format&fit=crop&w=800&h=600&q=85'
    }
  ];

  function sizes(spec) {
    // spec: object mapping size -> available boolean, preserving order
    return Object.keys(spec).map(function (s) {
      return { size: s, available: spec[s] };
    });
  }

  var PRODUCTS = [
    {
      id: 'kantha-wrap-jacket',
      slug: 'kantha-wrap-jacket',
      name: 'Kantha Wrap Jacket',
      collection: 'heritage-cotton',
      category: 'wraps',
      price: 285,
      material: 'Handloomed Cotton · Rajshahi',
      descriptor: 'A reversible wrap stitched in the running kantha tradition — one layer, endless ways to wear it.',
      colors: [
        { hex: '#C4A882', label: 'Clay' },
        { hex: '#8A9B82', label: 'Sage' },
        { hex: '#4A5A7A', label: 'Indigo' }
      ],
      sizes: sizes({ XS: true, S: true, M: true, L: true, XL: false }),
      isNew: true,
      isLimited: false,
      stockLevel: 12,
      images: {
        primary: 'https://images.unsplash.com/photo-1700317440740-627b8c533120?auto=format&fit=crop&w=600&h=750&q=85',
        secondary: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=750&q=85'
      }
    },
    {
      id: 'linen-drawstring-shirt',
      slug: 'linen-drawstring-shirt',
      name: 'Linen Drawstring Shirt',
      collection: 'the-linen-edit',
      category: 'tunics',
      price: 145,
      material: 'Pure Belgian Linen · Dhaka',
      descriptor: 'A softly tailored shirt with a drawstring hem — the everyday linen we reach for first.',
      colors: [
        { hex: '#D4C9B8', label: 'Natural' },
        { hex: '#F5F2EC', label: 'White' },
        { hex: '#A09080', label: 'Stone' }
      ],
      sizes: sizes({ XS: false, S: true, M: true, L: true, XL: true }),
      isNew: false,
      isLimited: false,
      stockLevel: 18,
      images: {
        primary: 'https://images.unsplash.com/photo-1700235162827-fb30a9774dd6?auto=format&fit=crop&w=600&h=750&q=85',
        secondary: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&h=750&q=85'
      }
    },
    {
      id: 'jamdani-muslin-kurta',
      slug: 'jamdani-muslin-kurta',
      name: 'Jamdani Muslin Kurta',
      collection: 'silk-muslin',
      category: 'tunics',
      price: 210,
      material: 'Jamdani Weave · Tangail',
      descriptor: 'Hand-woven jamdani muslin so fine it seems to hold light — a heritage kurta in limited weave.',
      colors: [
        { hex: '#EDE6D8', label: 'Ivory' },
        { hex: '#C8A8A0', label: 'Blush' },
        { hex: '#9A9898', label: 'Smoke' }
      ],
      sizes: sizes({ XS: true, S: true, M: true, L: false, XL: false }),
      isNew: false,
      isLimited: true,
      stockLevel: 4,
      images: {
        primary: 'https://images.unsplash.com/photo-1756483510837-83203eba47e9?auto=format&fit=crop&w=600&h=750&q=85',
        secondary: 'https://images.unsplash.com/photo-1583196003821-0da2e3cfcff2?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1583196003821-0da2e3cfcff2?auto=format&fit=crop&w=600&h=750&q=85'
      }
    },
    {
      id: 'washed-linen-trouser',
      slug: 'washed-linen-trouser',
      name: 'Washed Linen Trouser',
      collection: 'the-linen-edit',
      category: 'trousers',
      price: 175,
      material: 'Stonewashed Linen · Dhaka',
      descriptor: 'A relaxed, wide-leg trouser, stonewashed for a lived-in softness from the very first wear.',
      colors: [
        { hex: '#C8B898', label: 'Sand' },
        { hex: '#D8CEB8', label: 'Ecru' },
        { hex: '#3A3830', label: 'Charcoal' }
      ],
      sizes: sizes({ XS: true, S: true, M: true, L: true, XL: true }),
      isNew: false,
      isLimited: false,
      stockLevel: 15,
      images: {
        primary: 'https://images.unsplash.com/photo-1652132228164-4499391c4725?auto=format&fit=crop&w=600&h=750&q=85',
        secondary: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4463?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4463?auto=format&fit=crop&w=600&h=750&q=85'
      }
    },
    {
      id: 'block-print-dupatta',
      slug: 'block-print-dupatta',
      name: 'Block-Print Dupatta',
      collection: 'silk-muslin',
      category: 'wraps',
      price: 195,
      material: 'Endi Silk · Rajshahi',
      descriptor: 'A featherweight endi-silk dupatta, hand block-printed in small batches — drape it any way.',
      colors: [
        { hex: '#C89858', label: 'Amber' },
        { hex: '#8A9878', label: 'Sage' },
        { hex: '#C89888', label: 'Rose' }
      ],
      sizes: sizes({ 'One Size': true }),
      isNew: true,
      isLimited: false,
      stockLevel: 9,
      images: {
        primary: 'https://images.unsplash.com/photo-1556914249-863ba0ec162d?auto=format&fit=crop&w=600&h=750&q=85',
        secondary: 'https://images.unsplash.com/photo-1617117873745-9a80d8f16ac2?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1617117873745-9a80d8f16ac2?auto=format&fit=crop&w=600&h=750&q=85'
      }
    },
    {
      id: 'heritage-cotton-tunic',
      slug: 'heritage-cotton-tunic',
      name: 'Heritage Cotton Tunic',
      collection: 'heritage-cotton',
      category: 'tunics',
      price: 155,
      material: 'Handloomed Cotton · Comilla',
      descriptor: 'A clean-lined tunic in handloomed cotton from Comilla — quietly structured, endlessly layerable.',
      colors: [
        { hex: '#D0C4B0', label: 'Natural' },
        { hex: '#B87860', label: 'Terracotta' },
        { hex: '#8A9870', label: 'Green' }
      ],
      sizes: sizes({ XS: true, S: true, M: false, L: true, XL: true }),
      isNew: false,
      isLimited: false,
      stockLevel: 11,
      images: {
        primary: 'https://images.unsplash.com/photo-1538331269258-6c97a6bdeae0?auto=format&fit=crop&w=600&h=750&q=85',
        secondary: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=600&h=750&q=85'
      }
    },
    {
      id: 'embroidered-lawn-blouse',
      slug: 'embroidered-lawn-blouse',
      name: 'Embroidered Lawn Blouse',
      collection: 'the-linen-edit',
      category: 'tunics',
      price: 165,
      material: 'Nakshi Cotton · Dhaka',
      descriptor: 'Fine lawn cotton with hand-guided nakshi embroidery at the placket — a limited seasonal run.',
      colors: [
        { hex: '#F0EDE6', label: 'White' },
        { hex: '#D4B4A8', label: 'Blush' },
        { hex: '#B4C4B8', label: 'Mint' }
      ],
      sizes: sizes({ XS: true, S: true, M: true, L: false, XL: false }),
      isNew: false,
      isLimited: true,
      stockLevel: 3,
      images: {
        primary: 'https://images.unsplash.com/photo-1773574488221-08b2883a1c80?auto=format&fit=crop&w=600&h=750&q=85',
        secondary: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&h=750&q=85'
      }
    },
    {
      id: 'pleated-muslin-dress',
      slug: 'pleated-muslin-dress',
      name: 'Pleated Muslin Dress',
      collection: 'silk-muslin',
      category: 'dresses',
      price: 240,
      material: 'Endi Silk Blend · Rajshahi',
      descriptor: 'A column of finely pleated muslin in an endi-silk blend — fluid, weightless, made to move.',
      colors: [
        { hex: '#E8E0D0', label: 'Ivory' },
        { hex: '#C8A8A0', label: 'Dusty Rose' },
        { hex: '#8A9098', label: 'Slate' }
      ],
      sizes: sizes({ XS: true, S: true, M: true, L: true, XL: true }),
      isNew: false,
      isLimited: false,
      stockLevel: 7,
      images: {
        primary: 'https://images.unsplash.com/photo-1726591383658-37fc19442523?auto=format&fit=crop&w=600&h=750&q=85',
        secondary: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=750&q=85'
      }
    }
  ];

  function getProductBySlug(slug) {
    return PRODUCTS.filter(function (p) { return p.slug === slug; })[0] || null;
  }
  function getCollectionBySlug(slug) {
    return COLLECTIONS.filter(function (c) { return c.slug === slug; })[0] || null;
  }
  function getProductsByCollection(slug) {
    return PRODUCTS.filter(function (p) { return p.collection === slug; });
  }

  window.ATELIER_PRODUCTS = PRODUCTS;
  window.ATELIER_COLLECTIONS = COLLECTIONS;
  window.getProductBySlug = getProductBySlug;
  window.getCollectionBySlug = getCollectionBySlug;
  window.getProductsByCollection = getProductsByCollection;
})();
