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
const campaigns = JSON.parse(
  readFileSync('./src/content/campaign-slugs.json', 'utf8'),
);

const RESERVED = new Set([
  ...campaigns,
  'members-club',
  'menu',
  'thank-you',
  'about-us',
  'couture-care-tariffs',
  'steam-iron-tariffs',
  'hydrocarbon-tech',
  'contact-us',
  'locate-us',
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
      // The old site's category archives; the rebuild's live under /blogs/.
      { source: '/category/:slug', destination: '/blogs/', permanent: true },
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
