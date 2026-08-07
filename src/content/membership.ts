import type { IconName } from '@/components/ui/Icon';

/**
 * Members Club, transcribed verbatim from vanzoo.in/members-club.
 *
 * This page carries claims that appear nowhere else on the site — "European
 * Hydrocarbon Technology", "German Organic Chemicals Only" — which are more
 * specific than the homepage's "Italian hydrocarbon technology". Both are
 * reproduced as written rather than reconciled; if one is out of date, it is a
 * copy decision for Vanzoo, not something to silently harmonise here.
 */

export const membership = {
  eyebrow: 'Members Club',
  headline: ["We Don't Just Clean,", 'WE CARE.'],
  subhead:
    'From everyday wear to luxury essentials, we clean, protect and preserve what matters to you.',
  image: '/images/persona-hospitality-guests.jpg',
  imageAlt:
    'Luxury garments prepared for a Vanzoo Members Club customer at the Gurgaon atelier',
} as const;

export type MembershipTier = {
  name: string;
  credits: string;
  discount: string;
  validity: string;
  /** Marked on the tier the page presents as the step up to unlimited validity. */
  featured?: boolean;
};

export const membershipTiers: readonly MembershipTier[] = [
  { name: 'Smart Saver', credits: '₹5,000', discount: '10% OFF', validity: '3 Months' },
  { name: 'Privilege', credits: '₹10,000', discount: '20% OFF', validity: '6 Months' },
  { name: 'Signature', credits: '₹20,000', discount: '25% OFF', validity: '1 Year' },
  {
    name: 'Pinnacle',
    credits: '₹35,000',
    discount: '30% OFF',
    validity: 'Unlimited',
    featured: true,
  },
  { name: 'Prestige', credits: '₹50,000', discount: '35% OFF', validity: 'Unlimited' },
  { name: 'Elite', credits: '₹75,000', discount: '40% OFF', validity: 'Unlimited' },
];

export const membershipServices = [
  {
    title: 'Premium & Luxury Garment Care',
    body: 'Suits, Sarees, Lehengas, Shirts, Dresses & more',
    icon: 'shirt' as IconName,
  },
  {
    title: 'Shoe & Bag Care',
    body: 'Sneakers, Heels, Leather Bags & more',
    icon: 'bag' as IconName,
  },
  {
    title: 'Curtains & Carpets Care',
    body: 'Curtains, Upholstery, Carpets & Rugs',
    icon: 'bed' as IconName,
  },
  {
    title: 'Household Items Care',
    body: 'Cushions, Comforters, Blankets, Quilts & more',
    icon: 'sparkles' as IconName,
  },
] as const;

export const membershipReasons = [
  { label: 'European Hydrocarbon Technology', icon: 'cpu' as IconName },
  { label: 'German Organic Chemicals Only', icon: 'flaskOff' as IconName },
  { label: 'Trained Experts', icon: 'award' as IconName },
  { label: 'Free Pickup & Delivery', icon: 'truck' as IconName },
  { label: 'Safe for You & Your Family', icon: 'shieldCheck' as IconName },
] as const;

export const membershipApp = {
  heading: 'Download the Vanzoo App',
  body: 'Easy credits & order tracking. Track your orders, manage credits and enjoy seamless experience — all in one app.',
} as const;
