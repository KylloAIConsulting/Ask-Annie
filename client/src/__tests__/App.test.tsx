import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('shows the welcome screen slot by default', () => {
    render(<App />);
    expect(screen.getByTestId('screen-welcome')).toBeTruthy();
  });

  it('renders only one screen slot at a time', () => {
    render(<App />);
    expect(screen.queryByTestId('screen-submit')).toBeNull();
    expect(screen.queryByTestId('screen-analysing')).toBeNull();
    expect(screen.queryByTestId('screen-results')).toBeNull();
    expect(screen.queryByTestId('screen-feedback')).toBeNull();
  });

  it('navigates to the submit screen slot when the placeholder CTA is clicked', async () => {
    render(<App />);
    await userEvent.click(screen.getByText(/Check a message/i));
    expect(screen.getByTestId('screen-submit')).toBeTruthy();
    expect(screen.queryByTestId('screen-welcome')).toBeNull();
  });

  it('navigates back to the welcome screen from the submit screen', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Check a message/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByTestId('screen-welcome')).toBeTruthy();
  });
});
