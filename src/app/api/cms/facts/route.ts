import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireAdmin } from '@/lib/auth';
import { FACTS_TAG, readFacts, setLiveFacts } from '@/cms/facts';
import { writeSetting } from '@/cms/seoStore';
import { brand, links, site, stores } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STORE_IDS = ['super-mart-1', 'vanzoo-urbana'] as const;

export async function GET() {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const saved = await readFacts();
  // Built-in defaults alongside what is saved, so the form can show what “blank” means.
  setLiveFacts({});
  const defaults = {
    phone: site.phone, whatsapp: site.whatsapp, email: site.email,
    bookPickup: links.bookPickup, bookService: links.bookService, playStore: links.playStore, appStore: links.appStore,
    logo: brand.logo, mark: brand.mark, favicon: brand.favicon,
    stores: Object.fromEntries(stores.map((s) => [s.id, { name: s.name, address: s.address, locality: s.locality, postalCode: s.postalCode, mapQuery: s.mapQuery }])),
  };
  setLiveFacts(saved);
  return NextResponse.json({ saved, defaults });
}

const https = z.string().trim().max(400).regex(/^https:\/\/[^\s<>"']+$/, 'Links must start with https://');
const img = z.string().trim().max(300).regex(/^(\/uploads\/|\/images\/)[^\s<>"']+$/, 'Images must come from the media library.');
const storeFields = z.object({
  name: z.string().trim().max(120), address: z.string().trim().max(300), locality: z.string().trim().max(120),
  postalCode: z.string().trim().regex(/^(\d{6})?$/, 'Postal code must be 6 digits.'), mapQuery: z.string().trim().max(300),
}).partial();
const Body = z.object({
  phone: z.string().trim().regex(/^(\+?[0-9][0-9 ()-]{6,19})?$/, 'Enter a valid phone number, e.g. +91 98765 43210.'),
  whatsapp: z.string().trim().regex(/^([0-9]{8,15})?$/, 'WhatsApp number: digits only with country code, e.g. 919876543210.'),
  email: z.string().trim().max(160).regex(/^([^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+)?$/, 'Enter a valid email address.'),
  bookPickup: https.or(z.literal('')), bookService: https.or(z.literal('')), playStore: https.or(z.literal('')), appStore: https.or(z.literal('')),
  logo: img.or(z.literal('')).default(''), mark: img.or(z.literal('')).default(''), favicon: img.or(z.literal('')).default(''),
  stores: z.record(z.string(), storeFields).default({}),
});

export async function PUT(req: Request) {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0]?.message ?? 'Invalid details.' }, { status: 400 });
  for (const id of Object.keys(b.data.stores)) if (!(STORE_IDS as readonly string[]).includes(id)) return NextResponse.json({ error: `Unknown store “${id}”.` }, { status: 400 });
  // Keep only what was actually filled in, so a blank field means “use the built-in value”.
  const facts: Record<string, unknown> = {};
  for (const k of ['phone', 'whatsapp', 'email', 'bookPickup', 'bookService', 'playStore', 'appStore', 'logo', 'mark', 'favicon'] as const) if (b.data[k]) facts[k] = b.data[k];
  const st: Record<string, Record<string, string>> = {};
  for (const [id, f] of Object.entries(b.data.stores)) {
    const kept = Object.fromEntries(Object.entries(f).filter(([, v]) => typeof v === 'string' && v.trim() !== ''));
    if (Object.keys(kept).length) st[id] = kept as Record<string, string>;
  }
  if (Object.keys(st).length) facts.stores = st;
  await writeSetting('facts', facts);
  setLiveFacts(facts);
  revalidateTag(FACTS_TAG);
  revalidatePath('/', 'layout');
  await audit(a.session.u, 'facts_update', undefined, { fields: Object.keys(facts) });
  return NextResponse.json({ ok: true });
}
