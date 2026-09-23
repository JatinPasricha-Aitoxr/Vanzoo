/**
 * The site-wide "Visit us / Customer stories" band above the footer — store
 * photos plus a slider of customer review thumbnails, on every page.
 *
 * ⚠️  THE REVIEW CLIPS BELOW ARE PLACEHOLDERS, NOT REAL REVIEWS.
 *
 * Their thumbnails are the site's existing garment photos, and the names say
 * what belongs in the field. While `CLIPS_PUBLISHED` is false the slider shows
 * a visible "sample content" notice, the same convention as content/reviews.ts.
 *
 * To go live, for each clip:
 *   1. `thumbnail` — a frame from the customer's video (or their photo), saved
 *      in public/images/reviews/.
 *   2. Either `videoSrc` (a short .mp4 in public/videos/, plays in a pop-up on
 *      the site) or `href` (the Instagram reel/post, opens in a new tab).
 *      With neither, the card is shown without a play button.
 *   3. The customer's name, locality and what they sent, as they gave them.
 * Then set `CLIPS_PUBLISHED` to true.
 *
 * Store photos: save them in public/images/stores/ and set `photo` on the
 * matching store below. Until then the card shows a branded panel instead of
 * a stand-in picture, so no other image is ever passed off as the shop.
 */

export type StorePhoto = {
  /** `stores[].id` in lib/site.ts. */
  storeId: 'super-mart-1' | 'vanzoo-urbana';
  photo?: { src: string; alt: string };
};

export type ReviewClip = {
  id: string;
  thumbnail: { src: string; alt: string };
  /** Customer's display name, as they gave it. */
  name: string;
  /** Locality, e.g. "DLF Phase 4". */
  context: string;
  /** What they sent us — a short tag on the card. */
  service: string;
  /** A short self-hosted clip, e.g. /videos/reviews/priya.mp4 — plays in a pop-up. */
  videoSrc?: string;
  /** Instagram reel or post — used when there is no `videoSrc`. */
  href?: string;
};

export const storePhotos: readonly StorePhoto[] = [
  { storeId: 'super-mart-1' },
  { storeId: 'vanzoo-urbana' },
];

/** Flip to true only once every clip below is a real customer's review. */
export const CLIPS_PUBLISHED = false;

export const reviewClips: readonly ReviewClip[] = [
  {
    id: 'clip-1',
    thumbnail: { src: '/images/collage-lehenga-detail.jpg', alt: 'Placeholder — customer review thumbnail' },
    name: 'Customer name',
    context: 'Locality, Gurgaon',
    service: 'Bridal & Ethnic',
  },
  {
    id: 'clip-2',
    thumbnail: { src: '/images/service-bespoke-suit-couture.jpg', alt: 'Placeholder — customer review thumbnail' },
    name: 'Customer name',
    context: 'Locality, Gurgaon',
    service: 'Couture Care',
  },
  {
    id: 'clip-3',
    thumbnail: { src: '/images/service-shoes-bags-accessories.jpg', alt: 'Placeholder — customer review thumbnail' },
    name: 'Customer name',
    context: 'Locality, Gurgaon',
    service: 'Shoe & Bag Care',
  },
  {
    id: 'clip-4',
    thumbnail: { src: '/images/service-curtain-cleaning.jpg', alt: 'Placeholder — customer review thumbnail' },
    name: 'Customer name',
    context: 'Locality, Gurgaon',
    service: 'Curtain Cleaning',
  },
  {
    id: 'clip-5',
    thumbnail: { src: '/images/service-silk-wool-delicates.jpg', alt: 'Placeholder — customer review thumbnail' },
    name: 'Customer name',
    context: 'Locality, Gurgaon',
    service: 'Delicate Fabrics',
  },
  {
    id: 'clip-6',
    thumbnail: { src: '/images/process-delivered-pressed.jpg', alt: 'Placeholder — customer review thumbnail' },
    name: 'Customer name',
    context: 'Locality, Gurgaon',
    service: 'Steam Press',
  },
  {
    id: 'clip-7',
    thumbnail: { src: '/images/collage-family-heirloom.jpg', alt: 'Placeholder — customer review thumbnail' },
    name: 'Customer name',
    context: 'Locality, Gurgaon',
    service: 'Heirloom Care',
  },
  {
    id: 'clip-8',
    thumbnail: { src: '/images/collage-folded-linens.jpg', alt: 'Placeholder — customer review thumbnail' },
    name: 'Customer name',
    context: 'Locality, Gurgaon',
    service: 'Home Textiles',
  },
];
