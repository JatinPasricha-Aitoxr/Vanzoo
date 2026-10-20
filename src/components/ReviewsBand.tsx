'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Reviews } from './Reviews';
import { Section, SectionHeading } from './ui/Section';
import { SHOW_REVIEWS, reviews, reviewsIntro } from '@/content/reviews';

/**
 * Customer reviews, carried at the bottom of every page (rendered once from
 * the root layout). Skipped on /reviews/ itself, which already lists them all.
 */
export function ReviewsBand() {
  const pathname = usePathname() ?? '';
  if (!SHOW_REVIEWS || pathname.startsWith('/reviews')) return null;

  return (
    <Section tone="muted" aria-labelledby="reviews-heading">
      <SectionHeading
        id="reviews-heading"
        eyebrow="Customer reviews"
        title="Trusted with Gurgaon's best-loved wardrobes"
        intro={reviewsIntro}
        align="center"
        className="mx-auto"
      />
      <div className="mt-12">
        <Reviews />
      </div>
      <p className="mt-10 text-center">
        <Link href="/reviews/" className="btn-secondary btn-lg">
          Read all {reviews.length} reviews
        </Link>
      </p>
    </Section>
  );
}
