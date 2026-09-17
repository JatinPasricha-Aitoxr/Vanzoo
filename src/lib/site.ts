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
  /** Gurgaon only. Both stores are here and it is the one city Vanzoo operates
   *  in, so nothing on the site claims wider Delhi-NCR coverage. */
  city: 'Gurgaon',
  serviceArea: 'Gurgaon, Haryana',
  description:
    'Experience premium fabric care by Vanzoo using advanced Italian hydrocarbon technology—eco-conscious, gentle on fabrics, and powerful on tough everyday stains. Free pickup and delivery across Gurgaon.',
  phone: '+91 9091671666',
  phoneHref: '+919091671666',
  /** Digits only, country code included — the wa.me path format. */
  whatsapp: '919091671666',
  email: 'care@vanzoo.in',
  /** Standard turnaround, quoted verbatim from the homepage FAQ. */
  turnaround: '3-5 days',
} as const;

/** Outbound links, preserved exactly as they appear on vanzoo.in. */
export const links = {
  bookPickup: 'https://app.vanzoo.in/website/W10795?brand=VANZOO',
  bookService: 'https://app.vanzoo.in/website/W10541',
  playStore: 'https://play.google.com/store/apps/details?id=com.vanzoo.customer',
  facebook: 'https://www.facebook.com/profile.php?id=61581034320798',
  instagram: 'https://www.instagram.com/vanzoo._/',
  youtube: 'https://www.youtube.com/channel/UC-oPR8MnkAZpiOp0K08TNrQ',
  whatsapp: `https://wa.me/${site.whatsapp}`,
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

/** The single city Vanzoo operates in — used for `areaServed` and location copy. */
export const serviceCities = ['Gurgaon'] as const;

/**
 * Gurgaon pickup coverage, grouped by corridor, for /areas-we-serve.
 *
 * Locality names only. Vanzoo does not publish a pincode-level coverage list,
 * so nothing here asserts that a given neighbourhood maps to a given pincode —
 * the page says coverage is confirmed at booking, and `PincodeChecker` matches
 * on the Gurgaon pincode range rather than per-locality. Add exact pincodes
 * here once operations confirm them; see README "Service areas".
 */
export const areaGroups = [
  {
    id: 'dlf-golf-course',
    name: 'DLF & Golf Course Road',
    blurb:
      'Our DLF Phase IV store sits in the middle of this corridor, so it is the fastest turnaround we run.',
    areas: [
      'DLF Phase 1',
      'DLF Phase 2',
      'DLF Phase 3',
      'DLF Phase 4',
      'DLF Phase 5',
      'Sushant Lok 1',
      'Golf Course Road',
      'Nirvana Country',
      'Ardee City',
    ],
  },
  {
    id: 'golf-course-extension',
    name: 'Golf Course Extension & Sohna Road',
    blurb:
      'Sectors either side of Golf Course Extension Road, down through Sohna Road to Badshahpur.',
    areas: [
      'Sector 47',
      'Sector 48',
      'Sector 49',
      'Sector 50',
      'Sector 55',
      'Sector 56',
      'Sector 57',
      'Sohna Road',
      'Badshahpur',
    ],
  },
  {
    id: 'sector-65-70',
    name: 'Sectors 65–70',
    blurb:
      'Served from the Vanzoo Urbana store at M3M Urbana, Sector 67 — including the M3M, Emaar and Tulip developments.',
    areas: [
      'Sector 65',
      'Sector 66',
      'Sector 67',
      'Sector 68',
      'Sector 69',
      'Sector 70',
      'M3M Urbana',
      'Emaar Palm Gardens',
    ],
  },
  {
    id: 'old-gurgaon',
    name: 'Old Gurgaon & MG Road',
    blurb: 'The original city centre, Civil Lines and the MG Road business strip.',
    areas: [
      'MG Road',
      'Civil Lines',
      'Sector 14',
      'Sector 15',
      'South City 1',
      'South City 2',
      'Sushant Lok 2',
      'Sushant Lok 3',
    ],
  },
  {
    id: 'cyber-city',
    name: 'Cyber City & Udyog Vihar',
    blurb:
      'Corporate pickups from the office parks, plus the residential pockets around them.',
    areas: [
      'DLF Cyber City',
      'Udyog Vihar',
      'Sector 18',
      'Sector 21',
      'Sikanderpur',
      'Chakkarpur',
    ],
  },
  {
    id: 'new-gurgaon',
    name: 'New Gurgaon & Dwarka Expressway',
    blurb:
      'The newer sectors along NH-48 and the Dwarka Expressway, and west towards Palam Vihar.',
    areas: [
      'Palam Vihar',
      'Sector 81',
      'Sector 82',
      'Sector 84',
      'Sector 86',
      'Sector 92',
      'Sector 102',
      'Sector 109',
      'New Palam Vihar',
    ],
  },
] as const;

/** Flattened locality list — the pickup widget's "Where" select reads this. */
export const serviceAreas = areaGroups.flatMap((group) => group.areas);

/**
 * Header + mobile navigation. No "Home" entry — the logo already links there,
 * per every convention on the web, so a duplicate text link is dead weight.
 * Couture Care and Steam Iron used to be two separate tariff pages; they're
 * now one page ("Pricing") with both catalogues on it, at /pricing/.
 */
export const navLinks = [
  { href: '/about-us/', label: 'About Us' },
  { href: '/services/', label: 'Services' },
  { href: '/pricing/', label: 'Pricing' },
  { href: '/hydrocarbon-tech/', label: 'Hydrocarbon Tech' },
  { href: '/areas-we-serve/', label: 'Areas' },
  { href: '/blogs/', label: 'Blogs' },
  { href: '/contact-us/', label: 'Contact Us' },
] as const;

/** Mega-footer columns, data-driven so a link change never touches markup. */
export const footerColumns = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'About Us', href: '/about-us/' },
      { label: 'Membership', href: '/membership/' },
      { label: 'Pricing', href: '/pricing/' },
      { label: 'Hydrocarbon Tech', href: '/hydrocarbon-tech/' },
      { label: 'Contact Us', href: '/contact-us/' },
      { label: 'Locate Us', href: '/locate-us/' },
      { label: 'Areas We Serve', href: '/areas-we-serve/' },
      { label: 'Blogs', href: '/blogs/' },
    ],
  },
  {
    heading: 'Our Services',
    // Each link goes to that service's own dedicated page; booking stays on
    // the "Book" CTAs, so these describe before they sell.
    links: [
      { label: 'Garment Care', href: '/services/couture-care/' },
      { label: 'Bags Care', href: '/services/bags-leather-care/' },
      { label: 'Shoes Care', href: '/services/shoe-care/' },
      { label: 'Toys & Accessories Care', href: '/services/toys-accessories-care/' },
      { label: 'Leather Care', href: '/services/bags-leather-care/' },
      { label: 'Curtains Care', href: '/services/curtain-cleaning/' },
      { label: 'Carpet Care', href: '/services/carpet-cleaning/' },
      { label: 'Express Service', href: '/services/express-service/' },
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

/**
 * Everything Vanzoo dry cleans, beyond the obvious garments — shown in the
 * footer so a visitor scanning for an unusual item (a pram, a mattress, a
 * sofa) sees at a glance that it's covered.
 */
export const dryCleanItems = [
  'Achkan/Jodhpuri/Sherwani',
  'Ankle Length Boots',
  'Baby Stroller/Pram',
  'Baby Carrier',
  'Backpack',
  'Baby Items',
  'Bed',
  'Bed Spread',
  'Bridal Lehnga',
  'Cap',
  'Cushion',
  'Dress',
  'Duvet',
  'Floor Mats',
  'Knee Length Boot',
  'Mattress',
  'Mid Length Boot',
  'Purse',
  'Quilt Cover',
  'Sandals',
  'Sofa',
  'Soft Toy',
  'Top',
  'Waist Coat',
] as const;

export const footerIntro = {
  heading: 'Discover the perfect blend of quality and convenience with Vanzoo',
  body: 'Experience expert garment care, eco-conscious cleaning, and seamless door-to-door service—all designed to fit your lifestyle.',
  copyright: `Copyright © ${new Date().getFullYear()} Vanzoo. All Rights Reserved.`,
} as const;
