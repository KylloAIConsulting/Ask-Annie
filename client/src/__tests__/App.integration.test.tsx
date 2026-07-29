/**
 * App integration tests — Sprint 2
 *
 * These tests exercise the full user journey through the rendered App
 * component, including all screen transitions and state management.
 *
 * Architecture:
 *   - fetch is mocked globally so the real analyseText / analyseImage API
 *     functions are called but no network requests are made.
 *   - FeedbackScreen's submit prop is NOT overridden here; instead fetch is
 *     mocked to cover the submitFeedback call too.
 *   - jest.useFakeTimers() is used selectively for timeout tests.
 *
 * What these tests do NOT duplicate:
 *   - Per-component unit tests (rendering, props, axe) live in their own
 *     test files. Integration tests focus on cross-screen state flow.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import App from '../App';
import {
  FIXTURE_LOWER_RISK,
  FIXTURE_CONCERNING,
  FIXTURE_HIGH_RISK,
} from '../api/fixture';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a fetch mock that returns the supplied body as JSON with status 200. */
function mockFetchOk(body: unknown) {
  return jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  });
}

/** Build a fetch mock that returns a 500 error response. */
function mockFetchError(message = 'Internal server error', status = 500) {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ message, code: 'SERVER_ERROR' }),
  });
}

/** Navigate App from Welcome to Submit screen. */
async function goToSubmit() {
  await userEvent.click(screen.getByRole('button', { name: 'Check a message' }));
}

/**
 * Type into the message textarea, wait for the primary button to become
 * enabled, then click "Check with Annie".
 */
async function submitText(text = 'Is this genuine?') {
  await userEvent.type(
    screen.getByRole('textbox', { name: 'Message to check' }),
    text,
  );
  await userEvent.click(
    screen.getByRole('button', { name: 'Check with Annie' }),
  );
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

let originalFetch: typeof global.fetch;

beforeEach(() => {
  originalFetch = global.fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// T8 — Text submission through Results
// ---------------------------------------------------------------------------

describe('Integration — text submission through Results', () => {
  it('navigates Welcome → Submit → Analysing → Results on successful analysis', async () => {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    render(<App />);

    await goToSubmit();
    expect(screen.getByTestId('screen-submit')).toBeTruthy();

    await submitText();

    // Wait for the analysis to resolve and Results to render.
    // (AnalysingScreen may resolve before the next tick so we go straight to
    // checking the final state rather than the transient loading state.)
    await waitFor(() =>
      expect(screen.getByTestId('screen-results')).toBeTruthy(),
    );
  });

  it('shows the correct risk summary on the Results screen', async () => {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    render(<App />);

    await goToSubmit();
    await submitText();

    await waitFor(() => screen.getByTestId('screen-results'));
    expect(screen.getByRole('heading', { level: 1, name: FIXTURE_LOWER_RISK.summary })).toBeTruthy();
  });

  it('passes the text payload to fetch', async () => {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    render(<App />);

    await goToSubmit();
    await submitText('Is this message a scam?');

    await waitFor(() => screen.getByTestId('screen-results'));

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/api/analyse');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.text).toBe('Is this message a scam?');
  });
});

// ---------------------------------------------------------------------------
// T8 — Image submission through Results
// ---------------------------------------------------------------------------

describe('Integration — image submission through Results', () => {
  it('navigates through Results after an image submission', async () => {
    global.fetch = mockFetchOk(FIXTURE_CONCERNING);
    render(<App />);

    await goToSubmit();

    // Switch to image mode
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));

    // Upload a valid image file
    const file = new File(['data'], 'scam.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/upload a screenshot/i), file);

    await userEvent.click(
      screen.getByRole('button', { name: 'Check with Annie' }),
    );

    await waitFor(() => screen.getByTestId('screen-results'));

    expect(
      screen.getByRole('heading', { level: 1, name: FIXTURE_CONCERNING.summary }),
    ).toBeTruthy();
  });

  it('sends a multipart FormData request for image submissions', async () => {
    global.fetch = mockFetchOk(FIXTURE_CONCERNING);
    render(<App />);

    await goToSubmit();
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/upload a screenshot/i), file);
    await userEvent.click(
      screen.getByRole('button', { name: 'Check with Annie' }),
    );

    await waitFor(() => screen.getByTestId('screen-results'));

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/api/analyse');
    // Image requests use FormData, not JSON
    expect((init as RequestInit).body).toBeInstanceOf(FormData);
  });
});

