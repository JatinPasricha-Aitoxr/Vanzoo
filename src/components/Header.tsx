'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BookPickupWidget } from './BookPickupWidget';
import { CartButton } from './CartButton';
import { links, navLinks } from '@/lib/site';
import { cn } from '@/lib/cn';

/**
 * Routes whose first section is a full-bleed photographic hero. On these the
 * bar starts transparent with light text; everywhere else it is solid from the
 * first paint, so a heading never sits under white-on-white text.
 *
 * `/services/` and every `/services/<slug>/` detail page use the same
 * photographic `PageHeader`, so they're matched by prefix rather than listed
 * one by one — there are twelve service slugs and the list would only grow.
 */
const HERO_ROUTES = new Set(['/', '/hydrocarbon-tech/', '/hydrocarbon-tech', '/pricing/', '/pricing']);

function isHeroRoute(pathname: string): boolean {
  return HERO_ROUTES.has(pathname) || pathname === '/services' || pathname.startsWith('/services/');
}

/** Distance past which the bar switches to its solid treatment. */
const SOLID_AT = 24;
/** Scroll depth below which the bar never auto-hides. */
const HIDE_AFTER = 320;
/** Ignore direction flips smaller than this, so trackpad jitter can't flicker it. */
const DIRECTION_THRESHOLD = 6;

