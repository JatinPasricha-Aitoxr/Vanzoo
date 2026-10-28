import { BREAKPOINTS, FONT_FAMILIES, STYLE_PROPS, type Block, type Style } from './schema';

const toDecl = (style: Style): string =>
  Object.entries(style)
    .map(([k, v]) => `${STYLE_PROPS[k]}:${k === 'fontFamily' ? FONT_FAMILIES[v] ?? v : v}`)
    .filter((d) => !d.startsWith('undefined'))
    .join(';');

/** CSS class used for a block's wrapper. Stable per block id. */
export const blockClass = (id: string) => `b-${id}`;

/**
 * Scoped CSS for one block: desktop base, then tablet and mobile overrides.
 * Every rule is prefixed with the block's own class, so styling can never leak
 * to another element or page.
 */
export function blockCss(block: Block): string {
  const sel = `.${blockClass(block.id)}`;
  const parts: string[] = [];
  const base = toDecl(block.style);
  if (base) parts.push(`${sel}{${base}}`);
  if (block.hidden?.desktop) parts.push(`@media (min-width:${BREAKPOINTS.tablet + 1}px){${sel}{display:none!important}}`);
  const tablet = block.responsive?.tablet ? toDecl(block.responsive.tablet) : '';
  if (tablet) parts.push(`@media (max-width:${BREAKPOINTS.tablet}px){${sel}{${tablet}}}`);
  if (block.hidden?.tablet)
    parts.push(`@media (min-width:${BREAKPOINTS.mobile + 1}px) and (max-width:${BREAKPOINTS.tablet}px){${sel}{display:none!important}}`);
  const mobile = block.responsive?.mobile ? toDecl(block.responsive.mobile) : '';
  if (mobile) parts.push(`@media (max-width:${BREAKPOINTS.mobile}px){${sel}{${mobile}}}`);
  if (block.hidden?.mobile) parts.push(`@media (max-width:${BREAKPOINTS.mobile}px){${sel}{display:none!important}}`);
  return parts.join('\n');
}

/** All CSS for a block tree. */
export function docCss(blocks: Block[]): string {
  return blocks
    .map((b) => [blockCss(b), b.children ? docCss(b.children) : ''].filter(Boolean).join('\n'))
    .filter(Boolean)
    .join('\n');
}
