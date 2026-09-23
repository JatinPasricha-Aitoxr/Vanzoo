import Image from 'next/image';
import Link from 'next/link';
import { links } from '@/lib/site';
import { HeroVideo } from './HeroVideo';
import { cn } from '@/lib/cn';

type HeroProps = {
  headline: readonly string[];
  subhead: string;
  image: string;
  imageAlt: string;
  /** Optional muted background loop over the photo — landscape and portrait cuts. */
  video?: { desktop: string; mobile: string };
  primaryCta?: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string };
  /** Current promotion, rendered as a gold chip above the headline. */
  offer?: { lead: string; codeLabel: string; code: string };
  /** `full` is the homepage's full-bleed treatment; `band` is the shorter
   *  variant inner pages use so their content starts above the fold. */
  variant?: 'full' | 'band';
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
  video,
  primaryCta = { label: 'Book Pickup', href: links.bookPickup, external: true },
  secondaryCta,
  offer,
  variant = 'full',
  children,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-ink">
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
        {video ? <HeroVideo desktop={video.desktop} mobile={video.mobile} /> : null}
      </div>
      {/* Two stacked scrims: a vertical one so the header stays legible, and a
          left-weighted one so the copy column keeps AA contrast over any crop.
          Both are tinted with the brand green rather than a neutral black, so
          the photograph sits in the palette instead of beside it. */}
      {/* With a video the scrims go neutral and much lighter so the footage
          reads in its own colour; a soft left-side shade and text shadows keep
          the copy legible. Photo heroes keep the green tint. */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 -z-10 bg-gradient-to-b',
          video
            ? 'from-black/35 via-black/10 to-black/60 md:via-transparent md:to-black/25'
            : 'from-brand-ink/75 via-brand-ink/45 to-brand-ink/75',
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 -z-10 bg-gradient-to-r to-transparent',
          video ? 'from-black/45 via-black/10' : 'from-brand-ink/75 via-brand-ink/30',
        )}
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
          {offer ? (
            <p
              className="hero-stagger mb-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-pill border border-accent-gold/50 bg-brand-ink/55 py-2 pl-4 pr-2 text-sm font-medium text-white backdrop-blur-sm"
              style={{ '--line': 0 } as React.CSSProperties}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-pill bg-accent-gold" aria-hidden="true" />
              {offer.lead}
              <span className="rounded-pill bg-accent-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">
                {offer.codeLabel} {offer.code}
              </span>
            </p>
          ) : null}

          {/* Each line rises out of its own overflow-hidden mask, so the text
              appears to lift off the baseline rather than simply fade in. */}
          <h1
            className={cn(
              'text-display-xl text-white',
              video && '[text-shadow:0_2px_24px_rgba(0,0,0,0.45)]',
            )}
          >
            {headline.map((line, index) => (
              <span key={line} className="hero-line-mask">
                <span
                  // Trailing lines take the soft gold: the one typographic
                  // flourish in the hero, and the cue that carries the couture
                  // register before a word of copy is read.
                  className={cn('hero-line', index > 0 && 'text-accent-gold-soft')}
                  style={{ '--line': index } as React.CSSProperties}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p
            className="hero-stagger mt-6 max-w-xl text-pretty text-[clamp(1.125rem,1.4vw,1.3125rem)] leading-relaxed text-white/95 [text-shadow:0_1px_14px_rgba(0,26,22,0.5)]"
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
                className="btn-gold btn-lg"
              >
                {primaryCta.label}
              </a>
            ) : (
              <Link href={primaryCta.href} className="btn-gold btn-lg">
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
 * Compact page header for routes that don't warrant a full photographic hero
 * (policies, blog index). Pass `image` for the photographic treatment — a
 * shorter editorial banner with the title over the photo, which is how the old
 * site opens its tariff pages.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  imagePosition,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Banner photograph. Text switches to on-dark styling over a green scrim. */
  image?: string;
  imageAlt?: string;
  /** CSS object-position — crop the banner so any baked-in artwork sits clear
   *  of the live title. */
  imagePosition?: string;
  children?: React.ReactNode;
}) {
  const dark = Boolean(image);

  return (
    <section
      className={cn(
        'relative overflow-hidden pb-section-sm pt-[calc(var(--header-h)+3rem)]',
        dark
          ? 'bg-brand-ink'
          : 'bg-gradient-to-b from-brand-light to-brand-tint after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-accent-gold/50 after:to-transparent',
      )}
    >
      {dark && image ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={imageAlt ?? ''}
              fill
              priority
              sizes="100vw"
              className="hero-media object-cover"
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
            />
          </div>
          {/* Same green-tinted scrim pair as the full hero, so the two
              treatments read as one family. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-brand-ink/80 via-brand-ink/45 to-brand-ink/70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-brand-ink/70 via-brand-ink/25 to-transparent"
          />
        </>
      ) : null}

      {/* Staggered on load rather than on scroll — a page header is always
          above the fold, so there is no scroll event to wait for. */}
      <div className="shell relative">
        <div className="hero-stagger" style={{ '--line': 0 } as React.CSSProperties}>
          {children}
        </div>
        {eyebrow ? (
          <p
            className={cn('hero-stagger eyebrow mt-6', dark && 'text-accent-gold-soft')}
            style={{ '--line': 1 } as React.CSSProperties}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            'hero-stagger text-display-lg',
            eyebrow ? 'mt-3' : 'mt-6',
            dark && 'text-white',
          )}
          style={{ '--line': eyebrow ? 2 : 1 } as React.CSSProperties}
        >
          {title}
        </h1>
        {intro ? (
          <p
            className={cn(
              'hero-stagger mt-4 max-w-2xl text-lead text-pretty',
              dark ? 'text-white/85' : 'text-neutral-body',
            )}
            style={{ '--line': eyebrow ? 3 : 2 } as React.CSSProperties}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