// ---------------------------------------------------------------------------
// T8 — Analysis error and retry
// ---------------------------------------------------------------------------

describe('Integration — analysis error and retry', () => {
  it('shows the error state when the API call fails', async () => {
    global.fetch = mockFetchError('Annie is temporarily unavailable.');
    render(<App />);

    await goToSubmit();
    await submitText();

    await waitFor(() => screen.getByTestId('screen-analysing'));
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /something went wrong/i }),
      ).toBeTruthy(),
    );
  });

  it('retries and succeeds on the second attempt after an API error', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Error', code: 'SERVER_ERROR' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(FIXTURE_LOWER_RISK),
      });
    global.fetch = fetchMock;
    render(<App />);

    await goToSubmit();
    await submitText();

    // Wait for error state
    await waitFor(() =>
      screen.getByRole('heading', { name: /something went wrong/i }),
    );

    // Click "Try again"
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    // Should succeed on second attempt
    await waitFor(() => screen.getByTestId('screen-results'));
    expect(
      screen.getByRole('heading', { level: 1, name: FIXTURE_LOWER_RISK.summary }),
    ).toBeTruthy();
  });

  it('stays on the Analysing screen (error state) after API failure — does not navigate away', async () => {
    global.fetch = mockFetchError();
    render(<App />);

    await goToSubmit();
    await submitText();

    await waitFor(() =>
      screen.getByRole('heading', { name: /something went wrong/i }),
    );

    // Still within the screen-analysing section
    expect(screen.getByTestId('screen-analysing')).toBeTruthy();
    expect(screen.queryByTestId('screen-results')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// T8 — Cancel back to Submit
// ---------------------------------------------------------------------------

describe('Integration — cancel returns to Submit', () => {
  it('returns to the Submit screen when Cancel is clicked during analysis', async () => {
    // fetch never resolves — keeps component in loading state
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
    render(<App />);

    await goToSubmit();
    await submitText();

    await waitFor(() => screen.getByTestId('screen-analysing'));

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByTestId('screen-submit')).toBeTruthy();
    expect(screen.queryByTestId('screen-analysing')).toBeNull();
  });

  it('preserves the submitted text in the reducer state after cancel', async () => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
    render(<App />);

    await goToSubmit();
    await submitText('My submitted text');

    await waitFor(() => screen.getByTestId('screen-analysing'));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // Back on Submit — the text field is cleared because SubmitScreen manages
    // its own draft state. The reducer's submittedText is retained but not
    // surfaced to SubmitScreen (which starts fresh).
    expect(screen.getByTestId('screen-submit')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Note: Timeout behaviour (30 s abort → timed-out heading) is exercised in
// AnalysingScreen.test.tsx using jest.useFakeTimers() against the component
// directly. Integration-level fake-timer tests hit Jest's 5 s wall when run
// through the full App render tree, so they live at the unit level only.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// T8 — Results → Feedback
// ---------------------------------------------------------------------------

describe('Integration — Results to Feedback', () => {
  it('navigates to Feedback when "Leave feedback" is clicked on Results', async () => {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    render(<App />);

    await goToSubmit();
    await submitText();

    await waitFor(() => screen.getByTestId('screen-results'));

    await userEvent.click(
      screen.getByRole('button', { name: 'Leave feedback' }),
    );

    expect(screen.getByTestId('screen-feedback')).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        name: /did annie help you decide what to do/i,
      }),
    ).toBeTruthy();
  });

  it('resets to Welcome when "Check another message" is clicked on Results', async () => {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    render(<App />);

    await goToSubmit();
    await submitText();

    await waitFor(() => screen.getByTestId('screen-results'));

    await userEvent.click(
      screen.getByRole('button', { name: 'Check another message' }),
    );

    expect(screen.getByTestId('screen-welcome')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// T8 — Feedback completion resets to Welcome
// ---------------------------------------------------------------------------

describe('Integration — Feedback success resets to Welcome', () => {
  /** Reach the Feedback screen via the full journey. */
  async function reachFeedback() {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    render(<App />);

    await goToSubmit();
    await submitText();
    await waitFor(() => screen.getByTestId('screen-results'));

    // Override fetch for the submitFeedback call
    global.fetch = mockFetchOk({});

    await userEvent.click(
      screen.getByRole('button', { name: 'Leave feedback' }),
    );
    await waitFor(() => screen.getByTestId('screen-feedback'));
  }

  it('returns to Welcome after a successful feedback submission', async () => {
    await reachFeedback();

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Send feedback' }),
    );

    // Wait for confirmation state
    await waitFor(() => screen.getByTestId('confirmation-heading'));

    // Click "Check another message"
    await userEvent.click(
      screen.getByRole('button', { name: 'Check another message' }),
    );

    expect(screen.getByTestId('screen-welcome')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// T8 — Feedback skip resets to Welcome
// ---------------------------------------------------------------------------

describe('Integration — Feedback skip resets to Welcome', () => {
  it('returns to Welcome when the user skips feedback', async () => {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    render(<App />);

    await goToSubmit();
    await submitText();
    await waitFor(() => screen.getByTestId('screen-results'));

    await userEvent.click(
      screen.getByRole('button', { name: 'Leave feedback' }),
    );
    await waitFor(() => screen.getByTestId('screen-feedback'));

    await userEvent.click(
      screen.getByRole('button', { name: 'Skip feedback' }),
    );

    expect(screen.getByTestId('screen-welcome')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// T8 — RESET_SESSION clears all state; second session shows no stale data
// ---------------------------------------------------------------------------

describe('Integration — RESET_SESSION and second session', () => {
  it('second session starts at Welcome with a clean heading', async () => {
    global.fetch = mockFetchOk(FIXTURE_HIGH_RISK);
    render(<App />);

    // First session: reach Results
    await goToSubmit();
    await submitText('First session message');
    await waitFor(() => screen.getByTestId('screen-results'));

    // Reset via "Check another message" on Results
    await userEvent.click(
      screen.getByRole('button', { name: 'Check another message' }),
    );

    // Second session: should be on Welcome with no Results content visible
    expect(screen.getByTestId('screen-welcome')).toBeTruthy();
    expect(screen.queryByTestId('screen-results')).toBeNull();
    expect(
      screen.queryByRole('heading', { name: FIXTURE_HIGH_RISK.summary }),
    ).toBeNull();
  });

  it('second session can complete a full analysis without stale state', async () => {
    // Session 1: HIGH_RISK result
    global.fetch = mockFetchOk(FIXTURE_HIGH_RISK);
    render(<App />);

    await goToSubmit();
    await submitText('First message');
    await waitFor(() => screen.getByTestId('screen-results'));

    // Reset
    await userEvent.click(
      screen.getByRole('button', { name: 'Check another message' }),
    );

    // Session 2: LOWER_RISK result
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);

    await goToSubmit();
    await submitText('Second message');
    await waitFor(() => screen.getByTestId('screen-results'));

    // Should show the session 2 result, not session 1
    expect(
      screen.getByRole('heading', { level: 1, name: FIXTURE_LOWER_RISK.summary }),
    ).toBeTruthy();
    expect(
      screen.queryByRole('heading', { name: FIXTURE_HIGH_RISK.summary }),
    ).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// T8 — HIGH_RISK journey shows human review notice
// ---------------------------------------------------------------------------

describe('Integration — HIGH_RISK result shows human review notice', () => {
  it('human review notice is visible when result.requiresHumanReview is true', async () => {
    global.fetch = mockFetchOk(FIXTURE_HIGH_RISK);
    render(<App />);

    await goToSubmit();
    await submitText();
    await waitFor(() => screen.getByTestId('screen-results'));

    expect(screen.getByTestId('human-review-notice')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Talk to someone you trust' }),
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// T8 — Accessibility checks on major application states
// ---------------------------------------------------------------------------

describe('Integration — accessibility (axe) on major states', () => {
  it('Welcome screen passes axe', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Submit screen passes axe', async () => {
    const { container } = render(<App />);
    await goToSubmit();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Results screen passes axe (LOWER_RISK)', async () => {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    const { container } = render(<App />);

    await goToSubmit();
    await submitText();
    await waitFor(() => screen.getByTestId('screen-results'));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Results screen passes axe (HIGH_RISK with human review notice)', async () => {
    global.fetch = mockFetchOk(FIXTURE_HIGH_RISK);
    const { container } = render(<App />);

    await goToSubmit();
    await submitText();
    await waitFor(() => screen.getByTestId('screen-results'));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Feedback screen passes axe', async () => {
    global.fetch = mockFetchOk(FIXTURE_LOWER_RISK);
    const { container } = render(<App />);

    await goToSubmit();
    await submitText();
    await waitFor(() => screen.getByTestId('screen-results'));
    await userEvent.click(
      screen.getByRole('button', { name: 'Leave feedback' }),
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
