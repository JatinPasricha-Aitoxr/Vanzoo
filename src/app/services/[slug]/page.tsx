import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AreaCoverageGrid } from '@/components/AreaCoverageGrid';
import { NineStepProcess } from '@/components/NineStepProcess';
import { OfferBand } from '@/components/OfferBand';
import { SectionCtas } from '@/components/SectionCtas';
import { highlight } from '@/lib/highlight';
import { videoFor } from '@/lib/videos';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { PincodeChecker } from '@/components/PincodeChecker';
import { ServiceCard } from '@/components/ServiceCard';
import { TariffGrid } from '@/components/TariffGrid';
import { RevealGroup, Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { coutureCatalog, steamIronCatalog, type TariffCatalog } from '@/content/pricing';
import {
  getService,
  relatedServices,
  serviceEntries,
  type ServiceEntry,
} from '@/content/services';
import { breadcrumbSchema, buildMetadata, serviceSchema } from '@/lib/seo';

type Params = { params: { slug: string } };

/** All services are static; an unknown slug is a 404, not a runtime render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceEntries.map((service) => ({ slug: service.id }));
}

export function generateMetadata({ params }: Params) {
  const service = getService(params.slug);
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle ?? `${service.title} in Gurgaon | Vanzoo`,
    description: `${service.body} Free pickup and delivery across Gurgaon.`.slice(0, 300),
    path: `/services/${service.id}/`,
    image: service.heroImage ?? service.image,
    imageAlt: service.heroImageAlt ?? service.imageAlt,
  });
}

/** Narrows a full tariff catalogue to the one group (or all groups) a service
 *  wants to preview, so the same TariffGrid the tariff pages use — full "Add to
 *  Cart" cards included — can render just the rows relevant here. */
function previewCatalog(preview: NonNullable<ServiceEntry['tariffPreview']>): TariffCatalog {
  const source = preview.catalogId === 'couture' ? coutureCatalog : steamIronCatalog;
  if (!preview.groupId) return source;
  const groups = source.groups.filter((group) => group.id === preview.groupId);
  return { ...source, groups };
}

export default function ServiceDetailPage({ params }: Params) {
  const service = getService(params.slug);
  if (!service) notFound();

  const crumbs = [
    { name: 'Services', href: '/services/' },
    { name: service.title, href: `/services/${service.id}/` },
  ];
  const related = relatedServices(service);
  const tariffTable = service.tariffPreview ? previewCatalog(service.tariffPreview) : null;
  const video = videoFor(service.id);
  const h1 = service.h1 ?? service.pageHeadline ?? service.title;

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            slug: service.id,
            title: service.title,
            description: service.body,
            image: service.heroImage ?? service.image,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />

      <PageHeader
        eyebrow="Services"
        title={h1}
        intro={service.contentHook ?? service.body}
        image={service.heroImage ?? service.image}
        imageAlt={service.heroImageAlt ?? service.imageAlt}
      >
        <Breadcrumbs crumbs={crumbs} tone="dark" />
      </PageHeader>

      {/* What it is, and what's included */}
      <Section tone="surface" aria-labelledby="service-detail-heading">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <Reveal variant="left">
            <h2 id="service-detail-heading" className="text-display-sm">
              <span className="hl">{service.pageHeadline ?? `How we care for ${service.title}`}</span>
            </h2>
            <p className="mt-4 text-lead text-pretty text-neutral-body">
              {highlight(service.longBody, service.highlight)}
            </p>

            <ul className="mt-8 space-y-3.5">
              {service.highlights.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[0.9375rem] leading-relaxed text-neutral-ink">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <SectionCtas className="!mt-9" />
            <Link
              href={service.tariffHref}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              {service.tariffLabel} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          {/* The service's own video plays here when one has been added to
              /public/videos/<slug>.mp4; otherwise its photograph. */}
          <Reveal variant="right" delay={90} className="media-frame aspect-[4/5] bg-brand-light lg:aspect-[3/4]">
            {video ? (
              <video
                src={video}
                poster={service.image}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full bg-brand-ink object-cover"
              />
            ) : (
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover"
              />
            )}
          </Reveal>
        </div>
      </Section>

      {/* Hydrocarbon explainer — on the garment-care pages, where it matters most */}
      {['couture-care', 'delicate-fabrics', 'ethnic-wear'].includes(service.id) ? (
        <Section tone="light" size="sm" aria-labelledby="service-hydrocarbon-heading">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <p className="eyebrow">Hydrocarbon technology</p>
              <h2 id="service-hydrocarbon-heading" className="mt-3 text-display-sm">
                Why <span className="hl-green">hydrocarbon dry cleaning</span> is gentler on your garments
              </h2>
              <p className="mt-4 text-lead text-pretty text-neutral-body">
                Vanzoo uses an Italian, closed-loop <mark className="hl">hydrocarbon</mark> system — no
                petrol wash, no harsh perchloroethylene (PERC) odour. Fabrics keep their softness,
                colour and shape, and your clothes come back smelling of nothing but fresh.
              </p>
              <SectionCtas />
              <Link href="/hydrocarbon-tech/" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark">
                How hydrocarbon cleaning works <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="media-frame relative aspect-[16/10]">
              <Image src="/images/client/machine-operator.jpg" alt="Vanzoo operator running the hydrocarbon dry cleaning machine" fill loading="lazy" sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
            </div>
          </div>
        </Section>
      ) : null}

      {/* How Vanzoo does it — the same nine steps on every service page */}
      <Section tone="muted" id="how-it-works" aria-labelledby="service-how-heading">
        <SectionHeading
          id="service-how-heading"
          eyebrow="The Vanzoo way"
          title={<>How Vanzoo does <span className="hl">dry cleaning</span> for you</>}
          intro="Nine steps, whatever the service — every piece assessed, treated, finished and delivered with the same standard of care."
        />
        <div className="mt-10">
          <NineStepProcess />
        </div>
        <SectionCtas />
      </Section>

      {/* Pricing preview, where the service has a per-item tariff */}
      {tariffTable ? (
        <Section tone="surface" aria-labelledby="service-pricing-heading">
          <SectionHeading
            id="service-pricing-heading"
            eyebrow="Pricing"
            title={`${service.title} tariffs (starts from)`}
            intro="Add what you need to your cart and send us the list — we'll confirm the quote and collect from your door, free, anywhere in Gurgaon. WhatsApp us to know the actual price for your garment."
          />
          <div className="mt-10">
            <TariffGrid catalog={tariffTable} />
          </div>
          <p className="mt-10 text-sm text-neutral-body">
            Looking for the complete list? See the{' '}
            <Link
              href={service.tariffHref}
              className="font-medium text-brand underline underline-offset-2"
            >
              full {service.tariffLabel.replace(/^View /i, '').replace(/^See /i, '')}
            </Link>
            .
          </p>
          <SectionCtas className="!mt-6" />
        </Section>
      ) : null}

      {/* Coverage check — only where the service itself is about pickup coverage. */}
      {service.id === 'pickup-delivery' ? (
        <Section tone="muted" aria-labelledby="service-coverage-heading">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                id="service-coverage-heading"
                eyebrow="Coverage"
                title="Check if we collect from your area"
                intro="Every Gurgaon pincode starts 122. Enter yours below, or see the full list of neighbourhoods we cover."
                className="max-w-none"
              />
              <Link
                href="/areas-we-serve/"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                See every area we serve
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <PincodeChecker />
          </div>
        </Section>
      ) : null}

      {/* Areas we serve */}
      <Section tone="muted" aria-labelledby="service-areas-heading">
        <SectionHeading
          id="service-areas-heading"
          eyebrow="Where we deliver"
          title={<>{service.onSite ? 'On-site service' : 'Free pickup & delivery'} across <span className="hl">Gurgaon</span></>}
          intro="Find your neighbourhood below — coverage is confirmed when you book."
        />
        <div className="mt-10">
          <AreaCoverageGrid headingLevel="h3" showBlurb={false} />
        </div>
        <SectionCtas />
      </Section>

      <OfferBand />

      {/* You might also need */}
      <Section tone="muted" aria-labelledby="related-services-heading">
        <SectionHeading
          id="related-services-heading"
          eyebrow="More services"
          title="You might also need"
          align="center"
          className="mx-auto"
        />
        <RevealGroup as="ul" step={70} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((entry) => (
            <ServiceCard key={entry.id} service={entry} headingLevel="h3" />
          ))}
        </RevealGroup>
        <SectionCtas className="justify-center" />
      </Section>

      <Section tone="surface" size="sm">
        <CtaBanner
          heading={`Ready to book ${service.title.toLowerCase()}?`}
          secondary={{ label: 'See all services', href: '/services/' }}
        />
      </Section>
    </>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-brand-light text-brand"
    >
      <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3">
        <path
          d="M2.5 7.5 5.5 10.5 11.5 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
