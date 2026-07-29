import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import SubmitScreen, {
  type SubmitDraft,
  type TextDraft,
} from '../screens/SubmitScreen/SubmitScreen';
import { ANALYSE_TEXT_MAX_LENGTH } from '@shared/requestSchemas';
import { UPLOAD_MAX_FILE_SIZE } from '@shared/uploadConfig';

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

/** Switch to image mode. */
async function switchToImageMode(): Promise<void> {
  await userEvent.click(screen.getByRole('radio', { name: 'Upload screenshot' }));
}

/** Upload a valid PNG file and return it. */
async function uploadValidFile(name = 'screenshot.png'): Promise<File> {
  const file = new File(['image data'], name, { type: 'image/png' });
  await userEvent.upload(screen.getByLabelText(/upload a screenshot/i), file);
  return file;
}

/**
 * Upload an invalid file, bypassing the browser `accept` attribute filter
 * that userEvent applies by default (so the change event reaches the handler
 * and our JS validation code is exercised).
 */
async function uploadInvalidFile(file: File): Promise<void> {
  const u = userEvent.setup({ applyAccept: false });
  await u.upload(screen.getByLabelText(/upload a screenshot/i), file);
}

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
    await switchToImageMode();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with a file validation error visible', async () => {
    const { container } = render(
      <main>
        <SubmitScreen {...defaultProps} />
      </main>,
    );
    await switchToImageMode();
    await uploadInvalidFile(new File(['data'], 'photo.gif', { type: 'image/gif' }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with a valid selected image visible', async () => {
    const { container } = render(
      <main>
        <SubmitScreen {...defaultProps} />
      </main>,
    );
    await switchToImageMode();
    await uploadValidFile();
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
    await switchToImageMode();
    expect(
      (screen.getByRole('radio', { name: 'Upload screenshot' }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(screen.getByLabelText(/upload a screenshot/i)).toBeTruthy();
  });

  it('switches back to text mode from image mode', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await userEvent.click(screen.getByRole('radio', { name: 'Paste message' }));
    expect(
      (screen.getByRole('radio', { name: 'Paste message' }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(screen.getByRole('textbox', { name: 'Message to check' })).toBeTruthy();
  });

  it('does not leave hidden focusable controls in the DOM after mode switching', async () => {
    render(<SubmitScreen {...defaultProps} />);
    // Text mode: no file input present
    expect(screen.queryByLabelText(/upload a screenshot/i)).toBeNull();

    // Switch to image mode: textarea removed
    await switchToImageMode();
    expect(screen.queryByRole('textbox', { name: 'Message to check' })).toBeNull();

    // Switch back to text mode: file input removed
    await userEvent.click(screen.getByRole('radio', { name: 'Paste message' }));
    expect(screen.queryByLabelText(/upload a screenshot/i)).toBeNull();
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
    await switchToImageMode();
    const btn = screen.getByRole('button', { name: 'Check with Annie' });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('is enabled in image mode after a valid file is selected', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadValidFile();
    const btn = screen.getByRole('button', { name: 'Check with Annie' });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// File validation — MIME type
// ---------------------------------------------------------------------------

describe('SubmitScreen — file validation (MIME type)', () => {
  it('rejects a file with an unsupported MIME type', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadInvalidFile(new File(['data'], 'photo.gif', { type: 'image/gif' }));
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('shows the exact unsupported-type error message', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadInvalidFile(new File(['data'], 'photo.gif', { type: 'image/gif' }));
    expect(screen.getByRole('alert').textContent).toBe(
      'This image type is not supported. Please choose a JPG, PNG or WebP image.',
    );
  });

  it('does not display the invalid filename after a rejected file', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadInvalidFile(new File(['data'], 'photo.gif', { type: 'image/gif' }));
    expect(screen.queryByTestId('selected-filename')).toBeNull();
  });

  it('does not pass an invalid-type file to onSubmit', async () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);
    await switchToImageMode();
    await uploadInvalidFile(new File(['data'], 'photo.gif', { type: 'image/gif' }));
    // Primary button is still disabled — fireEvent bypasses disabled to test guard
    fireEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('links the file error to the native input via aria-describedby', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadInvalidFile(new File(['data'], 'photo.gif', { type: 'image/gif' }));
    const input = screen.getByLabelText(/upload a screenshot/i) as HTMLInputElement;
    const errorId = input.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    const errorEl = document.getElementById(errorId!);
    expect(errorEl).not.toBeNull();
    expect(errorEl!.textContent).toContain('not supported');
  });
});

// ---------------------------------------------------------------------------
// File validation — size
// ---------------------------------------------------------------------------

describe('SubmitScreen — file validation (size)', () => {
  it('rejects a file exceeding the maximum upload size', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    // PNG file whose byte length exceeds UPLOAD_MAX_FILE_SIZE.
    // It passes MIME validation but fails size validation.
    const oversizedContent = new Uint8Array(UPLOAD_MAX_FILE_SIZE + 1);
    await uploadInvalidFile(new File([oversizedContent], 'big.png', { type: 'image/png' }));
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('shows the exact oversized-file error message', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    const oversizedContent = new Uint8Array(UPLOAD_MAX_FILE_SIZE + 1);
    await uploadInvalidFile(new File([oversizedContent], 'big.png', { type: 'image/png' }));
    expect(screen.getByRole('alert').textContent).toBe(
      'This image is too large. Please choose a smaller image.',
    );
  });

  it('does not display the oversized filename', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    const oversizedContent = new Uint8Array(UPLOAD_MAX_FILE_SIZE + 1);
    await uploadInvalidFile(new File([oversizedContent], 'big.png', { type: 'image/png' }));
    expect(screen.queryByTestId('selected-filename')).toBeNull();
  });

  it('does not pass an oversized file to onSubmit', async () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);
    await switchToImageMode();
    const oversizedContent = new Uint8Array(UPLOAD_MAX_FILE_SIZE + 1);
    await uploadInvalidFile(new File([oversizedContent], 'big.png', { type: 'image/png' }));
    fireEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// File validation — recovery
// ---------------------------------------------------------------------------

describe('SubmitScreen — file validation recovery', () => {
  it('clears the file error when a valid file is subsequently selected', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    // First: invalid file — applyAccept:false so it reaches the JS handler
    await uploadInvalidFile(new File(['data'], 'photo.gif', { type: 'image/gif' }));
    expect(screen.getByRole('alert')).toBeTruthy();
    // Then: valid file clears the error
    const goodFile = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/upload a screenshot/i), goodFile);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// File selection display
// ---------------------------------------------------------------------------

describe('SubmitScreen — file selection display', () => {
  it('displays the selected filename after a valid file is chosen', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadValidFile('my-screenshot.png');
    expect(screen.getByText(/my-screenshot\.png/i)).toBeTruthy();
  });

  it('does not show a filename before a file is selected', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    expect(screen.queryByTestId('selected-filename')).toBeNull();
  });

  it('displays a human-readable file size after a valid file is selected', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    // 'image data' is 10 bytes — will display as "10 B"
    const file = new File(['image data'], 'screenshot.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/upload a screenshot/i), file);
    // The size display is inside the selected-file-info block
    const infoBlock = screen.getByTestId('selected-file-info');
    expect(infoBlock.textContent).toMatch(/\d+(\.\d+)?\s*(B|KB|MB)/);
  });
});

// ---------------------------------------------------------------------------
// Remove image
// ---------------------------------------------------------------------------

describe('SubmitScreen — Remove image', () => {
  it('clears the selected file when Remove image is clicked', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadValidFile('shot.png');
    expect(screen.getByTestId('selected-filename')).toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', { name: /remove selected image: shot\.png/i }),
    );
    expect(screen.queryByTestId('selected-filename')).toBeNull();
  });

  it('disables the primary button again after Remove image', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadValidFile('shot.png');
    expect(
      (screen.getByRole('button', { name: 'Check with Annie' }) as HTMLButtonElement).disabled,
    ).toBe(false);
    await userEvent.click(
      screen.getByRole('button', { name: /remove selected image: shot\.png/i }),
    );
    expect(
      (screen.getByRole('button', { name: 'Check with Annie' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('has an accessible name that includes the filename', async () => {
    render(<SubmitScreen {...defaultProps} />);
    await switchToImageMode();
    await uploadValidFile('evidence.png');
    const btn = screen.getByRole('button', { name: /remove selected image: evidence\.png/i });
    expect(btn).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Defensive submit guard
// ---------------------------------------------------------------------------

describe('SubmitScreen — defensive submit guard', () => {
  it('does not invoke onSubmit for a blank text draft (programmatic click)', () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);
    // Text mode with no input — button is disabled; fireEvent bypasses that
    fireEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not invoke onSubmit for a whitespace-only text draft (programmatic click)', async () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Message to check' }),
      '   ',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not invoke onSubmit when no file is selected in image mode (programmatic click)', async () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);
    await switchToImageMode();
    fireEvent.click(screen.getByRole('button', { name: 'Check with Annie' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// onSubmit callback — exact shapes
// ---------------------------------------------------------------------------

describe('SubmitScreen — onSubmit callback', () => {
  it('calls onSubmit with the exact text draft shape', async () => {
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
    expect(draft).toEqual<TextDraft>({
      mode: 'text',
      text: 'Is this email genuine?',
      context: 'I was not expecting it.',
    });
  });

  it('calls onSubmit with the exact image draft shape', async () => {
    const onSubmit = jest.fn();
    render(<SubmitScreen {...defaultProps} onSubmit={onSubmit} />);

    await switchToImageMode();
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
