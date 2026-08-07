import Image from 'next/image';
import Link from 'next/link';
import { Icon, type IconName } from './ui/Icon';
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
    <footer className="bg-brand-dark text-white">
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

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Icon name="phone" className="text-base text-accent-gold" />
                <a
                  href={`tel:${site.phoneHref}`}
                  className="text-white/80 transition-colors hover:text-accent-gold-soft"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="text-base text-accent-gold" />
                <a
                  href={`mailto:${site.email}`}
                  className="text-white/80 transition-colors hover:text-accent-gold-soft"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Icon name="mapPin" className="mt-0.5 text-base text-accent-gold" />
                <span>{primaryStore.address}</span>
              </li>
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
                    <Icon name={SOCIAL_ICONS[social.label] ?? 'externalLink'} />
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
                  <Icon name="googlePlay" className="text-2xl" />
                  <span className="text-left leading-tight">
                    <span className="block text-[0.625rem] uppercase tracking-wide text-white/75">
                      Get it on
                    </span>
                    <span className="block text-sm font-semibold text-white">Google Play</span>
                  </span>
                </a>
                <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-3.5 py-2 text-xs text-white/75">
                  <Icon name="apple" className="text-sm" />
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
    </footer>
  );
}

const SOCIAL_ICONS: Record<string, IconName> = {
  Facebook: 'facebook',
  Instagram: 'instagram',
  YouTube: 'youtube',
};
