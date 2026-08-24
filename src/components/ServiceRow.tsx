import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from './ui/Reveal';
import type { Service } from '@/content/marketing';
import { cn } from '@/lib/cn';

/**
 * Compact service card, laid out in a horizontal scrolling row on the
 * homepage rather than the old full-width alternating rows — six cards read
 * at a glance instead of a long scroll of large image/text blocks.
 */
export function ServiceRow({
  service,
  index,
  onEnquire,
}: {
  service: Service;
  index: number;
  /** Rendered as the enquiry trigger. */
  onEnquire?: React.ReactNode;
}) {
  return (
    <Reveal
      as="li"
      delay={Math.min(index, 5) * 60}
      className="card-lift group flex w-[15.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift sm:w-[17rem]"
    >
      <div className="media-frame aspect-[4/3]">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          loading="lazy"
          sizes="(min-width: 640px) 17rem, 15.5rem"
          className="card-media object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-sm font-semibold text-accent-gold-ink">{service.number}</p>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug text-neutral-ink">
          {service.title}
        </h3>
        <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-pretty text-neutral-body line-clamp-3">
          {service.body}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={service.learnMore.href}
            className="link-underline group/link inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors duration-200 hover:text-brand-dark"
          >
            {service.learnMore.label}
            <ArrowRight />
          </Link>
          {onEnquire}
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
