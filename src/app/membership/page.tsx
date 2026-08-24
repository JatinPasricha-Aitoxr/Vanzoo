import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { EnquiryForm } from '@/components/EnquiryForm';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { membership } from '@/content/marketing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

const CRUMBS = [{ name: 'Membership', href: '/membership/' }];

export const metadata = buildMetadata({
  title: 'Membership | Priority Fabric Care | Vanzoo',
  description:
    'Join the Vanzoo Membership for priority pickup slots, a dedicated member line, complimentary premium packaging and faster turnaround on every order.',
  path: '/membership/',
});

export default function MembershipPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHeader eyebrow={membership.eyebrow} title={membership.heading} intro={membership.intro}>
        <Breadcrumbs crumbs={CRUMBS} />
      </PageHeader>

      {/* Benefits */}
      <Section tone="surface" aria-labelledby="membership-benefits-heading">
        <SectionHeading
          id="membership-benefits-heading"
          eyebrow="What you get"
          title="Built for wardrobes that come back"
          align="center"
          className="mx-auto"
        />
        <IconFeatureGrid items={membership.benefits} columns={4} className="mt-12" />
      </Section>

      {/* How it works */}
      <Section tone="dark" aria-labelledby="membership-how-heading">
        <SectionHeading
          id="membership-how-heading"
          eyebrow="How it works"
          title="Three steps to join"
          align="center"
          tone="dark"
          className="mx-auto"
        />
        <ol className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {membership.howItWorks.map((step, index) => (
            <li
              key={step}
              className="rounded-card border border-white/15 bg-white/[0.06] p-6 text-center"
            >
              <span className="font-display text-2xl font-semibold text-accent-gold-soft">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/85">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Enquiry */}
      <Section tone="light" id="join" aria-labelledby="membership-join-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="membership-join-heading"
              eyebrow="Get in touch"
              title={membership.ctaHeading}
              intro={membership.ctaBody}
            />
            <p className="mt-8 text-[0.9375rem]">
              <a
                href={`tel:${site.phoneHref}`}
                className="font-display text-lg font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                {site.phone}
              </a>
              <span className="ml-2 text-sm text-neutral-body">— fastest way to join</span>
            </p>
          </div>
          <EnquiryForm />
        </div>
      </Section>

      <Section tone="surface" size="sm">
        <CtaBanner
          heading="Prefer to start with a pickup?"
          secondary={{ label: 'See our tariffs', href: '/pricing/' }}
        />
      </Section>
    </>
  );
}
