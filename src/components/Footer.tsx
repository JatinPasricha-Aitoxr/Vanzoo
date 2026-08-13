import Image from 'next/image';
import Link from 'next/link';
import {
  footerColumns,
  footerIntro,
  links,
  primaryStore,
  site,
  socialLinks,
} from '@/lib/site';

/**
 * Mega-footer (§2.3.9). Columns come from `footerColumns` in site.ts, so adding
 * a link is a data edit rather than a markup change.
 */
export function Footer() {
  return (
    <footer className="band-dark text-white">
      {/* Extra bottom padding on small screens clears the fixed "Book Pickup"
          bar, which would otherwise cover the copyright line. */}
      <div className="shell pb-24 pt-section-sm sm:py-section-sm">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-8">
          <div className="max-w-sm">
            <Image
              src="/images/brand/vanzoo-logo.png"
              alt="Vanzoo — premium organic dryclean"
              width={2200}
              height={653}
              sizes="176px"
              className="h-9 w-auto brightness-0 invert"
            />
            <h2 className="mt-6 font-display text-xl font-semibold text-white">
              {footerIntro.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{footerIntro.body}</p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="text-white/80 transition-colors hover:text-accent-gold-soft"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-white/80 transition-colors hover:text-accent-gold-soft"
                >
                  {site.email}
                </a>
              </li>
              <li className="text-white/70">{primaryStore.address}</li>
            </ul>

            <ul className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Vanzoo on ${social.label}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-white/25 text-white transition-colors hover:border-accent-gold hover:text-accent-gold-soft"
                  >
                    <SocialIcon name={social.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold-soft">
                {column.heading}
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-white/15 pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Get the Vanzoo app</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={links.playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-card border border-white/25 px-4 py-2.5 transition-colors hover:border-accent-gold-soft"
                >
                  <PlayIcon />
                  <span className="text-left leading-tight">
                    <span className="block text-[0.625rem] uppercase tracking-wide text-white/75">
                      Get it on
                    </span>
                    <span className="block text-sm font-semibold text-white">Google Play</span>
                  </span>
                </a>
                <span className="rounded-pill border border-white/15 px-3.5 py-2 text-xs text-white/75">
                  iOS — coming soon
                </span>
              </div>
            </div>

            <a
              href={links.bookPickup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-inverse btn-md shrink-0"
            >
              Book Pickup
            </a>
          </div>

          <p className="mt-8 text-xs text-white/70">
            {footerIntro.copyright} {site.name} is a unit of {site.legalName}.
          </p>
        </div>
      </div>

      {/* Signature sign-off, carried over from the old site: the wordmark set
          across the full footer width in brand gold. Text rather than an image
          so it scales losslessly and stays selectable; aria-hidden because the
          header logo already names the site for assistive tech. */}
      <div aria-hidden="true" className="select-none overflow-hidden pb-6">
        <p className="wordmark-giant text-center font-display font-semibold uppercase">
          Vanzoo
        </p>
        <p className="mt-1 text-center text-[clamp(0.5rem,1.1vw,0.8125rem)] font-semibold uppercase tracking-[0.68em] text-accent-gold-soft/80 sm:tracking-[0.9em]">
          Premium Organic Dryclean
        </p>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = { className: 'h-4 w-4', fill: 'currentColor', 'aria-hidden': true } as const;
  if (name === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.11v2.3H7.6V13h2.7v8h3.2z" />
      </svg>
    );
  }
  if (name === 'Instagram') {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M12 2.9c2.96 0 3.31.01 4.48.06 1.08.05 1.67.23 2.06.38.52.2.89.44 1.28.83.39.39.63.76.83 1.28.15.39.33.98.38 2.06.05 1.17.06 1.52.06 4.48s-.01 3.31-.06 4.48c-.05 1.08-.23 1.67-.38 2.06-.2.52-.44.89-.83 1.28-.39.39-.76.63-1.28.83-.39.15-.98.33-2.06.38-1.17.05-1.52.06-4.48.06s-3.31-.01-4.48-.06c-1.08-.05-1.67-.23-2.06-.38-.52-.2-.89-.44-1.28-.83-.39-.39-.63-.76-.83-1.28-.15-.39-.33-.98-.38-2.06C2.91 15.31 2.9 14.96 2.9 12s.01-3.31.06-4.48c.05-1.08.23-1.67.38-2.06.2-.52.44-.89.83-1.28.39-.39.76-.63 1.28-.83.39-.15.98-.33 2.06-.38C8.69 2.91 9.04 2.9 12 2.9zm0 5.02a4.08 4.08 0 100 8.16 4.08 4.08 0 000-8.16zm0 6.73a2.65 2.65 0 110-5.3 2.65 2.65 0 010 5.3zm5.19-6.89a.95.95 0 11-1.9 0 .95.95 0 011.9 0z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M21.6 7.2a2.5 2.5 0 00-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 001.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15.06V8.94L15.2 12 10 15.06z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M3.6 2.6c-.3.3-.5.8-.5 1.4v16c0 .6.2 1.1.5 1.4l.1.1 9-9v-.2l-9-9-.1.1zm12.2 5.9L5.4 2.4l8.8 8.8 1.6-1.6v-1.1zm2.9 2.1-2.2-1.3-1.8 1.8 1.8 1.8 2.2-1.3c.7-.4.7-1.2 0-1.6zM5.4 21.6l10.4-6.1-1.6-1.6-8.8 7.7z" />
    </svg>
  );
}
