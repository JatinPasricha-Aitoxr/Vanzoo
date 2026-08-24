'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from './ui/Reveal';
import {
  lineId,
  type TariffCatalog,
  type TariffGroup,
  type TariffRow,
} from '@/content/pricing';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/cn';

/**
 * Tariff card grid (§3.4, §3.5).
 *
 * This restores the live site's layout — one card per garment — with
 * "Add to Cart" in place of its per-item "Enquire Now". Prices are not shown
 * here: GST and the final rate both depend on fabric and the work involved,
 * so the card only lets a visitor pick a quantity; the team confirms the
 * quote once they see the garment. The category chips are in-page anchors
 * rather than a filter, so every item stays crawlable and printable.
 *
 * The category nav only renders when there is more than one group — a service
 * detail page passes a single-group catalog (see /services/[slug]/) to show
 * just that service's rows, and a one-chip nav with nothing to switch between
 * is clutter, not navigation.
 */
export function TariffGrid({ catalog }: { catalog: TariffCatalog }) {
  const { groups } = catalog;
  const showNav = groups.length > 1;
  const [activeId, setActiveId] = useState(groups[0]?.id);
  const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});

  // Highlights the chip for whichever category is currently in view.
  useEffect(() => {
    const nodes = Object.values(headingRefs.current).filter(Boolean) as HTMLElement[];
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {showNav ? (
        <nav
          aria-label="Tariff categories"
          className="sticky top-[var(--header-h)] z-20 -mx-5 border-b border-neutral-line bg-white/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:mx-0 lg:rounded-card lg:border lg:px-4"
        >
          <ul className="no-scrollbar flex gap-2 overflow-x-auto">
            {groups.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  aria-current={activeId === group.id ? 'true' : undefined}
                  className={cn(
                    'inline-block whitespace-nowrap rounded-pill border px-4 py-2 text-sm font-medium transition-colors',
                    activeId === group.id
                      ? 'border-brand bg-brand text-white'
                      : 'border-neutral-line text-neutral-body hover:border-brand/40 hover:text-brand',
                  )}
                >
                  {group.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className={cn('space-y-20', showNav ? 'mt-12' : 'mt-0')}>
        {groups.map((group) => (
          <CategorySection
            key={group.id}
            catalog={catalog}
            group={group}
            registerHeading={(node) => {
              headingRefs.current[group.id] = node;
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CategorySection({
  catalog,
  group,
  registerHeading,
}: {
  catalog: TariffCatalog;
  group: TariffGroup;
  registerHeading: (node: HTMLHeadingElement | null) => void;
}) {
  return (
    <section aria-labelledby={`${group.id}-heading`}>
      <div className="flex items-baseline gap-4">
        <h2
          id={group.id}
          ref={registerHeading}
          className="font-display text-display-md text-neutral-ink"
        >
          {group.label}
        </h2>
        {/* Gold hairline running out to the margin — the rule that carries the
            "couture" register through the pricing pages. */}
        <span aria-hidden="true" className="h-px flex-1 self-center bg-gradient-to-r from-accent-gold/60 to-transparent" />
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-body">
          {group.rows.length} {group.rows.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <span id={`${group.id}-heading`} className="sr-only">
        {group.label} tariffs
      </span>

      <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.rows.map((row, index) => (
          <TariffCard
            key={row.item}
            catalog={catalog}
            groupId={group.id}
            row={row}
            index={index}
          />
        ))}
      </ul>
    </section>
  );
}

function TariffCard({
  catalog,
  groupId,
  row,
  index,
}: {
  catalog: TariffCatalog;
  groupId: string;
  row: TariffRow;
  index: number;
}) {
  const { add, setQuantity, lines } = useCart();
  const id = lineId(catalog.id, groupId, row.item);
  const inCart = lines.find((line) => line.id === id)?.quantity ?? 0;

  return (
    <Reveal
      as="li"
      variant="up"
      delay={Math.min(index, 5) * 50}
      className="group flex flex-col overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift transition-[box-shadow,border-color,transform] duration-200 ease-entrance hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lift-hover"
    >
      {/* Product photo — the live site's own card image for this item. Empty
          alt: the item name is the very next text node, so a screen reader
          would otherwise hear every product announced twice. */}
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
        <h3 className="flex-1 font-display text-[1.375rem] font-semibold leading-tight text-neutral-ink">
          {row.item}
        </h3>

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
                  <span className="sr-only">Decrease {row.item} quantity</span>
                </button>
                <span aria-live="polite" className="w-8 text-center text-sm font-semibold tabular-nums">
                  {inCart}
                  <span className="sr-only"> {row.item}</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    add({
                      id,
                      item: row.item,
                      service: catalog.label,
                      amount: row.amount,
                      from: row.from ?? false,
                      image: row.image,
                    })
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-neutral-ink transition-colors hover:bg-neutral-muted"
                >
                  <span aria-hidden="true">+</span>
                  <span className="sr-only">Increase {row.item} quantity</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                add({
                  id,
                  item: row.item,
                  service: catalog.label,
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
