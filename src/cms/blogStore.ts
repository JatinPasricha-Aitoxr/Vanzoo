import { unstable_cache } from 'next/cache';
import { posts as builtIn, primaryCategory, type Post } from '@/content/blog';
import { dbConfigured, parseJson, query } from '@/lib/db';

export const POSTS_TAG = 'posts';

type Row = { slug: string; title: string; excerpt: string; body: string; image: string | null; image_alt: string; categories: unknown; tags: unknown; reading_minutes: number; status: 'draft' | 'published'; hidden: 0 | 1; published_at: string | null; updated_at: string };

const iso = (s: string | null) => (s ? `${s.replace(' ', 'T')}Z` : new Date(0).toISOString());

/** Built-in posts overlaid with published CMS posts (same slug = override). Falls back to the built-ins if the DB is down. */
async function load(): Promise<Post[]> {
  if (!dbConfigured()) return builtIn;
  try {
    const rows = await query<Row>('SELECT slug, title, excerpt, body, image, image_alt, categories, tags, reading_minutes, status, hidden, published_at, updated_at FROM cms_posts');
    const map = new Map(builtIn.map((p) => [p.slug, p]));
    for (const r of rows) {
      if (r.hidden || r.status !== 'published') { if (r.hidden) map.delete(r.slug); continue; }
      map.set(r.slug, {
        slug: r.slug, title: r.title, excerpt: r.excerpt, body: r.body, image: r.image, imageAlt: r.image_alt,
        categories: parseJson<string[]>(r.categories, []), tags: parseJson<string[]>(r.tags, []), readingMinutes: r.reading_minutes,
        publishedAt: iso(r.published_at), updatedAt: iso(r.updated_at),
      });
    }
    return [...map.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  } catch {
    return builtIn;
  }
}

export const allPosts = unstable_cache(load, ['all-posts'], { tags: [POSTS_TAG], revalidate: 300 });

export async function findPost(slug: string) { return (await allPosts()).find((p) => p.slug === slug); }
export const categoriesOf = (posts: Post[]) => Array.from(new Set(posts.map(primaryCategory))).sort();
export const inCategory = (posts: Post[], c: string) => posts.filter((p) => primaryCategory(p) === c);
export function relatedOf(posts: Post[], post: Post, count = 3) {
  const c = primaryCategory(post);
  const others = posts.filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => primaryCategory(p) === c), ...others.filter((p) => primaryCategory(p) !== c)].slice(0, count);
}
