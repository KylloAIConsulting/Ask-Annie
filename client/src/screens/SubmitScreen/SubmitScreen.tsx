import React, { useState } from 'react';
import styles from './SubmitScreen.module.css';
import type { Screen } from '../../state/appReducer';
import {
  ANALYSE_TEXT_MAX_LENGTH,
  ANALYSE_CONTEXT_MAX_LENGTH,
} from '@shared/requestSchemas';

// ---------------------------------------------------------------------------
// Draft types — exported for use by App (T4.2) and AnalysingScreen (T5.1)
// ---------------------------------------------------------------------------

export type TextDraft = {
  mode: 'text';
  text: string;
  context: string;
};

export type ImageDraft = {
  mode: 'image';
  file: File;
  context: string;
};

/** Discriminated union representing a validated submission draft. */
export type SubmitDraft = TextDraft | ImageDraft;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type InputMode = 'text' | 'image';

type SubmitScreenProps = {
  onNavigate: (screen: Screen) => void;
  /**
   * Called with the current draft when the user activates "Check with Annie".
   * T4.2 will dispatch SET_SUBMISSION and navigate to 'analysing' here.
   * This task does not call the API.
   */
  onSubmit: (draft: SubmitDraft) => void;
};

/**
 * Submit screen — lets the user paste a message or upload a screenshot
 * before sending it to Annie for analysis.
 *
 * All submission logic (API call, navigation to Analysing) is deferred to
 * T4.2. This component manages only draft state and form validation.
 */
const SubmitScreen: React.FC<SubmitScreenProps> = ({ onNavigate, onSubmit }) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [context, setContext] = useState('');

  const isPrimaryDisabled =
    mode === 'text' ? text.trim().length === 0 : file === null;

  const handleSubmit = () => {
    if (isPrimaryDisabled) return;
    if (mode === 'text') {
      onSubmit({ mode: 'text', text, context });
    } else if (file) {
      onSubmit({ mode: 'image', file, context });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  return (
    <section
      className={styles.screen}
      data-testid="screen-submit"
      aria-label="Submit a message for checking"
    >
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className={styles.intro}>
        <h1 className={styles.heading}>
          What would you like Annie to check?
        </h1>
        <p className={styles.supporting}>
          Paste the message or upload a screenshot. Remove personal details
          where possible.
        </p>
      </div>

      {/* ── Mode selector ────────────────────────────────────────────────── */}
      <fieldset className={styles.modeGroup}>
        <legend className={styles.modeLegend}>
          How would you like to share the message?
        </legend>
        <div className={styles.modeOptions}>
          <label className={styles.modeLabel}>
            <input
              type="radio"
              name="input-mode"
              value="text"
              checked={mode === 'text'}
              onChange={() => setMode('text')}
              className={styles.modeRadio}
            />
            <span>Paste message</span>
          </label>
          <label className={styles.modeLabel}>
            <input
              type="radio"
              name="input-mode"
              value="image"
              checked={mode === 'image'}
              onChange={() => setMode('image')}
              className={styles.modeRadio}
            />
            <span>Upload screenshot</span>
          </label>
        </div>
      </fieldset>

      {/* ── Mode-specific input ───────────────────────────────────────────── */}
      {mode === 'text' ? (
        <div className={styles.fieldGroup}>
          <label htmlFor="message-text" className={styles.fieldLabel}>
            Message to check
          </label>
          <textarea
            id="message-text"
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={ANALYSE_TEXT_MAX_LENGTH}
            rows={8}
            placeholder="Paste the message here…"
          />
          <p
            className={styles.charCount}
            aria-live="polite"
            aria-atomic="true"
          >
            {text.length.toLocaleString()} /{' '}
            {ANALYSE_TEXT_MAX_LENGTH.toLocaleString()} characters
          </p>
        </div>
      ) : (
        <div className={styles.fieldGroup}>
          <label htmlFor="screenshot-upload" className={styles.fieldLabel}>
            Upload a screenshot
          </label>
          <input
            id="screenshot-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {file && (
            <p className={styles.filename} data-testid="selected-filename">
              Selected: {file.name}
            </p>
          )}
        </div>
      )}

      {/* ── Shared context field ──────────────────────────────────────────── */}
      <div className={styles.fieldGroup}>
        <label htmlFor="context-field" className={styles.fieldLabel}>
          Anything else Annie should know?{' '}
          <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="context-field"
          className={styles.textarea}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={ANALYSE_CONTEXT_MAX_LENGTH}
          rows={3}
          placeholder="For example: I was not expecting this message."
        />
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleSubmit}
          disabled={isPrimaryDisabled}
        >
          Check with Annie
        </button>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => onNavigate('welcome')}
        >
          Back
        </button>
      </div>
    </section>
  );
};

export default SubmitScreen;
