import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { MediaStrip, type StripItem } from '@/components/MediaStrip';
import { PageHeader } from '@/components/Hero';
import { PricingTable } from '@/components/PricingTable';
import { Section } from '@/components/ui/Section';
import { steamIronTariffs, tariffIntro, tariffNote } from '@/content/pricing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

const CRUMBS = [{ name: 'Steam Iron Tariffs', href: '/steam-iron-tariffs/' }];

const STEAM_STRIP: readonly StripItem[] = [
  {
    src: '/images/persona-corporate-professionals.jpg',
    alt: 'Freshly pressed business shirts on a wardrobe rail after Vanzoo steam ironing',
    caption: 'Shirts & trousers',
    icon: 'shirt',
  },
  {
    src: '/images/service-bespoke-suit-couture.jpg',
    alt: 'Suit and evening dress steam pressed and hung by Vanzoo in Gurgaon',
    caption: 'Coats & jackets',
    icon: 'jacket',
  },
  {
    src: '/images/persona-heirlooms.jpg',
    alt: 'Silk sarees steam pressed with a professional finish by Vanzoo',
    caption: 'Sarees & ethnic',
    icon: 'dress',
  },
  {
    src: '/images/process-delivered-pressed.jpg',
    alt: 'Knitwear pressed, finished and hung ready for Vanzoo doorstep delivery',
    caption: 'Home textiles',
    icon: 'bed',
  },
];

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
        intro={tariffIntro}
        image="/images/process-delivered-pressed.jpg"
        imageAlt="Knitwear steam pressed and finished by hand at Vanzoo"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="onDark" />
      </PageHeader>

      <Section tone="surface">
        <p className="max-w-2xl text-lead text-pretty text-neutral-body">
          Pressing only — for garments that are already clean and simply need a professional
          finish. For cleaning and finishing together, see the couture care tariffs.
        </p>

        <MediaStrip items={STEAM_STRIP} className="mt-10" />

        <div className="mt-14">
          <PricingTable groups={steamIronTariffs} />
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
