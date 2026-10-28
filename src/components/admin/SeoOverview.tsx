'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, Badge, btn, Card, input } from './ui';
import { MediaPickerModal } from './MediaPicker';

type Issue = { level: 'warn' | 'info'; text: string };
type Page = { url: string; status: number; title: string; description: string; canonical: string; robots: string; h1: number; h2: number; imgsNoAlt: number; jsonLdTypes: string[]; issues: Issue[] };
type Report = { startedAt: string; finishedAt: string; pages: Page[]; broken: { href: string; status: number; from: string[] }[]; duplicateTitles: { title: string; urls: string[] }[]; duplicateDescriptions: { description: string; urls: string[] }[] };
type Override = { title?: string; description?: string; canonical?: string; noindex?: boolean; nofollow?: boolean; ogTitle?: string; ogDescription?: string; ogImage?: string };

export function SeoOverview() {
  const [report, setReport] = useState<Report | null>(null);
  const [job, setJob] = useState<{ state: string; done: number; total: number; message?: string }>({ state: 'idle', done: 0, total: 0 });
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [filter, setFilter] = useState<'issues' | 'all'>('issues');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Page | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    const r = await api<{ state: string; done: number; total: number; message?: string; report?: Report }>('/api/cms/seo/audit');
    if (!r.error) {
      setJob({ state: r.state, done: r.done, total: r.total, message: r.message });
      if (r.report) setReport(r.report);
      if (r.state !== 'running' && timer.current) { clearInterval(timer.current); timer.current = null; }
    }
  }, []);
  const loadOverrides = useCallback(async () => {
    const r = await api<{ overrides: Record<string, Override> }>('/api/cms/seo/overrides');
    if (r.overrides) setOverrides(r.overrides);
  }, []);
  useEffect(() => { refresh(); loadOverrides(); return () => { if (timer.current) clearInterval(timer.current); }; }, [refresh, loadOverrides]);

  const start = async () => {
    await api('/api/cms/seo/audit', { method: 'POST' });
    setJob({ state: 'running', done: 0, total: 0, message: 'Starting…' });
    timer.current = setInterval(refresh, 1200);
  };

  const rows = useMemo(() => (report?.pages ?? []).filter((p) => (filter === 'all' || p.issues.some((i) => i.level === 'warn')) && (!q || p.url.includes(q) || p.title.toLowerCase().includes(q.toLowerCase()))), [report, filter, q]);
  const warnCount = report?.pages.filter((p) => p.issues.some((i) => i.level === 'warn')).length ?? 0;

  return (
    <div className="space-y-6">
      <Card title="Site audit" actions={<button type="button" className={btn.primary} onClick={start} disabled={job.state === 'running'}>{job.state === 'running' ? 'Auditing…' : report ? 'Run audit again' : 'Run audit'}</button>}>
        {job.state === 'running' ? (
          <div>
            <div className="h-2 overflow-hidden rounded-full bg-[#e6efec]" role="progressbar" aria-valuenow={job.done} aria-valuemax={job.total || 1}><div className="h-full bg-[#0A5C4B] transition-all" style={{ width: `${job.total ? (job.done / job.total) * 100 : 5}%` }} /></div>
            <p className="mt-2 text-sm text-[#51635d]">{job.message} {job.done}/{job.total}</p>
          </div>
        ) : report ? (
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat n={report.pages.length} label="pages crawled" />
            <Stat n={warnCount} label="pages with something to check" tone={warnCount ? 'gold' : 'green'} />
            <Stat n={report.broken.length} label="broken internal links" tone={report.broken.length ? 'red' : 'green'} />
            <Stat n={report.duplicateTitles.length + report.duplicateDescriptions.length} label="duplicate title / description groups" tone={report.duplicateTitles.length + report.duplicateDescriptions.length ? 'gold' : 'green'} />
          </div>
        ) : (
          <p className="text-sm text-[#6b7a75]">No audit yet. Run one to crawl every page and check titles, descriptions, headings, canonicals, alt text, structured data and internal links.</p>
        )}
        {job.state === 'error' ? <p className="mt-2 text-sm font-medium text-red-700">{job.message}</p> : null}
        {report ? <p className="mt-3 text-xs text-[#6b7a75]">Last run {report.finishedAt.slice(0, 16).replace('T', ' ')}. Guidance only — not a ranking score. No search-impression or ranking data is shown because Search Console is not connected.</p> : null}
      </Card>

      {report && report.broken.length > 0 ? (
        <Card title="Broken internal links">
          <ul className="space-y-2 text-sm">
            {report.broken.slice(0, 40).map((b) => (
              <li key={b.href}><code className="rounded bg-red-50 px-1.5 py-0.5 text-red-800">{b.href}</code> <Badge tone="red">{b.status || 'no response'}</Badge><span className="ml-2 text-xs text-[#6b7a75]">linked from {b.from.join(', ')}</span> <a href="/admin/seo/redirects" className="ml-2 text-xs font-semibold text-[#0A5C4B] hover:underline">Add redirect →</a></li>
            ))}
          </ul>
        </Card>
      ) : null}

      {report ? (
        <Card title="Pages" actions={
          <div className="flex items-center gap-2">
            <input className={input + ' !w-48 !py-1.5'} placeholder="Filter URL or title…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter pages" />
            <select className={input + ' !w-36 !py-1.5'} value={filter} onChange={(e) => setFilter(e.target.value as 'issues' | 'all')} aria-label="Show">
              <option value="issues">With issues</option><option value="all">All pages</option>
            </select>
          </div>}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-[#6b7a75]"><tr><th className="pb-2">URL</th><th className="pb-2">Title</th><th className="pb-2">Desc.</th><th className="pb-2">H1</th><th className="pb-2">Checks</th><th className="pb-2" /></tr></thead>
              <tbody className="divide-y divide-[#eef2f0]">
                {rows.slice(0, 150).map((p) => (
                  <tr key={p.url} className="align-top">
                    <td className="py-2.5 pr-3"><a href={p.url} target="_blank" rel="noreferrer" className="font-medium text-[#0A5C4B] hover:underline">{p.url}</a>{overrides[p.url] ? <Badge tone="gold">override</Badge> : null}</td>
                    <td className="max-w-xs truncate py-2.5 pr-3" title={p.title}>{p.title || <em className="text-red-700">missing</em>} <span className="text-xs text-[#6b7a75]">({p.title.length})</span></td>
                    <td className="py-2.5 pr-3 text-xs">{p.description ? p.description.length : <em className="text-red-700">none</em>}</td>
                    <td className="py-2.5 pr-3">{p.h1}</td>
                    <td className="py-2.5 pr-3"><ul className="space-y-0.5 text-xs">{p.issues.filter((i) => i.level === 'warn').slice(0, 3).map((i, n) => <li key={n} className="text-amber-800">• {i.text}</li>)}{p.issues.filter((i) => i.level === 'warn').length === 0 ? <li className="text-emerald-700">✓ no warnings</li> : null}</ul></td>
                    <td className="py-2.5"><button type="button" className={btn.ghost + ' !px-2.5 !py-1 text-xs'} onClick={() => setEditing(p)}>Edit SEO</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 150 ? <p className="mt-3 text-xs text-[#6b7a75]">Showing the first 150 of {rows.length}. Use the filter to narrow.</p> : null}
            {rows.length === 0 ? <p className="py-6 text-center text-sm text-[#6b7a75]">Nothing to show.</p> : null}
          </div>
        </Card>
      ) : null}
      {editing ? <OverrideDialog page={editing} current={overrides[editing.url]} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); loadOverrides(); }} /> : null}
    </div>
  );
}

