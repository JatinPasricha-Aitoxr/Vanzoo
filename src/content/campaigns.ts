import type { IconName } from '@/components/ui/Icon';

/**
 * Campaign landing pages.
 *
 * On the live site these are fifteen near-identical pages: one headline each,
 * then the same offer, benefit list, services, process and FAQ underneath. They
 * exist as ad destinations, so each one keeps its own URL and its own <title>
 * — but the shared body is rendered from one template rather than duplicated
 * fifteen times.
 *
 * Headlines and titles are exactly as published. The `image` and `icon` on each
 * entry are chosen here so a campaign about shoes doesn't open on a photograph
 * of curtains; nothing else about the page varies.
 */

export type Campaign = {
  slug: string;
  /** The live page's <title>, minus the " - vanzoo.in" suffix. */
  headline: string;
  /** One-line support under the headline, written to match the hook. */
  subhead: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: IconName;
};

export const campaignOffer = 'Get Flat 25% OFF on first Order';

export const campaignBenefits = [
  { label: 'Expert Care for Luxury Garments', icon: 'award' as IconName },
  { label: 'Advanced Hydrocarbon Technology', icon: 'cpu' as IconName },
  { label: 'Convenient & Time-Saving', icon: 'truck' as IconName },
  { label: 'Sustainability at Core', icon: 'leaf' as IconName },
] as const;

export const campaignPricingCta = {
  heading: 'Curious About the Cost?',
  body: 'View Our Laundry Pricing Instantly.',
} as const;

