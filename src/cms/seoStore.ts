import { unstable_cache } from 'next/cache';
import { dbConfigured, exec, parseJson, query } from '@/lib/db';

/** Global SEO settings (stored under settings.k = 'seo'). */
export type GlobalSeo = {
  /** Block all indexing site-wide (use on staging). */
  siteNoindex: boolean;
  defaultDescription: string;
  defaultOgImage: string;
  /** Extra robots.txt lines (validated: only Allow/Disallow/Crawl-delay/Sitemap). */
  robotsExtra: string;
  /** Paths (or prefixes ending in *) removed from the sitemap. */
  sitemapExclude: string[];
  /** Extra absolute-path URLs added to the sitemap. */
  sitemapExtra: string[];
};

export const DEFAULT_GLOBAL_SEO: GlobalSeo = {
  siteNoindex: false,
  defaultDescription: '',
  defaultOgImage: '',
  robotsExtra: '',
  sitemapExclude: [],
  sitemapExtra: [],
};

export type SeoOverride = {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

export const SEO_TAG = 'seo';

async function readSetting<T extends object>(key: string, fallback: T): Promise<T> {
  if (!dbConfigured()) return fallback;
  try {
    const rows = await query<{ v: unknown }>('SELECT v FROM settings WHERE k = ?', [key]);
    return { ...fallback, ...parseJson<Partial<T>>(rows[0]?.v, {}) };
  } catch {
    return fallback;
  }
}

export async function writeSetting(key: string, value: unknown): Promise<void> {
  await exec('INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [key, JSON.stringify(value)]);
}

export const getGlobalSeo = unstable_cache(() => readSetting<GlobalSeo>('seo', DEFAULT_GLOBAL_SEO), ['global-seo'], { tags: [SEO_TAG], revalidate: 300 });

export const getOverrides = unstable_cache(
  async (): Promise<Record<string, SeoOverride>> => {
    if (!dbConfigured()) return {};
    try {
      const rows = await query<{ path: string; data: unknown }>('SELECT path, data FROM seo_overrides');
      return Object.fromEntries(rows.map((r) => [r.path, parseJson<SeoOverride>(r.data, {})]));
    } catch {
      return {};
    }
  },
  ['seo-overrides'],
  { tags: [SEO_TAG], revalidate: 300 },
);

export async function saveOverride(path: string, data: SeoOverride) {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '' && v !== undefined && v !== false));
  if (Object.keys(clean).length === 0) await exec('DELETE FROM seo_overrides WHERE path = ?', [path]);
  else await exec('INSERT INTO seo_overrides (path, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)', [path, JSON.stringify(clean)]);
}

// ---------------------------------------------------------------- redirects

export type RedirectRow = { id: number; source: string; destination: string; status_code: 301 | 302; enabled: 0 | 1; hits: number; note: string | null; updated_at: string };

export const normPath = (p: string): string => {
  const s = p.trim().split('#')[0].split('?')[0];
  return s.length > 1 ? s.replace(/\/+$/, '') || '/' : '/';
};

export async function listRedirects(): Promise<RedirectRow[]> {
  return query<RedirectRow>('SELECT id, source, destination, status_code, enabled, hits, note, updated_at FROM redirects ORDER BY id DESC');
}

/** Enabled redirects keyed by normalised source — read by middleware through an internal endpoint. */
export async function activeRedirectMap(): Promise<Record<string, { to: string; code: number }>> {
  const rows = await query<{ source: string; destination: string; status_code: number }>('SELECT source, destination, status_code FROM redirects WHERE enabled = 1');
  return Object.fromEntries(rows.map((r) => [normPath(r.source), { to: r.destination, code: r.status_code }]));
}

const DEST_OK = /^(\/(?!\/)[^\s<>"']*|https?:\/\/[^\s<>"']+)$/;

/** Returns an error message, or null if the redirect is acceptable. */
export async function validateRedirect(source: string, destination: string, code: number, ignoreId?: number): Promise<string | null> {
  if (!source.startsWith('/') || /\s|[<>"']/.test(source) || source.includes('?')) return 'The old address must start with / and cannot contain spaces or a query string.';
  if (/^\/(admin|api|_next|preview)(\/|$)/i.test(source)) return 'That path is reserved by the system.';
  if (!DEST_OK.test(destination)) return 'The new address must be a path starting with / or a full http(s) URL.';
  if (![301, 302].includes(code)) return 'Redirect type must be 301 or 302.';
  const s = normPath(source);
  const d = destination.startsWith('/') ? normPath(destination) : destination;
  if (s === d) return 'The old and new addresses are the same.';
  const rows = await query<{ id: number; source: string; destination: string }>('SELECT id, source, destination FROM redirects WHERE enabled = 1');
  if (rows.some((r) => r.id !== ignoreId && normPath(r.source) === s)) return 'A redirect from that address already exists.';
  // Loop check: follow the chain from the destination; it must never come back to the source.
  const map = new Map(rows.filter((r) => r.id !== ignoreId).map((r) => [normPath(r.source), r.destination]));
  let cur: string | undefined = d;
  for (let i = 0; i < 12 && cur && cur.startsWith('/'); i++) {
    const n = normPath(cur);
    if (n === s) return 'This would create a redirect loop.';
    cur = map.get(n);
  }
  if (cur && cur.startsWith('/') ) return 'The redirect chain is too long (more than 12 hops).';
  return null;
}

export async function recordRedirectHit(source: string) {
  await exec('UPDATE redirects SET hits = hits + 1 WHERE enabled = 1 AND (source = ? OR source = ?)', [source, source.replace(/\/$/, '')]).catch(() => {});
}

export async function logNotFound(path: string, referrer: string | null) {
  if (!dbConfigured() || path.length > 390) return;
  if (/\.(?:png|jpe?g|gif|webp|avif|svg|ico|css|js|map|woff2?|ttf|txt|xml|json)$/i.test(path)) return;
  if (/^\/(?:wp-|xmlrpc|\.env|\.git|phpmyadmin|cgi-bin)/i.test(path)) return; // scanner noise
  try {
    await exec(
      'INSERT INTO not_found_log (path, hits, last_referrer) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE hits = hits + 1, last_seen = NOW(), last_referrer = COALESCE(VALUES(last_referrer), last_referrer)',
      [path, referrer ? referrer.slice(0, 390) : null],
    );
  } catch {
    /* logging must never break a 404 */
  }
}

export async function listNotFound(): Promise<{ path: string; hits: number; last_seen: string; last_referrer: string | null }[]> {
  return query('SELECT path, hits, last_seen, last_referrer FROM not_found_log ORDER BY hits DESC, last_seen DESC LIMIT 200');
}
