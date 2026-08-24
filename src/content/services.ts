/**
 * The full service catalogue — cards on /services/ and the source for each
 * service's own page at /services/[slug]/.
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

import { coutureCatalog, steamIronCatalog, type TariffCatalog } from './pricing';

export type ServiceEntry = {
  /** Route slug — the page lives at /services/<id>/, and the footer's
   *  service links and the JSON-LD offer catalogue point at it directly. */
  id: string;
  title: string;
  body: string;
  /** Longer-form paragraph, shown on the service's own page under the hero. */
  longBody: string;
  /** Four concrete, verifiable specifics — no claim not already made elsewhere on the site. */
  highlights: readonly string[];
  /** Card thumbnail (3:2, cropped small) — kept separate from the hero because
   *  several of the closest product photos are small studio shots that would
   *  look soft stretched full-bleed. */
  image: string;
  imageAlt: string;
  /** Full-bleed photo for the service's own page. Falls back to `image` when
   *  a higher-resolution, more editorial shot isn't available for this service. */
  heroImage?: string;
  heroImageAlt?: string;
  /** "Starting from ₹x" line; null for services without a per-item tariff. */
  from: { amount: number; note?: string } | null;
  /** Price line for services with no per-item tariff (from === null). */
  priceLine?: string;
  /** Where "View tariffs" goes — tariff page, with a group anchor when one fits. */
  tariffHref: string;
  tariffLabel: string;
  /** Which tariff rows to preview on the service's own page. `groupId` omitted
   *  shows every group in the catalogue (used for steam iron, a catalogue of
   *  its own); null when the service has no per-item tariff to show. */
  tariffPreview: { catalogId: 'couture' | 'steam'; groupId?: string } | null;
};

