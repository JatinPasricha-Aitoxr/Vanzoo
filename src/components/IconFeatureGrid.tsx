import Image from 'next/image';
import { RevealGroup } from './ui/Reveal';
import { cn } from '@/lib/cn';

export type IconFeature = {
  title?: string;
  label?: string;
  body?: string;
  icon: string;
  iconAlt: string;
};

/**
 * Icon + label grid, used for the "Why Choose VANZOO" badges, the "What Makes
 * VANZOO Different" row, the About pillars and the hydrocarbon comparison.
 *
 * The icons are decorative repetitions of the adjacent text, so they carry an
 * empty alt when a title is present and a descriptive one when they stand alone.
 */
export function IconFeatureGrid({
  items,
  columns = 4,
  tone = 'light',
  className,
}: {
  items: readonly IconFeature[];
  columns?: 3 | 4;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    // One observed element for the whole grid; the stagger is applied per child
    // in CSS. Observing each tile separately would cost four observation
    // contexts per grid and this component appears on most pages.
    <RevealGroup
      as="ul"
      step={70}
      className={cn(
        'grid gap-x-5 gap-y-8 sm:gap-6',
        columns === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3',
        className,
      )}
    >
      {items.map((item) => {
        const heading = item.title ?? item.label ?? '';
        return (
          <li
            key={heading}
            className={cn(
              'card-lift group rounded-card border p-5 sm:p-6',
              dark
                ? 'border-white/15 bg-white/[0.06] hover:border-white/30'
                : 'border-neutral-line bg-white hover:border-brand/35',
            )}
          >
            <span
              className={cn(
                'inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-card',
                dark ? 'bg-white/10' : 'bg-brand-light',
              )}
            >
              <Image
                src={item.icon}
                alt={item.body ? '' : item.iconAlt}
                width={96}
                height={96}
                loading="lazy"
                sizes="48px"
                className="h-12 w-12 object-contain transition-transform duration-500 ease-entrance group-hover:scale-110"
              />
            </span>

            <h3
              className={cn(
                'mt-4 font-display text-lg font-semibold leading-snug sm:text-xl',
                dark ? 'text-white' : 'text-neutral-ink',
              )}
            >
              {heading}
            </h3>
            {item.body ? (
              <p
                className={cn(
                  'mt-2 text-sm leading-relaxed text-pretty',
                  dark ? 'text-white/70' : 'text-neutral-body',
                )}
              >
                {item.body}
              </p>
            ) : null}
          </li>
        );
      })}
    </RevealGroup>
  );
}
