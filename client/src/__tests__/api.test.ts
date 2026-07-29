import { analyseText, analyseImage, submitFeedback, ApiError } from '../api';
import type { AnnieResponse } from '../types/annie';
import type { FeedbackRequest } from '@shared/requestSchemas';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const validAnnieResponse: AnnieResponse = {
  summary: 'This message shows several warning signs of a phishing attempt.',
  riskLevel: 'HIGH_RISK',
  confidence: 'HIGH',
  explanation: 'Urgent language and requests for sensitive information.',
  warningSigns: ['Urgent language', 'Requests personal details'],
  recommendedActions: ['Do not reply.', 'Contact your bank directly.'],
  thingsToAvoid: ['Do not click any links.'],
  officialVerificationAdvice: 'Use contact details from the official website.',
  privacyReminder: 'Do not share this assessment with the original sender.',
  emergencyAdvice: '',
  requiresHumanReview: true,
};

const validFeedbackPayload: FeedbackRequest = {
  answer: 'yes',
  writtenFeedback: 'Very helpful, thank you.',
};

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function makeMockResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

function makeMockNonJsonResponse(status: number): Response {
  return {
    ok: false,
    status,
    json: jest
      .fn()
      .mockRejectedValue(new SyntaxError('Unexpected end of JSON input')),
  } as unknown as Response;
}

// ---------------------------------------------------------------------------
// Test lifecycle
//
// jest.spyOn(global, 'fetch') fails in this jsdom build because fetch is not
// a directly writable own property of global. The standard fix is to assign
// a jest.fn() mock directly and restore the original in afterEach.
// ---------------------------------------------------------------------------

let fetchMock: jest.Mock;
const originalFetch = global.fetch;

beforeEach(() => {
  fetchMock = jest.fn();
  global.fetch = fetchMock;
});

afterEach(() => {
  global.fetch = originalFetch;
});

// ---------------------------------------------------------------------------
// analyseText
// ---------------------------------------------------------------------------

describe('analyseText', () => {
  it('returns a validated AnnieResponse on success', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    const result = await analyseText('Check this suspicious email.');
    expect(result).toEqual(validAnnieResponse);
  });

  it('POSTs to /api/analyse with JSON content-type', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    await analyseText('Some text');
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/analyse');
    expect(options.method).toBe('POST');
    expect((options.headers as Record<string, string>)['Content-Type']).toBe(
      'application/json',
    );
  });

  it('includes context in the request body when provided', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    await analyseText('Some text', 'I did not expect this email.');
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(options.body as string) as Record<string, unknown>;
    expect(body.context).toBe('I did not expect this email.');
  });

  it('omits context from the request body when not provided', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    await analyseText('Some text');
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(options.body as string) as Record<string, unknown>;
    expect(Object.keys(body)).not.toContain('context');
  });

  it('throws ApiError for a non-2xx JSON error response', async () => {
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ message: 'Rate limit exceeded', code: 'RATE_LIMITED' }, 429),
    );
    await expect(analyseText('Some text')).rejects.toBeInstanceOf(ApiError);
  });

  it('populates ApiError with status and code from the server', async () => {
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ message: 'Rate limit exceeded', code: 'RATE_LIMITED' }, 429),
    );
    let caught: unknown;
    try {
      await analyseText('Some text');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.status).toBe(429);
    expect(apiErr.code).toBe('RATE_LIMITED');
    expect(apiErr.message).toBe('Rate limit exceeded');
  });

  it('throws ApiError with fallback code for a non-2xx non-JSON response', async () => {
    fetchMock.mockResolvedValueOnce(makeMockNonJsonResponse(503));
    let caught: unknown;
    try {
      await analyseText('Some text');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    const apiErr = caught as ApiError;
    expect(apiErr.status).toBe(503);
    expect(apiErr.code).toBe('UNKNOWN_ERROR');
  });

  it('throws ZodError (not ApiError) when the 200 response fails schema validation', async () => {
    const invalid = { ...validAnnieResponse, riskLevel: 'PROBABLY_FINE' };
    fetchMock.mockResolvedValueOnce(makeMockResponse(invalid));
    let caught: unknown;
    try {
      await analyseText('Some text');
    } catch (err) {
      caught = err;
    }
    expect(caught).not.toBeInstanceOf(ApiError);
    expect((caught as { issues?: unknown[] }).issues).toBeDefined();
  });

  it('lets AbortError propagate without wrapping in ApiError', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    fetchMock.mockRejectedValueOnce(abortError);
    let caught: unknown;
    try {
      await analyseText('Some text');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBe(abortError);
    expect(caught).not.toBeInstanceOf(ApiError);
  });

  it('propagates network errors without wrapping in ApiError', async () => {
    const networkError = new TypeError('Failed to fetch');
    fetchMock.mockRejectedValueOnce(networkError);
    let caught: unknown;
    try {
      await analyseText('Some text');
    } catch (err) {
      caught = err;
    }
    expect(caught).toBe(networkError);
    expect(caught).not.toBeInstanceOf(ApiError);
  });

  it('passes AbortSignal through to fetch', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    const controller = new AbortController();
    await analyseText('Some text', undefined, controller.signal);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.signal).toBe(controller.signal);
  });
});

