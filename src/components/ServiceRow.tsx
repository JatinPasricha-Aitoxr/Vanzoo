import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from './ui/Reveal';
import type { Service } from '@/content/marketing';
import { cn } from '@/lib/cn';

/**
 * Alternating image/text service row (§3.2.3).
 *
 * `index` drives the odd/even flip. On mobile the image always leads, since
 * reversing at narrow widths would put the number and heading below the fold.
 */
export function ServiceRow({
  service,
  index,
  onEnquire,
}: {
  service: Service;
  index: number;
  /** Rendered as the enquiry trigger; omitted rows fall back to the tariff link. */
  onEnquire?: React.ReactNode;
}) {
  const reversed = index % 2 === 1;

  return (
    <Reveal
      as="li"
      className={cn(
        'grid items-center gap-8 lg:grid-cols-2 lg:gap-16',
        reversed && 'lg:[&>*:first-child]:order-2',
      )}
    >
      <div className="media-frame group aspect-[4/3]">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 46vw, (min-width: 640px) 90vw, 100vw"
          className="card-media object-cover"
        />
      </div>

      <div className="max-w-lg">
        <p className="font-display text-2xl font-semibold text-accent-gold-ink">{service.number}</p>
        <h3 className="mt-2 text-display-sm">{service.title}</h3>
        <p className="mt-4 text-lead text-pretty text-neutral-body">{service.body}</p>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          {onEnquire}
          <Link
            href={service.learnMore.href}
            className="link-underline group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors duration-200 hover:text-brand-dark"
          >
            {service.learnMore.label}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="arrow-nudge h-3.5 w-3.5">
      <path
        d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
