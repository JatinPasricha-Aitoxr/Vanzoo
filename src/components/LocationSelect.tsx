'use client';

import { useEffect, useRef, useState } from 'react';
import { CITIES, useCity } from './CityProvider';
import { cn } from '@/lib/cn';

const NOTES: Record<(typeof CITIES)[number], string> = {
  Gurgaon: 'Our stores — prices shown on this site',
  Delhi: 'Prices may differ — call for a quote',
};

/**
 * Header city picker, present on every page and breakpoint (icon-only below
 * `lg`). The choice lives in CityProvider; Delhi switches on the site-wide
 * "prices may differ" notice.
 */
export function LocationSelect({ solid }: { solid: boolean }) {
  const { city, setCity, delhiEnabled } = useCity();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!delhiEnabled) return null;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex h-10 items-center justify-center gap-1.5 rounded-pill border text-sm font-medium transition-colors duration-200 max-lg:w-10 lg:px-3.5',
          solid
            ? 'border-neutral-line text-neutral-ink hover:bg-neutral-muted'
            : 'border-white/40 text-white hover:bg-white/10',
        )}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 8.5 4.5 8.5S12.5 9.2 12.5 6A4.5 4.5 0 0 0 8 1.5Zm0 6.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" />
        </svg>
        <span className="max-lg:sr-only">{city}</span>
        <svg
          viewBox="0 0 12 12"
          className={cn('h-3 w-3 transition-transform duration-200 max-lg:hidden', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
        </svg>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Choose your city"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-card border border-neutral-line bg-white p-1.5 shadow-lift-hover lg:left-0 lg:right-auto"
        >
          {CITIES.map((name) => (
            <li key={name} role="option" aria-selected={name === city}>
              <button
                type="button"
                onClick={() => {
                  setCity(name);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-brand-tint',
                  name === city && 'bg-brand-tint',
                )}
              >
                <span>
                  <span className="block text-sm font-semibold text-neutral-ink">{name}</span>
                  <span className="block text-xs text-neutral-body">{NOTES[name]}</span>
                </span>
                {name === city ? (
                  <svg viewBox="0 0 14 14" className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 7.5 5.5 10.5 11.5 4" />
                  </svg>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
