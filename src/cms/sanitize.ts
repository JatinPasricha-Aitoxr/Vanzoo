import { parse, HTMLElement, Node, NodeType } from 'node-html-parser';

/**
 * Whitelist sanitiser for blog HTML. Anything not listed is unwrapped (its
 * text kept) or, for script-like elements, dropped with its content. Attributes
 * are rebuilt from scratch, so event handlers and inline styles never survive.
 */
const KEEP = new Set(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'blockquote', 'img', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption']);
const DROP = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'svg', 'math', 'noscript', 'template', 'link', 'meta']);
const RENAME: Record<string, string> = { h1: 'h2', b: 'strong', i: 'em' };

const safeLink = (v: string) => /^(\/(?!\/)|https:\/\/|http:\/\/|mailto:|tel:|#)/i.test(v.trim()) ? v.trim() : '';
const safeImg = (v: string) => /^(\/uploads\/|\/images\/|https:\/\/)/i.test(v.trim()) ? v.trim() : '';
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (v: string) => v.replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function walk(node: Node): string {
  if (node.nodeType === NodeType.TEXT_NODE) return escText(node.rawText);
  if (!(node instanceof HTMLElement)) return '';
  const tag = (node.rawTagName || '').toLowerCase();
  if (DROP.has(tag)) return '';
  const inner = node.childNodes.map(walk).join('');
  const name = RENAME[tag] ?? tag;
  if (!KEEP.has(tag) && !RENAME[tag]) return inner;
  if (name === 'br' || name === 'hr') return `<${name}>`;
  if (name === 'img') {
    const src = safeImg(node.getAttribute('src') ?? '');
    if (!src) return '';
    const w = Number(node.getAttribute('width')), h = Number(node.getAttribute('height'));
    return `<img src="${esc(src)}" alt="${esc(node.getAttribute('alt') ?? '')}" loading="lazy"${w > 0 && w < 5000 ? ` width="${w}"` : ''}${h > 0 && h < 5000 ? ` height="${h}"` : ''}>`;
  }
  if (name === 'a') {
    const href = safeLink(node.getAttribute('href') ?? '');
    if (!href) return inner;
    const ext = /^https?:/i.test(href);
    return `<a href="${esc(href)}"${ext ? ' rel="noopener noreferrer" target="_blank"' : ''}>${inner}</a>`;
  }
  return `<${name}>${inner}</${name}>`;
}

export function sanitizeHtml(html: string): string {
  const root = parse(html, { blockTextElements: { script: false, style: false, pre: true } });
  return root.childNodes.map(walk).join('').trim();
}

export const plainText = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
export const readingMinutes = (html: string) => Math.max(1, Math.round(plainText(html).split(' ').filter(Boolean).length / 200));