/** Look up a published amount so the card can never drift from the tariff. */
function amountOf(catalog: TariffCatalog, groupId: string, item: string): number {
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
    longBody:
      'A bespoke suit is built from canvas, padding and hand-stitching most cleaning processes ignore. We assess every jacket and trouser individually before it goes near a machine, clean it in a closed-loop hydrocarbon system that never touches the internal structure with water, and finish it by hand — pressed on a form, not a flat board — so the drape you were fitted for comes back exactly as it left.',
    highlights: [
      'Each piece assessed individually before any treatment begins',
      'Structural padding, canvas and linings preserved through cleaning',
      'Hand-pressed and finished by trained artisans',
      'Delivered on a hanger, wrapped and ready to wear',
    ],
    image: '/images/service-bespoke-suit-couture.jpg',
    imageAlt:
      'Bespoke two-piece suit and evening dress hanging after couture dry cleaning at Vanzoo Gurgaon',
    heroImage: '/images/garment-rail-couture.jpg',
    heroImageAlt: 'Rail of pastel couture blazers cleaned and pressed at the Vanzoo Gurgaon atelier',
    from: { amount: amountOf(coutureCatalog, 'mens-garments', 'Men Suit 2 Pcs') },
    tariffHref: '/pricing/#mens-garments',
    tariffLabel: 'View couture tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'mens-garments' },
  },
  {
    id: 'delicate-fabrics',
    title: 'Silks, Wool & Delicate Fabrics',
    body: 'Gentle treatment for silks, woolens, and cashmere. We restore their natural softness and lustre without damage.',
    longBody:
      "Silk, cashmere and fine wool lose their character the moment they meet the wrong solvent or too much agitation. Our hydrocarbon process runs at lower mechanical and thermal stress than conventional dry cleaning, so fibres keep their original drape instead of stiffening or dulling. Every garment is checked for its specific weave and finish before we decide how it's cleaned — not run through a standard cycle regardless of what it is.",
    highlights: [
      'Cleaned in a closed-loop hydrocarbon system, not water or harsh solvents',
      'Natural softness and lustre restored without fibre damage',
      'Safe for silk, cashmere, wool and other delicate weaves',
      'Hand-finished before it comes back to you',
    ],
    image: '/images/service-silk-wool-delicates.jpg',
    imageAlt:
      'Folded silk, wool and cashmere garments after gentle hydrocarbon dry cleaning in Gurgaon',
    from: { amount: amountOf(coutureCatalog, 'casual-outerwear', 'Sweater Full Sleeves') },
    tariffHref: '/pricing/#casual-outerwear',
    tariffLabel: 'View couture tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'casual-outerwear' },
  },
  {
    /* AUTHORED */
    id: 'ethnic-wear',
    title: 'Sarees, Lehengas & Ethnic Wear',
    body: 'Bridal lehengas, heirloom sarees and sherwanis handled with reverence — embroidery, zari and delicate dyes protected through every step.',
    longBody:
      "A wedding lehenga or an heirloom saree carries more than fabric — hand embroidery, zari work and dyes that a standard clean can bleed or crush. We treat every ethnic piece as its own case: checking embroidery and beadwork before cleaning, choosing a process that won't run the colour, and finishing by hand so pleats and drape return the way they were meant to fall.",
    highlights: [
      'Embroidery, zari and delicate dyes protected during cleaning',
      'Heirloom pieces treated with the same reverence as bridal wear',
      'Individually assessed — no two lehengas or sarees are cleaned the same way',
      'Hand-finished and returned ready for the next occasion',
    ],
    image: '/images/tariffs/lehenga.jpg',
    imageAlt: 'Embroidered bridal lehenga cared for with couture-grade cleaning at Vanzoo',
    heroImage: '/images/persona-heirlooms.jpg',
    heroImageAlt:
      'Two generations in heritage silk sarees preserved with museum-grade Vanzoo care',
    from: { amount: amountOf(coutureCatalog, 'traditional-ethnic', 'Kurta') },
    tariffHref: '/pricing/#traditional-ethnic',
    tariffLabel: 'View ethnic wear tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'traditional-ethnic' },
  },
  {
    /* AUTHORED */
    id: 'shoe-care',
    title: 'Shoes & Sneaker Care',
    body: 'Leather, suede and sports shoes cleaned, conditioned and revived — soles, uppers and laces each treated the way the material asks.',
    longBody:
      "Leather, suede and mesh don't respond to the same treatment, so we don't give them one. Uppers, soles and laces are cleaned and conditioned as separate steps, with the material dictating the process rather than the other way round — leather is conditioned to keep its finish, suede is treated to protect its nap, and sports shoes are cleaned without breaking down the sole's structure.",
    highlights: [
      'Leather, suede and sports materials each treated the way they ask for',
      'Soles, uppers and laces cleaned and conditioned separately',
      'Shape restored without cracking or discolouring the material',
      'Returned looking cared for, not just wiped down',
    ],
    image: '/images/tariffs/leather-shoes.jpg',
    imageAlt: 'Polished brown leather shoes after professional cleaning and conditioning at Vanzoo',
    heroImage: '/images/service-shoes-bags-accessories.jpg',
    heroImageAlt:
      'Leather brogues and a tan leather handbag cleaned and conditioned by Vanzoo luxury accessory care',
    from: { amount: amountOf(coutureCatalog, 'footwear', 'Sports Shoes') },
    tariffHref: '/pricing/#footwear',
    tariffLabel: 'View footwear tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'footwear' },
  },
  {
    id: 'bags-leather-care',
    title: 'Bags & Leather Care',
    body: 'Expert care for luxury leather goods, handbags, and shoes. Cleaned, conditioned, and revived by skilled professionals.',
    longBody:
      'A leather handbag is structure, hardware and stitching as much as it is material — and each of those needs a different kind of attention. We inspect hardware and linings before cleaning, condition the leather to bring its finish back rather than just remove surface dirt, and handle every bag the way its construction, not its price tag, demands.',
    highlights: [
      'Cleaned, conditioned and revived by skilled leather specialists',
      'Hardware, stitching and linings inspected before treatment',
      'Safe for fine leather, suede and structured handbags',
      'Handled the way a couture handbag deserves to be',
    ],
    image: '/images/service-shoes-bags-accessories.jpg',
    imageAlt:
      'Leather brogues and a tan leather handbag cleaned and conditioned by Vanzoo luxury accessory care',
    from: { amount: amountOf(coutureCatalog, 'accessories', 'Leather Handbag') },
    tariffHref: '/pricing/#accessories',
    tariffLabel: 'View accessory tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'accessories' },
  },
  {
    /* AUTHORED */
    id: 'toys-accessories-care',
    title: 'Toys & Accessories Care',
    body: 'Soft toys and everyday accessories cleaned in the same skin-safe, toxin-free process we trust with couture — gentle enough for the nursery.',
    longBody:
      "A child's soft toy gets held, chewed and slept with — it needs a process that's genuinely skin-safe, not just labelled that way. We clean toys and everyday accessories individually rather than in a batch, using the same 99% chemical-free hydrocarbon process we use on couture garments, so what comes back is sanitised without leaving behind anything harsher than what it started with.",
    highlights: [
      'The same skin-safe, toxin-free process we use on couture garments',
      "Gentle enough for a child's favourite soft toy",
      'Assessed individually, never batch-washed',
      'Returned fresh, sanitised and ready to hug',
    ],
    image: '/images/tariffs/soft-toy.jpg',
    imageAlt: 'Plush soft toy freshly cleaned with skin-safe hydrocarbon care at Vanzoo',
    heroImage: '/images/collage-family-heirloom.jpg',
    heroImageAlt: 'Child in a preserved heirloom dress cleaned with museum-grade Vanzoo care',
    from: { amount: amountOf(coutureCatalog, 'accessories', 'Soft Toy') },
    tariffHref: '/pricing/#accessories',
    tariffLabel: 'View accessory tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'accessories' },
  },
  {
    id: 'curtain-cleaning',
    title: 'Curtain Cleaning',
    body: 'Professional drapery care that includes free deinstallation and reinstallation, ensuring a flawless finish every time.',
    longBody:
      "Curtains are awkward to clean precisely because you can't easily take them down and put them back — so we do that part too, at no extra charge. Pleats, linings and headers are cleaned without the harsh detergents that fade fabric over repeated washes, and wherever possible your curtains go back up the same day they're collected.",
    highlights: [
      'Free deinstallation and reinstallation included',
      'Cleaned in place of harsh detergents that fade fabric',
      'Pleats and linings preserved through the wash',
      'Rehung the same day wherever possible',
    ],
    image: '/images/service-curtain-cleaning.jpg',
    imageAlt:
      'Floor-length living room curtains professionally cleaned, deinstalled and reinstalled by Vanzoo',
    from: {
      amount: amountOf(coutureCatalog, 'home-textiles', 'Curtain (per panel)'),
      note: 'per panel',
    },
    tariffHref: '/pricing/#home-textiles',
    tariffLabel: 'View home textile tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'home-textiles' },
  },
  {
    /* AUTHORED */
    id: 'carpet-cleaning',
    title: 'Carpet Cleaning',
    body: 'Deep, dust-free cleaning for carpets and rugs, priced by the square foot — colours refreshed and pile restored without harsh chemistry.',
    longBody:
      "Carpets trap dust and allergens deep in the pile that a home vacuum never reaches, but soaking them in water risks the backing and the colour. Our process cleans deep without saturating the carpet, priced transparently by the square foot rather than a flat estimate, so pile and colour come back refreshed instead of flattened or faded.",
    highlights: [
      'Priced transparently, per square foot',
      'Deep, dust-free cleaning without soaking the backing',
      'Colours refreshed and pile restored',
      'Safe for wool, silk-blend and synthetic carpets',
    ],
    image: '/images/tariffs/carpet.jpg',
    imageAlt: 'Patterned area carpet deep-cleaned and colour-refreshed by Vanzoo in Gurgaon',
    heroImage: '/images/collage-folded-linens.jpg',
    heroImageAlt: 'Neatly folded cleaned linens and towels after Vanzoo fabric care',
    from: {
      amount: amountOf(coutureCatalog, 'home-textiles', 'Carpet (per Sqft)'),
      note: 'per sqft',
    },
    tariffHref: '/pricing/#home-textiles',
    tariffLabel: 'View home textile tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'home-textiles' },
  },
  {
    /* AUTHORED */
    id: 'home-textiles',
    title: 'Home Textiles',
    body: 'Blankets, quilts and bedsheets returned crisp and allergen-free — the pieces you live with, cared for like the pieces you wear.',
    longBody:
      "Blankets, quilts and bedsheets get more daily contact than almost anything else in the wardrobe, yet they're usually the last thing sent for proper cleaning. We give them the same individual assessment and hydrocarbon process as a couture garment, so what comes back is crisp, allergen-free and ready for the bed — not just tumbled through a wash-and-fold.",
    highlights: [
      'Blankets, quilts and bedsheets returned allergen-free',
      'The same hydrocarbon care we give couture garments',
      'Crisp, fresh and ready for the bed the day they arrive',
      'Free pickup, so bulky textiles never need to leave your hands',
    ],
    image: '/images/collage-folded-linens.jpg',
    imageAlt: 'Neatly folded cleaned linens and towels after Vanzoo fabric care',
    from: { amount: amountOf(coutureCatalog, 'home-textiles', 'Single Bedsheet') },
    tariffHref: '/pricing/#home-textiles',
    tariffLabel: 'View home textile tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'home-textiles' },
  },
  {
    /* AUTHORED */
    id: 'steam-iron',
    title: 'Steam Iron & Pressing',
    body: 'Pressing only, for garments that are already clean — professional steam finishing that returns everything sharp, soft and ready to wear.',
    longBody:
      "Not every garment needs cleaning — sometimes it just needs a finish sharper than a home iron can give it. Steam pressing is priced and run separately from our cleaning services, for pieces that are already clean and simply need to look it, with the same free pickup and delivery as everything else we do.",
    highlights: [
      'For garments that are already clean and simply need finishing',
      'Professional steam pressing, sharper than a home iron',
      'Priced separately and lower than full cleaning',
      'Same free pickup and delivery as every other service',
    ],
    image: '/images/process-delivered-pressed.jpg',
    imageAlt: 'Cream cable-knit sweater finished, pressed and hung ready for delivery by Vanzoo',
    heroImage: '/images/garment-rail-couture.jpg',
    heroImageAlt: 'Rail of freshly pressed garments ready for delivery at the Vanzoo Gurgaon atelier',
    from: { amount: amountOf(steamIronCatalog, 'everyday-wear', 'Jeans') },
    tariffHref: '/pricing/#steam-iron-tariffs',
    tariffLabel: 'View steam iron tariffs',
    tariffPreview: { catalogId: 'steam' },
  },
  {
    /* AUTHORED */
    id: 'express-service',
    title: 'Express Service',
    body: 'Same-day and next-day turnarounds for the moments that cannot wait — priced on request, arranged with one call.',
    longBody:
      "A last-minute event or an early flight doesn't leave room for a standard 5–7 day turnaround. Express service compresses that timeline to same-day or next-day without skipping the individual assessment every piece gets — it's arranged with a single call rather than a separate booking flow, and priced once we know exactly what needs doing and by when.",
    highlights: [
      'Same-day or next-day turnaround, on request',
      'Ideal for last-minute events and travel',
      'Arranged with one phone call — no separate booking flow',
      'Every express order still gets a full individual assessment',
    ],
    image: '/images/hero-valet-handover.jpg',
    imageAlt:
      'Vanzoo valet handing over freshly cleaned garments in protective wrap for an express order',
    from: null,
    priceLine: 'Priced on request — call to arrange',
    tariffHref: '/pricing/',
    tariffLabel: 'View tariffs',
    tariffPreview: null,
  },
  {
    id: 'pickup-delivery',
    title: 'Free Pickup & Delivery',
    body: 'Enjoy seamless door-to-door service with optional same-day express turnaround.',
    longBody:
      'Every service on this page includes the same door-to-door pickup and delivery — free, with no minimum order, anywhere we cover in Gurgaon. Book a slot from the app or the website, and a valet collects from your door and returns everything pressed, wrapped and ready.',
    highlights: [
      'Free, door-to-door, every time — no minimum order',
      'Covers every Gurgaon sector we serve',
      'Same-day express options available',
      'Track pickup and delivery from the Vanzoo app',
    ],
    image: '/images/service-pickup-delivery.jpg',
    imageAlt: 'Basket of clothes ready for free Vanzoo doorstep pickup and delivery in Gurgaon',
    from: null,
    priceLine: 'Free with every order',
    tariffHref: '/areas-we-serve/',
    tariffLabel: 'See coverage areas',
    tariffPreview: null,
  },
];

export function getService(id: string): ServiceEntry | undefined {
  return serviceEntries.find((service) => service.id === id);
}

/** Up to `count` other services, for the "You might also need" rail. */
export function relatedServices(current: ServiceEntry, count = 3): readonly ServiceEntry[] {
  return serviceEntries.filter((service) => service.id !== current.id).slice(0, count);
}
