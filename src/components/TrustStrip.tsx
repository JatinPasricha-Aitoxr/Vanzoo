import { Icon } from './ui/Icon';
import { RevealGroup } from './ui/Reveal';
import { trustMarkers } from '@/content/marketing';

/**
 * Trust strip (§2.3.3).
 *
 * Rinse's slot holds press logos; Vanzoo has no press coverage to cite, and the
 * brief forbids inventing any — so this states verifiable capabilities instead.
 * Swap `trustMarkers` in content/marketing.ts once real certifications or a
 * verified rating exist.
 *
 * Each marker carries an icon so the row can be scanned rather than read; the
 * icons are decorative, since the label beside them already says the same thing.
 */
export function TrustStrip({ tone = 'onDark' }: { tone?: 'onDark' | 'onLight' }) {
  const dark = tone === 'onDark';
  return (
    <div
      className={
        dark
          ? 'border-t border-white/15 bg-brand-dark'
          : 'border-y border-neutral-line bg-neutral-muted'
      }
    >
      <div className="shell py-7">
        <h2
          className={
            dark
              ? 'text-center text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/75'
              : 'text-center text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-neutral-body'
          }
        >
          What every Vanzoo order includes
        </h2>

        <RevealGroup
          as="ul"
          step={60}
          className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3 lg:grid-cols-5"
        >
          {trustMarkers.map((marker) => (
            <li key={marker.label} className="flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className={
                  dark
                    ? 'mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-pill bg-white/10 text-[1.125rem] text-accent-gold'
                    : 'mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-pill bg-brand-light text-[1.125rem] text-brand'
                }
              >
                <Icon name={marker.icon} />
              </span>
              <p
                className={
                  dark
                    ? 'text-sm font-semibold leading-snug text-white'
                    : 'text-sm font-semibold leading-snug text-neutral-ink'
                }
              >
                {marker.label}
              </p>
              <p
                className={
                  dark
                    ? 'mt-1 text-xs leading-snug text-white/75'
                    : 'mt-1 text-xs leading-snug text-neutral-body'
                }
              >
                {marker.detail}
              </p>
            </li>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
