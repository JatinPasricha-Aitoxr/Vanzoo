'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, btn, Card, Badge } from './ui';

type Token = { key: string; label: string; group: string; def: string };

const lum = (h: string) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/** Pairs the site actually renders as text-on-background; each must reach WCAG AA (4.5:1). */
const PAIRS: [string, string, string][] = [
  ['ink', 'surface', 'Headings on page background'],
  ['body', 'surface', 'Body text on page background'],
  ['surface', 'brand', 'White text on brand buttons'],
  ['gold-soft', 'brand-dark', 'Gold text on dark bands'],
  ['gold-ink', 'surface', 'Gold text on light'],
  ['surface', 'brand-hover', 'White text on button hover'],
];

export function DesignTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [v, setV] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => { api<{ tokens: Token[]; overrides: Record<string, string> }>('/api/cms/design').then((r) => { if (r.tokens) { setTokens(r.tokens); setV(Object.fromEntries(r.tokens.map((t) => [t.key, r.overrides[t.key] ?? t.def]))); } }); }, []);
  const checks = useMemo(() => PAIRS.map(([a, b, label]) => ({ label, r: v[a] && v[b] ? ratio(v[a], v[b]) : 0 })), [v]);
  if (!tokens.length) return <p className="text-sm text-[#6b7a75]">Loading…</p>;
  const groups = [...new Set(tokens.map((t) => t.group))];
  const save = async (reset = false) => {
    const body = reset ? {} : Object.fromEntries(tokens.filter((t) => v[t.key].toUpperCase() !== t.def).map((t) => [t.key, v[t.key]]));
    const r = await api('/api/cms/design', { method: 'PUT', json: body });
    if (reset) setV(Object.fromEntries(tokens.map((t) => [t.key, t.def])));
    setMsg(r.error ? { ok: false, text: r.error } : { ok: true, text: reset ? 'Reset to the Vanzoo defaults.' : 'Saved. Pages pick it up within a minute.' });
  };
  const style = Object.fromEntries(tokens.map((t) => [`--p-${t.key}`, v[t.key]])) as React.CSSProperties;
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Design tokens</h1><p className="text-sm text-[#6b7a75]">Site-wide colours. Every button, band and text style that uses the brand palette follows these. Fonts and breakpoints are fixed in code (breakpoints match the editor’s tablet ≤1023px and mobile ≤639px).</p></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {groups.map((g) => (
            <Card key={g} title={g}>
              <div className="grid gap-3 sm:grid-cols-2">
                {tokens.filter((t) => t.group === g).map((t) => (
                  <label key={t.key} className="flex items-center gap-3 text-sm">
                    <input type="color" aria-label={t.label} value={v[t.key]} onChange={(e) => setV({ ...v, [t.key]: e.target.value.toUpperCase() })} className="h-9 w-12 cursor-pointer rounded border border-[#cfd8d4] bg-white p-0.5" />
                    <span className="flex-1">{t.label}<br /><span className="font-mono text-xs text-[#6b7a75]">{v[t.key]}{v[t.key].toUpperCase() !== t.def ? ' · changed' : ''}</span></span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card title="Preview">
            <div style={{ ...style, background: 'var(--p-surface)', borderColor: 'var(--p-line)' }} className="rounded-lg border p-4">
              <p style={{ color: 'var(--p-ink)' }} className="font-display text-lg font-semibold">Premium dry cleaning</p>
              <p style={{ color: 'var(--p-body)' }} className="mt-1 text-sm">Hydrocarbon care for the garments you love.</p>
              <span style={{ background: 'var(--p-brand)', color: 'var(--p-surface)' }} className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold">Book Pickup</span>
              <div style={{ background: 'var(--p-brand-dark)' }} className="mt-4 rounded-lg p-3"><p style={{ color: 'var(--p-gold-soft)' }} className="text-sm font-semibold">Hydrocarbon technology</p><div style={{ background: 'var(--p-gold)' }} className="mt-2 h-0.5 w-10" /></div>
            </div>
          </Card>
          <Card title="Contrast (WCAG AA = 4.5)">
            <ul className="space-y-2 text-sm">{checks.map((c) => (<li key={c.label} className="flex items-center justify-between gap-2"><span>{c.label}</span><Badge tone={c.r >= 4.5 ? 'green' : 'red'}>{c.r.toFixed(1)}:1</Badge></li>))}</ul>
          </Card>
          <div className="flex flex-wrap items-center gap-2"><button type="button" className={btn.primary} onClick={() => save()}>Save tokens</button><button type="button" className={btn.ghost} onClick={() => confirm('Reset every colour to the Vanzoo defaults?') && save(true)}>Reset to defaults</button></div>
          {msg ? <p role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}
        </div>
      </div>
    </div>
  );
}
