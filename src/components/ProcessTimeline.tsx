import { RevealGroup } from './ui/Reveal';

export type ProcessTimelineStage = { title: string; body: string };

/**
 * Nine-stage process timeline with full copy per stage — the detailed sibling
 * of `ProcessRail` (which only carries short labels for the homepage strip).
 *
 * Desktop (lg+): a 3-column grid so the connecting rail reads as rows of a
 * journey rather than one impossibly long horizontal strip. Mobile: a single
 * vertical rail, each stage a compact row rather than a full-height card, so
 * nine stages don't turn into an extremely tall scroll.
 */
export function ProcessTimeline({ stages }: { stages: readonly ProcessTimelineStage[] }) {
  return (
    <RevealGroup
      as="ol"
      step={60}
      className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12"
    >
      {stages.map((stage, index) => (
        <li key={stage.title} className="relative pl-14 sm:pl-16">
          <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-pill border border-accent-gold/60 bg-white font-display text-sm font-semibold text-brand shadow-lift sm:h-11 sm:w-11">
            {String(index + 1).padStart(2, '0')}
          </span>
          {/* Connector down to the next stage — vertical on every breakpoint,
              since the grid reflows column count and a horizontal rail would
              misalign the moment it wraps. */}
          {index < stages.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute left-5 top-10 h-[calc(100%-1.75rem)] w-px bg-gradient-to-b from-accent-gold/50 to-accent-gold/10 sm:left-[1.375rem] sm:top-11"
            />
          ) : null}
          <h3 className="font-display text-lg font-semibold text-neutral-ink">{stage.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-pretty text-neutral-body">{stage.body}</p>
        </li>
      ))}
    </RevealGroup>
  );
}
