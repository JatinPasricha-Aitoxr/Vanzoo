import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCard } from '@/components/BlogCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CtaBanner } from '@/components/CtaBanner';
import { JsonLd } from '@/components/JsonLd';
import { ShareLinks } from '@/components/ShareLinks';
import { Section } from '@/components/ui/Section';
import {
  categorySlug,
  formatPostDate,
  getPost,
  postImage,
  posts,
  primaryCategory,
  relatedPosts,
  splitBodyForInlineCta,
} from '@/content/blog';
import { blogPostingSchema, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { links, SITE_URL } from '@/lib/site';

type Params = { params: { slug: string } };

/** All 73 articles are static; an unknown slug is a 404, not a runtime render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Params) {
  const post = getPost(params.slug);
  if (!post) return {};
  const image = postImage(post);

  return buildMetadata({
    title: `${post.title} | Vanzoo`,
    description: post.excerpt.slice(0, 200),
    path: `/blogs/${post.slug}/`,
    image: image.src,
    imageAlt: image.alt,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default function BlogPostPage({ params }: Params) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const image = postImage(post);
  const category = primaryCategory(post);
  const related = relatedPosts(post);
  const split = splitBodyForInlineCta(post.body);
  const url = `${SITE_URL}/blogs/${post.slug}/`;

  const crumbs = [
    { name: 'Blogs', href: '/blogs/' },
    { name: category, href: `/blogs/category/${categorySlug(category)}/` },
    { name: post.title, href: `/blogs/${post.slug}/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema({
            title: post.title,
            description: post.excerpt.slice(0, 200),
            slug: post.slug,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            image: image.src,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />

      {/* Reading progress. Driven by a scroll timeline, so the bar is animated
          by the compositor and tracks the scroll exactly — no scroll listener,
          no rAF loop, and nothing to keep in sync on the main thread. Hidden
          entirely where scroll timelines aren't supported (see motion.css). */}
      <div
        aria-hidden="true"
        className="reading-progress-track fixed inset-x-0 top-0 z-[55] h-0.5 bg-transparent"
      >
        <div className="reading-progress h-full w-full bg-brand" />
      </div>

      <article>
        {/* Article hero */}
        <header className="bg-brand-light pb-12 pt-[calc(var(--header-h)+3rem)]">
          <div className="shell">
            <Breadcrumbs crumbs={crumbs} />

            <div className="mt-8 max-w-prose">
              <Link
                href={`/blogs/category/${categorySlug(category)}/`}
                className="inline-block rounded-pill bg-white px-3 py-1.5 text-xs font-semibold text-brand-dark transition-colors hover:text-brand"
              >
                {category}
              </Link>

              <h1 className="mt-4 text-display-lg">{post.title}</h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-body">
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                <span aria-hidden="true">•</span>
                <span>{post.readingMinutes} min read</span>
                {post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10) ? (
                  <>
                    <span aria-hidden="true">•</span>
                    <span>
                      Updated{' '}
                      <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className="shell">
          <div className="media-frame -mt-2 aspect-[16/9] w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Prose column */}
        <div className="shell py-14">
          <div className="mx-auto max-w-prose">
            {/* Body HTML is sanitised to a fixed tag whitelist at import time
                (scripts/import-blog.py); no untrusted input reaches this. */}
            <div
              className="prose-vanzoo"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: split ? split[0] : post.body }}
            />

            {split ? (
              <>
                <aside className="my-12 rounded-card border border-neutral-line bg-brand-light p-6 sm:p-8">
                  <h2 className="font-display text-xl font-semibold">
                    Rather not risk it yourself?
                  </h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-body">
                    Vanzoo cleans delicate fabrics with Italian hydrocarbon technology and
                    finishes every piece by hand — with free pickup and delivery across Gurgaon.
                  </p>
                  <a
                    href={links.bookPickup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary btn-md mt-5"
                  >
                    Book a pickup
                  </a>
                </aside>

                <div
                  className="prose-vanzoo"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: split[1] }}
                />
              </>
            ) : null}

            <div className="mt-12 border-t border-neutral-line pt-8">
              <ShareLinks title={post.title} url={url} />
            </div>
          </div>
        </div>

        <Section tone="surface" size="sm">
          <CtaBanner
            heading="Let us handle the difficult ones"
            body="Free pickup and delivery across Gurgaon — cleaned with Italian hydrocarbon technology and finished by hand."
            secondary={{ label: 'See our tariffs', href: '/pricing/' }}
          />
        </Section>

        {related.length > 0 ? (
          <Section tone="muted" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-display-sm">
              Related reading
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug} className="relative">
                  <BlogCard post={item} />
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </article>
    </>
  );
}