export const campaigns: readonly Campaign[] = [
  {
    slug: 'get-your-clothes-back-in-5-7-days',
    headline: 'Get Your Clothes Back in 5-7 Days',
    subhead:
      'Standard turnaround is 5-7 days, with same-day and 2-4 hour express options when you need them sooner.',
    description:
      'Vanzoo returns your garments in 5-7 days, with same-day and 2-4 hour express options. Free pickup and delivery across Delhi, Gurugram and the NCR.',
    image: '/images/process-delivered-pressed.jpg',
    imageAlt: 'Knitwear pressed and finished, ready for Vanzoo doorstep delivery in Gurgaon',
    icon: 'clock',
  },
  {
    slug: 'technology-built-for-your-skin',
    headline: 'Technology Built for Your Skin',
    subhead:
      'Hydrocarbon solvents leave no harsh residue, so what touches your skin is fabric — not chemistry.',
    description:
      'Vanzoo uses skin-friendly hydrocarbon dry cleaning that removes 99% of chemicals from fabric, for a safer finish on every wear.',
    image: '/images/service-hydrocarbon-machine.jpg',
    imageAlt:
      'Control panel of the closed-loop hydrocarbon dry cleaning system used by Vanzoo',
    icon: 'shieldCheck',
  },
  {
    slug: 'we-use-0-chemicals',
    headline: 'We Use 0 Chemicals',
    subhead:
      'No PERC, no petrol, no thinner. Hydrocarbon extracts remove 99% of chemicals from the fabric.',
    description:
      'Vanzoo cleans without PERC, petrol or thinner — hydrocarbon technology removes 99% of chemicals from your fabric. Eco-friendly dry cleaning in Gurgaon.',
    image: '/images/tech-hydrocarbon-plant.jpg',
    imageAlt: 'Hydrocarbon dry cleaning plant used by Vanzoo in place of PERC-based systems',
    icon: 'flaskOff',
  },
  {
    slug: 'cleaned-with-hydrocarbon-tech',
    headline: 'Cleaned With Hydrocarbon Tech',
    subhead:
      'Closed-loop machines dissolve stains without water and recycle 99% of the solvent every cycle.',
    description:
      'Every Vanzoo order is cleaned in a closed-loop hydrocarbon system that recycles 99% of its solvent — gentle on fabric, safer for the planet.',
    image: '/images/service-hydrocarbon-machine.jpg',
    imageAlt: 'Closed-loop hydrocarbon dry cleaning machine mid-cycle at the Vanzoo facility',
    icon: 'cpu',
  },
  {
    slug: 'luxury-shoes-cleaned-right',
    headline: 'Luxury Shoes Cleaned Right',
    subhead:
      'Leather, suede and sneakers cleaned, conditioned and revived by hand — never machine-scrubbed.',
    description:
      'Vanzoo cleans and conditions luxury leather, suede and sneakers by hand. Expert shoe care with free pickup and delivery in Gurgaon.',
    image: '/images/service-shoes-bags-accessories.jpg',
    imageAlt: 'Leather brogues and handbag cleaned and conditioned by Vanzoo accessory care',
    icon: 'shoe',
  },
  {
    slug: 'festival-ready-in-every-stitch',
    headline: 'Festival Ready in Every Stitch',
    subhead:
      'Sarees, sherwanis and lehengas cleaned and hand-finished in time for the occasion.',
    description:
      'Get festival-ready with Vanzoo — sarees, sherwanis and lehengas cleaned with hydrocarbon technology and hand-finished in Gurgaon.',
    image: '/images/persona-heirlooms.jpg',
    imageAlt: 'Silk sarees cleaned and hand-finished by Vanzoo ahead of a festival',
    icon: 'sparkles',
  },
  {
    slug: 'big-event-prep-your-lehenga',
    headline: 'Big Event? Prep Your Lehenga',
    subhead:
      'Zari, sequins and hand embroidery treated piece by piece, so the work survives the clean.',
    description:
      'Vanzoo cleans bridal and occasion lehengas without damaging zari, sequins or hand embroidery. Museum-grade garment care in Gurgaon.',
    image: '/images/collage-lehenga-detail.jpg',
    imageAlt: 'Bridal lehenga embroidery being cleaned by hand at Vanzoo',
    icon: 'dress',
  },
  {
    slug: 'give-your-bag-its-glow-back',
    headline: 'Give Your Bag Its Glow Back',
    subhead: 'Designer leather cleaned, conditioned and reshaped by trained artisans.',
    description:
      'Vanzoo restores designer handbags — cleaned, conditioned and reshaped by trained artisans, with free pickup and delivery in Gurgaon.',
    image: '/images/service-shoes-bags-accessories.jpg',
    imageAlt: 'Tan leather handbag cleaned and conditioned by Vanzoo luxury accessory care',
    icon: 'bag',
  },
  {
    slug: 'dont-worry-about-holi-stains',
    headline: "Don't Worry About Holi Stains",
    subhead:
      'Targeted stain treatment before the clean — colour, oil and residue assessed piece by piece.',
    description:
      'Holi colour out of your clothes: Vanzoo treats each stain individually before cleaning, with free pickup and delivery across Delhi NCR.',
    image: '/images/collage-folded-linens.jpg',
    imageAlt: 'Freshly cleaned white and pastel garments folded after Vanzoo stain treatment',
    icon: 'sparkles',
  },
  {
    slug: 'office-suits-done-perfectly',
    headline: 'Office Suits Done Perfectly',
    subhead:
      'Structure, shoulder line and drape preserved — pressed by hand, back on your rail.',
    description:
      'Vanzoo cleans and presses business suits without losing structure or drape. Couture-trained finishing with free pickup in Gurgaon.',
    image: '/images/service-bespoke-suit-couture.jpg',
    imageAlt: 'Bespoke suit cleaned and pressed by Vanzoo, hanging ready for collection',
    icon: 'jacket',
  },
  {
    slug: 'view-our-pricing-now',
    headline: 'View Our Pricing Now',
    subhead: 'Per-item tariffs for every category, published in full. No quotes to chase.',
    description:
      'See Vanzoo per-item dry cleaning and steam iron tariffs in full — suits, sarees, lehengas, leather, footwear, curtains and carpets.',
    image: '/images/garment-rail-couture.jpg',
    imageAlt: 'Rail of couture garments awaiting cleaning at the Vanzoo Gurgaon atelier',
    icon: 'search',
  },
  {
    slug: 'download-our-app-now-for-more-offers',
    headline: 'Download Our App Now For More Offers',
    subhead:
      'Book pickups, track orders and manage credits from your phone — offers land there first.',
    description:
      'Get the Vanzoo app to book pickups, track orders in real time and manage your credits — with offers available in-app first.',
    image: '/images/hero-valet-handover.jpg',
    imageAlt: 'Vanzoo staff handing wrapped dry-cleaned garments to a customer in Gurgaon',
    icon: 'googlePlay',
  },
  {
    slug: 'rated-4-9-5-by-our-customers',
    headline: 'Rated 4.9/5 by Our Customers',
    subhead:
      'Every piece assessed individually, cleaned in a closed-loop system and hand-finished before it comes back.',
    description:
      'Vanzoo is rated 4.9/5 by its customers for luxury fabric care and eco-friendly dry cleaning in Gurgaon.',
    image: '/images/hero-valet-handover.jpg',
    imageAlt: 'Vanzoo customer collecting freshly dry-cleaned garments at the Gurgaon store',
    icon: 'star',
  },
  {
    slug: 'your-satisfaction-is-our-guarantee',
    headline: 'Your Satisfaction is Our Guarantee',
    subhead:
      'If a garment comes back anything less than pristine, tell us — we will make it right.',
    description:
      'Vanzoo guarantees your satisfaction on every order — individually assessed, hand-finished, and put right if it is not perfect.',
    image: '/images/persona-corporate-professionals.jpg',
    imageAlt: 'Customer inspecting a freshly cleaned shirt returned by Vanzoo',
    icon: 'shieldCheck',
  },
  {
    slug: 'best-eco-friendly-dry-cleaning-care',
    headline: 'Best Eco Friendly Dry Cleaning Care',
    subhead:
      'Biodegradable solvent, 99% recovered each cycle, and reusable packaging on the way back.',
    description:
      'Vanzoo offers eco-friendly dry cleaning in Gurgaon — biodegradable hydrocarbon solvent, 99% recovery per cycle and reusable packaging.',
    image: '/images/tech-hydrocarbon-plant.jpg',
    imageAlt: 'Energy-efficient hydrocarbon cleaning plant with solvent recovery at Vanzoo',
    icon: 'leaf',
  },
];

const bySlug = new Map(campaigns.map((c) => [c.slug, c]));

export function getCampaign(slug: string): Campaign | undefined {
  return bySlug.get(slug);
}

/* -------------------------------------------------------------------------- */
/* Link hub (/menu) — the destination behind Vanzoo's social bio links.        */
/* -------------------------------------------------------------------------- */

export const menuHub = {
  heading: 'Connect with Vanzoo',
  subhead: 'Everything in one place — book a pickup, get the app, or say hello.',
} as const;
