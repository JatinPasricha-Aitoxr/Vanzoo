/**
 * Search landing pages for the two "best dry cleaning" queries:
 *   /best-dry-cleaners-near-me/       — proximity: stores, pincode, localities
 *   /best-dry-cleaning-in-gurgaon/    — quality: technology, process, range
 *
 * "Best" is the search term people type, not a claim we can prove, so neither
 * page asserts a ranking, award or rating. Each instead sets out what a good
 * dry cleaner should do and shows how Vanzoo does it, using only claims the
 * site already makes (hydrocarbon process, 99% solvent recovery, individual
 * assessment, hand finishing, free pickup, 3–5 day / express turnaround, the
 * two stores).
 */

import type { ComparisonRow } from '@/components/ComparisonTable';
import type { FeatureGridItem } from '@/components/FeatureGrid';
import type { Faq } from './marketing';

export type LandingPage = {
  path: string;
  /** Short name for breadcrumbs and the site map. */
  name: string;
  metaTitle: string;
  metaDescription: string;
  hero: { eyebrow: string; title: string; intro: string; image: string; imageAlt: string };
  /** What to look for — numbered cards, each answered with how Vanzoo does it. */
  checklist: { eyebrow: string; heading: string; intro: string; items: readonly FeatureGridItem[] };
  /** Which of the two "where we are" blocks leads the page. */
  focus: 'near-me' | 'city';
  coverage: { eyebrow: string; heading: string; intro: string };
  comparison: { heading: string; intro: string; columns: readonly [string, string]; rows: readonly ComparisonRow[] };
  serviceIds: readonly string[];
  productIds: readonly string[];
  faqs: readonly Faq[];
  finalCta: { heading: string; body: string };
};

const hydrocarbonRows: readonly ComparisonRow[] = [
  { label: 'Cleans without PERC (perchloroethylene)', values: [true, false] },
  { label: 'Closed-loop system — solvent vapour stays sealed in the machine', values: [true, false] },
  { label: 'Around 99% of solvent recovered and reused each cycle', values: [true, false] },
  { label: 'Lower temperatures and gentler action for silk, cashmere and embellishment', values: [true, false] },
  { label: 'No harsh chemical odour on the finished garment', values: [true, false] },
];

