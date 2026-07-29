import { AnnieResponseSchema, type AnnieResponse } from '@shared/annieResponse';
import { apiErrorFromResponse } from './errors';

/**
 * POST /api/analyse — text submission.
 *
 * Validates the response against AnnieResponseSchema; throws ApiError on
 * non-2xx; lets AbortError and network errors propagate unchanged.
 */
export async function analyseText(
  text: string,
  context?: string,
  signal?: AbortSignal,
): Promise<AnnieResponse> {
  const payload: { text: string; context?: string } = { text };
  if (context !== undefined) {
    payload.context = context;
  }

  const response = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw await apiErrorFromResponse(response);
  }

  const data: unknown = await response.json();
  return AnnieResponseSchema.parse(data);
}

/**
 * POST /api/analyse — image submission (multipart/form-data).
 *
 * The Content-Type header must NOT be set manually; the browser must generate
 * it with the correct multipart boundary from the FormData object.
 *
 * Validates the response against AnnieResponseSchema; throws ApiError on
 * non-2xx; lets AbortError and network errors propagate unchanged.
 */
export async function analyseImage(
  file: File,
  context?: string,
  signal?: AbortSignal,
): Promise<AnnieResponse> {
  const form = new FormData();
  form.append('image', file);
  if (context !== undefined) {
    form.append('context', context);
  }

  const response = await fetch('/api/analyse', {
    method: 'POST',
    // No 'headers' — browser sets Content-Type: multipart/form-data; boundary=...
    body: form,
    signal,
  });

  if (!response.ok) {
    throw await apiErrorFromResponse(response);
  }

  const data: unknown = await response.json();
  return AnnieResponseSchema.parse(data);
}
