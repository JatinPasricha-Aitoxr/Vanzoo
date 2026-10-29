import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPosts } from '@/cms/blogStore';
import { RenderDoc } from '@/cms/render';
import { getDraftDoc, getPage } from '@/cms/store';
import { getSession } from '@/lib/auth';

/** Draft preview with the real site header and footer. Signed-in admins only, never indexed. */
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Preview', robots: { index: false, follow: false } };

export default async function Preview({ params }: { params: { id: string } }) {
  if (!(await getSession())) notFound();
  const page = await getPage(Number(params.id));
  if (!page) notFound();
  const doc = await getDraftDoc(page);
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[80] bg-accent-gold px-4 py-1.5 text-center text-xs font-semibold text-brand-ink">
        Draft preview — not published. {page.title}
      </div>
      <RenderDoc doc={doc} posts={await allPosts()} />
    </>
  );
}
