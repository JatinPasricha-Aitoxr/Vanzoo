import type { MetadataRoute } from 'next';
import { getGlobalSeo } from '@/cms/seoStore';
import { SITE_URL } from '@/lib/site';

/** Built per request so edits in the CMS (pages, posts, hidden items, SEO settings) show up immediately. */
export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const g = await getGlobalSeo();
  const disallow = ['/api/', '/app/', '/admin/', '/preview/'];
  const allow: string[] = ['/'];
  const sitemaps = [`${SITE_URL}/sitemap.xml`];
  let crawlDelay: number | undefined;

  // Admin-supplied lines (validated on save to Allow / Disallow / Crawl-delay / Sitemap / User-agent).
  for (const raw of g.robotsExtra.split('\n')) {
    const m = raw.trim().match(/^([A-Za-z-]+):\s*(.+)$/);
    if (!m) continue;
    const [, k, v] = m;
    if (/^disallow$/i.test(k)) disallow.push(v);
    else if (/^allow$/i.test(k)) allow.push(v);
    else if (/^crawl-delay$/i.test(k) && Number.isFinite(Number(v))) crawlDelay = Number(v);
    else if (/^sitemap$/i.test(k)) sitemaps.push(v);
  }

  // Site-wide noindex (e.g. a staging copy): block everything.
  if (g.siteNoindex) return { rules: [{ userAgent: '*', disallow: '/' }] };

  return {
    rules: [{ userAgent: '*', allow, disallow, ...(crawlDelay ? { crawlDelay } : {}) }],
    sitemap: sitemaps,
    host: SITE_URL,
  };
}
