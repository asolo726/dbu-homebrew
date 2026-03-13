/**
 * Uploads a single image file to Vercel Blob and prints the public URL.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=your_token node scripts/uploadImage.mjs path/to/image.webp
 *
 * Example:
 *   BLOB_READ_WRITE_TOKEN=your_token node scripts/uploadImage.mjs public/my-banner.webp
 */

import { put } from "@vercel/blob";
import { readFile } from "fs/promises";
import path from "path";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node scripts/uploadImage.mjs <path-to-image>");
  process.exit(1);
}

const filename = path.basename(filePath);
const buffer = await readFile(filePath);
const blob = await put(filename, buffer, {
  access: "public",
  contentDisposition: "inline",
});

console.log(`\nUploaded: ${filename}`);
console.log(`URL: ${blob.url}\n`);
