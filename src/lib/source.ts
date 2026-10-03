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
 * Both translation trees cover all 32 principles (translation_status: draft
 * until human review); concepts/profiles/evals remain English-only by design.
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

// All 32 principles are fully translated (stubs were replaced); the whole
// tree compiles — concepts/profiles/evals stay English-only by design.
const id = defineDocs({
  dir: 'translations/id',
  docs: { schema },
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
