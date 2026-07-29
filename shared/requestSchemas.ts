import { z } from 'zod';

/** Maximum character length for the message text field. */
export const ANALYSE_TEXT_MAX_LENGTH = 10000;

/** Maximum character length for the optional context field. */
export const ANALYSE_CONTEXT_MAX_LENGTH = 500;

/**
 * Request schema for POST /api/analyse.
 * Text and image are both optional individually — the route handler
 * enforces that at least one must be present (image arrives via multipart).
 */
export const AnalyseTextSchema = z.object({
  text: z.string().min(1).max(ANALYSE_TEXT_MAX_LENGTH).optional(),
  context: z.string().max(ANALYSE_CONTEXT_MAX_LENGTH).optional(),
});

export type AnalyseText = z.infer<typeof AnalyseTextSchema>;

/**
 * Feedback answer options — maps to the three buttons on the Feedback screen.
 */
export const FeedbackAnswerSchema = z.enum(['yes', 'not_sure', 'no']);

/**
 * Optional outcome options — maps to the "What did you decide to do?" question.
 */
export const FeedbackOutcomeSchema = z.enum([
  'stopped_and_checked',
  'decided_not_to_continue',
  'continued_after_verifying',
  'still_unsure',
  'prefer_not_to_say',
]);

/**
 * Request schema for POST /api/feedback.
 * A selected answer is required. Written feedback and outcome are optional.
 * Selecting "Skip" on the client must NOT call this endpoint.
 */
export const FeedbackRequestSchema = z.object({
  answer: FeedbackAnswerSchema,
  writtenFeedback: z.string().max(1000).optional(),
  outcome: FeedbackOutcomeSchema.optional(),
});

export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;
export type FeedbackAnswer = z.infer<typeof FeedbackAnswerSchema>;
export type FeedbackOutcome = z.infer<typeof FeedbackOutcomeSchema>;
