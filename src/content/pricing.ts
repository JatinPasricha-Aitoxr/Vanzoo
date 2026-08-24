/**
 * Tariffs, transcribed verbatim from vanzoo.in/couture-care-tariffs and
 * /steam-iron-tariffs.
 *
 * `amount` is the rupee figure and `from` records whether Vanzoo publishes it
 * as a fixed price or as "Starting from ₹x". Roughly half the rows are from-
 * prices, so the cart totals them as an *estimate* and says so — collapsing the
 * distinction would quote a fixed price Vanzoo does not offer.
 *
 * See README "Tariffs" to update these tables.
 */

export type TariffRow = {
  item: string;
  /** Rupee amount, GST exclusive. */
  amount: number;
  /** True when the published price is "Starting from ₹x" rather than fixed. */
  from?: boolean;
  /** Product photo shown on the card and as the cart-line thumbnail. */
  image: string;
};

/**
 * Product photos, carried over from the live site's own tariff cards and
 * renamed to the product they depict — several of the source uploads carry
 * misleading filenames (the live "Kurta Heavy" card's image is a file called
 * `Fabric-Flesh.jpg`; "Salwar"'s is `Group-108.jpg`), so the pairing here comes
 * from what each card actually renders, not from the filename.
 */
const img = (slug: string) => `/images/tariffs/${slug}.jpg`;

export type TariffGroup = { id: string; label: string; rows: readonly TariffRow[] };

/**
 * A whole tariff page's worth of pricing. `id` namespaces cart line items, so
 * a couture "Pant/Trouser" and a steam-iron "Pant/Trouser" stay distinct rows
 * in the cart instead of collapsing into one.
 */
export type TariffCatalog = {
  id: 'couture' | 'steam-iron';
  /** Shown on cart lines to say which service the item was priced under. */
  label: string;
  groups: readonly TariffGroup[];
};

export const tariffNote = 'All prices mentioned are exclusive of GST. GST will be charged extra.';

/** Add-on services with no fixed tariff — quoted once the team sees the item. */
export const additionalOptions = [
  'Minor Repair',
  'Major Stitching',
  'Darning',
  'Premium Packaging',
  'Starch',
  'Next Day Delivery',
] as const;

export const tariffIntro = 'Seamless, sustainable, and sophisticated — premium care, simplified.';

/** Indian-format rupee amount, no decimals — ₹1,099 rather than ₹1099.00. */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** The published price exactly as the live site words it. */
export function formatPrice(row: TariffRow): string {
  return row.from ? `Starting from ${formatRupees(row.amount)}` : formatRupees(row.amount);
}

