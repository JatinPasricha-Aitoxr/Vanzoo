/**
 * Locality landing pages — one per neighbourhood at /areas-we-serve/[slug]/.
 *
 * Every locality in lib/site.ts `areaGroups` gets a page. Ardee City is written
 * out by hand as the template; the rest are built by `buildArea` from their
 * corridor's profile in `corridorProfiles`, so a new name added to `areaGroups`
 * gets a page automatically. To give a locality bespoke copy, add a
 * hand-written `AreaEntry` to `handWrittenAreas` — it replaces the generated one.
 *
 * Claims are limited to what Vanzoo publishes: free pickup and delivery, the
 * 3–5 day / express turnaround, the two stores in lib/site.ts, and the
 * corridor the locality belongs to. Nothing about the locality itself (distance,
 * population, landmarks) is stated unless it is in lib/site.ts. Photos are the
 * site's existing library — no locality-specific photography exists yet, so
 * swap `gallery` images when real ones are shot.
 */

import { areaGroups } from '@/lib/site';
import type { Faq } from './marketing';

export type AreaPhoto = { src: string; alt: string };

export type AreaEntry = {
  /** Route slug, /areas-we-serve/<id>/. Must match an entry in `areaGroups`. */
  id: string;
  /** Display name — must equal the string in lib/site.ts `areaGroups`. */
  name: string;
  /** `areaGroups[].id` this locality sits in. */
  corridorId: string;
  /** `stores[].id` of the nearest store. */
  nearestStoreId: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: AreaPhoto;
  headline: string;
  intro: string;
  localNotes: readonly string[];
  /** Two-column story block under the intro. */
  story: { heading: string; paragraphs: readonly string[]; image: AreaPhoto };
  /** "What we collect" cards — each with its own photo. */
  collect: {
    heading: string;
    intro: string;
    cards: readonly { title: string; body: string; image: AreaPhoto; href: string }[];
  };
  /** The pickup journey, one photo per step. */
  journey: {
    heading: string;
    intro: string;
    steps: readonly { title: string; body: string; image: AreaPhoto }[];
  };
  /** `serviceEntries[].id` shown as full service cards. */
  serviceIds: readonly string[];
  /** `productEntries[].id` shown as priced item tiles. */
  productIds: readonly string[];
  storeHeading: string;
  faqHeading: string;
  faqs: readonly Faq[];
  /** Other localities named on the page — plain chips unless they have their own page. */
  nearby: readonly string[];
  finalCta: { heading: string; body: string };
};

