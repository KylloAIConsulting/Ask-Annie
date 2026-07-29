import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import SubmitScreen, { type SubmitDraft } from '../screens/SubmitScreen/SubmitScreen';
import { ANALYSE_TEXT_MAX_LENGTH } from '@shared/requestSchemas';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultProps = {
  onNavigate: jest.fn(),
  onSubmit: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('SubmitScreen — rendering', () => {
  it('renders without crashing', () => {
    render(<SubmitScreen {...defaultProps} />);
  });

  it('shows the main heading', () => {
    render(<SubmitScreen {...defaultProps} />);
    expect(
      screen.getByRole('heading', {
        name: /what would you like annie to check/i,
      }),
    ).toBeTruthy();
  });

  it('renders in text mode by default', () => {
    render(<SubmitScreen {...defaultProps} />);
    const textRadio = screen.getByRole('radio', { name: 'Paste message' });
    expect((textRadio as HTMLInputElement).checked).toBe(true);
    expect(screen.getByRole('textbox', { name: 'Message to check' })).toBeTruthy();
  });

  it('does not show the file input in text mode', () => {
    render(<SubmitScreen {...defaultProps} />);
    expect(screen.queryByLabelText(/upload a screenshot/i)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Accessibility — axe
// ---------------------------------------------------------------------------

describe('SubmitScreen — accessibility', () => {
  it('passes axe in text mode', async () => {
    const { container } = render(
      <main>
        <SubmitScreen {...defaultProps} />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe in image mode', async () => {
    const { container } = render(
      <main>
        <SubmitScreen {...defaultProps} />
      </main>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Mode switching
// ---------------------------------------------------------------------------

describe('SubmitScreen — mode switching', () => {
  it('switches to image mode when "Upload screenshot" radio is selected', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    expect(
      (screen.getByRole('radio', { name: 'Upload screenshot' }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(screen.getByLabelText(/upload a screenshot/i)).toBeTruthy();
  });

  it('switches back to text mode from image mode', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Paste message' }));
    expect(
      (screen.getByRole('radio', { name: 'Paste message' }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(screen.getByRole('textbox', { name: 'Message to check' })).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Back navigation
// ---------------------------------------------------------------------------

describe('SubmitScreen — Back button', () => {
  it('calls onNavigate("welcome") when Back is clicked', async () => {
    const onNavigate = jest.fn();
    render(<SubmitScreen {...defaultProps} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith('welcome');
  });
});

// ---------------------------------------------------------------------------
// Primary button disabled state
// ---------------------------------------------------------------------------

describe('SubmitScreen — primary button disabled state', () => {
  it('is disabled when the text field is empty', () => {
    render(<SubmitScreen {...defaultProps} />);
    const btn = screen.getByRole('button', { name: 'Check with Annie' });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('is disabled when the text field contains only whitespace', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Message to check' }),
      '   ',
    );
    const btn = screen.getByRole('button', { name: 'Check with Annie' });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('is enabled when the text field has non-whitespace content', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Message to check' }),
      'Hello, is this a scam?',
    );
    const btn = screen.getByRole('button', { name: 'Check with Annie' });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });

  it('is disabled in image mode when no file is selected', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    const btn = screen.getByRole('button', { name: 'Check with Annie' });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('is enabled in image mode after a file is selected', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/upload a screenshot/i), file);
    const btn = screen.getByRole('button', { name: 'Check with Annie' });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// File selection
// ---------------------------------------------------------------------------

describe('SubmitScreen — file selection', () => {
  it('displays the selected filename after a file is chosen', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    const file = new File(['data'], 'my-screenshot.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/upload a screenshot/i), file);
    expect(screen.getByText(/my-screenshot\.png/i)).toBeTruthy();
  });

  it('does not show a filename before a file is selected', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    expect(screen.queryByTestId('selected-filename')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// onSubmit callback
// ---------------------------------------------------------------------------

describe('SubmitScreen — onSubmit callback', () => {
  it('calls onSubmit with a text draft containing mode, text, and context', async () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Message to check' }),
      'Is this email genuine?',
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: /anything else annie should know/i }),
      'I was not expecting it.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const draft = onSubmit.mock.calls[0][0] as SubmitDraft;
    expect(draft.mode).toBe('text');
    if (draft.mode === 'text') {
      expect(draft.text).toBe('Is this email genuine?');
      expect(draft.context).toBe('I was not expecting it.');
    }
  });

  it('calls onSubmit with an image draft containing mode, file, and context', async () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
    const file = new File(['data'], 'screenshot.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/upload a screenshot/i), file);
    await userEvent.type(
      screen.getByRole('textbox', { name: /anything else annie should know/i }),
      'Received this on WhatsApp.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const draft = onSubmit.mock.calls[0][0] as SubmitDraft;
    expect(draft.mode).toBe('image');
    if (draft.mode === 'image') {
      expect(draft.file).toBe(file);
      expect(draft.context).toBe('Received this on WhatsApp.');
    }
  });

  it('does not call onSubmit when the primary button is disabled', async () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);
    // Primary button is disabled (no text) — click should not fire
    await userEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Character counter
// ---------------------------------------------------------------------------

describe('SubmitScreen — character counter', () => {
  it('shows 0 / max when the textarea is empty', () => {
    render(<SubmitScreen {...defaultProps} />);
    expect(
      screen.getByText(new RegExp(`0.*${ANALYSE_TEXT_MAX_LENGTH.toLocaleString()}`)),
    ).toBeTruthy();
  });

  it('updates the counter as text is typed', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Message to check' }),
      'Hello',
    );
    expect(
      screen.getByText(new RegExp(`5.*${ANALYSE_TEXT_MAX_LENGTH.toLocaleString()}`)),
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Shared limit
// ---------------------------------------------------------------------------

describe('SubmitScreen — text length constraint', () => {
  it('textarea maxLength matches the shared ANALYSE_TEXT_MAX_LENGTH constant', () => {
    render(<SubmitScreen {...defaultProps} />);
    const textarea = screen.getByRole('textbox', {
      name: 'Message to check',
    }) as HTMLTextAreaElement;
    expect(textarea.maxLength).toBe(ANALYSE_TEXT_MAX_LENGTH);
  });
});

// ---------------------------------------------------------------------------
// No API calls
// ---------------------------------------------------------------------------

describe('SubmitScreen — no API calls', () => {
  let fetchMock: jest.Mock;
  const originalFetch = global.fetch;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('does not call fetch when the primary button is activated', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Message to check' }),
      'Check this message.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
