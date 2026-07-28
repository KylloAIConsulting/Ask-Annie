import { z } from 'zod';

export const RiskLevelSchema = z.enum(['LOWER_RISK', 'CONCERNING', 'HIGH_RISK']);
export const ConfidenceLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

/**
 * Single source of truth for the Annie response shape.
 * TypeScript types are derived from this schema via z.infer<>.
 * Do not duplicate or manually redefine these types anywhere else.
 */
export const AnnieResponseSchema = z
  .object({
    summary: z.string().min(1),
    riskLevel: RiskLevelSchema,
    confidence: ConfidenceLevelSchema,
    explanation: z.string().min(1),
    warningSigns: z.array(z.string()),
    recommendedActions: z.array(z.string()),
    thingsToAvoid: z.array(z.string()),
    officialVerificationAdvice: z.string(),
    privacyReminder: z.string(),
    emergencyAdvice: z.string(),
    requiresHumanReview: z.boolean(),
  })
  .strict();

export type AnnieResponse = z.infer<typeof AnnieResponseSchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;
