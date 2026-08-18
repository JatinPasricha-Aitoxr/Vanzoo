import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { TariffGrid } from '@/components/TariffGrid';
import { coutureCatalog, steamIronCatalog, tariffIntro, tariffNote } from '@/content/pricing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

const CRUMBS = [{ name: 'Pricing', href: '/pricing/' }];

/** In-page jump targets — both catalogues live on this one page now. */
const JUMP_LINKS = [
  { href: '#couture-care-tariffs', label: 'Couture Care Tariffs' },
  { href: '#steam-iron-tariffs', label: 'Steam Iron & Pressing' },
] as const;

export const metadata = buildMetadata({
  title: 'Pricing | Couture Care & Steam Iron Tariffs | Vanzoo',
  description:
    'Vanzoo pricing for couture and bespoke suit care, sarees, lehengas, leather, footwear, curtains, carpets and steam-iron-only pressing — transparent per-item tariffs with free pickup and delivery in Gurgaon.',
  path: '/pricing/',
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHeader
        eyebrow="Pricing"
        title="Pricing"
        intro={`${tariffIntro} Add anything you need cleaned or pressed to your cart and send us the list — we'll confirm the quote and collect from your door, free, anywhere in Gurgaon.`}
        image="/images/garment-rail-couture.jpg"
        imageAlt="Rail of pastel couture blazers cleaned and pressed at the Vanzoo Gurgaon atelier"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="dark" />
      </PageHeader>

      {/* Jump to either catalogue — both are long enough that a visitor who
          only wants pressing shouldn't have to scroll past every couture row
          first. Plain in-page anchors: `scroll-behavior: smooth` and the
          `[id] { scroll-margin-top }` rule in globals.css already handle the
          rest, no client-side toggle state to keep in sync. */}
      <Section tone="surface" size="sm">
        <ul className="flex flex-wrap justify-center gap-3">
          {JUMP_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-block rounded-pill border border-neutral-line bg-white px-5 py-2.5 text-sm font-semibold text-neutral-ink transition-colors hover:border-brand/40 hover:text-brand"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" size="sm" id="couture-care-tariffs" aria-labelledby="couture-tariffs-heading">
        <SectionHeading
          id="couture-tariffs-heading"
          eyebrow="Couture Care"
          title="Couture Care Tariffs"
          intro="Full cleaning and finishing — for garments, ethnic wear, leather, footwear, carpets and home textiles."
        />
        <div className="mt-10">
          <TariffGrid catalog={coutureCatalog} />
        </div>
      </Section>

      <Section tone="muted" id="steam-iron-tariffs" aria-labelledby="steam-tariffs-heading">
        <SectionHeading
          id="steam-tariffs-heading"
          eyebrow="Steam & Iron"
          title="Steam Iron & Pressing Tariffs"
          intro="Pressing only — for garments that are already clean and simply need a professional finish."
        />
        <div className="mt-10">
          <TariffGrid catalog={steamIronCatalog} />
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-4 sm:grid-cols-2">
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
          Curious how we clean without water or harsh solvents? Read how{' '}
          <Link
            href="/hydrocarbon-tech/"
            className="font-medium text-brand underline underline-offset-2"
          >
            hydrocarbon technology
          </Link>{' '}
          protects delicate fibres, or browse{' '}
          <Link href="/services/" className="font-medium text-brand underline underline-offset-2">
            every service we offer
          </Link>
          .
        </p>
      </Section>

      <Section tone="muted" size="sm">
        <CtaBanner
          heading="Ready to book your service?"
          secondary={{ label: 'Talk to us first', href: '/contact-us/' }}
        />
      </Section>
    </>
  );
}
