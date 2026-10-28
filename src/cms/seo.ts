import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import type { PageSeo } from './schema';

/**
 * Turns a page's SEO settings into Next metadata. Anything left blank falls back
 * to the supplied defaults, so an empty SEO panel never produces empty tags.
 */
export function pageMetadata(path: string, seo: PageSeo, fallback: { title: string; description: string }): Metadata {
  const title = seo.title?.trim() || fallback.title;
  const description = seo.description?.trim() || fallback.description;
  const base = buildMetadata({
    title,
    description,
    path,
    image: seo.ogImage?.trim() || undefined,
    noIndex: Boolean(seo.noindex),
  });
  const canonical = seo.canonical?.trim();
  return {
    ...base,
    alternates: { canonical: canonical ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`) : `${SITE_URL}${path}` },
    robots: seo.noindex
      ? { index: false, follow: !seo.nofollow }
      : { index: true, follow: !seo.nofollow, googleBot: { index: true, follow: !seo.nofollow, 'max-image-preview': 'large' } },
    openGraph: {
      ...base.openGraph,
      ...(seo.ogTitle?.trim() ? { title: seo.ogTitle.trim() } : {}),
      ...(seo.ogDescription?.trim() ? { description: seo.ogDescription.trim() } : {}),
    },
  };
}
