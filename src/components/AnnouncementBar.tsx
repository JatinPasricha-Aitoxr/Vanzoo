'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ANNOUNCE_HEIGHT } from '@/cms/announce';
import type { Announcement } from '@/cms/siteConfig';
import { cn } from '@/lib/cn';

const keyOf = (a: Announcement) => `${a.text}|${a.href}`;

/**
 * Slim site-wide notice above the header. The layout reserves its height with
 * `--announce-h` (so the fixed header and every page's top padding make room);
 * when a visitor dismisses it, or its date window has passed, the variable drops to 0.
 */
export function AnnouncementBar({ a }: { a: Announcement }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const outside = (a.startsAt && now < Date.parse(a.startsAt)) || (a.endsAt && now > Date.parse(a.endsAt));
    let dismissed = false;
    try {
      dismissed = a.dismissible && window.localStorage.getItem('vz-announce') === keyOf(a);
    } catch {
      /* storage blocked */
    }
    if (outside || dismissed) {
      setHidden(true);
      document.documentElement.style.setProperty('--announce-h', '0px');
    }
  }, [a]);

  if (hidden) return null;
  const href = a.href;
  const external = /^https?:/i.test(href);
  const link = a.linkLabel && href ? (
    external ? <a href={href} target="_blank" rel="noopener noreferrer" className="ml-2 font-semibold underline underline-offset-2">{a.linkLabel}</a> : <Link href={href} className="ml-2 font-semibold underline underline-offset-2">{a.linkLabel}</Link>
  ) : null;

  return (
    <div role="region" aria-label="Announcement" className={cn('fixed inset-x-0 top-0 z-[55] flex items-center justify-center px-10 text-center text-sm', a.tone === 'gold' ? 'bg-accent-gold text-brand-ink' : 'bg-brand-ink text-white')} style={{ height: ANNOUNCE_HEIGHT }}>
      <p className="truncate">{a.text}{link}</p>
      {a.dismissible ? (
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            try {
              window.localStorage.setItem('vz-announce', keyOf(a));
            } catch {
              /* storage blocked */
            }
            setHidden(true);
            document.documentElement.style.setProperty('--announce-h', '0px');
          }}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-black/10"
        >
          <span aria-hidden="true">✕</span>
        </button>
      ) : null}
    </div>
  );
}
