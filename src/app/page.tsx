import Image from 'next/image';
import Link from 'next/link';
import { AppPromo } from '@/components/AppPromo';
import { AreaCoverageGrid } from '@/components/AreaCoverageGrid';
import { BlogGrid } from '@/components/BlogCard';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { EnquiryForm } from '@/components/EnquiryForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { GuaranteeBlock } from '@/components/GuaranteeBlock';
import { Hero } from '@/components/Hero';
import { IconFeatureGrid } from '@/components/IconFeatureGrid';
import { JsonLd } from '@/components/JsonLd';
import { PersonaScroller } from '@/components/PersonaScroller';
import { Reviews } from '@/components/Reviews';
import { RevealGroup } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ServiceSlider } from '@/components/ServiceSlider';
import { SectionCtas } from '@/components/SectionCtas';
import { TabbedExplainer } from '@/components/TabbedExplainer';
import { TrustStrip } from '@/components/TrustStrip';
import { NineStepProcess } from '@/components/NineStepProcess';
import { videoFor } from '@/lib/videos';
import { about } from '@/content/marketing';
import { WeCareBanner } from '@/components/WeCareBanner';
import { WhyChoosePillars } from '@/components/WhyChoosePillars';
import { posts } from '@/content/blog';
import { SHOW_REVIEWS, reviewsIntro } from '@/content/reviews';
import {
  collage,
  enquiryIntro,
  faqIntro,
  heroOffer,
  homeFaqs,
  homeHero,
  services,
} from '@/content/marketing';
import { buildMetadata, faqSchema, localBusinessSchema } from '@/lib/seo';
import { areaGroups, links, serviceAreas, site } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Vanzoo – Luxury Fabric Care & Eco-Friendly Dry Cleaning',
  description:
    'Experience premium fabric care by Vanzoo using advanced Italian hydrocarbon technology—eco-conscious, gentle on fabrics, and powerful on tough everyday stains. Free pickup and delivery across Gurgaon.',
  path: '/',
  image: homeHero.image,
  imageAlt: homeHero.imageAlt,
});

