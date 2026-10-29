'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ContentTypeDef } from '@/cms/contentFields';
import { api, Badge, btn, Card, input } from './ui';
import { FieldInput } from './editor/Inspector';

type Entry = { key: string; label: string; builtIn: boolean; edited: boolean; hidden: boolean };
type Option = { catalogId: string; groupId: string; item: string; label: string; description: string };
type Detail = {
  def: ContentTypeDef;
  base: (Record<string, unknown> & { options?: Option[] }) | null;
  override: (Record<string, unknown> & { hidden?: boolean; options?: Record<string, { label?: string; description?: string; hidden?: boolean }>; services?: Record<string, string>[] }) | null;
  builtIn: boolean;
  rows?: { catalogId: string; groupId: string; item: string; label: string }[];
};

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? '') === JSON.stringify(b ?? '');
const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
const optKey = (o: { catalogId?: string; groupId?: string; item?: string }) => `${o.catalogId}|${o.groupId}|${o.item}`;

export function ContentManager({ type }: { type: string }) {
  const [def, setDef] = useState<ContentTypeDef | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [key, setKey] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const r = await api<{ def: ContentTypeDef; entries: Entry[] }>(`/api/cms/content?type=${type}`);
    if (r.error) return setMsg({ ok: false, text: r.error });
    setDef(r.def); setEntries(r.entries);
    if (r.entries.length === 1) setKey(r.entries[0].key);
  }, [type]);
  useEffect(() => { setKey(null); setMsg(null); load(); }, [load]);

  if (!def) return <p className="text-sm text-[#6b7a75]">{msg?.text ?? 'Loading…'}</p>;
  const addNew = () => {
    const name = prompt(`Name of the new ${def.label.toLowerCase()}:`);
    if (!name) return;
    const k = slugify(name);
    if (!k) return;
    if (entries.some((e) => e.key === k)) return setMsg({ ok: false, text: 'That address already exists.' });
    setEntries([...entries, { key: k, label: name, builtIn: false, edited: false, hidden: false }]);
    setKey(k);
    sessionStorage.setItem(`vz-new-${type}-${k}`, name);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl font-semibold">{def.plural}</h1><p className="max-w-2xl text-sm text-[#6b7a75]">{def.description}</p></div>
        {def.canAdd ? <button type="button" className={btn.gold} onClick={addNew}>New {def.label.toLowerCase()}</button> : null}
      </div>
      {msg ? <p role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        {entries.length > 1 ? (
          <Card className="self-start">
            <ul className="-my-2 max-h-[70vh] divide-y divide-[#eef2f0] overflow-y-auto">
              {entries.map((e) => (
                <li key={e.key}>
                  <button type="button" onClick={() => { setKey(e.key); setMsg(null); }} aria-current={key === e.key} className={`flex w-full items-center justify-between gap-2 py-2.5 text-left text-sm ${key === e.key ? 'font-semibold text-[#0A5C4B]' : ''}`}>
                    <span className="truncate">{e.label}</span>
                    <span className="flex shrink-0 gap-1">{e.hidden ? <Badge tone="red">hidden</Badge> : e.edited ? <Badge tone="gold">edited</Badge> : null}{!e.builtIn ? <Badge tone="green">new</Badge> : null}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
        {key ? <Editor key={`${type}-${key}`} def={def} type={type} entryKey={key} onSaved={(t) => { setMsg({ ok: true, text: t }); load(); }} onError={(t) => setMsg({ ok: false, text: t })} /> : <p className="text-sm text-[#6b7a75]">Choose an item on the left to edit it.</p>}
      </div>
    </div>
  );
}

function Editor({ def, type, entryKey, onSaved, onError }: { def: ContentTypeDef; type: string; entryKey: string; onSaved: (t: string) => void; onError: (t: string) => void }) {
  const [d, setD] = useState<Detail | null>(null);
  const [vals, setVals] = useState<Record<string, unknown>>({});
  const [hidden, setHidden] = useState(false);
  const [opts, setOpts] = useState<Record<string, { label?: string; description?: string; hidden?: boolean }>>({});
  const [newServices, setNewServices] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    api<Detail>(`/api/cms/content?type=${type}&key=${entryKey}`).then((r) => {
      const fresh = r.error?.startsWith('Not found');
      if (r.error && !fresh) return onError(r.error);
      const detail: Detail = fresh ? { def, base: null, override: null, builtIn: false } : r;
      setD(detail);
      const v: Record<string, unknown> = {};
      for (const f of def.fields) v[f.key] = detail.override?.[f.key] ?? detail.base?.[f.key] ?? (f.type === 'lines' || f.type === 'list' ? [] : '');
      const seeded = typeof window !== 'undefined' ? sessionStorage.getItem(`vz-new-${type}-${entryKey}`) : null;
      if (seeded && !detail.builtIn && !v.title) v.title = seeded;
      setVals(v); setHidden(Boolean(detail.override?.hidden)); setOpts(detail.override?.options ?? {}); setNewServices((detail.override?.services as Record<string, string>[]) ?? []);
    });
  }, [type, entryKey, def, onError]);

  const choices = d?.rows ?? [];
  const isNew = d ? !d.builtIn : false;

  const save = async () => {
    if (!d) return;
    const data: Record<string, unknown> = {};
    for (const f of def.fields) {
      const cur = vals[f.key];
      if (isNew ? cur !== '' && !(Array.isArray(cur) && cur.length === 0) : !same(cur, d.base?.[f.key])) data[f.key] = cur;
    }
    if (type === 'product') {
      if (isNew) data.services = newServices.filter((s) => s.item);
      else { const o = Object.fromEntries(Object.entries(opts).filter(([, v]) => v.label || v.description || v.hidden)); if (Object.keys(o).length) data.options = o; }
    }
    const r = await api('/api/cms/content', { method: 'PUT', json: { type, key: entryKey, data, ...(def.canHide ? { hidden } : {}) } });
    if (r.error) return onError(r.error);
    onSaved('Saved. The site updates within a minute.');
  };
  const revert = async () => {
    if (!confirm(isNew ? 'Delete this item?' : 'Discard all your changes and go back to the built-in version?')) return;
    const r = await api('/api/cms/content', { method: 'DELETE', json: { type, key: entryKey } });
    if (r.error) return onError(r.error);
    onSaved(isNew ? 'Deleted.' : 'Reverted to the built-in version.');
    window.location.reload();
  };
  const optionsView = useMemo(() => d?.base?.options ?? [], [d]);

  if (!d) return <p className="text-sm text-[#6b7a75]">Loading…</p>;
  return (
    <div className="space-y-6">
      <Card title={isNew ? 'New item' : 'Edit'} actions={<div className="flex gap-2">{d.override ? <button type="button" className={btn.danger + ' !py-1 text-xs'} onClick={revert}>{isNew ? 'Delete' : 'Revert to built-in'}</button> : null}<button type="button" className={btn.primary + ' !py-1.5'} onClick={save}>Save</button></div>}>
        <div className="space-y-4">
          {isNew ? <p className="text-xs text-[#6b7a75]">Address: <code>{entryKey}</code> (fixed once created).</p> : null}
          {def.fields.map((f) => <FieldInput key={f.key} field={f} value={vals[f.key]} onChange={(v) => setVals((x) => ({ ...x, [f.key]: v }))} />)}
          {def.canHide ? (
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={hidden} onChange={(e) => setHidden(e.target.checked)} /> Hide from the website</label>
          ) : null}
        </div>
      </Card>

      {type === 'product' && !isNew ? (
        <Card title="Treatments on this page">
          <p className="mb-3 text-xs text-[#6b7a75]">Prices come from the price list. You can rename a treatment, change its description or hide it.</p>
          <div className="space-y-4">
            {optionsView.map((o) => {
              const k = optKey(o); const cur = opts[k] ?? {};
              return (
                <fieldset key={k} className="space-y-2 rounded-lg border border-[#e0e8e5] bg-[#f9fbfa] p-3">
                  <legend className="px-1 text-xs font-semibold text-[#51635d]">{o.groupId} · {o.item} ({o.catalogId})</legend>
                  <input aria-label={`Label for ${o.item}`} className={input} value={cur.label ?? o.label} onChange={(e) => setOpts({ ...opts, [k]: { ...cur, label: e.target.value } })} />
                  <textarea aria-label={`Description for ${o.item}`} rows={3} className={input} value={cur.description ?? o.description} onChange={(e) => setOpts({ ...opts, [k]: { ...cur, description: e.target.value } })} />
                  <label className="flex items-center gap-2 text-xs"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={Boolean(cur.hidden)} onChange={(e) => setOpts({ ...opts, [k]: { ...cur, hidden: e.target.checked } })} /> Hide this treatment</label>
                </fieldset>
              );
            })}
          </div>
        </Card>
      ) : null}

      {type === 'product' && isNew ? (
        <Card title="Treatments (price-list rows)">
          <div className="space-y-4">
            {newServices.map((s, i) => (
              <fieldset key={i} className="space-y-2 rounded-lg border border-[#e0e8e5] bg-[#f9fbfa] p-3">
                <legend className="px-1 text-xs font-semibold text-[#51635d]">Treatment {i + 1}</legend>
                <select aria-label="Price-list row" className={input} value={s.item ? optKey(s) : ''} onChange={(e) => { const c = choices.find((x) => optKey(x) === e.target.value); setNewServices(newServices.map((x, k) => (k === i ? { ...x, ...(c ? { catalogId: c.catalogId, groupId: c.groupId, item: c.item } : {}), serviceId: x.serviceId || 'couture-care' } : x))); }}>
                  <option value="">Choose the price-list row…</option>
                  {choices.map((c) => <option key={optKey(c)} value={optKey(c)}>{c.label}</option>)}
                </select>
                <input aria-label="Treatment name" className={input} placeholder="Name, e.g. Dry Clean & Press" value={s.label ?? ''} onChange={(e) => setNewServices(newServices.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} />
                <textarea aria-label="Treatment description" rows={2} className={input} placeholder="What the customer gets" value={s.description ?? ''} onChange={(e) => setNewServices(newServices.map((x, k) => (k === i ? { ...x, description: e.target.value } : x)))} />
                <button type="button" className={btn.danger + ' !py-1 text-xs'} onClick={() => setNewServices(newServices.filter((_, k) => k !== i))}>Remove</button>
              </fieldset>
            ))}
            <button type="button" className={btn.ghost} onClick={() => setNewServices([...newServices, { serviceId: 'couture-care', catalogId: '', groupId: '', item: '', label: '', description: '' }])}>+ Add treatment</button>
          </div>
        </Card>
      ) : null}
      {!isNew && d.builtIn ? <p className="text-xs text-[#6b7a75]">Public address: <a className="font-semibold text-[#0A5C4B] hover:underline" target="_blank" rel="noreferrer" href={type === 'service' ? `/services/${entryKey}/` : type === 'product' ? `/products/${entryKey}/` : type === 'area' ? `/areas-we-serve/${entryKey}/` : '/'}>open ↗</a></p> : null}
    </div>
  );
}
