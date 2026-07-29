import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen';
import App from '../App';
import type { Screen } from '../state/appReducer';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Renders WelcomeScreen as a controlled component, mirroring how App uses it.
 * panelOpen state is managed by this wrapper so toggle interactions work.
 */
const ControlledWelcomeScreen: React.FC<{
  onNavigate?: (s: Screen) => void;
  initialPanelOpen?: boolean;
}> = ({ onNavigate = jest.fn(), initialPanelOpen = false }) => {
  const [panelOpen, setPanelOpen] = useState(initialPanelOpen);
  return (
    <WelcomeScreen
      onNavigate={onNavigate}
      panelOpen={panelOpen}
      onTogglePanel={() => setPanelOpen((v) => !v)}
    />
  );
};

const defaultProps = {
  onNavigate: jest.fn(),
  panelOpen: false,
  onTogglePanel: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('WelcomeScreen — rendering', () => {
  it('renders without crashing', () => {
    render(<WelcomeScreen {...defaultProps} />);
  });

  it('shows the main heading', () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: /not sure if a message is genuine/i }),
    ).toBeTruthy();
  });

  it('shows the supporting text', () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(
      screen.getByText(/ask annie can help you spot warning signs/i),
    ).toBeTruthy();
  });

  it('shows the reassurance text', () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(screen.getByText(/you will not be judged/i)).toBeTruthy();
  });

  it('shows the privacy message', () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(
      screen.getByText(/only share the information needed for the check/i),
    ).toBeTruthy();
  });

  it('shows the "Check a message" primary button', () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: 'Check a message' }),
    ).toBeTruthy();
  });

  it('shows the "How Ask Annie works" secondary button', () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: 'How Ask Annie works' }),
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Accessibility — axe
// ---------------------------------------------------------------------------

describe('WelcomeScreen — accessibility', () => {
  it('passes axe when the explanation panel is closed', async () => {
    const { container } = render(
      <main>
        <WelcomeScreen {...defaultProps} panelOpen={false} />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe when the explanation panel is open', async () => {
    const { container } = render(
      <main>
        <WelcomeScreen {...defaultProps} panelOpen={true} />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Primary CTA
// ---------------------------------------------------------------------------

describe('WelcomeScreen — "Check a message" button', () => {
  it('calls onNavigate("submit") when clicked', async () => {
    const onNavigate = jest.fn();
    render(<WelcomeScreen {...defaultProps} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('button', { name: 'Check a message' }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith('submit');
  });
});

// ---------------------------------------------------------------------------
// Explanation panel
// ---------------------------------------------------------------------------

describe('WelcomeScreen — "How Ask Annie works" panel', () => {
  it('panel is not visible when panelOpen is false', () => {
    render(<WelcomeScreen {...defaultProps} panelOpen={false} />);
    const panel = document.getElementById('how-it-works-panel');
    expect(panel).not.toBeNull();
    // hidden attribute present — element is in DOM but not accessible
    expect(panel?.hasAttribute('hidden')).toBe(true);
  });

  it('panel is visible when panelOpen is true', () => {
    render(<WelcomeScreen {...defaultProps} panelOpen={true} />);
    const panel = document.getElementById('how-it-works-panel');
    expect(panel?.hasAttribute('hidden')).toBe(false);
  });

  it('clicking the toggle button calls onTogglePanel', async () => {
    const onTogglePanel = jest.fn();
    render(<WelcomeScreen {...defaultProps} onTogglePanel={onTogglePanel} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'How Ask Annie works' }),
    );
    expect(onTogglePanel).toHaveBeenCalledTimes(1);
  });

  it('clicking the toggle button twice calls onTogglePanel twice', async () => {
    const onTogglePanel = jest.fn();
    render(<WelcomeScreen {...defaultProps} onTogglePanel={onTogglePanel} />);
    const btn = screen.getByRole('button', { name: 'How Ask Annie works' });
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(onTogglePanel).toHaveBeenCalledTimes(2);
  });

  it('toggles open and closed correctly via ControlledWelcomeScreen', async () => {
    render(<ControlledWelcomeScreen />);
    const btn = screen.getByRole('button', { name: 'How Ask Annie works' });

    // Starts closed
    expect(btn.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');

    await userEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('sets aria-expanded="false" when panelOpen is false', () => {
    render(<WelcomeScreen {...defaultProps} panelOpen={false} />);
    const btn = screen.getByRole('button', { name: 'How Ask Annie works' });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('sets aria-expanded="true" when panelOpen is true', () => {
    render(<WelcomeScreen {...defaultProps} panelOpen={true} />);
    const btn = screen.getByRole('button', { name: 'How Ask Annie works' });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('aria-controls references the panel element id', () => {
    render(<WelcomeScreen {...defaultProps} />);
    const btn = screen.getByRole('button', { name: 'How Ask Annie works' });
    const panelId = btn.getAttribute('aria-controls');
    expect(panelId).not.toBeNull();
    expect(document.getElementById(panelId!)).not.toBeNull();
  });

  it('all three explanation steps are visible when the panel is open', () => {
    render(<WelcomeScreen {...defaultProps} panelOpen={true} />);
    expect(screen.getByText('Share the message')).toBeTruthy();
    expect(screen.getByText('Annie checks for warning signs')).toBeTruthy();
    expect(screen.getByText('Get clear advice on what to do next.')).toBeTruthy();
  });

  it('explanation steps are not accessible when panel is closed', () => {
    render(<WelcomeScreen {...defaultProps} panelOpen={false} />);
    // Steps exist in DOM but inside a hidden element
    const panel = document.getElementById('how-it-works-panel');
    expect(panel?.hasAttribute('hidden')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// App integration
// ---------------------------------------------------------------------------

describe('WelcomeScreen — App integration', () => {
  it('renders only one WelcomeScreen through App', () => {
    render(<App />);
    expect(
      screen.getAllByRole('heading', { name: /not sure if a message is genuine/i }),
    ).toHaveLength(1);
  });

  it('Header "How it works" opens the WelcomeScreen panel', async () => {
    render(<App />);
    // Panel is closed on load
    const toggleBtn = screen.getByRole('button', { name: 'How Ask Annie works' });
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');

    // Click the Header "How it works" button
    await userEvent.click(screen.getByRole('button', { name: 'How it works' }));

    // Panel should now be open and the first step visible
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Share the message')).toBeTruthy();
  });

  it('Header "How it works" from a non-welcome screen navigates and opens the panel', async () => {
    render(<App />);

    // Navigate away to submit screen
    await userEvent.click(screen.getByRole('button', { name: 'Check a message' }));
    expect(screen.getByTestId('screen-submit')).toBeTruthy();

    // Click Header "How it works"
    await userEvent.click(screen.getByRole('button', { name: 'How it works' }));

    // Should be back on welcome with panel open
    expect(screen.getByTestId('screen-welcome')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'How Ask Annie works' }).getAttribute('aria-expanded'),
    ).toBe('true');
  });
});
