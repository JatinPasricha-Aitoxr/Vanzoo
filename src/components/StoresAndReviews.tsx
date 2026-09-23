import Image from 'next/image';
import { CLIPS_PUBLISHED, reviewClips, storePhotos } from '@/content/socialProof';
import { links, stores } from '@/lib/site';
import { ReviewClipSlider } from './ReviewClipSlider';
import { Section, SectionHeading } from './ui/Section';

/**
 * Site-wide band above the footer: the two stores with their photos, then a
 * slider of customer review thumbnails. Rendered once from the root layout so
 * every page — areas, products, services, blog — carries it without each page
 * having to remember to. Content lives in content/socialProof.ts.
 */
export function StoresAndReviews() {
  return (
    <Section tone="light" aria-labelledby="stories-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="stories-heading"
          eyebrow="Customer stories"
          title="Seen it come back from Vanzoo?"
          intro="Short reviews from customers across Gurgaon — what they sent us, and how it came back."
        />
        <a
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          More on Instagram <span aria-hidden="true">→</span>
        </a>
      </div>

      {!CLIPS_PUBLISHED ? (
        <p className="mt-8 rounded-card border border-dashed border-accent-gold-ink/40 bg-accent-gold/10 px-5 py-4 text-sm text-accent-gold-ink">
          <strong className="font-semibold">Sample content —</strong> these thumbnails are
          placeholders, not real reviews. Add customer clips in{' '}
          <code className="rounded bg-white/60 px-1.5 py-0.5 text-[0.8125rem]">src/content/socialProof.ts</code>{' '}
          and set <code className="rounded bg-white/60 px-1.5 py-0.5 text-[0.8125rem]">CLIPS_PUBLISHED</code> to{' '}
          <code className="rounded bg-white/60 px-1.5 py-0.5 text-[0.8125rem]">true</code> to remove this notice.
        </p>
      ) : null}

      <div className="mt-8">
        <ReviewClipSlider clips={reviewClips} />
      </div>

      <h2 className="mt-16 text-display-sm">Visit our stores</h2>
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
                      src="/images/brand/vanzoo-mark.png"
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
