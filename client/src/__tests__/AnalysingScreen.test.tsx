import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import AnalysingScreen from '../screens/AnalysingScreen/AnalysingScreen';
import type { AnnieResponse } from '../types/annie';
import { FIXTURE_LOWER_RISK } from '../api/fixture';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deferred promise — lets tests control exactly when analyse resolves/rejects. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/**
 * Creates a jest.fn() `analyse` mock that:
 *   - listens for abort on the supplied signal and rejects with AbortError
 *   - never resolves on its own (caller must drive it via deferred())
 *
 * This lets timeout and cancel tests work correctly because the AbortController
 * abort propagates through to the catch block in AnalysingScreen.
 */
function makeAbortableAnalyse(signal?: { resolve?: (r: AnnieResponse) => void }) {
  return jest.fn().mockImplementation((abortSignal: AbortSignal) => {
    return new Promise<AnnieResponse>((resolve, reject) => {
      if (abortSignal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
      abortSignal.addEventListener('abort', onAbort, { once: true });
      if (signal) signal.resolve = resolve;
    });
  });
}

const defaultOnSuccess = jest.fn();
const defaultOnCancel = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe('AnalysingScreen — loading state', () => {
  it('renders without crashing', () => {
    const { promise } = deferred<AnnieResponse>();
    render(
      <main>
        <AnalysingScreen
          analyse={jest.fn().mockReturnValue(promise)}
          onSuccess={defaultOnSuccess}
          onCancel={defaultOnCancel}
        />
      </main>,
    );
  });

  it('has the screen-analysing testid', () => {
    const { promise } = deferred<AnnieResponse>();
    render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={defaultOnSuccess}
        onCancel={defaultOnCancel}
      />,
    );
    expect(screen.getByTestId('screen-analysing')).toBeTruthy();
  });

  it('shows the loading heading', () => {
    const { promise } = deferred<AnnieResponse>();
    render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={defaultOnSuccess}
        onCancel={defaultOnCancel}
      />,
    );
    expect(
      screen.getByRole('heading', {
        name: /annie is checking for warning signs/i,
      }),
    ).toBeTruthy();
  });

  it('shows supporting text', () => {
    const { promise } = deferred<AnnieResponse>();
    render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={defaultOnSuccess}
        onCancel={defaultOnCancel}
      />,
    );
    expect(screen.getByText(/this usually takes a few seconds/i)).toBeTruthy();
  });

  it('shows the Cancel button', () => {
    const { promise } = deferred<AnnieResponse>();
    render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={defaultOnSuccess}
        onCancel={defaultOnCancel}
      />,
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
  });

  it('renders the spinner with an accessible role and label', () => {
    const { promise } = deferred<AnnieResponse>();
    render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={defaultOnSuccess}
        onCancel={defaultOnCancel}
      />,
    );
    expect(screen.getByRole('status')).toBeTruthy();
    expect(
      screen.getByRole('status').getAttribute('aria-label'),
    ).toBeTruthy();
  });

  it('passes axe in the loading state', async () => {
    const { promise } = deferred<AnnieResponse>();
    const { container } = render(
      <main>
        <AnalysingScreen
          analyse={jest.fn().mockReturnValue(promise)}
          onSuccess={defaultOnSuccess}
          onCancel={defaultOnCancel}
        />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Cancel behaviour
// ---------------------------------------------------------------------------

describe('AnalysingScreen — Cancel button', () => {
  it('calls onCancel when Cancel is clicked in the loading state', async () => {
    const onCancel = jest.fn();
    const { promise } = deferred<AnnieResponse>();
    render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={jest.fn()}
        onCancel={onCancel}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('aborts the in-flight signal when Cancel is clicked', async () => {
    let capturedSignal: AbortSignal | null = null;
    const analyse = jest.fn().mockImplementation((signal: AbortSignal) => {
      capturedSignal = signal;
      return new Promise(() => {}); // never resolves
    });

    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(capturedSignal).not.toBeNull();
    expect((capturedSignal as unknown as AbortSignal).aborted).toBe(false);

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect((capturedSignal as unknown as AbortSignal).aborted).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Successful analysis
// ---------------------------------------------------------------------------

describe('AnalysingScreen — successful analysis', () => {
  it('calls onSuccess with the result when analyse resolves', async () => {
    const onSuccess = jest.fn();
    const { promise, resolve } = deferred<AnnieResponse>();
    render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={onSuccess}
        onCancel={jest.fn()}
      />,
    );

    await act(async () => {
      resolve(FIXTURE_LOWER_RISK);
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(FIXTURE_LOWER_RISK);
  });

  it('does not call onSuccess more than once', async () => {
    const onSuccess = jest.fn();
    const { promise, resolve } = deferred<AnnieResponse>();
    render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={onSuccess}
        onCancel={jest.fn()}
      />,
    );

    await act(async () => {
      resolve(FIXTURE_LOWER_RISK);
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// API error state
// ---------------------------------------------------------------------------

describe('AnalysingScreen — API error state', () => {
  it('shows the error heading when analyse rejects', async () => {
    const analyse = jest
      .fn()
      .mockRejectedValue(new Error('Service unavailable'));
    render(
      <main>
        <AnalysingScreen
          analyse={analyse}
          onSuccess={jest.fn()}
          onCancel={jest.fn()}
        />
      </main>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /something went wrong/i }),
      ).toBeTruthy();
    });
  });

  it('shows the error message from the rejection', async () => {
    const analyse = jest
      .fn()
      .mockRejectedValue(new Error('Service temporarily unavailable.'));
    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByText(/service temporarily unavailable\./i),
      ).toBeTruthy();
    });
  });

  it('shows a "Try again" button in the error state', async () => {
    const analyse = jest
      .fn()
      .mockRejectedValue(new Error('Service unavailable'));
    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
    });
  });

  it('shows a "Cancel" button in the error state', async () => {
    const analyse = jest
      .fn()
      .mockRejectedValue(new Error('Service unavailable'));
    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
    });
  });

  it('passes axe in the error state', async () => {
    const analyse = jest
      .fn()
      .mockRejectedValue(new Error('Service unavailable'));
    const { container } = render(
      <main>
        <AnalysingScreen
          analyse={analyse}
          onSuccess={jest.fn()}
          onCancel={jest.fn()}
        />
      </main>,
    );
    await waitFor(() =>
      screen.getByRole('heading', { name: /something went wrong/i }),
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls onCancel when Cancel is clicked in the error state', async () => {
    const onCancel = jest.fn();
    const analyse = jest
      .fn()
      .mockRejectedValue(new Error('Service unavailable'));
    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={onCancel}
      />,
    );
    await waitFor(() =>
      screen.getByRole('button', { name: 'Cancel' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Try again (retry)
// ---------------------------------------------------------------------------

describe('AnalysingScreen — Try again', () => {
  it('returns to the loading state when Try again is clicked', async () => {
    const analyse = jest
      .fn()
      .mockRejectedValueOnce(new Error('Service unavailable'))
      .mockReturnValue(new Promise(() => {})); // second call hangs

    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    await waitFor(() =>
      screen.getByRole('button', { name: 'Try again' }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(
      screen.getByRole('heading', {
        name: /annie is checking for warning signs/i,
      }),
    ).toBeTruthy();
  });

  it('calls analyse a second time after Try again', async () => {
    const analyse = jest
      .fn()
      .mockRejectedValueOnce(new Error('Service unavailable'))
      .mockReturnValue(new Promise(() => {}));

    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    await waitFor(() =>
      screen.getByRole('button', { name: 'Try again' }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(analyse).toHaveBeenCalledTimes(2);
  });

  it('calls onSuccess after a successful retry', async () => {
    const onSuccess = jest.fn();
    const { promise, resolve } = deferred<AnnieResponse>();

    const analyse = jest
      .fn()
      .mockRejectedValueOnce(new Error('Service unavailable'))
      .mockReturnValueOnce(promise);

    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={onSuccess}
        onCancel={jest.fn()}
      />,
    );

    await waitFor(() =>
      screen.getByRole('button', { name: 'Try again' }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    await act(async () => {
      resolve(FIXTURE_LOWER_RISK);
    });

    expect(onSuccess).toHaveBeenCalledWith(FIXTURE_LOWER_RISK);
  });
});

// ---------------------------------------------------------------------------
// Timeout
// ---------------------------------------------------------------------------

describe('AnalysingScreen — timeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the timed-out error heading after timeoutMs has elapsed', async () => {
    const analyse = makeAbortableAnalyse();
    render(
      <main>
        <AnalysingScreen
          analyse={analyse}
          onSuccess={jest.fn()}
          onCancel={jest.fn()}
          timeoutMs={1000}
        />
      </main>,
    );

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /this is taking longer than expected/i,
        }),
      ).toBeTruthy();
    });
  });

  it('shows the timeout supporting message', async () => {
    const analyse = makeAbortableAnalyse();
    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
        timeoutMs={500}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/annie wasn't able to get a result in time/i),
      ).toBeTruthy();
    });
  });

  it('does not call onSuccess after a timeout', async () => {
    const onSuccess = jest.fn();
    const analyse = makeAbortableAnalyse();
    render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={onSuccess}
        onCancel={jest.fn()}
        timeoutMs={500}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() =>
      screen.getByRole('heading', { name: /taking longer/i }),
    );

    expect(onSuccess).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Component cleanup — abort on unmount
// ---------------------------------------------------------------------------

describe('AnalysingScreen — cleanup on unmount', () => {
  it('aborts the in-flight signal when the component unmounts', () => {
    let capturedSignal: AbortSignal | null = null;
    const analyse = jest.fn().mockImplementation((signal: AbortSignal) => {
      capturedSignal = signal;
      return new Promise(() => {}); // never resolves on its own
    });

    const { unmount } = render(
      <AnalysingScreen
        analyse={analyse}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(capturedSignal).not.toBeNull();
    expect((capturedSignal as unknown as AbortSignal).aborted).toBe(false);

    unmount();

    expect((capturedSignal as unknown as AbortSignal).aborted).toBe(true);
  });

  it('does not call onSuccess after the component unmounts', async () => {
    const onSuccess = jest.fn();
    const { promise, resolve } = deferred<AnnieResponse>();

    const { unmount } = render(
      <AnalysingScreen
        analyse={jest.fn().mockReturnValue(promise)}
        onSuccess={onSuccess}
        onCancel={jest.fn()}
      />,
    );

    unmount();

    // Resolve the promise after unmount — onSuccess must not be called.
    await act(async () => {
      resolve(FIXTURE_LOWER_RISK);
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
