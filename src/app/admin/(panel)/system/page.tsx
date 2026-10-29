import { Badge, Card } from '@/components/admin/ui';
import { dbConfigured, query } from '@/lib/db';
import { uploadDir } from '@/lib/uploads';
import { mkdir, access, constants } from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import { GA_ID, GOOGLE_SITE_VERIFICATION, GTM_ID } from '@/lib/site';
import { gscConfigured, gscSite } from '@/cms/gsc';

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
  if (dbOk) {
    const admins = await query<{ password_hash: string; username: string }>("SELECT username, password_hash FROM users WHERE role = 'admin'").catch(() => []);
    const weak = [];
    for (const u of admins) if (await bcrypt.compare('admin', u.password_hash)) weak.push(u.username);
    out.push({ name: 'Default admin password', ok: weak.length === 0, detail: weak.length ? `Still “admin” for: ${weak.join(', ')} — change it in Users & roles before going live` : 'No administrator uses the default password' });
  }
  return out;
}

const INTEGRATIONS = [
  { name: 'Google Analytics 4', on: Boolean(GA_ID), detail: GA_ID ? `Measurement ID ${GA_ID} is installed on every page.` : 'No measurement ID set.' },
  { name: 'Google Tag Manager', on: Boolean(GTM_ID), detail: GTM_ID ? `Container ${GTM_ID} is installed.` : 'Not configured (NEXT_PUBLIC_GTM_ID).' },
  { name: 'Search Console verification', on: Boolean(GOOGLE_SITE_VERIFICATION), detail: GOOGLE_SITE_VERIFICATION ? 'Verification tag is published. Impressions and rankings are viewed in Search Console itself — this panel does not show them.' : 'No verification tag set (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION). Impressions, rankings and Core Web Vitals are not shown here because no integration is connected.' },
  { name: 'Search Console data (API)', on: gscConfigured(), detail: gscConfigured() ? `Reading ${gscSite()} — see SEO → Search data.` : 'Not connected (GSC_SERVICE_ACCOUNT_JSON or GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY, and GSC_SITE_URL). Until then no search figures are shown.' },
  { name: 'Enquiry email (Resend)', on: Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL), detail: process.env.RESEND_API_KEY ? 'Configured.' : 'Not configured (RESEND_API_KEY, ENQUIRY_TO_EMAIL).' },
];

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
      <Card title="Integrations">
        <ul className="divide-y divide-[#eef2f0]">
          {INTEGRATIONS.map((i) => (
            <li key={i.name} className="flex items-center justify-between gap-4 py-3"><div><p className="font-medium">{i.name}</p><p className="max-w-2xl text-xs text-[#6b7a75]">{i.detail}</p></div><Badge tone={i.on ? 'green' : 'grey'}>{i.on ? 'Connected' : 'Not connected'}</Badge></li>
          ))}
        </ul>
      </Card>
      <Card title="Backups & recovery">
        <p className="mb-3"><a href="/api/cms/backup/" className="inline-flex rounded-lg bg-[#0A5C4B] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#084a3c]">Download database backup (JSON)</a></p>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-[#51635d]">
          <li>Every save and publish keeps a full revision, so any page can be restored from the editor’s “Page &amp; SEO” tab.</li>
          <li>Back up the MySQL database regularly (hPanel → Databases → Backups, or <code>mysqldump</code>) and the upload folder.</li>
          <li>The public site keeps working if the database is unavailable: it falls back to the built-in layout.</li>
        </ul>
      </Card>
    </div>
  );
}
