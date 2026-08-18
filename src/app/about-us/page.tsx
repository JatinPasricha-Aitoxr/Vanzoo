import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { about, differentiators } from '@/content/marketing';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

const CRUMBS = [{ name: 'About Us', href: '/about-us/' }];

export const metadata = buildMetadata({
  title: 'About Vanzoo | Premium Fabric Care & Eco Cleaning Experts',
  description:
    'Vanzoo, a unit of Vaaruni Ventures LLP, blends couture-level precision with Italian hydrocarbon technology for luxury fabric care and eco-friendly dry cleaning in Gurgaon.',
  path: '/about-us/',
  image: about.image,
  imageAlt: about.imageAlt,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <PageHeader
        eyebrow="About Us"
        title={about.heading}
        intro="Luxury deserves reverence — and a process built to earn it."
      >
        <Breadcrumbs crumbs={CRUMBS} />
      </PageHeader>

      {/* Why we started Vanzoo — 2-col text/image */}
      <Section tone="surface" aria-labelledby="story-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="media-frame aspect-[4/3]">
            <Image
              src={about.image}
              alt={about.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-lg">
            <h2 id="story-heading" className="text-display-md">
              Why we started Vanzoo
            </h2>
            <p className="mt-5 text-lead text-pretty text-neutral-body">{about.intro}</p>
          </div>
        </div>
      </Section>

      {/* Three pillars */}
      <Section tone="muted" aria-labelledby="pillars-heading">
        <SectionHeading
          id="pillars-heading"
          eyebrow="How we work"
          title="Craft, technology and responsibility"
          align="center"
          className="mx-auto"
        />
        <IconFeatureGrid items={about.pillars} columns={3} className="mt-12" />
      </Section>

      {/* Philosophy */}
      <Section tone="dark" size="sm" aria-labelledby="philosophy-heading">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-accent-gold-soft">{about.philosophy.heading}</p>
          <ul className="mt-8 space-y-6">
            {about.philosophy.statements.map((statement) => (
              <li
                key={statement}
                className="font-display text-2xl font-semibold leading-snug text-white text-pretty sm:text-3xl"
              >
                {statement}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Who we serve — dark band with the clientele made visible, as the old
          site stages it, rather than a floating heading on white. */}
      <Section tone="dark" aria-labelledby="serve-heading">
        <SectionHeading
          id="serve-heading"
          title={about.whoWeServe.heading}
          intro={about.whoWeServe.body}
          align="center"
          tone="dark"
          className="mx-auto"
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="media-frame aspect-[4/3] bg-brand-dark">
            <Image
              src="/images/persona-corporate-professionals.jpg"
              alt="Executive selecting a freshly dry-cleaned shirt from a wardrobe rail of business wear"
              fill
              loading="lazy"
              sizes="(min-width: 640px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="media-frame aspect-[4/3] bg-brand-dark">
            <Image
              src="/images/persona-heirlooms.jpg"
              alt="Two generations in heritage silk sarees preserved with museum-grade Vanzoo care"
              fill
              loading="lazy"
              sizes="(min-width: 640px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Values row, reusing the homepage differentiators */}
      <Section tone="light" aria-labelledby="values-heading">
        <SectionHeading
          id="values-heading"
          title="What Makes VANZOO Different?"
          align="center"
          className="mx-auto"
        />
        <IconFeatureGrid items={differentiators} columns={4} className="mt-12" />
      </Section>

      <Section tone="surface" size="sm">
        <CtaBanner secondary={{ label: 'See couture care tariffs', href: '/pricing/' }} />
      </Section>
    </>
  );
}
