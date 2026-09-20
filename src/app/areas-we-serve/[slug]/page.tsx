import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { FAQAccordion } from '@/components/FAQAccordion';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { ServiceCard } from '@/components/ServiceCard';
import { Reveal, RevealGroup } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { areaEntries, areaPageFor, getArea } from '@/content/areas';
import { formatPrice } from '@/content/pricing';
import { getProduct, tariffRowFor } from '@/content/products';
import { getService } from '@/content/services';
import { breadcrumbSchema, buildMetadata, faqSchema, localBusinessSchema } from '@/lib/seo';
import { links, site, stores } from '@/lib/site';

type Params = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return areaEntries.map((area) => ({ slug: area.id }));
}

export function generateMetadata({ params }: Params) {
  const area = getArea(params.slug);
  if (!area) return {};
  return buildMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: `/areas-we-serve/${area.id}/`,
    image: area.heroImage.src,
    imageAlt: area.heroImage.alt,
  });
}

export default function AreaPage({ params }: Params) {
  const area = getArea(params.slug);
  if (!area) notFound();

  const crumbs = [
    { name: 'Areas We Serve', href: '/areas-we-serve/' },
    { name: area.name, href: `/areas-we-serve/${area.id}/` },
  ];
  const store = stores.find((s) => s.id === area.nearestStoreId) ?? stores[0];
  const otherStore = stores.find((s) => s.id !== store.id);
  const services = area.serviceIds.flatMap((id) => getService(id) ?? []);
  const products = area.productIds.flatMap((id) => getProduct(id) ?? []);
  const whatsappHref = `${links.whatsapp}?text=${encodeURIComponent(`Hi Vanzoo, I'd like a pickup in ${area.name}.`)}`;

  return (
    <>
      <JsonLd data={[localBusinessSchema(), breadcrumbSchema(crumbs), faqSchema(area.faqs)]} />

      {/* Hero */}
      <PageHeader
        eyebrow={`Areas We Serve · ${area.name}`}
        title={area.headline}
        intro={area.intro}
        image={area.heroImage.src}
        imageAlt={area.heroImage.alt}
      >
        <Breadcrumbs crumbs={crumbs} tone="dark" />
      </PageHeader>

      <Section tone="dark" size="sm" className="!pt-0 -mt-px" aria-label="Book a pickup">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/10 pt-8">
          <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-lg">
            Book free pickup
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-onDark btn-lg">
            WhatsApp us
          </a>
          <p className="text-sm text-white/80">Free pickup &amp; delivery · 3–5 day turnaround · Express available</p>
        </div>
      </Section>

      {/* Local notes + story */}
      <Section tone="surface" aria-labelledby="area-story-heading">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <Reveal variant="left">
            <h2 id="area-story-heading" className="text-display-md">
              {area.story.heading}
            </h2>
            <div className="mt-5 space-y-4">
              {area.story.paragraphs.map((p) => (
                <p key={p} className="text-lead text-pretty text-neutral-body">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 rounded-card border border-neutral-line bg-brand-light p-6">
              <p className="eyebrow">Local notes</p>
              <ul className="mt-4 space-y-3">
                {area.localNotes.map((note) => (
                  <li key={note} className="flex items-start gap-3 text-[0.9375rem] text-neutral-ink">
                    <CheckDot />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal variant="right" delay={90} className="media-frame aspect-[4/5] bg-brand-light lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <Image
              src={area.story.image.src}
              alt={area.story.image.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* What we collect — photo cards */}
      <Section tone="muted" aria-labelledby="area-collect-heading">
        <SectionHeading
          id="area-collect-heading"
          eyebrow="What we collect"
          title={area.collect.heading}
          intro={area.collect.intro}
        />
        <RevealGroup as="ul" step={80} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {area.collect.cards.map((card) => (
            <li
              key={card.title}
              className="card-lift group flex flex-col overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift hover:border-brand/30"
            >
              <Link href={card.href} className="media-frame block aspect-[4/3] rounded-none" tabIndex={-1}>
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="card-media object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold leading-snug text-neutral-ink">
                  {card.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-pretty text-neutral-body">{card.body}</p>
                <Link
                  href={card.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Learn more
                  <span aria-hidden="true" className="arrow-nudge">→</span>
                </Link>
              </div>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* Journey — one photo per step */}
      <Section tone="surface" aria-labelledby="area-journey-heading">
        <SectionHeading
          id="area-journey-heading"
          eyebrow="The practical side"
          title={area.journey.heading}
          intro={area.journey.intro}
          align="center"
          className="mx-auto"
        />
        <RevealGroup as="ol" step={80} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {area.journey.steps.map((step, index) => (
            <li key={step.title}>
              <div className="media-frame aspect-[4/3]">
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-pill bg-white font-display text-sm font-semibold text-brand shadow-lift">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-pretty text-neutral-body">{step.body}</p>
            </li>
          ))}
        </RevealGroup>
      </Section>

      {/* Services */}
      <Section tone="muted" aria-labelledby="area-services-heading">
        <SectionHeading
          id="area-services-heading"
          eyebrow="Our services"
          title={`All services, collected from ${area.name}`}
          intro="The most requested services below — every one includes the same free pickup and delivery."
        />
        <RevealGroup as="ul" step={70} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} headingLevel="h3" />
          ))}
        </RevealGroup>
        <p className="mt-8 text-sm text-neutral-body">
          Looking for something else?{' '}
          <Link href="/services/" className="font-medium text-brand underline underline-offset-2">
            See all 12 services
          </Link>
          .
        </p>
      </Section>

      {/* Popular items with prices */}
      <Section tone="surface" aria-labelledby="area-items-heading">
        <SectionHeading
          id="area-items-heading"
          eyebrow="Popular items"
          title="Pick an item, see the price"
          intro="Published, item-wise pricing — no minimum order, no hidden charges. Exclusive of GST."
        />
        <RevealGroup as="ul" step={60} className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => {
            const row = tariffRowFor(product.services[0]);
            return (
              <li key={product.id}>
                <Link
                  href={`/products/${product.id}/`}
                  className="card-lift group block overflow-hidden rounded-card border border-neutral-line bg-white hover:border-brand/30"
                >
                  <div className="media-frame aspect-square rounded-none">
                    <Image
                      src={row.image}
                      alt={product.heroImageAlt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 15vw, (min-width: 768px) 30vw, 45vw"
                      className="card-media object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-base font-semibold text-neutral-ink">{product.title}</p>
                    <p className="mt-1 text-xs text-neutral-body">{formatPrice(row)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </RevealGroup>
        <p className="mt-8 text-sm text-neutral-body">
          Full list on the{' '}
          <Link href="/pricing/" className="font-medium text-brand underline underline-offset-2">
            pricing page
          </Link>
          .
        </p>
      </Section>

      {/* Nearest store */}
      <Section tone="muted" aria-labelledby="area-store-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="area-store-heading"
              eyebrow="Visit us"
              title={area.storeHeading}
              intro="Prefer to drop in? Directions to both Vanzoo stores are below."
              className="max-w-none"
            />
            <div className="mt-8 space-y-4">
              {[store, otherStore].flatMap((s) => (s ? [s] : [])).map((s, index) => (
                <div key={s.id} className="rounded-card border border-neutral-line bg-white p-5">
                  <p className="font-display font-semibold text-neutral-ink">
                    {s.name}
                    {index === 0 ? (
                      <span className="ml-2 rounded-pill bg-brand-light px-2.5 py-0.5 align-middle text-xs font-semibold text-brand">
                        Nearest
                      </span>
                    ) : null}
                  </p>
                  <p className="eyebrow mt-1">{s.locality}</p>
                  <address className="mt-2 not-italic text-sm leading-relaxed text-neutral-body">{s.address}</address>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                    >
                      Get directions <span aria-hidden="true">→</span>
                    </a>
                    <a
                      href={`tel:${site.phoneHref}`}
                      className="text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                    >
                      Call {site.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="media-frame aspect-[4/3] lg:aspect-auto lg:min-h-[28rem]">
            <iframe
              title={`Map showing Vanzoo at ${store.name}, ${store.locality}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(store.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="surface" aria-labelledby="area-faq-heading">
        <SectionHeading
          id="area-faq-heading"
          eyebrow="FAQ"
          title={area.faqHeading}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <FAQAccordion faqs={area.faqs} groupName={`${area.id}-faq`} />
        </div>
      </Section>

      {/* Nearby areas */}
      <Section tone="muted" size="sm" aria-labelledby="area-nearby-heading">
        <h2 id="area-nearby-heading" className="text-display-sm">
          We also collect from nearby
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {area.nearby.map((name) => {
            const page = areaPageFor(name);
            const chip =
              'rounded-pill border border-neutral-line bg-white px-4 py-2 text-sm font-medium text-neutral-ink';
            return (
              <li key={name}>
                {page ? (
                  <Link href={`/areas-we-serve/${page.id}/`} className={`${chip} hover:border-brand/40 hover:text-brand`}>
                    {name}
                  </Link>
                ) : (
                  <span className={chip}>{name}</span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm text-neutral-body">
          <Link href="/areas-we-serve/" className="font-medium text-brand underline underline-offset-2">
            See every area we serve
          </Link>
        </p>
      </Section>

      <Section tone="surface" size="sm">
        <CtaBanner
          heading={area.finalCta.heading}
          body={area.finalCta.body}
          secondary={{ label: 'See our tariffs', href: '/pricing/' }}
        />
      </Section>
    </>
  );
}

function CheckDot() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-white text-brand"
    >
      <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3">
        <path d="M2.5 7.5 5.5 10.5 11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
