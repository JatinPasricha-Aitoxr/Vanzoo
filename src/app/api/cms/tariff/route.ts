import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireAdmin } from '@/lib/auth';
import { exec } from '@/lib/db';
import { CONTENT_TAG, getContentOverrides } from '@/cms/content';
import { type TariffOverride, rowKey } from '@/cms/contentApply';
import { coutureCatalog, steamIronCatalog } from '@/content/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATALOGS = { couture: coutureCatalog, 'steam-iron': steamIronCatalog } as const;

/** Both price lists as built in, plus whatever an administrator has changed. Pricing is administrator-only. */
export async function GET() {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const ov = (await getContentOverrides()).tariff ?? {};
  return NextResponse.json({
    catalogs: Object.entries(CATALOGS).map(([id, c]) => ({
      id, label: c.label,
      groups: c.groups.map((g) => ({ id: g.id, label: g.label, rows: g.rows.map((r) => ({ item: r.item, amount: r.amount, from: Boolean(r.from), image: r.image })) })),
    })),
    overrides: ov,
  });
}

const Row = z.object({ amount: z.number().int().min(0).max(1_000_000).optional(), from: z.boolean().optional(), image: z.string().max(400).regex(/^(\/|https:\/\/)[^\s<>"']*$/).or(z.literal('')).optional(), hidden: z.boolean().optional() });
const Added = z.object({ group: z.string().max(80), item: z.string().trim().min(1).max(120), amount: z.number().int().min(0).max(1_000_000), from: z.boolean().optional(), image: z.string().max(400).regex(/^(\/|https:\/\/)[^\s<>"']*$/).or(z.literal('')).optional() });
const Body = z.object({ catalog: z.enum(['couture', 'steam-iron']), rows: z.record(z.string(), Row).default({}), added: z.array(Added).max(100).default([]) });

export async function PUT(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid prices.' }, { status: 400 });
  const cat = CATALOGS[b.data.catalog];
  const known = new Map(cat.groups.flatMap((g) => g.rows.map((r) => [rowKey(g.id, r.item), r] as const)));
  const rows: NonNullable<TariffOverride['rows']> = {};
  for (const [k, v] of Object.entries(b.data.rows)) {
    const base = known.get(k);
    if (!base) return NextResponse.json({ error: `Unknown price row “${k}”.` }, { status: 400 });
    // Store only what differs from the built-in row.
    const diff: Record<string, unknown> = {};
    if (v.amount !== undefined && v.amount !== base.amount) diff.amount = v.amount;
    if (v.from !== undefined && v.from !== Boolean(base.from)) diff.from = v.from;
    if (v.image && v.image !== base.image) diff.image = v.image;
    if (v.hidden) diff.hidden = true;
    if (Object.keys(diff).length) rows[k] = diff;
  }
  const groupIds = new Set(cat.groups.map((g) => g.id));
  const seen = new Set<string>();
  for (const add of b.data.added) {
    if (!groupIds.has(add.group)) return NextResponse.json({ error: `Unknown category “${add.group}”.` }, { status: 400 });
    const k = rowKey(add.group, add.item);
    if (known.has(k) || seen.has(k)) return NextResponse.json({ error: `“${add.item}” already exists in that category.` }, { status: 400 });
    seen.add(k);
  }
  const data: TariffOverride = { rows, added: b.data.added };
  await exec('INSERT INTO cms_content (type, k, data, updated_by) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by)', ['tariff', b.data.catalog, JSON.stringify(data), a.session.u]);
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
  // Route handlers aren't covered by the layout revalidation above.
  revalidatePath('/sitemap.xml');
  revalidatePath('/api/search-index');
  await audit(a.session.u, 'tariff_save', b.data.catalog, { changed: Object.keys(rows).length, added: b.data.added.length });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = z.object({ catalog: z.enum(['couture', 'steam-iron']) }).safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  await exec('DELETE FROM cms_content WHERE type = ? AND k = ?', ['tariff', b.data.catalog]);
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
  // Route handlers aren't covered by the layout revalidation above.
  revalidatePath('/sitemap.xml');
  revalidatePath('/api/search-index');
  await audit(a.session.u, 'tariff_reset', b.data.catalog);
  return NextResponse.json({ ok: true });
}
