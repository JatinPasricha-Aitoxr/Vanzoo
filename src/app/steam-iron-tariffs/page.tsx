import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Section } from '@/components/ui/Section';
import { TariffGrid } from '@/components/TariffGrid';
import { steamIronCatalog, tariffIntro, tariffNote } from '@/content/pricing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

const CRUMBS = [{ name: 'Steam Iron Tariffs', href: '/steam-iron-tariffs/' }];

export const metadata = buildMetadata({
  title: 'Steam Iron Tariffs | Pressing-Only Pricing | Vanzoo',
  description:
    'Vanzoo steam iron tariffs for shirts, trousers, sarees, lehengas, sherwanis and home textiles — pressing-only pricing with free pickup and delivery in Gurgaon.',
  path: '/steam-iron-tariffs/',
});

export default function SteamIronTariffsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHeader
        eyebrow="Steam & Iron"
        title="Steam Iron Tariffs"
        intro={`${tariffIntro} Pressing only — for garments that are already clean and simply need a professional finish. Add pieces to your cart and send us the list.`}
        image="/images/garment-rail-couture.jpg"
        imageAlt="Rail of pastel couture blazers pressed and ready at the Vanzoo Gurgaon atelier"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="dark" />
      </PageHeader>

      <Section tone="surface">
        <div>
          <TariffGrid catalog={steamIronCatalog} />
        </div>

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
          Need cleaning as well as pressing? See the{' '}
          <Link
            href="/couture-care-tariffs/"
            className="font-medium text-brand underline underline-offset-2"
          >
            couture care tariffs
          </Link>
          .
        </p>
      </Section>

      <Section tone="muted" size="sm">
        <CtaBanner
          heading="Book a pressing pickup"
          secondary={{ label: 'See couture care tariffs', href: '/couture-care-tariffs/' }}
        />
      </Section>
    </>
  );
}
