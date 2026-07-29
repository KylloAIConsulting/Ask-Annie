import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

/**
 * Sprint 1: Verifies that the jest-axe infrastructure is correctly configured
 * and that toHaveNoViolations is available in all client tests.
 * Sprint 2 will add a full accessibility test alongside every screen component.
 */
describe('Accessibility test infrastructure (Sprint 1 setup verification)', () => {
  it('toHaveNoViolations is available and passes on a simple accessible element', async () => {
    const { container } = render(
      <main>
        <h1>Ask Annie</h1>
        <p>Your trusted digital safety companion.</p>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('detects an accessibility violation on a deliberately broken element', async () => {
    const { container } = render(
      // img with no alt text — WCAG 1.1.1 violation
      // eslint-disable-next-line jsx-a11y/alt-text
      <div>
        <img src="test.png" />
      </div>
    );
    const results = await axe(container);
    // Confirms axe is actually running, not just passing silently
    expect(results.violations.length).toBeGreaterThan(0);
  });
});
