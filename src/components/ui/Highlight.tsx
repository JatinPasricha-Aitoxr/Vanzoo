'use client';

import { useCity } from '../CityProvider';
import { cn } from '@/lib/cn';

/**
 * Brand keywords picked out in headings across the site with a gold
 * highlighter-pen swipe. One list, so every page is formatted the
 * same way and a new keyword is a one-line edit.
 */
const KEYWORDS =
  /(Best & Premium|Vanzoo|Dry ?clean(?:ing|ers?)?|Gurgaon|Premium|Luxury|Hydrocarbon|Fabric Care|Couture|Sustainability|Free Pickup)/gi;

export function Highlight({
  text,
  dark = false,
  className,
  fixedCity = false,
}: {
  text: string;
  dark?: boolean;
  className?: string;
  /** Keep the literal "Gurgaon" — for headings about Gurgaon's own stores and areas. */
  fixedCity?: boolean;
}) {
  const { city } = useCity();
  return (
    <>
      {text.split(KEYWORDS).map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className={cn(
              // Marker-pen look: a gold swipe behind the word. On light
              // backgrounds it covers the lower ~60% of the line (text stays
              // dark); on dark ones it is a solid gold block with dark text.
              'rounded-[0.15em] px-[0.12em] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]',
              dark
                ? 'bg-accent-gold text-brand-ink'
                : 'bg-[linear-gradient(transparent_42%,rgb(255_176_0/0.55)_42%,rgb(255_176_0/0.55)_92%,transparent_92%)] text-inherit',
              className,
            )}
          >
            {!fixedCity && /^gurgaon$/i.test(part) ? city : part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
