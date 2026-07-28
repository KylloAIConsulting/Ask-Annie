import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('createAiService factory', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns a service with an analyse method when USE_MOCK_AI=true', async () => {
    vi.stubEnv('USE_MOCK_AI', 'true');
    const { createAiService } = await import('../services/aiService');
    const service = await createAiService();
    expect(typeof service.analyse).toBe('function');
    vi.unstubAllEnvs();
  });

  it('the mock service resolves successfully', async () => {
    vi.stubEnv('USE_MOCK_AI', 'true');
    const { createAiService } = await import('../services/aiService');
    const service = await createAiService();
    await expect(service.analyse({ text: 'test' })).resolves.toBeDefined();
    vi.unstubAllEnvs();
  });

  it('throws when USE_MOCK_AI is not true', async () => {
    vi.stubEnv('USE_MOCK_AI', 'false');
    const { createAiService } = await import('../services/aiService');
    await expect(createAiService()).rejects.toThrow();
    vi.unstubAllEnvs();
  });
});
