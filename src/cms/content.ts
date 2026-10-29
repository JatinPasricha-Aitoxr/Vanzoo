import { unstable_cache } from 'next/cache';
import { areaEntries } from '@/content/areas';
import { homeFaqs, type Faq } from '@/content/marketing';
import { coutureCatalog, steamIronCatalog } from '@/content/pricing';
import { productEntries, type ProductEntry, type ProductServiceOption } from '@/content/products';
import { serviceEntries, type ServiceEntry } from '@/content/services';
import { dbConfigured, parseJson, query } from '@/lib/db';
import { applyAreas, applyProducts, applyServices, applyTariff, findRow, type Catalogs, type ContentType, type Overrides } from './contentApply';

/**
 * Server-side accessors for the editable catalogue: the code-defined data with
 * editor overrides from `cms_content` laid over it. If the database is absent
 * or unreachable, every accessor returns the built-in data unchanged.
 */
export const CONTENT_TAG = 'content';

async function loadOverrides(): Promise<Overrides> {
  if (!dbConfigured()) return {};
  try {
    const rows = await query<{ type: ContentType; k: string; data: unknown }>('SELECT type, k, data FROM cms_content');
    const out: Overrides = {};
    for (const r of rows) (out[r.type] ??= {})[r.k] = parseJson(r.data, {});
    return out;
  } catch {
    return {};
  }
}

export const getContentOverrides = unstable_cache(loadOverrides, ['content-overrides'], { tags: [CONTENT_TAG], revalidate: 300 });

export async function getCatalogs(): Promise<Catalogs> {
  const ov = await getContentOverrides();
  return { couture: applyTariff(coutureCatalog, ov.tariff?.couture), steam: applyTariff(steamIronCatalog, ov.tariff?.['steam-iron']) };
}

export async function getServices(): Promise<ServiceEntry[]> {
  const [ov, catalogs] = await Promise.all([getContentOverrides(), getCatalogs()]);
  return applyServices(serviceEntries, ov.service, catalogs);
}
export async function getService(id: string) {
  return (await getServices()).find((s) => s.id === id);
}
export const relatedOfServices = (list: readonly ServiceEntry[], current: ServiceEntry, count = 3) => list.filter((s) => s.id !== current.id).slice(0, count);

export async function getProducts(): Promise<ProductEntry[]> {
  const [ov, catalogs] = await Promise.all([getContentOverrides(), getCatalogs()]);
  return applyProducts(productEntries, ov.product, catalogs);
}
export async function getProduct(id: string) {
  return (await getProducts()).find((p) => p.id === id);
}

/** The live (edited) tariff row behind one product option. */
export function rowFor(catalogs: Catalogs, option: ProductServiceOption) {
  const row = findRow(catalogs, option.catalogId, option.groupId, option.item);
  if (!row) throw new Error(`Tariff row missing: ${option.catalogId}/${option.groupId}/${option.item}`);
  return row;
}

/** Which product page (if any) a tariff row belongs to. */
export function productFor(products: readonly ProductEntry[], catalogId: string, groupId: string, item: string) {
  return products.find((p) => p.services.some((o) => o.catalogId === catalogId && o.groupId === groupId && o.item === item));
}

export async function getAreas() {
  return applyAreas(areaEntries, (await getContentOverrides()).area);
}
export async function getArea(id: string) {
  return (await getAreas()).find((a) => a.id === id);
}
export async function getAreaFor(name: string) {
  return (await getAreas()).find((a) => a.name === name);
}

/** The FAQ list used on the homepage and the contact page; an editor-saved list replaces the built-in one. */
export async function getHomeFaqs(): Promise<readonly Faq[]> {
  const items = (await getContentOverrides()).faq?.home?.items as Faq[] | undefined;
  const clean = (items ?? []).filter((f) => f?.question?.trim() && f?.answer?.trim());
  return clean.length ? clean : homeFaqs;
}
