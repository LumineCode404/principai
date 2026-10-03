#!/usr/bin/env node
/**
 * Idempotent, whitespace-tolerant patch for fumadocs-mdx@15.4.6 + Next.js 16
 * turbopack.
 *
 * Bug: fumadocs-mdx emits `condition: { query: <RegExp> }` for its `*.json`
 * and `*.yaml` turbopack rules. Next 16's turbopack no longer supports a
 * `query` condition key (only path/content/all/any/not). The RegExp also
 * JSON-serializes to an empty object, failing Rust-side schema validation:
 * "turbopack.rules.*.json: data did not match any variant of untagged enum
 * Either".
 *
 * Fix: scope the meta loader by path instead ("meta.json" / "meta.yaml" under
 * any directory) — semantically equivalent for content collections, because
 * only meta files are ever imported with a collection query by the generated
 * .source code.
 *
 * This script matches BOTH tab-indented (npm tarball) and space-indented
 * (locally reformatted) copies. Re-run safe.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const target = join(process.cwd(), 'node_modules/fumadocs-mdx/dist/next/index.js');

if (!existsSync(target)) {
  console.log('[patch-fumadocs] fumadocs-mdx not installed, skipping.');
  process.exit(0);
}

const src = readFileSync(target, 'utf8');

if (!src.includes('query: metaLoaderQueryGlob')) {
  console.log('[patch-fumadocs] already patched (or version changed), skipping.');
  process.exit(0);
}

const lines = src.split('\n');
let lastRule = null;
let patched = 0;

for (let i = 0; i < lines.length; i++) {
  const rule = lines[i].match(/"(\*\.[a-z]+)":\s*\{/);
  if (rule) lastRule = rule[1];

  if (lines[i].includes('condition: { query: metaLoaderQueryGlob }')) {
    let path = null;
    if (lastRule === '*.json') path = '**/meta.json';
    else if (lastRule === '*.yaml') path = '**/meta.yaml';
    if (path) {
      lines[i] = lines[i].replace(
        'condition: { query: metaLoaderQueryGlob }',
        `condition: { path: "${path}" }`,
      );
      patched++;
    } else {
      console.warn(`[patch-fumadocs] could not determine rule for line ${i + 1}, skipping it.`);
    }
  }
}

if (patched > 0) {
  writeFileSync(target, lines.join('\n'));
  console.log(`[patch-fumadocs] patched ${patched} turbopack condition(s).`);
} else {
  console.warn('[patch-fumadocs] query conditions found but nothing patched — inspect manually.');
  process.exit(1);
}
