/**
 * The full service catalogue for /services/.
 *
 * Twelve services: the six the homepage carries (wording preserved from
 * content/marketing.ts, itself carried over from vanzoo.in) plus the six the
 * footer's "Our Services" list and the tariff tables imply but no page has ever
 * described. Copy for those six is AUTHORED in the same voice.
 *
 * `from` cites the relevant published tariff, kept in lockstep with
 * content/pricing.ts by importing the amounts rather than restating them —
 * if a tariff changes there, the services page follows.
 */

import { coutureCatalog, steamIronCatalog } from './pricing';

export type ServiceEntry = {
  /** Anchor id — the footer's service links point at /services/#<id>. */
  id: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  /** "Starting from ₹x" line; null for services without a per-item tariff. */
  from: { amount: number; note?: string } | null;
  /** Price line for services with no per-item tariff (from === null). */
  priceLine?: string;
  /** Where "View tariffs" goes — tariff page, with a group anchor when one fits. */
  tariffHref: string;
  tariffLabel: string;
};

/** Look up a published amount so the card can never drift from the tariff. */
function amountOf(catalog: typeof coutureCatalog, groupId: string, item: string): number {
  const row = catalog.groups
    .find((group) => group.id === groupId)
    ?.rows.find((entry) => entry.item === item);
  if (!row) throw new Error(`Tariff row missing: ${groupId}/${item}`);
  return row.amount;
}

export const servicesIntro =
  'Twelve ways we look after what you wear and live with — every one of them assessed piece by piece, cleaned with Italian hydrocarbon technology and finished by hand.';

