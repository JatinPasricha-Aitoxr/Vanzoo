import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { getRevision } from '@/cms/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string; rid: string } }) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const doc = await getRevision(Number(params.id), Number(params.rid));
  return doc ? NextResponse.json({ doc }) : NextResponse.json({ error: 'Revision not found.' }, { status: 404 });
}
