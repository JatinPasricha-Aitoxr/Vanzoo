import Image from 'next/image';
import Link from 'next/link';
import { formatRupees } from '@/content/pricing';
import type { ServiceEntry } from '@/content/services';
import { links } from '@/lib/site';

/**
 * One service card — the shared unit for the /services/ grid, each service's
 * own "You might also need" rail, and anywhere else a service needs to be
 * introduced. Photo, name, description, price and the two actions every
 * service page repeats: view its tariffs, or book it directly.
 *
 * `headingLevel` keeps document outline correct: "h2" on /services/, where
 * each card is a top-level section of that listing page; "h3" wherever a card
 * appears nested under another page's own H2 (its detail page's related rail).
 */
export function ServiceCard({
  service,
  headingLevel = 'h2',
}: {
  service: ServiceEntry;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const href = `/services/${service.id}/`;

  return (
    <li
      id={service.id}
      className="card-lift group flex flex-col overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift hover:border-brand/30 hover:shadow-lift-hover"
    >
      <Link href={href} className="media-frame block aspect-[3/2] rounded-none" tabIndex={-1}>
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="card-media object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Heading className="font-display text-xl font-semibold leading-snug text-neutral-ink">
          <Link href={href} className="transition-colors hover:text-brand">
            {service.title}
          </Link>
        </Heading>
        <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
          {service.body}
        </p>

        {service.from ? (
          <p className="mt-4 text-sm text-neutral-body">
            Starting from{' '}
            <span className="font-display text-lg font-semibold tabular-nums text-brand">
              {formatRupees(service.from.amount)}
            </span>
            {service.from.note ? ` ${service.from.note}` : ''}
          </p>
        ) : (
          <p className="mt-4 text-sm font-medium text-brand">{service.priceLine}</p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-line pt-5">
          <Link
            href={service.tariffHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            {service.tariffLabel}
            <span aria-hidden="true" className="arrow-nudge">
              →
            </span>
          </Link>
          <a
            href={links.bookPickup}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-sm"
          >
            Book pickup
          </a>
        </div>
      </div>
    </li>
  );
}
