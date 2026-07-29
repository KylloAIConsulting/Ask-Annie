import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ResultsScreen from '../screens/ResultsScreen/ResultsScreen';
import {
  FIXTURE_LOWER_RISK,
  FIXTURE_CONCERNING,
  FIXTURE_HIGH_RISK,
} from '../api/fixture';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultProps = {
  result: FIXTURE_LOWER_RISK,
  onFeedback: jest.fn(),
  onReset: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// T6.4 — Rendering (all three fixtures) and core structure
// ---------------------------------------------------------------------------

describe('ResultsScreen — rendering', () => {
  it('renders without crashing', () => {
    render(<ResultsScreen {...defaultProps} />);
  });

  it('has the screen-results testid', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(screen.getByTestId('screen-results')).toBeTruthy();
  });

  it('shows the summary as the main heading', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(
      screen.getByRole('heading', { level: 1, name: FIXTURE_LOWER_RISK.summary }),
    ).toBeTruthy();
  });

  it('shows the risk level badge text', () => {
    render(<ResultsScreen {...defaultProps} />);
    // aria-label on the badge contains the plain-English label
    expect(screen.getByLabelText('Risk level: Lower risk')).toBeTruthy();
  });

  it('shows the explanation text', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(
      screen.getByText(FIXTURE_LOWER_RISK.explanation),
    ).toBeTruthy();
  });

  it('shows the "What to do next" section', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'What to do next' }),
    ).toBeTruthy();
  });

  it('shows each recommended action', () => {
    render(<ResultsScreen {...defaultProps} />);
    for (const action of FIXTURE_LOWER_RISK.recommendedActions) {
      expect(screen.getByText(action)).toBeTruthy();
    }
  });

  it('shows the "How to verify" section', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'How to verify' }),
    ).toBeTruthy();
  });

  it('shows the privacy reminder', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(
      screen.getByText(FIXTURE_LOWER_RISK.privacyReminder),
    ).toBeTruthy();
  });

  it('shows the "Leave feedback" button', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Leave feedback' })).toBeTruthy();
  });

  it('shows the "Check another message" button', () => {
    render(<ResultsScreen {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: 'Check another message' }),
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// T6.4 — Conditional sections absent for LOWER_RISK
// ---------------------------------------------------------------------------

describe('ResultsScreen — LOWER_RISK: conditional sections absent', () => {
  it('does not show warning signs when warningSigns is empty', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_LOWER_RISK} />);
    expect(
      screen.queryByRole('heading', { name: 'Warning signs' }),
    ).toBeNull();
  });

  it('does not show things to avoid when thingsToAvoid is empty', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_LOWER_RISK} />);
    expect(
      screen.queryByRole('heading', { name: 'Things to avoid' }),
    ).toBeNull();
  });

  it('does not show emergency advice when emergencyAdvice is empty', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_LOWER_RISK} />);
    expect(screen.queryByTestId('emergency-advice')).toBeNull();
  });

  it('does not show the human review notice when requiresHumanReview is false', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_LOWER_RISK} />);
    expect(screen.queryByTestId('human-review-notice')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// T6.4 — CONCERNING fixture: warning signs and things to avoid present
// ---------------------------------------------------------------------------

describe('ResultsScreen — CONCERNING fixture', () => {
  it('shows the correct risk badge label for CONCERNING', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_CONCERNING} />);
    expect(screen.getByLabelText('Risk level: Concerning')).toBeTruthy();
  });

  it('shows the "Warning signs" section', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_CONCERNING} />);
    expect(
      screen.getByRole('heading', { name: 'Warning signs' }),
    ).toBeTruthy();
  });

  it('renders each warning sign item', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_CONCERNING} />);
    for (const sign of FIXTURE_CONCERNING.warningSigns) {
      expect(screen.getByText(sign)).toBeTruthy();
    }
  });

  it('shows the "Things to avoid" section', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_CONCERNING} />);
    expect(
      screen.getByRole('heading', { name: 'Things to avoid' }),
    ).toBeTruthy();
  });

  it('renders each thing to avoid', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_CONCERNING} />);
    for (const thing of FIXTURE_CONCERNING.thingsToAvoid) {
      expect(screen.getByText(thing)).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// T6.5 — HIGH_RISK fixture: requiresHumanReview: true + emergencyAdvice
// ---------------------------------------------------------------------------

describe('ResultsScreen — HIGH_RISK fixture (T6.5)', () => {
  it('shows the correct risk badge label for HIGH_RISK', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_HIGH_RISK} />);
    expect(screen.getByLabelText('Risk level: High risk')).toBeTruthy();
  });

  it('shows the human review notice when requiresHumanReview is true', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_HIGH_RISK} />);
    expect(screen.getByTestId('human-review-notice')).toBeTruthy();
  });

  it('shows the human review heading', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_HIGH_RISK} />);
    expect(
      screen.getByRole('heading', { name: 'Talk to someone you trust' }),
    ).toBeTruthy();
  });

  it('shows the human review body text', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_HIGH_RISK} />);
    expect(screen.getByText(/annie recommends getting a second opinion/i)).toBeTruthy();
  });

  it('shows the "Urgent action needed" section', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_HIGH_RISK} />);
    expect(
      screen.getByRole('heading', { name: 'Urgent action needed' }),
    ).toBeTruthy();
  });

  it('shows the emergency advice text', () => {
    render(<ResultsScreen {...defaultProps} result={FIXTURE_HIGH_RISK} />);
    expect(screen.getByTestId('emergency-advice')).toBeTruthy();
    expect(
      screen.getByText(FIXTURE_HIGH_RISK.emergencyAdvice),
    ).toBeTruthy();
  });

  it('FIXTURE_HIGH_RISK.requiresHumanReview is true (fixture contract)', () => {
    expect(FIXTURE_HIGH_RISK.requiresHumanReview).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// T6.4 — Button interactions
// ---------------------------------------------------------------------------

describe('ResultsScreen — button interactions', () => {
  it('calls onFeedback when "Leave feedback" is clicked', async () => {
    const onFeedback = jest.fn();
    render(
      <ResultsScreen
        result={FIXTURE_LOWER_RISK}
        onFeedback={onFeedback}
        onReset={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Leave feedback' }));
    expect(onFeedback).toHaveBeenCalledTimes(1);
  });

  it('calls onReset when "Check another message" is clicked', async () => {
    const onReset = jest.fn();
    render(
      <ResultsScreen
        result={FIXTURE_LOWER_RISK}
        onFeedback={jest.fn()}
        onReset={onReset}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Check another message' }),
    );
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// T6.4 — Accessibility (axe) — all three fixtures
// ---------------------------------------------------------------------------

describe('ResultsScreen — accessibility', () => {
  it('passes axe with LOWER_RISK fixture', async () => {
    const { container } = render(
      <main>
        <ResultsScreen {...defaultProps} result={FIXTURE_LOWER_RISK} />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with CONCERNING fixture', async () => {
    const { container } = render(
      <main>
        <ResultsScreen {...defaultProps} result={FIXTURE_CONCERNING} />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with HIGH_RISK fixture (requiresHumanReview: true, emergencyAdvice present)', async () => {
    const { container } = render(
      <main>
        <ResultsScreen {...defaultProps} result={FIXTURE_HIGH_RISK} />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
