import { links } from '@/lib/site';

/**
 * Floating "Book Now" launcher, bottom-right on sm+ so the right edge carries
 * both it and the contact rail (which holds WhatsApp). Below `sm` the pinned
 * full-width "Book Now" bar in the header owns that job, so this hides there.
 */
export function BookNowButton() {
  return (
    <a
      href={links.bookPickup}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-gold btn-md fixed bottom-6 right-6 z-30 hidden shadow-lift-hover sm:inline-flex print:hidden"
    >
      Book Now
    </a>
  );
}
