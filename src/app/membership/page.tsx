import { Highlight } from '@/components/ui/Highlight';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { EnquiryForm } from '@/components/EnquiryForm';
import { JsonLd } from '@/components/JsonLd';
import { Mascot } from '@/components/Mascot';
import { PageHeader } from '@/components/Hero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { membership } from '@/content/marketing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { links, site } from '@/lib/site';

const CRUMBS = [{ name: 'Membership', href: '/membership/' }];

export const metadata = buildMetadata({
  title: 'Membership Club | Save up to 40% on Dry Cleaning | Vanzoo',
  description:
    'Join the Vanzoo Membership Club: load credits from ₹5,000 to ₹75,000 and get a flat 10% to 40% off premium dry cleaning, shoe, bag, curtain, carpet and sofa care in Gurgaon.',
  path: '/membership/',
});

export default function MembershipPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHeader seoH1="Best & Premium Dry Cleaning Membership in Gurgaon" eyebrow={membership.eyebrow} title={membership.heading} intro={membership.intro} image="/images/vanzoo/membership-hero.jpg" imageAlt="A Vanzoo wardrobe wall of suits, shirts, shoes, bags and soft toys with the message One Package Covers Entire Wardrobe" imagePosition="75% 50%" tall>
        <Breadcrumbs crumbs={CRUMBS} tone="dark" />
      </PageHeader>

      {/* Tiers */}
      <Section tone="dark" aria-labelledby="membership-tiers-heading">
        <SectionHeading
          id="membership-tiers-heading"
          eyebrow="Membership Club"
          title="Choose your club"
          intro="Load credits once and get a flat discount on every order for the validity period."
          align="center"
          tone="dark"
          className="mx-auto"
        />
        <div className="relative mx-auto mt-12 max-w-4xl">
          <Mascot
            className="pointer-events-none absolute -left-44 bottom-0 hidden w-40 2xl:block"
            sizes="160px"
          />
        <div className="overflow-x-auto rounded-card border border-accent-gold/60">
          <table className="w-full min-w-[34rem] border-collapse text-center text-white">
            <thead>
              <tr className="bg-accent-gold text-sm font-semibold uppercase tracking-[0.08em] text-brand-ink">
                <th scope="col" className="px-4 py-3.5">Club</th>
                <th scope="col" className="px-4 py-3.5">Credits (₹)</th>
                <th scope="col" className="px-4 py-3.5">Flat discount</th>
                <th scope="col" className="px-4 py-3.5">Validity</th>
              </tr>
            </thead>
            <tbody>
              {membership.tiers.map((tier) => (
                <tr key={tier.name} className="border-t border-accent-gold/30">
                  <th scope="row" className="px-4 py-4 text-sm font-medium uppercase tracking-[0.08em]">{tier.name}</th>
                  <td className="px-4 py-4 tabular-nums">₹{tier.credits.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 font-semibold tabular-nums text-accent-gold-soft">{tier.discount}% OFF</td>
                  <td className="px-4 py-4 text-sm uppercase tracking-[0.08em]">{tier.validity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        <div className="mt-10 text-center">
          <a href="#join" className="btn-gold btn-lg">Join the Membership Club</a>
        </div>
      </Section>

      {/* What all we do */}
      <Section tone="surface" aria-labelledby="membership-what-heading">
        <SectionHeading
          id="membership-what-heading"
          eyebrow="What all we do"
          title="One membership, every kind of care"
          align="center"
          className="mx-auto"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {membership.whatWeDo.map((item) => (
            <li key={item.title} className="overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift">
              <div className="media-frame aspect-[4/3]">
                <Image src={item.image} alt={item.title} fill loading="lazy" sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-display text-base font-semibold leading-snug text-neutral-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-body">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Why Vanzoo */}
      <Section tone="muted" aria-labelledby="membership-why-heading">
        <SectionHeading
          id="membership-why-heading"
          eyebrow="Why Vanzoo?"
          title="Care you can trust"
          align="center"
          className="mx-auto"
        />
        <ul className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {membership.why.map((item) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lift">
                <Image src={item.icon} alt="" width={44} height={44} className="h-11 w-11 object-contain" />
              </span>
              <p className="mt-4 text-sm font-semibold leading-snug text-neutral-ink">{item.title}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* App */}
      <Section tone="surface" size="sm" aria-labelledby="membership-app-heading">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 id="membership-app-heading" className="text-display-sm"><Highlight text={membership.app.heading} dark={false} /></h2>
          <p className="text-neutral-body">{membership.app.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={links.playStore} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
              Get it on Google Play
            </a>
            <a href={links.appStore} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
              Download on the App Store
            </a>
          </div>
        </div>
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
            <p className="mt-2 text-sm text-neutral-body">
              Or write to <a href={`mailto:${site.email}`} className="font-medium text-brand">{site.email}</a>
            </p>
          <Mascot className="mt-8 hidden w-44 lg:block" sizes="176px" />
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
