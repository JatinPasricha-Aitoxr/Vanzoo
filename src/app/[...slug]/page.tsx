import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { logNotFound } from '@/cms/seoStore';
import { allPosts } from '@/cms/blogStore';
import { RenderDoc } from '@/cms/render';
import { pageMetadata } from '@/cms/seo';
import { getPublishedBySlug, normSlug } from '@/cms/store';

/**
 * Pages created in the page builder. Built-in routes (services, pricing, …) are
 * matched first by Next; this only answers for addresses the CMS owns, and 404s
 * for everything else.
 */
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return []; // rendered on first request, then cached until revalidated
}

async function load(slug: string[]) {
  return getPublishedBySlug(normSlug(slug.join('/')));
}

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const live = await load(params.slug);
  if (!live) return { robots: { index: false, follow: false } };
  return pageMetadata(live.page.slug, live.page.seo, {
    title: `${live.page.title} | Vanzoo`,
    description: 'Premium organic dry cleaning in Gurgaon — Vanzoo.',
  });
}

export default async function CmsPage({ params }: { params: { slug: string[] } }) {
  const live = await load(params.slug);
  if (!live) {
    // Record the miss so the SEO > Redirects screen can offer a fix.
    // (Static caching means repeat hits inside the 5-minute window count once.)
    await logNotFound('/' + params.slug.join('/') + '/', null);
    notFound();
  }
  return <RenderDoc doc={live.doc} posts={await allPosts()} />;
}
