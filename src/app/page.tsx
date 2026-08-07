import Image from 'next/image';
import Link from 'next/link';
import { AppPromo } from '@/components/AppPromo';
import { BlogGrid } from '@/components/BlogCard';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { EnquiryForm } from '@/components/EnquiryForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { GuaranteeBlock } from '@/components/GuaranteeBlock';
import { Hero } from '@/components/Hero';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { PersonaScroller } from '@/components/PersonaScroller';
import { Icon } from '@/components/ui/Icon';
import { RevealGroup } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ServiceRow } from '@/components/ServiceRow';
import { TabbedExplainer } from '@/components/TabbedExplainer';
import { TrustStrip } from '@/components/TrustStrip';
import { posts } from '@/content/blog';
import {
  collage,
  differentiators,
  enquiryIntro,
  faqIntro,
  homeFaqs,
  homeHero,
  howItWorksIntro,
  howItWorksSteps,
  services,
  whyChooseBadges,
} from '@/content/marketing';
import { buildMetadata, faqSchema, localBusinessSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Vanzoo – Luxury Fabric Care & Eco-Friendly Dry Cleaning',
  description:
    'Experience premium fabric care by Vanzoo using advanced Italian hydrocarbon technology—eco-conscious, gentle on fabrics, and powerful on tough everyday stains.',
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
        secondaryCta={{ label: 'See how it works', href: '#how-it-works' }}
      />
      <TrustStrip />

      {/* 2 — Why Choose Vanzoo */}
      <Section tone="surface" size="sm" aria-labelledby="why-choose-heading">
        <SectionHeading
          id="why-choose-heading"
          eyebrow="Why Choose VANZOO?"
          title="Dry cleaning built on safer science"
          align="center"
          className="mx-auto"
        />
        <IconFeatureGrid items={whyChooseBadges} columns={4} className="mt-12" />
      </Section>

      {/* 3 — Services */}
      <Section tone="muted" id="services" aria-labelledby="services-heading">
        <SectionHeading
          id="services-heading"
          eyebrow="What we do"
          title="Our Premium Fabric Care Services"
          intro="Six services, one standard of care — each piece assessed individually before it goes anywhere near a machine."
        />
        <ul className="mt-16 space-y-20 lg:space-y-24">
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

      {/* 4 — How It Works */}
      <Section tone="surface" id="how-it-works" aria-labelledby="how-it-works-heading">
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="How It Works"
          title="Three steps, and your wardrobe is handled"
          intro={howItWorksIntro}
        />
        <div className="mt-14">
          <TabbedExplainer steps={howItWorksSteps} />
        </div>
      </Section>

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
      <section aria-label="Vanzoo fabric care in practice" className="pb-section">
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

      {/* 6 — What Makes Vanzoo Different */}
      <Section tone="light" aria-labelledby="different-heading">
        <SectionHeading
          id="different-heading"
          title="What Makes VANZOO Different?"
          align="center"
          className="mx-auto"
        />
        <IconFeatureGrid items={differentiators} columns={4} className="mt-12" />
      </Section>

      {/* 7 — Guarantee */}
      <Section tone="dark" size="sm">
        <GuaranteeBlock />
      </Section>

      {/* 8 — App promo */}
      <Section tone="surface">
        <AppPromo />
      </Section>

      {/* 9 — FAQ */}
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

      {/* 10 — Blog preview */}
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
            className="link-underline group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors duration-200 hover:text-brand-dark"
          >
            View all articles
            <Icon name="arrowRight" className="arrow-nudge" />
          </Link>
        </div>
        <div className="mt-12">
          <BlogGrid posts={latestPosts} />
        </div>
      </Section>

      {/* 11 — Enquiry */}
      <Section tone="light" id="enquiry" aria-labelledby="enquiry-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <SectionHeading
            id="enquiry-heading"
            eyebrow="Get in touch"
            title="Request an Enquiry"
            intro={enquiryIntro}
          />
          <EnquiryForm />
        </div>
      </Section>
    </>
  );
}
