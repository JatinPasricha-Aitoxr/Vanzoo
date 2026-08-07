import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { MediaStrip, type StripItem } from '@/components/MediaStrip';
import { PageHeader } from '@/components/Hero';
import { PricingTable } from '@/components/PricingTable';
import { Section } from '@/components/ui/Section';
import { coutureTariffs, tariffIntro, tariffNote } from '@/content/pricing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

const CRUMBS = [{ name: 'Couture Care Tariffs', href: '/couture-care-tariffs/' }];

/** One tile per broad tariff family, so the tables below have a visual key. */
const COUTURE_STRIP: readonly StripItem[] = [
  {
    src: '/images/service-bespoke-suit-couture.jpg',
    alt: 'Bespoke suit and evening dress dry cleaned and pressed by Vanzoo in Gurgaon',
    caption: 'Suits & couture',
    icon: 'shirt',
  },
  {
    src: '/images/persona-heirlooms.jpg',
    alt: 'Silk sarees cleaned and preserved with Vanzoo heirloom garment care',
    caption: 'Sarees & lehengas',
    icon: 'dress',
  },
  {
    src: '/images/service-shoes-bags-accessories.jpg',
    alt: 'Leather shoes and handbag cleaned and conditioned by Vanzoo accessory care',
    caption: 'Shoes & bags',
    icon: 'bag',
  },
  {
    src: '/images/service-curtain-cleaning.jpg',
    alt: 'Living room curtains professionally cleaned, deinstalled and reinstalled by Vanzoo',
    caption: 'Curtains & home',
    icon: 'bed',
  },
];

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
        intro={tariffIntro}
        image="/images/service-bespoke-suit-couture.jpg"
        imageAlt="Bespoke suit and evening dress cleaned and pressed by Vanzoo in Gurgaon"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="onDark" />
      </PageHeader>

      <Section tone="surface" size="sm">
        <MediaStrip items={COUTURE_STRIP} />
      </Section>

      <Section tone="surface" size="sm" className="pt-0">
        <PricingTable groups={coutureTariffs} />

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
