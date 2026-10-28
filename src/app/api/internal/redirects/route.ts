import { NextResponse } from 'next/server';
import { activeRedirectMap } from '@/cms/seoStore';
import { dbConfigured } from '@/lib/db';
import { internalToken } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Redirect table for middleware. Only answers to the internal token. */
export async function GET(req: Request) {
  const token = await internalToken();
  if (!token || req.headers.get('x-vz-internal') !== token) return new NextResponse('Not found', { status: 404 });
  if (!dbConfigured()) return NextResponse.json({});
  try {
    return NextResponse.json(await activeRedirectMap(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({});
  }
}
