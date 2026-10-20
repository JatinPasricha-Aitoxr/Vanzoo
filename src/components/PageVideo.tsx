'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/** Maps a route to the video key in /public/videos (see lib/videos.ts). */
function videoKey(pathname: string): string {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return 'home';
  const [section, slug] = path.split('/').filter(Boolean);
  if (section === 'services') return slug ?? 'services';
  if (section === 'areas-we-serve') return 'areas';
  if (section === 'hydrocarbon-tech') return 'hydrocarbon';
  if (section === 'about-us') return 'about';
  if (section === 'contact-us') return 'contact';
  return section;
}

/**
 * Floating video preview, bottom-right. A small muted looping thumbnail that
 * opens full-screen on click and plays from the start with sound. Falls back to
 * the `home` video on pages that have no video of their own.
 */
export function PageVideo({ available }: { available: string[] }) {
  const pathname = usePathname();
  const key = videoKey(pathname);
  const resolved = available.includes(key) ? key : available.includes('home') ? 'home' : null;
  const src = resolved ? `/videos/${resolved}.mp4` : null;

  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);

  // A fresh page gets a fresh preview even if the last one was closed.
  useEffect(() => {
    setDismissed(false);
    setOpen(false);
  }, [src]);

  const close = useCallback(() => {
    setOpen(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    // Leaving browser fullscreen (Esc, swipe) also closes the player.
    const onFs = () => !document.fullscreenElement && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // The click that opened the player is the user gesture that allows
    // fullscreen and audio. Restart from 0 and play with sound.
    stageRef.current?.requestFullscreen?.().catch(() => {});
    const video = fullRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(() => {
        // Sound blocked — fall back to muted autoplay rather than a dead player.
        video.muted = true;
        video.play().catch(() => {});
      });
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFs);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  if (!src || dismissed) return null;

  return (
    <>
      {!open ? (
        <div className="relative w-24 sm:w-28 lg:w-32">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Watch the Vanzoo video full screen"
            className="group relative block aspect-[9/16] w-full overflow-hidden rounded-card border-2 border-accent-gold bg-brand-ink shadow-lift-hover transition-transform duration-200 hover:-translate-y-0.5"
          >
            <video
              key={src}
              src={src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-brand-ink/70 via-transparent to-transparent pb-2">
              <span className="rounded-pill bg-white/90 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wide text-brand-ink">
                Watch
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Close video preview"
            className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-pill bg-brand-ink text-xs text-white shadow-lift"
          >
            ×
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          ref={stageRef}
          role="dialog"
          aria-modal="true"
          aria-label="Vanzoo video"
          className={cn('fixed inset-0 z-[70] flex items-center justify-center bg-black')}
        >
          <video
            ref={fullRef}
            src={src}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain"
          />
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-pill bg-white/90 text-xl text-brand-ink shadow-lift"
            aria-label="Close video"
          >
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
