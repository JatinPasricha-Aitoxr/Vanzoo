import type { MetadataRoute } from 'next';
import { categories, categorySlug, posts, postsInCategory } from '@/content/blog';
import { campaigns } from '@/content/campaigns';
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
    { url: `${SITE_URL}/couture-care-tariffs/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/steam-iron-tariffs/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/hydrocarbon-tech/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact-us/`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/members-club/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/menu/`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/locate-us/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms-conditions/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/delivery-refund-policy/`, changeFrequency: 'yearly', priority: 0.3 },
  ];

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

  // Campaign landing pages are real ad destinations, so they stay indexable —
  // but at a low priority, since they duplicate the homepage's body copy.
  const campaignPages: MetadataRoute.Sitemap = campaigns.map((campaign) => ({
    url: `${SITE_URL}/${campaign.slug}/`,
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blogs/${post.slug}/`,
    lastModified: post.updatedAt,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticPages, ...blogIndex, ...categoryPages, ...campaignPages, ...postPages];
}
