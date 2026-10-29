import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireAdmin } from '@/lib/auth';
import { SITECFG_TAG, getSiteConfig } from '@/cms/siteConfig';
import { writeSetting } from '@/cms/seoStore';
import { footerColumns, navLinks, socialLinks } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const c = await getSiteConfig();
  return NextResponse.json({
    config: {
      nav: c.nav ?? navLinks.map((l) => ({ label: l.label, href: l.href })),
      footerColumns: c.footerColumns ?? footerColumns.map((x) => ({ heading: x.heading, links: x.links.map((l) => ({ label: l.label, href: l.href })) })),
      social: c.social ?? socialLinks.map((s) => ({ label: s.label, href: s.href })),
    },
    customised: { nav: Boolean(c.nav), footerColumns: Boolean(c.footerColumns), social: Boolean(c.social) },
  });
}

const href = z.string().trim().max(300).regex(/^(\/[A-Za-z0-9\-_/.#?=&%]*|https?:\/\/[^\s<>"']+|tel:[+0-9]+|mailto:[^\s<>"']+)$/, 'Links must start with / or https://');
const label = z.string().trim().min(1, 'Every link needs a label.').max(60);
const Item = z.object({ label, href });
const Body = z.object({
  nav: z.array(Item).min(1).max(10).optional(),
  footerColumns: z.array(z.object({ heading: label, links: z.array(Item).max(20) })).max(5).optional(),
  social: z.array(z.object({ label, href: z.string().regex(/^https:\/\/[^\s<>"']+$/, 'Social links must be https:// URLs.') })).max(8).optional(),
});

export async function PUT(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid menu.' }, { status: 400 });
  await writeSetting('siteconfig', b.data);
  revalidateTag(SITECFG_TAG);
  revalidatePath('/', 'layout');
  await audit(a.session.u, 'siteconfig_update');
  return NextResponse.json({ ok: true });
}
