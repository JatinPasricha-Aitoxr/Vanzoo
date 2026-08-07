/**
 * Joins class names, dropping falsy entries.
 *
 * Deliberately not `tailwind-merge` — no component here relies on later classes
 * overriding earlier ones, so the extra dependency and its runtime cost would
 * buy nothing.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
