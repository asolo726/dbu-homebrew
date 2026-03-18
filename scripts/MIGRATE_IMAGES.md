# Migrating Images to Vercel Blob

## Prerequisites

1. Install the Vercel Blob package:

   ```bash
   npm install @vercel/blob
   ```

2. Get your `BLOB_READ_WRITE_TOKEN` from the Vercel dashboard:
   - Go to your project → Storage → Blob → your store

3. Add the token to `.env.local`:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

---

## One-Time Migration (existing images in /public)

Run the migration script to upload all images from `/public` to Vercel Blob:

```bash
BLOB_READ_WRITE_TOKEN=your_token node scripts/migrateImagesToBlobStorage.mjs
```

The script prints a JSON mapping of old path → new Blob URL, for example:

```json
{
  "/There_Is_a_Massive_Dragon_Behind_Me_Isnt_There.webp": "https://abc123.public.blob.vercel-storage.com/There_Is_a_Massive_Dragon_Behind_Me_Isnt_There.webp"
}
```

Use this mapping to update the `head.banner` field in your MongoDB documents to point to the new Blob URLs.

Once MongoDB is updated and verified, you can delete the images from `/public`.

---

## Uploading New Images (future content)

An API route has been created at `/api/uploadImage`. When submitting the create form, send the image as a `FormData` POST request:

```js
const form = new FormData();
form.append("file", imageFile);

const res = await fetch("/api/uploadImage", { method: "POST", body: form });
const { url } = await res.json();
// store `url` as head.banner in the MongoDB document
```

The route requires the user to be signed in via Okta. It returns `{ url: "https://..." }` on success.

---

## How Metadata Uses the Images

The `generateMetadata` function in `app/[slug]/page.js` reads `head.banner` from the MongoDB document and uses it as the Open Graph and Twitter card image. These require an absolute URL, which Vercel Blob provides automatically.