const inAction = [
  { title: 'Our stores', body: 'Walk in to our DLF Phase IV and M3M Urbana stores for drop-offs and advice.', src: '/images/client/store-front.jpg', alt: 'Vanzoo store front in Gurgaon' },
  { title: 'Doorstep riders', body: 'Trained riders collect and deliver free, in Vanzoo-branded protective bags.', src: '/images/client/rider-bike.jpg', alt: 'Vanzoo rider on a bike with the green delivery bag' },
  { title: 'Pickup vans', body: 'Branded vans handle bulk pickups — curtains, carpets, blankets and more.', src: '/images/client/van.jpg', alt: 'Green Vanzoo pickup and delivery van' },
  { title: 'Protective packaging', body: 'Every order comes back wrapped, hung or folded in premium Vanzoo packaging.', src: '/images/client/blanket-packaging.jpg', alt: 'Blankets and linens in Vanzoo packaging' },
] as const;

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
        video={homeHero.video}
        secondaryCta={{ label: 'See how it works', href: '#how-it-works' }}
        offer={heroOffer}
      />
      <TrustStrip />

      {/* 2 — Why Choose Vanzoo — sticky split-scroll pillars (rinse.com pattern) */}
      <WhyChoosePillars />

      {/* 3 — Services */}
      <Section tone="muted" id="services" aria-labelledby="services-heading">
        <SectionHeading
          id="services-heading"
          eyebrow="What we do"
          title={<>Our Premium Fabric Care <span className="hl">Services</span></>}
          intro="Many services, one standard of care — each piece assessed individually before it goes anywhere near a machine."
        />
        <div className="mt-10">
          <ServiceSlider />
        </div>
        <SectionCtas />
      </Section>

      {/* 4 — The dry cleaning process, flat to save space */}
      <Section tone="surface" id="how-it-works" aria-labelledby="dry-cleaning-process-heading">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div>
            <p className="eyebrow">Dry Cleaning</p>
            <h2 id="dry-cleaning-process-heading" className="mt-3 text-display-md">
              <span className="hl">Dry Cleaning Process, the Vanzoo Way</span>
            </h2>
            <p className="mt-4 text-lead text-pretty text-neutral-body">
              Free pickup and delivery to save you time. Italian <mark className="hl">hydrocarbon cleaning</mark>{' '}
              and hand finishing to keep every piece looking its best — nine steps, from your door and back.
            </p>
            <SectionCtas />
          </div>
          <div className="media-frame relative aspect-[16/10]">
            <Image
              src="/images/client/machine-and-iron.jpg"
              alt="Vanzoo team running the hydrocarbon dry cleaning machine and steam pressing a garment"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="mt-10">
          <NineStepProcess />
        </div>
      </Section>

      {/* 5 — Areas we serve, straight after the process */}
      <Section tone="muted" aria-labelledby="areas-heading">
        <SectionHeading
          id="areas-heading"
          eyebrow="Where we deliver"
          title={<>Every area we serve in <span className="hl">Gurgaon</span></>}
          intro={`Free pickup and delivery across ${serviceAreas.length} neighbourhoods in ${areaGroups.length} corridors — from DLF and Golf Course Road to New Gurgaon. Find yours below.`}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12">
          <AreaCoverageGrid headingLevel="h3" showBlurb={false} />
        </div>
        <SectionCtas className="justify-center" />
        <p className="mt-6 text-center">
          <Link
            href="/areas-we-serve/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            Check your pincode & see full coverage details
            <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Section>

      {/* 6 — About Us, after Areas */}
      <Section tone="surface" id="about" aria-labelledby="about-heading">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="eyebrow">About Us</p>
            <h2 id="about-heading" className="mt-3 text-display-md">
              Where <span className="hl">Craft Meets Care</span>
            </h2>
            <p className="mt-4 text-lead text-pretty text-neutral-body">{about.intro}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/about-us/" className="btn-primary btn-md">Read our story</Link>
              <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-md">Book Pickup</a>
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md">Chat on WhatsApp</a>
            </div>
          </div>
          {/* V-logo brand video: /public/videos/about.mp4 */}
          {videoFor('about') ? (
            <video src="/videos/about.mp4" controls muted loop playsInline preload="metadata" className="aspect-video w-full rounded-card bg-brand-ink object-cover shadow-lift" />
          ) : (
            <div className="band-dark relative flex aspect-video items-center justify-center rounded-card">
              <Image src="/images/brand/vanzoo-mark.png" alt="Vanzoo V logo" width={160} height={160} className="h-32 w-32" />
            </div>
          )}
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

      {/* Vanzoo in action — images paired with text, not a bare collage */}
      <Section tone="surface" aria-labelledby="in-action-heading">
        <SectionHeading
          id="in-action-heading"
          eyebrow="Behind the service"
          title={<>Our stores, riders and <span className="hl">packaging</span></>}
          intro="The people and places that handle your wardrobe — from the store counter to the doorstep."
        />
        <RevealGroup as="ul" step={70} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {inAction.map((tile) => (
            <li key={tile.title} className="overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift">
              <div className="media-frame relative aspect-[4/3] rounded-none">
                <Image src={tile.src} alt={tile.alt} fill loading="lazy" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw" className="card-media object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-semibold text-neutral-ink">{tile.title}</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-neutral-body">{tile.body}</p>
              </div>
            </li>
          ))}
        </RevealGroup>
        <SectionCtas />
      </Section>

      {/* Editorial statement band — the old site's "we care" banner as live type. */}
      <WeCareBanner />

      {/* 6 — Customer reviews. Hidden on the live site until real reviews
          are added in content/reviews.ts; shown with a notice in `next dev`. */}
      {SHOW_REVIEWS ? (
        <Section tone="muted" aria-labelledby="reviews-heading">
          <SectionHeading
            id="reviews-heading"
            eyebrow="Customer reviews"
            title="Trusted with Gurgaon's best-loved wardrobes"
            intro={reviewsIntro}
            align="center"
            className="mx-auto"
          />
          <div className="mt-12">
            <Reviews />
          </div>
        </Section>
      ) : null}

      {/* 8 — Guarantee */}
      <Section tone="dark" size="sm">
        <GuaranteeBlock />
      </Section>

      {/* 9 — App promo, on the dark band as the old site runs it */}
      <Section tone="dark">
        <AppPromo />
      </Section>

      {/* 11 — Blog preview */}
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            View all articles
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
              <path
                d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <div className="mt-12">
          <BlogGrid posts={latestPosts} />
        </div>
      </Section>

      {/* 12 — FAQ */}
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

      {/* 13 — Enquiry */}
      <Section tone="light" id="enquiry" aria-labelledby="enquiry-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="enquiry-heading"
              eyebrow="Get in touch"
              title="Request an Enquiry"
              intro={enquiryIntro}
            />

            {/* Direct routes beside the form, so the visitor who scrolled this
                far never has to hunt the footer for a phone number. */}
            <ul className="mt-8 space-y-3 text-[0.9375rem]">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="font-display text-lg font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  {site.phone}
                </a>
                <span className="ml-2 text-sm text-neutral-body">— fastest for same-day slots</span>
              </li>
              <li>
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand underline decoration-brand/35 underline-offset-2 transition-colors hover:decoration-brand"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-brand underline decoration-brand/35 underline-offset-2 transition-colors hover:decoration-brand"
                >
                  {site.email}
                </a>
              </li>
            </ul>

            <p className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-card border border-accent-gold/50 bg-white px-4 py-3 text-sm text-neutral-ink">
              <span className="font-semibold">New to Vanzoo?</span>
              {heroOffer.lead} —
              <span className="rounded-pill bg-accent-gold px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">
                {heroOffer.code}
              </span>
            </p>
          </div>
          <EnquiryForm />
        </div>
      </Section>
    </>
  );
}
