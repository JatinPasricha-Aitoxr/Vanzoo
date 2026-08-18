import { areaGroups } from '@/lib/site';
import { RevealGroup } from './ui/Reveal';

/**
 * The corridor-by-corridor coverage grid — one card per `areaGroups` entry,
 * every locality it covers as a chip. Shared between /areas-we-serve/ (the
 * full page, `headingLevel="h2"` since it sits directly under that page's own
 * intro) and the homepage's "Areas we serve" section (`headingLevel="h3"`,
 * nested under that section's own H2) so the two never drift into two
 * different presentations of the same data.
 */
export function AreaCoverageGrid({
  headingLevel,
  showBlurb = true,
}: {
  headingLevel: 'h2' | 'h3';
  /** Homepage uses the compact form — chips only, no supporting sentence —
   *  since the full description already lives on /areas-we-serve/. */
  showBlurb?: boolean;
}) {
  const Heading = headingLevel;

  return (
    <RevealGroup as="ul" step={90} className="grid gap-5 lg:grid-cols-2">
      {areaGroups.map((group) => (
        <li
          key={group.id}
          id={group.id}
          className="flex flex-col rounded-card border border-neutral-line bg-white p-6 shadow-lift transition-[box-shadow,border-color] duration-200 hover:border-brand/25 hover:shadow-lift-hover sm:p-8"
        >
          <div className="flex items-center gap-3">
            <Heading className="font-display text-xl font-semibold text-neutral-ink">
              {group.name}
            </Heading>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-accent-gold/60 to-transparent"
            />
          </div>
          {showBlurb ? (
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-body">
              {group.blurb}
            </p>
          ) : null}

          <ul className={showBlurb ? 'mt-5 flex flex-wrap gap-2' : 'mt-4 flex flex-wrap gap-2'}>
            {group.areas.map((area) => (
              <li
                key={area}
                className="rounded-pill border border-neutral-line bg-neutral-muted px-3 py-1.5 text-[0.8125rem] font-medium text-neutral-ink"
              >
                {area}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </RevealGroup>
  );
}
