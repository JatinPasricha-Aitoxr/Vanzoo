import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { PincodeChecker } from '@/components/PincodeChecker';
import { RevealGroup } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { breadcrumbSchema, buildMetadata, localBusinessSchema } from '@/lib/seo';
import { areaGroups, primaryStore, site, stores } from '@/lib/site';

const CRUMBS = [{ name: 'Locate Us', href: '/locate-us/' }];

export const metadata = buildMetadata({
  title: 'Locate Us | Vanzoo Dry Cleaning Stores in Gurgaon',
  description:
    'Find Vanzoo premium dry cleaning in Gurgaon — Super Mart 1, DLF Phase IV and the Vanzoo Urbana store at M3M Urbana, Sector 67. Free pickup and delivery across Gurgaon.',
  path: '/locate-us/',
});

export default function LocateUsPage() {
  return (
    <>
      <JsonLd data={[localBusinessSchema(), breadcrumbSchema(CRUMBS)]} />

      <PageHeader
        eyebrow="Locate Us"
        title="Two Gurgaon stores. Free pickup across the city."
        intro="Drop in at either store, or let us collect from your door — free pickup and delivery covers every Gurgaon sector we serve."
      >
        <Breadcrumbs crumbs={CRUMBS} />
      </PageHeader>

      {/* Full-width map of the primary store */}
      <section aria-label={`Map of Vanzoo at ${primaryStore.name}`} className="bg-neutral-muted">
        <div className="aspect-[16/10] w-full sm:aspect-[21/8]">
          <iframe
            title={`Map showing Vanzoo at ${primaryStore.name}, ${primaryStore.locality}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(primaryStore.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      </section>

      {/* Store cards */}
      <Section tone="surface" aria-labelledby="stores-heading">
        <SectionHeading id="stores-heading" eyebrow="Our stores" title="Where to find us" />

        <RevealGroup as="ul" step={110} className="mt-12 grid gap-6 lg:grid-cols-2">
          {stores.map((store) => (
            <li
              key={store.id}
              id={store.id}
              className="flex flex-col rounded-card border border-neutral-line bg-white p-6 sm:p-8"
            >
              <h3 className="font-display text-xl font-semibold">{store.name}</h3>
              <p className="eyebrow mt-2">{store.locality}</p>
              <address className="mt-4 not-italic leading-relaxed text-neutral-body">
                {store.address}
              </address>

              <div className="mt-6 flex flex-1 flex-col justify-end gap-3 sm:flex-row sm:items-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary btn-md"
                >
                  Get directions
                </a>
                <a href={`tel:${site.phoneHref}`} className="btn-secondary btn-md">
                  Call {site.phone}
                </a>
              </div>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* Service areas + pincode checker */}
      <Section tone="muted" aria-labelledby="areas-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="areas-heading"
              eyebrow="Service areas"
              title="Free pickup and delivery across Gurgaon"
              intro="Our valets collect and return to your door at no charge. If your area isn't listed, call us — we often cover more than the map suggests."
              className="max-w-none"
            />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {areaGroups.map((group) => (
                <li key={group.id}>
                  <Link
                    href={`/areas-we-serve/#${group.id}`}
                    className="inline-block rounded-pill border border-neutral-line bg-white px-4 py-2 text-sm font-medium text-neutral-ink transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    {group.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/areas-we-serve/"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              See every area we serve
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <PincodeChecker />
        </div>
      </Section>

      <Section tone="surface" size="sm">
        <CtaBanner
          heading="Not near a store? We'll come to you."
          secondary={{ label: 'Contact the team', href: '/contact-us/' }}
        />
      </Section>
    </>
  );
}
