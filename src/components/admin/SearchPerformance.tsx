'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Badge, btn, Card, input } from './ui';

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
type Perf = { range: { start: string; end: string }; totals: Row | null; queries: Row[]; pages: Row[]; days: Row[]; fetchedAt: string };
type Vitals = { url: string; strategy: string; field: { overall: string | null; metrics: { key: string; label: string; percentile: number | null; category: string | null }[] } | null; lab: { performance: number | null; lcp: string | null; cls: string | null; tbt: string | null } | null; fetchedAt: string };

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const tone = (c: string | null): 'green' | 'gold' | 'red' | 'grey' => (c === 'FAST' || c === 'GOOD' ? 'green' : c === 'AVERAGE' ? 'gold' : c === 'SLOW' || c === 'POOR' ? 'red' : 'grey');

export function SearchPerformance() {
  const [state, setState] = useState<{ configured?: boolean; site?: string; data?: Perf; error?: string } | null>(null);
  const [days, setDays] = useState(28);
  const [busy, setBusy] = useState(false);
  const [vpath, setVpath] = useState('/');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [verr, setVerr] = useState('');

  const load = useCallback(async (refresh = false) => {
    setBusy(true);
    const r = await api<{ configured: boolean; site?: string; data?: Perf }>(`/api/cms/integrations/gsc?days=${days}${refresh ? '&refresh=1' : ''}`);
    setState({ configured: r.configured, site: r.site, data: r.data, error: r.error });
    setBusy(false);
  }, [days]);
  useEffect(() => { load(); }, [load]);

  const runVitals = async () => {
    setVerr(''); setVitals(null); setBusy(true);
    const r = await api<{ vitals: Vitals }>(`/api/cms/integrations/vitals?path=${encodeURIComponent(vpath)}&strategy=${strategy}`);
    setBusy(false);
    if (r.error) setVerr(r.error); else setVitals(r.vitals);
  };

  if (!state) return <p className="text-sm text-[#6b7a75]">Loading…</p>;
  const d = state.data;
  return (
    <div className="space-y-6">
      {!state.configured ? (
        <Card title="Connect Google Search Console">
          <p className="text-sm text-[#51635d]">No search data is shown because Search Console is not connected, and this page never estimates or invents impressions, clicks or rankings. To connect it (free, read-only):</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-[#51635d]">
            <li>In Google Cloud, create a project, enable the <strong>Search Console API</strong> and create a <strong>service account</strong>; download its JSON key.</li>
            <li>In Search Console → Settings → Users and permissions, add the service account’s email as a <strong>Restricted</strong> user on your property.</li>
            <li>Set these environment variables on the server and restart: <code>GSC_SERVICE_ACCOUNT_JSON</code> (the whole JSON) or <code>GSC_CLIENT_EMAIL</code> + <code>GSC_PRIVATE_KEY</code>, and <code>GSC_SITE_URL</code> (e.g. <code>sc-domain:vanzoo.in</code> or <code>https://vanzoo.in/</code>).</li>
          </ol>
        </Card>
      ) : (
        <Card title={`Search performance — ${state.site}`} actions={<div className="flex items-center gap-2"><select aria-label="Period" className={input + ' !w-32 !py-1.5'} value={days} onChange={(e) => setDays(Number(e.target.value))}><option value={7}>Last 7 days</option><option value={28}>Last 28 days</option><option value={90}>Last 90 days</option></select><button type="button" className={btn.ghost + ' !py-1.5'} disabled={busy} onClick={() => load(true)}>Refresh</button></div>}>
          {state.error ? <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p> : null}
          {d ? (
            <>
              <p className="mb-4 text-xs text-[#6b7a75]">{d.range.start} → {d.range.end} (Google reports with a ~2-day delay). Source: Google Search Console.</p>
              {d.totals ? (
                <div className="grid gap-4 sm:grid-cols-4">
                  <Stat n={d.totals.clicks.toLocaleString('en-IN')} label="clicks" /><Stat n={d.totals.impressions.toLocaleString('en-IN')} label="impressions" /><Stat n={pct(d.totals.ctr)} label="average CTR" /><Stat n={d.totals.position.toFixed(1)} label="average position" />
                </div>
              ) : <p className="text-sm text-[#6b7a75]">No data for this period yet.</p>}
              <Spark days={d.days} />
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Table title="Top queries" rows={d.queries} />
                <Table title="Top pages" rows={d.pages} strip />
              </div>
            </>
          ) : null}
        </Card>
      )}

      <Card title="Core Web Vitals (PageSpeed Insights)">
        <div className="flex flex-wrap items-end gap-2">
          <div><label htmlFor="v-p" className="mb-1 block text-xs font-semibold">Page</label><input id="v-p" className={input + ' !w-64'} value={vpath} onChange={(e) => setVpath(e.target.value)} placeholder="/" /></div>
          <select aria-label="Device" className={input + ' !w-32'} value={strategy} onChange={(e) => setStrategy(e.target.value as 'mobile' | 'desktop')}><option value="mobile">Mobile</option><option value="desktop">Desktop</option></select>
          <button type="button" className={btn.primary} disabled={busy} onClick={runVitals}>{busy ? 'Running…' : 'Run test'}</button>
        </div>
        <p className="mt-2 text-xs text-[#6b7a75]">Runs Google’s PageSpeed Insights against the live site (free; add a PSI_API_KEY for higher limits). The page must be publicly reachable, so this shows nothing useful on a local copy.</p>
        {verr ? <p role="alert" className="mt-3 text-sm font-medium text-red-700">{verr}</p> : null}
        {vitals ? (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Real-user data (Chrome UX Report)</h3>
              {vitals.field ? (
                <ul className="mt-2 space-y-1.5 text-sm">{vitals.field.metrics.map((m) => (<li key={m.key} className="flex items-center justify-between"><span>{m.label}</span><span className="flex items-center gap-2"><span className="tabular-nums">{m.percentile == null ? '—' : m.key === 'CUMULATIVE_LAYOUT_SHIFT_SCORE' ? (m.percentile / 100).toFixed(2) : `${m.percentile} ms`}</span><Badge tone={tone(m.category)}>{m.category ?? 'n/a'}</Badge></span></li>))}</ul>
              ) : <p className="mt-1 text-sm text-[#6b7a75]">Google doesn’t have enough real-visitor data for this page yet.</p>}
            </div>
            {vitals.lab ? (
              <div>
                <h3 className="text-sm font-semibold">Lab test (a simulation, not real visitors)</h3>
                <p className="mt-1 text-sm text-[#51635d]">Performance score {vitals.lab.performance ?? '—'} · LCP {vitals.lab.lcp ?? '—'} · CLS {vitals.lab.cls ?? '—'} · Total blocking time {vitals.lab.tbt ?? '—'}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return <div><p className="text-3xl font-semibold">{n}</p><p className="text-xs text-[#6b7a75]">{label}</p></div>;
}

function Spark({ days }: { days: Row[] }) {
  if (days.length < 2) return null;
  const max = Math.max(...days.map((d) => d.clicks), 1);
  return (
    <div className="mt-5" role="img" aria-label="Clicks per day">
      <div className="flex h-16 items-end gap-0.5">{days.map((d) => <span key={d.keys?.[0]} title={`${d.keys?.[0]}: ${d.clicks} clicks`} className="flex-1 rounded-t bg-[#0A5C4B]/70" style={{ height: `${Math.max(4, (d.clicks / max) * 100)}%` }} />)}</div>
      <p className="mt-1 text-xs text-[#6b7a75]">Clicks per day</p>
    </div>
  );
}

function Table({ title, rows, strip }: { title: string; rows: Row[]; strip?: boolean }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {rows.length === 0 ? <p className="text-sm text-[#6b7a75]">No data.</p> : (
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-[#6b7a75]"><tr><th className="pb-1.5">{strip ? 'Page' : 'Query'}</th><th className="pb-1.5 text-right">Clicks</th><th className="pb-1.5 text-right">Impr.</th><th className="pb-1.5 text-right">Pos.</th></tr></thead>
          <tbody className="divide-y divide-[#eef2f0]">{rows.map((r) => (<tr key={r.keys?.[0]}><td className="max-w-[16rem] truncate py-1.5 pr-2" title={r.keys?.[0]}>{strip ? (r.keys?.[0] ?? '').replace(/^https?:\/\/[^/]+/, '') || '/' : r.keys?.[0]}</td><td className="py-1.5 text-right tabular-nums">{r.clicks}</td><td className="py-1.5 text-right tabular-nums">{r.impressions}</td><td className="py-1.5 text-right tabular-nums">{r.position.toFixed(1)}</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
