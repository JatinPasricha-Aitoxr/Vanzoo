'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Badge, btn, Card, input } from './ui';

type R = { id: number; source: string; destination: string; status_code: 301 | 302; enabled: 0 | 1; hits: number; note: string | null };
type NF = { path: string; hits: number; last_seen: string; last_referrer: string | null };

export function RedirectsManager() {
  const [rows, setRows] = useState<R[]>([]);
  const [nf, setNf] = useState<NF[]>([]);
  const [form, setForm] = useState({ source: '', destination: '', status_code: 301 as 301 | 302, note: '' });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const r = await api<{ redirects: R[]; notFound: NF[] }>('/api/cms/seo/redirects');
    if (r.error) return setMsg({ ok: false, text: r.error });
    setRows(r.redirects);
    setNf(r.notFound);
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.destination.trim() === '/' && !confirm('Redirecting to the homepage is rarely the best match for an old page. Send visitors to the most relevant page instead if you can. Continue anyway?')) return;
    const r = await api('/api/cms/seo/redirects', { method: 'POST', json: { ...form, enabled: true } });
    if (r.error) return setMsg({ ok: false, text: r.error });
    setMsg({ ok: true, text: 'Redirect saved. It applies within about 30 seconds.' });
    setForm({ source: '', destination: '', status_code: 301, note: '' });
    load();
  };
  const toggle = async (row: R) => {
    const r = await api('/api/cms/seo/redirects', { method: 'POST', json: { id: row.id, source: row.source, destination: row.destination, status_code: row.status_code, enabled: !row.enabled, note: row.note ?? undefined } });
    setMsg(r.error ? { ok: false, text: r.error } : null);
    load();
  };
  const del = async (row: R) => { if (confirm(`Delete the redirect from ${row.source}?`)) { await api('/api/cms/seo/redirects', { method: 'DELETE', json: { id: row.id } }); load(); } };

  return (
    <div className="space-y-6">
      <Card title="Add a redirect">
        <form onSubmit={submit} className="grid gap-3 lg:grid-cols-[1fr_1fr_8rem_auto]">
          <div><label htmlFor="r-s" className="mb-1 block text-xs font-semibold">Old address</label><input id="r-s" className={input} placeholder="/old-page/" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} required /></div>
          <div><label htmlFor="r-d" className="mb-1 block text-xs font-semibold">New address</label><input id="r-d" className={input} placeholder="/new-page/ or https://…" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required /></div>
          <div><label htmlFor="r-c" className="mb-1 block text-xs font-semibold">Type</label><select id="r-c" className={input} value={form.status_code} onChange={(e) => setForm({ ...form, status_code: Number(e.target.value) as 301 | 302 })}><option value={301}>301 permanent</option><option value={302}>302 temporary</option></select></div>
          <button type="submit" className={btn.gold + ' self-end'}>Add</button>
        </form>
        <p className="mt-2 text-xs text-[#6b7a75]">Rejects loops, duplicates and invalid addresses. 301 is sent as a 308 and 302 as a 307 (same meaning for search engines, and the request method is preserved).</p>
        {msg ? <p role="status" className={`mt-3 text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}
      </Card>

      <Card title={`Redirects (${rows.length})`}>
        {rows.length === 0 ? <p className="text-sm text-[#6b7a75]">No redirects yet. Old WordPress URLs are already redirected in the site’s code; add new ones here.</p> : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#6b7a75]"><tr><th className="pb-2">From</th><th className="pb-2">To</th><th className="pb-2">Type</th><th className="pb-2">Hits</th><th className="pb-2">Status</th><th className="pb-2" /></tr></thead>
            <tbody className="divide-y divide-[#eef2f0]">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="py-2.5 pr-3 font-medium">{r.source}</td><td className="py-2.5 pr-3 text-[#51635d]">{r.destination}</td><td className="py-2.5 pr-3">{r.status_code}</td><td className="py-2.5 pr-3">{r.hits}</td>
                  <td className="py-2.5 pr-3"><Badge tone={r.enabled ? 'green' : 'grey'}>{r.enabled ? 'enabled' : 'disabled'}</Badge></td>
                  <td className="py-2.5 text-right"><button type="button" className={btn.ghost + ' !px-2.5 !py-1 text-xs'} onClick={() => toggle(r)}>{r.enabled ? 'Disable' : 'Enable'}</button> <button type="button" className={btn.danger + ' !px-2.5 !py-1 text-xs'} onClick={() => del(r)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="Pages visitors couldn’t find (404 log)">
        {nf.length === 0 ? <p className="text-sm text-[#6b7a75]">Nothing logged. Missing pages appear here so you can point them somewhere useful.</p> : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#6b7a75]"><tr><th className="pb-2">Address</th><th className="pb-2">Hits</th><th className="pb-2">Last seen</th><th className="pb-2" /></tr></thead>
            <tbody className="divide-y divide-[#eef2f0]">
              {nf.map((n) => (
                <tr key={n.path}>
                  <td className="py-2.5 pr-3 font-medium">{n.path}</td><td className="py-2.5 pr-3">{n.hits}</td><td className="py-2.5 pr-3 text-xs text-[#6b7a75]">{n.last_seen.slice(0, 16).replace('T', ' ')}</td>
                  <td className="py-2.5 text-right"><button type="button" className={btn.ghost + ' !px-2.5 !py-1 text-xs'} onClick={() => { setForm({ ...form, source: n.path }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Create redirect</button> <button type="button" className={btn.ghost + ' !px-2.5 !py-1 text-xs'} onClick={async () => { await api('/api/cms/seo/redirects', { method: 'DELETE', json: { clearNotFound: n.path } }); load(); }}>Dismiss</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
