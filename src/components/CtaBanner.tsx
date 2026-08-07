import Link from 'next/link';
import { Reveal } from './ui/Reveal';
import { links } from '@/lib/site';

/**
 * Closing CTA band, reused on About, the tariff pages, Hydrocarbon Tech and
 * inside long blog articles.
 */
export function CtaBanner({
  heading = 'Ready to hand over the fabric care?',
  body = 'Free pickup and delivery across Delhi, Gurugram and the NCR. Standard turnaround is 5-7 days, with same-day and 2-4 hour express options.',
  secondary,
}: {
  heading?: string;
  body?: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <Reveal
      variant="scale"
      className="overflow-hidden rounded-media bg-brand-dark px-6 py-12 text-center sm:px-12 sm:py-16"
    >
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
