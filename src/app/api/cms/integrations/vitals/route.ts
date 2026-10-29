import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { fetchVitals, type Vitals } from '@/cms/gsc';
import { SITE_URL } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cache = new Map<string, { at: number; v: Vitals }>();

/** PageSpeed Insights for one of this site's own pages (real-user data when Google has it, plus a labelled lab run). */
export async function GET(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const u = new URL(req.url);
  const path = u.searchParams.get('path') || '/';
  if (!/^\/[A-Za-z0-9\-_/.%]*$/.test(path) || path.includes('..')) return NextResponse.json({ error: 'Choose a page on this site.' }, { status: 400 });
  const strategy = u.searchParams.get('strategy') === 'desktop' ? 'desktop' : 'mobile';
  const url = `${SITE_URL}${path}`;
  const key = `${strategy}|${url}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 30 * 60_000) return NextResponse.json({ vitals: hit.v, cached: true });
  try {
    const v = await fetchVitals(url, strategy);
    cache.set(key, { at: Date.now(), v });
    return NextResponse.json({ vitals: v });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Could not run PageSpeed Insights.' }, { status: 502 });
  }
}
