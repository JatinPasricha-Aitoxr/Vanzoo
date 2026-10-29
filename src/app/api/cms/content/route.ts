import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { exec } from '@/lib/db';
import { CONTENT_TAG, getContentOverrides, getCatalogs } from '@/cms/content';
import { CONTENT_TYPES, typeDef } from '@/cms/contentFields';
import type { Field } from '@/cms/widgetDefs';
import { areaEntries } from '@/content/areas';
import { productEntries } from '@/content/products';
import { serviceEntries } from '@/content/services';
import { homeFaqs } from '@/content/marketing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PATH = /^(\/[A-Za-z0-9\-_/.%]*|https:\/\/[^\s<>"']+)$/;

/** zod schema generated from the same field list the editor shows, so the API accepts exactly what the form can send. */
function schemaFor(fields: Field[]): z.ZodTypeAny {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    switch (f.type) {
      case 'image': shape[f.key] = z.string().max(400).refine((v) => v === '' || PATH.test(v), 'Image must be a /path or https:// address.'); break;
      case 'textarea': shape[f.key] = z.string().max(6000); break;
      case 'lines': shape[f.key] = z.array(z.string().max(400)).max(40); break;
      case 'list': shape[f.key] = z.array(schemaFor(f.itemFields ?? [])).max(f.max ?? 40); break;
      default: shape[f.key] = z.string().max(400);
    }
  }
  return z.object(shape).partial().strict();
}

const KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Entry = { key: string; label: string; builtIn: boolean; edited: boolean; hidden: boolean };

async function list(type: string): Promise<Entry[]> {
  const ov = (await getContentOverrides())[type as 'service'] ?? {};
  const base: { key: string; label: string }[] =
    type === 'service' ? serviceEntries.map((s) => ({ key: s.id, label: s.title }))
    : type === 'product' ? productEntries.map((p) => ({ key: p.id, label: p.title }))
    : type === 'area' ? areaEntries.map((a) => ({ key: a.id, label: a.name }))
    : type === 'faq' ? [{ key: 'home', label: 'Homepage & contact page FAQs' }] : [];
  const seen = new Set(base.map((b) => b.key));
  const out: Entry[] = base.map((b) => ({ ...b, builtIn: true, edited: Boolean(ov[b.key]), hidden: Boolean(ov[b.key]?.hidden) }));
  for (const [k, v] of Object.entries(ov)) if (!seen.has(k)) out.push({ key: k, label: String((v as { title?: string }).title ?? k), builtIn: false, edited: true, hidden: Boolean((v as { hidden?: boolean }).hidden) });
  return out;
}

function baseFor(type: string, key: string): Record<string, unknown> | null {
  const pick = (src: Record<string, unknown>, fields: Field[]) => Object.fromEntries(fields.map((f) => [f.key, src[f.key]]));
  const def = typeDef(type);
  if (!def) return null;
  if (type === 'service') { const s = serviceEntries.find((x) => x.id === key); return s ? pick(s as never, def.fields) : null; }
  if (type === 'product') {
    const p = productEntries.find((x) => x.id === key);
    return p ? { ...pick(p as never, def.fields), options: p.services.map((o) => ({ catalogId: o.catalogId, groupId: o.groupId, item: o.item, label: o.label, description: o.description })) } : null;
  }
  if (type === 'area') { const a = areaEntries.find((x) => x.id === key); return a ? pick(a as never, def.fields) : null; }
  if (type === 'faq') return { items: homeFaqs.map((f) => ({ question: f.question, answer: f.answer })) };
  return null;
}

export async function GET(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const u = new URL(req.url);
  const type = u.searchParams.get('type') ?? '';
  const key = u.searchParams.get('key');
  const def = typeDef(type);
  if (!def) return NextResponse.json({ types: CONTENT_TYPES.map((c) => ({ type: c.type, label: c.label, plural: c.plural, description: c.description, canAdd: c.canAdd, canHide: c.canHide })) });
  if (!key) return NextResponse.json({ def, entries: await list(type) });
  const ov = (await getContentOverrides())[type as 'service']?.[key] ?? null;
  const base = baseFor(type, key);
  if (!base && !ov) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  // Tariff rows an editor can attach to a new garment page.
  const rows = type === 'product' ? await tariffChoices() : undefined;
  return NextResponse.json({ def, base, override: ov, builtIn: Boolean(base), rows });
}

