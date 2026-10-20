import Image from 'next/image';
import { appPromo } from '@/content/marketing';
import { Reveal } from './ui/Reveal';
import { links } from '@/lib/site';
import { StoreBadges } from './StoreBadges';

/**
 * App promo band (§3.2.8) — phone mockup, benefit list, QR download card and
 * store badges. Designed for the dark-green band (`Section tone="dark"`), the
 * treatment the old site gives this section: dark field, white type, gold
 * accents, QR card in white so it stays scannable.
 */
export function AppPromo() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal
        variant="scale"
        className="relative mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-[320px]"
      >
        {/* Gold glow behind the phone in place of the old light-teal slab —
            on the dark band it reads as a spotlight rather than a sticker. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-2 bottom-4 top-8 rounded-[48px] bg-accent-gold/20 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-4 bottom-6 top-10 rounded-[40px] border border-accent-gold/30"
        />
        <Image
          src={appPromo.image}
          alt={appPromo.imageAlt}
          width={1172}
          height={2393}
          loading="lazy"
          sizes="(min-width: 1024px) 320px, 280px"
          className="relative h-auto w-full"
        />
      </Reveal>

      <Reveal variant="right" delay={80}>
        <h2 className="text-display-md text-white">{appPromo.heading}</h2>
        <p className="mt-4 text-lead text-pretty text-white/75">{appPromo.body}</p>

        <ul className="mt-8 space-y-3.5">
          {appPromo.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-[0.9375rem] text-white/90">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          {/* QR card stays white — a QR on the dark green would need inverted
              modules and most camera apps cope worse with those. */}
          <a
            href={links.playStore}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Scan or tap to get the Vanzoo app on Google Play"
            className="flex items-center gap-4 rounded-card bg-white p-4 pr-6 transition-transform duration-200 ease-entrance hover:-translate-y-0.5"
          >
            <Image
              src="/images/app-qr-download.png"
              alt=""
              width={1648}
              height={1284}
              loading="lazy"
              sizes="224px"
              className="h-44 w-auto sm:h-56"
            />
            <span className="text-left leading-tight">
              <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-neutral-body">
                Scan to download
              </span>
              <span className="block font-display text-sm font-semibold text-brand-dark">
                Get the Vanzoo app
              </span>
            </span>
          </a>

          <div className="flex flex-col gap-2.5">
            <StoreBadges className="flex-col items-stretch" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-accent-gold/20 text-accent-gold"
    >
      <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3">
        <path
          d="M2.5 7.5 5.5 10.5 11.5 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
