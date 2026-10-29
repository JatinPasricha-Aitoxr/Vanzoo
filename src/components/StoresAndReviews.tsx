import Image from 'next/image';
import Link from 'next/link';
import { storePhotos } from '@/content/socialProof';
import { ReviewThumbs } from './ReviewThumbs';
import { stores, brand } from '@/lib/site';
import { Section, SectionHeading } from './ui/Section';

/**
 * Site-wide band above the footer: a slider of customer review thumbnails,
 * then the two stores with their photos. The slider is omitted from the live
 * site until real clips are added (see `SHOW_CLIPS`). Rendered once from the
 * root layout so every page — areas, products, services, blog — carries it
 * without each page having to remember to. Content lives in
 * content/socialProof.ts.
 */
export function StoresAndReviews() {
  return (
    <Section tone="light" aria-labelledby="stories-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="stories-heading"
          eyebrow="Customer stories"
          title="Seen it come back from Vanzoo?"
          intro="Real words from customers across Gurgaon — what they sent us, and how it came back."
        />
        <Link
          href="/customer-stories/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          Read customer stories <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-8">
        <ReviewThumbs />
      </div>

      <h2 id="stores-heading" className="mt-16 text-display-sm">
        Visit our stores
      </h2>
      <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
        {storePhotos.map(({ storeId, photo }) => {
          const store = stores.find((s) => s.id === storeId);
          if (!store) return null;
          return (
            <li
              key={store.id}
              className="grid min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-card border border-neutral-line bg-white sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            >
              <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[13rem]">
                {photo ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 768px) 22vw, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="band-dark absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <Image
                      src={brand.mark}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 object-contain"
                    />
                    <p className="font-display text-base font-semibold text-white">{store.name}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col p-5 sm:p-6">
                <p className="font-display text-lg font-semibold text-neutral-ink">{store.name}</p>
                <p className="eyebrow mt-1">{store.locality}</p>
                <address className="mt-2 flex-1 not-italic text-sm leading-relaxed text-neutral-body">
                  {store.address}
                </address>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Get directions <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
