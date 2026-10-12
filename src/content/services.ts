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
  /** Optimized `<title>` for this service's own page. Falls back to
   *  `${title} in Gurgaon | Vanzoo` when absent. */
  metaTitle?: string;
  /** Punchier H1 for the service's own page hero. Falls back to `title`
   *  everywhere else (nav, cards, footer) still use `title`. */
  pageHeadline?: string;
  /** Keyword H1 for the service's own page; `pageHeadline` then renders as H2. */
  seoH1?: string;
  /** One-line hook shown under `pageHeadline` on the service's own page.
   *  Falls back to `body`. */
  contentHook?: string;
  /** Four concrete, verifiable specifics — no claim not already made elsewhere on the site. */
  highlights: readonly string[];
  /** Card thumbnail (3:2, cropped small) — kept separate from the hero because
   *  several of the closest product photos are small studio shots that would
   *  look soft stretched full-bleed. */
  image: string;
  imageAlt: string;
  /** CSS object-position for the card / side image crop, e.g. '20% 50%'. */
  imagePosition?: string;
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
    seoH1: "Best & Premium Suit Dry Cleaning in Gurgaon",
    title: 'Bespoke Suit & Couture Care',
    body: 'Tailored for your most refined garments. We preserve the shape, structure, and elegance of custom suits and designer wear.',
    metaTitle: 'Bespoke Suit & Couture Dry Cleaning Gurgaon | Vanzoo',
    pageHeadline: 'Preserve the Shape of Your Finest Tailored Suits.',
    contentHook: 'Meticulous structural care for canvas linings, lapels, and designer wear.',
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
    seoH1: "Best & Premium Silk, Wool & Delicate Fabric Dry Cleaning in Gurgaon",
    title: 'Silks, Wool & Delicate Fabrics',
    body: 'Gentle treatment for silks, woolens, and cashmere. We restore their natural softness and lustre without damage.',
    metaTitle: 'Silk, Wool & Cashmere Dry Cleaning Gurgaon | Vanzoo',
    pageHeadline: 'Nourishing Care for Pure Silks & Fine Woolens.',
    contentHook: 'Gentle hydrocarbon washing that prevents fabric stiffness and shrinkage.',
    longBody:
      "Silk, cashmere and fine wool lose their character the moment they meet the wrong solvent or too much agitation. Our hydrocarbon process runs at lower mechanical and thermal stress than conventional dry cleaning, so fibres keep their original drape instead of stiffening or dulling. Every garment is checked for its specific weave and finish before we decide how it's cleaned — not run through a standard cycle regardless of what it is.",
    highlights: [
      'Cleaned in a closed-loop hydrocarbon system, not water or harsh solvents',
      'Natural softness and lustre restored without fibre damage',
      'Safe for silk, cashmere, wool and other delicate weaves',
      'Hand-finished before it comes back to you',
    ],
    image: '/images/vanzoo/service-silk-wool.jpg',
    imageAlt:
      'Folded silk and knitted wool fabrics against a deep green backdrop',
    from: { amount: amountOf(coutureCatalog, 'casual-outerwear', 'Sweater Full Sleeves') },
    tariffHref: '/pricing/#casual-outerwear',
    tariffLabel: 'View couture tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'casual-outerwear' },
  },
  {
    /* AUTHORED */
    id: 'ethnic-wear',
    seoH1: "Best & Premium Saree & Lehenga Dry Cleaning in Gurgaon",
    title: 'Sarees, Lehengas & Ethnic Wear Dry Cleaning',
    body: 'Bridal lehengas, heirloom sarees and sherwanis handled with reverence — embroidery, zari and delicate dyes protected through every step.',
    metaTitle: 'Saree & Lehenga Dry Cleaning Services Gurgaon | Vanzoo',
    pageHeadline: 'Saree, Lehenga & Zari Work Dry Cleaning, Handled Gently.',
    contentHook: 'Protect delicate embroidery and rich silk fabrics from discoloration or fraying.',
    longBody:
      "A wedding lehenga or an heirloom saree carries more than fabric — hand embroidery, zari work and dyes that a standard clean can bleed or crush. We treat every ethnic piece as its own case: checking embroidery and beadwork before cleaning, choosing a process that won't run the colour, and finishing by hand so pleats and drape return the way they were meant to fall.",
    highlights: [
      'Embroidery, zari and delicate dyes protected during cleaning',
      'Heirloom pieces treated with the same reverence as bridal wear',
      'Individually assessed — no two lehengas or sarees are cleaned the same way',
      'Hand-finished and returned ready for the next occasion',
    ],
    image: '/images/vanzoo/service-saree-lehenga.jpg',
    imagePosition: '55% 50%',
    imageAlt:
      'Silk sarees, a lehenga and a sherwani styled on the Vanzoo premium organic dryclean display',
    from: { amount: amountOf(coutureCatalog, 'traditional-ethnic', 'Kurta') },
    tariffHref: '/pricing/#traditional-ethnic',
    tariffLabel: 'View ethnic wear tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'traditional-ethnic' },
  },
  {
    /* AUTHORED */
    id: 'shoe-care',
    seoH1: "Best & Premium Shoe & Sneaker Cleaning in Gurgaon",
    title: 'Shoes & Sneaker Care',
    body: 'Leather, suede and sports shoes cleaned, conditioned and revived — soles, uppers and laces each treated the way the material asks.',
    metaTitle: 'Luxury Shoe & Sneaker Cleaning Gurgaon | Vanzoo',
    pageHeadline: 'Bring Your Favorite Footwear Back to Life.',
    contentHook: 'Deep cleaning, stain removal, and material conditioning for suede and leather sneakers.',
    longBody:
      "Leather, suede and mesh don't respond to the same treatment, so we don't give them one. Uppers, soles and laces are cleaned and conditioned as separate steps, with the material dictating the process rather than the other way round — leather is conditioned to keep its finish, suede is treated to protect its nap, and sports shoes are cleaned without breaking down the sole's structure.",
    highlights: [
      'Leather, suede and sports materials each treated the way they ask for',
      'Soles, uppers and laces cleaned and conditioned separately',
      'Shape restored without cracking or discolouring the material',
      'Returned looking cared for, not just wiped down',
    ],
    image: '/images/vanzoo/service-shoe-care.jpg',
    imagePosition: '62% 50%',
    imageAlt:
      'Cleaned sneakers, loafers and boots with shoe-care products on a Vanzoo display',
    from: { amount: amountOf(coutureCatalog, 'footwear', 'Sports Shoes') },
    tariffHref: '/pricing/#footwear',
    tariffLabel: 'View footwear tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'footwear' },
  },
  {
    id: 'bags-leather-care',
    seoH1: "Best & Premium Bag & Leather Dry Cleaning in Gurgaon",
    title: 'Bags & Leather Care',
    body: 'Expert care for luxury leather goods, handbags, and shoes. Cleaned, conditioned, and revived by skilled professionals.',
    metaTitle: 'Handbag & Leather Garment Care Gurgaon | Vanzoo',
    pageHeadline: 'Specialized Care for Designer Leather Bags & Jackets.',
    contentHook: 'Deep conditioning, moisture restoration, and shape protection.',
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
    seoH1: "Best & Premium Soft Toy & Baby Item Cleaning in Gurgaon",
    title: 'Toys & Accessories Care',
    body: 'Soft toys and everyday accessories cleaned in the same skin-safe, toxin-free process we trust with couture — gentle enough for the nursery.',
    metaTitle: 'Soft Toy & Accessory Cleaning Gurgaon | Vanzoo',
    pageHeadline: '100% Toxin-Free Cleaning for Plush Toys & Scarves.',
    contentHook: 'Child-safe, allergen-free sanitization with zero chemical residue.',
    longBody:
      "A child's soft toy gets held, chewed and slept with — it needs a process that's genuinely skin-safe, not just labelled that way. We clean toys and everyday accessories individually rather than in a batch, using the same 99% chemical-free hydrocarbon process we use on couture garments, so what comes back is sanitised without leaving behind anything harsher than what it started with.",
    highlights: [
      'The same skin-safe, toxin-free process we use on couture garments',
      "Gentle enough for a child's favourite soft toy",
      'Assessed individually, never batch-washed',
      'Returned fresh, sanitised and ready to hug',
    ],
    image: '/images/vanzoo/service-toys-baby.jpg',
    imagePosition: '55% 50%',
    imageAlt:
      'Soft toys and a baby stroller cared for by Vanzoo, styled in the Vanzoo store',
    from: { amount: amountOf(coutureCatalog, 'accessories', 'Soft Toy') },
    tariffHref: '/pricing/#accessories',
    tariffLabel: 'View accessory tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'accessories' },
  },
  {
    id: 'curtain-cleaning',
    seoH1: "Best & Premium Curtain Dry Cleaning in Gurgaon",
    title: 'Curtain Cleaning',
    body: 'Professional drapery care that includes free deinstallation and reinstallation, ensuring a flawless finish every time.',
    metaTitle: 'Curtain & Drapery Dry Cleaning Gurgaon | Vanzoo',
    pageHeadline: 'Fresh, Dust-Free Curtains Without the Heavy Lifting.',
    contentHook: 'Doorstep removal, deep steam cleaning, and re-hanging options.',
    longBody:
      "Curtains are awkward to clean precisely because you can't easily take them down and put them back — so we do that part too, at no extra charge. Pleats, linings and headers are cleaned without the harsh detergents that fade fabric over repeated washes, and wherever possible your curtains go back up the same day they're collected.",
    highlights: [
      'Free deinstallation and reinstallation included',
      'Cleaned in place of harsh detergents that fade fabric',
      'Pleats and linings preserved through the wash',
      'Rehung the same day wherever possible',
    ],
    image: '/images/vanzoo/service-curtains.jpg',
    imageAlt:
      'Vanzoo team member vacuum-cleaning floor-length green curtains in a living room',
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
    seoH1: "Best & Premium Carpet Dry Cleaning in Gurgaon",
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
    image: '/images/vanzoo/service-carpet.jpg',
    imageAlt:
      'A rolled and a laid-out handknotted carpet, cleaned by Vanzoo',
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
    seoH1: "Best & Premium Blanket & Bedding Dry Cleaning in Gurgaon",
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
    image: '/images/vanzoo/service-blankets.jpg',
    imagePosition: '55% 50%',
    imageAlt:
      'Blankets and bed linen in Vanzoo green packaging beside a folded throw',
    from: { amount: amountOf(coutureCatalog, 'home-textiles', 'Single Bedsheet') },
    tariffHref: '/pricing/#home-textiles',
    tariffLabel: 'View home textile tariffs',
    tariffPreview: { catalogId: 'couture', groupId: 'home-textiles' },
  },
  {
    /* AUTHORED */
    id: 'steam-iron',
    seoH1: "Best & Premium Steam Ironing Service in Gurgaon",
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
    image: '/images/vanzoo/service-steam-iron.jpg',
    imageAlt:
      'Vanzoo team member steam-ironing a shirt at the Vanzoo pressing station',
    from: { amount: amountOf(steamIronCatalog, 'everyday-wear', 'Jeans') },
    tariffHref: '/pricing/#steam-iron-tariffs',
    tariffLabel: 'View steam iron tariffs',
    tariffPreview: { catalogId: 'steam' },
  },
  {
    /* AUTHORED */
    id: 'express-service',
    seoH1: "Best & Premium Express Dry Cleaning in Gurgaon",
    title: 'Express Service',
    body: 'Same-day and next-day turnarounds for the moments that cannot wait — priced on request, arranged with one call.',
    longBody:
      "A last-minute event or an early flight doesn't leave room for a standard 3–5 day turnaround. Express service compresses that timeline to same-day or next-day without skipping the individual assessment every piece gets — it's arranged with a single call rather than a separate booking flow, and priced once we know exactly what needs doing and by when.",
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
    seoH1: "Best & Premium Dry Cleaning with Free Pickup & Delivery in Gurgaon",
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
    image: '/images/vanzoo/service-pickup-rider.jpg',
    imagePosition: '50% 85%',
    imageAlt:
      'Vanzoo rider with a green delivery bag on a motorbike, ready for doorstep pickup and delivery',
    heroImage: '/images/service-pickup-delivery.jpg',
    heroImageAlt: 'Basket of clothes ready for free Vanzoo doorstep pickup and delivery in Gurgaon',
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
