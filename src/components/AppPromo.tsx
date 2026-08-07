import Image from 'next/image';
import { appPromo } from '@/content/marketing';
import { Icon } from './ui/Icon';
import { Reveal } from './ui/Reveal';
import { links } from '@/lib/site';

/** App promo band (§3.2.8) — phone mockup, benefit list, store badges. */
export function AppPromo() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal
        variant="scale"
        className="relative mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-[320px]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-4 bottom-6 top-10 rounded-[40px] bg-brand-light"
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
        <h2 className="text-display-md">{appPromo.heading}</h2>
        <p className="mt-4 text-lead text-pretty text-neutral-body">{appPromo.body}</p>

        <ul className="mt-8 space-y-3.5">
          {appPromo.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-[0.9375rem] text-neutral-ink">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={links.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-card bg-neutral-ink px-5 py-3 text-white transition-colors hover:bg-brand-dark"
          >
            <Icon name="googlePlay" className="text-2xl" />
            <span className="text-left leading-tight">
              <span className="block text-[0.625rem] uppercase tracking-wide text-white/65">
                Get it on
              </span>
              <span className="block text-sm font-semibold">Google Play</span>
            </span>
          </a>
          <span className="inline-flex items-center gap-2 rounded-pill border border-neutral-line px-4 py-2.5 text-xs font-medium text-neutral-body">
            <Icon name="apple" className="text-base" />
            iOS — coming soon
          </span>
        </div>

        {/* Scan-to-install card. Pointless on the phone the app would install
            on, so it only appears from lg up. */}
        <div className="mt-8 hidden items-center gap-4 rounded-card border border-neutral-line bg-white p-4 lg:inline-flex">
          <Image
            src="/images/app-qr-download.png"
            alt="QR code linking to the Vanzoo app on the Google Play Store"
            width={1648}
            height={1284}
            loading="lazy"
            sizes="112px"
            className="h-auto w-28"
          />
          <p className="max-w-[14rem] text-sm leading-relaxed text-neutral-body">
            <span className="block font-semibold text-neutral-ink">Scan to install</span>
            Point your camera at the code to get the app on your phone.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-brand-light text-[0.7rem] text-brand"
    >
      <Icon name="check" strokeWidth={2.2} />
    </span>
  );
}
