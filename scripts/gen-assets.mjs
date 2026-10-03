/**
 * Generate optimized brand assets from the source logo:
 *  - public/images/logo.webp      (hero, ~880px wide, quality-balanced)
 *  - public/images/logo-icon.png  (512, owl crop for touch icons)
 *  - public/icons/favicon-32.png, apple-touch-icon.png (180)
 *  - public/images/og.png         (1200x630 social card)
 *  - public/favicon.svg / icon SVG favicon fallback
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = '/tmp/logo-src.png';
mkdirSync('/home/z/my-project/public/images', { recursive: true });
mkdirSync('/home/z/my-project/public/icons', { recursive: true });

const meta = await sharp(SRC).metadata();
console.log('source size:', meta.width, 'x', meta.height);

// 1) Hero WebP — full logo, width 880
await sharp(SRC).resize({ width: 880 }).webp({ quality: 82 }).toFile('/home/z/my-project/public/images/logo.webp');
console.log('logo.webp done');

// 2) Icon crops — the owl occupies roughly the top 60% of the canvas.
const H = meta.height;
const W = meta.width;
const owlBox = { left: 0, top: 0, width: W, height: Math.round(H * 0.60) };
await sharp(SRC)
  .extract(owlBox)
  .resize(512, 512, { fit: 'contain', background: { r: 7, g: 7, b: 7, alpha: 1 } })
  .png()
  .toFile('/home/z/my-project/public/images/logo-icon-512.png');
console.log('logo-icon-512 done');

await sharp(SRC)
  .extract(owlBox)
  .resize(180, 180, { fit: 'contain', background: { r: 7, g: 7, b: 7, alpha: 1 } })
  .png()
  .toFile('/home/z/my-project/public/icons/apple-touch-icon.png');
console.log('apple-touch-icon done');

await sharp(SRC)
  .extract(owlBox)
  .resize(32, 32, { fit: 'contain', background: { r: 7, g: 7, b: 7, alpha: 1 } })
  .png()
  .toFile('/home/z/my-project/public/icons/favicon-32.png');
console.log('favicon-32 done');

// 3) OG image 1200x630 — brand background, logo centered-left, wordmark
const og = await sharp(SRC).resize({ height: 520 }).webp({ quality: 88 }).toBuffer();
const ogSvg = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#070707"/>
  <rect x="0" y="626" width="1200" height="4" fill="#0282D8"/>
  <circle cx="1120" cy="90" r="220" fill="#0282D8" opacity="0.07"/>
  <circle cx="80" cy="580" r="160" fill="#4D4B5B" opacity="0.12"/>
</svg>`);
await sharp(ogSvg)
  .composite([
    { input: og, left: 90, top: 55 },
    {
      input: Buffer.from(`
<svg width="560" height="200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .t1 { fill: #FFFFFF; font-family: Arial, Helvetica, sans-serif; font-size: 58px; font-weight: 900; letter-spacing: -1px; }
    .t2 { fill: #8B89A0; font-family: Arial, Helvetica, sans-serif; font-size: 26px; font-weight: 400; }
    .b  { fill: #0282D8; font-family: Arial, Helvetica, sans-serif; font-size: 26px; font-weight: 700; }
  </style>
  <text x="0" y="70" class="t1">PRINCIPAI</text>
  <text x="0" y="120" class="t2">Software engineering principles,</text>
  <text x="0" y="155" class="t2">curated for AI agents.</text>
  <text x="0" y="195" class="b">Read INDEX &#183; obey must-follow &#183; verify critical</text>
</svg>`),
      left: 620,
      top: 210,
    },
  ])
  .jpeg({ quality: 90 })
  .toFile('/home/z/my-project/public/images/og.png');
console.log('og.png done');
