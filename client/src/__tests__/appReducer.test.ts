import {
  appReducer,
  initialAppState,
  type AppState,
  type AppAction,
} from '../state/appReducer';
import type { AnnieResponse } from '../types/annie';

// ---------------------------------------------------------------------------
// Shared fixture — satisfies the full AnnieResponse schema
// ---------------------------------------------------------------------------

const mockResult: AnnieResponse = {
  summary: 'This message shows several warning signs of a phishing attempt.',
  riskLevel: 'HIGH_RISK',
  confidence: 'HIGH',
  explanation:
    'The message uses urgent language and requests sensitive personal information.',
  warningSigns: ['Urgent language', 'Requests personal details', 'Unknown sender'],
  recommendedActions: [
    'Do not reply to this message.',
    'Report it to your bank using the number on the back of your card.',
  ],
  thingsToAvoid: ['Do not click any links in the message.'],
  officialVerificationAdvice:
    'Contact the organisation using contact details from their official website or a document you already hold.',
  privacyReminder: 'Do not share this assessment with the original sender.',
  emergencyAdvice: '',
  requiresHumanReview: false,
};

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe('initialAppState', () => {
  it('starts on the welcome screen', () => {
    expect(initialAppState.currentScreen).toBe('welcome');
  });

  it('has no submitted content', () => {
    expect(initialAppState.submittedText).toBe('');
    expect(initialAppState.submittedFile).toBeNull();
    expect(initialAppState.submittedContext).toBe('');
  });

  it('has no analysis result or error', () => {
    expect(initialAppState.analysisResult).toBeNull();
    expect(initialAppState.analysisError).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// NAVIGATE
// ---------------------------------------------------------------------------

describe('appReducer — NAVIGATE', () => {
  it('updates currentScreen to the specified screen', () => {
    const next = appReducer(initialAppState, { type: 'NAVIGATE', screen: 'submit' });
    expect(next.currentScreen).toBe('submit');
  });

  it('can navigate to every valid screen value', () => {
    const screens = ['welcome', 'submit', 'analysing', 'results', 'feedback'] as const;
    for (const screen of screens) {
      const next = appReducer(initialAppState, { type: 'NAVIGATE', screen });
      expect(next.currentScreen).toBe(screen);
    }
  });

  it('does not modify any other state field', () => {
    const before: AppState = {
      ...initialAppState,
      submittedText: 'preserved text',
      analysisError: 'preserved error',
    };
    const after = appReducer(before, { type: 'NAVIGATE', screen: 'feedback' });
    expect(after.submittedText).toBe('preserved text');
    expect(after.analysisError).toBe('preserved error');
  });
});

// ---------------------------------------------------------------------------
// SET_SUBMISSION
// ---------------------------------------------------------------------------

describe('appReducer — SET_SUBMISSION', () => {
  it('stores submitted text, file and context', () => {
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    const action: AppAction = {
      type: 'SET_SUBMISSION',
      text: 'Check this message please',
      file,
      context: 'I was not expecting this email',
    };
    const next = appReducer(initialAppState, action);
    expect(next.submittedText).toBe('Check this message please');
    expect(next.submittedFile).toBe(file);
    expect(next.submittedContext).toBe('I was not expecting this email');
  });

  it('accepts null file for text-only submissions', () => {
    const action: AppAction = {
      type: 'SET_SUBMISSION',
      text: 'Text only submission',
      file: null,
      context: '',
    };
    const next = appReducer(initialAppState, action);
    expect(next.submittedFile).toBeNull();
    expect(next.submittedText).toBe('Text only submission');
  });

  it('accepts empty context', () => {
    const action: AppAction = {
      type: 'SET_SUBMISSION',
      text: 'Some text',
      file: null,
      context: '',
    };
    const next = appReducer(initialAppState, action);
    expect(next.submittedContext).toBe('');
  });

  it('does not change currentScreen', () => {
    const before: AppState = { ...initialAppState, currentScreen: 'submit' };
    const after = appReducer(before, {
      type: 'SET_SUBMISSION',
      text: 'hi',
      file: null,
      context: '',
    });
    expect(after.currentScreen).toBe('submit');
  });
});

// ---------------------------------------------------------------------------
// ANALYSIS_SUCCESS
// ---------------------------------------------------------------------------

describe('appReducer — ANALYSIS_SUCCESS', () => {
  it('stores the analysis result', () => {
    const next = appReducer(initialAppState, {
      type: 'ANALYSIS_SUCCESS',
      result: mockResult,
    });
    expect(next.analysisResult).toBe(mockResult);
  });

  it('navigates to the results screen', () => {
    const next = appReducer(initialAppState, {
      type: 'ANALYSIS_SUCCESS',
      result: mockResult,
    });
    expect(next.currentScreen).toBe('results');
  });

  it('clears any previous analysisError', () => {
    const before: AppState = { ...initialAppState, analysisError: 'previous error' };
    const after = appReducer(before, {
      type: 'ANALYSIS_SUCCESS',
      result: mockResult,
    });
    expect(after.analysisError).toBeNull();
  });

  it('does not clear submitted content', () => {
    const before: AppState = {
      ...initialAppState,
      submittedText: 'original text',
      submittedContext: 'original context',
    };
    const after = appReducer(before, {
      type: 'ANALYSIS_SUCCESS',
      result: mockResult,
    });
    expect(after.submittedText).toBe('original text');
    expect(after.submittedContext).toBe('original context');
  });
});

// ---------------------------------------------------------------------------
// ANALYSIS_ERROR
// ---------------------------------------------------------------------------

describe('appReducer — ANALYSIS_ERROR', () => {
  it('stores the error message', () => {
    const next = appReducer(initialAppState, {
      type: 'ANALYSIS_ERROR',
      error: 'The analysis service is unavailable.',
    });
    expect(next.analysisError).toBe('The analysis service is unavailable.');
  });

  it('clears any previous analysisResult', () => {
    const before: AppState = { ...initialAppState, analysisResult: mockResult };
    const after = appReducer(before, {
      type: 'ANALYSIS_ERROR',
      error: 'Something went wrong.',
    });
    expect(after.analysisResult).toBeNull();
  });

  it('does not change currentScreen', () => {
    const before: AppState = { ...initialAppState, currentScreen: 'analysing' };
    const after = appReducer(before, {
      type: 'ANALYSIS_ERROR',
      error: 'Network failure.',
    });
    expect(after.currentScreen).toBe('analysing');
  });

  it('does not clear submitted content', () => {
    const before: AppState = {
      ...initialAppState,
      submittedText: 'check this',
      currentScreen: 'analysing',
    };
    const after = appReducer(before, {
      type: 'ANALYSIS_ERROR',
      error: 'Timed out.',
    });
    expect(after.submittedText).toBe('check this');
  });
});

// ---------------------------------------------------------------------------
// RESET_SESSION
// ---------------------------------------------------------------------------

describe('appReducer — RESET_SESSION', () => {
  it('returns to the full initial state from a populated session', () => {
    const dirty: AppState = {
      currentScreen: 'results',
      submittedText: 'Some suspicious text',
      submittedFile: new File([], 'image.png'),
      submittedContext: 'I did not expect this',
      analysisResult: mockResult,
      analysisError: null,
    };
    const next = appReducer(dirty, { type: 'RESET_SESSION' });
    expect(next).toEqual(initialAppState);
  });

  it('resets to welcome screen', () => {
    const before: AppState = { ...initialAppState, currentScreen: 'feedback' };
    const after = appReducer(before, { type: 'RESET_SESSION' });
    expect(after.currentScreen).toBe('welcome');
  });

  it('clears all submitted content', () => {
    const before: AppState = {
      ...initialAppState,
      submittedText: 'text',
      submittedContext: 'context',
      submittedFile: new File([], 'f.png'),
    };
    const after = appReducer(before, { type: 'RESET_SESSION' });
    expect(after.submittedText).toBe('');
    expect(after.submittedContext).toBe('');
    expect(after.submittedFile).toBeNull();
  });

  it('clears analysis result and error', () => {
    const before: AppState = {
      ...initialAppState,
      analysisResult: mockResult,
      analysisError: 'stale error',
    };
    const after = appReducer(before, { type: 'RESET_SESSION' });
    expect(after.analysisResult).toBeNull();
    expect(after.analysisError).toBeNull();
  });

  it('returns a new object reference, not a mutation of the existing state', () => {
    const before = { ...initialAppState };
    const after = appReducer(before, { type: 'RESET_SESSION' });
    expect(after).not.toBe(before);
  });
});

// ---------------------------------------------------------------------------
// Reducer purity — does not mutate the incoming state object
// ---------------------------------------------------------------------------

describe('appReducer — immutability', () => {
  it('does not mutate the state object passed to it', () => {
    const original: AppState = { ...initialAppState };
    const frozen = Object.freeze({ ...original });
    // If the reducer mutates `frozen`, this will throw in strict mode
    expect(() =>
      appReducer(frozen as AppState, { type: 'NAVIGATE', screen: 'submit' })
    ).not.toThrow();
  });
});
