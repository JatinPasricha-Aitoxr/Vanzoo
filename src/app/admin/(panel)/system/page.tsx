import { Badge, Card } from '@/components/admin/ui';
import { dbConfigured, query } from '@/lib/db';
import { uploadDir } from '@/lib/uploads';
import { mkdir, access, constants } from 'node:fs/promises';

export const dynamic = 'force-dynamic';

async function checks() {
  const out: { name: string; ok: boolean; detail: string }[] = [];
  let dbOk = false;
  let version = '';
  if (dbConfigured()) {
    try {
      const [v] = await query<{ v: string }>('SELECT VERSION() AS v');
      version = v.v;
      dbOk = true;
    } catch (e) {
      version = e instanceof Error ? e.message : 'connection failed';
    }
  }
  out.push({ name: 'Database (MySQL)', ok: dbOk, detail: dbOk ? `Connected · MySQL ${version}` : version || 'Not configured (set MYSQL_* variables)' });
  if (dbOk) {
    const [m] = await query<{ n: string }>("SELECT COUNT(*) AS n FROM schema_migrations").catch(() => [{ n: '0' }]);
    out.push({ name: 'Migrations', ok: Number(m.n) > 0, detail: `${m.n} applied` });
  }
  let writable = false;
  try {
    await mkdir(uploadDir(), { recursive: true });
    await access(uploadDir(), constants.W_OK);
    writable = true;
  } catch { /* not writable */ }
  out.push({ name: 'Upload folder', ok: writable, detail: `${uploadDir()} ${writable ? '(writable)' : '(not writable)'}` });
  const secret = (process.env.SESSION_SECRET || '').length >= 24;
  out.push({ name: 'Session secret', ok: secret || process.env.NODE_ENV !== 'production', detail: secret ? 'Configured' : 'Not set — required in production' });
  out.push({ name: 'Admin host restriction', ok: Boolean(process.env.ADMIN_HOST) || process.env.NODE_ENV !== 'production', detail: process.env.ADMIN_HOST ? `Admin only on ${process.env.ADMIN_HOST}` : 'ADMIN_HOST not set — admin reachable on any host' });
  out.push({ name: 'Enquiry email (Resend)', ok: Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL), detail: process.env.RESEND_API_KEY ? 'Configured' : 'Not configured' });
  return out;
}

export default async function SystemScreen() {
  const list = await checks();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">System &amp; health</h1>
        <p className="text-sm text-[#6b7a75]">Live checks of the pieces the CMS depends on.</p>
      </div>
      <Card>
        <ul className="divide-y divide-[#eef2f0]">
          {list.map((c) => (
            <li key={c.name} className="flex items-center justify-between gap-4 py-3">
              <div><p className="font-medium">{c.name}</p><p className="text-xs text-[#6b7a75]">{c.detail}</p></div>
              <Badge tone={c.ok ? 'green' : 'red'}>{c.ok ? 'OK' : 'Needs attention'}</Badge>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Backups & recovery">
        <ul className="list-inside list-disc space-y-1.5 text-sm text-[#51635d]">
          <li>Every save and publish keeps a full revision, so any page can be restored from the editor’s “Page &amp; SEO” tab.</li>
          <li>Back up the MySQL database regularly (hPanel → Databases → Backups, or <code>mysqldump</code>) and the upload folder.</li>
          <li>The public site keeps working if the database is unavailable: it falls back to the built-in layout.</li>
        </ul>
      </Card>
    </div>
  );
}
