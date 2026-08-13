/**
 * Customer reviews shown on the homepage.
 *
 * ⚠️  EVERY ENTRY BELOW IS A PLACEHOLDER, NOT A REAL REVIEW.
 *
 * Vanzoo publishes no testimonials anywhere, so nothing here was written by a
 * customer and nothing here may ship as though it was. The strings say what
 * belongs in each field rather than pretending to be praise, so an unfinished
 * deploy reads as an unfinished deploy instead of as invented social proof.
 *
 * To go live:
 *   1. Replace each entry with the customer's own words, verbatim.
 *   2. Set `PUBLISHED` to true. While it is false the homepage section renders
 *      with a visible "sample content" notice so nobody mistakes it for real.
 *   3. Once real ratings are on the page, `aggregateRating` becomes eligible for
 *      the LocalBusiness JSON-LD in src/lib/seo.ts — Google requires the rating
 *      to reflect reviews genuinely displayed, so add it then and not before.
 *
 * See README "Reviews".
 */

export type Review = {
  /** The review in the customer's own words. */
  quote: string;
  /** Display name, as the customer gave it. */
  author: string;
  /** Locality or context, e.g. "DLF Phase 4" or "Sector 67". */
  context: string;
  /** Whole stars, 1–5. */
  rating: number;
  /** What they sent us — shown as a small tag on the card. */
  service: string;
};

/** Flip to true only once every entry below is a real, attributable review. */
export const PUBLISHED = false;

export const reviewsIntro =
  'What Gurgaon says about handing us their wardrobe.';

export const reviews: readonly Review[] = [
  {
    quote:
      'Paste a real customer review here. Two or three sentences reads best — what they sent in, what they were worried about, and how it came back.',
    author: 'Customer name',
    context: 'Locality, Gurgaon',
    rating: 5,
    service: 'Couture Care',
  },
  {
    quote:
      'Paste a real customer review here. Reviews that name a specific garment — a lehenga, a suit, a leather bag — are far more persuasive than general praise.',
    author: 'Customer name',
    context: 'Locality, Gurgaon',
    rating: 5,
    service: 'Bridal & Ethnic',
  },
  {
    quote:
      'Paste a real customer review here. If the customer mentioned the pickup and delivery or the turnaround, keep that in — it is what most first-time visitors are checking for.',
    author: 'Customer name',
    context: 'Locality, Gurgaon',
    rating: 5,
    service: 'Pickup & Delivery',
  },
  {
    quote:
      'Paste a real customer review here. Google reviews can be quoted verbatim with the reviewer’s display name; do not paraphrase or tidy up their wording.',
    author: 'Customer name',
    context: 'Locality, Gurgaon',
    rating: 5,
    service: 'Leather & Shoes',
  },
];