// ---------------------------------------------------------------------------
// analyseImage
// ---------------------------------------------------------------------------

describe('analyseImage', () => {
  it('returns a validated AnnieResponse on success', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    const result = await analyseImage(file);
    expect(result).toEqual(validAnnieResponse);
  });

  it('POSTs to /api/analyse', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    await analyseImage(file);
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/analyse');
  });

  it('does not manually set Content-Type (lets browser set multipart boundary)', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    await analyseImage(file);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = options.headers as Record<string, string> | undefined;
    if (headers !== undefined) {
      expect(Object.keys(headers).map((k) => k.toLowerCase())).not.toContain(
        'content-type',
      );
    }
    // options.headers being undefined also satisfies the requirement
  });

  it('uses FormData as the request body', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    await analyseImage(file);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.body).toBeInstanceOf(FormData);
  });

  it('appends the file under the "image" field', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    await analyseImage(file);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const form = options.body as FormData;
    expect(form.get('image')).toBe(file);
  });

  it('throws ApiError for a non-2xx JSON error response', async () => {
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ message: 'Unsupported file type', code: 'INVALID_FILE' }, 422),
    );
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    await expect(analyseImage(file)).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError with fallback code for a non-2xx non-JSON response', async () => {
    fetchMock.mockResolvedValueOnce(makeMockNonJsonResponse(500));
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    let caught: unknown;
    try {
      await analyseImage(file);
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).code).toBe('UNKNOWN_ERROR');
  });

  it('throws ZodError (not ApiError) when the 200 response fails schema validation', async () => {
    const invalid = { ...validAnnieResponse, confidence: 'ABSOLUTE' };
    fetchMock.mockResolvedValueOnce(makeMockResponse(invalid));
    const file = new File(['data'], 'img.png', { type: 'image/png' });
    let caught: unknown;
    try {
      await analyseImage(file);
    } catch (err) {
      caught = err;
    }
    expect(caught).not.toBeInstanceOf(ApiError);
    expect((caught as { issues?: unknown[] }).issues).toBeDefined();
  });

  it('lets AbortError propagate without wrapping in ApiError', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    fetchMock.mockRejectedValueOnce(abortError);
    const file = new File(['data'], 'img.png', { type: 'image/png' });
    let caught: unknown;
    try {
      await analyseImage(file);
    } catch (err) {
      caught = err;
    }
    expect(caught).toBe(abortError);
    expect(caught).not.toBeInstanceOf(ApiError);
  });

  it('passes AbortSignal through to fetch', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(validAnnieResponse));
    const file = new File(['data'], 'img.png', { type: 'image/png' });
    const controller = new AbortController();
    await analyseImage(file, undefined, controller.signal);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.signal).toBe(controller.signal);
  });
});

// ---------------------------------------------------------------------------
// submitFeedback
// ---------------------------------------------------------------------------

describe('submitFeedback', () => {
  it('resolves to void on a 2xx response', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(null, 204));
    await expect(submitFeedback(validFeedbackPayload)).resolves.toBeUndefined();
  });

  it('POSTs to /api/feedback with JSON content-type', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse(null, 204));
    await submitFeedback(validFeedbackPayload);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/feedback');
    expect(options.method).toBe('POST');
    expect((options.headers as Record<string, string>)['Content-Type']).toBe(
      'application/json',
    );
  });

  it('throws ApiError for a non-2xx JSON error response', async () => {
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ message: 'Bad request', code: 'VALIDATION_ERROR' }, 400),
    );
    await expect(submitFeedback(validFeedbackPayload)).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError with fallback code for a non-2xx non-JSON response', async () => {
    fetchMock.mockResolvedValueOnce(makeMockNonJsonResponse(500));
    let caught: unknown;
    try {
      await submitFeedback(validFeedbackPayload);
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).code).toBe('UNKNOWN_ERROR');
  });
});

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

describe('ApiError', () => {
  it('is an instance of Error', () => {
    const err = new ApiError('Something went wrong', 500, 'SERVER_ERROR');
    expect(err).toBeInstanceOf(Error);
  });

  it('preserves the original error message', () => {
    const err = new ApiError('Specific failure message', 404, 'NOT_FOUND');
    expect(err.message).toBe('Specific failure message');
  });

  it('exposes status and code', () => {
    const err = new ApiError('Forbidden', 403, 'FORBIDDEN');
    expect(err.status).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('has name "ApiError"', () => {
    const err = new ApiError('Oops', 500, 'OOPS');
    expect(err.name).toBe('ApiError');
  });
});
