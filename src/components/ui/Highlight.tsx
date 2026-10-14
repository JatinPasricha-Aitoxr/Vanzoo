'use client';

import { useCity } from '../CityProvider';
import { cn } from '@/lib/cn';

/**
 * Brand keywords picked out in headings across the site in the bright, shimmering
 * gold of the Vanzoo logo (see .gold-shine in globals.css). One list, so every page is formatted the
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
          <span key={i} className={cn(dark ? 'gold-shine gold-shine-dark' : 'gold-shine', className)}>
            {!fixedCity && /^gurgaon$/i.test(part) ? city : part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
