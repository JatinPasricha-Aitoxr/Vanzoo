import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { createPage, ensureHomePage, listPages } from '@/cms/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const a = await requireSession();
  if ('error' in a) return a.error;
  await ensureHomePage();
  return NextResponse.json({ pages: await listPages() });
}

export async function POST(req: Request) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const body = z.object({ title: z.string().min(1).max(200), slug: z.string().min(1).max(190) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: 'A title and an address are required.' }, { status: 400 });
  try {
    const page = await createPage(body.data.title, body.data.slug);
    await audit(a.session.u, 'page_create', page.slug);
    return NextResponse.json({ page });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Could not create the page.' }, { status: 400 });
  }
}
