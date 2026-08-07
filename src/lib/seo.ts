import type { Metadata } from 'next';
import { SITE_URL, links, primaryStore, serviceCities, site, socialLinks, stores } from './site';

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path with leading and trailing slash, e.g. `/about-us/`. */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

export const DEFAULT_OG_IMAGE = '/images/hero-valet-handover.jpg';
const DEFAULT_OG_ALT =
  'Vanzoo luxury fabric care and eco-friendly dry cleaning in Gurgaon';

/**
 * Builds the full metadata block for a page: unique title, description,
 * canonical, Open Graph and Twitter card. Every route calls this rather than
 * hand-rolling tags, which is what keeps the "unique per page" requirement
 * true as pages get added.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title,
      description,
      locale: 'en_IN',
      images: [{ url: absoluteImage, alt: imageAlt ?? DEFAULT_OG_ALT }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImage],
    },
  };
}

/* ---------------------------------------------------------------------------
 * JSON-LD builders
 *
 * Only facts Vanzoo publishes are emitted. There is deliberately no
 * `aggregateRating` — Google requires it to reflect reviews genuinely shown on
 * the page, and no verified rating or review count is published anywhere.
 * ------------------------------------------------------------------------ */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;

const sameAs = socialLinks.map((s) => s.href);

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: site.name,
    legalName: site.legalName,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/brand/vanzoo-logo.png`,
      width: 2200,
      height: 653,
    },
    email: site.email,
    telephone: site.phone,
    sameAs,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: site.name,
    description: site.description,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-IN',
  };
}

/**
 * DryCleaningOrLaundry — Home, Contact and Locate Us.
 *
 * Vanzoo publishes no opening hours, so `openingHoursSpecification` is omitted
 * rather than guessed; stating hours we can't verify would be worse than
 * leaving the property off.
 */
export function localBusinessSchema() {
  const [main, ...branches] = stores;
  const location = (store: (typeof stores)[number], id: string) => ({
    '@type': 'DryCleaningOrLaundry',
    '@id': id,
    name: `${site.name} — ${store.name}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address,
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: store.postalCode,
      addressCountry: 'IN',
    },
    telephone: site.phone,
    email: site.email,
    url: `${SITE_URL}/locate-us/`,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'DryCleaningOrLaundry',
    '@id': LOCAL_BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: `${SITE_URL}/`,
    telephone: site.phone,
    email: site.email,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    logo: `${SITE_URL}/images/brand/vanzoo-logo.png`,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    parentOrganization: { '@id': ORGANIZATION_ID },
    address: {
      '@type': 'PostalAddress',
      streetAddress: primaryStore.address,
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: primaryStore.postalCode,
      addressCountry: 'IN',
    },
    areaServed: serviceCities.map((name) => ({ '@type': 'City', name })),
    location: [
      location(main, `${SITE_URL}/locate-us/#${main.id}`),
      ...branches.map((b) => location(b, `${SITE_URL}/locate-us/#${b.id}`)),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Vanzoo fabric care services',
      itemListElement: [
        'Garment Care',
        'Bags Care',
        'Shoes Care',
        'Toys & Accessories Care',
        'Leather Care',
        'Curtains Care',
        'Carpet Care',
        'Express Service',
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name, provider: { '@id': LOCAL_BUSINESS_ID } },
        url: links.bookService,
      })),
    },
    sameAs,
  };
}

export function faqSchema(faqs: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
}) {
  const url = `${SITE_URL}/blogs/${post.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.image}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: site.name, url: `${SITE_URL}/` },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-IN',
  };
}

/**
 * BreadcrumbList for inner pages. Home is prepended automatically, so callers
 * pass only the trail below it.
 */
export function breadcrumbSchema(crumbs: ReadonlyArray<{ name: string; href: string }>) {
  const trail = [{ name: 'Home', href: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };
}
