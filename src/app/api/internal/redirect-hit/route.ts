import { NextResponse } from 'next/server';
import { recordRedirectHit } from '@/cms/seoStore';
import { internalToken } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const token = await internalToken();
  if (!token || req.headers.get('x-vz-internal') !== token) return new NextResponse('Not found', { status: 404 });
  const { source } = (await req.json().catch(() => ({}))) as { source?: string };
  if (source) await recordRedirectHit(source);
  return NextResponse.json({ ok: true });
}
