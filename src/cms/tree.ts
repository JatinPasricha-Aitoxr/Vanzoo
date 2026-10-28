import { newId, type Block, type Doc } from './schema';
import { WIDGET_MAP } from './widgetDefs';

/** Pure helpers for editing the block tree. Every function returns a new tree. */

export type Position = 'before' | 'after' | 'inside';

export function findBlock(blocks: Block[], id: string): Block | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    const hit = b.children ? findBlock(b.children, id) : null;
    if (hit) return hit;
  }
  return null;
}

export function findParent(blocks: Block[], id: string, parent: Block | null = null): { parent: Block | null; index: number } | null {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].id === id) return { parent, index: i };
    const kids = blocks[i].children;
    const hit = kids ? findParent(kids, id, blocks[i]) : null;
    if (hit) return hit;
  }
  return null;
}

export function mapBlock(blocks: Block[], id: string, fn: (b: Block) => Block): Block[] {
  return blocks.map((b) => (b.id === id ? fn(b) : b.children ? { ...b, children: mapBlock(b.children, id, fn) } : b));
}

export function removeBlock(blocks: Block[], id: string): Block[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => (b.children ? { ...b, children: removeBlock(b.children, id) } : b));
}

/** Clones a block (and descendants) with fresh ids. */
export function cloneWithNewIds(b: Block): Block {
  return { ...b, id: newId(), children: b.children?.map(cloneWithNewIds) };
}

export function depthOf(blocks: Block[], id: string, d = 0): number {
  for (const b of blocks) {
    if (b.id === id) return d;
    const hit = b.children ? depthOf(b.children, id, d + 1) : -1;
    if (hit >= 0) return hit;
  }
  return -1;
}

const subtreeHeight = (b: Block): number => 1 + Math.max(0, ...(b.children ?? []).map(subtreeHeight));

/** Whether `block` may be placed at `position` relative to `targetId`. */
export function canPlace(doc: Doc, block: Block, targetId: string | null, position: Position): boolean {
  if (targetId === null) return true; // end of page
  const target = findBlock(doc.blocks, targetId);
  if (!target) return false;
  if (block.id === targetId) return false;
  // A block cannot be dropped into its own subtree.
  if (findBlock([block], targetId)) return false;
  let parentDepth: number;
  if (position === 'inside') {
    if (!WIDGET_MAP[target.type]?.container) return false;
    parentDepth = depthOf(doc.blocks, targetId) + 1;
  } else {
    parentDepth = Math.max(0, depthOf(doc.blocks, targetId));
  }
  return parentDepth + subtreeHeight(block) - 1 <= 4;
}

/** Inserts `block` relative to `targetId` (null = end of the page). */
export function insertBlock(doc: Doc, block: Block, targetId: string | null, position: Position): Doc {
  if (targetId === null) return { ...doc, blocks: [...doc.blocks, block] };
  const place = (blocks: Block[]): Block[] => {
    const out: Block[] = [];
    for (const b of blocks) {
      if (b.id === targetId) {
        if (position === 'before') out.push(block, b);
        else if (position === 'after') out.push(b, block);
        else out.push({ ...b, children: [...(b.children ?? []), block] });
      } else {
        out.push(b.children ? { ...b, children: place(b.children) } : b);
      }
    }
    return out;
  };
  return { ...doc, blocks: place(doc.blocks) };
}

export function moveBlock(doc: Doc, blockId: string, targetId: string | null, position: Position): Doc {
  const block = findBlock(doc.blocks, blockId);
  if (!block || !canPlace(doc, block, targetId, position)) return doc;
  const without = { ...doc, blocks: removeBlock(doc.blocks, blockId) };
  return insertBlock(without, block, targetId, position);
}

export function newBlock(type: string): Block {
  const def = WIDGET_MAP[type];
  return { id: newId(), type, props: def.defaults(), style: {}, children: def.container ? [] : undefined };
}

export function flatten(blocks: Block[], depth = 0): { block: Block; depth: number }[] {
  return blocks.flatMap((b) => [{ block: b, depth }, ...(b.children ? flatten(b.children, depth + 1) : [])]);
}