const handWrittenAreas: readonly AreaEntry[] = [
  {
    id: 'ardee-city',
    name: 'Ardee City',
    corridorId: 'dlf-golf-course',
    nearestStoreId: 'super-mart-1',
    metaTitle: 'Dry Cleaning & Laundry in Ardee City, Gurgaon | Vanzoo Free Pickup',
    metaDescription:
      'Premium dry cleaning, steam pressing, shoe and curtain care in Ardee City, Gurgaon. Italian hydrocarbon technology, free doorstep pickup and delivery, 3–5 day turnaround.',
    heroImage: {
      src: '/images/hero-valet-handover.jpg',
      alt: 'Vanzoo valet handing freshly cleaned garments in protective wrap to a customer in Gurgaon',
    },
    headline: 'Dry Cleaning & Garment Care in Ardee City, Gurgaon',
    intro:
      'Premium dry cleaning, steam pressing and fabric care, collected from your door in Ardee City and returned pressed, wrapped and ready to wear. Every piece is assessed individually and cleaned with Italian hydrocarbon technology.',
    localNotes: [
      'Free pickup and delivery to Ardee City — no minimum order.',
      'Standard turnaround is 3–5 days; same-day and next-day express on request.',
      'Served from our DLF Phase IV store, in the middle of the Golf Course Road corridor.',
      'Coverage is confirmed when you book — a handful of gated pockets need a quick call first.',
    ],
    story: {
      heading: 'Your wardrobe, handled without the errand',
      paragraphs: [
        'Between work, school runs and everything else, a trip to the dry cleaner is the first thing to slip. So we come to you. Book a slot, and a Vanzoo valet collects from your door in Ardee City.',
        'Nothing goes into a batch. Each garment is checked for fabric, stains and construction before it is treated, then finished by hand and returned wrapped, on a hanger where it should be.',
        'From daily shirts to a sherwani for the wedding season, one tariff covers it all — item-wise, published, and the same whether it is one shirt or twenty.',
      ],
      image: {
        src: '/images/service-pickup-delivery.jpg',
        alt: 'Basket of clothes ready for free Vanzoo doorstep pickup and delivery in Gurgaon',
      },
    },
    collect: {
      heading: 'What Ardee City sends us',
      intro: 'A few of the things we collect most — and how each one is looked after.',
      cards: [
        {
          title: 'Everyday & formal wardrobe',
          body: 'Shirts, trousers, suits and coats — cleaned, pressed and returned crisp, or steam-pressed only if they are already clean.',
          image: {
            src: '/images/garment-rail-couture.jpg',
            alt: 'Rail of pressed jackets and blazers ready for delivery from the Vanzoo Gurgaon atelier',
          },
          href: '/services/couture-care/',
        },
        {
          title: 'Sarees, lehengas & ethnic wear',
          body: 'Embroidery, zari and delicate dyes assessed before cleaning, then hand-finished so pleats fall as they should.',
          image: {
            src: '/images/collage-lehenga-detail.jpg',
            alt: 'Close-up of bridal lehenga embroidery being cared for by hand at Vanzoo',
          },
          href: '/services/ethnic-wear/',
        },
        {
          title: 'Home textiles & curtains',
          body: 'Bedsheets, blankets, quilts and curtains — with free curtain deinstallation and reinstallation.',
          image: {
            src: '/images/collage-folded-linens.jpg',
            alt: 'Neatly folded cleaned linens and towels after Vanzoo fabric care',
          },
          href: '/services/home-textiles/',
        },
        {
          title: 'Shoes, sneakers & bags',
          body: 'Leather, suede and sports shoes plus handbags, cleaned and conditioned material by material.',
          image: {
            src: '/images/service-shoes-bags-accessories.jpg',
            alt: 'Leather brogues and a tan leather handbag cleaned and conditioned by Vanzoo',
          },
          href: '/services/shoe-care/',
        },
      ],
    },
    journey: {
      heading: 'How pickup works in Ardee City',
      intro: 'Four steps, none of which involve leaving home.',
      steps: [
        {
          title: 'Book a slot',
          body: 'Choose a pickup time on the website or the Vanzoo app — it takes under a minute.',
          image: {
            src: '/images/process-schedule-call.jpg',
            alt: 'Customer booking a Vanzoo pickup by phone from home in Gurgaon',
          },
        },
        {
          title: 'We collect',
          body: 'Our valet collects from your door and counts the order with you.',
          image: {
            src: '/images/hero-valet-handover.jpg',
            alt: 'Vanzoo valet handing over garments in protective wrap',
          },
        },
        {
          title: 'We clean',
          body: 'Assessed piece by piece, cleaned in our closed-loop hydrocarbon system and finished by hand.',
          image: {
            src: '/images/service-hydrocarbon-machine.jpg',
            alt: 'Closed-loop hydrocarbon dry cleaning machine used at Vanzoo',
          },
        },
        {
          title: 'We deliver',
          body: 'Returned pressed and wrapped, standard in 3–5 days or express when you need it.',
          image: {
            src: '/images/process-delivered-pressed.jpg',
            alt: 'Pressed knitwear hung and ready for Vanzoo doorstep delivery',
          },
        },
      ],
    },
    serviceIds: [
      'couture-care',
      'delicate-fabrics',
      'ethnic-wear',
      'shoe-care',
      'curtain-cleaning',
      'steam-iron',
    ],
    productIds: ['shirt', 'saree', 'men-suit-2-pcs', 'curtain', 'sneakers-shoes', 'double-blanket'],
    storeHeading: 'Nearest store to Ardee City',
    faqHeading: 'Ardee City — what people ask',
    faqs: [
      {
        question: 'Do you offer free pickup in Ardee City?',
        answer:
          'Yes. Pickup and delivery are free in Ardee City with no minimum order. Coverage is confirmed when you book.',
      },
      {
        question: 'How long does dry cleaning take?',
        answer:
          'Standard turnaround is 3–5 days. Same-day and next-day express options are available, subject to pickup location, timing and availability.',
      },
      {
        question: 'Can I get just my clothes ironed?',
        answer:
          'Yes. Steam Press is a separate, lower-priced service for clothes that are already clean and only need a sharp finish.',
      },
      {
        question: 'How is pricing worked out?',
        answer:
          'Item by item, from the published tariff — you can add items to the cart on the pricing page. Some rows are starting-from prices, so the final quote is confirmed once we see the item.',
      },
      {
        question: 'Can you clean curtains, blankets and quilts?',
        answer:
          'Yes. Curtain cleaning includes free deinstallation and reinstallation, and blankets, quilts and bedsheets are collected free like everything else.',
      },
      {
        question: 'Do you clean delicate fabrics and embroidered wear?',
        answer:
          'Yes. Each piece is assessed individually and treated according to its fabric, embellishment and care label, then finished by hand.',
      },
      {
        question: 'Is there a store I can visit near Ardee City?',
        answer:
          'Our DLF Phase IV store, Super Mart 1, serves the Golf Course Road corridor. We also have a store at M3M Urbana, Sector 67. Directions are on this page.',
      },
    ],
    nearby: [
      'DLF Phase 4',
      'DLF Phase 5',
      'Sushant Lok 1',
      'Golf Course Road',
      'Nirvana Country',
      'Sector 55',
      'Sector 56',
      'Sector 57',
    ],
    finalCta: {
      heading: 'Free pickup in Ardee City',
      body: 'Book a slot and a valet collects from your door. Standard turnaround is 3–5 days, with same-day and next-day express options.',
    },
  },
];

