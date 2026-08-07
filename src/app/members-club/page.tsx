import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppPromo } from '@/components/AppPromo';
import { CtaBanner } from '@/components/CtaBanner';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { Reveal, RevealGroup } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import {
  membership,
  membershipReasons,
  membershipServices,
  membershipTiers,
} from '@/content/membership';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { links, SITE_URL } from '@/lib/site';
import { cn } from '@/lib/cn';

const CRUMBS = [{ name: 'Members Club', href: '/members-club/' }];

export const metadata = buildMetadata({
  title: 'Members Club | Prepaid Credits & Up to 40% Off | Vanzoo',
  description:
    'Join the Vanzoo Members Club — prepaid credit tiers from ₹5,000 to ₹75,000 with 10% to 40% off every order, plus free pickup and delivery across Delhi NCR.',
  path: '/members-club/',
  image: membership.image,
  imageAlt: membership.imageAlt,
});

export default function MembersClubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(CRUMBS),
          {
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            '@id': `${SITE_URL}/members-club/#catalog`,
            name: 'Vanzoo Members Club',
            url: `${SITE_URL}/members-club/`,
            itemListElement: membershipTiers.map((tier, index) => ({
              '@type': 'Offer',
              position: index + 1,
              name: `${tier.name} — ${tier.discount}`,
              description: `${tier.credits} in credits, valid ${tier.validity.toLowerCase()}.`,
              priceCurrency: 'INR',
              price: tier.credits.replace(/[₹,]/g, ''),
              url: links.bookPickup,
            })),
          },
        ]}
      />

      <Hero
        headline={membership.headline}
        subhead={membership.subhead}
        image={membership.image}
        imageAlt={membership.imageAlt}
        variant="band"
        primaryCta={{ label: 'Join the club', href: links.bookPickup, external: true }}
        secondaryCta={{ label: 'See our tariffs', href: '/couture-care-tariffs/' }}
        breadcrumbs={<Breadcrumbs crumbs={CRUMBS} tone="onDark" />}
      />

      {/* Membership tiers */}
      <Section tone="surface" aria-labelledby="tiers-heading">
        <SectionHeading
          id="tiers-heading"
          eyebrow="Membership Club"
          title="Buy credits once. Save on everything after."
          intro="Top up your account and every order draws down against it at your tier's discount. The larger the credit, the deeper the saving — and from Pinnacle upward, the credits never expire."
        />

        {/* Cards below lg, a table above it. The same six rows either way: at
            narrow widths a six-column table forces a horizontal scroll that
            hides the discount, which is the column people came to compare. */}
        <RevealGroup
          as="ul"
          step={70}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:hidden"
        >
          {membershipTiers.map((tier) => (
            <li
              key={tier.name}
              className={cn(
                'card-lift rounded-card border p-6',
                tier.featured
                  ? 'border-brand bg-brand-tint'
                  : 'border-neutral-line bg-white',
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
                <span className="font-display text-lg font-semibold text-accent-gold-ink">
                  {tier.discount}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-body">Credits</dt>
                  <dd className="font-semibold tabular-nums text-neutral-ink">
                    {tier.credits}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-body">Validity</dt>
                  <dd className="font-semibold text-neutral-ink">{tier.validity}</dd>
                </div>
              </dl>
            </li>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 hidden overflow-hidden rounded-card border border-neutral-line lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Vanzoo Members Club tiers, credits, discount and validity
            </caption>
            <thead>
              <tr className="bg-brand text-white">
                <th scope="col" className="px-6 py-4 font-display text-base font-semibold">
                  Club
                </th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold">
                  Credits
                </th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold">
                  Flat Discount
                </th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold">
                  Validity
                </th>
              </tr>
            </thead>
            <tbody>
              {membershipTiers.map((tier, index) => (
                <tr
                  key={tier.name}
                  className={cn(
                    'border-t border-neutral-line transition-colors',
                    tier.featured
                      ? 'bg-brand-tint'
                      : index % 2 === 1
                        ? 'bg-neutral-muted'
                        : 'bg-white',
                  )}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-display text-base font-semibold text-neutral-ink"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      {tier.name}
                      {tier.featured ? (
                        <span className="rounded-pill bg-brand px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-white">
                          Never expires
                        </span>
                      ) : null}
                    </span>
                  </th>
                  <td className="px-6 py-4 text-[0.9375rem] tabular-nums text-neutral-body">
                    {tier.credits}
                  </td>
                  <td className="px-6 py-4 text-[0.9375rem] font-semibold text-accent-gold-ink">
                    {tier.discount}
                  </td>
                  <td className="px-6 py-4 text-[0.9375rem] text-neutral-body">
                    {tier.validity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <div className="mt-10">
          <a
            href={links.bookPickup}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-lg gap-2"
          >
            Book Now
            <Icon name="arrowRight" className="arrow-nudge" />
          </a>
        </div>
      </Section>

      {/* What all we do */}
      <Section tone="muted" aria-labelledby="club-services-heading">
        <SectionHeading
          id="club-services-heading"
          eyebrow="What all we do"
          title="Everything your credits cover"
          align="center"
          className="mx-auto"
        />
        <RevealGroup
          as="ul"
          step={70}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {membershipServices.map((service) => (
            <li
              key={service.title}
              className="card-lift group rounded-card border border-neutral-line bg-white p-6 hover:border-brand/35"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 items-center justify-center rounded-card bg-brand-light text-2xl text-brand"
              >
                <Icon name={service.icon} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-neutral-body">
                {service.body}
              </p>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* Why Vanzoo */}
      <Section tone="dark" aria-labelledby="club-why-heading">
        <SectionHeading
          id="club-why-heading"
          eyebrow="Why Vanzoo?"
          title="What every member gets as standard"
          align="center"
          tone="dark"
          className="mx-auto"
        />
        <RevealGroup
          as="ul"
          step={60}
          className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {membershipReasons.map((reason) => (
            <li
              key={reason.label}
              className="flex items-center gap-3 rounded-card border border-white/15 bg-white/[0.06] p-4"
            >
              <Icon name={reason.icon} className="text-xl text-accent-gold" />
              <span className="text-[0.9375rem] font-medium text-white">{reason.label}</span>
            </li>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="surface">
        <AppPromo />
      </Section>

      <Section tone="muted" size="sm">
        <CtaBanner
          heading="Ready to join the Members Club?"
          body="Top up once, then draw down at your tier's discount on every order — with free pickup and delivery across Delhi, Gurugram and the NCR."
          secondary={{ label: 'Talk to us first', href: '/contact-us/' }}
        />
      </Section>
    </>
  );
}
