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
      },
      fullDescription: 'Each piece is hand-stitched with the running kantha stitch, a technique passed down through generations of artisans in Rajshahi. The weave is tightly constructed for warmth without weight, and the reversibility means you get two distinct colorways in one jacket.',
      materialComposition: 'Pure handloomed cotton sourced from heritage looms in Rajshahi, Bangladesh. Each thread is selected for softness and durability. The jacket is naturally breathable and becomes softer with every wash.',
      careInstructions: 'Hand wash in cool water with mild soap. Lay flat to dry away from direct sunlight. Do not bleach. The fabric will soften and gain character over time. Minor color variation is natural and celebrates the handmade process.',
      fitSizing: 'True to size with a relaxed, layered fit. The jacket is designed to drape loosely over layers. Length: hip to mid-thigh. Sleeves are slightly cropped for stacked layering.',
      maker: {
        name: 'Rana Khatun',
        location: 'Rajshahi, Bangladesh',
        daysToCraft: 7
      },
      reviews: [
        {
          rating: 5,
          title: 'Instantly a wardrobe essential',
          body: 'The weight is perfect — substantial enough to layer but not heavy. I\'ve worn it every day since it arrived. The stitching detail is incredible.',
          reviewer: 'Sofia L.',
          height: '5\'8"',
          size: 'S',
          verified: true
        },
        {
          rating: 5,
          title: 'Two jackets in one',
          body: 'I love that it\'s truly reversible. The color blocking on the back is just as beautiful. Great for travel since it takes up minimal space.',
          reviewer: 'Mira P.',
          height: '5\'6"',
          size: 'M',
          verified: true
        },
        {
          rating: 4,
          title: 'Runs slightly roomy',
          body: 'True to size but with an intentional oversized fit. If you prefer a closer silhouette, size down. Otherwise perfect for layering.',
          reviewer: 'Anna T.',
          height: '5\'4"',
          size: 'XS',
          verified: true
        }
      ],
      averageRating: 4.9,
      reviewCount: 284,
      fitData: { runsSmall: 12, trueToSize: 78, runsLarge: 10 },
      recommendationRate: 96,
      relatedProducts: ['linen-drawstring-shirt', 'block-print-dupatta']
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
      },
      fullDescription: 'Pure Belgian linen in its most versatile form. The drawstring hem allows you to customize the length and shape, from flowing to structured. Pre-washed for immediate softness.',
      materialComposition: 'Belgian linen, pre-washed and stonewashed for a lived-in feel from day one. Naturally temperature-regulating and increasingly comfortable with wear.',
      careInstructions: 'Machine wash cold or hand wash. Line dry in the shade. Iron while damp for a crisp finish, or leave unironed for a relaxed texture. Linen creases naturally — this is part of its charm.',
      fitSizing: 'Relaxed fit that pairs well with everything. Length hits at the hip. Perfect oversized or tucked in. The drawstring allows for fitted or loose silhouettes.',
      maker: {
        name: 'Fatima Rahman',
        location: 'Dhaka, Bangladesh',
        daysToCraft: 4
      },
      reviews: [
        { rating: 5, title: 'My new uniform', body: 'I bought it in all three colors. Perfect for hot weather, and it looks good with everything.', reviewer: 'James K.', height: '5\'10"', size: 'L', verified: true },
        { rating: 5, title: 'Worth every penny', body: 'Exceptional quality linen. Softens beautifully after the first wash.', reviewer: 'Emma W.', height: '5\'7"', size: 'M', verified: true },
        { rating: 4, title: 'Great but roomy', body: 'Beautiful quality. Runs a bit large, so I sized down.', reviewer: 'Lily H.', height: '5\'5"', size: 'S', verified: true }
      ],
      averageRating: 4.8,
      reviewCount: 156,
      fitData: { runsSmall: 8, trueToSize: 72, runsLarge: 20 },
      recommendationRate: 94,
      relatedProducts: ['washed-linen-trouser', 'heritage-cotton-tunic']
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
        secondary: 'https://images.unsplash.com/photo-1756483510837-83203eba47e9?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1756483510837-83203eba47e9?auto=format&fit=crop&w=600&h=750&q=85'
      },
      fullDescription: 'Jamdani is the finest of the fine — each piece woven on a traditional pit loom with supplementary weft patterns. This kurta is breathtakingly delicate, yet remarkably durable.',
      materialComposition: 'Hand-woven muslin with jamdani supplementary weft patterns. Cotton fibers are spun to an almost gossamer fineness, then woven on traditional pit looms by master weavers.',
      careInstructions: 'Hand wash only in cool water with minimal soap. Do not wring. Lay flat to dry. These textiles are delicate — they reward gentle care with increased beauty over time.',
      fitSizing: 'Fitted through the bodice, flowing from the waist. Length hits mid-calf. Designed to be worn alone or layered with our tunics.',
      maker: {
        name: 'Karim Ahmed',
        location: 'Tangail, Bangladesh',
        daysToCraft: 14
      },
      reviews: [
        { rating: 5, title: 'Museum quality', body: 'This is art. The fineness of the weave is breathtaking. I feel like I\'m wearing a cloud.', reviewer: 'Catherine D.', height: '5\'9"', size: 'M', verified: true },
        { rating: 5, title: 'Investment piece', body: 'Worth every penny. The craftsmanship is unparalleled. A true heirloom piece.', reviewer: 'Priya S.', height: '5\'6"', size: 'S', verified: true },
        { rating: 5, title: 'Pure elegance', body: 'Delicate and ethereal. This kurta makes every moment feel special.', reviewer: 'Victoria L.', height: '5\'8"', size: 'M', verified: true }
      ],
      averageRating: 5.0,
      reviewCount: 89,
      fitData: { runsSmall: 5, trueToSize: 90, runsLarge: 5 },
      recommendationRate: 100,
      relatedProducts: ['pleated-muslin-dress', 'block-print-dupatta']
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
        secondary: 'https://images.unsplash.com/photo-1652132228164-4499391c4725?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1652132228164-4499391c4725?auto=format&fit=crop&w=600&h=750&q=85'
      },
      fullDescription: 'Stonewashed linen that arrives with that coveted softness you\'d normally have to wait for. The wide-leg silhouette drapes beautifully and pairs with everything.',
      materialComposition: 'Belgian linen, stonewashed twice for maximum softness. Each pair will develop its own unique patina as you wear it.',
      careInstructions: 'Machine wash cold. Line dry or tumble dry on low. Wrinkles are part of linen\'s character — embrace them or iron for a crisp look.',
      fitSizing: 'High-waisted, wide leg with a relaxed hip. Sits on the natural waist and hits at the ankle. True to size.',
      maker: {
        name: 'Nasrin Begum',
        location: 'Dhaka, Bangladesh',
        daysToCraft: 5
      },
      reviews: [
        { rating: 5, title: 'Elevated basics', body: 'These trousers are the foundation of my wardrobe. I have them in two colors and wear them constantly.', reviewer: 'Rebecca M.', height: '5\'10"', size: 'M', verified: true },
        { rating: 5, title: 'Perfect every time', body: 'The fit is true to size and supremely comfortable. The stonewashing is perfectly executed.', reviewer: 'Monica G.', height: '5\'8"', size: 'L', verified: true },
        { rating: 4, title: 'Wrinkles are part of it', body: 'Stunning linen quality but expect natural creasing. This is the nature of the fabric.', reviewer: 'Sarah N.', height: '5\'6"', size: 'M', verified: true }
      ],
      averageRating: 4.7,
      reviewCount: 201,
      fitData: { runsSmall: 5, trueToSize: 85, runsLarge: 10 },
      recommendationRate: 93,
      relatedProducts: ['linen-drawstring-shirt', 'heritage-cotton-tunic']
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
        secondary: 'https://images.unsplash.com/photo-1556914249-863ba0ec162d?auto=format&fit=crop&w=600&h=750&q=85',
        detail: 'https://images.unsplash.com/photo-1556914249-863ba0ec162d?auto=format&fit=crop&w=600&h=750&q=85'
      },
      fullDescription: 'A featherweight dupatta that finishes any look. Hand block-printed in small batches, no two pieces share exactly the same impression. Drape it, knot it, or wear it as a scarf.',
      materialComposition: 'Endi silk, also known as peace silk, sourced from Rajshahi. Hand block-printed using traditional wooden blocks and natural dyes. Each piece is unique.',
      careInstructions: 'Dry clean recommended, or hand wash very gently in cold water. Do not wring. Lay flat to dry away from sunlight to preserve the natural dyes.',
      fitSizing: 'One size, generously proportioned at 2.2 meters long. Versatile enough to wrap, drape, or layer in countless ways.',
      maker: {
        name: 'Abdul Hakim',
        location: 'Rajshahi, Bangladesh',
        daysToCraft: 3
      },
      reviews: [
        { rating: 5, title: 'So versatile', body: 'I wear this a dozen different ways. The silk is light as air and the print is gorgeous.', reviewer: 'Naomi R.', height: '5\'7"', size: 'One Size', verified: true },
        { rating: 5, title: 'A perfect gift', body: 'Bought one for myself and one for my sister. The block printing is exquisite up close.', reviewer: 'Hannah B.', height: '5\'5"', size: 'One Size', verified: true },
        { rating: 4, title: 'Beautiful but delicate', body: 'Stunning piece. Handle with care — the silk is very fine.', reviewer: 'Olivia P.', height: '5\'9"', size: 'One Size', verified: true }
      ],
      averageRating: 4.8,
      reviewCount: 112,
      fitData: { runsSmall: 0, trueToSize: 100, runsLarge: 0 },
      recommendationRate: 97,
      relatedProducts: ['jamdani-muslin-kurta', 'pleated-muslin-dress']
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
      },
      fullDescription: 'A clean-lined tunic that anchors any wardrobe. Handloomed in Comilla with a subtle structure that holds its shape while remaining endlessly comfortable.',
      materialComposition: 'Handloomed cotton from heritage looms in Comilla. Mid-weight and breathable, with a refined texture that comes only from hand-weaving.',
      careInstructions: 'Machine wash cold on gentle, or hand wash. Line dry. Warm iron if needed. The fabric softens beautifully with each wash while holding its structured drape.',
      fitSizing: 'Straight, slightly relaxed fit. Length hits at the upper thigh. Layers perfectly over our trousers. True to size.',
      maker: {
        name: 'Shahida Akter',
        location: 'Comilla, Bangladesh',
        daysToCraft: 6
      },
      reviews: [
        { rating: 5, title: 'Effortless layering', body: 'This tunic goes with everything. The structure is just right — not stiff, not shapeless.', reviewer: 'Diana K.', height: '5\'8"', size: 'L', verified: true },
        { rating: 4, title: 'Lovely texture', body: 'You can feel the hand-weaving. Beautiful piece, though M was sold out so I sized up.', reviewer: 'Grace T.', height: '5\'6"', size: 'L', verified: true },
        { rating: 5, title: 'Quietly perfect', body: 'Exactly the kind of understated quality I look for. Wears beautifully.', reviewer: 'Claire H.', height: '5\'5"', size: 'S', verified: true }
      ],
      averageRating: 4.7,
      reviewCount: 143,
      fitData: { runsSmall: 10, trueToSize: 82, runsLarge: 8 },
      recommendationRate: 92,
      relatedProducts: ['kantha-wrap-jacket', 'washed-linen-trouser']
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
      },
      fullDescription: 'Fine lawn cotton elevated by hand-guided nakshi embroidery at the placket. A limited seasonal run, each blouse carries the gentle irregularities of handwork.',
      materialComposition: 'Lightweight lawn cotton with hand-guided nakshi embroidery. The embroidery thread is mercerized cotton for a subtle sheen against the matte lawn.',
      careInstructions: 'Hand wash cold to protect the embroidery. Do not wring. Lay flat to dry. Iron on reverse to preserve the raised embroidery detail.',
      fitSizing: 'Semi-fitted through the body with a gentle A-line. Length sits at the hip. The embroidered placket adds structure. True to size.',
      maker: {
        name: 'Ruma Khatun',
        location: 'Dhaka, Bangladesh',
        daysToCraft: 9
      },
      reviews: [
        { rating: 5, title: 'The embroidery is everything', body: 'You can tell each stitch was placed by hand. A truly special blouse that gets compliments every time.', reviewer: 'Amara J.', height: '5\'6"', size: 'M', verified: true },
        { rating: 5, title: 'Delicate and refined', body: 'The lawn cotton is so soft and the embroidery is exquisite. Worth the limited-run price.', reviewer: 'Beatrice L.', height: '5\'4"', size: 'S', verified: true },
        { rating: 4, title: 'Run small, size up', body: 'Gorgeous detailing but I found it a touch snug. I\'d recommend sizing up.', reviewer: 'Priscilla M.', height: '5\'7"', size: 'M', verified: true }
      ],
      averageRating: 4.9,
      reviewCount: 67,
      fitData: { runsSmall: 22, trueToSize: 70, runsLarge: 8 },
      recommendationRate: 95,
      relatedProducts: ['linen-drawstring-shirt', 'jamdani-muslin-kurta']
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
      },
      fullDescription: 'A column of finely pleated muslin that moves like water. The endi-silk blend gives the pleats a soft luster while keeping the dress weightless and fluid.',
      materialComposition: 'Endi silk and muslin blend, hand-pleated and heat-set to hold the fine accordion folds. The pleating catches light beautifully as you move.',
      careInstructions: 'Dry clean only to preserve the pleating. Store hanging to maintain the fold structure. Steam gently if needed — never iron flat.',
      fitSizing: 'Relaxed column silhouette that skims the body. The pleating provides natural give. Length hits mid-calf. True to size.',
      maker: {
        name: 'Tahmina Islam',
        location: 'Rajshahi, Bangladesh',
        daysToCraft: 11
      },
      reviews: [
        { rating: 5, title: 'Pure poetry in motion', body: 'This dress moves like nothing I own. The pleating is mesmerizing and the silk blend feels luxurious.', reviewer: 'Eleanor V.', height: '5\'9"', size: 'M', verified: true },
        { rating: 5, title: 'Showstopper', body: 'Wore it to a wedding and could not stop receiving compliments. Weightless and elegant.', reviewer: 'Francesca D.', height: '5\'7"', size: 'L', verified: true },
        { rating: 5, title: 'Investment in elegance', body: 'The craftsmanship of the pleats is remarkable. This is a forever piece.', reviewer: 'Isabel R.', height: '5\'8"', size: 'M', verified: true }
      ],
      averageRating: 4.9,
      reviewCount: 178,
      fitData: { runsSmall: 8, trueToSize: 84, runsLarge: 8 },
      recommendationRate: 98,
      relatedProducts: ['jamdani-muslin-kurta', 'block-print-dupatta']
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