export const nearMePage: LandingPage = {
  path: '/best-dry-cleaners-near-me/',
  name: 'Best Dry Cleaners Near Me',
  metaTitle: 'Best Dry Cleaners Near Me in Gurgaon | Free Pickup | Vanzoo',
  metaDescription:
    'Looking for a good dry cleaner near you in Gurgaon? Vanzoo collects from your door across 49 localities, free — hydrocarbon dry cleaning, hand finishing, 3–5 day turnaround and express options. Two stores: DLF Phase IV and Sector 67.',
  hero: {
    eyebrow: 'Dry cleaners near me',
    title: 'A dry cleaner near you — that comes to your door',
    intro:
      'The nearest dry cleaner is the one that collects from home. Vanzoo picks up free across Gurgaon, cleans every piece with Italian hydrocarbon technology, and returns it pressed and wrapped.',
    image: '/images/hero-valet-handover.jpg',
    imageAlt: 'Vanzoo valet handing freshly cleaned garments in protective wrap to a customer in Gurgaon',
  },
  checklist: {
    eyebrow: 'Choosing a dry cleaner nearby',
    heading: 'What to look for in a dry cleaner near you',
    intro: 'Distance matters less than you think. These matter more — and here is how we handle each.',
    items: [
      {
        title: 'Pickup and delivery',
        body: 'A dry cleaner "near you" should not need a trip. Vanzoo collects from your door and delivers back free, with no minimum order.',
      },
      {
        title: 'A turnaround you can plan around',
        body: 'Standard is 3–5 days. Same-day and next-day express are available when you need something sooner.',
      },
      {
        title: 'Every piece checked first',
        body: 'Fabric, stains and construction are assessed before cleaning, so each garment gets the treatment it needs rather than a batch cycle.',
      },
      {
        title: 'A gentler cleaning process',
        body: 'We use a closed-loop hydrocarbon system instead of PERC — kinder to fabrics, skin and the environment.',
      },
      {
        title: 'Published prices',
        body: 'Item-wise tariff on the website, so you know the price before you book. No hidden charges.',
      },
      {
        title: 'A real store to walk into',
        body: 'Two Gurgaon stores — Super Mart 1 in DLF Phase IV and Vanzoo Urbana at M3M Urbana, Sector 67.',
      },
    ],
  },
  focus: 'near-me',
  coverage: {
    eyebrow: 'Find your area',
    heading: 'Is Vanzoo near you?',
    intro: 'Pick your locality to see its page — or enter your pincode to check free pickup.',
  },
  comparison: {
    heading: 'Not every dry cleaner cleans the same way',
    intro: 'Most conventional dry cleaning still uses PERC. Here is what our hydrocarbon process does differently.',
    columns: ['Vanzoo (hydrocarbon)', 'Conventional (PERC)'],
    rows: hydrocarbonRows,
  },
  serviceIds: ['couture-care', 'steam-iron', 'express-service', 'ethnic-wear', 'shoe-care', 'curtain-cleaning'],
  productIds: ['shirt', 'pant-trouser', 'men-suit-2-pcs', 'saree', 'sneakers-shoes', 'curtain'],
  faqs: [
    {
      question: 'Is there a Vanzoo dry cleaner near me?',
      answer:
        'We have two stores in Gurgaon — Super Mart 1 in DLF Phase IV and Vanzoo Urbana at M3M Urbana, Sector 67 — and free pickup across 49 localities. Enter your pincode on this page to check yours.',
    },
    {
      question: 'Do I have to visit the store?',
      answer:
        'No. Book a pickup on the website or the Vanzoo app and a valet collects from your door. Delivery back is free too, with no minimum order.',
    },
    {
      question: 'How quickly can I get my clothes back?',
      answer:
        'Standard turnaround is 3–5 days. Same-day and next-day express options are available, subject to pickup location, timing and availability.',
    },
    {
      question: 'How much does dry cleaning cost?',
      answer:
        'Pricing is item by item from our published tariff — see the pricing page. Some rows are starting-from prices, so the final quote is confirmed once we see the item.',
    },
    {
      question: 'Do you only iron clothes as well?',
      answer:
        'Yes. Steam Press is a separate, lower-priced service for clothes that are already clean and only need a sharp finish.',
    },
    {
      question: 'What if my area is not listed?',
      answer:
        'Call us — coverage grows faster than the list does, and a few gated pockets and newer sectors just need a quick call to confirm.',
    },
  ],
  finalCta: {
    heading: 'The nearest dry cleaner is your front door',
    body: 'Book a slot and a valet collects from you, free. Standard turnaround is 3–5 days, with same-day and next-day express options.',
  },
};

