import { Badge, Card } from '@/components/admin/ui';
import { dbConfigured, parseJson, query } from '@/lib/db';
import { localBusinessSchema, organizationSchema, websiteSchema } from '@/lib/seo';
import type { AuditReport } from '@/cms/seoAudit';

export const dynamic = 'force-dynamic';

const RULES = [
  ['Organization, WebSite, LocalBusiness', 'Emitted from the business facts in the site’s content files (name, phone, email, store addresses, service cities).'],
  ['Service, Product', 'Emitted on each service / product page from that page’s own title and description.'],
  ['FAQPage', 'Emitted only where the questions and answers are visibly on the page.'],
  ['BlogPosting', 'Emitted from the post’s own title, dates and image.'],
  ['BreadcrumbList', 'Emitted from the real page hierarchy.'],
  ['AggregateRating / Review', 'Never emitted. No verified rating or review count is published, and inventing one breaks Google’s guidelines.'],
];

export default async function SchemaScreen() {
  const rows = dbConfigured() ? await query<{ v: unknown }>('SELECT v FROM settings WHERE k = "audit"').catch(() => []) : [];
  const report = parseJson<AuditReport | null>(rows[0]?.v, null);
  const counts = new Map<string, number>();
  let none = 0;
  for (const p of report?.pages ?? []) {
    if (p.jsonLdTypes.length === 0) none++;
    for (const t of new Set(p.jsonLdTypes)) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  const sample = JSON.stringify([organizationSchema(), websiteSchema(), localBusinessSchema()], null, 2);

  return (
    <div className="space-y-6">
      <Card title="What is published, and from where">
        <ul className="divide-y divide-[#eef2f0] text-sm">
          {RULES.map(([k, v]) => (<li key={k} className="grid gap-1 py-2.5 sm:grid-cols-[16rem_1fr]"><strong>{k}</strong><span className="text-[#51635d]">{v}</span></li>))}
        </ul>
        <p className="mt-3 text-xs text-[#6b7a75]">To change a fact (address, phone, store list), edit it once in Website settings or the content files — every page that uses it updates together.</p>
      </Card>

      <Card title="Coverage from the last audit">
        {report ? (
          <>
            <div className="flex flex-wrap gap-2">{[...counts].sort((a, b) => b[1] - a[1]).map(([t, n]) => (<Badge key={t} tone="green">{t} · {n} pages</Badge>))}</div>
            <p className="mt-3 text-sm text-[#51635d]">{none} of {report.pages.length} crawled pages have no structured data{none ? ' (legal and utility pages normally don’t need it).' : '.'}</p>
          </>
        ) : <p className="text-sm text-[#6b7a75]">Run an audit from the Overview tab to see coverage.</p>}
      </Card>

      <Card title="Live preview — site-wide JSON-LD">
        <pre className="max-h-[28rem] overflow-auto rounded-lg bg-[#0d2b24] p-4 text-xs leading-relaxed text-emerald-100">{sample}</pre>
        <p className="mt-3 text-xs text-[#6b7a75]">Validate with Google’s Rich Results Test after any change. This is exactly what the homepage serves.</p>
      </Card>
    </div>
  );
}
