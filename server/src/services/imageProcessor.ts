/**
 * Sprint 1: Stub only.
 *
 * Sprint 3 will implement:
 *   - Decode the image buffer to validate the actual format
 *     (accepts valid JPEG/PNG/WebP regardless of filename extension or browser MIME type;
 *      rejects unsupported formats, corrupt data and content that cannot be decoded as an image)
 *   - Re-encode with sharp (JPEG output)
 *   - Strip all metadata (EXIF, GPS, ICC profile, thumbnails)
 *   - Return base64 string for the OpenAI Responses API
 */

export interface ProcessedImage {
  base64: string;
  mimeType: 'image/jpeg';
}

export async function processImage(_buffer: Buffer): Promise<ProcessedImage> {
  throw new Error('Image processing is not yet implemented (Sprint 3).');
}
