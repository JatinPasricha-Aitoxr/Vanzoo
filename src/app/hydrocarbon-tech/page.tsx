import { Highlight } from '@/components/ui/Highlight';
import Image from 'next/image';
import Link from 'next/link';
import { AppPromo } from '@/components/AppPromo';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Hero } from '@/components/Hero';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { VanzooProcess } from '@/components/VanzooProcess';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SustainabilityPanel } from '@/components/SustainabilityPanel';
import { UspCarousel } from '@/components/UspCarousel';
import { hydrocarbon, uspCards } from '@/content/marketing';
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
        seoH1="Best & Premium Hydrocarbon Dry Cleaning in Gurgaon"
        headline={hydrocarbon.hero.headline}
        subhead={hydrocarbon.hero.subhead}
        image={hydrocarbon.hero.image}
        imageAlt={hydrocarbon.hero.imageAlt}
        variant="band"
        secondaryCta={{ label: 'See couture care tariffs', href: '/pricing/' }}
      />

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
              <h2 id={`${section.id}-heading`} className="mt-3 text-display-md"><Highlight text={section.heading} dark={false} /></h2>
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

      {/* The machine cycle, stage by stage */}
      <Section tone="muted" aria-labelledby="cycle-heading">
        <SectionHeading
          id="cycle-heading"
          eyebrow={hydrocarbon.cycle.eyebrow}
          title={hydrocarbon.cycle.heading}
          intro={hydrocarbon.cycle.intro}
          align="center"
          className="mx-auto"
        />
        <ol className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hydrocarbon.cycle.stages.map((stage, index) => (
            <li key={stage.title} className="rounded-card border border-neutral-line bg-white p-6 shadow-lift">
              <span className="font-display text-2xl font-semibold text-accent-gold-ink">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-neutral-ink">{stage.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">{stage.body}</p>
            </li>
          ))}
        </ol>
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
        <div className="mx-auto mt-16 max-w-5xl">
          <h3 className="text-center font-display text-xl font-semibold text-white">
            <Highlight text={hydrocarbon.detailedComparison.heading} dark />
          </h3>
          <div className="mt-8 overflow-x-auto rounded-card border border-accent-gold/50">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm text-white">
              <thead>
                <tr className="bg-accent-gold text-brand-ink">
                  <th scope="col" className="px-4 py-3 font-semibold" />
                  {hydrocarbon.detailedComparison.columns.map((col) => (
                    <th key={col} scope="col" className="px-4 py-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hydrocarbon.detailedComparison.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-white/15 align-top">
                    <th scope="row" className="px-4 py-3.5 font-semibold text-accent-gold-soft">
                      {row[0]}
                    </th>
                    {row.slice(1).map((cell, i) => (
                      <td key={i} className={`px-4 py-3.5 leading-relaxed ${i === 0 ? 'font-medium text-white' : 'text-white/75'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Fabrics + safety */}
      <Section tone="surface" aria-labelledby="fabrics-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">{hydrocarbon.fabricsSuited.eyebrow}</p>
            <h2 id="fabrics-heading" className="mt-3 text-display-md">
              <Highlight text={hydrocarbon.fabricsSuited.heading} />
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {hydrocarbon.fabricsSuited.items.map((item) => (
                <li key={item} className="rounded-pill border border-neutral-line bg-white px-4 py-2 text-sm font-medium text-neutral-ink shadow-lift">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">{hydrocarbon.safety.eyebrow}</p>
            <h2 className="mt-3 text-display-md">
              <Highlight text={hydrocarbon.safety.heading} />
            </h2>
            <ul className="mt-8 space-y-3.5">
              {hydrocarbon.safety.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-neutral-body">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-accent-gold" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>


      {/* The seven-step process, as live text */}
      <VanzooProcess />

      <Section tone="muted" aria-label="Sustainability">
        <SustainabilityPanel />
      </Section>

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
