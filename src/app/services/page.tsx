import { withSeo } from '@/cms/withSeo';
import { Highlight } from '@/components/ui/Highlight';
import Image from 'next/image';
import Link from 'next/link';
import { HydrocarbonBand } from '@/components/HydrocarbonBand';
import { AreasSection } from '@/components/AreasSection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { VanzooProcess } from '@/components/VanzooProcess';
import { ServiceCard } from '@/components/ServiceCard';
import { RevealGroup, Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { hydrocarbon } from '@/content/marketing';
import { serviceEntries, servicesIntro } from '@/content/services';
import { breadcrumbSchema, buildMetadata, localBusinessSchema } from '@/lib/seo';

const CRUMBS = [{ name: 'Services', href: '/services/' }];

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: 'Dry Cleaning Services in Gurgaon | Suits to Sofas | Vanzoo',
  description:
    'Garment, saree, lehenga, shoe, bag, curtain, carpet, blanket and sofa dry cleaning in Gurgaon — hydrocarbon care, hand finishing, free pickup and delivery.',
  path: '/services/',
  image: '/images/persona-fashion-collectors.jpg',
  imageAlt: 'Designer garments displayed in a boutique, cared for by Vanzoo premium dry cleaning',
}));
}

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={[localBusinessSchema(), breadcrumbSchema(CRUMBS)]} />

      <PageHeader
        seoH1="Best & Premium Dry Cleaning Services in Gurgaon"
        eyebrow="What we do"
        title="Every service, one standard of care"
        intro={servicesIntro}
        image="/images/persona-fashion-collectors.jpg"
        imageAlt="Designer and limited-edition pieces displayed on mannequins in a fashion boutique"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="dark" />
      </PageHeader>

      {/* Full services grid */}
      <Section tone="surface" aria-label="All Vanzoo services">
        <RevealGroup as="ul" step={70} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceEntries.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </RevealGroup>
      </Section>

      {/* Seven-step process */}
      <VanzooProcess
        eyebrow="How every order runs"
        heading="Seven steps, whatever the service"
        showCtas={false}
      />

      <HydrocarbonBand id="services-tech-heading" />

      <AreasSection />

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
