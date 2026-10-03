"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

/**
 * Language switcher — navigates to each language's docs root.
 * Per-page availability is handled separately by <PageLanguages />,
 * because this component lives in the (persistent) layout.
 */
const LANGS = [
  { code: "en", label: "English", href: "/docs" },
  { code: "zh", label: "中文", href: "/zh/docs" },
  { code: "id", label: "Bahasa Indonesia", href: "/id/docs" },
] as const;

export function LanguageSwitcher({ current }: { current: "en" | "zh" | "id" }) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch language"
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[rgba(77,75,91,0.5)] bg-transparent px-2.5 text-[13px] font-medium text-fd-muted-foreground transition-colors hover:bg-[#15151B] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Languages className="h-3.5 w-3.5" aria-hidden />
        <span className="font-mono uppercase">{current}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        className="min-w-44 border-[rgba(77,75,91,0.5)] bg-[#0B0B0F]"
      >
        {LANGS.map((l) => {
          const active = l.code === current;
          return (
            <DropdownMenuItem key={l.code} asChild disabled={active}>
              <Link
                href={active ? pathname : l.href}
                prefetch={false}
                aria-current={active ? "true" : undefined}
                className={
                  active
                    ? "pointer-events-none font-semibold text-[#5CB3F2]"
                    : "text-fd-muted-foreground"
                }
              >
                {l.label}
                <span className="ml-auto font-mono text-[10px] uppercase opacity-60">
                  {l.code}
                </span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
