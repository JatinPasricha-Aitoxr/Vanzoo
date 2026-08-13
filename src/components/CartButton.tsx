'use client';

import { useCart } from '@/lib/cart';
import { cn } from '@/lib/cn';

/**
 * Header cart trigger.
 *
 * The count badge only appears once the cart has hydrated from localStorage —
 * rendering a stored count during SSR would mismatch the HTML the server sent.
 */
export function CartButton({ solid }: { solid: boolean }) {
  const { count, openCart, isHydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill border transition-colors duration-200',
        solid
          ? 'border-neutral-line text-neutral-ink hover:bg-neutral-muted'
          : 'border-white/40 text-white hover:bg-white/10',
      )}
    >
      <span className="sr-only">
        Open cart
        {isHydrated && count > 0 ? ` — ${count} ${count === 1 ? 'item' : 'items'}` : ''}
      </span>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
        <path
          d="M1 1.5h1.9l1.6 8.2h7.3l1.4-5.9H4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="6" cy="13" r="1.3" fill="currentColor" />
        <circle cx="11.5" cy="13" r="1.3" fill="currentColor" />
      </svg>

      {isHydrated && count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-pill bg-accent-gold px-1 text-[0.6875rem] font-bold tabular-nums text-brand-ink"
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  );
}
