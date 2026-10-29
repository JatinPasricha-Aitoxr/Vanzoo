import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { POSTS_TAG } from '@/cms/blogStore';
import { readingMinutes, sanitizeHtml } from '@/cms/sanitize';
import { posts as builtIn } from '@/content/blog';
import { exec, parseJson, query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Row = { slug: string; title: string; excerpt: string; body: string; image: string | null; image_alt: string; categories: unknown; tags: unknown; status: 'draft' | 'published'; hidden: 0 | 1; published_at: string | null; updated_at: string };
const COLS = 'slug, title, excerpt, body, image, image_alt, categories, tags, status, hidden, published_at, updated_at';
const iso = (s: string | null) => (s ? `${s.replace(' ', 'T')}Z` : null);

export async function GET(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const rows = await query<Row>(`SELECT ${COLS} FROM cms_posts`);
  const slug = new URL(req.url).searchParams.get('slug');
  if (slug) {
    const r = rows.find((x) => x.slug === slug);
    const b = builtIn.find((x) => x.slug === slug);
    if (!r && !b) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    const src = r
      ? { slug: r.slug, title: r.title, excerpt: r.excerpt, body: r.body, image: r.image ?? '', imageAlt: r.image_alt, categories: parseJson<string[]>(r.categories, []), tags: parseJson<string[]>(r.tags, []), status: r.status, hidden: Boolean(r.hidden), publishedAt: iso(r.published_at) }
      : { slug: b!.slug, title: b!.title, excerpt: b!.excerpt, body: b!.body, image: b!.image ?? '', imageAlt: b!.imageAlt, categories: b!.categories, tags: b!.tags, status: 'published' as const, hidden: false, publishedAt: new Date(b!.publishedAt).toISOString() };
    return NextResponse.json({ post: src, builtIn: Boolean(b), saved: Boolean(r) });
  }
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const list = [
    ...rows.filter((r) => !builtIn.some((b) => b.slug === r.slug)).map((r) => ({ slug: r.slug, title: r.title, source: 'cms' as const, status: r.status, hidden: Boolean(r.hidden), date: iso(r.published_at) ?? iso(r.updated_at) })),
    ...builtIn.map((b) => { const r = bySlug.get(b.slug); return { slug: b.slug, title: r?.title ?? b.title, source: r ? ('edited' as const) : ('built-in' as const), status: r ? r.status : ('published' as const), hidden: Boolean(r?.hidden), date: r ? iso(r.published_at) : b.publishedAt }; }),
  ];
  return NextResponse.json({ posts: list });
}

const Body = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug: lowercase letters, digits and hyphens.').max(120),
  title: z.string().trim().min(3, 'Add a title.').max(200),
  excerpt: z.string().trim().max(500),
  body: z.string().max(400_000),
  image: z.string().max(400).regex(/^(\/uploads\/|\/images\/|https:\/\/)[^\s<>"]*$/).or(z.literal('')),
  imageAlt: z.string().max(255),
  categories: z.array(z.string().trim().min(1).max(60)).max(5),
  tags: z.array(z.string().trim().min(1).max(40)).max(15),
  status: z.enum(['draft', 'published']),
  hidden: z.boolean().default(false),
  publishedAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date.').nullable().optional(),
});

function revalidateBlog(slug: string) {
  revalidateTag(POSTS_TAG);
  for (const p of ['/', '/blogs/', `/blogs/${slug}/`, '/sitemap.xml', '/site-map/']) revalidatePath(p);
  revalidatePath('/blogs/category/[slug]', 'page');
}

export async function PUT(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid post.' }, { status: 400 });
  const d = b.data;
  const body = sanitizeHtml(d.body);
  if (d.status === 'published') {
    if (!d.excerpt) return NextResponse.json({ error: 'Add an excerpt before publishing — it is the meta description fallback.' }, { status: 400 });
    if (body.replace(/<[^>]+>/g, '').trim().length < 50) return NextResponse.json({ error: 'The article body is empty or too short to publish.' }, { status: 400 });
    if (d.image && !d.imageAlt.trim()) return NextResponse.json({ error: 'Describe the featured image (alt text) before publishing.' }, { status: 400 });
  }
  const when = d.status === 'published' ? new Date(d.publishedAt ?? Date.now()) : d.publishedAt ? new Date(d.publishedAt) : null;
  const dt = when ? when.toISOString().slice(0, 19).replace('T', ' ') : null;
  await exec(
    `INSERT INTO cms_posts (slug, title, excerpt, body, image, image_alt, categories, tags, reading_minutes, status, hidden, published_at, created_by)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE title=VALUES(title), excerpt=VALUES(excerpt), body=VALUES(body), image=VALUES(image), image_alt=VALUES(image_alt), categories=VALUES(categories), tags=VALUES(tags), reading_minutes=VALUES(reading_minutes), status=VALUES(status), hidden=VALUES(hidden), published_at=VALUES(published_at)`,
    [d.slug, d.title, d.excerpt, body, d.image || null, d.imageAlt, JSON.stringify(d.categories), JSON.stringify(d.tags), readingMinutes(body), d.status, d.hidden ? 1 : 0, dt, a.session.u],
  );
  revalidateBlog(d.slug);
  await audit(a.session.u, 'post_save', d.slug, { status: d.status, hidden: d.hidden });
  return NextResponse.json({ ok: true, body });
}

export async function DELETE(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = z.object({ slug: z.string().max(190) }).safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  await exec('DELETE FROM cms_posts WHERE slug = ?', [b.data.slug]);
  revalidateBlog(b.data.slug);
  await audit(a.session.u, 'post_delete', b.data.slug);
  return NextResponse.json({ ok: true });
}
