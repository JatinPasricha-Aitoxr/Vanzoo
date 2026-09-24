import Image from 'next/image';
import Link from 'next/link';
import { AppPromo } from '@/components/AppPromo';
import { AreaCoverageGrid } from '@/components/AreaCoverageGrid';
import { BlogGrid } from '@/components/BlogCard';
import { DryCleaningProcess } from '@/components/DryCleaningProcess';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { EnquiryForm } from '@/components/EnquiryForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { GuaranteeBlock } from '@/components/GuaranteeBlock';
import { Hero } from '@/components/Hero';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { PersonaScroller } from '@/components/PersonaScroller';
import { ProcessRail } from '@/components/ProcessRail';
import { Reviews } from '@/components/Reviews';
import { RevealGroup } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ServiceRow } from '@/components/ServiceRow';
import { TabbedExplainer } from '@/components/TabbedExplainer';
import { TrustStrip } from '@/components/TrustStrip';
import { WeCareBanner } from '@/components/WeCareBanner';
import { WhyChoosePillars } from '@/components/WhyChoosePillars';
import { posts } from '@/content/blog';
import { reviewsIntro } from '@/content/reviews';
import {
  collage,
  enquiryIntro,
  faqIntro,
  heroOffer,
  homeFaqs,
  homeHero,
  services,
} from '@/content/marketing';
import { buildMetadata, faqSchema, localBusinessSchema } from '@/lib/seo';
import { areaGroups, links, serviceAreas, site } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Vanzoo – Luxury Fabric Care & Eco-Friendly Dry Cleaning',
  description:
    'Experience premium fabric care by Vanzoo using advanced Italian hydrocarbon technology—eco-conscious, gentle on fabrics, and powerful on tough everyday stains. Free pickup and delivery across Gurgaon.',
  path: '/',
  image: homeHero.image,
  imageAlt: homeHero.imageAlt,
});

export default function HomePage() {
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <JsonLd data={[localBusinessSchema(), faqSchema(homeFaqs)]} />

      <Hero
        headline={homeHero.headline}
        subhead={homeHero.subhead}
        image={homeHero.image}
        imageAlt={homeHero.imageAlt}
        video={homeHero.video}
        secondaryCta={{ label: 'See how it works', href: '#how-it-works' }}
        offer={heroOffer}
      />
      <TrustStrip />

      {/* 2 — Why Choose Vanzoo — sticky split-scroll pillars (rinse.com pattern) */}
      <WhyChoosePillars />

      {/* 3 — Services */}
      <Section tone="muted" id="services" aria-labelledby="services-heading">
        <SectionHeading
          id="services-heading"
          eyebrow="What we do"
          title="Our Premium Fabric Care Services"
          intro="Six services, one standard of care — each piece assessed individually before it goes anywhere near a machine."
        />
        <ul className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
          {services.map((service, index) => (
            <ServiceRow
              key={service.number}
              service={service}
              index={index}
              onEnquire={<EnquiryDialog subject={service.title} />}
            />
          ))}
        </ul>
      </Section>

      {/* 4 — The dry cleaning process (rinse.com pattern) */}
      <DryCleaningProcess id="how-it-works" />

      {/* 5 — Personas */}
      <Section tone="muted" aria-labelledby="personas-heading">
        <SectionHeading
          id="personas-heading"
          eyebrow="Preserving Style"
          title="Who we look after"
          intro="From boardroom power suits to heritage saris, we serve clients who expect more than clean clothes."
        />
        <div className="mt-12">
          <PersonaScroller />
        </div>
        <div className="mt-10">
          <EnquiryDialog label="Enquire Now" variant="button" />
        </div>
      </Section>

      {/* Photo-brick collage (§2.3.5) — used once, here. */}
      <section aria-label="Vanzoo fabric care in practice" className="pb-section-sm">
        <div className="shell">
          <RevealGroup
            variant="scale"
            step={70}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          >
            {collage.map((tile) => (
              <div key={tile.src} className={`media-frame group ${tile.span} ${tile.ratio}`}>
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="card-media object-cover"
                />
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Editorial statement band — the old site's "we care" banner as live type. */}
      <WeCareBanner />

      {/* 6 — Customer reviews */}
      <Section tone="muted" aria-labelledby="reviews-heading">
        <SectionHeading
          id="reviews-heading"
          eyebrow="Customer reviews"
          title="Trusted with Gurgaon's best-loved wardrobes"
          intro={reviewsIntro}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <Reviews />
        </div>
      </Section>

      {/* 8 — Guarantee */}
      <Section tone="dark" size="sm">
        <GuaranteeBlock />
      </Section>

      {/* 9 — App promo, on the dark band as the old site runs it */}
      <Section tone="dark">
        <AppPromo />
      </Section>

      {/* 10 — Areas we serve */}
      <Section tone="surface" aria-labelledby="areas-heading">
        <SectionHeading
          id="areas-heading"
          eyebrow="Where we deliver"
          title="Every area we serve in Gurgaon"
          intro={`Free pickup and delivery across ${serviceAreas.length} neighbourhoods in ${areaGroups.length} corridors — from DLF and Golf Course Road to New Gurgaon. Find yours below.`}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <AreaCoverageGrid headingLevel="h3" showBlurb={false} />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md">
            Book Pickup
          </a>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md">
            Chat on WhatsApp
          </a>
        </div>
        <p className="mt-6 text-center">
          <Link
            href="/areas-we-serve/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            Check your pincode & see full coverage details
            <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Section>

      {/* 11 — Blog preview */}
      <Section tone="surface" aria-labelledby="blog-preview-heading">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="blog-preview-heading"
            eyebrow="From the journal"
            title="Fabric care, explained"
            className="max-w-xl"
          />
          <Link
            href="/blogs/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            View all articles
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
              <path
                d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <div className="mt-12">
          <BlogGrid posts={latestPosts} />
        </div>
      </Section>

      {/* 12 — FAQ */}
      <Section tone="muted" id="faq" aria-labelledby="faq-heading">
        <SectionHeading
          id="faq-heading"
          title="Frequently Asked Questions"
          intro={faqIntro}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <FAQAccordion faqs={homeFaqs} groupName="home-faq" />
        </div>
      </Section>

      {/* 13 — Enquiry */}
      <Section tone="light" id="enquiry" aria-labelledby="enquiry-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="enquiry-heading"
              eyebrow="Get in touch"
              title="Request an Enquiry"
              intro={enquiryIntro}
            />

            {/* Direct routes beside the form, so the visitor who scrolled this
                far never has to hunt the footer for a phone number. */}
            <ul className="mt-8 space-y-3 text-[0.9375rem]">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="font-display text-lg font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  {site.phone}
                </a>
                <span className="ml-2 text-sm text-neutral-body">— fastest for same-day slots</span>
              </li>
              <li>
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand underline decoration-brand/35 underline-offset-2 transition-colors hover:decoration-brand"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-brand underline decoration-brand/35 underline-offset-2 transition-colors hover:decoration-brand"
                >
                  {site.email}
                </a>
              </li>
            </ul>

            <p className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-card border border-accent-gold/50 bg-white px-4 py-3 text-sm text-neutral-ink">
              <span className="font-semibold">New to Vanzoo?</span>
              {heroOffer.lead} —
              <span className="rounded-pill bg-accent-gold px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">
                {heroOffer.code}
              </span>
            </p>
          </div>
          <EnquiryForm />
        </div>
      </Section>
    </>
  );
}