/** Sticky site header (§3.1). */
export function Header() {
  const pathname = usePathname();
  const overHero = isHeroRoute(pathname);

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    // Scroll events fire far more often than frames; coalescing into one rAF
    // means the class flip happens at most once per painted frame.
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled(y > SOLID_AT);

        const delta = y - lastY;
        if (Math.abs(delta) > DIRECTION_THRESHOLD) {
          setHidden(delta > 0 && y > HIDE_AFTER);
          lastY = y;
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Route change closes the overlay; without this, tapping a link leaves the
  // menu open over the new page.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Locking the body prevents the page behind the full-screen overlay from
  // scrolling under it on iOS. Compensating for the scrollbar keeps the layout
  // from shifting sideways as it locks.
  useEffect(() => {
    if (!menuOpen) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [menuOpen]);

  const solid = scrolled || !overHero || menuOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-brand focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        data-hidden={hidden && !menuOpen ? 'true' : 'false'}
        className={cn(
          'site-header fixed inset-x-0 top-0 z-50',
          solid ? 'bg-white/95 shadow-header backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Vanzoo — home"
            className="shrink-0 rounded-sm"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/images/brand/vanzoo-logo.png"
              alt="Vanzoo — premium organic dryclean"
              width={2200}
              height={653}
              priority
              sizes="(min-width: 1024px) 168px, 132px"
              className={cn(
                'header-logo h-8 w-auto lg:h-9',
                // The wordmark is dark-on-transparent; over a photo hero it has
                // to invert to stay legible.
                !solid && 'brightness-0 invert',
                scrolled && 'lg:scale-[0.94]',
              )}
            />
          </Link>

          <DesktopNav pathname={pathname} solid={solid} />

          <div className="flex items-center gap-2">
            <CartButton solid={solid} />
            {/* Gold in both header states: it is the one persistent conversion
                action, and the ghost treatment let it recede over the hero. */}
            <a
              href={links.bookPickup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold btn-sm hidden shrink-0 sm:inline-flex"
            >
              Book Pickup
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-pill border transition-colors duration-200 xl:hidden',
                solid
                  ? 'border-neutral-line text-neutral-ink hover:bg-neutral-muted'
                  : 'border-white/40 text-white hover:bg-white/10',
              )}
            >
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
      <MobileBookBar hidden={menuOpen} />
    </>
  );
}

/**
 * Desktop navigation with a pill that slides between items.
 *
 * The pill is a single absolutely-positioned element animated with `transform`
 * and `width`, measured from the active link's offset box. Giving each link its
 * own background would cross-fade rather than travel, which is the whole point
 * of the effect.
 */
function DesktopNav({ pathname, solid }: { pathname: string; solid: boolean }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[data-active="true"]');
    if (!list || !active) {
      setPill(null);
      return;
    }
    setPill({ left: active.offsetLeft, width: active.offsetWidth });
  }, []);

  // Layout effect so the pill is positioned in the same frame the route paints,
  // rather than visibly jumping into place afterwards.
  useLayoutEffect(measure, [measure, pathname]);

  useEffect(() => {
    // Fonts land after first paint and change link widths under the pill.
    document.fonts?.ready.then(measure).catch(() => {});
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [measure]);

  return (
    /* xl rather than lg: eight labels plus the logo, cart and pickup button do
       not fit inside the 1280px shell until then, and a wrapped nav row is
       worse than the overlay the hamburger already gives us. */
    <nav aria-label="Primary" className="hidden xl:block">
      <ul ref={listRef} className="relative flex items-center gap-0.5">
        <span
          aria-hidden="true"
          className={cn(
            'nav-pill pointer-events-none absolute inset-y-0 left-0 rounded-pill',
            solid ? 'bg-brand-light' : 'bg-white/15',
            pill ? 'opacity-100' : 'opacity-0',
          )}
          style={
            pill
              ? { transform: `translate3d(${pill.left}px, 0, 0)`, width: pill.width }
              : undefined
          }
        />

        {navLinks.map((link) => {
          // No nav link is '/' any more — the logo is the only route home —
          // so every entry can use a plain prefix match.
          const active = pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                data-active={active ? 'true' : 'false'}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  // whitespace-nowrap is load-bearing: without it the longer
                  // labels wrap and the row grows into the logo.
                  'relative block whitespace-nowrap rounded-pill px-2 py-2 text-[0.8125rem] font-medium transition-colors duration-200 2xl:px-3',
                  solid
                    ? active
                      ? 'text-brand-dark'
                      : 'text-neutral-body hover:text-brand'
                    : active
                      ? 'text-white'
                      : 'text-white/80 hover:text-white',
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileNav({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes, and focus is trapped inside the overlay while it is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // Areas and Blogs graduated into the primary nav, so this is now only the
  // links that never had a place in it.
  const secondary = [{ href: '/locate-us/', label: 'Locate Us' }];

  return (
    <div
      id="mobile-nav"
      ref={panelRef}
      className="nav-panel fixed inset-0 z-40 bg-white pt-[var(--header-h)] xl:hidden"
    >
      <nav aria-label="Mobile" className="shell flex h-full flex-col overflow-y-auto pb-32 pt-6">
        <ul className="flex flex-col">
          {navLinks.map((link, index) => {
            // No nav link is '/' any more — the logo is the only route home.
            const active = pathname.startsWith(link.href);
            return (
              <li
                key={link.href}
                className="nav-item border-b border-neutral-line"
                style={{ '--i': index } as React.CSSProperties}
              >
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center justify-between py-4 font-display text-xl font-semibold transition-colors duration-200',
                    active ? 'text-brand' : 'text-neutral-ink hover:text-brand',
                  )}
                >
                  {link.label}
                  <ArrowRight className="arrow-nudge h-4 w-4 text-brand opacity-40" />
                </Link>
              </li>
            );
          })}
        </ul>

        <ul className="mt-6 flex flex-col gap-3">
          {secondary.map((link, index) => (
            <li
              key={link.href}
              className="nav-item"
              style={{ '--i': navLinks.length + index } as React.CSSProperties}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="text-[0.9375rem] font-medium text-neutral-body transition-colors duration-200 hover:text-brand"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className="nav-item mt-8 rounded-card border border-neutral-line p-4"
          style={{ '--i': navLinks.length + secondary.length } as React.CSSProperties}
        >
          <BookPickupWidget variant="inline" />
        </div>
      </nav>
    </div>
  );
}

/** Pinned pickup CTA on small screens (§3.1). */
function MobileBookBar({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-neutral-line bg-white/95 px-5 py-3 backdrop-blur transition-transform duration-300 ease-entrance sm:hidden',
        hidden && 'translate-y-full',
      )}
    >
      <a
        href={links.bookPickup}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold btn-md w-full"
      >
        Book Pickup
      </a>
    </div>
  );
}

/**
 * Hamburger that morphs into a close mark.
 *
 * Three bars: the outer two rotate into the X while the middle fades, all on
 * `transform`/`opacity` so the whole thing composites.
 */
function MenuIcon({ open }: { open: boolean }) {
  const bar =
    'absolute left-1/2 h-[1.5px] w-5 -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-entrance';
  return (
    <span aria-hidden="true" className="relative block h-5 w-5">
      <span
        className={cn(bar, open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[5px]')}
      />
      <span
        className={cn(
          'absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-opacity duration-200',
          open ? 'opacity-0' : 'opacity-100',
        )}
      />
      <span
        className={cn(bar, open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[13px]')}
      />
    </span>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
