import Image from 'next/image';
import { Reveal, RevealGroup } from './ui/Reveal';

const POINTS = [
  {
    title: 'No Harmful Solvents',
    body: 'Our method avoids harsh chemicals, treating your clothes with care.',
    icon: (
      <>
        <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" />
        <path d="M4 4l16 16" />
      </>
    ),
  },
  {
    title: 'Zero Waste',
    body: 'Minimizing carbon footprint with recyclable materials and water-saving techniques.',
    icon: (
      <>
        <path d="M5 7h14M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
        <path d="M14.5 11.5a3 3 0 1 0 .5 3M14.5 11.5V9.5M14.5 11.5h-2" />
      </>
    ),
  },
  {
    title: 'Eco-Friendly Packaging',
    body: 'Garments returned in premium, reusable bags for a stylish, sustainable experience.',
    icon: (
      <>
        <path d="M4 4h16v16H4V4ZM9 4v5l3-1.5L15 9V4" />
        <path d="M8 17c0-2 1.5-3 4-3 0 2-1.5 3.5-4 3ZM16 17c0-2-1.5-3-4-3 0 2 1.5 3.5 4 3Z" />
      </>
    ),
  },
] as const;

/** Live-text version of the sustainability infographic — no words baked into an image. */
export function SustainabilityPanel() {
  return (
    <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      {/* Decorative arc tying the three points to the heading, as in the source diagram. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-4 left-[calc(55%-9rem)] hidden w-[22rem] rounded-full border-2 border-brand/70 lg:block [clip-path:inset(0_0_0_50%)]"
      />
      <RevealGroup as="ul" step={80} className="space-y-4">
        {POINTS.map((point, index) => (
          <li key={point.title} className="flex items-center gap-4 sm:gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-white sm:h-20 sm:w-20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                {point.icon}
              </svg>
            </span>
            <div className="flex flex-1 items-center justify-between gap-4 rounded-card bg-neutral-muted px-5 py-4">
              <div>
                <h3 className="font-display text-base font-semibold text-neutral-ink sm:text-lg">{point.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-pretty text-neutral-body">{point.body}</p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand text-xs font-semibold text-white">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </li>
        ))}
      </RevealGroup>

      <Reveal variant="right" className="text-center lg:text-left">
        <h2 className="font-display text-display-lg font-bold uppercase tracking-tight text-brand-dark">
          Sustainability
        </h2>
        <p className="mt-2 font-display text-lg font-semibold text-neutral-ink">
          Caring for Your Clothes and the Planet
        </p>
        <p className="mt-4 text-pretty text-neutral-body">
          VANZOO goes beyond Premium Dryclean services with a deep commitment to eco-conscious
          practices. Our New-Age Wardrobe Care ensures zero harmful solvent waste while safeguarding
          your skin and fabrics.
        </p>
        <Image
          src="/images/sustainability-hand.png"
          alt="A hand holding a young green seedling in soil"
          width={385}
          height={235}
          loading="lazy"
          className="mx-auto mt-6 w-full max-w-sm mix-blend-multiply lg:mx-0"
        />
      </Reveal>
    </div>
  );
}