/* ------------------------------------------------------------------------- */
/* Generated pages — one per remaining `areaGroups` locality                 */
/* ------------------------------------------------------------------------- */

type CorridorId = (typeof areaGroups)[number]['id'];
type StoreId = 'super-mart-1' | 'vanzoo-urbana';

/** The photo library the profiles draw on — the site's existing images. */
const photos = {
  valet: {
    src: '/images/hero-valet-handover.jpg',
    alt: 'Vanzoo valet handing freshly cleaned garments in protective wrap to a customer in Gurgaon',
  },
  basket: {
    src: '/images/service-pickup-delivery.jpg',
    alt: 'Basket of clothes ready for free Vanzoo doorstep pickup and delivery in Gurgaon',
  },
  rail: {
    src: '/images/garment-rail-couture.jpg',
    alt: 'Rail of pressed jackets and blazers ready for delivery from the Vanzoo Gurgaon atelier',
  },
  suit: {
    src: '/images/service-bespoke-suit-couture.jpg',
    alt: 'Bespoke suit hanging after couture dry cleaning at Vanzoo Gurgaon',
  },
  lehenga: {
    src: '/images/collage-lehenga-detail.jpg',
    alt: 'Close-up of bridal lehenga embroidery being cared for by hand at Vanzoo',
  },
  heirloom: {
    src: '/images/collage-family-heirloom.jpg',
    alt: 'Family heirloom garment being inspected before careful cleaning at Vanzoo',
  },
  linens: {
    src: '/images/collage-folded-linens.jpg',
    alt: 'Neatly folded cleaned linens and towels after Vanzoo fabric care',
  },
  curtains: {
    src: '/images/service-curtain-cleaning.jpg',
    alt: 'Freshly cleaned curtains rehung by the Vanzoo team in a Gurgaon home',
  },
  shoes: {
    src: '/images/service-shoes-bags-accessories.jpg',
    alt: 'Leather brogues and a tan leather handbag cleaned and conditioned by Vanzoo',
  },
  delicates: {
    src: '/images/service-silk-wool-delicates.jpg',
    alt: 'Folded silk, wool and cashmere garments after gentle hydrocarbon dry cleaning',
  },
  corporate: {
    src: '/images/persona-corporate-professionals.jpg',
    alt: 'Gurgaon professional in a freshly pressed suit, collected and delivered by Vanzoo',
  },
  phone: {
    src: '/images/process-schedule-call.jpg',
    alt: 'Customer booking a Vanzoo pickup by phone from home in Gurgaon',
  },
  machine: {
    src: '/images/service-hydrocarbon-machine.jpg',
    alt: 'Closed-loop hydrocarbon dry cleaning machine used at Vanzoo',
  },
  delivered: {
    src: '/images/process-delivered-pressed.jpg',
    alt: 'Pressed knitwear hung and ready for Vanzoo doorstep delivery',
  },
} satisfies Record<string, AreaPhoto>;