async function tariffChoices() {
  const c = await getCatalogs();
  return [c.couture, c.steam].flatMap((cat) => cat.groups.flatMap((g) => g.rows.map((r) => ({ catalogId: cat.id, groupId: g.id, item: r.item, label: `${cat.label} · ${g.label} · ${r.item}` }))));
}

const OptionPatch = z.object({ label: z.string().max(120).optional(), description: z.string().max(600).optional(), hidden: z.boolean().optional() });
const NewOption = z.object({ serviceId: z.string().max(80), catalogId: z.enum(['couture', 'steam-iron']), groupId: z.string().max(80), item: z.string().max(120), label: z.string().max(120), description: z.string().max(600) });
const Body = z.object({ type: z.string(), key: z.string().regex(KEY, 'Address: lowercase letters, digits and hyphens.').max(80), data: z.record(z.string(), z.unknown()), hidden: z.boolean().optional() });

export async function PUT(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  const def = b.success ? typeDef(b.data.type) : undefined;
  if (!b.success || !def) return NextResponse.json({ error: b.success ? 'Unknown content type.' : b.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  const { type, key } = b.data;
  const isBuiltIn = baseFor(type, key) !== null;
  if (!isBuiltIn && !def.canAdd) return NextResponse.json({ error: 'That entry does not exist.' }, { status: 404 });

  const { options, services, ...rest } = b.data.data as { options?: unknown; services?: unknown };
  const parsed = schemaFor(def.fields).safeParse(rest);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid content.' }, { status: 400 });
  const data: Record<string, unknown> = { ...(parsed.data as object) };
  if (b.data.hidden !== undefined) {
    if (!def.canHide) return NextResponse.json({ error: 'This content cannot be hidden.' }, { status: 400 });
    data.hidden = b.data.hidden;
  }
  if (type === 'product') {
    if (options !== undefined) {
      const m = z.record(z.string(), OptionPatch).safeParse(options);
      if (!m.success) return NextResponse.json({ error: 'Invalid treatment edits.' }, { status: 400 });
      data.options = m.data;
    }
    if (services !== undefined) {
      const s = z.array(NewOption).min(1, 'Add at least one treatment.').max(6).safeParse(services);
      if (!s.success) return NextResponse.json({ error: s.error.issues[0]?.message ?? 'Invalid treatments.' }, { status: 400 });
      const choices = await tariffChoices();
      for (const o of s.data) if (!choices.some((c) => c.catalogId === o.catalogId && c.groupId === o.groupId && c.item === o.item)) return NextResponse.json({ error: `“${o.item}” is not a row in the price list.` }, { status: 400 });
      data.services = s.data;
    }
  }
  if (!isBuiltIn) {
    if (!(data as { title?: string }).title?.trim()) return NextResponse.json({ error: 'A name is required.' }, { status: 400 });
    if (type === 'product' && !data.services) return NextResponse.json({ error: 'Add at least one treatment (a price-list row).' }, { status: 400 });
  }
  await exec('INSERT INTO cms_content (type, k, data, updated_by) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by)', [type, key, JSON.stringify(data), a.session.u]);
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
  // Route handlers aren't covered by the layout revalidation above.
  revalidatePath('/sitemap.xml');
  revalidatePath('/api/search-index');
  await audit(a.session.u, 'content_save', `${type}/${key}`);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = z.object({ type: z.string(), key: z.string() }).safeParse(await req.json().catch(() => null));
  if (!b.success || !typeDef(b.data.type)) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  await exec('DELETE FROM cms_content WHERE type = ? AND k = ?', [b.data.type, b.data.key]);
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
  // Route handlers aren't covered by the layout revalidation above.
  revalidatePath('/sitemap.xml');
  revalidatePath('/api/search-index');
  await audit(a.session.u, 'content_revert', `${b.data.type}/${b.data.key}`);
  return NextResponse.json({ ok: true });
}
