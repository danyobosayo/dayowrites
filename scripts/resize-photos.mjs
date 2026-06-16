#!/usr/bin/env node
/*
 * resize-photos.mjs — optimize photos for the site's albums.
 *
 * Reads a folder of full-size exports (e.g. Fujifilm JPGs), and writes
 * web-optimized copies into an album folder. Originals are never touched;
 * keep those in your real archive.
 *
 * What it does to each image:
 *   - auto-rotates based on EXIF orientation (bakes it into the pixels)
 *   - resizes so the long edge is at most --max px (never upscales)
 *   - re-encodes to WebP (default) at --quality
 *   - strips bulky camera metadata (smaller files, no GPS leakage)
 *
 * Usage:
 *   npm run photos -- --src <folder> --album <album-slug>
 *   npm run photos -- --src <folder> --out public/assets/food
 *
 * Examples:
 *   npm run photos -- --src ~/Desktop/japan-exports --album japan-korea-2026
 *   npm run photos -- --src ~/Desktop/ramen --out public/assets/food
 *
 * Options:
 *   --src <dir>       folder of source images (required)
 *   --album <slug>    album under public/assets/photography/ (or use --out)
 *   --out <dir>       explicit output dir (e.g. public/assets/food)
 *   --max <px>        long-edge cap (default 2560)
 *   --quality <n>     encode quality 1-100 (default 80)
 *   --format <fmt>    webp | avif | jpeg (default webp)
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const INPUT_RE = /\.(jpe?g|png|tiff?|webp)$/i;

function parseArgs(argv) {
  const args = { max: 2560, quality: 80, format: "webp" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => argv[++i];
    if (a === "--src") args.src = val();
    else if (a === "--album") args.album = val();
    else if (a === "--out") args.out = val();
    else if (a === "--max") args.max = parseInt(val(), 10);
    else if (a === "--quality") args.quality = parseInt(val(), 10);
    else if (a === "--format") args.format = val();
    else if (a === "-h" || a === "--help") args.help = true;
    else console.warn(`Ignoring unknown arg: ${a}`);
  }
  return args;
}

function slugify(file) {
  return path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const USAGE =
  "Usage: npm run photos -- --src <folder> --album <album-slug>\n" +
  "       npm run photos -- --src <folder> --out public/assets/food";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.src || (!args.album && !args.out)) {
    console.log(USAGE);
    process.exit(args.help ? 0 : 1);
  }

  const root = process.cwd();
  const srcDir = path.resolve(root, args.src);
  const outDir = args.out
    ? path.resolve(root, args.out)
    : path.join(root, "public", "assets", "photography", args.album);

  if (!existsSync(srcDir)) {
    console.error(`Source folder not found: ${srcDir}`);
    process.exit(1);
  }
  await mkdir(outDir, { recursive: true });

  const ext = args.format === "jpeg" ? "jpg" : args.format;
  const files = (await readdir(srcDir)).filter((f) => INPUT_RE.test(f)).sort();
  if (files.length === 0) {
    console.error(`No images (.jpg/.png/.tif/.webp) found in ${srcDir}`);
    process.exit(1);
  }

  let inBytes = 0;
  let outBytes = 0;
  for (const file of files) {
    const inPath = path.join(srcDir, file);
    const outPath = path.join(outDir, `${slugify(file)}.${ext}`);
    const inSize = (await stat(inPath)).size;

    let pipe = sharp(inPath)
      .rotate()
      .resize({
        width: args.max,
        height: args.max,
        fit: "inside",
        withoutEnlargement: true,
      });
    if (args.format === "avif") pipe = pipe.avif({ quality: args.quality });
    else if (args.format === "jpeg")
      pipe = pipe.jpeg({ quality: args.quality, mozjpeg: true });
    else pipe = pipe.webp({ quality: args.quality });

    await pipe.toFile(outPath);
    const outSize = (await stat(outPath)).size;
    inBytes += inSize;
    outBytes += outSize;
    console.log(
      `${file}  ${(inSize / 1e6).toFixed(1)}MB → ${path.basename(outPath)}  ${(
        outSize / 1e6
      ).toFixed(2)}MB`
    );
  }

  console.log(
    `\nDone. ${files.length} photos, ${(inBytes / 1e6).toFixed(1)}MB → ${(
      outBytes / 1e6
    ).toFixed(1)}MB, written to ${path.relative(root, outDir) || "."}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
