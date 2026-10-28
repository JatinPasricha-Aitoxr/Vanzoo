import http from 'node:http';
import { parse } from 'node-html-parser';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/site';
import { writeSetting } from './seoStore';

/**
 * Rule-based SEO crawl of the site's own pages (title, description, headings,
 * canonical, robots, social tags, alt text, JSON-LD validity, internal links).
 * It reports facts and suggestions; it never changes anything or promises rankings.
 */
export type AuditPage = {
  url: string;
  status: number;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  h1: number;
  h2: number;
  imgsNoAlt: number;
  ogImage: boolean;
  jsonLdTypes: string[];
  jsonLdInvalid: number;
  issues: { level: 'warn' | 'info'; text: string }[];
};
export type AuditReport = {
  startedAt: string;
  finishedAt: string;
  pages: AuditPage[];
  broken: { href: string; status: number; from: string[] }[];
  duplicateTitles: { title: string; urls: string[] }[];
  duplicateDescriptions: { description: string; urls: string[] }[];
};
type Job = { state: 'idle' | 'running' | 'done' | 'error'; done: number; total: number; message?: string; report?: AuditReport };

const g = globalThis as unknown as { __vzAudit?: Job };
export const auditJob = (): Job => (g.__vzAudit ??= { state: 'idle', done: 0, total: 0 });

function fetchLocal(port: number, path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve) => {
    const req = http.request(
      { host: '127.0.0.1', port, path, method: 'GET', headers: { Host: new URL(SITE_URL).host, 'User-Agent': 'VanzooSeoAudit/1.0' }, timeout: 30000 },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString('utf8') }));
      },
    );
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, body: '' });
    });
    req.end();
  });
}

const internalPath = (href: string): string | null => {
  if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return null;
  let p = href;
  if (/^https?:\/\//i.test(p)) {
    if (!p.startsWith(SITE_URL)) return null;
    p = p.slice(SITE_URL.length) || '/';
  }
  if (!p.startsWith('/') || p.startsWith('//')) return null;
  p = p.split('#')[0].split('?')[0];
  if (/^\/(api|admin|_next|uploads|images|videos|preview)\b/.test(p) || /\.[a-z0-9]{2,5}$/i.test(p)) return null;
  return p.endsWith('/') ? p : p + '/';
};

function auditPage(url: string, status: number, html: string): { page: AuditPage; links: string[] } {
  const root = parse(html);
  const title = root.querySelector('title')?.text.trim() ?? '';
  const description = root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  const h1 = root.querySelectorAll('h1').length;
  const h2 = root.querySelectorAll('h2').length;
  const imgsNoAlt = root.querySelectorAll('img').filter((i) => i.getAttribute('alt') === undefined).length;
  const ogImage = Boolean(root.querySelector('meta[property="og:image"]'));
  const types: string[] = [];
  let invalid = 0;
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(s.text);
      const nodes = Array.isArray(data) ? data : data['@graph'] ?? [data];
      for (const n of nodes) types.push(...[].concat(n['@type'] ?? []));
    } catch {
      invalid++;
    }
  }
  const issues: AuditPage['issues'] = [];
  const w = (text: string) => issues.push({ level: 'warn', text });
  const i = (text: string) => issues.push({ level: 'info', text });
  if (status >= 400 || status === 0) w(`Page returned status ${status || 'no response'}.`);
  if (!title) w('Missing title.');
  else if (title.length > 62) w(`Title is ${title.length} characters (about 60 fit).`);
  else if (title.length < 20) i('Title is short.');
  if (!description) w('Missing meta description.');
  else if (description.length > 165) w(`Description is ${description.length} characters (about 155–160 fit).`);
  else if (description.length < 70) i('Description is short.');
  if (h1 === 0) w('No H1 heading.');
  if (h1 > 1) w(`${h1} H1 headings.`);
  const expected = SITE_URL + url;
  if (!canonical) w('Missing canonical URL.');
  else if (canonical !== expected && !canonical.startsWith('http')) w('Canonical is not absolute.');
  if (/noindex/i.test(robots)) i('Set to noindex.');
  if (imgsNoAlt) w(`${imgsNoAlt} image(s) have no alt attribute.`);
  if (!ogImage) i('No social-sharing (og:image) image.');
  if (invalid) w(`${invalid} structured-data block(s) are not valid JSON.`);
  const links = root
    .querySelectorAll('a')
    .map((a) => internalPath(a.getAttribute('href') ?? ''))
    .filter((x): x is string => Boolean(x));
  return { page: { url, status, title, description, canonical, robots, h1, h2, imgsNoAlt, ogImage, jsonLdTypes: Array.from(new Set(types)), jsonLdInvalid: invalid, issues }, links };
}

