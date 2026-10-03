"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpenText, Search } from "lucide-react";
import {
  REGISTRY,
  REGISTRY_DOMAINS,
  registryStats,
  type RegistryEntry,
} from "@/data/registry";
import { Reveal, Lift } from "@/components/motion";

const PAGE_SIZE = 40;

function statusChip(status: RegistryEntry["status"]) {
  if (status === "sudah digali") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full border border-[rgba(2,130,216,0.45)] bg-[rgba(2,130,216,0.1)] px-2 py-0.5 text-[11px] font-semibold text-[#5CB3F2]">
        sudah digali
      </span>
    );
  }
  if (status === "tidak yakin") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full border border-[rgba(255,107,107,0.4)] bg-[rgba(255,107,107,0.07)] px-2 py-0.5 text-[11px] font-semibold text-[#FF9B9B]">
        tidak yakin
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-[rgba(77,75,91,0.5)] bg-[rgba(77,75,91,0.12)] px-2 py-0.5 text-[11px] font-medium text-[#8B89A0]">
      belum digali
    </span>
  );
}

function EntryRow({ entry, index }: { entry: RegistryEntry; index: number }) {
  const domain = REGISTRY_DOMAINS.find((d) => d.id === entry.domain);
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, delay: Math.min(index * 0.015, 0.4) }}
      className="rounded-xl border border-[rgba(77,75,91,0.35)] bg-[#0E0E12] p-4 transition-colors hover:border-[rgba(2,130,216,0.4)]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
        {entry.href ? (
          <Link
            href={entry.href}
            prefetch={false}
            className="group inline-flex items-baseline gap-1.5 font-semibold text-white hover:text-[#5CB3F2]"
          >
            {entry.name}
            <ArrowRight className="h-3 w-3 translate-y-[-1px] text-[#4D4B5B] transition-all group-hover:translate-x-0.5 group-hover:text-[#0282D8]" aria-hidden />
          </Link>
        ) : (
          <p className="font-semibold text-white">{entry.name}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#4D4B5B]">
            {domain?.label ?? entry.domain}
          </span>
          {statusChip(entry.status)}
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#8B89A0]">{entry.def}</p>
      <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#4D4B5B]">{entry.src}</p>
    </motion.li>
  );
}

export default function RegistryPage() {
  const stats = registryStats();
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REGISTRY.filter((e) => {
      if (domain !== "all" && e.domain !== domain) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.def.toLowerCase().includes(q) ||
        e.src.toLowerCase().includes(q) ||
        e.domain.toLowerCase().includes(q)
      );
    });
  }, [query, domain]);

  const shown = filtered.slice(0, visible);
  const domainCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of REGISTRY) m.set(e.domain, (m.get(e.domain) ?? 0) + 1);
    return m;
  }, []);

  return (
    <main id="main" className="flex-1">
      <section className="hero-fade relative overflow-hidden border-b border-[rgba(77,75,91,0.35)]">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div
          className="absolute -top-40 left-1/2 h-[380px] w-[680px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #0282D8, transparent)" }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-16">
          <div className="hero-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(2,130,216,0.35)] bg-[rgba(2,130,216,0.08)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#5CB3F2]">
              <BookOpenText className="h-3 w-3" aria-hidden />
              The registry
            </p>
          </div>
          <div className="hero-up" style={{ ["--d" as never]: "0.06s"} }>
            <h1 className="font-display mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
              Every principle we could source. Nothing we couldn&rsquo;t.
            </h1>
          </div>
          <div className="hero-up" style={{ ["--d" as never]: "0.14s"} }>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#8B89A0]">
              {stats.total} principles, laws, heuristics, and practices across{" "}
              {REGISTRY_DOMAINS.length} domains — each with its definition and its source,
              gathered from primary literature rather than listicles. {stats.dug} have been
              dug into full pages (linked); the rest are tracked honestly as{" "}
              <em>belum digali</em>. This catalog is long because research is wide — it
              claims nothing about completeness, and it never will.
            </p>
          </div>
          <div className="hero-up" style={{ ["--d" as never]: "0.22s"} }>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B89A0]" aria-hidden />
                <label htmlFor="registry-search" className="sr-only">
                  Search the registry by name, definition, or source
                </label>
                <input
                  id="registry-search"
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisible(PAGE_SIZE);
                  }}
                  placeholder="Search name, definition, or source…"
                  className="h-11 w-72 max-w-full rounded-xl border border-[rgba(77,75,91,0.5)] bg-[#0E0E12] pl-9 pr-4 text-sm text-white placeholder:text-[#4D4B5B] focus:border-[rgba(2,130,216,0.6)] focus:outline-none focus:ring-2 focus:ring-[rgba(2,130,216,0.35)]"
                />
              </div>
              <a
                href="/registry.json"
                className="inline-flex h-11 items-center rounded-xl border border-[rgba(77,75,91,0.5)] px-4 font-mono text-[13px] text-[#8B89A0] transition-colors hover:border-[rgba(2,130,216,0.5)] hover:text-white"
              >
                registry.json
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Registry entries" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {/* Domain filters */}
        <Reveal y={10}>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by domain">
            <button
              type="button"
              aria-pressed={domain === "all"}
              onClick={() => {
                setDomain("all");
                setVisible(PAGE_SIZE);
              }}
              className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                domain === "all"
                  ? "border-[rgba(2,130,216,0.5)] bg-[rgba(2,130,216,0.12)] text-[#5CB3F2]"
                  : "border-[rgba(77,75,91,0.5)] text-[#8B89A0] hover:border-[rgba(2,130,216,0.4)] hover:text-white"
              }`}
            >
              All <span className="font-mono text-[11px] opacity-70">{stats.total}</span>
            </button>
            {REGISTRY_DOMAINS.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={domain === d.id}
                onClick={() => {
                  setDomain(d.id);
                  setVisible(PAGE_SIZE);
                }}
                title={d.blurb}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  domain === d.id
                    ? "border-[rgba(2,130,216,0.5)] bg-[rgba(2,130,216,0.12)] text-[#5CB3F2]"
                    : "border-[rgba(77,75,91,0.5)] text-[#8B89A0] hover:border-[rgba(2,130,216,0.4)] hover:text-white"
                }`}
              >
                {d.label} <span className="font-mono text-[11px] opacity-70">{domainCounts.get(d.id)}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Results meta */}
        <p aria-live="polite" className="mt-6 font-mono text-xs text-[#8B89A0]">
          {filtered.length === REGISTRY.length
            ? `showing ${shown.length} of ${filtered.length} entries`
            : `${filtered.length} matching entries — showing ${shown.length}`}
        </p>

        {/* Entries */}
        <ul className="mt-4 grid gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((e, i) => (
              <EntryRow key={`${e.domain}-${e.name}`} entry={e} index={i} />
            ))}
          </AnimatePresence>
        </ul>

        {filtered.length === 0 && (
          <p className="mt-10 rounded-xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6 text-center text-sm text-[#8B89A0]">
            Nothing matches that search. The registry contains what research surfaced —
            absence here is not a claim that a principle does not exist.
          </p>
        )}

        {visible < filtered.length && (
          <div className="mt-8 flex justify-center">
            <Lift>
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[rgba(2,130,216,0.5)] bg-[rgba(2,130,216,0.08)] px-6 text-sm font-semibold text-[#5CB3F2] transition-colors hover:bg-[rgba(2,130,216,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
                <span aria-hidden className="font-mono text-xs opacity-70">
                  {shown.length}/{filtered.length}
                </span>
              </button>
            </Lift>
          </div>
        )}
      </section>
    </main>
  );
}
