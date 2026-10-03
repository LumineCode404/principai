# AGENTS.md — working on PRINCIPAI itself

This file governs AI agents (and humans) contributing to this repository.

## Absolute rules (apply for the whole project)

1. **No target numbers.** Never set, mention, or imply numeric targets for principle counts, files, categories, profiles, or sessions. We do not know what we do not yet know.
2. **No closing language.** Never write "complete", "finished", or "enough" in README, plans, commits, or answers. The only status words allowed: `sudah digali` (dug), `belum digali` (not yet dug), `tidak yakin` (unsure). If a field feels exhausted, research it again from a different angle (different sources, different era, neighboring discipline). If unsure, say so and continue.
3. **Source honesty.** Never fabricate references, quotes, numbers, dates, or incidents. Real cases must be publicly traceable incidents (with a link to the postmortem or article you actually opened). If not, mark it `ilustratif`. Unverifiable references get `verification: perlu`. Paraphrase; do not copy book or article text — quotes are short and verbatim from sources you opened.
4. **Two-repo parity.** Anything designed or created must preserve 1:1 structural parity between the EN source of truth and the derived ID tree: folder structure, file names (English kebab-case), `id`, frontmatter keys, section order, profiles, evals, CLI. Only text values and body content differ.
5. **Overlapping principles stay one file.** Alternative names go in `aliases`.
6. **Curation does not replace the archive.** Never withhold or delete a principle because "there are too many". Filtering happens in the profile and severity layers.
7. **Technical controls are stated honestly.** Never claim a principle "prevents" incidents. Say what it reduces and which technical control is still required.

## How to add a principle

1. `bun run principai add <name> --category <category>`
2. Fill every section in the fixed order: AI instruction, Definition, When to use, When NOT to use, Anti-pattern, Code example, Technical enforcement, Real-world case, Tension and trade-offs, Related principles, References.
3. Frontmatter is mandatory: `id`, `name`, `summary` (1–2 sentences), `category`, `type` (principle | law | heuristic | practice), `severity` (critical | important | advisory), `applies_to`, `tags`, `aliases`, `sources`, `status: draft`, `verification` (ok | perlu).
4. Run `bun run principai check` — it must pass with zero problems.
5. Run `bun run principai sync` so the ID stub is generated.
6. `status: reviewed` is granted only by the maintainer — never set it yourself.

## Severity meanings

- `critical` — violating can cause unrecoverable loss (data gone, secrets leaked, people harmed). An agent must not break it without explicit human approval.
- `important` — strong default; deviation allowed with a written reason.
- `advisory` — a consideration; a tiebreaker between equal designs.

## Content quality

- Two passes: (1) write the draft, (2) a separate verification pass opens each source and real-world case and compares it with the claims in the file. Failures become `verification: perlu` or get rewritten as `ilustratif`.
- Every batch reports honestly: what is verified, what is not.
- MDX safety: never put raw `<`, `>`, `{`, or `}` in prose outside code fences and JSX components — they break compilation. Inside code fences they are safe.
- Max length per principle file is a lint rule in `principai check` (~160 lines), not a corpus target.

## Website

- `bun run dev` — dev server on port 3000.
- Content lives in `content/docs/` (`.mdx`); the schema is in `src/lib/source.ts`.
- Brand palette only: `#070707` background, `#FFFFFF` foreground, `#4D4B5B` muted, `#0282D8` accent. Dark-only theme.
- After `bun install`, `scripts/patch-fumadocs.mjs` patches a fumadocs-mdx/Next 16 turbopack incompatibility (postinstall).

## Contact

Maintainer: luminecode@proton.me
