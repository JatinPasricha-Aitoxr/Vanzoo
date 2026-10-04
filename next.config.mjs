import { readFileSync } from 'node:fs';

/**
 * Legacy blog URLs.
 *
 * On the WordPress site articles lived at the site root (`/some-slug/`); the
 * rebuild namespaces them under `/blogs/` per the page inventory. That moves 73
 * indexed URLs, so each one gets a permanent redirect to its new home — without
 * these the migration would drop the blog's accumulated ranking.
 */
const posts = JSON.parse(readFileSync('./src/content/posts.json', 'utf8'));

/** Routes that must never be captured by the catch-all legacy rule. */
const RESERVED = new Set([
  'about-us',
  'pricing',
  // Couture Care and Steam Iron were once two pages; both now redirect below
  // to the merged /pricing/, but stay reserved so a same-named blog post
  // could never shadow the explicit redirect rule for them.
  'couture-care-tariffs',
  'steam-iron-tariffs',
  'hydrocarbon-tech',
  'contact-us',
  'locate-us',
  'areas-we-serve',
  'services',
  'blogs',
  'privacy-policy',
  'terms-conditions',
  'delivery-refund-policy',
  'api',
]);

const legacyPostRedirects = posts
  .map((post) => post.slug)
  .filter((slug) => !RESERVED.has(slug))
  .map((slug) => ({
    source: `/${slug}`,
    destination: `/blogs/${slug}/`,
    permanent: true,
  }));

/**
 * The old site's other pages (vanzoo.in/page-sitemap.xml): the members club,
 * ad landing pages and form thank-you pages. Each goes to the closest page on
 * the rebuild so indexed links and any live ad campaigns keep landing
 * somewhere useful instead of on a 404.
 */
const legacyPageRedirects = [
  ['members-club', '/membership/'],
  ['menu', '/'],
  ['thank-you', '/'],
  ['thank-you-2', '/'],
  ['view-our-pricing-now', '/pricing/'],
  ['get-your-clothes-back-in-5-7-days', '/services/express-service/'],
  ['technology-built-for-your-skin', '/hydrocarbon-tech/'],
  ['we-use-0-chemicals', '/hydrocarbon-tech/'],
  ['cleaned-with-hydrocarbon-tech', '/hydrocarbon-tech/'],
  ['best-eco-friendly-dry-cleaning-care', '/hydrocarbon-tech/'],
  ['luxury-shoes-cleaned-right', '/services/shoe-care/'],
  ['give-your-bag-its-glow-back', '/services/bags-leather-care/'],
  ['festival-ready-in-every-stitch', '/services/ethnic-wear/'],
  ['big-event-prep-your-lehenga', '/products/lehenga/'],
  ['office-suits-done-perfectly', '/products/men-suit-2-pcs/'],
  ['dont-worry-about-holi-stains', '/services/'],
  ['download-our-app-now-for-more-offers', '/'],
  ['rated-4-9-5-by-our-customers', '/'],
  ['your-satisfaction-is-our-guarantee', '/'],
].map(([slug, destination]) => ({ source: `/${slug}`, destination, permanent: true }));

/** Category slugs shared by the old site and /blogs/category/[slug]. */
const legacyCategories = [
  'care-labels',
  'detergents',
  'fabric-care',
  'hydrocarbon-dry-cleaning',
  'luxury-accessory-care',
  'luxury-dry-cleaning',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Every internal route is authored with a trailing slash (vanzoo.in parity).
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Widths tuned to the breakpoints the layouts actually use, so the browser
    // never downloads a candidate far larger than the slot it fills.
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async redirects() {
    return [
      // The old site's category archives. The six real categories map to their
      // own page under /blogs/category/; anything else (e.g. "uncategorized")
      // falls through to the blog index.
      ...legacyCategories.map((slug) => ({
        source: `/category/${slug}`,
        destination: `/blogs/category/${slug}/`,
        permanent: true,
      })),
      { source: '/category/:slug', destination: '/blogs/', permanent: true },
      // Couture Care and Steam Iron Tariffs merged into one Pricing page.
      { source: '/couture-care-tariffs', destination: '/pricing/#couture-care-tariffs', permanent: true },
      { source: '/steam-iron-tariffs', destination: '/pricing/#steam-iron-tariffs', permanent: true },
      ...legacyPageRedirects,
      ...legacyPostRedirects,
    ];
  },
  async headers() {
    return [
      {
        // Hashed build assets and imported media are immutable.
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
