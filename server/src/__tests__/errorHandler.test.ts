import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler, createError } from '../middleware/errorHandler';

function mockReqRes() {
  const req = { requestId: 'test-uuid-1234' } as unknown as Request;
  const jsonMock = vi.fn();
  const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
  const res = { status: statusMock, json: jsonMock } as unknown as Response;
  // Mimic Express chaining: res.status(x).json(y)
  statusMock.mockReturnValue({ json: jsonMock });
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next, statusMock, jsonMock };
}

describe('errorHandler', () => {
  it('responds with the correct HTTP status code', () => {
    const { req, res, next, statusMock } = mockReqRes();
    errorHandler(createError('Validation failed.', 400, 'VALIDATION_ERROR'), req, res, next);
    expect(statusMock).toHaveBeenCalledWith(400);
  });

  it('includes the error category in the response', () => {
    const { req, res, next, statusMock, jsonMock } = mockReqRes();
    errorHandler(createError('Not found.', 404, 'NOT_FOUND'), req, res, next);
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'NOT_FOUND' })
    );
  });

  it('always includes the requestId', () => {
    const { req, res, next, jsonMock } = mockReqRes();
    errorHandler(createError('Some error.', 400, 'VALIDATION_ERROR'), req, res, next);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: 'test-uuid-1234' })
    );
  });

  it('does not include a stack trace in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { req, res, next, jsonMock } = mockReqRes();
    const err = createError('Internal.', 500, 'INTERNAL_ERROR');
    err.stack = 'Error: Internal.\n  at somewhere (file.ts:1:1)';
    errorHandler(err, req, res, next);
    const payload = jsonMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.stack).toBeUndefined();
    vi.unstubAllEnvs();
  });

  it('returns a generic message for 500 errors in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { req, res, next, jsonMock } = mockReqRes();
    errorHandler(createError('Sensitive internal details.', 500, 'INTERNAL_ERROR'), req, res, next);
    const payload = jsonMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.message).toBe('An unexpected error occurred.');
    vi.unstubAllEnvs();
  });

  it('includes the real message for non-500 errors in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { req, res, next, jsonMock } = mockReqRes();
    errorHandler(createError('Field is required.', 400, 'VALIDATION_ERROR'), req, res, next);
    const payload = jsonMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.message).toBe('Field is required.');
    vi.unstubAllEnvs();
  });
});

describe('createError', () => {
  it('sets statusCode and category on the error', () => {
    const err = createError('Test.', 422, 'VALIDATION_ERROR');
    expect(err.statusCode).toBe(422);
    expect(err.category).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('Test.');
  });
});
