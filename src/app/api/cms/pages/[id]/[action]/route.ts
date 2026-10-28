import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { audit, requireSession } from '@/lib/auth';
import { duplicatePage, getPage, publish, unpublish } from '@/cms/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: Request, { params }: { params: { id: string; action: string } }) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const id = Number(params.id);
  const page = await getPage(id);
  if (!page) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
  try {
    if (params.action === 'publish') {
      const updated = await publish(id, a.session.u);
      await audit(a.session.u, 'page_publish', page.slug);
      revalidatePath(page.slug);
      revalidatePath('/sitemap.xml');
      return NextResponse.json({ ok: true, page: updated });
    }
    if (params.action === 'unpublish') {
      await unpublish(id);
      await audit(a.session.u, 'page_unpublish', page.slug);
      revalidatePath(page.slug);
      revalidatePath('/sitemap.xml');
      return NextResponse.json({ ok: true, page: await getPage(id) });
    }
    if (params.action === 'duplicate') {
      const copy = await duplicatePage(id, a.session.u);
      await audit(a.session.u, 'page_duplicate', page.slug, { copy: copy.slug });
      return NextResponse.json({ ok: true, page: copy });
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Action failed.' }, { status: 400 });
  }
}
