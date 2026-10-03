import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GitBranch, ShieldCheck, Layers, FlaskConical, Terminal, Languages, ScanSearch, Github } from "lucide-react";

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
    <div className={`rounded-xl border p-4 ${styles[level]}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot[level]}`} aria-hidden />
        <p className="font-mono text-sm font-bold uppercase tracking-wider text-white">{label}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#8B89A0]">{desc}</p>
    </div>
  );
}

const features = [
  {
    icon: ScanSearch,
    title: "Exhaustive archive, curated load",
    desc: "The archive may be exhaustive — what gets loaded into an agent is curated. Two concerns, separated explicitly through profiles, summaries, and severity.",
  },
  {
    icon: Layers,
    title: "One principle, one file",
    desc: "Every principle is a single markdown file with a fixed section order: AI instruction first, definition, when to use, when not to, anti-patterns, code, enforcement, real cases.",
  },
  {
    icon: ShieldCheck,
    title: "Technical enforcement, stated honestly",
    desc: "Principles in context only help an agent choose safer designs. They are not enforcers. Every principle names the technical control that actually prevents the failure.",
  },
  {
    icon: FlaskConical,
    title: "Evals, not vibes",
    desc: "Each priority category ships an eval scenario: run the same task with and without .principles/ and compare agent behavior against a rubric. Results recorded as they are.",
  },
  {
    icon: Terminal,
    title: "principai CLI",
    desc: "list, show, search, copy, profile, check, sync, status. Copy a subset into any project's .principles/ with an INDEX and an AGENTS.md snippet in one command.",
  },
  {
    icon: Languages,
    title: "Two languages, one truth",
    desc: "English is the source of truth. The Indonesian translation is derived via principai sync with source_hash drift detection — structure stays 1:1, meaning flows one way.",
  },
];

const categories = [
  {
    name: "Security",
    desc: "Scoping authority, validating input, failing closed.",
    href: "/docs/principles/security",
  },
  {
    name: "Reliability",
    desc: "Failures kept small, visible, and recoverable.",
    href: "/docs/principles/reliability",
  },
  {
    name: "Data",
    desc: "Backups that restore, deletes that are reversible.",
    href: "/docs/principles/data",
  },
  {
    name: "Architecture",
    desc: "Boundaries, dependencies, growth from simple beginnings.",
    href: "/docs/principles/architecture",
  },
  {
    name: "API",
    desc: "Contracts that are explicit, versioned, and honest.",
    href: "/docs/principles/api",
  },
  {
    name: "Design",
    desc: "Simplicity, judgment, and the laws of measures.",
    href: "/docs/principles/design",
  },
];

const steps = [
  {
    n: "01",
    title: "Pick a profile",
    desc: "destructive-ops for cleanup scripts and migrations, or any category that matches your work.",
  },
  {
    n: "02",
    title: "Copy into your project",
    desc: "principai copy --profile destructive-ops --to . writes .principles/ with INDEX.md and an AGENTS.md snippet.",
  },
  {
    n: "03",
    title: "Agent loads progressively",
    desc: "The agent reads INDEX, obeys must-follow principles in full, opens the rest only when the task touches them.",
  },
  {
    n: "04",
    title: "Stop before the irreversible",
    desc: "Critical principles and destructive actions require explicit human approval. The agent halts and asks.",
  },
];

