import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Public, read-only view of the site settings. */
export async function GET() {
  const { delhiEnabled } = await getSettings();
  return NextResponse.json({ delhiEnabled }, { headers: { 'Cache-Control': 'no-store' } });
}