type CollectCard = AreaEntry['collect']['cards'][number];

/** "What we collect" cards, picked per corridor. */
const cards = {
  wardrobe: {
    title: 'Everyday & formal wardrobe',
    body: 'Shirts, trousers, suits and coats — cleaned, pressed and returned crisp, or steam-pressed only if they are already clean.',
    image: photos.rail,
    href: '/services/couture-care/',
  },
  workwear: {
    title: 'Suits & workwear',
    body: 'Suits, blazers and work shirts cleaned and pressed for the week ahead, with express turnaround when a meeting is tomorrow.',
    image: photos.suit,
    href: '/services/couture-care/',
  },
  steam: {
    title: 'Steam press only',
    body: 'Already clean but creased? Steam Press is a separate, lower-priced service that returns a sharp finish.',
    image: photos.delivered,
    href: '/services/steam-iron/',
  },
  ethnic: {
    title: 'Sarees, lehengas & ethnic wear',
    body: 'Embroidery, zari and delicate dyes assessed before cleaning, then hand-finished so pleats fall as they should.',
    image: photos.lehenga,
    href: '/services/ethnic-wear/',
  },
  heirloom: {
    title: 'Heirlooms & occasion pieces',
    body: 'The sherwani, the wedding saree, the shawl that has been in the family for years — assessed first, treated gently, finished by hand.',
    image: photos.heirloom,
    href: '/services/delicate-fabrics/',
  },
  delicates: {
    title: 'Silk, wool & cashmere',
    body: 'Delicate fibres cleaned in our gentle hydrocarbon process, which is kinder to colour and texture than conventional solvents.',
    image: photos.delicates,
    href: '/services/delicate-fabrics/',
  },
  home: {
    title: 'Home textiles & curtains',
    body: 'Bedsheets, blankets, quilts and curtains — with free curtain deinstallation and reinstallation.',
    image: photos.linens,
    href: '/services/home-textiles/',
  },
  curtains: {
    title: 'Curtains & carpets',
    body: 'Curtains taken down, cleaned and rehung at no extra charge, and carpets collected and cleaned to suit the weave.',
    image: photos.curtains,
    href: '/services/curtain-cleaning/',
  },
  shoes: {
    title: 'Shoes, sneakers & bags',
    body: 'Leather, suede and sports shoes plus handbags, cleaned and conditioned material by material.',
    image: photos.shoes,
    href: '/services/shoe-care/',
  },
} satisfies Record<string, CollectCard>;

/**
 * One profile per corridor: the copy, photos, services and items every
 * locality in that corridor shares. `{area}` is replaced with the locality name.
 */
type CorridorProfile = {
  /** Default store for the corridor; `storeOverrides` below can change it per locality. */
  storeId: StoreId;
  heroImage: AreaPhoto;
  metaFocus: string;
  intro: string;
  corridorNote: string;
  story: AreaEntry['story'];
  collectHeading: string;
  collectIntro: string;
  cards: readonly CollectCard[];
  serviceIds: readonly string[];
  productIds: readonly string[];
  faqs: readonly Faq[];
};

