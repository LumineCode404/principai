#!/usr/bin/env node
/**
 * Idempotent patch for fumadocs-mdx@15.4.6 + Next.js 16 turbopack.
 *
 * Bug: fumadocs-mdx emits `condition: { query: <RegExp> }` for its `*.json`
 * and `*.yaml` turbopack rules. Next 16's turbopack no longer supports a
 * `query` condition key (only path/content/all/any/not). The RegExp also
 * JSON-serializes to an empty object, failing Rust-side schema validation:
 * "turbopack.rules.*.json: data did not match any variant of untagged enum
 * Either".
 *
 * Fix: scope the meta loader by path instead (glob "meta.json" / "meta.yaml"
 * under any directory), which is semantically equivalent for content
 * collections: only meta files are ever imported with a collection query by
 * the generated .source code.
 *
 * Re-run safe: if the pattern is already replaced, the script exits 0.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const target = join(process.cwd(), 'node_modules/fumadocs-mdx/dist/next/index.js');

if (!existsSync(target)) {
  console.log('[patch-fumadocs] fumadocs-mdx not installed, skipping.');
  process.exit(0);
}

let src = readFileSync(target, 'utf8');

const jsonFixed = 'condition: { path: "**/meta.json" }';
const yamlFixed = 'condition: { path: "**/meta.yaml" }';

if (src.includes(jsonFixed) && src.includes(yamlFixed)) {
  console.log('[patch-fumadocs] already patched, skipping.');
  process.exit(0);
}

// The upstream file contains two rules whose condition uses a RegExp that
// Next 16 cannot serialize. Replace each with a path-scoped condition.
const brokenJson = '"*.json": {\n\t\t\t\t\t\t\t\tcondition: { query: metaLoaderQueryGlob },';
const fixedJson = `"*.json": {\n\t\t\t\t\t\t\t\t${jsonFixed},`;
const brokenYaml = '"*.yaml": {\n\t\t\t\t\t\t\t\tcondition: { query: metaLoaderQueryGlob },';
const fixedYaml = `"*.yaml": {\n\t\t\t\t\t\t\t\t${yamlFixed},`;

let patched = 0;
if (src.includes(brokenJson)) {
  src = src.replace(brokenJson, fixedJson);
  patched++;
  console.log('[patch-fumadocs] patched json rule.');
} else if (src.includes(jsonFixed)) {
  console.log('[patch-fumadocs] json rule already patched.');
} else {
  console.log('[patch-fumadocs] json rule pattern not found (version changed?), skipping.');
}

if (src.includes(brokenYaml)) {
  src = src.replace(brokenYaml, fixedYaml);
  patched++;
  console.log('[patch-fumadocs] patched yaml rule.');
} else if (src.includes(yamlFixed)) {
  console.log('[patch-fumadocs] yaml rule already patched.');
} else {
  console.log('[patch-fumadocs] yaml rule pattern not found (version changed?), skipping.');
}

if (patched > 0) {
  writeFileSync(target, src);
  console.log('[patch-fumadocs] patch written.');
}
