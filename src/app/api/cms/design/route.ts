import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireAdmin } from '@/lib/auth';
import { DESIGN_TAG, TOKENS, getDesign } from '@/cms/siteConfig';
import { writeSetting } from '@/cms/seoStore';
import { setLiveDesign } from '@/cms/facts';
import { BP_RANGE, DISPLAY_FONTS, SANS_FONTS } from '@/cms/fonts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  return NextResponse.json({ tokens: TOKENS, overrides: await getDesign() });
}

const Body = z.record(z.string(), z.string().max(40));

export async function PUT(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid tokens.' }, { status: 400 });
  const colorKeys = new Set<string>(TOKENS.map((t) => t.key));
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(b.data)) {
    if (colorKeys.has(k)) {
      if (!/^#[0-9a-f]{6}$/i.test(v)) return NextResponse.json({ error: 'Colours must be #RRGGBB.' }, { status: 400 });
      clean[k] = v;
    } else if (k === 'font-display') {
      if (!DISPLAY_FONTS.some((f) => f.id === v)) return NextResponse.json({ error: 'Unknown heading font.' }, { status: 400 });
      clean[k] = v;
    } else if (k === 'font-sans') {
      if (!SANS_FONTS.some((f) => f.id === v)) return NextResponse.json({ error: 'Unknown body font.' }, { status: 400 });
      clean[k] = v;
    } else if (k === 'bp-tablet' || k === 'bp-mobile') {
      const [lo, hi] = BP_RANGE[k === 'bp-tablet' ? 'tablet' : 'mobile'];
      const n = Number(v);
      if (!Number.isInteger(n) || n < lo || n > hi) return NextResponse.json({ error: `${k === 'bp-tablet' ? 'Tablet' : 'Mobile'} breakpoint must be between ${lo} and ${hi} px.` }, { status: 400 });
      clean[k] = String(n);
    }
  }
  if (Number(clean['bp-mobile'] ?? 639) >= Number(clean['bp-tablet'] ?? 1023)) return NextResponse.json({ error: 'The mobile breakpoint must be smaller than the tablet breakpoint.' }, { status: 400 });
  await writeSetting('design', clean);
  setLiveDesign(clean);
  revalidateTag(DESIGN_TAG);
  revalidatePath('/', 'layout');
  await audit(a.session.u, 'design_update', undefined, clean);
  return NextResponse.json({ ok: true });
}
