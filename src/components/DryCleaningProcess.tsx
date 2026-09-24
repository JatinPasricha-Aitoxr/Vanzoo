import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/content/pricing';
import { sharedProcess } from '@/content/productCare';
import { getProduct, tariffRowFor } from '@/content/products';
import { links } from '@/lib/site';
import { Reveal, RevealGroup } from './ui/Reveal';

/** Items on the turnaround card — the everyday dry cleaning staples. */
const PRICE_ITEMS = ['shirt', 'pant-trouser', 'saree', 'men-suit-2-pcs', 'dress', 'curtain'] as const;

/**
 * The dry cleaning process, laid out like rinse.com's "Dry Cleaning" block:
 * the title, intro and CTAs stay pinned on the left while the right column
 * scrolls through a photo, the nine care stages (each with an outlined icon)
 * and a turnaround + price card.
 */
export function DryCleaningProcess({
  id,
  eyebrow = 'Dry Cleaning',
  heading = 'Dry cleaning, the Vanzoo way',
  intro = 'Free pickup and delivery to save you time. Italian hydrocarbon cleaning and hand finishing to keep every piece looking its best.',
}: {
  id?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
}) {
  const priceRows = PRICE_ITEMS.flatMap((itemId) => {
    const product = getProduct(itemId);
    if (!product) return [];
    return [{ id: product.id, title: product.title, price: formatPrice(tariffRowFor(product.services[0])) }];
  });

  return (
    <section id={id} aria-labelledby="dry-cleaning-process-heading" className="bg-neutral-surface py-section">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* Pinned intro */}
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <Reveal variant="left">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand">
              <GarmentBagIcon />
            </span>
            <p className="eyebrow mt-8">{eyebrow}</p>
            <h2 id="dry-cleaning-process-heading" className="mt-3 text-display-lg">
              {heading}
            </h2>
            <p className="mt-5 max-w-md text-lead text-pretty text-neutral-body">{intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-lg">
                Schedule a dry cleaning pickup
              </a>
              <Link href="/hydrocarbon-tech/" className="btn-secondary btn-lg">
                Learn about our technology
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Scrolling detail */}
        <div>
          <Reveal variant="right" className="media-frame aspect-[16/10]">
            <Image
              src="/images/hero-valet-handover.jpg"
              alt="Vanzoo valet handing freshly dry-cleaned garments in protective wrap to a customer"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </Reveal>

          <RevealGroup as="ol" step={60} className="mt-14 space-y-10">
            {sharedProcess.stages.map((stage, index) => (
              <li key={stage.title} className="flex gap-5 sm:gap-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-brand/70 text-brand">
                  {STEP_ICONS[index] ?? STEP_ICONS[0]}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-gold-ink">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-neutral-ink sm:text-2xl">{stage.title}</h3>
                  <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-pretty text-neutral-body sm:text-base">
                    {stage.body}
                  </p>
                </div>
              </li>
            ))}
          </RevealGroup>

          {/* Turnaround + price card */}
          <Reveal variant="up" className="mt-14 rounded-card border border-neutral-line bg-white p-6 shadow-lift sm:p-8">
            <p className="text-sm text-neutral-body">
              <strong className="font-semibold text-neutral-ink">Standard 3–5 day turnaround</strong> for all
              orders. Same-day and next-day express on request.
            </p>
            <ul className="mt-5 divide-y divide-neutral-line">
              {priceRows.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/products/${row.id}/`}
                    className="flex items-center justify-between gap-4 py-3.5 text-[0.9375rem] text-neutral-ink transition-colors hover:text-brand"
                  >
                    <span className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-accent-gold" />
                      {row.title}
                    </span>
                    <span className="font-semibold tabular-nums">{row.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/pricing/"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              See full pricing <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Outlined 24px icons, one per stage, in the order of `sharedProcess.stages`. */
const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-6 w-6',
  'aria-hidden': true,
} as const;

const STEP_ICONS = [
  // Doorstep pickup — calendar
  <svg key="pickup" {...iconProps}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h3" />
  </svg>,
  // Individual assessment — magnifier
  <svg key="assess" {...iconProps}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 5 5" />
  </svg>,
  // Stain treatment — droplet
  <svg key="stain" {...iconProps}>
    <path d="M12 3.5c3 3.8 5.5 6.9 5.5 10a5.5 5.5 0 0 1-11 0c0-3.1 2.5-6.2 5.5-10Z" />
    <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  </svg>,
  // Professional cleaning — machine
  <svg key="clean" {...iconProps}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="13" r="4.5" />
    <path d="M7 6h2M14 6h3" />
  </svg>,
  // Careful drying — air
  <svg key="dry" {...iconProps}>
    <path d="M3 9h11a2.5 2.5 0 1 0-2.5-2.5M3 13h15a2.5 2.5 0 1 1-2.5 2.5M3 17h7" />
  </svg>,
  // Hand finishing — iron
  <svg key="finish" {...iconProps}>
    <path d="M3 17h17v-3a6 6 0 0 0-6-6H8" />
    <path d="M3 17c0-2.5 2-5 5-5h12" />
    <path d="M10 8V6h5" />
  </svg>,
  // Quality inspection — badge check
  <svg key="inspect" {...iconProps}>
    <path d="M12 3 5 6v5.5c0 4.2 2.9 7.8 7 9.5 4.1-1.7 7-5.3 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>,
  // Protective packaging — hanger bag
  <svg key="pack" {...iconProps}>
    <path d="M12 3.5a1.5 1.5 0 1 1 1.5 1.5L12 6" />
    <path d="M6 8.5 12 6l6 2.5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8.5Z" />
    <path d="M12 6v15" />
  </svg>,
  // Doorstep delivery — truck
  <svg key="deliver" {...iconProps}>
    <path d="M2.5 6.5h11v9h-11zM13.5 10h4l3 3v2.5h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>,
];

function GarmentBagIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
      <path d="M16 3.5a2 2 0 1 1 2 2L16 7" />
      <path d="M8 11 16 7l8 4v16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 8 27V11Z" />
      <path d="M16 7v21.5M12.5 15h7" />
    </svg>
  );
}
