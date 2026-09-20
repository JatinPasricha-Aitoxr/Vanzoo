/**
 * Locality landing pages — one per neighbourhood at /areas-we-serve/[slug]/.
 *
 * Ardee City is the template. To add another area (Sector 14, DLF Phase 4…),
 * add one `AreaEntry` below; the page, sitemap and the chip link on
 * /areas-we-serve/ all pick it up with no code changes.
 *
 * Claims are limited to what Vanzoo publishes: free pickup and delivery, the
 * 3–5 day / express turnaround, the two stores in lib/site.ts, and the
 * corridor the locality belongs to. Nothing about the locality itself (distance,
 * population, landmarks) is stated unless it is in lib/site.ts. Photos are the
 * site's existing library — no locality-specific photography exists yet, so
 * swap `gallery` images when real ones are shot.
 */

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

export const areaEntries: readonly AreaEntry[] = [
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

export function getArea(id: string): AreaEntry | undefined {
  return areaEntries.find((area) => area.id === id);
}

/** Whether a locality name from `areaGroups` has its own page — chips link if so. */
export function areaPageFor(name: string): AreaEntry | undefined {
  return areaEntries.find((area) => area.name === name);
}
