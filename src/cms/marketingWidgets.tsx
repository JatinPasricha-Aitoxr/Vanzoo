import { FAQAccordion } from '@/components/FAQAccordion';
import { JsonLd } from '@/components/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import { cn } from '@/lib/cn';
import { primaryStore, site } from '@/lib/site';
import { safeHref } from './widgetDefs';

/** Renderers for the Marketing widgets. Server/client neutral (no hooks, no server-only APIs). */
type P = Record<string, any>;

const items = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export function FaqCustom(p: P) {
  const faqs = items<{ question: string; answer: string }>(p.items).filter((i) => i.question?.trim() && i.answer?.trim());
  if (!faqs.length) return null;
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) };
  return (
    <Section tone="muted" aria-labelledby="faqc-heading">
      <JsonLd data={schema} />
      {p.title ? <SectionHeading id="faqc-heading" title={p.title} align="center" className="mx-auto" /> : null}
      <div className="mt-10"><FAQAccordion faqs={faqs} groupName="faq-custom" /></div>
    </Section>
  );
}

export function Testimonials(p: P) {
  const list = items<{ quote: string; name: string; detail?: string }>(p.items).filter((i) => i.quote?.trim() && i.name?.trim());
  if (!list.length) return null;
  return (
    <Section tone="surface">
      {p.title ? <SectionHeading title={p.title} /> : null}
      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <li key={i} className="rounded-card border border-neutral-line bg-white p-6 shadow-sm">
            <blockquote className="text-neutral-ink">“{t.quote}”</blockquote>
            <p className="mt-4 text-sm font-semibold text-neutral-ink">{t.name}{t.detail ? <span className="font-normal text-neutral-body"> · {t.detail}</span> : null}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Cta(p: P) {
  const dark = p.tone !== 'light';
  const href = safeHref(p.href);
  return (
    <Section tone={dark ? 'dark' : 'light'} size="sm">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className={cn('text-display-md', dark ? 'text-white' : 'text-neutral-ink')}>{p.heading}</h2>
        {p.body ? <p className={cn('mt-4 text-lead', dark ? 'text-white/75' : 'text-neutral-body')}>{p.body}</p> : null}
        {p.label && href ? <a href={href} className={cn('mt-8 inline-flex', dark ? 'btn-inverse btn-lg' : 'btn-primary btn-lg')}>{p.label}</a> : null}
      </div>
    </Section>
  );
}

const COLS: Record<string, string> = { '2': 'md:grid-cols-2', '3': 'md:grid-cols-2 lg:grid-cols-3', '4': 'md:grid-cols-2 lg:grid-cols-4' };
export function FeatureGrid(p: P) {
  const list = items<{ title: string; body: string }>(p.items).filter((i) => i.title?.trim());
  if (!list.length) return null;
  return (
    <Section tone="surface">
      {p.title ? <SectionHeading title={p.title} /> : null}
      <ul className={cn('mt-10 grid gap-6', COLS[p.columns] ?? COLS['3'])}>
        {list.map((f, i) => (
          <li key={i} className="rounded-card border border-neutral-line bg-neutral-muted p-6">
            <h3 className="font-display text-lg font-semibold text-neutral-ink">{f.title}</h3>
            {f.body ? <p className="mt-2 text-neutral-body">{f.body}</p> : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PriceList(p: P) {
  const rows = items<{ name: string; price: string; detail?: string }>(p.items).filter((r) => r.name?.trim() && r.price?.trim());
  if (!rows.length) return null;
  return (
    <Section tone="surface">
      {p.title ? <SectionHeading title={p.title} /> : null}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full max-w-3xl text-left">
          <thead className="sr-only"><tr><th>Item</th><th>Price</th></tr></thead>
          <tbody className="divide-y divide-neutral-line">
            {rows.map((r, i) => (
              <tr key={i}><td className="py-3 pr-4"><span className="font-medium text-neutral-ink">{r.name}</span>{r.detail ? <span className="block text-sm text-neutral-body">{r.detail}</span> : null}</td><td className="py-3 text-right font-semibold text-neutral-ink">{r.price}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {p.note ? <p className="mt-4 text-sm text-neutral-body">{p.note}</p> : null}
    </Section>
  );
}

export function RichText(p: P) {
  if (!p.html) return null;
  return (
    <Section tone="surface">
      {/* eslint-disable-next-line react/no-danger -- sanitised by the widget's props schema (src/cms/sanitize.ts) */}
      <div className={cn('prose-vanzoo', p.narrow !== false && 'mx-auto max-w-prose')} dangerouslySetInnerHTML={{ __html: String(p.html) }} />
    </Section>
  );
}

/** Accepts only real YouTube watch / share / embed addresses and returns the 11-character video id. */
export function youtubeId(url: string): string | null {
  const m = url.trim().match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#].*)?$/);
  return m ? m[1] : null;
}
export function Video(p: P) {
  const id = youtubeId(String(p.url ?? ''));
  if (!id) return null;
  return (
    <Section tone="surface" size="sm">
      <div className="mx-auto aspect-video max-w-4xl overflow-hidden rounded-media bg-black">
        <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}`} title={p.title || 'Video'} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      </div>
    </Section>
  );
}

export function ContactInfo(p: P) {
  return (
    <Section tone="light" size="sm">
      {p.title ? <SectionHeading title={p.title} /> : null}
      <ul className="mt-6 space-y-2 text-neutral-ink">
        <li><a className="font-semibold hover:underline" href={`tel:${site.phoneHref}`}>{site.phone}</a></li>
        <li><a className="hover:underline" href={`mailto:${site.email}`}>{site.email}</a></li>
        <li className="text-neutral-body">{primaryStore.address}</li>
      </ul>
    </Section>
  );
}
