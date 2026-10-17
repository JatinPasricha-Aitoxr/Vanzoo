'use client';

import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Horizontal row that advances one card every `interval` ms and loops back to
 * the start, with previous / next buttons. Auto-advance pauses while the
 * pointer is over it, while anything inside has focus, while a finger is down,
 * and for visitors who prefer reduced motion (the buttons still work).
 */
export function AutoScrollRow({
  children,
  className,
  interval = 2000,
  label = 'items',
}: {
  children: React.ReactNode;
  className?: string;
  interval?: number;
  /** Names the list for the button labels, e.g. "services". */
  label?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const paused = useRef(false);

  const step = useCallback((direction: 1 | -1 | 'auto') => {
    const list = ref.current;
    const first = list?.firstElementChild as HTMLElement | null;
    if (!list || !first) return;
    const width = first.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap || '0');
    const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
    const atStart = list.scrollLeft <= 4;
    if (direction === -1) {
      list.scrollTo({ left: atStart ? list.scrollWidth : list.scrollLeft - width, behavior: 'smooth' });
    } else {
      list.scrollTo({ left: atEnd ? 0 : list.scrollLeft + width, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (paused.current || document.hidden) return;
      step('auto');
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, step]);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  const arrow =
    'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-line bg-white text-neutral-ink shadow-lift-hover transition-colors hover:bg-brand hover:text-white sm:flex';

  return (
    <div className="group/row relative" onMouseEnter={pause} onMouseLeave={resume}>
      <button type="button" aria-label={`Previous ${label}`} onClick={() => step(-1)} className={cn(arrow, '-left-3 lg:-left-5')}>
        <Chevron direction="left" />
      </button>
      <ul
        ref={ref}
        onFocus={pause}
        onBlur={resume}
        onTouchStart={pause}
        onTouchEnd={() => window.setTimeout(resume, 4000)}
        className={cn(className)}
      >
        {children}
      </ul>
      <button type="button" aria-label={`Next ${label}`} onClick={() => step(1)} className={cn(arrow, '-right-3 lg:-right-5')}>
        <Chevron direction="right" />
      </button>
    </div>
  );
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'm10 3-5 5 5 5' : 'm6 3 5 5-5 5'} />
    </svg>
  );
}
