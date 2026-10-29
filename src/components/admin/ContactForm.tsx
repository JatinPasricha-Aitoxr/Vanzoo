'use client';

import { useEffect, useState } from 'react';
import { api, btn, Card, input } from './ui';
import { MediaPickerModal } from './MediaPicker';

type StoreF = { name: string; address: string; locality: string; postalCode: string; mapQuery: string };
type Facts = { logo?: string; mark?: string; favicon?: string; phone?: string; whatsapp?: string; email?: string; bookPickup?: string; bookService?: string; playStore?: string; appStore?: string; stores?: Record<string, Partial<StoreF>> };

const STORE_LABEL: Record<string, string> = { 'super-mart-1': 'Store 1 — DLF Phase IV', 'vanzoo-urbana': 'Store 2 — M3M Urbana' };

export function ContactForm() {
  const [d, setD] = useState<(Required<Omit<Facts, 'stores'>> & { stores: Record<string, StoreF> }) | null>(null);
  const [v, setV] = useState<Facts>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pick, setPick] = useState<'logo' | 'mark' | 'favicon' | null>(null);
  useEffect(() => { api<{ saved: Facts; defaults: NonNullable<typeof d> }>('/api/cms/facts').then((r) => { if (r.error) setMsg({ ok: false, text: r.error }); else { setD(r.defaults); setV(r.saved); } }); }, []);
  if (!d) return <p className="text-sm text-[#6b7a75]">{msg?.text ?? 'Loading…'}</p>;
  const f = (k: keyof Omit<Facts, 'stores'>, label: string, hint?: string) => (
    <div key={k}><label htmlFor={`c-${k}`} className="mb-1 block text-xs font-semibold">{label}</label><input id={`c-${k}`} className={input} value={v[k] ?? ''} placeholder={d[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />{hint ? <p className="mt-1 text-xs text-[#6b7a75]">{hint}</p> : null}</div>
  );
  const setStore = (id: string, k: keyof StoreF, val: string) => setV({ ...v, stores: { ...v.stores, [id]: { ...v.stores?.[id], [k]: val } } });
  const save = async () => {
    const r = await api('/api/cms/facts', { method: 'PUT', json: { phone: v.phone ?? '', whatsapp: v.whatsapp ?? '', email: v.email ?? '', logo: v.logo ?? '', mark: v.mark ?? '', favicon: v.favicon ?? '', bookPickup: v.bookPickup ?? '', bookService: v.bookService ?? '', playStore: v.playStore ?? '', appStore: v.appStore ?? '', stores: v.stores ?? {} } });
    setMsg(r.error ? { ok: false, text: r.error } : { ok: true, text: 'Saved. Every page — header, footer, buttons, contact page, map and structured data — shows the new details within a minute.' });
  };
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Contact &amp; locations</h1><p className="max-w-2xl text-sm text-[#6b7a75]">Change a detail once and it updates everywhere it appears. Leave a field blank to keep the built-in value (shown greyed out).</p></div>
      <Card title="Contact details">
        <div className="grid gap-4 sm:grid-cols-2">
          {f('phone', 'Phone number', 'Shown as written; the tap-to-call link uses its digits.')}
          {f('whatsapp', 'WhatsApp number (digits, with country code)', 'e.g. 919876543210 — used for wa.me links.')}
          {f('email', 'Email address')}
        </div>
      </Card>
      <Card title="Brand images">
        <div className="grid gap-5 sm:grid-cols-3">
          {([['logo', 'Wordmark (header & footer)'], ['mark', 'Icon (“V” mark, touch icon)'], ['favicon', 'Browser-tab icon']] as const).map(([k, label]) => (
            <div key={k}>
              <p className="mb-1 text-xs font-semibold">{label}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v[k] || d[k]} alt="" className="mb-2 h-16 w-full rounded-lg border border-[#e0e8e5] bg-[#f6f9f8] object-contain p-2" />
              <div className="flex gap-2"><button type="button" className={btn.ghost + ' !py-1 text-xs'} onClick={() => setPick(k)}>Choose…</button>{v[k] ? <button type="button" className={btn.ghost + ' !py-1 text-xs'} onClick={() => setV({ ...v, [k]: '' })}>Use built-in</button> : null}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#6b7a75]">PNG, JPG or WebP from the media library. The wordmark is also published as the business logo in structured data. Browsers cache favicons, so a change can take a while to show.</p>
        {pick ? <MediaPickerModal onClose={() => setPick(null)} onPick={(m) => { setV({ ...v, [pick]: m.url }); setPick(null); }} /> : null}
      </Card>
      <Card title="Booking & app links">
        <div className="grid gap-4 sm:grid-cols-2">
          {f('bookPickup', '“Book Pickup” link')}
          {f('bookService', '“Book a service” link')}
          {f('playStore', 'Google Play link')}
          {f('appStore', 'App Store link')}
        </div>
      </Card>
      {Object.keys(d.stores).map((id) => (
        <Card key={id} title={STORE_LABEL[id] ?? id}>
          <div className="grid gap-4 sm:grid-cols-2">
            {(['name', 'locality', 'postalCode'] as const).map((k) => (
              <div key={k}><label htmlFor={`${id}-${k}`} className="mb-1 block text-xs font-semibold">{k === 'postalCode' ? 'Postal code' : k === 'name' ? 'Store name' : 'Locality'}</label><input id={`${id}-${k}`} className={input} value={v.stores?.[id]?.[k] ?? ''} placeholder={d.stores[id][k]} onChange={(e) => setStore(id, k, e.target.value)} /></div>
            ))}
            <div className="sm:col-span-2"><label htmlFor={`${id}-address`} className="mb-1 block text-xs font-semibold">Full address</label><textarea id={`${id}-address`} rows={2} className={input} value={v.stores?.[id]?.address ?? ''} placeholder={d.stores[id].address} onChange={(e) => setStore(id, 'address', e.target.value)} /></div>
            <div className="sm:col-span-2"><label htmlFor={`${id}-map`} className="mb-1 block text-xs font-semibold">Google Maps search text</label><input id={`${id}-map`} className={input} value={v.stores?.[id]?.mapQuery ?? ''} placeholder={d.stores[id].mapQuery} onChange={(e) => setStore(id, 'mapQuery', e.target.value)} /><p className="mt-1 text-xs text-[#6b7a75]">Drives the embedded map. Use the address as Google Maps would find it.</p></div>
          </div>
        </Card>
      ))}
      <div className="flex items-center gap-3"><button type="button" className={btn.primary} onClick={save}>Save details</button>{msg ? <p role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}</div>
    </div>
  );
}
