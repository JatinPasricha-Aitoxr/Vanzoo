'use client';

import { useEffect, useRef, useState } from 'react';
import { links, site, socialLinks } from '@/lib/site';
import { cn } from '@/lib/cn';

/**
 * Fixed contact + social tile.
 *
 * Pinned to the right edge from `sm` up and collapsed behind a single trigger
 * below it, where the viewport cannot spare a permanent rail and the pinned
 * "Book Pickup" bar already owns the bottom of the screen. Every entry is a
 * plain anchor, so long-press, middle-click and "copy link" all behave.
 */
export function ContactRail() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Tapping away closes the mobile sheet; without this it stays open over the
  // page and swallows the next tap.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const contactActions = [
    {
      label: `Call ${site.phone}`,
      short: 'Call',
      href: `tel:${site.phoneHref}`,
      external: false,
      icon: <PhoneIcon />,
    },
    {
      label: 'Chat on WhatsApp',
      short: 'WhatsApp',
      href: links.whatsapp,
      external: true,
      icon: <WhatsAppIcon />,
    },
    {
      label: `Email ${site.email}`,
      short: 'Email',
      href: `mailto:${site.email}`,
      external: false,
      icon: <MailIcon />,
    },
  ];

  return (
    <div
      ref={rootRef}
      // Below the mobile "Book Pickup" bar in the stack but above page content.
      className="fixed right-0 top-1/2 z-40 -translate-y-1/2 print:hidden"
    >
      {/* ≥sm — always-visible rail. */}
      <div className="hidden sm:block">
        <RailCard>
          {contactActions.map((action) => (
            <RailLink key={action.short} {...action} />
          ))}
          <span aria-hidden="true" className="mx-2 my-1 block h-px bg-white/20" />
          {socialLinks.map((social) => (
            <RailLink
              key={social.label}
              label={`Vanzoo on ${social.label}`}
              short={social.label}
              href={social.href}
              external
              icon={<SocialIcon name={social.label} />}
            />
          ))}
        </RailCard>
      </div>

      {/* <sm — collapsed behind one trigger, sitting clear of the pinned
          "Book Pickup" bar. */}
      <div className="sm:hidden">
        {/* Toggled with a display utility, not the `hidden` attribute: any
            author-set `display` beats the UA stylesheet's `[hidden]` rule, so
            `hidden` plus `flex` would leave the sheet permanently open. */}
        <div
          id="contact-rail-sheet"
          className={cn('absolute bottom-0 right-14 flex-col gap-2', open ? 'flex' : 'hidden')}
        >
          {[...contactActions, ...socialLinks.map((social) => ({
            label: `Vanzoo on ${social.label}`,
            short: social.label,
            href: social.href,
            external: true,
            icon: <SocialIcon name={social.label} />,
          }))].map((action) => (
            <a
              key={action.short}
              href={action.href}
              {...(action.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-brand-ink px-3.5 py-2 text-xs font-semibold text-white shadow-lift"
            >
              <span className="text-accent-gold">{action.icon}</span>
              {action.short}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="contact-rail-sheet"
          className="inline-flex h-12 w-12 items-center justify-center rounded-l-card bg-brand-ink text-white shadow-lift"
        >
          <span className="sr-only">{open ? 'Hide contact options' : 'Show contact options'}</span>
          <span className={cn('transition-transform duration-200', open && 'rotate-45')}>
            {open ? <PlusIcon /> : <PhoneIcon />}
          </span>
        </button>
      </div>
    </div>
  );
}

function RailCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-l-card bg-brand-ink py-2 shadow-lift-hover">
      {children}
    </div>
  );
}

/**
 * One rail entry. The label slides out from behind the icon on hover and focus,
 * so the collapsed rail stays narrow but never relies on an icon alone to say
 * what it does.
 */
function RailLink({
  label,
  short,
  href,
  external,
  icon,
}: {
  label: string;
  short: string;
  href: string;
  external: boolean;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group/rail relative flex h-11 w-11 items-center justify-center text-white/85 transition-colors hover:text-accent-gold focus-visible:text-accent-gold"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">{icon}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-1 origin-right scale-x-0 whitespace-nowrap rounded-l-pill bg-brand-ink py-2 pl-3.5 pr-2 text-xs font-semibold text-white opacity-0 transition-[transform,opacity] duration-200 ease-entrance group-hover/rail:scale-x-100 group-hover/rail:opacity-100 group-focus-visible/rail:scale-x-100 group-focus-visible/rail:opacity-100"
      >
        {short}
      </span>
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-[18px] w-[18px]">
      <path d="M6.6 2.4a1.4 1.4 0 0 0-1.8-.3L3.2 3.2A2.4 2.4 0 0 0 2.3 6c.7 2.6 2.1 5 4 6.9 1.9 1.9 4.3 3.3 6.9 4a2.4 2.4 0 0 0 2.6-.9l1.1-1.6a1.4 1.4 0 0 0-.3-1.8l-2-1.6a1.4 1.4 0 0 0-1.7 0l-.9.7a.5.5 0 0 1-.6 0 12 12 0 0 1-3.7-3.7.5.5 0 0 1 0-.6l.7-.9a1.4 1.4 0 0 0 0-1.7l-1.8-2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[18px] w-[18px]">
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2.1 22l5.36-1.4a9.8 9.8 0 0 0 4.58 1.16h.01c5.43 0 9.84-4.4 9.84-9.84A9.78 9.78 0 0 0 12.04 2zm0 17.9h-.01a8.2 8.2 0 0 1-4.15-1.13l-.3-.18-3.08.8.82-3-.19-.31a8.13 8.13 0 0 1-1.25-4.34c0-4.5 3.67-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.4a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.67 8.16-8.17 8.16zm4.48-6.1c-.24-.13-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12s-.63.8-.77.96c-.14.17-.28.19-.52.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.7c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.47-.4-.4-.55-.41h-.47c-.16 0-.43.06-.65.3-.22.25-.85.84-.85 2.04s.87 2.37.99 2.53c.12.17 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.45-.6 1.65-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.46-.29z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
      <rect
        x="2.5"
        y="4"
        width="15"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m3 5.5 7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = {
    className: 'h-[18px] w-[18px]',
    fill: 'currentColor',
    'aria-hidden': true,
  } as const;
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
