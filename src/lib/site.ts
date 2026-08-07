/**
 * Single source of truth for brand facts that appear in more than one place:
 * navigation, structured data, the footer and page metadata all read from here,
 * so a phone-number change is a one-line edit.
 *
 * Every value below is carried over from the live vanzoo.in site. Nothing here
 * is invented — if a fact isn't published by Vanzoo it is absent rather than
 * guessed (see `trustMarkers`, which deliberately claims no press coverage).
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vanzoo.in'
).replace(/\/$/, '');

/** Existing GTM container — keep in sync with the live site's tag. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

/** Existing Search Console verification token, carried over from vanzoo.in. */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '';

export const site = {
  name: 'Vanzoo',
  legalName: 'Vaaruni Ventures LLP',
  descriptor: 'VANZOO – Premium Dry Cleaners',
  serviceArea: 'Delhi | Gurugram | NCR',
  description:
    'Experience premium fabric care by Vanzoo using advanced Italian hydrocarbon technology—eco-conscious, gentle on fabrics, and powerful on tough everyday stains.',
  phone: '+91 9091671666',
  phoneHref: '+919091671666',
  email: 'care@vanzoo.in',
  /** Standard turnaround, quoted verbatim from the homepage FAQ. */
  turnaround: '5-7 days',
} as const;

/** Outbound links, preserved exactly as they appear on vanzoo.in. */
export const links = {
  bookPickup: 'https://app.vanzoo.in/website/W10795?brand=VANZOO',
  bookService: 'https://app.vanzoo.in/website/W10541',
  playStore: 'https://play.google.com/store/apps/details?id=com.vanzoo.customer',
  facebook: 'https://www.facebook.com/profile.php?id=61581034320798',
  instagram: 'https://www.instagram.com/vanzoo._/',
  youtube: 'https://www.youtube.com/channel/UC-oPR8MnkAZpiOp0K08TNrQ',
} as const;

export const socialLinks = [
  { label: 'Facebook', href: links.facebook },
  { label: 'Instagram', href: links.instagram },
  { label: 'YouTube', href: links.youtube },
] as const;

/**
 * Physical stores, transcribed from /locate-us. `mapQuery` drives the Google
 * Maps embed; it is the address string rather than coordinates because Vanzoo
 * does not publish geo coordinates for either store.
 */
export const stores = [
  {
    id: 'super-mart-1',
    name: 'Super Mart 1',
    address:
      'Ground Floor, Block No. B, Super Mart Commercial Complex, B-211, 1, DLF Phase IV, Gurugram, Haryana 122009',
    locality: 'DLF Phase IV, Gurugram',
    postalCode: '122009',
    mapQuery:
      'Vanzoo, Ground Floor, Block No. B, Super Mart Commercial Complex, B-211, DLF Phase IV, Gurugram, Haryana 122009',
  },
  {
    id: 'vanzoo-urbana',
    name: 'Vanzoo Urbana Store',
    address:
      'Unit no, First Floor, M3M URBANA, R3-112, near KFC, Ramgarh, Sector 67, Gurugram, Haryana 122102',
    locality: 'Sector 67, Gurugram',
    postalCode: '122102',
    mapQuery:
      'Vanzoo, M3M URBANA, R3-112, Sector 67, Gurugram, Haryana 122102',
  },
] as const;

/** The address used for LocalBusiness structured data and the footer. */
export const primaryStore = stores[0];

/** Areas Vanzoo states it serves, used for `areaServed` and location copy. */
export const serviceCities = ['Gurugram', 'Delhi', 'Noida', 'Faridabad', 'Ghaziabad'] as const;

/**
 * Header + mobile navigation. Mirrors the live site's primary nav exactly;
 * Locate Us and Blogs live in the footer, as they do today.
 */
export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about-us/', label: 'About Us' },
  { href: '/couture-care-tariffs/', label: 'Couture Care Tariffs' },
  { href: '/steam-iron-tariffs/', label: 'Steam Iron Tariffs' },
  { href: '/hydrocarbon-tech/', label: 'Hydrocarbon Tech' },
  { href: '/contact-us/', label: 'Contact Us' },
] as const;

/** Mega-footer columns, data-driven so a link change never touches markup. */
export const footerColumns = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'About Us', href: '/about-us/' },
      { label: 'Members Club', href: '/members-club/' },
      { label: 'Couture Care Tariffs', href: '/couture-care-tariffs/' },
      { label: 'Hydrocarbon Tech', href: '/hydrocarbon-tech/' },
      { label: 'Contact Us', href: '/contact-us/' },
      { label: 'Locate Us', href: '/locate-us/' },
      { label: 'Blogs', href: '/blogs/' },
    ],
  },
  {
    heading: 'Our Services',
    links: [
      { label: 'Garment Care', href: links.bookService, external: true },
      { label: 'Bags Care', href: links.bookService, external: true },
      { label: 'Shoes Care', href: links.bookService, external: true },
      { label: 'Toys & Accessories Care', href: links.bookService, external: true },
      { label: 'Leather Care', href: links.bookService, external: true },
      { label: 'Curtains Care', href: links.bookService, external: true },
      { label: 'Carpet Care', href: links.bookService, external: true },
      { label: 'Express Service', href: links.bookService, external: true },
    ],
  },
  {
    heading: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Terms of Service', href: '/terms-conditions/' },
      { label: 'Delivery & Refund Policy', href: '/delivery-refund-policy/' },
    ],
  },
] as const;

export const footerIntro = {
  heading: 'Discover the perfect blend of quality and convenience with Vanzoo',
  body: 'Experience expert garment care, eco-conscious cleaning, and seamless door-to-door service—all designed to fit your lifestyle.',
  copyright: `Copyright © ${new Date().getFullYear()} Vanzoo. All Rights Reserved.`,
} as const;
