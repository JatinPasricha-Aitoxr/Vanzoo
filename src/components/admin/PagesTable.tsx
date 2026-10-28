'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api, Badge, btn, Card, input } from './ui';

type Row = { id: number; slug: string; title: string; status: 'draft' | 'published'; updated_at: string; published_at: string | null };

const BUILT_IN = [
  ['About Us', '/about-us/'], ['Services', '/services/'], ['Pricing', '/pricing/'], ['Membership', '/membership/'],
  ['Hydrocarbon Tech', '/hydrocarbon-tech/'], ['Products', '/products/'], ['Areas We Serve', '/areas-we-serve/'],
  ['Locate Us', '/locate-us/'], ['Contact Us', '/contact-us/'], ['Reviews', '/reviews/'], ['Customer Stories', '/customer-stories/'],
  ['Blogs', '/blogs/'], ['Privacy Policy', '/privacy-policy/'], ['Terms & Conditions', '/terms-conditions/'], ['Delivery & Refund', '/delivery-refund-policy/'],
];

export function PagesTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState('');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const load = useCallback(async () => {
    const r = await api<{ pages: Row[] }>('/api/cms/pages');
    if (r.error) setMsg(r.error);
    else setRows(r.pages);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const act = async (id: number, action: 'publish' | 'unpublish' | 'duplicate') => {
    if (action === 'publish' && !confirm('Publish the current draft to the live website?')) return;
    if (action === 'unpublish' && !confirm('Take this page offline?')) return;
    const r = await api(`/api/cms/pages/${id}/${action}`, { method: 'POST' });
    setMsg(r.error ?? (action === 'duplicate' ? 'Page duplicated as a draft.' : `Page ${action}ed.`));
    load();
  };
  const remove = async (row: Row) => {
    if (!confirm(`Delete “${row.title}”? This removes it and its history.`)) return;
    const r = await api(`/api/cms/pages/${row.id}`, { method: 'DELETE' });
    setMsg(r.error ?? 'Page deleted.');
    load();
  };
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await api<{ page: Row }>('/api/cms/pages', { method: 'POST', json: { title, slug: slug || title } });
    if (r.error) return setMsg(r.error);
    window.location.href = `/admin/editor/${r.page.id}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pages</h1>
          <p className="text-sm text-[#6b7a75]">Pages you can edit visually. Open one to use the drag-and-drop builder.</p>
        </div>
        <button type="button" className={btn.primary} onClick={() => setCreating((c) => !c)}>+ New page</button>
      </div>
      {msg ? <p role="status" className="rounded-lg bg-white px-4 py-2 text-sm font-medium shadow-sm">{msg}</p> : null}
      {creating ? (
        <Card title="New page">
          <form onSubmit={create} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <div><label htmlFor="np-t" className="mb-1 block text-xs font-semibold">Title</label><input id="np-t" className={input} value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div><label htmlFor="np-s" className="mb-1 block text-xs font-semibold">Address</label><input id="np-s" className={input} value={slug} placeholder="/my-new-page/" onChange={(e) => setSlug(e.target.value)} /></div>
            <button type="submit" className={btn.gold + ' self-end'}>Create &amp; open editor</button>
          </form>
        </Card>
      ) : null}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#6b7a75]">
              <tr><th className="pb-2">Title</th><th className="pb-2">Address</th><th className="pb-2">Status</th><th className="pb-2">Updated</th><th className="pb-2 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-[#eef2f0]">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 font-medium"><Link href={`/admin/editor/${r.id}`} className="text-[#0A5C4B] hover:underline">{r.title}</Link></td>
                  <td className="py-3 text-[#51635d]">{r.slug}</td>
                  <td className="py-3"><Badge tone={r.status === 'published' ? 'green' : 'gold'}>{r.slug === '/' && r.status === 'draft' ? 'built-in layout' : r.status}</Badge></td>
                  <td className="py-3 text-xs text-[#6b7a75]">{r.updated_at.slice(0, 16).replace('T', ' ')}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <Link href={`/admin/editor/${r.id}`} className={btn.primary + ' !px-2.5 !py-1 text-xs'}>Edit</Link>
                      <a href={`/preview/${r.id}`} target="_blank" rel="noreferrer" className={btn.ghost + ' !px-2.5 !py-1 text-xs'}>Preview</a>
                      {r.status === 'published' ? <a href={r.slug} target="_blank" rel="noreferrer" className={btn.ghost + ' !px-2.5 !py-1 text-xs'}>View live</a> : null}
                      <button type="button" className={btn.ghost + ' !px-2.5 !py-1 text-xs'} onClick={() => act(r.id, r.status === 'published' ? 'unpublish' : 'publish')}>{r.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                      <button type="button" className={btn.ghost + ' !px-2.5 !py-1 text-xs'} onClick={() => act(r.id, 'duplicate')}>Duplicate</button>
                      {r.slug !== '/' ? <button type="button" className={btn.danger + ' !px-2.5 !py-1 text-xs'} onClick={() => remove(r)}>Delete</button> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="Built-in pages (edited in code)">
        <p className="mb-3 text-sm text-[#6b7a75]">These pages are built into the website. They are not in the visual builder yet; they will be converted one at a time.</p>
        <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {BUILT_IN.map(([t, p]) => (<li key={p}><a href={p} target="_blank" rel="noreferrer" className="text-[#0A5C4B] hover:underline">{t}</a> <span className="text-xs text-[#6b7a75]">{p}</span></li>))}
        </ul>
      </Card>
    </div>
  );
}
