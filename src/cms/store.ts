import { dbConfigured, exec, parseJson, query } from '@/lib/db';
import { defaultHomeDoc } from './seed';
import { DocSchema, PageSeoSchema, type Doc, type PageSeo } from './schema';
import { validateBlocks } from './widgetDefs';

export type PageRow = {
  id: number;
  slug: string;
  title: string;
  template: string;
  status: 'draft' | 'published';
  published_revision_id: number | null;
  draft_revision_id: number | null;
  seo: PageSeo;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type RawPage = Omit<PageRow, 'seo'> & { seo: unknown };
const norm = (r: RawPage): PageRow => ({ ...r, seo: parseJson<PageSeo>(r.seo, {}) });

/** Validates and cleans a document; throws a readable Error if it is not acceptable. */
export function cleanDoc(input: unknown): Doc {
  const parsed = DocSchema.safeParse(input);
  if (!parsed.success) throw new Error('Invalid page document: ' + parsed.error.issues[0]?.message);
  const ids = new Set<string>();
  const walk = (blocks: Doc['blocks']) =>
    blocks.forEach((b) => {
      if (ids.has(b.id)) throw new Error(`Duplicate block id “${b.id}”.`);
      ids.add(b.id);
      if (b.children) walk(b.children);
    });
  walk(parsed.data.blocks);
  return { version: 1, blocks: validateBlocks(parsed.data.blocks) };
}

export const normSlug = (raw: string): string => {
  let s = ('/' + raw.trim().toLowerCase().replace(/[^a-z0-9/_-]+/g, '-').replace(/\/+/g, '/')).replace(/-+/g, '-');
  s = s.replace(/^\/+/, '/');
  if (!s.endsWith('/')) s += '/';
  return s;
};

/** Slugs that belong to built-in (code) routes and cannot be taken by CMS pages. */
export const RESERVED_ROOTS = new Set([
  'admin', 'api', 'preview', 'uploads', 'services', 'products', 'blogs', 'areas-we-serve', 'about-us', 'pricing',
  'membership', 'hydrocarbon-tech', 'contact-us', 'locate-us', 'reviews', 'customer-stories', 'privacy-policy',
  'terms-conditions', 'delivery-refund-policy', 'site-map', 'best-dry-cleaners-near-me', 'best-dry-cleaning-in-gurgaon',
  '_next', 'images', 'videos', 'sitemap.xml', 'robots.txt',
]);

export async function listPages(): Promise<PageRow[]> {
  const rows = await query<RawPage>('SELECT * FROM pages ORDER BY (slug = "/") DESC, title ASC');
  return rows.map(norm);
}

export async function getPage(id: number): Promise<PageRow | null> {
  const rows = await query<RawPage>('SELECT * FROM pages WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? norm(rows[0]) : null;
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const rows = await query<RawPage>('SELECT * FROM pages WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] ? norm(rows[0]) : null;
}

async function getRevisionDoc(id: number | null): Promise<Doc | null> {
  if (!id) return null;
  const rows = await query<{ doc: unknown }>('SELECT doc FROM page_revisions WHERE id = ?', [id]);
  return rows[0] ? parseJson<Doc | null>(rows[0].doc, null) : null;
}

/** The editable document: the draft if there is one, else the published one, else the code default for '/'. */
export async function getDraftDoc(page: PageRow): Promise<Doc> {
  return (
    (await getRevisionDoc(page.draft_revision_id)) ??
    (await getRevisionDoc(page.published_revision_id)) ??
    (page.slug === '/' ? defaultHomeDoc() : { version: 1, blocks: [] })
  );
}

/** Public read: the published document for a slug, or null (caller falls back to the code version). */
export async function getPublishedBySlug(slug: string): Promise<{ page: PageRow; doc: Doc } | null> {
  if (!dbConfigured()) return null;
  try {
    const page = await getPageBySlug(slug);
    if (!page || page.status !== 'published' || !page.published_revision_id) return null;
    const doc = await getRevisionDoc(page.published_revision_id);
    return doc ? { page, doc } : null;
  } catch {
    return null; // a DB outage must never take the public site down
  }
}

export async function listPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  if (!dbConfigured()) return [];
  try {
    return await query<{ slug: string; updated_at: string }>(
      "SELECT slug, updated_at FROM pages WHERE status = 'published' AND slug <> '/' AND JSON_EXTRACT(seo, '$.noindex') IS NOT TRUE",
    );
  } catch {
    return [];
  }
}

/** Creates the home page row on first use so there is always something to open in the editor. */
export async function ensureHomePage(): Promise<void> {
  const rows = await query('SELECT id FROM pages WHERE slug = "/" LIMIT 1');
  if (rows.length) return;
  await exec('INSERT INTO pages (slug, title, template, status, seo) VALUES ("/", "Home", "home", "draft", ?)', [JSON.stringify({})]);
}

export async function createPage(title: string, slug: string): Promise<PageRow> {
  const clean = normSlug(slug);
  const root = clean.split('/')[1] ?? '';
  if (clean === '/' || RESERVED_ROOTS.has(root)) throw new Error('That address is used by a built-in page. Choose another.');
  if (await getPageBySlug(clean)) throw new Error('A page with that address already exists.');
  const res = await exec('INSERT INTO pages (slug, title, status, seo) VALUES (?, ?, "draft", ?)', [clean, title.slice(0, 255), JSON.stringify({})]);
  return (await getPage(res.insertId))!;
}

export async function saveDraft(pageId: number, docInput: unknown, seoInput: unknown, actor: string, note?: string): Promise<{ revisionId: number }> {
  const doc = cleanDoc(docInput);
  const seo = PageSeoSchema.parse(seoInput ?? {});
  const res = await exec('INSERT INTO page_revisions (page_id, kind, doc, seo, note, created_by) VALUES (?, "draft", ?, ?, ?, ?)', [
    pageId,
    JSON.stringify(doc),
    JSON.stringify(seo),
    note ?? null,
    actor,
  ]);
  await exec('UPDATE pages SET draft_revision_id = ?, seo = ? WHERE id = ?', [res.insertId, JSON.stringify(seo), pageId]);
  return { revisionId: res.insertId };
}

/** Publishes the current draft. The previous published revision stays in history, so a failed publish cannot corrupt the live page. */
export async function publish(pageId: number, actor: string): Promise<PageRow> {
  const page = await getPage(pageId);
  if (!page) throw new Error('Page not found.');
  const doc = cleanDoc(await getDraftDoc(page)); // re-validate what is about to go live
  const res = await exec('INSERT INTO page_revisions (page_id, kind, doc, seo, created_by) VALUES (?, "published", ?, ?, ?)', [
    pageId,
    JSON.stringify(doc),
    JSON.stringify(page.seo),
    actor,
  ]);
  await exec('UPDATE pages SET status = "published", published_revision_id = ?, published_at = NOW() WHERE id = ?', [res.insertId, pageId]);
  return (await getPage(pageId))!;
}

export async function unpublish(pageId: number): Promise<void> {
  await exec('UPDATE pages SET status = "draft" WHERE id = ?', [pageId]);
}

export async function duplicatePage(pageId: number, actor: string): Promise<PageRow> {
  const page = await getPage(pageId);
  if (!page) throw new Error('Page not found.');
  const doc = await getDraftDoc(page);
  const base = page.slug === '/' ? '/home-copy/' : page.slug.replace(/\/$/, '') + '-copy/';
  let slug = base;
  for (let i = 2; await getPageBySlug(slug); i++) slug = base.replace(/\/$/, `-${i}/`);
  const copy = await createPage(page.title + ' (copy)', slug);
  await saveDraft(copy.id, doc, page.seo, actor, 'Duplicated from ' + page.slug);
  return (await getPage(copy.id))!;
}

export async function deletePage(pageId: number): Promise<void> {
  const page = await getPage(pageId);
  if (!page) return;
  if (page.slug === '/') throw new Error('The home page cannot be deleted.');
  await exec('DELETE FROM pages WHERE id = ?', [pageId]);
}

export type RevisionRow = { id: number; kind: 'draft' | 'published'; note: string | null; created_by: string | null; created_at: string };
export async function listRevisions(pageId: number): Promise<RevisionRow[]> {
  return query<RevisionRow>('SELECT id, kind, note, created_by, created_at FROM page_revisions WHERE page_id = ? ORDER BY id DESC LIMIT 60', [pageId]);
}

export async function getRevision(pageId: number, revisionId: number): Promise<Doc | null> {
  const rows = await query<{ doc: unknown }>('SELECT doc FROM page_revisions WHERE id = ? AND page_id = ?', [revisionId, pageId]);
  return rows[0] ? parseJson<Doc | null>(rows[0].doc, null) : null;
}

export async function dashboardStats() {
  const [pages] = await query<{ total: number; published: number; drafts: number }>(
    "SELECT COUNT(*) AS total, SUM(status='published') AS published, SUM(status='draft') AS drafts FROM pages",
  );
  const recent = await query<RawPage>('SELECT * FROM pages ORDER BY updated_at DESC LIMIT 6');
  const [media] = await query<{ n: number }>('SELECT COUNT(*) AS n FROM media');
  const activity = await query<{ actor: string | null; action: string; target: string | null; created_at: string }>(
    'SELECT actor, action, target, created_at FROM audit_log ORDER BY id DESC LIMIT 8',
  );
  return {
    pages: { total: Number(pages.total), published: Number(pages.published ?? 0), drafts: Number(pages.drafts ?? 0) },
    recent: recent.map(norm),
    media: Number(media.n),
    activity,
  };
}
