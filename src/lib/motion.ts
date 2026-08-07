'use client';

/**
 * Shared scroll-reveal machinery.
 *
 * One IntersectionObserver serves the whole page rather than one per element.
 * The blog index alone reveals 70+ cards; a per-element observer there costs
 * ~70 separate observation contexts, and the browser has to reconcile all of
 * them on every scroll. A single observer with many targets is one context.
 *
 * Elements are unobserved as soon as they fire, so a long page steadily drops
 * back to zero observed targets as the reader moves down it.
 */

type Callback = () => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Callback>();

/** Reveals fire slightly before the element is fully on screen. */
const ROOT_MARGIN = '0px 0px -12% 0px';

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const callback = callbacks.get(entry.target);
        if (callback) {
          callback();
          callbacks.delete(entry.target);
        }
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: ROOT_MARGIN, threshold: 0.01 },
  );

  return observer;
}

export function observeOnce(element: Element, callback: Callback): () => void {
  const instance = getObserver();
  if (!instance) {
    // No observer support — show immediately rather than leaving content hidden.
    callback();
    return () => {};
  }
  callbacks.set(element, callback);
  instance.observe(element);
  return () => {
    callbacks.delete(element);
    instance.unobserve(element);
  };
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * True when the element is already within the first viewport at mount.
 *
 * Above-the-fold content is rendered in its final state instead of animating:
 * playing an entrance on something the reader is already looking at reads as a
 * flash, and on the hero it would delay the LCP paint.
 */
export function isInitiallyVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92;
}
