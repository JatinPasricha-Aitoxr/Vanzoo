import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { fetchPerformance, gscConfigured, gscSite, type Performance } from '@/cms/gsc';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let cache: { at: number; days: number; data: Performance } | null = null;
const TTL = 30 * 60_000;

/** Real Search Console numbers when a service account is configured; otherwise just the setup state. */
export async function GET(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  if (!gscConfigured()) return NextResponse.json({ configured: false });
  const u = new URL(req.url);
  const days = [7, 28, 90].includes(Number(u.searchParams.get('days'))) ? Number(u.searchParams.get('days')) : 28;
  if (!u.searchParams.get('refresh') && cache && cache.days === days && Date.now() - cache.at < TTL) return NextResponse.json({ configured: true, site: gscSite(), data: cache.data, cached: true });
  try {
    const data = await fetchPerformance(days);
    cache = { at: Date.now(), days, data };
    return NextResponse.json({ configured: true, site: gscSite(), data });
  } catch (e) {
    return NextResponse.json({ configured: true, site: gscSite(), error: e instanceof Error ? e.message : 'Could not load Search Console data.' }, { status: 502 });
  }
}
