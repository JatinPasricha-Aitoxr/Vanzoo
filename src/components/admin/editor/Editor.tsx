'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Block, Device, Doc, PageSeo } from '@/cms/schema';
import { canPlace, cloneWithNewIds, findBlock, findParent, flatten, insertBlock, mapBlock, moveBlock, newBlock, removeBlock, type Position } from '@/cms/tree';
import { WIDGETS, WIDGET_MAP } from '@/cms/widgetDefs';
import { api, btn, input } from '../ui';
import { Inspector } from './Inspector';
import { PageSettings } from './PageSettings';

type PageInfo = { id: number; slug: string; title: string; status: 'draft' | 'published'; seo: PageSeo };
type Rev = { id: number; kind: 'draft' | 'published'; note: string | null; created_by: string | null; created_at: string };

const DEVICE_WIDTH: Record<Device, string> = { desktop: '100%', tablet: '820px', mobile: '390px' };

export function Editor({ page: initialPage, initialDoc, revisions: initialRevs }: { page: PageInfo; initialDoc: Doc; revisions: Rev[] }) {
  const [page, setPage] = useState(initialPage);
  const [title, setTitle] = useState(initialPage.title);
  const [slug, setSlug] = useState(initialPage.slug);
  const [seo, setSeo] = useState<PageSeo>(initialPage.seo ?? {});
  const [doc, setDoc] = useState<Doc>(initialDoc);
  const [revisions, setRevisions] = useState(initialRevs);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>('desktop');
  const [leftTab, setLeftTab] = useState<'elements' | 'navigator' | 'page'>('elements');
  const [search, setSearch] = useState('');
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ tone: 'ok' | 'err' | 'info'; text: string } | null>(null);
  const [busy, setBusy] = useState<'save' | 'publish' | null>(null);
  const [pages, setPages] = useState<{ id: number; title: string; slug: string }[]>([]);

  const frame = useRef<HTMLIFrameElement>(null);
  const ready = useRef(false);
  const past = useRef<Doc[]>([]);
  const future = useRef<Doc[]>([]);
  const lastEdit = useRef<{ key: string; at: number }>({ key: '', at: 0 });
  const docRef = useRef(doc);
  docRef.current = doc;
  const selRef = useRef(selectedId);
  selRef.current = selectedId;

  const selected = selectedId ? findBlock(doc.blocks, selectedId) : null;

  /** Applies an edit and records it for undo. Rapid edits with the same key (typing) merge into one step. */
  const commit = useCallback((next: Doc, key = '') => {
    const now = Date.now();
    if (!(key && lastEdit.current.key === key && now - lastEdit.current.at < 900)) {
      past.current.push(docRef.current);
      if (past.current.length > 100) past.current.shift();
    }
    lastEdit.current = { key, at: now };
    future.current = [];
    setDoc(next);
    setDirty(true);
  }, []);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(docRef.current);
    lastEdit.current = { key: '', at: 0 };
    setDoc(prev);
    setDirty(true);
  }, []);
  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(docRef.current);
    setDoc(next);
    setDirty(true);
  }, []);

  // ---- Canvas bridge
  const push = useCallback(() => {
    if (ready.current) frame.current?.contentWindow?.postMessage({ type: 'state', doc: docRef.current, selectedId: selRef.current }, window.location.origin);
  }, []);
  useEffect(push, [doc, selectedId, push]);

  const insertAt = useCallback(
    (type: string, targetId: string | null, position: Position) => {
      const b = newBlock(type);
      if (!canPlace(docRef.current, b, targetId, position)) {
        setStatus({ tone: 'err', text: 'A widget cannot be placed there.' });
        return;
      }
      commit(insertBlock(docRef.current, b, targetId, position));
      setSelectedId(b.id);
    },
    [commit],
  );

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data;
      if (m?.type === 'ready') {
        ready.current = true;
        push();
      } else if (m?.type === 'key') {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: m.key, ctrlKey: m.ctrlKey, metaKey: m.metaKey, shiftKey: m.shiftKey, bubbles: true }));
      } else if (m?.type === 'select') {
        setSelectedId(m.id);
      } else if (m?.type === 'drop') {
        if (m.kind === 'widget' && WIDGET_MAP[m.widget]) insertAt(m.widget, m.targetId, m.position);
        else if (m.kind === 'block') {
          const moved = moveBlock(docRef.current, m.blockId, m.targetId, m.position);
          if (moved !== docRef.current) {
            commit(moved);
            setSelectedId(m.blockId);
          }
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [commit, insertAt, push]);

  useEffect(() => {
    api<{ pages: { id: number; title: string; slug: string }[] }>('/api/cms/pages').then((r) => r.pages && setPages(r.pages));
  }, []);

  // ---- Actions
  const updateBlock = (b: Block) => commit({ ...doc, blocks: mapBlock(doc.blocks, b.id, () => b) }, `edit:${b.id}`);
  const deleteSelected = useCallback(() => {
    const id = selRef.current;
    if (!id) return;
    commit({ ...docRef.current, blocks: removeBlock(docRef.current.blocks, id) });
    setSelectedId(null);
    setStatus({ tone: 'info', text: 'Deleted. Press Ctrl/⌘+Z to undo.' });
  }, [commit]);
  const duplicateSelected = useCallback(() => {
    const id = selRef.current;
    const b = id ? findBlock(docRef.current.blocks, id) : null;
    if (!b) return;
    const copy = cloneWithNewIds(b);
    commit(insertBlock(docRef.current, copy, b.id, 'after'));
    setSelectedId(copy.id);
  }, [commit]);
  const copySelected = useCallback(() => {
    const id = selRef.current;
    const b = id ? findBlock(docRef.current.blocks, id) : null;
    if (b) {
      try {
        sessionStorage.setItem('vz-clip', JSON.stringify(b));
        setStatus({ tone: 'info', text: 'Copied.' });
      } catch {
        /* ignore */
      }
    }
  }, []);
  const paste = useCallback(() => {
    try {
      const raw = sessionStorage.getItem('vz-clip');
      if (!raw) return;
      const copy = cloneWithNewIds(JSON.parse(raw) as Block);
      const target = selRef.current;
      const sel = target ? findBlock(docRef.current.blocks, target) : null;
      const inside = sel && WIDGET_MAP[sel.type]?.container;
      commit(insertBlock(docRef.current, copy, target, inside ? 'inside' : 'after'));
      setSelectedId(copy.id);
    } catch {
      /* ignore */
    }
  }, [commit]);
  const nudge = (id: string, dir: -1 | 1) => {
    const loc = findParent(doc.blocks, id);
    if (!loc) return;
    const siblings = loc.parent ? loc.parent.children! : doc.blocks;
    const j = loc.index + dir;
    if (j < 0 || j >= siblings.length) return;
    commit(moveBlock(doc, id, siblings[j].id, dir < 0 ? 'before' : 'after'));
  };
  const toggleHidden = (b: Block) => updateBlock({ ...b, hidden: { desktop: !(b.hidden?.desktop && b.hidden?.tablet && b.hidden?.mobile), tablet: !(b.hidden?.desktop && b.hidden?.tablet && b.hidden?.mobile), mobile: !(b.hidden?.desktop && b.hidden?.tablet && b.hidden?.mobile) } });

  const save = useCallback(
    async (quiet = false): Promise<boolean> => {
      setBusy('save');
      const r = await api<{ page: PageInfo }>(`/api/cms/pages/${page.id}`, { method: 'PUT', json: { doc: docRef.current, seo, title, slug } });
      setBusy(null);
      if (r.error) {
        setStatus({ tone: 'err', text: r.error });
        return false;
      }
      setPage(r.page);
      setDirty(false);
      if (!quiet) setStatus({ tone: 'ok', text: 'Draft saved.' });
      const rr = await api<{ revisions: Rev[] }>(`/api/cms/pages/${page.id}`);
      if (rr.revisions) setRevisions(rr.revisions);
      return true;
    },
    [page.id, seo, title, slug],
  );

  const publish = async () => {
    const live = page.slug === '/' ? 'the live homepage' : `https://vanzoo.in${page.slug}`;
    if (!confirm(`Publish these changes to ${live}? Visitors will see them straight away.`)) return;
    if (dirty && !(await save(true))) return;
    setBusy('publish');
    const r = await api<{ page: PageInfo }>(`/api/cms/pages/${page.id}/publish`, { method: 'POST' });
    setBusy(null);
    if (r.error) return setStatus({ tone: 'err', text: r.error });
    setPage(r.page);
    setStatus({ tone: 'ok', text: 'Published. The live page is updated.' });
  };

  const unpublish = async () => {
    if (!confirm('Take this page offline? It will return a 404 (the home page falls back to the built-in layout).')) return;
    const r = await api<{ page: PageInfo }>(`/api/cms/pages/${page.id}/unpublish`, { method: 'POST' });
    if (r.error) return setStatus({ tone: 'err', text: r.error });
    setPage(r.page);
    setStatus({ tone: 'ok', text: 'Unpublished.' });
  };

  const preview = async () => {
    if (dirty && !(await save(true))) return;
    window.open(`/preview/${page.id}`, '_blank', 'noopener');
  };

  const restore = async (revId: number) => {
    if (!confirm('Load this earlier version into the editor? Your current edits stay in undo history; nothing goes live until you publish.')) return;
    const r = await api<{ doc: Doc }>(`/api/cms/pages/${page.id}/revisions/${revId}`);
    if (r.error) return setStatus({ tone: 'err', text: r.error });
    commit(r.doc);
    setSelectedId(null);
  };

  // ---- Keyboard shortcuts & unsaved-changes guard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const typing = (e.target as HTMLElement)?.matches?.('input, textarea, select, [contenteditable]');
      if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
      else if (!typing && mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (!typing && mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
      else if (!typing && mod && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicateSelected(); }
      else if (!typing && mod && e.key.toLowerCase() === 'c') copySelected();
      else if (!typing && mod && e.key.toLowerCase() === 'v') paste();
      else if (!typing && (e.key === 'Delete' || e.key === 'Backspace') && selRef.current) { e.preventDefault(); deleteSelected(); }
    };
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [save, undo, redo, duplicateSelected, copySelected, paste, deleteSelected, dirty]);

  // ---- Saved sections & page templates (copies stored in the database) ----
  type Saved = { id: number; kind: 'section' | 'page'; name: string; doc: Doc };
  const [saved, setSaved] = useState<Saved[]>([]);
  const loadSaved = useCallback(() => { api<{ items: Saved[] }>('/api/cms/saved').then((r) => r.items && setSaved(r.items)); }, []);
  useEffect(() => { loadSaved(); }, [loadSaved]);
  const saveSection = () => {
    const b = selectedId ? findBlock(docRef.current.blocks, selectedId) : null;
    if (!b) return;
    const name = prompt('Name this section (e.g. “Winter offer banner”):', WIDGET_MAP[b.type]?.label ?? '');
    if (!name) return;
    api('/api/cms/saved', { method: 'POST', json: { kind: 'section', name, blocks: [b] } }).then((r) => { setStatus(r.error ? { tone: 'err', text: r.error } : { tone: 'ok', text: `Saved “${name}” to your sections.` }); loadSaved(); });
  };
  const savePageTemplate = () => {
    if (!docRef.current.blocks.length) return setStatus({ tone: 'err', text: 'The page is empty — nothing to save.' });
    const name = prompt('Name this page template:', page.title);
    if (!name) return;
    api('/api/cms/saved', { method: 'POST', json: { kind: 'page', name, blocks: docRef.current.blocks } }).then((r) => { setStatus(r.error ? { tone: 'err', text: r.error } : { tone: 'ok', text: `Saved the template “${name}”.` }); loadSaved(); });
  };
  const insertSaved = (s: Saved) => {
    if (s.kind === 'page') {
      if (docRef.current.blocks.length && !confirm(`Replace everything on this page with the “${s.name}” template? You can undo with Ctrl/⌘+Z.`)) return;
      commit({ ...docRef.current, blocks: s.doc.blocks.map(cloneWithNewIds) });
      setSelectedId(null);
      return;
    }
    const sel = selectedId ? findBlock(docRef.current.blocks, selectedId) : null;
    const inside = sel && WIDGET_MAP[sel.type]?.container;
    let d = docRef.current;
    let last: Block | null = null;
    for (const b of s.doc.blocks) {
      const copy = cloneWithNewIds(b);
      if (!canPlace(d, copy, sel ? sel.id : null, inside ? 'inside' : 'after')) return setStatus({ tone: 'err', text: 'That section cannot be placed there.' });
      d = insertBlock(d, copy, last ? last.id : sel ? sel.id : null, last ? 'after' : inside ? 'inside' : 'after');
      last = copy;
    }
    commit(d);
    if (last) setSelectedId(last.id);
  };
  const deleteSaved = (s: Saved) => { if (confirm(`Delete “${s.name}”? Pages already using it are not affected.`)) api('/api/cms/saved', { method: 'DELETE', json: { id: s.id } }).then(loadSaved); };

  const widgets = useMemo(() => WIDGETS.filter((w) => `${w.label} ${w.description} ${w.category}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const addClick = (type: string) => {
    const sel = selectedId ? findBlock(doc.blocks, selectedId) : null;
    if (sel && WIDGET_MAP[sel.type]?.container) insertAt(type, sel.id, 'inside');
    else insertAt(type, sel ? sel.id : null, 'after');
  };

  return (
    <div className="flex h-screen flex-col bg-[#e9eeec]">
      {/* Toolbar */}
      <header className="flex flex-wrap items-center gap-2 border-b border-[#d6dedb] bg-white px-3 py-2">
        <a href="/admin" className={btn.ghost} onClick={(e) => dirty && !confirm('You have unsaved changes. Leave anyway?') && e.preventDefault()}>← Dashboard</a>
        <select aria-label="Switch page" className={input + ' !w-48'} value={page.id} onChange={(e) => (!dirty || confirm('Discard unsaved changes?')) && (window.location.href = `/admin/editor/${e.target.value}`)}>
          {(pages.some((p) => p.id === page.id) ? pages : [page, ...pages]).map((p) => <option key={p.id} value={p.id}>{p.title} ({p.slug})</option>)}
        </select>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${page.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
          {page.status === 'published' ? 'Published' : page.slug === '/' ? 'Using built-in layout' : 'Draft'}
        </span>
        {dirty ? <span className="text-xs font-medium text-amber-700">● Unsaved changes</span> : null}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-[#cfd8d4]" role="group" aria-label="Preview size">
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDevice(d)} aria-pressed={device === d} className={`px-3 py-1.5 text-sm capitalize ${device === d ? 'bg-[#0A5C4B] text-white' : 'bg-white hover:bg-[#eef3f1]'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className={btn.ghost} onClick={undo} disabled={past.current.length === 0} aria-label="Undo" title="Undo (Ctrl/⌘+Z)">↶</button>
          <button type="button" className={btn.ghost} onClick={redo} disabled={future.current.length === 0} aria-label="Redo" title="Redo (Ctrl/⌘+Shift+Z)">↷</button>
          <button type="button" className={btn.ghost} onClick={() => save()} disabled={busy !== null || !dirty}>{busy === 'save' ? 'Saving…' : 'Save draft'}</button>
          <button type="button" className={btn.ghost} onClick={preview}>Preview</button>
          {page.status === 'published' ? <button type="button" className={btn.ghost} onClick={unpublish}>Unpublish</button> : null}
          <button type="button" className={btn.gold} onClick={publish} disabled={busy !== null}>{busy === 'publish' ? 'Publishing…' : page.status === 'published' ? 'Update' : 'Publish'}</button>
        </div>
      </header>
      {status ? (
        <div role="status" className={`px-4 py-1.5 text-sm font-medium ${status.tone === 'err' ? 'bg-red-50 text-red-800' : status.tone === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-700'}`}>
          {status.text}
          <button type="button" className="ml-3 underline" onClick={() => setStatus(null)}>Dismiss</button>
          {status.tone === 'ok' && page.status === 'published' ? <a className="ml-3 underline" href={page.slug} target="_blank" rel="noreferrer">View live</a> : null}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        {/* Left panel */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-[#d6dedb] bg-white">
          <div className="flex border-b border-[#e0e8e5]" role="tablist">
            {(['elements', 'navigator', 'page'] as const).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={leftTab === t} onClick={() => setLeftTab(t)} className={`flex-1 px-2 py-2.5 text-sm font-medium capitalize ${leftTab === t ? 'border-b-2 border-[#0A5C4B] text-[#0A5C4B]' : 'text-[#6b7a75]'}`}>{t === 'page' ? 'Page & SEO' : t}</button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {leftTab === 'elements' ? (
              <div className="p-3">
                <input className={input} placeholder="Search widgets…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search widgets" />
                <p className="mt-2 text-xs text-[#6b7a75]">Drag onto the page, or click to add after the selected item.</p>
                <div className="mt-4">
                  <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[#51635d]">My sections &amp; templates</h3>
                  {saved.length === 0 ? <p className="text-xs text-[#6b7a75]">Select a section on the page and choose “Save as section” to reuse it anywhere.</p> : (
                    <ul className="space-y-1.5">
                      {saved.map((s) => (
                        <li key={s.id} className="flex items-center gap-1">
                          <button type="button" onClick={() => insertSaved(s)} title={s.kind === 'page' ? 'Replace this page with the template' : 'Insert a copy of this section'} className="flex-1 truncate rounded-lg border border-[#d6dedb] bg-white px-2 py-2 text-left text-xs font-medium hover:border-[#0A5C4B] hover:bg-[#eef6f3]">
                            <span className="mr-1.5 rounded bg-[#e6efec] px-1 py-0.5 text-[10px] font-bold uppercase text-[#0A5C4B]">{s.kind === 'page' ? 'Page' : 'Section'}</span>{s.name}
                          </button>
                          <button type="button" aria-label={`Delete ${s.name}`} onClick={() => deleteSaved(s)} className="rounded px-1.5 py-1 text-xs text-red-700 hover:bg-red-50">✕</button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button type="button" className={btn.ghost + ' mt-2 w-full !py-1.5 text-xs'} onClick={savePageTemplate}>Save this page as a template</button>
                </div>
                {(['Basic', 'Layout', 'Marketing', 'Vanzoo'] as const).map((cat) => {
                  const list = widgets.filter((w) => w.category === cat);
                  return list.length ? (
                    <div key={cat} className="mt-4">
                      <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[#51635d]">{cat === 'Vanzoo' ? 'Vanzoo sections' : cat}</h3>
                      <ul className="grid grid-cols-2 gap-2">
                        {list.map((w) => (
                          <li key={w.type}>
                            <button type="button" draggable onDragStart={(e) => { e.dataTransfer.setData('application/x-vz-widget', w.type); e.dataTransfer.effectAllowed = 'copy'; }} onClick={() => addClick(w.type)} title={w.description} className="w-full rounded-lg border border-[#d6dedb] bg-white px-2 py-2.5 text-left text-xs font-medium hover:border-[#0A5C4B] hover:bg-[#eef6f3]">
                              {w.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })}
              </div>
            ) : null}
            {leftTab === 'navigator' ? (
              <Navigator doc={doc} selectedId={selectedId} onSelect={setSelectedId} onDrop={(blockId, target, pos) => { const m = moveBlock(doc, blockId, target, pos); if (m !== doc) commit(m); }} onNudge={nudge} onHide={toggleHidden} />
            ) : null}
            {leftTab === 'page' ? (
              <PageSettings title={title} slug={slug} isHome={page.slug === '/'} published={page.status === 'published'} seo={seo} doc={doc} revisions={revisions} onTitle={(v) => { setTitle(v); setDirty(true); }} onSlug={(v) => { setSlug(v); setDirty(true); }} onSeo={(s) => { setSeo(s); setDirty(true); }} onRestore={restore} />
            ) : null}
          </div>
        </aside>

        {/* Canvas */}
        <main className="min-w-0 flex-1 overflow-auto p-4" aria-label="Page canvas">
          <div className="mx-auto h-full rounded-lg bg-white shadow-lg transition-[width] duration-200" style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }}>
            <iframe ref={frame} src="/admin/canvas" title="Page canvas" className="h-full w-full rounded-lg border-0" onLoad={() => { /* ready is signalled by the canvas */ }} />
          </div>
        </main>

        {/* Right panel */}
        <aside className="w-80 shrink-0 border-l border-[#d6dedb] bg-white" aria-label="Properties">
          {selected ? (
            <Inspector key={selected.id} block={selected} device={device} onChange={updateBlock} onDelete={deleteSelected} onDuplicate={duplicateSelected} onSaveSection={saveSection} />
          ) : (
            <div className="p-5 text-sm text-[#51635d]">
              <h2 className="mb-2 text-base font-semibold text-neutral-ink">Nothing selected</h2>
              <p>Click any section on the page to edit its text, images, spacing, colours and mobile layout.</p>
              <ul className="mt-4 list-inside list-disc space-y-1 text-xs text-[#6b7a75]">
                <li>Ctrl/⌘+S saves the draft</li>
                <li>Ctrl/⌘+Z undoes, Shift+Z redoes</li>
                <li>Ctrl/⌘+D duplicates, Delete removes</li>
                <li>Ctrl/⌘+C / V copies and pastes</li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Navigator({ doc, selectedId, onSelect, onDrop, onNudge, onHide }: { doc: Doc; selectedId: string | null; onSelect: (id: string) => void; onDrop: (blockId: string, target: string, pos: Position) => void; onNudge: (id: string, dir: -1 | 1) => void; onHide: (b: Block) => void }) {
  const [over, setOver] = useState<{ id: string; pos: Position } | null>(null);
  const rows = flatten(doc.blocks);
  const posFor = (e: React.DragEvent, container: boolean): Position => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = (e.clientY - r.top) / r.height;
    return container && y > 0.3 && y < 0.7 ? 'inside' : y < 0.5 ? 'before' : 'after';
  };
  if (rows.length === 0) return <p className="p-4 text-sm text-[#6b7a75]">The page is empty.</p>;
  return (
    <ul className="p-2 text-sm" aria-label="Page structure">
      {rows.map(({ block, depth }) => {
        const def = WIDGET_MAP[block.type];
        const active = selectedId === block.id;
        const allHidden = block.hidden?.desktop && block.hidden?.tablet && block.hidden?.mobile;
        return (
          <li key={block.id}>
            <div
              draggable
              onDragStart={(e) => { e.dataTransfer.setData('application/x-vz-block', block.id); e.dataTransfer.effectAllowed = 'move'; }}
              onDragOver={(e) => { if (e.dataTransfer.types.includes('application/x-vz-block')) { e.preventDefault(); setOver({ id: block.id, pos: posFor(e, Boolean(def?.container)) }); } }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('application/x-vz-block'); const pos = posFor(e, Boolean(def?.container)); setOver(null); if (id) onDrop(id, block.id, pos); }}
              style={{ paddingLeft: 8 + depth * 14, boxShadow: over?.id === block.id ? (over.pos === 'before' ? '0 -2px 0 #FFB107' : over.pos === 'after' ? '0 2px 0 #FFB107' : 'inset 0 0 0 2px #FFB107') : undefined }}
              className={`group flex items-center gap-1 rounded-md py-1 pr-1 ${active ? 'bg-[#e3f1ec]' : 'hover:bg-[#f2f6f4]'}`}
            >
              <button type="button" className={`min-w-0 flex-1 truncate text-left ${allHidden ? 'text-[#9aa8a3] line-through' : ''}`} onClick={() => onSelect(block.id)} aria-current={active ? 'true' : undefined}>
                {def?.label ?? block.type}
                {(block.props as { text?: string; title?: string }).text || (block.props as { title?: string }).title ? <span className="ml-1.5 text-xs text-[#6b7a75]">{String((block.props as { text?: string }).text ?? (block.props as { title?: string }).title).slice(0, 22)}</span> : null}
              </button>
              <span className="hidden gap-0.5 group-hover:flex group-focus-within:flex">
                <button type="button" className="rounded px-1 text-xs hover:bg-white" onClick={() => onNudge(block.id, -1)} aria-label={`Move ${def?.label} up`}>↑</button>
                <button type="button" className="rounded px-1 text-xs hover:bg-white" onClick={() => onNudge(block.id, 1)} aria-label={`Move ${def?.label} down`}>↓</button>
                <button type="button" className="rounded px-1 text-xs hover:bg-white" onClick={() => onHide(block)} aria-label={allHidden ? 'Show' : 'Hide'}>{allHidden ? '◌' : '◉'}</button>
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
