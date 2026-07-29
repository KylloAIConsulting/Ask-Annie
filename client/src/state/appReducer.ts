import type { AnnieResponse } from '../types/annie';

// ---------------------------------------------------------------------------
// Screen union
// ---------------------------------------------------------------------------

/**
 * All screens in the five-step user journey. */
export type Screen =
  | 'welcome'
  | 'submit'
  | 'analysing'
  | 'results'
  | 'feedback';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export type AppState = {
  /** The screen currently displayed to the user. */
  currentScreen: Screen;

  /** Text pasted by the user on the Submit screen. Empty string when unset. */
  submittedText: string;

  /** Image file selected or dropped by the user. Null when unset. */
  submittedFile: File | null;

  /** Optional context the user provided alongside their submission. Empty string when unset. */
  submittedContext: string;

  /**
   * Validated response from the AI analysis.
   * Set by ANALYSIS_SUCCESS. Null until a successful analysis completes.
   */
  analysisResult: AnnieResponse | null;

  /**
   * Human-readable error message from a failed analysis.
   * Set by ANALYSIS_ERROR. Null when no error has occurred.
   */
  analysisError: string | null;
};

export const initialAppState: AppState = {
  currentScreen: 'welcome',
  submittedText: '',
  submittedFile: null,
  submittedContext: '',
  analysisResult: null,
  analysisError: null,
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type AppAction =
  /**
   * Navigate to any screen without changing submission or result state.
   * Used for back-navigation and direct screen transitions.
   */
  | { type: 'NAVIGATE'; screen: Screen }

  /**
   * Store the user's submitted content immediately before navigating to the
   * Analysing screen. The AnalysingScreen reads these values from state.
   */
  | {
      type: 'SET_SUBMISSION';
      text: string;
      file: File | null;
      context: string;
    }

  /**
   * Record a successful AI analysis response.
   * Stores the result, clears any previous error, and navigates to Results.
   */
  | { type: 'ANALYSIS_SUCCESS'; result: AnnieResponse }

  /**
   * Record a failed AI analysis.
   * Stores the error message and clears any previous result.
   * Does not navigate — AnalysingScreen owns error-state rendering.
   */
  | { type: 'ANALYSIS_ERROR'; error: string }

  /**
   * Reset all session state and return to the Welcome screen.
   * Used by "Check another message" and "Return home".
   */
  | { type: 'RESET_SESSION' };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentScreen: action.screen };

    case 'SET_SUBMISSION':
      return {
        ...state,
        submittedText: action.text,
        submittedFile: action.file,
        submittedContext: action.context,
      };

    case 'ANALYSIS_SUCCESS':
      return {
        ...state,
        analysisResult: action.result,
        analysisError: null,
        currentScreen: 'results',
      };

    case 'ANALYSIS_ERROR':
      return {
        ...state,
        analysisError: action.error,
        analysisResult: null,
      };

    case 'RESET_SESSION':
      return { ...initialAppState };

    default: {
      // TypeScript narrows `action` to `never` here when all cases are
      // handled. If a new action type is added without a matching case,
      // this assignment will produce a compile-time error.
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
  }
}
