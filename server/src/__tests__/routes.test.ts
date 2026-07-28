import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';

// Ensure mock AI is active for all route tests
beforeAll(() => {
  process.env.USE_MOCK_AI = 'true';
});

describe('GET /health', () => {
  it('returns 200 with { ok: true }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('does not include rate limit headers (not rate-limited)', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['ratelimit-limit']).toBeUndefined();
    expect(res.headers['x-ratelimit-limit']).toBeUndefined();
  });
});

describe('POST /api/feedback', () => {
  it('returns 200 { ok: true } for a valid request', async () => {
    const res = await request(app).post('/api/feedback').send({ answer: 'yes' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('returns 200 with all three valid answer values', async () => {
    for (const answer of ['yes', 'not_sure', 'no']) {
      const res = await request(app).post('/api/feedback').send({ answer });
      expect(res.status).toBe(200);
    }
  });

  it('returns 200 with optional written feedback present', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ answer: 'yes', writtenFeedback: 'It was helpful.' });
    expect(res.status).toBe(200);
  });

  it('returns 200 with empty written feedback', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ answer: 'no', writtenFeedback: '' });
    expect(res.status).toBe(200);
  });

  it('returns 200 with a valid outcome', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ answer: 'yes', outcome: 'stopped_and_checked' });
    expect(res.status).toBe(200);
  });

  it('returns 400 when answer is missing', async () => {
    const res = await request(app).post('/api/feedback').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.requestId).toBeDefined();
  });

  it('returns 400 for an invalid answer value', async () => {
    const res = await request(app).post('/api/feedback').send({ answer: 'maybe' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when written feedback exceeds 1000 characters', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ answer: 'yes', writtenFeedback: 'a'.repeat(1001) });
    expect(res.status).toBe(400);
  });

  it('includes rate limit headers (feedback endpoint is rate-limited)', async () => {
    const res = await request(app).post('/api/feedback').send({ answer: 'yes' });
    // express-rate-limit v7 uses standard RateLimit-Limit header
    expect(res.headers['ratelimit-limit']).toBe('20');
  });
});

describe('POST /api/analyse', () => {
  it('returns 501 (not yet implemented)', async () => {
    const res = await request(app).post('/api/analyse').send({ text: 'Test message' });
    expect(res.status).toBe(501);
    expect(res.body.error).toBe('NOT_IMPLEMENTED');
    expect(res.body.requestId).toBeDefined();
  });

  it('includes rate limit headers (analyse endpoint is rate-limited)', async () => {
    const res = await request(app).post('/api/analyse').send({ text: 'Test' });
    expect(res.headers['ratelimit-limit']).toBe('10');
  });

  it('analyse and feedback rate limits are independent', async () => {
    const analyseRes = await request(app).post('/api/analyse').send({ text: 'Test' });
    const feedbackRes = await request(app).post('/api/feedback').send({ answer: 'yes' });
    expect(analyseRes.headers['ratelimit-limit']).toBe('10');
    expect(feedbackRes.headers['ratelimit-limit']).toBe('20');
  });
});

describe('Error handler', () => {
  it('includes requestId in every error response', async () => {
    const res = await request(app).post('/api/feedback').send({});
    expect(res.body.requestId).toBeDefined();
    expect(typeof res.body.requestId).toBe('string');
  });

  it('returns the error category in the response body', async () => {
    const res = await request(app).post('/api/feedback').send({ answer: 'invalid' });
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });
});
