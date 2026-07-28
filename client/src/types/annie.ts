/**
 * Re-exports z.infer<> types from the shared Zod schema.
 * Do not define or duplicate response types in the client — import from here.
 */
export type { AnnieResponse, RiskLevel, ConfidenceLevel } from '@shared/annieResponse';

export type {
  FeedbackRequest,
  FeedbackAnswer,
  FeedbackOutcome,
} from '@shared/requestSchemas';
