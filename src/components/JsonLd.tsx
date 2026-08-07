/**
 * Renders a JSON-LD block. Kept as a server component with no client cost —
 * the payload ships as inline text, never as hydrated JS.
 *
 * The `>` escape prevents a `</script>` sequence inside any string value from
 * closing the tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- structured data must be inlined as raw JSON
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