async function pool<T>(items: string[], size: number, fn: (x: string) => Promise<T>, tick: () => void): Promise<T[]> {
  const out: T[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const idx = next++;
        out[idx] = await fn(items[idx]);
        tick();
      }
    }),
  );
  return out;
}

export async function runAudit(port: number): Promise<void> {
  const job = auditJob();
  if (job.state === 'running') return;
  const startedAt = new Date().toISOString();
  try {
    const entries = await sitemap();
    const urls = Array.from(new Set(entries.map((e) => e.url.slice(SITE_URL.length) || '/')));
    job.state = 'running';
    job.done = 0;
    job.total = urls.length;
    job.message = 'Crawling pages…';
    const linkMap = new Map<string, Set<string>>();
    const pages = await pool(
      urls,
      6,
      async (u) => {
        const r = await fetchLocal(port, u);
        const { page, links } = auditPage(u, r.status, r.body);
        for (const l of links) (linkMap.get(l) ?? linkMap.set(l, new Set()).get(l)!).add(u);
        return page;
      },
      () => job.done++,
    );
    // Broken internal links: every linked path that is not itself a crawled page.
    const crawled = new Set(urls);
    const toCheck = Array.from(linkMap.keys()).filter((l) => !crawled.has(l)).slice(0, 800);
    job.message = 'Checking internal links…';
    job.total = urls.length + toCheck.length;
    const statuses = await pool(toCheck, 8, async (l) => ({ l, s: (await fetchLocal(port, l)).status }), () => job.done++);
    const broken = statuses.filter((x) => x.s >= 400 || x.s === 0).map((x) => ({ href: x.l, status: x.s, from: Array.from(linkMap.get(x.l) ?? []).slice(0, 8) }));
    // Pages that were crawled but returned errors also count as broken targets.
    for (const p of pages) if (p.status >= 400 && linkMap.has(p.url)) broken.push({ href: p.url, status: p.status, from: Array.from(linkMap.get(p.url)!).slice(0, 8) });

    const dup = (key: 'title' | 'description') => {
      const m = new Map<string, string[]>();
      for (const p of pages) if (p[key]) (m.get(p[key]) ?? m.set(p[key], []).get(p[key])!).push(p.url);
      return Array.from(m.entries()).filter(([, v]) => v.length > 1);
    };
    const report: AuditReport = {
      startedAt,
      finishedAt: new Date().toISOString(),
      pages,
      broken,
      duplicateTitles: dup('title').map(([title, u]) => ({ title, urls: u })),
      duplicateDescriptions: dup('description').map(([description, u]) => ({ description, urls: u })),
    };
    for (const d of report.duplicateTitles) for (const u of d.urls) pages.find((p) => p.url === u)?.issues.push({ level: 'warn', text: 'Duplicate title on another page.' });
    for (const d of report.duplicateDescriptions) for (const u of d.urls) pages.find((p) => p.url === u)?.issues.push({ level: 'warn', text: 'Duplicate meta description on another page.' });
    job.report = report;
    job.state = 'done';
    job.message = 'Audit complete.';
    await writeSetting('audit', report).catch(() => {});
  } catch (e) {
    job.state = 'error';
    job.message = e instanceof Error ? e.message : 'Audit failed.';
  }
}
