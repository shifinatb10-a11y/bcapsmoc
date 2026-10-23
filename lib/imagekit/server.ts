/**
 * ImageKit server-side utilities.
 *
 * ImageKit is used as the dedicated media CDN for the BCA Department Portal.
 * It handles:
 *   - Gallery images (with automatic WebP conversion + responsive sizing)
 *   - Gallery videos (stored as external URLs — YouTube/Drive; thumbnails via IK)
 *   - Department magazines / association covers
 *   - Event report cover images
 *
 * Required environment variables (add to .env.local and Vercel):
 *   IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxx
 *   IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxx
 *   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_ID
 */

import ImageKit from "imagekit";

function getImageKit(): ImageKit {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit credentials are not configured. " +
        "Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT " +
        "in your environment variables.",
    );
  }

  return new ImageKit({ publicKey, privateKey, urlEndpoint });
}

export interface IKUploadResult {
  url: string;
  thumbnailUrl: string;
  fileId: string;
  name: string;
}

/**
 * Uploads a File (server-side) to ImageKit and returns the CDN URL.
 *
 * @param file   - The File object to upload (from FormData)
 * @param folder - Destination folder in ImageKit (e.g. "gallery", "covers")
 * @param tags   - Optional tags for searchability
 */
export async function uploadToImageKit(
  file: File,
  folder: string,
  tags: string[] = [],
): Promise<{ data?: IKUploadResult; error?: string }> {
  if (!file || file.size === 0) {
    return { error: "No file provided." };
  }

  // Max 50 MB guard
  if (file.size > 50 * 1024 * 1024) {
    return { error: "File size exceeds 50 MB limit." };
  }

  try {
    const ik = getImageKit();
    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await ik.upload({
      file: buffer,
      fileName: file.name,
      folder,
      tags,
      useUniqueFileName: true,
      isPrivateFile: false,
      responseFields: ["url", "thumbnailUrl", "fileId", "name"],
    });

    return {
      data: {
        url: response.url,
        thumbnailUrl: response.thumbnailUrl ?? response.url,
        fileId: response.fileId,
        name: response.name,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: `ImageKit upload failed: ${message}` };
  }
}

/**
 * Deletes a file from ImageKit by its fileId.
 * Called when an admin removes a gallery item.
 */
export async function deleteFromImageKit(
  fileId: string,
): Promise<{ error?: string }> {
  if (!fileId) return {};
  try {
    const ik = getImageKit();
    await ik.deleteFile(fileId);
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: `ImageKit delete failed: ${message}` };
  }
}
