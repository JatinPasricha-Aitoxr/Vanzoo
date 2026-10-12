'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Section, SectionHeading } from './ui/Section';
import { galleries } from '@/content/galleries';

/**
 * Photo band at the foot of pages that have a gallery in content/galleries.ts.
 * Rendered once from the root layout, above the reviews. A CSS-columns layout
 * keeps each photo at its own proportions instead of cropping to a grid.
 */
export function PageGallery() {
  const pathname = usePathname() ?? '/';
  const key = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const gallery = galleries[key];
  if (!gallery) return null;

  return (
    <Section tone="surface" aria-labelledby="gallery-heading">
      <SectionHeading
        id="gallery-heading"
        eyebrow={gallery.eyebrow}
        title={gallery.heading}
        intro={gallery.intro}
        align="center"
        className="mx-auto"
      />
      <ul className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {gallery.photos.map((photo) => (
          <li key={photo.src} className="break-inside-avoid overflow-hidden rounded-card border border-neutral-line bg-neutral-muted shadow-lift">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              loading="lazy"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="h-auto w-full"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
