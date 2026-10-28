import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { SEO_TAG, getOverrides, saveOverride } from '@/cms/seoStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  // Bypass the cache so the admin always sees what is stored.
  const { query, parseJson } = await import('@/lib/db');
  const rows = await query<{ path: string; data: unknown }>('SELECT path, data FROM seo_overrides');
  void getOverrides;
  return NextResponse.json({ overrides: Object.fromEntries(rows.map((r) => [r.path, parseJson(r.data, {})])) });
}

const url = z.string().max(300).regex(/^(\/|https?:\/\/)[^\s<>"]*$/).or(z.literal(''));
const Body = z.object({
  path: z.string().regex(/^\/[A-Za-z0-9\-_/.]*$/).max(300),
  data: z.object({
    title: z.string().max(120).optional(),
    description: z.string().max(320).optional(),
    canonical: url.optional(),
    noindex: z.boolean().optional(),
    nofollow: z.boolean().optional(),
    ogTitle: z.string().max(120).optional(),
    ogDescription: z.string().max(320).optional(),
    ogImage: url.optional(),
  }),
});

export async function PUT(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: 'Invalid SEO values.' }, { status: 400 });
  await saveOverride(b.data.path, b.data.data);
  revalidateTag(SEO_TAG);
  revalidatePath(b.data.path);
  await audit(a.session.u, 'seo_override', b.data.path);
  return NextResponse.json({ ok: true });
}
