import Link from "next/link";

/**
 * Shared severity badge + principle meta bar.
 *
 * Used by the Severity MDX component (inside principle bodies) and by the
 * docs page template (under the H1 of every principle page).
 * Palette: brand #070707 / #FFFFFF / #4D4B5B / #0282D8 only.
 */

const severityStyles: Record<string, string> = {
  critical: "border-[#ff6b6b]/40 bg-[#ff6b6b]/10 text-[#ff8787]",
  important: "border-[#0282D8]/40 bg-[#0282D8]/10 text-[#5cb3f2]",
  advisory: "border-[#4D4B5B]/60 bg-[#4D4B5B]/20 text-[#a8a5bd]",
};

export function SeverityBadge({ level }: { level: "critical" | "important" | "advisory" }) {
  return (
    <span
      data-severity={level}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${severityStyles[level]}`}
    >
      {level}
    </span>
  );
}

function MetaChip({ children, href }: { children: React.ReactNode; href?: string }) {
  const cls =
    "inline-flex items-center rounded-full border border-[#4D4B5B]/60 bg-[#4D4B5B]/20 px-2.5 py-0.5 text-xs font-medium text-[#a8a5bd]";
  if (href) {
    return (
      <Link href={href} className={`${cls} transition-colors hover:border-[#0282D8]/50 hover:text-[#5cb3f2]`}>
        {children}
      </Link>
    );
  }
  return <span className={cls}>{children}</span>;
}

export interface PrincipleMetaProps {
  category: string;
  type?: string;
  severity?: "critical" | "important" | "advisory";
  status?: string;
  verification?: string;
  tags?: string[];
}

/**
 * The meta row under a principle page H1:
 * category (linked) · type · severity badge · status · verification, then tags.
 */
export function PrincipleMeta({
  category,
  type,
  severity,
  status,
  verification,
  tags,
}: PrincipleMetaProps) {
  return (
    <div className="mb-6 flex flex-col gap-2.5" data-principle-meta>
      <div className="flex flex-wrap items-center gap-2">
        <MetaChip href={`/docs/principles/${category}`}>{category}</MetaChip>
        {type ? <MetaChip>{type}</MetaChip> : null}
        {severity ? <SeverityBadge level={severity} /> : null}
        <span className="font-mono text-xs text-fd-muted-foreground">
          status: {status ?? "draft"} · verification: {verification ?? "perlu"}
        </span>
      </div>
      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {tags.map((t) => (
            <span key={t} className="font-mono text-[11px] text-fd-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
