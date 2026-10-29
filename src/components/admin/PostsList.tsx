'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, Badge, btn, Card, input } from './ui';

type Item = { slug: string; title: string; source: 'cms' | 'edited' | 'built-in'; status: 'draft' | 'published'; hidden: boolean; date: string | null };

export function PostsList() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [q, setQ] = useState('');
  useEffect(() => { api<{ posts: Item[] }>('/api/cms/posts').then((r) => setItems(r.posts ?? [])); }, []);
  const rows = (items ?? []).filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.slug.includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-semibold">Blog posts</h1><p className="text-sm text-[#6b7a75]">Write new articles, or edit the migrated ones. Editing a built-in post saves a copy that replaces it on the site; you can revert at any time.</p></div><Link href="/admin/posts/new/" className={btn.gold}>New post</Link></div>
      <Card actions={<input className={input + ' !w-56 !py-1.5'} placeholder="Search posts…" aria-label="Search posts" value={q} onChange={(e) => setQ(e.target.value)} />}>
        {items === null ? <p className="text-sm text-[#6b7a75]">Loading…</p> : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#6b7a75]"><tr><th className="pb-2">Title</th><th className="pb-2">Source</th><th className="pb-2">Status</th><th className="pb-2">Date</th><th className="pb-2" /></tr></thead>
            <tbody className="divide-y divide-[#eef2f0]">
              {rows.slice(0, 200).map((p) => (
                <tr key={p.slug}>
                  <td className="py-2.5 pr-3"><Link className="font-medium text-[#0A5C4B] hover:underline" href={`/admin/posts/${p.slug}/`}>{p.title}</Link><br /><span className="text-xs text-[#6b7a75]">/blogs/{p.slug}/</span></td>
                  <td className="py-2.5 pr-3 text-xs">{p.source === 'cms' ? 'Written here' : p.source === 'edited' ? 'Built-in, edited' : 'Built-in'}</td>
                  <td className="py-2.5 pr-3">{p.hidden ? <Badge tone="red">hidden</Badge> : <Badge tone={p.status === 'published' ? 'green' : 'gold'}>{p.status}</Badge>}</td>
                  <td className="py-2.5 pr-3 text-xs text-[#6b7a75]">{p.date ? p.date.slice(0, 10) : '—'}</td>
                  <td className="py-2.5 text-right"><Link className={btn.ghost + ' !px-2.5 !py-1 text-xs'} href={`/admin/posts/${p.slug}/`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