export const serviceEntries: readonly ServiceEntry[] = [
  {
    id: 'couture-care',
    title: 'Bespoke Suit & Couture Care',
    body: 'Tailored for your most refined garments. We preserve the shape, structure, and elegance of custom suits and designer wear.',
    image: '/images/service-bespoke-suit-couture.jpg',
    imageAlt:
      'Bespoke two-piece suit and evening dress hanging after couture dry cleaning at Vanzoo Gurgaon',
    from: { amount: amountOf(coutureCatalog, 'mens-garments', 'Men Suit 2 Pcs') },
    tariffHref: '/couture-care-tariffs/#mens-garments',
    tariffLabel: 'View couture tariffs',
  },
  {
    id: 'delicate-fabrics',
    title: 'Silks, Wool & Delicate Fabrics',
    body: 'Gentle treatment for silks, woolens, and cashmere. We restore their natural softness and lustre without damage.',
    image: '/images/service-silk-wool-delicates.jpg',
    imageAlt:
      'Folded silk, wool and cashmere garments after gentle hydrocarbon dry cleaning in Gurgaon',
    from: { amount: amountOf(coutureCatalog, 'casual-outerwear', 'Sweater Full Sleeves') },
    tariffHref: '/couture-care-tariffs/#casual-outerwear',
    tariffLabel: 'View couture tariffs',
  },
  {
    /* AUTHORED */
    id: 'ethnic-wear',
    title: 'Sarees, Lehengas & Ethnic Wear',
    body: 'Bridal lehengas, heirloom sarees and sherwanis handled with reverence — embroidery, zari and delicate dyes protected through every step.',
    image: '/images/tariffs/lehenga.jpg',
    imageAlt: 'Embroidered bridal lehenga cared for with couture-grade cleaning at Vanzoo',
    from: { amount: amountOf(coutureCatalog, 'traditional-ethnic', 'Kurta') },
    tariffHref: '/couture-care-tariffs/#traditional-ethnic',
    tariffLabel: 'View ethnic wear tariffs',
  },
  {
    /* AUTHORED */
    id: 'shoe-care',
    title: 'Shoes & Sneaker Care',
    body: 'Leather, suede and sports shoes cleaned, conditioned and revived — soles, uppers and laces each treated the way the material asks.',
    image: '/images/tariffs/leather-shoes.jpg',
    imageAlt: 'Polished brown leather shoes after professional cleaning and conditioning at Vanzoo',
    from: { amount: amountOf(coutureCatalog, 'footwear', 'Sports Shoes') },
    tariffHref: '/couture-care-tariffs/#footwear',
    tariffLabel: 'View footwear tariffs',
  },
  {
    id: 'bags-leather-care',
    title: 'Bags & Leather Care',
    body: 'Expert care for luxury leather goods, handbags, and shoes. Cleaned, conditioned, and revived by skilled professionals.',
    image: '/images/service-shoes-bags-accessories.jpg',
    imageAlt:
      'Leather brogues and a tan leather handbag cleaned and conditioned by Vanzoo luxury accessory care',
    from: { amount: amountOf(coutureCatalog, 'accessories', 'Leather Handbag') },
    tariffHref: '/couture-care-tariffs/#accessories',
    tariffLabel: 'View accessory tariffs',
  },
  {
    /* AUTHORED */
    id: 'toys-accessories-care',
    title: 'Toys & Accessories Care',
    body: 'Soft toys and everyday accessories cleaned in the same skin-safe, toxin-free process we trust with couture — gentle enough for the nursery.',
    image: '/images/tariffs/soft-toy.jpg',
    imageAlt: 'Plush soft toy freshly cleaned with skin-safe hydrocarbon care at Vanzoo',
    from: { amount: amountOf(coutureCatalog, 'accessories', 'Soft Toy') },
    tariffHref: '/couture-care-tariffs/#accessories',
    tariffLabel: 'View accessory tariffs',
  },
  {
    id: 'curtain-cleaning',
    title: 'Curtain Cleaning',
    body: 'Professional drapery care that includes free deinstallation and reinstallation, ensuring a flawless finish every time.',
    image: '/images/service-curtain-cleaning.jpg',
    imageAlt:
      'Floor-length living room curtains professionally cleaned, deinstalled and reinstalled by Vanzoo',
    from: {
      amount: amountOf(coutureCatalog, 'home-textiles', 'Curtain (per panel)'),
      note: 'per panel',
    },
    tariffHref: '/couture-care-tariffs/#home-textiles',
    tariffLabel: 'View home textile tariffs',
  },
  {
    /* AUTHORED */
    id: 'carpet-cleaning',
    title: 'Carpet Cleaning',
    body: 'Deep, dust-free cleaning for carpets and rugs, priced by the square foot — colours refreshed and pile restored without harsh chemistry.',
    image: '/images/tariffs/carpet.jpg',
    imageAlt: 'Patterned area carpet deep-cleaned and colour-refreshed by Vanzoo in Gurgaon',
    from: {
      amount: amountOf(coutureCatalog, 'home-textiles', 'Carpet (per Sqft)'),
      note: 'per sqft',
    },
    tariffHref: '/couture-care-tariffs/#home-textiles',
    tariffLabel: 'View home textile tariffs',
  },
  {
    /* AUTHORED */
    id: 'home-textiles',
    title: 'Home Textiles',
    body: 'Blankets, quilts and bedsheets returned crisp and allergen-free — the pieces you live with, cared for like the pieces you wear.',
    image: '/images/collage-folded-linens.jpg',
    imageAlt: 'Neatly folded cleaned linens and towels after Vanzoo fabric care',
    from: { amount: amountOf(coutureCatalog, 'home-textiles', 'Single Bedsheet') },
    tariffHref: '/couture-care-tariffs/#home-textiles',
    tariffLabel: 'View home textile tariffs',
  },
  {
    /* AUTHORED */
    id: 'steam-iron',
    title: 'Steam Iron & Pressing',
    body: 'Pressing only, for garments that are already clean — professional steam finishing that returns everything sharp, soft and ready to wear.',
    image: '/images/process-delivered-pressed.jpg',
    imageAlt: 'Cream cable-knit sweater finished, pressed and hung ready for delivery by Vanzoo',
    from: { amount: amountOf(steamIronCatalog, 'everyday-wear', 'Jeans') },
    tariffHref: '/steam-iron-tariffs/',
    tariffLabel: 'View steam iron tariffs',
  },
  {
    /* AUTHORED */
    id: 'express-service',
    title: 'Express Service',
    body: 'Same-day and 2–4 hour turnarounds for the moments that cannot wait — priced on request, arranged with one call.',
    image: '/images/hero-valet-handover.jpg',
    imageAlt:
      'Vanzoo valet handing over freshly cleaned garments in protective wrap for an express order',
    from: null,
    priceLine: 'Priced on request — call to arrange',
    tariffHref: '/couture-care-tariffs/',
    tariffLabel: 'View tariffs',
  },
  {
    id: 'pickup-delivery',
    title: 'Free Pickup & Delivery',
    body: 'Enjoy seamless door-to-door service with optional same-day or 2–4 hour express turnaround.',
    image: '/images/service-pickup-delivery.jpg',
    imageAlt: 'Basket of clothes ready for free Vanzoo doorstep pickup and delivery in Gurgaon',
    from: null,
    priceLine: 'Free with every order',
    tariffHref: '/areas-we-serve/',
    tariffLabel: 'See coverage areas',
  },
];
