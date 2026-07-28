import React, { useState } from 'react';

/**
 * Screen state machine.
 * Sprint 2 will expand this to drive the full five-screen user journey.
 */
export type Screen = 'welcome' | 'submit' | 'analysing' | 'results' | 'feedback';

const App: React.FC = () => {
  const [_screen, _setScreen] = useState<Screen>('welcome');

  // Sprint 2: render the active screen component here
  return (
    <main>
      <h1>Ask Annie</h1>
      <p>Sprint 1 scaffold — server and shared schema are ready.</p>
    </main>
  );
};

export default App;
