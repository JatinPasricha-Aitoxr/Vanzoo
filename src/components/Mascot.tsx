import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * The Vanzoo tiger mascot. The artwork is supplied on the brand's dark green,
 * so it is framed as a rounded green tile and works on any background.
 */
export function Mascot({ className, size = 160 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn('inline-block overflow-hidden rounded-2xl bg-[#0e3b25] shadow-lift', className)}
      style={{ width: size }}
    >
      <Image
        src="/images/client/mascot-on-green.png"
        alt="Vanzoo tiger mascot pointing to the offer"
        width={278}
        height={322}
        loading="lazy"
        sizes={`${size}px`}
        className="h-auto w-full"
      />
    </span>
  );
}
