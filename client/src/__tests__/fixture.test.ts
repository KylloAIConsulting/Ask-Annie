import { ZodError } from 'zod';
import { AnnieResponseSchema } from '@shared/annieResponse';
import {
  FIXTURE_LOWER_RISK,
  FIXTURE_CONCERNING,
  FIXTURE_HIGH_RISK,
  selectFixture,
  resolveFixture,
} from '../api/fixture';

// ---------------------------------------------------------------------------
// Schema compliance
// ---------------------------------------------------------------------------

describe('fixtures — schema compliance', () => {
  it('LOWER_RISK parses against AnnieResponseSchema', () => {
    expect(() => AnnieResponseSchema.parse(FIXTURE_LOWER_RISK)).not.toThrow();
  });

  it('CONCERNING parses against AnnieResponseSchema', () => {
    expect(() => AnnieResponseSchema.parse(FIXTURE_CONCERNING)).not.toThrow();
  });

  it('HIGH_RISK parses against AnnieResponseSchema', () => {
    expect(() => AnnieResponseSchema.parse(FIXTURE_HIGH_RISK)).not.toThrow();
  });

  it('a tampered fixture fails AnnieResponseSchema', () => {
    expect(() =>
      AnnieResponseSchema.parse({ ...FIXTURE_LOWER_RISK, riskLevel: 'SAFE' }),
    ).toThrow(ZodError);
  });
});

// ---------------------------------------------------------------------------
// Risk levels
// ---------------------------------------------------------------------------

describe('fixtures — risk levels', () => {
  it('FIXTURE_LOWER_RISK has riskLevel "LOWER_RISK"', () => {
    expect(FIXTURE_LOWER_RISK.riskLevel).toBe('LOWER_RISK');
  });

  it('FIXTURE_CONCERNING has riskLevel "CONCERNING"', () => {
    expect(FIXTURE_CONCERNING.riskLevel).toBe('CONCERNING');
  });

  it('FIXTURE_HIGH_RISK has riskLevel "HIGH_RISK"', () => {
    expect(FIXTURE_HIGH_RISK.riskLevel).toBe('HIGH_RISK');
  });
});

// ---------------------------------------------------------------------------
// HIGH_RISK conditional fields
// ---------------------------------------------------------------------------

describe('FIXTURE_HIGH_RISK — conditional fields', () => {
  it('has non-empty emergencyAdvice', () => {
    expect(FIXTURE_HIGH_RISK.emergencyAdvice.length).toBeGreaterThan(0);
  });

  it('has requiresHumanReview set to true', () => {
    expect(FIXTURE_HIGH_RISK.requiresHumanReview).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// CONCERNING conditional fields
// ---------------------------------------------------------------------------

describe('FIXTURE_CONCERNING — conditional fields', () => {
  it('has at least one entry in thingsToAvoid', () => {
    expect(FIXTURE_CONCERNING.thingsToAvoid.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// LOWER_RISK — absence of conditional sections
// ---------------------------------------------------------------------------

describe('FIXTURE_LOWER_RISK — absence of conditional sections', () => {
  it('has empty emergencyAdvice', () => {
    expect(FIXTURE_LOWER_RISK.emergencyAdvice).toBe('');
  });

  it('has requiresHumanReview set to false', () => {
    expect(FIXTURE_LOWER_RISK.requiresHumanReview).toBe(false);
  });

  it('has no warningSigns', () => {
    expect(FIXTURE_LOWER_RISK.warningSigns).toHaveLength(0);
  });

  it('has no thingsToAvoid', () => {
    expect(FIXTURE_LOWER_RISK.thingsToAvoid).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// selectFixture
// ---------------------------------------------------------------------------

describe('selectFixture', () => {
  it('returns FIXTURE_LOWER_RISK for "LOWER_RISK"', () => {
    expect(selectFixture('LOWER_RISK')).toBe(FIXTURE_LOWER_RISK);
  });

  it('returns FIXTURE_CONCERNING for "CONCERNING"', () => {
    expect(selectFixture('CONCERNING')).toBe(FIXTURE_CONCERNING);
  });

  it('returns FIXTURE_HIGH_RISK for "HIGH_RISK"', () => {
    expect(selectFixture('HIGH_RISK')).toBe(FIXTURE_HIGH_RISK);
  });

  it('defaults to FIXTURE_LOWER_RISK when called with no argument', () => {
    expect(selectFixture()).toBe(FIXTURE_LOWER_RISK);
  });

  it('defaults to FIXTURE_LOWER_RISK for an unrecognised string', () => {
    expect(selectFixture('DEFINITELY_SAFE')).toBe(FIXTURE_LOWER_RISK);
  });

  it('defaults to FIXTURE_LOWER_RISK for an empty string', () => {
    expect(selectFixture('')).toBe(FIXTURE_LOWER_RISK);
  });

  it('defaults to FIXTURE_LOWER_RISK for undefined', () => {
    expect(selectFixture(undefined)).toBe(FIXTURE_LOWER_RISK);
  });
});

// ---------------------------------------------------------------------------
// resolveFixture
// ---------------------------------------------------------------------------

describe('resolveFixture', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves with the fixture after the specified delay', async () => {
    const promise = resolveFixture(FIXTURE_LOWER_RISK, 500);
    jest.advanceTimersByTime(500);
    const result = await promise;
    expect(result).toBe(FIXTURE_LOWER_RISK);
  });

  it('does not resolve before the delay has elapsed', async () => {
    let resolved = false;
    resolveFixture(FIXTURE_LOWER_RISK, 1000).then(() => {
      resolved = true;
    });
    jest.advanceTimersByTime(999);
    // Flush microtasks without advancing macrotimers further
    await Promise.resolve();
    expect(resolved).toBe(false);
  });

  it('uses 1500 ms as the default delay', async () => {
    const promise = resolveFixture(FIXTURE_LOWER_RISK);
    jest.advanceTimersByTime(1500);
    const result = await promise;
    expect(result).toBe(FIXTURE_LOWER_RISK);
  });

  it('rejects with a DOMException named AbortError when aborted before resolution', async () => {
    const controller = new AbortController();
    const promise = resolveFixture(FIXTURE_LOWER_RISK, 1500, controller.signal);
    controller.abort();

    let caught: unknown;
    try {
      await promise;
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(DOMException);
    expect((caught as DOMException).name).toBe('AbortError');
  });

  it('rejects immediately when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    let caught: unknown;
    try {
      await resolveFixture(FIXTURE_LOWER_RISK, 1500, controller.signal);
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(DOMException);
    expect((caught as DOMException).name).toBe('AbortError');
  });

  it('clears the timer after abort so no unresolved timers remain', () => {
    const controller = new AbortController();
    resolveFixture(FIXTURE_LOWER_RISK, 1500, controller.signal).catch(() => {
      // expected rejection — suppress unhandled-promise-rejection warning
    });
    controller.abort();
    expect(jest.getTimerCount()).toBe(0);
  });

  it('resolves with a different fixture when passed FIXTURE_HIGH_RISK', async () => {
    const promise = resolveFixture(FIXTURE_HIGH_RISK, 100);
    jest.advanceTimersByTime(100);
    const result = await promise;
    expect(result).toBe(FIXTURE_HIGH_RISK);
  });
});
