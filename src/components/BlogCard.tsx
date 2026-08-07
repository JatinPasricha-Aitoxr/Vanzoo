import Image from 'next/image';
import Link from 'next/link';
import { Icon } from './ui/Icon';
import { RevealGroup } from './ui/Reveal';
import { formatPostDate, postImage, primaryCategory, type Post } from '@/content/blog';
import { cn } from '@/lib/cn';

export function BlogCard({
  post,
  priority = false,
  className,
}: {
  post: Post;
  /** Set on the first card of the blog index, which is that page's LCP image. */
  priority?: boolean;
  className?: string;
}) {
  const image = postImage(post);
  const href = `/blogs/${post.slug}/`;

  return (
    <article
      className={cn(
        'card-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-neutral-line bg-white hover:border-brand/35',
        className,
      )}
    >
      {/* Not a link itself — the stretched title link below covers the whole
          card, so wrapping the image too would duplicate the destination. */}
      <div className="media-frame aspect-[16/10] rounded-none">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="card-media object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="rounded-pill bg-brand-light px-2.5 py-1 font-semibold text-brand-dark">
            {primaryCategory(post)}
          </span>
          <time
            dateTime={post.publishedAt}
            className="inline-flex items-center gap-1.5 text-neutral-body"
          >
            <Icon name="calendar" className="text-[0.875rem]" />
            {formatPostDate(post.publishedAt)}
          </time>
          <span className="inline-flex items-center gap-1.5 text-neutral-body">
            <Icon name="clock" className="text-[0.875rem]" />
            {post.readingMinutes} min read
          </span>
        </div>

        <h3 className="mt-3.5 font-display text-lg font-semibold leading-snug">
          {/* Stretched link: the whole card is the hit area, but only the title
              text is announced as the link target. */}
          <Link href={href} className="transition-colors duration-200 after:absolute after:inset-0 group-hover:text-brand">
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-pretty text-neutral-body">
          {post.excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Read More
          <Icon name="arrowRight" className="arrow-nudge" />
        </span>
      </div>
    </article>
  );
}

export function BlogGrid({
  posts,
  priorityFirst = false,
  /**
   * Heading for the list. Pages where the grid is the main content have no
   * visible h2 above it, and card titles are h3 — without this the hierarchy
   * would jump h1→h3. Pass `visuallyHidden` there; omit it where a visible h2
   * already introduces the grid.
   */
  label,
  visuallyHidden = false,
}: {
  posts: readonly Post[];
  priorityFirst?: boolean;
  label?: string;
  visuallyHidden?: boolean;
}) {
  return (
    <>
      {label ? (
        <h2 className={visuallyHidden ? 'sr-only' : 'text-display-sm'}>{label}</h2>
      ) : null}
      <RevealGroup as="ul" step={60} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <li key={post.slug} className="relative">
            <BlogCard post={post} priority={priorityFirst && index === 0} />
          </li>
        ))}
      </RevealGroup>
    </>
  );
}
