import { defineDocs } from 'fumadocs-mdx/macro';
import { loader } from 'fumadocs-core/source';
import { z } from 'zod';

/**
 * Principai content sources — three languages, one truth.
 *
 * English (content/docs) is the source of truth. Indonesian and Chinese are
 * derived trees: structure stays 1:1, meaning flows one way, drift is tracked
 * with source_hash (sha256-16 of the EN file) in the derived frontmatter.
 *
 * The ID tree contains stubs for untranslated principles (sync output) —
 * only fully translated files are exposed to the website via the `files`
 * allowlist below. The ZH tree is complete.
 */

const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
  /** Stable identifier, kebab-case. */
  id: z.string().optional(),
  /** Human-readable principle name. */
  name: z.string().optional(),
  /** 1–2 sentence summary for INDEX and progressive loading. */
  summary: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(['principle', 'law', 'heuristic', 'practice', 'doc']).optional(),
  severity: z.enum(['critical', 'important', 'advisory']).optional(),
  applies_to: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  aliases: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  status: z.enum(['draft', 'reviewed']).optional(),
  verification: z.enum(['ok', 'perlu']).optional(),
  /** Derived-translation fields (ID/ZH repo copies only). */
  source_hash: z.string().optional(),
  translation_status: z.enum(['draft', 'reviewed', 'stale']).optional(),
  icon: z.string().optional(),
  full: z.boolean().optional(),
});

const en = defineDocs({
  dir: 'content/docs',
  docs: { schema },
});

const id = defineDocs({
  dir: 'translations/id',
  docs: {
    schema,
    // Site scope: only fully translated principles (stubs stay repo-only).
    files: [
      'index.mdx',
      'principles/index.mdx',
      'principles/security/least-authority.mdx',
      'principles/security/fail-safe-defaults.mdx',
      'principles/security/input-validation.mdx',
      'principles/security/complete-mediation.mdx',
      'principles/security/defense-in-depth.mdx',
      'principles/reliability/idempotency.mdx',
      'principles/reliability/blast-radius.mdx',
      'principles/reliability/fail-visible.mdx',
      'principles/data/tested-backups.mdx',
    ],
  },
});

const zh = defineDocs({
  dir: 'translations/zh',
  docs: { schema },
});

export const source = loader({
  baseUrl: '/docs',
  source: en.toFumadocsSource(),
});

export const sourceId = loader({
  baseUrl: '/id/docs',
  source: id.toFumadocsSource(),
});

export const sourceZh = loader({
  baseUrl: '/zh/docs',
  source: zh.toFumadocsSource(),
});

export type DocsLoader = typeof source;
