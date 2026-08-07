import { guarantee } from '@/content/marketing';
import { Icon } from './ui/Icon';
import { Reveal } from './ui/Reveal';
import { links } from '@/lib/site';

/**
 * Centred guarantee block (§2.3.6).
 *
 * The five stars are the brief's visual device for this section, not a review
 * score — Vanzoo publishes no verified rating, so nothing here claims one. The
 * row is marked `aria-hidden` and the promise is carried entirely by the text.
 */
export function GuaranteeBlock() {
  return (
    <Reveal variant="scale" className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-accent-gold-soft">{guarantee.eyebrow}</p>

      <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon key={index} name="star" className="text-2xl text-accent-gold" />
        ))}
      </div>

      <p className="mt-7 font-display text-2xl font-semibold leading-snug text-white text-pretty sm:text-3xl">
        {guarantee.statement}
      </p>

      <a
        href={links.bookPickup}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-inverse btn-lg mt-9"
      >
        {guarantee.ctaLabel}
      </a>
    </Reveal>
  );
}
