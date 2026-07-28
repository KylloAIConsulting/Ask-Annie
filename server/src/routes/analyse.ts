import { Router, Request, Response, NextFunction } from 'express';
import { analyseLimiter } from '../middleware/rateLimit';
import { upload } from '../middleware/upload';
import { createError } from '../middleware/errorHandler';

export const analyseRouter = Router();

/**
 * POST /api/analyse
 * Sprint 1: Returns 501 — full AI analysis is implemented in Sprint 3.
 */
analyseRouter.post(
  '/',
  analyseLimiter,
  upload.single('image'),
  (_req: Request, _res: Response, next: NextFunction) => {
    next(createError('Analysis endpoint not yet implemented.', 501, 'NOT_IMPLEMENTED'));
  }
);
