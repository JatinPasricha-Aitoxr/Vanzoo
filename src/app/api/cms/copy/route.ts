import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { COPY_TAG, getCopyOverrides } from '@/cms/facts';
import { setLiveCopy, stringLeaves, type CopyOverrides } from '@/cms/liveCopy';
import { writeSetting } from '@/cms/seoStore';
import { about, appPromo, differentiators, guarantee, homeHero, heroOffer, howItWorksSteps, hydrocarbon, membership, personas, processSteps, trustMarkers, uspCards, weCare } from '@/content/marketing';
import { gurgaonPage, nearMePage } from '@/content/landing';
import { pillars, pillarsIntro } from '@/content/pillars';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Built-in content objects whose text an editor can change. `value` is the live (proxied) object. */
const SOURCES: { name: string; label: string; where: string; value: unknown }[] = [
  { name: 'about', label: 'About page', where: '/about-us/', value: about },
  { name: 'membership', label: 'Membership page & plans', where: '/membership/', value: membership },
  { name: 'hydrocarbon', label: 'Hydrocarbon technology', where: '/hydrocarbon-tech/', value: hydrocarbon },
  { name: 'nearMePage', label: '“Best dry cleaners near me” page', where: '/best-dry-cleaners-near-me/', value: nearMePage },
  { name: 'gurgaonPage', label: '“Best dry cleaning in Gurgaon” page', where: '/best-dry-cleaning-in-gurgaon/', value: gurgaonPage },
  { name: 'guarantee', label: 'Our promise block', where: 'shown on many pages', value: guarantee },
  { name: 'appPromo', label: 'App download block', where: 'shown on many pages', value: appPromo },
  { name: 'weCare', label: '“We care” banner', where: 'shown on several pages', value: weCare },
  { name: 'pillarsIntro', label: 'Why choose us — intro', where: 'homepage & service pages', value: pillarsIntro },
  { name: 'pillars', label: 'Why choose us — pillars', where: 'homepage & service pages', value: pillars },
  { name: 'differentiators', label: 'What makes Vanzoo different', where: 'About page & landing pages', value: differentiators },
  { name: 'uspCards', label: 'Highlights carousel', where: 'Hydrocarbon page', value: uspCards },
  { name: 'trustMarkers', label: 'Trust strip', where: 'homepage', value: trustMarkers },
  { name: 'howItWorksSteps', label: 'How it works', where: 'service & product pages', value: howItWorksSteps },
  { name: 'processSteps', label: 'Process steps', where: 'homepage', value: processSteps },
  { name: 'personas', label: 'Who we look after', where: 'homepage', value: personas },
  { name: 'homeHero', label: 'Homepage hero (defaults)', where: '/', value: homeHero },
  { name: 'heroOffer', label: 'Homepage offer', where: '/', value: heroOffer },
];

/** Reads the built-in text, ignoring any saved overrides. */
function baseLeaves(value: unknown): Record<string, string> {
  const saved = (globalThis as { __vzCopy?: CopyOverrides }).__vzCopy;
  setLiveCopy({});
  try {
    return stringLeaves(value);
  } finally {
    setLiveCopy(saved ?? {});
  }
}

const looksLikeImage = (s: string) => /^\/[^\s]+\.(png|jpe?g|webp|avif|gif|svg)$/i.test(s);

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const overrides = await getCopyOverrides();
  return NextResponse.json({
    sources: SOURCES.map((s) => ({ name: s.name, label: s.label, where: s.where, leaves: baseLeaves(s.value) })),
    overrides,
  });
}

const Body = z.object({ source: z.string(), paths: z.record(z.string(), z.string().max(4000)) });

export async function PUT(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  const src = b.success ? SOURCES.find((s) => s.name === b.data.source) : undefined;
  if (!b.success || !src) return NextResponse.json({ error: 'Unknown text group.' }, { status: 400 });
  const base = baseLeaves(src.value);
  const clean: Record<string, string> = {};
  for (const [path, text] of Object.entries(b.data.paths)) {
    if (!(path in base)) return NextResponse.json({ error: `“${path}” is not editable text.` }, { status: 400 });
    if (text === base[path] || text.trim() === '') continue; // unchanged or cleared → built-in text
    if (looksLikeImage(base[path]) && !/^(\/uploads\/|\/images\/)[^\s<>"']+$/.test(text)) return NextResponse.json({ error: `“${path}” must be an image from the media library.` }, { status: 400 });
    clean[path] = text;
  }
  const all = { ...(await getCopyOverrides()) };
  if (Object.keys(clean).length) all[src.name] = clean;
  else delete all[src.name];
  await writeSetting('copy', all);
  setLiveCopy(all);
  revalidateTag(COPY_TAG);
  revalidatePath('/', 'layout');
  await audit(a.session.u, 'copy_save', src.name, { changed: Object.keys(clean).length });
  return NextResponse.json({ ok: true });
}

