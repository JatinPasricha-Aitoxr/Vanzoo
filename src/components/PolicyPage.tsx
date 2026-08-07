import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/Hero';
import { Reveal } from '@/components/ui/Reveal';
import { POLICY_LAST_UPDATED, type PolicyDoc } from '@/content/policies';

/**
 * Shared layout for the three policy documents (§3.11): prose column plus a
 * sticky in-page table of contents on wide screens.
 *
 * The TOC is a `<nav>` of plain anchors, so it works with JS disabled and each
 * section stays linkable — useful when support needs to point a customer at
 * clause 7.
 */
export function PolicyPage({ doc }: { doc: PolicyDoc }) {
  const crumbs = [{ name: doc.heading, href: doc.route }];

  return (
    <>
      <PageHeader title={doc.heading}>
        <Breadcrumbs crumbs={crumbs} />
      </PageHeader>

      <div className="shell py-section-sm">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
          <nav aria-labelledby="toc-heading" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <h2
              id="toc-heading"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body"
            >
              On this page
            </h2>
            <ol className="mt-4 space-y-2.5 border-l border-neutral-line pl-4 lg:max-h-[60svh] lg:overflow-y-auto">
              {doc.toc.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="block text-sm leading-snug text-neutral-body transition-colors hover:text-brand"
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            <p className="text-sm text-neutral-body">
              Last updated:{' '}
              <time dateTime={POLICY_LAST_UPDATED}>
                {new Date(POLICY_LAST_UPDATED).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'Asia/Kolkata',
                })}
              </time>
            </p>

            {/* Migrated from vanzoo.in and sanitised to a fixed tag whitelist at
                import time (scripts/import-policies.py). */}
            <Reveal
              as="div"
              className="prose-vanzoo mt-8 max-w-prose"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: doc.body }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
