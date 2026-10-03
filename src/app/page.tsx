"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Layers,
  FlaskConical,
  Terminal,
  Languages,
  ScanSearch,
  BookOpenText,
  AudioLines,
  Database,
} from "lucide-react";
import { registryStats } from "@/data/registry";
import { Reveal, Stagger, Item, Lift, HeroSpotlight } from "@/components/motion";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const failureChain = [
  { stage: "01", label: "broad credentials", note: "migration-grade key in a cron job" },
  { stage: "02", label: "no dry-run", note: "destructive path is the default path" },
  { stage: "03", label: "no confirmation", note: "nothing forces a human pause" },
  { stage: "04", label: "non-idempotent delete", note: "re-run doubles the damage" },
  { stage: "05", label: "untested backups", note: "restore fails when it matters" },
];

const features = [
  {
    icon: ScanSearch,
    title: "Exhaustive archive, curated load",
    desc: "The archive may be exhaustive — what loads into an agent is curated. Two concerns, separated explicitly through profiles, summaries, and severity.",
  },
  {
    icon: Layers,
    title: "One principle, one file",
    desc: "Every principle is a single markdown file with a fixed section order: AI instruction first, definition, when to use, when not to, anti-patterns, code, enforcement, real cases.",
  },
  {
    icon: ShieldCheck,
    title: "Technical enforcement, stated honestly",
    desc: "Principles in context only help an agent choose safer designs. They are not enforcers. Every principle names the technical control that actually stops the failure.",
  },
  {
    icon: FlaskConical,
    title: "Evals, not vibes",
    desc: "Each priority category ships an eval scenario: run the same task with and without .principles/ and compare agent behavior against a rubric. Results recorded as they are.",
  },
  {
    icon: Terminal,
    title: "Principai CLI",
    desc: "list, show, search, copy, profile, check, sync, status. Copy a subset into any project's .principles/ with an INDEX and an AGENTS.md snippet in one command.",
  },
  {
    icon: Languages,
    title: "Three languages, one truth",
    desc: "English is the source of truth. Indonesian and Chinese are derived via source_hash drift detection — structure stays 1:1, meaning flows one way. Chinese pages carry voice summaries.",
  },
];

const categories = [
  { name: "Security", desc: "Scoping authority, validating input, failing closed.", href: "/docs/principles/security" },
  { name: "Reliability", desc: "Failures kept small, visible, and recoverable.", href: "/docs/principles/reliability" },
  { name: "Data", desc: "Backups that restore, deletes that are reversible.", href: "/docs/principles/data" },
  { name: "Architecture", desc: "Boundaries, dependencies, growth from simple beginnings.", href: "/docs/principles/architecture" },
  { name: "API", desc: "Contracts that are explicit, versioned, and honest.", href: "/docs/principles/api" },
  { name: "Design", desc: "Simplicity, judgment, and the laws of measures.", href: "/docs/principles/design" },
  { name: "Testing", desc: "Evidence with an economics — suite shape, behavior over implementation.", href: "/docs/principles/testing" },
];

const steps = [
  { n: "01", title: "Pick a profile", desc: "destructive-ops for cleanup scripts and migrations, or any category that matches your work." },
  { n: "02", title: "Copy into your project", desc: "principai copy --profile destructive-ops --to . writes .principles/ with INDEX.md and an AGENTS.md snippet." },
  { n: "03", title: "Agent loads progressively", desc: "The agent reads INDEX, obeys must-follow principles in full, opens the rest only when the task touches them." },
  { n: "04", title: "Stop before the irreversible", desc: "Critical principles and destructive actions require explicit human approval. The agent halts and asks." },
];

const languages = [
  {
    code: "EN",
    label: "English",
    desc: "The source of truth — every principle written and reviewed here first.",
    href: "/docs",
    extra: "the canon",
  },
  {
    code: "中文",
    label: "Chinese",
    desc: "全部原则的完整中文翻译，每条原则带语音摘要。",
    href: "/zh/docs",
    extra: "voice summaries",
    voice: true,
  },
  {
    code: "ID",
    label: "Bahasa Indonesia",
    desc: "Terjemahan penuh seluruh arsip — draf sampai ditinjau manusia, arti tetap mengalir dari bahasa Inggris.",
    href: "/id/docs",
    extra: "full archive",
  },
];

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function SectionKicker({ index, children }: { index: string; children: string }) {
  return (
    <Reveal y={12}>
      <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
        <span aria-hidden className="text-[#8B89A0]">{index}</span>
        <span aria-hidden className="h-px w-8 bg-[#4D4B5B]/70" />
        {children}
      </p>
    </Reveal>
  );
}

