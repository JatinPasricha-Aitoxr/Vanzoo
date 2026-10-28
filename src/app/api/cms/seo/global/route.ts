import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { DEFAULT_GLOBAL_SEO, SEO_TAG, writeSetting, type GlobalSeo } from '@/cms/seoStore';
import { dbConfigured, parseJson, query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const rows = dbConfigured() ? await query<{ v: unknown }>('SELECT v FROM settings WHERE k = "seo"') : [];
  return NextResponse.json({ seo: { ...DEFAULT_GLOBAL_SEO, ...parseJson<Partial<GlobalSeo>>(rows[0]?.v, {}) } });
}

/** Only these robots.txt directives may be added; anything else is rejected. */
const ROBOTS_LINE = /^(allow|disallow|crawl-delay|sitemap|user-agent):\s*\S.*$/i;
const path = z.string().regex(/^\/[A-Za-z0-9\-_/.*]*$/).max(300);

const Body = z.object({
  siteNoindex: z.boolean(),
  defaultDescription: z.string().max(320),
  defaultOgImage: z.string().max(300).regex(/^(\/|https?:\/\/)[^\s<>"]*$/).or(z.literal('')),
  robotsExtra: z.string().max(2000).refine((t) => t.split('\n').map((l) => l.trim()).filter(Boolean).every((l) => ROBOTS_LINE.test(l)), 'robots.txt lines must start with Allow, Disallow, Crawl-delay, Sitemap or User-agent.'),
  sitemapExclude: z.array(path).max(200),
  sitemapExtra: z.array(path).max(200),
});

export async function PUT(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid settings.' }, { status: 400 });
  await writeSetting('seo', b.data);
  revalidateTag(SEO_TAG);
  revalidatePath('/', 'layout');
  await audit(a.session.u, 'seo_global_update');
  return NextResponse.json({ ok: true });
}
