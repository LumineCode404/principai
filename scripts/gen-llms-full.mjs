/**
 * Generate /llms-full.txt — the flattened, full-text export of the principle
 * archive for AI agents (llmstxt.org convention: the "full" variant).
 *
 * Reads all principle MDX files under content/docs/principles, converts
 * MDX-specific constructs to plain markdown, and writes public/llms-full.txt.
 *
 * Run after content changes:  bun scripts/gen-llms-full.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "content/docs/principles");
const OUT = join(ROOT, "public/llms-full.txt");
const SITE = "https://principai.vercel.app";

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".mdx") && e.name !== "index.mdx") out.push(p);
  }
  return out;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { fm, body: text.slice(m[0].length) };
}

function mdxToMarkdown(body) {
  return (
    body
      // MDX comments
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      // AIInstruction → labeled quote
      .replace(/<AIInstruction>\n?([\s\S]*?)<\/AIInstruction>/g, (_m, inner) =>
        inner
          .trim()
          .split("\n")
          .map((l) => `> ${l}`)
          .join("\n") + "\n\n*Instruction for AI agents — the operative rule.*",
      )
      // Severity self-closing
      .replace(/<Severity level="([a-z]+)" \/>/g, "**Severity: $1.**")
      // Enforcement block
      .replace(/<Enforcement>\n?([\s\S]*?)<\/Enforcement>/g, (_m, inner) => inner.trim())
      // RealCase block
      .replace(/<RealCase>\n?([\s\S]*?)<\/RealCase>/g, (_m, inner) => inner.trim())
      // Any leftover JSX-ish lines get fenced off
      .replace(/<\/?[A-Z][A-Za-z]*[^>]*>/g, "")
      .trim()
  );
}

const files = walk(SRC);
const sections = [];
const stats = { critical: 0, important: 0, advisory: 0 };

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const { fm, body } = parseFrontmatter(text);
  const cat = (file.split("/").slice(-2, -1)[0] ?? "uncategorized").toLowerCase();
  const sev = fm.severity;
  if (sev in stats) stats[sev]++;
  const url = `${SITE}/docs/principles/${cat}/${basename(file, ".mdx")}`;

  const header = [
    `## ${fm.title ?? basename(file, ".mdx")}`,
    "",
    `- URL: ${url}`,
    `- Category: ${cat}${sev ? ` · Severity: ${sev}` : ""}${fm.status ? ` · Status: ${fm.status}` : ""}${fm.verification ? ` · Verification: ${fm.verification}` : ""}`,
    fm.summary ? `- Summary: ${fm.summary}` : "",
    fm.applies_to ? `- Applies to: (see page)` : "",
    "",
    mdxToMarkdown(body),
  ]
    .filter((l) => l !== "")
    .join("\n");

  sections.push({ cat, title: fm.title ?? "", header });
}

// Group by category like llms.txt does.
const byCat = new Map();
for (const s of sections) {
  if (!byCat.has(s.cat)) byCat.set(s.cat, []);
  byCat.get(s.cat).push(s);
}

const out = [];
out.push("# Principai — full principle archive (llms-full.txt)");
out.push("");
out.push(
  "> Complete bodies of the dug principle archive, machine-readable and flattened. Regenerated with `bun scripts/gen-llms-full.mjs`. The staged index lives at /llms.txt; the exhaustive-by-method catalog at /registry.json.",
);
out.push("");
out.push(
  "Principles advise; controls enforce. Halt for human approval before violating a critical principle or performing a destructive, irreversible action.",
);
out.push("");
out.push(`Sections: ${byCat.size} categories, ${sections.length} principles.`);
out.push("");

for (const [cat, items] of byCat) {
  out.push(`# Category: ${cat}`);
  out.push("");
  for (const item of items) {
    out.push(item.header);
    out.push("");
    out.push("---");
    out.push("");
  }
}

writeFileSync(OUT, out.join("\n"));
console.log(`llms-full.txt written: ${sections.length} principles, ${(out.join("\n").length / 1024).toFixed(0)} KB`);