const corridorProfiles: Record<CorridorId, CorridorProfile> = {
  'dlf-golf-course': {
    storeId: 'super-mart-1',
    heroImage: photos.valet,
    metaFocus: 'dry cleaning, steam pressing, shoe and curtain care',
    intro:
      'Premium dry cleaning, steam pressing and fabric care, collected from your door in {area} and returned pressed, wrapped and ready to wear. Every piece is assessed individually and cleaned with Italian hydrocarbon technology.',
    corridorNote: 'Part of the DLF & Golf Course Road corridor — the fastest turnaround we run.',
    story: {
      heading: 'Our home corridor',
      paragraphs: [
        'Our DLF Phase IV store sits in the middle of the DLF & Golf Course Road corridor, and {area} is part of it. That makes it the quickest route we run — book a slot and a Vanzoo valet collects from your door.',
        'Nothing goes into a batch. Each garment is checked for fabric, stains and construction before it is treated, then finished by hand and returned wrapped, on a hanger where it should be.',
        'From daily shirts to a sherwani for the wedding season, one tariff covers it all — item-wise, published, and the same whether it is one shirt or twenty.',
      ],
      image: photos.basket,
    },
    collectHeading: 'What {area} sends us',
    collectIntro: 'A few of the things we collect most — and how each one is looked after.',
    cards: [cards.wardrobe, cards.ethnic, cards.home, cards.shoes],
    serviceIds: ['couture-care', 'delicate-fabrics', 'ethnic-wear', 'shoe-care', 'curtain-cleaning', 'steam-iron'],
    productIds: ['shirt', 'saree', 'men-suit-2-pcs', 'curtain', 'sneakers-shoes', 'double-blanket'],
    faqs: [
      {
        question: 'Do you clean shoes and handbags too?',
        answer:
          'Yes. Leather, suede and sports shoes and leather handbags are cleaned and conditioned material by material, and collected with the rest of your order.',
      },
    ],
  },
  'golf-course-extension': {
    storeId: 'vanzoo-urbana',
    heroImage: photos.basket,
    metaFocus: 'dry cleaning, curtain and blanket cleaning, ethnic wear care',
    intro:
      'Dry cleaning, home textile care and hand-finished ethnic wear, collected free from your door in {area}. Every piece is assessed on its own and cleaned with Italian hydrocarbon technology.',
    corridorNote: 'Part of our Golf Course Extension & Sohna Road route, which runs down to Badshahpur.',
    story: {
      heading: 'Big wardrobes, busy weeks',
      paragraphs: [
        'Family homes send us a bit of everything — school uniforms and office shirts, a lehenga after a wedding, the curtains before Diwali. In {area}, one pickup covers all of it.',
        'Each item is checked for fabric, stains and construction before it is cleaned, so the cotton bedsheet and the embroidered dupatta each get the treatment they need.',
        'Pricing is item by item from a published tariff, with no minimum order — so a single blanket is as welcome as a full wardrobe.',
      ],
      image: photos.linens,
    },
    collectHeading: 'What we collect in {area}',
    collectIntro: 'The things households here send us most — and how each one is looked after.',
    cards: [cards.home, cards.ethnic, cards.wardrobe, cards.curtains],
    serviceIds: ['home-textiles', 'curtain-cleaning', 'ethnic-wear', 'couture-care', 'carpet-cleaning', 'steam-iron'],
    productIds: ['double-blanket', 'curtain', 'lehenga', 'shirt', 'double-bedsheet', 'kurta'],
    faqs: [
      {
        question: 'Can you take down and rehang curtains?',
        answer:
          'Yes. Curtain cleaning includes free deinstallation and reinstallation — our team takes them down at pickup and rehangs them on delivery.',
      },
    ],
  },
  'sector-65-70': {
    storeId: 'vanzoo-urbana',
    heroImage: photos.curtains,
    metaFocus: 'dry cleaning, curtain, carpet and delicate fabric care',
    intro:
      'Dry cleaning, curtain and carpet care and gentle treatment for delicates, collected free from your door in {area}. Served from our Vanzoo Urbana store at M3M Urbana, Sector 67.',
    corridorNote: 'Served from the Vanzoo Urbana store at M3M Urbana, Sector 67.',
    story: {
      heading: 'Served from our Sector 67 store',
      paragraphs: [
        'Our Vanzoo Urbana store at M3M Urbana serves Sectors 65–70, including the M3M, Emaar and Tulip developments. {area} is on its route — book a slot and a valet collects from your door.',
        'Apartments here send us a lot of soft furnishings: curtains, carpets, quilts. Curtains are taken down and rehung free, and every item is assessed before it is cleaned.',
        'Silk, wool and cashmere go through our gentle hydrocarbon process, which is kinder to colour and texture than conventional solvents, and come back finished by hand.',
      ],
      image: photos.curtains,
    },
    collectHeading: 'What {area} sends us',
    collectIntro: 'A few of the things we collect most — and how each one is looked after.',
    cards: [cards.curtains, cards.delicates, cards.wardrobe, cards.shoes],
    serviceIds: ['curtain-cleaning', 'carpet-cleaning', 'delicate-fabrics', 'couture-care', 'shoe-care', 'steam-iron'],
    productIds: ['curtain', 'carpet', 'sweater', 'dress', 'men-suit-2-pcs', 'leather-shoes'],
    faqs: [
      {
        question: 'Do you clean carpets?',
        answer:
          'Yes. Carpets are collected from your home, cleaned to suit the weave and material, and returned with the rest of your order.',
      },
    ],
  },
  'old-gurgaon': {
    storeId: 'super-mart-1',
    heroImage: photos.heirloom,
    metaFocus: 'dry cleaning, saree and ethnic wear care, steam pressing',
    intro:
      'Dry cleaning, hand-finished ethnic wear and careful treatment for the pieces that matter, collected free from your door in {area}. Every garment is assessed individually and cleaned with Italian hydrocarbon technology.',
    corridorNote: 'Part of our Old Gurgaon & MG Road route — the original city centre and Civil Lines.',
    story: {
      heading: 'Careful with the pieces that matter',
      paragraphs: [
        'Some wardrobes carry history: a wedding saree, a sherwani worn once a year, a shawl passed down. In {area}, we collect them from your door and treat each one as the individual piece it is.',
        'Embroidery, zari and delicate dyes are assessed before anything touches them. Cleaning is gentle and closed-loop, and finishing is done by hand so drape and pleats fall as they should.',
        'Everyday shirts and trousers come along in the same pickup, from the same published, item-wise tariff.',
      ],
      image: photos.lehenga,
    },
    collectHeading: 'What we collect in {area}',
    collectIntro: 'From everyday wear to the pieces that come out for occasions.',
    cards: [cards.ethnic, cards.heirloom, cards.wardrobe, cards.home],
    serviceIds: ['ethnic-wear', 'delicate-fabrics', 'couture-care', 'steam-iron', 'home-textiles', 'express-service'],
    productIds: ['saree', 'sherwani', 'lehenga', 'shawl', 'kurta', 'shirt'],
    faqs: [
      {
        question: 'Can you clean heavily embroidered sarees and lehengas?',
        answer:
          'Yes. Embroidered and zari work is assessed before cleaning and treated according to its fabric and embellishment, then finished by hand.',
      },
    ],
  },
  'cyber-city': {
    storeId: 'super-mart-1',
    heroImage: photos.corporate,
    metaFocus: 'dry cleaning, suit care, steam pressing and express service',
    intro:
      'Suits, shirts and workwear cleaned and pressed, collected free from your home or office in {area}. Every piece is assessed individually and cleaned with Italian hydrocarbon technology — with express turnaround when you need it.',
    corridorNote: 'Part of our Cyber City & Udyog Vihar route — we collect from offices as well as homes.',
    story: {
      heading: 'Pressed for Monday, without the errand',
      paragraphs: [
        'Our Cyber City & Udyog Vihar route handles corporate pickups from the office parks as well as the residential pockets around them. In {area}, book a slot and we collect from wherever suits you.',
        'Suits and blazers are cleaned and hand-finished so they hold their shape; shirts come back crisp. If something is already clean and just creased, Steam Press is the lower-priced option.',
        'Standard turnaround is 3–5 days. Same-day and next-day express are available on request, subject to pickup location, timing and availability.',
      ],
      image: photos.suit,
    },
    collectHeading: 'What {area} sends us',
    collectIntro: 'Mostly the working wardrobe — and how each piece is looked after.',
    cards: [cards.workwear, cards.steam, cards.delicates, cards.shoes],
    serviceIds: ['couture-care', 'steam-iron', 'express-service', 'delicate-fabrics', 'shoe-care', 'pickup-delivery'],
    productIds: ['shirt', 'men-suit-2-pcs', 'pant-trouser', 'coat', 'waist-coat', 'leather-shoes'],
    faqs: [
      {
        question: 'Can you collect from my office?',
        answer:
          'Yes. Our Cyber City & Udyog Vihar route includes corporate pickups from the office parks. Choose a slot and tell us where to collect when you book.',
      },
    ],
  },
  'new-gurgaon': {
    storeId: 'super-mart-1',
    heroImage: photos.valet,
    metaFocus: 'dry cleaning, curtain, carpet and blanket cleaning',
    intro:
      'Dry cleaning, curtain and carpet care and home textile cleaning, collected free from your door in {area}. Every piece is assessed individually and cleaned with Italian hydrocarbon technology.',
    corridorNote: 'Part of our New Gurgaon & Dwarka Expressway route — newer sectors are confirmed with a quick call.',
    story: {
      heading: 'Settling in, sorted',
      paragraphs: [
        'Our New Gurgaon & Dwarka Expressway route covers the newer sectors along NH-48 and the Expressway, and west towards Palam Vihar. {area} is on it — book a slot and a valet collects from your door.',
        'New homes send us curtains, carpets, quilts and blankets as often as clothes. Curtains are taken down and rehung free, and everything is assessed before it is cleaned.',
        'Pricing is item by item from a published tariff, with no minimum order and no pickup charge.',
      ],
      image: photos.basket,
    },
    collectHeading: 'What we collect in {area}',
    collectIntro: 'The things we collect most here — and how each one is looked after.',
    cards: [cards.curtains, cards.home, cards.wardrobe, cards.shoes],
    serviceIds: ['curtain-cleaning', 'carpet-cleaning', 'home-textiles', 'couture-care', 'shoe-care', 'steam-iron'],
    productIds: ['curtain', 'carpet', 'double-blanket', 'shirt', 'jacket', 'sports-shoes'],
    faqs: [
      {
        question: 'Is my sector covered?',
        answer:
          'We run pickups across New Gurgaon and the Dwarka Expressway. Some newer sectors and gated pockets need a quick call first — coverage is confirmed when you book.',
      },
    ],
  },
};

