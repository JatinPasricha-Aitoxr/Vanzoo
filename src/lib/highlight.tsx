import { Fragment } from 'react';

/**
 * Wraps each `phrases` match inside `text` in a gold marker-highlight. Matching
 * is case-insensitive and the first occurrence of each phrase is highlighted,
 * so a copy edit that drops a phrase degrades to plain text instead of failing.
 */
export function highlight(text: string, phrases: readonly string[] = [], className = 'hl') {
  const spans: { start: number; end: number }[] = [];
  const lower = text.toLowerCase();
  for (const phrase of phrases) {
    const at = lower.indexOf(phrase.toLowerCase());
    if (at < 0) continue;
    const end = at + phrase.length;
    if (spans.some((span) => at < span.end && end > span.start)) continue;
    spans.push({ start: at, end });
  }
  spans.sort((a, b) => a.start - b.start);

  const out: React.ReactNode[] = [];
  let cursor = 0;
  spans.forEach((span, index) => {
    if (span.start > cursor) out.push(<Fragment key={`t${index}`}>{text.slice(cursor, span.start)}</Fragment>);
    out.push(
      <mark key={`m${index}`} className={className}>
        {text.slice(span.start, span.end)}
      </mark>,
    );
    cursor = span.end;
  });
  if (cursor < text.length) out.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>);
  return out;
}
