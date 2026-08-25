import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { PincodeChecker } from '@/components/PincodeChecker';
import { ServiceCard } from '@/components/ServiceCard';
import { TabbedExplainer } from '@/components/TabbedExplainer';
import { TariffGrid } from '@/components/TariffGrid';
import { RevealGroup, Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { howItWorksIntro, howItWorksSteps } from '@/content/marketing';
import { coutureCatalog, steamIronCatalog, type TariffCatalog } from '@/content/pricing';
import {
  getService,
  relatedServices,
  serviceEntries,
  type ServiceEntry,
} from '@/content/services';
import { breadcrumbSchema, buildMetadata, serviceSchema } from '@/lib/seo';
import { links } from '@/lib/site';

type Params = { params: { slug: string } };

/** All twelve services are static; an unknown slug is a 404, not a runtime render. */
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
        title={service.pageHeadline ?? service.title}
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
              How we care for it
            </h2>
            <p className="mt-4 text-lead text-pretty text-neutral-body">{service.longBody}</p>

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

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                Book pickup
              </a>
              <Link href={service.tariffHref} className="btn-secondary btn-lg">
                {service.tariffLabel}
              </Link>
            </div>
          </Reveal>

          <Reveal variant="right" delay={90} className="media-frame aspect-[4/5] bg-brand-light lg:aspect-[3/4]">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 38vw, 90vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* Pricing preview, where the service has a per-item tariff */}
      {tariffTable ? (
        <Section tone="muted" aria-labelledby="service-pricing-heading">
          <SectionHeading
            id="service-pricing-heading"
            eyebrow="Pricing"
            title={`${service.title} tariffs`}
            intro="Add what you need to your cart and send us the list — we'll confirm the quote and collect from your door, free, anywhere in Gurgaon."
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

      {/* How it works — the same three-step explainer as the homepage, so the
          promise reads identically wherever a visitor lands on it. */}
      <Section tone={tariffTable || service.id === 'pickup-delivery' ? 'surface' : 'muted'} id="how-it-works" aria-labelledby="service-how-heading">
        <SectionHeading
          id="service-how-heading"
          eyebrow="How It Works"
          title="Three steps, and it's handled"
          intro={howItWorksIntro}
        />
        <div className="mt-14">
          <TabbedExplainer steps={howItWorksSteps} />
        </div>
      </Section>

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