export default function Home() {
  return (
    <main id="main" className="flex-1">
      {/* ===== Hero ===== */}
      <section className="hero-fade relative overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div
          className="absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #0282D8, transparent)" }}
          aria-hidden
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pb-20 pt-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pt-24">
          <div className="logo-blend order-1 w-56 shrink-0 sm:w-64 lg:order-0 lg:w-[26rem]">
            <Image
              src="/images/logo.webp"
              alt="PRINCIPAI logo: a muscular owl whose feathers are made of source code, flexing on a black background"
              width={880}
              height={880}
              priority
              sizes="(max-width: 1024px) 224px, 416px"
              className="h-auto w-full"
            />
          </div>
          <div className="order-2 max-w-2xl text-center lg:order-1 lg:text-left">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
              Software engineering principles
            </p>
            <h1 className="font-display mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Curated for
              <span className="text-brand block">AI agents.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#8B89A0]">
              A private library of software engineering principles in an AI-friendly format —
              so the agent that works on your project actually obeys them. Archive is
              exhaustive. What loads into context is small, relevant, and sharp.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/docs"
                className="glow-brand inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-6 text-base font-semibold text-white transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
               prefetch={false}>
                Read the library
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="https://github.com/LumineCode404/principai"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-[rgba(77,75,91,0.6)] bg-transparent px-6 text-base font-semibold text-white transition-colors hover:bg-[#15151B]"
              >
                <Github className="h-4 w-4" aria-hidden />
                GitHub
              </a>
            </div>
            <p className="mt-6 font-mono text-xs text-[#8B89A0]">
              read INDEX → obey must-follow → verify critical → halt before destructive ops
            </p>
          </div>
        </div>
      </section>

      {/* ===== Incident story ===== */}
      <section aria-labelledby="why-heading" className="border-t border-[rgba(77,75,91,0.35)] bg-[#0A0A0D]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
            Why this exists
          </p>
          <h2
            id="why-heading"
            className="font-display mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            A cleanup script once deleted a database.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8B89A0]">
            Broad credentials, no dry-run, no confirmation, non-idempotent deletes — the
            classic chain. Least Authority, Fail-Safe Defaults, and Idempotency exist
            precisely for this chain. And famously, it still happens: in 2017 an operator at
            GitLab deleted the wrong directory on a tired night and the database went with it.
            Principles in context make an agent pick the safer design. Technical controls
            actually stop the blast.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Least Authority",
                desc: "Credentials scoped read-only by default. A cleanup script never needs write-everything.",
                href: "/docs/principles/security/least-authority",
              },
              {
                name: "Fail-Safe Defaults",
                desc: "Dry-run on, destructive paths off, until a human explicitly flips them.",
                href: "/docs/principles/security/fail-safe-defaults",
              },
              {
                name: "Idempotency",
                desc: "Run twice, same result. Accidental re-runs become boring instead of fatal.",
                href: "/docs/principles/reliability/idempotency",
              },
            ].map((p) => (
              <Link
                key={p.name}
                href={p.href}
                prefetch={false}
                className="group rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6 transition-all hover:border-[rgba(2,130,216,0.5)] hover:bg-[#101017]"
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
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section aria-labelledby="features-heading" className="border-t border-[rgba(77,75,91,0.35)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
            Design
          </p>
          <h2
            id="features-heading"
            className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Built for how agents actually read
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6 transition-colors hover:border-[rgba(2,130,216,0.4)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(2,130,216,0.35)] bg-[rgba(2,130,216,0.1)]">
                  <f.icon className="h-5 w-5 text-[#0282D8]" aria-hidden />
                </div>
                <h3 className="font-display mt-4 text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8B89A0]">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Archive categories ===== */}
      <section aria-labelledby="archive-heading" className="border-t border-[rgba(77,75,91,0.35)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
                The archive
              </p>
              <h2
                id="archive-heading"
                className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Browse by category
              </h2>
            </div>
            <p className="max-w-xs font-mono text-xs leading-relaxed text-[#8B89A0]">
              status: sudah digali — every category below has files on disk. The honest list of
              what is not dug yet lives in the{" "}
              <Link href="/docs/taxonomy" prefetch={false} className="text-[#5CB3F2] underline decoration-[#5CB3F2]/50 underline-offset-4 hover:decoration-[#5CB3F2]">
                taxonomy
              </Link>
              .
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                prefetch={false}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-5 transition-all hover:border-[rgba(2,130,216,0.5)] hover:bg-[#101017]"
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
            ))}
          </div>
        </div>
      </section>

      {/* ===== Severity ===== */}
      <section aria-labelledby="severity-heading" className="border-t border-[rgba(77,75,91,0.35)] bg-[#0A0A0D]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
            Curation layer
          </p>
          <h2
            id="severity-heading"
            className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Three severity levels. One hard stop.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
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
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section aria-labelledby="how-heading" className="border-t border-[rgba(77,75,91,0.35)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
            Workflow
          </p>
          <h2
            id="how-heading"
            className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            From archive to agent in one command
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="relative overflow-hidden rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6"
              >
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
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#050506]">
            <div className="flex items-center gap-2 border-b border-[rgba(77,75,91,0.4)] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#FF6B6B]/70" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-[#4D4B5B]" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-[#0282D8]/70" aria-hidden />
              <span className="ml-3 font-mono text-xs text-[#8B89A0]">terminal</span>
            </div>
            <div className="overflow-x-auto p-5">
              <pre className="font-mono text-sm leading-7">
                <code>
                  <span className="text-[#8B89A0]">$</span>{" "}
                  <span className="text-white">bun run principai copy --profile destructive-ops --to .</span>
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
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section aria-labelledby="cta-heading" className="relative overflow-hidden border-t border-[rgba(77,75,91,0.35)]">
        <div
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{ background: "radial-gradient(60% 60% at 50% 100%, #0282D8, transparent)" }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-24 text-center sm:px-6">
          <GitBranch className="mx-auto h-8 w-8 text-[#0282D8]" aria-hidden />
          <h2
            id="cta-heading"
            className="font-display mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Ship safer software with agents that know better.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8B89A0]">
            The library stays honest: categories are marked sudah digali, belum digali, or
            tidak yakin — and it never claims to be complete. It grows one verified
            principle at a time.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/docs"
              className="glow-brand inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-7 text-base font-semibold text-white transition-transform hover:scale-[1.02]"
             prefetch={false}>
              Open the documentation
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/docs/getting-started/quickstart"
              className="inline-flex h-12 items-center rounded-xl border border-[rgba(77,75,91,0.6)] px-7 text-base font-semibold text-white transition-colors hover:bg-[#15151B]"
             prefetch={false}>
              Quickstart
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
