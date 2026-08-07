import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { Icon, type IconName } from '@/components/ui/Icon';
import { RevealGroup } from '@/components/ui/Reveal';
import { menuHub } from '@/content/campaigns';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { links, site, socialLinks, stores } from '@/lib/site';

const CRUMBS = [{ name: 'Connect', href: '/menu/' }];

export const metadata = buildMetadata({
  title: 'Connect with Vanzoo | App, Booking & Social Links',
  description:
    'Every Vanzoo link in one place — book a pickup, download the app, find a store, or reach the team.',
  path: '/menu/',
});

type HubLink = { label: string; detail: string; href: string; icon: IconName; external?: boolean };

/**
 * Link hub — the destination behind Vanzoo's social bio links.
 *
 * Deliberately its own layout rather than the standard page shell: someone
 * arriving here has tapped a bio link and wants one destination, so the page is
 * a single column of large targets with no competing navigation.
 */
const PRIMARY: readonly HubLink[] = [
  {
    label: 'Book a Pickup',
    detail: 'Free collection across Delhi, Gurugram and the NCR',
    href: links.bookPickup,
    icon: 'truck',
    external: true,
  },
  {
    label: 'Download the App',
    detail: 'Book, track and manage credits from your phone',
    href: links.playStore,
    icon: 'googlePlay',
    external: true,
  },
  {
    label: 'Members Club',
    detail: 'Prepaid credits with up to 40% off every order',
    href: '/members-club/',
    icon: 'star',
  },
  {
    label: 'View Our Pricing',
    detail: 'Per-item tariffs for every category',
    href: '/couture-care-tariffs/',
    icon: 'search',
  },
  {
    label: 'Visit the Website',
    detail: 'Services, technology and care guides',
    href: '/',
    icon: 'externalLink',
  },
  {
    label: 'Contact Us',
    detail: `${site.phone} · ${site.email}`,
    href: '/contact-us/',
    icon: 'mail',
  },
];

const SOCIAL_ICONS: Record<string, IconName> = {
  Facebook: 'facebook',
  Instagram: 'instagram',
  YouTube: 'youtube',
};

export default function MenuPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <div className="relative isolate overflow-hidden bg-brand-dark pb-section pt-[calc(var(--header-h)+3rem)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.12),transparent)]"
        />

        <div className="shell max-w-xl">
          <div className="hero-stagger text-center" style={{ '--line': 0 } as React.CSSProperties}>
            <Image
              src="/images/brand/vanzoo-logo.png"
              alt="Vanzoo — premium organic dryclean"
              width={2200}
              height={653}
              priority
              sizes="176px"
              className="mx-auto h-11 w-auto brightness-0 invert"
            />
            <h1 className="mt-8 text-display-md text-white">{menuHub.heading}</h1>
            <p className="mt-3 text-lead text-pretty text-white/75">{menuHub.subhead}</p>
          </div>

          <RevealGroup as="ul" step={60} className="mt-10 space-y-3">
            {PRIMARY.map((link) => {
              const content = (
                <>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-white/10 text-xl text-accent-gold"
                  >
                    <Icon name={link.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold text-white">
                      {link.label}
                    </span>
                    <span className="block truncate text-sm text-white/65">{link.detail}</span>
                  </span>
                  <Icon
                    name="arrowRight"
                    className="arrow-nudge text-lg text-white/50"
                  />
                </>
              );

              const className =
                'group flex items-center gap-4 rounded-card border border-white/15 bg-white/[0.06] p-4 transition-colors duration-200 hover:border-accent-gold/50 hover:bg-white/[0.12]';

              return (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link href={link.href} className={className}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </RevealGroup>

          <div className="mt-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              Follow us
            </p>
            <ul className="mt-4 flex items-center justify-center gap-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Vanzoo on ${social.label}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-white/25 text-lg text-white transition-colors duration-200 hover:border-accent-gold hover:text-accent-gold-soft"
                  >
                    <Icon name={SOCIAL_ICONS[social.label] ?? 'externalLink'} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ul className="mt-10 space-y-3">
            {stores.map((store) => (
              <li
                key={store.id}
                className="rounded-card border border-white/12 p-4 text-center"
              >
                <p className="flex items-center justify-center gap-2 font-display text-base font-semibold text-white">
                  <Icon name="mapPin" className="text-accent-gold" />
                  {store.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{store.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-gold-soft transition-colors hover:text-white"
                >
                  <Icon name="navigation" className="text-base" />
                  Get directions
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
