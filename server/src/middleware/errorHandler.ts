import { Request, Response, NextFunction } from 'express';

export type ErrorCategory =
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NOT_FOUND'
  | 'NOT_IMPLEMENTED'
  | 'INTERNAL_ERROR';

export interface AppError extends Error {
  statusCode?: number;
  category?: ErrorCategory;
}

export function createError(
  message: string,
  statusCode: number,
  category: ErrorCategory
): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.category = category;
  return err;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: AppError, req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode ?? 500;
  const category = err.category ?? 'INTERNAL_ERROR';
  const isProduction = process.env.NODE_ENV === 'production';

  // Never expose internal error details or stack traces in production
  const message =
    isProduction && statusCode === 500 ? 'An unexpected error occurred.' : err.message;

  const body: Record<string, unknown> = {
    error: category,
    message,
    requestId: req.requestId,
  };

  if (!isProduction && err.stack) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}
