/**
 * One-time migration script: uploads images from /public to Vercel Blob.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=your_token node scripts/migrateImagesToBlobStorage.mjs
 *
 * After running, use the printed mapping to update head.banner values in MongoDB.
 */

import { put } from "@vercel/blob";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");

const IMAGE_EXTENSIONS = new Set([
  ".webp",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
]);

const files = await readdir(PUBLIC_DIR);
const imageFiles = files.filter((f) =>
  IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()),
);

console.log(`Found ${imageFiles.length} images to migrate:\n`);

const mapping = {};

for (const filename of imageFiles) {
  const filePath = path.join(PUBLIC_DIR, filename);
  const buffer = await readFile(filePath);
  const blob = await put(filename, buffer, { access: "public", contentDisposition: "inline", allowOverwrite: true });

  const oldPath = `/${filename}`;
  mapping[oldPath] = blob.url;

  console.log(`✓ ${oldPath}`);
  console.log(`  → ${blob.url}\n`);
}

console.log("\n--- Full mapping (old path → Blob URL) ---");
console.log(JSON.stringify(mapping, null, 2));
