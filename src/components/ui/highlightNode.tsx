import { Highlight } from './Highlight';

/** Highlight only when the heading is a plain string. Server-safe wrapper. */
export function highlightNode(
  node: React.ReactNode,
  dark: boolean,
  fixedCity = false,
): React.ReactNode {
  return typeof node === 'string' ? <Highlight text={node} dark={dark} fixedCity={fixedCity} /> : node;
}
