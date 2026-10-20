'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { pageVideos } from '@/content/pageVideos';
import { cn } from '@/lib/cn';

/**
 * Bottom-right corner player. A small muted loop previews the page's clip;
 * tapping it opens the clip fullscreen with sound and controls. Dismissing the
 * preview (×) hides it for the rest of the visit.
 */
export function PageVideo() {
  const pathname = usePathname() ?? '/';
  const key = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const clip = pageVideos[key];

  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem('vz-video-dismissed') === '1');
    } catch {
      /* storage unavailable — keep showing it */
    }
  }, []);

  // Close on route change.
  useEffect(() => setOpen(false), [key]);

  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = 'hidden';
    // Called from the click that opened the dialog, so the browser allows it.
    stageRef.current?.requestFullscreen?.().catch(() => {});
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [open]);

  if (!clip) return null;

  return (
    <>
      {!dismissed ? (
        <div className="fixed bottom-24 right-4 z-30 sm:bottom-28 sm:right-6 print:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`${clip.label} — open video with sound`}
            className={cn(
              'group relative block overflow-hidden rounded-card border-2 border-accent-gold bg-brand-ink shadow-lift-hover transition-transform duration-200 ease-entrance hover:-translate-y-0.5',
              clip.portrait ? 'aspect-[9/16] w-24 sm:w-28' : 'aspect-video w-36 sm:w-48',
            )}
          >
            <video
              key={clip.src}
              src={clip.src}
              poster={clip.poster}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-5 text-[0.6875rem] font-semibold leading-tight text-white">
              <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M4 2.5v11l9-5.5-9-5.5z" />
              </svg>
              {clip.label}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              try {
                sessionStorage.setItem('vz-video-dismissed', '1');
              } catch {
                /* ignore */
              }
            }}
            aria-label="Hide video"
            className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-ink shadow-lift"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
            </svg>
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          ref={stageRef}
          role="dialog"
          aria-modal="true"
          aria-label={clip.label}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <video
            src={clip.src}
            poster={clip.poster}
            controls
            autoPlay
            playsInline
            className="max-h-full max-w-full"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close video"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-ink shadow-lift"
          >
            <svg viewBox="0 0 12 12" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
}
