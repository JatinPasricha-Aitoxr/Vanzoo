import Image from 'next/image';
import { Icon, type IconName } from './ui/Icon';
import { RevealGroup } from './ui/Reveal';
import { cn } from '@/lib/cn';

export type StripItem = {
  src: string;
  alt: string;
  /** Overlaid label — names what the picture shows, not a link. */
  caption: string;
  icon: IconName;
};

/**
 * Row of captioned images, used to give the tariff pages a visual anchor.
 *
 * They were the only routes on the site with no imagery at all: a page that is
 * nothing but tables gives a reader no sense of what is actually being priced.
 * Each tile carries an icon matching its tariff category, so the strip reads as
 * a key to the tables below rather than as decoration.
 */
export function MediaStrip({
  items,
  className,
}: {
  items: readonly StripItem[];
  className?: string;
}) {
  return (
    <RevealGroup
      as="ul"
      variant="scale"
      step={70}
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4',
        items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.src} className="group relative">
          <div className="media-frame aspect-[4/3]">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="card-media object-cover"
            />
            {/* Scrim only under the caption, so the picture stays legible. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-neutral-ink/80 to-transparent"
            />
            <p className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 text-sm font-semibold text-white sm:p-4">
              <Icon name={item.icon} className="text-base text-accent-gold" />
              {item.caption}
            </p>
          </div>
        </li>
      ))}
    </RevealGroup>
  );
}
