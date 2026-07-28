import multer from 'multer';
import { Request } from 'express';
import { createError } from './errorHandler';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * MIME types accepted by the browser-side file picker filter.
 * Sprint 1: browser-reported MIME type only.
 * Sprint 3: replaced by decoded file signature validation via sharp,
 *           which accepts a valid JPEG/PNG/WebP regardless of filename or browser MIME type.
 */
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        createError(
          'This image type is not supported. Please choose a JPG, PNG or WebP image.',
          400,
          'VALIDATION_ERROR'
        )
      );
    }
  },
});
