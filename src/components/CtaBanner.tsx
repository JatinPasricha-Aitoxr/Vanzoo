import Link from 'next/link';
import { Mascot } from './Mascot';
import { Reveal } from './ui/Reveal';
import { links } from '@/lib/site';

/**
 * Closing CTA band, reused on About, the tariff pages, Hydrocarbon Tech and
 * inside long blog articles.
 */
export function CtaBanner({
  heading = 'Ready to hand over the fabric care?',
  body = 'Free pickup and delivery across Gurgaon. Standard turnaround is 3-5 days, with same-day and next-day express options.',
  secondary,
}: {
  heading?: string;
  body?: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <Reveal
      variant="scale"
      className="band-dark relative overflow-hidden rounded-media px-6 py-12 text-center sm:px-12 sm:py-16"
    >
      <Mascot
        className="pointer-events-none absolute -bottom-2 right-6 hidden w-36 xl:block 2xl:w-44"
        sizes="176px"
      />
      <h2 className="mx-auto max-w-2xl text-display-md text-white">{heading}</h2>
      <p className="mx-auto mt-4 max-w-xl text-lead text-pretty text-white/75">{body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={links.bookPickup}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-inverse btn-lg"
        >
          Book Pickup
        </a>
        {secondary ? (
          <Link href={secondary.href} className="btn-onDark btn-lg">
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}
