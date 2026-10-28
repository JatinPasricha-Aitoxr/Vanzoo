import { notFound } from 'next/navigation';
import { Editor } from '@/components/admin/editor/Editor';
import { ensureHomePage, getDraftDoc, getPage, listRevisions } from '@/cms/store';

export const dynamic = 'force-dynamic';

export default async function EditorPage({ params }: { params: { id: string } }) {
  await ensureHomePage();
  const page = await getPage(Number(params.id));
  if (!page) notFound();
  const [doc, revisions] = await Promise.all([getDraftDoc(page), listRevisions(page.id)]);
  return (
    <Editor
      page={{ id: page.id, slug: page.slug, title: page.title, status: page.status, seo: page.seo }}
      initialDoc={doc}
      revisions={revisions}
    />
  );
}
