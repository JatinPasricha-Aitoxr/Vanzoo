import { guarantee } from '@/content/marketing';
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
          <Star key={index} />
        ))}
      </div>

      <h2 className="mt-6 text-display-lg text-white">{guarantee.headline}</h2>

      <p className="mt-5 text-lead leading-relaxed text-pretty text-white/80">
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

function Star() {
  return (
    <svg viewBox="0 0 20 20" className="h-6 w-6 text-accent-gold" fill="currentColor">
      <path d="M10 1.6l2.47 5.28 5.53.72-4.08 3.9 1.05 5.66L10 14.4l-4.97 2.76 1.05-5.66L2 7.6l5.53-.72L10 1.6z" />
    </svg>
  );
}
