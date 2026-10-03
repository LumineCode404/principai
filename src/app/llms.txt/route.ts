import { source } from "@/lib/source";

/**
 * /llms.txt — the agent-facing index of PRINCIPAI.
 *
 * Follows the llms.txt convention (https://llmstxt.org): a markdown map of
 * the site that an AI agent can read in one pass. It mirrors the library's
 * own staged-loading philosophy — summaries and links, not full bodies.
 * Agents expand on demand by fetching the linked pages.
 */

export const dynamic = "force-static";

const SITE = "https://principai.vercel.app";

function buildLlmsTxt(): string {
  const pages = source.getPages();

  const principles = pages
    .filter((p) => p.url.startsWith("/docs/principles/") && p.data.category)
    .sort((a, b) => {
      const cat = String(a.data.category).localeCompare(String(b.data.category));
      if (cat !== 0) return cat;
      const sev = { critical: 0, important: 1, advisory: 2 } as Record<string, number>;
      const sa = sev[String(a.data.severity)] ?? 3;
      const sb = sev[String(b.data.severity)] ?? 3;
      if (sa !== sb) return sa - sb;
      return String(a.data.title).localeCompare(String(b.data.title));
    });

  const byCategory = new Map<string, typeof principles>();
  for (const p of principles) {
    const cat = String(p.data.category);
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(p);
  }

  const keyDocs: Array<[string, string]> = [
    ["/docs", "Overview — what the library is, why it exists, and the honesty rules it follows."],
    ["/docs/getting-started", "Getting started — install, quickstart, agent integration."],
    ["/docs/concepts", "Concepts — principle format, severity, profiles, enforcement, two-repo sync."],
    ["/docs/profiles", "Profiles — the curation layer: must-follow and consider, per kind of work."],
    ["/docs/evals", "Evals — scenarios and rubrics that test whether the library changes agent behavior."],
    ["/docs/cli", "CLI — principai: list, show, search, copy, profile, check, sync, status."],
    ["/docs/taxonomy", "Taxonomy — dug categories, not-yet-dug list, open classification questions."],
    ["/docs/glossary", "Glossary — status vocabulary and the technical terms left untranslated."],
  ];

  const lines: string[] = [];
  lines.push("# PRINCIPAI");
  lines.push("");
  lines.push(
    "> A curated library of software engineering principles in an AI-friendly format — one principle per markdown file, staged loading, severity levels, and profiles that keep what loads into an agent small, relevant, and sharp."
  );
  lines.push("");
  lines.push(
    "Principles advise; controls enforce. This library helps an agent choose safer designs — it does not replace technical controls (read-only credentials, dry-run defaults, tested backups, human confirmation)."
  );
  lines.push("");
  lines.push(
    "Loading protocol for agents: read this index first, fetch a principle in full only when the task touches its applies_to, and halt for human approval before violating a critical principle or performing a destructive, irreversible action."
  );
  lines.push("");
  lines.push("Honesty rules: no completeness claims, no target numbers. Category status uses three words only — sudah digali (dug), belum digali (not yet dug), tidak yakin (unsure).");
  lines.push("");
  lines.push(`Contact: luminecode@proton.me — questions, corrections, incident reports.`);
  lines.push(`License: MIT. Site: ${SITE}`);
  lines.push("");
  lines.push("## Docs");
  lines.push("");
  for (const [url, desc] of keyDocs) {
    lines.push(`- [${url}](${SITE}${url}): ${desc}`);
  }
  lines.push("");
  lines.push("## Principles");
  lines.push("");

  for (const [cat, items] of byCategory) {
    lines.push(`### ${cat}`);
    lines.push("");
    for (const p of items) {
      const sev = p.data.severity ? ` [${p.data.severity}]` : "";
      const summary = p.data.summary ?? p.data.description ?? "";
      lines.push(`- [${p.data.title}](${SITE}${p.url})${sev}: ${summary}`);
    }
    lines.push("");
  }

  lines.push(
    "Full bodies are plain HTML pages at the URLs above; each principle page carries its instruction for AI agents, technical enforcement pairings, and verified real-world cases."
  );
  lines.push("");

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
