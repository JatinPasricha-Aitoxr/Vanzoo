import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BlogGrid } from '@/components/BlogCard';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/Hero';
import { Section } from '@/components/ui/Section';
import { categories, categoryFromSlug, categorySlug, postsInCategory } from '@/content/blog';
import { breadcrumbSchema, buildMetadata } from '@/lib/seo';

type Params = { params: { slug: string } };

/** Every category page is generated at build time — no runtime fallback. */
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: categorySlug(category) }));
}

export function generateMetadata({ params }: Params) {
  const category = categoryFromSlug(params.slug);
  if (!category) return {};

  return buildMetadata({
    title: `${category} Articles | Vanzoo Fabric Care Journal`,
    description: `Vanzoo guides and advice on ${category.toLowerCase()} — from the luxury fabric care and eco-friendly dry cleaning team in Gurgaon.`,
    path: `/blogs/category/${params.slug}/`,
  });
}

export default function BlogCategoryPage({ params }: Params) {
  const category = categoryFromSlug(params.slug);
  if (!category) notFound();

  const categoryPosts = postsInCategory(category);
  const crumbs = [
    { name: 'Blogs', href: '/blogs/' },
    { name: category, href: `/blogs/category/${params.slug}/` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHeader
        eyebrow="Journal"
        title={category}
        intro={`${categoryPosts.length} article${categoryPosts.length === 1 ? '' : 's'} on ${category.toLowerCase()}.`}
      >
        <Breadcrumbs crumbs={crumbs} />
      </PageHeader>

      <Section tone="surface">
        <nav aria-label="Article categories">
          <ul className="flex flex-wrap gap-2.5">
            <li>
              <Link
                href="/blogs/"
                className="inline-block rounded-pill border border-neutral-line px-4 py-2 text-sm font-medium text-neutral-body transition-colors hover:border-brand/40 hover:text-brand"
              >
                All articles
              </Link>
            </li>
            {categories.map((item) => {
              const active = item === category;
              return (
                <li key={item}>
                  {active ? (
                    <span
                      aria-current="page"
                      className="inline-block rounded-pill border border-brand bg-brand px-4 py-2 text-sm font-medium text-white"
                    >
                      {item}
                    </span>
                  ) : (
                    <Link
                      href={`/blogs/category/${categorySlug(item)}/`}
                      className="inline-block rounded-pill border border-neutral-line px-4 py-2 text-sm font-medium text-neutral-body transition-colors hover:border-brand/40 hover:text-brand"
                    >
                      {item}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-10">
          <BlogGrid
            posts={categoryPosts}
            priorityFirst
            label={`Articles in ${category}`}
            visuallyHidden
          />
        </div>
      </Section>
    </>
  );
}
