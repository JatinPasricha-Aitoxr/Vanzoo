'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, btn, input } from './ui';

export type MediaItem = { id: number; filename: string; path: string; url: string; width: number | null; height: number | null; alt: string | null; size_bytes?: number };

/** Modal media library: browse, upload, and pick an image. Also used as the full Media page body. */
export function MediaLibrary({ onPick, compact }: { onPick?: (m: MediaItem) => void; compact?: boolean }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await api<{ items: MediaItem[] }>('/api/cms/media');
    if (r.error) setMsg(r.error);
    else setItems(r.items);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg('');
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', f);
      const res = await fetch('/api/cms/media', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMsg(data.error ?? 'Upload failed.');
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
    load();
  }

  async function saveAlt(m: MediaItem, alt: string) {
    await api(`/api/cms/media/${m.id}`, { method: 'PATCH', json: { alt } });
    setItems((list) => list.map((x) => (x.id === m.id ? { ...x, alt } : x)));
  }

  async function remove(m: MediaItem) {
    if (!confirm(`Delete “${m.filename}”? Pages that use it will show a broken image.`)) return;
    await api(`/api/cms/media/${m.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className={btn.primary + ' cursor-pointer'}>
          {busy ? 'Uploading…' : 'Upload images'}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple className="sr-only" onChange={(e) => upload(e.target.files)} disabled={busy} />
        </label>
        <span className="text-xs text-[#6b7a75]">JPG, PNG, WebP, GIF or AVIF · up to 8 MB each</span>
        {msg ? <span role="alert" className="text-sm font-medium text-red-700">{msg}</span> : null}
      </div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#cfd8d4] p-8 text-center text-sm text-[#6b7a75]">No uploads yet. Your own photos appear here.</p>
      ) : (
        <ul className={compact ? 'grid grid-cols-3 gap-3' : 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}>
          {items.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-lg border border-[#e0e8e5] bg-white">
              <button type="button" onClick={() => onPick?.(m)} disabled={!onPick} className="block w-full disabled:cursor-default" aria-label={onPick ? `Use ${m.filename}` : m.filename}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt || ''} className="aspect-[4/3] w-full bg-[#eef3f1] object-cover" loading="lazy" />
              </button>
              <div className="space-y-1.5 p-2.5">
                <p className="truncate text-xs font-medium" title={m.filename}>{m.filename}</p>
                <p className="text-[11px] text-[#6b7a75]">{m.width && m.height ? `${m.width}×${m.height}` : ''}</p>
                {!compact ? (
                  <>
                    <input className={input + ' !py-1 text-xs'} defaultValue={m.alt ?? ''} placeholder="Alt text" aria-label={`Alt text for ${m.filename}`} onBlur={(e) => e.target.value !== (m.alt ?? '') && saveAlt(m, e.target.value)} />
                    <button type="button" onClick={() => remove(m)} className="text-xs font-medium text-red-700 hover:underline">Delete</button>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Photos that ship with the website (public/images), for reuse in the builder. */
function SitePhotos({ onPick }: { onPick: (m: MediaItem) => void }) {
  const [items, setItems] = useState<string[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    api<{ items: string[] }>('/api/cms/site-images').then((r) => r.items && setItems(r.items));
  }, []);
  const shown = items.filter((p) => p.toLowerCase().includes(q.toLowerCase())).slice(0, 120);
  return (
    <div>
      <input className={input + ' mb-3'} placeholder="Search site photos…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search site photos" />
      <ul className="grid grid-cols-3 gap-3">
        {shown.map((p) => (
          <li key={p}>
            <button type="button" className="block w-full overflow-hidden rounded-lg border border-[#e0e8e5] text-left" onClick={() => onPick({ id: 0, filename: p.split('/').pop() ?? p, path: p, url: p, width: null, height: null, alt: '' })}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <span className="block truncate px-2 py-1 text-[11px] text-[#6b7a75]">{p.replace('/images/', '')}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MediaPickerModal({ onPick, onClose }: { onPick: (m: MediaItem) => void; onClose: () => void }) {
  const [tab, setTab] = useState<'uploads' | 'site'>('uploads');
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Media library" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Media library</h2>
          <button type="button" className={btn.ghost} onClick={onClose}>Close</button>
        </div>
        <div className="mb-4 flex gap-2" role="tablist">
          {(['uploads', 'site'] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={tab === t ? btn.primary : btn.ghost}>
              {t === 'uploads' ? 'My uploads' : 'Site photos'}
            </button>
          ))}
        </div>
        {tab === 'uploads' ? (
          <MediaLibrary compact onPick={(m) => { onPick(m); onClose(); }} />
        ) : (
          <SitePhotos onPick={(m) => { onPick(m); onClose(); }} />
        )}
      </div>
    </div>
  );
}
