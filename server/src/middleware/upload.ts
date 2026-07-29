import multer from 'multer';
import { Request } from 'express';
import { createError } from './errorHandler';
import {
  UPLOAD_MAX_FILE_SIZE,
  UPLOAD_ALLOWED_MIME_TYPES,
} from '@shared/uploadConfig';

/**
 * MIME types accepted by the browser-side file picker filter.
 * Sprint 1: browser-reported MIME type only.
 * Sprint 3: replaced by decoded file signature validation via sharp,
 *           which accepts a valid JPEG/PNG/WebP regardless of filename or browser MIME type.
 */
const ALLOWED_MIME_TYPES = new Set<string>(UPLOAD_ALLOWED_MIME_TYPES);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: UPLOAD_MAX_FILE_SIZE,
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
