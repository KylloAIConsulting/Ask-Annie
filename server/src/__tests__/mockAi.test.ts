import { describe, it, expect, beforeEach } from 'vitest';
import { MockAiService } from '../services/mockAi';
import { AnnieResponseSchema } from '@shared/annieResponse';

describe('MockAiService', () => {
  let service: MockAiService;

  beforeEach(() => {
    service = new MockAiService();
  });

  it('returns LOWER_RISK by default', async () => {
    const response = await service.analyse({ text: 'This is a normal message.' });
    expect(response.riskLevel).toBe('LOWER_RISK');
  });

  it('returns CONCERNING when text contains __MOCK_CONCERNING__', async () => {
    const response = await service.analyse({ text: '__MOCK_CONCERNING__ test input' });
    expect(response.riskLevel).toBe('CONCERNING');
  });

  it('returns HIGH_RISK when text contains __MOCK_HIGH_RISK__', async () => {
    const response = await service.analyse({ text: '__MOCK_HIGH_RISK__ test input' });
    expect(response.riskLevel).toBe('HIGH_RISK');
  });

  it('returns LOWER_RISK when text is empty', async () => {
    const response = await service.analyse({});
    expect(response.riskLevel).toBe('LOWER_RISK');
  });

  it('returns LOWER_RISK for image-only input', async () => {
    const response = await service.analyse({ imageBase64: 'abc123' });
    expect(response.riskLevel).toBe('LOWER_RISK');
  });

  it('every mock response passes the AnnieResponseSchema', async () => {
    const inputs = [
      { text: 'Normal message' },
      { text: '__MOCK_CONCERNING__' },
      { text: '__MOCK_HIGH_RISK__' },
    ];
    for (const input of inputs) {
      const response = await service.analyse(input);
      const result = AnnieResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    }
  });

  it('HIGH_RISK response has requiresHumanReview true', async () => {
    const response = await service.analyse({ text: '__MOCK_HIGH_RISK__' });
    expect(response.requiresHumanReview).toBe(true);
  });

  it('LOWER_RISK response has empty warningSigns', async () => {
    const response = await service.analyse({ text: 'Normal message' });
    expect(response.warningSigns).toEqual([]);
  });
});
