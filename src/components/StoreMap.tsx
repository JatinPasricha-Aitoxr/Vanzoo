'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

type Store = { id: string; name: string; address: string };

/**
 * Embedded Google map with a switcher for each store. Queries use the street
 * address alone — a brand-name query can fail to resolve to a place and leave
 * the map blank — and always carry an "open in Google Maps" link as a fallback.
 */
export function StoreMap({ stores }: { stores: readonly Store[] }) {
  const [activeId, setActiveId] = useState(stores[0].id);
  const active = stores.find((store) => store.id === activeId) ?? stores[0];
  const query = encodeURIComponent(active.address);

  return (
    <div>
      <div className="shell flex flex-wrap items-center gap-2 py-4">
        {stores.map((store) => (
          <button
            key={store.id}
            type="button"
            onClick={() => setActiveId(store.id)}
            aria-pressed={store.id === active.id}
            className={cn(
              'rounded-pill border px-4 py-2 text-sm font-medium transition-colors',
              store.id === active.id
                ? 'border-brand bg-brand text-white'
                : 'border-neutral-line bg-white text-neutral-body hover:border-brand/40 hover:text-brand',
            )}
          >
            {store.name}
          </button>
        ))}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Open in Google Maps →
        </a>
      </div>
      <div className="aspect-[16/10] w-full sm:aspect-[21/8]">
        <iframe
          key={active.id}
          title={`Map showing ${active.name}`}
          src={`https://maps.google.com/maps?q=${query}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
