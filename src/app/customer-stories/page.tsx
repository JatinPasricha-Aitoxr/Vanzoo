import { cmsOr } from '@/cms/override';
import { withSeo } from '@/cms/withSeo';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Reviews } from '@/components/Reviews';
import { Reveal, RevealGroup } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { reviews } from '@/content/reviews';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

const CRUMBS = [{ name: 'Customer Stories', href: '/customer-stories/' }];

export async function generateMetadata() {
  return withSeo(buildMetadata({
  title: 'Customer Stories | Vanzoo Dry Cleaning Gurgaon',
  description:
    'Real stories from Gurgaon customers — dry cleaning, steam press and garment care with free doorstep pickup and delivery — plus a before-and-after of our leather care.',
  path: '/customer-stories/',
}));
}

const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
const localities = new Set(reviews.map((r) => r.context)).size;
const services = Array.from(new Set(reviews.map((r) => r.service)));

function CustomerStoriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <PageHeader
        seoH1="Best & Premium Dry Cleaning Customer Stories in Gurgaon"
        eyebrow="Customer stories"
        title="What it's like to hand us your wardrobe"
        intro="Words from customers across Gurgaon — what they sent, and how it came back."
      >
        <Breadcrumbs crumbs={CRUMBS} />
      </PageHeader>

      {/* At a glance — computed from the reviews below, never typed in */}
      <Section tone="surface" size="sm" aria-label="Reviews at a glance">
        <dl className="mx-auto grid max-w-3xl grid-cols-3 gap-4 text-center">
          {[
            [`${average.toFixed(1)} / 5`, 'average rating'],
            [String(reviews.length), 'customer reviews'],
            [String(localities), 'Gurgaon localities'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-card border border-neutral-line bg-white p-5 shadow-lift">
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-3xl font-semibold text-brand">{value}</dd>
              <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-body">{label}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* A real result */}
      <Section tone="dark" aria-labelledby="result-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left" className="media-frame mx-auto w-full max-w-sm bg-brand-dark">
            <Image
              src="/images/vanzoo/bag-before-after.jpg"
              alt="Before and after: a leather handbag cleaned and revived by Vanzoo"
              width={851}
              height={1280}
              loading="lazy"
              sizes="(min-width: 1024px) 24rem, 90vw"
              className="h-auto w-full"
            />
          </Reveal>
          <Reveal variant="right">
            <SectionHeading
              id="result-heading"
              eyebrow="Before & after"
              title="A leather handbag, brought back"
              intro="Stains, a dull finish and loss of shine — cleaned, conditioned and revived by hand. Every piece is assessed individually before we decide how it is cared for."
              tone="dark"
            />
          </Reveal>
        </div>
      </Section>

      {/* By service */}
      <Section tone="muted" aria-labelledby="stories-by-service-heading">
        <SectionHeading
          id="stories-by-service-heading"
          eyebrow="In their words"
          title="Dry cleaning, steam press and garment care"
          align="center"
          className="mx-auto"
        />
        <RevealGroup as="div" step={60} className="mt-14 space-y-16">
          {services.map((service) => (
            <div key={service}>
              <h3 className="font-display text-xl font-semibold text-neutral-ink">{service}</h3>
              <div className="mt-6">
                <Reviews only={service} limit={reviews.length} columns={3} />
              </div>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="surface" size="sm">
        <CtaBanner />
      </Section>
    </>
  );
}

/** A page published from the builder at /customer-stories/ replaces this built-in version. */
export default cmsOr('/customer-stories/', CustomerStoriesPage);
