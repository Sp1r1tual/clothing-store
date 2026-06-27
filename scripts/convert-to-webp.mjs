/**
 * convert-to-webp.mjs
 * Converts all PNG/JPG images in a given directory to WebP format.
 *
 * Usage:
 *   node scripts/convert-to-webp.mjs [dir] [quality] [--delete-originals]
 *
 * Examples:
 *   node scripts/convert-to-webp.mjs                        # converts public/categories at quality 85
 *   node scripts/convert-to-webp.mjs public/images 90       # custom dir + quality
 *   node scripts/convert-to-webp.mjs public/categories 85 --delete-originals
 */
import { existsSync, readdirSync, statSync, unlinkSync } from "fs";
import { createRequire } from "module";
import { basename, extname, join, resolve } from "path";

const require = createRequire(import.meta.url);

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("Sharp is not installed. Run: yarn add -D sharp");
  process.exit(1);
}

const args = process.argv.slice(2);
const flagIndex = args.indexOf("--delete-originals");
const deleteOriginals = flagIndex !== -1;
if (deleteOriginals) args.splice(flagIndex, 1);

const targetDir = resolve(args[0] ?? "public/categories");
const quality = Number(args[1] ?? 85);

if (!existsSync(targetDir)) {
  console.error(`Directory not found: ${targetDir}`);
  process.exit(1);
}

if (isNaN(quality) || quality < 1 || quality > 100) {
  console.error("Quality must be a number between 1 and 100.");
  process.exit(1);
}

const SUPPORTED = new Set([".png", ".jpg", ".jpeg"]);
const files = readdirSync(targetDir).filter((f) => SUPPORTED.has(extname(f).toLowerCase()));

if (files.length === 0) {
  console.log("No PNG/JPG files found in", targetDir);
  process.exit(0);
}

console.log(`Converting ${files.length} file(s) in "${targetDir}" → WebP (quality ${quality})`);

let converted = 0;
let skipped = 0;
let errors = 0;
const convertedMap = new Map();

for (const file of files) {
  if (extname(file).toLowerCase() === ".webp") {
    skipped++;
    continue;
  }

  const inputPath = join(targetDir, file);
  const ext = extname(file);
  const base = basename(file, ext);
  const outputName = base + ".webp";
  const outputPath = join(targetDir, outputName);

  try {
    const sizeBefore = statSync(inputPath).size;
    await sharp(inputPath).webp({ quality }).toFile(outputPath);
    const sizeAfter = statSync(outputPath).size;

    const saved = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1);
    console.log(
      `  ${file}  →  ${outputName}` +
        `  (${(sizeBefore / 1024).toFixed(0)} KB → ${(sizeAfter / 1024).toFixed(0)} KB, -${saved}%)`,
    );

    if (deleteOriginals) {
      unlinkSync(inputPath);
      console.log(`Deleted original: ${file}`);
    }
    convertedMap.set(file, outputName);
    converted++;
  } catch (err) {
    console.error(`Failed to convert ${file}:`, err.message);
    errors++;
  }
}

console.log(`Done conversion — ${converted} converted, ${skipped} skipped, ${errors} errors.`);

if (convertedMap.size > 0) {
  console.log("Scanning source files to update references...");
  const { readFileSync, writeFileSync, statSync: fsStatSync } = await import("fs");

  const scanDirs = [resolve("src"), resolve("messages")];
  let updatedFilesCount = 0;

  function walkAndReplace(dir) {
    if (!existsSync(dir)) return;
    const list = readdirSync(dir);
    for (const item of list) {
      const fullPath = join(dir, item);
      const stat = fsStatSync(fullPath);
      if (stat.isDirectory()) {
        walkAndReplace(fullPath);
      } else if (stat.isFile()) {
        const fileExt = extname(fullPath).toLowerCase();
        if ([".ts", ".tsx", ".js", ".jsx", ".json", ".css"].includes(fileExt)) {
          let content = readFileSync(fullPath, "utf-8");
          let modified = false;

          for (const [oldName, newName] of convertedMap.entries()) {
            if (content.includes(oldName)) {
              const regex = new RegExp(oldName.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
              content = content.replace(regex, newName);
              modified = true;
            }
          }

          if (modified) {
            writeFileSync(fullPath, content, "utf-8");
            console.log(
              `Updated references in: ${basename(fullPath)} (${fullPath.replace(resolve("."), "")})`,
            );
            updatedFilesCount++;
          }
        }
      }
    }
  }

  for (const dir of scanDirs) {
    walkAndReplace(dir);
  }

  console.log(`Refactoring done. Updated ${updatedFilesCount} file(s) with WebP references.`);
}
