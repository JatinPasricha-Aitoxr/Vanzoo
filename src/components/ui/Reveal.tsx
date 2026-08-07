'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { isInitiallyVisible, observeOnce, prefersReducedMotion } from '@/lib/motion';

export type RevealVariant = 'up' | 'fade' | 'scale' | 'left' | 'right' | 'blur';

/**
 * Reveals an element as it scrolls into view.
 *
 * The element ships visible in the server-rendered HTML and is only hidden once
 * the effect confirms observer support, so content is never trapped behind JS
 * that failed to load. Reduced-motion and above-the-fold elements skip the
 * animation entirely rather than running a faster version of it.
 *
 * Only `opacity`, `transform` and `filter` are animated — all compositor
 * properties, so a reveal never triggers layout or paint on the main thread.
 */
export function Reveal({
  children,
  className,
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  ...rest
}: {
  /** Optional so callers can pass `dangerouslySetInnerHTML` instead, as the
   *  policy pages and article bodies do. */
  children?: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Stagger in milliseconds, for grids that reveal item by item. */
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'article';
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || isInitiallyVisible(node)) return;

    setState('hidden');
    return observeOnce(node, () => setState('shown'));
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={state === 'static' ? undefined : variant}
      data-shown={state === 'shown' ? '' : undefined}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveals its direct children one after another.
 *
 * The stagger is applied through a CSS custom property indexed per child rather
 * than by wrapping each child in its own Reveal — one observed element instead
 * of N, and the children stay plain elements so grid and flex layouts are
 * unaffected.
 */
export function RevealGroup({
  children,
  className,
  variant = 'up',
  step = 70,
  as: Tag = 'div',
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Milliseconds between consecutive children. */
  step?: number;
  as?: 'div' | 'ul' | 'ol' | 'dl';
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || isInitiallyVisible(node)) return;

    setState('hidden');
    return observeOnce(node, () => setState('shown'));
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal-group={state === 'static' ? undefined : variant}
      data-shown={state === 'shown' ? '' : undefined}
      style={{ '--reveal-step': `${step}ms` } as React.CSSProperties}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
