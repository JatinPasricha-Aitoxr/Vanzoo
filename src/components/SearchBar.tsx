'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { coutureCatalog, formatPrice, steamIronCatalog } from '@/content/pricing';
import { serviceEntries } from '@/content/services';
import { navLinks } from '@/lib/site';
import { cn } from '@/lib/cn';

type SearchItem = { label: string; href: string; group: string; price?: string };

const PAGE_ITEMS: SearchItem[] = navLinks.map((link) => ({
  label: link.label,
  href: link.href,
  group: 'Pages',
}));

const SERVICE_ITEMS: SearchItem[] = serviceEntries.map((service) => ({
  label: service.title,
  href: `/services/${service.id}/`,
  group: 'Services',
}));

/** Every priced tariff row from both catalogues — so searching a garment name
 *  ("shirt") surfaces its category and price, not just the service it lives
 *  under. Links to that category's own anchor on the pricing page. */
const PRODUCT_ITEMS: SearchItem[] = [coutureCatalog, steamIronCatalog].flatMap((catalog) =>
  catalog.groups.flatMap((group) =>
    group.rows.map((row) => ({
      label: row.item,
      href: `/pricing/#${group.id}`,
      group: `${group.label} · ${catalog.label}`,
      price: formatPrice(row),
    })),
  ),
);

const SEARCH_INDEX: readonly SearchItem[] = [...PAGE_ITEMS, ...SERVICE_ITEMS, ...PRODUCT_ITEMS];

/**
 * Header search — a lightweight client-side lookup over the site's own pages,
 * service catalogue and every tariff item (no blog posts: importing that
 * corpus into every page's bundle via the header would cost far more than the
 * search is worth). Expands in place from an icon trigger, matching the cart
 * button's footprint when idle so it costs nothing in the header's
 * already-tight layout.
 */
export function SearchBar({ solid }: { solid: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const trimmed = query.trim().toLowerCase();
  // Names that start with the query rank above ones that merely contain it
  // (searching "shirt" should lead with "Shirt", not bury it under "T-shirt").
  const results = trimmed
    ? SEARCH_INDEX.filter((item) => item.label.toLowerCase().includes(trimmed))
        .sort(
          (a, b) =>
            Number(!a.label.toLowerCase().startsWith(trimmed)) -
            Number(!b.label.toLowerCase().startsWith(trimmed)),
        )
        .slice(0, 10)
    : [];

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = results[0];
    if (!first) return;
    router.push(first.href);
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={rootRef} className="relative hidden md:block">
      {open ? (
        <form role="search" onSubmit={onSubmit}>
          <label htmlFor="site-search" className="sr-only">
            Search Vanzoo
          </label>
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, services, pages…"
            className="h-10 w-56 rounded-pill border border-neutral-line bg-white px-4 text-sm text-neutral-ink placeholder:text-neutral-body/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:w-72"
          />

          {results.length > 0 ? (
            <ul className="absolute left-0 top-full z-30 mt-2 w-[22rem] max-w-[calc(100vw-2.5rem)] max-h-[70vh] overflow-y-auto rounded-card border border-neutral-line bg-white py-1.5 shadow-lift-hover">
              {results.map((item, index) => (
                <li key={`${item.group}-${item.href}-${item.label}-${index}`}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery('');
                    }}
                    className="flex flex-col gap-1 px-4 py-2.5 text-sm text-neutral-ink transition-colors hover:bg-brand-tint hover:text-brand"
                  >
                    <span className="truncate font-medium">{item.label}</span>
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-neutral-body">
                        {item.group}
                      </span>
                      {item.price ? (
                        <span className="shrink-0 text-xs font-semibold text-brand">
                          {item.price}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : trimmed ? (
            <p className="absolute left-0 top-full z-30 mt-2 w-full rounded-card border border-neutral-line bg-white px-4 py-3 text-sm text-neutral-body shadow-lift-hover">
              No matches for “{query.trim()}”.
            </p>
          ) : null}
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-pill border transition-colors duration-200',
            solid
              ? 'border-neutral-line text-neutral-ink hover:bg-neutral-muted'
              : 'border-white/40 text-white hover:bg-white/10',
          )}
        >
          <span className="sr-only">Search</span>
          <SearchIcon />
        </button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m11 11 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
