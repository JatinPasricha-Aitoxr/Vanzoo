import Image from 'next/image';
import Link from 'next/link';
import { links } from '@/lib/site';
import { cn } from '@/lib/cn';

type HeroProps = {
  headline: readonly string[];
  subhead: string;
  image: string;
  imageAlt: string;
  primaryCta?: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string };
  /** `full` is the homepage's full-bleed treatment; `band` is the shorter
   *  variant inner pages use so their content starts above the fold. */
  variant?: 'full' | 'band';
  /** Breadcrumb trail, rendered above the headline. */
  breadcrumbs?: React.ReactNode;
  /** Anything extra below the CTA row — an offer pill, a rating, a note. */
  children?: React.ReactNode;
};

/**
 * Full-bleed photographic hero (§2.3.2).
 *
 * The image is the LCP element on every page that uses this, so it is the only
 * `priority` image on the site and carries an explicit `sizes` of 100vw.
 */
export function Hero({
  headline,
  subhead,
  image,
  imageAlt,
  primaryCta = { label: 'Book Pickup', href: links.bookPickup, external: true },
  secondaryCta,
  variant = 'full',
  breadcrumbs,
  children,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark">
      {/* The image sits in its own wrapper so two independent motions can stack:
          `hero-parallax` drifts the wrapper with scroll (scroll-timeline, off
          the main thread), while `hero-media` settles the image on load. */}
      <div className="hero-parallax absolute inset-0 -z-10">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="hero-media object-cover"
        />
      </div>
      {/* Two stacked scrims: a vertical one so the header stays legible, and a
          left-weighted one so the copy column keeps AA contrast over any crop. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-ink/70 via-neutral-ink/45 to-neutral-ink/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-ink/70 via-neutral-ink/25 to-transparent"
      />

      <div
        className={cn(
          'shell relative flex flex-col justify-end pb-16 pt-[calc(var(--header-h)+4rem)]',
          variant === 'full'
            ? 'min-h-[clamp(34rem,82svh,46rem)]'
            : 'min-h-[clamp(24rem,52svh,32rem)]',
        )}
      >
        <div className="max-w-3xl">
          {breadcrumbs ? (
            <div
              className="hero-stagger mb-6"
              style={{ '--line': -1 } as React.CSSProperties}
            >
              {breadcrumbs}
            </div>
          ) : null}

          {/* Each line rises out of its own overflow-hidden mask, so the text
              appears to lift off the baseline rather than simply fade in. */}
          <h1 className="text-display-xl text-white">
            {headline.map((line, index) => (
              <span key={line} className="hero-line-mask">
                <span
                  className={cn('hero-line', index > 0 && 'text-white/85')}
                  style={{ '--line': index } as React.CSSProperties}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p
            className="hero-stagger mt-6 max-w-xl text-lead text-pretty text-white/85"
            style={{ '--line': headline.length } as React.CSSProperties}
          >
            {subhead}
          </p>

          <div
            className="hero-stagger mt-9 flex flex-wrap items-center gap-3"
            style={{ '--line': headline.length + 1 } as React.CSSProperties}
          >
            {primaryCta.external ? (
              <a
                href={primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-lg"
              >
                {primaryCta.label}
              </a>
            ) : (
              <Link href={primaryCta.href} className="btn-primary btn-lg">
                {primaryCta.label}
              </Link>
            )}

            {secondaryCta ? (
              <Link href={secondaryCta.href} className="btn-onDark btn-lg">
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Photographic page header — the hero every inner route gets.
 *
 * `image` is optional only so the policy pages can opt out: a photograph over
 * "Terms & Conditions" reads as marketing where a reader is looking for a
 * contract. Everything else passes one.
 *
 * The image is `priority` here for the same reason it is in `Hero`: on these
 * routes it is the LCP element, and lazy-loading it would push the largest
 * paint behind the rest of the page.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  /** Buttons rendered under the intro. */
  actions?: React.ReactNode;
  /** Breadcrumbs, rendered above the eyebrow. */
  children?: React.ReactNode;
}) {
  const hasImage = Boolean(image);

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden pb-section-sm pt-[calc(var(--header-h)+3.5rem)]',
        hasImage ? 'bg-brand-dark' : 'bg-brand-light',
      )}
    >
      {hasImage ? (
        <>
          <div className="hero-parallax absolute inset-0 -z-10">
            <Image
              src={image!}
              alt={imageAlt ?? ''}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="hero-media object-cover"
            />
          </div>
          {/* Same two-scrim treatment as the full hero: vertical for the header,
              left-weighted so the copy column holds AA contrast over any crop. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-ink/75 via-neutral-ink/55 to-neutral-ink/75"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-ink/70 via-neutral-ink/30 to-transparent"
          />
        </>
      ) : null}

      {/* Staggered on load rather than on scroll — a page header is always
          above the fold, so there is no scroll event to wait for. */}
      <div className="shell">
        <div
          className="hero-stagger"
          style={{ '--line': 0 } as React.CSSProperties}
        >
          {children}
        </div>

        {eyebrow ? (
          <p
            className={cn('hero-stagger eyebrow mt-6', hasImage && 'text-accent-gold')}
            style={{ '--line': 1 } as React.CSSProperties}
          >
            {eyebrow}
          </p>
        ) : null}

        <h1
          className={cn(
            'hero-stagger text-display-lg',
            eyebrow ? 'mt-3' : 'mt-6',
            hasImage && 'max-w-4xl text-white',
          )}
          style={{ '--line': eyebrow ? 2 : 1 } as React.CSSProperties}
        >
          {title}
        </h1>

        {intro ? (
          <p
            className={cn(
              'hero-stagger mt-4 max-w-2xl text-lead text-pretty',
              hasImage ? 'text-white/85' : 'text-neutral-body',
            )}
            style={{ '--line': eyebrow ? 3 : 2 } as React.CSSProperties}
          >
            {intro}
          </p>
        ) : null}

        {actions ? (
          <div
            className="hero-stagger mt-8 flex flex-wrap items-center gap-3"
            style={{ '--line': eyebrow ? 4 : 3 } as React.CSSProperties}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
