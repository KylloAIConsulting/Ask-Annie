import React, { useEffect, useRef, useState } from 'react';
import styles from './FeedbackScreen.module.css';
import type {
  FeedbackAnswer,
  FeedbackOutcome,
  FeedbackRequest,
} from '@shared/requestSchemas';
import { submitFeedback as defaultSubmit } from '../../api/feedback';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Matches the schema's writtenFeedback .max(1000) constraint. */
const WRITTEN_FEEDBACK_MAX_LENGTH = 1000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FeedbackState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export type FeedbackScreenProps = {
  /**
   * Called when the user is done — either after a successful submission or
   * after clicking Skip. App wires this to RESET_SESSION so the journey
   * returns to the welcome screen.
   */
  onDone: () => void;
  /**
   * The feedback submission function. Defaults to the real API call.
   * Injected in tests so no global fetch mock is required.
   */
  submit?: (payload: FeedbackRequest) => Promise<void>;
};

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

const ANSWER_LABELS: Record<FeedbackAnswer, string> = {
  yes: 'Yes',
  not_sure: 'Not sure',
  no: 'No',
};

const OUTCOME_OPTIONS: { value: FeedbackOutcome; label: string }[] = [
  {
    value: 'stopped_and_checked',
    label: 'I stopped and checked before continuing',
  },
  {
    value: 'decided_not_to_continue',
    label: 'I decided not to continue',
  },
  {
    value: 'continued_after_verifying',
    label: 'I continued after verifying it was safe',
  },
  { value: 'still_unsure', label: "I'm still not sure what to do" },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Feedback screen — collects optional user feedback after Annie's assessment.
 *
 * States:
 *   idle       — question, answer selection, optional comments, Submit + Skip
 *   submitting — disabled controls with loading indicator
 *   success    — confirmation; heading receives programmatic focus for SR users
 *   error      — error message with Try again option
 *
 * The user can skip the screen at any time without submitting.
 * Skip does NOT call the submit prop — it calls onDone immediately.
 */
const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  onDone,
  submit = defaultSubmit,
}) => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    status: 'idle',
  });

  const [selectedAnswer, setSelectedAnswer] = useState<FeedbackAnswer | null>(
    null,
  );
  const [writtenFeedback, setWrittenFeedback] = useState('');
  const [selectedOutcome, setSelectedOutcome] =
    useState<FeedbackOutcome | null>(null);

  // ---------------------------------------------------------------------------
  // Refs
  // ---------------------------------------------------------------------------

  // Focus the success heading so screen readers announce the confirmation
  // without the user having to navigate to find it.
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (feedbackState.status === 'success') {
      successHeadingRef.current?.focus();
    }
  }, [feedbackState.status]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSubmit = async (): Promise<void> => {
    if (selectedAnswer === null) return;

    setFeedbackState({ status: 'submitting' });

    const payload: FeedbackRequest = {
      answer: selectedAnswer,
      ...(writtenFeedback.trim() !== '' && {
        writtenFeedback: writtenFeedback.trim(),
      }),
      ...(selectedOutcome !== null && { outcome: selectedOutcome }),
    };

    try {
      await submit(payload);
      setFeedbackState({ status: 'success' });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setFeedbackState({ status: 'error', message });
    }
  };

  const handleRetry = (): void => {
    setFeedbackState({ status: 'idle' });
  };

  // ---------------------------------------------------------------------------
  // Render — success state
  // ---------------------------------------------------------------------------

  if (feedbackState.status === 'success') {
    return (
      <section
        className={styles.screen}
        data-testid="screen-feedback"
        aria-label="Feedback submitted"
      >
        <div className={styles.confirmationContent}>
          {/*
           * tabIndex={-1} makes this heading programmatically focusable so the
           * useEffect above can call .focus() on mount. This is the recommended
           * pattern for single-page-app screen transitions with screen readers.
           * The heading is NOT in the natural tab order (tabIndex is negative).
           */}
          <h1
            ref={successHeadingRef}
            className={styles.confirmationHeading}
            tabIndex={-1}
            data-testid="confirmation-heading"
          >
            Thank you for your feedback
          </h1>
          <p className={styles.confirmationBody}>
            Your feedback helps make Annie better for everyone.
          </p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onDone}
          >
            Check another message
          </button>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — error state
  // ---------------------------------------------------------------------------

  if (feedbackState.status === 'error') {
    return (
      <section
        className={styles.screen}
        data-testid="screen-feedback"
        aria-label="Feedback submission failed"
      >
        <div className={styles.errorContent}>
          <h1 className={styles.heading}>Something went wrong</h1>
          <p className={styles.errorMessage}>{feedbackState.message}</p>
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
              className={styles.skipButton}
              onClick={onDone}
            >
              Skip feedback
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — idle / submitting state
  // ---------------------------------------------------------------------------

  const isSubmitting = feedbackState.status === 'submitting';
  const isSubmitDisabled = selectedAnswer === null || isSubmitting;

  return (
    <section
      className={styles.screen}
      data-testid="screen-feedback"
      aria-label="Leave feedback"
    >
      {/* ── Question ──────────────────────────────────────────────────────── */}
      <div className={styles.intro}>
        <h1 className={styles.heading}>Did Annie help you decide what to do?</h1>
        <p className={styles.supporting}>
          Your answer helps us improve Annie. This is optional — you can skip if
          you prefer.
        </p>
      </div>

      {/* ── Answer selection ──────────────────────────────────────────────── */}
      <fieldset className={styles.answerGroup} disabled={isSubmitting}>
        <legend className={styles.answerLegend}>Choose your answer</legend>
        <div className={styles.answerOptions}>
          {(
            ['yes', 'not_sure', 'no'] as const
          ).map((answer) => (
            <label
              key={answer}
              className={`${styles.answerLabel} ${
                selectedAnswer === answer ? styles.answerLabelSelected : ''
              }`}
            >
              <input
                type="radio"
                name="feedback-answer"
                value={answer}
                className={styles.answerRadio}
                checked={selectedAnswer === answer}
                onChange={() => setSelectedAnswer(answer)}
              />
              {ANSWER_LABELS[answer]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ── Written feedback ──────────────────────────────────────────────── */}
      <div className={styles.fieldGroup}>
        <label htmlFor="written-feedback" className={styles.fieldLabel}>
          Anything else you'd like to tell us?{' '}
          <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="written-feedback"
          className={styles.textarea}
          value={writtenFeedback}
          onChange={(e) => setWrittenFeedback(e.target.value)}
          maxLength={WRITTEN_FEEDBACK_MAX_LENGTH}
          rows={4}
          placeholder="For example: Annie's explanation was clear and easy to understand."
          disabled={isSubmitting}
        />
        <p className={styles.charCount} aria-live="polite">
          {writtenFeedback.length}/{WRITTEN_FEEDBACK_MAX_LENGTH}
        </p>
      </div>

      {/* ── Outcome selector ──────────────────────────────────────────────── */}
      <fieldset className={styles.outcomeGroup} disabled={isSubmitting}>
        <legend className={styles.outcomeLegend}>
          What did you decide to do?{' '}
          <span className={styles.optional}>(optional)</span>
        </legend>
        <div className={styles.outcomeOptions}>
          {OUTCOME_OPTIONS.map(({ value, label }) => (
            <label key={value} className={styles.outcomeLabel}>
              <input
                type="radio"
                name="feedback-outcome"
                value={value}
                className={styles.outcomeRadio}
                checked={selectedOutcome === value}
                onChange={() => setSelectedOutcome(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Send feedback'}
        </button>
        <button
          type="button"
          className={styles.skipButton}
          onClick={onDone}
          disabled={isSubmitting}
        >
          Skip feedback
        </button>
      </div>
    </section>
  );
};

export default FeedbackScreen;
