import type { FeedbackRequest } from '@shared/requestSchemas';
import { apiErrorFromResponse } from './errors';

/**
 * POST /api/feedback — submit user feedback.
 *
 * Returns void on success. Throws ApiError on non-2xx.
 * Callers must not invoke this when the user selects "Skip".
 */
export async function submitFeedback(payload: FeedbackRequest): Promise<void> {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await apiErrorFromResponse(response);
  }
}
