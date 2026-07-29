import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AnalysingScreen.module.css';
import type { AnnieResponse } from '../../types/annie';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Internal reason for aborting the in-flight request.
 * Tracked via a ref so the async catch block can decide how to respond.
 *
 * - 'running'   — abort came from the Cancel button or component unmount;
 *                 no error state should be shown.
 * - 'timed_out' — abort came from the internal timeout; show the timeout
 *                 error state so the user can retry.
 */
type AbortReason = 'running' | 'timed_out';

type AnalyseState =
  | { status: 'loading' }
  | { status: 'error'; reason: 'timed_out' | 'api_error'; message: string };

export type AnalysingScreenProps = {
  /**
   * The analysis function to invoke. App builds this from the current
   * submission state (text or image) and the fixture flag.
   * Must be memoised (useCallback) by the caller so its identity is stable
   * across renders and the internal useEffect does not loop.
   */
  analyse: (signal: AbortSignal) => Promise<AnnieResponse>;
  /** Called with the validated result when analysis succeeds. */
  onSuccess: (result: AnnieResponse) => void;
  /**
   * Called when the user cancels or chooses to go back after an error.
   * Typically navigates back to the submit screen.
   */
  onCancel: () => void;
  /**
   * Milliseconds before the in-flight request is aborted and the
   * "taking longer than expected" error is shown. Defaults to 30 000.
   * Tests pass a much lower value to keep execution fast.
   */
  timeoutMs?: number;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AnalysingScreen: React.FC<AnalysingScreenProps> = ({
  analyse,
  onSuccess,
  onCancel,
  timeoutMs = 30_000,
}) => {
  const [analyseState, setAnalyseState] = useState<AnalyseState>({
    status: 'loading',
  });
  const [retryKey, setRetryKey] = useState(0);

  // Keep latest callbacks in refs so the async effect can always call the
  // most recent version without needing them as dependencies (adding them
  // would cause a new abort/restart on every parent re-render).
  const onSuccessRef = useRef(onSuccess);
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onCancelRef.current = onCancel;
  });

  // Expose the current AbortController so the Cancel button can abort
  // synchronously. The ref is nulled in cleanup so stale calls are ignored.
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let abandoned = false;
    const controller = new AbortController();
    controllerRef.current = controller;

    // Default abort reason is 'running' (covers both user-cancel and unmount).
    // Only the internal timeout changes it to 'timed_out'.
    let abortReason: AbortReason = 'running';

    const timeoutId = setTimeout(() => {
      abortReason = 'timed_out';
      controller.abort();
    }, timeoutMs);

    const run = async (): Promise<void> => {
      try {
        const result = await analyse(controller.signal);
        clearTimeout(timeoutId);
        if (!abandoned) {
          onSuccessRef.current(result);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (abandoned) return;

        if (err instanceof DOMException && err.name === 'AbortError') {
          if (abortReason === 'timed_out') {
            setAnalyseState({
              status: 'error',
              reason: 'timed_out',
              message:
                "Annie wasn't able to get a result in time. This sometimes " +
                'happens when the service is busy.',
            });
          }
          // abortReason === 'running': cancel or unmount — no state update.
        } else {
          const message =
            err instanceof Error
              ? err.message
              : 'Something went wrong. Please try again.';
          setAnalyseState({ status: 'error', reason: 'api_error', message });
        }
      }
    };

    run();

    return () => {
      abandoned = true;
      clearTimeout(timeoutId);
      controller.abort(); // abortReason stays 'running' → catch is a no-op
      controllerRef.current = null;
    };
  }, [analyse, retryKey, timeoutMs]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleCancel = (): void => {
    // Abort immediately so the server request is cancelled without waiting
    // for the component to unmount. Double-abort (if onCancel navigates away
    // and cleanup also fires) is idempotent.
    controllerRef.current?.abort();
    onCancelRef.current();
  };

  const handleRetry = useCallback((): void => {
    setAnalyseState({ status: 'loading' });
    setRetryKey((k) => k + 1);
  }, []);

  // ---------------------------------------------------------------------------
  // Render — error state
  // ---------------------------------------------------------------------------

  if (analyseState.status === 'error') {
    const isTimeout = analyseState.reason === 'timed_out';

    return (
      <section
        className={styles.screen}
        data-testid="screen-analysing"
        aria-label={isTimeout ? 'Analysis timed out' : 'Analysis failed'}
      >
        <div className={styles.errorContent}>
          <h1 className={styles.heading}>
            {isTimeout
              ? 'This is taking longer than expected'
              : 'Something went wrong'}
          </h1>
          <p className={styles.supporting}>{analyseState.message}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleRetry}
            >
              Try again
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — loading state
  // ---------------------------------------------------------------------------

  return (
    <section
      className={styles.screen}
      data-testid="screen-analysing"
      aria-label="Annie is analysing your message"
    >
      <div className={styles.loadingContent}>
        <div
          className={styles.spinner}
          role="status"
          aria-label="Analysing your message"
        />
        <h1 className={styles.heading}>
          Annie is checking for warning signs
        </h1>
        <p className={styles.supporting}>
          This usually takes a few seconds.
        </p>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </section>
  );
};

export default AnalysingScreen;
