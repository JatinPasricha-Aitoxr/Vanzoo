import Image from 'next/image';
import Link from 'next/link';
import { AppPromo } from '@/components/AppPromo';
import { AutoScrollRow } from '@/components/AutoScrollRow';
import { BlogGrid } from '@/components/BlogCard';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { EnquiryForm } from '@/components/EnquiryForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { GuaranteeBlock } from '@/components/GuaranteeBlock';
import { Mascot } from '@/components/Mascot';
import { PersonaScroller } from '@/components/PersonaScroller';
import { ServiceRow } from '@/components/ServiceRow';
import { Highlight } from '@/components/ui/Highlight';
import { Section, SectionHeading } from '@/components/ui/Section';
import { posts } from '@/content/blog';
import { enquiryIntro, faqIntro, heroOffer, homeFaqs } from '@/content/marketing';
import { serviceEntries } from '@/content/services';
import { links, site } from '@/lib/site';

/** The homepage sections that were inline in app/page.tsx, now parameterised so the editor can change their text. */

const homeServices = serviceEntries.map((entry, i) => ({
  number: String(i + 1).padStart(2, '0'),
  title: entry.title,
  body: entry.body,
  image: entry.image,
  imageAlt: entry.imageAlt,
  imagePosition: entry.imagePosition,
  learnMore: { href: `/services/${entry.id}/`, label: 'Learn more' },
}));

export function ServicesRowSection(p: { eyebrow: string; title: string; intro: string }) {
  return (
    <Section tone="muted" id="services" aria-labelledby="services-heading">
      <SectionHeading id="services-heading" eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <AutoScrollRow label="services" className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
        {homeServices.map((service, index) => (
          <ServiceRow key={service.number} service={service} index={index} onEnquire={<EnquiryDialog subject={service.title} />} />
        ))}
      </AutoScrollRow>
    </Section>
  );
}

export function VisitStoreSection(p: { eyebrow: string; title: string; body: string; image: string; imageAlt: string; buttonLabel: string }) {
  return (
    <Section tone="surface" aria-labelledby="store-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="media-frame mx-auto aspect-[3/4] w-full max-w-sm lg:max-w-md">
          <Image src={p.image} alt={p.imageAlt} fill loading="lazy" sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 id="store-heading" className="mt-3 text-display-lg">
            <Highlight text={p.title} dark={false} />
          </h2>
          <p className="mt-5 max-w-lg text-lead text-pretty text-neutral-body">{p.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/locate-us/" className="btn-gold btn-lg">
              {p.buttonLabel}
            </Link>
            <a href={`tel:${site.phoneHref}`} className="btn-secondary btn-lg">
              Call {site.phone}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function PersonasSection(p: { eyebrow: string; title: string; intro: string }) {
  return (
    <Section tone="muted" aria-labelledby="personas-heading">
      <SectionHeading id="personas-heading" eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <div className="mt-12">
        <PersonaScroller />
      </div>
      <div className="mt-10">
        <EnquiryDialog label="Enquire Now" variant="button" />
      </div>
    </Section>
  );
}

export function BlogPreviewSection(p: { eyebrow: string; title: string; count: number }) {
  return (
    <Section tone="surface" aria-labelledby="blog-preview-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading id="blog-preview-heading" eyebrow={p.eyebrow} title={p.title} className="max-w-xl" />
        <Link href="/blogs/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark">
          View all articles <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="mt-12">
        <BlogGrid posts={posts.slice(0, p.count)} />
      </div>
    </Section>
  );
}

export function FaqSection(p: { title: string; showMascot: boolean }) {
  return (
    <Section tone="muted" id="faq" aria-labelledby="faq-heading" className="relative">
      {p.showMascot ? (
        <Mascot className="pointer-events-none absolute right-8 top-10 hidden w-40 xl:block 2xl:right-24 2xl:w-48" sizes="192px" />
      ) : null}
      <SectionHeading id="faq-heading" title={p.title} intro={faqIntro} align="center" className="mx-auto" />
      <div className="mt-12">
        <FAQAccordion faqs={homeFaqs} groupName="home-faq" />
      </div>
    </Section>
  );
}

export function EnquirySection(p: { eyebrow: string; title: string }) {
  return (
    <Section tone="light" id="enquiry" aria-labelledby="enquiry-heading">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <SectionHeading id="enquiry-heading" eyebrow={p.eyebrow} title={p.title} intro={enquiryIntro} />
          <ul className="mt-8 space-y-3 text-[0.9375rem]">
            <li>
              <a href={`tel:${site.phoneHref}`} className="font-display text-lg font-semibold text-brand transition-colors hover:text-brand-dark">
                {site.phone}
              </a>
              <span className="ml-2 text-sm text-neutral-body">— fastest for same-day slots</span>
            </li>
            <li>
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline decoration-brand/35 underline-offset-2 transition-colors hover:decoration-brand">
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="font-medium text-brand underline decoration-brand/35 underline-offset-2 transition-colors hover:decoration-brand">
                {site.email}
              </a>
            </li>
          </ul>
          <p className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-card border border-accent-gold/50 bg-white px-4 py-3 text-sm text-neutral-ink">
            <span className="font-semibold">New to Vanzoo?</span>
            {heroOffer.lead} —
            <span className="rounded-pill bg-accent-gold px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">{heroOffer.code}</span>
          </p>
        </div>
        <EnquiryForm />
      </div>
    </Section>
  );
}

export function GuaranteeSection() {
  return (
    <Section tone="dark" size="sm">
      <GuaranteeBlock />
    </Section>
  );
}

export function AppPromoSection() {
  return (
    <Section tone="dark">
      <AppPromo />
    </Section>
  );
}
