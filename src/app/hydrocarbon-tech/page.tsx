import Image from 'next/image';
import Link from 'next/link';
import { AppPromo } from '@/components/AppPromo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Hero } from '@/components/Hero';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import { TabbedExplainer } from '@/components/TabbedExplainer';
import { howItWorksSteps, hydrocarbon } from '@/content/marketing';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';

const CRUMBS = [{ name: 'Hydrocarbon Tech', href: '/hydrocarbon-tech/' }];

export const metadata = buildMetadata({
  title: 'Advanced Cleaning with Hydrocarbon Technology | Vanzoo',
  description:
    'Vanzoo’s hydrocarbon technology offers advanced, eco-friendly, fabric-safe cleaning solutions that ensure deep stain removal with minimal environmental impact.',
  path: '/hydrocarbon-tech/',
  image: hydrocarbon.hero.image,
  imageAlt: hydrocarbon.hero.imageAlt,
});

export default function HydrocarbonTechPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(hydrocarbon.faqs)]} />

      <Hero
        headline={hydrocarbon.hero.headline}
        subhead={hydrocarbon.hero.subhead}
        image={hydrocarbon.hero.image}
        imageAlt={hydrocarbon.hero.imageAlt}
        variant="band"
        secondaryCta={{ label: 'See couture care tariffs', href: '/couture-care-tariffs/' }}
        breadcrumbs={<Breadcrumbs crumbs={CRUMBS} tone="onDark" />}
      />

      {/* Why Hydrocarbon? / How It Works — alternating explainer rows */}
      {hydrocarbon.sections.map((section, index) => (
        <Section
          key={section.id}
          id={section.id}
          tone={index % 2 === 0 ? 'surface' : 'muted'}
          aria-labelledby={`${section.id}-heading`}
        >
          <div
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
              index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="media-frame aspect-[4/3]">
              <Image
                src={section.image}
                alt={section.imageAlt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="max-w-lg">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 id={`${section.id}-heading`} className="mt-3 text-display-md">
                {section.heading}
              </h2>
              <p className="mt-5 text-lead text-pretty text-neutral-body">{section.body}</p>
              {index === 1 ? (
                <div className="mt-8">
                  <EnquiryDialog label="Enquire Now" variant="button" />
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      ))}

      {/* Why Switch? — PERC comparison */}
      <Section tone="dark" aria-labelledby="comparison-heading">
        <SectionHeading
          id="comparison-heading"
          eyebrow={hydrocarbon.comparison.eyebrow}
          title={hydrocarbon.comparison.heading}
          align="center"
          tone="dark"
          className="mx-auto"
        />
        <IconFeatureGrid
          items={hydrocarbon.comparison.items}
          columns={4}
          tone="dark"
          className="mt-12"
        />
      </Section>

      {/* The nine-step process, as a tabbed explainer plus the source diagram */}
      <Section tone="surface" aria-labelledby="process-heading">
        <SectionHeading
          id="process-heading"
          eyebrow="Inside the process"
          title="What actually happens to your garment"
          intro="Every order runs the same nine steps, from collection through final quality inspection."
        />
        <div className="mt-14">
          <TabbedExplainer steps={howItWorksSteps} reverse />
        </div>

        {/* The same nine stages exist as a tall diagram and a wide strip. Each
            breakpoint gets the orientation that fits — and because the hidden
            one is `display: none`, only the visible version is in the
            accessibility tree, so the alt text is never announced twice. */}
        <figure className="mt-16">
          <div className="media-frame mx-auto max-w-sm lg:hidden">
            <Image
              src={hydrocarbon.processImage.src}
              alt={hydrocarbon.processImage.alt}
              width={824}
              height={1412}
              loading="lazy"
              sizes="(min-width: 640px) 24rem, 100vw"
              className="h-auto w-full"
            />
          </div>
          <div className="media-frame hidden bg-neutral-ink p-5 lg:block">
            <Image
              src="/images/tech-process-strip.png"
              alt={hydrocarbon.processImage.alt}
              width={2400}
              height={1188}
              loading="lazy"
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-4 text-center text-sm text-neutral-body">
            The full nine-step Vanzoo garment care process.
          </figcaption>
        </figure>

        <figure className="mx-auto mt-12 max-w-3xl">
          {/* Aspect matches the source exactly so object-contain leaves no bars. */}
          <div className="media-frame aspect-[2400/1458]">
            <Image
              src={hydrocarbon.sustainabilityImage.src}
              alt={hydrocarbon.sustainabilityImage.alt}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 48rem, 100vw"
              className="object-contain"
            />
          </div>
          <figcaption className="mt-4 text-center text-sm text-neutral-body">
            Where the environmental gains come from.
          </figcaption>
        </figure>
      </Section>

      <Section tone="muted">
        <AppPromo />
      </Section>

      <Section tone="surface" id="faq" aria-labelledby="hydrocarbon-faq-heading">
        <SectionHeading
          id="hydrocarbon-faq-heading"
          title="Frequently Asked Questions"
          intro="The technical questions we get asked most about hydrocarbon cleaning."
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <FAQAccordion faqs={hydrocarbon.faqs} groupName="hydrocarbon-faq" />
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-neutral-body">
          Ready to try it? See the{' '}
          <Link
            href="/couture-care-tariffs/"
            className="font-medium text-brand underline underline-offset-2"
          >
            couture care tariffs
          </Link>{' '}
          or{' '}
          <Link href="/contact-us/" className="font-medium text-brand underline underline-offset-2">
            get in touch
          </Link>{' '}
          with a question about a specific garment.
        </p>
      </Section>
    </>
  );
}
