import type { AreaEntry } from '@/content/areas';
import type { ProductEntry, ProductServiceOption } from '@/content/products';
import type { TariffCatalog, TariffRow } from '@/content/pricing';
import type { ServiceEntry } from '@/content/services';

/**
 * Pure functions that lay editor overrides (rows in `cms_content`) over the
 * code-defined catalogue. No server-only imports, so the same logic can run
 * anywhere. With no overrides every function returns data equal to its input.
 */

export type ContentType = 'service' | 'product' | 'area' | 'tariff' | 'store' | 'faq';
export type Overrides = Partial<Record<ContentType, Record<string, any>>>;

const isObj = (v: unknown): v is Record<string, any> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Copies only the keys an editor actually set (empty strings / empty lists mean “use the built-in value”). */
export function definedFields<T extends Record<string, any>>(patch: T | undefined): Partial<T> {
  const out: Record<string, any> = {};
  if (!patch) return out as Partial<T>;
  for (const [k, v] of Object.entries(patch)) {
    if (k === 'hidden' || v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as Partial<T>;
}

// ------------------------------------------------------------------ tariffs

export type TariffOverride = {
  /** Keyed `${groupId}|${item}`. */
  rows?: Record<string, { amount?: number; from?: boolean; image?: string; hidden?: boolean }>;
  /** Rows added by an editor, appended to their group. */
  added?: { group: string; item: string; amount: number; from?: boolean; image?: string }[];
};

export const rowKey = (groupId: string, item: string) => `${groupId}|${item}`;

export function applyTariff(base: TariffCatalog, ov: TariffOverride | undefined): TariffCatalog {
  if (!ov || (!ov.rows && !ov.added?.length)) return base;
  return {
    ...base,
    groups: base.groups.map((group) => {
      const rows: TariffRow[] = [];
      for (const row of group.rows) {
        const p = ov.rows?.[rowKey(group.id, row.item)];
        if (p?.hidden) continue;
        rows.push(p ? { ...row, amount: typeof p.amount === 'number' ? p.amount : row.amount, from: p.from === undefined ? row.from : p.from || undefined, image: p.image || row.image } : row);
      }
      for (const add of ov.added ?? []) {
        if (add.group === group.id) rows.push({ item: add.item, amount: add.amount, from: add.from || undefined, image: add.image || '/images/brand/vanzoo-mark.png' });
      }
      return { ...group, rows };
    }),
  };
}

export type Catalogs = { couture: TariffCatalog; steam: TariffCatalog };

export function findRow(catalogs: Catalogs, catalogId: string, groupId: string, item: string): TariffRow | undefined {
  const cat = catalogId === 'couture' ? catalogs.couture : catalogs.steam;
  return cat.groups.find((g) => g.id === groupId)?.rows.find((r) => r.item === item);
}

// ----------------------------------------------------------------- services

export type ServiceOverride = Partial<ServiceEntry> & { hidden?: boolean };

export function applyServices(base: readonly ServiceEntry[], ov: Record<string, ServiceOverride> | undefined, catalogs: Catalogs): ServiceEntry[] {
  const out: ServiceEntry[] = [];
  const seen = new Set<string>();
  for (const s of base) {
    seen.add(s.id);
    const p = ov?.[s.id];
    if (p?.hidden) continue;
    let next: ServiceEntry = p ? ({ ...s, ...definedFields(p), id: s.id } as ServiceEntry) : s;
    if (next.from?.ref) {
      const [cid, gid, item] = next.from.ref;
      const row = findRow(catalogs, cid, gid, item);
      if (row && row.amount !== next.from.amount && !p?.from) next = { ...next, from: { ...next.from, amount: row.amount } };
    }
    out.push(next);
  }
  // Services created in the CMS.
  for (const [id, p] of Object.entries(ov ?? {})) {
    if (seen.has(id) || p.hidden || !p.title) continue;
    out.push({
      id,
      title: p.title,
      body: p.body ?? '',
      longBody: p.longBody ?? p.body ?? '',
      highlights: p.highlights ?? [],
      image: p.image ?? '/images/brand/vanzoo-mark.png',
      imageAlt: p.imageAlt ?? p.title,
      from: p.from ?? null,
      tariffHref: p.tariffHref ?? '/pricing/',
      tariffLabel: p.tariffLabel ?? 'View tariffs',
      tariffPreview: null,
      ...definedFields(p),
    } as ServiceEntry);
  }
  return out;
}

// ----------------------------------------------------------------- products

export type ProductOverride = {
  title?: string;
  intro?: string;
  heroImage?: string;
  heroImageAlt?: string;
  hidden?: boolean;
  /** Per-option edits, matched by `${catalogId}|${groupId}|${item}`. */
  options?: Record<string, { label?: string; description?: string; hidden?: boolean }>;
  /** Full definition for a product created in the CMS. */
  services?: ProductServiceOption[];
};

export const optionKey = (o: Pick<ProductServiceOption, 'catalogId' | 'groupId' | 'item'>) => `${o.catalogId}|${o.groupId}|${o.item}`;

export function applyProducts(base: readonly ProductEntry[], ov: Record<string, ProductOverride> | undefined, catalogs: Catalogs): ProductEntry[] {
  const keep = (o: ProductServiceOption) => Boolean(findRow(catalogs, o.catalogId, o.groupId, o.item));
  const out: ProductEntry[] = [];
  const seen = new Set<string>();
  const build = (p: ProductEntry, o: ProductOverride | undefined): ProductEntry | null => {
    if (o?.hidden) return null;
    const services = p.services
      .filter(keep)
      .filter((opt) => !o?.options?.[optionKey(opt)]?.hidden)
      .map((opt) => {
        const e = o?.options?.[optionKey(opt)];
        return e ? { ...opt, ...definedFields(e) } : opt;
      });
    if (!services.length) return null; // every treatment was removed or its price row is gone
    return { ...p, ...definedFields({ title: o?.title, intro: o?.intro, heroImage: o?.heroImage, heroImageAlt: o?.heroImageAlt }), services };
  };
  for (const p of base) {
    seen.add(p.id);
    const b = build(p, ov?.[p.id]);
    if (b) out.push(b);
  }
  for (const [id, o] of Object.entries(ov ?? {})) {
    if (seen.has(id) || o.hidden || !o.title || !o.services?.length) continue;
    const b = build({ id, title: o.title, intro: o.intro ?? '', heroImage: o.heroImage ?? '/images/brand/vanzoo-mark.png', heroImageAlt: o.heroImageAlt ?? o.title, services: o.services }, undefined);
    if (b) out.push(b);
  }
  return out;
}

// -------------------------------------------------------------------- areas

export type AreaOverride = Partial<Pick<AreaEntry, 'metaTitle' | 'metaDescription' | 'headline' | 'intro' | 'localNotes'>>;

export function applyAreas(base: readonly AreaEntry[], ov: Record<string, AreaOverride> | undefined): AreaEntry[] {
  if (!ov) return [...base];
  // Localities can be edited but not removed: coverage chips and pincode logic elsewhere depend on every one having a page.
  return base.map((a) => (ov[a.id] ? ({ ...a, ...definedFields(ov[a.id]) } as AreaEntry) : a));
}

/** `catalogId|groupId|item` → product page, so tariff cards can link to a garment's page. */
export function productHrefs(products: readonly ProductEntry[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of products) for (const o of p.services) out[`${o.catalogId}|${o.groupId}|${o.item}`] ??= `/products/${p.id}/`;
  return out;
}

export { isObj };
