'use client';

import { useEffect, useState } from 'react';
import { api, btn, Card, input } from './ui';

type Item = { label: string; href: string };
type Col = { heading: string; links: Item[] };
type Ann = { enabled: boolean; text: string; linkLabel: string; href: string; tone: 'dark' | 'gold'; dismissible: boolean; startsAt: string; endsAt: string };
type Cfg = { nav: Item[]; footerColumns: Col[]; social: Item[]; announcement: Ann };

function ItemRows({ items, onChange, what }: { items: Item[]; onChange: (n: Item[]) => void; what: string }) {
  const move = (i: number, d: number) => { const n = [...items]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2">
          <input aria-label={`${what} label ${i + 1}`} className={input + ' !w-44'} value={it.label} onChange={(e) => onChange(items.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} />
          <input aria-label={`${what} link ${i + 1}`} className={input + ' !w-64 flex-1'} value={it.href} onChange={(e) => onChange(items.map((x, k) => (k === i ? { ...x, href: e.target.value } : x)))} />
          <button type="button" className={btn.ghost + ' !px-2 !py-1'} aria-label="Move up" onClick={() => move(i, -1)}>↑</button>
          <button type="button" className={btn.ghost + ' !px-2 !py-1'} aria-label="Move down" onClick={() => move(i, 1)}>↓</button>
          <button type="button" className={btn.danger + ' !px-2 !py-1'} aria-label={`Remove ${it.label}`} onClick={() => onChange(items.filter((_, k) => k !== i))}>✕</button>
        </div>
      ))}
      <button type="button" className={btn.ghost + ' !py-1 text-xs'} onClick={() => onChange([...items, { label: '', href: '/' }])}>+ Add link</button>
    </div>
  );
}

export function SiteMenus() {
  const [c, setC] = useState<Cfg | null>(null);
  const [custom, setCustom] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => { api<{ config: Cfg; customised: Record<string, boolean> }>('/api/cms/site-config').then((r) => { if (r.config) { setC(r.config); setCustom(r.customised); } else setMsg({ ok: false, text: r.error ?? 'Could not load.' }); }); }, []);
  if (!c) return <p className="text-sm text-[#6b7a75]">{msg?.text ?? 'Loading…'}</p>;
  const save = async (body: Partial<Cfg>, ok: string) => { const r = await api('/api/cms/site-config', { method: 'PUT', json: body }); setMsg(r.error ? { ok: false, text: r.error } : { ok: true, text: ok }); };
  const saveAll = () => save({ nav: c.nav, footerColumns: c.footerColumns, social: c.social, announcement: c.announcement }, 'Saved. The header, footer and social links update within a minute.');
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Header, footer &amp; social</h1><p className="text-sm text-[#6b7a75]">Reorder, rename, add or remove links. Until you save, the site uses its built-in menus{custom.nav ? ' (currently customised)' : ''}.</p></div>
      <Card title="Announcement bar">
        <label className="mb-3 flex items-center gap-2 text-sm font-medium"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={c.announcement.enabled} onChange={(e) => setC({ ...c, announcement: { ...c.announcement, enabled: e.target.checked } })} /> Show a bar above the header on every page</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><label htmlFor="an-t" className="mb-1 block text-xs font-semibold">Message ({c.announcement.text.length}/200)</label><input id="an-t" className={input} value={c.announcement.text} onChange={(e) => setC({ ...c, announcement: { ...c.announcement, text: e.target.value } })} /></div>
          <div><label htmlFor="an-l" className="mb-1 block text-xs font-semibold">Link text (optional)</label><input id="an-l" className={input} value={c.announcement.linkLabel} onChange={(e) => setC({ ...c, announcement: { ...c.announcement, linkLabel: e.target.value } })} /></div>
          <div><label htmlFor="an-h" className="mb-1 block text-xs font-semibold">Link address</label><input id="an-h" className={input} placeholder="/pricing/ or https://…" value={c.announcement.href} onChange={(e) => setC({ ...c, announcement: { ...c.announcement, href: e.target.value } })} /></div>
          <div><label htmlFor="an-s" className="mb-1 block text-xs font-semibold">Show from (optional)</label><input id="an-s" type="datetime-local" className={input} value={c.announcement.startsAt.slice(0, 16)} onChange={(e) => setC({ ...c, announcement: { ...c.announcement, startsAt: e.target.value ? new Date(e.target.value).toISOString() : '' } })} /></div>
          <div><label htmlFor="an-e" className="mb-1 block text-xs font-semibold">Hide after (optional)</label><input id="an-e" type="datetime-local" className={input} value={c.announcement.endsAt.slice(0, 16)} onChange={(e) => setC({ ...c, announcement: { ...c.announcement, endsAt: e.target.value ? new Date(e.target.value).toISOString() : '' } })} /></div>
          <div><label htmlFor="an-c" className="mb-1 block text-xs font-semibold">Look</label><select id="an-c" className={input} value={c.announcement.tone} onChange={(e) => setC({ ...c, announcement: { ...c.announcement, tone: e.target.value as 'dark' | 'gold' } })}><option value="dark">Dark green</option><option value="gold">Gold</option></select></div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={c.announcement.dismissible} onChange={(e) => setC({ ...c, announcement: { ...c.announcement, dismissible: e.target.checked } })} /> Visitors can dismiss it</label>
        </div>
        <p className="mt-3 text-xs text-[#6b7a75]">Dates are in your browser’s local time. Outside the window the bar disappears for visitors.</p>
      </Card>
      <Card title="Header menu">
        <ItemRows items={c.nav} what="Header" onChange={(nav) => setC({ ...c, nav })} />
        <p className="mt-3 text-xs text-[#6b7a75]">Up to 10 links. “Services” keeps its dropdown. On mobile the same links appear in the menu overlay.</p>
      </Card>
      {c.footerColumns.map((col, ci) => (
        <Card key={ci} title={`Footer column ${ci + 1}`}>
          <input aria-label={`Footer column ${ci + 1} heading`} className={input + ' mb-3 !w-64 font-semibold'} value={col.heading} onChange={(e) => setC({ ...c, footerColumns: c.footerColumns.map((x, k) => (k === ci ? { ...x, heading: e.target.value } : x)) })} />
          <ItemRows items={col.links} what={`Footer ${ci + 1}`} onChange={(links) => setC({ ...c, footerColumns: c.footerColumns.map((x, k) => (k === ci ? { ...x, links } : x)) })} />
        </Card>
      ))}
      <Card title="Social profiles">
        <ItemRows items={c.social} what="Social" onChange={(social) => setC({ ...c, social })} />
        <p className="mt-3 text-xs text-[#6b7a75]">https:// addresses only. Facebook, Instagram and YouTube get their icons;</p>
      </Card>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={btn.primary} onClick={saveAll}>Save menus</button>
        <button type="button" className={btn.ghost} onClick={async () => { if (confirm('Go back to the built-in menus?')) { await save({}, 'Restored the built-in menus.'); location.reload(); } }}>Restore built-in menus</button>
        {msg ? <p role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}
      </div>
    </div>
  );
}