function SeverityChip({ level, label, desc }: { level: string; label: string; desc: string }) {
  const styles: Record<string, string> = {
    critical: "border-[#FF6B6B]/40 bg-[#FF6B6B]/10",
    important: "border-[#0282D8]/40 bg-[#0282D8]/10",
    advisory: "border-[#4D4B5B]/60 bg-[#4D4B5B]/15",
  };
  const dot: Record<string, string> = {
    critical: "bg-[#FF6B6B]",
    important: "bg-[#0282D8]",
    advisory: "bg-[#8B89A0]",
  };
  return (
    <Item>
      <Lift className="h-full">
        <div className={`h-full rounded-xl border p-5 ${styles[level]}`}>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dot[level]} opacity-40`} aria-hidden />
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot[level]}`} aria-hidden />
            </span>
            <p className="font-mono text-sm font-bold uppercase tracking-wider text-white">{label}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#8B89A0]">{desc}</p>
        </div>
      </Lift>
    </Item>
  );
}

/** Typed terminal line — starts typing when scrolled into view. */
function TypedCommand({ command }: { command: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced ? command.length : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= command.length) clearInterval(id);
    }, 34);
    return () => clearInterval(id);
  }, [inView, command, reduced]);

  return (
    <span ref={ref} className="text-white">
      {command.slice(0, typed)}
      {typed < command.length && (
        <span aria-hidden className="ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] animate-pulse bg-[#5CB3F2]" />
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const stats = registryStats();

  return (
    <main id="main" className="flex-1">
      {/* ================= Hero ================= */}
      <section className="hero-fade relative overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div
          className="absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #0282D8, transparent)" }}
          aria-hidden
        />
        <HeroSpotlight />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pb-20 pt-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pt-24">
          <div className="logo-blend order-1 w-56 shrink-0 sm:w-64 lg:order-0 lg:w-[26rem]">
            <motion.div
              initial={false}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
            >
              <Image
                src="/images/logo.webp"
                alt="Principai logo: a muscular owl whose feathers are made of source code, flexing on a black background"
                width={880}
                height={880}
                priority
                sizes="(max-width: 1024px) 224px, 416px"
                className="h-auto w-full"
              />
            </motion.div>
          </div>
          <div className="order-2 max-w-2xl text-center lg:order-1 lg:text-left">
            <div className="hero-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(2,130,216,0.35)] bg-[rgba(2,130,216,0.08)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#5CB3F2]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#0282D8]" />
                Software engineering principles
              </p>
            </div>
            <h1 className="font-display mt-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="hero-up block" style={{ ["--d" as never]: "0.05s"} }>
                <span className="block">A public library,</span>
              </span>
              <span className="hero-up block" style={{ ["--d" as never]: "0.12s"} }>
                <span className="block">
                  curated for <span className="text-brand">AI agents.</span>
                </span>
              </span>
            </h1>
            <div className="hero-up" style={{ ["--d" as never]: "0.2s"} }>
              <p className="mt-6 text-lg leading-relaxed text-[#8B89A0]">
                Software engineering principles in an AI-friendly format — open to anyone,
                built so the agent that works on your project actually obeys them. The
                archive is exhaustive. What loads into context is small, relevant, and sharp.
              </p>
            </div>
            <div className="hero-up" style={{ ["--d" as never]: "0.28s"} }>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Lift>
                  <Link
                    href="/docs"
                    className="glow-brand inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-6 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                    prefetch={false}
                  >
                    Read the library
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Lift>
                <Lift>
                  <a
                    href="https://github.com/LumineCode404/principai"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-[rgba(77,75,91,0.6)] bg-transparent px-6 text-base font-semibold text-white transition-colors hover:bg-[#15151B]"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
                      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.05.77 2.12 0 1.54-.01 2.77-.01 3.15 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                    </svg>
                    GitHub
                  </a>
                </Lift>
              </div>
            </div>
            <div className="hero-up" style={{ ["--d" as never]: "0.36s"} }>
              <p className="mt-6 font-mono text-xs text-[#8B89A0]">
                read INDEX → obey must-follow → verify critical → halt before destructive ops
              </p>
              <p className="mt-3 font-mono text-xs text-[#8B89A0]">
                <Link href="/zh" prefetch={false} className="text-[#5CB3F2] transition-colors hover:text-white">中文</Link>
                <span aria-hidden className="mx-2">·</span>
                <Link href="/id" prefetch={false} className="text-[#5CB3F2] transition-colors hover:text-white">Bahasa Indonesia</Link>
                <span aria-hidden className="mx-2">·</span>
                English
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Failure chain ================= */}
      <section aria-labelledby="why-heading" className="border-t border-[rgba(77,75,91,0.35)] bg-[#0A0A0D]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <SectionKicker index="01">Why this exists</SectionKicker>
          <Reveal y={16}>
            <h2 id="why-heading" className="font-display mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              A cleanup script once deleted a database.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8B89A0]">
              Not a hack, not a freak accident — a chain of small, reasonable omissions.
              Principles in context make an agent pick the safer design. Technical controls
              actually stop the blast. Both are needed, in that order.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="relative mt-10 grid gap-3 md:grid-cols-5" aria-label="The failure chain behind the first eval">
              <span aria-hidden className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-transparent via-[#4D4B5B]/60 to-transparent md:block" />
              {failureChain.map((f) => (
                <li key={f.stage} className="relative rounded-xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-[13px] w-[13px] items-center justify-center rounded-full border border-[#FF6B6B]/60 bg-[#070707]" aria-hidden>
                      <span className="h-[5px] w-[5px] rounded-full bg-[#FF6B6B]" />
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#8B89A0]">{f.stage}</span>
                  </div>
                  <p className="mt-2.5 text-sm font-semibold text-white">{f.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#8B89A0]">{f.note}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Stagger className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { name: "Least Authority", desc: "Credentials scoped read-only by default. A cleanup script never needs write-everything.", href: "/docs/principles/security/least-authority" },
              { name: "Fail-Safe Defaults", desc: "Dry-run on, destructive paths off, until a human explicitly flips them.", href: "/docs/principles/security/fail-safe-defaults" },
              { name: "Idempotency", desc: "Run twice, same result. Accidental re-runs become boring instead of fatal.", href: "/docs/principles/reliability/idempotency" },
            ].map((p) => (
              <Item key={p.name}>
                <Lift className="h-full">
                  <Link
                    href={p.href}
                    prefetch={false}
                    className="group flex h-full flex-col rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6 transition-colors hover:border-[rgba(2,130,216,0.5)] hover:bg-[#101017]"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
                      <ArrowRight
                        className="h-4 w-4 text-[#8B89A0] transition-all group-hover:translate-x-0.5 group-hover:text-[#0282D8]"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#8B89A0]">{p.desc}</p>
                  </Link>
                </Lift>
              </Item>
            ))}
          </Stagger>
          <Reveal y={10}>
            <p className="mt-6 text-sm text-[#8B89A0]">
              The canonical public telling is GitLab, January 2017 —{" "}
              <a
                href="https://about.gitlab.com/blog/2017/02/01/gitlab-dotcom-database-incident/"
                className="text-[#5CB3F2] underline decoration-[#5CB3F2]/40 underline-offset-4 transition-colors hover:decoration-[#5CB3F2]"
                rel="noopener noreferrer"
              >
                read the postmortem
              </a>{" "}
              before you read anything here about it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= Registry ================= */}
      <section aria-labelledby="registry-heading" className="border-t border-[rgba(77,75,91,0.35)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <SectionKicker index="02">The registry</SectionKicker>
          <Reveal y={16}>
            <h2 id="registry-heading" className="font-display mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Exhaustive, by method — not by slogan.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8B89A0]">
              A research-backed catalog of engineering principles, laws, heuristics, and
              practices across {stats.total > 300 ? "eighteen" : "many"} domains — every entry
              with its source, every gap tracked with the three status words. What has been
              dug into a full page is linked; what has not is listed, honestly, as{" "}
              <em>belum digali</em>.
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
            <Item>
              <div className="rounded-2xl border border-[rgba(2,130,216,0.35)] bg-[rgba(2,130,216,0.06)] p-6">
                <p className="font-display text-4xl font-black text-white">{stats.total}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#8B89A0]">
                  researched entries
                </p>
              </div>
            </Item>
            <Item>
              <div className="rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6">
                <p className="font-display text-4xl font-black text-white">{stats.dug}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#8B89A0]">
                  dug into full pages
                </p>
              </div>
            </Item>
            <Item>
              <div className="rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6">
                <p className="font-display text-4xl font-black text-white">18</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#8B89A0]">
                  domains mapped
                </p>
              </div>
            </Item>
          </Stagger>
          <Reveal y={12}>
            <div className="mt-8">
              <Lift className="inline-block">
                <Link
                  href="/registry"
                  prefetch={false}
                  className="group inline-flex h-12 items-center gap-2 rounded-xl border border-[rgba(2,130,216,0.5)] bg-[rgba(2,130,216,0.08)] px-6 text-base font-semibold text-[#5CB3F2] transition-colors hover:bg-[rgba(2,130,216,0.16)]"
                >
                  <BookOpenText className="h-4 w-4" aria-hidden />
                  Browse the registry
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </Lift>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= Features ================= */}
      <section aria-labelledby="features-heading" className="border-t border-[rgba(77,75,91,0.35)] bg-[#0A0A0D]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <SectionKicker index="03">Design</SectionKicker>
          <Reveal y={16}>
            <h2 id="features-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Built for how agents actually read
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Item key={f.title}>
                <Lift className="h-full">
                  <article className="group h-full rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6 transition-colors hover:border-[rgba(2,130,216,0.4)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(2,130,216,0.35)] bg-[rgba(2,130,216,0.1)] transition-transform group-hover:scale-105">
                      <f.icon className="h-5 w-5 text-[#0282D8]" aria-hidden />
                    </div>
                    <h3 className="font-display mt-4 text-lg font-bold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#8B89A0]">{f.desc}</p>
                  </article>
                </Lift>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================= Archive ================= */}
      <section aria-labelledby="archive-heading" className="border-t border-[rgba(77,75,91,0.35)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionKicker index="04">The archive</SectionKicker>
              <Reveal y={16}>
                <h2 id="archive-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Browse by category
                </h2>
              </Reveal>
            </div>
            <Reveal y={10}>
              <p className="max-w-xs font-mono text-xs leading-relaxed text-[#8B89A0]">
                status: sudah digali — every category below has files on disk. The honest
                list of what is not dug yet lives in the{" "}
                <Link href="/docs/taxonomy" prefetch={false} className="text-[#5CB3F2] underline decoration-[#5CB3F2]/50 underline-offset-4 hover:decoration-[#5CB3F2]">
                  taxonomy
                </Link>
                .
              </p>
            </Reveal>
          </div>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Item key={c.name}>
                <Lift className="h-full">
                  <Link
                    href={c.href}
                    prefetch={false}
                    className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-5 transition-colors hover:border-[rgba(2,130,216,0.5)] hover:bg-[#101017]"
                  >
                    <div>
                      <h3 className="font-display text-base font-bold text-white">{c.name}</h3>
                      <p className="mt-1 text-sm text-[#8B89A0]">{c.desc}</p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-[#8B89A0] transition-all group-hover:translate-x-0.5 group-hover:text-[#0282D8]"
                      aria-hidden
                    />
                  </Link>
                </Lift>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================= Severity ================= */}
      <section aria-labelledby="severity-heading" className="border-t border-[rgba(77,75,91,0.35)] bg-[#0A0A0D]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <SectionKicker index="05">Curation layer</SectionKicker>
          <Reveal y={16}>
            <h2 id="severity-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Three severity levels. One hard stop.
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            <SeverityChip
              level="critical"
              label="critical"
              desc="Violating can cause unrecoverable loss — data gone, secrets leaked, people harmed. An agent must not break these without explicit human approval."
            />
            <SeverityChip
              level="important"
              label="important"
              desc="A strong default. You may deviate, but the reason must be written down where reviewers will see it."
            />
            <SeverityChip
              level="advisory"
              label="advisory"
              desc="A consideration worth weighing. Good tiebreakers when two designs look equal."
            />
          </Stagger>
        </div>
      </section>

      {/* ================= Languages ================= */}
      <section aria-labelledby="languages-heading" className="border-t border-[rgba(77,75,91,0.35)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <SectionKicker index="06">Three languages, one truth</SectionKicker>
          <Reveal y={16}>
            <h2 id="languages-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Read it in your language. Trust it in one.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8B89A0]">
              English is the single source of truth; Indonesian and Chinese are derived
              trees with hash-tracked drift detection. The Chinese archive is complete — and
              it is the only one with voice: every principle can be listened to, because a
              language you can hear is a language you can check.
            </p>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {languages.map((l) => (
              <Item key={l.code}>
                <Lift className="h-full">
                  <Link
                    href={l.href}
                    prefetch={false}
                    className="group flex h-full flex-col rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6 transition-colors hover:border-[rgba(2,130,216,0.5)] hover:bg-[#101017]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-black text-white">{l.code}</span>
                      {l.voice ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(2,130,216,0.4)] bg-[rgba(2,130,216,0.1)] px-2.5 py-1 text-[11px] font-bold text-[#5CB3F2]">
                          <AudioLines className="h-3 w-3" aria-hidden />
                          voice
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B89A0]">
                          {l.extra}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#8B89A0]">{l.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#5CB3F2]">
                      Enter the archive
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </Lift>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================= Workflow ================= */}
      <section aria-labelledby="how-heading" className="border-t border-[rgba(77,75,91,0.35)] bg-[#0A0A0D]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <SectionKicker index="07">Workflow</SectionKicker>
          <Reveal y={16}>
            <h2 id="how-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              From archive to agent in one command
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <Item key={s.n}>
                <div className="relative h-full overflow-hidden rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6">
                  <div
                    aria-hidden
                    className="font-display pointer-events-none absolute -right-2 -top-4 h-24 w-28 bg-contain bg-right bg-no-repeat opacity-60"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 112 96'%3E%3Ctext x='0' y='76' font-family='Montserrat, Arial, sans-serif' font-size='84' font-weight='900' fill='%234D4B5B'%3E${s.n}%3C/text%3E%3C/svg%3E")`,
                    }}
                  />
                  <h3 className="font-display text-base font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8B89A0]">{s.desc}</p>
                </div>
              </Item>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#050506] shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-[rgba(77,75,91,0.4)] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#FF6B6B]/70" aria-hidden />
                <span className="h-3 w-3 rounded-full bg-[#4D4B5B]" aria-hidden />
                <span className="h-3 w-3 rounded-full bg-[#0282D8]/70" aria-hidden />
                <span className="ml-3 font-mono text-xs text-[#8B89A0]">terminal</span>
                <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] text-[#8B89A0]">
                  <Database className="h-3 w-3" aria-hidden />
                  .principles/
                </span>
              </div>
              <div className="overflow-x-auto p-5">
                <pre className="font-mono text-sm leading-7">
                  <code>
                    <span className="text-[#8B89A0]">$</span>{" "}
                    <TypedCommand command="bun run principai copy --profile destructive-ops --to ." />
                    {"\n"}
                    <span className="text-[#8B89A0]">  ✓ 11 principles → .principles/</span>
                    {"\n"}
                    <span className="text-[#8B89A0]">  ✓ INDEX.md written (name · summary · severity)</span>
                    {"\n"}
                    <span className="text-[#8B89A0]">  ✓ AGENTS.md snippet written</span>
                    {"\n"}
                    <span className="text-[#8B89A0]">  ⚠ critical principles present: agent must ask before destructive ops</span>
                  </code>
                </pre>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section aria-labelledby="cta-heading" className="relative overflow-hidden border-t border-[rgba(77,75,91,0.35)]">
        <div
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{ background: "radial-gradient(60% 60% at 50% 100%, #0282D8, transparent)" }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-24 text-center sm:px-6">
          <Reveal y={14}>
            <GitBranch className="mx-auto h-8 w-8 text-[#0282D8]" aria-hidden />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="cta-heading" className="font-display mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ship safer software with agents that know better.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8B89A0]">
              The library stays honest: categories are marked sudah digali, belum digali, or
              tidak yakin — and it never claims to be complete. It grows one verified
              principle at a time.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Lift>
                <Link
                  href="/docs"
                  className="glow-brand inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-7 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                  prefetch={false}
                >
                  Open the documentation
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Lift>
              <Lift>
                <Link
                  href="/docs/getting-started/quickstart"
                  className="inline-flex h-12 items-center rounded-xl border border-[rgba(77,75,91,0.6)] px-7 text-base font-semibold text-white transition-colors hover:bg-[#15151B]"
                  prefetch={false}
                >
                  Quickstart
                </Link>
              </Lift>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
