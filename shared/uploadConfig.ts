/**
 * Upload constraints shared between the server (multer middleware) and the
 * client (SubmitScreen file validation).  A single source of truth prevents
 * the client from accepting files that the server will reject.
 */

/** Maximum accepted upload size in bytes (10 MB). */
export const UPLOAD_MAX_FILE_SIZE = 10 * 1024 * 1024;

/** MIME types accepted by the image upload endpoint. */
export const UPLOAD_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type UploadMimeType = (typeof UPLOAD_ALLOWED_MIME_TYPES)[number];
