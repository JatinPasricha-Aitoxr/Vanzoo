import { sharedProcess } from '@/content/productCare';
import { STEP_ICONS } from './DryCleaningProcess';
import { RevealGroup } from './ui/Reveal';

/**
 * The nine-step care process in a flat, horizontal format — one row of cards on
 * wide screens, a swipeable row on phones — so it takes a fraction of the
 * height of the stacked version on the homepage. Text only; icons are inline SVG.
 */
export function NineStepProcess({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <RevealGroup
      as="ol"
      step={50}
      className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-9 lg:gap-2.5 lg:overflow-visible lg:px-0"
    >
      {sharedProcess.stages.map((stage, index) => (
        <li
          key={stage.title}
          className={
            'w-[8.5rem] shrink-0 snap-start rounded-card border p-3.5 text-center lg:w-auto ' +
            (dark ? 'border-white/15 bg-white/[0.06]' : 'border-neutral-line bg-white shadow-lift')
          }
        >
          <span
            className={
              'mx-auto flex h-11 w-11 items-center justify-center rounded-xl border-[1.5px] ' +
              (dark ? 'border-accent-gold/70 text-accent-gold-soft' : 'border-brand/70 text-brand')
            }
          >
            {STEP_ICONS[index] ?? STEP_ICONS[0]}
          </span>
          <p className="mt-2.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-accent-gold-ink">
            Step {index + 1}
          </p>
          <h3
            className={
              'mt-1 font-display text-[0.9375rem] font-semibold leading-snug ' +
              (dark ? 'text-white' : 'text-neutral-ink')
            }
          >
            {stage.title}
          </h3>
        </li>
      ))}
    </RevealGroup>
  );
}
