import { PUBLISHED, reviews, type Review } from '@/content/reviews';
import { RevealGroup } from './ui/Reveal';

/**
 * Customer reviews grid.
 *
 * Renders nothing when there are no reviews, and carries a visible "sample
 * content" banner until `PUBLISHED` is flipped in content/reviews.ts — a
 * placeholder that looks like a finished testimonial is worse than no
 * testimonial at all.
 */
export function Reviews() {
  if (reviews.length === 0) return null;

  return (
    <>
      {!PUBLISHED ? (
        <p className="mb-8 rounded-card border border-dashed border-accent-gold-ink/40 bg-accent-gold/10 px-5 py-4 text-sm text-accent-gold-ink">
          <strong className="font-semibold">Sample content —</strong> these are placeholders, not
          real reviews. Replace them in{' '}
          <code className="rounded bg-white/60 px-1.5 py-0.5 text-[0.8125rem]">
            src/content/reviews.ts
          </code>{' '}
          and set <code className="rounded bg-white/60 px-1.5 py-0.5 text-[0.8125rem]">PUBLISHED</code>{' '}
          to <code className="rounded bg-white/60 px-1.5 py-0.5 text-[0.8125rem]">true</code> to
          remove this notice.
        </p>
      ) : null}

      <RevealGroup
        as="ul"
        step={90}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {reviews.map((review, index) => (
          <ReviewCard key={`${review.author}-${index}`} review={review} />
        ))}
      </RevealGroup>
    </>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <li className="flex flex-col rounded-card border border-neutral-line bg-white p-6 shadow-lift transition-[box-shadow,border-color,transform] duration-200 ease-entrance hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-lift-hover">
      <Stars rating={review.rating} />

      <blockquote className="mt-4 flex-1">
        <p className="text-[0.9375rem] leading-relaxed text-neutral-body">
          <QuoteMark />
          {review.quote}
        </p>
      </blockquote>

      <footer className="mt-5 border-t border-neutral-line pt-4">
        <p className="font-display text-[0.9375rem] font-semibold text-neutral-ink">
          {review.author}
        </p>
        <p className="mt-0.5 text-xs text-neutral-body">{review.context}</p>
        <p className="mt-3 inline-block rounded-pill bg-brand-tint px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-brand">
          {review.service}
        </p>
      </footer>
    </li>
  );
}

function Stars({ rating }: { rating: number }) {
  const whole = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <p className="flex items-center gap-0.5" aria-label={`Rated ${whole} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={index < whole ? 'h-4 w-4 text-accent-gold' : 'h-4 w-4 text-neutral-line'}
          fill="currentColor"
        >
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.22l-4.94 2.6.94-5.5-4-3.9 5.53-.81L10 1.6z" />
        </svg>
      ))}
    </p>
  );
}

function QuoteMark() {
  return (
    <span
      aria-hidden="true"
      className="mr-1 font-display text-2xl font-semibold leading-none text-accent-gold"
    >
      “
    </span>
  );
}
