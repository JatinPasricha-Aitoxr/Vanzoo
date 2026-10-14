'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Horizontal row that advances one card every `interval` ms and loops back to
 * the start. Pauses while the pointer is over it, while anything inside has
 * focus, while a finger is down, and for visitors who prefer reduced motion.
 */
export function AutoScrollRow({
  children,
  className,
  interval = 2000,
}: {
  children: React.ReactNode;
  className?: string;
  interval?: number;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (paused.current || document.hidden) return;
      const first = list.firstElementChild as HTMLElement | null;
      if (!first) return;
      const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap || '0');
      const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
      list.scrollTo({ left: atEnd ? 0 : list.scrollLeft + step, behavior: 'smooth' });
    }, interval);
    return () => window.clearInterval(id);
  }, [interval]);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <ul
      ref={ref}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={() => window.setTimeout(resume, 4000)}
      className={cn(className)}
    >
      {children}
    </ul>
  );
}
