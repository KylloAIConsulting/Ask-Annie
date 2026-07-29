import React, { useCallback, useReducer, useState } from 'react';
import {
  appReducer,
  initialAppState,
  type Screen,
  type AppAction,
} from './state/appReducer';
import Layout from './components/Layout/Layout';
import Header from './components/Header/Header';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import SubmitScreen from './screens/SubmitScreen/SubmitScreen';
import type { SubmitDraft } from './screens/SubmitScreen/SubmitScreen';
import AnalysingScreen from './screens/AnalysingScreen/AnalysingScreen';
import { analyseText, analyseImage } from './api/analyse';
import type { AnnieResponse } from './types/annie';
import { DEV_USE_FIXTURE, DEV_FIXTURE_LEVEL } from './lib/fixtureMode';

// Re-export Screen so downstream modules can import from a single location.
export type { Screen };

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const [welcomePanelOpen, setWelcomePanelOpen] = useState(false);

  const navigate = (screen: Screen): void => {
    dispatch({ type: 'NAVIGATE', screen });
  };

  // ---------------------------------------------------------------------------
  // Analysis function
  //
  // Memoised so AnalysingScreen's useEffect does not restart when App
  // re-renders for unrelated reasons.  The function only gets a new identity
  // after SET_SUBMISSION changes the submitted text, file, or context.
  // ---------------------------------------------------------------------------

  const analyseForSubmission = useCallback(
    async (signal: AbortSignal): Promise<AnnieResponse> => {
      // Fixture mode — development builds only, excluded from production by
      // Vite's dead-code elimination of import.meta.env.DEV === false branches.
      if (DEV_USE_FIXTURE) {
        const { selectFixture, resolveFixture } = await import('./api/fixture');
        const fixture = selectFixture(DEV_FIXTURE_LEVEL);
        return resolveFixture(fixture, 1500, signal);
      }
      if (state.submittedFile !== null) {
        return analyseImage(
          state.submittedFile,
          state.submittedContext || undefined,
          signal,
        );
      }
      return analyseText(
        state.submittedText,
        state.submittedContext || undefined,
        signal,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.submittedText, state.submittedFile, state.submittedContext],
  );

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
        return (
          <WelcomeScreen
            onNavigate={navigate}
            panelOpen={welcomePanelOpen}
            onTogglePanel={() => setWelcomePanelOpen((v) => !v)}
          />
        );

      case 'submit':
        return (
          <SubmitScreen
            onNavigate={navigate}
            onSubmit={(draft: SubmitDraft) => {
              dispatch({
                type: 'SET_SUBMISSION',
                text: draft.mode === 'text' ? draft.text : '',
                file: draft.mode === 'image' ? draft.file : null,
                context: draft.context,
              });
              navigate('analysing');
            }}
          />
        );

      case 'analysing':
        return (
          <AnalysingScreen
            analyse={analyseForSubmission}
            onSuccess={(result) =>
              dispatch({ type: 'ANALYSIS_SUCCESS', result })
            }
            onCancel={() => navigate('submit')}
          />
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

  return (
    <Layout
      header={
        <Header
          currentScreen={state.currentScreen}
          onNavigate={navigate}
          // Navigates to the welcome screen and opens the explanation panel.
          // Both state updates are batched by React 18, so WelcomeScreen
          // renders once with panelOpen=true.
          onHowItWorks={() => {
            navigate('welcome');
            setWelcomePanelOpen(true);
          }}
        />
      }
    >
      {renderScreen()}
    </Layout>
  );
};

// Exported for direct testing of the dispatch shape from App.test.tsx.
export { appReducer, initialAppState };
export type { AppAction };

export default App;
