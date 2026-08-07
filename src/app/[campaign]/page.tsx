import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { EnquiryForm } from '@/components/EnquiryForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Hero } from '@/components/Hero';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { PersonaScroller } from '@/components/PersonaScroller';
import { ServiceRow } from '@/components/ServiceRow';
import { TabbedExplainer } from '@/components/TabbedExplainer';
import { TrustStrip } from '@/components/TrustStrip';
import { Icon } from '@/components/ui/Icon';
import { Reveal, RevealGroup } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import {
  campaignBenefits,
  campaignOffer,
  campaignPricingCta,
  campaigns,
  getCampaign,
} from '@/content/campaigns';
import {
  enquiryIntro,
  faqIntro,
  homeFaqs,
  howItWorksIntro,
  howItWorksSteps,
  services,
  whyChooseBadges,
} from '@/content/marketing';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';
import { links } from '@/lib/site';

type Params = { params: { campaign: string } };

/**
 * Campaign landing pages.
 *
 * A single dynamic segment at the site root, matching only the fifteen known
 * campaign slugs. `dynamicParams = false` is doing real work here: without it
 * this route would swallow every unmatched top-level path and turn genuine 404s
 * into rendered pages.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ campaign: campaign.slug }));
}

export function generateMetadata({ params }: Params) {
  const campaign = getCampaign(params.campaign);
  if (!campaign) return {};

  return buildMetadata({
    title: `${campaign.headline} | Vanzoo`,
    description: campaign.description,
    path: `/${campaign.slug}/`,
    image: campaign.image,
    imageAlt: campaign.imageAlt,
  });
}

export default function CampaignPage({ params }: Params) {
  const campaign = getCampaign(params.campaign);
  if (!campaign) notFound();

  const crumbs = [{ name: campaign.headline, href: `/${campaign.slug}/` }];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(homeFaqs)]} />

      <Hero
        headline={[campaign.headline]}
        subhead={campaign.subhead}
        image={campaign.image}
        imageAlt={campaign.imageAlt}
        variant="band"
        secondaryCta={{ label: 'See our tariffs', href: '/couture-care-tariffs/' }}
        breadcrumbs={<Breadcrumbs crumbs={crumbs} tone="onDark" />}
      >
        <p className="mt-8 inline-flex items-center gap-2.5 rounded-pill bg-accent-gold px-5 py-2.5 text-sm font-semibold text-neutral-ink">
          <Icon name="sparkles" className="text-base" />
          {campaignOffer}
        </p>
      </Hero>
      <TrustStrip />

      {/* Benefits + booking form, side by side — the form is the point of the page. */}
      <Section tone="surface" id="book" aria-labelledby="campaign-book-heading">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal variant="left">
            <SectionHeading
              eyebrow="Why Vanzoo"
              title="Luxury fabric care, handled end to end"
              intro={campaign.subhead}
              className="max-w-none"
            />
            <RevealGroup as="ul" step={70} className="mt-10 space-y-3">
              {campaignBenefits.map((benefit) => (
                <li
                  key={benefit.label}
                  className="flex items-center gap-3.5 rounded-card border border-neutral-line bg-white p-4"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-light text-lg text-brand"
                  >
                    <Icon name={benefit.icon} />
                  </span>
                  <span className="text-[0.9375rem] font-medium text-neutral-ink">
                    {benefit.label}
                  </span>
                </li>
              ))}
            </RevealGroup>
          </Reveal>

          <Reveal variant="right" delay={90}>
            <SectionHeading
              id="campaign-book-heading"
              eyebrow={campaignOffer}
              title="Book a Pickup"
              intro={enquiryIntro}
              className="max-w-none"
            />
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Services */}
      <Section tone="muted" id="services" aria-labelledby="campaign-services-heading">
        <SectionHeading
          id="campaign-services-heading"
          eyebrow="What we do"
          title="Our Premium Fabric Care Services"
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

      {/* Why Choose Vanzoo */}
      <Section tone="surface" size="sm" aria-labelledby="campaign-why-heading">
        <SectionHeading
          id="campaign-why-heading"
          eyebrow="Why Choose VANZOO?"
          title="Dry cleaning built on safer science"
          align="center"
          className="mx-auto"
        />
        <IconFeatureGrid items={whyChooseBadges} columns={4} className="mt-12" />
      </Section>

      {/* How it works */}
      <Section tone="muted" id="how-it-works" aria-labelledby="campaign-how-heading">
        <SectionHeading
          id="campaign-how-heading"
          eyebrow="How It Works"
          title="Three steps, and your wardrobe is handled"
          intro={howItWorksIntro}
        />
        <div className="mt-14">
          <TabbedExplainer steps={howItWorksSteps} />
        </div>
      </Section>

      {/* Personas */}
      <Section tone="surface" aria-labelledby="campaign-personas-heading">
        <SectionHeading
          id="campaign-personas-heading"
          eyebrow="Preserving Style"
          title="Who we look after"
        />
        <div className="mt-12">
          <PersonaScroller />
        </div>
      </Section>

      {/* Pricing CTA */}
      <Section tone="dark" size="sm">
        <Reveal variant="scale" className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-accent-gold-soft">Pricing</p>
          <h2 className="mt-4 text-display-md text-white">{campaignPricingCta.heading}</h2>
          <p className="mt-3 text-lead text-white/75">{campaignPricingCta.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/couture-care-tariffs/" className="btn-inverse btn-lg gap-2">
              <Icon name="shirt" className="text-lg" />
              Couture care tariff
            </Link>
            <Link href="/steam-iron-tariffs/" className="btn-onDark btn-lg gap-2">
              <Icon name="jacket" className="text-lg" />
              Steam iron tariff
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section tone="surface" id="faq" aria-labelledby="campaign-faq-heading">
        <SectionHeading
          id="campaign-faq-heading"
          title="Frequently Asked Questions"
          intro={faqIntro}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <FAQAccordion faqs={homeFaqs} groupName={`${campaign.slug}-faq`} />
        </div>

        <div className="mt-14 text-center">
          <a
            href={links.bookPickup}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-lg gap-2"
          >
            Book Pickup
            <Icon name="arrowRight" className="arrow-nudge" />
          </a>
        </div>
      </Section>
    </>
  );
}