/**
 * Localities whose nearest store differs from their corridor's default.
 * Golf Course Extension is split: the sectors off Golf Course Road are nearer
 * DLF Phase IV; those towards Sohna Road are nearer Sector 67. On the far
 * side of NH-48, the sectors along the Southern Peripheral Road go to Sector 67.
 */
const storeOverrides: Partial<Record<string, StoreId>> = {
  'Sector 55': 'super-mart-1',
  'Sector 56': 'super-mart-1',
  'Sector 57': 'super-mart-1',
  'Sector 81': 'vanzoo-urbana',
  'Sector 82': 'vanzoo-urbana',
  'Sector 84': 'vanzoo-urbana',
  'Sector 86': 'vanzoo-urbana',
  'Sector 92': 'vanzoo-urbana',
};

/** Localities that are home to a store — they get a "we're right here" note. */
const storeHosts: Partial<Record<string, string>> = {
  'DLF Phase 4': 'Our Super Mart 1 store is right here in DLF Phase IV — drop in, or book a pickup.',
  'Sector 67': 'Our Vanzoo Urbana store is right here at M3M Urbana, Sector 67 — drop in, or book a pickup.',
  'M3M Urbana': 'Our Vanzoo Urbana store is right here in M3M Urbana — drop in, or book a pickup.',
};

