import { processSteps } from '@/content/marketing';
import { RevealGroup } from './ui/Reveal';

/**
 * The nine-step care journey as a connected rail — the old site's signature
 * process timeline, rebuilt as data-driven markup. Numbered gold nodes joined
 * by a hairline; an ordered list underneath, so the sequence survives without
 * the styling.
 */
export function ProcessRail() {
  return (
    <RevealGroup
      as="ol"
      step={60}
      className="grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-9 lg:gap-x-0"
    >
      {processSteps.map((step, index) => (
        <li key={step} className="relative flex flex-col items-center text-center">
          {/* Connector — from each node to the next, so the row reads as one
              journey. Hidden on the 3-column wrap where it would join steps
              that aren't consecutive. */}
          {index < processSteps.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[1.375rem] hidden h-px w-full bg-gradient-to-r from-accent-gold/60 via-accent-gold/25 to-accent-gold/60 lg:block"
            />
          ) : null}

          <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-pill border border-accent-gold/60 bg-white font-display text-sm font-semibold text-brand shadow-lift">
            {index + 1}
          </span>
          <span className="mt-3 text-xs font-medium leading-snug text-neutral-body sm:text-[0.8125rem]">
            {step}
          </span>
        </li>
      ))}
    </RevealGroup>
  );
}