/** Stable, URL-safe cart key for one row of one catalogue. */
export function lineId(catalogId: TariffCatalog['id'], groupId: string, item: string): string {
  const slug = item
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${catalogId}:${groupId}:${slug}`;
}

const coutureGroups: readonly TariffGroup[] = [
  {
    id: 'mens-garments',
    label: 'Men’s Garments',
    rows: [
      { item: 'Pant/Trouser', amount: 199, image: img('pant-trouser') },
      { item: 'Jeans', amount: 249, image: img('jeans') },
      { item: 'Shirt', amount: 199, from: true, image: img('shirt') },
      { item: 'T-shirt', amount: 199, image: img('t-shirt') },
      { item: 'Coat', amount: 499, image: img('coat') },
      { item: 'Men Suit 2 Pcs', amount: 699, image: img('men-suit-2-pcs') },
      { item: 'Men Suit 3 Pcs', amount: 899, image: img('men-suit-3-pcs') },
    ],
  },
  {
    id: 'traditional-ethnic',
    label: 'Traditional & Ethnic Wear',
    rows: [
      { item: 'Sherwani', amount: 999, from: true, image: img('sherwani') },
      { item: 'Kurta', amount: 249, from: true, image: img('kurta') },
      { item: 'Kurta Fancy', amount: 799, image: img('kurta-fancy') },
      { item: 'Kurta Heavy', amount: 1099, image: img('kurta-heavy') },
      { item: 'Salwar', amount: 249, from: true, image: img('salwar') },
      { item: 'Saree', amount: 299, from: true, image: img('saree') },
      { item: 'Lehenga', amount: 699, from: true, image: img('lehenga') },
    ],
  },
  {
    id: 'casual-outerwear',
    label: 'Casual & Outerwear',
    rows: [
      { item: 'Dress', amount: 299, from: true, image: img('dress') },
      { item: 'Shawl', amount: 399, from: true, image: img('shawl') },
      { item: 'Sweater Full Sleeves', amount: 299, image: img('sweater') },
      { item: 'Jacket', amount: 499, image: img('jacket') },
      { item: 'Leather Jacket', amount: 999, image: img('leather-jacket') },
    ],
  },
  {
    id: 'home-textiles',
    label: 'Home Textiles',
    rows: [
      { item: 'Carpet (per Sqft)', amount: 59, image: img('carpet') },
      { item: 'Curtain (per panel)', amount: 349, image: img('curtain') },
      { item: 'Double Blanket', amount: 599, image: img('double-blanket') },
      { item: 'Single Blanket', amount: 499, image: img('single-blanket') },
      { item: 'Double Bedsheet', amount: 499, image: img('double-bedsheet') },
      { item: 'Single Bedsheet', amount: 299, image: img('single-bedsheet') },
    ],
  },
  {
    id: 'footwear',
    label: 'Footwear',
    rows: [
      { item: 'Sports Shoes', amount: 549, image: img('sports-shoes') },
      { item: 'Leather Shoes', amount: 799, image: img('leather-shoes') },
      { item: 'Suede Leather Shoes', amount: 799, image: img('suede-leather-shoes') },
      { item: 'Sneakers Shoes', amount: 649, image: img('sneakers-shoes') },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories & Special Items',
    rows: [
      { item: 'Leather Handbag', amount: 699, from: true, image: img('leather-handbag') },
      { item: 'Soft Toy', amount: 299, from: true, image: img('soft-toy') },
    ],
  },
];

const steamIronGroups: readonly TariffGroup[] = [
  {
    id: 'everyday-wear',
    label: 'Everyday Wear',
    rows: [
      { item: 'Pant/Trouser', amount: 99, image: img('pant-trouser') },
      { item: 'Jeans', amount: 79, image: img('jeans') },
      { item: 'Shirt', amount: 99, from: true, image: img('shirt') },
      { item: 'T-shirt', amount: 89, image: img('t-shirt') },
      { item: 'Sweat Pants', amount: 99, image: img('sweat-pants') },
    ],
  },
  {
    id: 'formal-outerwear',
    label: 'Formal & Outerwear',
    rows: [
      { item: 'Coat', amount: 149, image: img('coat') },
      { item: 'Waist Coat', amount: 99, image: img('waist-coat') },
      { item: 'Leather Jacket', amount: 299, image: img('leather-jacket') },
      { item: 'Sweater Full Sleeves Plain', amount: 99, image: img('sweater-plain') },
      { item: 'Jacket Full Sleeves', amount: 199, image: img('jacket') },
    ],
  },
  {
    id: 'ethnic-occasion',
    label: 'Ethnic & Occasion Wear',
    rows: [
      { item: 'KURTA', amount: 89, from: true, image: img('kurta') },
      { item: 'Sherwani', amount: 199, from: true, image: img('sherwani') },
      { item: 'Saree', amount: 129, from: true, image: img('saree') },
      { item: 'Lehenga', amount: 199, from: true, image: img('lehenga') },
      { item: 'Dress', amount: 149, from: true, image: img('dress') },
      { item: 'Blouse', amount: 79, from: true, image: img('blouse') },
      { item: 'Salwar', amount: 79, from: true, image: img('salwar') },
      { item: 'Shawl', amount: 99, from: true, image: img('shawl') },
    ],
  },
  {
    id: 'home-textiles-steam',
    label: 'Home Textiles',
    rows: [
      { item: 'Curtain Window', amount: 149, from: true, image: img('curtain') },
      { item: 'Single Bedsheet', amount: 99, image: img('single-bedsheet') },
      { item: 'Double Bedsheet', amount: 149, image: img('double-bedsheet') },
    ],
  },
];

export const coutureCatalog: TariffCatalog = {
  id: 'couture',
  label: 'Couture Care',
  groups: coutureGroups,
};

export const steamIronCatalog: TariffCatalog = {
  id: 'steam-iron',
  label: 'Steam Iron',
  groups: steamIronGroups,
};
