import Image from 'next/image';
import { AutoScrollRow } from './AutoScrollRow';

const COUNT = 18;

/** Customer review cards, auto-scrolling one per second. Shown on every page. */
export function ReviewThumbs() {
  return (
    <AutoScrollRow
      interval={1000}
      label="customer review"
      className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <li
          key={i}
          className="w-[19rem] shrink-0 snap-start overflow-hidden rounded-card border border-neutral-line bg-white shadow-lift sm:w-[24rem]"
        >
          <Image
            src={`/images/reviews/review-${String(i + 1).padStart(2, '0')}.jpg`}
            alt={`Vanzoo customer review ${i + 1} of ${COUNT}`}
            width={1100}
            height={733}
            loading="lazy"
            sizes="(min-width: 640px) 24rem, 19rem"
            className="h-auto w-full"
          />
        </li>
      ))}
    </AutoScrollRow>
  );
}
