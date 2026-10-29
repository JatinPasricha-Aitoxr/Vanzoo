'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, Badge, btn, Card, input } from './ui';
import { MediaPickerModal } from './MediaPicker';

type Source = { name: string; label: string; where: string; leaves: Record<string, string> };
const isImage = (s: string) => /^\/[^\s]+\.(png|jpe?g|webp|avif|gif)$/i.test(s);
const nice = (path: string) => path.split('.').map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : p.replace(/([A-Z])/g, ' $1').toLowerCase())).join(' › ');

export function CopyManager() {
  const [sources, setSources] = useState<Source[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});
  const [cur, setCur] = useState<string | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pick, setPick] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await api<{ sources: Source[]; overrides: Record<string, Record<string, string>> }>('/api/cms/copy');
    if (r.error) return setMsg({ ok: false, text: r.error });
    setSources(r.sources); setOverrides(r.overrides);
  }, []);
  useEffect(() => { load(); }, [load]);

  const src = sources.find((s) => s.name === cur);
  useEffect(() => { if (src) setVals({ ...src.leaves, ...(overrides[src.name] ?? {}) }); }, [src, overrides]);

  const rows = useMemo(() => (src ? Object.entries(src.leaves).filter(([p, base]) => !q || p.toLowerCase().includes(q.toLowerCase()) || (vals[p] ?? base).toLowerCase().includes(q.toLowerCase())) : []), [src, q, vals]);
  const changed = (p: string) => src && vals[p] !== undefined && vals[p] !== src.leaves[p];

  const save = async () => {
    if (!src) return;
    const paths = Object.fromEntries(Object.keys(src.leaves).filter((p) => changed(p)).map((p) => [p, vals[p]]));
    const r = await api('/api/cms/copy', { method: 'PUT', json: { source: src.name, paths } });
    if (r.error) return setMsg({ ok: false, text: r.error });
    setMsg({ ok: true, text: 'Saved. The page text updates within a minute.' });
    load();
  };
  const reset = async () => {
    if (!src || !confirm(`Discard every text change in “${src.label}”?`)) return;
    await api('/api/cms/copy', { method: 'PUT', json: { source: src.name, paths: {} } });
    setMsg({ ok: true, text: 'Restored the built-in text.' });
    load();
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Page text</h1><p className="max-w-2xl text-sm text-[#6b7a75]">Edit the wording and images of the built-in pages and shared blocks. Structure and layout stay as designed; to change those, replace the page in the builder (Pages → New page).</p></div>
      {msg ? <p role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <Card className="self-start">
          <ul className="-my-2 max-h-[72vh] divide-y divide-[#eef2f0] overflow-y-auto">
            {sources.map((s) => (
              <li key={s.name}>
                <button type="button" onClick={() => { setCur(s.name); setQ(''); setMsg(null); }} aria-current={cur === s.name} className={`flex w-full items-start justify-between gap-2 py-2.5 text-left text-sm ${cur === s.name ? 'font-semibold text-[#0A5C4B]' : ''}`}>
                  <span>{s.label}<span className="block text-xs font-normal text-[#6b7a75]">{s.where}</span></span>
                  {overrides[s.name] ? <Badge tone="gold">edited</Badge> : null}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        {src ? (
          <Card title={src.label} actions={<div className="flex gap-2"><input className={input + ' !w-44 !py-1.5'} placeholder="Find text…" aria-label="Find text" value={q} onChange={(e) => setQ(e.target.value)} />{overrides[src.name] ? <button type="button" className={btn.danger + ' !py-1 text-xs'} onClick={reset}>Restore built-in</button> : null}<button type="button" className={btn.primary + ' !py-1.5'} onClick={save}>Save</button></div>}>
            <div className="space-y-4">
              {rows.length === 0 ? <p className="text-sm text-[#6b7a75]">Nothing matches.</p> : null}
              {rows.map(([p, base]) => {
                const v = vals[p] ?? base;
                const img = isImage(base);
                return (
                  <div key={p}>
                    <label htmlFor={`cp-${p}`} className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#51635d]">{nice(p)} {changed(p) ? <Badge tone="gold">changed</Badge> : null}</label>
                    {img ? (
                      <div className="flex gap-2"><input id={`cp-${p}`} className={input} value={v} onChange={(e) => setVals({ ...vals, [p]: e.target.value })} /><button type="button" className={btn.ghost} onClick={() => setPick(p)}>Choose…</button></div>
                    ) : v.length > 90 || v.includes('\n') ? (
                      <textarea id={`cp-${p}`} rows={Math.min(8, Math.ceil(v.length / 90) + 1)} className={input} value={v} onChange={(e) => setVals({ ...vals, [p]: e.target.value })} />
                    ) : (
                      <input id={`cp-${p}`} className={input} value={v} onChange={(e) => setVals({ ...vals, [p]: e.target.value })} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ) : <p className="text-sm text-[#6b7a75]">Choose a page or block on the left.</p>}
      </div>
      {pick ? <MediaPickerModal onClose={() => setPick(null)} onPick={(m) => { setVals({ ...vals, [pick]: m.url }); setPick(null); }} /> : null}
    </div>
  );
}
