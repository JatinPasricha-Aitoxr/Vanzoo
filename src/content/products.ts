/**
 * Product catalogue — one page per garment at /products/[slug]/, each showing
 * every service treatment available for that garment side by side.
 *
 * A product doesn't carry its own price: every `services` entry points at an
 * existing row in content/pricing.ts, so a garment here can never drift from
 * the couture and steam-iron tariffs on /pricing/. `serviceId` on a couture
 * option points at the closest matching /services/[slug]/ page for that
 * garment's category; every steam-iron option points at `steam-iron`, the one
 * service page that covers pressing-only across every garment.
 *
 * One `ProductEntry` covers every tariff row Vanzoo publishes for that garment
 * — most have both a couture (clean + press) and a steam-iron (press only)
 * treatment; some (bespoke suits, footwear, accessories, most home textiles)
 * are couture-only, and a few everyday pieces (sweatpants, waistcoats,
 * blouses) are steam-iron-only because no couture tariff is published for them.
 */

import { coutureCatalog, steamIronCatalog, type TariffCatalog } from './pricing';

export type ProductServiceOption = {
  /** Which /services/[slug]/ page this treatment links to for full detail. */
  serviceId: string;
  catalogId: TariffCatalog['id'];
  groupId: string;
  /** Tariff row name — must match `item` in content/pricing.ts exactly. */
  item: string;
  /** Card heading, e.g. "Dry Clean & Press" vs "Steam Press Only". */
  label: string;
  description: string;
};

export type ProductEntry = {
  /** Route slug — the page lives at /products/<id>/. */
  id: string;
  title: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  services: readonly ProductServiceOption[];
};

/** Look up a published amount so a product card can never drift from the tariff. */
function catalogOf(catalogId: TariffCatalog['id']): TariffCatalog {
  return catalogId === 'couture' ? coutureCatalog : steamIronCatalog;
}

function amountOf(catalogId: TariffCatalog['id'], groupId: string, item: string) {
  const row = catalogOf(catalogId)
    .groups.find((group) => group.id === groupId)
    ?.rows.find((entry) => entry.item === item);
  if (!row) throw new Error(`Tariff row missing: ${catalogId}/${groupId}/${item}`);
  return row;
}

export const productsIntro =
  'Every garment, every way we care for it — pick the treatment that fits and add it straight to your pickup.';

const cleanAndPress = (
  serviceId: string,
  groupId: string,
  item: string,
  description: string,
): ProductServiceOption => ({
  serviceId,
  catalogId: 'couture',
  groupId,
  item,
  label: 'Dry Clean & Press',
  description,
});

const steamOnly = (groupId: string, item: string, description: string): ProductServiceOption => ({
  serviceId: 'steam-iron',
  catalogId: 'steam-iron',
  groupId,
  item,
  label: 'Steam Press Only',
  description,
});

