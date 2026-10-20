import Image from 'next/image';
import Link from 'next/link';
import { AppPromo } from '@/components/AppPromo';
import { NineStepProcess } from '@/components/NineStepProcess';
import { SectionCtas } from '@/components/SectionCtas';
import { OfferBand } from '@/components/OfferBand';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Hero } from '@/components/Hero';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import { UspCarousel } from '@/components/UspCarousel';
import { hydrocarbon, hydrocarbonDetail as detail, uspCards } from '@/content/marketing';
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo';

const CRUMBS = [{ name: 'Hydrocarbon Tech', href: '/hydrocarbon-tech/' }];

export const metadata = buildMetadata({
  title: 'Advanced Cleaning with Hydrocarbon Technology | Vanzoo',
  description:
    'Vanzoo’s hydrocarbon technology offers advanced, eco-friendly, fabric-safe cleaning solutions that ensure deep stain removal with minimal environmental impact.',
  path: '/hydrocarbon-tech/',
  image: hydrocarbon.hero.image,
  imageAlt: hydrocarbon.hero.imageAlt,
});

export default function HydrocarbonTechPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(hydrocarbon.faqs)]} />

      <Hero
        headline={hydrocarbon.hero.headline}
        subhead={hydrocarbon.hero.subhead}
        image={hydrocarbon.hero.image}
        imageAlt={hydrocarbon.hero.imageAlt}
        variant="band"
        secondaryCta={{ label: 'See couture care tariffs', href: '/pricing/' }}
      />

      {/* At a glance */}
      <Section tone="light" size="sm" aria-label="Hydrocarbon at a glance">
        <ul className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {detail.glance.map((stat) => (
            <li key={stat.label}>
              <p className="font-display text-4xl font-semibold text-brand sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-neutral-body">{stat.label}</p>
            </li>
          ))}
        </ul>
        <SectionCtas className="justify-center" />
      </Section>

      {/* USPs as photo cards (rinse.com pattern) */}
      <Section tone="surface" aria-labelledby="hydrocarbon-usp-heading">
        <SectionHeading
          id="hydrocarbon-usp-heading"
          eyebrow="Our USPs"
          title="Why you'll love Vanzoo"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <UspCarousel cards={uspCards} />
        </div>
      </Section>

      {/* Why Hydrocarbon? / How It Works — alternating explainer rows */}
      {hydrocarbon.sections.map((section, index) => (
        <Section
          key={section.id}
          id={section.id}
          tone={index % 2 === 0 ? 'surface' : 'muted'}
          aria-labelledby={`${section.id}-heading`}
        >
          <div
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
              index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="media-frame aspect-[4/3]">
              <Image
                src={section.image}
                alt={section.imageAlt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="max-w-lg">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 id={`${section.id}-heading`} className="mt-3 text-display-md">
                {section.heading}
              </h2>
              <p className="mt-5 text-lead text-pretty text-neutral-body">{section.body}</p>
              {index === 1 ? (
                <div className="mt-8">
                  <EnquiryDialog label="Enquire Now" variant="button" />
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      ))}

      {/* The deeper technical explanation — how the process actually works */}
      <Section tone="surface" aria-labelledby="science-heading">
        <SectionHeading
          id="science-heading"
          eyebrow={hydrocarbon.scienceDetail.eyebrow}
          title={hydrocarbon.scienceDetail.heading}
          align="center"
          className="mx-auto"
        />
        <dl className="mt-12 grid gap-8 sm:grid-cols-2">
          {hydrocarbon.scienceDetail.points.map((point) => (
            <div key={point.title} className="rounded-card border border-neutral-line bg-white p-6 sm:p-7">
              <dt className="font-display text-lg font-semibold text-neutral-ink">{point.title}</dt>
              <dd className="mt-2.5 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
                {point.body}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* The cycle, step by step */}
      <Section tone="muted" aria-labelledby="cycle-heading">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="media-frame relative aspect-[4/5]">
            <Image src="/images/client/machine-operator.jpg" alt="Vanzoo operator running the closed-loop hydrocarbon dry cleaning machine" fill loading="lazy" sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">The cycle</p>
            <h2 id="cycle-heading" className="mt-3 text-display-md">
              <span className="hl">{detail.cycleHeading}</span>
            </h2>
            <ol className="mt-8 space-y-5">
              {detail.cycle.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-accent-gold/60 bg-white font-display text-sm font-semibold text-brand">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-neutral-ink">{step.title}</h3>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <SectionCtas />
          </div>
        </div>
      </Section>

      {/* Best for */}
      <Section tone="surface" aria-labelledby="best-for-heading">
        <SectionHeading
          id="best-for-heading"
          eyebrow="Fabrics & garments"
          title={<span className="hl-green">{detail.fabricsHeading}</span>}
          align="center"
          className="mx-auto"
        />
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {detail.fabrics.map((fabric) => (
            <li key={fabric} className="rounded-pill border border-neutral-line bg-white px-5 py-2.5 text-sm font-semibold text-neutral-ink shadow-lift">
              {fabric}
            </li>
          ))}
        </ul>
        <SectionCtas className="justify-center" />
      </Section>

      {/* Three-way comparison */}
      <Section tone="muted" aria-labelledby="compare-heading">
        <SectionHeading
          id="compare-heading"
          eyebrow="Side by side"
          title={detail.compareHeading}
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 overflow-x-auto rounded-card border border-neutral-line bg-white shadow-lift">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-brand-ink text-accent-gold-soft">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold" />
                {detail.compareColumns.map((column) => (
                  <th key={column} scope="col" className="px-5 py-3.5 font-semibold">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-line">
              {detail.compareRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-5 py-3.5 font-display font-semibold text-neutral-ink">{row.label}</th>
                  {row.values.map((value, index) => (
                    <td key={value} className={index === 0 ? 'bg-brand-light px-5 py-3.5 font-medium text-brand-dark' : 'px-5 py-3.5 text-neutral-body'}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SectionCtas className="justify-center" />
      </Section>

      {/* Why Switch? — PERC comparison */}
      <Section tone="dark" aria-labelledby="comparison-heading">
        <SectionHeading
          id="comparison-heading"
          eyebrow={hydrocarbon.comparison.eyebrow}
          title={hydrocarbon.comparison.heading}
          align="center"
          tone="dark"
          className="mx-auto"
        />
        <IconFeatureGrid
          items={hydrocarbon.comparison.items}
          columns={4}
          tone="dark"
          className="mt-12"
        />
      </Section>

      {/* The nine-step process, flat */}
      <Section tone="surface" aria-labelledby="hc-process-heading">
        <SectionHeading
          id="hc-process-heading"
          eyebrow="Inside the process"
          title={<>What actually happens to <span className="hl">your garment</span></>}
          intro="Every order runs the same nine steps, from doorstep pickup through final quality inspection and delivery."
        />
        <div className="mt-10">
          <NineStepProcess />
        </div>
        <SectionCtas />
      </Section>

      <Section tone="muted" aria-label="Process and sustainability diagrams">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <figure>
            <div className="media-frame mx-auto aspect-[824/1412] max-w-sm">
              <Image
                src={hydrocarbon.processImage.src}
                alt={hydrocarbon.processImage.alt}
                fill
                loading="lazy"
                sizes="(min-width: 640px) 24rem, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-neutral-body">
              The full nine-step Vanzoo garment care process.
            </figcaption>
          </figure>

          <figure>
            {/* Aspect matches the source exactly so object-contain leaves no bars. */}
            <div className="media-frame aspect-[2400/1458]">
              <Image
                src={hydrocarbon.sustainabilityImage.src}
                alt={hydrocarbon.sustainabilityImage.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-neutral-body">
              Where the environmental gains come from.
            </figcaption>
          </figure>
        </div>
      </Section>

      <OfferBand />

      <Section tone="dark">
        <AppPromo />
      </Section>

      <Section tone="surface" id="faq" aria-labelledby="hydrocarbon-faq-heading">
        <SectionHeading
          id="hydrocarbon-faq-heading"
          title="Frequently Asked Questions"
          intro="The technical questions we get asked most about hydrocarbon cleaning."
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <FAQAccordion faqs={hydrocarbon.faqs} groupName="hydrocarbon-faq" />
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-neutral-body">
          Ready to try it? See the{' '}
          <Link
            href="/pricing/"
            className="font-medium text-brand underline underline-offset-2"
          >
            couture care tariffs
          </Link>{' '}
          or{' '}
          <Link href="/contact-us/" className="font-medium text-brand underline underline-offset-2">
            get in touch
          </Link>{' '}
          with a question about a specific garment.
        </p>
      </Section>
    </>
  );
}
