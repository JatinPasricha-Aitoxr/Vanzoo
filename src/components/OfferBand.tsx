import Image from 'next/image';
import { heroOffer } from '@/content/marketing';
import { SectionCtas } from './SectionCtas';
import { Section } from './ui/Section';

/** First-order 25% offer band — the offer creative plus a booking CTA. */
export function OfferBand() {
  return (
    <Section tone="dark" size="sm" aria-labelledby="offer-band-heading">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="media-frame relative mx-auto aspect-[3/2] w-full max-w-md">
          <Image
            src="/images/client/offer-25-banner.jpg"
            alt="Vanzoo — 25% off your first order"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 35vw, 90vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow text-accent-gold-soft">New to Vanzoo?</p>
          <h2 id="offer-band-heading" className="mt-3 text-display-sm text-white">
            <span className="hl-on-dark">25% off</span> your first order
          </h2>
          <p className="mt-3 text-lead text-white/80">
            {heroOffer.lead} — {heroOffer.codeLabel.toLowerCase()}{' '}
            <strong className="rounded-pill bg-accent-gold px-2.5 py-0.5 text-sm text-brand-ink">{heroOffer.code}</strong>{' '}
            when you book.
          </p>
          <SectionCtas tone="dark" />
        </div>
      </div>
    </Section>
  );
}
