#!/usr/bin/env bun
/**
 * PRINCIPAI CLI — principai
 *
 * A small, zero-heavy-deps CLI over the principle library.
 *
 * Two jobs:
 *   1. Copy curated subsets of principles into target projects (.principles/)
 *   2. Keep the library honest (check, status, sync)
 *
 * Library layout (relative to repo root):
 *   content/docs/principles/<category>/<slug>.mdx   — the archive (EN, source of truth)
 *   content/docs/profiles/<name>.mdx               — profiles (must_follow / consider in frontmatter)
 *   content/docs/taxonomy.mdx                      — living taxonomy (status words)
 *   translations/id/...                            — derived Indonesian tree (sync output)
 *
 * Status vocabulary (the only allowed status words, no completeness claims):
 *   sudah digali · belum digali · tidak yakin
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync, copyFileSync } from "node:fs";
import { join, dirname, basename, relative, resolve } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), "..");
const DOCS = join(ROOT, "content", "docs");
const PRINCIPLES_DIR = join(DOCS, "principles");
const PROFILES_DIR = join(DOCS, "profiles");
const ID_DIR = join(ROOT, "translations", "id");

// ---------------------------------------------------------------------------
// Tiny YAML-subset frontmatter parser (flat keys, strings, lists)
// ---------------------------------------------------------------------------

interface Frontmatter {
  [key: string]: string | string[] | boolean | undefined;
  __body: string;
}

function parseFrontmatter(raw: string): Frontmatter {
  const fm: Frontmatter = { __body: raw };
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return fm;
  const lines = m[1].split(/\r?\n/);
  let currentKey: string | null = null;
  for (const line of lines) {
    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const value = kv[2].trim();
      if (value === "") {
        // may become a block list
        currentKey = key;
        fm[key] = "";
        continue;
      }
      currentKey = null;
      if (value.startsWith("[") && value.endsWith("]")) {
        const inner = value.slice(1, -1);
        fm[key] = inner
          .split(",")
          .map((s) => unquote(s.trim()))
          .filter((s) => s.length > 0);
      } else {
        fm[key] = unquote(value);
      }
    } else if (/^\s+-\s/.test(line) && currentKey) {
      const item = unquote(line.replace(/^\s+-\s*/, "").trim());
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      (fm[currentKey] as string[]).push(item);
    }
  }
  fm.__body = raw.slice(m[0].length);
  return fm;
}

function unquote(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function asList(v: string | string[] | boolean | undefined): string[] {
  if (v === undefined || v === "") return [];
  if (Array.isArray(v)) return v;
  return [String(v)];
}

// ---------------------------------------------------------------------------
// Library scanning
// ---------------------------------------------------------------------------

interface Principle {
  slug: string; // e.g. security/least-authority
  name: string; // title
  file: string; // absolute path
  fm: Frontmatter;
  aliases: string[];
  severity: string;
  type: string;
  category: string;
  tags: string[];
  appliesTo: string[];
  summary: string;
  status: string;
  verification: string;
  related: string[]; // slugs extracted from body links
  lines: number;
}

function walk(dir: string, ext = ".mdx"): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p, ext));
    // index.mdx files are category navigation pages for the website, not
    // principles — excluded everywhere (check, sync, copy, list, status).
    else if (entry.endsWith(ext) && entry !== "index.mdx") out.push(p);
  }
  return out;
}

function slugOf(file: string): string {
  return relative(PRINCIPLES_DIR, file).replace(/\.mdx$/, "");
}

function scanPrinciples(): Principle[] {
  const principles: Principle[] = [];
  for (const file of walk(PRINCIPLES_DIR)) {
    const raw = readFileSync(file, "utf8");
    const fm = parseFrontmatter(raw);
    const body = fm.__body;
    const related = new Set<string>();
    for (const m of body.matchAll(/\]\(\/docs\/principles\/([a-z0-9/-]+)\)/g)) {
      related.add(m[1]);
    }
    principles.push({
      slug: slugOf(file),
      name: String(fm.title ?? basename(file)),
      file,
      fm,
      aliases: asList(fm.aliases).map((a) => a.toLowerCase()),
      severity: String(fm.severity ?? ""),
      type: String(fm.type ?? ""),
      category: relative(PRINCIPLES_DIR, file).split("/")[0] ?? "",
      tags: asList(fm.tags),
      appliesTo: asList(fm.applies_to),
      summary: String(fm.summary ?? ""),
      status: String(fm.status ?? ""),
      verification: String(fm.verification ?? ""),
      related: [...related],
      lines: raw.split("\n").length,
    });
  }
  return principles.sort((a, b) => a.slug.localeCompare(b.slug));
}

