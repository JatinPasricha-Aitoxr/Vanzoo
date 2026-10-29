import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/auth';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * A JSON snapshot of everything the CMS stores in the database (not uploaded
 * files — those live in UPLOAD_DIR and are backed up as a folder). Password
 * hashes are deliberately excluded. Restore is a deliberate, manual operation.
 */
export async function GET() {
  const a = await requireAdmin();
  if ('error' in a) return a.error;
  const [pages, revisions, media, settings, redirects, overrides, users] = await Promise.all([
    query('SELECT * FROM pages'),
    query('SELECT * FROM page_revisions WHERE id IN (SELECT published_revision_id FROM pages UNION SELECT draft_revision_id FROM pages)'),
    query('SELECT * FROM media'),
    query('SELECT k, v FROM settings'),
    query('SELECT * FROM redirects').catch(() => []),
    query('SELECT * FROM seo_overrides').catch(() => []),
    query('SELECT username, role, created_at FROM users'),
  ]);
  await audit(a.session.u, 'backup_export');
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify({ format: 'vanzoo-cms-backup', version: 1, exportedAt: new Date().toISOString(), pages, revisions, media, settings, redirects, overrides, users }, null, 2), {
    headers: { 'content-type': 'application/json', 'content-disposition': `attachment; filename="vanzoo-cms-backup-${stamp}.json"`, 'cache-control': 'no-store' },
  });
}
