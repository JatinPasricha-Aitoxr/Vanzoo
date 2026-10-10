import Link from 'next/link';
import { links } from '@/lib/site';
import { Reveal } from './ui/Reveal';

const STEPS = [
  { title: 'Schedule a Pickup', icon: 'truck' },
  { title: 'Item Collection', icon: 'box' },
  { title: 'Detailed Assessment', icon: 'clipboard' },
  { title: 'Targeted Stain Treatment', icon: 'bottle' },
  { title: 'Premium Cleaning', icon: 'sparkle' },
  { title: 'Drying', icon: 'heat' },
  { title: 'Finishing Touches', icon: 'brush' },
  { title: 'Final Quality Inspection', icon: 'badge' },
  { title: 'Secure Packaging & Delivery', icon: 'parcel' },
] as const;

type IconName = (typeof STEPS)[number]['icon'];

/**
 * "Dry cleaning, the Vanzoo way" — the nine-step journey as a zigzag
 * timeline. Odd steps hang their label above and sit their icon low; even
 * steps flip it, so the row reads as one wave. Below `lg` it collapses to a
 * plain numbered list, where nine columns would not fit.
 */
export function VanzooProcess({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="process-timeline-heading" className="bg-neutral-surface py-section">
      <div className="shell">
        <Reveal variant="up" className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our Process</p>
          <h2 id="process-timeline-heading" className="mt-3 text-display-lg">
            Dry cleaning process, the Vanzoo way
          </h2>
          <p className="mt-5 text-lead text-pretty text-neutral-body">
            Free pickup and delivery to save you time. Italian hydrocarbon cleaning and hand
            finishing to keep every piece looking its best.
          </p>
        </Reveal>

        {/* ≥lg — zigzag wave */}
        <ol className="relative mt-16 hidden grid-cols-9 gap-2 lg:grid">
          <span
            aria-hidden="true"
            className="absolute inset-x-6 top-1/2 h-10 -translate-y-1/2 rounded-pill bg-neutral-line/70"
          />
          {STEPS.map((step, index) => {
            const high = index % 2 === 1; // even-numbered steps: icon high, label below
            return (
              <li key={step.title} className="relative flex h-[24rem] flex-col items-center">
                <StepLabel index={index} title={step.title} className={high ? 'order-3 mt-auto' : 'order-1'} />
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 w-px -translate-x-1/2 border-l-2 border-dotted border-brand/60 ${
                    high ? 'bottom-[5.5rem] top-[7rem]' : 'bottom-[9rem] top-[5.5rem]'
                  }`}
                />
                <span
                  className={`absolute left-1/2 z-10 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 items-center justify-center rounded-full bg-brand text-white ring-[6px] ring-brand/20 ${
                    high ? 'top-[5.5rem]' : 'bottom-[5.5rem]'
                  }`}
                >
                  <Icon name={step.icon} />
                </span>
              </li>
            );
          })}
        </ol>

        {/* <lg — flat horizontal strip, swipe sideways instead of stacking */}
        <ol className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:hidden">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex w-36 shrink-0 snap-start flex-col items-center gap-3 rounded-card border border-neutral-line bg-white p-4 text-center shadow-lift"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
                <Icon name={step.icon} />
              </span>
              <StepLabel index={index} title={step.title} />
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-lg">
            Schedule a dry cleaning pickup
          </a>
          <Link href="/hydrocarbon-tech/" className="btn-secondary btn-lg">
            Learn about our technology
          </Link>
        </div>
      </div>
    </section>
  );
}

function StepLabel({ index, title, className = '' }: { index: number; title: string; className?: string }) {
  return (
    <div
      className={`flex w-full items-stretch gap-2 rounded-lg border border-neutral-line bg-white p-2.5 shadow-lift lg:w-[7.25rem] ${className}`}
    >
      <span aria-hidden="true" className="w-1 shrink-0 rounded-pill bg-brand" />
      <div className="min-w-0 text-left">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-neutral-body">
          Step <span className="block text-base leading-none text-neutral-ink">{String(index + 1).padStart(2, '0')}</span>
        </p>
        <h3 className="mt-1 font-display text-[0.8125rem] font-semibold leading-tight text-neutral-ink">{title}</h3>
      </div>
    </div>
  );
}

const p = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-7 w-7',
  'aria-hidden': true,
} as const;

function Icon({ name }: { name: IconName }) {
  switch (name) {
    case 'truck':
      return (
        <svg {...p}>
          <path d="M2.5 6.5h11v9h-11zM13.5 10h4l3 3v2.5h-7" />
          <circle cx="6.5" cy="17.5" r="1.8" />
          <circle cx="17" cy="17.5" r="1.8" />
        </svg>
      );
    case 'box':
      return (
        <svg {...p}>
          <path d="M3.5 8 12 4l8.5 4v9L12 21l-8.5-4V8ZM3.5 8 12 12l8.5-4M12 12v9" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...p}>
          <rect x="5" y="4.5" width="14" height="16" rx="2" />
          <path d="M9 4.5h6v2H9zM8.5 11h7M8.5 15h4" />
        </svg>
      );
    case 'bottle':
      return (
        <svg {...p}>
          <path d="M10 3h4v3l2 2.5V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8.5L10 6V3Z" />
          <path d="M8 12h8" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...p}>
          <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4-5.7-1.8L10.2 9 12 3.5ZM19 16v4M17 18h4" />
        </svg>
      );
    case 'heat':
      return (
        <svg {...p}>
          <path d="M8 4c-1.5 2 1.5 3 0 5s1.5 3 0 5M12 4c-1.5 2 1.5 3 0 5s1.5 3 0 5M16 4c-1.5 2 1.5 3 0 5s1.5 3 0 5M5 19h14" />
        </svg>
      );
    case 'brush':
      return (
        <svg {...p}>
          <rect x="3" y="10" width="18" height="5" rx="1.5" />
          <path d="M7 15v3M10.5 15v3M14 15v3M17.5 15v3" />
        </svg>
      );
    case 'badge':
      return (
        <svg {...p}>
          <path d="m12 3 2.2 1.6 2.7-.1.9 2.6 2.2 1.6-.8 2.6.8 2.6-2.2 1.6-.9 2.6-2.7-.1L12 21l-2.2-1.6-2.7.1-.9-2.6-2.2-1.6.8-2.6-.8-2.6 2.2-1.6.9-2.6 2.7.1L12 3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'parcel':
      return (
        <svg {...p}>
          <path d="M5 4.5h14V20H5V4.5ZM5 9h14" />
          <path d="m9.5 15 1.7 1.7L15 13" />
        </svg>
      );
  }
}
