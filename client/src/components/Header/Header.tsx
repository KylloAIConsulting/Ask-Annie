import React from 'react';
import styles from './Header.module.css';
import type { Screen } from '../../state/appReducer';

type HeaderProps = {
  /** The screen currently rendered by App, used to set aria-current="page". */
  currentScreen: Screen;
  /** Navigate to a named screen (delegates to App's dispatch). */
  onNavigate: (screen: Screen) => void;
  /**
   * Called when the user activates "How it works".
   * Navigates to the welcome screen and opens the explanation panel.
   */
  onHowItWorks: () => void;
};

/**
 * Application-wide header.
 *
 * Contains:
 *  - Text wordmark "Annie"
 *  - <nav aria-label="Main navigation"> with Home and How it works
 *
 * Both navigation controls are <button> elements — no href="#" placeholders.
 * aria-current="page" is applied to Home when the welcome screen is active.
 * "How it works" never receives aria-current because it has no dedicated screen.
 */
const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, onHowItWorks }) => {
  const isWelcome = currentScreen === 'welcome';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.wordmark} aria-label="Annie home">
          Annie
        </span>

        <nav aria-label="Main navigation">
          <ul className={styles.navList}>
            <li>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => onNavigate('welcome')}
                aria-current={isWelcome ? 'page' : undefined}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.navButton}
                onClick={onHowItWorks}
              >
                How it works
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