function Stat({ n, label, tone = 'grey' }: { n: number; label: string; tone?: 'grey' | 'green' | 'gold' | 'red' }) {
  const c = { grey: 'text-neutral-ink', green: 'text-emerald-700', gold: 'text-amber-700', red: 'text-red-700' }[tone];
  return <div><p className={`text-3xl font-semibold ${c}`}>{n}</p><p className="text-xs text-[#6b7a75]">{label}</p></div>;
}

function OverrideDialog({ page, current, onClose, onSaved }: { page: Page; current?: Override; onClose: () => void; onSaved: () => void }) {
  const [o, setO] = useState<Override>(current ?? {});
  const [msg, setMsg] = useState('');
  const [picking, setPicking] = useState(false);
  const set = (k: keyof Override, v: unknown) => setO((x) => ({ ...x, [k]: v }));
  const save = async () => {
    const r = await api('/api/cms/seo/overrides', { method: 'PUT', json: { path: page.url, data: o } });
    if (r.error) return setMsg(r.error);
    onSaved();
  };
  return (
    <div role="dialog" aria-modal="true" aria-label={`SEO for ${page.url}`} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold">SEO for {page.url}</h2>
        <p className="mb-4 text-xs text-[#6b7a75]">Blank fields keep the page’s built-in value. Current title: “{page.title}”.</p>
        <div className="space-y-3 text-sm">
          <div><label className="mb-1 block text-xs font-semibold" htmlFor="o-t">SEO title ({(o.title ?? '').length}/60)</label><input id="o-t" className={input} value={o.title ?? ''} placeholder={page.title} onChange={(e) => set('title', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold" htmlFor="o-d">Meta description ({(o.description ?? '').length}/160)</label><textarea id="o-d" rows={3} className={input} value={o.description ?? ''} placeholder={page.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold" htmlFor="o-c">Canonical URL</label><input id="o-c" className={input} value={o.canonical ?? ''} placeholder={page.canonical} onChange={(e) => set('canonical', e.target.value)} /></div>
          <div className="flex gap-4"><label className="inline-flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={Boolean(o.noindex)} onChange={(e) => set('noindex', e.target.checked)} /> noindex</label><label className="inline-flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={Boolean(o.nofollow)} onChange={(e) => set('nofollow', e.target.checked)} /> nofollow</label></div>
          <div><label className="mb-1 block text-xs font-semibold" htmlFor="o-ot">Social title</label><input id="o-ot" className={input} value={o.ogTitle ?? ''} onChange={(e) => set('ogTitle', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold" htmlFor="o-od">Social description</label><textarea id="o-od" rows={2} className={input} value={o.ogDescription ?? ''} onChange={(e) => set('ogDescription', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold" htmlFor="o-oi">Social image</label><div className="flex gap-2"><input id="o-oi" className={input} value={o.ogImage ?? ''} placeholder="/uploads/… or /images/…" onChange={(e) => set('ogImage', e.target.value)} /><button type="button" className={btn.ghost} onClick={() => setPicking(true)}>Choose…</button></div></div>
        </div>
        {picking ? <MediaPickerModal onClose={() => setPicking(false)} onPick={(m) => set('ogImage', m.url)} /> : null}
        {msg ? <p role="alert" className="mt-3 text-sm font-medium text-red-700">{msg}</p> : null}
        <div className="mt-5 flex justify-between">
          <button type="button" className={btn.danger} onClick={async () => { await api('/api/cms/seo/overrides', { method: 'PUT', json: { path: page.url, data: {} } }); onSaved(); }}>Remove override</button>
          <div className="flex gap-2"><button type="button" className={btn.ghost} onClick={onClose}>Cancel</button><button type="button" className={btn.primary} onClick={save}>Save</button></div>
        </div>
        <p className="mt-3 text-xs text-[#6b7a75]">Changes go live when the page is next regenerated (usually within a minute).</p>
      </div>
    </div>
  );
}
