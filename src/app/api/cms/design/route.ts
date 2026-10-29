import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireAdmin } from '@/lib/auth';
import { DESIGN_TAG, TOKENS, getDesign } from '@/cms/siteConfig';
import { writeSetting } from '@/cms/seoStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  return NextResponse.json({ tokens: TOKENS, overrides: await getDesign() });
}

const Body = z.record(z.string(), z.string().regex(/^#[0-9a-f]{6}$/i, 'Colours must be #RRGGBB.'));

export async function PUT(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid tokens.' }, { status: 400 });
  const known = new Set<string>(TOKENS.map((t) => t.key));
  const clean = Object.fromEntries(Object.entries(b.data).filter(([k]) => known.has(k)));
  await writeSetting('design', clean);
  revalidateTag(DESIGN_TAG);
  revalidatePath('/', 'layout');
  await audit(a.session.u, 'design_update', undefined, clean);
  return NextResponse.json({ ok: true });
}
