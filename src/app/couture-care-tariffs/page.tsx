import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Section } from '@/components/ui/Section';
import { TariffGrid } from '@/components/TariffGrid';
import { coutureCatalog, tariffIntro, tariffNote } from '@/content/pricing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

const CRUMBS = [{ name: 'Couture Care Tariffs', href: '/couture-care-tariffs/' }];

export const metadata = buildMetadata({
  title: 'Couture Care Tariffs and Premium Garment Pricing | Vanzoo',
  description:
    'Vanzoo couture care tariffs for suits, sarees, lehengas, leather, footwear, curtains and carpets — transparent per-item dry cleaning prices in Gurgaon.',
  path: '/couture-care-tariffs/',
});

export default function CoutureCareTariffsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHeader
        eyebrow="Couture Care"
        title="Couture Care Tariffs"
        intro={`${tariffIntro} Add the pieces you want cleaned to your cart and send us the list — we'll confirm the quote and collect from your door, free, anywhere in Gurgaon.`}
        image="/images/garment-rail-couture.jpg"
        imageAlt="Rail of pastel couture blazers cleaned and pressed at the Vanzoo Gurgaon atelier"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="dark" />
      </PageHeader>

      <Section tone="surface">
        <TariffGrid catalog={coutureCatalog} />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <p className="rounded-card border border-neutral-line bg-neutral-muted p-5 text-sm text-neutral-body">
            <strong className="font-semibold text-neutral-ink">Please note:</strong> {tariffNote}
          </p>
          <p className="rounded-card border border-neutral-line bg-neutral-muted p-5 text-sm text-neutral-body">
            <strong className="font-semibold text-neutral-ink">Turnaround:</strong> standard is{' '}
            {site.turnaround}. Express service with same-day or 2-4 hour delivery is available on
            request and priced separately — call{' '}
            <a href={`tel:${site.phoneHref}`} className="font-medium text-brand">
              {site.phone}
            </a>{' '}
            to arrange it.
          </p>
        </div>

        <p className="mt-8 text-sm text-neutral-body">
          Looking for pressing only? See the{' '}
          <Link href="/steam-iron-tariffs/" className="font-medium text-brand underline underline-offset-2">
            steam iron tariffs
          </Link>
          , or read how{' '}
          <Link href="/hydrocarbon-tech/" className="font-medium text-brand underline underline-offset-2">
            hydrocarbon technology
          </Link>{' '}
          protects delicate fibres.
        </p>
      </Section>

      <Section tone="muted" size="sm">
        <CtaBanner
          heading="Ready to book your couture care?"
          secondary={{ label: 'Talk to us first', href: '/contact-us/' }}
        />
      </Section>
    </>
  );
}
