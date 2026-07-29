/**
 * Raised for any non-2xx HTTP response from the Annie API.
 *
 * Distinguishable from network errors (TypeError), AbortError (DOMException),
 * and schema validation failures (ZodError) via instanceof checks.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    // Restore correct prototype chain for instanceof checks in transpiled code.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// ---------------------------------------------------------------------------
// Internal helper — shared by analyse.ts and feedback.ts
// ---------------------------------------------------------------------------

function isServerErrorBody(
  val: unknown,
): val is { message: string; code: string } {
  return (
    val !== null &&
    typeof val === 'object' &&
    'message' in val &&
    typeof (val as Record<string, unknown>).message === 'string' &&
    'code' in val &&
    typeof (val as Record<string, unknown>).code === 'string'
  );
}

/**
 * Attempts to extract a structured error from the response body.
 * Always resolves to an ApiError — never throws.
 */
export async function apiErrorFromResponse(response: Response): Promise<ApiError> {
  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    // Non-JSON body (e.g. plain-text, empty) — fall back to a generic message.
    return new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      'UNKNOWN_ERROR',
    );
  }

  if (isServerErrorBody(parsed)) {
    return new ApiError(parsed.message, response.status, parsed.code);
  }

  return new ApiError(
    `Request failed with status ${response.status}`,
    response.status,
    'UNKNOWN_ERROR',
  );
}
