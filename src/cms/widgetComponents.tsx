import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AreasSection } from '@/components/AreasSection';
import { BrandBand } from '@/components/BrandBand';
import { Hero } from '@/components/Hero';
import { TrustStrip } from '@/components/TrustStrip';
import { VanzooProcess } from '@/components/VanzooProcess';
import { WeCareBanner } from '@/components/WeCareBanner';
import { WhyChoosePillars } from '@/components/WhyChoosePillars';
import { Highlight } from '@/components/ui/Highlight';
import { Section } from '@/components/ui/Section';
import { heroOffer, homeHero } from '@/content/marketing';
import { cn } from '@/lib/cn';
import {
  AppPromoSection,
  BlogPreviewSection,
  EnquirySection,
  FaqSection,
  GuaranteeSection,
  PersonasSection,
  ServicesRowSection,
  VisitStoreSection,
} from './homeSections';
import type { Post } from '@/content/blog';
import { Cta, ContactInfo, FaqCustom, FeatureGrid, PriceList, RichText, Testimonials, Video } from './marketingWidgets';
import type { Block } from './schema';

/**
 * Widget renderers. Written without server-only APIs so the same components
 * render on the public (server) page and inside the editor canvas (client).
 */
type P = Record<string, any>;
type Renderer = (props: P, ctx: { children?: ReactNode; block: Block; posts?: Post[] }) => ReactNode;

const SIZE_CLASS: Record<string, string> = {
  'display-xl': 'text-display-xl',
  'display-lg': 'text-display-lg',
  'display-md': 'text-display-md',
  'display-sm': 'text-display-sm',
  lead: 'text-lead',
};

export const WIDGET_COMPONENTS: Record<string, Renderer> = {
  heading: (p) => {
    const Tag = `h${p.level}` as 'h2';
    return (
      <Tag className={cn('font-display', SIZE_CLASS[p.size] ?? 'text-display-md')}>
        {p.highlight ? <Highlight text={p.text} /> : p.text}
      </Tag>
    );
  },
  text: (p) => (
    <div className={cn('space-y-4 text-pretty text-neutral-body', p.size === 'lead' ? 'text-lead' : p.size === 'small' ? 'text-sm' : 'text-[1rem] leading-relaxed')}>
      {String(p.text)
        .split(/\n{2,}/)
        .map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
    </div>
  ),
  image: (p) => {
    if (!p.src) return null;
    const img = (
      <Image
        src={p.src}
        alt={p.alt || ''}
        width={p.width}
        height={p.height}
        priority={p.priority}
        loading={p.priority ? undefined : 'lazy'}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={cn('h-auto w-full', p.rounded && 'rounded-card')}
      />
    );
    return (
      <figure>
        {p.link ? <Link href={p.link}>{img}</Link> : img}
        {p.caption ? <figcaption className="mt-2 text-center text-sm text-neutral-body">{p.caption}</figcaption> : null}
      </figure>
    );
  },
  button: (p) => {
    const cls = `btn-${p.variant} btn-${p.size}`;
    if (!p.href) return <span className={cls}>{p.label}</span>;
    return p.newTab || /^https?:/.test(p.href) ? (
      <a href={p.href} target={p.newTab ? '_blank' : undefined} rel={p.newTab ? 'noopener noreferrer' : undefined} className={cls}>
        {p.label}
      </a>
    ) : (
      <Link href={p.href} className={cls}>
        {p.label}
      </Link>
    );
  },
  spacer: (p) => <div aria-hidden="true" style={{ height: p.height }} />,
  divider: () => <hr className="border-0 border-t border-accent-gold/50" />,

  container: (p, { children }) => {
    // `Section` supplies the band, tone and the site gutter.
    return (
      <Section tone={p.tone} size={p.size} as={p.tag}>
        <div className={p.contentWidth === 'narrow' ? 'mx-auto max-w-3xl' : undefined}>{children}</div>
      </Section>
    );
  },

  hero: (p) => (
    <Hero
      seoH1={p.seoH1 || undefined}
      highlight={p.highlight}
      highlightWord={p.highlightWord || undefined}
      headline={[p.headline1, p.headline2].filter(Boolean)}
      subhead={p.subhead}
      image={p.image}
      imageAlt={p.imageAlt}
      video={p.showVideo ? homeHero.video : undefined}
      secondaryCta={p.secondaryLabel ? { label: p.secondaryLabel, href: p.secondaryHref || '#' } : undefined}
      offer={p.showOffer ? heroOffer : undefined}
    />
  ),
  'trust-strip': () => <TrustStrip />,
  'why-choose': () => <WhyChoosePillars />,
  'services-row': (p) => <ServicesRowSection eyebrow={p.eyebrow} title={p.title} intro={p.intro} />,
  'visit-store': (p) => <VisitStoreSection {...(p as Parameters<typeof VisitStoreSection>[0])} />,
  process: (p) => <VanzooProcess id="how-it-works" eyebrow={p.eyebrow} heading={p.heading} intro={p.intro} />,
  personas: (p) => <PersonasSection eyebrow={p.eyebrow} title={p.title} intro={p.intro} />,
  'brand-band': () => <BrandBand />,
  'we-care': () => <WeCareBanner />,
  areas: () => <AreasSection />,
  'blog-preview': (p, ctx) => <BlogPreviewSection eyebrow={p.eyebrow} title={p.title} count={p.count} posts={ctx.posts} />,
  faq: (p) => <FaqSection title={p.title} showMascot={p.showMascot} />,
  enquiry: (p) => <EnquirySection eyebrow={p.eyebrow} title={p.title} />,
  guarantee: () => <GuaranteeSection />,
  'app-promo': () => <AppPromoSection />,
  'faq-custom': (p) => <FaqCustom {...p} />,
  testimonials: (p) => <Testimonials {...p} />,
  cta: (p) => <Cta {...p} />,
  'feature-grid': (p) => <FeatureGrid {...p} />,
  'price-list': (p) => <PriceList {...p} />,
  'rich-text': (p) => <RichText {...p} />,
  video: (p) => <Video {...p} />,
  'contact-info': (p) => <ContactInfo {...p} />,
};
