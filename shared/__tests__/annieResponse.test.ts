import { describe, it, expect } from 'vitest';
import { AnnieResponseSchema } from '../annieResponse';

const validResponse = {
  summary: 'Based on the information available, this message does not show obvious warning signs.',
  riskLevel: 'LOWER_RISK',
  confidence: 'HIGH',
  explanation: 'The message appears to come from a known source.',
  warningSigns: [],
  recommendedActions: ['Verify using official contact details.'],
  thingsToAvoid: [],
  officialVerificationAdvice: 'Check the official website.',
  privacyReminder: 'Do not share personal details unnecessarily.',
  emergencyAdvice: '',
  requiresHumanReview: false,
};

describe('AnnieResponseSchema', () => {
  it('passes for a valid response', () => {
    expect(AnnieResponseSchema.safeParse(validResponse).success).toBe(true);
  });

  it('fails when summary is missing', () => {
    const { summary: _s, ...rest } = validResponse;
    expect(AnnieResponseSchema.safeParse(rest).success).toBe(false);
  });

  it('fails when explanation is missing', () => {
    const { explanation: _e, ...rest } = validResponse;
    expect(AnnieResponseSchema.safeParse(rest).success).toBe(false);
  });

  it('fails for an invalid riskLevel', () => {
    expect(
      AnnieResponseSchema.safeParse({ ...validResponse, riskLevel: 'GREEN' }).success
    ).toBe(false);
  });

  it('fails for an invalid confidence value', () => {
    expect(
      AnnieResponseSchema.safeParse({ ...validResponse, confidence: 'VERY_HIGH' }).success
    ).toBe(false);
  });

  it('fails when requiresHumanReview is not a boolean', () => {
    expect(
      AnnieResponseSchema.safeParse({ ...validResponse, requiresHumanReview: 'yes' }).success
    ).toBe(false);
  });

  it('fails when warningSigns is not an array', () => {
    expect(
      AnnieResponseSchema.safeParse({ ...validResponse, warningSigns: 'none' }).success
    ).toBe(false);
  });

  it('fails when an extra field is present (strict schema)', () => {
    expect(
      AnnieResponseSchema.safeParse({ ...validResponse, unknownField: 'surprise' }).success
    ).toBe(false);
  });

  it('accepts all three valid riskLevel values', () => {
    for (const riskLevel of ['LOWER_RISK', 'CONCERNING', 'HIGH_RISK']) {
      expect(
        AnnieResponseSchema.safeParse({ ...validResponse, riskLevel }).success
      ).toBe(true);
    }
  });

  it('accepts all three valid confidence values', () => {
    for (const confidence of ['LOW', 'MEDIUM', 'HIGH']) {
      expect(
        AnnieResponseSchema.safeParse({ ...validResponse, confidence }).success
      ).toBe(true);
    }
  });
});
