import React from 'react';
import styles from './WelcomeScreen.module.css';
import type { Screen } from '../../state/appReducer';

type WelcomeScreenProps = {
  onNavigate: (screen: Screen) => void;
  /** Whether the "How Ask Annie works" explanation panel is currently open. */
  panelOpen: boolean;
  /** Called when the user toggles the explanation panel button. */
  onTogglePanel: () => void;
};

const PANEL_ID = 'how-it-works-panel';

/**
 * Welcome screen — the entry point of the Ask Annie user journey.
 *
 * Panel state is lifted to App so the Header's "How it works" control can
 * open it directly. WelcomeScreen is a controlled component for the panel.
 */
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigate,
  panelOpen,
  onTogglePanel,
}) => {
  return (
    <section
      className={styles.screen}
      data-testid="screen-welcome"
      aria-label="Welcome"
    >
      <div className={styles.intro}>
        <h1 className={styles.heading}>
          Not sure if a message is genuine?
        </h1>
        <p className={styles.supporting}>
          Ask Annie can help you spot warning signs and decide what to do next.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => onNavigate('submit')}
        >
          Check a message
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          aria-expanded={panelOpen}
          aria-controls={PANEL_ID}
          onClick={onTogglePanel}
        >
          How Ask Annie works
        </button>
      </div>

      {/*
       * The panel is always in the DOM so aria-controls always references a
       * real element. The hidden attribute removes it from tab order and from
       * the accessibility tree when closed, satisfying the requirement that
       * no hidden focusable content remains when the panel is closed.
       */}
      <div
        id={PANEL_ID}
        className={styles.panel}
        hidden={!panelOpen}
      >
        <ol className={styles.steps}>
          <li>Share the message</li>
          <li>Annie checks for warning signs</li>
          <li>Get clear advice on what to do next.</li>
        </ol>
      </div>

      <div className={styles.reassurance}>
        <p className={styles.reassuranceText}>
          You will not be judged. It is always sensible to check before you
          click, reply, pay or share information.
        </p>
        <p className={styles.privacyText}>
          Only share the information needed for the check. Remove personal
          details where possible.
        </p>
      </div>
    </section>
  );
};

export default WelcomeScreen;
