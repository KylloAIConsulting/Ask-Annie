import React, { useRef, useState } from 'react';
import styles from './SubmitScreen.module.css';
import type { Screen } from '../../state/appReducer';
import {
  ANALYSE_TEXT_MAX_LENGTH,
  ANALYSE_CONTEXT_MAX_LENGTH,
} from '@shared/requestSchemas';
import {
  UPLOAD_MAX_FILE_SIZE,
  UPLOAD_ALLOWED_MIME_TYPES,
} from '@shared/uploadConfig';

// ---------------------------------------------------------------------------
// Draft types — exported for use by App
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
// Helpers
// ---------------------------------------------------------------------------

type InputMode = 'text' | 'image';

const ALLOWED_MIME_SET = new Set<string>(UPLOAD_ALLOWED_MIME_TYPES);

/** Human-readable file size string. */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Stable element ID for associating the file error with the file input. */
const FILE_ERROR_ID = 'screenshot-upload-error';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type SubmitScreenProps = {
  onNavigate: (screen: Screen) => void;
  /**
   * Called with the validated draft when the user activates "Check with Annie".
   * App dispatches SET_SUBMISSION and navigates to 'analysing'.
   * This component never calls the analyse API.
   */
  onSubmit: (draft: SubmitDraft) => void;
};

/**
 * Submit screen — lets the user paste a message or upload a screenshot
 * before sending it to Annie for analysis.
 *
 * All submission logic (API call, navigation to Analysing) is handled by the
 * onSubmit prop. This component manages only draft state, file validation,
 * and form accessibility.
 */
const SubmitScreen: React.FC<SubmitScreenProps> = ({ onNavigate, onSubmit }) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [context, setContext] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Derived state ─────────────────────────────────────────────────────────

  const isPrimaryDisabled =
    mode === 'text' ? text.trim().length === 0 : file === null;

  // ── Mode change ───────────────────────────────────────────────────────────

  const handleModeChange = (newMode: InputMode): void => {
    setMode(newMode);
    // Clear image-specific error when leaving image mode so stale errors
    // are not announced when the user returns to text mode.
    if (newMode !== 'image') {
      setFileError(null);
    }
  };

  // ── File selection ────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const picked = e.target.files?.[0];
    if (!picked) return;

    // Validate MIME type against the server contract.
    if (!ALLOWED_MIME_SET.has(picked.type)) {
      setFileError(
        'This image type is not supported. Please choose a JPG, PNG or WebP image.',
      );
      setFile(null);
      // Reset the native input so re-selecting the same file fires onChange again.
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size.
    if (picked.size > UPLOAD_MAX_FILE_SIZE) {
      setFileError('This image is too large. Please choose a smaller image.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFileError(null);
    setFile(picked);
  };

  // ── Remove image ──────────────────────────────────────────────────────────

  const handleRemoveImage = (): void => {
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = (): void => {
    // Defensive guard: refuse even if invoked programmatically with an
    // invalid draft (primary button disabled state is the main safeguard).
    if (mode === 'text') {
      if (text.trim().length === 0) return;
      onSubmit({ mode: 'text', text, context });
    } else {
      if (file === null) return;
      onSubmit({ mode: 'image', file, context });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section
      className={styles.screen}
      data-testid="screen-submit"
      aria-label="Submit a message for checking"
    >
      {/* ── Heading ───────────────────────────────────────────────────────── */}
      <div className={styles.intro}>
        <h1 className={styles.heading}>
          What would you like Annie to check?
        </h1>
        <p className={styles.supporting}>
          Paste the message or upload a screenshot. Remove personal details
          where possible.
        </p>
      </div>

      {/* ── Mode selector ─────────────────────────────────────────────────── */}
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
              onChange={() => handleModeChange('text')}
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
              onChange={() => handleModeChange('image')}
              className={styles.modeRadio}
            />
            <span>Upload screenshot</span>
          </label>
        </div>
      </fieldset>

      {/* ── Mode-specific input ────────────────────────────────────────────── */}
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
            ref={fileInputRef}
            id="screenshot-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={styles.fileInput}
            aria-describedby={fileError ? FILE_ERROR_ID : undefined}
          />

          {/* File validation error */}
          {fileError && (
            <p
              id={FILE_ERROR_ID}
              role="alert"
              className={styles.fileError}
            >
              {fileError}
            </p>
          )}

          {/* Selected-file info + remove button */}
          {file && (
            <div className={styles.fileInfo} data-testid="selected-file-info">
              <p
                className={styles.filename}
                data-testid="selected-filename"
              >
                {file.name}{' '}
                <span className={styles.fileSize}>
                  ({formatFileSize(file.size)})
                </span>
              </p>
              <button
                type="button"
                className={styles.removeButton}
                onClick={handleRemoveImage}
                aria-label={`Remove selected image: ${file.name}`}
              >
                Remove image
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Shared context field ───────────────────────────────────────────── */}
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

      {/* ── Actions ───────────────────────────────────────────────────────── */}
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