interface Profile {
  name: string;
  file: string;
  mustFollow: string[];
  consider: string[];
}

function scanProfiles(): Profile[] {
  const profiles: Profile[] = [];
  for (const file of walk(PROFILES_DIR)) {
    if (basename(file) === "index.mdx") continue;
    const fm = parseFrontmatter(readFileSync(file, "utf8"));
    profiles.push({
      name: basename(file).replace(/\.mdx$/, ""),
      file,
      mustFollow: asList(fm.must_follow),
      consider: asList(fm.consider),
    });
  }
  return profiles;
}

function findPrinciple(query: string, principles: Principle[]): Principle | undefined {
  const q = query.toLowerCase().replace(/\.mdx$/, "");
  return (
    principles.find((p) => p.slug.toLowerCase() === q) ??
    principles.find((p) => p.slug.toLowerCase().endsWith("/" + q)) ??
    principles.find((p) => p.name.toLowerCase() === q) ??
    principles.find((p) => p.aliases.includes(q))
  );
}

// ---------------------------------------------------------------------------
// Argument parsing (hand-rolled, no deps)
// ---------------------------------------------------------------------------

function parseArgs(argv: string[]): { command: string; positional: string[]; flags: Record<string, string | boolean> } {
  const [command = "help", ...rest] = argv;
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > 0) {
        flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else if (
        ["to", "against", "id-repo", "profile", "tag", "type", "severity", "category"].includes(a.slice(2)) &&
        i + 1 < rest.length
      ) {
        flags[a.slice(2)] = rest[++i];
      } else {
        flags[a.slice(2)] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { command, positional, flags };
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

const SEVERITY_ORDER: Record<string, number> = { critical: 0, important: 1, advisory: 2, "": 3 };

function printTable(rows: (string | number)[][], headers: string[]): void {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i] ?? "").length)));
  const line = (cells: (string | number)[]) =>
    "| " + cells.map((c, i) => String(c).padEnd(widths[i])).join(" | ") + " |";
  const sep = "|" + widths.map((w) => "-".repeat(w + 2)).join("|") + "|";
  console.log(line(headers));
  console.log(sep);
  for (const r of rows) console.log(line(r));
}

// ---------------------------------------------------------------------------
// INDEX.md + AGENTS.snippet.md generation (the copy contract)
// ---------------------------------------------------------------------------

function buildIndex(entries: Principle[], profileName?: string): string {
  const header = profileName
    ? `# Principles INDEX — profile: ${profileName}\n`
    : `# Principles INDEX\n`;
  const sorted = [...entries].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9) || a.slug.localeCompare(b.slug),
  );
  const rows = sorted.map((p) => `| [${p.name}](${p.slug}.mdx) | ${p.severity} | ${p.summary} |`);
  return [
    header,
    `Loaded by the agent FIRST. Must-follow and critical principles are read in full;`,
    `others are opened only when the task touches their applies_to.`,
    ``,
    `| Principle | Severity | Summary |`,
    `| --- | --- | --- |`,
    ...rows,
    ``,
    `Principles advise; controls enforce. Nothing here replaces technical controls.`,
    ``,
  ].join("\n");
}

