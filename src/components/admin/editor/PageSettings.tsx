'use client';

import { useMemo } from 'react';
import type { Block, Doc, PageSeo } from '@/cms/schema';
import { flatten } from '@/cms/tree';
import { SITE_URL } from '@/lib/site';
import { Badge, input } from '../ui';

type Rev = { id: number; kind: 'draft' | 'published'; note: string | null; created_by: string | null; created_at: string };

type Props = {
  title: string;
  slug: string;
  isHome: boolean;
  published: boolean;
  seo: PageSeo;
  doc: Doc;
  revisions: Rev[];
  onTitle: (v: string) => void;
  onSlug: (v: string) => void;
  onSeo: (next: PageSeo) => void;
  onRestore: (revId: number) => void;
};

type Heading = { level: number; text: string; source: string };

/** Headings the page will output, in order — widget headings plus the known section headings. */
export function outline(blocks: Block[]): Heading[] {
  const out: Heading[] = [];
  for (const { block: b } of flatten(blocks)) {
    const p = b.props as Record<string, string>;
    if (b.type === 'heading') out.push({ level: Number(p.level) || 2, text: p.text ?? '', source: 'Heading' });
    else if (b.type === 'hero') out.push({ level: 1, text: p.seoH1 || [p.headline1, p.headline2].filter(Boolean).join(' '), source: 'Hero' });
    else if (['services-row', 'visit-store', 'personas', 'blog-preview', 'enquiry', 'faq'].includes(b.type) && p.title)
      out.push({ level: 2, text: p.title, source: b.type });
    else if (b.type === 'process' && p.heading) out.push({ level: 2, text: p.heading, source: 'Process' });
  }
  return out;
}

export function seoChecks(seo: PageSeo, doc: Doc, title: string) {
  const issues: { level: 'warn' | 'info'; text: string }[] = [];
  const t = (seo.title || '').trim();
  const d = (seo.description || '').trim();
  if (!t) issues.push({ level: 'info', text: 'No SEO title — the built-in title is used.' });
  if (t && t.length > 60) issues.push({ level: 'warn', text: `SEO title is ${t.length} characters; search results usually show about 60.` });
  if (t && t.length < 25) issues.push({ level: 'info', text: 'SEO title is quite short.' });
  if (!d) issues.push({ level: 'info', text: 'No meta description — the built-in description is used.' });
  if (d && d.length > 160) issues.push({ level: 'warn', text: `Meta description is ${d.length} characters; about 155–160 fit in results.` });
  if (d && d.length < 70) issues.push({ level: 'info', text: 'Meta description is short; add detail so searchers know what they get.' });
  if (!seo.ogImage) issues.push({ level: 'info', text: 'No social-sharing image — the site default is used.' });
  if (seo.noindex) issues.push({ level: 'warn', text: 'This page is set to noindex: search engines will not list it.' });
  const noAlt = flatten(doc.blocks).filter(({ block: b }) => b.type === 'image' && !(b.props as { alt?: string }).alt);
  if (noAlt.length) issues.push({ level: 'warn', text: `${noAlt.length} image${noAlt.length > 1 ? 's have' : ' has'} no alt text.` });
  const h = outline(doc.blocks);
  const h1s = h.filter((x) => x.level === 1);
  if (h1s.length === 0) issues.push({ level: 'warn', text: 'No H1 heading on this page.' });
  if (h1s.length > 1) issues.push({ level: 'warn', text: `${h1s.length} H1 headings. One main H1 is the clearest structure for most pages.` });
  if (h.some((x) => !x.text.trim())) issues.push({ level: 'warn', text: 'A heading is empty.' });
  for (let i = 1; i < h.length; i++) if (h[i].level > h[i - 1].level + 1) { issues.push({ level: 'info', text: `Heading level jumps from H${h[i - 1].level} to H${h[i].level}.` }); break; }
  if (!title.trim()) issues.push({ level: 'warn', text: 'The page has no title.' });
  return issues;
}

const lab = 'mb-1 block text-xs font-semibold text-[#51635d]';

