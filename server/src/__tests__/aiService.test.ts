describe('createAiService factory', () => {
  const originalEnv = process.env.USE_MOCK_AI;

  afterEach(() => {
    // Restore original env and clear module cache between tests
    if (originalEnv === undefined) {
      delete process.env.USE_MOCK_AI;
    } else {
      process.env.USE_MOCK_AI = originalEnv;
    }
    jest.resetModules();
  });

  it('returns a service with an analyse method when USE_MOCK_AI=true', async () => {
    process.env.USE_MOCK_AI = 'true';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createAiService } = require('../services/aiService') as typeof import('../services/aiService');
    const service = await createAiService();
    expect(typeof service.analyse).toBe('function');
  });

  it('the mock service resolves successfully', async () => {
    process.env.USE_MOCK_AI = 'true';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createAiService } = require('../services/aiService') as typeof import('../services/aiService');
    const service = await createAiService();
    await expect(service.analyse({ text: 'test' })).resolves.toBeDefined();
  });

  it('throws when USE_MOCK_AI is not true', async () => {
    process.env.USE_MOCK_AI = 'false';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createAiService } = require('../services/aiService') as typeof import('../services/aiService');
    await expect(createAiService()).rejects.toThrow();
  });
});
