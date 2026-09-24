import Image from 'next/image';
import { pillars, pillarsIntro, type PillarPointIcon } from '@/content/pillars';
import { Reveal } from './ui/Reveal';

/**
 * "Why Choose VANZOO?" as a sticky split-scroll, after rinse.com's services
 * page. Each pillar is its own two-column block: the left column (icon, title,
 * tagline, counter) is `position: sticky` *within that block*, so it holds
 * while the taller right column (image + three points) scrolls past, then
 * leaves with its block as the next pillar's left side takes over. Pure CSS —
 * no scroll listeners. Points fade up via the shared Reveal observer, which
 * already honours prefers-reduced-motion.
 *
 * Nothing between this section and the viewport may set `overflow` other than
 * `visible`, or the sticky columns stop sticking.
 */
export function WhyChoosePillars() {
  const total = String(pillars.length).padStart(2, '0');

  return (
    <section aria-labelledby="why-choose-heading" className="bg-neutral-surface py-section">
      {/* Right padding on lg keeps content clear of the fixed contact rail
          until the viewport is wide enough for the shell's own margin to do it. */}
      <div className="shell lg:pr-20 2xl:pr-8">
        {/* Intro — normal flow */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow tracking-[0.2em]">{pillarsIntro.eyebrow}</p>
          <h2 id="why-choose-heading" className="mt-4 font-display text-[clamp(2rem,4.6vw,3.75rem)] font-medium leading-[1.08] text-neutral-ink">
            {pillarsIntro.heading}
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-[75rem] md:mt-20">
          {pillars.map((pillar, index) => (
            <article
              key={pillar.id}
              aria-labelledby={`pillar-${pillar.id}`}
              className="grid items-start gap-10 border-t border-neutral-line pt-16 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16 [&:not(:first-child)]:mt-[7.5rem]"
            >
              {/* Left — sticky within this block only */}
              <div className="md:sticky md:top-[calc(var(--header-h)+2.5rem)]">
                <Image
                  src={pillar.icon.src}
                  alt={pillar.icon.alt}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-[18px]"
                />
                <p className="mt-6 text-sm font-semibold tabular-nums tracking-[0.18em] text-accent-gold-ink">
                  {String(index + 1).padStart(2, '0')} / {total}
                </p>
                <h3
                  id={`pillar-${pillar.id}`}
                  className="mt-2 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.05] text-neutral-ink"
                >
                  {pillar.title}
                </h3>
                <p className="mt-4 max-w-sm text-lg leading-relaxed text-pretty text-neutral-body">{pillar.tagline}</p>
              </div>

              {/* Right — scrolls */}
              <div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-brand-light">
                  <Image
                    src={pillar.image.src}
                    alt={pillar.image.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1200px) 42rem, (min-width: 768px) 58vw, 92vw"
                    className="object-cover"
                  />
                </div>

                <ul className="mt-14 space-y-16 md:mt-20 md:space-y-24">
                  {pillar.points.map((point) => (
                    <li key={point.heading}>
                      <Reveal variant="up" className="flex gap-5 sm:gap-6">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-neutral-line text-brand">
                          <PointIcon name={point.icon} />
                        </span>
                        <div>
                          <h4 className="font-display text-[clamp(1.375rem,2vw,1.625rem)] font-medium leading-snug text-neutral-ink">
                            {point.heading}
                          </h4>
                          <p className="mt-2 max-w-xl text-base leading-relaxed text-pretty text-neutral-body">
                            {point.body}
                          </p>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Outlined 24px point icons, dark-green stroke. */
function PointIcon({ name }: { name: PillarPointIcon }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-6 w-6',
    'aria-hidden': true,
  };

  switch (name) {
    case 'machine':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <circle cx="12" cy="13" r="4.5" />
          <path d="M7 6h2M14 6h3" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...props}>
          <path d="M4 5h16l-6 7.5V19l-4 1.5v-8L4 5Z" />
        </svg>
      );
    case 'steps':
      return (
        <svg {...props}>
          <path d="M9 6h11M9 12h11M9 18h11" />
          <path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17" />
        </svg>
      );
    case 'no-flask':
      return (
        <svg {...props}>
          <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" />
          <path d="M4 4l16 16" />
        </svg>
      );
    case 'percent':
      return (
        <svg {...props}>
          <path d="M19 5 5 19" />
          <circle cx="7" cy="7" r="2.5" />
          <circle cx="17" cy="17" r="2.5" />
        </svg>
      );
    case 'air':
      return (
        <svg {...props}>
          <path d="M3 9h11a2.5 2.5 0 1 0-2.5-2.5M3 13h15a2.5 2.5 0 1 1-2.5 2.5M3 17h7" />
        </svg>
      );
    case 'drop':
      return (
        <svg {...props}>
          <path d="M12 3.5c3 3.8 5.5 6.9 5.5 10a5.5 5.5 0 0 1-11 0c0-3.1 2.5-6.2 5.5-10Z" />
          <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 3 5 6v5.5c0 4.2 2.9 7.8 7 9.5 4.1-1.7 7-5.3 7-9.5V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'feather':
      return (
        <svg {...props}>
          <path d="M20 4c-7 0-12 5-12 12v4" />
          <path d="M20 4c0 7-4 11-11 12M8 16l4-4M14 9h-3" />
        </svg>
      );
    case 'recycle':
      return (
        <svg {...props}>
          <path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6" />
          <path d="M18 3v4h-4M6 21v-4h4" />
        </svg>
      );
    case 'water':
      return (
        <svg {...props}>
          <path d="M3 8c1.5 0 1.5-1.5 3-1.5S7.5 8 9 8s1.5-1.5 3-1.5S13.5 8 15 8s1.5-1.5 3-1.5S19.5 8 21 8" />
          <path d="M3 13c1.5 0 1.5-1.5 3-1.5S7.5 13 9 13s1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5" />
          <path d="M3 18c1.5 0 1.5-1.5 3-1.5S7.5 18 9 18s1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5" />
        </svg>
      );
    case 'box':
      return (
        <svg {...props}>
          <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
          <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
        </svg>
      );
  }
}
