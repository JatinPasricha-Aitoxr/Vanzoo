'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { serviceEntries } from '@/content/services';
import { links } from '@/lib/site';
import { cn } from '@/lib/cn';

/**
 * Every Vanzoo service in one swipeable row, with visible previous/next arrows
 * so it is obvious there is more to the right, and a closing card that leads to
 * the full services page.
 */
export function ServiceSlider() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    el?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.8, 280), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
      >
        {serviceEntries.map((service) => (
          <li
            key={service.id}
            className="card-lift group flex w-[15.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift sm:w-[17rem]"
          >
            <Link href={`/services/${service.id}/`} className="media-frame block aspect-[4/3] rounded-none" tabIndex={-1}>
              <Image
                src={service.heroImage ?? service.image}
                alt={service.heroImageAlt ?? service.imageAlt}
                fill
                loading="lazy"
                sizes="(min-width: 640px) 17rem, 15.5rem"
                className="card-media object-cover"
              />
            </Link>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-display text-base font-semibold leading-snug text-neutral-ink">
                <Link href={`/services/${service.id}/`} className="hover:text-brand">
                  {service.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-pretty text-neutral-body line-clamp-3">
                {service.body}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link
                  href={`/services/${service.id}/`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-dark"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
                <a
                  href={links.bookPickup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-accent-gold-ink underline underline-offset-2"
                >
                  Book pickup
                </a>
              </div>
            </div>
          </li>
        ))}

        <li className="flex w-[15.5rem] shrink-0 snap-start flex-col items-center justify-center rounded-card bg-brand-ink p-6 text-center text-white sm:w-[17rem]">
          <p className="font-display text-xl font-semibold">Many more services</p>
          <p className="mt-2 text-sm text-white/75">Shoes, bags, curtains, carpets, sofas, toys and more.</p>
          <Link href="/services/" className="btn-gold btn-md mt-5">
            View all services
          </Link>
        </li>
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4">
        <Link
          href="/services/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          View all services <span aria-hidden="true">→</span>
        </Link>
        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scrollBy(direction)}
              disabled={direction === -1 ? !canPrev : !canNext}
              aria-label={direction === -1 ? 'Previous services' : 'More services'}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-pill border border-brand/30 bg-white text-brand shadow-lift transition-colors',
                'hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-brand',
              )}
            >
              <span aria-hidden="true" className="text-lg">{direction === -1 ? '←' : '→'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