export const productEntries: readonly ProductEntry[] = [
  // ---------------------------------------------------------------------
  // Men's garments
  // ---------------------------------------------------------------------
  {
    id: 'shirt',
    title: 'Shirt',
    intro:
      'From a boardroom formal to a weekend cotton shirt, choose full couture dry cleaning or a quick steam press — both collected free from your door.',
    heroImage: '/images/tariffs/shirt.jpg',
    heroImageAlt: 'Freshly pressed shirt cared for by Vanzoo in Gurgaon',
    services: [
      cleanAndPress(
        'couture-care',
        'mens-garments',
        'Shirt',
        'Full couture care — cleaned in our closed-loop hydrocarbon system and hand-pressed, for collars, cuffs and fabric that need more than a press.',
      ),
      steamOnly(
        'everyday-wear',
        'Shirt',
        'For a shirt that is already clean and just needs a sharp finish — professional steam pressing, no cleaning involved.',
      ),
    ],
  },
  {
    id: 'pant-trouser',
    title: 'Pant/Trouser',
    intro:
      'Formal trousers and everyday pants, cleaned and creased or simply steam-finished — both collected free from your door.',
    heroImage: '/images/tariffs/pant-trouser.jpg',
    heroImageAlt: 'Pressed trouser with a sharp crease cared for by Vanzoo in Gurgaon',
    services: [
      cleanAndPress(
        'couture-care',
        'mens-garments',
        'Pant/Trouser',
        'Cleaned in our closed-loop hydrocarbon system and hand-pressed with a sharp, even crease.',
      ),
      steamOnly(
        'everyday-wear',
        'Pant/Trouser',
        'For trousers that are already clean and just need the crease sharpened up.',
      ),
    ],
  },
  {
    id: 'jeans',
    title: 'Jeans',
    intro:
      'Denim cleaned without losing its colour or structure, or steam-pressed for a same-day refresh — both collected free from your door.',
    heroImage: '/images/tariffs/jeans.jpg',
    heroImageAlt: 'Pair of denim jeans folded after professional cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'couture-care',
        'mens-garments',
        'Jeans',
        'Cleaned in our closed-loop hydrocarbon system, which does not rely on the repeated water washing that fades denim over time.',
      ),
      steamOnly(
        'everyday-wear',
        'Jeans',
        'For jeans that are already clean and simply need creases and everyday wrinkles pressed out.',
      ),
    ],
  },
  {
    id: 't-shirt',
    title: 'T-shirt',
    intro:
      'Everyday cotton and blended t-shirts, cleaned or steam-refreshed — both collected free from your door.',
    heroImage: '/images/tariffs/t-shirt.jpg',
    heroImageAlt: 'Folded t-shirt cared for by Vanzoo in Gurgaon',
    services: [
      cleanAndPress(
        'couture-care',
        'mens-garments',
        'T-shirt',
        'Cleaned in our closed-loop hydrocarbon system and finished flat, for prints and ribbing that a hard press can distort.',
      ),
      steamOnly(
        'everyday-wear',
        'T-shirt',
        'For a t-shirt that is already clean and just needs wrinkles steamed out.',
      ),
    ],
  },
  {
    id: 'coat',
    title: 'Coat',
    intro:
      'Overcoats and formal coats, cleaned and shape-pressed or steam-finished between wears — both collected free from your door.',
    heroImage: '/images/tariffs/coat.jpg',
    heroImageAlt: 'Formal coat pressed and hung after professional cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'couture-care',
        'mens-garments',
        'Coat',
        'Cleaned in our closed-loop hydrocarbon system and hand-finished on a form, so the shoulder and lapel shape is pressed back in rather than flattened.',
      ),
      steamOnly(
        'formal-outerwear',
        'Coat',
        'For a coat that is already clean and just needs a fresh press between wears.',
      ),
    ],
  },
  {
    id: 'men-suit-2-pcs',
    title: 'Men Suit 2 Pcs',
    intro:
      'Jacket and trousers, cleaned and finished together so the two pieces keep matching colour and crease — collected free from your door.',
    heroImage: '/images/tariffs/men-suit-2-pcs.jpg',
    heroImageAlt: 'Two-piece men’s suit pressed and hung after couture dry cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'couture-care',
        'mens-garments',
        'Men Suit 2 Pcs',
        'Jacket and trousers cleaned in our closed-loop hydrocarbon system and hand-pressed on a form, preserving the canvas and shoulder structure underneath.',
      ),
    ],
  },
  {
    id: 'men-suit-3-pcs',
    title: 'Men Suit 3 Pcs',
    intro:
      'Jacket, waistcoat and trousers, cleaned and finished together as one suit — collected free from your door.',
    heroImage: '/images/tariffs/men-suit-3-pcs.jpg',
    heroImageAlt: 'Three-piece men’s suit pressed and hung after couture dry cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'couture-care',
        'mens-garments',
        'Men Suit 3 Pcs',
        'All three pieces cleaned in our closed-loop hydrocarbon system and hand-pressed on a form, so jacket, waistcoat and trousers come back matching.',
      ),
    ],
  },

  // ---------------------------------------------------------------------
  // Traditional & ethnic wear
  // ---------------------------------------------------------------------
  {
    id: 'sherwani',
    title: 'Sherwani',
    intro:
      'Heavy embroidery and structured tailoring, cleaned with care or steam-finished before the event — collected free from your door.',
    heroImage: '/images/tariffs/sherwani.jpg',
    heroImageAlt: 'Embroidered sherwani pressed and hung after couture cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'ethnic-wear',
        'traditional-ethnic',
        'Sherwani',
        'Assessed for embroidery and zari work before cleaning, then treated in our closed-loop hydrocarbon system and hand-finished.',
      ),
      steamOnly(
        'ethnic-occasion',
        'Sherwani',
        'For a sherwani that is already clean and just needs steaming and pressing before it is worn.',
      ),
    ],
  },
  {
    id: 'kurta',
    title: 'Kurta',
    intro:
      'Everyday and occasion kurtas, cleaned or steam-pressed — both collected free from your door.',
    heroImage: '/images/tariffs/kurta.jpg',
    heroImageAlt: 'Cotton kurta pressed and hung after professional cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'ethnic-wear',
        'traditional-ethnic',
        'Kurta',
        'Cleaned in our closed-loop hydrocarbon system and hand-pressed, with attention to the collar and placket.',
      ),
      steamOnly(
        'ethnic-occasion',
        'KURTA',
        'For a kurta that is already clean and just needs wrinkle removal and a crisp finish.',
      ),
    ],
  },
  {
    id: 'kurta-fancy',
    title: 'Kurta Fancy',
    intro:
      'Kurtas with embellishment, print or embroidery, cleaned with the extra care that detailing needs — collected free from your door.',
    heroImage: '/images/tariffs/kurta-fancy.jpg',
    heroImageAlt: 'Embellished fancy kurta pressed and hung after couture cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'ethnic-wear',
        'traditional-ethnic',
        'Kurta Fancy',
        'Embroidery, print and embellishment assessed before cleaning, then treated in our closed-loop hydrocarbon system and hand-finished.',
      ),
    ],
  },
  {
    id: 'kurta-heavy',
    title: 'Kurta Heavy',
    intro:
      'Heavily embroidered and layered kurtas, cleaned to protect the workmanship — collected free from your door.',
    heroImage: '/images/tariffs/kurta-heavy.jpg',
    heroImageAlt: 'Heavily embroidered kurta pressed and hung after couture cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'ethnic-wear',
        'traditional-ethnic',
        'Kurta Heavy',
        'Heavier embroidery and layering assessed before cleaning, then treated in our closed-loop hydrocarbon system and hand-finished.',
      ),
    ],
  },
  {
    id: 'salwar',
    title: 'Salwar',
    intro: 'Salwars cleaned or steam-pressed to keep pleats and fall intact — collected free from your door.',
    heroImage: '/images/tariffs/salwar.jpg',
    heroImageAlt: 'Salwar pressed and hung after professional cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'ethnic-wear',
        'traditional-ethnic',
        'Salwar',
        'Cleaned in our closed-loop hydrocarbon system and hand-pressed to keep the pleats and fall intact.',
      ),
      steamOnly(
        'ethnic-occasion',
        'Salwar',
        'For a salwar that is already clean and just needs pressing.',
      ),
    ],
  },
  {
    id: 'saree',
    title: 'Saree',
    intro:
      'From everyday cottons to heirloom silks, cleaned to protect zari and dye or steam-finished before draping — collected free from your door.',
    heroImage: '/images/tariffs/saree.jpg',
    heroImageAlt: 'Silk saree folded after couture cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'ethnic-wear',
        'traditional-ethnic',
        'Saree',
        'Assessed for fabric, zari and dye before cleaning, then treated in our closed-loop hydrocarbon system and hand-finished.',
      ),
      steamOnly(
        'ethnic-occasion',
        'Saree',
        'For a saree that is already clean and just needs a fresh press before it is worn.',
      ),
    ],
  },
  {
    id: 'lehenga',
    title: 'Lehenga',
    intro:
      'Bridal and occasion lehengas, cleaned with reverence for embroidery and structure — collected free from your door.',
    heroImage: '/images/tariffs/lehenga.jpg',
    heroImageAlt: 'Embroidered bridal lehenga cared for with couture-grade cleaning at Vanzoo',
    services: [
      cleanAndPress(
        'ethnic-wear',
        'traditional-ethnic',
        'Lehenga',
        'Embroidery, beadwork and layering checked before cleaning, then treated in our closed-loop hydrocarbon system and hand-finished so pleats fall the way they were meant to.',
      ),
      steamOnly(
        'ethnic-occasion',
        'Lehenga',
        'For a lehenga that is already clean and just needs steaming and pressing before the event.',
      ),
    ],
  },
  {
    id: 'blouse',
    title: 'Blouse',
    intro: 'Saree blouses, steam-pressed for a clean fit before draping — collected free from your door.',
    heroImage: '/images/tariffs/blouse.jpg',
    heroImageAlt: 'Saree blouse pressed and ready after Vanzoo steam finishing',
    services: [
      steamOnly(
        'ethnic-occasion',
        'Blouse',
        'Professional steam pressing for a clean, structured fit before the saree goes on.',
      ),
    ],
  },

  // ---------------------------------------------------------------------
  // Casual & outerwear
  // ---------------------------------------------------------------------
  {
    id: 'dress',
    title: 'Dress',
    intro: 'Everyday and occasion dresses, cleaned or steam-finished — both collected free from your door.',
    heroImage: '/images/tariffs/dress.jpg',
    heroImageAlt: 'Dress pressed and hung after professional cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'couture-care',
        'casual-outerwear',
        'Dress',
        'Assessed for fabric and construction before cleaning, then treated in our closed-loop hydrocarbon system and hand-finished.',
      ),
      steamOnly(
        'ethnic-occasion',
        'Dress',
        'For a dress that is already clean and just needs a crisp, ready-to-wear finish.',
      ),
    ],
  },
  {
    id: 'shawl',
    title: 'Shawl',
    intro:
      'Wool and pashmina shawls, gently cleaned to protect their softness or steam-refreshed — collected free from your door.',
    heroImage: '/images/tariffs/shawl.jpg',
    heroImageAlt: 'Wool shawl folded after gentle hydrocarbon cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'delicate-fabrics',
        'casual-outerwear',
        'Shawl',
        'Cleaned in our closed-loop hydrocarbon system at lower mechanical and thermal stress, so the weave keeps its softness rather than stiffening.',
      ),
      steamOnly(
        'ethnic-occasion',
        'Shawl',
        'For a shawl that is already clean and just needs a gentle press.',
      ),
    ],
  },
  {
    id: 'sweater',
    title: 'Sweater',
    intro:
      'Woollen and cashmere sweaters, cleaned to protect their shape or steam-refreshed — collected free from your door.',
    heroImage: '/images/tariffs/sweater.jpg',
    heroImageAlt: 'Cable-knit sweater folded after gentle hydrocarbon cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'delicate-fabrics',
        'casual-outerwear',
        'Sweater Full Sleeves',
        'Cleaned in our closed-loop hydrocarbon system at lower mechanical and thermal stress, so wool and cashmere keep their shape instead of stretching or felting.',
      ),
      steamOnly(
        'formal-outerwear',
        'Sweater Full Sleeves Plain',
        'For a sweater that is already clean and just needs a gentle steam to relax creases.',
      ),
    ],
  },
  {
    id: 'jacket',
    title: 'Jacket',
    intro: 'Everyday jackets, cleaned and shape-pressed or steam-refreshed — collected free from your door.',
    heroImage: '/images/tariffs/jacket.jpg',
    heroImageAlt: 'Jacket pressed and hung after professional cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'couture-care',
        'casual-outerwear',
        'Jacket',
        'Cleaned in our closed-loop hydrocarbon system and hand-finished on a form to keep the shoulder and collar shape.',
      ),
      steamOnly(
        'formal-outerwear',
        'Jacket Full Sleeves',
        'For a jacket that is already clean and just needs a fresh press.',
      ),
    ],
  },
  {
    id: 'leather-jacket',
    title: 'Leather Jacket',
    intro: 'Leather jackets, cleaned and conditioned or steam-refreshed — collected free from your door.',
    heroImage: '/images/tariffs/leather-jacket.jpg',
    heroImageAlt: 'Leather jacket cleaned and conditioned by Vanzoo in Gurgaon',
    services: [
      cleanAndPress(
        'bags-leather-care',
        'casual-outerwear',
        'Leather Jacket',
        'Cleaned and conditioned to bring back the finish of the leather, with hardware and stitching inspected first.',
      ),
      steamOnly(
        'formal-outerwear',
        'Leather Jacket',
        'A light steam and press for a leather jacket that only needs refreshing, not cleaning.',
      ),
    ],
  },
  {
    id: 'waist-coat',
    title: 'Waist Coat',
    intro: 'Waistcoats, steam-pressed for a sharp fit under a jacket — collected free from your door.',
    heroImage: '/images/tariffs/waist-coat.jpg',
    heroImageAlt: 'Waistcoat pressed and ready after Vanzoo steam finishing',
    services: [
      steamOnly(
        'formal-outerwear',
        'Waist Coat',
        'Professional steam pressing for a clean, structured finish.',
      ),
    ],
  },
  {
    id: 'sweat-pants',
    title: 'Sweat Pants',
    intro: 'Everyday sweatpants, steam-pressed and wrinkle-free — collected free from your door.',
    heroImage: '/images/tariffs/sweat-pants.jpg',
    heroImageAlt: 'Sweatpants pressed and folded after Vanzoo steam finishing',
    services: [
      steamOnly(
        'everyday-wear',
        'Sweat Pants',
        'Professional steam pressing to smooth out everyday wrinkles.',
      ),
    ],
  },

  // ---------------------------------------------------------------------
  // Home textiles
  // ---------------------------------------------------------------------
  {
    id: 'carpet',
    title: 'Carpet',
    intro:
      'Deep, dust-free carpet cleaning priced by the square foot, collected and returned free.',
    heroImage: '/images/tariffs/carpet.jpg',
    heroImageAlt: 'Patterned area carpet deep-cleaned and colour-refreshed by Vanzoo in Gurgaon',
    services: [
      cleanAndPress(
        'carpet-cleaning',
        'home-textiles',
        'Carpet (per Sqft)',
        'Deep, dust-free cleaning without soaking the backing, priced transparently per square foot.',
      ),
    ],
  },
  {
    id: 'curtain',
    title: 'Curtain',
    intro:
      'Curtains cleaned or steam-freshened with free deinstallation and reinstallation — collected and returned free.',
    heroImage: '/images/tariffs/curtain.jpg',
    heroImageAlt: 'Floor-length living room curtains professionally cleaned by Vanzoo',
    services: [
      cleanAndPress(
        'curtain-cleaning',
        'home-textiles',
        'Curtain (per panel)',
        'Cleaned in place of harsh detergents that fade fabric, with free deinstallation and reinstallation.',
      ),
      steamOnly(
        'home-textiles-steam',
        'Curtain Window',
        'A steam refresh for curtains that just need dust and creases lifted, without a full clean.',
      ),
    ],
  },
  {
    id: 'double-blanket',
    title: 'Double Blanket',
    intro: 'Double blankets, deep-cleaned and returned allergen-free — collected free from your door.',
    heroImage: '/images/tariffs/double-blanket.jpg',
    heroImageAlt: 'Double blanket folded after professional cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'home-textiles',
        'home-textiles',
        'Double Blanket',
        'Cleaned in our closed-loop hydrocarbon system and returned crisp, fresh and allergen-free.',
      ),
    ],
  },
  {
    id: 'single-blanket',
    title: 'Single Blanket',
    intro: 'Single blankets, deep-cleaned and returned allergen-free — collected free from your door.',
    heroImage: '/images/tariffs/single-blanket.jpg',
    heroImageAlt: 'Single blanket folded after professional cleaning by Vanzoo',
    services: [
      cleanAndPress(
        'home-textiles',
        'home-textiles',
        'Single Blanket',
        'Cleaned in our closed-loop hydrocarbon system and returned crisp, fresh and allergen-free.',
      ),
    ],
  },
  {
    id: 'double-bedsheet',
    title: 'Double Bedsheet',
    intro: 'Double bedsheets, cleaned or steam-pressed and returned crisp — collected free from your door.',
    heroImage: '/images/tariffs/double-bedsheet.jpg',
    heroImageAlt: 'Neatly folded double bedsheet after Vanzoo fabric care',
    services: [
      cleanAndPress(
        'home-textiles',
        'home-textiles',
        'Double Bedsheet',
        'Cleaned in our closed-loop hydrocarbon system and returned crisp, fresh and ready for the bed.',
      ),
      steamOnly(
        'home-textiles-steam',
        'Double Bedsheet',
        'For a bedsheet that is already clean and just needs pressing.',
      ),
    ],
  },
  {
    id: 'single-bedsheet',
    title: 'Single Bedsheet',
    intro: 'Single bedsheets, cleaned or steam-pressed and returned crisp — collected free from your door.',
    heroImage: '/images/tariffs/single-bedsheet.jpg',
    heroImageAlt: 'Neatly folded single bedsheet after Vanzoo fabric care',
    services: [
      cleanAndPress(
        'home-textiles',
        'home-textiles',
        'Single Bedsheet',
        'Cleaned in our closed-loop hydrocarbon system and returned crisp, fresh and ready for the bed.',
      ),
      steamOnly(
        'home-textiles-steam',
        'Single Bedsheet',
        'For a bedsheet that is already clean and just needs pressing.',
      ),
    ],
  },

  // ---------------------------------------------------------------------
  // Footwear
  // ---------------------------------------------------------------------
  {
    id: 'sports-shoes',
    title: 'Sports Shoes',
    intro: 'Sports shoes, cleaned without breaking down the sole — collected free from your door.',
    heroImage: '/images/tariffs/sports-shoes.jpg',
    heroImageAlt: 'Cleaned sports shoes after professional care by Vanzoo',
    services: [
      cleanAndPress(
        'shoe-care',
        'footwear',
        'Sports Shoes',
        'Uppers, soles and laces cleaned and conditioned as separate steps, without breaking down the sole structure.',
      ),
    ],
  },
  {
    id: 'leather-shoes',
    title: 'Leather Shoes',
    intro: 'Leather shoes, cleaned and conditioned to bring back their finish — collected free from your door.',
    heroImage: '/images/tariffs/leather-shoes.jpg',
    heroImageAlt: 'Polished brown leather shoes after professional cleaning and conditioning at Vanzoo',
    services: [
      cleanAndPress(
        'shoe-care',
        'footwear',
        'Leather Shoes',
        'Cleaned and conditioned to bring back the finish of the leather without cracking or discolouring it.',
      ),
    ],
  },
  {
    id: 'suede-leather-shoes',
    title: 'Suede Leather Shoes',
    intro: 'Suede shoes, cleaned to protect the nap — collected free from your door.',
    heroImage: '/images/tariffs/suede-leather-shoes.jpg',
    heroImageAlt: 'Suede shoes cleaned and treated to protect the nap by Vanzoo',
    services: [
      cleanAndPress(
        'shoe-care',
        'footwear',
        'Suede Leather Shoes',
        'Treated to protect the suede nap, rather than a leather-oriented clean that would flatten it.',
      ),
    ],
  },
  {
    id: 'sneakers-shoes',
    title: 'Sneakers Shoes',
    intro: 'Sneakers, cleaned uppers to soles without harsh scrubbing — collected free from your door.',
    heroImage: '/images/tariffs/sneakers-shoes.jpg',
    heroImageAlt: 'Cleaned sneakers after professional care by Vanzoo',
    services: [
      cleanAndPress(
        'shoe-care',
        'footwear',
        'Sneakers Shoes',
        'Mesh, leather and sole treated as separate materials, so the clean matches what each part is made of.',
      ),
    ],
  },

  // ---------------------------------------------------------------------
  // Accessories
  // ---------------------------------------------------------------------
  {
    id: 'leather-handbag',
    title: 'Leather Handbag',
    intro: 'Leather handbags, cleaned and conditioned by hand — collected free from your door.',
    heroImage: '/images/tariffs/leather-handbag.jpg',
    heroImageAlt: 'Tan leather handbag cleaned and conditioned by Vanzoo luxury accessory care',
    services: [
      cleanAndPress(
        'bags-leather-care',
        'accessories',
        'Leather Handbag',
        'Hardware, stitching and lining inspected before cleaning, then the leather conditioned to bring back its finish.',
      ),
    ],
  },
  {
    id: 'soft-toy',
    title: 'Soft Toy',
    intro: 'Soft toys, cleaned individually with the same skin-safe process used on couture garments — collected free from your door.',
    heroImage: '/images/tariffs/soft-toy.jpg',
    heroImageAlt: 'Plush soft toy freshly cleaned with skin-safe hydrocarbon care at Vanzoo',
    services: [
      cleanAndPress(
        'toys-accessories-care',
        'accessories',
        'Soft Toy',
        'Cleaned individually, never batch-washed, in the same skin-safe hydrocarbon process used on couture garments.',
      ),
    ],
  },
] as const;

export function getProduct(id: string): ProductEntry | undefined {
  return productEntries.find((product) => product.id === id);
}

/** Live tariff row backing one product service option — price, `from`, image. */
export function tariffRowFor(option: ProductServiceOption) {
  return amountOf(option.catalogId, option.groupId, option.item);
}

/**
 * Which product page (if any) a tariff row belongs to — so a tariff card on
 * /pricing/ can link its title/photo straight to that garment's own product
 * page. Most tariff rows have no product page yet and simply return
 * undefined, leaving those cards exactly as they were.
 */
export function productForTariffRow(
  catalogId: TariffCatalog['id'],
  groupId: string,
  item: string,
): ProductEntry | undefined {
  return productEntries.find((product) =>
    product.services.some(
      (option) =>
        option.catalogId === catalogId && option.groupId === groupId && option.item === item,
    ),
  );
}
