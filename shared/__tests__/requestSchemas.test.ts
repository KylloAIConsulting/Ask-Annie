import { FeedbackRequestSchema, AnalyseTextSchema } from '../requestSchemas';

describe('FeedbackRequestSchema', () => {
  it('passes with a valid answer', () => {
    expect(FeedbackRequestSchema.safeParse({ answer: 'yes' }).success).toBe(true);
    expect(FeedbackRequestSchema.safeParse({ answer: 'not_sure' }).success).toBe(true);
    expect(FeedbackRequestSchema.safeParse({ answer: 'no' }).success).toBe(true);
  });

  it('fails when answer is missing', () => {
    expect(FeedbackRequestSchema.safeParse({}).success).toBe(false);
  });

  it('fails for an invalid answer value', () => {
    expect(FeedbackRequestSchema.safeParse({ answer: 'maybe' }).success).toBe(false);
  });

  it('passes with optional written feedback', () => {
    expect(
      FeedbackRequestSchema.safeParse({ answer: 'yes', writtenFeedback: 'Very helpful.' }).success
    ).toBe(true);
  });

  it('passes with empty written feedback', () => {
    expect(
      FeedbackRequestSchema.safeParse({ answer: 'yes', writtenFeedback: '' }).success
    ).toBe(true);
  });

  it('fails when written feedback exceeds 1000 characters', () => {
    expect(
      FeedbackRequestSchema.safeParse({ answer: 'yes', writtenFeedback: 'a'.repeat(1001) }).success
    ).toBe(false);
  });

  it('passes with a valid optional outcome', () => {
    expect(
      FeedbackRequestSchema.safeParse({ answer: 'yes', outcome: 'stopped_and_checked' }).success
    ).toBe(true);
  });

  it('fails for an invalid outcome value', () => {
    expect(
      FeedbackRequestSchema.safeParse({ answer: 'yes', outcome: 'not_a_real_outcome' }).success
    ).toBe(false);
  });
});

describe('AnalyseTextSchema', () => {
  it('passes with valid text', () => {
    expect(AnalyseTextSchema.safeParse({ text: 'Hello' }).success).toBe(true);
  });

  it('passes with no fields (image-only path)', () => {
    expect(AnalyseTextSchema.safeParse({}).success).toBe(true);
  });

  it('fails when text exceeds 10,000 characters', () => {
    expect(AnalyseTextSchema.safeParse({ text: 'a'.repeat(10001) }).success).toBe(false);
  });

  it('fails when context exceeds 500 characters', () => {
    expect(AnalyseTextSchema.safeParse({ context: 'b'.repeat(501) }).success).toBe(false);
  });

  it('passes with valid context', () => {
    expect(
      AnalyseTextSchema.safeParse({ text: 'A message', context: 'I was not expecting this.' })
        .success
    ).toBe(true);
  });
});
