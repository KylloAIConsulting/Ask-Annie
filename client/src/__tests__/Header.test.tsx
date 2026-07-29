import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import Header from '../components/Header/Header';
import type { Screen } from '../state/appReducer';

/** Default props — welcome screen active. */
const defaultProps = {
  currentScreen: 'welcome' as Screen,
  onNavigate: jest.fn(),
  onHowItWorks: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Header', () => {
  describe('wordmark', () => {
    it('renders the wordmark "Annie"', () => {
      render(<Header {...defaultProps} />);
      expect(screen.getByText('Annie')).toBeTruthy();
    });
  });

  describe('navigation landmark', () => {
    it('renders a <nav> with aria-label "Main navigation"', () => {
      render(<Header {...defaultProps} />);
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy();
    });

    it('renders a "Home" button', () => {
      render(<Header {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Home' })).toBeTruthy();
    });

    it('renders a "How it works" button', () => {
      render(<Header {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'How it works' })).toBeTruthy();
    });

    it('contains exactly two navigation buttons', () => {
      render(<Header {...defaultProps} />);
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav.querySelectorAll('button')).toHaveLength(2);
    });

    it('does not contain any <a href="#"> placeholders', () => {
      const { container } = render(<Header {...defaultProps} />);
      const deadLinks = container.querySelectorAll('a[href="#"]');
      expect(deadLinks).toHaveLength(0);
    });
  });

  describe('aria-current', () => {
    it('sets aria-current="page" on Home when currentScreen is "welcome"', () => {
      render(<Header {...defaultProps} currentScreen="welcome" />);
      const home = screen.getByRole('button', { name: 'Home' });
      expect(home.getAttribute('aria-current')).toBe('page');
    });

    it('removes aria-current from Home when currentScreen is not "welcome"', () => {
      const screens: Screen[] = ['submit', 'analysing', 'results', 'feedback'];
      for (const screen_ of screens) {
        const { unmount } = render(
          <Header {...defaultProps} currentScreen={screen_} />
        );
        const home = screen.getByRole('button', { name: 'Home' });
        expect(home.getAttribute('aria-current')).toBeNull();
        unmount();
      }
    });

    it('never sets aria-current on "How it works"', () => {
      const screens: Screen[] = ['welcome', 'submit', 'analysing', 'results', 'feedback'];
      for (const screen_ of screens) {
        const { unmount } = render(
          <Header {...defaultProps} currentScreen={screen_} />
        );
        const howItWorks = screen.getByRole('button', { name: 'How it works' });
        expect(howItWorks.getAttribute('aria-current')).toBeNull();
        unmount();
      }
    });
  });

  describe('interactions', () => {
    it('calls onNavigate("welcome") when Home is clicked', async () => {
      const onNavigate = jest.fn();
      render(<Header {...defaultProps} onNavigate={onNavigate} />);
      await userEvent.click(screen.getByRole('button', { name: 'Home' }));
      expect(onNavigate).toHaveBeenCalledTimes(1);
      expect(onNavigate).toHaveBeenCalledWith('welcome');
    });

    it('calls onHowItWorks when "How it works" is clicked', async () => {
      const onHowItWorks = jest.fn();
      render(<Header {...defaultProps} onHowItWorks={onHowItWorks} />);
      await userEvent.click(screen.getByRole('button', { name: 'How it works' }));
      expect(onHowItWorks).toHaveBeenCalledTimes(1);
    });

    it('Home is keyboard-activatable via Enter', async () => {
      const onNavigate = jest.fn();
      render(<Header {...defaultProps} onNavigate={onNavigate} />);
      const home = screen.getByRole('button', { name: 'Home' });
      home.focus();
      await userEvent.keyboard('{Enter}');
      expect(onNavigate).toHaveBeenCalledWith('welcome');
    });

    it('"How it works" is keyboard-activatable via Enter', async () => {
      const onHowItWorks = jest.fn();
      render(<Header {...defaultProps} onHowItWorks={onHowItWorks} />);
      const howItWorks = screen.getByRole('button', { name: 'How it works' });
      howItWorks.focus();
      await userEvent.keyboard('{Enter}');
      expect(onHowItWorks).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('passes axe-core on the welcome screen', async () => {
      const { container } = render(<Header {...defaultProps} currentScreen="welcome" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe-core on a non-welcome screen', async () => {
      const { container } = render(<Header {...defaultProps} currentScreen="results" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
