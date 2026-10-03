import Link from "next/link";
import { source, sourceId, sourceZh } from "@/lib/source";

/**
 * Per-page language chips: shows the SAME page in every language it exists in.
 * Honest by construction — a language that lacks this page simply does not
 * appear. English is the source of truth; zh is complete; id is partial.
 */
export function PageLanguages({
  current,
  slug,
}: {
  current: "en" | "zh" | "id";
  slug?: string[];
}) {
  const targets: Array<{
    code: "en" | "zh" | "id";
    label: string;
    href: string;
    exists: boolean;
  }> = [
    {
      code: "en",
      label: "EN",
      href: slug ? `/docs/${slug.join("/")}` : "/docs",
      exists: slug ? Boolean(source.getPage(slug)) : true,
    },
    {
      code: "zh",
      label: "中文",
      href: slug ? `/zh/docs/${slug.join("/")}` : "/zh/docs",
      exists: slug ? Boolean(sourceZh.getPage(slug)) : true,
    },
    {
      code: "id",
      label: "ID",
      href: slug ? `/id/docs/${slug.join("/")}` : "/id/docs",
      exists: slug ? Boolean(sourceId.getPage(slug)) : true,
    },
  ];

  const available = targets.filter((t) => t.exists);
  if (available.length < 2) return null;

  return (
    <nav
      aria-label="Available languages for this page"
      className="mb-4 flex flex-wrap items-center gap-2 text-[13px]"
    >
      {available.map((t) =>
        t.code === current ? (
          <span
            key={t.code}
            aria-current="true"
            className="rounded-md border border-[rgba(2,130,216,0.4)] bg-[rgba(2,130,216,0.12)] px-2 py-0.5 font-semibold text-[#5CB3F2]"
          >
            {t.label}
          </span>
        ) : (
          <Link
            key={t.code}
            href={t.href}
            prefetch={false}
            className="rounded-md border border-[rgba(77,75,91,0.5)] px-2 py-0.5 text-fd-muted-foreground transition-colors hover:border-[rgba(2,130,216,0.5)] hover:text-white"
          >
            {t.label}
          </Link>
        ),
      )}
      <span className="sr-only">
        This page is also available in the linked languages.
      </span>
    </nav>
  );
}
