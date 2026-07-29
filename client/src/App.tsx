import React, { useReducer } from 'react';
import {
  appReducer,
  initialAppState,
  type Screen,
  type AppAction,
} from './state/appReducer';

// Re-export Screen so downstream modules can import from a single location.
export type { Screen };

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  const navigate = (screen: Screen): void => {
    dispatch({ type: 'NAVIGATE', screen });
  };

  // ---------------------------------------------------------------------------
  // Screen dispatch
  //
  // Each case renders a temporary labelled slot until the real screen component
  // is introduced by the task noted in the TODO comment.  The data-testid
  // attribute makes each slot independently addressable in tests.
  // ---------------------------------------------------------------------------

  const renderScreen = (): React.ReactElement => {
    switch (state.currentScreen) {
      case 'welcome':
        // TODO T3.1 — replace with <WelcomeScreen onNavigate={navigate} />
        return (
          <div data-testid="screen-welcome">
            <h1>Ask Annie</h1>
            <button onClick={() => navigate('submit')}>
              Check a message (T3.1 placeholder)
            </button>
          </div>
        );

      case 'submit':
        // TODO T4.1 — replace with <SubmitScreen ... />
        return (
          <div data-testid="screen-submit">
            <h1>What would you like Annie to check?</h1>
            <button onClick={() => navigate('welcome')}>Go back (T4.1 placeholder)</button>
          </div>
        );

      case 'analysing':
        // TODO T5.1 — replace with <AnalysingScreen ... />
        return (
          <div data-testid="screen-analysing">
            <h1>Annie is checking for warning signs</h1>
            <p>T5.1 placeholder</p>
          </div>
        );

      case 'results':
        // TODO T6.1 — replace with <ResultsScreen result={state.analysisResult!} ... />
        return (
          <div data-testid="screen-results">
            <h1>Results</h1>
            <p>T6.1 placeholder</p>
            <button
              onClick={() => dispatch({ type: 'RESET_SESSION' })}
            >
              Check another message (T6.1 placeholder)
            </button>
          </div>
        );

      case 'feedback':
        // TODO T7.1 — replace with <FeedbackScreen onNavigate={navigate} onReset={...} />
        return (
          <div data-testid="screen-feedback">
            <h1>Did Annie help you decide what to do?</h1>
            <p>T7.1 placeholder</p>
          </div>
        );
    }
  };

  return <main>{renderScreen()}</main>;
};

// Exported for direct testing of the dispatch shape from App.test.tsx.
export { appReducer, initialAppState };
export type { AppAction };

export default App;
