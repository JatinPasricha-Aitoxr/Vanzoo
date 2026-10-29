'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api, btn, Card, input } from './ui';
import { MediaPickerModal } from './MediaPicker';

type Post = { slug: string; title: string; excerpt: string; body: string; image: string; imageAlt: string; categories: string[]; tags: string[]; status: 'draft' | 'published'; hidden: boolean; publishedAt: string | null };
const EMPTY: Post = { slug: '', title: '', excerpt: '', body: '', image: '', imageAlt: '', categories: [], tags: [], status: 'draft', hidden: false, publishedAt: null };
const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);

export function PostEditor({ slug }: { slug: string }) {
  const router = useRouter();
  const isNew = slug === 'new';
  const [p, setP] = useState<Post>(EMPTY);
  const [meta, setMeta] = useState({ builtIn: false, saved: false });
  const [loaded, setLoaded] = useState(isNew);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [source, setSource] = useState(false);
  const [pickFor, setPickFor] = useState<'featured' | 'inline' | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const ed = useRef<HTMLDivElement>(null);
  const saved = useRef<Range | null>(null);

  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get('saved');
    if (flag) setMsg({ ok: true, text: flag === 'published' ? 'Published. It is live within a minute.' : 'Draft saved.' });
    if (isNew) return;
    api<{ post: Post; builtIn: boolean; saved: boolean }>(`/api/cms/posts?slug=${encodeURIComponent(slug)}`).then((r) => {
      if (r.error) return setMsg({ ok: false, text: r.error });
      setP(r.post); setMeta({ builtIn: r.builtIn, saved: r.saved }); setLoaded(true);
    });
  }, [slug, isNew]);
  // Seed the editable area only when it (re)appears; afterwards the DOM is the source of truth.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (loaded && ed.current && !source) ed.current.innerHTML = p.body; }, [loaded, source]);

  const set = <K extends keyof Post>(k: K, v: Post[K]) => setP((x) => ({ ...x, [k]: v }));
  const syncBody = () => { if (ed.current) set('body', ed.current.innerHTML); };
  const cmd = (c: string, v?: string) => { ed.current?.focus(); document.execCommand(c, false, v); syncBody(); };
  const remember = () => { const s = getSelection(); if (s && s.rangeCount && ed.current?.contains(s.anchorNode)) saved.current = s.getRangeAt(0).cloneRange(); };
  const restore = () => { ed.current?.focus(); const s = getSelection(); if (s && saved.current) { s.removeAllRanges(); s.addRange(saved.current); } };

  const save = async (status: 'draft' | 'published') => {
    const body = source ? p.body : ed.current?.innerHTML ?? p.body;
    const payload = { ...p, body, status, slug: p.slug || slugify(p.title), publishedAt: status === 'published' ? p.publishedAt ?? new Date().toISOString() : p.publishedAt };
    const r = await api<{ body: string }>('/api/cms/posts', { method: 'PUT', json: payload });
    if (r.error) return setMsg({ ok: false, text: r.error });
    setP({ ...payload, body: r.body }); if (ed.current) ed.current.innerHTML = r.body;
    setMsg({ ok: true, text: status === 'published' ? 'Published. It is live within a minute.' : 'Draft saved.' });
    setMeta((m) => ({ ...m, saved: true }));
    if (isNew) router.replace(`/admin/posts/${payload.slug}/?saved=${status}`);
  };
  const remove = async () => {
    if (!confirm(meta.builtIn ? 'Discard your edits and go back to the built-in version?' : 'Delete this post permanently?')) return;
    await api('/api/cms/posts', { method: 'DELETE', json: { slug: p.slug } });
    router.push('/admin/posts/');
  };

  if (!loaded) return <p className="text-sm text-[#6b7a75]">{msg?.text ?? 'Loading…'}</p>;
  const Tb = ({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" aria-label={label} title={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className="min-w-8 rounded px-2 py-1 text-sm font-semibold hover:bg-[#e6efec]">{children}</button>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><Link href="/admin/posts/" className="text-xs font-semibold text-[#0A5C4B] hover:underline">← All posts</Link><h1 className="text-2xl font-semibold">{isNew ? 'New post' : 'Edit post'}</h1>{meta.builtIn && !meta.saved ? <p className="text-xs text-[#6b7a75]">Built-in article. Saving creates an edited copy that replaces it on the site.</p> : null}</div>
        <div className="flex flex-wrap gap-2">
          {(meta.saved || !isNew) ? <button type="button" className={btn.danger} onClick={remove}>{meta.builtIn ? 'Revert to built-in' : 'Delete'}</button> : null}
          <button type="button" className={btn.ghost} onClick={() => save('draft')}>Save draft</button>
          <button type="button" className={btn.primary} onClick={() => save('published')}>{p.status === 'published' ? 'Update' : 'Publish'}</button>
        </div>
      </div>
      {msg ? <p role={msg.ok ? 'status' : 'alert'} className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <div><label htmlFor="p-t" className="mb-1 block text-xs font-semibold">Title</label><input id="p-t" className={input + ' !text-lg font-semibold'} value={p.title} onChange={(e) => { set('title', e.target.value); if (!slugTouched) set('slug', slugify(e.target.value)); }} /></div>
          <div>
            <div className="mb-1 flex items-center justify-between"><span className="text-xs font-semibold">Article</span><button type="button" className="text-xs font-semibold text-[#0A5C4B] hover:underline" onClick={() => { if (source) { setSource(false); } else { syncBody(); setSource(true); } }}>{source ? 'Visual editor' : 'HTML'}</button></div>
            {source ? <textarea aria-label="Article HTML" rows={22} className={input + ' font-mono text-xs'} value={p.body} onChange={(e) => set('body', e.target.value)} /> : (
              <div className="rounded-lg border border-[#cfd8d4] bg-white focus-within:ring-2 focus-within:ring-[#0A5C4B]/20">
                <div className="flex flex-wrap items-center gap-0.5 border-b border-[#e6efec] bg-[#f6f9f8] p-1.5" role="toolbar" aria-label="Formatting">
                  <Tb label="Heading 2" onClick={() => cmd('formatBlock', 'h2')}>H2</Tb><Tb label="Heading 3" onClick={() => cmd('formatBlock', 'h3')}>H3</Tb><Tb label="Paragraph" onClick={() => cmd('formatBlock', 'p')}>¶</Tb>
                  <Tb label="Bold" onClick={() => cmd('bold')}>B</Tb><Tb label="Italic" onClick={() => cmd('italic')}>I</Tb>
                  <Tb label="Bulleted list" onClick={() => cmd('insertUnorderedList')}>• List</Tb><Tb label="Numbered list" onClick={() => cmd('insertOrderedList')}>1. List</Tb><Tb label="Quote" onClick={() => cmd('formatBlock', 'blockquote')}>❝</Tb>
                  <Tb label="Link" onClick={() => { const u = prompt('Link address (/page/ or https://…):'); if (u) cmd('createLink', u); }}>Link</Tb><Tb label="Remove link" onClick={() => cmd('unlink')}>Unlink</Tb>
                  <Tb label="Insert image" onClick={() => { remember(); setPickFor('inline'); }}>Image</Tb><Tb label="Clear formatting" onClick={() => cmd('removeFormat')}>Clear</Tb>
                </div>
                <div ref={ed} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Article body" onInput={syncBody} onBlur={syncBody} className="prose-vanzoo min-h-[24rem] max-w-none p-4 focus:outline-none" />
              </div>
            )}
            <p className="mt-1 text-xs text-[#6b7a75]">Use H2 and H3 for sections (the title is the page’s H1). Anything unsafe — scripts, styles, embeds — is removed when you save.</p>
          </div>
          <div><label htmlFor="p-e" className="mb-1 block text-xs font-semibold">Excerpt ({p.excerpt.length}/200 shown in search)</label><textarea id="p-e" rows={3} className={input} value={p.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></div>
        </div>
        <div className="space-y-4">
          <Card title="Details">
            <div className="space-y-3 text-sm">
              <div><label htmlFor="p-s" className="mb-1 block text-xs font-semibold">Address (slug)</label><input id="p-s" className={input} value={p.slug} disabled={!isNew} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} /><p className="mt-1 text-xs text-[#6b7a75]">/blogs/{p.slug || '…'}/{!isNew ? ' — fixed once created. To rename, add a redirect.' : ''}</p></div>
              <div><label htmlFor="p-c" className="mb-1 block text-xs font-semibold">Categories (comma-separated; the first is primary)</label><input id="p-c" className={input} value={p.categories.join(', ')} onChange={(e) => set('categories', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} /></div>
              <div><label htmlFor="p-g" className="mb-1 block text-xs font-semibold">Tags</label><input id="p-g" className={input} value={p.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} /></div>
              <div><label htmlFor="p-d" className="mb-1 block text-xs font-semibold">Publish date</label><input id="p-d" type="date" className={input} value={p.publishedAt ? p.publishedAt.slice(0, 10) : ''} onChange={(e) => set('publishedAt', e.target.value ? new Date(e.target.value + 'T09:00:00Z').toISOString() : null)} /></div>
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={p.hidden} onChange={(e) => set('hidden', e.target.checked)} /> Hide from the site</label>
            </div>
          </Card>
          <Card title="Featured image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.image ? <img src={p.image} alt="" className="mb-3 aspect-video w-full rounded-lg object-cover" /> : null}
            <div className="flex gap-2"><button type="button" className={btn.ghost} onClick={() => setPickFor('featured')}>{p.image ? 'Change' : 'Choose'}</button>{p.image ? <button type="button" className={btn.ghost} onClick={() => set('image', '')}>Remove</button> : null}</div>
            <label htmlFor="p-a" className="mb-1 mt-3 block text-xs font-semibold">Alt text (required with an image)</label><input id="p-a" className={input} value={p.imageAlt} onChange={(e) => set('imageAlt', e.target.value)} />
          </Card>
          <Card title="SEO"><p className="text-sm text-[#51635d]">Title tag, description, social image and noindex for this article are set per URL in <Link className="font-semibold text-[#0A5C4B] hover:underline" href="/admin/seo/">SEO → Overview</Link> (search for /blogs/{p.slug || 'this-post'}/). Until then the title and excerpt are used.</p></Card>
          {p.status === 'published' && p.slug ? <a href={`/blogs/${p.slug}/`} target="_blank" rel="noreferrer" className={btn.ghost + ' w-full'}>View on site ↗</a> : null}
        </div>
      </div>
      {pickFor ? <MediaPickerModal onClose={() => setPickFor(null)} onPick={(m) => {
        if (pickFor === 'featured') { set('image', m.url); if (!p.imageAlt && (m as { alt?: string }).alt) set('imageAlt', (m as { alt?: string }).alt!); }
        else { const alt = prompt('Describe this image for screen readers and search:', (m as { alt?: string }).alt ?? '') ?? ''; restore(); document.execCommand('insertHTML', false, `<img src="${m.url}" alt="${alt.replace(/"/g, '&quot;')}">`); syncBody(); }
        setPickFor(null);
      }} /> : null}
    </div>
  );
}
