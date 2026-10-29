'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Badge, btn, Card, input } from './ui';
import { MediaPickerModal } from './MediaPicker';

type Row = { item: string; amount: number; from: boolean; image: string };
type Group = { id: string; label: string; rows: Row[] };
type Catalog = { id: 'couture' | 'steam-iron'; label: string; groups: Group[] };
type RowEdit = { amount?: number; from?: boolean; image?: string; hidden?: boolean };
type Added = { group: string; item: string; amount: number; from?: boolean; image?: string };
type Ov = { rows?: Record<string, RowEdit>; added?: Added[] };

const k = (g: string, item: string) => `${g}|${item}`;
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export function TariffManager() {
  const [cats, setCats] = useState<Catalog[]>([]);
  const [ovs, setOvs] = useState<Record<string, Ov>>({});
  const [cur, setCur] = useState<'couture' | 'steam-iron'>('couture');
  const [rows, setRows] = useState<Record<string, RowEdit>>({});
  const [added, setAdded] = useState<Added[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pick, setPick] = useState<{ group: string; item: string } | null>(null);
  const [draft, setDraft] = useState<Record<string, { item: string; amount: string; from: boolean }>>({});

  useEffect(() => { api<{ catalogs: Catalog[]; overrides: Record<string, Ov> }>('/api/cms/tariff').then((r) => { if (r.error) setMsg({ ok: false, text: r.error }); else { setCats(r.catalogs); setOvs(r.overrides); } }); }, []);
  const load = useCallback((id: string, o: Record<string, Ov>) => { setRows(o[id]?.rows ?? {}); setAdded(o[id]?.added ?? []); }, []);
  useEffect(() => { load(cur, ovs); }, [cur, ovs, load]);

  const catalog = cats.find((c) => c.id === cur);
  if (!catalog) return <p className="text-sm text-[#6b7a75]">{msg?.text ?? 'Loading…'}</p>;
  const set = (g: string, item: string, patch: RowEdit) => setRows((r) => ({ ...r, [k(g, item)]: { ...r[k(g, item)], ...patch } }));
  const changed = (g: string, r: Row) => { const e = rows[k(g, r.item)]; return Boolean(e && ((e.amount !== undefined && e.amount !== r.amount) || (e.from !== undefined && e.from !== r.from) || e.hidden || (e.image && e.image !== r.image))); };

  const save = async () => {
    const r = await api('/api/cms/tariff', { method: 'PUT', json: { catalog: cur, rows, added } });
    if (r.error) return setMsg({ ok: false, text: r.error });
    const fresh = await api<{ overrides: Record<string, Ov> }>('/api/cms/tariff');
    if (fresh.overrides) setOvs(fresh.overrides);
    setMsg({ ok: true, text: 'Prices saved. The pricing page, garment pages, services and search update within a minute.' });
  };
  const reset = async () => {
    if (!confirm(`Discard every price change to the ${catalog.label} list and restore the built-in prices?`)) return;
    const r = await api('/api/cms/tariff', { method: 'DELETE', json: { catalog: cur } });
    if (r.error) return setMsg({ ok: false, text: r.error });
    setOvs((o) => { const n = { ...o }; delete n[cur]; return n; }); setMsg({ ok: true, text: 'Restored the built-in prices.' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Pricing</h1><p className="max-w-2xl text-sm text-[#6b7a75]">Prices are in rupees, excluding GST. “From” rows are shown as “Starting from”. Everything that shows a price — the pricing page, garment pages, service cards, the cart and search — reads from here.</p></div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Price list">
        {cats.map((c) => <button key={c.id} type="button" role="tab" aria-selected={cur === c.id} onClick={() => setCur(c.id)} className={`rounded-lg px-3.5 py-2 text-sm font-semibold ${cur === c.id ? 'bg-[#0A5C4B] text-white' : 'border border-[#d6dedb] bg-white'}`}>{c.label}{ovs[c.id] ? ' •' : ''}</button>)}
        <div className="ml-auto flex gap-2"><button type="button" className={btn.danger} onClick={reset} disabled={!ovs[cur]}>Restore built-in prices</button><button type="button" className={btn.primary} onClick={save}>Save {catalog.label}</button></div>
      </div>
      {msg ? <p role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}
      {catalog.groups.map((g) => (
        <Card key={g.id} title={g.label}>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#6b7a75]"><tr><th className="pb-2">Item</th><th className="pb-2">Price (₹)</th><th className="pb-2">Starting from</th><th className="pb-2">Hide</th><th className="pb-2" /></tr></thead>
            <tbody className="divide-y divide-[#eef2f0]">
              {g.rows.map((r) => { const e = rows[k(g.id, r.item)] ?? {}; return (
                <tr key={r.item} className={e.hidden ? 'opacity-50' : ''}>
                  <td className="py-2 pr-3">{r.item} {changed(g.id, r) ? <Badge tone="gold">changed</Badge> : null}<span className="block text-xs text-[#6b7a75]">built-in {inr(r.amount)}{r.from ? ' (from)' : ''}</span></td>
                  <td className="py-2 pr-3"><input aria-label={`Price for ${r.item}`} type="number" min={0} className={input + ' !w-28 !py-1'} value={e.amount ?? r.amount} onChange={(ev) => set(g.id, r.item, { amount: ev.target.value === '' ? undefined : Number(ev.target.value) })} /></td>
                  <td className="py-2 pr-3"><input aria-label={`${r.item} is a starting-from price`} type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={e.from ?? r.from} onChange={(ev) => set(g.id, r.item, { from: ev.target.checked })} /></td>
                  <td className="py-2 pr-3"><input aria-label={`Hide ${r.item}`} type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={Boolean(e.hidden)} onChange={(ev) => set(g.id, r.item, { hidden: ev.target.checked })} /></td>
                  <td className="py-2 text-right"><button type="button" className={btn.ghost + ' !px-2 !py-1 text-xs'} onClick={() => setPick({ group: g.id, item: r.item })}>Photo</button></td>
                </tr>); })}
              {added.filter((a) => a.group === g.id).map((a) => (
                <tr key={`add-${a.item}`} className="bg-[#f6fbf9]">
                  <td className="py-2 pr-3">{a.item} <Badge tone="green">added</Badge></td>
                  <td className="py-2 pr-3"><input aria-label={`Price for ${a.item}`} type="number" min={0} className={input + ' !w-28 !py-1'} value={a.amount} onChange={(ev) => setAdded(added.map((x) => (x === a ? { ...x, amount: Number(ev.target.value) } : x)))} /></td>
                  <td className="py-2 pr-3"><input aria-label={`${a.item} is a starting-from price`} type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={Boolean(a.from)} onChange={(ev) => setAdded(added.map((x) => (x === a ? { ...x, from: ev.target.checked } : x)))} /></td>
                  <td />
                  <td className="py-2 text-right"><button type="button" className={btn.danger + ' !px-2 !py-1 text-xs'} onClick={() => setAdded(added.filter((x) => x !== a))}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <form className="mt-4 flex flex-wrap items-end gap-2" onSubmit={(ev) => { ev.preventDefault(); const d = draft[g.id]; if (!d?.item.trim() || d.amount === '') return; setAdded([...added, { group: g.id, item: d.item.trim(), amount: Number(d.amount), from: d.from }]); setDraft({ ...draft, [g.id]: { item: '', amount: '', from: false } }); }}>
            <div><label className="mb-1 block text-xs font-semibold" htmlFor={`n-${g.id}`}>New item</label><input id={`n-${g.id}`} className={input + ' !w-56'} value={draft[g.id]?.item ?? ''} onChange={(ev) => setDraft({ ...draft, [g.id]: { item: ev.target.value, amount: draft[g.id]?.amount ?? '', from: draft[g.id]?.from ?? false } })} /></div>
            <div><label className="mb-1 block text-xs font-semibold" htmlFor={`a-${g.id}`}>Price (₹)</label><input id={`a-${g.id}`} type="number" min={0} className={input + ' !w-28'} value={draft[g.id]?.amount ?? ''} onChange={(ev) => setDraft({ ...draft, [g.id]: { item: draft[g.id]?.item ?? '', amount: ev.target.value, from: draft[g.id]?.from ?? false } })} /></div>
            <label className="flex items-center gap-2 pb-2 text-xs"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={draft[g.id]?.from ?? false} onChange={(ev) => setDraft({ ...draft, [g.id]: { item: draft[g.id]?.item ?? '', amount: draft[g.id]?.amount ?? '', from: ev.target.checked } })} /> Starting from</label>
            <button type="submit" className={btn.ghost}>+ Add row</button>
          </form>
        </Card>
      ))}
      <p className="text-xs text-[#6b7a75]">Remember to press <strong>Save {catalog.label}</strong> after changing rows. Existing carts keep the price they were added at.</p>
      {pick ? <MediaPickerModal onClose={() => setPick(null)} onPick={(m) => { set(pick.group, pick.item, { image: m.url }); setPick(null); }} /> : null}
    </div>
  );
}
