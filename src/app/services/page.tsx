import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { AreaCoverageGrid } from '@/components/AreaCoverageGrid';
import { NineStepProcess } from '@/components/NineStepProcess';
import { OfferBand } from '@/components/OfferBand';
import { SectionCtas } from '@/components/SectionCtas';
import { videoFor } from '@/lib/videos';
import { ServiceCard } from '@/components/ServiceCard';
import { RevealGroup, Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { hydrocarbon } from '@/content/marketing';
import { serviceEntries, servicesIntro } from '@/content/services';
import { breadcrumbSchema, buildMetadata, localBusinessSchema } from '@/lib/seo';

const CRUMBS = [{ name: 'Services', href: '/services/' }];

export const metadata = buildMetadata({
  title: 'Premium Laundry & Dry Cleaning Services in Gurgaon | Vanzoo',
  description:
    'Every Vanzoo service in one place — couture and bespoke suit care, silks and delicates, sarees and lehengas, shoes, bags and leather, curtains, carpets, steam iron and express, with free pickup and delivery across Gurgaon.',
  path: '/services/',
  image: '/images/persona-fashion-collectors.jpg',
  imageAlt: 'Designer garments displayed in a boutique, cared for by Vanzoo premium dry cleaning',
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={[localBusinessSchema(), breadcrumbSchema(CRUMBS)]} />

      <PageHeader
        eyebrow="What we do"
        title="Best Dry Cleaning Services in Gurgaon — Every Service, One Standard of Care"
        intro={servicesIntro}
        image="/images/persona-fashion-collectors.jpg"
        imageAlt="Designer and limited-edition pieces displayed on mannequins in a fashion boutique"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="dark" />
      </PageHeader>

      {/* Headline + all-services video */}
      <Section tone="light" size="sm" aria-labelledby="services-lead-heading">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div>
            <h2 id="services-lead-heading" className="text-display-sm">
              From <span className="hl">garments, shoes, handbags</span> to{' '}
              <span className="hl-green">home textiles</span> — professionally dry cleaned with one
              standard of care
            </h2>
            <p className="mt-4 text-lead text-pretty text-neutral-body">
              Premium <mark className="hl">dry cleaning</mark> with Italian hydrocarbon technology,
              hand finishing and free doorstep pickup and delivery across Gurgaon.
            </p>
            <SectionCtas />
          </div>
          {videoFor('services') ? (
            <video
              src="/videos/services.mp4"
              controls
              muted
              loop
              playsInline
              preload="metadata"
              className="aspect-video w-full rounded-card bg-brand-ink object-cover shadow-lift"
            />
          ) : (
            <div className="media-frame relative aspect-video">
              <Image src="/images/client/store-interior-mascot.jpg" alt="Inside the Vanzoo store — every service, one standard of care" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
            </div>
          )}
        </div>
      </Section>

      {/* Full services grid */}
      <Section tone="surface" aria-label="All Vanzoo services">
        <RevealGroup as="ul" step={70} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceEntries.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </RevealGroup>
        <SectionCtas />
      </Section>

      {/* Nine-step process */}
      <Section tone="muted" aria-labelledby="services-process-heading">
        <SectionHeading
          id="services-process-heading"
          eyebrow="How every order runs"
          title="Nine steps, whatever the service"
          align="center"
          className="mx-auto"
        />
        <div className="mt-14">
          <NineStepProcess />
        </div>
        <SectionCtas className="justify-center" />
      </Section>

      {/* Hydrocarbon technology band */}
      <Section tone="dark" aria-labelledby="services-tech-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <p className="eyebrow text-accent-gold-soft">{hydrocarbon.sections[0].eyebrow}</p>
            <h2 id="services-tech-heading" className="mt-3 text-display-md text-white">
              One technology behind every service
            </h2>
            <p className="mt-4 text-lead text-pretty text-white/75">
              {hydrocarbon.sections[0].body}
            </p>
            <Link href="/hydrocarbon-tech/" className="btn-inverse btn-md mt-8">
              Explore hydrocarbon tech
            </Link>
          </Reveal>
          <Reveal variant="scale" delay={90} className="media-frame aspect-[4/3] bg-brand-dark">
            <Image
              src="/images/tech-hydrocarbon-machine.jpg"
              alt="Closed-loop hydrocarbon dry cleaning machine that recycles 99% of solvent each cycle"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 46vw, 90vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* Areas + pricing */}
      <Section tone="surface" aria-labelledby="services-areas-heading">
        <SectionHeading
          id="services-areas-heading"
          eyebrow="Where we deliver"
          title={<>Free pickup & delivery across <span className="hl">Gurgaon</span></>}
          intro="Find your neighbourhood — coverage is confirmed when you book."
        />
        <div className="mt-10">
          <AreaCoverageGrid headingLevel="h3" showBlurb={false} />
        </div>
        <SectionCtas />
      </Section>

      <Section tone="muted" size="sm" aria-labelledby="services-pricing-heading">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <SectionHeading
            id="services-pricing-heading"
            eyebrow="Pricing"
            title="Transparent, item-wise pricing"
            intro="Every service has a published starting price. WhatsApp us to know the actual price for your garment."
          />
          <Link href="/pricing/" className="btn-primary btn-lg">See all pricing</Link>
        </div>
      </Section>

      <OfferBand />

      <Section tone="surface" size="sm">
        <CtaBanner
          heading="Not sure which service your piece needs?"
          body="Book a pickup and we'll assess it on collection — or send a photo on WhatsApp and we'll tell you before you book. Free pickup and delivery across Gurgaon."
          secondary={{ label: 'See our tariffs', href: '/pricing/' }}
        />
      </Section>
    </>
  );
}
