'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ProductEntry } from '@/content/products';

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Product index with a live search box — "shirt", "saree", "dry clean"… */
export function ProductSearchGrid({ products }: { products: readonly ProductEntry[] }) {
  const [query, setQuery] = useState('');
  const flat = normalize(query);
  const shown = flat
    ? products.filter((p) => normalize(`${p.title} ${p.intro} dryclean dry clean`).includes(flat))
    : products;

  return (
    <>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mx-auto mb-10 max-w-xl">
        <label htmlFor="product-search" className="sr-only">Search garments</label>
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search garments — shirt, saree, suit, curtain…"
          className="h-12 w-full rounded-pill border border-neutral-line bg-white px-5 text-sm text-neutral-ink shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </form>

      {shown.length === 0 ? (
        <p className="text-center text-neutral-body">No garments match “{query.trim()}”. Try another word, or WhatsApp us the item.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((product) => (
            <li
              key={product.id}
              className="card-lift group flex flex-col overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift hover:border-brand/30 hover:shadow-lift-hover"
            >
              <Link href={`/products/${product.id}/`} className="media-frame block aspect-[3/2] rounded-none" tabIndex={-1}>
                <Image
                  src={product.heroImage}
                  alt={product.heroImageAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="card-media object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold leading-snug text-neutral-ink">
                  <Link href={`/products/${product.id}/`} className="transition-colors hover:text-brand">
                    {product.title}
                  </Link>
                </h3>
                <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">{product.intro}</p>
                <Link
                  href={`/products/${product.id}/`}
                  className="mt-5 inline-flex items-center gap-1.5 border-t border-neutral-line pt-5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Choose a service <span aria-hidden="true" className="arrow-nudge">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
