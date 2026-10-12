import Link from 'next/link';
import { links } from '@/lib/site';
import { Highlight } from './ui/Highlight';
import { Reveal } from './ui/Reveal';

const STEPS = [
  { title: 'Schedule a Pickup', icon: 'truck' },
  { title: 'Detailed Assessment', icon: 'clipboard' },
  { title: 'Targeted Stain Treatment', icon: 'bottle' },
  { title: 'Premium Cleaning', icon: 'sparkle' },
  { title: 'Drying & Finishing', icon: 'brush' },
  { title: 'Final Quality Inspection', icon: 'badge' },
  { title: 'Secure Packaging & Delivery', icon: 'parcel' },
] as const;

const ICON_X = (i: number) => 197 + i * 231;
/** Odd-numbered steps (index 0, 2, …) sit low; even-numbered sit high. */
const ICON_Y = (i: number) => (i % 2 === 0 ? 515 : 320);
const WAVE_PATH = Array.from({ length: STEPS.length }, (_, i) => {
  const x = ICON_X(i);
  const y = ICON_Y(i);
  if (i === 0) return `M${x},${y}`;
  const px = ICON_X(i - 1);
  const py = ICON_Y(i - 1);
  const mid = (px + x) / 2;
  return `C${mid},${py} ${mid},${y} ${x},${y}`;
}).join(' ');

type IconName = (typeof STEPS)[number]['icon'];

/**
 * "Dry cleaning, the Vanzoo way" — the seven-step journey as a zigzag
 * timeline. Odd steps hang their label above and sit their icon low; even
 * steps flip it, so the row reads as one wave. Below `lg` it collapses to a
 * plain numbered list, where seven columns would not fit.
 */
export function VanzooProcess({
  id,
  eyebrow = 'Our Process',
  heading = 'How Vanzoo Does Dry Cleaning For You',
  intro = 'Free pickup and delivery to save you time. Italian hydrocarbon cleaning and hand finishing to keep every piece looking its best.',
  showCtas = true,
}: {
  id?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  showCtas?: boolean;
}) {
  return (
    <section id={id} aria-labelledby="process-timeline-heading" className="bg-neutral-surface py-section">
      <div className="shell">
        <Reveal variant="up" className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="process-timeline-heading" className="mt-3 text-display-lg">
            <Highlight text={heading} />
          </h2>
          <p className="mt-5 text-lead text-pretty text-neutral-body">{intro}</p>
        </Reveal>

        {/* ≥lg — the wave. Everything sits in a fixed 1750×870 coordinate space
            and is placed by percentage, with type sized in container units, so
            the whole diagram scales as one picture. */}
        <div className="mt-16 hidden lg:block [container-type:inline-size]">
          <div className="relative w-full" style={{ aspectRatio: '1750 / 870' }}>
            <svg viewBox="0 0 1750 870" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path
                d={WAVE_PATH}
                fill="none"
                stroke="#d9dbe0"
                strokeWidth="92"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {STEPS.map((_, i) => (
                <circle key={i} cx={ICON_X(i)} cy={ICON_Y(i)} r="98" fill="#f4f5fa" />
              ))}
              {STEPS.map((_, i) => {
                const low = i % 2 === 0;
                return (
                  <line
                    key={i}
                    x1={ICON_X(i)}
                    x2={ICON_X(i)}
                    y1={low ? 190 : ICON_Y(i) + 100}
                    y2={low ? ICON_Y(i) - 100 : 688}
                    stroke="#1f5547"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="0.1 14"
                  />
                );
              })}
            </svg>

            <ol className="absolute inset-0">
              {STEPS.map((step, index) => {
                const low = index % 2 === 0;
                return (
                  <li key={step.title}>
                    <div
                      className="absolute flex items-stretch rounded-[0.6cqw] border border-neutral-line bg-white shadow-lift"
                      style={{
                        left: `${((ICON_X(index) - 144) / 1750) * 100}%`,
                        top: `${((low ? 20 : 720) / 870) * 100}%`,
                        width: `${(288 / 1750) * 100}%`,
                        height: `${(140 / 870) * 100}%`,
                        gap: '1.2cqw',
                        padding: '0 1.2cqw 0 1.6cqw',
                        alignItems: 'center',
                      }}
                    >
                      <div className="text-neutral-ink" style={{ fontSize: '0.95cqw', lineHeight: 1.1 }}>
                        STEP
                        <span className="block font-semibold" style={{ fontSize: '1.6cqw' }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span aria-hidden="true" className="self-center rounded-pill bg-[#1f5547]" style={{ width: '0.45cqw', height: '6.3cqw' }} />
                      <h3 className="font-display font-semibold text-neutral-ink" style={{ fontSize: '1.45cqw', lineHeight: 1.2 }}>
                        {step.title}
                      </h3>
                    </div>

                    <span
                      className="absolute flex items-center justify-center rounded-full bg-[#173c32] text-white"
                      style={{
                        left: `${((ICON_X(index) - 78) / 1750) * 100}%`,
                        top: `${((ICON_Y(index) - 78) / 870) * 100}%`,
                        width: `${(156 / 1750) * 100}%`,
                        height: `${(156 / 870) * 100}%`,
                      }}
                    >
                      <span className="flex items-center justify-center rounded-full bg-[#21493e]" style={{ width: '77%', height: '77%' }}>
                        <span className="block" style={{ width: '3.2cqw', height: '3.2cqw' }}>
                          <Icon name={step.icon} />
                        </span>
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

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

        {showCtas ? (
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <a href={links.bookPickup} target="_blank" rel="noopener noreferrer" className="btn-gold btn-lg">
            Schedule a dry cleaning pickup
          </a>
          <Link href="/hydrocarbon-tech/" className="btn-secondary btn-lg">
            Learn about our technology
          </Link>
        </div>
        ) : null}
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
  className: 'h-full w-full',
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
