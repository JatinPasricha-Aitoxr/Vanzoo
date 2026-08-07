import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BlogGrid } from '@/components/BlogCard';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Section } from '@/components/ui/Section';
import { categories, categorySlug, posts } from '@/content/blog';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const CRUMBS = [{ name: 'Blogs', href: '/blogs/' }];

export const metadata = buildMetadata({
  title: 'Fabric Care Journal | Vanzoo Blog',
  description:
    'Care guides, stain-removal how-tos and local dry cleaning advice from the Vanzoo fabric care team in Gurgaon.',
  path: '/blogs/',
});

/**
 * Blog index.
 *
 * All 73 posts render in one page rather than being paginated: the cards are
 * lightweight, every image below the fold is lazy-loaded, and a single URL means
 * no paginated canonical chain to get wrong. Category filtering is a set of
 * links to `/blogs/category/[slug]/`, so each filtered view is its own
 * crawlable, canonical URL rather than a client-side state.
 */
export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(CRUMBS),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${SITE_URL}/blogs/#blog`,
            name: 'Vanzoo Fabric Care Journal',
            url: `${SITE_URL}/blogs/`,
            inLanguage: 'en-IN',
          },
        ]}
      />

      <PageHeader
        eyebrow="Journal"
        title="Fabric care, explained"
        intro="Care guides, stain-removal how-tos and straight answers about dry cleaning — written by the team that does the work."
        image="/images/collage-folded-linens.jpg"
        imageAlt="Freshly cleaned and folded linens after Vanzoo fabric care"
      >
        <Breadcrumbs crumbs={CRUMBS} tone="onDark" />
      </PageHeader>

      <Section tone="surface">
        <nav aria-label="Article categories">
          <ul className="flex flex-wrap gap-2.5">
            <li>
              <span
                aria-current="page"
                className="inline-block rounded-pill border border-brand bg-brand px-4 py-2 text-sm font-medium text-white"
              >
                All articles
              </span>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/blogs/category/${categorySlug(category)}/`}
                  className="inline-block rounded-pill border border-neutral-line px-4 py-2 text-sm font-medium text-neutral-body transition-colors hover:border-brand/40 hover:text-brand"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-8 text-sm text-neutral-body">
          {posts.length} articles
        </p>

        <div className="mt-8">
          <BlogGrid posts={posts} priorityFirst label="All articles" visuallyHidden />
        </div>
      </Section>
    </>
  );
}
