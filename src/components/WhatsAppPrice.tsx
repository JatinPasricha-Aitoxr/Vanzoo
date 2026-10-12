'use client';

import { WhatsAppIcon } from './BookNowButton';
import { useCity } from './CityProvider';
import { cn } from '@/lib/cn';
import { whatsappLink } from '@/lib/site';

/**
 * "Know the actual price" prompt. Every published price is a starting price,
 * so each garment gets a one-tap WhatsApp message naming the item and city.
 */
export function WhatsAppPrice({
  item,
  label = 'Ask the actual price on WhatsApp',
  className,
}: {
  item?: string;
  label?: string;
  className?: string;
}) {
  const { city } = useCity();
  const message = item
    ? `Hi Vanzoo, what is the actual price for ${item} in ${city}?`
    : `Hi Vanzoo, I'd like to know the actual price for my garments in ${city}.`;
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-semibold text-[#128C4A] transition-colors hover:text-[#0b6b38]',
        className,
      )}
    >
      <WhatsAppIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