export const gurgaonPage: LandingPage = {
  path: '/best-dry-cleaning-in-gurgaon/',
  name: 'Best Dry Cleaning in Gurgaon',
  metaTitle: 'Best Dry Cleaning in Gurgaon | Hydrocarbon Dry Clean | Vanzoo',
  metaDescription:
    'Premium dry cleaning in Gurgaon with Italian hydrocarbon technology — no PERC, 99% solvent recovery, individual assessment and hand finishing. Suits, sarees, lehengas, shoes, curtains and more, with free pickup and delivery.',
  hero: {
    eyebrow: 'Dry cleaning in Gurgaon',
    title: 'Premium dry cleaning in Gurgaon, done properly',
    intro:
      'Italian hydrocarbon technology, individual assessment and hand finishing — for everything from daily shirts to bridal lehengas. Collected free from anywhere we serve in Gurgaon.',
    image: '/images/garment-rail-couture.jpg',
    imageAlt: 'Rail of pressed jackets and blazers ready for delivery from the Vanzoo Gurgaon atelier',
  },
  checklist: {
    eyebrow: 'What sets good dry cleaning apart',
    heading: 'What the best dry cleaning in Gurgaon should include',
    intro: 'The standard we hold ourselves to — and the questions worth asking any dry cleaner.',
    items: [
      {
        title: 'A modern cleaning process',
        body: 'Closed-loop Italian hydrocarbon systems in place of PERC, recovering around 99% of solvent each cycle.',
      },
      {
        title: 'Individual assessment',
        body: 'Every piece is checked for fabric, stains and construction before it is treated — nothing goes into a batch.',
      },
      {
        title: 'Specialist care by category',
        body: 'Couture, silks and delicates, ethnic and bridal wear, shoes, bags and leather, curtains and carpets — each handled on its own terms.',
      },
      {
        title: 'Hand finishing',
        body: 'Pressed and finished by hand, then inspected before it is packed in protective wrapping.',
      },
      {
        title: 'Transparent pricing',
        body: 'Item-wise, published tariff with no minimum order and no hidden charges.',
      },
      {
        title: 'Citywide convenience',
        body: 'Free pickup and delivery across six corridors of Gurgaon, with same-day and next-day express on request.',
      },
    ],
  },
  focus: 'city',
  coverage: {
    eyebrow: 'Across Gurgaon',
    heading: 'Free pickup, corridor by corridor',
    intro: 'Two stores and 49 localities across the city. Tap a locality to see its page.',
  },
  comparison: {
    heading: 'Hydrocarbon vs. conventional dry cleaning',
    intro: 'Why we chose Italian hydrocarbon technology over the PERC process most dry cleaning still relies on.',
    columns: ['Vanzoo (hydrocarbon)', 'Conventional (PERC)'],
    rows: hydrocarbonRows,
  },
  serviceIds: ['couture-care', 'delicate-fabrics', 'ethnic-wear', 'bags-leather-care', 'curtain-cleaning', 'carpet-cleaning'],
  productIds: ['men-suit-2-pcs', 'lehenga', 'saree', 'leather-jacket', 'leather-handbag', 'carpet'],
  faqs: [
    {
      question: 'What makes Vanzoo different from other dry cleaners in Gurgaon?',
      answer:
        'We clean with closed-loop Italian hydrocarbon technology rather than PERC, assess every piece individually, and finish by hand — with free pickup and delivery across the city.',
    },
    {
      question: 'Is hydrocarbon dry cleaning safe for delicate and designer clothes?',
      answer:
        'Yes. It runs at lower temperatures with gentler action than older solvent systems, which is why it suits silk, cashmere, embellishment and hand-finished couture.',
    },
    {
      question: 'Do you dry clean sarees, lehengas and sherwanis?',
      answer:
        'Yes. Embroidery, zari and delicate dyes are assessed before cleaning, then each piece is hand-finished so drape and pleats fall as they should.',
    },
    {
      question: 'Which areas of Gurgaon do you cover?',
      answer:
        'DLF Phases 1–5 and Golf Course Road, Golf Course Extension and Sohna Road, Sectors 65–70, Old Gurgaon and MG Road, Cyber City and Udyog Vihar, and New Gurgaon along the Dwarka Expressway. See the full list on this page.',
    },
    {
      question: 'How long does dry cleaning take?',
      answer:
        'Standard turnaround is 3–5 days. Same-day and next-day express options are available, subject to pickup location, timing and availability.',
    },
    {
      question: 'Do you clean shoes, bags, curtains and carpets too?',
      answer:
        'Yes. Shoes and bags are cleaned and conditioned material by material, curtains come with free deinstallation and reinstallation, and carpets are collected from your home.',
    },
  ],
  finalCta: {
    heading: 'Premium dry cleaning, collected from your door',
    body: 'Free pickup and delivery across Gurgaon. Standard turnaround is 3–5 days, with same-day and next-day express options.',
  },
};

export const landingPages = [nearMePage, gurgaonPage] as const;
