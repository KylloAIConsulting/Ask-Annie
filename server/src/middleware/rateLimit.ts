import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for POST /api/analyse.
 * 10 requests per 10 minutes per IP.
 * Trust proxy must be configured on the Express app before this is applied.
 */
export const analyseLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many analysis requests. Please wait a few minutes before trying again.',
  },
});

/**
 * Rate limiter for POST /api/feedback.
 * 20 requests per 10 minutes per IP — more generous than the analyse limit.
 */
export const feedbackLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please wait a few minutes before trying again.',
  },
});