function buildAgentsSnippet(profileName?: string): string {
  return `## Principles

This project carries a \`.principles/\` directory copied from PRINCIPAI${profileName ? ` (profile: ${profileName})` : ""}.

An AI agent working in this repository MUST:

1. Read \`.principles/INDEX.md\` first, before any other file in \`.principles/\`.
2. Load in full every must-follow principle of the active profile, and every
   critical principle whose applies_to matches the task.
3. Open other principles only when the task touches their applies_to.
4. HALT and request explicit human approval before: violating any critical
   principle; performing destructive or irreversible actions (deletes, drops,
   force-pushes, credential changes); proceeding when uncertain.

Principles advise; controls enforce. If a principle and a technical control
disagree, the control wins and the disagreement is reported to a human.
`;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function cmdList(positional: string[], flags: Record<string, string | boolean>): number {
  const [category] = positional;
  let items = scanPrinciples();
  if (category) items = items.filter((p) => p.category === category);
  if (flags.tag) items = items.filter((p) => p.tags.includes(String(flags.tag)));
  if (flags.type) items = items.filter((p) => p.type === String(flags.type));
  if (flags.severity) items = items.filter((p) => p.severity === String(flags.severity));
  if (items.length === 0) {
    console.log("No principles match the given filters (belum digali?).");
    return 0;
  }
  printTable(
    items.map((p) => [p.slug, p.name, p.severity, p.summary.slice(0, 64)]),
    ["slug", "name", "severity", "summary"],
  );
  return 0;
}

function cmdShow(positional: string[]): number {
  const [name] = positional;
  if (!name) {
    console.error("usage: principai show <name>");
    return 1;
  }
  const p = findPrinciple(name, scanPrinciples());
  if (!p) {
    console.error(`Principle not found: ${name} (checked slug, name, and aliases)`);
    return 1;
  }
  console.log(readFileSync(p.file, "utf8"));
  return 0;
}

function cmdSearch(positional: string[]): number {
  const [term] = positional;
  if (!term) {
    console.error("usage: principai search <term>");
    return 1;
  }
  const t = term.toLowerCase();
  const hits = scanPrinciples().filter(
    (p) =>
      p.slug.includes(t) ||
      p.name.toLowerCase().includes(t) ||
      p.aliases.some((a) => a.includes(t)) ||
      p.tags.some((tag) => tag.includes(t)) ||
      p.summary.toLowerCase().includes(t) ||
      p.fm.__body.toLowerCase().includes(t),
  );
  if (hits.length === 0) {
    console.log(`No results for "${term}".`);
    return 0;
  }
  printTable(hits.map((p) => [p.slug, p.name, p.severity]), ["slug", "name", "severity"]);
  return 0;
}

function cmdAdd(positional: string[], flags: Record<string, string | boolean>): number {
  const [name] = positional;
  if (!name) {
    console.error("usage: principai add <name> [--category security]");
    return 1;
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const category = String(flags.category ?? "security");
  const dir = join(PRINCIPLES_DIR, category);
  const file = join(dir, `${slug}.mdx`);
  if (existsSync(file)) {
    console.error(`Already exists: ${file}`);
    return 1;
  }
  mkdirSync(dir, { recursive: true });
  const template = `---
title: ${titleize(slug)}
id: ${slug}
name: ${titleize(slug)}
summary: One to two sentences for INDEX and progressive loading.
category: ${category}
type: principle
severity: important
applies_to:
  - destructive-ops
tags:
  - changeme
aliases: []
sources: []
status: draft
verification: perlu
---

<AIInstruction>
Always ... (imperative rules an agent can obey without reading further).
</AIInstruction>

<Severity level="important" />

## Definition

Sharp definition in 2-4 sentences.

## When to use

- context or condition

## When NOT to use

- real exception, not a strawman

## Anti-pattern

- the most common violation

## Code example

Wrong:

\`\`\`bash
# what it looks like when violated
\`\`\`

Right:

\`\`\`bash
# what it looks like when followed
\`\`\`

## Technical enforcement

<Enforcement>
Controls beyond prompts that actually prevent or detect violations.
</Enforcement>

## Real-world case

<RealCase>
Damage when violated. Public incident with a link, or (ilustratif).
</RealCase>

## Tension and trade-off

- vs which principle, and how to weigh it

## Related principles

- [Label](/docs/principles/category/slug)

## References

- Source (verification: perlu).
`;
  writeFileSync(file, template);
  console.log(`Created: ${relative(ROOT, file)}`);
  console.log(`Next: fill the sections, set severity and applies_to honestly, run \`principai check\`.`);
  return 0;
}

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function collectForCopy(
  positional: string[],
  flags: Record<string, string | boolean>,
): { entries: Principle[]; profileName?: string; error?: string } {
  const all = scanPrinciples();
  const byProfile = flags.profile ? String(flags.profile) : undefined;
  if (byProfile) {
    const profile = scanProfiles().find((p) => p.name === byProfile);
    if (!profile) return { entries: [], error: `Profile not found: ${byProfile}` };
    const slugs = new Set([...profile.mustFollow, ...profile.consider]);
    return {
      entries: all.filter((p) => slugs.has(p.slug)),
      profileName: profile.name,
    };
  }
  if (positional.length === 0 || positional[0] === "all") return { entries: all };
  const entries: Principle[] = [];
  for (const item of positional) {
    const p = findPrinciple(item, all);
    if (p) {
      entries.push(p);
    } else {
      const cat = all.filter((p) => p.category === item);
      if (cat.length > 0) entries.push(...cat);
      else return { entries: [], error: `Not found (principle, alias, or category): ${item}` };
    }
  }
  if (flags["with-related"]) {
    const seen = new Set(entries.map((p) => p.slug));
    const queue = [...entries];
    while (queue.length > 0) {
      const p = queue.shift()!;
      for (const rel of p.related) {
        if (seen.has(rel)) continue;
        const found = all.find((x) => x.slug === rel);
        if (found) {
          seen.add(rel);
          entries.push(found);
          queue.push(found);
        }
      }
    }
  }
  return { entries };
}

function cmdCopy(positional: string[], flags: Record<string, string | boolean>): number {
  const to = flags.to ? String(flags.to) : ".";
  const { entries, profileName, error } = collectForCopy(positional, flags);
  if (error) {
    console.error(error);
    return 1;
  }
  if (entries.length === 0) {
    console.error("Nothing matched.");
    return 1;
  }
  const target = resolve(to);
  const principlesDir = join(target, ".principles");
  mkdirSync(principlesDir, { recursive: true });
  const copied: string[] = [];
  for (const p of entries) {
    const dest = join(principlesDir, `${p.slug}.mdx`);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(p.file, dest);
    copied.push(p.slug);
  }
  writeFileSync(join(principlesDir, "INDEX.md"), buildIndex(entries, profileName));
  writeFileSync(join(principlesDir, "AGENTS.snippet.md"), buildAgentsSnippet(profileName));
  console.log(
    `  ✓ ${copied.length} principle${copied.length === 1 ? "" : "s"} → ${relative(process.cwd(), principlesDir)}/`,
  );
  console.log(`  ✓ INDEX.md written (name · summary · severity)`);
  console.log(`  ✓ AGENTS.md snippet written → .principles/AGENTS.snippet.md`);
  const criticals = entries.filter((p) => p.severity === "critical");
  if (criticals.length > 0) {
    console.log(`  ⚠ critical principles present: agent must ask a human before destructive ops`);
  }
  if (profileName) console.log(`  profile: ${profileName}`);
  return 0;
}

function cmdProfile(positional: string[]): number {
  const [sub, name] = positional;
  const profiles = scanProfiles();
  if (sub === "list" || !sub) {
    printTable(
      profiles.map((p) => [p.name, p.mustFollow.length, p.consider.length]),
      ["profile", "must-follow", "consider"],
    );
    return 0;
  }
  if (sub === "show") {
    if (!name) {
      console.error("usage: principai profile show <name>");
      return 1;
    }
    const p = profiles.find((x) => x.name === name);
    if (!p) {
      console.error(`Profile not found: ${name}`);
      return 1;
    }
    console.log(readFileSync(p.file, "utf8"));
    return 0;
  }
  console.error("usage: principai profile list | show <name>");
  return 1;
}

// ---------------------------------------------------------------------------
// check — keep the library honest
// ---------------------------------------------------------------------------

const REQUIRED_SECTIONS = [
  "## Definition",
  "## When to use",
  "## When NOT to use",
  "## Anti-pattern",
  "## Code example",
  "## Technical enforcement",
  "## Real-world case",
  "## Tension and trade-off",
  "## Related principles",
  "## References",
];

async function cmdCheck(flags: Record<string, string | boolean>): Promise<number> {
  const problems: string[] = [];
  const warnings: string[] = [];
  const principles = scanPrinciples();

  for (const p of principles) {
    const rel = relative(ROOT, p.file);
    if (!p.fm.title) problems.push(`${rel}: frontmatter missing title`);
    if (!p.slug.includes("/")) problems.push(`${rel}: not inside a category folder`);
    if (p.severity && !["critical", "important", "advisory"].includes(p.severity))
      problems.push(`${rel}: invalid severity "${p.severity}"`);
    if (p.type && !["principle", "law", "heuristic", "practice"].includes(p.type))
      problems.push(`${rel}: invalid type "${p.type}"`);
    if (p.status && !["draft", "reviewed"].includes(p.status))
      problems.push(`${rel}: invalid status "${p.status}"`);
    if (p.verification && !["ok", "perlu"].includes(p.verification))
      problems.push(`${rel}: invalid verification "${p.verification}"`);
    if (!p.summary) warnings.push(`${rel}: missing summary (needed for INDEX)`);

    // Section order
    const h2s = p.fm.__body.split("\n").filter((l) => l.startsWith("## ")).map((l) => l.trim());
    const required = REQUIRED_SECTIONS.filter((s) => h2s.includes(s));
    const firstIdx = required.map((s) => h2s.indexOf(s));
    for (let i = 1; i < firstIdx.length; i++) {
      if (firstIdx[i] < firstIdx[i - 1]) {
        problems.push(`${rel}: section order broken around "${required[i]}"`);
        break;
      }
    }
    for (const s of REQUIRED_SECTIONS) {
      if (!h2s.includes(s)) warnings.push(`${rel}: missing section "${s}"`);
    }

    // Length lint
    if (p.lines > 170) warnings.push(`${rel}: ${p.lines} lines exceeds the ~160-line cap`);

    // Related links resolve
    for (const relSlug of p.related) {
      if (!principles.some((x) => x.slug === relSlug)) {
        problems.push(`${rel}: dangling related link → ${relSlug}`);
      }
    }
  }

  // Aliases resolve (an alias that is also a real file's id is confusing)
  for (const p of principles) {
    for (const alias of p.aliases) {
      const other = principles.find((x) => x.slug.endsWith("/" + alias) && x.slug !== p.slug);
      if (other) warnings.push(`${relative(ROOT, p.file)}: alias "${alias}" collides with ${other.slug}`);
    }
  }

  // Profiles reference real principles
  for (const profile of scanProfiles()) {
    for (const slug of [...profile.mustFollow, ...profile.consider]) {
      if (!principles.some((p) => p.slug === slug)) {
        problems.push(`${relative(ROOT, profile.file)}: references missing principle "${slug}"`);
      }
    }
  }

  // Structural parity with another checkout
  if (flags.against) {
    const otherRoot = String(flags.against);
    // Accept either a full checkout root (<root>/content/docs/principles)
    // or a principles directory directly (e.g. translations/id/principles).
    let otherDir = join(otherRoot, "content", "docs", "principles");
    if (!existsSync(otherDir) && existsSync(otherRoot) && statSync(otherRoot).isDirectory()) {
      const hasCategoryDirs = readdirSync(otherRoot).some(
        (e) => statSync(join(otherRoot, e)).isDirectory() && walk(join(otherRoot, e)).length > 0,
      );
      if (hasCategoryDirs) otherDir = otherRoot;
    }
    if (!existsSync(otherDir)) {
      problems.push(`--against: no principles directory at ${otherDir}`);
    } else {
      // Slugs must be computed relative to the OTHER root, not ours.
      const other = walk(otherDir).map((f) => relative(otherDir, f).replace(/\.mdx$/, "").replace(/\\/g, "/"));
      const ours = principles.map((p) => p.slug);
      const missingThere = ours.filter((s) => !other.includes(s));
      const missingHere = other.filter((s) => !ours.includes(s));
      for (const s of missingThere) problems.push(`parity: "${s}" missing in the other checkout`);
      for (const s of missingHere) problems.push(`parity: "${s}" exists only in the other checkout`);
    }
  }

  // Optional external link check
  if (flags.links) {
    console.log("Checking external links (network)…");
    const urls = new Set<string>();
    for (const p of principles) {
      for (const m of p.fm.__body.matchAll(/https:\/\/[^\s)\]]+/g)) urls.add(m[0]);
    }
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: "HEAD", redirect: "follow" } as RequestInit);
        if (!res.ok) warnings.push(`link check: ${url} → HTTP ${res.status}`);
      } catch {
        warnings.push(`link check: ${url} → unreachable`);
      }
    }
  }

  for (const w of warnings) console.log(`  ⚠ ${w}`);
  for (const pr of problems) console.error(`  ✗ ${pr}`);
  console.log(
    `\nchecked ${principles.length} principles · ${problems.length} problem${problems.length === 1 ? "" : "s"} · ${warnings.length} warning${warnings.length === 1 ? "" : "s"}`,
  );
  return problems.length > 0 ? 1 : 0;
}

