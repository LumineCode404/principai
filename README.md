# PRINCIPAI

A private library of software engineering principles, written to be **read by AI agents** — one principle per markdown file, a fixed section order, a curation layer (profiles), a small CLI to copy subsets into projects, and evals to check whether the library actually changes agent behavior.

This repository contains the library **and** the documentation website (Next.js + Fumadocs).

## What it is

- **The archive may be exhaustive; the load is curated.** Two concerns, separated explicitly through profiles, summaries, and severity.
- **One principle, one file.** `applies_to` contexts, `aliases` for overlapping names, a fixed section order with the AI instruction first.
- **Principles are advisors, not enforcers.** Real prevention lives in technical controls (read-only credentials, dry-run defaults, tested backups, environment separation, human confirmation). Every principle names its enforcement pairing.

## Repository layout

```
content/docs/           documentation + principle library (EN, source of truth)
  principles/           the archive: security, reliability, data, architecture, api, design
  profiles/             curation layer: destructive-ops, database-service, public-api
  evals/                scenario + rubric, run with and without .principles/
  concepts/             format, severity, profiles, enforcement, two-repo sync
  getting-started/      installation, quickstart, agent integration
  taxonomy.mdx          living taxonomy: sudah digali / belum digali / tidak yakin
  glossary.mdx          shared vocabulary, untranslated technical terms
translations/id/        derived Indonesian tree (stubs + reviewed translations)
cli/principai.ts        the principai CLI (Bun, zero heavy deps)
src/                    the website (Next.js 16 + Fumadocs)
```

## The principai CLI

```
bun run principai list [category] [--tag t] [--type t] [--severity s]
bun run principai show <name>            # resolves aliases
bun run principai search <term>
bun run principai add <name> [--category c]
bun run principai copy --profile destructive-ops --to <path>
bun run principai copy security idempotency --to <path> [--with-related]
bun run principai all --to <path>
bun run principai profile list | show <name>
bun run principai check [--against <path>] [--links]
bun run principai sync [--id-repo <path>]
bun run principai status
```

Every copy writes `.principles/INDEX.md` (name · summary · severity) and an `AGENTS.snippet.md` instructing agents to read the INDEX first, obey must-follow, open the rest on demand, and halt for human approval before critical violations or destructive actions.

## Status language

Only three status words are used, in both languages, and no completeness claims are ever made:

- **sudah digali** — dug (researched and written; not a finish line)
- **belum digali** — not yet dug (honest tracking, not a target)
- **tidak yakin** — unsure

## Honesty rules

- No target numbers for principles, files, categories, profiles, or sessions.
- Real incidents are public and traceable; unverifiable material is marked `ilustratif` with `verification: perlu`.
- A principle never "prevents" an incident — it reduces risk; controls contain it.
- `status: reviewed` is granted only after human approval.

## Two-repo model (EN / ID)

English is the source of truth. The Indonesian translation is derived via `principai sync` with `source_hash` drift detection: structure stays 1:1, meaning flows one way, and a hash mismatch marks a file stale automatically. See [Two-Repo Sync](content/docs/concepts/two-repo-sync.mdx) for the full decision record.

## Website

```
bun install
bun run dev     # http://localhost:3000
```

Built with Next.js 16, Fumadocs, Tailwind CSS 4. Dark-only theme matched to the brand palette: `#070707` `#FFFFFF` `#4D4B5B` `#0282D8`.

> **Note:** after `bun install`, the postinstall script patches a fumadocs-mdx incompatibility with Next.js 16 turbopack (regex `query` conditions). See `scripts/patch-fumadocs.mjs`.

## Contact

[luminecode@proton.me](mailto:luminecode@proton.me)

## License

MIT — see [LICENSE](LICENSE). Principle texts reference their original sources; attributions live in each file's `sources` frontmatter and References section.
