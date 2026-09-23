'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { ReviewClip } from '@/content/socialProof';

/**
 * Horizontal slider of customer review thumbnails. Native scroll-snap does the
 * sliding (swipe on mobile, arrows or trackpad on desktop); the arrow buttons
 * scroll by one card. No autoplay — moving content the visitor didn't ask for
 * is an accessibility failure and nobody reads a card that slides away.
 *
 * A clip with `videoSrc` opens in a pop-up player; one with `href` links out
 * (Instagram); one with neither renders as a plain card.
 */
export function ReviewClipSlider({ clips }: { clips: readonly ReviewClip[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [playing, setPlaying] = useState<ReviewClip | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({
        start: track.scrollLeft <= 4,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
      });
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (playing && !dialog.open) dialog.showModal();
    if (!playing && dialog.open) dialog.close();
  }, [playing]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector('li');
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16), behavior: 'smooth' });
  };

  return (
    <div>
      <div className="relative">
        <ul
          ref={trackRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
          aria-label="Customer review videos"
        >
          {clips.map((clip) => (
            <li key={clip.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%] xl:w-[18.5%]">
              <ClipCard clip={clip} onPlay={() => setPlaying(clip)} />
            </li>
          ))}
        </ul>

        <SliderArrow direction={-1} disabled={edges.start} onClick={() => scrollByCard(-1)} />
        <SliderArrow direction={1} disabled={edges.end} onClick={() => scrollByCard(1)} />
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setPlaying(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPlaying(null);
        }}
        className="w-[min(92vw,26rem)] overflow-hidden rounded-media bg-black p-0 backdrop:bg-black/70"
        aria-label={playing ? `Review from ${playing.name}` : 'Customer review'}
      >
        {playing?.videoSrc ? (
          <div className="relative">
            <video
              key={playing.videoSrc}
              src={playing.videoSrc}
              poster={playing.thumbnail.src}
              controls
              autoPlay
              playsInline
              className="aspect-[9/16] w-full bg-black object-contain"
            />
            <button
              type="button"
              onClick={() => setPlaying(null)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-pill bg-white/90 text-neutral-ink"
              aria-label="Close video"
            >
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}

function ClipCard({ clip, onPlay }: { clip: ReviewClip; onPlay: () => void }) {
  const body = (
    <>
      <div className="media-frame aspect-[4/5] rounded-card">
        <Image
          src={clip.thumbnail.src}
          alt={clip.thumbnail.alt}
          fill
          loading="lazy"
          sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
          className="card-media object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {clip.videoSrc || clip.href ? (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-white/90 text-brand shadow-lift transition-transform duration-200 group-hover:scale-110"
          >
            <svg viewBox="0 0 16 16" className="ml-0.5 h-4 w-4" fill="currentColor">
              <path d="M4 2.5v11l9-5.5-9-5.5z" />
            </svg>
          </span>
        ) : null}
        <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-brand">
          {clip.service}
        </span>
        <span className="absolute inset-x-3 bottom-3 text-left">
          <span className="block font-display text-sm font-semibold text-white">{clip.name}</span>
          <span className="block text-xs text-white/80">{clip.context}</span>
        </span>
      </div>
    </>
  );

  const className = 'group block w-full rounded-card focus-visible:outline-offset-4';

  if (clip.videoSrc) {
    return (
      <button type="button" onClick={onPlay} className={className} aria-label={`Play review from ${clip.name}`}>
        {body}
      </button>
    );
  }
  if (clip.href) {
    return (
      <a
        href={clip.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`Watch review from ${clip.name} on Instagram`}
      >
        {body}
      </a>
    );
  }
  return <div className={className}>{body}</div>;
}

function SliderArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 1 | -1;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 1 ? 'Next reviews' : 'Previous reviews'}
      className={`absolute top-[40%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill border border-neutral-line bg-white text-brand shadow-lift transition-opacity hover:border-brand/40 disabled:pointer-events-none disabled:opacity-0 sm:flex ${
        direction === 1 ? '-right-4 lg:-right-5' : '-left-4 lg:-left-5'
      }`}
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d={direction === 1 ? 'M6 3l5 5-5 5' : 'M10 3 5 8l5 5'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
