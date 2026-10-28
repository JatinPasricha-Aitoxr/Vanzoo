import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, requireSession } from '@/lib/auth';
import { exec } from '@/lib/db';
import { deletePage, getDraftDoc, getPage, getPageBySlug, listRevisions, normSlug, RESERVED_ROOTS, saveDraft } from '@/cms/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const idOf = (p: { id: string }) => Number(p.id);

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const page = await getPage(idOf(params));
  if (!page) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
  return NextResponse.json({ page, doc: await getDraftDoc(page), revisions: await listRevisions(page.id) });
}

const PutBody = z.object({
  doc: z.unknown(),
  seo: z.unknown().optional(),
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(190).optional(),
  note: z.string().max(200).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const page = await getPage(idOf(params));
  if (!page) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
  const body = PutBody.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  try {
    if (body.data.title && body.data.title !== page.title) await exec('UPDATE pages SET title = ? WHERE id = ?', [body.data.title, page.id]);
    if (body.data.slug && page.slug !== '/') {
      const slug = normSlug(body.data.slug);
      if (slug !== page.slug) {
        if (page.status === 'published') throw new Error('Unpublish the page before changing its address, so old links are not broken.');
        if (RESERVED_ROOTS.has(slug.split('/')[1] ?? '')) throw new Error('That address is used by a built-in page.');
        if (await getPageBySlug(slug)) throw new Error('A page with that address already exists.');
        await exec('UPDATE pages SET slug = ? WHERE id = ?', [slug, page.id]);
      }
    }
    const { revisionId } = await saveDraft(page.id, body.data.doc, body.data.seo ?? page.seo, a.session.u, body.data.note);
    await audit(a.session.u, 'page_save_draft', page.slug, { revisionId });
    return NextResponse.json({ ok: true, revisionId, page: await getPage(page.id) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Could not save.' }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const a = await requireSession();
  if ('error' in a) return a.error;
  const page = await getPage(idOf(params));
  if (!page) return NextResponse.json({ ok: true });
  try {
    await deletePage(page.id);
    await audit(a.session.u, 'page_delete', page.slug);
    revalidatePath(page.slug);
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Could not delete.' }, { status: 400 });
  }
}
