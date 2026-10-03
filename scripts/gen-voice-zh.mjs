/**
 * Generate Chinese voice summaries for every principle.
 *
 * Reads each ZH translation's frontmatter (title + summary), builds a short
 * spoken text ("中文名。summary"), renders WAV via the z-ai TTS SDK (the API
 * supports wav/pcm only), then converts to MP3 with ffmpeg into
 * public/voice/zh/<slug>.mp3. Audio is a static asset: fetched only on
 * demand, works on any host, zero runtime dependency.
 *
 * Run: bun scripts/gen-voice-zh.mjs
 * Idempotent: skips files whose MP3 already exists and is non-empty.
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  statSync,
  unlinkSync,
  readdirSync,
} from "node:fs";
import { join, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import ZAI from "z-ai-web-dev-sdk";

const ROOT = process.cwd();
const SRC = join(ROOT, "translations/zh/principles");
const OUT = join(ROOT, "public/voice/zh");

function frontmatter(file) {
  const text = readFileSync(file, "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`No frontmatter: ${file}`);
  return m[1];
}

function fmString(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  if (!m) return null;
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v;
}

function speakable(title, summary) {
  const zhTitle = title.split("·")[0].trim();
  let body = summary
    .replace(/——/g, "，")
    .replace(/[·「」『』]/g, "，")
    .replace(/，{2,}/g, "，")
    .replace(/\s+/g, " ")
    .trim();
  body = body.replace(/，$/, "。");
  if (!body.endsWith("。") && !body.endsWith("！") && !body.endsWith("？") && !body.endsWith(".")) {
    body += "。";
  }
  return `${zhTitle}。${body}`;
}

async function ttsWithRetry(zai, text, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const response = await zai.audio.tts.create({
        input: text,
        voice: "xiaochen",
        speed: 1.0,
        response_format: "wav",
        stream: false,
      });
      const buffer = Buffer.from(new Uint8Array(await response.arrayBuffer()));
      if (buffer.length < 20000) throw new Error(`too small (${buffer.length} bytes)`);
      return buffer;
    } catch (err) {
      lastErr = err;
      const wait = 8000 * (i + 1);
      console.log(`  … rate limited or failed, waiting ${wait / 1000}s (${err.message.slice(0, 60)})`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const zai = await ZAI.create();

  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".mdx") && entry.name !== "index.mdx") files.push(p);
    }
  };
  walk(SRC);

  let ok = 0;
  let skipped = 0;
  const failed = [];

  for (const file of files) {
    const slug = basename(file, ".mdx");
    const outPath = join(OUT, `${slug}.mp3`);
    if (existsSync(outPath) && statSync(outPath).size > 4096) {
      skipped++;
      continue;
    }
    const fm = frontmatter(file);
    const title = fmString(fm, "title") ?? slug;
    const summary = fmString(fm, "summary");
    if (!summary) {
      console.error(`✗ ${slug}: no summary`);
      failed.push(slug);
      continue;
    }
    const text = speakable(title, summary);
    if (text.length > 1000) {
      console.error(`✗ ${slug}: text too long`);
      failed.push(slug);
      continue;
    }
    try {
      const wavBuffer = await ttsWithRetry(zai, text);
      const tmpWav = join(tmpdir(), `principai-${slug}-${Date.now()}.wav`);
      writeFileSync(tmpWav, wavBuffer);
      execFileSync("ffmpeg", [
        "-y", "-i", tmpWav,
        "-codec:a", "libmp3lame",
        "-b:a", "56k",
        "-ar", "24000",
        "-ac", "1",
        outPath,
      ], { stdio: "pipe" });
      unlinkSync(tmpWav);
      ok++;
      console.log(`✓ ${slug} (${(statSync(outPath).size / 1024).toFixed(0)} KB mp3)`);
      await new Promise((r) => setTimeout(r, 3000));
    } catch (err) {
      console.error(`✗ ${slug}: ${err.message}`);
      failed.push(slug);
    }
  }

  console.log(`\nDone. generated=${ok} skipped=${skipped} failed=${failed.length}`);
  if (failed.length) console.log("FAILED:", failed.join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
