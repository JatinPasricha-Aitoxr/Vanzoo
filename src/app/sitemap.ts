import type { MetadataRoute } from 'next';
import { areaEntries } from '@/content/areas';
import { categories, categorySlug, posts, postsInCategory } from '@/content/blog';
import { productEntries } from '@/content/products';
import { serviceEntries } from '@/content/services';
import { SITE_URL } from '@/lib/site';

/**
 * Sitemap covering every indexable route: the marketing pages, the blog index,
 * each category view and all 73 articles.
 *
 * `lastModified` comes from real data — a post's own `modified` timestamp, and
 * for the listing pages the newest post they contain. Stamping "now" on every
 * entry, as generators often do, teaches crawlers to ignore the field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const newestPost = posts[0]?.updatedAt ?? new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about-us/`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/membership/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/services/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/products/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/pricing/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/hydrocarbon-tech/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact-us/`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/locate-us/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/areas-we-serve/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/privacy-policy/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms-conditions/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/delivery-refund-policy/`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = serviceEntries.map((service) => ({
    url: `${SITE_URL}/services/${service.id}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = productEntries.map((product) => ({
    url: `${SITE_URL}/products/${product.id}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const areaPages: MetadataRoute.Sitemap = areaEntries.map((area) => ({
    url: `${SITE_URL}/areas-we-serve/${area.id}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/blogs/`,
      lastModified: newestPost,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => {
    const inCategory = postsInCategory(category);
    return {
      url: `${SITE_URL}/blogs/category/${categorySlug(category)}/`,
      lastModified: inCategory[0]?.updatedAt ?? newestPost,
      changeFrequency: 'weekly',
      priority: 0.5,
    };
  });

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blogs/${post.slug}/`,
    lastModified: post.updatedAt,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...productPages,
    ...areaPages,
    ...blogIndex,
    ...categoryPages,
    ...postPages,
  ];
}
