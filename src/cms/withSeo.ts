import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { OVERRIDABLE_PAGES } from './pageRoutes';
import { getGlobalSeo, getOverrides } from './seoStore';
import { getPublishedBySlug } from './store';

/**
 * Applies the admin's SEO settings on top of the metadata a page already builds:
 * a per-URL override (title, description, canonical, robots, social) and the
 * global switches (site-wide noindex, default description / social image).
 * With no database or no overrides it returns the metadata unchanged.
 */
export async function withSeo(meta: Metadata): Promise<Metadata> {
  const canonical = typeof meta.alternates?.canonical === 'string' ? meta.alternates.canonical : '';
  const path = canonical.startsWith(SITE_URL) ? canonical.slice(SITE_URL.length) || '/' : '';
  const [g, all] = await Promise.all([getGlobalSeo(), getOverrides()]);
  // A builder page published over a built-in address brings its own SEO settings.
  const cms = path && (OVERRIDABLE_PAGES as readonly string[]).includes(path) ? await getPublishedBySlug(path) : null;
  const o = { ...(cms?.page.seo ?? {}), ...((path && (all[path] ?? all[path.replace(/\/$/, '')])) || {}) };
  const out: Metadata = { ...meta };

  if (!meta.description && g.defaultDescription) out.description = g.defaultDescription;
  if (cms && !o.title) out.title = `${cms.page.title} | Vanzoo`;
  if (o.title) out.title = o.title;
  if (o.description) out.description = o.description;
  if (o.canonical) out.alternates = { ...meta.alternates, canonical: o.canonical.startsWith('http') ? o.canonical : `${SITE_URL}${o.canonical}` };

  const noindex = g.siteNoindex || o.noindex;
  if (noindex || o.nofollow) {
    out.robots = { index: !noindex, follow: !o.nofollow, ...(noindex ? {} : { googleBot: { index: true, follow: !o.nofollow, 'max-image-preview': 'large' as const } }) };
  }

  const ogImage = o.ogImage || '';
  out.openGraph = {
    ...meta.openGraph,
    ...(o.ogTitle || o.title ? { title: o.ogTitle || o.title } : {}),
    ...(o.ogDescription || o.description ? { description: o.ogDescription || o.description } : {}),
    ...(ogImage ? { images: [{ url: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}` }] } : {}),
  } as Metadata['openGraph'];
  if (ogImage) out.twitter = { ...meta.twitter, images: [ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`] } as Metadata['twitter'];
  return out;
}
