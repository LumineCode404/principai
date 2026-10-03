import { defineDocs } from 'fumadocs-mdx/macro';
import { loader } from 'fumadocs-core/source';
import { z } from 'zod';

/**
 * PRINCIPAI content source.
 *
 * The docs collection doubles as the canonical principle library: every
 * principle is one MDX file with a strict frontmatter contract.
 */
const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: z.object({
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
      /** Derived-translation fields (ID repo copies only). */
      source_hash: z.string().optional(),
      translation_status: z.enum(['draft', 'reviewed', 'stale']).optional(),
      icon: z.string().optional(),
      full: z.boolean().optional(),
    }),
  },
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
