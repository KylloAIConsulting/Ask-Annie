import React from 'react';
import styles from './Layout.module.css';

type LayoutProps = {
  /** Screen component rendered as the page body. */
  children: React.ReactNode;
  /**
   * Optional header rendered between the skip link and the main container.
   * Passed by App so the skip link remains the first focusable element in
   * the document regardless of which component is in the header slot.
   */
  header?: React.ReactNode;
};

/**
 * Layout wraps every screen in the user journey.
 *
 * Responsibilities:
 *  - Skip-to-content link for keyboard users (visible on :focus, offscreen otherwise)
 *  - Centred single-column container (max-width 720 px, responsive horizontal padding)
 *  - The <main id="main-content"> landmark that the skip link targets
 */
const Layout: React.FC<LayoutProps> = ({ children, header }) => {
  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      {header}
      <div className={styles.container}>
        <main id="main-content" className={styles.main}>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
