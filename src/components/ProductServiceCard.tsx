'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from './ui/Reveal';
import { formatPrice, lineId } from '@/content/pricing';
import { tariffRowFor, type ProductServiceOption } from '@/content/products';
import { useCart } from '@/lib/cart';

/**
 * One "choose your service" card on a product page. Adding from here uses the
 * same `lineId(catalogId, groupId, item)` as TariffGrid, so a Shirt added here
 * and the same row added from /pricing/ collapse into one cart line instead of
 * duplicating it.
 */
export function ProductServiceCard({
  option,
  index,
}: {
  option: ProductServiceOption;
  index: number;
}) {
  const { add, setQuantity, lines } = useCart();
  const row = tariffRowFor(option);
  const id = lineId(option.catalogId, option.groupId, option.item);
  const inCart = lines.find((line) => line.id === id)?.quantity ?? 0;

  return (
    <Reveal
      as="li"
      variant="up"
      delay={Math.min(index, 5) * 50}
      className="group flex flex-col overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift transition-[box-shadow,border-color,transform] duration-200 ease-entrance hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lift-hover"
    >
      <div aria-hidden="true" className="relative aspect-[3/2] w-full overflow-hidden bg-brand-light">
        <Image
          src={row.image}
          alt=""
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="card-media object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.375rem] font-semibold leading-tight text-neutral-ink">
          {option.label}
        </h3>
        <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-pretty text-neutral-body">
          {option.description}
        </p>
        <p className="mt-4 text-sm text-neutral-body">
          <span className="font-display text-lg font-semibold tabular-nums text-brand">
            {formatPrice(row)}
          </span>
        </p>
        <Link
          href={`/services/${option.serviceId}/`}
          className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          What&apos;s included
          <span aria-hidden="true" className="arrow-nudge">→</span>
        </Link>

        <div className="mt-5">
          {inCart > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-dark">
                In cart
              </span>
              <div className="inline-flex items-center rounded-pill border border-neutral-line">
                <button
                  type="button"
                  onClick={() => setQuantity(id, inCart - 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-neutral-ink transition-colors hover:bg-neutral-muted"
                >
                  <span aria-hidden="true">−</span>
                  <span className="sr-only">Decrease {option.label} quantity</span>
                </button>
                <span aria-live="polite" className="w-8 text-center text-sm font-semibold tabular-nums">
                  {inCart}
                  <span className="sr-only"> {option.label}</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    add({
                      id,
                      item: option.item,
                      service: option.label,
                      amount: row.amount,
                      from: row.from ?? false,
                      image: row.image,
                    })
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-neutral-ink transition-colors hover:bg-neutral-muted"
                >
                  <span aria-hidden="true">+</span>
                  <span className="sr-only">Increase {option.label} quantity</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                add({
                  id,
                  item: option.item,
                  service: option.label,
                  amount: row.amount,
                  from: row.from ?? false,
                  image: row.image,
                })
              }
              className="btn-sm btn-primary w-full"
            >
              <CartIcon className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Reveal>
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