// ---------------------------------------------------------------------------
// sync — derive ID translation stubs from EN (source of truth)
// ---------------------------------------------------------------------------

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function cmdSync(flags: Record<string, string | boolean>): number {
  const idRoot = flags["id-repo"] ? String(flags["id-repo"]) : ID_DIR;
  const principles = scanPrinciples();
  let created = 0;
  let markedStale = 0;
  let reviewed = 0;
  for (const p of principles) {
    const idFile = join(idRoot, "principles", `${p.slug}.mdx`);
    const hash = sha256(readFileSync(p.file, "utf8"));
    if (!existsSync(idFile)) {
      mkdirSync(dirname(idFile), { recursive: true });
      const stub = `---
title: ${p.name}
id: ${String(p.fm.id ?? p.slug.split("/")[1])}
name: ${p.name}
summary: TERJEMAHAN DRAF — ${p.summary}
category: ${p.category}
type: ${p.type || "principle"}
severity: ${p.severity || "important"}
applies_to:
${asList(p.fm.applies_to).map((a) => `  - "${a}"`).join("\n") || "  - general"}
tags:
${p.tags.map((t) => `  - "${t}"`).join("\n") || "  - changeme"}
aliases: []
sources: []
status: draft
verification: perlu
source_hash: "${hash}"
translation_status: draft
---

<!-- Draf terjemahan dari EN: content/docs/principles/${p.slug}.mdx -->
<!-- source_hash EN: ${hash} -->
<!-- Terjemahkan body ke Bahasa Indonesia; istilah teknis tetap Inggris (lihat glossary). -->

${p.fm.__body.trim()}
`;
      writeFileSync(idFile, stub);
      created++;
    } else {
      const idRaw = readFileSync(idFile, "utf8");
      const idFm = parseFrontmatter(idRaw);
      const oldHash = String(idFm.source_hash ?? "");
      const tstatus = String(idFm.translation_status ?? "draft");
      if (tstatus === "reviewed") {
        reviewed++;
        if (oldHash !== hash) {
          const updated = idRaw.replace(/^translation_status:\s*.*$/m, "translation_status: stale");
          writeFileSync(idFile, updated);
          markedStale++;
          console.log(`  ⇄ stale (EN changed after review): ${p.slug}`);
        }
      } else if (oldHash !== hash) {
        const updated = idRaw
          .replace(/^source_hash:\s*.*$/m, `source_hash: "${hash}"`)
          .replace(/^translation_status:\s*.*$/m, "translation_status: stale");
        writeFileSync(idFile, updated);
        markedStale++;
      }
    }
  }
  console.log(
    `  sync: ${created} stub${created === 1 ? "" : "s"} created · ${markedStale} marked stale · ${reviewed} reviewed untouched · ${principles.length} EN files scanned`,
  );
  if (created > 0) {
    console.log(`  next: translate the drafts (technical terms stay English — see glossary)`);
    console.log(`  reviewed status is granted only by human approval`);
  }
  return 0;
}

