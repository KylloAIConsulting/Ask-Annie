/**
 * Re-exports the shared Zod schema for server-side use.
 * The shared schema is the single source of truth — do not redefine it here.
 */
export {
  AnnieResponseSchema,
  RiskLevelSchema,
  ConfidenceLevelSchema,
} from '@shared/annieResponse';

export type { AnnieResponse, RiskLevel, ConfidenceLevel } from '@shared/annieResponse';
