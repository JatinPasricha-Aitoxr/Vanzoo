import Image from 'next/image';
import Link from 'next/link';
import { AreaCoverageGrid } from './AreaCoverageGrid';
import { Breadcrumbs } from './Breadcrumbs';
import { ComparisonTable } from './ComparisonTable';
import { CtaBanner } from './CtaBanner';
import { FAQAccordion } from './FAQAccordion';
import { FeatureGrid } from './FeatureGrid';
import { PageHeader } from './Hero';
import { IconFeatureGrid } from './IconFeatureGrid';
import { JsonLd } from './JsonLd';
import { PincodeChecker } from './PincodeChecker';
import { PopularItems } from './PopularItems';
import { ProcessTimeline } from './ProcessTimeline';
import { ServiceCard } from './ServiceCard';
import { Reveal, RevealGroup } from './ui/Reveal';
import { Section, SectionHeading } from './ui/Section';
import type { LandingPage } from '@/content/landing';
import { differentiators } from '@/content/marketing';
import { sharedProcess } from '@/content/productCare';
import { getService } from '@/content/services';
import { breadcrumbSchema, faqSchema, localBusinessSchema } from '@/lib/seo';
import { links, site, stores } from '@/lib/site';

/**
 * Shared layout for the "best dry cleaning" search landing pages. The two
 * pages differ in content and in which block leads after the checklist:
 * `near-me` puts stores + pincode first, `city` puts the technology first.
 */
export function LandingPageView({ page }: { page: LandingPage }) {
  const crumbs = [{ name: page.name, href: page.path }];
  const services = page.serviceIds.flatMap((id) => getService(id) ?? []);

  const whereWeAre = (
    <Section tone="muted" aria-labelledby="landing-coverage-heading" key="coverage">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="landing-coverage-heading"
            eyebrow={page.coverage.eyebrow}
            title={page.coverage.heading}
            intro={page.coverage.intro}
            className="max-w-none"
          />
          <div className="mt-8">
            <PincodeChecker />
          </div>
        </div>
        <ul className="grid content-start gap-4">
          {stores.map((store) => (
            <li key={store.id} className="rounded-card border border-neutral-line bg-white p-5">
              <p className="font-display font-semibold text-neutral-ink">{store.name}</p>
              <p className="eyebrow mt-1">{store.locality}</p>
              <address className="mt-2 not-italic text-sm leading-relaxed text-neutral-body">{store.address}</address>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Get directions <span aria-hidden="true">→</span>
                </a>
                <a href={`tel:${site.phoneHref}`} className="text-sm font-semibold text-brand hover:text-brand-dark">
                  Call {site.phone}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-14">
        <AreaCoverageGrid headingLevel="h3" showBlurb={page.focus === 'city'} />
      </div>
    </Section>
  );

  const technology = (
    <Section tone="dark" aria-labelledby="landing-tech-heading" key="tech">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="landing-tech-heading"
            eyebrow="Why Vanzoo"
            title={page.comparison.heading}
            intro={page.comparison.intro}
            tone="dark"
            className="max-w-none"
          />
          <div className="mt-10 text-neutral-ink">
            <ComparisonTable columns={page.comparison.columns} rows={page.comparison.rows} />
          </div>
          <Link
            href="/hydrocarbon-tech/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-gold-soft hover:text-white"
          >
            How hydrocarbon cleaning works <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Reveal variant="right" className="media-frame aspect-[4/5]">
          <Image
            src="/images/service-hydrocarbon-machine.jpg"
            alt="Closed-loop Italian hydrocarbon dry cleaning machine at Vanzoo, Gurgaon"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </Reveal>
      </div>
      <div className="mt-16">
        <IconFeatureGrid items={differentiators} columns={4} tone="dark" />
      </div>
    </Section>
  );

  return (
    <>
      <JsonLd data={[localBusinessSchema(), breadcrumbSchema(crumbs), faqSchema(page.faqs)]} />

      <PageHeader
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        intro={page.hero.intro}
        image={page.hero.image}
        imageAlt={page.hero.imageAlt}
      >
        <Breadcrumbs crumbs={crumbs} tone="dark" />
      </PageHeader>

      <Section tone="dark" size="sm" className="!pt-0 -mt-px" aria-label="Book a pickup">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/10 pt-8">
          <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-lg">
            Book free pickup
          </a>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-onDark btn-lg">
            WhatsApp us
          </a>
          <p className="text-sm text-white/80">Free pickup &amp; delivery · 3–5 day turnaround · Express available</p>
        </div>
      </Section>

      {/* What to look for */}
      <Section tone="surface" aria-labelledby="landing-checklist-heading">
        <SectionHeading
          id="landing-checklist-heading"
          eyebrow={page.checklist.eyebrow}
          title={page.checklist.heading}
          intro={page.checklist.intro}
        />
        <div className="mt-12">
          <FeatureGrid items={page.checklist.items} columns={3} numbered />
        </div>
      </Section>

      {page.focus === 'near-me' ? [whereWeAre, technology] : [technology, whereWeAre]}

      {/* Services */}
      <Section tone="surface" aria-labelledby="landing-services-heading">
        <SectionHeading
          id="landing-services-heading"
          eyebrow="Our services"
          title="What we clean"
          intro="The most requested services — every one with the same free pickup and delivery."
        />
        <RevealGroup as="ul" step={70} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} headingLevel="h3" />
          ))}
        </RevealGroup>
        <p className="mt-8 text-sm text-neutral-body">
          <Link href="/services/" className="font-medium text-brand underline underline-offset-2">
            See all services
          </Link>
        </p>
      </Section>

      {/* Nine-step process */}
      <Section tone="light" aria-labelledby="landing-process-heading">
        <SectionHeading
          id="landing-process-heading"
          eyebrow="Inside the Vanzoo process"
          title="Nine steps for every piece"
          intro="From doorstep pickup to protective packaging, every garment follows the same nine stages."
          align="center"
          className="mx-auto"
        />
        <div className="mt-14">
          <ProcessTimeline stages={sharedProcess.stages} />
        </div>
      </Section>

      {/* Prices */}
      <Section tone="surface" aria-labelledby="landing-items-heading">
        <SectionHeading
          id="landing-items-heading"
          eyebrow="Popular items"
          title="Pick an item, see the price"
          intro="Published, item-wise pricing — no minimum order, no hidden charges. Exclusive of GST."
        />
        <div className="mt-12">
          <PopularItems productIds={page.productIds} />
        </div>
        <p className="mt-8 text-sm text-neutral-body">
          Full list on the{' '}
          <Link href="/pricing/" className="font-medium text-brand underline underline-offset-2">
            pricing page
          </Link>
          .
        </p>
      </Section>

      {/* FAQ */}
      <Section tone="muted" aria-labelledby="landing-faq-heading">
        <SectionHeading id="landing-faq-heading" eyebrow="FAQ" title="Questions people ask" align="center" className="mx-auto" />
        <div className="mt-12">
          <FAQAccordion faqs={page.faqs} groupName={`${page.path.replaceAll('/', '')}-faq`} />
        </div>
      </Section>

      <Section tone="surface" size="sm">
        <CtaBanner
          heading={page.finalCta.heading}
          body={page.finalCta.body}
          secondary={{ label: 'See our tariffs', href: '/pricing/' }}
        />
      </Section>
    </>
  );
}
