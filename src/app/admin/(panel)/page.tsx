import Link from 'next/link';
import { Badge, btn, Card } from '@/components/admin/ui';
import { dashboardStats, ensureHomePage } from '@/cms/store';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  await ensureHomePage();
  const s = await dashboardStats();
  const stat = (label: string, value: number, note?: string) => (
    <div className="rounded-xl border border-[#e0e8e5] bg-white p-5 shadow-sm">
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      {note ? <p className="text-xs text-[#6b7a75]">{note}</p> : null}
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-[#6b7a75]">What is on your website right now.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/pages" className={btn.primary}>Manage pages</Link>
          <Link href="/admin/media" className={btn.ghost}>Media library</Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stat('Pages in the builder', s.pages.total)}
        {stat('Published', s.pages.published, 'Live on the website')}
        {stat('Drafts', s.pages.drafts, 'Not live (the home page uses its built-in layout until first publish)')}
        {stat('Media files', s.media)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card title="Recently edited">
          <ul className="divide-y divide-[#eef2f0]">
            {s.recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <Link href={`/admin/editor/${p.id}`} className="font-medium text-[#0A5C4B] hover:underline">{p.title}</Link>
                  <p className="truncate text-xs text-[#6b7a75]">{p.slug} · {p.updated_at.slice(0, 16).replace('T', ' ')}</p>
                </div>
                <Badge tone={p.status === 'published' ? 'green' : 'gold'}>{p.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Recent activity">
          {s.activity.length === 0 ? <p className="text-sm text-[#6b7a75]">No activity yet.</p> : (
            <ul className="space-y-2 text-sm">
              {s.activity.map((a, i) => (
                <li key={i}><span className="font-medium">{a.actor ?? 'someone'}</span> · {a.action.replace(/_/g, ' ')}{a.target ? ` · ${a.target}` : ''}<span className="block text-xs text-[#6b7a75]">{a.created_at.slice(0, 16).replace('T', ' ')}</span></li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <Card title="What the builder covers today">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          <li>✔ Visual editor for the <strong>home page</strong> and any new page you create</li>
          <li>✔ Drag-and-drop, undo/redo, tablet and mobile styling</li>
          <li>✔ Draft, preview, publish, unpublish and restore versions</li>
          <li>✔ Page SEO: title, description, canonical, robots, social sharing</li>
          <li>✔ Media uploads and the Delhi on/off switch</li>
          <li className="text-[#6b7a75]">Other built-in pages (About, Pricing, Services…) are still edited in code and will be converted one at a time.</li>
        </ul>
      </Card>
    </div>
  );
}
