import { createSign } from 'node:crypto';

/**
 * Google Search Console + PageSpeed Insights, read-only and credential-gated.
 * Nothing here runs, and the admin shows nothing, until a service account is
 * configured: GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY (or GSC_SERVICE_ACCOUNT_JSON)
 * and GSC_SITE_URL. No figures are ever estimated or invented.
 */
const TOKEN_URL = () => process.env.GSC_TOKEN_URL || 'https://oauth2.googleapis.com/token';
const API_BASE = () => process.env.GSC_API_BASE || 'https://searchconsole.googleapis.com/webmasters/v3';
const PSI_URL = () => process.env.PSI_API_URL || 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

type Creds = { email: string; key: string };

export function gscCredentials(): Creds | null {
  try {
    const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
    if (raw) {
      const j = JSON.parse(raw) as { client_email?: string; private_key?: string };
      if (j.client_email && j.private_key) return { email: j.client_email, key: j.private_key };
    }
  } catch {
    /* fall through to the split variables */
  }
  const email = process.env.GSC_CLIENT_EMAIL;
  const key = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, '\n');
  return email && key ? { email, key } : null;
}

export const gscSite = () => process.env.GSC_SITE_URL || '';
export const gscConfigured = () => Boolean(gscCredentials() && gscSite());

const b64 = (v: string | Buffer) => Buffer.from(v).toString('base64url');

/** Builds the RS256-signed assertion Google's OAuth endpoint exchanges for an access token. */
export function signJwt(creds: Creds, now = Math.floor(Date.now() / 1000)): string {
  const head = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64(JSON.stringify({ iss: creds.email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: TOKEN_URL(), iat: now, exp: now + 3600 }));
  const sig = createSign('RSA-SHA256').update(`${head}.${claims}`).sign(creds.key);
  return `${head}.${claims}.${b64(sig)}`;
}

let cached: { token: string; exp: number } | null = null;
let inflight: Promise<string> | null = null;

/** One token request at a time: parallel queries share it. */
function accessToken(): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return Promise.resolve(cached.token);
  inflight ??= fetchToken().finally(() => { inflight = null; });
  return inflight;
}

async function fetchToken(): Promise<string> {
  const creds = gscCredentials();
  if (!creds) throw new Error('Search Console is not configured.');
  const r = await fetch(TOKEN_URL(), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: signJwt(creds) }),
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`Google sign-in failed (${r.status}). Check the service account and that its key is current.`);
  const j = (await r.json()) as { access_token: string; expires_in?: number };
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in ?? 3600) * 1000 };
  return cached.token;
}

export type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function query(body: Record<string, unknown>): Promise<Row[]> {
  const token = await accessToken();
  const r = await fetch(`${API_BASE()}/sites/${encodeURIComponent(gscSite())}/searchAnalytics/query`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (r.status === 403) throw new Error('Google denied access. Add the service account’s email as a user on this property in Search Console.');
  if (!r.ok) throw new Error(`Search Console responded ${r.status}.`);
  return ((await r.json()) as { rows?: Row[] }).rows ?? [];
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export type Performance = { range: { start: string; end: string }; totals: Row | null; queries: Row[]; pages: Row[]; days: Row[]; fetchedAt: string };

/** Search Console data lags by about two days, so the window ends then. */
export async function fetchPerformance(days = 28): Promise<Performance> {
  const end = new Date(Date.now() - 2 * 86_400_000);
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  const base = { startDate: iso(start), endDate: iso(end) };
  const [totals, queries, pages, byDay] = await Promise.all([
    query({ ...base }),
    query({ ...base, dimensions: ['query'], rowLimit: 25 }),
    query({ ...base, dimensions: ['page'], rowLimit: 25 }),
    query({ ...base, dimensions: ['date'], rowLimit: 100 }),
  ]);
  return { range: { start: base.startDate, end: base.endDate }, totals: totals[0] ?? null, queries, pages, days: byDay, fetchedAt: new Date().toISOString() };
}

// ------------------------------------------------------------ Core Web Vitals

export type Vitals = {
  url: string;
  strategy: 'mobile' | 'desktop';
  /** Real-user (CrUX) data — only present when Google has enough traffic data for the URL. */
  field: { overall: string | null; metrics: { key: string; label: string; percentile: number | null; category: string | null }[] } | null;
  /** Lighthouse lab run — a simulation, labelled as such in the UI. */
  lab: { performance: number | null; lcp: string | null; cls: string | null; tbt: string | null } | null;
  fetchedAt: string;
};

const FIELD = [
  ['LARGEST_CONTENTFUL_PAINT_MS', 'Largest Contentful Paint'],
  ['INTERACTION_TO_NEXT_PAINT', 'Interaction to Next Paint'],
  ['CUMULATIVE_LAYOUT_SHIFT_SCORE', 'Cumulative Layout Shift'],
] as const;

export async function fetchVitals(url: string, strategy: 'mobile' | 'desktop'): Promise<Vitals> {
  const u = new URL(PSI_URL());
  u.searchParams.set('url', url);
  u.searchParams.set('strategy', strategy);
  u.searchParams.set('category', 'performance');
  if (process.env.PSI_API_KEY) u.searchParams.set('key', process.env.PSI_API_KEY);
  const r = await fetch(u, { cache: 'no-store' });
  if (!r.ok) throw new Error(r.status === 429 ? 'PageSpeed Insights quota reached — add a free PSI_API_KEY or try later.' : `PageSpeed Insights responded ${r.status}.`);
  const j = (await r.json()) as {
    loadingExperience?: { overall_category?: string; metrics?: Record<string, { percentile?: number; category?: string }> };
    lighthouseResult?: { categories?: { performance?: { score?: number | null } }; audits?: Record<string, { displayValue?: string }> };
  };
  const le = j.loadingExperience;
  const field = le?.metrics && Object.keys(le.metrics).length
    ? { overall: le.overall_category ?? null, metrics: FIELD.map(([k, label]) => ({ key: k, label, percentile: le.metrics?.[k]?.percentile ?? null, category: le.metrics?.[k]?.category ?? null })) }
    : null;
  const lh = j.lighthouseResult;
  const lab = lh ? { performance: lh.categories?.performance?.score != null ? Math.round(lh.categories.performance.score * 100) : null, lcp: lh.audits?.['largest-contentful-paint']?.displayValue ?? null, cls: lh.audits?.['cumulative-layout-shift']?.displayValue ?? null, tbt: lh.audits?.['total-blocking-time']?.displayValue ?? null } : null;
  return { url, strategy, field, lab, fetchedAt: new Date().toISOString() };
}
