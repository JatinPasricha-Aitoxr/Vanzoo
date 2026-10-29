import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { blockClass, docCss } from './css';
import type { Post } from '@/content/blog';
import type { Block, Doc } from './schema';
import { WIDGET_COMPONENTS } from './widgetComponents';
import { WIDGET_MAP } from './widgetDefs';

export type WrapFn = (block: Block, node: ReactNode) => ReactNode;

/**
 * Renders a block tree through the approved widget components. `wrap` lets the
 * editor canvas add selection/drag affordances without changing public output.
 */
export type RenderData = { posts?: Post[] };

export function renderBlocks(blocks: Block[], wrap?: WrapFn, data: RenderData = {}): ReactNode {
  return blocks.map((block) => {
    const def = WIDGET_MAP[block.type];
    const render = WIDGET_COMPONENTS[block.type];
    if (!def || !render) return null; // unknown widget: skip rather than crash the page
    const parsed = def.propsSchema.safeParse(block.props ?? {});
    const props = (parsed.success ? parsed.data : def.defaults()) as Record<string, unknown>;
    const children = block.children ? renderBlocks(block.children, wrap, data) : undefined;
    const node = (
      <div
        key={block.id}
        data-block-id={block.id}
        data-block-type={block.type}
        className={cn(blockClass(block.id), block.className)}
        aria-label={block.ariaLabel || undefined}
      >
        {render(props, { children, block, posts: data.posts })}
      </div>
    );
    return wrap ? wrap(block, node) : node;
  });
}

/** CSS (scoped per block) + rendered blocks. */
export function RenderDoc({ doc, wrap, posts }: { doc: Doc; wrap?: WrapFn; posts?: Post[] }) {
  const css = docCss(doc.blocks);
  return (
    <>
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      {renderBlocks(doc.blocks, wrap, { posts })}
    </>
  );
}
