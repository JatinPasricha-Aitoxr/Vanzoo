'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { UspCard } from '@/content/marketing';

/**
 * "Why you'll love Vanzoo" — the USP carousel, modelled on rinse.com's
 * "Why you'll love Rinse". On desktop the active card opens wide with its
 * paragraph; the rest sit narrow, photo and title only, and clicking one (or
 * the arrows) makes it active. On mobile every card is the same width with its
 * paragraph showing, and the row swipes.
 */
export function UspCarousel({ cards }: { cards: readonly UspCard[] }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);

  const go = (index: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, index));
    setActive(next);
    const track = trackRef.current;
    const card = track?.children[next] as HTMLElement | undefined;
    if (track && card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  return (
    <div>
      <ul
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:snap-none lg:gap-8 lg:px-0"
      >
        {cards.map((card, index) => {
          const isActive = index === active;
          return (
            <li
              key={card.title}
              className={cn(
                'w-[82%] shrink-0 snap-start sm:w-[46%] lg:transition-[width] lg:duration-500 lg:ease-out',
                isActive ? 'lg:w-[36rem]' : 'lg:w-[17.5rem]',
              )}
            >
              <button
                type="button"
                onClick={() => go(index)}
                aria-expanded={isActive}
                className="group block w-full text-left lg:cursor-pointer"
              >
                <div
                  className={cn(
                    'media-frame aspect-[4/3] lg:transition-[aspect-ratio] lg:duration-500',
                    isActive ? 'lg:aspect-[16/9]' : 'lg:aspect-square',
                  )}
                >
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 36rem, (min-width: 640px) 46vw, 82vw"
                    className="card-media object-cover"
                  />
                </div>
                <h3
                  className={cn(
                    'mt-6 font-display text-xl font-semibold leading-snug text-neutral-ink transition-colors',
                    !isActive && 'lg:text-2xl lg:group-hover:text-brand',
                  )}
                >
                  {card.title}
                </h3>
              </button>
              <p
                className={cn(
                  'mt-3 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body',
                  isActive ? 'lg:block' : 'lg:hidden',
                )}
              >
                {card.body}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 hidden gap-3 lg:flex">
        <Arrow direction={-1} disabled={active === 0} onClick={() => go(active - 1)} />
        <Arrow direction={1} disabled={active === cards.length - 1} onClick={() => go(active + 1)} />
      </div>
    </div>
  );
}

function Arrow({ direction, disabled, onClick }: { direction: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 1 ? 'Next reason' : 'Previous reason'}
      className="flex h-14 w-12 items-center justify-center rounded-xl border border-neutral-line bg-white text-brand transition-colors hover:border-brand/40 disabled:opacity-40"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d={direction === 1 ? 'M3 8h10M9 4l4 4-4 4' : 'M13 8H3M7 4 3 8l4 4'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
