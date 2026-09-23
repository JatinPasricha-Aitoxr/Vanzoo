'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Background video for the homepage hero, layered over the hero photo.
 *
 * The photo stays underneath as the LCP element and the fallback: the video
 * only fades in once it is actually playing, so a slow connection shows the
 * photo rather than a black box. Only one file is fetched — the portrait cut
 * below `md`, the landscape cut above it — and nothing loads at all for
 * visitors who ask for reduced motion.
 */
export function HeroVideo({ desktop, mobile }: { desktop: string; mobile: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 768px)');
    const pick = () => {
      if (reduceMotion.matches) {
        setSrc(null);
        return;
      }
      setSrc(wide.matches ? desktop : mobile);
    };
    pick();
    reduceMotion.addEventListener('change', pick);
    wide.addEventListener('change', pick);
    return () => {
      reduceMotion.removeEventListener('change', pick);
      wide.removeEventListener('change', pick);
    };
  }, [desktop, mobile]);

  useEffect(() => {
    setPlaying(false);
    const video = videoRef.current;
    if (!video || !src) return;
    // React sets `muted` as a property but never as the attribute, and some
    // mobile browsers only allow autoplay when the element is muted up front.
    video.muted = true;
    video.defaultMuted = true;
    // Autoplay can still be refused (e.g. iOS Low Power Mode) — the photo
    // simply stays visible.
    video.play().catch(() => {});
  }, [src]);

  if (!src) return null;

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={cn(
        'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out',
        playing ? 'opacity-100' : 'opacity-0',
      )}
    />
  );
}
