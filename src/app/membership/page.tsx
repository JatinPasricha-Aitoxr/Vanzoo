import { cmsOr } from '@/cms/override';
import { withSeo } from '@/cms/withSeo';
import { Highlight } from '@/components/ui/Highlight';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { EnquiryForm } from '@/components/EnquiryForm';
import { JsonLd } from '@/components/JsonLd';
import { MembershipTiers } from '@/components/MembershipTiers';
import { Mascot } from '@/components/Mascot';
import { PageHeader } from '@/components/Hero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { membership } from '@/content/marketing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { links, site } from '@/lib/site';

const CRUMBS = [{ name: 'Membership', href: '/membership/' }];

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: 'Dry Cleaning Membership Gurgaon | Save up to 40% | Vanzoo',
  description:
    'Join the Vanzoo Membership Club. Load ₹5,000 to ₹75,000 in credits and get a flat 10% to 40% off dry cleaning, shoe, bag, curtain and carpet care in Gurgaon.',
  path: '/membership/',
}));
}

function MembershipHeroCopy() {
  return (
    <div className="max-w-md xl:max-w-lg">
      <Breadcrumbs crumbs={CRUMBS} />
      <h1 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-ink sm:text-base">
        <Highlight text="Best & Premium Dry Cleaning Membership in Gurgaon" />
      </h1>
      <h2 id="membership-hero-heading" className="mt-3 text-display-lg text-neutral-ink">
        <Highlight text="Join the Vanzoo Membership Club" />
      </h2>
      <p className="mt-4 text-lead text-pretty text-neutral-body">
        Load credits once and save 10% to 40% on every order — garments, shoes, bags, curtains,
        carpets and more, with free pickup and delivery.
      </p>
      <a href="#choose-your-club" className="btn-gold btn-lg mt-7">
        Choose your club
      </a>
    </div>
  );
}

function MembershipPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      {/* Hero — the artwork is shown whole (its own "One Package Covers Entire
          Wardrobe" message sits on the right); our copy fills its blank left half. */}
      <section aria-labelledby="membership-hero-heading" className="bg-[#fbf3e6] pt-[var(--header-h)]">
        <div className="relative">
          <Image
            src="/images/vanzoo/membership-hero.jpg"
            alt="A Vanzoo wardrobe wall of suits, shirts, shoes, bags and soft toys with the message One Package Covers Entire Wardrobe"
            width={1600}
            height={600}
            priority
            sizes="100vw"
            className="h-auto w-full lg:min-h-[26rem] lg:object-cover lg:object-right"
          />
          <div className="px-5 pb-12 pt-8 sm:px-8 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[46%] lg:items-center lg:pb-0 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-4 lg:pt-0">
            <MembershipHeroCopy />
          </div>
        </div>
      </section>

      {/* Tiers */}
      <Section tone="dark" id="choose-your-club" aria-labelledby="membership-tiers-heading">
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
          <MembershipTiers />
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

/** A page published from the builder at /membership/ replaces this built-in version. */
export default cmsOr('/membership/', MembershipPage);
