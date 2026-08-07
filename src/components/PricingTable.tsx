'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './ui/Icon';
import { Reveal } from './ui/Reveal';
import type { TariffGroup } from '@/content/pricing';
import { cn } from '@/lib/cn';

/**
 * Tariff tables (§3.4, §3.5).
 *
 * One real `<table>` per category — a single flat table would lose the grouping,
 * and a definition list would lose the row/column semantics screen readers use
 * to announce "Saree, Starting from ₹299". The category chips are in-page
 * anchors rather than a filter, so every price stays crawlable and printable.
 */
export function PricingTable({ groups }: { groups: readonly TariffGroup[] }) {
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
                  'inline-flex items-center gap-2 whitespace-nowrap rounded-pill border px-4 py-2 text-sm font-medium transition-colors',
                  activeId === group.id
                    ? 'border-brand bg-brand text-white'
                    : 'border-neutral-line text-neutral-body hover:border-brand/40 hover:text-brand',
                )}
              >
                <Icon name={group.icon} className="text-base" />
                {group.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-12">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`${group.id}-heading`}>
            <h2
              id={group.id}
              ref={(node) => {
                headingRefs.current[group.id] = node;
              }}
              className="sr-only"
            >
              {group.label}
            </h2>

            <Reveal className="overflow-x-auto rounded-card border border-neutral-line">
              <table className="w-full min-w-[22rem] border-collapse text-left">
                <caption className="sr-only">{group.label} tariffs, in Indian rupees</caption>
                <thead>
                  <tr className="bg-brand text-white">
                    <th
                      id={`${group.id}-heading`}
                      scope="col"
                      className="px-5 py-3.5 font-display text-base font-semibold sm:px-6"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <Icon name={group.icon} className="text-xl text-white/85" />
                        {group.label}
                      </span>
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right text-sm font-semibold sm:px-6">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, index) => (
                    <tr
                      key={row.item}
                      className={cn(
                        'border-t border-neutral-line',
                        index % 2 === 1 && 'bg-neutral-muted',
                      )}
                    >
                      <th
                        scope="row"
                        className="px-5 py-3.5 text-[0.9375rem] font-medium text-neutral-ink sm:px-6"
                      >
                        {row.item}
                      </th>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-[0.9375rem] font-semibold tabular-nums text-brand-dark sm:px-6">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
