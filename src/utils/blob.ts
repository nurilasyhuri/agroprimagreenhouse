import { put, del } from '@vercel/blob';
import { db, media } from '../db';
import { eq } from 'drizzle-orm';

export interface UploadOptions {
  filename: string;
  contentType?: string;
  altText?: string;
}

/**
 * Upload an image or file to Vercel Blob and record it in the Neon database
 */
export async function uploadMedia(
  fileBuffer: Buffer | Blob | ArrayBuffer | string,
  options: UploadOptions
) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const uniquePathname = `articles/${Date.now()}-${options.filename.replace(/\s+/g, '-').toLowerCase()}`;

  const blobResult = await put(uniquePathname, fileBuffer, {
    access: 'public',
    contentType: options.contentType,
    token,
  });

  // Record in database
  const [record] = await db
    .insert(media)
    .values({
      url: blobResult.url,
      pathname: blobResult.pathname,
      filename: options.filename,
      contentType: options.contentType || 'image/webp',
      altText: options.altText || options.filename,
      createdAt: new Date(),
    })
    .returning();

  return {
    ...blobResult,
    record,
  };
}

/**
 * Delete a media item from Vercel Blob and from the Neon database
 */
export async function deleteMedia(url: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  await del(url, { token });
  await db.delete(media).where(eq(media.url, url));
}

/**
 * List media records
 */
export async function listMediaRecords(limit = 50) {
  return await db.select().from(media).limit(limit);
}