// ---------------------------------------------------------------------------
// status — honest summary, no completeness claims
// ---------------------------------------------------------------------------

function cmdStatus(): number {
  const principles = scanPrinciples();
  const byCategory = new Map<string, Principle[]>();
  for (const p of principles) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category)!.push(p);
  }

  // Parse the living taxonomy for belum digali / tidak yakin
  const taxonomyFile = join(DOCS, "taxonomy.mdx");
  let belum: string[] = [];
  let tidak: string[] = [];
  if (existsSync(taxonomyFile)) {
    const tx = readFileSync(taxonomyFile, "utf8");
    const belumSection = tx.split("## Belum digali")[1]?.split(/\n## /)[0] ?? "";
    const prose = belumSection.split("\n").find((l) => l.includes("·"));
    if (prose) {
      belum = prose
        .split("·")
        .map((s) => s.trim())
        .filter((s) => s.length > 2);
    }
    const tidakSection = tx.split("## Tidak yakin")[1]?.split(/\n## /)[0] ?? "";
    tidak = [...tidakSection.matchAll(/^- \*\*(.+?)\.\*\*/gm)].map((m) => m[1]);
  }

  console.log("PRINCIPAI status — status words only, no completeness claims\n");
  console.log("sudah digali (categories with files):");
  for (const [cat, items] of [...byCategory.entries()].sort()) {
    const criticals = items.filter((p) => p.severity === "critical").length;
    const drafts = items.filter((p) => p.status !== "reviewed").length;
    console.log(
      `  ${cat} — ${items.length} principle${items.length === 1 ? "" : "s"} (${criticals} critical, ${drafts} still draft)`,
    );
  }
  if (belum.length > 0) {
    console.log("\nbelum digali (tracked in taxonomy, no files yet — not a target, just honesty):");
    for (const b of belum) console.log(`  ${b}`);
  }
  if (tidak.length > 0) {
    console.log("\ntidak yakin (open classification questions):");
    for (const t of tidak) console.log(`  ${t}`);
  }
  console.log("\nreviewed status is granted only after human approval.");
  return 0;
}

// ---------------------------------------------------------------------------
// help + dispatch
// ---------------------------------------------------------------------------

function help(): number {
  console.log(`principai — the PRINCIPAI library CLI

usage: bun run principai <command> [args]

commands:
  list [category] [--tag t] [--type t] [--severity s]   list principles
  show <name>                                            print one principle (resolves aliases)
  search <term>                                          search names, aliases, tags, summaries, bodies
  add <name> [--category c]                              scaffold a new principle file

  copy <category|name...> --to <path> [--with-related]  copy a subset into .principles/
  copy --profile <name> --to <path>                      copy a profile
  all --to <path>                                        copy the entire principles/ tree
  profile list | show <name>                             inspect profiles

  check [--against <path>] [--links]                     validate structure, links, profiles, parity
  sync [--id-repo <path>]                                derive/update ID translation stubs (EN is truth)
  status                                                 honest summary: sudah digali / belum digali / tidak yakin

every copy writes .principles/INDEX.md and .principles/AGENTS.snippet.md — the agent
reads the INDEX first, obeys must-follow, opens the rest on demand, and halts for
human approval before critical violations or destructive actions.`);
  return 0;
}

async function main(): Promise<number> {
  const { command, positional, flags } = parseArgs(process.argv.slice(2));
  switch (command) {
    case "list":
      return cmdList(positional, flags);
    case "show":
      return cmdShow(positional);
    case "search":
      return cmdSearch(positional);
    case "add":
      return cmdAdd(positional, flags);
    case "copy":
    case "all":
      return cmdCopy(positional, flags);
    case "profile":
      return cmdProfile(positional);
    case "check":
      return await cmdCheck(flags);
    case "sync":
      return cmdSync(flags);
    case "status":
      return cmdStatus();
    case "help":
    case "--help":
    case "-h":
    default:
      return help();
  }
}

process.exit(await main());