const storeNames: Record<StoreId, string> = {
  'super-mart-1': 'our DLF Phase IV store, Super Mart 1',
  'vanzoo-urbana': 'our Vanzoo Urbana store at M3M Urbana, Sector 67',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildArea(name: string, corridorId: CorridorId, peers: readonly string[]): AreaEntry {
  const profile = corridorProfiles[corridorId];
  const fill = (text: string) => text.replaceAll('{area}', name);
  const storeId = storeOverrides[name] ?? profile.storeId;
  const storeName = storeNames[storeId];
  const otherStoreName = storeNames[storeId === 'super-mart-1' ? 'vanzoo-urbana' : 'super-mart-1'];

  return {
    id: slugify(name),
    name,
    corridorId,
    nearestStoreId: storeId,
    metaTitle: `Dry Cleaning & Laundry in ${name}, Gurgaon | Vanzoo Free Pickup`,
    metaDescription: `Premium ${profile.metaFocus} in ${name}, Gurgaon. Italian hydrocarbon technology, free doorstep pickup and delivery, 3–5 day turnaround.`,
    heroImage: profile.heroImage,
    headline: `Dry Cleaning & Garment Care in ${name}, Gurgaon`,
    intro: fill(profile.intro),
    localNotes: [
      `Free pickup and delivery to ${name} — no minimum order.`,
      'Standard turnaround is 3–5 days; same-day and next-day express on request.',
      storeHosts[name] ?? `Served from ${storeName}.`,
      profile.corridorNote,
    ],
    story: {
      heading: profile.story.heading,
      paragraphs: profile.story.paragraphs.map(fill),
      image: profile.story.image,
    },
    collect: {
      heading: fill(profile.collectHeading),
      intro: profile.collectIntro,
      cards: profile.cards,
    },
    journey: {
      heading: `How pickup works in ${name}`,
      intro: 'Four steps, none of which involve leaving home.',
      steps: [
        {
          title: 'Book a slot',
          body: 'Choose a pickup time on the website or the Vanzoo app — it takes under a minute.',
          image: photos.phone,
        },
        {
          title: 'We collect',
          body: `Our valet collects from your door in ${name} and counts the order with you.`,
          image: {
            src: photos.valet.src,
            alt: 'Vanzoo valet handing over garments in protective wrap',
          },
        },
        {
          title: 'We clean',
          body: 'Assessed piece by piece, cleaned in our closed-loop hydrocarbon system and finished by hand.',
          image: photos.machine,
        },
        {
          title: 'We deliver',
          body: 'Returned pressed and wrapped, standard in 3–5 days or express when you need it.',
          image: photos.delivered,
        },
      ],
    },
    serviceIds: profile.serviceIds,
    productIds: profile.productIds,
    storeHeading: storeHosts[name] ? `Our store in ${name}` : `Nearest store to ${name}`,
    faqHeading: `${name} — what people ask`,
    faqs: [
      {
        question: `Do you offer free pickup in ${name}?`,
        answer: `Yes. Pickup and delivery are free in ${name} with no minimum order. Coverage is confirmed when you book.`,
      },
      {
        question: 'How long does dry cleaning take?',
        answer:
          'Standard turnaround is 3–5 days. Same-day and next-day express options are available, subject to pickup location, timing and availability.',
      },
      ...profile.faqs,
      {
        question: 'Can I get just my clothes ironed?',
        answer:
          'Yes. Steam Press is a separate, lower-priced service for clothes that are already clean and only need a sharp finish.',
      },
      {
        question: 'How is pricing worked out?',
        answer:
          'Item by item, from the published tariff — you can add items to the cart on the pricing page. Some rows are starting-from prices, so the final quote is confirmed once we see the item.',
      },
      {
        question: `Is there a store I can visit near ${name}?`,
        answer: `Yes — ${storeName}. We also have ${otherStoreName}. Directions to both are on this page.`,
      },
    ],
    nearby: peers.filter((peer) => peer !== name),
    finalCta: {
      heading: `Free pickup in ${name}`,
      body: 'Book a slot and a valet collects from your door. Standard turnaround is 3–5 days, with same-day and next-day express options.',
    },
  };
}

const generatedAreas: readonly AreaEntry[] = areaGroups.flatMap((group) =>
  group.areas
    .filter((name) => !handWrittenAreas.some((area) => area.name === name))
    .map((name) => buildArea(name, group.id, group.areas)),
);

export const areaEntries: readonly AreaEntry[] = [...handWrittenAreas, ...generatedAreas];

export function getArea(id: string): AreaEntry | undefined {
  return areaEntries.find((area) => area.id === id);
}

/** Whether a locality name from `areaGroups` has its own page — chips link if so. */
export function areaPageFor(name: string): AreaEntry | undefined {
  return areaEntries.find((area) => area.name === name);
}
