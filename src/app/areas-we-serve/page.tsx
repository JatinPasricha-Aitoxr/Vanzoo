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

const CRUMBS = [{ name: 'Areas We Serve', href: '/areas-we-serve/' }];

export const metadata = buildMetadata({
  title: 'Areas We Serve in Gurgaon | Vanzoo Dry Cleaning Pickup & Delivery',
  description:
    'Free dry cleaning pickup and delivery across Gurgaon — DLF Phases 1–5, Golf Course Road, Sohna Road, Sectors 47–70, Cyber City, Palam Vihar and New Gurgaon. Check your pincode.',
  path: '/areas-we-serve/',
});

export default function AreasWeServePage() {
  const totalAreas = areaGroups.reduce((count, group) => count + group.areas.length, 0);

  return (
    <>
      <JsonLd data={[localBusinessSchema(), breadcrumbSchema(CRUMBS)]} />

      <PageHeader
        eyebrow="Areas We Serve"
        title="Free pickup and delivery across Gurgaon"
        intro={`Two stores, ${totalAreas} neighbourhoods, one city. Our valets collect from your door and return everything pressed and wrapped — at no extra charge, anywhere we serve.`}
      >
        <Breadcrumbs crumbs={CRUMBS} />
      </PageHeader>

      {/* Corridor groups */}
      <Section tone="surface" aria-labelledby="corridors-heading">
        <SectionHeading
          id="corridors-heading"
          eyebrow="Where we collect"
          title="Gurgaon, corridor by corridor"
          intro="We run pickup routes across the whole city. Find your corridor below — and if your pocket isn't named, call us, because coverage grows faster than this page does."
        />

        <RevealGroup as="ul" step={90} className="mt-12 grid gap-5 lg:grid-cols-2">
          {areaGroups.map((group) => (
            <li
              key={group.id}
              id={group.id}
              className="flex flex-col rounded-card border border-neutral-line bg-white p-6 shadow-lift transition-[box-shadow,border-color] duration-200 hover:border-brand/25 hover:shadow-lift-hover sm:p-8"
            >
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-semibold text-neutral-ink">
                  {group.name}
                </h2>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-accent-gold/60 to-transparent"
                />
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-body">
                {group.blurb}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.areas.map((area) => (
                  <li
                    key={area}
                    className="rounded-pill border border-neutral-line bg-neutral-muted px-3 py-1.5 text-[0.8125rem] font-medium text-neutral-ink"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </RevealGroup>

        <p className="mt-8 max-w-2xl text-sm text-neutral-body">
          Coverage is confirmed when you book — a handful of gated pockets and newer sectors need
          a call first. Not listed?{' '}
          <a href={`tel:${site.phoneHref}`} className="font-medium text-brand underline underline-offset-2">
            {site.phone}
          </a>{' '}
          and we&apos;ll tell you straight away.
        </p>
      </Section>

      {/* Pincode check + stores */}
      <Section tone="muted" aria-labelledby="check-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="check-heading"
              eyebrow="Check your pincode"
              title="One field, and you'll know"
              intro="Every Gurgaon pincode starts 122. Enter yours and we'll confirm free pickup covers it."
              className="max-w-none"
            />

            <div className="mt-8 space-y-4">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="rounded-card border border-neutral-line bg-white p-5"
                >
                  <p className="font-display font-semibold text-neutral-ink">{store.name}</p>
                  <p className="eyebrow mt-1">{store.locality}</p>
                  <address className="mt-2 not-italic text-sm leading-relaxed text-neutral-body">
                    {store.address}
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    Get directions
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <PincodeChecker />

            <div className="media-frame mt-6 aspect-[4/3]">
              <iframe
                title={`Map showing Vanzoo at ${primaryStore.name}, ${primaryStore.locality}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(primaryStore.mapQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface" size="sm">
        <p className="mb-8 text-center text-sm text-neutral-body">
          Prefer to drop in? Both stores are on the{' '}
          <Link href="/locate-us/" className="font-medium text-brand underline underline-offset-2">
            Locate Us
          </Link>{' '}
          page, with directions and opening details.
        </p>
        <CtaBanner
          heading="We collect from your door, free"
          secondary={{ label: 'See our tariffs', href: '/couture-care-tariffs/' }}
        />
      </Section>
    </>
  );
}
