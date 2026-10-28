'use client';

import { useEffect, useState } from 'react';
import { api, btn, Card, input } from './ui';
import { MediaPickerModal } from './MediaPicker';

type G = { siteNoindex: boolean; defaultDescription: string; defaultOgImage: string; robotsExtra: string; sitemapExclude: string[]; sitemapExtra: string[] };

export function GlobalSeoForm() {
  const [g, setG] = useState<G | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [picking, setPicking] = useState(false);
  useEffect(() => { api<{ seo: G }>('/api/cms/seo/global').then((r) => r.seo && setG(r.seo)); }, []);
  if (!g) return <p className="text-sm text-[#6b7a75]">Loading…</p>;
  const lines = (v: string) => v.split('\n').map((s) => s.trim()).filter(Boolean);
  const save = async () => {
    const r = await api('/api/cms/seo/global', { method: 'PUT', json: g });
    setMsg(r.error ? { ok: false, text: r.error } : { ok: true, text: 'Saved. robots.txt and the sitemap update within a minute.' });
  };
  return (
    <div className="space-y-6">
      <Card title="Indexing">
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#0A5C4B]" checked={g.siteNoindex} onChange={(e) => setG({ ...g, siteNoindex: e.target.checked })} /><span><strong>Block search engines from the whole site</strong><br /><span className="text-[#6b7a75]">Adds noindex to every page and disallows everything in robots.txt. Use only on a staging copy — never on the live site.</span></span></label>
        {g.siteNoindex ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">The site will disappear from search results while this is on.</p> : null}
      </Card>
      <Card title="Defaults">
        <div className="space-y-3">
          <div><label htmlFor="g-d" className="mb-1 block text-xs font-semibold">Default meta description (used only when a page has none)</label><textarea id="g-d" rows={2} className={input} value={g.defaultDescription} onChange={(e) => setG({ ...g, defaultDescription: e.target.value })} /></div>
          <div><label htmlFor="g-i" className="mb-1 block text-xs font-semibold">Default social-sharing image</label><div className="flex gap-2"><input id="g-i" className={input} value={g.defaultOgImage} placeholder="/uploads/… or /images/…" onChange={(e) => setG({ ...g, defaultOgImage: e.target.value })} /><button type="button" className={btn.ghost} onClick={() => setPicking(true)}>Choose…</button></div></div>
        </div>
        {picking ? <MediaPickerModal onClose={() => setPicking(false)} onPick={(m) => setG({ ...g, defaultOgImage: m.url })} /> : null}
      </Card>
      <Card title="robots.txt">
        <p className="mb-2 text-sm text-[#51635d]">The admin, previews, API and the booking path are always blocked. Add extra rules, one per line (Allow, Disallow, Crawl-delay, Sitemap).</p>
        <textarea aria-label="Extra robots.txt rules" rows={4} className={input + ' font-mono text-xs'} value={g.robotsExtra} placeholder={'Disallow: /private/\nSitemap: https://vanzoo.in/extra-sitemap.xml'} onChange={(e) => setG({ ...g, robotsExtra: e.target.value })} />
        <p className="mt-2 text-xs text-[#6b7a75]">Preview: <a href="/robots.txt" target="_blank" rel="noreferrer" className="font-semibold text-[#0A5C4B] hover:underline">/robots.txt</a>. Important public assets (images, CSS, JS) are never blocked.</p>
      </Card>
      <Card title="XML sitemap">
        <div className="grid gap-4 lg:grid-cols-2">
          <div><label htmlFor="g-x" className="mb-1 block text-xs font-semibold">Leave out of the sitemap (one path per line; end with * for a prefix)</label><textarea id="g-x" rows={4} className={input + ' font-mono text-xs'} value={g.sitemapExclude.join('\n')} placeholder={'/site-map/\n/blogs/category/*'} onChange={(e) => setG({ ...g, sitemapExclude: lines(e.target.value) })} /></div>
          <div><label htmlFor="g-e" className="mb-1 block text-xs font-semibold">Extra URLs to include (one path per line)</label><textarea id="g-e" rows={4} className={input + ' font-mono text-xs'} value={g.sitemapExtra.join('\n')} placeholder="/landing/spring-offer/" onChange={(e) => setG({ ...g, sitemapExtra: lines(e.target.value) })} /></div>
        </div>
        <p className="mt-2 text-xs text-[#6b7a75]">Published CMS pages are added automatically (unless set to noindex). View: <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="font-semibold text-[#0A5C4B] hover:underline">/sitemap.xml</a></p>
      </Card>
      <div className="flex items-center gap-3"><button type="button" className={btn.primary} onClick={save}>Save settings</button>{msg ? <p role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p> : null}</div>
    </div>
  );
}
