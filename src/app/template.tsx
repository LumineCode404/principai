/**
 * Root template — remounts on navigation, giving every route a fast,
 * opacity-only crossfade. Pure CSS: no JS, no hydration dependency, and
 * disabled entirely for users who prefer reduced motion (content appears
 * instantly).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
