'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Reveal } from './ui/Reveal';
import { formatPrice, lineId } from '@/content/pricing';
import { tariffRowFor, type ProductEntry } from '@/content/products';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/cn';

/**
 * Product page buy box (§ product pages): one large photo beside a variant
 * picker, styled the way a garment's "size" or "colour" choice reads on a
 * retail product page — except the variant here is the service treatment
 * (Dry Clean & Press vs Steam Press Only). Picking a variant swaps the price,
 * the description and the cart control together, rather than showing every
 * variant as its own separate card.
 *
 * Adding to cart uses the same `lineId(catalogId, groupId, item)` as
 * TariffGrid, so a variant added here and the same row added from /pricing/
 * collapse into one cart line instead of duplicating it.
 */
export function ProductBuyBox({ product }: { product: ProductEntry }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { add, setQuantity, lines } = useCart();

  const options = product.services;
  const selected = options[selectedIndex];
  const row = tariffRowFor(selected);
  const id = lineId(selected.catalogId, selected.groupId, selected.item);
  const inCart = lines.find((line) => line.id === id)?.quantity ?? 0;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
      <Reveal
        variant="left"
        className="media-frame aspect-[4/5] bg-brand-light lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:aspect-[3/4]"
      >
        <Image
          src={row.image}
          alt={product.heroImageAlt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 38vw, 90vw"
          className="object-cover"
        />
      </Reveal>

      <Reveal variant="right" delay={90}>
        <h2 id="product-options-heading" className="text-display-sm">
          Choose your service
        </h2>

        <p className="mt-4 font-display text-3xl font-semibold tabular-nums text-brand">
          {formatPrice(row)}
        </p>

        {/* Variant picker — one pill per service treatment. */}
        <fieldset className="mt-7">
          <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body">
            Service
          </legend>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {options.map((option, index) => {
              const active = index === selectedIndex;
              return (
                <button
                  key={option.serviceId + option.item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    'rounded-pill border px-5 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'border-brand bg-brand text-white'
                      : 'border-neutral-line text-neutral-body hover:border-brand/40 hover:text-brand',
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <p className="mt-5 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
          {selected.description}
        </p>

        <Link
          href={`/services/${selected.serviceId}/`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          What&apos;s included
          <span aria-hidden="true" className="arrow-nudge">→</span>
        </Link>

        <div className="mt-8 max-w-xs">
          {inCart > 0 ? (
            <div className="flex items-center justify-between gap-3 rounded-pill border border-neutral-line px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity(id, inCart - 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-pill text-neutral-ink transition-colors hover:bg-neutral-muted"
              >
                <span aria-hidden="true">−</span>
                <span className="sr-only">Decrease {selected.label} quantity</span>
              </button>
              <span aria-live="polite" className="flex-1 text-center text-sm font-semibold tabular-nums">
                {inCart} in cart
              </span>
              <button
                type="button"
                onClick={() =>
                  add({
                    id,
                    item: selected.item,
                    service: selected.label,
                    amount: row.amount,
                    from: row.from ?? false,
                    image: row.image,
                  })
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-pill text-neutral-ink transition-colors hover:bg-neutral-muted"
              >
                <span aria-hidden="true">+</span>
                <span className="sr-only">Increase {selected.label} quantity</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                add({
                  id,
                  item: selected.item,
                  service: selected.label,
                  amount: row.amount,
                  from: row.from ?? false,
                  image: row.image,
                })
              }
              className="btn-primary btn-lg w-full"
            >
              <CartIcon className="h-4 w-4" />
              Add to Cart
            </button>
          )}
        </div>
      </Reveal>
    </div>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M1 1.5h1.9l1.6 8.2h7.3l1.4-5.9H4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="13" r="1.3" fill="currentColor" />
      <circle cx="11.5" cy="13" r="1.3" fill="currentColor" />
    </svg>
  );
}
