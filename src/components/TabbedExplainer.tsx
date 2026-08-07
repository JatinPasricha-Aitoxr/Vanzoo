'use client';

import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import { Reveal } from './ui/Reveal';
import { cn } from '@/lib/cn';

export type ExplainerStep = {
  id: string;
  tab: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

/**
 * Tabbed feature explainer (§2.3.4) — image on one side, tab list on the other.
 *
 * Implements the WAI-ARIA tabs pattern with manual activation: arrow keys move
 * focus and selection, Home/End jump to the ends, and only the active tab is in
 * the tab order. Every panel is rendered and merely hidden, so all three steps
 * are in the HTML for crawlers rather than appearing on click.
 */
export function TabbedExplainer({
  steps,
  reverse = false,
}: {
  steps: readonly ExplainerStep[];
  /** Puts the tab list on the left and the image on the right. */
  reverse?: boolean;
}) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const next = (index + steps.length) % steps.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusTab(active + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusTab(active - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(steps.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={cn(
        'grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16',
        reverse && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {/* Images cross-fade with a slight scale-down, so the swap reads as one
          picture settling into place rather than two dissolving. */}
      <Reveal variant="left" className="media-frame aspect-[4/3]">
        {steps.map((step, index) => (
          <Image
            key={step.id}
            src={step.image}
            alt={step.imageAlt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 46vw, 100vw"
            data-active={index === active}
            className="tab-media object-cover"
            // Inactive panels are hidden from assistive tech along with their image.
            aria-hidden={index !== active}
          />
        ))}
      </Reveal>

      <Reveal variant="right" delay={90}>
        <div
          role="tablist"
          aria-label="How Vanzoo works"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex flex-col"
        >
          {steps.map((step, index) => {
            const selected = index === active;
            return (
              <button
                key={step.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${step.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${step.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className="group relative border-t border-neutral-line py-5 pl-4 text-left transition-colors duration-200 last:border-b hover:border-brand/40"
              >
                {/* Rail that wipes down the leading edge of the active tab.
                    A border colour swap would flip instantly; this travels. */}
                <span
                  aria-hidden="true"
                  data-active={selected}
                  className="tab-rail absolute inset-y-0 left-0 w-[2px] rounded-full bg-brand"
                />

                <span className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      'font-display text-sm font-semibold tabular-nums transition-colors duration-300',
                      selected ? 'text-accent-gold-ink' : 'text-neutral-body',
                    )}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={cn(
                      'font-display text-xl font-semibold transition-[color,transform] duration-300 ease-entrance sm:text-2xl',
                      selected
                        ? 'translate-x-0.5 text-neutral-ink'
                        : 'text-neutral-body group-hover:translate-x-0.5 group-hover:text-neutral-ink',
                    )}
                  >
                    {step.tab}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            role="tabpanel"
            id={`${baseId}-panel-${step.id}`}
            aria-labelledby={`${baseId}-tab-${step.id}`}
            hidden={index !== active}
            tabIndex={0}
            className="mt-7 focus-visible:outline-none"
          >
            {/* Keyed on `active` so React remounts the inner node on every tab
                change, which restarts the entrance animation. Without the key
                the animation only ever plays once. */}
            <div key={active} className="tab-panel-in">
              <h3 className="text-display-sm">{step.title}</h3>
              <p className="mt-3 text-lead text-pretty text-neutral-body">{step.body}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
