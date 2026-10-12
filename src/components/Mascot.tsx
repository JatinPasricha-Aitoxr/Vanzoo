import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * The Vanzoo tiger. Decorative by default (empty alt) — it never carries
 * information a screen reader would need. Size it with `className` (width);
 * the source is a 2090×2683 transparent PNG so it stays sharp at any of them.
 */
export function Mascot({
  className,
  sizes = '(min-width: 1024px) 220px, 160px',
  alt = '',
}: {
  className?: string;
  sizes?: string;
  alt?: string;
}) {
  return (
    <Image
      src="/images/mascot/vanzoo-mascot.png"
      alt={alt}
      width={2090}
      height={2683}
      loading="lazy"
      sizes={sizes}
      className={cn('h-auto select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]', className)}
    />
  );
}
