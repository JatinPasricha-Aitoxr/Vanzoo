import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ComparisonTable } from '@/components/ComparisonTable';
import { CtaBanner } from '@/components/CtaBanner';
import { FAQAccordion } from '@/components/FAQAccordion';
import { FeatureGrid } from '@/components/FeatureGrid';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { ProductBuyBox } from '@/components/ProductBuyBox';
import { TabbedExplainer } from '@/components/TabbedExplainer';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { howItWorksIntro, howItWorksSteps } from '@/content/marketing';
import { lineId } from '@/content/pricing';
import { getProduct, productEntries, tariffRowFor } from '@/content/products';
import { getProductCareContent } from '@/content/productCare';
import { breadcrumbSchema, buildMetadata, faqSchema, productSchema } from '@/lib/seo';
import { links } from '@/lib/site';
import { SITE_URL } from '@/lib/site';

type Params = { params: { slug: string } };

/** The one product shipped so far is static; an unknown slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return productEntries.map((product) => ({ slug: product.id }));
}

export function generateMetadata({ params }: Params) {
  const product = getProduct(params.slug);
  if (!product) return {};
  const care = getProductCareContent(product.id);

  return buildMetadata({
    title: care?.metaTitle ?? `${product.title} Dry Cleaning & Steam Press | Vanzoo`,
    description: care?.metaDescription ?? `${product.intro} Free pickup and delivery across Gurgaon.`.slice(0, 300),
    path: `/products/${product.id}/`,
    image: product.heroImage,
    imageAlt: product.heroImageAlt,
  });
}

export default function ProductDetailPage({ params }: Params) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const care = getProductCareContent(product.id);

  const crumbs = [
    { name: 'Products', href: '/products/' },
    { name: product.title, href: `/products/${product.id}/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          productSchema({
            slug: product.id,
            title: product.title,
            description: product.intro,
            image: product.heroImage,
            offers: product.services.map((option) => {
              const row = tariffRowFor(option);
              return {
                name: option.label,
                price: row.amount,
                url: `${SITE_URL}/products/${product.id}/#${lineId(
                  option.catalogId,
                  option.groupId,
                  option.item,
                )}`,
              };
            }),
          }),
          breadcrumbSchema(crumbs),
          ...(care ? [faqSchema(care.faqs)] : []),
        ]}
      />

      {/* SECTION 1 — Hero */}
      <PageHeader
        eyebrow="Products"
        title={care?.hero.headline ?? product.title}
        intro={care?.hero.intro ?? product.intro}
        image={product.heroImage}
        imageAlt={product.heroImageAlt}
      >
        <Breadcrumbs crumbs={crumbs} tone="dark" />
      </PageHeader>

      {care ? (
        <Section tone="dark" size="sm" className="!pt-0 -mt-px" aria-label="Service highlights">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-8 text-sm">
            <div className="flex items-center gap-2.5 text-white">
              <CheckBadge />
              <span className="font-medium">{care.hero.pickupNote}</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/85">
              <CheckBadge />
              <span>{care.hero.turnaroundNote}</span>
            </div>
            <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-md ml-auto">
              Book a Pickup
            </a>
          </div>
        </Section>
      ) : null}

      {/* Product photo + variant picker — existing cart/service selection, untouched */}
      <Section tone="surface" aria-labelledby="product-options-heading">
        <ProductBuyBox product={product} />
      </Section>

      {care ? (
        <>
          {/* SECTION 2 — Choose the Right Care */}
          {care.careOptions ? (
            <Section tone="muted" aria-labelledby="choose-care-heading">
              <SectionHeading
                id="choose-care-heading"
                eyebrow={`Two Ways We Care For ${product.title}s`}
                title={`Choose the Right Care for Your ${product.title}`}
                intro={`Not every ${product.title.toLowerCase()} needs the same treatment. Choose the service based on whether it needs professional cleaning or simply a fresh, crisp finish.`}
              />
              <div className="mt-12 grid gap-6 lg:grid-cols-2">
                {care.careOptions.map((option, index) => (
                  <Reveal
                    key={option.title}
                    variant={index === 0 ? 'left' : 'right'}
                    delay={index * 90}
                    className="card-lift flex flex-col rounded-card border border-neutral-line bg-white p-8"
                  >
                    <h3 className="text-display-sm">{option.title}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
                      {option.description}
                    </p>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body">
                      Best for
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {option.bestFor.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm text-neutral-ink">
                          <CheckDot />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 border-t border-neutral-line pt-5 text-sm font-medium text-neutral-ink">
                      {option.result}
                    </p>
                    <a
                      href="#product-options-heading"
                      className="btn-secondary btn-md mt-6 w-full justify-center"
                    >
                      {option.cta}
                    </a>
                  </Reveal>
                ))}
              </div>
            </Section>
          ) : null}

          {/* SECTION 3 — Why Professional Care */}
          <Section tone="surface" aria-labelledby="why-care-heading">
            <SectionHeading
              id="why-care-heading"
              eyebrow="Why It Matters"
              title={care.whyCare.heading}
              className="max-w-2xl"
            />
            <div className="mt-6 max-w-2xl space-y-3">
              {care.whyCare.body.map((paragraph) => (
                <p key={paragraph} className="text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-12">
              <FeatureGrid items={care.whyCare.features} columns={4} />
            </div>
          </Section>

          {/* SECTION 4 — Vanzoo Process */}
          <Section tone="muted" aria-labelledby="process-heading">
            <SectionHeading
              id="process-heading"
              eyebrow="Our Process"
              title={care.process.heading}
              align="center"
              className="mx-auto"
            />
            <div className="mt-14">
              <ProcessTimeline stages={care.process.stages} />
            </div>
          </Section>

          {/* SECTION 5 — Technology */}
          <Section tone="dark" aria-labelledby="technology-heading">
            <SectionHeading
              id="technology-heading"
              eyebrow={care.technology.subheading}
              title={care.technology.heading}
              intro={care.technology.body}
              tone="dark"
            />
            <div className="mt-12">
              <IconFeatureGrid items={care.technology.features} columns={4} tone="dark" />
            </div>
          </Section>

          {/* SECTION 6 — Detail Care */}
          <Section tone="surface" aria-labelledby="detail-care-heading">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
              <Reveal
                variant="left"
                className="media-frame aspect-[4/5] bg-brand-light lg:aspect-[3/4]"
              >
                <Image
                  src={product.heroImage}
                  alt={product.heroImageAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 34vw, 90vw"
                  className="object-cover"
                />
              </Reveal>
              <div>
                <SectionHeading id="detail-care-heading" eyebrow="Attention to Detail" title={care.detailCare.heading} />
                <div className="mt-10">
                  <FeatureGrid items={care.detailCare.items} columns={3} numbered />
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 7 — Fabric Care */}
          <Section tone="muted" aria-labelledby="fabric-care-heading">
            <SectionHeading id="fabric-care-heading" eyebrow="Fabric-Specific Care" title={care.fabricCare.heading} />
            <div className="mt-12">
              <FeatureGrid items={care.fabricCare.items} columns={3} />
            </div>
            <p className="mt-8 max-w-2xl text-sm text-neutral-body">{care.fabricCare.disclaimer}</p>
          </Section>

          {/* SECTION 8 — Stain Care */}
          <Section tone="surface" aria-labelledby="stain-care-heading">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div>
                <SectionHeading
                  id="stain-care-heading"
                  eyebrow="Stain & Spot Treatment"
                  title={care.stainCare.heading}
                  intro={care.stainCare.intro}
                  className="max-w-none"
                />
                <ul className="mt-8 grid grid-cols-2 gap-3">
                  {care.stainCare.stains.map((stain) => (
                    <li
                      key={stain}
                      className="rounded-card border border-neutral-line bg-neutral-muted px-4 py-3 text-sm text-neutral-ink"
                    >
                      {stain}
                    </li>
                  ))}
                </ul>
              </div>
              <Reveal
                variant="right"
                delay={90}
                className="flex flex-col justify-center rounded-card border border-neutral-line bg-brand-light p-8"
              >
                <h3 className="text-display-sm">{care.stainCare.beforeCleaning.heading}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
                  {care.stainCare.beforeCleaning.body}
                </p>
                <p className="mt-6 border-t border-brand/15 pt-5 text-sm text-neutral-body">
                  {care.stainCare.qualifier}
                </p>
              </Reveal>
            </div>
          </Section>

          {/* SECTION 9 — Dry Clean vs Steam Press */}
          {care.comparison ? (
            <Section tone="muted" aria-labelledby="comparison-heading">
              <SectionHeading
                id="comparison-heading"
                eyebrow="Compare"
                title={care.comparison.heading}
                align="center"
                className="mx-auto"
              />
              <div className="mt-12">
                <ComparisonTable
                  columns={care.comparison.columns}
                  rows={care.comparison.rows.map((row) => ({
                    label: row.label,
                    values: [row.dryClean, row.steamPress],
                  }))}
                />
              </div>
              <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
                {care.comparison.guide.map((item) => (
                  <div key={item.question} className="text-center">
                    <p className="font-display text-base font-semibold text-neutral-ink">{item.question}</p>
                    <p className="mt-1.5 text-sm text-neutral-body">{item.answer}</p>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {/* SECTION 10 — Why Vanzoo */}
          <Section tone="surface" aria-labelledby="why-vanzoo-heading">
            <SectionHeading id="why-vanzoo-heading" eyebrow="Why Vanzoo" title={care.whyVanzoo.heading} />
            <div className="mt-12">
              <FeatureGrid items={care.whyVanzoo.features} columns={3} />
            </div>
          </Section>

          {/* SECTION 11 — Who Is This For */}
          <Section tone="muted" aria-labelledby="audience-heading">
            <SectionHeading
              id="audience-heading"
              eyebrow="Who It's For"
              title={care.audiences.heading}
              align="center"
              className="mx-auto"
            />
            <div className="mt-12">
              <FeatureGrid items={care.audiences.items} columns={5} />
            </div>
          </Section>

          {/* SECTION 12 — Doorstep Experience */}
          <Section tone="dark" aria-labelledby="doorstep-heading">
            <SectionHeading id="doorstep-heading" eyebrow="Convenience" title={care.doorstep.heading} tone="dark" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {care.doorstep.steps.map((step, index) => (
                <Reveal
                  key={step.title}
                  variant="up"
                  delay={index * 70}
                  className="rounded-card border border-white/15 bg-white/[0.06] p-6"
                >
                  <span className="font-display text-sm font-semibold tabular-nums text-accent-gold-soft">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-pretty text-white/70">{step.body}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-14 text-center">
              <p className="text-display-sm text-white">{care.doorstep.statement}</p>
              <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-lg mt-7">
                {care.doorstep.cta}
              </a>
            </div>
          </Section>
        </>
      ) : null}

      {/* How it works — the same three-step explainer as every other detail page.
          Skipped where bespoke content (`care`) already walks through its own,
          more detailed process — showing both would tell the customer two
          different step counts for the same journey. */}
      {!care ? (
        <Section tone="muted" id="how-it-works" aria-labelledby="product-how-heading">
          <SectionHeading
            id="product-how-heading"
            eyebrow="How It Works"
            title="Three steps, and it's handled"
            intro={howItWorksIntro}
          />
          <div className="mt-14">
            <TabbedExplainer steps={howItWorksSteps} />
          </div>
        </Section>
      ) : null}

      {/* SECTION 13 — FAQ */}
      {care ? (
        <Section tone="surface" aria-labelledby="faq-heading">
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12">
            <FAQAccordion faqs={care.faqs} groupName={`${product.id}-faq`} />
          </div>
        </Section>
      ) : null}

      {/* SECTION 14 — Final CTA */}
      <Section tone="surface" size="sm">
        {care ? (
          <Reveal
            variant="scale"
            className="band-dark overflow-hidden rounded-media px-6 py-14 text-center sm:px-12 sm:py-16"
          >
            <h2 className="mx-auto max-w-2xl text-display-md text-white">{care.finalCta.heading}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lead text-pretty text-white/80">{care.finalCta.intro}</p>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-white/90">
              {care.finalCta.lines.join('  ·  ')}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-inverse btn-lg">
                {care.finalCta.cta}
              </a>
              <Link href="/products/" className="btn-onDark btn-lg">
                See all products
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/60">{care.finalCta.secondary}</p>
          </Reveal>
        ) : (
          <CtaBanner
            heading={`Ready to get your ${product.title.toLowerCase()}s cleaned?`}
            secondary={{ label: 'See all products', href: '/products/' }}
          />
        )}
      </Section>
    </>
  );
}

function CheckDot() {
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

function CheckBadge() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-white/15 text-accent-gold-soft"
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
