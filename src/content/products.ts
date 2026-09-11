/**
 * Product catalogue — one page per garment at /products/[slug]/, each showing
 * every service treatment available for that garment side by side.
 *
 * A product doesn't carry its own price: every `services` entry points at an
 * existing row in content/pricing.ts, so "Shirt" here can never drift from the
 * couture and steam-iron tariffs on /pricing/. Adding a garment later (a
 * Trouser, a Saree) means one more `ProductEntry` with its own `services` list
 * — no page code changes.
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

export const productEntries: readonly ProductEntry[] = [
  {
    id: 'shirt',
    title: 'Shirt',
    intro:
      'From a boardroom formal to a weekend cotton shirt, choose full couture dry cleaning or a quick steam press — both collected free from your door.',
    heroImage: '/images/tariffs/shirt.jpg',
    heroImageAlt: 'Freshly pressed shirt cared for by Vanzoo in Gurgaon',
    services: [
      {
        serviceId: 'couture-care',
        catalogId: 'couture',
        groupId: 'mens-garments',
        item: 'Shirt',
        label: 'Dry Clean & Press',
        description:
          'Full couture care — cleaned in our closed-loop hydrocarbon system and hand-pressed, for collars, cuffs and fabric that need more than a press.',
      },
      {
        serviceId: 'steam-iron',
        catalogId: 'steam-iron',
        groupId: 'everyday-wear',
        item: 'Shirt',
        label: 'Steam Press Only',
        description:
          'For a shirt that is already clean and just needs a sharp finish — professional steam pressing, no cleaning involved.',
      },
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
