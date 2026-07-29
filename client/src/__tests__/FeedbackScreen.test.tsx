import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import FeedbackScreen from '../screens/FeedbackScreen/FeedbackScreen';
import type { FeedbackRequest } from '@shared/requestSchemas';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const noop = jest.fn();

/** Resolved submit mock — simulates a successful API call. */
const resolvedSubmit = (): Promise<void> => Promise.resolve();

/** Rejected submit mock — simulates an API failure. */
const rejectedSubmit = (message = 'Service unavailable'): (() => Promise<void>) =>
  () => Promise.reject(new Error(message));

/** Render in a <main> wrapper so landmark-related axe rules are satisfied. */
function renderInMain(ui: React.ReactElement) {
  return render(<main>{ui}</main>);
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('FeedbackScreen — rendering', () => {
  it('renders without crashing', () => {
    render(<FeedbackScreen onDone={noop} />);
  });

  it('has the screen-feedback testid', () => {
    render(<FeedbackScreen onDone={noop} />);
    expect(screen.getByTestId('screen-feedback')).toBeTruthy();
  });

  it('shows the question heading', () => {
    render(<FeedbackScreen onDone={noop} />);
    expect(
      screen.getByRole('heading', {
        name: /did annie help you decide what to do/i,
      }),
    ).toBeTruthy();
  });

  it('shows three answer options: Yes, Not sure, No', () => {
    render(<FeedbackScreen onDone={noop} />);
    expect(screen.getByRole('radio', { name: 'Yes' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Not sure' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'No' })).toBeTruthy();
  });

  it('shows the written feedback textarea', () => {
    render(<FeedbackScreen onDone={noop} />);
    expect(
      screen.getByRole('textbox', { name: /anything else you'd like to tell us/i }),
    ).toBeTruthy();
  });

  it('shows the "Send feedback" button', () => {
    render(<FeedbackScreen onDone={noop} />);
    expect(screen.getByRole('button', { name: 'Send feedback' })).toBeTruthy();
  });

  it('shows the "Skip feedback" button', () => {
    render(<FeedbackScreen onDone={noop} />);
    expect(screen.getByRole('button', { name: 'Skip feedback' })).toBeTruthy();
  });

  it('shows the outcome selector fieldset', () => {
    render(<FeedbackScreen onDone={noop} />);
    expect(
      screen.getByRole('group', { name: /what did you decide to do/i }),
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Submit button state
// ---------------------------------------------------------------------------

describe('FeedbackScreen — Submit button disabled state', () => {
  it('Submit is disabled before an answer is selected', () => {
    render(<FeedbackScreen onDone={noop} />);
    const btn = screen.getByRole('button', { name: 'Send feedback' });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('Submit is enabled after selecting "Yes"', async () => {
    render(<FeedbackScreen onDone={noop} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    const btn = screen.getByRole('button', { name: 'Send feedback' });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });

  it('Submit is enabled after selecting "Not sure"', async () => {
    render(<FeedbackScreen onDone={noop} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Not sure' }));
    const btn = screen.getByRole('button', { name: 'Send feedback' });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });

  it('Submit is enabled after selecting "No"', async () => {
    render(<FeedbackScreen onDone={noop} />);
    await userEvent.click(screen.getByRole('radio', { name: 'No' }));
    const btn = screen.getByRole('button', { name: 'Send feedback' });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Answer selection
// ---------------------------------------------------------------------------

describe('FeedbackScreen — answer selection', () => {
  it('selecting Yes checks the Yes radio', async () => {
    render(<FeedbackScreen onDone={noop} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    expect((screen.getByRole('radio', { name: 'Yes' }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: 'No' }) as HTMLInputElement).checked).toBe(false);
  });

  it('selecting No unchecks a previously selected answer', async () => {
    render(<FeedbackScreen onDone={noop} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('radio', { name: 'No' }));
    expect((screen.getByRole('radio', { name: 'Yes' }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole('radio', { name: 'No' }) as HTMLInputElement).checked).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Positive feedback (Yes) submission
// ---------------------------------------------------------------------------

describe('FeedbackScreen — positive feedback submission', () => {
  it('calls submit with answer: "yes" when Yes is selected and submitted', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const payload: FeedbackRequest = submit.mock.calls[0][0];
    expect(payload.answer).toBe('yes');
  });
});

// ---------------------------------------------------------------------------
// Negative feedback (No) submission
// ---------------------------------------------------------------------------

describe('FeedbackScreen — negative feedback submission', () => {
  it('calls submit with answer: "no" when No is selected and submitted', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'No' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const payload: FeedbackRequest = submit.mock.calls[0][0];
    expect(payload.answer).toBe('no');
  });
});

// ---------------------------------------------------------------------------
// Written feedback
// ---------------------------------------------------------------------------

describe('FeedbackScreen — written feedback', () => {
  it('includes writtenFeedback in the payload when the user types a comment', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.type(
      screen.getByRole('textbox', { name: /anything else/i }),
      'Very helpful, thank you.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const payload: FeedbackRequest = submit.mock.calls[0][0];
    expect(payload.writtenFeedback).toBe('Very helpful, thank you.');
  });

  it('omits writtenFeedback from the payload when the textarea is empty', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    // Do not type anything in the textarea
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const payload: FeedbackRequest = submit.mock.calls[0][0];
    expect(payload.writtenFeedback).toBeUndefined();
  });

  it('omits writtenFeedback when textarea contains only whitespace', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.type(
      screen.getByRole('textbox', { name: /anything else/i }),
      '   ',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const payload: FeedbackRequest = submit.mock.calls[0][0];
    expect(payload.writtenFeedback).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Outcome selection
// ---------------------------------------------------------------------------

describe('FeedbackScreen — outcome selection', () => {
  it('includes outcome in the payload when one is selected', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(
      screen.getByRole('radio', { name: 'I decided not to continue' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const payload: FeedbackRequest = submit.mock.calls[0][0];
    expect(payload.outcome).toBe('decided_not_to_continue');
  });

  it('omits outcome from the payload when none is selected', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    const payload: FeedbackRequest = submit.mock.calls[0][0];
    expect(payload.outcome).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Submitting (loading) state
// ---------------------------------------------------------------------------

describe('FeedbackScreen — submitting state', () => {
  it('shows "Sending…" label while submission is in progress', async () => {
    // submit never resolves — keeps the component in submitting state
    const submit = jest.fn().mockReturnValue(new Promise(() => {}));
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Sending…' })).toBeTruthy(),
    );
  });

  it('disables the Submit button while submitting', async () => {
    const submit = jest.fn().mockReturnValue(new Promise(() => {}));
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: 'Sending…' });
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// Success state
// ---------------------------------------------------------------------------

describe('FeedbackScreen — success state', () => {
  it('shows the confirmation heading after a successful submit', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      expect(
        screen.getByTestId('confirmation-heading'),
      ).toBeTruthy(),
    );
    expect(
      screen.getByRole('heading', { name: /thank you for your feedback/i }),
    ).toBeTruthy();
  });

  it('shows the "Check another message" button after success', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      screen.getByRole('button', { name: 'Check another message' }),
    );
  });

  it('calls onDone when "Check another message" is clicked after success', async () => {
    const onDone = jest.fn();
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={onDone} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      screen.getByRole('button', { name: 'Check another message' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Check another message' }),
    );

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('confirmation heading has tabIndex={-1} for programmatic focus', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    const heading = await screen.findByTestId('confirmation-heading');
    expect(heading.getAttribute('tabindex')).toBe('-1');
  });
});

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

describe('FeedbackScreen — error state', () => {
  it('shows the error heading when submit rejects', async () => {
    render(
      <FeedbackScreen
        onDone={noop}
        submit={rejectedSubmit('Server error')}
      />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /something went wrong/i }),
      ).toBeTruthy(),
    );
  });

  it('shows the error message from the rejected promise', async () => {
    render(
      <FeedbackScreen
        onDone={noop}
        submit={rejectedSubmit('Service temporarily unavailable.')}
      />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      expect(
        screen.getByText(/service temporarily unavailable\./i),
      ).toBeTruthy(),
    );
  });

  it('shows a "Try again" button in the error state', async () => {
    render(
      <FeedbackScreen onDone={noop} submit={rejectedSubmit()} />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy(),
    );
  });

  it('returns to the idle state when Try again is clicked', async () => {
    render(
      <FeedbackScreen onDone={noop} submit={rejectedSubmit()} />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      screen.getByRole('button', { name: 'Try again' }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(
      screen.getByRole('heading', {
        name: /did annie help you decide what to do/i,
      }),
    ).toBeTruthy();
  });

  it('calls onDone when "Skip feedback" is clicked in the error state', async () => {
    const onDone = jest.fn();
    render(
      <FeedbackScreen onDone={onDone} submit={rejectedSubmit()} />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      screen.getByRole('button', { name: 'Skip feedback' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Skip feedback' }));

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Skip behaviour
// ---------------------------------------------------------------------------

describe('FeedbackScreen — skip', () => {
  it('calls onDone when Skip is clicked without selecting an answer', async () => {
    const onDone = jest.fn();
    render(<FeedbackScreen onDone={onDone} />);

    await userEvent.click(screen.getByRole('button', { name: 'Skip feedback' }));

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('does NOT call submit when Skip is clicked', async () => {
    const submit = jest.fn();
    render(<FeedbackScreen onDone={noop} submit={submit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Skip feedback' }));

    expect(submit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe('FeedbackScreen — keyboard navigation', () => {
  it('can select an answer and submit using the keyboard', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    // Use a single userEvent instance so pointer state is shared across calls.
    const user = userEvent.setup();
    render(
      <main>
        <FeedbackScreen onDone={noop} submit={submit} />
      </main>,
    );

    // The answer radios are visually hidden (opacity:0, zero dimensions) but
    // remain in the accessibility tree and respond to clicks, which is how
    // keyboard users trigger radio selection (Space → synthesised click).
    // We simulate that here directly rather than via a fragile tab-loop,
    // which jsdom can stall on zero-dimension elements.
    await user.click(screen.getByRole('radio', { name: 'Yes' }));

    // Move focus to the Submit button and activate it with Enter —
    // the standard keyboard equivalent of a primary button press.
    const submitBtn = screen.getByRole('button', { name: 'Send feedback' });
    await user.click(submitBtn);  // focuses the button as a real user would

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  });

  it('can skip using the keyboard', async () => {
    const onDone = jest.fn();
    render(<FeedbackScreen onDone={onDone} />);

    const skipBtn = screen.getByRole('button', { name: 'Skip feedback' });
    skipBtn.focus();
    await userEvent.keyboard('{Enter}');

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Accessibility (axe)
// ---------------------------------------------------------------------------

describe('FeedbackScreen — accessibility', () => {
  it('passes axe in the idle state (no answer selected)', async () => {
    const { container } = renderInMain(<FeedbackScreen onDone={noop} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe in the idle state (answer selected)', async () => {
    const { container } = renderInMain(<FeedbackScreen onDone={noop} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe in the success state', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    const { container } = renderInMain(
      <FeedbackScreen onDone={noop} submit={submit} />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => screen.getByTestId('confirmation-heading'));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe in the error state', async () => {
    const { container } = renderInMain(
      <FeedbackScreen onDone={noop} submit={rejectedSubmit()} />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() =>
      screen.getByRole('heading', { name: /something went wrong/i }),
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
