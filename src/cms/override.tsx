import type { ReactNode } from 'react';
import { allPosts } from './blogStore';
import { getHomeFaqs, getServices } from './content';
import { RenderDoc } from './render';
import type { Block, Doc } from './schema';
import { getPublishedBySlug } from './store';
import { templateSlug, type TemplateSlot } from './pageRoutes';

/** Wraps a built-in page so a published builder page at the same address wins. */
export function cmsOr<P extends object>(slug: string, Body: (props: P) => ReactNode | Promise<ReactNode>) {
  return async function Page(props: P) {
    const live = await getPublishedBySlug(slug);
    if (live) {
      const [posts, services, faqs] = await Promise.all([allPosts(), getServices(), getHomeFaqs()]);
      return <RenderDoc doc={live.doc} posts={posts} services={services} faqs={faqs} />;
    }
    return <>{await Body(props)}</>;
  };
}

const fill = (v: unknown, vars: Record<string, string>): unknown =>
  typeof v === 'string' ? v.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k: string) => vars[k] ?? m)
  : Array.isArray(v) ? v.map((x) => fill(x, vars))
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x, vars)]))
  : v;

const fillBlocks = (blocks: Block[], vars: Record<string, string>): Block[] =>
  blocks.map((b) => ({ ...b, props: fill(b.props, vars) as Block['props'], children: b.children ? fillBlocks(b.children, vars) : undefined }));

/** Sections an editor added for every page of one kind. `{{title}}`-style placeholders are filled per page. */
export async function DetailTemplate({ slot, vars }: { slot: TemplateSlot; vars: Record<string, string> }) {
  const live = await getPublishedBySlug(templateSlug(slot));
  if (!live || !live.doc.blocks.length) return null;
  const doc: Doc = { ...live.doc, blocks: fillBlocks(live.doc.blocks, vars) };
  const [posts, services, faqs] = await Promise.all([allPosts(), getServices(), getHomeFaqs()]);
  return <RenderDoc doc={doc} posts={posts} services={services} faqs={faqs} />;
}
