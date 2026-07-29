import React, { useReducer, useState } from 'react';
import {
  appReducer,
  initialAppState,
  type Screen,
  type AppAction,
} from './state/appReducer';
import Layout from './components/Layout/Layout';
import Header from './components/Header/Header';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';

// Re-export Screen so downstream modules can import from a single location.
export type { Screen };

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const [welcomePanelOpen, setWelcomePanelOpen] = useState(false);

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
        return (
          <WelcomeScreen
            onNavigate={navigate}
            panelOpen={welcomePanelOpen}
            onTogglePanel={() => setWelcomePanelOpen((v) => !v)}
          />
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