export function PageSettings(p: Props) {
  const issues = useMemo(() => seoChecks(p.seo, p.doc, p.title), [p.seo, p.doc, p.title]);
  const heads = useMemo(() => outline(p.doc.blocks), [p.doc]);
  const set = (k: keyof PageSeo, v: unknown) => p.onSeo({ ...p.seo, [k]: v });
  const shownTitle = p.seo.title || p.title;
  return (
    <div className="space-y-5 p-4 text-sm">
      <section className="space-y-3">
        <div>
          <label htmlFor="ps-title" className={lab}>Page title (admin)</label>
          <input id="ps-title" className={input} value={p.title} onChange={(e) => p.onTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ps-slug" className={lab}>Address (URL)</label>
          <input id="ps-slug" className={input} value={p.slug} disabled={p.isHome || p.published} onChange={(e) => p.onSlug(e.target.value)} />
          <p className="mt-1 text-xs text-[#6b7a75]">{p.isHome ? 'The home page address cannot change.' : p.published ? 'Unpublish before changing the address, so old links are not broken.' : 'Letters, numbers and dashes.'}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-[#51635d]">Search preview</h3>
        <div className="rounded-lg border border-[#e0e8e5] bg-white p-3">
          <p className="truncate text-xs text-[#1a6b3c]">{SITE_URL}{p.slug}</p>
          <p className="truncate text-base text-[#1a0dab]">{shownTitle || 'Page title'}</p>
          <p className="line-clamp-2 text-xs text-[#4d5156]">{p.seo.description || 'The meta description appears here.'}</p>
        </div>
        <div>
          <label htmlFor="seo-title" className={lab}>SEO title <span className="font-normal text-[#6b7a75]">({(p.seo.title ?? '').length}/60)</span></label>
          <input id="seo-title" className={input} value={p.seo.title ?? ''} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div>
          <label htmlFor="seo-desc" className={lab}>Meta description <span className="font-normal text-[#6b7a75]">({(p.seo.description ?? '').length}/160)</span></label>
          <textarea id="seo-desc" rows={3} className={input} value={p.seo.description ?? ''} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div>
          <label htmlFor="seo-canon" className={lab}>Canonical URL</label>
          <input id="seo-canon" className={input} value={p.seo.canonical ?? ''} placeholder={`${SITE_URL}${p.slug}`} onChange={(e) => set('canonical', e.target.value)} />
          <p className="mt-1 text-xs text-[#6b7a75]">Leave blank to use this page’s own address.</p>
        </div>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={Boolean(p.seo.noindex)} onChange={(e) => set('noindex', e.target.checked)} /> noindex</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-[#0A5C4B]" checked={Boolean(p.seo.nofollow)} onChange={(e) => set('nofollow', e.target.checked)} /> nofollow</label>
        </div>
        <details>
          <summary className="cursor-pointer text-xs font-semibold text-[#51635d]">Social sharing (Open Graph)</summary>
          <div className="mt-2 space-y-3">
            <div><label htmlFor="og-title" className={lab}>OG title</label><input id="og-title" className={input} value={p.seo.ogTitle ?? ''} onChange={(e) => set('ogTitle', e.target.value)} /></div>
            <div><label htmlFor="og-desc" className={lab}>OG description</label><textarea id="og-desc" rows={2} className={input} value={p.seo.ogDescription ?? ''} onChange={(e) => set('ogDescription', e.target.value)} /></div>
            <div><label htmlFor="og-img" className={lab}>OG image (path or URL)</label><input id="og-img" className={input} value={p.seo.ogImage ?? ''} placeholder="/uploads/… or /images/…" onChange={(e) => set('ogImage', e.target.value)} /></div>
          </div>
        </details>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#51635d]">SEO checklist</h3>
        {issues.length === 0 ? <p className="text-emerald-700">No issues found.</p> : (
          <ul className="space-y-1.5">
            {issues.map((i, n) => (
              <li key={n} className="flex gap-2"><Badge tone={i.level === 'warn' ? 'gold' : 'grey'}>{i.level === 'warn' ? 'Check' : 'Note'}</Badge><span>{i.text}</span></li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-[#6b7a75]">These are guidance, not a ranking score.</p>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#51635d]">Heading outline</h3>
        {heads.length === 0 ? <p className="text-[#6b7a75]">No headings yet.</p> : (
          <ol className="space-y-1">
            {heads.map((h, i) => (
              <li key={i} style={{ paddingLeft: (h.level - 1) * 12 }} className="truncate">
                <span className="mr-1.5 inline-block rounded bg-[#e6efec] px-1 text-[11px] font-bold text-[#245b4d]">H{h.level}</span>
                {h.text || <em className="text-red-700">empty</em>}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#51635d]">Revisions</h3>
        <ul className="space-y-1.5">
          {p.revisions.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg border border-[#eef2f0] px-2.5 py-1.5">
              <span className="min-w-0">
                <Badge tone={r.kind === 'published' ? 'green' : 'grey'}>{r.kind}</Badge>
                <span className="ml-2 text-xs text-[#6b7a75]">{r.created_at.slice(0, 16).replace('T', ' ')} · {r.created_by ?? '—'}</span>
              </span>
              <button type="button" className="text-xs font-semibold text-[#0A5C4B] hover:underline" onClick={() => p.onRestore(r.id)}>Restore</button>
            </li>
          ))}
          {p.revisions.length === 0 ? <li className="text-[#6b7a75]">Nothing saved yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}
