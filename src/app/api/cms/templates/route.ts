import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { exec, query } from '@/lib/db';
import { TEMPLATE_SLOTS, templateSlug } from '@/cms/pageRoutes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Row = { id: number; slug: string; status: 'draft' | 'published' };

/** The four detail-page template slots and whether each has a page behind it yet. */
export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const rows = await query<Row>('SELECT id, slug, status FROM pages WHERE slug LIKE "/\\\\_t/%"');
  return NextResponse.json({
    slots: TEMPLATE_SLOTS.map((s) => {
      const r = rows.find((x) => x.slug === templateSlug(s.slot));
      return { ...s, id: r?.id ?? null, status: r?.status ?? null };
    }),
  });
}

/** Creates the page behind a slot on first use, so the standard editor (draft, preview, publish) can be reused. */
export async function POST(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = z.object({ slot: z.enum(['service', 'product', 'area', 'post']) }).safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: 'Unknown template.' }, { status: 400 });
  const slug = templateSlug(b.data.slot);
  const [existing] = await query<Row>('SELECT id, slug, status FROM pages WHERE slug = ?', [slug]);
  if (existing) return NextResponse.json({ id: existing.id });
  const label = TEMPLATE_SLOTS.find((s) => s.slot === b.data.slot)!.label;
  const res = await exec('INSERT INTO pages (slug, title, status, seo) VALUES (?, ?, "draft", ?)', [slug, `Template: ${label}`, JSON.stringify({ noindex: true })]);
  await audit(a.session.u, 'template_create', slug);
  return NextResponse.json({ id: res.insertId });
}
