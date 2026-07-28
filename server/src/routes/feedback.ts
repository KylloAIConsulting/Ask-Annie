import { Router, Request, Response, NextFunction } from 'express';
import { feedbackLimiter } from '../middleware/rateLimit';
import { FeedbackRequestSchema } from '@shared/requestSchemas';
import { createError } from '../middleware/errorHandler';

export const feedbackRouter = Router();

/**
 * POST /api/feedback
 * Requires a selected answer (yes / not_sure / no).
 * Optional written feedback and outcome are accepted but not persisted.
 * MVP: validate the request, return success, discard the data.
 * Never log request bodies or any user-submitted content.
 *
 * Note: selecting "Skip" on the client must NOT call this endpoint.
 */
feedbackRouter.post(
  '/',
  feedbackLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    const result = FeedbackRequestSchema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join('; ');
      return next(createError(message, 400, 'VALIDATION_ERROR'));
    }

    // Discard without persistence — do not log user content
    res.status(200).json({ ok: true });
  }
);
