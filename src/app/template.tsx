/**
 * Page transition.
 *
 * `template.tsx` remounts on every navigation (unlike `layout.tsx`, which
 * persists), so this element is recreated per route and its entrance animation
 * replays. That gives a transition with no client-side router subscription and
 * no state to keep in sync.
 *
 * It stays a server component — the animation is pure CSS, so nothing here adds
 * to the client bundle.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
