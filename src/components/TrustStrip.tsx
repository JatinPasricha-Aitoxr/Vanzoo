import { trustMarkers } from '@/content/marketing';

/**
 * Trust strip (§2.3.3).
 *
 * Rinse's slot holds press logos; Vanzoo has no press coverage to cite, and the
 * brief forbids inventing any — so this states verifiable capabilities instead.
 * Swap `trustMarkers` in content/marketing.ts once real certifications or a
 * verified rating exist.
 */
export function TrustStrip({ tone = 'onDark' }: { tone?: 'onDark' | 'onLight' }) {
  const dark = tone === 'onDark';
  return (
    <div
      className={dark ? 'band-dark' : 'border-y border-neutral-line bg-neutral-muted'}
    >
      <div className="shell py-6">
        <h2
          className={
            dark
              ? 'text-center text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/75'
              : 'text-center text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-neutral-body'
          }
        >
          What every Vanzoo order includes
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 lg:grid-cols-5">
          {trustMarkers.map((marker) => (
            <li key={marker.label} className="text-center">
              {/* Short gold rule over each marker — the repeated detail that
                  makes the strip read as a considered set rather than a list. */}
              <span
                aria-hidden="true"
                className={
                  dark
                    ? 'mx-auto mb-3 block h-px w-7 bg-accent-gold/70'
                    : 'mx-auto mb-3 block h-px w-7 bg-accent-gold'
                }
              />
              <p
                className={
                  dark
                    ? 'text-base font-semibold text-white'
                    : 'text-base font-semibold text-neutral-ink'
                }
              >
                {marker.label}
              </p>
              <p className={dark ? 'mt-1.5 text-sm text-white/75' : 'mt-1.5 text-sm text-neutral-body'}>
                {marker.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
